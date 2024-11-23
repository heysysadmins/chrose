class RewordifyWASMModule {
    constructor() {
        this.mConfig = {
            appDir: "",
            wasmUrl: "",
        };
        this.m_initialized = false;
        this.m_initInProgress = false;
        this.m_initCallback = undefined;
        this.mPendingReceiveWasmInfo = null;
        this.mPendingReceiveWasmInstance = null;
    }
    locateFile(name) {
        console.log("Locatefile called: ", name);
        if (name === "sr-rewordify.wasm" && this.mConfig.wasmUrl.length > 0) {
            return this.mConfig.wasmUrl;
        }
        return `${this.mConfig.appDir}/${name}`;
    }
    setStatus(text) {}
    monitorRunDependencies(left) {}
    instantiateWasm(info, receiveInstance) {
        this.mPendingReceiveWasmInfo = info;
        this.mPendingReceiveWasmInstance = receiveInstance;
        this.instantiateWasmAsync();
    }
    onRuntimeInitialized() {
        // Module.initialize();
        this.m_initialized = true;
        this.m_initInProgress = false;
        try {
            if (this.m_initCallback) {
                this.m_initCallback(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.m_initCallback = undefined;
        }
    }
    async loadAndInitializeAsync(config) {
        return new Promise((resolve, reject) => {
            if (this.m_initialized || this.m_initInProgress) {
                return reject(new Error("Loading in progress!"));
            }
            this.mConfig = config;
            this.m_initInProgress = true;
            this.m_initCallback = resolve;
            this.instantiateWasmAsync();
        });
    }
    getMemoryUsage() {
        return Module.HEAP8.byteLength;
    }
    instantiateWasmAsync() {
        if (
            !this.mPendingReceiveWasmInstance ||
            !this.mPendingReceiveWasmInfo
        ) {
            return;
        }
        if (this.mConfig.wasmUrl.length === 0) {
            return;
        }
        return fetch(this.mConfig.wasmUrl, {
            credentials: "same-origin",
        }).then((response) => {
            const result = WebAssembly.instantiateStreaming(
                response,
                this.mPendingReceiveWasmInfo,
            );
            return result.then(
                (result) => {
                    this.mPendingReceiveWasmInstance(result["instance"]);
                },
                (reason) => {
                    //@ts-ignore
                    return instantiateArrayBuffer(
                        this.mPendingReceiveWasmInstance,
                    );
                },
            );
        });
    }
}
var Module = new RewordifyWASMModule();

//for now we concatenate this during postbuild
//ideally we should uncomment these imports and let rollup do the rest for us, but
//I've tried with no luck to avoid variable renaming (like FS to FS$1 , Module to Module$1...) with various rollup options like output.interop
// import "../downloads/0.3.2/sr-rewordify.js";
// import "../../../node_modules/@donjohnston/core-lib-web-extensions/dist/filesystem/djiVFS.js";
// import "../../../node_modules/@donjohnston/core-lib-web-extensions/dist/filesystem/djiSyncFSDriver.js";
class RewordifyWASMWrapper {
    static async load(options) {
        const initialized = await Module.loadAndInitializeAsync({
            appDir: options.appDir,
            wasmUrl: options.wasmUrl,
        });
        return initialized;
    }
    static async initialize(language = "eng", resourcesContainer) {
        try {
            if (
                RewordifyWASMWrapper.mModule &&
                RewordifyWASMWrapper.mLanguage === language
            ) {
                console.warn("Already initialized");
                return true;
            }
            //@ts-ignore
            FS.extensions.mapVfsContainer("/resources", resourcesContainer);
            RewordifyWASMWrapper.mModule = new Module.RewordifyModule();
            return RewordifyWASMWrapper.mModule.initialize(
                "/resources/",
                language,
            );
        } catch (e) {
            console.error(e);
            RewordifyWASMWrapper.mModule = null;
            RewordifyWASMWrapper.mLanguage = "";
            return false;
        }
    }
    static rewordify(text, level) {
        let result = null;
        try {
            if (!RewordifyWASMWrapper.mModule) {
                return result;
            }
            const rwdfParams = new Module.RewordifyParam(text, level);
            RewordifyWASMWrapper.mModule.rewordify(rwdfParams);
            result = rwdfParams.result();
            if (result) {
                result = JSON.parse(result);
            }
        } catch (e) {
            result = null;
            console.error(e);
        }
        return result;
    }
    static getMemoryUsage() {
        return Module.getMemoryUsage();
    }
}
RewordifyWASMWrapper.mModule = null;
RewordifyWASMWrapper.mLanguage = "";

(function () {
    self.addEventListener("message", function (e) {
        const data = e.data;
        const options = data.options || {};
        const message = data.message;
        const params = data.params;
        const callbackMessage = options.callbackMessage;
        if (message === "com.dji.worker.load") {
            onLoad(params, callbackMessage);
        } else if (message === "com.dji.worker.initialize") {
            onInitialize(params, callbackMessage);
        } else if (message === "com.dji.worker.rewordify") {
            onRewordify(params, callbackMessage);
        }
    });
    async function onLoad(params, callbackMessage) {
        let initialized = false;
        try {
            const options = {
                url: "",
                wasmUrl: "",
                appDir: "",
            };
            Object.assign(options, params);
            initialized = await RewordifyWASMWrapper.load(options);
        } catch (e) {
            console.error(e);
        }
        self.postMessage({
            message: callbackMessage,
            params: {
                initialized: initialized,
                error: initialized ? null : "Worker could not be initialized!",
            },
        });
    }
    //-------------------------------------------------------------------------
    //
    async function onInitialize(params, callbackMessage) {
        let initialized = false;
        if (!params.language) {
            return self.postMessage({
                message: callbackMessage,
                params: {
                    initialized: initialized,
                    error: "Missing locale parameter!",
                },
            });
        }
        if (!params.resourceDirectory) {
            return self.postMessage({
                message: callbackMessage,
                params: {
                    initialized: initialized,
                    error: "Missing resource directory parameter!",
                },
            });
        }
        if (!params.resourceContainer) {
            return self.postMessage({
                message: callbackMessage,
                params: {
                    initialized: initialized,
                    error: "Missing resource container parameter!",
                },
            });
        }
        try {
            initialized = await RewordifyWASMWrapper.initialize(
                params.language,
                params.resourceContainer,
            );
        } catch (e) {
            console.error(e);
        }
        self.postMessage({
            message: callbackMessage,
            params: {
                initialized: initialized,
                error: initialized ? null : "Worker could not be initialized!",
            },
        });
    }
    //-------------------------------------------------------------------------
    //
    function onRewordify(params, callbackMessage) {
        let result = null;
        try {
            result = RewordifyWASMWrapper.rewordify(params.text, params.level);
        } catch (e) {
            result = null;
            console.error(e);
        }
        self.postMessage({
            message: callbackMessage,
            params: result,
            stats: {memory: RewordifyWASMWrapper.getMemoryUsage()},
        });
    }
    //-------------------------------------------------------------------------
    //
    self.postMessage({
        message: "com.dji.worker.ready",
        params: {
            error: null,
        },
    });
})();
var Module = typeof Module !== "undefined" ? Module : {};
var moduleOverrides = {};
var key;
for (key in Module) {
    if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key];
    }
}
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = function (status, toThrow) {
    throw toThrow;
};
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
ENVIRONMENT_IS_WEB = typeof window === "object";
ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
ENVIRONMENT_IS_NODE =
    typeof process === "object" &&
    typeof process.versions === "object" &&
    typeof process.versions.node === "string";
ENVIRONMENT_IS_SHELL =
    !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (Module["ENVIRONMENT"]) {
    throw new Error(
        "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)",
    );
}
var scriptDirectory = "";
function locateFile(path) {
    if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
    }
    return scriptDirectory + path;
}
var read_, readAsync, readBinary, setWindowTitle;
var nodeFS;
var nodePath;
if (ENVIRONMENT_IS_NODE) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = require("path").dirname(scriptDirectory) + "/";
    } else {
        scriptDirectory = __dirname + "/";
    }
    read_ = function shell_read(filename, binary) {
        if (!nodeFS) nodeFS = require("fs");
        if (!nodePath) nodePath = require("path");
        filename = nodePath["normalize"](filename);
        return nodeFS["readFileSync"](filename, binary ? null : "utf8");
    };
    readBinary = function readBinary(filename) {
        var ret = read_(filename, true);
        if (!ret.buffer) {
            ret = new Uint8Array(ret);
        }
        assert(ret.buffer);
        return ret;
    };
    if (process["argv"].length > 1) {
        thisProgram = process["argv"][1].replace(/\\/g, "/");
    }
    arguments_ = process["argv"].slice(2);
    if (typeof module !== "undefined") {
        module["exports"] = Module;
    }
    process["on"]("uncaughtException", function (ex) {
        if (!(ex instanceof ExitStatus)) {
            throw ex;
        }
    });
    process["on"]("unhandledRejection", abort);
    quit_ = function (status) {
        process["exit"](status);
    };
    Module["inspect"] = function () {
        return "[Emscripten Module object]";
    };
} else if (ENVIRONMENT_IS_SHELL) {
    if (typeof read != "undefined") {
        read_ = function shell_read(f) {
            return read(f);
        };
    }
    readBinary = function readBinary(f) {
        var data;
        if (typeof readbuffer === "function") {
            return new Uint8Array(readbuffer(f));
        }
        data = read(f, "binary");
        assert(typeof data === "object");
        return data;
    };
    if (typeof scriptArgs != "undefined") {
        arguments_ = scriptArgs;
    } else if (typeof arguments != "undefined") {
        arguments_ = arguments;
    }
    if (typeof quit === "function") {
        quit_ = function (status) {
            quit(status);
        };
    }
    if (typeof print !== "undefined") {
        if (typeof console === "undefined") console = {};
        console.log = print;
        console.warn = console.error =
            typeof printErr !== "undefined" ? printErr : print;
    }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
    } else if (typeof document !== "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src;
    }
    if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(
            0,
            scriptDirectory.lastIndexOf("/") + 1,
        );
    } else {
        scriptDirectory = "";
    }
    {
        read_ = function (url) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText;
        };
        if (ENVIRONMENT_IS_WORKER) {
            readBinary = function (url) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(xhr.response);
            };
        }
        readAsync = function (url, onload, onerror) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = function () {
                if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
                    onload(xhr.response);
                    return;
                }
                onerror();
            };
            xhr.onerror = onerror;
            xhr.send(null);
        };
    }
    setWindowTitle = function (title) {
        document.title = title;
    };
} else {
    throw new Error("environment detection error");
}
var out = Module["print"] || console.log.bind(console);
var err = Module["printErr"] || console.warn.bind(console);
for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key];
    }
}
moduleOverrides = null;
if (Module["arguments"]) arguments_ = Module["arguments"];
if (!Object.getOwnPropertyDescriptor(Module, "arguments")) {
    Object.defineProperty(Module, "arguments", {
        configurable: true,
        get: function () {
            abort(
                "Module.arguments has been replaced with plain arguments_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)",
            );
        },
    });
}
if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
if (!Object.getOwnPropertyDescriptor(Module, "thisProgram")) {
    Object.defineProperty(Module, "thisProgram", {
        configurable: true,
        get: function () {
            abort(
                "Module.thisProgram has been replaced with plain thisProgram (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)",
            );
        },
    });
}
if (Module["quit"]) quit_ = Module["quit"];
if (!Object.getOwnPropertyDescriptor(Module, "quit")) {
    Object.defineProperty(Module, "quit", {
        configurable: true,
        get: function () {
            abort(
                "Module.quit has been replaced with plain quit_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)",
            );
        },
    });
}
assert(
    typeof Module["memoryInitializerPrefixURL"] === "undefined",
    "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead",
);
assert(
    typeof Module["pthreadMainPrefixURL"] === "undefined",
    "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead",
);
assert(
    typeof Module["cdInitializerPrefixURL"] === "undefined",
    "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead",
);
assert(
    typeof Module["filePackagePrefixURL"] === "undefined",
    "Module.filePackagePrefixURL option was removed, use Module.locateFile instead",
);
assert(
    typeof Module["read"] === "undefined",
    "Module.read option was removed (modify read_ in JS)",
);
assert(
    typeof Module["readAsync"] === "undefined",
    "Module.readAsync option was removed (modify readAsync in JS)",
);
assert(
    typeof Module["readBinary"] === "undefined",
    "Module.readBinary option was removed (modify readBinary in JS)",
);
assert(
    typeof Module["setWindowTitle"] === "undefined",
    "Module.setWindowTitle option was removed (modify setWindowTitle in JS)",
);
assert(
    typeof Module["TOTAL_MEMORY"] === "undefined",
    "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY",
);
if (!Object.getOwnPropertyDescriptor(Module, "read")) {
    Object.defineProperty(Module, "read", {
        configurable: true,
        get: function () {
            abort(
                "Module.read has been replaced with plain read_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)",
            );
        },
    });
}
if (!Object.getOwnPropertyDescriptor(Module, "readAsync")) {
    Object.defineProperty(Module, "readAsync", {
        configurable: true,
        get: function () {
            abort(
                "Module.readAsync has been replaced with plain readAsync (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)",
            );
        },
    });
}
if (!Object.getOwnPropertyDescriptor(Module, "readBinary")) {
    Object.defineProperty(Module, "readBinary", {
        configurable: true,
        get: function () {
            abort(
                "Module.readBinary has been replaced with plain readBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)",
            );
        },
    });
}
if (!Object.getOwnPropertyDescriptor(Module, "setWindowTitle")) {
    Object.defineProperty(Module, "setWindowTitle", {
        configurable: true,
        get: function () {
            abort(
                "Module.setWindowTitle has been replaced with plain setWindowTitle (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)",
            );
        },
    });
}
var STACK_ALIGN = 16;
function alignMemory(size, factor) {
    if (!factor) factor = STACK_ALIGN;
    return Math.ceil(size / factor) * factor;
}
function warnOnce(text) {
    if (!warnOnce.shown) warnOnce.shown = {};
    if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        err(text);
    }
}
function convertJsFunctionToWasm(func, sig) {
    if (typeof WebAssembly.Function === "function") {
        var typeNames = {i: "i32", j: "i64", f: "f32", d: "f64"};
        var type = {
            parameters: [],
            results: sig[0] == "v" ? [] : [typeNames[sig[0]]],
        };
        for (var i = 1; i < sig.length; ++i) {
            type.parameters.push(typeNames[sig[i]]);
        }
        return new WebAssembly.Function(type, func);
    }
    var typeSection = [1, 0, 1, 96];
    var sigRet = sig.slice(0, 1);
    var sigParam = sig.slice(1);
    var typeCodes = {i: 127, j: 126, f: 125, d: 124};
    typeSection.push(sigParam.length);
    for (var i = 0; i < sigParam.length; ++i) {
        typeSection.push(typeCodes[sigParam[i]]);
    }
    if (sigRet == "v") {
        typeSection.push(0);
    } else {
        typeSection = typeSection.concat([1, typeCodes[sigRet]]);
    }
    typeSection[1] = typeSection.length - 2;
    var bytes = new Uint8Array(
        [0, 97, 115, 109, 1, 0, 0, 0].concat(
            typeSection,
            [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0],
        ),
    );
    var module = new WebAssembly.Module(bytes);
    var instance = new WebAssembly.Instance(module, {e: {f: func}});
    var wrappedFunc = instance.exports["f"];
    return wrappedFunc;
}
var freeTableIndexes = [];
var functionsInTableMap;
function getEmptyTableSlot() {
    if (freeTableIndexes.length) {
        return freeTableIndexes.pop();
    }
    try {
        wasmTable.grow(1);
    } catch (err) {
        if (!(err instanceof RangeError)) {
            throw err;
        }
        throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
    }
    return wasmTable.length - 1;
}
function addFunctionWasm(func, sig) {
    if (!functionsInTableMap) {
        functionsInTableMap = new WeakMap();
        for (var i = 0; i < wasmTable.length; i++) {
            var item = wasmTable.get(i);
            if (item) {
                functionsInTableMap.set(item, i);
            }
        }
    }
    if (functionsInTableMap.has(func)) {
        return functionsInTableMap.get(func);
    }
    var ret = getEmptyTableSlot();
    try {
        wasmTable.set(ret, func);
    } catch (err) {
        if (!(err instanceof TypeError)) {
            throw err;
        }
        assert(
            typeof sig !== "undefined",
            "Missing signature argument to addFunction: " + func,
        );
        var wrapped = convertJsFunctionToWasm(func, sig);
        wasmTable.set(ret, wrapped);
    }
    functionsInTableMap.set(func, ret);
    return ret;
}
var tempRet0 = 0;
var setTempRet0 = function (value) {
    tempRet0 = value;
};
var wasmBinary;
if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
if (!Object.getOwnPropertyDescriptor(Module, "wasmBinary")) {
    Object.defineProperty(Module, "wasmBinary", {
        configurable: true,
        get: function () {
            abort(
                "Module.wasmBinary has been replaced with plain wasmBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)",
            );
        },
    });
}
var noExitRuntime = Module["noExitRuntime"] || true;
if (!Object.getOwnPropertyDescriptor(Module, "noExitRuntime")) {
    Object.defineProperty(Module, "noExitRuntime", {
        configurable: true,
        get: function () {
            abort(
                "Module.noExitRuntime has been replaced with plain noExitRuntime (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)",
            );
        },
    });
}
if (typeof WebAssembly !== "object") {
    abort("no native wasm support detected");
}
var wasmMemory;
var ABORT = false;
var EXITSTATUS;
function assert(condition, text) {
    if (!condition) {
        abort("Assertion failed: " + text);
    }
}
function getCFunc(ident) {
    var func = Module["_" + ident];
    assert(
        func,
        "Cannot call unknown function " + ident + ", make sure it is exported",
    );
    return func;
}
function ccall(ident, returnType, argTypes, args, opts) {
    var toC = {
        string: function (str) {
            var ret = 0;
            if (str !== null && str !== undefined && str !== 0) {
                var len = (str.length << 2) + 1;
                ret = stackAlloc(len);
                stringToUTF8(str, ret, len);
            }
            return ret;
        },
        array: function (arr) {
            var ret = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret);
            return ret;
        },
    };
    function convertReturnValue(ret) {
        if (returnType === "string") return UTF8ToString(ret);
        if (returnType === "boolean") return Boolean(ret);
        return ret;
    }
    var func = getCFunc(ident);
    var cArgs = [];
    var stack = 0;
    assert(returnType !== "array", 'Return type should not be "array".');
    if (args) {
        for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]];
            if (converter) {
                if (stack === 0) stack = stackSave();
                cArgs[i] = converter(args[i]);
            } else {
                cArgs[i] = args[i];
            }
        }
    }
    var ret = func.apply(null, cArgs);
    ret = convertReturnValue(ret);
    if (stack !== 0) stackRestore(stack);
    return ret;
}
var ALLOC_STACK = 1;
var UTF8Decoder =
    typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(heap, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
    if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(heap.subarray(idx, endPtr));
    } else {
        var str = "";
        while (idx < endPtr) {
            var u0 = heap[idx++];
            if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue;
            }
            var u1 = heap[idx++] & 63;
            if ((u0 & 224) == 192) {
                str += String.fromCharCode(((u0 & 31) << 6) | u1);
                continue;
            }
            var u2 = heap[idx++] & 63;
            if ((u0 & 240) == 224) {
                u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
            } else {
                if ((u0 & 248) != 240)
                    warnOnce(
                        "Invalid UTF-8 leading byte 0x" +
                            u0.toString(16) +
                            " encountered when deserializing a UTF-8 string in wasm memory to a JS string!",
                    );
                u0 =
                    ((u0 & 7) << 18) |
                    (u1 << 12) |
                    (u2 << 6) |
                    (heap[idx++] & 63);
            }
            if (u0 < 65536) {
                str += String.fromCharCode(u0);
            } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(
                    55296 | (ch >> 10),
                    56320 | (ch & 1023),
                );
            }
        }
    }
    return str;
}
function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
}
function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++] = u;
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++] = 192 | (u >> 6);
            heap[outIdx++] = 128 | (u & 63);
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++] = 224 | (u >> 12);
            heap[outIdx++] = 128 | ((u >> 6) & 63);
            heap[outIdx++] = 128 | (u & 63);
        } else {
            if (outIdx + 3 >= endIdx) break;
            if (u >= 2097152)
                warnOnce(
                    "Invalid Unicode code point 0x" +
                        u.toString(16) +
                        " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x1FFFFF).",
                );
            heap[outIdx++] = 240 | (u >> 18);
            heap[outIdx++] = 128 | ((u >> 12) & 63);
            heap[outIdx++] = 128 | ((u >> 6) & 63);
            heap[outIdx++] = 128 | (u & 63);
        }
    }
    heap[outIdx] = 0;
    return outIdx - startIdx;
}
function stringToUTF8(str, outPtr, maxBytesToWrite) {
    assert(
        typeof maxBytesToWrite == "number",
        "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!",
    );
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}
function lengthBytesUTF8(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343)
            u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
        if (u <= 127) ++len;
        else if (u <= 2047) len += 2;
        else if (u <= 65535) len += 3;
        else len += 4;
    }
    return len;
}
var UTF16Decoder =
    typeof TextDecoder !== "undefined"
        ? new TextDecoder("utf-16le")
        : undefined;
function writeArrayToMemory(array, buffer) {
    assert(
        array.length >= 0,
        "writeArrayToMemory array must have a length (should be an array or typed array)",
    );
    HEAP8.set(array, buffer);
}
function writeAsciiToMemory(str, buffer, dontAddNull) {
    for (var i = 0; i < str.length; ++i) {
        assert((str.charCodeAt(i) === str.charCodeAt(i)) & 255);
        HEAP8[buffer++ >> 0] = str.charCodeAt(i);
    }
    if (!dontAddNull) HEAP8[buffer >> 0] = 0;
}
function alignUp(x, multiple) {
    if (x % multiple > 0) {
        x += multiple - (x % multiple);
    }
    return x;
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBufferAndViews(buf) {
    buffer = buf;
    Module["HEAP8"] = HEAP8 = new Int8Array(buf);
    Module["HEAP16"] = HEAP16 = new Int16Array(buf);
    Module["HEAP32"] = HEAP32 = new Int32Array(buf);
    Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
    Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
    Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
    Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
    Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
}
var TOTAL_STACK = 5242880;
if (Module["TOTAL_STACK"])
    assert(
        TOTAL_STACK === Module["TOTAL_STACK"],
        "the stack size can no longer be determined at runtime",
    );
var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 100663296;
if (!Object.getOwnPropertyDescriptor(Module, "INITIAL_MEMORY")) {
    Object.defineProperty(Module, "INITIAL_MEMORY", {
        configurable: true,
        get: function () {
            abort(
                "Module.INITIAL_MEMORY has been replaced with plain INITIAL_MEMORY (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)",
            );
        },
    });
}
assert(
    INITIAL_MEMORY >= TOTAL_STACK,
    "INITIAL_MEMORY should be larger than TOTAL_STACK, was " +
        INITIAL_MEMORY +
        "! (TOTAL_STACK=" +
        TOTAL_STACK +
        ")",
);
assert(
    typeof Int32Array !== "undefined" &&
        typeof Float64Array !== "undefined" &&
        Int32Array.prototype.subarray !== undefined &&
        Int32Array.prototype.set !== undefined,
    "JS engine does not provide full typed array support",
);
assert(
    !Module["wasmMemory"],
    "Use of `wasmMemory` detected.  Use -s IMPORTED_MEMORY to define wasmMemory externally",
);
assert(
    INITIAL_MEMORY == 100663296,
    "Detected runtime INITIAL_MEMORY setting.  Use -s IMPORTED_MEMORY to define wasmMemory dynamically",
);
var wasmTable;
function writeStackCookie() {
    var max = _emscripten_stack_get_end();
    assert((max & 3) == 0);
    HEAPU32[(max >> 2) + 1] = 34821223;
    HEAPU32[(max >> 2) + 2] = 2310721022;
    HEAP32[0] = 1668509029;
}
function checkStackCookie() {
    if (ABORT) return;
    var max = _emscripten_stack_get_end();
    var cookie1 = HEAPU32[(max >> 2) + 1];
    var cookie2 = HEAPU32[(max >> 2) + 2];
    if (cookie1 != 34821223 || cookie2 != 2310721022) {
        abort(
            "Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x" +
                cookie2.toString(16) +
                " " +
                cookie1.toString(16),
        );
    }
    if (HEAP32[0] !== 1668509029)
        abort(
            "Runtime error: The application has corrupted its heap memory area (address zero)!",
        );
}
(function () {
    var h16 = new Int16Array(1);
    var h8 = new Int8Array(h16.buffer);
    h16[0] = 25459;
    if (h8[0] !== 115 || h8[1] !== 99)
        throw "Runtime error: expected the system to be little-endian! (Run with -s SUPPORT_BIG_ENDIAN=1 to bypass)";
})();
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;
function preRun() {
    if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
            Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift());
        }
    }
    callRuntimeCallbacks(__ATPRERUN__);
}
function initRuntime() {
    checkStackCookie();
    assert(!runtimeInitialized);
    runtimeInitialized = true;
    if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
    TTY.init();
    callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
    checkStackCookie();
    FS.ignorePermissions = false;
    callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
    checkStackCookie();
    runtimeExited = true;
}
function postRun() {
    checkStackCookie();
    if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
            Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift());
        }
    }
    callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb);
}
function addOnInit(cb) {
    __ATINIT__.unshift(cb);
}
function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb);
}
assert(
    Math.imul,
    "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill",
);
assert(
    Math.fround,
    "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill",
);
assert(
    Math.clz32,
    "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill",
);
assert(
    Math.trunc,
    "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill",
);
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
var runDependencyTracking = {};
function getUniqueRunDependency(id) {
    var orig = id;
    while (1) {
        if (!runDependencyTracking[id]) return id;
        id = orig + Math.random();
    }
}
function addRunDependency(id) {
    runDependencies++;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
    }
    if (id) {
        assert(!runDependencyTracking[id]);
        runDependencyTracking[id] = 1;
        if (
            runDependencyWatcher === null &&
            typeof setInterval !== "undefined"
        ) {
            runDependencyWatcher = setInterval(function () {
                if (ABORT) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null;
                    return;
                }
                var shown = false;
                for (var dep in runDependencyTracking) {
                    if (!shown) {
                        shown = true;
                        err("still waiting on run dependencies:");
                    }
                    err("dependency: " + dep);
                }
                if (shown) {
                    err("(end of list)");
                }
            }, 1e4);
        }
    } else {
        err("warning: run dependency added without ID");
    }
}
function removeRunDependency(id) {
    runDependencies--;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
    }
    if (id) {
        assert(runDependencyTracking[id]);
        delete runDependencyTracking[id];
    } else {
        err("warning: run dependency removed without ID");
    }
    if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback();
        }
    }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
function abort(what) {
    if (Module["onAbort"]) {
        Module["onAbort"](what);
    }
    what += "";
    err(what);
    ABORT = true;
    EXITSTATUS = 1;
    var output = "abort(" + what + ") at " + stackTrace();
    what = output;
    var e = new WebAssembly.RuntimeError(what);
    throw e;
}
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
    return filename.startsWith(dataURIPrefix);
}
function isFileURI(filename) {
    return filename.startsWith("file://");
}
function createExportWrapper(name, fixedasm) {
    return function () {
        var displayName = name;
        var asm = fixedasm;
        if (!fixedasm) {
            asm = Module["asm"];
        }
        assert(
            runtimeInitialized,
            "native function `" +
                displayName +
                "` called before runtime initialization",
        );
        assert(
            !runtimeExited,
            "native function `" +
                displayName +
                "` called after runtime exit (use NO_EXIT_RUNTIME to keep it alive after main() exits)",
        );
        if (!asm[name]) {
            assert(
                asm[name],
                "exported native function `" + displayName + "` not found",
            );
        }
        return asm[name].apply(null, arguments);
    };
}
var wasmBinaryFile = "sr-rewordify.wasm";
if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
}
function getBinary(file) {
    try {
        if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
        }
        if (readBinary) {
            return readBinary(file);
        } else {
            throw "both async and sync fetching of the wasm failed";
        }
    } catch (err) {
        abort(err);
    }
}
function getBinaryPromise() {
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
            return fetch(wasmBinaryFile, {credentials: "same-origin"})
                .then(function (response) {
                    if (!response["ok"]) {
                        throw (
                            "failed to load wasm binary file at '" +
                            wasmBinaryFile +
                            "'"
                        );
                    }
                    return response["arrayBuffer"]();
                })
                .catch(function () {
                    return getBinary(wasmBinaryFile);
                });
        } else {
            if (readAsync) {
                return new Promise(function (resolve, reject) {
                    readAsync(
                        wasmBinaryFile,
                        function (response) {
                            resolve(new Uint8Array(response));
                        },
                        reject,
                    );
                });
            }
        }
    }
    return Promise.resolve().then(function () {
        return getBinary(wasmBinaryFile);
    });
}
function createWasm() {
    var info = {env: asmLibraryArg, wasi_snapshot_preview1: asmLibraryArg};
    function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        wasmMemory = Module["asm"]["memory"];
        assert(wasmMemory, "memory not found in wasm exports");
        updateGlobalBufferAndViews(wasmMemory.buffer);
        wasmTable = Module["asm"]["__indirect_function_table"];
        assert(wasmTable, "table not found in wasm exports");
        addOnInit(Module["asm"]["__wasm_call_ctors"]);
        removeRunDependency("wasm-instantiate");
    }
    addRunDependency("wasm-instantiate");
    var trueModule = Module;
    function receiveInstantiationResult(result) {
        assert(
            Module === trueModule,
            "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?",
        );
        trueModule = null;
        receiveInstance(result["instance"]);
    }
    function instantiateArrayBuffer(receiver) {
        return getBinaryPromise()
            .then(function (binary) {
                var result = WebAssembly.instantiate(binary, info);
                return result;
            })
            .then(receiver, function (reason) {
                err("failed to asynchronously prepare wasm: " + reason);
                if (isFileURI(wasmBinaryFile)) {
                    err(
                        "warning: Loading from a file URI (" +
                            wasmBinaryFile +
                            ") is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing",
                    );
                }
                abort(reason);
            });
    }
    function instantiateAsync() {
        if (
            !wasmBinary &&
            typeof WebAssembly.instantiateStreaming === "function" &&
            !isDataURI(wasmBinaryFile) &&
            !isFileURI(wasmBinaryFile) &&
            typeof fetch === "function"
        ) {
            return fetch(wasmBinaryFile, {credentials: "same-origin"}).then(
                function (response) {
                    var result = WebAssembly.instantiateStreaming(
                        response,
                        info,
                    );
                    return result.then(
                        receiveInstantiationResult,
                        function (reason) {
                            err("wasm streaming compile failed: " + reason);
                            err("falling back to ArrayBuffer instantiation");
                            return instantiateArrayBuffer(
                                receiveInstantiationResult,
                            );
                        },
                    );
                },
            );
        } else {
            return instantiateArrayBuffer(receiveInstantiationResult);
        }
    }
    if (Module["instantiateWasm"]) {
        try {
            var exports = Module["instantiateWasm"](info, receiveInstance);
            return exports;
        } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false;
        }
    }
    instantiateAsync();
    return {};
}
var tempDouble;
var tempI64;
function array_bounds_check_error(idx, size) {
    throw "Array index " + idx + " out of bounds: [0," + size + ")";
}
function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
            callback(Module);
            continue;
        }
        var func = callback.func;
        if (typeof func === "number") {
            if (callback.arg === undefined) {
                wasmTable.get(func)();
            } else {
                wasmTable.get(func)(callback.arg);
            }
        } else {
            func(callback.arg === undefined ? null : callback.arg);
        }
    }
}
function demangle(func) {
    warnOnce(
        "warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling",
    );
    return func;
}
function demangleAll(text) {
    var regex = /\b_Z[\w\d_]+/g;
    return text.replace(regex, function (x) {
        var y = demangle(x);
        return x === y ? x : y + " [" + x + "]";
    });
}
function jsStackTrace() {
    var error = new Error();
    if (!error.stack) {
        try {
            throw new Error();
        } catch (e) {
            error = e;
        }
        if (!error.stack) {
            return "(no stack trace available)";
        }
    }
    return error.stack.toString();
}
var runtimeKeepaliveCounter = 0;
function keepRuntimeAlive() {
    return noExitRuntime || runtimeKeepaliveCounter > 0;
}
function stackTrace() {
    var js = jsStackTrace();
    if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
    return demangleAll(js);
}
function _atexit(func, arg) {}
function ___cxa_atexit(a0, a1) {
    return _atexit(a0, a1);
}
var PATH = {
    splitPath: function (filename) {
        var splitPathRe =
            /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
    },
    normalizeArray: function (parts, allowAboveRoot) {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
                parts.splice(i, 1);
            } else if (last === "..") {
                parts.splice(i, 1);
                up++;
            } else if (up) {
                parts.splice(i, 1);
                up--;
            }
        }
        if (allowAboveRoot) {
            for (; up; up--) {
                parts.unshift("..");
            }
        }
        return parts;
    },
    normalize: function (path) {
        var isAbsolute = path.charAt(0) === "/",
            trailingSlash = path.substr(-1) === "/";
        path = PATH.normalizeArray(
            path.split("/").filter(function (p) {
                return !!p;
            }),
            !isAbsolute,
        ).join("/");
        if (!path && !isAbsolute) {
            path = ".";
        }
        if (path && trailingSlash) {
            path += "/";
        }
        return (isAbsolute ? "/" : "") + path;
    },
    dirname: function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
            return ".";
        }
        if (dir) {
            dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
    },
    basename: function (path) {
        if (path === "/") return "/";
        path = PATH.normalize(path);
        path = path.replace(/\/$/, "");
        var lastSlash = path.lastIndexOf("/");
        if (lastSlash === -1) return path;
        return path.substr(lastSlash + 1);
    },
    extname: function (path) {
        return PATH.splitPath(path)[3];
    },
    join: function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join("/"));
    },
    join2: function (l, r) {
        return PATH.normalize(l + "/" + r);
    },
};
function getRandomDevice() {
    if (
        typeof crypto === "object" &&
        typeof crypto["getRandomValues"] === "function"
    ) {
        var randomBuffer = new Uint8Array(1);
        return function () {
            crypto.getRandomValues(randomBuffer);
            return randomBuffer[0];
        };
    } else if (ENVIRONMENT_IS_NODE) {
        try {
            var crypto_module = require("crypto");
            return function () {
                return crypto_module["randomBytes"](1)[0];
            };
        } catch (e) {}
    }
    return function () {
        abort(
            "no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };",
        );
    };
}
var PATH_FS = {
    resolve: function () {
        var resolvedPath = "",
            resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : FS.cwd();
            if (typeof path !== "string") {
                throw new TypeError(
                    "Arguments to path.resolve must be strings",
                );
            } else if (!path) {
                return "";
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charAt(0) === "/";
        }
        resolvedPath = PATH.normalizeArray(
            resolvedPath.split("/").filter(function (p) {
                return !!p;
            }),
            !resolvedAbsolute,
        ).join("/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
    },
    relative: function (from, to) {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
                if (arr[start] !== "") break;
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
                if (arr[end] !== "") break;
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
            }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..");
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/");
    },
};
var TTY = {
    ttys: [],
    init: function () {},
    shutdown: function () {},
    register: function (dev, ops) {
        TTY.ttys[dev] = {input: [], output: [], ops: ops};
        FS.registerDevice(dev, TTY.stream_ops);
    },
    stream_ops: {
        open: function (stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
                throw new FS.ErrnoError(43);
            }
            stream.tty = tty;
            stream.seekable = false;
        },
        close: function (stream) {
            stream.tty.ops.flush(stream.tty);
        },
        flush: function (stream) {
            stream.tty.ops.flush(stream.tty);
        },
        read: function (stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(60);
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
                var result;
                try {
                    result = stream.tty.ops.get_char(stream.tty);
                } catch (e) {
                    throw new FS.ErrnoError(29);
                }
                if (result === undefined && bytesRead === 0) {
                    throw new FS.ErrnoError(6);
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset + i] = result;
            }
            if (bytesRead) {
                stream.node.timestamp = Date.now();
            }
            return bytesRead;
        },
        write: function (stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(60);
            }
            try {
                for (var i = 0; i < length; i++) {
                    stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                }
            } catch (e) {
                throw new FS.ErrnoError(29);
            }
            if (length) {
                stream.node.timestamp = Date.now();
            }
            return i;
        },
    },
    default_tty_ops: {
        get_char: function (tty) {
            if (!tty.input.length) {
                var result = null;
                if (ENVIRONMENT_IS_NODE) {
                    var BUFSIZE = 256;
                    var buf = Buffer.alloc
                        ? Buffer.alloc(BUFSIZE)
                        : new Buffer(BUFSIZE);
                    var bytesRead = 0;
                    try {
                        bytesRead = nodeFS.readSync(
                            process.stdin.fd,
                            buf,
                            0,
                            BUFSIZE,
                            null,
                        );
                    } catch (e) {
                        if (e.toString().includes("EOF")) bytesRead = 0;
                        else throw e;
                    }
                    if (bytesRead > 0) {
                        result = buf.slice(0, bytesRead).toString("utf-8");
                    } else {
                        result = null;
                    }
                } else if (
                    typeof window != "undefined" &&
                    typeof window.prompt == "function"
                ) {
                    result = window.prompt("Input: ");
                    if (result !== null) {
                        result += "\n";
                    }
                } else if (typeof readline == "function") {
                    result = readline();
                    if (result !== null) {
                        result += "\n";
                    }
                }
                if (!result) {
                    return null;
                }
                tty.input = intArrayFromString(result, true);
            }
            return tty.input.shift();
        },
        put_char: function (tty, val) {
            if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
            } else {
                if (val != 0) tty.output.push(val);
            }
        },
        flush: function (tty) {
            if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
            }
        },
    },
    default_tty1_ops: {
        put_char: function (tty, val) {
            if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
            } else {
                if (val != 0) tty.output.push(val);
            }
        },
        flush: function (tty) {
            if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
            }
        },
    },
};
function mmapAlloc(size) {
    var alignedSize = alignMemory(size, 65536);
    var ptr = _malloc(alignedSize);
    while (size < alignedSize) HEAP8[ptr + size++] = 0;
    return ptr;
}
var MEMFS = {
    ops_table: null,
    mount: function (mount) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0);
    },
    createNode: function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(63);
        }
        if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
                dir: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        lookup: MEMFS.node_ops.lookup,
                        mknod: MEMFS.node_ops.mknod,
                        rename: MEMFS.node_ops.rename,
                        unlink: MEMFS.node_ops.unlink,
                        rmdir: MEMFS.node_ops.rmdir,
                        readdir: MEMFS.node_ops.readdir,
                        symlink: MEMFS.node_ops.symlink,
                    },
                    stream: {llseek: MEMFS.stream_ops.llseek},
                },
                file: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek,
                        read: MEMFS.stream_ops.read,
                        write: MEMFS.stream_ops.write,
                        allocate: MEMFS.stream_ops.allocate,
                        mmap: MEMFS.stream_ops.mmap,
                        msync: MEMFS.stream_ops.msync,
                    },
                },
                link: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        readlink: MEMFS.node_ops.readlink,
                    },
                    stream: {},
                },
                chrdev: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                    },
                    stream: FS.chrdev_stream_ops,
                },
            };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {};
        } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null;
        } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        if (parent) {
            parent.contents[name] = node;
            parent.timestamp = node.timestamp;
        }
        return node;
    },
    getFileDataAsTypedArray: function (node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray)
            return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents);
    },
    expandFileStorage: function (node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return;
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(
            newCapacity,
            (prevCapacity *
                (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>>
                0,
        );
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity);
        if (node.usedBytes > 0)
            node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
    },
    resizeFileStorage: function (node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0;
        } else {
            var oldContents = node.contents;
            node.contents = new Uint8Array(newSize);
            if (oldContents) {
                node.contents.set(
                    oldContents.subarray(0, Math.min(newSize, node.usedBytes)),
                );
            }
            node.usedBytes = newSize;
        }
    },
    node_ops: {
        getattr: function (node) {
            var attr = {};
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
                attr.size = 4096;
            } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes;
            } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length;
            } else {
                attr.size = 0;
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr;
        },
        setattr: function (node, attr) {
            if (attr.mode !== undefined) {
                node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp;
            }
            if (attr.size !== undefined) {
                MEMFS.resizeFileStorage(node, attr.size);
            }
        },
        lookup: function (parent, name) {
            throw FS.genericErrors[44];
        },
        mknod: function (parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev);
        },
        rename: function (old_node, new_dir, new_name) {
            if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {}
                if (new_node) {
                    for (var i in new_node.contents) {
                        throw new FS.ErrnoError(55);
                    }
                }
            }
            delete old_node.parent.contents[old_node.name];
            old_node.parent.timestamp = Date.now();
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            new_dir.timestamp = old_node.parent.timestamp;
            old_node.parent = new_dir;
        },
        unlink: function (parent, name) {
            delete parent.contents[name];
            parent.timestamp = Date.now();
        },
        rmdir: function (parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
                throw new FS.ErrnoError(55);
            }
            delete parent.contents[name];
            parent.timestamp = Date.now();
        },
        readdir: function (node) {
            var entries = [".", ".."];
            for (var key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                    continue;
                }
                entries.push(key);
            }
            return entries;
        },
        symlink: function (parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
            node.link = oldpath;
            return node;
        },
        readlink: function (node) {
            if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(28);
            }
            return node.link;
        },
    },
    stream_ops: {
        read: function (stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes) return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            assert(size >= 0);
            if (size > 8 && contents.subarray) {
                buffer.set(
                    contents.subarray(position, position + size),
                    offset,
                );
            } else {
                for (var i = 0; i < size; i++)
                    buffer[offset + i] = contents[position + i];
            }
            return size;
        },
        write: function (stream, buffer, offset, length, position, canOwn) {
            assert(!(buffer instanceof ArrayBuffer));
            if (buffer.buffer === HEAP8.buffer) {
                canOwn = false;
            }
            if (!length) return 0;
            var node = stream.node;
            node.timestamp = Date.now();
            if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                    assert(
                        position === 0,
                        "canOwn must imply no weird position inside the file",
                    );
                    node.contents = buffer.subarray(offset, offset + length);
                    node.usedBytes = length;
                    return length;
                } else if (node.usedBytes === 0 && position === 0) {
                    node.contents = buffer.slice(offset, offset + length);
                    node.usedBytes = length;
                    return length;
                } else if (position + length <= node.usedBytes) {
                    node.contents.set(
                        buffer.subarray(offset, offset + length),
                        position,
                    );
                    return length;
                }
            }
            MEMFS.expandFileStorage(node, position + length);
            if (node.contents.subarray && buffer.subarray) {
                node.contents.set(
                    buffer.subarray(offset, offset + length),
                    position,
                );
            } else {
                for (var i = 0; i < length; i++) {
                    node.contents[position + i] = buffer[offset + i];
                }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length;
        },
        llseek: function (stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position;
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    position += stream.node.usedBytes;
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(28);
            }
            return position;
        },
        allocate: function (stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(
                stream.node.usedBytes,
                offset + length,
            );
        },
        mmap: function (stream, address, length, position, prot, flags) {
            if (address !== 0) {
                throw new FS.ErrnoError(28);
            }
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            if (!(flags & 2) && contents.buffer === buffer) {
                allocated = false;
                ptr = contents.byteOffset;
            } else {
                if (position > 0 || position + length < contents.length) {
                    if (contents.subarray) {
                        contents = contents.subarray(
                            position,
                            position + length,
                        );
                    } else {
                        contents = Array.prototype.slice.call(
                            contents,
                            position,
                            position + length,
                        );
                    }
                }
                allocated = true;
                ptr = mmapAlloc(length);
                if (!ptr) {
                    throw new FS.ErrnoError(48);
                }
                HEAP8.set(contents, ptr);
            }
            return {ptr: ptr, allocated: allocated};
        },
        msync: function (stream, buffer, offset, length, mmapFlags) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
            }
            if (mmapFlags & 2) {
                return 0;
            }
            var bytesWritten = MEMFS.stream_ops.write(
                stream,
                buffer,
                0,
                length,
                offset,
                false,
            );
            return 0;
        },
    },
};
var ERRNO_MESSAGES = {
    0: "Success",
    1: "Arg list too long",
    2: "Permission denied",
    3: "Address already in use",
    4: "Address not available",
    5: "Address family not supported by protocol family",
    6: "No more processes",
    7: "Socket already connected",
    8: "Bad file number",
    9: "Trying to read unreadable message",
    10: "Mount device busy",
    11: "Operation canceled",
    12: "No children",
    13: "Connection aborted",
    14: "Connection refused",
    15: "Connection reset by peer",
    16: "File locking deadlock error",
    17: "Destination address required",
    18: "Math arg out of domain of func",
    19: "Quota exceeded",
    20: "File exists",
    21: "Bad address",
    22: "File too large",
    23: "Host is unreachable",
    24: "Identifier removed",
    25: "Illegal byte sequence",
    26: "Connection already in progress",
    27: "Interrupted system call",
    28: "Invalid argument",
    29: "I/O error",
    30: "Socket is already connected",
    31: "Is a directory",
    32: "Too many symbolic links",
    33: "Too many open files",
    34: "Too many links",
    35: "Message too long",
    36: "Multihop attempted",
    37: "File or path name too long",
    38: "Network interface is not configured",
    39: "Connection reset by network",
    40: "Network is unreachable",
    41: "Too many open files in system",
    42: "No buffer space available",
    43: "No such device",
    44: "No such file or directory",
    45: "Exec format error",
    46: "No record locks available",
    47: "The link has been severed",
    48: "Not enough core",
    49: "No message of desired type",
    50: "Protocol not available",
    51: "No space left on device",
    52: "Function not implemented",
    53: "Socket is not connected",
    54: "Not a directory",
    55: "Directory not empty",
    56: "State not recoverable",
    57: "Socket operation on non-socket",
    59: "Not a typewriter",
    60: "No such device or address",
    61: "Value too large for defined data type",
    62: "Previous owner died",
    63: "Not super-user",
    64: "Broken pipe",
    65: "Protocol error",
    66: "Unknown protocol",
    67: "Protocol wrong type for socket",
    68: "Math result not representable",
    69: "Read only file system",
    70: "Illegal seek",
    71: "No such process",
    72: "Stale file handle",
    73: "Connection timed out",
    74: "Text file busy",
    75: "Cross-device link",
    100: "Device not a stream",
    101: "Bad font file fmt",
    102: "Invalid slot",
    103: "Invalid request code",
    104: "No anode",
    105: "Block device required",
    106: "Channel number out of range",
    107: "Level 3 halted",
    108: "Level 3 reset",
    109: "Link number out of range",
    110: "Protocol driver not attached",
    111: "No CSI structure available",
    112: "Level 2 halted",
    113: "Invalid exchange",
    114: "Invalid request descriptor",
    115: "Exchange full",
    116: "No data (for no delay io)",
    117: "Timer expired",
    118: "Out of streams resources",
    119: "Machine is not on the network",
    120: "Package not installed",
    121: "The object is remote",
    122: "Advertise error",
    123: "Srmount error",
    124: "Communication error on send",
    125: "Cross mount point (not really error)",
    126: "Given log. name not unique",
    127: "f.d. invalid for this operation",
    128: "Remote address changed",
    129: "Can   access a needed shared lib",
    130: "Accessing a corrupted shared lib",
    131: ".lib section in a.out corrupted",
    132: "Attempting to link in too many libs",
    133: "Attempting to exec a shared library",
    135: "Streams pipe error",
    136: "Too many users",
    137: "Socket type not supported",
    138: "Not supported",
    139: "Protocol family not supported",
    140: "Can't send after socket shutdown",
    141: "Too many references",
    142: "Host is down",
    148: "No medium (in tape drive)",
    156: "Level 2 not synchronized",
};
var ERRNO_CODES = {
    EPERM: 63,
    ENOENT: 44,
    ESRCH: 71,
    EINTR: 27,
    EIO: 29,
    ENXIO: 60,
    E2BIG: 1,
    ENOEXEC: 45,
    EBADF: 8,
    ECHILD: 12,
    EAGAIN: 6,
    EWOULDBLOCK: 6,
    ENOMEM: 48,
    EACCES: 2,
    EFAULT: 21,
    ENOTBLK: 105,
    EBUSY: 10,
    EEXIST: 20,
    EXDEV: 75,
    ENODEV: 43,
    ENOTDIR: 54,
    EISDIR: 31,
    EINVAL: 28,
    ENFILE: 41,
    EMFILE: 33,
    ENOTTY: 59,
    ETXTBSY: 74,
    EFBIG: 22,
    ENOSPC: 51,
    ESPIPE: 70,
    EROFS: 69,
    EMLINK: 34,
    EPIPE: 64,
    EDOM: 18,
    ERANGE: 68,
    ENOMSG: 49,
    EIDRM: 24,
    ECHRNG: 106,
    EL2NSYNC: 156,
    EL3HLT: 107,
    EL3RST: 108,
    ELNRNG: 109,
    EUNATCH: 110,
    ENOCSI: 111,
    EL2HLT: 112,
    EDEADLK: 16,
    ENOLCK: 46,
    EBADE: 113,
    EBADR: 114,
    EXFULL: 115,
    ENOANO: 104,
    EBADRQC: 103,
    EBADSLT: 102,
    EDEADLOCK: 16,
    EBFONT: 101,
    ENOSTR: 100,
    ENODATA: 116,
    ETIME: 117,
    ENOSR: 118,
    ENONET: 119,
    ENOPKG: 120,
    EREMOTE: 121,
    ENOLINK: 47,
    EADV: 122,
    ESRMNT: 123,
    ECOMM: 124,
    EPROTO: 65,
    EMULTIHOP: 36,
    EDOTDOT: 125,
    EBADMSG: 9,
    ENOTUNIQ: 126,
    EBADFD: 127,
    EREMCHG: 128,
    ELIBACC: 129,
    ELIBBAD: 130,
    ELIBSCN: 131,
    ELIBMAX: 132,
    ELIBEXEC: 133,
    ENOSYS: 52,
    ENOTEMPTY: 55,
    ENAMETOOLONG: 37,
    ELOOP: 32,
    EOPNOTSUPP: 138,
    EPFNOSUPPORT: 139,
    ECONNRESET: 15,
    ENOBUFS: 42,
    EAFNOSUPPORT: 5,
    EPROTOTYPE: 67,
    ENOTSOCK: 57,
    ENOPROTOOPT: 50,
    ESHUTDOWN: 140,
    ECONNREFUSED: 14,
    EADDRINUSE: 3,
    ECONNABORTED: 13,
    ENETUNREACH: 40,
    ENETDOWN: 38,
    ETIMEDOUT: 73,
    EHOSTDOWN: 142,
    EHOSTUNREACH: 23,
    EINPROGRESS: 26,
    EALREADY: 7,
    EDESTADDRREQ: 17,
    EMSGSIZE: 35,
    EPROTONOSUPPORT: 66,
    ESOCKTNOSUPPORT: 137,
    EADDRNOTAVAIL: 4,
    ENETRESET: 39,
    EISCONN: 30,
    ENOTCONN: 53,
    ETOOMANYREFS: 141,
    EUSERS: 136,
    EDQUOT: 19,
    ESTALE: 72,
    ENOTSUP: 138,
    ENOMEDIUM: 148,
    EILSEQ: 25,
    EOVERFLOW: 61,
    ECANCELED: 11,
    ENOTRECOVERABLE: 56,
    EOWNERDEAD: 62,
    ESTRPIPE: 135,
};
var FS = {
    root: null,
    mounts: [],
    devices: {},
    streams: [],
    nextInode: 1,
    nameTable: null,
    currentPath: "/",
    initialized: false,
    ignorePermissions: true,
    trackingDelegate: {},
    tracking: {openFlags: {READ: 1, WRITE: 2}},
    ErrnoError: null,
    genericErrors: {},
    filesystems: null,
    syncFSRequests: 0,
    lookupPath: function (path, opts) {
        path = PATH_FS.resolve(FS.cwd(), path);
        opts = opts || {};
        if (!path) return {path: "", node: null};
        var defaults = {follow_mount: true, recurse_count: 0};
        for (var key in defaults) {
            if (opts[key] === undefined) {
                opts[key] = defaults[key];
            }
        }
        if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(32);
        }
        var parts = PATH.normalizeArray(
            path.split("/").filter(function (p) {
                return !!p;
            }),
            false,
        );
        var current = FS.root;
        var current_path = "/";
        for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
                break;
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            if (FS.isMountpoint(current)) {
                if (!islast || (islast && opts.follow_mount)) {
                    current = current.mounted.root;
                }
            }
            if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                    var link = FS.readlink(current_path);
                    current_path = PATH_FS.resolve(
                        PATH.dirname(current_path),
                        link,
                    );
                    var lookup = FS.lookupPath(current_path, {
                        recurse_count: opts.recurse_count,
                    });
                    current = lookup.node;
                    if (count++ > 40) {
                        throw new FS.ErrnoError(32);
                    }
                }
            }
        }
        return {path: current_path, node: current};
    },
    getPath: function (node) {
        var path;
        while (true) {
            if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path) return mount;
                return mount[mount.length - 1] !== "/"
                    ? mount + "/" + path
                    : mount + path;
            }
            path = path ? node.name + "/" + path : node.name;
            node = node.parent;
        }
    },
    hashName: function (parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
            hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
    },
    hashAddNode: function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
    },
    hashRemoveNode: function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next;
        } else {
            var current = FS.nameTable[hash];
            while (current) {
                if (current.name_next === node) {
                    current.name_next = node.name_next;
                    break;
                }
                current = current.name_next;
            }
        }
    },
    lookupNode: function (parent, name) {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
            throw new FS.ErrnoError(errCode, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
                return node;
            }
        }
        return FS.lookup(parent, name);
    },
    createNode: function (parent, name, mode, rdev) {
        assert(typeof parent === "object");
        var node = new FS.FSNode(parent, name, mode, rdev);
        FS.hashAddNode(node);
        return node;
    },
    destroyNode: function (node) {
        FS.hashRemoveNode(node);
    },
    isRoot: function (node) {
        return node === node.parent;
    },
    isMountpoint: function (node) {
        return !!node.mounted;
    },
    isFile: function (mode) {
        return (mode & 61440) === 32768;
    },
    isDir: function (mode) {
        return (mode & 61440) === 16384;
    },
    isLink: function (mode) {
        return (mode & 61440) === 40960;
    },
    isChrdev: function (mode) {
        return (mode & 61440) === 8192;
    },
    isBlkdev: function (mode) {
        return (mode & 61440) === 24576;
    },
    isFIFO: function (mode) {
        return (mode & 61440) === 4096;
    },
    isSocket: function (mode) {
        return (mode & 49152) === 49152;
    },
    flagModes: {"r": 0, "r+": 2, "w": 577, "w+": 578, "a": 1089, "a+": 1090},
    modeStringToFlags: function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === "undefined") {
            throw new Error("Unknown file open mode: " + str);
        }
        return flags;
    },
    flagsToPermissionString: function (flag) {
        var perms = ["r", "w", "rw"][flag & 3];
        if (flag & 512) {
            perms += "w";
        }
        return perms;
    },
    nodePermissions: function (node, perms) {
        if (FS.ignorePermissions) {
            return 0;
        }
        if (perms.includes("r") && !(node.mode & 292)) {
            return 2;
        } else if (perms.includes("w") && !(node.mode & 146)) {
            return 2;
        } else if (perms.includes("x") && !(node.mode & 73)) {
            return 2;
        }
        return 0;
    },
    mayLookup: function (dir) {
        var errCode = FS.nodePermissions(dir, "x");
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
    },
    mayCreate: function (dir, name) {
        try {
            var node = FS.lookupNode(dir, name);
            return 20;
        } catch (e) {}
        return FS.nodePermissions(dir, "wx");
    },
    mayDelete: function (dir, name, isdir) {
        var node;
        try {
            node = FS.lookupNode(dir, name);
        } catch (e) {
            return e.errno;
        }
        var errCode = FS.nodePermissions(dir, "wx");
        if (errCode) {
            return errCode;
        }
        if (isdir) {
            if (!FS.isDir(node.mode)) {
                return 54;
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 10;
            }
        } else {
            if (FS.isDir(node.mode)) {
                return 31;
            }
        }
        return 0;
    },
    mayOpen: function (node, flags) {
        if (!node) {
            return 44;
        }
        if (FS.isLink(node.mode)) {
            return 32;
        } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                return 31;
            }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
    },
    MAX_OPEN_FDS: 4096,
    nextfd: function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
                return fd;
            }
        }
        throw new FS.ErrnoError(33);
    },
    getStream: function (fd) {
        return FS.streams[fd];
    },
    createStream: function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
            FS.FSStream = function () {};
            FS.FSStream.prototype = {
                object: {
                    get: function () {
                        return this.node;
                    },
                    set: function (val) {
                        this.node = val;
                    },
                },
                isRead: {
                    get: function () {
                        return (this.flags & 2097155) !== 1;
                    },
                },
                isWrite: {
                    get: function () {
                        return (this.flags & 2097155) !== 0;
                    },
                },
                isAppend: {
                    get: function () {
                        return this.flags & 1024;
                    },
                },
            };
        }
        var newStream = new FS.FSStream();
        for (var p in stream) {
            newStream[p] = stream[p];
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
    },
    closeStream: function (fd) {
        FS.streams[fd] = null;
    },
    chrdev_stream_ops: {
        open: function (stream) {
            var device = FS.getDevice(stream.node.rdev);
            stream.stream_ops = device.stream_ops;
            if (stream.stream_ops.open) {
                stream.stream_ops.open(stream);
            }
        },
        llseek: function () {
            throw new FS.ErrnoError(70);
        },
    },
    major: function (dev) {
        return dev >> 8;
    },
    minor: function (dev) {
        return dev & 255;
    },
    makedev: function (ma, mi) {
        return (ma << 8) | mi;
    },
    registerDevice: function (dev, ops) {
        FS.devices[dev] = {stream_ops: ops};
    },
    getDevice: function (dev) {
        return FS.devices[dev];
    },
    getMounts: function (mount) {
        var mounts = [];
        var check = [mount];
        while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push.apply(check, m.mounts);
        }
        return mounts;
    },
    syncfs: function (populate, callback) {
        if (typeof populate === "function") {
            callback = populate;
            populate = false;
        }
        FS.syncFSRequests++;
        if (FS.syncFSRequests > 1) {
            err(
                "warning: " +
                    FS.syncFSRequests +
                    " FS.syncfs operations in flight at once, probably just doing extra work",
            );
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
        function doCallback(errCode) {
            assert(FS.syncFSRequests > 0);
            FS.syncFSRequests--;
            return callback(errCode);
        }
        function done(errCode) {
            if (errCode) {
                if (!done.errored) {
                    done.errored = true;
                    return doCallback(errCode);
                }
                return;
            }
            if (++completed >= mounts.length) {
                doCallback(null);
            }
        }
        mounts.forEach(function (mount) {
            if (!mount.type.syncfs) {
                return done(null);
            }
            mount.type.syncfs(mount, populate, done);
        });
    },
    mount: function (type, opts, mountpoint) {
        if (typeof type === "string") {
            throw type;
        }
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
            throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, {follow_mount: false});
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
            }
            if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54);
            }
        }
        var mount = {
            type: type,
            opts: opts,
            mountpoint: mountpoint,
            mounts: [],
        };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
            FS.root = mountRoot;
        } else if (node) {
            node.mounted = mount;
            if (node.mount) {
                node.mount.mounts.push(mount);
            }
        }
        return mountRoot;
    },
    unmount: function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, {follow_mount: false});
        if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28);
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        Object.keys(FS.nameTable).forEach(function (hash) {
            var current = FS.nameTable[hash];
            while (current) {
                var next = current.name_next;
                if (mounts.includes(current.mount)) {
                    FS.destroyNode(current);
                }
                current = next;
            }
        });
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
    },
    lookup: function (parent, name) {
        return parent.node_ops.lookup(parent, name);
    },
    mknod: function (path, mode, dev) {
        var lookup = FS.lookupPath(path, {parent: true});
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(28);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
    },
    create: function (path, mode) {
        mode = mode !== undefined ? mode : 438;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
    },
    mkdir: function (path, mode) {
        mode = mode !== undefined ? mode : 511;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
    },
    mkdirTree: function (path, mode) {
        var dirs = path.split("/");
        var d = "";
        for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += "/" + dirs[i];
            try {
                FS.mkdir(d, mode);
            } catch (e) {
                if (e.errno != 20) throw e;
            }
        }
    },
    mkdev: function (path, mode, dev) {
        if (typeof dev === "undefined") {
            dev = mode;
            mode = 438;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
    },
    symlink: function (oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, {parent: true});
        var parent = lookup.node;
        if (!parent) {
            throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
    },
    rename: function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        lookup = FS.lookupPath(old_path, {parent: true});
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, {parent: true});
        new_dir = lookup.node;
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75);
        }
        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(28);
        }
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(55);
        }
        var new_node;
        try {
            new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {}
        if (old_node === new_node) {
            return;
        }
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        errCode = new_node
            ? FS.mayDelete(new_dir, new_name, isdir)
            : FS.mayCreate(new_dir, new_name);
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63);
        }
        if (
            FS.isMountpoint(old_node) ||
            (new_node && FS.isMountpoint(new_node))
        ) {
            throw new FS.ErrnoError(10);
        }
        if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, "w");
            if (errCode) {
                throw new FS.ErrnoError(errCode);
            }
        }
        try {
            if (FS.trackingDelegate["willMovePath"]) {
                FS.trackingDelegate["willMovePath"](old_path, new_path);
            }
        } catch (e) {
            err(
                "FS.trackingDelegate['willMovePath']('" +
                    old_path +
                    "', '" +
                    new_path +
                    "') threw an exception: " +
                    e.message,
            );
        }
        FS.hashRemoveNode(old_node);
        try {
            old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
            throw e;
        } finally {
            FS.hashAddNode(old_node);
        }
        try {
            if (FS.trackingDelegate["onMovePath"])
                FS.trackingDelegate["onMovePath"](old_path, new_path);
        } catch (e) {
            err(
                "FS.trackingDelegate['onMovePath']('" +
                    old_path +
                    "', '" +
                    new_path +
                    "') threw an exception: " +
                    e.message,
            );
        }
    },
    rmdir: function (path) {
        var lookup = FS.lookupPath(path, {parent: true});
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
        }
        try {
            if (FS.trackingDelegate["willDeletePath"]) {
                FS.trackingDelegate["willDeletePath"](path);
            }
        } catch (e) {
            err(
                "FS.trackingDelegate['willDeletePath']('" +
                    path +
                    "') threw an exception: " +
                    e.message,
            );
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate["onDeletePath"])
                FS.trackingDelegate["onDeletePath"](path);
        } catch (e) {
            err(
                "FS.trackingDelegate['onDeletePath']('" +
                    path +
                    "') threw an exception: " +
                    e.message,
            );
        }
    },
    readdir: function (path) {
        var lookup = FS.lookupPath(path, {follow: true});
        var node = lookup.node;
        if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
    },
    unlink: function (path) {
        var lookup = FS.lookupPath(path, {parent: true});
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
        }
        try {
            if (FS.trackingDelegate["willDeletePath"]) {
                FS.trackingDelegate["willDeletePath"](path);
            }
        } catch (e) {
            err(
                "FS.trackingDelegate['willDeletePath']('" +
                    path +
                    "') threw an exception: " +
                    e.message,
            );
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate["onDeletePath"])
                FS.trackingDelegate["onDeletePath"](path);
        } catch (e) {
            err(
                "FS.trackingDelegate['onDeletePath']('" +
                    path +
                    "') threw an exception: " +
                    e.message,
            );
        }
    },
    readlink: function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
            throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(
            FS.getPath(link.parent),
            link.node_ops.readlink(link),
        );
    },
    stat: function (path, dontFollow) {
        var lookup = FS.lookupPath(path, {follow: !dontFollow});
        var node = lookup.node;
        if (!node) {
            throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
    },
    lstat: function (path) {
        return FS.stat(path, true);
    },
    chmod: function (path, mode, dontFollow) {
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {follow: !dontFollow});
            node = lookup.node;
        } else {
            node = path;
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
            mode: (mode & 4095) | (node.mode & ~4095),
            timestamp: Date.now(),
        });
    },
    lchmod: function (path, mode) {
        FS.chmod(path, mode, true);
    },
    fchmod: function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8);
        }
        FS.chmod(stream.node, mode);
    },
    chown: function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {follow: !dontFollow});
            node = lookup.node;
        } else {
            node = path;
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {timestamp: Date.now()});
    },
    lchown: function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
    },
    fchown: function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8);
        }
        FS.chown(stream.node, uid, gid);
    },
    truncate: function (path, len) {
        if (len < 0) {
            throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {follow: true});
            node = lookup.node;
        } else {
            node = path;
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, "w");
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        node.node_ops.setattr(node, {size: len, timestamp: Date.now()});
    },
    ftruncate: function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
    },
    utime: function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, {follow: true});
        var node = lookup.node;
        node.node_ops.setattr(node, {timestamp: Math.max(atime, mtime)});
    },
    open: function (path, flags, mode, fd_start, fd_end) {
        if (path === "") {
            throw new FS.ErrnoError(44);
        }
        flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === "undefined" ? 438 : mode;
        if (flags & 64) {
            mode = (mode & 4095) | 32768;
        } else {
            mode = 0;
        }
        var node;
        if (typeof path === "object") {
            node = path;
        } else {
            path = PATH.normalize(path);
            try {
                var lookup = FS.lookupPath(path, {follow: !(flags & 131072)});
                node = lookup.node;
            } catch (e) {}
        }
        var created = false;
        if (flags & 64) {
            if (node) {
                if (flags & 128) {
                    throw new FS.ErrnoError(20);
                }
            } else {
                node = FS.mknod(path, mode, 0);
                created = true;
            }
        }
        if (!node) {
            throw new FS.ErrnoError(44);
        }
        if (FS.isChrdev(node.mode)) {
            flags &= ~512;
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
        }
        if (!created) {
            var errCode = FS.mayOpen(node, flags);
            if (errCode) {
                throw new FS.ErrnoError(errCode);
            }
        }
        if (flags & 512) {
            FS.truncate(node, 0);
        }
        flags &= ~(128 | 512 | 131072);
        var stream = FS.createStream(
            {
                node: node,
                path: FS.getPath(node),
                flags: flags,
                seekable: true,
                position: 0,
                stream_ops: node.stream_ops,
                ungotten: [],
                error: false,
            },
            fd_start,
            fd_end,
        );
        if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
        }
        if (Module["logReadFiles"] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1;
                err("FS.trackingDelegate error on read file: " + path);
            }
        }
        try {
            if (FS.trackingDelegate["onOpenFile"]) {
                var trackingFlags = 0;
                if ((flags & 2097155) !== 1) {
                    trackingFlags |= FS.tracking.openFlags.READ;
                }
                if ((flags & 2097155) !== 0) {
                    trackingFlags |= FS.tracking.openFlags.WRITE;
                }
                FS.trackingDelegate["onOpenFile"](path, trackingFlags);
            }
        } catch (e) {
            err(
                "FS.trackingDelegate['onOpenFile']('" +
                    path +
                    "', flags) threw an exception: " +
                    e.message,
            );
        }
        return stream;
    },
    close: function (stream) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null;
        try {
            if (stream.stream_ops.close) {
                stream.stream_ops.close(stream);
            }
        } catch (e) {
            throw e;
        } finally {
            FS.closeStream(stream.fd);
        }
        stream.fd = null;
    },
    isClosed: function (stream) {
        return stream.fd === null;
    },
    llseek: function (stream, offset, whence) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
    },
    read: function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28);
        }
        var seeking = typeof position !== "undefined";
        if (!seeking) {
            position = stream.position;
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(
            stream,
            buffer,
            offset,
            length,
            position,
        );
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
    },
    write: function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
            FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position !== "undefined";
        if (!seeking) {
            position = stream.position;
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(
            stream,
            buffer,
            offset,
            length,
            position,
            canOwn,
        );
        if (!seeking) stream.position += bytesWritten;
        try {
            if (stream.path && FS.trackingDelegate["onWriteToFile"])
                FS.trackingDelegate["onWriteToFile"](stream.path);
        } catch (e) {
            err(
                "FS.trackingDelegate['onWriteToFile']('" +
                    stream.path +
                    "') threw an exception: " +
                    e.message,
            );
        }
        return bytesWritten;
    },
    allocate: function (stream, offset, length) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
    },
    mmap: function (stream, address, length, position, prot, flags) {
        if (
            (prot & 2) !== 0 &&
            (flags & 2) === 0 &&
            (stream.flags & 2097155) !== 2
        ) {
            throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43);
        }
        return stream.stream_ops.mmap(
            stream,
            address,
            length,
            position,
            prot,
            flags,
        );
    },
    msync: function (stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
            return 0;
        }
        return stream.stream_ops.msync(
            stream,
            buffer,
            offset,
            length,
            mmapFlags,
        );
    },
    munmap: function (stream) {
        return 0;
    },
    ioctl: function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
    },
    readFile: function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || "binary";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === "binary") {
            ret = buf;
        }
        FS.close(stream);
        return ret;
    },
    writeFile: function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data === "string") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
            throw new Error("Unsupported data type");
        }
        FS.close(stream);
    },
    cwd: function () {
        return FS.currentPath;
    },
    chdir: function (path) {
        var lookup = FS.lookupPath(path, {follow: true});
        if (lookup.node === null) {
            throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, "x");
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
    },
    createDefaultDirectories: function () {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user");
    },
    createDefaultDevices: function () {
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
            read: function () {
                return 0;
            },
            write: function (stream, buffer, offset, length, pos) {
                return length;
            },
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var random_device = getRandomDevice();
        FS.createDevice("/dev", "random", random_device);
        FS.createDevice("/dev", "urandom", random_device);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp");
    },
    createSpecialDirectories: function () {
        FS.mkdir("/proc");
        var proc_self = FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount(
            {
                mount: function () {
                    var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
                    node.node_ops = {
                        lookup: function (parent, name) {
                            var fd = +name;
                            var stream = FS.getStream(fd);
                            if (!stream) throw new FS.ErrnoError(8);
                            var ret = {
                                parent: null,
                                mount: {mountpoint: "fake"},
                                node_ops: {
                                    readlink: function () {
                                        return stream.path;
                                    },
                                },
                            };
                            ret.parent = ret;
                            return ret;
                        },
                    };
                    return node;
                },
            },
            {},
            "/proc/self/fd",
        );
    },
    createStandardStreams: function () {
        if (Module["stdin"]) {
            FS.createDevice("/dev", "stdin", Module["stdin"]);
        } else {
            FS.symlink("/dev/tty", "/dev/stdin");
        }
        if (Module["stdout"]) {
            FS.createDevice("/dev", "stdout", null, Module["stdout"]);
        } else {
            FS.symlink("/dev/tty", "/dev/stdout");
        }
        if (Module["stderr"]) {
            FS.createDevice("/dev", "stderr", null, Module["stderr"]);
        } else {
            FS.symlink("/dev/tty1", "/dev/stderr");
        }
        var stdin = FS.open("/dev/stdin", 0);
        var stdout = FS.open("/dev/stdout", 1);
        var stderr = FS.open("/dev/stderr", 1);
        assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
        assert(
            stdout.fd === 1,
            "invalid handle for stdout (" + stdout.fd + ")",
        );
        assert(
            stderr.fd === 2,
            "invalid handle for stderr (" + stderr.fd + ")",
        );
    },
    ensureErrnoError: function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
            this.node = node;
            this.setErrno = function (errno) {
                this.errno = errno;
                for (var key in ERRNO_CODES) {
                    if (ERRNO_CODES[key] === errno) {
                        this.code = key;
                        break;
                    }
                }
            };
            this.setErrno(errno);
            this.message = ERRNO_MESSAGES[errno];
            if (this.stack) {
                Object.defineProperty(this, "stack", {
                    value: new Error().stack,
                    writable: true,
                });
                this.stack = demangleAll(this.stack);
            }
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        [44].forEach(function (code) {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = "<generic error, no stack>";
        });
    },
    staticInit: function () {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, "/");
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = {MEMFS: MEMFS};
    },
    init: function (input, output, error) {
        assert(
            !FS.init.initialized,
            "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)",
        );
        FS.init.initialized = true;
        FS.ensureErrnoError();
        Module["stdin"] = input || Module["stdin"];
        Module["stdout"] = output || Module["stdout"];
        Module["stderr"] = error || Module["stderr"];
        FS.createStandardStreams();
    },
    quit: function () {
        FS.init.initialized = false;
        var fflush = Module["_fflush"];
        if (fflush) fflush(0);
        for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
                continue;
            }
            FS.close(stream);
        }
    },
    getMode: function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
    },
    findObject: function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
            return ret.object;
        } else {
            return null;
        }
    },
    analyzePath: function (path, dontResolveLastLink) {
        try {
            var lookup = FS.lookupPath(path, {follow: !dontResolveLastLink});
            path = lookup.path;
        } catch (e) {}
        var ret = {
            isRoot: false,
            exists: false,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: false,
            parentPath: null,
            parentObject: null,
        };
        try {
            var lookup = FS.lookupPath(path, {parent: true});
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, {follow: !dontResolveLastLink});
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/";
        } catch (e) {
            ret.error = e.errno;
        }
        return ret;
    },
    createPath: function (parent, path, canRead, canWrite) {
        parent = typeof parent === "string" ? parent : FS.getPath(parent);
        var parts = path.split("/").reverse();
        while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
                FS.mkdir(current);
            } catch (e) {}
            parent = current;
        }
        return current;
    },
    createFile: function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(
            typeof parent === "string" ? parent : FS.getPath(parent),
            name,
        );
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
    },
    createDataFile: function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name
            ? PATH.join2(
                  typeof parent === "string" ? parent : FS.getPath(parent),
                  name,
              )
            : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
            if (typeof data === "string") {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i)
                    arr[i] = data.charCodeAt(i);
                data = arr;
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 577);
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode);
        }
        return node;
    },
    createDevice: function (parent, name, input, output) {
        var path = PATH.join2(
            typeof parent === "string" ? parent : FS.getPath(parent),
            name,
        );
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
            open: function (stream) {
                stream.seekable = false;
            },
            close: function (stream) {
                if (output && output.buffer && output.buffer.length) {
                    output(10);
                }
            },
            read: function (stream, buffer, offset, length, pos) {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                    var result;
                    try {
                        result = input();
                    } catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(6);
                    }
                    if (result === null || result === undefined) break;
                    bytesRead++;
                    buffer[offset + i] = result;
                }
                if (bytesRead) {
                    stream.node.timestamp = Date.now();
                }
                return bytesRead;
            },
            write: function (stream, buffer, offset, length, pos) {
                for (var i = 0; i < length; i++) {
                    try {
                        output(buffer[offset + i]);
                    } catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                }
                if (length) {
                    stream.node.timestamp = Date.now();
                }
                return i;
            },
        });
        return FS.mkdev(path, mode, dev);
    },
    forceLoadFile: function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
            return true;
        if (typeof XMLHttpRequest !== "undefined") {
            throw new Error(
                "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.",
            );
        } else if (read_) {
            try {
                obj.contents = intArrayFromString(read_(obj.url), true);
                obj.usedBytes = obj.contents.length;
            } catch (e) {
                throw new FS.ErrnoError(29);
            }
        } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.");
        }
    },
    createLazyFile: function (parent, name, url, canRead, canWrite) {
        function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = [];
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
                return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = (idx / this.chunkSize) | 0;
            return this.getter(chunkNum)[chunkOffset];
        };
        LazyUint8Array.prototype.setDataGetter =
            function LazyUint8Array_setDataGetter(getter) {
                this.getter = getter;
            };
        LazyUint8Array.prototype.cacheLength =
            function LazyUint8Array_cacheLength() {
                var xhr = new XMLHttpRequest();
                xhr.open("HEAD", url, false);
                xhr.send(null);
                if (
                    !(
                        (xhr.status >= 200 && xhr.status < 300) ||
                        xhr.status === 304
                    )
                )
                    throw new Error(
                        "Couldn't load " + url + ". Status: " + xhr.status,
                    );
                var datalength = Number(
                    xhr.getResponseHeader("Content-length"),
                );
                var header;
                var hasByteServing =
                    (header = xhr.getResponseHeader("Accept-Ranges")) &&
                    header === "bytes";
                var usesGzip =
                    (header = xhr.getResponseHeader("Content-Encoding")) &&
                    header === "gzip";
                var chunkSize = 1024 * 1024;
                if (!hasByteServing) chunkSize = datalength;
                var doXHR = function (from, to) {
                    if (from > to)
                        throw new Error(
                            "invalid range (" +
                                from +
                                ", " +
                                to +
                                ") or no bytes requested!",
                        );
                    if (to > datalength - 1)
                        throw new Error(
                            "only " +
                                datalength +
                                " bytes available! programmer error!",
                        );
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url, false);
                    if (datalength !== chunkSize)
                        xhr.setRequestHeader(
                            "Range",
                            "bytes=" + from + "-" + to,
                        );
                    if (typeof Uint8Array != "undefined")
                        xhr.responseType = "arraybuffer";
                    if (xhr.overrideMimeType) {
                        xhr.overrideMimeType(
                            "text/plain; charset=x-user-defined",
                        );
                    }
                    xhr.send(null);
                    if (
                        !(
                            (xhr.status >= 200 && xhr.status < 300) ||
                            xhr.status === 304
                        )
                    )
                        throw new Error(
                            "Couldn't load " + url + ". Status: " + xhr.status,
                        );
                    if (xhr.response !== undefined) {
                        return new Uint8Array(xhr.response || []);
                    } else {
                        return intArrayFromString(xhr.responseText || "", true);
                    }
                };
                var lazyArray = this;
                lazyArray.setDataGetter(function (chunkNum) {
                    var start = chunkNum * chunkSize;
                    var end = (chunkNum + 1) * chunkSize - 1;
                    end = Math.min(end, datalength - 1);
                    if (typeof lazyArray.chunks[chunkNum] === "undefined") {
                        lazyArray.chunks[chunkNum] = doXHR(start, end);
                    }
                    if (typeof lazyArray.chunks[chunkNum] === "undefined")
                        throw new Error("doXHR failed!");
                    return lazyArray.chunks[chunkNum];
                });
                if (usesGzip || !datalength) {
                    chunkSize = datalength = 1;
                    datalength = this.getter(0).length;
                    chunkSize = datalength;
                    out(
                        "LazyFiles on gzip forces download of the whole file when length is accessed",
                    );
                }
                this._length = datalength;
                this._chunkSize = chunkSize;
                this.lengthKnown = true;
            };
        if (typeof XMLHttpRequest !== "undefined") {
            if (!ENVIRONMENT_IS_WORKER)
                throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array();
            Object.defineProperties(lazyArray, {
                length: {
                    get: function () {
                        if (!this.lengthKnown) {
                            this.cacheLength();
                        }
                        return this._length;
                    },
                },
                chunkSize: {
                    get: function () {
                        if (!this.lengthKnown) {
                            this.cacheLength();
                        }
                        return this._chunkSize;
                    },
                },
            });
            var properties = {isDevice: false, contents: lazyArray};
        } else {
            var properties = {isDevice: false, url: url};
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
            node.contents = properties.contents;
        } else if (properties.url) {
            node.contents = null;
            node.url = properties.url;
        }
        Object.defineProperties(node, {
            usedBytes: {
                get: function () {
                    return this.contents.length;
                },
            },
        });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function (key) {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
                FS.forceLoadFile(node);
                return fn.apply(null, arguments);
            };
        });
        stream_ops.read = function stream_ops_read(
            stream,
            buffer,
            offset,
            length,
            position,
        ) {
            FS.forceLoadFile(node);
            var contents = stream.node.contents;
            if (position >= contents.length) return 0;
            var size = Math.min(contents.length - position, length);
            assert(size >= 0);
            if (contents.slice) {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i];
                }
            } else {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents.get(position + i);
                }
            }
            return size;
        };
        node.stream_ops = stream_ops;
        return node;
    },
    createPreloadedFile: function (
        parent,
        name,
        url,
        canRead,
        canWrite,
        onload,
        onerror,
        dontCreateFile,
        canOwn,
        preFinish,
    ) {
        Browser.init();
        var fullname = name
            ? PATH_FS.resolve(PATH.join2(parent, name))
            : parent;
        var dep = getUniqueRunDependency("cp " + fullname);
        function processData(byteArray) {
            function finish(byteArray) {
                if (preFinish) preFinish();
                if (!dontCreateFile) {
                    FS.createDataFile(
                        parent,
                        name,
                        byteArray,
                        canRead,
                        canWrite,
                        canOwn,
                    );
                }
                if (onload) onload();
                removeRunDependency(dep);
            }
            var handled = false;
            Module["preloadPlugins"].forEach(function (plugin) {
                if (handled) return;
                if (plugin["canHandle"](fullname)) {
                    plugin["handle"](byteArray, fullname, finish, function () {
                        if (onerror) onerror();
                        removeRunDependency(dep);
                    });
                    handled = true;
                }
            });
            if (!handled) finish(byteArray);
        }
        addRunDependency(dep);
        if (typeof url == "string") {
            Browser.asyncLoad(
                url,
                function (byteArray) {
                    processData(byteArray);
                },
                onerror,
            );
        } else {
            processData(url);
        }
    },
    indexedDB: function () {
        return (
            window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB
        );
    },
    DB_NAME: function () {
        return "EM_FS_" + window.location.pathname;
    },
    DB_VERSION: 20,
    DB_STORE_NAME: "FILE_DATA",
    saveFilesToDB: function (paths, onload, onerror) {
        onload = onload || function () {};
        onerror = onerror || function () {};
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
            return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
            out("creating db");
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0,
                fail = 0,
                total = paths.length;
            function finish() {
                if (fail == 0) onload();
                else onerror();
            }
            paths.forEach(function (path) {
                var putRequest = files.put(
                    FS.analyzePath(path).object.contents,
                    path,
                );
                putRequest.onsuccess = function putRequest_onsuccess() {
                    ok++;
                    if (ok + fail == total) finish();
                };
                putRequest.onerror = function putRequest_onerror() {
                    fail++;
                    if (ok + fail == total) finish();
                };
            });
            transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
    },
    loadFilesFromDB: function (paths, onload, onerror) {
        onload = onload || function () {};
        onerror = onerror || function () {};
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
            return onerror(e);
        }
        openRequest.onupgradeneeded = onerror;
        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            try {
                var transaction = db.transaction(
                    [FS.DB_STORE_NAME],
                    "readonly",
                );
            } catch (e) {
                onerror(e);
                return;
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0,
                fail = 0,
                total = paths.length;
            function finish() {
                if (fail == 0) onload();
                else onerror();
            }
            paths.forEach(function (path) {
                var getRequest = files.get(path);
                getRequest.onsuccess = function getRequest_onsuccess() {
                    if (FS.analyzePath(path).exists) {
                        FS.unlink(path);
                    }
                    FS.createDataFile(
                        PATH.dirname(path),
                        PATH.basename(path),
                        getRequest.result,
                        true,
                        true,
                        true,
                    );
                    ok++;
                    if (ok + fail == total) finish();
                };
                getRequest.onerror = function getRequest_onerror() {
                    fail++;
                    if (ok + fail == total) finish();
                };
            });
            transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
    },
    absolutePath: function () {
        abort("FS.absolutePath has been removed; use PATH_FS.resolve instead");
    },
    createFolder: function () {
        abort("FS.createFolder has been removed; use FS.mkdir instead");
    },
    createLink: function () {
        abort("FS.createLink has been removed; use FS.symlink instead");
    },
    joinPath: function () {
        abort("FS.joinPath has been removed; use PATH.join instead");
    },
    mmapAlloc: function () {
        abort(
            "FS.mmapAlloc has been replaced by the top level function mmapAlloc",
        );
    },
    standardizePath: function () {
        abort(
            "FS.standardizePath has been removed; use PATH.normalize instead",
        );
    },
};
var SYSCALLS = {
    mappings: {},
    DEFAULT_POLLMASK: 5,
    umask: 511,
    calculateAt: function (dirfd, path, allowEmpty) {
        if (path[0] === "/") {
            return path;
        }
        var dir;
        if (dirfd === -100) {
            dir = FS.cwd();
        } else {
            var dirstream = FS.getStream(dirfd);
            if (!dirstream) throw new FS.ErrnoError(8);
            dir = dirstream.path;
        }
        if (path.length == 0) {
            if (!allowEmpty) {
                throw new FS.ErrnoError(44);
            }
            return dir;
        }
        return PATH.join2(dir, path);
    },
    doStat: function (func, path, buf) {
        try {
            var stat = func(path);
        } catch (e) {
            if (
                e &&
                e.node &&
                PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))
            ) {
                return -54;
            }
            throw e;
        }
        HEAP32[buf >> 2] = stat.dev;
        HEAP32[(buf + 4) >> 2] = 0;
        HEAP32[(buf + 8) >> 2] = stat.ino;
        HEAP32[(buf + 12) >> 2] = stat.mode;
        HEAP32[(buf + 16) >> 2] = stat.nlink;
        HEAP32[(buf + 20) >> 2] = stat.uid;
        HEAP32[(buf + 24) >> 2] = stat.gid;
        HEAP32[(buf + 28) >> 2] = stat.rdev;
        HEAP32[(buf + 32) >> 2] = 0;
        (tempI64 = [
            stat.size >>> 0,
            ((tempDouble = stat.size),
            +Math.abs(tempDouble) >= 1
                ? tempDouble > 0
                    ? (Math.min(
                          +Math.floor(tempDouble / 4294967296),
                          4294967295,
                      ) |
                          0) >>>
                      0
                    : ~~+Math.ceil(
                          (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                      ) >>> 0
                : 0),
        ]),
            (HEAP32[(buf + 40) >> 2] = tempI64[0]),
            (HEAP32[(buf + 44) >> 2] = tempI64[1]);
        HEAP32[(buf + 48) >> 2] = 4096;
        HEAP32[(buf + 52) >> 2] = stat.blocks;
        HEAP32[(buf + 56) >> 2] = (stat.atime.getTime() / 1e3) | 0;
        HEAP32[(buf + 60) >> 2] = 0;
        HEAP32[(buf + 64) >> 2] = (stat.mtime.getTime() / 1e3) | 0;
        HEAP32[(buf + 68) >> 2] = 0;
        HEAP32[(buf + 72) >> 2] = (stat.ctime.getTime() / 1e3) | 0;
        HEAP32[(buf + 76) >> 2] = 0;
        (tempI64 = [
            stat.ino >>> 0,
            ((tempDouble = stat.ino),
            +Math.abs(tempDouble) >= 1
                ? tempDouble > 0
                    ? (Math.min(
                          +Math.floor(tempDouble / 4294967296),
                          4294967295,
                      ) |
                          0) >>>
                      0
                    : ~~+Math.ceil(
                          (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                      ) >>> 0
                : 0),
        ]),
            (HEAP32[(buf + 80) >> 2] = tempI64[0]),
            (HEAP32[(buf + 84) >> 2] = tempI64[1]);
        return 0;
    },
    doMsync: function (addr, stream, len, flags, offset) {
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
    },
    doMkdir: function (path, mode) {
        path = PATH.normalize(path);
        if (path[path.length - 1] === "/")
            path = path.substr(0, path.length - 1);
        FS.mkdir(path, mode, 0);
        return 0;
    },
    doMknod: function (path, mode, dev) {
        switch (mode & 61440) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
                break;
            default:
                return -28;
        }
        FS.mknod(path, mode, dev);
        return 0;
    },
    doReadlink: function (path, buf, bufsize) {
        if (bufsize <= 0) return -28;
        var ret = FS.readlink(path);
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf + len];
        stringToUTF8(ret, buf, bufsize + 1);
        HEAP8[buf + len] = endChar;
        return len;
    },
    doAccess: function (path, amode) {
        if (amode & ~7) {
            return -28;
        }
        var node;
        var lookup = FS.lookupPath(path, {follow: true});
        node = lookup.node;
        if (!node) {
            return -44;
        }
        var perms = "";
        if (amode & 4) perms += "r";
        if (amode & 2) perms += "w";
        if (amode & 1) perms += "x";
        if (perms && FS.nodePermissions(node, perms)) {
            return -2;
        }
        return 0;
    },
    doDup: function (path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest) FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
    },
    doReadv: function (stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[(iov + i * 8) >> 2];
            var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break;
        }
        return ret;
    },
    doWritev: function (stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[(iov + i * 8) >> 2];
            var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
        }
        return ret;
    },
    varargs: undefined,
    get: function () {
        assert(SYSCALLS.varargs != undefined);
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
        return ret;
    },
    getStr: function (ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
    },
    getStreamFromFD: function (fd) {
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        return stream;
    },
    get64: function (low, high) {
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
    },
};
function ___sys_ioctl(fd, op, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (op) {
            case 21509:
            case 21505: {
                if (!stream.tty) return -59;
                return 0;
            }
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508: {
                if (!stream.tty) return -59;
                return 0;
            }
            case 21519: {
                if (!stream.tty) return -59;
                var argp = SYSCALLS.get();
                HEAP32[argp >> 2] = 0;
                return 0;
            }
            case 21520: {
                if (!stream.tty) return -59;
                return -28;
            }
            case 21531: {
                var argp = SYSCALLS.get();
                return FS.ioctl(stream, op, argp);
            }
            case 21523: {
                if (!stream.tty) return -59;
                return 0;
            }
            case 21524: {
                if (!stream.tty) return -59;
                return 0;
            }
            default:
                abort("bad ioctl syscall " + op);
        }
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno;
    }
}
function ___sys_open(path, flags, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var pathname = SYSCALLS.getStr(path);
        var mode = varargs ? SYSCALLS.get() : 0;
        var stream = FS.open(pathname, flags, mode);
        return stream.fd;
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno;
    }
}
function _abort() {
    abort();
}
function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.copyWithin(dest, src, src + num);
}
function emscripten_realloc_buffer(size) {
    try {
        wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1;
    } catch (e) {
        console.error(
            "emscripten_realloc_buffer: Attempted to grow heap from " +
                buffer.byteLength +
                " bytes to " +
                size +
                " bytes, but got error: " +
                e,
        );
    }
}
function _emscripten_resize_heap(requestedSize) {
    var oldSize = HEAPU8.length;
    requestedSize = requestedSize >>> 0;
    assert(requestedSize > oldSize);
    var maxHeapSize = 2147483648;
    if (requestedSize > maxHeapSize) {
        err(
            "Cannot enlarge memory, asked to go up to " +
                requestedSize +
                " bytes, but the limit is " +
                maxHeapSize +
                " bytes!",
        );
        return false;
    }
    for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
        overGrownHeapSize = Math.min(
            overGrownHeapSize,
            requestedSize + 100663296,
        );
        var newSize = Math.min(
            maxHeapSize,
            alignUp(Math.max(requestedSize, overGrownHeapSize), 65536),
        );
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
            return true;
        }
    }
    err(
        "Failed to grow the heap from " +
            oldSize +
            " bytes to " +
            newSize +
            " bytes, not enough memory!",
    );
    return false;
}
var ENV = {};
function getExecutableName() {
    return thisProgram || "./this.program";
}
function getEnvStrings() {
    if (!getEnvStrings.strings) {
        var lang =
            (
                (typeof navigator === "object" &&
                    navigator.languages &&
                    navigator.languages[0]) ||
                "C"
            ).replace("-", "_") + ".UTF-8";
        var env = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG: lang,
            _: getExecutableName(),
        };
        for (var x in ENV) {
            env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
            strings.push(x + "=" + env[x]);
        }
        getEnvStrings.strings = strings;
    }
    return getEnvStrings.strings;
}
function _environ_get(__environ, environ_buf) {
    try {
        var bufSize = 0;
        getEnvStrings().forEach(function (string, i) {
            var ptr = environ_buf + bufSize;
            HEAP32[(__environ + i * 4) >> 2] = ptr;
            writeAsciiToMemory(string, ptr);
            bufSize += string.length + 1;
        });
        return 0;
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return e.errno;
    }
}
function _environ_sizes_get(penviron_count, penviron_buf_size) {
    try {
        var strings = getEnvStrings();
        HEAP32[penviron_count >> 2] = strings.length;
        var bufSize = 0;
        strings.forEach(function (string) {
            bufSize += string.length + 1;
        });
        HEAP32[penviron_buf_size >> 2] = bufSize;
        return 0;
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return e.errno;
    }
}
function _fd_close(fd) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.close(stream);
        return 0;
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return e.errno;
    }
}
function _fd_read(fd, iov, iovcnt, pnum) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = SYSCALLS.doReadv(stream, iov, iovcnt);
        HEAP32[pnum >> 2] = num;
        return 0;
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return e.errno;
    }
}
function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var HIGH_OFFSET = 4294967296;
        var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
        var DOUBLE_LIMIT = 9007199254740992;
        if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
            return -61;
        }
        FS.llseek(stream, offset, whence);
        (tempI64 = [
            stream.position >>> 0,
            ((tempDouble = stream.position),
            +Math.abs(tempDouble) >= 1
                ? tempDouble > 0
                    ? (Math.min(
                          +Math.floor(tempDouble / 4294967296),
                          4294967295,
                      ) |
                          0) >>>
                      0
                    : ~~+Math.ceil(
                          (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                      ) >>> 0
                : 0),
        ]),
            (HEAP32[newOffset >> 2] = tempI64[0]),
            (HEAP32[(newOffset + 4) >> 2] = tempI64[1]);
        if (stream.getdents && offset === 0 && whence === 0)
            stream.getdents = null;
        return 0;
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return e.errno;
    }
}
function _fd_write(fd, iov, iovcnt, pnum) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = SYSCALLS.doWritev(stream, iov, iovcnt);
        HEAP32[pnum >> 2] = num;
        return 0;
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return e.errno;
    }
}
function _setTempRet0(val) {
    setTempRet0(val);
}
function __isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function __arraySum(array, index) {
    var sum = 0;
    for (var i = 0; i <= index; sum += array[i++]) {}
    return sum;
}
var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function __addDays(date, days) {
    var newDate = new Date(date.getTime());
    while (days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (
            leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR
        )[currentMonth];
        if (days > daysInCurrentMonth - newDate.getDate()) {
            days -= daysInCurrentMonth - newDate.getDate() + 1;
            newDate.setDate(1);
            if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1);
            } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1);
            }
        } else {
            newDate.setDate(newDate.getDate() + days);
            return newDate;
        }
    }
    return newDate;
}
function _strftime(s, maxsize, format, tm) {
    var tm_zone = HEAP32[(tm + 40) >> 2];
    var date = {
        tm_sec: HEAP32[tm >> 2],
        tm_min: HEAP32[(tm + 4) >> 2],
        tm_hour: HEAP32[(tm + 8) >> 2],
        tm_mday: HEAP32[(tm + 12) >> 2],
        tm_mon: HEAP32[(tm + 16) >> 2],
        tm_year: HEAP32[(tm + 20) >> 2],
        tm_wday: HEAP32[(tm + 24) >> 2],
        tm_yday: HEAP32[(tm + 28) >> 2],
        tm_isdst: HEAP32[(tm + 32) >> 2],
        tm_gmtoff: HEAP32[(tm + 36) >> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : "",
    };
    var pattern = UTF8ToString(format);
    var EXPANSION_RULES_1 = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y",
    };
    for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(
            new RegExp(rule, "g"),
            EXPANSION_RULES_1[rule],
        );
    }
    var WEEKDAYS = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    var MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    function leadingSomething(value, digits, character) {
        var str = typeof value === "number" ? value.toString() : value || "";
        while (str.length < digits) {
            str = character[0] + str;
        }
        return str;
    }
    function leadingNulls(value, digits) {
        return leadingSomething(value, digits, "0");
    }
    function compareByDay(date1, date2) {
        function sgn(value) {
            return value < 0 ? -1 : value > 0 ? 1 : 0;
        }
        var compare;
        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
            if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate());
            }
        }
        return compare;
    }
    function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
            case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
            case 1:
                return janFourth;
            case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
            case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
            case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
            case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
            case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30);
        }
    }
    function getWeekBasedYear(date) {
        var thisDate = __addDays(
            new Date(date.tm_year + 1900, 0, 1),
            date.tm_yday,
        );
        var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1;
            } else {
                return thisDate.getFullYear();
            }
        } else {
            return thisDate.getFullYear() - 1;
        }
    }
    var EXPANSION_RULES_2 = {
        "%a": function (date) {
            return WEEKDAYS[date.tm_wday].substring(0, 3);
        },
        "%A": function (date) {
            return WEEKDAYS[date.tm_wday];
        },
        "%b": function (date) {
            return MONTHS[date.tm_mon].substring(0, 3);
        },
        "%B": function (date) {
            return MONTHS[date.tm_mon];
        },
        "%C": function (date) {
            var year = date.tm_year + 1900;
            return leadingNulls((year / 100) | 0, 2);
        },
        "%d": function (date) {
            return leadingNulls(date.tm_mday, 2);
        },
        "%e": function (date) {
            return leadingSomething(date.tm_mday, 2, " ");
        },
        "%g": function (date) {
            return getWeekBasedYear(date).toString().substring(2);
        },
        "%G": function (date) {
            return getWeekBasedYear(date);
        },
        "%H": function (date) {
            return leadingNulls(date.tm_hour, 2);
        },
        "%I": function (date) {
            var twelveHour = date.tm_hour;
            if (twelveHour == 0) twelveHour = 12;
            else if (twelveHour > 12) twelveHour -= 12;
            return leadingNulls(twelveHour, 2);
        },
        "%j": function (date) {
            return leadingNulls(
                date.tm_mday +
                    __arraySum(
                        __isLeapYear(date.tm_year + 1900)
                            ? __MONTH_DAYS_LEAP
                            : __MONTH_DAYS_REGULAR,
                        date.tm_mon - 1,
                    ),
                3,
            );
        },
        "%m": function (date) {
            return leadingNulls(date.tm_mon + 1, 2);
        },
        "%M": function (date) {
            return leadingNulls(date.tm_min, 2);
        },
        "%n": function () {
            return "\n";
        },
        "%p": function (date) {
            if (date.tm_hour >= 0 && date.tm_hour < 12) {
                return "AM";
            } else {
                return "PM";
            }
        },
        "%S": function (date) {
            return leadingNulls(date.tm_sec, 2);
        },
        "%t": function () {
            return "\t";
        },
        "%u": function (date) {
            return date.tm_wday || 7;
        },
        "%U": function (date) {
            var janFirst = new Date(date.tm_year + 1900, 0, 1);
            var firstSunday =
                janFirst.getDay() === 0
                    ? janFirst
                    : __addDays(janFirst, 7 - janFirst.getDay());
            var endDate = new Date(
                date.tm_year + 1900,
                date.tm_mon,
                date.tm_mday,
            );
            if (compareByDay(firstSunday, endDate) < 0) {
                var februaryFirstUntilEndMonth =
                    __arraySum(
                        __isLeapYear(endDate.getFullYear())
                            ? __MONTH_DAYS_LEAP
                            : __MONTH_DAYS_REGULAR,
                        endDate.getMonth() - 1,
                    ) - 31;
                var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
                var days =
                    firstSundayUntilEndJanuary +
                    februaryFirstUntilEndMonth +
                    endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2);
            }
            return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00";
        },
        "%V": function (date) {
            var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
            var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
            var firstWeekStartThisYear =
                getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear =
                getFirstWeekStartDate(janFourthNextYear);
            var endDate = __addDays(
                new Date(date.tm_year + 1900, 0, 1),
                date.tm_yday,
            );
            if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
                return "53";
            }
            if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
                return "01";
            }
            var daysDifference;
            if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
                daysDifference =
                    date.tm_yday + 32 - firstWeekStartThisYear.getDate();
            } else {
                daysDifference =
                    date.tm_yday + 1 - firstWeekStartThisYear.getDate();
            }
            return leadingNulls(Math.ceil(daysDifference / 7), 2);
        },
        "%w": function (date) {
            return date.tm_wday;
        },
        "%W": function (date) {
            var janFirst = new Date(date.tm_year, 0, 1);
            var firstMonday =
                janFirst.getDay() === 1
                    ? janFirst
                    : __addDays(
                          janFirst,
                          janFirst.getDay() === 0
                              ? 1
                              : 7 - janFirst.getDay() + 1,
                      );
            var endDate = new Date(
                date.tm_year + 1900,
                date.tm_mon,
                date.tm_mday,
            );
            if (compareByDay(firstMonday, endDate) < 0) {
                var februaryFirstUntilEndMonth =
                    __arraySum(
                        __isLeapYear(endDate.getFullYear())
                            ? __MONTH_DAYS_LEAP
                            : __MONTH_DAYS_REGULAR,
                        endDate.getMonth() - 1,
                    ) - 31;
                var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
                var days =
                    firstMondayUntilEndJanuary +
                    februaryFirstUntilEndMonth +
                    endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2);
            }
            return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00";
        },
        "%y": function (date) {
            return (date.tm_year + 1900).toString().substring(2);
        },
        "%Y": function (date) {
            return date.tm_year + 1900;
        },
        "%z": function (date) {
            var off = date.tm_gmtoff;
            var ahead = off >= 0;
            off = Math.abs(off) / 60;
            off = (off / 60) * 100 + (off % 60);
            return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
        },
        "%Z": function (date) {
            return date.tm_zone;
        },
        "%%": function () {
            return "%";
        },
    };
    for (var rule in EXPANSION_RULES_2) {
        if (pattern.includes(rule)) {
            pattern = pattern.replace(
                new RegExp(rule, "g"),
                EXPANSION_RULES_2[rule](date),
            );
        }
    }
    var bytes = intArrayFromString(pattern, false);
    if (bytes.length > maxsize) {
        return 0;
    }
    writeArrayToMemory(bytes, s);
    return bytes.length - 1;
}
function _strftime_l(s, maxsize, format, tm) {
    return _strftime(s, maxsize, format, tm);
}
var FSNode = function (parent, name, mode, rdev) {
    if (!parent) {
        parent = this;
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev;
};
var readMode = 292 | 73;
var writeMode = 146;
Object.defineProperties(FSNode.prototype, {
    read: {
        get: function () {
            return (this.mode & readMode) === readMode;
        },
        set: function (val) {
            val ? (this.mode |= readMode) : (this.mode &= ~readMode);
        },
    },
    write: {
        get: function () {
            return (this.mode & writeMode) === writeMode;
        },
        set: function (val) {
            val ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
        },
    },
    isFolder: {
        get: function () {
            return FS.isDir(this.mode);
        },
    },
    isDevice: {
        get: function () {
            return FS.isChrdev(this.mode);
        },
    },
});
FS.FSNode = FSNode;
FS.staticInit();
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
var ASSERTIONS = true;
function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(
        stringy,
        u8array,
        0,
        u8array.length,
    );
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
}
var asmLibraryArg = {
    __cxa_atexit: ___cxa_atexit,
    __sys_ioctl: ___sys_ioctl,
    __sys_open: ___sys_open,
    abort: _abort,
    array_bounds_check_error: array_bounds_check_error,
    emscripten_memcpy_big: _emscripten_memcpy_big,
    emscripten_resize_heap: _emscripten_resize_heap,
    environ_get: _environ_get,
    environ_sizes_get: _environ_sizes_get,
    fd_close: _fd_close,
    fd_read: _fd_read,
    fd_seek: _fd_seek,
    fd_write: _fd_write,
    setTempRet0: _setTempRet0,
    strftime_l: _strftime_l,
};
var asm = createWasm();
var ___wasm_call_ctors = (Module["___wasm_call_ctors"] =
    createExportWrapper("__wasm_call_ctors"));
var _emscripten_bind_VoidPtr___destroy___0 = (Module[
    "_emscripten_bind_VoidPtr___destroy___0"
] = createExportWrapper("emscripten_bind_VoidPtr___destroy___0"));
var _emscripten_bind_RewordifyParam_RewordifyParam_2 = (Module[
    "_emscripten_bind_RewordifyParam_RewordifyParam_2"
] = createExportWrapper("emscripten_bind_RewordifyParam_RewordifyParam_2"));
var _emscripten_bind_RewordifyParam_result_0 = (Module[
    "_emscripten_bind_RewordifyParam_result_0"
] = createExportWrapper("emscripten_bind_RewordifyParam_result_0"));
var _emscripten_bind_RewordifyParam___destroy___0 = (Module[
    "_emscripten_bind_RewordifyParam___destroy___0"
] = createExportWrapper("emscripten_bind_RewordifyParam___destroy___0"));
var _emscripten_bind_RewordifyModule_RewordifyModule_0 = (Module[
    "_emscripten_bind_RewordifyModule_RewordifyModule_0"
] = createExportWrapper("emscripten_bind_RewordifyModule_RewordifyModule_0"));
var _emscripten_bind_RewordifyModule_initialize_2 = (Module[
    "_emscripten_bind_RewordifyModule_initialize_2"
] = createExportWrapper("emscripten_bind_RewordifyModule_initialize_2"));
var _emscripten_bind_RewordifyModule_rewordify_1 = (Module[
    "_emscripten_bind_RewordifyModule_rewordify_1"
] = createExportWrapper("emscripten_bind_RewordifyModule_rewordify_1"));
var _emscripten_bind_RewordifyModule___destroy___0 = (Module[
    "_emscripten_bind_RewordifyModule___destroy___0"
] = createExportWrapper("emscripten_bind_RewordifyModule___destroy___0"));
var _main = (Module["_main"] = createExportWrapper("main"));
var _malloc = (Module["_malloc"] = createExportWrapper("malloc"));
var _free = (Module["_free"] = createExportWrapper("free"));
var ___errno_location = (Module["___errno_location"] =
    createExportWrapper("__errno_location"));
var _emscripten_stack_get_end = (Module["_emscripten_stack_get_end"] =
    function () {
        return (_emscripten_stack_get_end = Module[
            "_emscripten_stack_get_end"
        ] =
            Module["asm"]["emscripten_stack_get_end"]).apply(null, arguments);
    });
var _fflush = (Module["_fflush"] = createExportWrapper("fflush"));
var stackSave = (Module["stackSave"] = createExportWrapper("stackSave"));
var stackRestore = (Module["stackRestore"] =
    createExportWrapper("stackRestore"));
var stackAlloc = (Module["stackAlloc"] = createExportWrapper("stackAlloc"));
var _emscripten_stack_init = (Module["_emscripten_stack_init"] = function () {
    return (_emscripten_stack_init = Module["_emscripten_stack_init"] =
        Module["asm"]["emscripten_stack_init"]).apply(null, arguments);
});
var _emscripten_stack_get_free = (Module["_emscripten_stack_get_free"] =
    function () {
        return (_emscripten_stack_get_free = Module[
            "_emscripten_stack_get_free"
        ] =
            Module["asm"]["emscripten_stack_get_free"]).apply(null, arguments);
    });
var dynCall_jiji = (Module["dynCall_jiji"] =
    createExportWrapper("dynCall_jiji"));
var dynCall_viijii = (Module["dynCall_viijii"] =
    createExportWrapper("dynCall_viijii"));
var dynCall_iiiiij = (Module["dynCall_iiiiij"] =
    createExportWrapper("dynCall_iiiiij"));
var dynCall_iiiiijj = (Module["dynCall_iiiiijj"] =
    createExportWrapper("dynCall_iiiiijj"));
var dynCall_iiiiiijj = (Module["dynCall_iiiiiijj"] =
    createExportWrapper("dynCall_iiiiiijj"));
if (!Object.getOwnPropertyDescriptor(Module, "intArrayFromString"))
    Module["intArrayFromString"] = function () {
        abort(
            "'intArrayFromString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "intArrayToString"))
    Module["intArrayToString"] = function () {
        abort(
            "'intArrayToString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "ccall"))
    Module["ccall"] = function () {
        abort(
            "'ccall' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "cwrap"))
    Module["cwrap"] = function () {
        abort(
            "'cwrap' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "setValue"))
    Module["setValue"] = function () {
        abort(
            "'setValue' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getValue"))
    Module["getValue"] = function () {
        abort(
            "'getValue' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "allocate"))
    Module["allocate"] = function () {
        abort(
            "'allocate' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ArrayToString"))
    Module["UTF8ArrayToString"] = function () {
        abort(
            "'UTF8ArrayToString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ToString"))
    Module["UTF8ToString"] = function () {
        abort(
            "'UTF8ToString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8Array"))
    Module["stringToUTF8Array"] = function () {
        abort(
            "'stringToUTF8Array' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8"))
    Module["stringToUTF8"] = function () {
        abort(
            "'stringToUTF8' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF8"))
    Module["lengthBytesUTF8"] = function () {
        abort(
            "'lengthBytesUTF8' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "stackTrace"))
    Module["stackTrace"] = function () {
        abort(
            "'stackTrace' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreRun"))
    Module["addOnPreRun"] = function () {
        abort(
            "'addOnPreRun' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "addOnInit"))
    Module["addOnInit"] = function () {
        abort(
            "'addOnInit' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreMain"))
    Module["addOnPreMain"] = function () {
        abort(
            "'addOnPreMain' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "addOnExit"))
    Module["addOnExit"] = function () {
        abort(
            "'addOnExit' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPostRun"))
    Module["addOnPostRun"] = function () {
        abort(
            "'addOnPostRun' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "writeStringToMemory"))
    Module["writeStringToMemory"] = function () {
        abort(
            "'writeStringToMemory' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "writeArrayToMemory"))
    Module["writeArrayToMemory"] = function () {
        abort(
            "'writeArrayToMemory' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "writeAsciiToMemory"))
    Module["writeAsciiToMemory"] = function () {
        abort(
            "'writeAsciiToMemory' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
Module["addRunDependency"] = addRunDependency;
Module["removeRunDependency"] = removeRunDependency;
if (!Object.getOwnPropertyDescriptor(Module, "FS_createFolder"))
    Module["FS_createFolder"] = function () {
        abort(
            "'FS_createFolder' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
if (!Object.getOwnPropertyDescriptor(Module, "FS_createLink"))
    Module["FS_createLink"] = function () {
        abort(
            "'FS_createLink' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
if (!Object.getOwnPropertyDescriptor(Module, "getLEB"))
    Module["getLEB"] = function () {
        abort(
            "'getLEB' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getFunctionTables"))
    Module["getFunctionTables"] = function () {
        abort(
            "'getFunctionTables' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "alignFunctionTables"))
    Module["alignFunctionTables"] = function () {
        abort(
            "'alignFunctionTables' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "registerFunctions"))
    Module["registerFunctions"] = function () {
        abort(
            "'registerFunctions' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "addFunction"))
    Module["addFunction"] = function () {
        abort(
            "'addFunction' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "removeFunction"))
    Module["removeFunction"] = function () {
        abort(
            "'removeFunction' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper"))
    Module["getFuncWrapper"] = function () {
        abort(
            "'getFuncWrapper' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "prettyPrint"))
    Module["prettyPrint"] = function () {
        abort(
            "'prettyPrint' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "dynCall"))
    Module["dynCall"] = function () {
        abort(
            "'dynCall' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getCompilerSetting"))
    Module["getCompilerSetting"] = function () {
        abort(
            "'getCompilerSetting' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "print"))
    Module["print"] = function () {
        abort(
            "'print' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "printErr"))
    Module["printErr"] = function () {
        abort(
            "'printErr' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getTempRet0"))
    Module["getTempRet0"] = function () {
        abort(
            "'getTempRet0' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "setTempRet0"))
    Module["setTempRet0"] = function () {
        abort(
            "'setTempRet0' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "callMain"))
    Module["callMain"] = function () {
        abort(
            "'callMain' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "abort"))
    Module["abort"] = function () {
        abort(
            "'abort' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "stringToNewUTF8"))
    Module["stringToNewUTF8"] = function () {
        abort(
            "'stringToNewUTF8' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "setFileTime"))
    Module["setFileTime"] = function () {
        abort(
            "'setFileTime' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "emscripten_realloc_buffer"))
    Module["emscripten_realloc_buffer"] = function () {
        abort(
            "'emscripten_realloc_buffer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "ENV"))
    Module["ENV"] = function () {
        abort(
            "'ENV' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_CODES"))
    Module["ERRNO_CODES"] = function () {
        abort(
            "'ERRNO_CODES' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_MESSAGES"))
    Module["ERRNO_MESSAGES"] = function () {
        abort(
            "'ERRNO_MESSAGES' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "setErrNo"))
    Module["setErrNo"] = function () {
        abort(
            "'setErrNo' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "inetPton4"))
    Module["inetPton4"] = function () {
        abort(
            "'inetPton4' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "inetNtop4"))
    Module["inetNtop4"] = function () {
        abort(
            "'inetNtop4' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "inetPton6"))
    Module["inetPton6"] = function () {
        abort(
            "'inetPton6' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "inetNtop6"))
    Module["inetNtop6"] = function () {
        abort(
            "'inetNtop6' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "readSockaddr"))
    Module["readSockaddr"] = function () {
        abort(
            "'readSockaddr' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "writeSockaddr"))
    Module["writeSockaddr"] = function () {
        abort(
            "'writeSockaddr' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "DNS"))
    Module["DNS"] = function () {
        abort(
            "'DNS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getHostByName"))
    Module["getHostByName"] = function () {
        abort(
            "'getHostByName' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "GAI_ERRNO_MESSAGES"))
    Module["GAI_ERRNO_MESSAGES"] = function () {
        abort(
            "'GAI_ERRNO_MESSAGES' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "Protocols"))
    Module["Protocols"] = function () {
        abort(
            "'Protocols' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "Sockets"))
    Module["Sockets"] = function () {
        abort(
            "'Sockets' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getRandomDevice"))
    Module["getRandomDevice"] = function () {
        abort(
            "'getRandomDevice' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "traverseStack"))
    Module["traverseStack"] = function () {
        abort(
            "'traverseStack' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "UNWIND_CACHE"))
    Module["UNWIND_CACHE"] = function () {
        abort(
            "'UNWIND_CACHE' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "withBuiltinMalloc"))
    Module["withBuiltinMalloc"] = function () {
        abort(
            "'withBuiltinMalloc' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgsArray"))
    Module["readAsmConstArgsArray"] = function () {
        abort(
            "'readAsmConstArgsArray' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgs"))
    Module["readAsmConstArgs"] = function () {
        abort(
            "'readAsmConstArgs' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "mainThreadEM_ASM"))
    Module["mainThreadEM_ASM"] = function () {
        abort(
            "'mainThreadEM_ASM' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "jstoi_q"))
    Module["jstoi_q"] = function () {
        abort(
            "'jstoi_q' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "jstoi_s"))
    Module["jstoi_s"] = function () {
        abort(
            "'jstoi_s' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getExecutableName"))
    Module["getExecutableName"] = function () {
        abort(
            "'getExecutableName' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "listenOnce"))
    Module["listenOnce"] = function () {
        abort(
            "'listenOnce' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "autoResumeAudioContext"))
    Module["autoResumeAudioContext"] = function () {
        abort(
            "'autoResumeAudioContext' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "dynCallLegacy"))
    Module["dynCallLegacy"] = function () {
        abort(
            "'dynCallLegacy' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getDynCaller"))
    Module["getDynCaller"] = function () {
        abort(
            "'getDynCaller' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "dynCall"))
    Module["dynCall"] = function () {
        abort(
            "'dynCall' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "callRuntimeCallbacks"))
    Module["callRuntimeCallbacks"] = function () {
        abort(
            "'callRuntimeCallbacks' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "runtimeKeepaliveCounter"))
    Module["runtimeKeepaliveCounter"] = function () {
        abort(
            "'runtimeKeepaliveCounter' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "keepRuntimeAlive"))
    Module["keepRuntimeAlive"] = function () {
        abort(
            "'keepRuntimeAlive' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "runtimeKeepalivePush"))
    Module["runtimeKeepalivePush"] = function () {
        abort(
            "'runtimeKeepalivePush' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "runtimeKeepalivePop"))
    Module["runtimeKeepalivePop"] = function () {
        abort(
            "'runtimeKeepalivePop' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "callUserCallback"))
    Module["callUserCallback"] = function () {
        abort(
            "'callUserCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "maybeExit"))
    Module["maybeExit"] = function () {
        abort(
            "'maybeExit' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "asmjsMangle"))
    Module["asmjsMangle"] = function () {
        abort(
            "'asmjsMangle' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "reallyNegative"))
    Module["reallyNegative"] = function () {
        abort(
            "'reallyNegative' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "unSign"))
    Module["unSign"] = function () {
        abort(
            "'unSign' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "reSign"))
    Module["reSign"] = function () {
        abort(
            "'reSign' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "formatString"))
    Module["formatString"] = function () {
        abort(
            "'formatString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "PATH"))
    Module["PATH"] = function () {
        abort(
            "'PATH' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "PATH_FS"))
    Module["PATH_FS"] = function () {
        abort(
            "'PATH_FS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "SYSCALLS"))
    Module["SYSCALLS"] = function () {
        abort(
            "'SYSCALLS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "syscallMmap2"))
    Module["syscallMmap2"] = function () {
        abort(
            "'syscallMmap2' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "syscallMunmap"))
    Module["syscallMunmap"] = function () {
        abort(
            "'syscallMunmap' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getSocketFromFD"))
    Module["getSocketFromFD"] = function () {
        abort(
            "'getSocketFromFD' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getSocketAddress"))
    Module["getSocketAddress"] = function () {
        abort(
            "'getSocketAddress' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "JSEvents"))
    Module["JSEvents"] = function () {
        abort(
            "'JSEvents' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "registerKeyEventCallback"))
    Module["registerKeyEventCallback"] = function () {
        abort(
            "'registerKeyEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "specialHTMLTargets"))
    Module["specialHTMLTargets"] = function () {
        abort(
            "'specialHTMLTargets' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "maybeCStringToJsString"))
    Module["maybeCStringToJsString"] = function () {
        abort(
            "'maybeCStringToJsString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "findEventTarget"))
    Module["findEventTarget"] = function () {
        abort(
            "'findEventTarget' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "findCanvasEventTarget"))
    Module["findCanvasEventTarget"] = function () {
        abort(
            "'findCanvasEventTarget' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getBoundingClientRect"))
    Module["getBoundingClientRect"] = function () {
        abort(
            "'getBoundingClientRect' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "fillMouseEventData"))
    Module["fillMouseEventData"] = function () {
        abort(
            "'fillMouseEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "registerMouseEventCallback"))
    Module["registerMouseEventCallback"] = function () {
        abort(
            "'registerMouseEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "registerWheelEventCallback"))
    Module["registerWheelEventCallback"] = function () {
        abort(
            "'registerWheelEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "registerUiEventCallback"))
    Module["registerUiEventCallback"] = function () {
        abort(
            "'registerUiEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "registerFocusEventCallback"))
    Module["registerFocusEventCallback"] = function () {
        abort(
            "'registerFocusEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "fillDeviceOrientationEventData"))
    Module["fillDeviceOrientationEventData"] = function () {
        abort(
            "'fillDeviceOrientationEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (
    !Object.getOwnPropertyDescriptor(
        Module,
        "registerDeviceOrientationEventCallback",
    )
)
    Module["registerDeviceOrientationEventCallback"] = function () {
        abort(
            "'registerDeviceOrientationEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "fillDeviceMotionEventData"))
    Module["fillDeviceMotionEventData"] = function () {
        abort(
            "'fillDeviceMotionEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (
    !Object.getOwnPropertyDescriptor(
        Module,
        "registerDeviceMotionEventCallback",
    )
)
    Module["registerDeviceMotionEventCallback"] = function () {
        abort(
            "'registerDeviceMotionEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "screenOrientation"))
    Module["screenOrientation"] = function () {
        abort(
            "'screenOrientation' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "fillOrientationChangeEventData"))
    Module["fillOrientationChangeEventData"] = function () {
        abort(
            "'fillOrientationChangeEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (
    !Object.getOwnPropertyDescriptor(
        Module,
        "registerOrientationChangeEventCallback",
    )
)
    Module["registerOrientationChangeEventCallback"] = function () {
        abort(
            "'registerOrientationChangeEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "fillFullscreenChangeEventData"))
    Module["fillFullscreenChangeEventData"] = function () {
        abort(
            "'fillFullscreenChangeEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (
    !Object.getOwnPropertyDescriptor(
        Module,
        "registerFullscreenChangeEventCallback",
    )
)
    Module["registerFullscreenChangeEventCallback"] = function () {
        abort(
            "'registerFullscreenChangeEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "registerRestoreOldStyle"))
    Module["registerRestoreOldStyle"] = function () {
        abort(
            "'registerRestoreOldStyle' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (
    !Object.getOwnPropertyDescriptor(Module, "hideEverythingExceptGivenElement")
)
    Module["hideEverythingExceptGivenElement"] = function () {
        abort(
            "'hideEverythingExceptGivenElement' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "restoreHiddenElements"))
    Module["restoreHiddenElements"] = function () {
        abort(
            "'restoreHiddenElements' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "setLetterbox"))
    Module["setLetterbox"] = function () {
        abort(
            "'setLetterbox' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "currentFullscreenStrategy"))
    Module["currentFullscreenStrategy"] = function () {
        abort(
            "'currentFullscreenStrategy' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "restoreOldWindowedStyle"))
    Module["restoreOldWindowedStyle"] = function () {
        abort(
            "'restoreOldWindowedStyle' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (
    !Object.getOwnPropertyDescriptor(
        Module,
        "softFullscreenResizeWebGLRenderTarget",
    )
)
    Module["softFullscreenResizeWebGLRenderTarget"] = function () {
        abort(
            "'softFullscreenResizeWebGLRenderTarget' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "doRequestFullscreen"))
    Module["doRequestFullscreen"] = function () {
        abort(
            "'doRequestFullscreen' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "fillPointerlockChangeEventData"))
    Module["fillPointerlockChangeEventData"] = function () {
        abort(
            "'fillPointerlockChangeEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (
    !Object.getOwnPropertyDescriptor(
        Module,
        "registerPointerlockChangeEventCallback",
    )
)
    Module["registerPointerlockChangeEventCallback"] = function () {
        abort(
            "'registerPointerlockChangeEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (
    !Object.getOwnPropertyDescriptor(
        Module,
        "registerPointerlockErrorEventCallback",
    )
)
    Module["registerPointerlockErrorEventCallback"] = function () {
        abort(
            "'registerPointerlockErrorEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "requestPointerLock"))
    Module["requestPointerLock"] = function () {
        abort(
            "'requestPointerLock' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "fillVisibilityChangeEventData"))
    Module["fillVisibilityChangeEventData"] = function () {
        abort(
            "'fillVisibilityChangeEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (
    !Object.getOwnPropertyDescriptor(
        Module,
        "registerVisibilityChangeEventCallback",
    )
)
    Module["registerVisibilityChangeEventCallback"] = function () {
        abort(
            "'registerVisibilityChangeEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "registerTouchEventCallback"))
    Module["registerTouchEventCallback"] = function () {
        abort(
            "'registerTouchEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "fillGamepadEventData"))
    Module["fillGamepadEventData"] = function () {
        abort(
            "'fillGamepadEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "registerGamepadEventCallback"))
    Module["registerGamepadEventCallback"] = function () {
        abort(
            "'registerGamepadEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (
    !Object.getOwnPropertyDescriptor(
        Module,
        "registerBeforeUnloadEventCallback",
    )
)
    Module["registerBeforeUnloadEventCallback"] = function () {
        abort(
            "'registerBeforeUnloadEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "fillBatteryEventData"))
    Module["fillBatteryEventData"] = function () {
        abort(
            "'fillBatteryEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "battery"))
    Module["battery"] = function () {
        abort(
            "'battery' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "registerBatteryEventCallback"))
    Module["registerBatteryEventCallback"] = function () {
        abort(
            "'registerBatteryEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "setCanvasElementSize"))
    Module["setCanvasElementSize"] = function () {
        abort(
            "'setCanvasElementSize' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getCanvasElementSize"))
    Module["getCanvasElementSize"] = function () {
        abort(
            "'getCanvasElementSize' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "polyfillSetImmediate"))
    Module["polyfillSetImmediate"] = function () {
        abort(
            "'polyfillSetImmediate' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "demangle"))
    Module["demangle"] = function () {
        abort(
            "'demangle' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "demangleAll"))
    Module["demangleAll"] = function () {
        abort(
            "'demangleAll' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "jsStackTrace"))
    Module["jsStackTrace"] = function () {
        abort(
            "'jsStackTrace' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "stackTrace"))
    Module["stackTrace"] = function () {
        abort(
            "'stackTrace' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getEnvStrings"))
    Module["getEnvStrings"] = function () {
        abort(
            "'getEnvStrings' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "checkWasiClock"))
    Module["checkWasiClock"] = function () {
        abort(
            "'checkWasiClock' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64"))
    Module["writeI53ToI64"] = function () {
        abort(
            "'writeI53ToI64' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Clamped"))
    Module["writeI53ToI64Clamped"] = function () {
        abort(
            "'writeI53ToI64Clamped' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Signaling"))
    Module["writeI53ToI64Signaling"] = function () {
        abort(
            "'writeI53ToI64Signaling' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Clamped"))
    Module["writeI53ToU64Clamped"] = function () {
        abort(
            "'writeI53ToU64Clamped' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Signaling"))
    Module["writeI53ToU64Signaling"] = function () {
        abort(
            "'writeI53ToU64Signaling' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "readI53FromI64"))
    Module["readI53FromI64"] = function () {
        abort(
            "'readI53FromI64' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "readI53FromU64"))
    Module["readI53FromU64"] = function () {
        abort(
            "'readI53FromU64' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "convertI32PairToI53"))
    Module["convertI32PairToI53"] = function () {
        abort(
            "'convertI32PairToI53' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "convertU32PairToI53"))
    Module["convertU32PairToI53"] = function () {
        abort(
            "'convertU32PairToI53' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "Browser"))
    Module["Browser"] = function () {
        abort(
            "'Browser' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "funcWrappers"))
    Module["funcWrappers"] = function () {
        abort(
            "'funcWrappers' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper"))
    Module["getFuncWrapper"] = function () {
        abort(
            "'getFuncWrapper' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "setMainLoop"))
    Module["setMainLoop"] = function () {
        abort(
            "'setMainLoop' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "FS"))
    Module["FS"] = function () {
        abort(
            "'FS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "mmapAlloc"))
    Module["mmapAlloc"] = function () {
        abort(
            "'mmapAlloc' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "MEMFS"))
    Module["MEMFS"] = function () {
        abort(
            "'MEMFS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "TTY"))
    Module["TTY"] = function () {
        abort(
            "'TTY' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "PIPEFS"))
    Module["PIPEFS"] = function () {
        abort(
            "'PIPEFS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "SOCKFS"))
    Module["SOCKFS"] = function () {
        abort(
            "'SOCKFS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "_setNetworkCallback"))
    Module["_setNetworkCallback"] = function () {
        abort(
            "'_setNetworkCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "tempFixedLengthArray"))
    Module["tempFixedLengthArray"] = function () {
        abort(
            "'tempFixedLengthArray' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "miniTempWebGLFloatBuffers"))
    Module["miniTempWebGLFloatBuffers"] = function () {
        abort(
            "'miniTempWebGLFloatBuffers' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "heapObjectForWebGLType"))
    Module["heapObjectForWebGLType"] = function () {
        abort(
            "'heapObjectForWebGLType' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "heapAccessShiftForWebGLHeap"))
    Module["heapAccessShiftForWebGLHeap"] = function () {
        abort(
            "'heapAccessShiftForWebGLHeap' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "GL"))
    Module["GL"] = function () {
        abort(
            "'GL' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGet"))
    Module["emscriptenWebGLGet"] = function () {
        abort(
            "'emscriptenWebGLGet' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "computeUnpackAlignedImageSize"))
    Module["computeUnpackAlignedImageSize"] = function () {
        abort(
            "'computeUnpackAlignedImageSize' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetTexPixelData"))
    Module["emscriptenWebGLGetTexPixelData"] = function () {
        abort(
            "'emscriptenWebGLGetTexPixelData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetUniform"))
    Module["emscriptenWebGLGetUniform"] = function () {
        abort(
            "'emscriptenWebGLGetUniform' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "webglGetUniformLocation"))
    Module["webglGetUniformLocation"] = function () {
        abort(
            "'webglGetUniformLocation' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (
    !Object.getOwnPropertyDescriptor(
        Module,
        "webglPrepareUniformLocationsBeforeFirstUse",
    )
)
    Module["webglPrepareUniformLocationsBeforeFirstUse"] = function () {
        abort(
            "'webglPrepareUniformLocationsBeforeFirstUse' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "webglGetLeftBracePos"))
    Module["webglGetLeftBracePos"] = function () {
        abort(
            "'webglGetLeftBracePos' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetVertexAttrib"))
    Module["emscriptenWebGLGetVertexAttrib"] = function () {
        abort(
            "'emscriptenWebGLGetVertexAttrib' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "writeGLArray"))
    Module["writeGLArray"] = function () {
        abort(
            "'writeGLArray' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "AL"))
    Module["AL"] = function () {
        abort(
            "'AL' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_unicode"))
    Module["SDL_unicode"] = function () {
        abort(
            "'SDL_unicode' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_ttfContext"))
    Module["SDL_ttfContext"] = function () {
        abort(
            "'SDL_ttfContext' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_audio"))
    Module["SDL_audio"] = function () {
        abort(
            "'SDL_audio' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "SDL"))
    Module["SDL"] = function () {
        abort(
            "'SDL' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_gfx"))
    Module["SDL_gfx"] = function () {
        abort(
            "'SDL_gfx' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "GLUT"))
    Module["GLUT"] = function () {
        abort(
            "'GLUT' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "EGL"))
    Module["EGL"] = function () {
        abort(
            "'EGL' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "GLFW_Window"))
    Module["GLFW_Window"] = function () {
        abort(
            "'GLFW_Window' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "GLFW"))
    Module["GLFW"] = function () {
        abort(
            "'GLFW' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "GLEW"))
    Module["GLEW"] = function () {
        abort(
            "'GLEW' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "IDBStore"))
    Module["IDBStore"] = function () {
        abort(
            "'IDBStore' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "runAndAbortIfError"))
    Module["runAndAbortIfError"] = function () {
        abort(
            "'runAndAbortIfError' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "warnOnce"))
    Module["warnOnce"] = function () {
        abort(
            "'warnOnce' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "stackSave"))
    Module["stackSave"] = function () {
        abort(
            "'stackSave' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "stackRestore"))
    Module["stackRestore"] = function () {
        abort(
            "'stackRestore' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "stackAlloc"))
    Module["stackAlloc"] = function () {
        abort(
            "'stackAlloc' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "AsciiToString"))
    Module["AsciiToString"] = function () {
        abort(
            "'AsciiToString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "stringToAscii"))
    Module["stringToAscii"] = function () {
        abort(
            "'stringToAscii' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "UTF16ToString"))
    Module["UTF16ToString"] = function () {
        abort(
            "'UTF16ToString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF16"))
    Module["stringToUTF16"] = function () {
        abort(
            "'stringToUTF16' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF16"))
    Module["lengthBytesUTF16"] = function () {
        abort(
            "'lengthBytesUTF16' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "UTF32ToString"))
    Module["UTF32ToString"] = function () {
        abort(
            "'UTF32ToString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF32"))
    Module["stringToUTF32"] = function () {
        abort(
            "'stringToUTF32' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF32"))
    Module["lengthBytesUTF32"] = function () {
        abort(
            "'lengthBytesUTF32' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8"))
    Module["allocateUTF8"] = function () {
        abort(
            "'allocateUTF8' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8OnStack"))
    Module["allocateUTF8OnStack"] = function () {
        abort(
            "'allocateUTF8OnStack' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
        );
    };
Module["writeStackCookie"] = writeStackCookie;
Module["checkStackCookie"] = checkStackCookie;
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NORMAL"))
    Object.defineProperty(Module, "ALLOC_NORMAL", {
        configurable: true,
        get: function () {
            abort(
                "'ALLOC_NORMAL' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
            );
        },
    });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_STACK"))
    Object.defineProperty(Module, "ALLOC_STACK", {
        configurable: true,
        get: function () {
            abort(
                "'ALLOC_STACK' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)",
            );
        },
    });
var calledRun;
function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status;
}
var calledMain = false;
dependenciesFulfilled = function runCaller() {
    if (!calledRun) run();
    if (!calledRun) dependenciesFulfilled = runCaller;
};
function callMain(args) {
    assert(
        runDependencies == 0,
        'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])',
    );
    assert(
        __ATPRERUN__.length == 0,
        "cannot call main when preRun functions remain to be called",
    );
    var entryFunction = Module["_main"];
    var argc = 0;
    var argv = 0;
    try {
        var ret = entryFunction(argc, argv);
        exit(ret, true);
    } catch (e) {
        if (e instanceof ExitStatus) {
            return;
        } else if (e == "unwind") {
            return;
        } else {
            var toLog = e;
            if (e && typeof e === "object" && e.stack) {
                toLog = [e, e.stack];
            }
            err("exception thrown: " + toLog);
            quit_(1, e);
        }
    } finally {
        calledMain = true;
    }
}
function stackCheckInit() {
    _emscripten_stack_init();
    writeStackCookie();
}
function run(args) {
    args = args || arguments_;
    if (runDependencies > 0) {
        return;
    }
    stackCheckInit();
    preRun();
    if (runDependencies > 0) {
        return;
    }
    function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        preMain();
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        if (shouldRunNow) callMain(args);
        postRun();
    }
    if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
            setTimeout(function () {
                Module["setStatus"]("");
            }, 1);
            doRun();
        }, 1);
    } else {
        doRun();
    }
    checkStackCookie();
}
Module["run"] = run;
function checkUnflushedContent() {
    var oldOut = out;
    var oldErr = err;
    var has = false;
    out = err = function (x) {
        has = true;
    };
    try {
        var flush = Module["_fflush"];
        if (flush) flush(0);
        ["stdout", "stderr"].forEach(function (name) {
            var info = FS.analyzePath("/dev/" + name);
            if (!info) return;
            var stream = info.object;
            var rdev = stream.rdev;
            var tty = TTY.ttys[rdev];
            if (tty && tty.output && tty.output.length) {
                has = true;
            }
        });
    } catch (e) {}
    out = oldOut;
    err = oldErr;
    if (has) {
        warnOnce(
            "stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.",
        );
    }
}
function exit(status, implicit) {
    EXITSTATUS = status;
    checkUnflushedContent();
    if (implicit && keepRuntimeAlive() && status === 0) {
        return;
    }
    if (keepRuntimeAlive()) {
        if (!implicit) {
            var msg =
                "program exited (with status: " +
                status +
                "), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)";
            err(msg);
        }
    } else {
        exitRuntime();
        if (Module["onExit"]) Module["onExit"](status);
        ABORT = true;
    }
    quit_(status, new ExitStatus(status));
}
if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
    while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
    }
}
var shouldRunNow = true;
if (Module["noInitialRun"]) shouldRunNow = false;
run();
function WrapperObject() {}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module["WrapperObject"] = WrapperObject;
function getCache(__class__) {
    return (__class__ || WrapperObject).__cache__;
}
Module["getCache"] = getCache;
function wrapPointer(ptr, __class__) {
    var cache = getCache(__class__);
    var ret = cache[ptr];
    if (ret) return ret;
    ret = Object.create((__class__ || WrapperObject).prototype);
    ret.ptr = ptr;
    return (cache[ptr] = ret);
}
Module["wrapPointer"] = wrapPointer;
function castObject(obj, __class__) {
    return wrapPointer(obj.ptr, __class__);
}
Module["castObject"] = castObject;
Module["NULL"] = wrapPointer(0);
function destroy(obj) {
    if (!obj["__destroy__"])
        throw "Error: Cannot destroy object. (Did you create it yourself?)";
    obj["__destroy__"]();
    delete getCache(obj.__class__)[obj.ptr];
}
Module["destroy"] = destroy;
function compare(obj1, obj2) {
    return obj1.ptr === obj2.ptr;
}
Module["compare"] = compare;
function getPointer(obj) {
    return obj.ptr;
}
Module["getPointer"] = getPointer;
function getClass(obj) {
    return obj.__class__;
}
Module["getClass"] = getClass;
var ensureCache = {
    buffer: 0,
    size: 0,
    pos: 0,
    temps: [],
    needed: 0,
    prepare: function () {
        if (ensureCache.needed) {
            for (var i = 0; i < ensureCache.temps.length; i++) {
                Module["_free"](ensureCache.temps[i]);
            }
            ensureCache.temps.length = 0;
            Module["_free"](ensureCache.buffer);
            ensureCache.buffer = 0;
            ensureCache.size += ensureCache.needed;
            ensureCache.needed = 0;
        }
        if (!ensureCache.buffer) {
            ensureCache.size += 128;
            ensureCache.buffer = Module["_malloc"](ensureCache.size);
            assert(ensureCache.buffer);
        }
        ensureCache.pos = 0;
    },
    alloc: function (array, view) {
        assert(ensureCache.buffer);
        var bytes = view.BYTES_PER_ELEMENT;
        var len = array.length * bytes;
        len = (len + 7) & -8;
        var ret;
        if (ensureCache.pos + len >= ensureCache.size) {
            assert(len > 0);
            ensureCache.needed += len;
            ret = Module["_malloc"](len);
            ensureCache.temps.push(ret);
        } else {
            ret = ensureCache.buffer + ensureCache.pos;
            ensureCache.pos += len;
        }
        return ret;
    },
    copy: function (array, view, offset) {
        offset >>>= 0;
        var bytes = view.BYTES_PER_ELEMENT;
        switch (bytes) {
            case 2:
                offset >>>= 1;
                break;
            case 4:
                offset >>>= 2;
                break;
            case 8:
                offset >>>= 3;
                break;
        }
        for (var i = 0; i < array.length; i++) {
            view[offset + i] = array[i];
        }
    },
};
function ensureString(value) {
    if (typeof value === "string") {
        var intArray = intArrayFromString(value);
        var offset = ensureCache.alloc(intArray, HEAP8);
        ensureCache.copy(intArray, HEAP8, offset);
        return offset;
    }
    return value;
}
function VoidPtr() {
    throw "cannot construct a VoidPtr, no constructor in IDL";
}
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module["VoidPtr"] = VoidPtr;
VoidPtr.prototype["__destroy__"] = VoidPtr.prototype.__destroy__ = function () {
    var self = this.ptr;
    _emscripten_bind_VoidPtr___destroy___0(self);
};
function RewordifyParam(text, level) {
    ensureCache.prepare();
    if (text && typeof text === "object") text = text.ptr;
    else text = ensureString(text);
    if (level && typeof level === "object") level = level.ptr;
    else level = ensureString(level);
    this.ptr = _emscripten_bind_RewordifyParam_RewordifyParam_2(text, level);
    getCache(RewordifyParam)[this.ptr] = this;
}
RewordifyParam.prototype = Object.create(WrapperObject.prototype);
RewordifyParam.prototype.constructor = RewordifyParam;
RewordifyParam.prototype.__class__ = RewordifyParam;
RewordifyParam.__cache__ = {};
Module["RewordifyParam"] = RewordifyParam;
RewordifyParam.prototype["result"] = RewordifyParam.prototype.result =
    function () {
        var self = this.ptr;
        return UTF8ToString(_emscripten_bind_RewordifyParam_result_0(self));
    };
RewordifyParam.prototype["__destroy__"] = RewordifyParam.prototype.__destroy__ =
    function () {
        var self = this.ptr;
        _emscripten_bind_RewordifyParam___destroy___0(self);
    };
function RewordifyModule() {
    this.ptr = _emscripten_bind_RewordifyModule_RewordifyModule_0();
    getCache(RewordifyModule)[this.ptr] = this;
}
RewordifyModule.prototype = Object.create(WrapperObject.prototype);
RewordifyModule.prototype.constructor = RewordifyModule;
RewordifyModule.prototype.__class__ = RewordifyModule;
RewordifyModule.__cache__ = {};
Module["RewordifyModule"] = RewordifyModule;
RewordifyModule.prototype["initialize"] = RewordifyModule.prototype.initialize =
    function (resourcePath, locale) {
        var self = this.ptr;
        ensureCache.prepare();
        if (resourcePath && typeof resourcePath === "object")
            resourcePath = resourcePath.ptr;
        else resourcePath = ensureString(resourcePath);
        if (locale && typeof locale === "object") locale = locale.ptr;
        else locale = ensureString(locale);
        return !!_emscripten_bind_RewordifyModule_initialize_2(
            self,
            resourcePath,
            locale,
        );
    };
RewordifyModule.prototype["rewordify"] = RewordifyModule.prototype.rewordify =
    function (param) {
        var self = this.ptr;
        if (param && typeof param === "object") param = param.ptr;
        _emscripten_bind_RewordifyModule_rewordify_1(self, param);
    };
RewordifyModule.prototype["__destroy__"] =
    RewordifyModule.prototype.__destroy__ = function () {
        var self = this.ptr;
        _emscripten_bind_RewordifyModule___destroy___0(self);
    };
var SyncFSDriver = (function () {
    function n(a, b, c, e, f, d, k, g) {
        if (FS.isBlkdev(c) || FS.isFIFO(c))
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        l.ops_table ||
            (l.ops_table = {
                dir: {
                    node: {
                        getattr: p,
                        setattr: q,
                        lookup: w,
                        mknod: x,
                        rename: y,
                        unlink: z,
                        rmdir: A,
                        readdir: B,
                        symlink: C,
                    },
                    stream: {llseek: v},
                },
                file: {
                    node: {getattr: p, setattr: q},
                    stream: {llseek: v, read: D, write: E, allocate: F},
                },
                link: {node: {getattr: p, setattr: q, readlink: G}, stream: {}},
                chrdev: {
                    node: {getattr: p, setattr: q},
                    stream: FS.chrdev_stream_ops,
                },
            });
        c = FS.createNode(a, b, c, e);
        c.timestamp = d || Date.now();
        c.metadata = f;
        c.cached = k;
        c.vfs = g;
        FS.isDir(c.mode)
            ? ((c.node_ops = l.ops_table.dir.node),
              (c.stream_ops = l.ops_table.dir.stream),
              (c.contents = {}))
            : FS.isFile(c.mode)
              ? (c.metadata ||
                    ((f = {
                        name: c.name,
                        localPath: `${a.metadata.localPath}/${c.name}`,
                        remotePath: `${a.metadata.remotePath}/${c.name}`,
                        timestamp: c.timestamp,
                        size: 0,
                    }),
                    (c.metadata = f)),
                (c.node_ops = l.ops_table.file.node),
                (c.stream_ops = l.ops_table.file.stream),
                (c.usedBytes = f.size),
                (c.contents = null))
              : FS.isLink(c.mode)
                ? ((c.node_ops = l.ops_table.link.node),
                  (c.stream_ops = l.ops_table.link.stream))
                : FS.isChrdev(c.mode) &&
                  ((c.node_ops = l.ops_table.chrdev.node),
                  (c.stream_ops = l.ops_table.chrdev.stream));
        a && (a.contents[b] = c);
        return c;
    }
    function p(a) {
        var b = {};
        b.dev = FS.isChrdev(a.mode) ? a.id : 1;
        b.ino = a.id;
        b.mode = a.mode;
        b.nlink = 1;
        b.uid = 0;
        b.gid = 0;
        b.rdev = a.rdev;
        FS.isDir(a.mode)
            ? (b.size = 4096)
            : FS.isFile(a.mode)
              ? (b.size = a.usedBytes)
              : FS.isLink(a.mode)
                ? (b.size = a.link.length)
                : (b.size = 0);
        b.atime = new Date(a.timestamp);
        b.mtime = new Date(a.timestamp);
        b.ctime = new Date(a.timestamp);
        b.blksize = 4096;
        b.blocks = Math.ceil(b.size / b.blksize);
        return b;
    }
    function q(a, b) {
        void 0 !== b.mode && (a.mode = b.mode);
        void 0 !== b.timestamp && (a.timestamp = b.timestamp);
        void 0 !== b.size && l.resizeFileStorage(a, b.size);
    }
    function w(a, b) {
        throw FS.genericErrors[ERRNO_CODES.ENOENT];
    }
    function x(a, b, c, e) {
        return l.createNode(a, b, c, e);
    }
    function y(a, b, c) {
        if (FS.isDir(a.mode)) {
            try {
                var e = FS.lookupNode(b, c);
            } catch (d) {}
            if (e)
                for (var f in e.contents)
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        delete a.parent.contents[a.name];
        a.name = c;
        b.contents[c] = a;
        a.parent = b;
    }
    function z(a, b) {
        delete a.contents[b];
    }
    function A(a, b) {
        var c = FS.lookupNode(a, b),
            e;
        for (e in c.contents) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        delete a.contents[b];
    }
    function B(a) {
        var b = [".", ".."],
            c;
        for (c in a.contents) a.contents.hasOwnProperty(c) && b.push(c);
        return b;
    }
    function C(a, b, c) {
        a = l.createNode(a, b, 41471, 0);
        a.link = c;
        return a;
    }
    function G(a) {
        if (!FS.isLink(a.mode)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        return a.link;
    }
    function D(a, b, c, e, f) {
        if (isNaN(f) || (a.node.contents && a.node.contents.size <= f))
            return (a.node.contents = null), 0;
        if (!a.node.contents)
            try {
                if (a.node.vfs)
                    a.node.contents = a.node.vfs.readWithMetadata(
                        a.node.metadata,
                    );
                else {
                    let d = u.root.getFile(a.node.metadata.remotePath, {
                        create: !1,
                    });
                    a.node.contents = d.file();
                }
                if (a.node.cached) {
                    const d = H.readAsArrayBuffer(a.node.contents);
                    a.node.blobcache = new Uint8Array(d);
                }
            } catch (d) {
                return console.error(d), 0;
            }
        if (0 === e) return 0;
        try {
            if (a.node.cached) {
                const g = a.node.blobcache.length;
                f + e > g && (e = g - f);
                0 < e && b.set(a.node.blobcache.subarray(f, f + e), c);
                return e;
            }
            let d = a.node.contents.slice(f, f + e),
                k = H.readAsArrayBuffer(d);
            b.set(new Uint8Array(k), c);
            return d.size;
        } catch (d) {
            console.error(d);
        }
        return 0;
    }
    function E(a, b, c, e, f, d) {
        if (!e)
            return (
                a.node.contents &&
                    ((b = u.root
                        .getFile(a.node.metadata.remotePath, {create: !0})
                        .createWriter()),
                    (c = a.node.contents.slice(0, a.node.usedBytes)),
                    (c = new Blob([c], {type: "application/octet-stream"})),
                    b.truncate(0),
                    b.write(c),
                    (a.node.contents = null)),
                0
            );
        a = a.node;
        0 === f && (a.contents = null);
        l.expandFileStorage(a, f + e);
        if (0 < e) {
            if (b.subarray) a.contents.set(b.subarray(c, c + e), f);
            else for (d = 0; d < e; d++) a.contents[f + d] = b[c + d];
            a.usedBytes = Math.max(a.usedBytes, f + e);
        }
        return e;
    }
    function v(a, b, c) {
        1 === c
            ? (b += a.position)
            : 2 === c && FS.isFile(a.node.mode) && (b += a.node.usedBytes);
        if (0 > b) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        return b;
    }
    function F(a, b, c) {
        l.expandFileStorage(a.node, b + c);
        a.node.usedBytes = Math.max(a.node.usedBytes, b + c);
    }
    function I(a) {
        let b = [a ? u.root.getDirectory(a, {create: !1}) : u.root],
            c = [],
            e = {},
            f = {};
        for (let h = 0; h < b.length; h++) {
            var d = b[h];
            let m = d.createReader();
            var k = [];
            let r = d.getMetadata();
            k = d.fullPath.replace(a, "");
            0 >= k.length && (k = "/");
            let t = null;
            var g = null;
            let J = [];
            t = {
                id: d.fullPath,
                metadata: {
                    name: d.name,
                    localPath: k,
                    remotePath: d.fullPath,
                    timestamp: r.modificationTime.getTime(),
                    size: r.size,
                },
                files: J,
                node: null,
            };
            c.push(t);
            e[t.id] = t;
            do
                for (k = m.readEntries(), d = 0; d < k.length; d++)
                    (g = k[d]),
                        g.isDirectory && b.push(g),
                        g.isFile &&
                            ((r = g.getMetadata()),
                            (g = {
                                id: g.fullPath,
                                metadata: {
                                    name: g.name,
                                    localPath: g.fullPath.replace(a, ""),
                                    remotePath: g.fullPath,
                                    timestamp: r.modificationTime.getTime(),
                                    size: r.size,
                                },
                                parentId: t.id,
                                node: null,
                            }),
                            J.push(g),
                            (f[g.id] = g));
            while (0 < k.length);
        }
        c.sort(function (h, m) {
            return h.localPath < m.localPath
                ? -1
                : h.localPath > m.localPath
                  ? 1
                  : 0;
        });
        return {dirList: c, dirMap: e, fileMap: f};
    }
    let l = null;
    const u = webkitRequestFileSystemSync(PERSISTENT, 268435456),
        H = new FileReaderSync(),
        K = {};
    (function () {
        FS.extensions = FS.extensions || {};
        FS.extensions.mapSyncFS = function (a) {
            FS.mkdirTree(a);
            FS.mount(l, {syncFSPath: a}, a);
        };
        FS.extensions.mapVfsContainer = function (a, b, c) {
            FS.mkdirTree(a);
            FS.mount(l, {vfsContainer: b, cached: c}, a);
        };
        FS.extensions.syncAsyncFS = function (a) {
            var b = I(a).fileMap;
            a = K[a];
            let c = a.fileMap,
                e = {};
            for (var f in b)
                b.hasOwnProperty(f) && (e[f] = {local: null, remote: b[f]});
            for (let d in c)
                c.hasOwnProperty(d) &&
                    (e.hasOwnProperty(d)
                        ? (e[d].local = c[d])
                        : (e[d] = {local: c[d], remote: null}));
            for (let d in e)
                e.hasOwnProperty(d) &&
                    ((b = e[d]),
                    !((b.local && b.remote) || b.local) &&
                        b.remote &&
                        ((b = b.remote), (f = a.dirMap[b.parentId]))) &&
                    (f.files.push(b),
                    (a.fileMap[b.id] = b),
                    (b.node = n(
                        f.node,
                        b.metadata.name,
                        33279,
                        0,
                        b.metadata,
                        b.metadata.timestamp,
                    )));
        };
    })();
    return (l = {
        ops_table: null,
        mount: function (a) {
            const b = !(!a.opts.hasOwnProperty("cached") || !a.opts.cached);
            if (a.opts.hasOwnProperty("syncFSPath")) {
                var c = I(a.opts.syncFSPath);
                var e = c.dirList;
                var f = e;
                var d = {},
                    k = n(
                        null,
                        "/",
                        16895,
                        0,
                        f[0].metadata,
                        f[0].metadata.timestamp,
                    );
                d["/"] = d[""] = k;
                for (var g = 0; g < f.length; g++) {
                    var h = f[g];
                    if ("/" === h.metadata.localPath) h.node = k;
                    else {
                        var m = h.metadata.localPath.split("/");
                        m = `${m.slice(0, m.length - 1).join("/")}`;
                        h.node = n(
                            d[m] || k,
                            h.metadata.name,
                            16895,
                            0,
                            h.metadata,
                            h.metadata.timestamp,
                        );
                        d[h.metadata.localPath] = h.node;
                    }
                }
                f = k;
                for (d = 0; d < e.length; d++)
                    for (k = e[d], g = k.files, h = 0; h < g.length; h++)
                        (m = g[h]),
                            (m.node = n(
                                k.node,
                                m.metadata.name,
                                33279,
                                0,
                                m.metadata,
                                m.metadata.timestamp,
                                b,
                            ));
                K[a.opts.syncFSPath] = c;
                return f;
            }
            if (a.opts.hasOwnProperty("vfsContainer")) {
                c = a = new VfsContainer(a.opts.vfsContainer);
                e = {};
                f = c.dirs;
                d = n(null, "/", 16895, 0, {}, c.timestamp, c);
                e["/"] = e[""] = d;
                for (k = 0; k < f.length; k++)
                    (g = f[k]),
                        "" === g.path
                            ? (g.node = d)
                            : ((h = g.path.split("/")),
                              (h = `${h.slice(0, h.length - 1).join("/")}`),
                              (g.node = n(
                                  e[h] || d,
                                  g.name,
                                  16895,
                                  0,
                                  g.metadata,
                                  g.metadata.timestamp,
                                  c,
                              )),
                              (e[g.path] = g.node));
                c = d;
                e = a.dirs;
                for (f = 0; f < e.length; f++)
                    for (d = e[f], k = d.files, g = 0; g < k.length; g++)
                        (h = k[g]),
                            (h.node = n(
                                d.node,
                                h.name,
                                33279,
                                0,
                                h.metadata,
                                h.metadata.timestamp,
                                b,
                                a,
                            ));
                return c;
            }
            return null;
        },
        createNode: n,
        getFileDataAsRegularArray: function (a) {
            if (a.contents && a.contents.subarray) {
                for (var b = [], c = 0; c < a.usedBytes; ++c)
                    b.push(a.contents[c]);
                return b;
            }
            return a.contents;
        },
        getFileDataAsTypedArray: function (a) {
            return a.contents
                ? a.contents.subarray
                    ? a.contents.subarray(0, a.usedBytes)
                    : new Uint8Array(a.contents)
                : new Uint8Array();
        },
        expandFileStorage: function (a, b) {
            var c = a.contents ? a.contents.length : 0;
            b = 4096 * Math.ceil(b / 4096);
            b <= c ||
                ((c = new Uint8Array(b)),
                a.contents && 0 < a.usedBytes && c.set(a.contents, 0),
                c.fill(0, a.usedBytes),
                (a.contents = c),
                (a.usedBytes = Math.min(a.usedBytes, b)));
        },
        resizeFileStorage: function (a, b) {
            if (b !== a.usedBytes) {
                var c = 4096 * Math.ceil(b / 4096);
                c !== (a.contents ? a.contents.length : 0) &&
                    ((c = new Uint8Array(c)),
                    a.contents && 0 < a.usedBytes && c.set(a.contents, 0),
                    (a.contents = c));
                a.contents && a.contents.fill(0, b);
                a.usedBytes = b;
            }
        },
        node_ops: {
            getattr: p,
            setattr: q,
            lookup: w,
            mknod: x,
            rename: y,
            unlink: z,
            rmdir: A,
            readdir: B,
            symlink: C,
            readlink: G,
        },
        stream_ops: {read: D, write: E, llseek: v, allocate: F},
    });
})();
var VfsContainer = (function () {
    const k = 120 === new Uint8Array(new Uint32Array([305419896]).buffer)[0];
    new Uint8Array(new Uint32Array([305419896]).buffer);
    const h = "function" === typeof FileReaderSync;
    class p {
        constructor() {
            this.m_fileReader = h ? new FileReaderSync() : new FileReader();
        }
        readAsArrayBuffer(a) {
            if (!h) throw Error("Sync FS is not available!");
            return this.m_fileReader.readAsArrayBuffer(a);
        }
        readAsText(a, b) {
            if (!h) throw Error("Sync FS is not available!");
            return this.m_fileReader.readAsText(a, b);
        }
        async readAsArrayBufferAsync(a) {
            if (h) return this.m_fileReader.readAsArrayBuffer(a);
            const b = this;
            return new Promise((c, d) => b.__readAsArrayBuffer(a, c, d));
        }
        async readAsTextAsync(a, b) {
            if (h) return this.m_fileReader.readAsText(a, b);
            const c = this;
            return new Promise((d, e) => c.__readAsText(a, b, d, e));
        }
        __readAsArrayBuffer(a, b, c) {
            const d = this.m_fileReader;
            d.onloadend = function () {
                this.onerror = this.onloadend = null;
                b(this.result);
            };
            d.onerror = function (e) {
                this.onerror = this.onloadend = null;
                c(e);
            };
            d.readAsArrayBuffer(a);
        }
        __readAsText(a, b, c, d) {
            const e = this.m_fileReader;
            e.onloadend = function () {
                this.onerror = this.onloadend = null;
                c(this.result);
            };
            e.onerror = function (f) {
                this.onerror = this.onloadend = null;
                d(f);
            };
            e.readAsText(a, b);
        }
    }
    class l {
        constructor(a) {
            this.m_fileReader = new p();
            this.m_container = a;
            this.m_timestamp = Date.now();
            this.m_content = this.m_header = this.m_priv = null;
        }
        get timestamp() {
            return this.m_timestamp;
        }
        get header() {
            return this.m_header;
        }
        get dirs() {
            return this.m_content.dirs;
        }
        get files() {
            return this.m_content.files;
        }
        dir(a) {
            a = a.split("/").slice(0, -1).join("/");
            return this.m_content.dirsMap.get(a) || null;
        }
        getDirectoryFiles(a) {
            return (a = this.m_content.dirsMap.get(a))
                ? a.files.map((b) => b.path)
                : [];
        }
        __buildContent() {
            var a = this.m_header.content.dirs;
            let b = this.m_header.content.files,
                c = new Map(),
                d = new Map(),
                e = new Map();
            for (var f = 0; f < a.length; f++) {
                var g = a[f];
                g.files = [];
                c.set(g.id, g);
                d.set(g.path, g);
            }
            for (a = 0; a < b.length; a++)
                (f = b[a]),
                    (g = c.get(f.parentId)),
                    e.set(f.path, f),
                    g && g.files.push(f);
            this.m_content = Object.freeze({
                dirs: this.m_header.content.dirs,
                files: this.m_header.content.files,
                dirsMap: d,
                filesMap: e,
            });
        }
        readWithMetadata(a, b, c) {
            b = Math.max(0, void 0 === b ? 0 : b);
            c = void 0 === c ? a.size : c;
            c = Math.max(0, Math.min(c, a.size - b));
            b += this.m_priv.cso + a.offset;
            return this.m_container.slice(b, b + c);
        }
        readFile(a) {
            return (a = this.m_content.filesMap.get(a))
                ? this.readWithMetadata(a.metadata, 0)
                : null;
        }
    }
    class m extends l {
        static fromContainer(a) {
            return new m(a);
        }
        constructor(a) {
            super(a);
            this.__init();
        }
        __init() {
            this.__readPriv();
            this.__readHeader();
            this.__buildContent();
        }
        __readPriv() {
            this.m_priv = Object.freeze({
                v: this.readUInt32LE(0),
                hso: this.readUInt32LE(4),
                hl: this.readUInt32LE(8),
                cso: this.readUInt32LE(12),
            });
        }
        __readHeader() {
            let a = this.readJSON(this.m_priv.hso, this.m_priv.hl);
            this.m_header = Object.freeze(a);
        }
        readUInt32LE(a) {
            a = this.m_fileReader.readAsArrayBuffer(
                this.m_container.slice(a, a + 4),
            );
            return k
                ? new Uint32Array(a)[0]
                : new Uint32Array(
                      new Uint8Array([...new Uint8Array(a).reverse()]).buffer,
                  )[0];
        }
        readText(a, b, c) {
            return this.m_fileReader.readAsText(
                this.m_container.slice(a, a + b),
                c || "UTF-8",
            );
        }
        readJSON(a, b, c) {
            a = this.readText(a, b, c);
            return JSON.parse(a);
        }
        readFileAsText(a, b) {
            return (a = this.readFile(a))
                ? this.m_fileReader.readAsText(a, b || "UTF-8")
                : null;
        }
        readFileAsJSON(a, b) {
            a = this.readFileAsText(a, b);
            return JSON.parse(a);
        }
    }
    class n extends l {
        static async fromContainerAsync(a) {
            a = new n(a);
            await a.__initAsync();
            return a;
        }
        constructor(a) {
            super(a);
        }
        async __initAsync() {
            await this.__readPrivAsync();
            await this.__readHeaderAsync();
            this.__buildContent();
        }
        async __readPrivAsync() {
            let a = await this.readUInt32LEAsync(0),
                b = await this.readUInt32LEAsync(4),
                c = await this.readUInt32LEAsync(8),
                d = await this.readUInt32LEAsync(12);
            this.m_priv = Object.freeze({v: a, hso: b, hl: c, cso: d});
        }
        async __readHeaderAsync() {
            let a = await this.readJSONAsync(this.m_priv.hso, this.m_priv.hl);
            this.m_header = Object.freeze(a);
        }
        async readUInt32LEAsync(a) {
            a = await this.m_fileReader.readAsArrayBufferAsync(
                this.m_container.slice(a, a + 4),
            );
            return k
                ? new Uint32Array(a)[0]
                : new Uint32Array(
                      new Uint8Array([...new Uint8Array(a).reverse()]).buffer,
                  )[0];
        }
        async readTextAsync(a, b, c) {
            return this.m_fileReader.readAsTextAsync(
                this.m_container.slice(a, a + b),
                c || "UTF-8",
            );
        }
        async readJSONAsync(a, b, c) {
            a = await this.readTextAsync(a, b, c);
            return JSON.parse(a);
        }
        async readFileAsTextAsync(a, b) {
            return (a = this.readFile(a))
                ? this.m_fileReader.readAsTextAsync(a, b || "UTF-8")
                : null;
        }
        async readFileAsJSONAsync(a, b) {
            a = await this.readFileAsTextAsync(a, b);
            return JSON.parse(a);
        }
    }
    return h ? m : n;
})();
