window.dji = window.dji || {};
(function (g) {
    function x(a) {
        p = a;
        chrome.tabs.query({active: !0, windowId: a}, function (c) {
            let b = -1;
            0 < c.length && (b = c[0].id);
            h !== b && ((c = 0 > h ? null : h), (h = b), q(h, c));
        });
    }
    function y(a) {
        l(a.id, a.windowId, {status: a.status, url: a.url});
        var c = a.id;
        for (let b = 0; b < f.tabCreated.length; b++) m(f.tabCreated[b], c, a);
    }
    function z(a, c, b) {
        if ("loading" === c.status || "complete" === c.status) {
            var d = l(b.id, b.windowId, c);
            for (let e = 0; e < f.tabUpdated.length; e++)
                m(f.tabUpdated[e], a, d, c, b);
        }
    }
    function A(a) {
        if (h !== a.tabId) {
            0 <= h && l(h, void 0, {active: !1});
            l(a.tabId, a.windowId, {active: !0});
            var c = 0 > h ? null : h;
            h = a.tabId;
            h !== c && q(h, c);
        }
    }
    function B(a, c) {
        a in k && ((c = k[a].port), c in n && delete n[c], delete k[a]);
        for (c = 0; c < f.tabRemoved.length; c++) m(f.tabRemoved[c], a);
    }
    function C(a) {
        0 === a.frameId && l(a.tabId, void 0, a);
    }
    function D(a) {
        if (k.hasOwnProperty(a.tabId)) {
            let c = void 0;
            for (let b = 0; b < a.responseHeaders.length; b++) {
                let d = a.responseHeaders[b];
                if ("content-type" === d.name.toLowerCase()) {
                    c = d.value.toLowerCase();
                    break;
                }
            }
            l(
                a.tabId,
                void 0,
                {contentType: c},
                {isPdf: !(!c || !r.pdfContentType.test(c))},
            );
        }
    }
    function E(a) {
        if ("__dji__sru_port" === a.name && a.sender && a.sender.tab) {
            l(a.sender.tab.id, a.sender.tab.windowId, {port: a});
            var c = a.sender.tab.id;
            k[c].port = a;
            n[a] = c;
            a.onDisconnect.addListener(function () {
                c in k && (k[c].port = null);
                a in n && delete n[a];
                var b = [k[c]];
                for (let d = 0; d < f.portDisconnected.length; d++)
                    m(f.portDisconnected[d], c, ...b);
            });
            a.onMessage.addListener(function (b) {
                var d = b.message;
                b = b.params;
                for (let e = 0; e < f.tabMessage.length; e++)
                    m(f.tabMessage[e], c, d, b);
            });
        }
    }
    function l(a, c, b, d) {
        if (k.hasOwnProperty(a)) {
            var e = k[a];
            void 0 !== c && null !== c && (e.windowId = c);
            if (b) {
                b.hasOwnProperty("active") && (e.active = !!b.active);
                b.hasOwnProperty("status") && (e.status = b.status);
                if (b.hasOwnProperty("url"))
                    try {
                        (e.url = new URL(b.url)),
                            !t(e.url) ||
                                (d && d.hasOwnProperty("isPdf")) ||
                                (e.extras.isPdf = u(e.url)),
                            (e.isSpecialUrl = v(e.url, e.contentType));
                    } catch (w) {
                        dji.logger.error(w), (e.url = null);
                    }
                b.hasOwnProperty("contentType") &&
                    (e.contentType = b.contentType);
                b.hasOwnProperty("port") && (e.port = b.port);
                b.hasOwnProperty("userData") && (e.userData = b.userData);
            }
            d && d.hasOwnProperty("isPdf") && (e.extras.isPdf = !!d.isPdf);
        } else {
            b = b || {};
            d = d || {};
            e = null;
            if (b.url)
                try {
                    e = new URL(b.url);
                } catch (w) {}
            k[a] = {
                tabId: a,
                windowId: c,
                active: !!b.active,
                status: b.status || null,
                url: e,
                contentType: b.contentType || null,
                port: b.port || null,
                userData: b.userData || null,
                isSpecialUrl: v(e, b.contentType),
                extras: {isPdf: !!d.isPdf},
            };
            t(e) && !d.hasOwnProperty("isPdf") && (k[a].extras.isPdf = u(e));
        }
        return k[a];
    }
    function v(a, c) {
        return c && r.pdfContentType.test(c)
            ? !0
            : a
              ? dji.utils.isGoogleDrive(a) ||
                dji.utils.isYahooMail(a) ||
                dji.utils.isGoogleDocs(a) ||
                dji.utils.isAmazonKindle(a) ||
                dji.utils.isBookshareBook(a) ||
                dji.utils.isLoginApp(a) ||
                dji.utils.isGoogleHangouts(a) ||
                dji.utils.isGoogleMail(a) ||
                dji.utils.isMicrosoftMail(a) ||
                dji.utils.isEvernote(a) ||
                dji.utils.isFacebook(a) ||
                dji.utils.isTwitter(a) ||
                dji.utils.isSru(a) ||
                u(a) ||
                dji.utils.isYoutube(a) ||
                dji.utils.isMicrosoftOffice(a) ||
                dji.utils.isGoogleSlides(a) ||
                dji.utils.isOverDriveReader(a)
              : !1;
    }
    function t(a) {
        return a ? "file:" === a.protocol : !1;
    }
    function u(a) {
        return t(a) && r.pdf.test(a.pathname);
    }
    function q(a, c) {
        for (let b = 0; b < f.tabChanged.length; b++) m(f.tabChanged[b], a, c);
    }
    function m(a) {
        if (a)
            try {
                a.apply(this, [].slice.call(arguments).splice(1));
            } catch (c) {
                dji.logger.error(c);
            }
    }
    let k = {},
        n = {},
        p = -1,
        h = -1,
        r = {pdf: /^.*\.pdf$/i, pdfContentType: /^\s*application\/pdf\s*[;]*/i},
        f = {
            tabCreated: [],
            tabChanged: [],
            tabUpdated: [],
            tabRemoved: [],
            tabMessage: [],
            portDisconnected: [],
        };
    g.initialize = function (a) {
        chrome.tabs.query({}, function (c) {
            chrome.windows.getCurrent(null, function (b) {
                if (b)
                    for (p = b.id, b = 0; b < c.length; b++) {
                        let d = c[b];
                        l(d.id, d.windowId, d);
                        d.active && d.windowId === p && (h = d.id);
                    }
                chrome.windows.onFocusChanged.addListener(x);
                chrome.tabs.onCreated.addListener(y);
                chrome.tabs.onUpdated.addListener(z);
                chrome.tabs.onActivated.addListener(A);
                chrome.tabs.onRemoved.addListener(B);
                chrome.webNavigation.onBeforeNavigate.addListener(C);
                chrome.webRequest.onHeadersReceived.addListener(
                    D,
                    {urls: ["<all_urls>"], types: ["main_frame"]},
                    ["responseHeaders"],
                );
                chrome.runtime.onConnect.addListener(E);
                setTimeout(a, 0);
            });
        });
    };
    g.detectActiveTab = function (a) {
        chrome.windows.getLastFocused({populate: !0}, function (c) {
            var b = c.tabs;
            c = null;
            for (let d = 0; d < b.length; d++) {
                let e = b[d];
                if (e.active) {
                    c = e;
                    break;
                }
            }
            0 <= h && l(h, void 0, {active: !1});
            c && l(c.id, c.windowId, {active: !0});
            b = 0 > h ? null : h;
            h = c ? c.id : -1;
            q(h, b);
            a(g.activeTab());
        });
    };
    g.detectActiveTabAsync = async function () {
        return new Promise((a) => g.detectActiveTab(a));
    };
    g.tab = function (a) {
        return k[a];
    };
    g.activeTab = function () {
        return 0 > h ? null : k[h];
    };
    g.activeTabId = function () {
        return 0 > h ? null : h;
    };
    g.userDataForTab = function (a) {
        return k.hasOwnProperty(a) ? k[a].userData : null;
    };
    g.setUserDataForTab = function (a, c) {
        k.hasOwnProperty(a) && (k[a].userData = c);
    };
    g.sendTabMessage = function (a, c, b, d) {
        a = a || h;
        0 <= a &&
            chrome.tabs.sendMessage(a, {message: {message: c, params: b}}, d);
    };
    g.broadcastTabMessage = function (a, c) {
        chrome.tabs.query({}, function (b) {
            for (let d = 0; d < b.length; d++)
                chrome.tabs.sendMessage(b[d].id, {
                    message: {message: a, params: c},
                });
        });
    };
    g.broadcastTabMessageEx = function (a, c, b) {
        chrome.tabs.query({}, function (d) {
            for (let e = 0; e < d.length; e++)
                e !== a &&
                    chrome.tabs.sendMessage(d[e].id, {
                        message: {message: c, params: b},
                    });
        });
    };
    g.sendPortMessage = function (a, c, b) {
        a = a || h;
        0 <= a &&
            k.hasOwnProperty(a) &&
            k[a].port &&
            k[a].port.postMessage({message: c, params: b});
    };
    g.addTabCreatedListener = function (a) {
        a &&
            "function" === typeof a &&
            -1 === f.tabCreated.indexOf(a) &&
            f.tabCreated.push(a);
    };
    g.removeTabCreatedListener = function (a) {
        a &&
            "function" === typeof a &&
            ((a = f.tabCreated.indexOf(a)),
            -1 !== a && f.tabCreated.splice(a, 1));
    };
    g.addTabChangedListener = function (a) {
        a &&
            "function" === typeof a &&
            -1 === f.tabChanged.indexOf(a) &&
            f.tabChanged.push(a);
    };
    g.removeTabChangedListener = function (a) {
        a &&
            "function" === typeof a &&
            ((a = f.tabChanged.indexOf(a)),
            -1 !== a && f.tabChanged.splice(a, 1));
    };
    g.addTabUpdatedListener = function (a) {
        a &&
            "function" === typeof a &&
            -1 === f.tabUpdated.indexOf(a) &&
            f.tabUpdated.push(a);
    };
    g.removeTabUpdatedListener = function (a) {
        a &&
            "function" === typeof a &&
            ((a = f.tabUpdated.indexOf(a)),
            -1 !== a && f.tabUpdated.splice(a, 1));
    };
    g.addTabRemovedListener = function (a) {
        a &&
            "function" === typeof a &&
            -1 === f.tabRemoved.indexOf(a) &&
            f.tabRemoved.push(a);
    };
    g.removeTabRemovedListener = function (a) {
        a &&
            "function" === typeof a &&
            ((a = f.tabRemoved.indexOf(a)),
            -1 !== a && f.tabRemoved.splice(a, 1));
    };
    g.addTabMessageListener = function (a) {
        a &&
            "function" === typeof a &&
            -1 === f.tabMessage.indexOf(a) &&
            f.tabMessage.push(a);
    };
    g.removeTabMessageListener = function (a) {
        a &&
            "function" === typeof a &&
            ((a = f.tabMessage.indexOf(a)),
            -1 !== a && f.tabMessage.splice(a, 1));
    };
    g.addPortDisconnectedListener = function (a) {
        a &&
            "function" === typeof a &&
            -1 === f.portDisconnected.indexOf(a) &&
            f.portDisconnected.push(a);
    };
    g.removePortDisconnectedListener = function (a) {
        a &&
            "function" === typeof a &&
            ((a = f.portDisconnected.indexOf(a)),
            -1 !== a && f.portDisconnected.splice(a, 1));
    };
})((window.dji.tabsManager = window.dji.tabsManager || {}));
