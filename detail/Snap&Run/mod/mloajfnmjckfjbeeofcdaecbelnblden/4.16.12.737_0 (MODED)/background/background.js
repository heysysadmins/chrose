(function () {
    function l(a, b, d, c, e) {
        let f = -1,
            g = function () {
                dji.utils.checkLastError();
                c.length <= ++f
                    ? e && e()
                    : chrome.tabs.executeScript(
                          a,
                          {file: c[f], frameId: b, runAt: d},
                          g,
                      );
            };
        g();
    }
    function h(a, b, d, c, e) {
        let f = -1,
            g = function () {
                if (chrome.runtime.lastError)
                    return e(chrome.runtime.lastError);
                if (c.length <= ++f) return e();
                chrome.tabs.insertCSS(a, {file: c[f], frameId: b, runAt: d}, g);
            };
        g();
    }
    dji.logger.logLevel(dji.logger.levels.ERROR);
    dji.logger.info(
        '"' +
            chrome.runtime.getManifest().name +
            '" (' +
            chrome.runtime.id +
            ")",
    );
    const k = [];
    dji.logger.monitor({
        event: "load_extension",
        id: chrome.runtime.id,
        version: chrome.runtime.getManifest().version,
        name: chrome.runtime.getManifest().name,
        userAgent: window.navigator.userAgent,
    });
    (function () {
        let a = chrome.runtime
                .getManifest()
                .content_scripts.map((c) => c.exclude_matches)
                .flat(),
            b = new Set(),
            d = null;
        for (let c of a)
            c &&
                !b.has(c) &&
                (b.add(c),
                (d = c
                    .replace(/\//g, "\\/")
                    .replace(/\./g, "\\.")
                    .replace(/\*/g, ".*")),
                (d = new RegExp(`^${d}`, "i")),
                k.push(d));
    })();
    chrome.webNavigation.onDOMContentLoaded.addListener((a) => {
        var b;
        if ((b = 0 !== a.frameId && 0 !== a.url.indexOf("about:"))) {
            a: {
                if ((b = a.url))
                    for (d of k)
                        if (d.test(b)) {
                            var d = !0;
                            break a;
                        }
                d = !1;
            }
            b = !d;
        }
        b &&
            chrome.tabs.executeScript(
                a.tabId,
                {
                    file: "WebExtensions/frames/djiFramePreloader.js",
                    frameId: a.frameId,
                    runAt: "document_end",
                },
                dji.utils.createLastErrorHandler(),
            );
    });
    chrome.runtime.onMessage.addListener(function (a, b, d) {
        if ("com.donjohnston.dji.service.load" === a.message) {
            const c = "over-drive-reader" === a.service;
            d = !c && "ms-office-word-editor" === a.service;
            a = !d && "canvas-lms" === a.service;
            c &&
                chrome.tabs.executeScript(
                    b.tab.id,
                    {
                        file: "contentScripts/overDriveMainFrameInstaller.js",
                        frameId: 0,
                        runAt: "document_end",
                    },
                    dji.utils.createLastErrorHandler(),
                );
            if (c || a || d)
                (a =
                    "WebExtensions/thirdParty/cryptojs/md5.js libs/core-lib-utils.umd.js common/core-lib-utils-adapter.js WebExtensions/utils/timer.js common/ui/effects.js contentScripts/mainContainer.js contentScripts/speech.js libs/core-lib-text-mapper.umd.js common/core-lib-text-mapper-adapter.js WebExtensions/frames/frameManager.js contentScripts/overlay.js WebExtensions/ui/djiDOMExtensions.js contentScripts/helpers/geometryController.js contentScripts/sruToast.js".split(
                        " ",
                    )),
                    d &&
                        (a.push("libs/core-lib-text-mapper-msoffice.umd.js"),
                        a.push("thirdParty/mark/mark.min.js")),
                    l(b.tab.id, b.frameId, "document_end", a),
                    h(
                        b.tab.id,
                        b.frameId,
                        "document_end",
                        "common/ui/effects.css contentScripts/mainContainer.css contentScripts/screenSelection.css contentScripts/speech.css contentScripts/defineWord.css contentScripts/removeDistractions.css contentScripts/overlay.css contentScripts/helpers/geometryController.css contentScripts/cursors.css".split(
                            " ",
                        ),
                        function (e) {
                            e &&
                                dji.logger.error(
                                    "Could not inject CSS into tab ",
                                    b.tab,
                                    " / ",
                                    e.message,
                                    " / ",
                                    e,
                                );
                        },
                    );
        }
    });
    chrome.runtime.onMessage.addListener(function (a, b, d) {
        if (a.message === window.dji.messages.sru.content_script.CSS_READY)
            return (
                h(
                    b.tab.id,
                    0,
                    "document_start",
                    "common/ui/effects.css contentScripts/mainContainer.css contentScripts/screenSelection.css contentScripts/speech.css contentScripts/defineWord.css contentScripts/removeDistractions.css contentScripts/overlay.css contentScripts/helpers/geometryController.css contentScripts/cursors.css".split(
                        " ",
                    ),
                    function (c) {
                        c &&
                            dji.logger.error(
                                "Could not inject CSS into tab ",
                                b.tab,
                                " / ",
                                c.message,
                                " / ",
                                c,
                            );
                        d({message: a.message, params: {allowed: !c}});
                    },
                ),
                !0
            );
    });
    (async function () {
        dji.logger.monitor({
            event: "init_extension_wait",
            doc_state: document.readyState,
        });
        await dji.utils.waitDOMContentLoaded();
        dji.logger.monitor({
            event: "init_extension_start",
            doc_state: document.readyState,
        });
        sru.backgroundManager.initialize();
        dji.logger.monitor({
            event: "init_extension_called",
            doc_state: document.readyState,
        });
    })();
})();
