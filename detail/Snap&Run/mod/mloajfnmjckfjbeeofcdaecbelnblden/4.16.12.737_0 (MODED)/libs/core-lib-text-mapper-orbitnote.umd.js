/*!************************************************************************
 **
 ** Copyright (c) 2022-2024 Don Johnston, Inc. All rights reserved.
 **
 **************************************************************************/
!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
        ? t(require("core-lib-utils"), require("core-lib-text-mapper"))
        : "function" == typeof define && define.amd
          ? define(["core-lib-utils", "core-lib-text-mapper"], t)
          : t(
                (e = "undefined" != typeof globalThis ? globalThis : e || self)
                    .__DjiCoreLibUtils,
                e.__DjiTextMapper,
            );
})(this, function (e, t) {
    "use strict";
    var r;
    function n(e, t) {
        return "string" == typeof t ? r.TEXT + t : t;
    }
    function i(e, t) {
        if ("string" != typeof t) return t;
        const n = t.substring(0, 1),
            i = t.substring(1);
        switch (n) {
            case r.TEXT:
                return i;
            case r.HTML_ELEMENT: {
                const e = Array.from(document.getElementsByClassName(i));
                if (0 === e.length)
                    throw new Error(
                        "Couldn't find element with unique class `" + i + "`!",
                    );
                if (e.length > 1)
                    throw new Error(
                        "Found multiple elements with unique class `" +
                            i +
                            "`!",
                    );
                return e[0];
            }
            default:
                throw (function (e, t) {
                    throw t;
                })(
                    0,
                    new Error(
                        "Unknown identifier in beginning of text \\x" +
                            ((s = n) < 10 ? "0" + String(s) : s.toString(16)),
                    ),
                );
        }
        var s;
    }
    !(function (e) {
        (e.TEXT = ""), (e.HTML_ELEMENT = "");
    })(r || (r = {}));
    var s = () =>
        ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (e) =>
            (
                e ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (e / 4)))
            ).toString(16),
        );
    class o {
        mInboundEventName;
        mOutboundEventName;
        constructor(e, t) {
            (this.mInboundEventName = e), (this.mOutboundEventName = t);
        }
        send(e) {
            document.dispatchEvent(
                new CustomEvent(this.mInboundEventName, {
                    cancelable: !0,
                    bubbles: !0,
                    detail: JSON.stringify(e, n),
                }),
            );
        }
        eventOnly(e) {
            const t = e.id || s();
            (e.id = t), this.send(e);
        }
        eventWithResponseSync(e) {
            let t = null;
            return (
                this.eventWithResponseCallbacks(
                    e,
                    (e) => {
                        t = e;
                    },
                    () => {
                        t = null;
                    },
                ),
                t
            );
        }
        eventWithResponseCallbacks(e, t, r) {
            const o = e.id || s();
            e.id = o;
            const a = (e) => {
                let r = !1;
                try {
                    const n = JSON.parse(e.detail, i);
                    (r = Boolean(n && n.id === o)),
                        r && t(JSON.parse(n.result, i));
                } finally {
                    r &&
                        document.removeEventListener(
                            this.mOutboundEventName,
                            a,
                        );
                }
            };
            document.addEventListener(this.mOutboundEventName, a),
                document.dispatchEvent(
                    new CustomEvent(this.mInboundEventName, {
                        cancelable: !0,
                        bubbles: !0,
                        detail: JSON.stringify(e, n),
                    }),
                );
        }
    }
    class a extends o {
        constructor() {
            super("dji-orbit-note-inbound", "dji-orbit-note-outbound");
        }
        getTextContent(e) {
            const t = {type: "getTextContent", args: [e]};
            return super.eventWithResponseSync(t);
        }
        getSelectedText() {
            return super.eventWithResponseSync({
                type: "getSelectedText",
                args: [],
            });
        }
        getCursor() {
            return super.eventWithResponseSync({type: "getCursor", args: []});
        }
        getCursorAtPosition(e, t) {
            const r = {type: "getCursorAtPosition", args: [e, t]};
            return super.eventWithResponseSync(r);
        }
        addOverlay(e) {
            const t = {type: "addOverlay", args: [e]};
            super.eventOnly(t);
        }
        clearOverlays() {
            super.eventOnly({type: "clearOverlays", args: []});
        }
        setLineGuideColors(e) {
            const t = {
                type: "setLineGuideColors",
                args: [e.paragraphColor, e.lineColor],
            };
            super.eventOnly(t);
        }
        highlightParagraphAt(e, t) {
            const r = {type: "highlightParagraphAt", args: [e, t]};
            super.eventOnly(r);
        }
        clearHighlights() {
            super.eventOnly({type: "clearHighlights", args: []});
        }
        getRectsByRange(e) {
            const t = {type: "getRectsByRange", args: [e]};
            return super.eventWithResponseSync(t);
        }
    }
    class l extends t.SelectionHandler {
        mDispatcher = null;
        constructor(e) {
            super(), (this.mDispatcher = e);
        }
        getSelectionContext() {
            try {
                return {
                    text: this.mDispatcher.getSelectedText(),
                    offset: this.mDispatcher.getCursor().start,
                };
            } catch (e) {
                return null;
            }
        }
        getRectsByRange(e, t, r) {
            if (!this.mDispatcher) return null;
            try {
                return this.mDispatcher.getRectsByRange({start: t, end: t + r});
            } catch (e) {
                return null;
            }
        }
    }
    class c extends t.DocumentTextHighlighter {
        mDispatcher = null;
        mOverlay;
        constructor(e) {
            super(),
                (this.mOverlay = {
                    range: {start: 0, end: 0},
                    textColor: "#71FDFE",
                    backgroundColor: "#000000",
                }),
                (this.mDispatcher = e);
        }
        enableHighlight(t, r, n) {
            return this.mDispatcher
                ? (this.removeOverlay(), e.Utils.callMethod(n), !0)
                : (e.Utils.callMethod(n), !1);
        }
        disableHighlight(t, r, n) {
            if (!this.mDispatcher) return e.Utils.callMethod(n), !1;
            const i = this.removeOverlay();
            return e.Utils.callMethod(n), i;
        }
        highlightWord(t, r, n) {
            if (!this.removeOverlay()) return !1;
            let i = r;
            for (
                ;
                i > 0 &&
                !e.CharSet.wordSeparator.characterIsMember(t.text[i - 1]);
                i -= 1
            );
            let s = r;
            for (
                ;
                s < t.text.length &&
                !e.CharSet.wordSeparator.characterIsMember(t.text[s]);
                s += 1
            );
            return this.addOverlay(i + t.offset, s + t.offset, n && n.colors);
        }
        highlight(e, t, r, n) {
            return (
                !!this.removeOverlay() &&
                this.addOverlay(t + e.offset, t + r + e.offset, n && n.colors)
            );
        }
        addOverlay(e, t, r) {
            if (
                this.mOverlay.range.start !== e ||
                this.mOverlay.range.end !== t ||
                this.mOverlay.textColor !== r?.text ||
                this.mOverlay.backgroundColor !== r?.word
            )
                return (
                    this.removeOverlay(),
                    (this.mOverlay.range = {start: e, end: t}),
                    (this.mOverlay.textColor = r ? r.text : "#000000"),
                    (this.mOverlay.backgroundColor = r ? r.word : "#71FDFE"),
                    this.mDispatcher.addOverlay(this.mOverlay)
                );
        }
        removeOverlay() {
            try {
                return this.mDispatcher.clearOverlays(), !0;
            } catch (e) {
                return !1;
            }
        }
    }
    class u extends t.DocumentTextReader {
        mOrbitNoteDispatcher;
        mSelectionHandler = null;
        mTextHighlighter = null;
        constructor(e) {
            super(), (this.mOrbitNoteDispatcher = e);
        }
        get selectionHandler() {
            return (
                this.mSelectionHandler ||
                    (this.mSelectionHandler = new l(this.mOrbitNoteDispatcher)),
                this.mSelectionHandler
            );
        }
        get textHighlighter() {
            return (
                this.mTextHighlighter ||
                    (this.mTextHighlighter = new c(this.mOrbitNoteDispatcher)),
                this.mTextHighlighter
            );
        }
        getTextContent(e, t, r) {
            if (!this.mOrbitNoteDispatcher) return {text: null, offset: 0};
            try {
                const n = Boolean(r.requestFor && "rewordify" === r.requestFor),
                    i = this.mOrbitNoteDispatcher.getTextContent(n);
                if (!i || 0 === i.length) return {text: "", offset: 0};
                let s = 0,
                    o = i.length,
                    a = s,
                    l = o;
                if (!n) {
                    let r = this.mOrbitNoteDispatcher.getCursor();
                    if (
                        ((!r ||
                            r.start < 0 ||
                            (r.end < 0 && e.clientX >= 0 && e.clientY >= 0)) &&
                            (r = this.mOrbitNoteDispatcher.getCursorAtPosition(
                                e.clientX,
                                e.clientY,
                            )),
                        !r || r.start < 0 || r.end < 0)
                    )
                        return {text: "", offset: 0};
                    if (((s = e.getPositionInText(i, r, !0)), s < 0))
                        return {text: null, offset: 0};
                    if (((o = t.getPositionInText(i, r, !1)), o < 0))
                        return {text: null, offset: 0};
                    (a = r.start), (l = r.end);
                }
                const c = Math.min(s, o),
                    u = Math.max(s, o);
                return {
                    text: i
                        .substring(c, u)
                        .replaceAll(/[\x03\x10\x11\x12\x1C]/g, " "),
                    offset: c,
                    selection: {start: a - c, length: Math.abs(l - a)},
                    custom: {embeddedLocations: []},
                };
            } catch (e) {
                return {text: null, offset: 0};
            }
        }
    }
    class h extends t.DocumentTextMapperDelegate {
        mOrbitNoteDispatcher = new a();
        constructor() {
            super({type: "on-document", isEditor: !0});
        }
        createTextReader() {
            return new u(this.mOrbitNoteDispatcher);
        }
        createSelectionHandler() {
            return super.textReader.selectionHandler;
        }
        createTextHighlighter() {
            return super.textReader.textHighlighter;
        }
    }
    class d extends t.TextMapperDelegateFactory {
        static mOrbitNoteOrigRegExp =
            /^https:\/\/[orbit|pdf][a-zA-Z0-9.]*\.texthelp\.com$/i;
        static mContainerSelector = "div#viewerContainer";
        static isOrbitNote(e = null) {
            const t = e || new URL(window.location.href);
            return (
                d.mOrbitNoteOrigRegExp.test(t.origin) &&
                t.searchParams.has("file")
            );
        }
        doCreateDelegate(t = null) {
            return d.isOrbitNote()
                ? e.Utils.isSruPopupElement(t) ||
                  e.Utils.isSruMainContainerFrame(t) ||
                  e.Utils.isSruOverlaySelectionElement(t)
                    ? null
                    : t &&
                        (t.matches(d.mContainerSelector) ||
                            ("BODY" === t.tagName.toUpperCase() &&
                                t.querySelector(d.mContainerSelector)) ||
                            t.closest(d.mContainerSelector))
                      ? new h()
                      : null
                : null;
        }
    }
    class m extends t.ParaLineGuideImpl {
        mDispatcher = null;
        get dispatcher() {
            return (
                this.mDispatcher || (this.mDispatcher = new a()),
                this.mDispatcher
            );
        }
        setColors(e) {
            this.dispatcher.setLineGuideColors(e);
        }
        highlightParagraphAt(e, t, r) {
            return (
                !!m.isDocumentSupported(r) &&
                (this.dispatcher.highlightParagraphAt(e, t), !0)
            );
        }
        clearHighlights(e) {
            return (
                !!m.isDocumentSupported(e) &&
                (this.dispatcher.clearHighlights(), !0)
            );
        }
        static isDocumentSupported(e) {
            return e && null !== e.querySelector("div#viewerContainer");
        }
    }
    !(async function () {
        const r = chrome.runtime.getURL(
            "libs/orbitnote-message-handler.umd.js",
        );
        await (function (e) {
            const t = document.createElement("script");
            (t.type = "text/javascript"),
                (t.src = e),
                (t.async = !1),
                (t.defer = !1);
            const r = new Promise((e, r) => {
                (t.onload = function () {
                    e(null);
                }),
                    (t.onerror = function () {
                        r(
                            new Error(
                                "An error occurred while injecting script!",
                            ),
                        );
                    });
            });
            return (
                (
                    document.head ||
                    document.body ||
                    document.documentElement
                ).appendChild(t),
                r
            );
        })(r),
            t.TextMapperDelegateFactory.registerFactory(new d()),
            t.ParaLineGuide.registerGuideImpl(new m()),
            e.Utils.waitForDocumentToLoad(document, () => {
                e.Utils.addClassToElement(
                    document.documentElement,
                    "dji-sru-no-layout-alteration",
                ),
                    (function () {
                        const e = document.createElement("style");
                        (e.textContent =
                            "html[dji-sru-active] #__next header.gw-dashboard-header{width:calc(100% - 32px)}html[dji-sru-active][dji-sru-outline-active] #__next header.gw-dashboard-header{width:calc(100% - 442px)}html[dji-sru-active] #__next main.gw-dashboard-main{width:calc(100% - 222px)}html[dji-sru-active][dji-sru-outline-active] #__next main.gw-dashboard-main{width:calc(100% - 632px)}html[dji-sru-active] #__next #outerContainer{width:calc(100% - 32px)}html[dji-sru-active][dji-sru-outline-active] #__next #outerContainer{width:calc(100% - 442px)}"),
                            document.documentElement.appendChild(e);
                    })();
            });
    })();
});
