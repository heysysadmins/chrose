var Module = {};
const WasmModuleWrapper = (function () {
    var g = null;
    let e = !1,
        c = !1,
        b = void 0;
    Module.locateFile = function (a) {
        return `${g}/${a}`;
    };
    Module.setStatus = function (a) {};
    Module.monitorRunDependencies = function (a) {};
    Module.onRuntimeInitialized = function () {
        e = !0;
        c = !1;
        try {
            b && b(!0);
        } catch (a) {
            console.error(a);
        }
        b = void 0;
    };
    return {
        loadAndInitializeAsync: async function (a) {
            return new Promise(function (d, f) {
                if (e || c) return f(Error("Loading in progress!"));
                c = !0;
                b = d;
                g = a;
                importScripts(`${g}/sr-ocr.js`);
                importScripts("/WebExtensions/filesystem/djiVFS.js");
                importScripts("/WebExtensions/filesystem/djiSyncFSDriver.js");
            });
        },
        getMemoryUsage: function () {
            return Module.HEAP8.byteLength;
        },
        Module,
    };
})();
(function () {
    async function g(c, b) {
        let a = null;
        try {
            await WasmModuleWrapper.loadAndInitializeAsync(c.appDir);
        } catch (d) {
            a = d;
        }
        self.postMessage({message: b, params: {error: a ? a.message : null}});
    }
    let e = void 0;
    self.addEventListener("message", function (c) {
        c = c.data;
        var b = c.message,
            a = c.params;
        c = (c.options || {}).callbackMessage;
        if ("com.donjohnston.cowriter.worker.load" === b) g(a, c);
        else if ("com.donjohnston.cowriter.worker.initialize" === b)
            if (((b = !1), a.language))
                if (a.resourceDirectory) {
                    try {
                        FS.extensions.mapVfsContainer(
                            "/core/resources",
                            a.resourceContainer,
                        );
                        var d = new Module.OcrInitParam();
                        d.setResourcePath("/core/resources");
                        d.setMainLanguage(a.language);
                        e = new Module.OcrModule();
                        b = e.initialize(d);
                    } catch (f) {
                        console.error(f);
                    }
                    self.postMessage({
                        message: c,
                        params: {
                            initialized: b,
                            error: b
                                ? null
                                : "Worker could not be initialized!",
                        },
                    });
                } else
                    self.postMessage({
                        message: c,
                        params: {
                            initialized: b,
                            error: "Missing resource directory parameter!",
                        },
                    });
            else
                self.postMessage({
                    message: c,
                    params: {
                        initialized: b,
                        error: "Missing locale parameter!",
                    },
                });
        else if ("com.donjohnston.sr.worker.ocr" === b) {
            d = new Module.OcrParam();
            d.setLanguage(a.language);
            a = a.imageBytes;
            b = a.byteLength;
            let f = new Module.ByteArray(b);
            0 < b && HEAPU8.set(a, f.bytes());
            d.setImageBytes(f);
            e.ocr(d);
            self.postMessage({
                message: c,
                params: d.result(),
                stats: {memory: WasmModuleWrapper.getMemoryUsage()},
            });
        }
    });
    self.postMessage({
        message: "com.donjohnston.cowriter.worker.ready",
        params: {error: null},
    });
})();
