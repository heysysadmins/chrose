var Module = {};
const WasmModuleWrapper = (function () {
    var g = null;
    let h = !1,
        d = !1,
        e = void 0;
    Module.locateFile = function (a) {
        return `${g}/${a}`;
    };
    Module.setStatus = function (a) {};
    Module.monitorRunDependencies = function (a) {};
    Module.onRuntimeInitialized = function () {
        h = !0;
        d = !1;
        try {
            e && e(!0);
        } catch (a) {
            console.error(a);
        }
        e = void 0;
    };
    return {
        loadAndInitializeAsync: async function (a) {
            return new Promise(function (b, c) {
                if (h || d) return c(Error("Loading in progress!"));
                d = !0;
                e = b;
                g = a;
                importScripts(`${g}/sr-definition.js`);
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
    async function g(a, b) {
        let c = null;
        try {
            await WasmModuleWrapper.loadAndInitializeAsync(a.appDir);
        } catch (f) {
            c = f;
        }
        self.postMessage({message: b, params: {error: c ? c.message : null}});
    }
    function h(a) {
        if (!a) return null;
        let b = [],
            c = a.size();
        for (let f = 0; f < c; f++) b.push(a.get(f));
        return b;
    }
    let d = void 0,
        e = void 0;
    self.addEventListener("message", function (a) {
        var b = a.data,
            c = b.message;
        a = b.params;
        b = (b.options || {}).callbackMessage;
        if ("com.donjohnston.cowriter.worker.load" === c) g(a, b);
        else if ("com.donjohnston.cowriter.worker.initialize" === c)
            if (((c = !1), a.language))
                if (a.resourceDirectory) {
                    try {
                        FS.extensions.mapVfsContainer(
                            "/resources",
                            a.resourceContainer,
                            !0,
                        ),
                            (e = a.sensitiveWords),
                            (d = new Module.WordnetModule()),
                            (c = d.initialize("/resources/"));
                    } catch (f) {
                        console.error(f);
                    }
                    self.postMessage({
                        message: b,
                        params: {
                            initialized: c,
                            error: c
                                ? null
                                : "Worker could not be initialized!",
                        },
                    });
                } else
                    self.postMessage({
                        message: b,
                        params: {
                            initialized: c,
                            error: "Missing resource directory parameter!",
                        },
                    });
            else
                self.postMessage({
                    message: b,
                    params: {
                        initialized: c,
                        error: "Missing locale parameter!",
                    },
                });
        else
            "com.donjohnston.sr.worker.searchWord" === c &&
                (e && e.hasOwnProperty(a.text.trim().toUpperCase())
                    ? self.postMessage({
                          message: b,
                          params: {
                              text: void 0,
                              bestSense: void 0,
                              baseSenses: void 0,
                              senses: void 0,
                          },
                          stats: {memory: WasmModuleWrapper.getMemoryUsage()},
                      })
                    : ((a = d ? d.searchWord(a.text) : null),
                      self.postMessage({
                          message: b,
                          params: {
                              text: a.text(),
                              bestSense: a.bestSense(),
                              baseSenses: h(a.baseSenses()),
                              senses: h(a.senses()),
                          },
                          stats: {memory: WasmModuleWrapper.getMemoryUsage()},
                      })));
    });
    self.postMessage({
        message: "com.donjohnston.cowriter.worker.ready",
        params: {error: null},
    });
})();
