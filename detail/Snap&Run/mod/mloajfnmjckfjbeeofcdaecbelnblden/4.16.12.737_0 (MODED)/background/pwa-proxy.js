(function () {
    async function n(a, b, c) {
        b = p(c);
        if (!(a instanceof Object && a.url))
            return b({error: "invalid_parameters"}, !1, !0);
        c = void 0;
        try {
            const d = new URL(a.url);
            c = await q(d.href, a.method, a.headers, a.body);
        } catch (d) {
            return (
                dji.logger.error("Error downloading file for S&R PWA:", d),
                b({error: d.message, details: d}, !1, !0)
            );
        }
        r(c, b);
    }
    async function t(a, b, c) {
        b = p(c);
        if (!(a instanceof Object && a.url))
            return b({error: Error("invalid_parameters")});
        c = void 0;
        try {
            if ("file:" !== new URL(a.url).protocol)
                return b({error: Error("invalid_parameters")});
            c = await u(a.url);
        } catch (d) {
            return (
                dji.logger.error("Error downloading file for S&R PWA:", d),
                b({error: d})
            );
        }
        r(c, b);
    }
    function r(a, b) {
        const c = b.isPort,
            d = new FileReader();
        d.onloadend = async function () {
            const e = this.result;
            if (!c) {
                if (20971520 < a.body.length)
                    return b({error: "body_too_large"});
                a.body = e;
                return b({data: a});
            }
            try {
                delete a.body;
                a.bodyLength = e.length;
                var f = await b(a, !0);
                let g = f instanceof Object && f.stop;
                for (f = 0; f < e.length && !g; f += 5242880) {
                    let l = e.substr(f, 5242880),
                        k = await b(
                            {
                                range: {start: f, end: f + l.length - 1},
                                size: e.length,
                                chunk: l,
                            },
                            !0,
                        );
                    k instanceof Object && k.stop && (g = !0);
                }
                b(g ? void 0 : {end: !0}, !1, !0);
            } catch (g) {
                dji.logger.error(g);
            }
        };
        d.onerror = function (e) {
            dji.logger.error(e);
            b({error: e.message, details: e}, !1, !0);
        };
        d.readAsBinaryString(a.body);
    }
    async function q(a, b, c, d) {
        a = await fetch(a, {
            method: b || "GET",
            credentials: "include",
            headers: c || {},
            body: d,
        });
        b = await a.blob();
        c = {};
        for (let e of a.headers.entries()) c[e[0]] = e[1];
        return {
            ok: a.ok,
            status: a.status,
            statusText: a.statusText,
            url: a.url,
            headers: c,
            body: b,
        };
    }
    async function u(a) {
        return new Promise((b, c) => {
            const d = new XMLHttpRequest();
            d.open("GET", a, !0);
            d.withCredentials = !0;
            d.responseType = "blob";
            d.onload = function () {
                if (200 === this.status || 0 === this.status)
                    return b({
                        ok: !0,
                        status: 200,
                        statusText: this.statusText,
                        headers: {},
                        body: this.response,
                    });
                c(Error(`Load failed with status ${this.status}`));
            };
            d.onerror = c;
            d.send();
        });
    }
    function p(a) {
        if ("function" === typeof a) return (a.isPort = !1), a;
        if (!(a instanceof Object && a.postMessage instanceof Function))
            return null;
        const b = (c, d, e) => {
            if (a.isDisconnected) throw Error("Port has been disconnected!");
            if (void 0 === c) a.disconnect();
            else {
                if (d)
                    return new Promise((f, g) => {
                        const l = `ack.${Date.now()}.${1e4 * Math.random()}`,
                            k = (h) => {
                                h instanceof Object &&
                                    h.message === l &&
                                    (a.onMessage.removeListener(k),
                                    a.onDisconnect.removeListener(m),
                                    e && a.disconnect(),
                                    f(h));
                            },
                            m = (h) => {
                                a.onMessage.removeListener(k);
                                a.onDisconnect.removeListener(m);
                                g(h || Error("Port has been disconnected!"));
                            };
                        c = Object.assign({ackMessage: l}, c);
                        try {
                            a.onMessage.addListener(k),
                                a.onDisconnect.addListener(m),
                                a.postMessage(c);
                        } catch (h) {
                            m(h);
                        }
                    });
                a.postMessage(c);
                e && a.disconnect();
            }
        };
        b.isPort = !0;
        b.port = a;
        return b;
    }
    function v(a, b, c) {
        a = a.token;
        if (!a || "string" !== typeof a)
            return c({error: "invalid_parameters"});
        try {
            const d = JSON.parse(atob(a));
            if (!d.timestamp || !d.tabId || !d.checksum)
                return c({error: "invalid_token"});
            const e = dji.tabsManager.tab(d.tabId);
            if (
                !e ||
                btoa(`${chrome.runtime.id} / ${e.tabId} / ${e.url}`) !==
                    d.checksum
            )
                return c({error: "invalid_tabId"});
            sru.backgroundManager.getWordBankData(d.tabId, c);
        } catch (d) {
            return c({error: "invalid_parameters"});
        }
    }
    function w(a, b) {
        a.onMessage.removeListener(a.onMessageHandler);
        delete a.onMessageHandler;
        b instanceof Object &&
        "com.snapandread.app.download-file" === b.message &&
        b.details instanceof Object
            ? n(b.details, a.sender, a)
            : b instanceof Object &&
                "com.snapandread.app.load-file" === b.message &&
                b.details instanceof Object
              ? t(b.details, a.sender, a)
              : b instanceof Object &&
                "com.wordbank.app.wb-data" === b.message &&
                b.details instanceof Object &&
                v(b.details, a.sender, a);
    }
    function x(a) {
        a.isDisconnected = !0;
        a.onMessageHandler &&
            (a.onMessage.removeListener(a.onMessageHandler),
            delete a.onMessageHandler);
        a.onDisconnectHandler &&
            (a.onDisconnect.removeListener(a.onDisconnectHandler),
            delete a.onDisconnectHandler);
    }
    chrome.runtime.onMessageExternal.addListener(function (a, b, c) {
        if (a instanceof Object && "com.snapandread.app.discover" === a.message)
            c({
                version: chrome.runtime.getManifest().version,
                capabilities: {download: {byPort: !0, byMessage: !0}},
            });
        else {
            if (
                a instanceof Object &&
                "com.snapandread.app.download-file" === a.message &&
                a.details instanceof Object
            )
                return n(a.details, b, c), !0;
            if (
                a instanceof Object &&
                "com.snapandread.app.load-file" === a.message &&
                a.details instanceof Object
            )
                return t(a.details, b, c), !0;
            if (
                a instanceof Object &&
                "com.wordbank.app.data" === a.message &&
                a.details instanceof Object
            )
                return v(a.details, b, c), !0;
        }
    });
    chrome.runtime.onConnectExternal.addListener(function (a) {
        if (
            "com.snapandread.app.download-file" === a.name ||
            "com.snapandread.app.load-file" === a.name
        )
            (a.onMessageHandler = w.bind(null, a)),
                (a.onDisconnectHandler = x.bind(null, a)),
                a.onMessage.addListener(a.onMessageHandler),
                a.onDisconnect.addListener(a.onDisconnectHandler);
    });
    chrome.runtime.onMessage.addListener((a, b, c) => {
        if ("com.snapandread.app.download-file.orbitnote" === a.message) {
            if (
                new URL(b.url).hostname !==
                new URL(dji.config.pdfOrbitNoteUrl()).hostname
            )
                return c({});
            setTimeout(async () => {
                var d = await (0 <= a.options.url.indexOf("file://") ? u : q)(
                    a.options.url,
                );
                d = URL.createObjectURL(d.body);
                c({url: d});
            }, 0);
            return !0;
        }
    });
})();
