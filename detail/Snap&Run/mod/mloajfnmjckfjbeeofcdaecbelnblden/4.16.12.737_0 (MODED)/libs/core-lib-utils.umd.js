/*!************************************************************************
 **
 ** Copyright (c) 2022-2024 Don Johnston, Inc. All rights reserved.
 **
 **************************************************************************/
!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
        ? t(exports)
        : "function" == typeof define && define.amd
          ? define(["exports"], t)
          : t(
                ((e =
                    "undefined" != typeof globalThis
                        ? globalThis
                        : e || self).__DjiCoreLibUtils = {}),
            );
})(this, function (e) {
    "use strict";
    const t = {
        paragraphSeparator: {},
        sentenceSeparator: {},
        wordSeparator: {},
        whiteSpace: {},
        invisibleWhiteSpace: {},
    };
    (t.paragraphSeparator.characterIsMember = function (e) {
        return "\r" === e || "\n" === e;
    }),
        (t.sentenceSeparator.characterIsMember = function (e) {
            return (
                "." === e || "!" === e || "?" === e || "\r" === e || "\n" === e
            );
        }),
        (t.wordSeparator.characterIsMember = function (e) {
            if (1 !== e.length) return !1;
            const t = e.charCodeAt(0);
            switch (t) {
                case 160:
                case 451:
                case 8220:
                case 8221:
                    return !0;
                default:
                    if (10 !== t && 13 !== t && t >= 0 && t <= 31) return !0;
            }
            return (
                " " === e ||
                "\t" === e ||
                "@" === e ||
                "#" === e ||
                "$" === e ||
                "%" === e ||
                "^" === e ||
                "&" === e ||
                "*" === e ||
                "(" === e ||
                ")" === e ||
                "-" === e ||
                "+" === e ||
                "=" === e ||
                "{" === e ||
                "[" === e ||
                "]" === e ||
                "}" === e ||
                "|" === e ||
                "\\" === e ||
                "~" === e ||
                "<" === e ||
                ">" === e ||
                "/" === e ||
                "," === e ||
                ";" === e ||
                ":" === e ||
                "." === e ||
                "!" === e ||
                "?" === e ||
                "\r" === e ||
                "\n" === e
            );
        }),
        (t.wordSeparator.characterIsMemberNoHypen = function (e) {
            return (
                t.wordSeparator.characterIsMember(e) &&
                "-" !== e &&
                8211 !== e.charCodeAt(0)
            );
        }),
        (t.whiteSpace.characterIsMember = function (e) {
            if (1 !== e.length) return !1;
            const t = e.charCodeAt(0);
            return (
                160 === t ||
                (8 !== t && 10 !== t && 13 !== t && t >= 0 && t <= 31) ||
                " " === e ||
                "\t" === e ||
                "\r" === e ||
                "\n" === e
            );
        }),
        (t.whiteSpace.whiteSpaces = function () {
            return /[ \t@#$%^&*()-+={}~[\]|<>,;:.!?\r\n/\\]+/;
        }),
        (t.invisibleWhiteSpace.characterIsMember = function (e) {
            if (1 !== e.length) return !1;
            switch (e.charCodeAt(0)) {
                case 8203:
                case 8204:
                    return !0;
            }
            return !1;
        }),
        Object.freeze(t);
    const n = {};
    let o = 0;
    const r = [],
        s = () => {};
    function a() {
        (n.todo = o <= n.levels.TODO ? console.warn.bind(console) : s),
            (n.log = o <= n.levels.LOG ? console.log.bind(console) : s),
            (n.debug = o <= n.levels.DEBUG ? console.debug.bind(console) : s),
            (n.info = o <= n.levels.INFO ? console.info.bind(console) : s),
            (n.warn = o <= n.levels.WARNING ? console.warn.bind(console) : s),
            (n.warning =
                o <= n.levels.WARNING ? console.warn.bind(console) : s),
            (n.error = o <= n.levels.ERROR ? console.error.bind(console) : s),
            (n.group = o <= n.levels.ERROR ? console.group.bind(console) : s),
            (n.groupCollapsed =
                o <= n.levels.ERROR ? console.groupCollapsed.bind(console) : s),
            (n.groupEnd =
                o <= n.levels.ERROR ? console.groupEnd.bind(console) : s);
    }
    function i(e) {
        if (e.__proto__ === Object.prototype) {
            (e = {...e}).access_token && (e.access_token = "***");
            const t = Object.keys(e),
                n = t.length;
            for (let o = 0; o < n; o += 1) {
                const n = t[o];
                try {
                    e[n] instanceof Object &&
                        e[n].__proto__ === Object.prototype &&
                        (e[n] = i(e[n]));
                } catch (e) {}
            }
        }
        return e;
    }
    (n.levels = {
        TODO: 0,
        LOG: 10,
        DEBUG: 11,
        INFO: 12,
        WARNING: 13,
        ERROR: 14,
        NONE: 100,
    }),
        (n.dump = console.warn.bind(console)),
        a(),
        (n.trace = console.trace.bind(console)),
        (n.logLevel = function (e) {
            return null == e || ((o = e), a()), o;
        }),
        (n.monitor = function (...e) {
            e = e.map((e) => i(e));
            const t = new Date(),
                n = {
                    timestamp: t.getTime(),
                    date: t.toISOString(),
                    event: void 0,
                    reason: void 0,
                    error: void 0,
                    details: e,
                };
            if (
                e.length > 0 &&
                e[0].__proto__ === Object.prototype &&
                (e[0].event && ((n.event = e[0].event), delete e[0].event),
                e[0].reason && ((n.reason = e[0].reason), delete e[0].reason),
                e[0].error instanceof Error)
            ) {
                const {error: t} = e[0];
                e[0].error = {code: t.code, message: t.message, stack: t.stack};
            }
            r.push(n), r.length > 2e3 && r.splice(0, r.length - 2e3);
        }),
        (n.dump = function () {
            return r.map((e) => JSON.stringify(e)).join("\n");
        });
    const c = {
            IFRAME: "IFRAME",
            FRAME: "FRAME",
            IFRAME_AND_FRAME: "IFRAME, FRAME",
            INTERACTIVE: "interactive",
            COMPLETE: "complete",
        },
        l = {
            IFRAMES_CHANGED: "dji.iframesChanged",
            IFRAME_LOADED: "dji.iframeLoaded",
        },
        u = {childList: !0, subtree: !0};
    let d = null;
    const f = new EventTarget();
    function m(e, t) {
        let o = -1;
        if (!e || e.length <= 0) return [];
        o = (e = e instanceof Array ? [...e] : [e]).length;
        for (let t = 0; t < e.length; t += 1) {
            const o = e[t];
            if (o.nodeType !== Node.ELEMENT_NODE)
                throw new Error("Invalid parameters (HTMLElement expected)!");
            try {
                const t =
                    o.tagName === c.IFRAME || o.tagName === c.FRAME
                        ? o.contentDocument
                        : o;
                if (t) {
                    const n = t.querySelectorAll(c.IFRAME_AND_FRAME);
                    n.length > 0 && e.push(...n);
                }
            } catch (e) {
                n.error(e);
            }
        }
        return (
            t
                ? (e = e.filter(
                      (e) =>
                          e.nodeType === Node.ELEMENT_NODE &&
                          (e.tagName === c.IFRAME || e.tagName === c.FRAME),
                  ))
                : e.splice(0, o),
            [...new Set(e)]
        );
    }
    function h(e, t) {
        let n = [];
        const o = e.length;
        for (let r = 0; r < o; r += 1) {
            const o = e[r][t],
                s = o.length;
            for (let e = 0; e < s; e += 1) {
                const t = o[e];
                if (t.nodeType === Node.ELEMENT_NODE) {
                    const e = t.nodeName.toUpperCase();
                    e === c.IFRAME || e === c.FRAME
                        ? n.push(t)
                        : n.push(...t.querySelectorAll(c.IFRAME_AND_FRAME));
                }
            }
        }
        return (n = m(n, !0)), n;
    }
    function g(e, t) {
        ((e && e.length > 0) || (t && t.length > 0)) &&
            f.dispatchEvent(
                (function (e, t) {
                    const n = new Event(l.IFRAMES_CHANGED);
                    return (
                        (n.addedIframes = e || []),
                        (n.removedIframes = t || []),
                        n
                    );
                })(e, t),
            );
    }
    function p(e) {
        const t = e.length;
        for (let n = 0; n < t; n += 1) w(e[n]);
    }
    function E() {
        if (
            ((e = this),
            f.dispatchEvent(
                (function (e) {
                    const t = new Event(l.IFRAME_LOADED);
                    return (t.iframe = e), t;
                })(e),
            ),
            this.contentDocument)
        ) {
            const e = m(this);
            g(e), d.observe(this.contentDocument, u), p(e);
        }
        var e;
    }
    function w(e) {
        e.removeEventListener("load", E), e.addEventListener("load", E);
        try {
            e.contentDocument &&
                e.contentDocument.readyState === c.COMPLETE &&
                E.call(e);
        } catch (e) {
            n.error(e);
        }
    }
    function y(e) {
        const t = h(e, "addedNodes");
        g(t, h(e, "removedNodes")), p(t);
    }
    const b = f.addEventListener.bind(f),
        _ = f.removeEventListener.bind(f);
    var N = {
        EventTypes: l,
        initialize: function () {
            null === d &&
                ((d = new MutationObserver(y)),
                d.observe(document, u),
                p(document.querySelectorAll(c.IFRAME_AND_FRAME)));
        },
        addEventListener: b,
        removeEventListener: _,
    };
    function A(e, t) {
        return e.x <= t && t <= e.x + e.width;
    }
    function S(e, t) {
        return e.y <= t && t <= e.y + e.height;
    }
    var T = {
        containsX: A,
        containsY: S,
        contains: function (e, t, n) {
            return A(e, t) && S(e, n);
        },
        equalsTo: function (e, t) {
            return (
                e === t ||
                (!!t &&
                    e.top === t.top &&
                    e.left === t.left &&
                    e.width === t.width &&
                    e.height === t.height)
            );
        },
        isWithinProximityTo: function (e, t, n) {
            return e === t || (!!t && Math.abs(e.left - t.left) <= n);
        },
        intersectsRect: function (e, t) {
            return (
                e.left < t.right &&
                t.left < e.right &&
                e.top < t.bottom &&
                t.top < e.bottom
            );
        },
    };
    const v = {};
    !(function () {
        const e = ["START", "STOP", "ERROR", "PROGRESS", "WAIT"],
            t = new Map();
        t.set("app", ["ACTIVATE", "DEACTIVATE", "QUERY_STATE"]),
            t.set("chrome", [
                "ACTIVATE",
                "DEACTIVATE",
                "ENGINE_READY",
                "SETUP",
                "NOTIFICATION",
                "TOGGLE",
                "NEEDS_SETUP",
                "DOCUMENT_READY",
                "DOCUMENT_CAPABILITIES_UPDATE",
                "SETTINGS",
                "OPTIONS",
                "OPEN_CONTENT_SETTINGS",
            ]),
            t.set("ui", ["RESOURCES"]),
            t.set("tts", e),
            t.set("speak", ["SPEAK", "SCHEDULE", "STOP"]),
            t.set("speech_recognition", [
                "TOGGLE",
                "NOTIFICATION",
                "PROGRESS",
                "END",
            ]),
            t.set("topics", [
                "CREATE",
                "DATA",
                "UPDATE",
                "ACTIVATE",
                "SEARCH_WEB",
                "GET_CONTEXT_FOR_MOMENTARY_TOPIC",
                "CONTEXT_FOR_MOMENTARY_TOPIC_AVAILABLE",
            ]),
            t.set("ime", [
                "CONTEXT_AVAILABLE",
                "GUESS_SELECTED",
                "RESTART_GUESSES",
                "ACTIVATION_CHANGED",
                "ACCUMULATE_DATA",
                "GUESS_WINDOW_POS_UPDATE",
                "REPLACE_TEXT",
                "SPELLCHECK_DONE",
                "GUESSES_AVAILABLE",
                "TRANSLATIONS_AVAILABLE",
            ]),
            t.set("personal_words", ["ADD", "REMOVE"]),
            t.set("highlighting", [
                "INIT",
                "RESET",
                "DESTROY",
                "SET_GRANULARITY",
                "REPLACE_LAST_WORD",
                "SET_OPTIONS",
                "ENABLE_HIGHLIGHTING",
                "DISABLE_HIGHLIGHTING",
                "HIGHLIGHT",
                "MAP_TEXT_FOR_HIGHLIGHTING",
                "CANCEL",
            ]),
            t.set("i18n", ["TRANSLATE_TEXT"]);
        const n = new Map();
        n.set("", [
            "REWORDIFY",
            "TRANSLATE",
            "TRANSLATE_FROM_TOOLBAR",
            "TRANSLATE_MATH",
            "OCR",
            "BACKGROUND_READY",
            "CONTENT_SCRIPT_READY",
            "SIGNIN",
            "SIGNOUT",
            "USER",
            "ACTIVATE_EXTENSION",
            "SETTINGS",
            "LOG",
        ]),
            n.set("content_script", [
                "READY",
                "CSS_READY",
                "RESTRICTIONS_READY",
            ]),
            n.set("tts", e),
            n.set("overlay", ["ACTIVATION_CHANGE"]),
            (v.cwe = {}),
            (v.sru = {});
        let o = 0;
        function r(e, t) {
            t.forEach((t, n) => {
                !(function (e, t, n) {
                    if (n.length > 0) {
                        const r = {},
                            s = t.length;
                        for (let e = 0; e < s; e += 1) {
                            const n = t[e];
                            Object.defineProperty(r, n, {
                                value: o,
                                writable: !1,
                            }),
                                (o += 1);
                        }
                        Object.freeze(r),
                            Object.defineProperty(e, n, {
                                value: r,
                                writable: !1,
                            });
                    } else {
                        const n = t.length;
                        for (let r = 0; r < n; r += 1) {
                            const n = t[r];
                            Object.defineProperty(e, n, {
                                value: o,
                                writable: !1,
                            }),
                                (o += 1);
                        }
                    }
                })(e, t, n);
            }),
                Object.freeze(e);
        }
        r(v.cwe, t), r(v.sru, n);
    })();
    const O = {},
        I = [
            "imgmjcnolbhljlnimjbnmeokfljgjokj",
            "emmgndmggimgmmpciejhnkcnlillakfn",
            "ifajfiofeifbbhbionejdliodenmecna",
            "mloajfnmjckfjbeeofcdaecbelnblden",
            "cbcfbhjolgdaepkoaoepejclfggmdand",
            "ioadmlabdmgldhncokgjbhlnpalnfccd",
            "ibbhadmnjccbljgfehndobbpjghoccio",
            "ikiamffdnlaifhblcjlmjhchbbegblfo",
            "dkbcbhadpkbopmfmgbkacikhfgelohmo",
            "imhhmknkhjkgoomhdbpgpfmjghhbgjic",
        ],
        D = {onNotification: null, onQuery: null};
    let M = !1,
        R = 0;
    function C(e, ...t) {
        if (e)
            try {
                e.apply(this, t);
            } catch (e) {
                n.error(e);
            }
    }
    function L(e) {
        return I.indexOf(e) >= 0;
    }
    function x(e) {
        const t = this;
        "notification" === e.type
            ? D.onNotification && C(D.onNotification, e.data)
            : "query" === e.type &&
              (D.onQuery
                  ? C(D.onNotification, e.data, (n) => {
                        t.postMessage({queryId: e.id, type: "answer", data: n});
                    })
                  : t.postMessage({queryId: e.id, type: "answer", data: null}));
    }
    function k(e) {
        e &&
            e.sender &&
            e.sender.id &&
            L(e.sender.id) &&
            e.onMessage.addListener(x.bind(e));
    }
    (O.init = function (e) {
        M ||
            ((e = e || {}),
            (D.onNotification = e.onNotification || null),
            (D.onQuery = e.onQuery || null),
            (M = !0),
            chrome.runtime.onConnectExternal.addListener(k));
    }),
        (O.broadcastNotification = function (e) {
            const t = chrome.runtime.id;
            for (let n = 0; n < I.length; n += 1)
                I[n] !== t && O.sendNotification(I[n], e);
        }),
        (O.sendNotification = function (e, t, n) {
            if (!L(e)) return;
            const o = chrome.runtime.connect(e);
            o.onDisconnect.addListener(() => {});
            try {
                (R += 1),
                    o.postMessage({id: R, type: "notification", data: t}),
                    o.disconnect(),
                    C(n, {success: !0});
            } catch (e) {
                C(n, {success: !1});
            }
        }),
        (O.sendQuery = function (e, t, o) {
            if (!L(e) || !o || "function" != typeof o) return;
            const r = function () {
                    C(o, null);
                },
                s = chrome.runtime.connect(e);
            s.onDisconnect.addListener(r),
                s.onMessage.addListener((e) => {
                    s.onDisconnect.removeListener(r), s.disconnect(), C(o, e);
                });
            try {
                (R += 1), s.postMessage({id: R, type: "query", data: t});
            } catch (e) {
                n.error(e), C(o, null);
            }
        });
    class F {
        constructor(e, t) {
            (this.m_name = e || void 0),
                (this.m_uuid = `${1e17 * Math.random()}${1e17 * Math.random()}`),
                (this.m_service = t.service || void 0),
                (this.m_wnd = t.wnd || void 0),
                (this.m_port = t.port || void 0),
                (this.m_enableWindowMessages = Boolean(
                    t.enableWindowMessages || !1,
                )),
                (this.m_messageId = 0),
                (this.m_postMessages = {}),
                (this.m_messageDelegates = {}),
                (this.m_messageHandler = (e) => {
                    this.onMessage(this, e);
                }),
                (this.m_unloadHandler = () => {
                    this.notifyDisconnect();
                }),
                (this.m_defaultMessageDelegate =
                    t.defaultMessageDelegate || void 0),
                window.addEventListener("unload", this.m_unloadHandler);
        }
        get service() {
            return this.m_service;
        }
        get window() {
            return this.m_wnd;
        }
        get windowIsClosed() {
            try {
                return this.m_wnd.closed;
            } catch (e) {}
            return !1;
        }
        get uuid() {
            return this.m_uuid;
        }
        enable(e) {
            e
                ? (this.m_enableWindowMessages &&
                      this.m_wnd &&
                      window.addEventListener(
                          "message",
                          this.m_messageHandler,
                          !0,
                      ),
                  this.m_port &&
                      (this.m_port.addEventListener(
                          "message",
                          this.m_messageHandler,
                          !0,
                      ),
                      this.m_port.start()))
                : (this.m_port &&
                      this.m_port.removeEventListener(
                          "message",
                          this.m_messageHandler,
                          !0,
                      ),
                  this.m_enableWindowMessages &&
                      this.m_wnd &&
                      window.removeEventListener(
                          "message",
                          this.m_messageHandler,
                          !0,
                      ));
        }
        disconnect() {
            this.onDisconnect();
        }
        on(e, t) {
            if (!e || "function" != typeof t) return;
            let n = Object.prototype.hasOwnProperty.call(
                this.m_messageDelegates,
                e,
            )
                ? this.m_messageDelegates[e]
                : void 0;
            n || ((n = []), (this.m_messageDelegates[e] = n)), n.push(t);
        }
        send(e, t, ...n) {
            if (
                this.windowIsClosed ||
                (!this.m_port && !this.m_enableWindowMessages)
            )
                return void (t && t(new Error("503")));
            this.m_messageId += 1;
            const o = {
                message: e,
                messageId: `${this.m_uuid}/${this.m_messageId}`,
                timestamp: Date.now(),
            };
            arguments.length > 2 && (o.arguments = [].slice.call(n)),
                t &&
                    "function" == typeof t &&
                    (this.m_postMessages[o.messageId] = {
                        message: e,
                        callback: t,
                    }),
                this.m_port
                    ? this.m_port.postMessage(o)
                    : this.m_enableWindowMessages &&
                      this.m_wnd.postMessage(o, "*");
        }
        async sendAsync(e, ...t) {
            return new Promise((n) => this.send(e, n, ...t));
        }
        respond(e, t, n) {
            if (this.windowIsClosed) return;
            if (!this.m_port && !this.m_enableWindowMessages) return;
            this.m_messageId += 1;
            const o = {
                message: e,
                messageId: `${this.m_uuid}/${this.m_messageId}`,
                timestamp: Date.now(),
                responseFor: t,
                result: n,
            };
            this.m_port
                ? this.m_port.postMessage(o)
                : this.m_enableWindowMessages && this.m_wnd.postMessage(o, "*");
        }
        ping() {
            this.send(F.MSG_SRV_PING);
        }
        onMessage(e, t) {
            if (
                (!t.source && !t.currentTarget) ||
                (t.source && t.source !== this.m_wnd) ||
                (t.currentTarget && t.currentTarget !== this.m_port)
            )
                return;
            if (
                !t.data ||
                !Object.prototype.hasOwnProperty.call(t.data, "message") ||
                !Object.prototype.hasOwnProperty.call(t.data, "messageId")
            )
                return;
            let o;
            if (
                (t.data.responseFor &&
                    Object.prototype.hasOwnProperty.call(
                        this.m_postMessages,
                        t.data.responseFor,
                    ) &&
                    ((o = this.m_postMessages[t.data.responseFor]),
                    delete this.m_postMessages[t.data.responseFor]),
                o)
            )
                Object.prototype.hasOwnProperty.call(t.data, "result")
                    ? o.callback.apply(this, [t.data.result])
                    : o.callback.apply(this);
            else if (t.data.message !== F.MSG_SRV_PING) {
                if (t.data.message === F.MSG_SRV_DISCONNECT)
                    try {
                        this.onDisconnect();
                    } catch (e) {
                        n.error(e);
                    }
                if (
                    Object.prototype.hasOwnProperty.call(
                        this.m_messageDelegates,
                        t.data.message,
                    )
                ) {
                    const e = this.m_messageDelegates[t.data.message];
                    for (let o = 0; o < e.length; o += 1)
                        try {
                            e[o].apply(
                                this,
                                [t.data.messageId].concat(
                                    t.data.arguments || [],
                                ),
                            );
                        } catch (e) {
                            n.error(e);
                        }
                } else
                    this.m_defaultMessageDelegate &&
                        this.m_defaultMessageDelegate(t);
            } else this.onPing();
        }
        onPing() {
            this.send(F.MSG_SRV_PONG);
        }
        onDisconnect() {
            this.enable(!1), (this.m_wnd = void 0), (this.m_port = void 0);
        }
        notifyDisconnect() {
            window.removeEventListener("unload", this.m_unloadHandler),
                this.send(F.MSG_SRV_DISCONNECT),
                this.enable(!1),
                (this.m_wnd = void 0),
                (this.m_port = void 0);
        }
    }
    (F.MSG_SRV_AVAILABLE = "com.donjohnston.dji.service.available"),
        (F.MSG_SRV_AVAILABLE_ACK = "com.donjohnston.dji.service.available.ack"),
        (F.MSG_SRV_DISCONNECT = "com.donjohnston.dji.service.disconnect"),
        (F.MSG_SRV_PING = "com.donjohnston.dji.service.ping"),
        (F.MSG_SRV_PONG = "com.donjohnston.dji.service.pong");
    const P = {};
    let j = null,
        G = null;
    function W(e) {
        const t = e.length;
        for (let n = 0; n < t; n += 1) {
            let t = e[n];
            const o = window.getComputedStyle(t);
            if (
                (o &&
                    ("hidden" === o.getPropertyValue("visibility") ||
                        "none" === o.getPropertyValue("display")) &&
                    (t = null),
                t)
            )
                return t;
        }
        return null;
    }
    function U(e) {
        e.stopPropagation();
    }
    function V(e) {
        e.preventDefault(), e.stopPropagation();
    }
    (P.browser = function () {
        return (
            G ||
                (G = (function () {
                    const e = {},
                        t = window.navigator.userAgent;
                    return (
                        /edg/i.test(t)
                            ? (e.edge = !0)
                            : /trident/i.test(t) || /msie/i.test(t)
                              ? (e.ie = !0)
                              : /firefox/i.test(t)
                                ? (e.firefox = !0)
                                : /chrome/i.test(t)
                                  ? (e.chrome = !0)
                                  : /safari/i.test(t) && (e.safari = !0),
                        e
                    );
                })()),
            G
        );
    }),
        (P.os = function () {
            return (
                j ||
                    ((j = {
                        chrome:
                            -1 !== window.navigator.userAgent.indexOf("CrOS"),
                        mac:
                            -1 !==
                            window.navigator.userAgent.indexOf("Macintosh"),
                        windows:
                            -1 !==
                            window.navigator.userAgent.indexOf("Windows"),
                        name: "",
                    }),
                    j.chrome
                        ? (j.name = "chrome")
                        : j.mac
                          ? (j.name = "mac")
                          : j.windows && (j.name = "windows")),
                j
            );
        }),
        (P.sleep = async function (e) {
            return new Promise((t) => {
                setTimeout(t, e);
            });
        }),
        (P.waitDOMContentLoaded = async function () {
            if ("loading" === document.readyState)
                return new Promise((e) => {
                    document.addEventListener("DOMContentLoaded", e);
                });
        }),
        (P.loadFile = async function (e) {
            try {
                const t = chrome.extension.getURL(e),
                    n = await fetch(t);
                return n.ok ? await n.text() : null;
            } catch (e) {
                return n.error(e), null;
            }
        }),
        (P.getMetadata = function () {
            try {
                const e = {},
                    t = document.querySelector(
                        "meta[name='dji-document-title'",
                    ),
                    n = document.querySelector("meta[name='dji-document-url'"),
                    o = document.querySelector(
                        "meta[name='dji-document-author'",
                    ),
                    r = t ? t.getAttribute("content") : null,
                    s = n ? n.getAttribute("content") : null,
                    a = r || document.querySelector("title"),
                    i = document.querySelector("meta[name='DC.title'"),
                    c = i ? i.getAttribute("content") : null;
                e.title = (a ? a.innerText : c) || "";
                const l = [],
                    u = o || document.querySelector("meta[name='author'");
                let d = "";
                if (u && "" !== u.getAttribute("content"))
                    d = u.getAttribute("content");
                else {
                    const e = document.querySelector(
                        "meta[name='DC.contributor'",
                    );
                    e && (d = e.getAttribute("content"));
                }
                if ("" !== d) {
                    const e = d.split(" ");
                    e.length > 1
                        ? l.push({
                              given: e.slice(0, e.length - 1).join(" "),
                              family: e[e.length - 1],
                          })
                        : u
                          ? l.push({given: "", family: d})
                          : l.push({given: d, family: ""});
                }
                e.author = l;
                const f =
                        document.querySelector("meta[name='date'") ||
                        document.querySelector("meta[name='DC.created'"),
                    m = f
                        ? f.getAttribute("content")
                        : new Date(Date.now()).getFullYear().toString(),
                    h = /[0-9]{4,4}/.exec(m);
                h.length > 0 &&
                    ((e.issued = {}), (e.issued["date-parts"] = [[h]]));
                const g = new Date(Date.now()),
                    p = g.getMonth() + 1,
                    E = g.getDate(),
                    w = g.getFullYear();
                (e.accessed = {}), (e.accessed["date-parts"] = [[w, p, E]]);
                const y = document.querySelector("meta[name='medium'");
                if (
                    (y && (e.medium = y.getAttribute("content")),
                    (e.URL = s || window.location.href),
                    P.isSruPwaApp())
                ) {
                    const t = document.querySelector(
                            "meta[name=dji-sr-pwa-doc-title]",
                        ),
                        n = t ? t.getAttribute("content") : null;
                    e.title = n || e.title;
                    const o = document.querySelector(
                            "meta[name=dji-sr-pwa-doc-url]",
                        ),
                        r = o ? o.getAttribute("content") : null;
                    (e.URL = r), (r && 0 !== r.length) || delete e.URL;
                }
                if (e.URL) {
                    const t = e.URL.split("://")[1];
                    if (t) {
                        const n = t.split("www.");
                        e["container-title"] =
                            1 === n.length
                                ? n[0].split("/")[0]
                                : n[1].split("/")[0];
                    }
                }
                return e;
            } catch (e) {
                n.error(e);
            }
            return null;
        }),
        (P.addEventListener = function (e, t, n) {
            e.hasOwnProperty(t) &&
                "function" == typeof n &&
                -1 === e[t].indexOf(n) &&
                e[t].push(n);
        }),
        (P.removeEventListener = function (e, t, n) {
            if (e.hasOwnProperty(t) && "function" == typeof n) {
                const o = e[t].indexOf(n);
                -1 !== o && e[t].splice(o, 1);
            }
        }),
        (P.callListeners = function (e, t, ...o) {
            if (e && e.hasOwnProperty(t)) {
                const r = e[t];
                if (r && r.length > 0)
                    for (let e = 0; e < r.length; e += 1) {
                        const t = r[e];
                        if (t)
                            try {
                                t.apply(this, o);
                            } catch (e) {
                                n.error(e);
                            }
                    }
            }
        }),
        (P.notifyListeners = function (e, ...t) {
            const o = e.length;
            for (let r = 0; r < o; r += 1)
                try {
                    const n = e[r];
                    n.apply(n, t);
                } catch (e) {
                    n.error(e);
                }
        }),
        (P.callMethod = function (e, ...t) {
            if (e)
                try {
                    e.apply(this, t);
                } catch (e) {
                    n.error(e);
                }
        }),
        (P.checkInternetConnectionAvailable = function (e) {
            let t = null;
            const o = function (t) {
                try {
                    e(t);
                } catch (e) {
                    n.error(e);
                }
            };
            if (navigator.onLine)
                try {
                    const e = new XMLHttpRequest(),
                        n = `https://www.google.com/?random=${Math.random()}`;
                    e.open("HEAD", n, !0),
                        (e.onreadystatechange = function () {
                            if (4 === e.readyState && e.status > 0) {
                                const n =
                                    (e.status >= 200 && e.status < 300) ||
                                    304 === e.status;
                                t && clearTimeout(t),
                                    setTimeout(() => {
                                        o(n);
                                    }, 0);
                            }
                        }),
                        e.send(),
                        (t = setTimeout(() => {
                            e.abort(),
                                setTimeout(() => {
                                    o(!1);
                                }, 0);
                        }, 2e3));
                } catch (e) {
                    t && clearTimeout(t), o(!1);
                }
            else o(!1);
        }),
        (P.isChromeOS = function () {
            return -1 !== window.navigator.userAgent.indexOf("CrOS");
        }),
        (P.isMacOS = function () {
            return -1 !== window.navigator.userAgent.indexOf("Macintosh");
        }),
        (P.isWindowsOS = function () {
            return -1 !== window.navigator.userAgent.indexOf("Windows");
        }),
        (P.isLoginApp = function (e) {
            const t = [
                    /.*login.*\.donjohnston\.net/,
                    /.*login.*\.qadji\.com/,
                    /.*login.*\.stagedji\.com/,
                    /.*login.*\.codeiasi\.net/,
                ],
                n = (e || window.location).hostname;
            for (let e = 0; e < t.length; e += 1) if (t[e].test(n)) return !0;
            return !1;
        }),
        (P.isGoogleSearch = function (e) {
            const t = (e || window.location).hostname.split(".");
            return !(
                (2 !== t.length && 3 !== t.length) ||
                "google" !== t[t.length - 2] ||
                (2 !== t.length && "www" !== t[0])
            );
        }),
        (P.isGoogleDrive = function (e = null) {
            return (e || window.location).hostname.startsWith(
                "drive.google.com",
            );
        }),
        (P.isGoogleClassroom = function (e = null) {
            return (e || window.location).hostname.startsWith(
                "classroom.google.com",
            );
        }),
        (P.isGoogleDocs = function (e = null) {
            const t = e || window.location;
            if ("docs.google.com" !== t.hostname) return !1;
            let n = t.pathname.match(/^(\/a\/[^/]+)?\/document\/d\//i);
            return (
                n || (n = t.pathname.match(/^(\/a\/[^/]+)?\/document\/edit/i)),
                null != n && n.length > 0
            );
        }),
        (P.isGoogleDocsEditor = function (e, t = !1) {
            if (!e || e.shadowRoot || (!t && !P.isGoogleDocs())) return !1;
            if ("IFRAME" === e.tagName)
                return P.elementHasClass(e, "docs-texteventtarget-iframe");
            if (e.ownerDocument.body.classList.contains("docs-gm"))
                return null != document.querySelector(".kix-appview-editor");
            for (; e; ) {
                if (P.elementHasClass(e, "kix-appview-editor")) return !0;
                e = e.parentElement;
            }
            return !1;
        }),
        (P.isMSOfficeWordEditor = function (e, t = !1) {
            if (!e || e.shadowRoot || (!t && !P.isMsOfficeWord())) return !1;
            if ("IFRAME" === e.tagName) {
                const t = e.parentElement;
                return "DIV" === t.tagName && "WopiDocWACContainer" === t.id;
            }
            if ("DIV" === e.tagName) {
                const t = e.parentElement;
                return (
                    "WACViewPanel_EditingElement" === e.id &&
                    "WACViewPanel_EditingElement_WrappingDiv" === t.id
                );
            }
            return !1;
        }),
        (P.isMsOfficeWord = function () {
            P.isMsOfficeWord.__rules ||
                (P.isMsOfficeWord.__rules = [
                    {
                        hostname: /^.*word-edit.officeapps.live.com$/,
                        pathname: /^.*\/wordeditorframe.aspx$/,
                    },
                ]);
            for (let e = 0; e < P.isMsOfficeWord.__rules.length; e += 1)
                if (
                    Boolean(
                        P.isMsOfficeWord.__rules[e].hostname.test(
                            window.location.hostname,
                        ) &&
                            P.isMsOfficeWord.__rules[e].pathname.test(
                                window.location.pathname,
                            ),
                    )
                )
                    return !0;
            return !1;
        }),
        (P.isGoogleSlidesEditor = function (e, t = !1) {
            return (
                !(!e || e.shadowRoot || (!t && !P.isGoogleSlides())) &&
                ("IFRAME" === e.tagName
                    ? P.elementHasClass(e, "docs-texteventtarget-iframe")
                    : !!e.ownerSVGElement)
            );
        }),
        (P.isGoogleSlides = function (e = null) {
            const t = e || window.location;
            return (
                "docs.google.com" === t.hostname &&
                (null !==
                    t.pathname.match(/^(\/a\/[^/]+)?\/presentation\/d\//i) ||
                    null !==
                        t.pathname.match(/^(\/a\/[^/]+)?\/presentation\/edit/i))
            );
        }),
        (P.isGoogleHangouts = function (e = null) {
            return "hangouts.google.com" === (e || window.location).hostname;
        }),
        (P.isGoogleMail = function (e = null) {
            const t = e || window.location;
            return P.stringEndsWith(t.hostname, "mail.google.com");
        }),
        (P.isGoogleForms = function (e = null) {
            const t = e || window.location;
            return Boolean(
                "docs.google.com" === t.hostname &&
                    t.pathname.match(/^\/forms\//i),
            );
        }),
        (P.isYahooMail = function (e = null) {
            const t = e || window.location;
            return P.stringEndsWith(t.hostname, "mail.yahoo.com");
        }),
        (P.isYahooNews = function (e = null) {
            const t = e || window.location;
            return P.stringEndsWith(t.hostname, "news.yahoo.com");
        }),
        (P.isMicrosoftMail = function (e = null) {
            const t = e || window.location;
            return P.stringEndsWith(t.hostname, "mail.live.com");
        }),
        (P.isMicrosoftOffice = function (e = null) {
            const t = e || window.location;
            return (
                t.href.indexOf("sharepoint.com") >= 0 ||
                P.stringStartsWith(t.hostname, "outlook.office.com") ||
                P.stringStartsWith(t.hostname, "onedrive.live.com")
            );
        }),
        (P.isMicrosoftOutlook = function (e = null) {
            const t = e || window.location;
            return P.stringStartsWith(t.hostname, "outlook.office.com");
        }),
        (P.isEvernote = function (e = null) {
            const t = e || window.location;
            return P.stringEndsWith(t.hostname, "evernote.com");
        }),
        (P.isFacebook = function (e = null) {
            const t = e || window.location;
            return P.stringEndsWith(t.hostname, "facebook.com");
        }),
        (P.isTwitter = function (e = null) {
            const t = e || window.location;
            return P.stringEndsWith(t.hostname, "twitter.com");
        }),
        (P.isSru = function (e = null) {
            const t = e || window.location;
            return P.stringStartsWith(
                t.href,
                `chrome-extension://${chrome.runtime.id}`,
            );
        }),
        (P.isSruPwaApp = function () {
            return !!document.querySelector(
                "meta[name=dji-app][content=sr-pwa]",
            );
        }),
        (P.isCambridgeLMS = function (e = null) {
            const t = e || window.location;
            return P.stringStartsWith(t.href, "https://www.cambridgelms.org");
        }),
        (P.isBookshareReader = function (e) {
            const t = e || window.location;
            return (
                "bookshare-reader.s3.amazonaws.com" === t.hostname ||
                "www.bookshare.org" === t.hostname
            );
        }),
        (P.isBookshareBook = function (e) {
            const t = e || window.location;
            if (!P.isBookshareReader(t)) return !1;
            const n = t.search.match(/[?&]book=/i);
            return null != n && n.length > 0;
        }),
        (P.isAmazonKindle = function (e = null) {
            const t = e || window.location;
            return /^.*read\.amazon\..*/i.test(t);
        }),
        (P.isYoutube = function (e) {
            const t = e || window.location;
            return P.stringStartsWith(t.hostname, "youtube.com");
        }),
        (P.isOverDriveReader = function (e = null) {
            const t = (e || window.location).hostname;
            return Boolean(
                /^.*.read.overdrive.com$/.test(t) ||
                    /^soraapp.com$/.test(t) ||
                    /^libbyapp.com$/.test(t) ||
                    /^.*read.soraapp.com$/.test(t) ||
                    /^.*.read.libbyshelf.com$/.test(t) ||
                    /^.*.read.libbyapp.com$/.test(t),
            );
        }),
        (P.isOverDriveReaderDocument = function (e, t, n) {
            let o;
            e = e || document;
            const r = Boolean(n && n.location);
            for (
                o = r
                    ? (e = n.element
                          ? n.element.ownerDocument
                          : e).elementFromPoint(n.location.x, n.location.y)
                    : e.activeElement;
                o;

            )
                if (o.shadowRoot) o = o.shadowRoot.activeElement;
                else {
                    if ("IFRAME" !== o.tagName.toUpperCase()) break;
                    if (t) return !1;
                    if (!(e = o.contentDocument)) return !1;
                    o = r
                        ? e.elementFromPoint(n.location.x, n.location.y)
                        : e.activeElement;
                }
            return P.isOverDriveReader(e.defaultView.location);
        }),
        (P.isIframeFree = function () {
            return P.isGoogleMail();
        }),
        (P.stringStartsWith = function (e, t) {
            return 0 === e.indexOf(t, 0);
        }),
        (P.stringEndsWith = function (e, t) {
            return -1 !== e.indexOf(t, e.length - t.length);
        }),
        (P.addLeadingZero = function (e, t) {
            t = t || 2;
            const n = `0000000000${e}`;
            return n.substr(n.length - Math.max(String(e).length, t));
        }),
        (P.hostnameFromURL = function (e) {
            return e.toString().replace(/^(.*\/\/[^/?#]*).*$/, "$1");
        }),
        (P.jsonFromUrlQueryAndHash = function (e) {
            if (!e) return null;
            try {
                let t = null,
                    n = null;
                if (
                    (1 === (e = e.split("#")).length
                        ? ([e] = e)
                        : 2 === e.length && (([, n] = e), ([e] = e)),
                    2 === (e = e.split("?")).length && ([, t] = e),
                    t)
                ) {
                    (t = `{"${t.replace(/&/g, '", "').replace(/=/g, '": "')}"}`),
                        (t = JSON.parse(t));
                    for (const e in t)
                        t.hasOwnProperty(e) &&
                            (t[e] = decodeURIComponent(t[e]));
                }
                if (n) {
                    (n = `{"${n.replace(/&/g, '", "').replace(/=/g, '": "')}"}`),
                        (n = JSON.parse(n));
                    for (const e in n)
                        n.hasOwnProperty(e) &&
                            (n[e] = decodeURIComponent(n[e]));
                }
                return {query: t, hash: n};
            } catch (e) {
                n.error(e);
            }
            return null;
        }),
        (P.htmlToUnicodeTextArray = function (e) {
            if (null == e) return null;
            if (0 === e.length) return [];
            const t = e.length,
                n = new Array(t);
            for (let o = 0; o < t; o += 1) {
                let t = e.charAt(o);
                const r = e.charCodeAt(o);
                switch (r) {
                    case 160:
                    case 8203:
                    case 8204:
                    case 8205:
                        t = " ";
                        break;
                    case 216:
                    case 248:
                    case 510:
                    case 511:
                        t = "0";
                        break;
                    case 451:
                        t = "!";
                        break;
                    case 8211:
                        t = "-";
                        break;
                    case 8216:
                    case 8217:
                        t = "'";
                        break;
                    case 8220:
                    case 8221:
                        t = '"';
                        break;
                    case 8230:
                        t = ".";
                        break;
                    default:
                        ((10 !== r && 13 !== r && r >= 0 && r <= 31) ||
                            r > 32767) &&
                            (t = " ");
                }
                n[o] = t;
            }
            return n;
        }),
        (P.htmlToUnicode = function (e) {
            if (null == e || 0 === e.length) return e;
            let t = P.htmlToUnicodeTextArray(e);
            const n = t.join("");
            return (t = null), n;
        }),
        (P.htmlToAscii = function (e, t) {
            return null == e || 0 === e.length
                ? e
                : P.htmlToAsciiTextArray(e, t).join("");
        }),
        (P.escapeHtml = function (e) {
            return e
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }),
        (P.escapeFileName = function (e) {
            return e
                .replace(/:/g, "_")
                .replace(/\\/g, "_")
                .replace(/\//g, "_")
                .replace(/&/g, "_")
                .replace(/>/g, "_")
                .replace(/</g, "_")
                .replace(/"/g, "_")
                .replace(/\|/g, "_")
                .replace(/\*/g, "_")
                .replace(/\?/g, "_");
        }),
        (P.objectsAreEqual = function (e, t) {
            if (e === t) return !0;
            if (null == e || null == t || typeof e != typeof t) return !1;
            if ("string" == typeof e || "number" == typeof e) return !1;
            if (e instanceof Array || t instanceof Array) {
                if (!(e instanceof Array && t instanceof Array)) return !1;
                if (e.length !== t.length) return !1;
                for (let n = 0; n < e.length; n += 1)
                    if (!P.objectsAreEqual(e[n], t[n])) return !1;
                return !0;
            }
            let n, o;
            for (let r = 0; r < 2; r += 1) {
                for (n in e)
                    if (e.hasOwnProperty(n)) {
                        if (!t.hasOwnProperty(n)) return !1;
                        if (!P.objectsAreEqual(e[n], t[n])) return !1;
                    }
                (o = e), (e = t), (t = o);
            }
            return !0;
        }),
        (P.indexOfElementInArray = function (e, t) {
            if (e)
                for (let n = 0; n < e.length; n += 1) if (e[n] === t) return n;
            return -1;
        }),
        (P.findParagraph = function (e, n) {
            return !e || n > e.length
                ? null
                : P.findToken(e, n, t.paragraphSeparator);
        }),
        (P.findSentence = function (e, n) {
            return !e || n > e.length
                ? null
                : P.findToken(e, n, t.sentenceSeparator);
        }),
        (P.findSentenceFrom = function (e, n) {
            if (n > e.length) return null;
            const o = n;
            let r = n;
            for (r = n; r < e.length; r += 1)
                if (t.sentenceSeparator.characterIsMember(e.charAt(r))) {
                    r += 1;
                    break;
                }
            r > e.length - 1 && (r = e.length - 1);
            let s = null;
            return o <= r && (s = e.slice(o, r + 1)), s;
        }),
        (P.findWord = function (e, n) {
            return !e || n > e.length
                ? null
                : P.findToken(e, n, t.wordSeparator);
        }),
        (P.getNumberOfWordsFromString = function (e) {
            let n = 0,
                o = 0;
            const r = e.length;
            for (let s = 0; s < r; s += 1) {
                const r = e[s];
                t.wordSeparator.characterIsMemberNoHypen(r)
                    ? o > 0 && ((n += 1), (o = 0))
                    : (o += 1);
            }
            return o > 0 && (n += 1), n;
        }),
        (P.tokenStartsSentence = function (e, n) {
            if (!e || n > e.length) return !1;
            let o = n - 1;
            for (
                ;
                o >= 0 && t.whiteSpace.characterIsMember(e.charAt(o));
                o -= 1
            );
            return !!(
                o <= 0 || t.sentenceSeparator.characterIsMember(e.charAt(o))
            );
        }),
        (P.findToken = function (e, t, n) {
            if (t > e.length || null == n) return null;
            let o = t;
            const r = t;
            for (o = t; o >= 0; o -= 1)
                if (n.characterIsMember(e.charAt(o))) {
                    o += 1;
                    break;
                }
            o < 0 && (o = 0);
            let s = null;
            return o <= r && (s = e.slice(o, r + 1)), s;
        }),
        (P.startsWithUpperCase = function (e) {
            const t = e.charAt(0);
            return t === t.toUpperCase();
        }),
        (P.colorToRgb = function (e) {
            let t =
                /rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3}),? ?(\d{1,3})?\)$/i.exec(
                    e,
                );
            return t
                ? {
                      r: parseInt(t[1], 10),
                      g: parseInt(t[2], 10),
                      b: parseInt(t[3], 10),
                  }
                : ((e = e.replace(
                      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                      (e, t, n, o) => t + t + n + n + o + o,
                  )),
                  (t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e)),
                  t
                      ? {
                            r: parseInt(t[1], 16),
                            g: parseInt(t[2], 16),
                            b: parseInt(t[3], 16),
                        }
                      : null);
        }),
        (P.colorFromRgb = function ({r: e, g: t, b: n}) {
            return `rgb(${e},${t},${n})`;
        }),
        (P.addOpacityToColor = function (e, t) {
            const n = P.colorToRgb(e);
            return `rgba(${n.r},${n.g},${n.b},${t})`;
        }),
        (P.colorToHex = function (e) {
            return (
                e && (e = P.colorToRgb(e)), e ? P.rgbToHex(e.r, e.g, e.b) : null
            );
        }),
        (P.rgbToHex = function (e, t, n) {
            const o = [e.toString(16), t.toString(16), n.toString(16)];
            for (let e = 0; e < o.length; e += 1)
                1 === o[e].length && (o[e] = `0${o[e]}`);
            return `#${o.join("")}`;
        }),
        (P.elementHasId = function (e, t) {
            if (!e || e.nodeType !== Node.ELEMENT_NODE || !t) return !1;
            try {
                const n = e.getAttribute("id");
                if (n && n.length > 0) {
                    let e = !1;
                    return (
                        (e =
                            t instanceof Array ? -1 !== t.indexOf(n) : n === t),
                        e
                    );
                }
            } catch (e) {}
            return !1;
        }),
        (P.elementHasAttribute = function (e, t) {
            if (!e || e.nodeType !== Node.ELEMENT_NODE || !t) return !1;
            try {
                if (!(t instanceof Array)) return e.hasAttribute(t);
                for (let n = 0; n < t.length; n += 1)
                    if (e.hasAttribute(t)) return !0;
            } catch (e) {}
            return !1;
        }),
        (P.addClassToElement = function (e, t) {
            e && t && e.classList.add(t);
        }),
        (P.removeClassFromElement = function (e, t) {
            e && t && e.classList.remove(t);
        }),
        (P.elementHasClass = function (e, t, n = !1) {
            if (!e || e.nodeType !== Node.ELEMENT_NODE || !t) return !1;
            try {
                let o = !1;
                const r = e.classList;
                if (!(t instanceof Array)) return (o = r.contains(t)), o;
                for (let e = 0; e < t.length; e += 1)
                    if (((o = r.contains(t[e])), n)) {
                        if (!o) return !0;
                    } else if (o) return !0;
            } catch (e) {}
            return !1;
        }),
        (P.addClassToHtmlElements = function (e, t) {
            const n = P.findValidDocumentElements(t);
            for (let t = 0; t < n.length; t += 1) {
                const o = n[t];
                o.documentElement &&
                    (P.addClassToElement(o.documentElement, e),
                    o.documentElement.setAttribute(e, "true"));
            }
        }),
        (P.removeClassFromHtmlElements = function (e, t) {
            const n = P.findValidDocumentElements(t);
            for (let t = 0; t < n.length; t += 1) {
                const o = n[t];
                o.documentElement &&
                    (P.removeClassFromElement(o.documentElement, e),
                    o.documentElement.removeAttribute(e));
            }
        }),
        (P.elementHasSpecialAttribute = function (e, t) {
            return e.hasAttribute(t) && "true" === e.getAttribute(t);
        }),
        (P.elementIsVisible = function (e, t) {
            if (!e) return !1;
            if (
                (e.nodeType === Node.TEXT_NODE && (e = e.parentElement),
                e instanceof Window || e.nodeType === Node.DOCUMENT_NODE)
            )
                return !0;
            t = t || e.ownerDocument;
            const n = Boolean(
                e.offsetWidth || e.offsetHeight || e.getClientRects().length,
            );
            let o = !1;
            if (n) {
                const n = t.defaultView
                    .getComputedStyle(e)
                    .getPropertyValue("visibility");
                o = Boolean("visible" === n || "collapsed" === n);
            }
            return n && o;
        }),
        (P.elementHasParent = function (e, t) {
            for (; e && e !== t; ) e = e.parentElement;
            return Boolean(null !== t && e === t);
        }),
        (P.focusedElement = function (e) {
            const t = e ? e.ownerDocument : document,
                {activeElement: n} = t;
            return n && e ? (P.elementHasParent(n, e) ? n : null) : n;
        }),
        (P.closestParent = function (e, t) {
            for (; e && e.nodeType !== Node.ELEMENT_NODE; ) e = e.parentElement;
            return e ? e.closest(t) : null;
        }),
        (P.elementIsInsideBody = function (e) {
            for (; e; ) {
                if (e.tagName && "BODY" === e.tagName.toUpperCase()) return !0;
                e = e.parentNode || e.host;
            }
            return !1;
        }),
        (P.lastElementChild = function (e, t) {
            if (e)
                try {
                    if (t) {
                        let t = null;
                        const n = P.documentForElement(e);
                        for (; e; ) {
                            for (
                                t = e.lastChild;
                                t && !P.elementIsVisible(t, n);

                            )
                                t = t.previousElementSibling;
                            if (!t) break;
                            e = t;
                        }
                    } else
                        for (
                            ;
                            e && e.lastChild && e.nodeType !== Node.TEXT_NODE;

                        )
                            e = e.lastChild;
                } catch (e) {
                    n.error(e);
                }
            return e;
        }),
        (P.isEditor = function (e, t) {
            if (t) {
                const t = P.elementContext(e);
                return !!t && t.isEditor;
            }
            if (void 0 !== e.selectionStart) return !0;
            for (; e; ) {
                if (
                    e.getAttribute &&
                    "true" === e.getAttribute("contenteditable")
                )
                    return !0;
                e = e.parentNode;
            }
            return !1;
        }),
        (P.editorContainer = function (e) {
            if (e)
                try {
                    if (void 0 !== e.selectionStart) return e;
                    if (e.isContentEditable) {
                        for (
                            ;
                            e.parentElement &&
                            e.parentElement.isContentEditable;

                        )
                            e = e.parentElement;
                        return e;
                    }
                } catch (e) {
                    n.error(e);
                }
            return null;
        }),
        (P.elementContext = function (e) {
            if (!e) return null;
            const t = {
                document: P.documentForElement(e),
                element: e,
                editor: null,
                isEditor: !1,
                isPlainEditor: !1,
                isContentEditable: !1,
                isGoogleDocs: P.isGoogleDocs(),
                isGoogleDocsEditor: !1,
                isGoogleSlides: P.isGoogleSlides(),
                isGoogleHangouts: P.isGoogleHangouts(),
                isYahooMail: P.isYahooMail(),
                isOverDriveReader: P.isOverDriveReader(),
                isBookshareReader: P.isBookshareReader(),
                isMsOfficeWord: P.isMsOfficeWord(),
                isMSOfficeWordEditor: !1,
                isAmazonKindle: !1,
                isMicrosoftOutlook: P.isMicrosoftOutlook(),
            };
            try {
                void 0 !== e.selectionStart && (t.isPlainEditor = !0);
            } catch (e) {}
            try {
                e.isContentEditable && (t.isContentEditable = !0);
            } catch (e) {}
            return (
                t.isPlainEditor || t.isContentEditable
                    ? (t.editor = e)
                    : P.isGoogleDocsEditor(e)
                      ? ((t.isGoogleDocsEditor = !0),
                        (t.editor = document.querySelector(
                            ".kix-appview-editor",
                        )))
                      : P.isAmazonKindle() &&
                        !P.elementHasClass(
                            document.documentElement,
                            "dji-sru-screen-selection",
                        ) &&
                        (t.isAmazonKindle = !0),
                P.isMSOfficeWordEditor(e) &&
                    ((t.isMSOfficeWordEditor = !0), (t.isContentEditable = !1)),
                (t.isEditor =
                    t.isPlainEditor ||
                    t.isContentEditable ||
                    t.isGoogleDocsEditor ||
                    t.isMSOfficeWordEditor),
                t
            );
        }),
        (P.visibleSruPopup = function (e) {
            const t = e || document,
                n =
                    "div#dji-sru-ocr-content,div#dji-sru-overlay-selection, div[dji-sru-rewordify-popup], div#dji-sru-define-popup";
            let o = t.querySelectorAll(n),
                r = W(o);
            if (r) return r;
            const s = t.querySelector("dji-sru#__dji_sru_components");
            if (s && s.shadowRoot) {
                const e = s.shadowRoot.querySelectorAll("iframe"),
                    t = e.length;
                for (let s = 0; s < t; s += 1) {
                    const t = e[s];
                    if (
                        t &&
                        t.contentDocument &&
                        ((o = t.contentDocument.querySelectorAll(n)),
                        (r = W(o)),
                        r)
                    )
                        return r;
                }
            }
            return null;
        }),
        (P.activeElementInfo = function (e = !1, t = void 0) {
            const n = [];
            let o = document,
                r = o.activeElement,
                s = !1,
                a = !1,
                i = !1,
                c = !1,
                l = !1;
            const u = P.visibleSruPopup(o);
            if (t && P.isSruMainContainerFrame(t.element))
                (r = t.element || r), (o = r.ownerDocument);
            else if (u) (r = u), (o = r.ownerDocument);
            else if (P.isSruPwaApp() && t)
                (r = t.element || r), (o = r.ownerDocument);
            else if (P.isGoogleDocsEditor(r)) {
                if ("IFRAME" === r.tagName) {
                    const e = document.getElementById("kix-appview"),
                        t = e
                            ? e.getElementsByClassName("kix-appview-editor")
                            : null;
                    t && t.length > 0 && ([r] = t);
                }
                s = !0;
            } else if (P.isGoogleSlidesEditor(r)) a = !0;
            else if (P.isMSOfficeWordEditor(r)) l = !0;
            else if (
                P.isAmazonKindle() &&
                !P.elementHasClass(
                    document.documentElement,
                    "dji-sru-screen-selection",
                )
            ) {
                const e = document.getElementById("KindleReaderIFrame");
                if (e) {
                    r = e.contentWindow.document;
                    const t = r.getElementById("column_0_frame_0");
                    if (t && "hidden" !== t.style.visibility) n.push(t);
                    else {
                        const e = r.getElementById("column_0_frame_1");
                        e && n.push(e);
                    }
                    const o = r.getElementById("column_1_frame_0");
                    if (o && "hidden" !== o.style.visibility) n.push(o);
                    else {
                        const e = r.getElementById("column_1_frame_1");
                        e && n.push(e);
                    }
                }
                (o = document), (i = !0);
            } else if (P.isYahooNews())
                r.closest("#search-assist-input") && (r = o.body);
            else if (P.isCambridgeLMS() && "IFRAME" === r.tagName) {
                const e = r.contentDocument.activeElement;
                e &&
                    "FRAME" === e.tagName &&
                    ((o = e.contentDocument),
                    (r = e.contentDocument.activeElement));
            } else {
                const s = P.findRangeSelection(r);
                if (s) r = P.extractActiveElementFromSelection(s);
                else {
                    let e = !1;
                    for (
                        ;
                        !e && r && ("IFRAME" === r.tagName || r.shadowRoot);

                    )
                        try {
                            if (((e = !0), r.shadowRoot)) {
                                const {activeElement: n} = r.shadowRoot;
                                if (
                                    ("__dji_sru_main_container" === r.id &&
                                        (c = !0),
                                    n)
                                )
                                    (r = n), (e = !1);
                                else if (t && t.location) {
                                    const e = r.shadowRoot.elementsFromPoint(
                                        t.location.x,
                                        t.location.y,
                                    );
                                    r = e.length > 0 ? e[0] : null;
                                }
                            } else
                                P.validateIframe(r, !0) &&
                                    null !== r.contentDocument &&
                                    (n.push(r),
                                    (o = r.contentDocument),
                                    (r = o.activeElement),
                                    (e = !1));
                        } catch (e) {
                            break;
                        }
                }
                if (!r || (e && "IFRAME" === r.tagName)) return null;
            }
            return {
                iframes: n,
                document: o,
                element: r,
                isActive: !(
                    !r ||
                    !r.ownerDocument ||
                    r.ownerDocument.activeElement !== r
                ),
                isGoogleDocsEditor: s,
                isGoogleSlidesEditor: a,
                isAmazonKindle: i,
                isOverDriveReader: P.isOverDriveReaderDocument(o, !1, t),
                isSruOutlines: c,
                isMsOfficeWord: l,
                isBookshareReader: P.isBookshareReader(),
            };
        }),
        (P.extractActiveElementFromSelection = function (e) {
            const {anchorNode: t} = e;
            return t.nodeType === Node.TEXT_NODE ? t.parentElement : t;
        }),
        (P.findRangeSelection = function (e) {
            let t = null;
            e
                ? "FRAME" === e.tagName && e.contentDocument
                    ? (t = e.contentDocument)
                    : e.ownerDocument && (t = e.ownerDocument)
                : (t = document);
            const n = t.getSelection();
            if ("Range" !== n.type) return null;
            const o = function (e) {
                return (
                    "Range" === e.type &&
                    !(
                        e.anchorNode === e.focusNode &&
                        e.anchorOffset === e.focusOffset
                    )
                );
            };
            let r = null;
            return (
                o(n) || (r = P.getShadowRootSelection(n.anchorNode, o)),
                null != r &&
                    r.anchorNode !== n.anchorNode &&
                    r.focusNode !== n.focusNode &&
                    n.setBaseAndExtent(
                        r.anchorNode,
                        r.anchorOffset,
                        r.focusNode,
                        r.focusOffset,
                    ),
                n
            );
        }),
        (P.getShadowRootSelection = function (e, t) {
            let n = Array.from(e.children);
            if (e.shadowRoot) {
                const o = e.shadowRoot.getSelection();
                if (t(o)) return o;
                n = n.concat(Array.from(e.shadowRoot.children));
            }
            for (let e = 0; e < n.length; e += 1) {
                const o = P.getShadowRootSelection(n[e], t);
                if (o) return o;
            }
            return null;
        }),
        (P.extractVisibleTextFromElement = function (e) {
            if (!e) return "";
            if (3 === e.nodeType) return e.textContent;
            let t = "",
                n = null;
            const o = document.createTreeWalker(
                e,
                NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
                (e) => {
                    if (3 === e.nodeType) return NodeFilter.FILTER_ACCEPT;
                    const n = e;
                    if (
                        "SCRIPT" === n.tagName ||
                        "NOSCRIPT" === n.tagName ||
                        "IMG" === n.tagName ||
                        "SELECT" === n.tagName
                    )
                        return NodeFilter.FILTER_REJECT;
                    if (
                        "INPUT" === n.tagName &&
                        "text" !== e.type.toLowerCase()
                    )
                        return NodeFilter.FILTER_REJECT;
                    const o = (n.getAttribute("id") || "").toLowerCase();
                    return "dexcontrolscontainer" === o ||
                        "dexcontrolscontainermeasurement" === o ||
                        "__dji_cwe_body_overlay" === o ||
                        "__dji_cwe_measurement_window_generic" === o ||
                        "__dji_cwe_chrome_google_docs_proxy" === o ||
                        "__dji_cwe_shortcuts" === o ||
                        "__dji_cwe_measurement_window_generic" === o ||
                        "none" ===
                            document.defaultView
                                .getComputedStyle(n, null)
                                .getPropertyValue("display")
                        ? NodeFilter.FILTER_REJECT
                        : ("SPAN" !== n.tagName && (t += "\n"),
                          NodeFilter.FILTER_ACCEPT);
                },
                !0,
            );
            for (n = o.nextNode(); n; )
                3 === n.nodeType
                    ? (t += ` ${n.textContent}`)
                    : 1 === n.nodeType &&
                      "TEXTAREA" === n.tagName &&
                      (t += `\n${n.value}\n`),
                    (n = o.nextNode());
            return t;
        }),
        (P.addEventListenerToBodyElements = function (e, t, n, o) {
            const r = P.findValidDocumentElements(null, o);
            for (let o = 0; o < r.length; o += 1)
                r[o].body && r[o].body.addEventListener(e, t, n);
        }),
        (P.addEventListenerToDocumentElements = function (e, t, n) {
            const o = P.findValidDocumentElements();
            for (let r = 0; r < o.length; r += 1)
                o[r].addEventListener(e, t, n);
        }),
        (P.removeEventListenerFromBodyElements = function (e, t, n, o) {
            const r = P.findValidDocumentElements(null, o);
            for (let o = 0; o < r.length; o += 1)
                try {
                    r[o].body && r[o].body.removeEventListener(e, t, n);
                } catch (e) {}
        }),
        (P.removeEventListenerFromDocumentElements = function (e, t, n) {
            const o = P.findValidDocumentElements();
            for (let r = 0; r < o.length; r += 1)
                o[r].removeEventListener(e, t, n);
        }),
        (P.preventInputEventsOnBodyElements = function (e, t, n, o, r) {
            const s = P.isGoogleDocs(),
                a = P.findValidIframeAndDocumentElements(null, o);
            for (let o = 0; o < a.length; o += 1) {
                const i = a[o];
                i.doc.body &&
                    (s
                        ? P.isGoogleDocsEditor(i.iframe) ||
                          P.preventInputEventsOnTree(i.doc.body, e, t, n, r)
                        : (i.iframe &&
                              "dji-sru-remove-distractions-iframe" ===
                                  i.iframe.id) ||
                          P.preventInputEventsOnTree(i.doc.body, e, t, n, r));
            }
        }),
        (P.preventInputEventsOnTree = function (e, t, n, o, r) {
            if (!e || 3 === e.nodeType) return;
            const s = P.isGoogleDocs();
            let a = null;
            const i = document.createTreeWalker(
                    e,
                    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
                    (e) => {
                        if (3 === e.nodeType) return NodeFilter.FILTER_REJECT;
                        const t = e;
                        if ("SCRIPT" === t.tagName || "NOSCRIPT" === t.tagName)
                            return NodeFilter.FILTER_REJECT;
                        if (s && P.isGoogleDocsEditor(e, !0))
                            return NodeFilter.FILTER_REJECT;
                        const o = t.id ? t.id.toLowerCase() : "";
                        return "dexcontrolscontainer" === o ||
                            "dexcontrolscontainermeasurement" === o ||
                            0 === o.indexOf("__dji_cwe") ||
                            (r && -1 !== r.indexOf(o)) ||
                            (!n && 0 === o.indexOf("dji-sru-"))
                            ? NodeFilter.FILTER_REJECT
                            : NodeFilter.FILTER_ACCEPT;
                    },
                    !0,
                ),
                c = o || U,
                l = o || V,
                u = !1;
            if (t)
                for (a = i.nextNode(); a; )
                    a.addEventListener("click", l, u),
                        a.addEventListener("mousedown", c, u),
                        a.addEventListener("mouseup", l, u),
                        a.addEventListener("mousemove", l, u),
                        a.addEventListener("mouseout", l, u),
                        a.addEventListener("mouseover", l, u),
                        (a = i.nextNode());
            else
                for (a = i.nextNode(); a; )
                    try {
                        a.removeEventListener("click", l, u),
                            a.removeEventListener("mousedown", c, u),
                            a.removeEventListener("mouseup", l, u),
                            a.removeEventListener("mousemove", l, u),
                            a.removeEventListener("mouseout", l, u),
                            a.removeEventListener("mouseover", l, u),
                            (a = i.nextNode());
                    } catch (e) {}
        }),
        (P.ignoreEvent = function (e) {
            e.preventDefault(), e.stopPropagation();
        }),
        (P.documentForElement = function (e) {
            for (; e && e.nodeType !== Node.DOCUMENT_NODE; ) e = e.parentNode;
            return e;
        }),
        (P.waitForDocumentToLoad = function (e, t) {
            if (((e = e || document), "complete" === document.readyState))
                P.callMethod(t);
            else {
                const n = function () {
                    "complete" === e.readyState &&
                        (e.removeEventListener("load", n, !0), P.callMethod(t));
                };
                e.addEventListener("load", n, !0);
            }
        }),
        (P.findValidDocumentElements = function (e, t) {
            1 === arguments.length &&
                "boolean" == typeof e &&
                ((t = e), (e = null));
            const n = [];
            return P.findValidDocumentElementsEx(e || document, n, t), n;
        }),
        (P.findValidDocumentElementsEx = function (e, t, n) {
            t.push(e);
            const o = P.findAllIframes(e);
            for (let e = 0; e < o.length; e += 1) {
                const r = o[e];
                P.validateIframe(r, n) &&
                    null !== r.contentDocument &&
                    P.findValidDocumentElementsEx(r.contentDocument, t, n);
            }
        }),
        (P.findValidIframeElements = function (e, t) {
            const n = [];
            return P.findValidIframeElementsEx(e || document, n, t), n;
        }),
        (P.findValidIframeElementsEx = function (e, t, n) {
            const o = P.findAllIframes(e);
            for (let e = 0; e < o.length; e += 1) {
                const r = o[e];
                P.validateIframe(r, n) &&
                    null !== r.contentDocument &&
                    (t.push(r),
                    P.findValidIframeElementsEx(r.contentDocument, t, n));
            }
        }),
        (P.findValidIframeAndDocumentElements = function (e, t) {
            const n = [];
            return (
                P.findValidIframeAndDocumentElementsEx(e || document, n, t), n
            );
        }),
        (P.findValidIframeAndDocumentElementsEx = function (e, t, n) {
            const o = P.findAllIframes(e);
            for (let e = 0; e < o.length; e += 1) {
                const r = o[e];
                P.validateIframe(r, n) &&
                    null !== r.contentDocument &&
                    (t.push({iframe: r, doc: r.contentDocument}),
                    P.findValidIframeAndDocumentElementsEx(
                        r.contentDocument,
                        t,
                        n,
                    ));
            }
        }),
        (P.findAllIframes = function (e) {
            const t = [...e.getElementsByTagName("iframe")].concat([
                ...e.getElementsByTagName("frame"),
            ]);
            window.top === window &&
                e.querySelectorAll("dji-sru").forEach((e) => {
                    e &&
                        e.shadowRoot &&
                        e.shadowRoot.querySelectorAll("iframe").forEach((e) => {
                            e && t.push(e);
                        });
                });
            const n = e.querySelector("dji-sru-distraction");
            if (n && n.shadowRoot) {
                const e = n.shadowRoot.querySelector(
                    "#dji-sru-remove-distractions-iframe",
                );
                e && t.push(e);
            }
            return t;
        }),
        (P.validateIframe = function (e, t) {
            try {
                if (void 0 === e.src || null === e.src) return !1;
                const n = e.getAttribute("id");
                if ("__dji_sru_templates" === n) return !1;
                if (!t && n && n.indexOf("dji_sru") >= 0) return !1;
                let o = null;
                const r = e.src.split("/")[2];
                if (null == r);
                else if (-1 === r.indexOf(document.domain)) return !1;
                return (o = e.contentDocument), null != o;
            } catch (e) {}
            return !1;
        }),
        (P.addMultipleCssToDocument = function (e, t) {
            t.forEach((t) => {
                "string" == typeof t
                    ? P.addLinkToDocument(e, null, "stylesheet", "text/css", t)
                    : P.addLinkToDocument(
                          e,
                          t.id,
                          "stylesheet",
                          "text/css",
                          t.href,
                          Boolean(t.isExternal),
                      );
            });
        }),
        (P.addJavascriptToDocument = function (e, t, n, o) {
            const r = e.createElement("script");
            if (
                ((r.async = !1),
                o &&
                    (r.onload = function () {
                        o();
                    }),
                !e.head)
            ) {
                const t = e.createElement("head");
                e.documentElement.appendChild(t);
            }
            return (
                (r.src = n ? t : chrome.extension.getURL(t)),
                e.head.appendChild(r),
                r
            );
        }),
        (P.addLinkToDocument = async function (e, t, n, o, r, s) {
            t ||
                (t = await (async function (e) {
                    try {
                        const t = new TextEncoder().encode(e),
                            n = await crypto.subtle.digest("SHA-256", t);
                        return String.fromCharCode.apply(
                            null,
                            new Uint16Array(n),
                        );
                    } catch (e) {
                        return null;
                    }
                })(r));
            let a = e.getElementById(t);
            if (a) return a;
            if (null == s) {
                let e = null;
                try {
                    e = new URL(r);
                } catch (e) {}
                s = Boolean(e);
            }
            if (
                ((a = e.createElement("link")),
                (a.id = t),
                (a.href = s ? r : chrome.extension.getURL(r)),
                (a.async = !0),
                (a.rel = n),
                (a.type = o),
                !e.head)
            ) {
                const t = e.createElement("head");
                e.documentElement.appendChild(t);
            }
            return e.head.appendChild(a), a;
        }),
        (P.generateUUID = function () {
            let e = new Date().getTime();
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                (t) => {
                    const n = (e + 16 * Math.random()) % 16 | 0;
                    return (
                        (e = Math.floor(e / 16)),
                        ("x" === t ? n : (7 & n) | 8).toString(16)
                    );
                },
            );
        }),
        (P.blobToText = function (e, t) {
            if (e) {
                const n = new FileReader();
                (n.onloadend = function () {
                    t(n.result);
                }),
                    (n.onerror = function () {
                        t(null);
                    }),
                    n.readAsText(e);
            } else t(null);
        }),
        (P.htmlToAsciiTextArray = function (e, t) {
            if (null == e) return null;
            if (0 === e.length) return [];
            const n = e.length,
                o = new Array(n);
            for (let r = 0; r < n; r += 1) {
                let n = e.charAt(r);
                const s = e.charCodeAt(r);
                switch (s) {
                    case 9:
                    case 160:
                        n = " ";
                        break;
                    case 216:
                    case 248:
                    case 510:
                    case 511:
                        n = "0";
                        break;
                    case 451:
                        n = "!";
                        break;
                    case 192:
                    case 193:
                    case 194:
                    case 195:
                    case 196:
                    case 197:
                    case 198:
                    case 256:
                    case 258:
                    case 260:
                    case 461:
                    case 478:
                    case 480:
                    case 482:
                    case 506:
                    case 508:
                    case 512:
                    case 514:
                    case 550:
                        n = "A";
                        break;
                    case 224:
                    case 225:
                    case 226:
                    case 227:
                    case 228:
                    case 229:
                    case 230:
                    case 257:
                    case 259:
                    case 261:
                    case 462:
                    case 479:
                    case 481:
                    case 483:
                    case 507:
                    case 509:
                    case 513:
                    case 515:
                    case 551:
                        n = "a";
                        break;
                    case 199:
                    case 262:
                    case 264:
                    case 266:
                    case 268:
                        n = "C";
                        break;
                    case 231:
                    case 263:
                    case 265:
                    case 267:
                    case 269:
                        n = "c";
                        break;
                    case 208:
                    case 270:
                    case 272:
                        n = "D";
                        break;
                    case 271:
                    case 273:
                        n = "d";
                        break;
                    case 200:
                    case 201:
                    case 202:
                    case 203:
                    case 274:
                    case 276:
                    case 278:
                    case 280:
                    case 282:
                    case 516:
                    case 518:
                    case 552:
                        n = "E";
                        break;
                    case 232:
                    case 233:
                    case 234:
                    case 235:
                    case 275:
                    case 277:
                    case 279:
                    case 281:
                    case 283:
                    case 517:
                    case 519:
                    case 553:
                        n = "e";
                        break;
                    case 284:
                    case 286:
                    case 288:
                    case 290:
                    case 484:
                    case 486:
                    case 500:
                        n = "G";
                        break;
                    case 285:
                    case 287:
                    case 289:
                    case 291:
                    case 485:
                    case 487:
                    case 501:
                        n = "g";
                        break;
                    case 292:
                    case 294:
                    case 502:
                        n = "H";
                        break;
                    case 293:
                    case 295:
                        n = "h";
                        break;
                    case 204:
                    case 205:
                    case 206:
                    case 207:
                    case 296:
                    case 298:
                    case 300:
                    case 302:
                    case 304:
                    case 463:
                    case 520:
                    case 522:
                        n = "I";
                        break;
                    case 236:
                    case 237:
                    case 238:
                    case 239:
                    case 297:
                    case 299:
                    case 301:
                    case 303:
                    case 305:
                    case 464:
                    case 521:
                    case 523:
                        n = "i";
                        break;
                    case 308:
                        n = "J";
                        break;
                    case 309:
                        n = "j";
                        break;
                    case 310:
                    case 488:
                        n = "K";
                        break;
                    case 311:
                    case 312:
                    case 489:
                        n = "k";
                        break;
                    case 313:
                    case 315:
                    case 317:
                    case 319:
                    case 321:
                        n = "L";
                        break;
                    case 314:
                    case 316:
                    case 318:
                    case 320:
                    case 322:
                        n = "l";
                        break;
                    case 209:
                    case 323:
                    case 325:
                    case 327:
                    case 330:
                    case 504:
                        n = "N";
                        break;
                    case 240:
                    case 241:
                    case 324:
                    case 326:
                    case 328:
                    case 329:
                    case 331:
                    case 505:
                        n = "n";
                        break;
                    case 210:
                    case 211:
                    case 212:
                    case 213:
                    case 214:
                    case 332:
                    case 334:
                    case 336:
                    case 465:
                    case 490:
                    case 492:
                    case 524:
                    case 526:
                    case 554:
                    case 556:
                    case 558:
                    case 560:
                        n = "O";
                        break;
                    case 242:
                    case 243:
                    case 244:
                    case 245:
                    case 246:
                    case 333:
                    case 335:
                    case 337:
                    case 466:
                    case 491:
                    case 493:
                    case 525:
                    case 527:
                    case 555:
                    case 557:
                    case 559:
                    case 561:
                        n = "o";
                        break;
                    case 340:
                    case 342:
                    case 344:
                    case 528:
                    case 530:
                        n = "R";
                        break;
                    case 341:
                    case 343:
                    case 345:
                    case 529:
                    case 531:
                        n = "r";
                        break;
                    case 346:
                    case 348:
                    case 350:
                    case 352:
                    case 536:
                        n = "S";
                        break;
                    case 347:
                    case 349:
                    case 351:
                    case 353:
                    case 537:
                        n = "s";
                        break;
                    case 354:
                    case 356:
                    case 358:
                    case 538:
                        n = "T";
                        break;
                    case 355:
                    case 357:
                    case 359:
                    case 539:
                        n = "t";
                        break;
                    case 217:
                    case 218:
                    case 219:
                    case 220:
                    case 360:
                    case 362:
                    case 364:
                    case 366:
                    case 368:
                    case 370:
                    case 467:
                    case 469:
                    case 471:
                    case 473:
                    case 475:
                    case 532:
                    case 534:
                        n = "U";
                        break;
                    case 249:
                    case 250:
                    case 251:
                    case 252:
                    case 361:
                    case 363:
                    case 365:
                    case 367:
                    case 369:
                    case 371:
                    case 468:
                    case 470:
                    case 472:
                    case 474:
                    case 476:
                    case 533:
                    case 535:
                        n = "u";
                        break;
                    case 372:
                        n = "W";
                        break;
                    case 373:
                        n = "w";
                        break;
                    case 221:
                    case 374:
                    case 376:
                    case 562:
                        n = "Y";
                        break;
                    case 253:
                    case 254:
                    case 255:
                    case 375:
                    case 563:
                        n = "y";
                        break;
                    case 377:
                    case 379:
                    case 381:
                    case 548:
                        n = "Z";
                        break;
                    case 378:
                    case 380:
                    case 382:
                    case 549:
                        n = "z";
                        break;
                    case 8211:
                        n = "-";
                        break;
                    case 8216:
                    case 8217:
                        n = "'";
                        break;
                    case 8220:
                    case 8221:
                        n = '"';
                        break;
                    case 8203:
                    case 8204:
                        t || (n = "");
                        break;
                    default:
                        ((10 !== s && 13 !== s && s >= 0 && s <= 31) ||
                            s >= 127) &&
                            (n = " ");
                }
                o[r] = n;
            }
            return o;
        }),
        (P.splitInWords = function (e, t) {
            const n = e.split(/\W/i);
            if (t) return n;
            const o = [];
            for (let e = 0; e < n.length; e += 1) {
                const t = n[e];
                t && t.length > 0 && o.push(t);
            }
            return o;
        });
    const B = function e(t) {
        if (!t) return 1;
        const n = document.defaultView
            .getComputedStyle(t)
            .getPropertyValue("z-index");
        return Number.isNaN(Number(n)) ? e(t.parentElement) : n;
    };
    function H(e, t) {
        if (e === t) return 0;
        const n = e.compareDocumentPosition(t);
        return n & Node.DOCUMENT_POSITION_FOLLOWING ||
            n & Node.DOCUMENT_POSITION_CONTAINED_BY
            ? -1
            : n & Node.DOCUMENT_POSITION_PRECEDING ||
                n & Node.DOCUMENT_POSITION_CONTAINS
              ? 1
              : 0;
    }
    function q(e) {
        const t = [];
        for (; e; e = e.parentNode) t.push(e);
        return t;
    }
    function Y(e, t) {
        if (e === t) return e.parentNode;
        const n = q(e),
            o = q(t);
        let r = null;
        const s = n.length;
        for (let e = 0; e < s; e += 1) {
            const t = n[e],
                s = o.length;
            for (let e = 0; e < s; e += 1)
                if (t === o[e]) {
                    r = t;
                    break;
                }
            if (r) break;
        }
        return r;
    }
    (P.addMathOverlay = function () {
        const e = document.querySelectorAll(
            '*[id^="MathJax-Element-"][id$="Frame"]',
        );
        for (let t = 0; t < e.length; t += 1) {
            let n = e[t].querySelector('[id^="MathJax-Span"]');
            n ||
                ((n = e[t].querySelector('[id^="MJXp-Span"]')),
                n || (n = e[t])),
                n.style.position ||
                    ((n.style.position = "relative"),
                    (n.style.top = "0"),
                    (n.style.left = "0"));
            const o = document.createElement("span");
            (o.style.position = "absolute"),
                (o.style.top = "0"),
                (o.style.left = "0"),
                (o.style.bottom = "0"),
                (o.style.right = "0"),
                (o.style.zIndex = B(n) + 1),
                o.setAttribute("class", "dji-sru-math-overlay"),
                o.setAttribute("data-parent-id", e[t].getAttribute("id")),
                n.appendChild(o);
        }
    }),
        (P.removeMathOverlay = function () {
            const e = document.querySelectorAll(
                '*[id^="MathJax-Element-"][id$="Frame"]',
            );
            for (let t = 0; t < e.length; t += 1) {
                const n = e[t].querySelector(".dji-sru-math-overlay");
                n && n.parentNode.removeChild(n);
            }
        }),
        (P.createLastErrorHandler = function () {
            return P.checkLastError;
        }),
        (P.checkLastError = function () {
            chrome.runtime.lastError &&
                n.error(chrome.runtime.lastError.message);
        }),
        (P.ignoreLastError = function () {
            P.ignoreLastError.lastError = chrome.runtime.lastError;
        }),
        (P.isNullOrUndefined = function (e) {
            return null == e;
        }),
        (P.isForwardSelection = function (e) {
            if ("None" === e.type || "Caret" === e.type) return !0;
            const t = e.anchorNode.compareDocumentPosition(e.focusNode);
            return !(
                (!t && e.anchorOffset > e.focusOffset) ||
                t === Node.DOCUMENT_POSITION_PRECEDING
            );
        }),
        (P.getExtendedSelection = function (e, n) {
            const o = {
                    anchorNode: e.anchorNode,
                    anchorOffset: e.anchorOffset,
                    focusNode: e.focusNode,
                    focusOffset: e.focusOffset,
                },
                r = P.isForwardSelection(e),
                s = e.toString();
            if (0 === s.length) return e;
            const a = "left" === n ? 0 : s.length - 1;
            let i, c;
            ("left" === n && r) || ("right" === n && !r)
                ? ((i = o.anchorNode), (c = o.anchorOffset))
                : ((i = o.focusNode), (c = o.focusOffset));
            const l = {};
            if (
                ((l.anchorNode = r ? o.anchorNode : o.focusNode),
                (l.anchorOffset = r ? o.anchorOffset : o.focusOffset),
                (l.focusNode = r ? o.focusNode : o.anchorNode),
                (l.focusOffset = r ? o.focusOffset : o.anchorOffset),
                !t.wordSeparator.characterIsMemberNoHypen(s[a]))
            ) {
                e.setBaseAndExtent(i, c, i, c);
                const o = "left" === n ? "backward" : "forward",
                    r = "backward" === o ? "forward" : "backward";
                let s = !0,
                    a = e.focusNode;
                for (; s; ) {
                    const i = e.toString();
                    let c = !1;
                    e.modify("extend", o, "character");
                    const u = e.toString();
                    a !== e.focusNode && ((a = e.focusNode), (c = !0));
                    const d = u !== i,
                        f = "right" === n ? u.length - 1 : 0;
                    (0 !== u.length &&
                        !t.wordSeparator.characterIsMemberNoHypen(u[f]) &&
                        d) ||
                        ((s = !1),
                        (c || (d && u.length - i.length == 1)) &&
                            e.modify("extend", r, "character"),
                        "left" === n
                            ? ((l.anchorNode = e.focusNode),
                              (l.anchorOffset = e.focusOffset))
                            : ((l.focusNode = e.focusNode),
                              (l.focusOffset = e.focusOffset)));
                }
            }
            return (
                e.setBaseAndExtent(
                    o.anchorNode,
                    o.anchorOffset,
                    o.focusNode,
                    o.focusOffset,
                ),
                l
            );
        }),
        (P.extendSelection = function (e, t, o, r) {
            if (!e) return null;
            try {
                let n = "word" === o ? P.countWords : null;
                if (
                    ("character" === o &&
                        (n = P.countVisibleNonSpaceCharacters),
                    !n)
                )
                    return null;
                const s = n(r);
                let a = e.toString();
                const i = n(a);
                let c = s - i;
                for (; c > 0; ) {
                    const {anchorNode: r} = e,
                        {anchorOffset: l} = e,
                        {focusNode: u} = e,
                        {focusOffset: d} = e;
                    for (let n = 0; n < c; n += 1) e.modify("extend", t, o);
                    const f = e.toString();
                    if (
                        e.anchorNode === r &&
                        e.anchorOffset === l &&
                        e.focusNode === u &&
                        e.focusOffset === d &&
                        f === a
                    )
                        break;
                    (a = f), (c = s - (n(a) - i));
                }
            } catch (e) {
                return n.error(e), null;
            }
            return e;
        }),
        (P.countWords = function (e) {
            let n = 0;
            return (
                e.split(/[\s\u200B\u200C]/).forEach((e) => {
                    const o = e.length;
                    for (let r = 0; r < o; r += 1)
                        if (!t.wordSeparator.characterIsMember(e[r])) {
                            n += 1;
                            break;
                        }
                }),
                n
            );
        }),
        (P.countVisibleCharacters = function (e, n = 0, o = e.length) {
            let r = 0;
            for (let s = n; s < o; s += 1)
                t.invisibleWhiteSpace.characterIsMember(e[s]) || (r += 1);
            return r;
        }),
        (P.countVisibleNonSpaceCharacters = function (e, t = 0, n = e.length) {
            let o = 0;
            for (let r = t; r < n; r += 1)
                P.isVisibleNonSpaceCharacter(e[r]) && (o += 1);
            return o;
        }),
        (P.isVisibleNonSpaceCharacter = function (e) {
            return !(
                t.invisibleWhiteSpace.characterIsMember(e) ||
                t.wordSeparator.characterIsMemberNoHypen(e)
            );
        }),
        (P.caretPositionFromPoint = function (e, t, n = document) {
            if (n.caretPositionFromPoint) return n.caretPositionFromPoint(e, t);
            if (n.caretRangeFromPoint) {
                const o = n.caretRangeFromPoint(e, t);
                return {
                    offsetNode: o ? o.startContainer : null,
                    offset: o ? o.startOffset : -1,
                };
            }
            return null;
        }),
        (P.normalizedText = function (e) {
            if (!e || e.length <= 0) return e;
            e = e.split("");
            for (let t = 0; t < e.length; t += 1) {
                const n = e[t],
                    o = P.normalizedChar(e[t]);
                n !== o && (e[t] = o);
            }
            return e.join("");
        }),
        (P.normalizedChar = function (e) {
            switch (e.charCodeAt(0)) {
                case 8203:
                case 8204:
                case 8237:
                case 8236:
                    return "";
                case 160:
                    return " ";
                default:
                    return e;
            }
        }),
        (P.getTextFromImage = function (e) {
            let t = $(e).attr("alt");
            if (!t || 0 === t.length) {
                const n = $(e).parent();
                if (1 === n.length && "FIGURE" === n[0].tagName) {
                    const e = $("figcaption", n);
                    e.length > 0 && (t = e[0].textContent);
                }
            }
            return t;
        }),
        (P.getImageSrc = function (e) {
            if (e.src && e.src.length > 0) return e.src;
            let t = e;
            if (!e.srcset || 0 === e.srcset.length) {
                const n = e.parentElement;
                if (!n || "PICTURE" !== n.tagName) return null;
                {
                    const e = n.querySelectorAll("source");
                    if (((t = e.length > 1 ? e[e.length - 1] : e[0]), !t))
                        return null;
                }
            }
            const {srcset: n} = t,
                o = n.split(",");
            return (o.length > 1 ? o[o.length - 1] : o[0]).trim().split(" ")[0];
        }),
        (P.copyDocumentProperties = function (e, t, n) {
            for (let o = 0; o < e.length; o += 1) {
                const r = t.documentElement.style.getPropertyValue(e[o]);
                n.documentElement.style.setProperty(e[o], r);
            }
        }),
        (P.visibleElementsInContainer = function (e, t, n, o, r) {
            const s = [],
                a = e.body.getBoundingClientRect();
            o = o || 0;
            const i = n.getBoundingClientRect().top + o;
            for (let e = 0; e < t.length; e += 1) {
                const n = t[e],
                    o = n.getBoundingClientRect(),
                    c = 3;
                (r
                    ? o.top + c >= a.top + i && o.bottom - c <= a.bottom
                    : o.top <= a.bottom && o.bottom >= i) && s.push(n);
            }
            return s;
        }),
        (P.registerService = async function (e, t, n, o) {
            const r = await P.sha256(`${e}:${t}`),
                s = Date.now();
            let a;
            const i = n || window.top,
                c = function (t) {
                    t.data &&
                        t.data.hasOwnProperty("message") &&
                        t.data.message === F.MSG_SRV_AVAILABLE_ACK &&
                        t.data.checksum === r &&
                        (clearInterval(a),
                        window.removeEventListener("message", c, !0),
                        o({
                            success: !0,
                            messageProxy: new F(`framePreloader::${e}`, {
                                wnd: t.source,
                                port: t.ports[0],
                            }),
                        }));
                },
                l = function () {
                    const n = Date.now();
                    3e4 < n - s &&
                        (clearInterval(a),
                        window.removeEventListener("message", c, !0),
                        o({success: !1})),
                        i.postMessage(
                            {
                                message: F.MSG_SRV_AVAILABLE,
                                timestamp: n,
                                service: e,
                                checksum: r,
                                key: t,
                            },
                            "*",
                        );
                };
            window.addEventListener("message", c, !0),
                (a = setInterval(l, 1e4)),
                l();
        }),
        (P.sha256 = async function (e) {
            const t = new TextEncoder().encode(e),
                n = await crypto.subtle.digest("SHA-256", t);
            return Array.from(new Uint8Array(n))
                .map((e) => `00${e.toString(16)}`.slice(-2))
                .join("");
        }),
        (P.sortNodesByPosition = function (e) {
            return e.sort(H);
        }),
        (P.binaryStringToBlob = function (e) {
            if (e) {
                const {length: t} = e,
                    n = new Uint8Array(t);
                for (let o = 0; o < t; o += 1) n[o] = e.charCodeAt(o);
                return new Blob([n], {type: "application/octet-stream"});
            }
            return null;
        }),
        (P.blobToBinaryString = function (e) {
            return new Promise((t, n) => {
                const o = new FileReader();
                o.readAsBinaryString(e),
                    (o.onloadend = function () {
                        t(o.result);
                    }),
                    (o.onerror = function () {
                        n(null);
                    });
            });
        }),
        (P.blobToBase64 = function (e) {
            const t = new FileReader();
            return (
                t.readAsDataURL(e),
                new Promise((e) => {
                    t.onloadend = () => {
                        e(t.result);
                    };
                })
            );
        }),
        (P.arrayBufferToBase64 = function (e) {
            let t = "";
            const n = new Uint8Array(e),
                o = n.byteLength;
            for (let e = 0; e < o; e += 1) t += String.fromCharCode(n[e]);
            return window.btoa(t);
        }),
        (P.toUint8Array = function (e) {
            return (
                "Buffer" === e.type && (e = e.data),
                (e = new Uint8Array(e)),
                [...e]
            );
        }),
        (P.toArrayBuffer = function (e) {
            return e instanceof ArrayBuffer
                ? e
                : ("Buffer" === e.type && (e = e.data),
                  new Uint8Array(e).buffer);
        }),
        (P.isSruPopupElement = function (e) {
            return Boolean(
                e &&
                    "function" == typeof e.closest &&
                    (e.closest("div#dji-sru-ocr-content") ||
                        e.closest("div[dji-sru-rewordify-popup]") ||
                        e.closest("div#dji-sru-define-popup")),
            );
        }),
        (P.isSruOverlaySelectionElement = function (e) {
            return Boolean(
                e &&
                    "function" == typeof e.matches &&
                    e.matches("div#dji-sru-overlay-selection"),
            );
        }),
        (P.isSruMainContainerFrame = function (e) {
            return (
                "__dji_sru_main_container" === e.id ||
                !!(
                    e.ownerDocument &&
                    e.ownerDocument.defaultView &&
                    e.ownerDocument.defaultView.frameElement &&
                    "__dji_sru_main_container_iframe" ===
                        e.ownerDocument.defaultView.frameElement.id
                )
            );
        }),
        (P.computeCommonAncestor = function (e, t, ...n) {
            if (arguments.length < 1) return null;
            if (1 === arguments.length) return e;
            let o = Y(e, t);
            if (!o || 2 === arguments.length) return o;
            let r = 0;
            for (; r < n.length; r += 1)
                if (((o = Y(o, n[r])), !o)) return null;
            return 3 === o.nodeType && (o = o.parentNode), o;
        }),
        (P.isMathEquatioImage = function (e) {
            if (void 0 === e.nodeType) return !1;
            if (void 0 === e.tagName) return !1;
            if ("IMAGE" !== e.tagName.toUpperCase()) return !1;
            const t = e.querySelector("desc");
            return !!t && P.isMathMLEquatioDescription(t);
        }),
        (P.isMathMLEquatioDescription = function (e) {
            return (
                (e.nodeType !== Node.ELEMENT_NODE ||
                    "DESC" === e.tagName.toUpperCase()) &&
                !(
                    !e.parentElement ||
                    "IMAGE" !== e.parentElement.tagName.toUpperCase()
                ) &&
                P.isMathMLEquatioTextNode(e.firstChild)
            );
        }),
        (P.isMathMLEquatioTextNode = function (e) {
            return null != e && P.mightBeEquatioMathMLText(e.textContent);
        }),
        (P.mightBeEquatioMathMLText = function (e) {
            return (
                e.startsWith("<math") &&
                e.lastIndexOf('data-is-equatio="1"') > 0
            );
        }),
        (P.isMathMLElement = function (e) {
            return (
                e &&
                e.nodeType === Node.ELEMENT_NODE &&
                "MATH" === e.tagName.toUpperCase()
            );
        }),
        (P.hasMathMLData = function (e) {
            return (
                e &&
                e.nodeType === Node.ELEMENT_NODE &&
                e.dataset &&
                void 0 !== e.dataset.mathml
            );
        }),
        (P.isEquatioImg = function (e) {
            if (
                !e ||
                e.nodeType !== Node.ELEMENT_NODE ||
                "IMG" !== e.tagName.toUpperCase() ||
                "string" != typeof e.src
            )
                return !1;
            try {
                return Boolean(
                    "equatio-api.texthelp.com" === new URL(e.src).hostname,
                );
            } catch (e) {
                return !1;
            }
        }),
        (P.latexFromEquatioUri = function (e) {
            try {
                const t = new URL(e);
                if (0 === t.pathname.length) return "";
                return decodeURIComponent(t.pathname).substring(
                    t.pathname.indexOf("/", 1) + 1,
                );
            } catch (e) {
                return n.error(e), "";
            }
        }),
        (e.CharSet = t),
        (e.DOMRectExtensions = T),
        (e.Logger = n),
        (e.MessageProxy = F),
        (e.Messages = v),
        (e.PageObserver = N),
        (e.Proxy = O),
        (e.Utils = P),
        Object.defineProperty(e, "__esModule", {value: !0});
});
