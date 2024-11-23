/*!************************************************************************
 **
 ** Copyright (c) 2022-2024 Don Johnston, Inc. All rights reserved.
 **
 **************************************************************************/
!(function (t) {
    "function" == typeof define && define.amd ? define(t) : t();
})(function () {
    "use strict";
    function t(t) {
        return t < 10 ? "0" + String(t) : t.toString(16);
    }
    var e;
    function r(r) {
        return (n, s) => {
            if (s instanceof HTMLElement) {
                const n = (function (e = 40) {
                    var r = new Uint8Array(e / 2);
                    return (
                        window.crypto.getRandomValues(r),
                        Array.from(r, t).join("")
                    );
                })();
                return s.classList.add(n), r(s, n), e.HTML_ELEMENT + n;
            }
            return (function (t, r) {
                return "string" == typeof r ? e.TEXT + r : r;
            })(0, s);
        };
    }
    function n(r, n) {
        if ("string" != typeof n) return n;
        const s = n.substring(0, 1),
            o = n.substring(1);
        switch (s) {
            case e.TEXT:
                return o;
            case e.HTML_ELEMENT: {
                const t = Array.from(document.getElementsByClassName(o));
                if (0 === t.length)
                    throw new Error(
                        "Couldn't find element with unique class `" + o + "`!",
                    );
                if (t.length > 1)
                    throw new Error(
                        "Found multiple elements with unique class `" +
                            o +
                            "`!",
                    );
                return t[0];
            }
            default:
                throw (function (t, e) {
                    throw e;
                })(
                    0,
                    new Error(
                        "Unknown identifier in beginning of text \\x" + t(s),
                    ),
                );
        }
    }
    !(function (t) {
        (t.TEXT = ""), (t.HTML_ELEMENT = "");
    })(e || (e = {}));
    class s {
        src;
        type;
        listener;
        options;
        constructor(t, e, r, n) {
            (this.src = t),
                (this.type = e),
                (this.listener = r),
                (this.options = n || !1);
        }
    }
    class o {
        name;
        constructor(t) {
            this.name = t;
        }
        static StopPropagation() {
            return new o("StopPropagation");
        }
    }
    class i {
        _listeners = new Map();
        add(t, e = {}) {
            this._listeners.has(t) || this._listeners.set(t, e);
        }
        once(t, e = {}) {
            this._listeners.has(t) || this._listeners.set(t, {...e, once: !0});
        }
        remove(t) {
            this._listeners.delete(t);
        }
        emit(...t) {
            const e = Array.from(this._listeners.entries()).sort(
                ([, t], [, e]) => (e.priority ?? 0) - (t.priority ?? 0),
            );
            for (const [r, n] of e) {
                const e = r(...t);
                if (
                    (n.once && this.remove(r),
                    e instanceof o && "StopPropagation" === e.name)
                )
                    break;
            }
        }
        clear() {
            this._listeners.clear();
        }
    }
    class a {
        _isDisposed = !1;
        onDispose = new i();
        dispose() {
            this._isDisposed ||
                ((this._isDisposed = !0),
                this.disposeInternal(),
                this.onDispose.emit(),
                this.onDispose.clear());
        }
        isDisposed() {
            return this._isDisposed;
        }
        disposeInternal() {}
    }
    class h extends a {
        _listenables = [];
        listen(t, e, r, n) {
            const o = this._getListenable(t, e, r, n);
            if (o) return o;
            const i = new s(t, e, r, n);
            return this._listenables.push(i), t.addEventListener(e, r, n), i;
        }
        unlisten(t, e, r, n) {
            const s = this._getListenable(t, e, r, n);
            s && this.unlistenByKey(s);
        }
        unlistenByKey(t) {
            const e = this._listenables.indexOf(t);
            this._listenables.splice(e, 1);
            const {src: r, type: n, listener: s, options: o} = t;
            r.removeEventListener(n, s, o);
        }
        removeAllListeners() {
            for (const t of this._listenables) {
                const {src: e, type: r, listener: n, options: s} = t;
                e.removeEventListener(r, n, s);
            }
            this._listenables = [];
        }
        disposeInternal() {
            super.disposeInternal();
            for (const t of this._listenables) {
                const {src: e, type: r, listener: n, options: s} = t;
                e.removeEventListener(r, n, s);
            }
            this._listenables = [];
        }
        _getListenable(t, e, r, n) {
            for (const s of this._listenables)
                if (t === s.src && e === s.type && r === s.listener) {
                    if (
                        "boolean" == typeof n ||
                        "boolean" == typeof s.options
                    ) {
                        if (n !== s.options) continue;
                    } else if (n.capture !== s.options.capture) continue;
                    return s;
                }
            return null;
        }
    }
    function u(t, e, n) {
        const s = [];
        document.dispatchEvent(
            new CustomEvent(t, {
                cancelable: !0,
                bubbles: !0,
                detail: JSON.stringify(
                    {
                        id: e,
                        error: JSON.stringify(
                            {name: n.name, message: n.message, stack: n.stack},
                            r((t, e) => s.push({element: t, className: e})),
                        ),
                    },
                    r((t, e) => s.push({element: t, className: e})),
                ),
            }),
        );
        for (const {element: t, className: e} of s) t.classList.remove(e);
    }
    class c {
        mOutboundEventName;
        mEventHandler = new h();
        constructor(t, e) {
            (this.mOutboundEventName = e),
                this.mEventHandler.listen(
                    document,
                    t,
                    (t) => this.handleMessageInbound(t),
                    !1,
                );
        }
        onMessageInbound(t, e) {
            throw new Error(
                "Reimplement in derived class to handle inbound messages!",
            );
        }
        handleMessageInbound(t) {
            if (!this._isCustomEvent(t)) return;
            if ("string" != typeof t.detail) return;
            let e;
            try {
                e = JSON.parse(t.detail, n);
            } catch (t) {
                return void console.error(t);
            }
            if ("object" != typeof e) return;
            if ("string" != typeof e.id) return;
            if ("string" != typeof e.type) return;
            if (!Array.isArray(e.args)) return;
            const s = e.id,
                o = e.type,
                i = e.args;
            try {
                const t = this.onMessageInbound(o, i);
                !(function (t, e, n) {
                    const s = [];
                    document.dispatchEvent(
                        new CustomEvent(t, {
                            cancelable: !0,
                            bubbles: !0,
                            detail: JSON.stringify(
                                {
                                    id: e,
                                    result: JSON.stringify(
                                        n,
                                        r((t, e) =>
                                            s.push({element: t, className: e}),
                                        ),
                                    ),
                                },
                                r((t, e) => s.push({element: t, className: e})),
                            ),
                        }),
                    );
                    for (const {element: t, className: e} of s)
                        t.classList.remove(e);
                })(this.mOutboundEventName, s, t);
            } catch (t) {
                t instanceof Error
                    ? u(this.mOutboundEventName, s, t)
                    : u(this.mOutboundEventName, s, new Error(t + ""));
            }
        }
        _isCustomEvent(t) {
            return !!t.detail;
        }
    }
    class d {
        mDom = null;
        mCurrent = null;
        constructor(t) {
            this.mDom = t;
        }
        get dom() {
            return this.mDom;
        }
        get document() {
            return this.mDom.document;
        }
        get char() {
            return this.mCurrent?.char;
        }
        get word() {
            return (
                !this.mCurrent.word &&
                    this.mCurrent.char &&
                    this.computeCurrentWord(),
                this.mCurrent.word
            );
        }
        get sentence() {
            return this.word?.parent;
        }
        get page() {
            return this.mCurrent?.page;
        }
        get pageOffset() {
            return this.mCurrent?.pageOffset;
        }
        get wordRect() {
            const t = this.word;
            if (!t) return null;
            const e = t.canvas.canvas.getBoundingClientRect(),
                r = e.width / t.canvas.canvas.width,
                n = e.height / t.canvas.canvas.height;
            return new DOMRectReadOnly(
                e.left + t.xAdjusted * r,
                e.top + t.yAdjusted * n,
                t.width * r,
                t.height * n,
            );
        }
        get wordIndex() {
            return (
                !this.mCurrent.word &&
                    this.mCurrent.char &&
                    this.computeCurrentWord(),
                this.mCurrent.wordIndex
            );
        }
        get startOfCurrentWordPerDocument() {
            return this.word.start + this.pageOffset;
        }
        static createIteratorAtCharIndex(t, e) {
            const r = new d(t);
            return r.moveAtCharIndex(e), r;
        }
        static createIteratorAtWord(t, e) {
            const r = d.createIteratorAtCharIndex(t, 0);
            for (; r.page && r.page.pageID !== e.pageID; ) r.moveToNextPage();
            for (; r.page && r.page.pageID === e.pageID && r.word !== e; )
                r.moveToNextWord();
            return (
                (r.page && r.page.pageID === e.pageID && r.word === e) ||
                    r.reset(),
                r
            );
        }
        static createIteratorAtCoordinates(t, e, r, n) {
            const s = d.createIteratorAtCharIndex(t, 0);
            for (; s.page; ) {
                if (!s.page.canvas || !s.page.canvas.canvas) continue;
                const t = s.page.canvas.canvas,
                    o = t.getBoundingClientRect();
                if (
                    o.left <= e &&
                    o.right >= e &&
                    o.top <= r &&
                    o.bottom >= r
                ) {
                    const i = {x: e - o.left, y: r - o.top};
                    let a = s.document.getWord(i.x, i.y, t);
                    if (!a && n) {
                        const e = s.getProximitySentence(i.x, i.y, t);
                        e && (a = s.getProximityWord(i.x, i.y, e));
                    }
                    if (!a) return s.reset(), s;
                    for (; s.word !== a; ) s.moveToNextWord();
                    return s;
                }
                s.moveToNextPage();
            }
            return s.reset(), s;
        }
        getProximitySentence(t, e, r) {
            let n = this.document.getSentence(t, e, r);
            return (
                n ||
                    ((n = this.searchForProximitySentenceHorizontally(t, e, r)),
                    n ||
                        (n = this.searchForProximitySentenceVertically(
                            t,
                            e,
                            r,
                        ))),
                n
            );
        }
        searchForProximitySentenceHorizontally(t, e, r) {
            let n = null,
                s = t;
            const o = s + 35;
            for (; !n && s < o; )
                (s += 5), (n = this.document.getSentence(s, e, r));
            if (!n) {
                s = t;
                const o = Math.max(5, s - 25);
                for (; !n && s >= o; )
                    (s -= 5), (n = this.document.getSentence(s, e, r));
            }
            return n;
        }
        searchForProximitySentenceVertically(t, e, r) {
            let n = null,
                s = e;
            const o = s + 25;
            for (; !n && s < o; )
                (s += 5), (n = this.document.getSentence(t, s, r));
            if (!n) {
                s = e;
                const o = Math.max(5, s - 25);
                for (; !n && s >= o; )
                    (s -= 5), (n = this.document.getSentence(t, s, r));
            }
            return n;
        }
        getProximityWord(t, e, r) {
            let n = this.searchForProximityWordHorizontally(t, e, r);
            return n || (n = this.searchForProximityWordVertically(t, e, r)), n;
        }
        searchForProximityWordHorizontally(t, e, r) {
            let n = null,
                s = t;
            const o = t + 25;
            for (; !n && s < o; ) (s += 5), (n = r.getWord(s, e));
            if (!n) for (s = t; !n && s > 0; ) (s -= 5), (n = r.getWord(s, e));
            return n;
        }
        searchForProximityWordVertically(t, e, r) {
            let n = null,
                s = e;
            const o = e + 25;
            for (; !n && s < o; ) (s += 5), (n = r.getWord(t, s));
            if (!n) {
                s = e;
                const o = Math.max(5, s - 25);
                for (; !n && s >= o; ) (s -= 5), (n = r.getWord(t, s));
            }
            return n;
        }
        moveToNextChar() {
            if (!this.mCurrent) return !1;
            const t = this.mCurrent.charIndex + 1,
                e =
                    this.mCurrent.page.pageChars.version[
                        this.dom.getDomVersion()
                    ];
            return e.length > t
                ? ((this.mCurrent.charIndex = t),
                  (this.mCurrent.char = e[t]),
                  (this.mCurrent.word = null),
                  (this.mCurrent.wordIndex = -1),
                  !0)
                : this.moveToNextPage();
        }
        moveToNextWord() {
            if (!this.mCurrent) return !1;
            let t = this.wordIndex + 1;
            const e =
                this.mCurrent.page.pageWords.versions[this.dom.getDomVersion()];
            if (e.length > t) {
                (this.mCurrent.wordIndex = t), (this.mCurrent.word = e[t]);
                const r =
                    this.mCurrent.page.pageChars.version[
                        this.dom.getDomVersion()
                    ];
                return (
                    (this.mCurrent.char = r[this.mCurrent.word.start]),
                    (this.mCurrent.charIndex = this.mCurrent.word.start),
                    !0
                );
            }
            return this.moveToNextPage();
        }
        moveToNextSentence() {
            const t = this.sentence;
            if (!t) return !1;
            let e;
            do {
                this.moveToNextWord(), (e = this.sentence);
            } while (t === e);
            return !0;
        }
        moveFirst() {
            this.moveAtCharIndex(0);
        }
        moveAtCharIndex(t) {
            try {
                this.mCurrent = this.getCharAtOffset(t);
            } catch (t) {
                this.reset();
            }
        }
        getCurrentCharOffsetFromStartOfDocument() {
            const t = this.pageOffset;
            return t < 0 ? -1 : t + this.mCurrent.charIndex;
        }
        moveToNextPage() {
            if (!this.mCurrent) return !1;
            const t =
                this.mCurrent.page.pageChars.version[this.dom.getDomVersion()]
                    .length;
            let e = this.mCurrent.pageIndex + 1;
            const r = this.document.pages;
            for (let n = e; n < r.length; n += 1) {
                const e = r[n];
                if (e)
                    return (
                        (this.mCurrent.page = e),
                        (this.mCurrent.pageIndex = n),
                        (this.mCurrent.pageOffset += t),
                        (this.mCurrent.char = null),
                        (this.mCurrent.charIndex = -1),
                        (this.mCurrent.wordIndex = -1),
                        (this.mCurrent.word = null),
                        this.moveToNextChar()
                    );
            }
            return this.reset(), !0;
        }
        getCharAtOffset(t) {
            try {
                const e = this.getPageAtCharOffset(t);
                if (!e) return null;
                let r = t - e.pageOffset;
                const n = e.page.pageChars.version[this.dom.getDomVersion()];
                return 0 === n.length || r < 0 || r > n.length
                    ? null
                    : (r === n.length && (r -= 1),
                      {
                          word: null,
                          wordIndex: -1,
                          char: n[r],
                          charIndex: r,
                          page: e.page,
                          pageIndex: e.pageIndex,
                          pageOffset: e.pageOffset,
                      });
            } catch (t) {
                return null;
            }
        }
        getWordAtCharOffset(t, e) {
            try {
                const r = t.pageWords.versions[this.dom.getDomVersion()];
                let n = 0,
                    s = r.length - 1;
                for (; n < s; ) {
                    const t = r[n];
                    if (t.end <= e) n = Math.ceil((n + s) / 2);
                    else {
                        if (t.start <= e) break;
                        (s = n), (n = Math.floor(n / 2));
                    }
                }
                return {word: r[n], wordIndex: n};
            } catch (t) {
                return null;
            }
        }
        getPageAtCharOffset(t) {
            try {
                const e = this.document;
                if (!e) return null;
                let r = 0;
                const n = e.pages;
                for (let e = 0; e < n.length; e += 1) {
                    const s = n[e];
                    if (!s) continue;
                    const o = s.pageChars.version[this.dom.getDomVersion()];
                    if (o.length <= 0) continue;
                    const i = t - r,
                        a = o.length;
                    if (a >= i) return {page: s, pageOffset: r, pageIndex: e};
                    r += a;
                }
                return null;
            } catch (t) {
                return null;
            }
        }
        reset() {
            this.mCurrent = null;
        }
        computeCurrentWord() {
            if (!this.mCurrent || !this.mCurrent.char) return;
            const t = this.getWordAtCharOffset(
                this.mCurrent.page,
                this.mCurrent.charIndex,
            );
            (this.mCurrent.word = t.word),
                (this.mCurrent.wordIndex = t.wordIndex);
        }
    }
    class l extends c {
        mWordOverlays = new Array();
        mCurrentHighlightedLine = null;
        mCurrentHighlightedSentence = null;
        mGuideColors = {paragraphColor: "blue", lineColor: "red"};
        constructor() {
            super("dji-orbit-note-inbound", "dji-orbit-note-outbound");
        }
        get dom() {
            return window.textHelp && window.textHelp.dom;
        }
        get document() {
            return this.dom?.document;
        }
        onMessageInbound(t, e) {
            switch (t) {
                case "getTextContent":
                    return e[0]
                        ? this.getTextContentBeautified()
                        : this.getTextContent();
                case "getSelectedText":
                    return this.getSelectedText();
                case "getCursor":
                    return this.getCursor();
                case "getCursorAtPosition":
                    return this.getCursorAtPosition(e[0], e[1]);
                case "addOverlay":
                    this.addOverlay(e[0]);
                    break;
                case "clearOverlays":
                    this.clearOverlays();
                    break;
                case "setLineGuideColors":
                    this.setLineGuideColors(e[0], e[1]);
                    break;
                case "highlightParagraphAt":
                    this.highlightParagraphAt(e[0], e[1]);
                    break;
                case "clearHighlights":
                    this.clearHighlights(null);
                    break;
                case "getRectsByRange":
                    return this.getRectsByRange(e[0]);
            }
        }
        getTextContent() {
            if (!this.document) return "";
            let t = "";
            try {
                const e = d.createIteratorAtCharIndex(this.dom, 0);
                for (; e.char; ) (t += e.char.char), e.moveToNextChar();
            } catch (t) {
                return null;
            }
            return t;
        }
        getTextContentBeautified() {
            if (!this.document) return "";
            let t = "";
            try {
                const e = d.createIteratorAtCharIndex(this.dom, 0);
                let r = null,
                    n = null;
                for (; e.char; )
                    r !== e.sentence && (r && (t += "\n"), (r = e.sentence)),
                        n !== e.page && (n && (t += "\n"), (n = e.page)),
                        (t += e.char.char),
                        e.moveToNextChar();
            } catch (t) {
                return null;
            }
            return t;
        }
        getSelectedText() {
            try {
                let t = "";
                const e = this.dom.getSelection().selectionArray;
                for (let r of e) r && (t += r.wordText);
                return t;
            } catch (t) {
                return null;
            }
        }
        getCursor() {
            let t = {start: -1, end: -1};
            try {
                const e = this.dom.getSelection(),
                    r = e.start,
                    n = e.finish;
                if (r && r.word && n && n.word) {
                    const e = d.createIteratorAtWord(this.dom, r.word);
                    if (!e || !e.word) return t;
                    const s = e.pageOffset;
                    let o = e.pageOffset;
                    if (r.word !== n.word) {
                        const e = d.createIteratorAtWord(this.dom, n.word);
                        if (!e || !e.word) return t;
                        o = e.pageOffset;
                    }
                    return {start: s + r.word.start, end: o + n.word.end};
                }
                return t;
            } catch (t) {
                return console.warn(t), null;
            }
        }
        getCursorAtPosition(t, e) {
            try {
                const r = d.createIteratorAtCoordinates(this.dom, t, e, !0);
                if (!r || !r.word) return {start: -1, end: -1};
                const n = r.getCurrentCharOffsetFromStartOfDocument();
                return {start: n, end: n};
            } catch (t) {
                return console.warn(t), null;
            }
        }
        addOverlay(t) {
            if (t.range.start !== t.range.end)
                try {
                    const e = d.createIteratorAtCharIndex(
                        this.dom,
                        t.range.start,
                    );
                    let r = [];
                    for (
                        ;
                        e.word &&
                        e.startOfCurrentWordPerDocument <= t.range.end;

                    )
                        this.mWordOverlays.push(e.word),
                            r.push(e.word),
                            e.moveToNextWord();
                    if (r.length > 0) {
                        const e = l.documentIsOcrd();
                        this.dom.setStyleFromElements(
                            t.backgroundColor,
                            e ? "0.3" : "1",
                            !e,
                            t.textColor,
                            r,
                        );
                    }
                } catch (t) {}
        }
        static documentIsOcrd() {
            return (
                (void 0 !== window.PDFViewerApplication.documentInfo.Custom &&
                    void 0 !==
                        window.PDFViewerApplication.documentInfo.Custom
                            .TexthelpCreator) ||
                void 0 !==
                    window.PDFViewerApplication.documentInfo.TexthelpCreator
            );
        }
        clearOverlays() {
            try {
                if (0 === this.mWordOverlays.length) return !0;
                for (const t of this.mWordOverlays) t.resetToPreviousStyle();
                return this.mWordOverlays.splice(0), this.dom.refresh(), !0;
            } catch (t) {
                return !1;
            }
        }
        setLineGuideColors(t, e) {
            (this.mGuideColors.paragraphColor = t),
                (this.mGuideColors.lineColor = e);
        }
        highlightParagraphAt(t, e) {
            const r = d.createIteratorAtCoordinates(this.dom, t, e, !0),
                n = r?.sentence;
            if (!n) return this.clearHighlights(null), !1;
            const s = r.word.line;
            if (
                this.mCurrentHighlightedSentence === n &&
                this.mCurrentHighlightedLine === s
            )
                return !0;
            const o = n.parent.canvas;
            return (
                !!o &&
                (this.clearHighlights(null),
                this.getSentenceBoundaries(n).forEach((t) => {
                    const e = s.yAdjusted + s.adjustedHeight / 2,
                        r =
                            e >= t.top && e <= t.bottom
                                ? this.mGuideColors.lineColor
                                : this.mGuideColors.paragraphColor;
                    o.drawRec(t.left, t.top, t.height, t.width, r, 0.3, 0);
                }),
                (this.mCurrentHighlightedSentence = n),
                (this.mCurrentHighlightedLine = s),
                !0)
            );
        }
        clearHighlights(t) {
            if (!this.mCurrentHighlightedSentence) return;
            const e = this.mCurrentHighlightedSentence.parent.canvas;
            e &&
                (t
                    ? e.clearRec(t.left, t.top, t.height, t.width)
                    : e.clearCanvas(),
                (this.mCurrentHighlightedSentence = null),
                (this.mCurrentHighlightedLine = null));
        }
        getSentenceBoundaries(t) {
            if (0 === t.lines.length) return [];
            const e = t.lines[0];
            let r = e.xAdjusted,
                n = e.yAdjusted,
                s = e.xAdjusted + e.adjustedWidth,
                o = e.yAdjusted + e.adjustedHeight,
                i = [];
            return (
                t.lines.forEach((t) => {
                    const e = t.yAdjusted + t.adjustedHeight / 2;
                    e >= Math.min(n, o) && e <= Math.max(n, o)
                        ? ((r = Math.min(r, t.xAdjusted)),
                          (s = Math.max(s, t.xAdjusted + t.adjustedWidth)),
                          (n = Math.min(n, t.yAdjusted)),
                          (o =
                              t.adjustedHeight > 0
                                  ? Math.max(o, t.yAdjusted + t.adjustedHeight)
                                  : Math.min(
                                        o,
                                        t.yAdjusted + t.adjustedHeight,
                                    )))
                        : (i.push(
                              new DOMRectReadOnly(
                                  r,
                                  Math.min(n, o),
                                  s - r,
                                  Math.abs(o - n),
                              ),
                          ),
                          (r = t.xAdjusted),
                          (n = t.yAdjusted),
                          (s = t.xAdjusted + t.adjustedWidth),
                          (o = t.yAdjusted + t.adjustedHeight));
                }),
                i.push(
                    new DOMRectReadOnly(
                        r,
                        Math.min(n, o),
                        s - r,
                        Math.abs(o - n),
                    ),
                ),
                i
            );
        }
        getSentenceBoundary(t) {
            const e = this.getSentenceBoundaries(t);
            return e && 0 !== e.length
                ? e.reduce((t, e) => {
                      const r = Math.abs(t.bottom - e.top);
                      return new DOMRectReadOnly(
                          Math.min(t.left, e.left),
                          Math.min(t.top, e.top),
                          Math.max(t.width, e.width),
                          t.height + e.height + r,
                      );
                  })
                : null;
        }
        getRectsByRange(t) {
            try {
                const e = d.createIteratorAtCharIndex(this.dom, t.start);
                return e ? e.wordRect : null;
            } catch (t) {
                return null;
            }
        }
    }
    (window.__dji = window.__dji || {}),
        (window.__dji.orbitNoteMsgHandler = new l());
});
