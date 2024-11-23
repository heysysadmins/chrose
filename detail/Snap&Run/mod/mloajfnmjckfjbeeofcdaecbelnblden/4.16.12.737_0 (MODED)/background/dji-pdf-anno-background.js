window.dji = window.dji || {};
(function (k) {
    function e(a) {
        chrome.tabs.get(a, function (b) {
            dji.utils.checkLastError();
            b &&
                b.url &&
                !b.url.startsWith("chrome:") &&
                l(b.url) &&
                m(b) &&
                q(b.id, b.url);
        });
    }
    function q(a, b) {
        chrome.extension.isAllowedFileSchemeAccess(function (c) {
            c && ((c = n({url: b})), chrome.tabs.update(a, {url: c}));
        });
    }
    function l(a) {
        a = a.toLowerCase();
        return a.startsWith("file://") && a.endsWith(".pdf");
    }
    function m(a) {
        if (f)
            try {
                return f(a);
            } catch (b) {
                dji.logger.error(b);
            }
        return !0;
    }
    function n(a) {
        return g instanceof Function ? g(a) : null;
    }
    chrome.windows.getAll({populate: !0}, function (a) {
        for (let b = 0; b < a.length; b++)
            if (a[b].tabs)
                for (let c = 0; c < a[b].tabs.length; c++) e(a[b].tabs[c].id);
    });
    chrome.tabs.onUpdated.addListener(e);
    chrome.tabs.onActivated.addListener(function (a) {
        e(a.tabId);
    });
    chrome.tabs.onReplaced.addListener(function (a) {
        e(a);
    });
    chrome.webRequest.onBeforeSendHeaders.addListener(
        function (a) {
            if (dji.login.isLoggedIn()) {
                var b = new URL(a.url);
                try {
                    const c = new URL(dji.config.pdfOrbitNoteUrl());
                    if (
                        "sub_frame" !== a.type &&
                        "sub_frame" !== a.frameType &&
                        b.hostname === c.hostname &&
                        b.searchParams.get("file") &&
                        !b.searchParams.has("waitForExtension")
                    ) {
                        const d = a.initiator ? new URL(a.initiator) : null;
                        d &&
                            d.hostname === c.hostname &&
                            chrome.tabs.update(a.tabId, {
                                url: a.url + "&waitForExtension=true",
                            });
                    }
                } catch (c) {
                    console.error(c);
                }
            }
        },
        {urls: ["<all_urls>"]},
        ["blocking", "requestHeaders"],
    );
    chrome.webRequest.onHeadersReceived.addListener(
        function (a) {
            if (m(a)) {
                var b = !1,
                    c = !1;
                if (0 < a.tabId)
                    for (let d = 0; d < a.responseHeaders.length; ++d) {
                        let p = a.responseHeaders[d].name.toLowerCase(),
                            h = a.responseHeaders[d].value.toLowerCase();
                        "content-type" === p &&
                            0 <= h.indexOf("application/pdf") &&
                            (b = !0);
                        "content-disposition" === p &&
                            (0 <= h.indexOf("filename") ||
                                0 <= h.indexOf("attachment")) &&
                            (c = !0);
                    }
                return ((b && !c) || l(a.url)) && "main_frame" === a.type
                    ? ((a = n({url: a.url})) && {redirectUrl: a}) || void 0
                    : {responseHeaders: a.responseHeaders};
            }
        },
        {urls: ["<all_urls>"]},
        ["responseHeaders", "blocking"],
    );
    let f = null,
        g = null;
    k.__djiPdfExtSetGreenlightHandler = function (a) {
        f = a;
    };
    k.setComputePdfViewerUrlHandler = function (a) {
        g = a;
    };
})((window.dji.pdf = window.dji.pdf || {}));
