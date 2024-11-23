window.sru = window.sru || {};
window.sru.native = (function () {
    async function t() {
        try {
            await u();
            if (!g) {
                let a = e.ocr;
                g = new SREOcrWorkerProxy({
                    url: "sreOcrWorker.js",
                    appDir: "/WebAssembly",
                    memThreshold: 536870912,
                });
                g.configure(
                    {
                        language: "eng",
                        resourceDirectory: "/eng/ocr",
                        resourceContainer: a,
                    },
                    !0,
                );
            }
            await g.initAsync();
        } catch (a) {
            throw ((g = null), dji.logger.error(a), a);
        }
    }
    async function u() {
        null === e.hunspell && (e.hunspell = await p("hunspell.pvfs"));
        null === e.ocr && (e.ocr = await p("sr-ocr.pvfs"));
    }
    async function p(a) {
        let c = null;
        try {
            const b = `${"WebAssembly"}/${a}`,
                k = await new Promise((f) =>
                    chrome.runtime.getPackageDirectoryEntry((l) => f(l)),
                ),
                d = await new Promise((f, l) => {
                    k.getFile(
                        b,
                        {create: !1},
                        function (v) {
                            f(v);
                        },
                        l,
                    );
                });
            c = await new Promise((f, l) => d.file(f, l));
        } catch (b) {
            throw (dji.logger.error(b), b);
        }
        return c;
    }
    function q(a) {
        const c = {},
            b = /\s+/;
        a = Object.values(a);
        for (let k of a) {
            a = k.split(b);
            for (let d of a)
                (a = d.trim().toUpperCase()), 0 < a.length && (c[a] = !0);
        }
        return c;
    }
    async function w() {
        try {
            await x();
            if (!h) {
                let a = e.wordnet;
                h = new SREWordDefinitionWorkerProxy({
                    url: "sreWordDefinitionWorker.js",
                    appDir: "/WebAssembly",
                });
                h.configure(
                    {
                        language: "eng",
                        resourceDirectory: "/eng/wordnet",
                        resourceContainer: a,
                        sensitiveWords: n,
                    },
                    !0,
                );
            }
            await h.initAsync();
        } catch (a) {
            throw ((h = null), dji.logger.error(a), a);
        }
    }
    async function x() {
        e.wordnet || (e.wordnet = await p("sr-definition.pvfs"));
    }
    function r(a) {
        null === g || (a && !g.isBusy) || (g.terminate(), (g = null));
    }
    let h = null,
        g = null,
        n = null,
        m = null,
        e = {wordnet: null, ocr: null, hunspell: null};
    return {
        rewordifyAsync: async function (a, c) {
            let b = null;
            try {
                return (
                    (b = new window.__RewordifyAPI.Rewordify(
                        "worker",
                        "/WebAssembly",
                        "/libs",
                    )),
                    await b.rewordify(c, a)
                );
            } finally {
                b && b.dispose();
            }
        },
        searchWordAsync: async function (a) {
            await w();
            return h.searchWord(Date.now(), a);
        },
        reloadSensitiveWordsAsync: async function (a, c) {
            m = n = null;
            try {
                window.dji.logger.monitor({event: "pe_load_sensitive_words"});
                var b = await a.directoryExistsAsync(c);
                window.dji.logger.monitor({
                    event: "pe_load_sensitive_words_and_images 1",
                    hasData: b,
                });
                if (b) {
                    b = {};
                    var k = await a.readFileAsJSONAsync(`${c}/manifest.json`);
                    if (k && k.files) {
                        for (let d of k.dataDefinition.sensitiveWords.en)
                            try {
                                window.dji.logger.monitor({
                                    event: "pe_load_sensitive_words 2",
                                    file: `${c}/${d}`,
                                }),
                                    (b[d] = await a.readFileAsTextAsync(
                                        `${c}/${d}`,
                                    ));
                            } catch (f) {
                                window.dji.logger.monitor({
                                    event: "pe_load_sensitive_words 3",
                                    file: `${c}/${d}`,
                                    error: f,
                                }),
                                    window.dji.logger.error(f);
                            }
                        n = q(b);
                        b = {};
                        for (let d of k.dataDefinition.sensitiveImages.en)
                            try {
                                window.dji.logger.monitor({
                                    event: "pe_load_sensitive_images 2",
                                    file: `${c}/${d}`,
                                }),
                                    (b[d] = await a.readFileAsTextAsync(
                                        `${c}/${d}`,
                                    ));
                            } catch (f) {
                                window.dji.logger.monitor({
                                    event: "pe_load_sensitive_images 3",
                                    file: `${c}/${d}`,
                                    error: f,
                                }),
                                    window.dji.logger.error(f);
                            }
                        m = q(b);
                    }
                }
            } catch (d) {
                window.dji.logger.error(d);
            }
        },
        hasSensitiveWords: function () {
            return !!n || !!m;
        },
        isSensitiveImage: function (a) {
            return a ? !(!m || !m[a.toUpperCase().trim()]) : !1;
        },
        ocrAsync: async function (a) {
            r(!0);
            await t();
            return g.ocrAsync(Date.now(), a);
        },
        closeWorkers: function () {
            null !== h && (h.terminate(), (h = null));
            r();
            e.wordnet = null;
            e.hunspell = null;
            e.ocr = null;
        },
    };
})();
