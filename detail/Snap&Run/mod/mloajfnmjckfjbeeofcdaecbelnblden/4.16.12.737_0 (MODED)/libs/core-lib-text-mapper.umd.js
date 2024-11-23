/*!************************************************************************
 **
 ** Copyright (c) 2022-2024 Don Johnston, Inc. All rights reserved.
 **
 **************************************************************************/
!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
        ? t(exports, require("core-lib-utils"))
        : "function" == typeof define && define.amd
          ? define(["exports", "core-lib-utils"], t)
          : t(
                ((e =
                    "undefined" != typeof globalThis
                        ? globalThis
                        : e || self).__DjiTextMapper = {}),
                e.__DjiCoreLibUtils,
            );
})(this, function (e, t) {
    "use strict";
    class n {
        constructor() {
            (this.m_mode = 0),
                (this.m_endReached = !1),
                (this.m_separatorReached = !1);
        }
        initialize(e) {
            (this.m_mode = e),
                (this.m_endReached = !1),
                (this.m_separatorReached = !1);
        }
        includeTrailingPunctuation() {
            return 2 === this.m_mode;
        }
        endReached() {
            return Boolean(this.m_endReached || 0 === this.m_mode);
        }
        process(e) {
            if (!this.endReached())
                if (t.CharSet.wordSeparator.characterIsMemberNoHypen(e))
                    (this.m_separatorReached = !0),
                        this.includeTrailingPunctuation() ||
                            (this.m_endReached = !0);
                else if (this.m_separatorReached) {
                    if (t.CharSet.invisibleWhiteSpace.characterIsMember(e))
                        return;
                    this.m_endReached = !0;
                }
        }
    }
    class o {
        constructor(e) {
            this.m_delegate = e;
        }
        adjust(e, t, n) {
            switch (n) {
                case 0:
                    return {node: e, offset: t};
                case 1:
                case 2:
                    return this.onAdjust(e, t, n);
                default:
                    return null;
            }
        }
        onAdjust(e, t, o) {
            let i = !1;
            const r = {
                acceptNode: (t) => (
                    (i = Boolean(i || t === e)),
                    e.nodeType === Node.TEXT_NODE && i
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT
                ),
            };
            let s = e.parentElement;
            for (; s; ) {
                const t = s.tagName.toUpperCase();
                if (
                    "DIV" === t ||
                    "P" === t ||
                    s === e.ownerDocument ||
                    null === s.parentElement
                )
                    break;
                s = s.parentElement;
            }
            if (!s) return null;
            const a = new n();
            a.initialize(o);
            let l = e;
            const c = e.ownerDocument.createNodeIterator(
                s,
                NodeFilter.SHOW_TEXT,
                r,
            );
            let d = c.nextNode(),
                h = t;
            for (; d; ) {
                const e = d.textContent,
                    t = e.length;
                let n = h;
                for (; n < t; ) {
                    const t = e[n];
                    if ((a.process(t), a.endReached()))
                        return {node: d, offset: n};
                    n += 1;
                }
                const o = this.m_delegate.getValueSeparatorForNode(d),
                    i = o.length;
                if (i > 0)
                    for (let e = 0; e < i; e += 1)
                        if ((a.process(o[e]), a.endReached()))
                            return {node: d, offset: d.textContent.length - 1};
                (l = d), (d = c.nextNode()), (h = 0);
            }
            return {node: l, offset: l.textContent.length};
        }
    }
    class i {
        constructor(e) {
            (this.m_adjuster = null), (this.m_delegate = e);
        }
        get delegate() {
            return this.m_delegate;
        }
        getCaretPosition(e) {
            const t = e.document.activeElement;
            return (t && "TEXTAREA" === t.tagName) ||
                (t && "INPUT" === t.tagName)
                ? {
                      anchorNode: t,
                      anchorOffset: t.selectionStart,
                      focusNode: t,
                      focusOffset: t.selectionEnd,
                  }
                : e.document.getSelection();
        }
        getCaretPositionFromPoint(e, n, o) {
            return t.Utils.caretPositionFromPoint(e, n, o);
        }
        getAdjuster() {
            return (
                this.m_adjuster ||
                    (this.m_adjuster = this.onCreateCaretAdjuster()),
                this.m_adjuster
            );
        }
        moveCaret(e, n, o = 0) {
            if (t.Utils.isNullOrUndefined(e)) return;
            const i = this.getAdjuster().adjust(e, n, o);
            i && this.onMoveCaret(i.node, i.offset);
        }
        moveCaretAfterSelection(e, o = 0) {
            if (e.activeElementInfo) {
                const t = e.source.selectionHandler.getSelection(
                    e.activeElementInfo,
                );
                t && this.moveCaret(t.anchorNode, t.anchorOffset, o);
            } else
                e.element &&
                void 0 !== e.element.selectionStart &&
                void 0 !== e.element.selectionEnd
                    ? (function (e, t) {
                          const o = e.value;
                          let {selectionEnd: i} = e;
                          const r = new n();
                          for (
                              r.initialize(t);
                              i < o.length && !r.endReached();

                          ) {
                              const e = o[i];
                              if ((r.process(e), r.endReached())) break;
                              i += 1;
                          }
                          e.setSelectionRange(i, i);
                      })(e.element, o)
                    : t.Logger.warn(
                          "moveCaretAfterSelection: unable to handle context: ",
                          JSON.stringify(e),
                      );
        }
        moveCaretToPosition(e, t, n = null, o = 0) {
            const i = n ? n.document : document,
                r = this.getCaretPositionFromPoint(e, t, i);
            this.moveCaret(r.offsetNode, r.offset, o);
        }
        onCreateCaretAdjuster() {
            return new o(this.m_delegate);
        }
        onMoveCaret(e, n) {
            try {
                e.ownerDocument.getSelection().collapse(e, n);
            } catch (e) {
                t.Logger.error(e);
            }
        }
        getCursorBoundingClientRect(e) {
            return null;
        }
    }
    const r = {NONE: 0, FROM_CARET_TO_END: 1, BACK_TO_CARET: 2};
    class s {
        enableHighlight(e, t, n) {}
        disableHighlight(e, t, n) {}
        highlightWithProperties(e, t, n, o) {
            o && o > 0
                ? this.highlight(e, n, o, t)
                : this.highlightWord(e, n, t);
        }
        highlightWord(e, t, n) {}
        highlight(e, t, n, o) {}
        clearHighlights() {}
        getHighlightedBoundingClientRect(e, t, n) {
            if (!e) return null;
            if (!e.source && e.source.selectionHandler) return null;
            const o = e.source.selectionHandler.getRectsByRange(
                e,
                e.offset + t,
                n,
            );
            return o && 0 !== o.length ? o[0] : null;
        }
    }
    class a {
        static set Impl(e) {
            a.impl = e;
        }
        getSelectionContext(e) {
            return null;
        }
        getSelection(e) {
            return a.impl ? a.impl.getSelection(e) : null;
        }
        clearSelection(e) {
            a.impl && a.impl.clearSelection(e);
        }
        restoreSelection(e) {
            a.impl && a.impl.restoreSelection(e);
        }
        select(e, t, n, o) {
            return a.impl && a.impl.select(e, t, n, o);
        }
        selectWord(e, t, n) {
            return a.impl && a.impl.selectWord(e, t, n);
        }
        enableHighlight(e) {
            return a.impl && a.impl.enableHighlight(e);
        }
        getRectsByRange(e, t, n) {
            if (!e) return null;
            if (n <= 0 || !e.custom.map || e.custom.map.length < t + n)
                return null;
            const o = e.custom.map[t],
                i = e.custom.map[t + n - 1],
                r = document.createRange();
            r.setStart(o.element, o.offset), r.setEnd(i.element, i.offset);
            const s = [],
                a = r.getClientRects();
            for (let e = 0; e < a.length; e += 1) s.push(a[e]);
            return s;
        }
    }
    a.impl = null;
    class l {
        get selectionHandler() {
            return null;
        }
        get caretPositioner() {
            return null;
        }
        get paragraphIterator() {
            return null;
        }
        get textHighlighter() {
            return null;
        }
        get isLayered() {
            return !1;
        }
    }
    const c = {
        DOCUMENT_START: 0,
        CARET: 1,
        DOCUMENT_END: 2,
        NODE: 3,
        SELECTION_START: 4,
        SELECTION_END: 5,
    };
    class d {
        constructor(e, t = !1) {
            (this.m_origin = e),
                (this.m_isBackward = t),
                (this.m_mappingDelegate = null),
                (this.m_startingNode = null),
                (this.m_startingOffset = -1),
                (this.m_stopAtWordBoundary = !1);
        }
        get origin() {
            return this.m_origin;
        }
        set origin(e) {
            this.m_origin = e;
        }
        get isBackward() {
            return this.m_isBackward;
        }
        get isFromDocumentStart() {
            return this.m_origin === c.DOCUMENT_START;
        }
        get isFromCaret() {
            return this.m_origin === c.CARET;
        }
        get isFromDocumentEnd() {
            return this.m_origin === c.DOCUMENT_END;
        }
        get isFromSelectionStart() {
            return this.m_origin === c.SELECTION_START;
        }
        get isFromSelectionEnd() {
            return this.m_origin === c.SELECTION_END;
        }
        get isFromNode() {
            return this.m_origin === c.NODE;
        }
        get wordBoundary() {
            return this.m_stopAtWordBoundary;
        }
        get positionReached() {
            return (
                this.m_origin === c.DOCUMENT_START &&
                null !== this.m_startingNode &&
                this.m_startingOffset >= 0
            );
        }
        get increment() {
            return this.m_isBackward ? -1 : 1;
        }
        get mappingDelegate() {
            return this.m_mappingDelegate;
        }
        set mappingDelegate(e) {
            this.m_mappingDelegate = e;
        }
        get startingNode() {
            return this.m_startingNode;
        }
        get startingOffset() {
            return this.m_startingOffset;
        }
        initialize(e, t, n, o) {
            (this.m_startingNode = e),
                (this.m_startingOffset = t),
                this.onInitialize(e, t, n, o);
        }
        onInitialize(e, t, n, o) {}
        getPositionInText(e, n, o) {
            this.initialize(null, 0);
            let i = 0;
            const r = e.length;
            switch (this.origin) {
                case c.DOCUMENT_START:
                    break;
                case c.CARET:
                    i = o ? n.start : n.end;
                    break;
                case c.DOCUMENT_END:
                    i = r;
                    break;
                case c.NODE:
                    i = o ? n.start : n.end;
                    break;
                case c.SELECTION_START:
                    i = n.start;
                    break;
                case c.SELECTION_END:
                    i = n.end;
                    break;
                default:
                    return -1;
            }
            if (this.wordBoundary)
                if (o) {
                    if (
                        i > 0 &&
                        !t.CharSet.wordSeparator.characterIsMember(e[i])
                    )
                        for (
                            ;
                            i > 0 &&
                            !t.CharSet.wordSeparator.characterIsMember(
                                e[i - 1],
                            );

                        )
                            i -= 1;
                } else if (
                    i < r - 1 &&
                    !t.CharSet.wordSeparator.characterIsMember(e[i])
                )
                    for (
                        ;
                        i < r - 1 &&
                        !t.CharSet.wordSeparator.characterIsMember(e[i + 1]);

                    )
                        i += 1;
            return i;
        }
        getCaretPosition(e) {
            return this.m_mappingDelegate
                ? this.m_mappingDelegate.caretPositioner.getCaretPosition(e)
                : null;
        }
        process(e, t, n) {
            return (
                !this.positionReached &&
                (this.onPreprocess(e, t, n) &&
                    this.onProcess(e, t, n) &&
                    ((this.m_startingNode = e), (this.m_startingOffset = n)),
                !0)
            );
        }
        onPreprocess(e, t, n) {
            return !0;
        }
        onProcess(e, t, n) {
            return !0;
        }
    }
    class h extends l {
        getTextContent(e, t, n) {
            return null;
        }
        getSelectedContent() {
            return null;
        }
    }
    class m extends s {
        enableHighlight(e, n, o) {
            e.source.selectionHandler.enableHighlight(!0),
                (e.originalSelection = (function (e) {
                    const t = e.source.selectionHandler.getSelection(
                        e.activeElementInfo,
                    );
                    return t
                        ? {
                              anchorNode: t.anchorNode,
                              anchorOffset: t.anchorOffset,
                              focusNode: t.focusNode,
                              focusOffset: t.focusOffset,
                              type: t.type,
                              start: t.anchorOffset,
                              end: t.focusOffset,
                              positionInfo: t.positionInfo,
                              isGoogleDocs: t.isGoogleDocs,
                              isGoogleSlides: t.isGoogleSlides,
                          }
                        : null;
                })(e)),
                t.Utils.callMethod(o);
        }
        disableHighlight(e, n, o) {
            void 0 !== e.clearSelectionAtEnd
                ? e.clearSelectionAtEnd
                    ? e.source.selectionHandler.clearSelection(e)
                    : e.source.selectionHandler.restoreSelection(e)
                : n !== r.NONE &&
                  (e.cancelled
                      ? e.source.selectionHandler.clearSelection(e)
                      : e.source.selectionHandler.restoreSelection(e)),
                e.source.selectionHandler.enableHighlight(!1),
                setTimeout(() => {
                    t.Utils.callMethod(o);
                }, 10);
        }
        highlightWord(e, t, n) {
            return e.source.selectionHandler.selectWord(e, t, n && n.colors);
        }
        highlight(e, t, n, o) {
            return e.source.selectionHandler.select(e, t, n, o && o.colors);
        }
        getHighlightedBoundingClientRect(e, t) {
            if (!(e && e.activeElementInfo && e.activeElementInfo.document))
                return null;
            const n = e.source.selectionHandler.getSelection(
                e.activeElementInfo,
            );
            return n && n.type && "function" == typeof n.getRangeAt
                ? "Range" !== n.type
                    ? null
                    : n.getRangeAt(0).getBoundingClientRect()
                : null;
        }
    }
    class u extends l {
        constructor(e = null) {
            super(),
                (this.m_options = null),
                (this.m_paraIterator = void 0),
                (this.m_caretPositioner = void 0),
                (this.m_selectionHandler = void 0),
                (this.m_textHighlighter = void 0),
                (this.m_textReader = void 0),
                (this.options = e);
        }
        get options() {
            return this.m_options;
        }
        set options(e) {
            (this.m_options = {
                type: "document",
                isEditor: !1,
                markNodeValueSeparatorAsEmbedded: !0,
                exclusionSelectors: [],
                clearSelectionAtEnd: void 0,
                acceptAriaHiddenElements: !1,
                ...e,
            }),
                this.m_options.exclusionSelectors.push([
                    "dji-sru-toast",
                    "#__dji_sru_main_container",
                ]),
                Object.freeze(this.m_options);
        }
        get type() {
            return this.options.type;
        }
        get isEditor() {
            return this.m_options.isEditor;
        }
        get clearSelectionAtEnd() {
            return this.m_options.clearSelectionAtEnd;
        }
        get markNodeValueSeparatorAsEmbedded() {
            return this.options.markNodeValueSeparatorAsEmbedded;
        }
        get exclusionSelectors() {
            return this.options.exclusionSelectors;
        }
        get updateInProgress() {
            return !1;
        }
        get updatedAt() {}
        get caretPositioner() {
            return (
                void 0 === this.m_caretPositioner &&
                    (this.m_caretPositioner = this.createCaretPositioner()),
                this.m_caretPositioner
            );
        }
        get selectionHandler() {
            return (
                void 0 === this.m_selectionHandler &&
                    (this.m_selectionHandler = this.createSelectionHandler()),
                this.m_selectionHandler
            );
        }
        get paragraphIterator() {
            return (
                void 0 === this.m_paraIterator &&
                    (this.m_paraIterator = this.createParagraphIterator()),
                this.m_paraIterator
            );
        }
        get textHighlighter() {
            return (
                void 0 === this.m_textHighlighter &&
                    (this.m_textHighlighter = this.createTextHighlighter()),
                this.m_textHighlighter
            );
        }
        get textReader() {
            return (
                void 0 === this.m_textReader &&
                    (this.m_textReader = this.createTextReader()),
                this.m_textReader
            );
        }
        getRootNode(e) {
            return e.element || (e.activeElemInfo && e.activeElemInfo.element);
        }
        acceptNodeForMapping(e, n, o) {
            if (e.nodeType === Node.ELEMENT_NODE) {
                const t = e;
                if ("hidden" === t.style.getPropertyValue("visibility"))
                    return NodeFilter.FILTER_REJECT;
                if ("none" === t.style.getPropertyValue("display"))
                    return NodeFilter.FILTER_REJECT;
                const n = window.getComputedStyle(t);
                if ("hidden" === n.getPropertyValue("visibility"))
                    return NodeFilter.FILTER_REJECT;
                if ("none" === n.getPropertyValue("display"))
                    return NodeFilter.FILTER_REJECT;
            }
            if (e.nodeType === Node.TEXT_NODE)
                return t.Utils.isMathMLEquatioDescription(e.parentElement)
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_ACCEPT;
            if (
                t.Utils.isMathMLElement(e.parentElement) ||
                t.Utils.hasMathMLData(e.parentElement)
            )
                return NodeFilter.FILTER_REJECT;
            if (t.Utils.hasMathMLData(e) || t.Utils.isEquatioImg(e))
                return NodeFilter.FILTER_SKIP;
            const i = e;
            if (
                e.nodeType === Node.ELEMENT_NODE &&
                this.exclusionSelectors.length > 0
            ) {
                const e = this.exclusionSelectors.length;
                for (let t = 0; t < e; t += 1) {
                    const e = this.exclusionSelectors[t];
                    if (i.matches(e)) return NodeFilter.FILTER_REJECT;
                }
            }
            const r = (i.tagName || "").toUpperCase();
            return "HEAD" === r
                ? NodeFilter.FILTER_REJECT
                : this.m_options.acceptAriaHiddenElements ||
                    "true" !== i.getAttribute("aria-hidden")
                  ? "SCRIPT" === r ||
                    "NOSCRIPT" === r ||
                    "SELECT" === i.tagName ||
                    "STYLE" === r
                      ? NodeFilter.FILTER_REJECT
                      : "IMG" !== r || ("" === i.alt && "" === i.title)
                        ? this.isAnnotatedTitleForMathMLEquatio(r, e)
                            ? NodeFilter.FILTER_REJECT
                            : t.Utils.isMathMLEquatioDescription(e) ||
                                t.Utils.isMathMLElement(i)
                              ? NodeFilter.FILTER_SKIP
                              : t.Utils.elementIsVisible(e, e.ownerDocument)
                                ? "IFRAME" === r && e.contentDocument
                                    ? NodeFilter.FILTER_ACCEPT
                                    : "FIGURE" ===
                                            (e.parentElement
                                                ? (
                                                      e.parentElement.tagName ||
                                                      ""
                                                  ).toUpperCase()
                                                : "") && "FIGCAPTION" !== r
                                      ? NodeFilter.FILTER_REJECT
                                      : NodeFilter.FILTER_SKIP
                                : NodeFilter.FILTER_SKIP
                        : this.isEditor || "rewordify" !== n.requestFor
                          ? NodeFilter.FILTER_ACCEPT
                          : NodeFilter.FILTER_REJECT
                  : NodeFilter.FILTER_REJECT;
        }
        createCaretPositioner() {
            return new i(this);
        }
        createSelectionHandler() {
            return new a();
        }
        createTextHighlighter() {
            return new m();
        }
        createTextReader() {
            return new h();
        }
        createTreeWalker(e, t, n, o) {
            return e.createTreeWalker(t, n, o);
        }
        createParagraphIterator() {
            return null;
        }
        getTextContentForNode(e, t = !0) {
            let n = null;
            if (e.nodeType === Node.ELEMENT_NODE) {
                const t = e;
                ("TEXTAREA" === t.tagName || "INPUT" === t.tagName) &&
                    (n = e.value);
            }
            if ((n || (n = e.textContent), null !== n && t)) {
                const t = this.getValueSeparatorForNode(e);
                if (t && t.length > 0) return n.concat(t);
            }
            return n;
        }
        getValueForNode(e, t = !0) {
            let n = null;
            if (e.nodeType === Node.ELEMENT_NODE) {
                const t = e;
                ("TEXTAREA" === t.tagName || "INPUT" === t.tagName) &&
                    (n = e.value);
            }
            if ((n || (n = e.nodeValue), null !== n && t)) {
                const t = this.getValueSeparatorForNode(e);
                if (t && t.length > 0) return n.concat(t);
            }
            return n;
        }
        getValueSeparatorForNode(e) {
            return "";
        }
        isAnnotatedTitleForMathMLEquatio(e, n) {
            if ("TITLE" !== e) return !1;
            if ("IMAGE" !== n.parentElement.tagName.toUpperCase()) return !1;
            const o = n.parentElement.querySelector("desc");
            return null !== o && t.Utils.isMathMLEquatioDescription(o);
        }
    }
    class g extends u {
        constructor() {
            super({type: "bookshare.book", isEditor: !0}),
                (this.m_frameId = "readium-scrolling-content");
        }
        getRootNode(e) {
            const t = e && e.document ? e.document : document;
            if (
                t.defaultView.frameElement &&
                t.defaultView.frameElement.id === this.m_frameId
            )
                return t.documentElement;
            const n = t.querySelector(`iframe#${this.m_frameId}`);
            return n ? n.contentDocument.documentElement : super.getRootNode(e);
        }
        createSelectionHandler() {
            return new a();
        }
    }
    class p {
        m_whatToShow = 0;
        m_filter = null;
        m_walkers = [];
        constructor(e, t, n, o) {
            (this.m_whatToShow = n),
                (this.m_filter = o),
                this.pushWalkerForDocument(e, t);
        }
        get currentNode() {
            const e = this.currentWalker();
            return e ? e.currentNode : null;
        }
        set currentNode(e) {
            (this.m_walkers = []),
                this.pushWalkerForDocument(
                    e.ownerDocument,
                    e.ownerDocument.documentElement,
                );
        }
        nextNode() {
            let e = this.currentWalker();
            for (; e; ) {
                const t = e.nextNode();
                if (t || !(this.m_walkers.length > 1)) {
                    if (
                        t instanceof HTMLIFrameElement &&
                        null !== t.contentDocument
                    ) {
                        e = this.pushWalkerForIFrame(t);
                        continue;
                    }
                    return t;
                }
                this.popWalker(), (e = this.currentWalker());
            }
            return null;
        }
        previousNode() {
            let e = this.currentWalker();
            for (; e; ) {
                const t = e.previousNode();
                if (t || !(this.m_walkers.length > 1)) {
                    if (
                        t instanceof HTMLIFrameElement &&
                        null !== t.contentDocument
                    ) {
                        for (e = this.pushWalkerForIFrame(t); e.nextNode(); )
                            continue;
                        continue;
                    }
                    return t;
                }
                this.popWalker(), (e = this.currentWalker());
            }
            return null;
        }
        pushWalkerForDocument(e, t) {
            let n = t;
            t
                ? t instanceof Element &&
                  "HTML" === t.tagName.toUpperCase() &&
                  (n = t.ownerDocument.body)
                : (n = e.body);
            const o = e.createTreeWalker(n, this.m_whatToShow, this.m_filter);
            return this.m_walkers.push(o), o;
        }
        pushWalkerForIFrame(e) {
            return this.pushWalkerForDocument(
                e.contentDocument,
                e.contentDocument.body,
            );
        }
        popWalker() {
            this.m_walkers.pop();
        }
        currentWalker() {
            return this.m_walkers.length >= 0
                ? this.m_walkers[this.m_walkers.length - 1]
                : null;
        }
    }
    function f(e) {
        if (!e) return !1;
        if (e.nodeType === Node.TEXT_NODE) return !0;
        if ("kindleReader_touchLayer" === e.id) return !1;
        if (
            e.classList &&
            (e.classList.contains("hidden") ||
                e.classList.contains("touchproxy"))
        )
            return !1;
        const t = e.tagName.toUpperCase();
        return "BUTTON" !== t && "IFRAME" !== t;
    }
    class _ extends i {
        getCaretPositionFromPoint(e, n, o) {
            return (function (e, t, n, o = (e, t, n, o) => o) {
                let i = [],
                    r = [];
                try {
                    let s = e,
                        a = t,
                        l = n,
                        c = s.elementFromPoint(a, l);
                    for (; c && !f(c); ) {
                        if ("IFRAME" === c.tagName.toUpperCase()) {
                            if (!c.contentDocument) break;
                            const e = c.getBoundingClientRect();
                            (a -= e.left),
                                (l -= e.top),
                                (s = c.contentDocument);
                        } else
                            i.push(c),
                                r.push(c.style.zIndex),
                                (c.style.zIndex = -1);
                        c = s.elementFromPoint(a, l);
                    }
                    return o(s, a, l, c);
                } finally {
                    let e = 0;
                    for (; e < i.length; e += 1) i[e].style.zIndex = r[e];
                    (i = []), (r = []);
                }
            })(o, e, n, (e, n, o, i) => {
                const r = t.Utils.caretPositionFromPoint(n, o, e);
                return (r.x = n), (r.y = o), r;
            });
        }
    }
    class E extends a {
        constructor(e) {
            super(), (this.m_delegate = e);
        }
        clearSelection(e) {
            const t = this.m_delegate
                    .getRootNode(e)
                    .ownerDocument.querySelectorAll("iframe"),
                n = t.length;
            for (let e = 0; e < n; e += 1) {
                const n = t[e];
                n &&
                    n.contentDocument &&
                    n.contentDocument.getSelection().empty();
            }
        }
    }
    class N extends u {
        constructor() {
            super({
                type: "amazon.kindle",
                markNodeValueSeparatorAsEmbedded: !1,
                isEditor: !0,
            }),
                (this.m_frameId = "KindleReaderIFrame"),
                (this.m_contentId = "kindleReader_content");
        }
        getRootNode(e) {
            if (!e.isAmazonKindle) return super.getRootNode(e);
            let t = e && e.document ? e.document : document;
            if (t.defaultView.frameElement) {
                if (t.defaultView.frameElement.id === this.m_frameId)
                    return t.body;
                t = document;
            }
            const n = t.querySelector(`iframe#${this.m_frameId}`);
            if (n) {
                const e = n.contentDocument.querySelector(
                    `div#${this.m_contentId}`,
                );
                return e ? e.parentElement : n.contentDocument.body;
            }
            return super.getRootNode(e);
        }
        acceptNodeForMapping(e, t, n) {
            return e.nodeType !== Node.TEXT_NODE ||
                (function (e) {
                    if (!e) return !1;
                    const t = e.ownerDocument.defaultView;
                    if (!t) return !1;
                    let n = null;
                    if (e.getBoundingClientRect) n = e.getBoundingClientRect();
                    else {
                        const t = e.ownerDocument.createRange();
                        t.selectNodeContents(e),
                            (n = t.getBoundingClientRect());
                    }
                    return (
                        !(n.width <= 0 || n.height <= 0) &&
                        (n.y >= 0 || n.y + n.height / 2 > 0) &&
                        n.y + n.height <= t.innerHeight &&
                        (n.x >= 0 || n.x + n.width / 2 > 0) &&
                        n.x + n.width <= t.innerWidth
                    );
                })(e)
                ? "kindleReader_immersiveFooter" === e.id
                    ? NodeFilter.FILTER_REJECT
                    : super.acceptNodeForMapping(e, t, n)
                : NodeFilter.FILTER_REJECT;
        }
        createSelectionHandler() {
            return new E(this);
        }
        createCaretPositioner() {
            return new _(this);
        }
        createTreeWalker(e, t, n, o) {
            return new p(e, t, n, o);
        }
        getValueSeparatorForNode(e) {
            return " ";
        }
    }
    class C extends a {
        constructor(e) {
            super(), (this.m_delegate = e);
        }
        getSelection(e) {
            const t = {
                    anchorNode: null,
                    anchorOffset: 0,
                    focusNode: null,
                    focusOffset: 0,
                },
                n = this.m_delegate.getRootNode(e).ownerDocument,
                o = [
                    n.getSelection(),
                    ...Array.from(n.querySelectorAll("iframe")).map((e) =>
                        e.contentDocument
                            ? e.contentDocument.getSelection()
                            : null,
                    ),
                ],
                i = o.length;
            let r = 0;
            for (; r < i; r += 1) {
                const e = o[r];
                if (e && "Range" === e.type)
                    return (
                        (t.anchorNode = e.anchorNode),
                        (t.anchorOffset = e.anchorOffset),
                        (t.focusNode = e.focusNode),
                        (t.focusOffset = e.focusOffset),
                        t
                    );
            }
            return t;
        }
    }
    function x(e) {
        if (!e) return !1;
        if (e.nodeType === Node.TEXT_NODE) return !0;
        if (
            e.classList &&
            (e.classList.contains("reader-affordance") ||
                e.classList.contains("reader-affordance-film") ||
                e.classList.contains("shibui-shield-grip") ||
                e.classList.contains("navigation"))
        )
            return !1;
        if (e.closest && e.closest("div.navigation")) return !1;
        const t = e.tagName.toUpperCase();
        return "BUTTON" !== t && "IFRAME" !== t;
    }
    function S(e, t, n, o = (e, t, n, o) => e.caretRangeFromPoint(t, n)) {
        let i = [];
        try {
            let r = e,
                s = t,
                a = n,
                l = r.elementFromPoint(s, a);
            for (; l && !x(l); ) {
                if ("IFRAME" === l.tagName.toUpperCase()) {
                    if (!l.contentDocument) break;
                    const e = l.getBoundingClientRect();
                    (s -= e.left), (a -= e.top), (r = l.contentDocument);
                } else {
                    if (i.indexOf(l) >= 0) return null;
                    i.push(l), (l.hidden = !0);
                }
                l = r.elementFromPoint(s, a);
            }
            return o(r, s, a, l);
        } finally {
            let e = 0;
            for (; e < i.length; e += 1) i[e].hidden = !1;
            i = [];
        }
    }
    function T(e) {
        if ("none" === e.style.display) return !1;
        const t = e.getBoundingClientRect();
        return 0 !== t.width && 0 !== t.height;
    }
    function I(e, t) {
        if (!e) return;
        const n = e.querySelectorAll("iframe"),
            o = n.length;
        for (let e = 0; e < o; e += 1) {
            const o = n[e];
            T(o) &&
                "about:blank" !== o.src &&
                (t.push(o), I(o.contentDocument, t));
        }
    }
    class R {
        static elementFromPoint(e, t, n) {
            return S(e, t, n, (e, t, n, o) => o);
        }
        static caretPositionFromPoint(e, n, o) {
            return S(e, n, o, (e, n, o, i) => {
                const r = t.Utils.caretPositionFromPoint(n, o, e);
                return (r.x = n), (r.y = o), r;
            });
        }
        static caretRangeFromPoint(e, t, n) {
            return S(e, t, n, (e, t, n, o) => {
                const i = e.caretRangeFromPoint(t, n);
                return i.startContainer &&
                    i.startContainer.nodeType === Node.TEXT_NODE
                    ? i
                    : null;
            });
        }
        static getIFrames(e) {
            const t = [];
            return I(e, t), t;
        }
        static getViewportBoundsForFrame(e) {
            let t = e.parentElement;
            for (; t; ) {
                if (t.classList.contains("book-bounds"))
                    return t.getBoundingClientRect();
                if (t.classList.contains("book-surface"))
                    return t.getBoundingClientRect();
                t = t.parentElement;
            }
            const n = e.contentWindow.visualViewport;
            return new DOMRectReadOnly(
                n.offsetLeft + n.pageLeft,
                n.offsetTop + n.pageTop,
                n.width,
                n.height,
            );
        }
        static framePositionInViewport(e) {
            const t = e.getBoundingClientRect(),
                n = R.getViewportBoundsForFrame(e);
            return t.right <= n.left || t.bottom <= n.top
                ? -1
                : t.left >= n.right || t.top >= n.bottom
                  ? 1
                  : 0;
        }
        static nodeRectPositionInViewport(e, t, n) {
            if (!e.hasChildNodes && (0 === t.width || 0 === t.height))
                return -1;
            const o = e.ownerDocument.defaultView.frameElement;
            if (!o) return -1;
            const i = R.framePositionInViewport(o);
            if (0 !== i) return i;
            const r = o.getBoundingClientRect(),
                s = R.getViewportBoundsForFrame(o),
                a = Math.max(s.left, r.left),
                l = Math.min(s.right, r.right),
                c = Math.max(s.top, r.top),
                d = Math.min(s.bottom, r.bottom),
                h = r.width / o.offsetWidth,
                m = r.height / o.offsetHeight,
                u = t.width * h,
                g = t.height * m,
                p = r.x + t.x * h,
                f = r.y + t.y * m,
                _ = p + u,
                E = f + g;
            return _ <= a || E < c
                ? -1
                : p + 2.5 >= l || f + 2.5 >= d
                  ? (function (e) {
                        return (
                            e.hasAttribute &&
                            e.hasAttribute("epub:type") &&
                            "pagebreak" === e.getAttribute("epub:type")
                        );
                    })(e)
                      ? 0
                      : 1
                  : n
                    ? p < a || f < c
                        ? -1
                        : _ <= l && E <= d
                          ? 0
                          : 1
                    : 0;
        }
    }
    function y(e) {
        switch (e.charCodeAt(0)) {
            case 210:
            case 211:
            case 227:
                return String.fromCharCode(34);
            case 212:
            case 213:
                return String.fromCharCode(39);
            case 214:
                return String.fromCharCode(58);
            case 226:
                return String.fromCharCode(44);
            default:
                return null;
        }
    }
    class v {
        constructor() {
            (this.m_wimpyKidFontFamilyName = "WimpyKid"),
                (this.m_fontFamilyToMapperFunctionMap = new Map()),
                this.m_fontFamilyToMapperFunctionMap.set(
                    this.m_wimpyKidFontFamilyName,
                    y,
                );
        }
        mapGlyph(e, t, n) {
            const o = this.normalizeFontFamily(e),
                i = this.m_fontFamilyToMapperFunctionMap.get(o);
            if (i) {
                const e = i(t, n);
                if (e) return e;
            }
            return (function (e, t) {
                return t && t.convertLineFeedToSpace && 10 === e.charCodeAt(0)
                    ? String.fromCharCode(32)
                    : e;
            })(t, n);
        }
        normalizeFontFamily(e) {
            return e.search(this.m_wimpyKidFontFamilyName) >= 0
                ? this.m_wimpyKidFontFamilyName
                : e;
        }
    }
    class b extends EventTarget {
        constructor() {
            super(),
                (this.m_mouseDownEventListener = (e) => {
                    this.onMouseDown(e);
                }),
                (this.m_mouseMoveEventListener = (e) => {
                    this.onMouseMove(e);
                }),
                (this.m_mouseUpEventListener = (e) => {
                    this.onMouseUp(e);
                }),
                (this.m_mouseClickEventListener = (e) => {
                    this.onMouseClick(e);
                }),
                (this.m_range = new Range()),
                (this.m_isBackward = !1),
                (this.m_listeners = {selectionDone: []});
        }
        install(e) {
            e.addEventListener(
                "pointerdown",
                this.m_mouseDownEventListener,
                !0,
            );
        }
        uninstall(e) {
            e.removeEventListener(
                "pointermove",
                this.m_mouseMoveEventListener,
                !0,
            ),
                e.removeEventListener(
                    "pointerup",
                    this.m_mouseUpEventListener,
                    !0,
                ),
                e.removeEventListener(
                    "pointerdown",
                    this.m_mouseDownEventListener,
                    !0,
                );
        }
        getSelection() {
            return this.m_range
                ? this.m_range.startContainer
                    ? this.m_range.startContainer.getSelection
                        ? this.m_range.startContainer.getSelection()
                        : this.m_range.startContainer.ownerDocument.getSelection()
                    : document.getSelection()
                : null;
        }
        caretRangeFromPoint(e, t, n) {
            const o = e.caretRangeFromPoint(t, n);
            return o &&
                o.startContainer &&
                o.startContainer.nodeType === Node.TEXT_NODE
                ? o
                : null;
        }
        onMouseDown(e) {
            const t = e.target.ownerDocument,
                n = this.caretRangeFromPoint(t, e.clientX, e.clientY);
            n &&
                n.cloneRange &&
                ((this.m_isBackward = !1),
                (this.m_range = n.cloneRange()),
                this.m_range.startContainer.ownerDocument
                    .getSelection()
                    .removeAllRanges(),
                t.addEventListener(
                    "pointermove",
                    this.m_mouseMoveEventListener,
                    !0,
                ),
                t.addEventListener(
                    "pointerup",
                    this.m_mouseUpEventListener,
                    !0,
                ),
                t.addEventListener(
                    "click",
                    this.m_mouseClickEventListener,
                    !0,
                ));
        }
        onMouseMove(e) {
            const t = this.caretRangeFromPoint(
                e.target.ownerDocument,
                e.clientX,
                e.clientY,
            );
            if (!t) return;
            let n = !1;
            if (this.m_range)
                if (3 === t.startContainer.nodeType) {
                    switch (
                        (3 !== this.m_range.startContainer.nodeType &&
                            this.m_range.setStart(
                                t.startContainer,
                                t.startOffset,
                            ),
                        this.m_range.comparePoint(
                            t.startContainer,
                            t.startOffset,
                        ))
                    ) {
                        case -1:
                            if (this.m_isBackward)
                                this.m_range.setStart(
                                    t.startContainer,
                                    t.startOffset,
                                );
                            else {
                                this.m_isBackward = !0;
                                const {startContainer: e} = this.m_range,
                                    {startOffset: n} = this.m_range;
                                this.m_range.setStart(
                                    t.startContainer,
                                    t.startOffset,
                                ),
                                    this.m_range.setEnd(e, n);
                            }
                            break;
                        case 0:
                            this.m_isBackward
                                ? this.m_range.setStart(
                                      t.startContainer,
                                      t.startOffset,
                                  )
                                : this.m_range.setEnd(
                                      t.startContainer,
                                      t.startOffset,
                                  );
                            break;
                        case 1:
                            (this.m_isBackward = !1),
                                this.m_range.setEnd(
                                    t.startContainer,
                                    t.startOffset,
                                );
                    }
                    n = !0;
                } else e.preventDefault(), e.stopPropagation();
            else (this.m_range = t.cloneRange()), (n = !0);
            if (n) {
                const e =
                    this.m_range.startContainer.ownerDocument.getSelection();
                e.removeAllRanges(), e.addRange(this.m_range);
            }
        }
        onMouseUp(e) {
            (e.__djiHandledBySelectionEnabler = !0),
                this.dispatchEvent(new Event("selectionDone"));
        }
        onMouseClick(e) {
            e.target.ownerDocument.removeEventListener(
                "pointermove",
                this.m_mouseMoveEventListener,
                !0,
            ),
                e.target.ownerDocument.removeEventListener(
                    "pointerup",
                    this.m_mouseUpEventListener,
                    !0,
                ),
                e.target.ownerDocument.removeEventListener(
                    "click",
                    this.m_mouseClickEventListener,
                    !0,
                );
        }
    }
    class F extends b {
        caretRangeFromPoint(e, t, n) {
            return R.caretRangeFromPoint(e, t, n);
        }
    }
    class M extends h {
        constructor() {
            super(),
                (this.m_installed = !1),
                (this.m_selectionEnabled = !1),
                (this.m_overlaysEnabled = !1),
                (this.m_range = new Range()),
                (this.m_selectionHelper = new F()),
                (this.m_glyphMapper = new v()),
                (this.m_textMapper = null),
                (this.m_textMapperDelegate = null),
                (this.m_textMappingStartStrategy = null),
                (this.m_textMappingEndStrategy = null),
                (this.m_cache = {
                    context: void 0,
                    lastClickedPosition: void 0,
                    lastClickedParagraph: void 0,
                    speechContext: !1,
                }),
                (this.m_startItemForMappings = null),
                (this.m_endItemForMappings = null),
                (this.m_selectionPreventionScriptText = void 0),
                (this.m_selectionPreventionScriptId =
                    "DJI_STYLE_enable_selection"),
                (this.m_controlClassNames = [
                    "affordance-film",
                    "reader-affordance",
                    "reader-affordance-film",
                    "orient-film",
                    "orient-shield",
                    "control-film",
                    "zoom-film",
                    "zoom-controls",
                    "book-widgets",
                    "navigation-footer",
                    "nav-progress-bar",
                    "navigation-nav",
                    "nav-action-bar",
                    "menu-bar",
                    "read-header",
                ]),
                (this.m_mouseClickEventListener = (e) => {
                    this.onWorkspaceMouseClick(e);
                }),
                (this.m_frameLoadedEventListener = (e) => {
                    this.onFrameLoaded(e);
                });
        }
        getTextContent(e, t, n) {
            return (
                (n.entireDocument =
                    n.entireDocument ||
                    Boolean(
                        e && e.isFromDocumentStart && t && t.isFromDocumentEnd,
                    )),
                this.getContextWithParams(n)
            );
        }
        getSelectedContent() {
            return null;
        }
        isInstalled() {
            return this.m_installed;
        }
        addSelectionEventListener(e, t) {
            this.m_selectionHelper.addEventListener(e, t);
        }
        install() {
            document.documentElement.setAttribute(
                "dji-sru-fullscreen-popup",
                "",
            ),
                this.installIFrameObserver(),
                this.injectCSSInIFrames(),
                this.enableOrRestoreSelectionInFrames(),
                (this.m_installed = !0);
        }
        uninstall() {
            (this.m_installed = !1),
                (this.m_selectionEnabled = !1),
                this.uninstallIFrameObserver(),
                this.installOrUninstallEventListeners(!1),
                this.enableOrRestoreSelectionInFrames(),
                (this.m_selectionPreventionScriptText = null),
                document.documentElement.removeAttribute(
                    "dji-sru-fullscreen-popup",
                );
        }
        installIFrameObserver() {
            t.PageObserver.addEventListener(
                t.PageObserver.EventTypes.IFRAME_LOADED,
                this.m_frameLoadedEventListener,
            );
        }
        uninstallIFrameObserver() {
            t.PageObserver.removeEventListener(
                t.PageObserver.EventTypes.IFRAME_LOADED,
                this.m_frameLoadedEventListener,
            );
        }
        onFrameLoaded(e) {
            e.iframe &&
                e.iframe.contentDocument &&
                (e.iframe.contentDocument.documentElement.setAttribute(
                    "dji-sru-fullscreen-popup",
                    "",
                ),
                this.enableOrRestoreSelectionInDocument(
                    e.iframe.contentDocument,
                ));
        }
        installOrUninstallEventListeners(e) {
            const t = [document];
            this.getVisibleSubDocuments(document, t);
            const n = t.length;
            for (let o = 0; o < n; o += 1) {
                const n = t[o];
                n &&
                    n.body &&
                    (e
                        ? this.addEventListenersForElement(n)
                        : this.removeEventListenersForElement(n));
            }
        }
        enableOrRestoreSelectionInFrames() {
            this.disableOrRestoreControlElements(),
                this.enableOrRestoreSelectionInDocument(document);
        }
        enableOrRestoreSelectionInDocument(e) {
            if (!e) return;
            try {
                const t = e.getElementById(this.m_selectionPreventionScriptId);
                if (!t && this.m_selectionEnabled) {
                    const t = e.createElement("style");
                    (t.innerHTML =
                        "html,html *{-webkit-touch-callout:text!important;-webkit-user-select:text!important;-moz-user-select:text!important;-ms-user-select:text!important;-o-user-select:text!important;user-select:text!important}"),
                        e.head && e.head.appendChild(t);
                } else t && !this.m_selectionEnabled && t.remove();
            } catch (e) {}
            const t = [];
            this.getVisibleSubDocuments(e, t);
            const n = t.length;
            for (let e = 0; e < n; e += 1) {
                const n = t[e];
                n && this.enableOrRestoreSelectionInDocument(n);
            }
        }
        disableOrRestoreControlElements() {
            const e = this.m_selectionEnabled || this.m_overlaysEnabled,
                t = e ? "none" : "",
                n = [document];
            this.getVisibleSubDocuments(document, n);
            const o = n.length;
            for (let i = 0; i < o; i += 1) {
                const o = n[i];
                if (!o) continue;
                e && this.dismissNavigationButtons(o);
                const r = this.m_controlClassNames.length;
                for (let e = 0; e < r; e += 1) {
                    const n = this.m_controlClassNames[e],
                        i = o.getElementsByClassName(n),
                        r = i.length;
                    for (let e = 0; e < r; e += 1) i[e].style.display = t;
                }
            }
        }
        dismissNavigationButtons(e) {
            const t = e.activeElement;
            t &&
                "button" === t.type &&
                t.parentElement &&
                t.parentElement.classList &&
                t.parentElement.classList.contains("navigation") &&
                t.dispatchEvent(new Event("click"));
            const n = e.querySelector(
                "div.navigation > button.shibui-shield.halo.ripple",
            );
            n &&
                !n.disabled &&
                "true" !== n.ariaHidden &&
                n.dispatchEvent(new Event("click"));
        }
        injectCSSInIFrames() {
            const e = document.getElementsByClassName("book-surface");
            if (!e || 0 === e.length) return;
            const t = e[0].getElementsByClassName("bounds");
            if (!t || 0 === t.length) return;
            const n = t.length;
            for (let e = 0; e < n; e += 1) {
                const n = t[e].querySelectorAll("iframe"),
                    o = n.length;
                for (let e = 0; e < o; e += 1)
                    n[e].contentDocument.documentElement.setAttribute(
                        "dji-sru-fullscreen-popup",
                        "",
                    );
            }
        }
        addEventListenersForElement(e) {
            e &&
                e.addEventListener("click", this.m_mouseClickEventListener, !0);
        }
        removeEventListenersForElement(e) {
            e &&
                e.removeEventListener(
                    "click",
                    this.m_mouseClickEventListener,
                    !0,
                );
        }
        onWorkspaceMouseClick(e) {
            const t = this.m_selectionHelper.getSelection();
            if (!t || ("Range" === t.type && !t.isCollapsed)) return;
            const n = R.caretPositionFromPoint(
                e.target.ownerDocument,
                e.clientX,
                e.clientY,
            );
            (this.m_cache.lastClickedPosition = {x: n.x, y: n.y}),
                (this.m_cache.lastClickedParagraph = n.offsetNode);
        }
        getVisibleSubDocuments(e, t) {
            if (!e) return;
            const n = e.querySelectorAll("iframe"),
                o = n.length;
            for (let e = 0; e < o; e += 1) {
                const o = n[e];
                if (!o.contentDocument) continue;
                const i = R.framePositionInViewport(o);
                if (0 === i)
                    t.push(o.contentDocument),
                        this.getVisibleSubDocuments(o.contentDocument, t);
                else {
                    if ("about:blank" === o.src) continue;
                    if (1 === i) break;
                }
            }
        }
        changeSelectionHelperStateInVisibleFrames(e) {
            const t = [document];
            this.getVisibleSubDocuments(document, t);
            const n = t.length;
            if (e)
                for (let e = 0; e < n; e += 1)
                    this.m_selectionHelper.install(t[e]);
            else
                for (let e = 0; e < n; e += 1)
                    this.m_selectionHelper.uninstall(t[e]);
        }
        enableSelection(e) {
            this.m_selectionEnabled !== e &&
                ((this.m_selectionEnabled = e),
                this.enableOrRestoreSelectionInFrames(),
                this.m_selectionEnabled || this.clearSelection(),
                this.changeSelectionHelperStateInVisibleFrames(
                    this.m_selectionEnabled,
                ),
                this.installOrUninstallEventListeners(this.m_selectionEnabled),
                e && document.defaultView.focus());
        }
        enableOverlays(e) {
            this.m_overlaysEnabled !== e &&
                ((this.m_overlaysEnabled = e),
                this.disableOrRestoreControlElements());
        }
        clearSelection() {
            const e = [document];
            this.getVisibleSubDocuments(document, e);
            const t = e.length;
            for (let n = 0; n < t; n += 1) {
                const t = e[n];
                t && t.getSelection().empty();
            }
            (this.m_cache.lastClickedParagraph = null),
                (this.m_cache.lastClickedPosition = null),
                (this.m_endItemForMappings = null);
        }
        getActiveElement() {
            return !this.m_startItemForMappings ||
                this.m_startItemForMappings.getClientRects
                ? this.m_startItemForMappings
                : this.m_startItemForMappings.parentElement;
        }
        getParagraphAtPoint(e, t, n) {
            let o = !1;
            const i = n.classList.values(),
                r = i.length;
            for (let e = 0; e < r; e += 1) {
                const t = i[e];
                if (this.m_controlClassNames.includes(t)) {
                    o = !0;
                    break;
                }
            }
            if (!o) return n;
            const s = this.getFrameAtPoint(e, t);
            if (!s) return null;
            const a = this.mapDocumentCoordinatesToFrameCoordinates(
                s,
                e,
                t,
                n.ownerDocument,
            );
            let l = s.contentDocument.elementFromPoint(a.x, a.y);
            for (; l && !this.isValidForParagraph(l); ) l = l.parentElement;
            return l === s.contentDocument.documentElement ||
                l === s.contentDocument.body
                ? null
                : l;
        }
        getLineAtPoint(e, t, n) {
            return null;
        }
        mapDocumentCoordinatesToFrameCoordinates(e, t, n, o) {
            if (e.contentDocument === o) return {x: t, y: n};
            const i = e.contentDocument.defaultView.visualViewport,
                r = e.getBoundingClientRect(),
                s = i.width / r.width,
                a = i.height / r.height;
            return {x: (t - r.left) * s, y: (n - r.top) * a};
        }
        isValidForParagraph(e) {
            const t = e.nodeName.toUpperCase();
            return !(
                !this.isNodeNameValidForParagraph(t) ||
                (0 === e.textContent.length && !this.isValidForParagraph(e))
            );
        }
        isNodeNameValidForParagraph(e) {
            return "BR" !== e && "IMG" !== e;
        }
        getFrameAtPoint(e, n) {
            const o = document.querySelectorAll("iframe");
            if (0 === o.length) return null;
            const i = o.length;
            for (let r = 0; r < i; r += 1) {
                const i = o[r],
                    s = i.getBoundingClientRect();
                if (t.DOMRectExtensions.contains(s, e, n)) return i;
            }
            return null;
        }
        getContextWithParams(e) {
            const t = this.hasSelection(e),
                n = Boolean(
                    (e && e.entireDocument) ||
                        (!t && "rewordify" === e.requestFor),
                ),
                o = Boolean(e && e.fromCaretToEnd),
                i = !(n || o) || (t && "speech" === e.requestFor);
            this.m_cache.speechContext = Boolean("speech" === e.requestFor);
            let r = null;
            return i
                ? null
                : ((r = this.getContext()),
                  e.clearSelection && this.clearSelection(),
                  r);
        }
        getContext() {
            const e = [],
                t = R.getIFrames(document),
                n = t.length;
            for (let o = 0; o < n; o += 1) {
                const n = t[o],
                    i = R.framePositionInViewport(n);
                if (0 === i)
                    (this.m_cache.lastClickedParagraph &&
                        0 === e.length &&
                        !n.contentDocument.contains(
                            this.m_cache.lastClickedParagraph,
                        )) ||
                        e.push(n);
                else if (1 === i) break;
            }
            if (0 === e.length) return null;
            let o = "";
            const i = [],
                r = [];
            let s = 0;
            const a = e.length;
            for (let t = 0; t < a; t += 1) {
                const n = e[t];
                if (
                    ((this.m_startItemForMappings =
                        this.m_cache.lastClickedParagraph &&
                        n.contentDocument.contains(
                            this.m_cache.lastClickedParagraph,
                        )
                            ? this.m_cache.lastClickedParagraph
                            : n.contentDocument.body),
                    !this.m_startItemForMappings)
                )
                    continue;
                this.m_endItemForMappings = null;
                let a = this.getStartItemForFrame(n),
                    l = this.m_startItemForMappings === a,
                    c = !1;
                do {
                    const e = this.fillMappingsForNode(a, i, r, s, l, c);
                    e.index !== s &&
                        ((s = e.index),
                        (o += e.text),
                        (l = e.startParagraphReached),
                        (c = e.endParagraphReached)),
                        (a = a.nextSibling);
                } while (a);
            }
            return {
                selection: {start: 0, length: 0},
                text: o,
                custom: {embededLocations: {}, map: i, matrix: r},
                extended: {text: o, selection: {start: 0, length: 0}},
                offset: 0,
            };
        }
        getStartItemForFrame(e) {
            if (
                !this.m_cache.lastClickedParagraph ||
                !e.contentDocument.contains(this.m_cache.lastClickedParagraph)
            )
                return e.contentDocument.body;
            let t = this.m_cache.lastClickedParagraph;
            for (
                ;
                t.parentElement &&
                0 === this.nodePositionInViewport(t.parentElement) &&
                ((t = t.parentElement),
                t !== e.contentDocument.body && t.parentElement);

            );
            return t;
        }
        hasSelection(e) {
            if (e.selection && e.selection.anchorNode && e.selection.focusNode)
                return !0;
            const t = this.m_selectionHelper.getSelection();
            return !!t && t.toString().length > 0;
        }
        markStartEndItemsFromSelection(e) {
            const n = t.Utils.isForwardSelection(e);
            (this.m_startItemForMappings = n ? e.anchorNode : e.focusNode),
                (this.m_endItemForMappings = n ? e.focusNode : e.anchorNode);
        }
        computeSelectionStart(e) {
            const n = t.Utils.isForwardSelection(e);
            return Math.max(
                (n ? e.anchorOffset : e.focusOffset) -
                    this.startIndexForNode(n ? e.anchorNode : e.focusNode, !1),
                0,
            );
        }
        computeSelectionLength(e, n, o) {
            let {length: i} = n;
            if (0 === i) return i;
            const r = t.Utils.isForwardSelection(e),
                s = r ? e.focusNode : e.anchorNode,
                a = r ? e.focusOffset : e.anchorOffset;
            let l = 0,
                c = o;
            for (; c < i; c += 1) {
                const e = n[c];
                if (
                    e &&
                    e.element === s &&
                    (e.embedded && (l += 1), e.offset - l > a)
                )
                    break;
            }
            let d = 0;
            for (; c < i; c += 1) n[c].embedded && (d += 1);
            return (i -= o), (i -= d), (i -= this.endIndexForNode(s) - a), i;
        }
        fillMappingsForNode(e, n, o, i, r, s) {
            const a = this.nodePositionInViewport(e);
            if (0 !== a || s)
                return {
                    index: i,
                    text: "",
                    startParagraphReached: r,
                    endParagraphReached: s,
                };
            let l = 0,
                c = !1,
                d = "";
            const h = e.childNodes,
                m = t.Utils.sortNodesByPosition(Array.from(h)),
                u = m.length;
            for (let e = 0; e < u; e += 1) {
                const t = m[e],
                    {nodeType: a} = t;
                if (
                    a === Node.CDATA_SECTION_NODE ||
                    a === Node.PROCESSING_INSTRUCTION_NODE ||
                    a === Node.COMMENT_NODE ||
                    a === Node.DOCUMENT_TYPE_NODE
                )
                    continue;
                const h = this.nodePositionInViewport(t);
                if (0 !== h) {
                    if (1 === h && ((l += 1), l > 1)) break;
                    continue;
                }
                const u = this.fillMappingsForNode(t, n, o, i, r);
                if (
                    (u.index !== i &&
                        ((c = !0),
                        (i = u.index),
                        (d += u.text),
                        (r = u.startParagraphReached),
                        (s = u.endParagraphReached)),
                    s)
                )
                    break;
            }
            if (
                !c &&
                0 === a &&
                null !== e.nodeValue &&
                ((r =
                    r ||
                    e === this.m_startItemForMappings ||
                    e.parentElement === this.m_startItemForMappings),
                (s =
                    s ||
                    Boolean(
                        this.m_endItemForMappings &&
                            (e === this.m_endItemForMappings ||
                                e.parentElement === this.m_endItemForMappings),
                    )),
                r)
            ) {
                const t = this.startIndexForNode(e, !0);
                if (t < 0)
                    return {
                        index: i,
                        text: "",
                        startParagraphReached: r,
                        endParagraphReached: s,
                    };
                const a = this.endIndexForNode(e);
                if (a < 0)
                    return {
                        index: i,
                        text: "",
                        startParagraphReached: r,
                        endParagraphReached: s,
                    };
                d = this.getMappedTextForNode(e, t, a);
                const l = d.length;
                for (let r = 0; r < l; r += 1)
                    n.push({
                        index: n.length,
                        element: e,
                        offset: r + t,
                        text: d[r],
                        embedded: !1,
                        isMath: !1,
                    }),
                        o.push(n[n.length - 1]),
                        (i += 1);
            }
            if (0 === a && r) {
                const t = this.spaceForNode(e);
                for (let r = 0; r < t.length; r += 1)
                    n.push({
                        index: n.length,
                        element: e,
                        offset: r + d.length,
                        text: t[r],
                        embedded: !1,
                        isMath: !1,
                    }),
                        o.push(n[n.length - 1]),
                        (i += 1);
                d += t;
            }
            return {
                index: i,
                text: d,
                startParagraphReached: r,
                endParagraphReached: s,
            };
        }
        getMappedTextForNode(e, n, o) {
            const i = e.ownerDocument.defaultView
                    .getComputedStyle(e.parentElement)
                    .getPropertyValue("font-family"),
                {nodeValue: r} = e;
            let s = "";
            const a = {convertLineFeedToSpace: this.m_cache.speechContext};
            for (let e = n; e < o; e += 1)
                s += this.m_glyphMapper.mapGlyph(i, r[e], a);
            return (s = t.Utils.htmlToAscii(s, !0)), s;
        }
        getClientRectsForNode(e) {
            return e
                ? (this.m_range.selectNodeContents(e),
                  this.m_range.getClientRects())
                : null;
        }
        getBoundingClientRectForNode(e) {
            return e.getBoundingClientRect
                ? e.getBoundingClientRect()
                : (this.m_range.selectNodeContents(e),
                  this.m_range.getBoundingClientRect());
        }
        nodePositionInViewport(e) {
            const t = this.getBoundingClientRectForNode(e);
            return R.nodeRectPositionInViewport(e, t, !1);
        }
        startIndexForNode(e, n) {
            let o = null,
                i = null;
            const r = this.getClientRectsForNode(e),
                s = r.length;
            for (let n = 0; n < s; n += 1) {
                const s = r[n];
                if (
                    0 !== s.width &&
                    0 !== s.height &&
                    (0 === R.nodeRectPositionInViewport(e, s, !1) &&
                        (o || (o = s),
                        this.m_cache.lastClickedPosition &&
                            t.DOMRectExtensions.contains(
                                s,
                                this.m_cache.lastClickedPosition.x,
                                this.m_cache.lastClickedPosition.y,
                            ) &&
                            (i = s)),
                    o && (!this.m_cache.lastClickedPosition || i))
                )
                    break;
            }
            if (!o) return -1;
            const a =
                e === this.m_startItemForMappings ||
                e.parentElement === this.m_startItemForMappings;
            if (this.m_cache.lastClickedPosition && !i) {
                if (a)
                    if (o.y + o.height < this.m_cache.lastClickedPosition.y) {
                        if (o.x < this.m_cache.lastClickedPosition.x) return -1;
                    } else if (
                        o.y < this.m_cache.lastClickedPosition.y &&
                        o.y + o.height > this.m_cache.lastClickedPosition.y &&
                        o.x < this.m_cache.lastClickedPosition.x
                    )
                        return -1;
                return 0;
            }
            const l = Boolean(i && a),
                c = l ? this.m_cache.lastClickedPosition.x : o.x,
                d = l ? this.m_cache.lastClickedPosition.y : o.y;
            let h = null;
            for (let t = 1; t <= 9; t += 1) {
                const n = c + t / 3,
                    o = d + t;
                if (
                    ((h = R.caretRangeFromPoint(e.ownerDocument, n, o)),
                    h && h.startContainer === e)
                )
                    break;
                h = null;
            }
            if (!h) return 0;
            let m = h.startOffset;
            if (n) {
                const n = e.nodeValue;
                for (; m > 0; ) {
                    const e = n[m - 1];
                    if (
                        t.CharSet.wordSeparator.characterIsMember(e) &&
                        (10 !== e.charCodeAt(0) || this.m_cache.speechContext)
                    )
                        break;
                    m -= 1;
                }
            }
            return m;
        }
        endIndexForNode(e) {
            const t = this.getClientRectsForNode(e);
            let n = !1;
            for (let o = t.length - 1; o >= 0; o -= 1) {
                const i = t[o];
                if (
                    0 !== i.width &&
                    0 !== i.height &&
                    0 === R.nodeRectPositionInViewport(e, i, !1)
                ) {
                    const {right: t} = i,
                        {bottom: o} = i;
                    n = !0;
                    for (let n = 1; n <= 6; n += 1) {
                        const i = t - n / 3,
                            r = o - n,
                            s = R.caretRangeFromPoint(e.ownerDocument, i, r);
                        if (s && s.startContainer === e) return s.startOffset;
                    }
                }
            }
            return n ? e.textContent.length : -1;
        }
        spaceForNode(e) {
            switch (e.nodeName.toUpperCase()) {
                case "H1":
                case "H2":
                case "H3":
                case "H4":
                case "H5":
                case "H6":
                case "P":
                    return "\n\n";
                case "BR":
                    return this.m_cache.speechContext ? " " : "\n";
                case "DIV":
                    return " ";
                case "SPAN":
                    return e.children.length > 0 ? " " : "";
                default:
                    return "";
            }
        }
    }
    class D extends u {
        m_range = null;
        constructor() {
            super({
                type: "overdrive.reader",
                isEditor: !0,
                acceptAriaHiddenElements: !0,
                exclusionSelectors: [
                    "div.reader-slider *",
                    ".reader-slider-range",
                    ".reader-slider-instructions",
                    "div.affordance-film",
                    "div.reader-affordance",
                    "div.reader-affordance-film",
                    "div.orient-film",
                    "div.orient-shield",
                    "div.control-film",
                    "div.zoom-film",
                    "div.zoom-controls",
                    "div.book-widgets",
                    "div.navigation-footer",
                    "div.nav-progress-bar",
                    "div.navigation-nav",
                    "div.nav-action-bar",
                    "div.menu-bar",
                    "div.read-header",
                    "nav.assistive-commands",
                    "div.chatterbox",
                    "div#loading-spinner",
                    "div.arena",
                    "div.hidden-message",
                ],
            }),
                (this.m_range = new Range());
        }
        getRootNode(e) {
            const t = e.document.querySelector("div.book-portal");
            if (t) return t;
            const n = e.document.querySelector("div.book-bounds");
            if (n) return n;
            return (
                e.document.querySelector("div.book-surface") ||
                (e.document.documentElement
                    ? e.document.documentElement
                    : super.getRootNode(e))
            );
        }
        acceptNodeForMapping(e, t, n) {
            if (e.nodeType === Node.ELEMENT_NODE) {
                const o = e;
                return "IFRAME" === (o.tagName || "").toUpperCase()
                    ? o.contentDocument && 0 === R.framePositionInViewport(o)
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT
                    : 0 === this.nodePositionInViewport(o, !1)
                      ? super.acceptNodeForMapping(e, t, n)
                      : NodeFilter.FILTER_REJECT;
            }
            return this.getFrameForNode(e)
                ? 0 !== this.nodePositionInViewport(e, !1)
                    ? NodeFilter.FILTER_REJECT
                    : super.acceptNodeForMapping(e, t, n)
                : NodeFilter.FILTER_REJECT;
        }
        createSelectionHandler() {
            return new C(this);
        }
        createTreeWalker(e, t, n, o) {
            return new p(e, t, n, o);
        }
        createTextReader() {
            return new M();
        }
        getTextContentForNode(e, t = !0) {
            const n = super.getTextContentForNode(e, t);
            return n ? n.replace(/\u200B/g, "") : "";
        }
        getValueForNode(e, t = !0) {
            const n = super.getValueForNode(e, t);
            return n ? n.replace(/\u200B/g, "") : "";
        }
        getFirstVisibleIFrame() {
            const e = R.getIFrames(document),
                t = e.length;
            for (let n = 0; n < t; n += 1) {
                const t = e[n],
                    o = R.framePositionInViewport(t);
                if (0 === o) return t;
                if (1 === o) break;
            }
            return null;
        }
        getFrameForNode(e) {
            return e
                ? e.parentElement.ownerDocument.defaultView.frameElement
                : null;
        }
        nodePositionInViewport(e, t) {
            const n = this.getBoundingClientRectForNode(e);
            return R.nodeRectPositionInViewport(e, n, t);
        }
        getBoundingClientRectForNode(e) {
            return e.getBoundingClientRect
                ? e.getBoundingClientRect()
                : (this.m_range.selectNodeContents(e),
                  this.m_range.getBoundingClientRect());
        }
    }
    class w extends u {
        constructor() {
            super({
                type: "pwa.document",
                markNodeValueSeparatorAsEmbedded: !1,
                isEditor: !0,
            });
        }
        getRootNode(e) {
            let t = e.document;
            if (!t.querySelector(".PSPDFKit-Root")) {
                const n = t.querySelector(
                        ".dji-app > dji-tab-view dji-tab-page[dji-selected]",
                    ),
                    o = n ? n.querySelector("iframe[title='PSPDFKit']") : null;
                if (!o) return super.getRootNode(e);
                t = o.contentDocument;
            }
            return t.body;
        }
        acceptNodeForMapping(e, t, n) {
            if ("SECTION" === (e.tagName && e.tagName.toUpperCase())) {
                const t = 0,
                    n = e.ownerDocument.body.getBoundingClientRect(),
                    o = e.getBoundingClientRect();
                return (o.top >= n.top + t && o.top <= n.height) ||
                    (o.bottom <= n.bottom && o.bottom >= t) ||
                    (o.top <= n.top && o.bottom >= n.bottom)
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
            }
            return super.acceptNodeForMapping(e, t, n);
        }
        getValueSeparatorForNode(e) {
            return " ";
        }
    }
    class O {
        doCreateDelegate(e = null) {
            return t.Utils.isSruPopupElement(e) ||
                t.Utils.isSruMainContainerFrame(e) ||
                t.Utils.isSruOverlaySelectionElement(e)
                ? new u()
                : t.Utils.isBookshareReader()
                  ? new g()
                  : t.Utils.isOverDriveReader()
                    ? new D()
                    : t.Utils.isAmazonKindle()
                      ? new N()
                      : !t.Utils.isSruPwaApp() ||
                          (e &&
                              ("true" === e.getAttribute("contenteditable") ||
                                  t.Utils.isSruMainContainerFrame(e) ||
                                  t.Utils.isSruPopupElement(e)))
                        ? new u()
                        : new w();
        }
        static createTextMapperDelegate(e = null) {
            const t = globalThis.__dji.TMDF.instances.length;
            for (let n = 0; n < t; n += 1) {
                const t =
                    globalThis.__dji.TMDF.instances[n].doCreateDelegate(e);
                if (t) return t;
            }
            return new u();
        }
        static registerFactory(e) {
            globalThis.__dji.TMDF.instances.unshift(e);
        }
    }
    (globalThis.__dji = globalThis.__dji || {}),
        (globalThis.__dji.TMDF = globalThis.__dji.TMDF || {}),
        (globalThis.__dji.TMDF.instances = []);
    class P extends d {
        constructor(e = !1) {
            super(c.NODE, !1),
                (this.m_node = null),
                (this.m_clientX = -1),
                (this.m_clientY = -1),
                (this.m_offset = -1),
                (this.m_positionReached = !1),
                (this.m_nodeReached = !1),
                (this.m_isEndStrategy = e);
        }
        get positionReached() {
            return this.m_positionReached;
        }
        get node() {
            return this.m_node;
        }
        get clientX() {
            return this.m_clientX;
        }
        get clientY() {
            return this.m_clientY;
        }
        setNodeAndCoordinates(e, t, n, o, i) {
            (this.m_node = e),
                (this.m_clientX = t),
                (this.m_clientY = n),
                (this.m_offset = -1),
                (super.m_stopAtWordBoundary = o),
                (super.m_isBackward = i),
                this.getCaretPosition(null);
        }
        setNodeAndOffset(e, t, n = !1, o = !1) {
            (this.m_node = e),
                (this.m_offset = t),
                (this.m_clientX = -1),
                (this.m_clientY = -1),
                (this.m_stopAtWordBoundary = n),
                (super.m_isBackward = o);
        }
        getCaretPosition(e) {
            if (e) {
                const t = this.getDocument();
                t &&
                    t.documentElement &&
                    Object.assign(e, {element: t.documentElement, document: t});
            }
            if (!this.m_mappingDelegate) return super.getCaretPosition(e);
            if (this.m_offset >= 0)
                return {anchorNode: this.m_node, anchorOffset: this.m_offset};
            if (
                (this.m_node &&
                    ("IMG" === this.m_node.tagName ||
                        t.Utils.isEquatioImg(this.m_node))) ||
                (this.m_node.getAttribute("id") || "").startsWith(
                    "MathJax-Element",
                )
            )
                return (
                    (this.m_offset = 0),
                    {anchorNode: this.m_node, anchorOffset: 0}
                );
            const n =
                this.m_mappingDelegate.caretPositioner.getCaretPositionFromPoint(
                    this.m_clientX,
                    this.m_clientY,
                    this.m_node.ownerDocument,
                );
            return (
                n &&
                    n.offsetNode &&
                    ((n.anchorNode = n.offsetNode),
                    (n.anchorOffset = n.offset),
                    (this.m_node = n.offsetNode),
                    (this.m_offset = n.offset)),
                n
            );
        }
        getDocument() {
            let {parentNode: e} = this.m_node;
            for (; e; ) {
                if (e.nodeType === Node.DOCUMENT_FRAGMENT_NODE) return e;
                if (e.nodeType === Node.DOCUMENT_TYPE_NODE) break;
                e = e.parentNode;
            }
            return this.m_node.ownerDocument;
        }
        onInitialize(e, n, o, i) {
            if (
                ((this.m_nodeReached = Boolean(
                    this.m_node === e ||
                        (this.m_node.contains && this.m_node.contains(e)),
                )),
                (this.m_positionReached = !1),
                !this.m_nodeReached)
            )
                return;
            const r = this.getCaretPosition(null);
            this.m_stopAtWordBoundary
                ? (this.m_positionReached = Boolean(
                      (!this.m_isBackward &&
                          !t.Utils.isNullOrUndefined(o) &&
                          t.CharSet.wordSeparator.characterIsMember(o)) ||
                          (!t.Utils.isNullOrUndefined(i) &&
                              this.isSeparator(i)),
                  ))
                : (this.m_positionReached = Boolean(
                      r.anchorOffset >= 0 && r.anchorOffset >= n,
                  ));
        }
        onPreprocess(e, t, n) {
            return (
                (!this.m_stopAtWordBoundary ||
                    this.node === e ||
                    ((this.m_positionReached = this.isSeparator(t)),
                    !this.m_positionReached)) &&
                super.onPreprocess(e, t, n)
            );
        }
        onProcess(e, t, n) {
            return (
                !this.m_positionReached &&
                ((this.m_nodeReached = Boolean(
                    this.m_nodeReached ||
                        this.m_node === e ||
                        (this.m_node.contains && this.m_node.contains(e)),
                )),
                !this.m_nodeReached ||
                    ((this.m_positionReached = this.isSeparator(t)),
                    this.m_positionReached ||
                        this.m_startingNode.parentElement === e.parentElement ||
                        ("SPAN" !== e.parentElement.tagName
                            ? (this.m_positionReached = !0)
                            : e.parentElement.parentElement ===
                                  this.m_startingNode.parentElement
                                      .parentElement ||
                              (this.m_startingNode.nodeType ===
                                  Node.ELEMENT_NODE &&
                                  this.m_startingNode.matches(
                                      "span.Selected",
                                  )) ||
                              (this.m_positionReached = !0)),
                    !this.m_positionReached || this.m_isEndStrategy))
            );
        }
        isSeparator(e) {
            return Boolean(
                t.CharSet.whiteSpace.characterIsMember(e) ||
                    t.CharSet.invisibleWhiteSpace.characterIsMember(e) ||
                    t.CharSet.sentenceSeparator.characterIsMember(e) ||
                    (this.m_stopAtWordBoundary &&
                        t.CharSet.wordSeparator.characterIsMember(e)),
            );
        }
    }
    const A = 0.4;
    class k {
        static normalizeCaretPositionInfo(e) {
            (function (e) {
                e.offsetNode &&
                    ((function (e) {
                        if (e.offsetNode.nodeType !== Node.ELEMENT_NODE) return;
                        const t = {
                            acceptNode(t) {
                                if ("hidden" === t.style.visibility)
                                    return NodeFilter.FILTER_REJECT;
                                if (-1 === t.style.zIndex)
                                    return NodeFilter.FILTER_REJECT;
                                const n = t.getBoundingClientRect();
                                if (
                                    (n.left <= e.bcr.left ||
                                        Math.abs(e.bcr.left - n.left) < 0.65) &&
                                    (n.right >= e.bcr.right ||
                                        Math.abs(e.bcr.right - n.right) < 0.65)
                                ) {
                                    const t = e.bcr.top + e.bcr.height / 2;
                                    return t >= n.top && t <= n.bottom
                                        ? NodeFilter.FILTER_ACCEPT
                                        : NodeFilter.FILTER_SKIP;
                                }
                                return NodeFilter.FILTER_SKIP;
                            },
                        };
                        let n = document.createTreeWalker(
                                e.offsetNode,
                                NodeFilter.SHOW_ELEMENT,
                                t,
                            ),
                            o = n.currentNode;
                        o === e.offsetNode && (o = n.nextNode());
                        let i = e.offsetNode;
                        for (; o; )
                            (i = o),
                                (n = document.createTreeWalker(
                                    o,
                                    NodeFilter.SHOW_ELEMENT,
                                    t,
                                )),
                                (o = n.nextNode());
                        e.offsetNode !== i &&
                            ((e.offsetNode = i), (e.offset = 0));
                    })(e),
                    (function (e) {
                        const t = document.createRange(),
                            n = {acceptNode: () => NodeFilter.FILTER_ACCEPT},
                            o = document.createNodeIterator(
                                e.offsetNode,
                                NodeFilter.SHOW_TEXT,
                                n,
                            );
                        let i = o.nextNode(),
                            r = null,
                            s = Number.MAX_SAFE_INTEGER;
                        const a = e.bcr.top + e.bcr.height / 2;
                        for (; i; ) {
                            t.setStart(i, 0), t.setEnd(i, i.textContent.length);
                            const n = t.getBoundingClientRect(),
                                l = Math.abs(e.bcr.left - n.left);
                            if (
                                a >= n.top &&
                                a <= n.bottom &&
                                Boolean(n.left <= e.bcr.left || l < A)
                            ) {
                                if (
                                    Boolean(
                                        n.right >= e.bcr.right ||
                                            Math.abs(e.bcr.right - n.right) < A,
                                    )
                                )
                                    return void (e.offsetNode = i);
                                i.parentElement === e.offsetNode &&
                                    s > l &&
                                    ((s = l), (r = i));
                            }
                            i = o.nextNode();
                        }
                        r &&
                            ((e.offsetNode = r),
                            (e.offset = r.textContent.length));
                    })(e));
            })(e),
                (function (e) {
                    let n = e.offset;
                    try {
                        const o = document.createRange();
                        o.setStart(e.offsetNode, e.offset),
                            o.setEnd(e.offsetNode, e.offset);
                        const i = e.bcr.right,
                            r = e.bcr.top,
                            s = e.bcr.bottom;
                        let a = o.getBoundingClientRect();
                        if (a.bottom < r || a.top > s) return;
                        let l = Math.min(
                            Math.abs(i - a.right),
                            Math.abs(i - a.right),
                        );
                        if (l > A) {
                            const r = e.offsetNode.nodeValue;
                            if (!r) return;
                            const s = r.length;
                            let c = 0,
                                d = s,
                                h = 0;
                            for (; c < d; ) {
                                if (
                                    ((h = Math.floor((c + d) / 2)),
                                    o.setStart(e.offsetNode, h),
                                    o.setEnd(e.offsetNode, h + 1),
                                    (a = o.getBoundingClientRect()),
                                    (l = Math.min(
                                        Math.abs(i - a.right),
                                        Math.abs(i - a.right),
                                    )),
                                    l <= A)
                                ) {
                                    c = h;
                                    break;
                                }
                                a.right < i ? (c = h + 1) : (d = h);
                            }
                            if (((n = c), c > 0)) {
                                const s = r.length,
                                    h = c;
                                (c = Math.max(0, h - 3)),
                                    (d = Math.min(h + 3, s));
                                let m = Number.MAX_SAFE_INTEGER;
                                for (l = 0; c <= d; c += 1)
                                    (c < s &&
                                        t.CharSet.invisibleWhiteSpace.characterIsMember(
                                            r[c],
                                        )) ||
                                        (o.setStart(e.offsetNode, c),
                                        o.setEnd(e.offsetNode, c),
                                        (a = o.getBoundingClientRect()),
                                        (l = Math.min(
                                            Math.abs(i - a.right),
                                            Math.abs(i - a.right),
                                        )),
                                        l < m && ((n = c), (m = l)));
                            }
                        }
                    } catch (e) {}
                    e.offset = n;
                })(e),
                (e.normalized = !0);
        }
        static caretPositionFromTargetOffset(e, t) {
            const n = {offsetNode: null, offset: 0},
                o = {
                    acceptNode: (e) =>
                        e.nodeType === Node.TEXT_NODE
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT,
                },
                i = e.ownerDocument.createNodeIterator(
                    e,
                    NodeFilter.SHOW_TEXT,
                    o,
                );
            let r = i.nextNode(),
                s = t;
            for (; r; ) {
                if (((s -= r.textContent.length), s <= 0)) {
                    (n.offset = Math.abs(s)), (n.offsetNode = r);
                    break;
                }
                r = i.nextNode();
            }
            return n;
        }
        static targetOffsetFromCaretPosition(e, t, n) {
            let o = 0;
            const i = {
                    acceptNode: (e) =>
                        e.nodeType === Node.TEXT_NODE
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT,
                },
                r = e.ownerDocument.createNodeIterator(
                    e,
                    NodeFilter.SHOW_TEXT,
                    i,
                );
            let s = r.nextNode();
            for (; s; ) {
                if (s === t) {
                    o += n;
                    break;
                }
                (o += s.textContent.length), (s = r.nextNode());
            }
            return o;
        }
        static isElementInViewport(e, t) {
            let n = null;
            if (e.getBoundingClientRect) n = e.getBoundingClientRect();
            else {
                const t = document.createRange();
                t.selectNodeContents(e), (n = t.getBoundingClientRect());
            }
            const o = e.ownerDocument;
            return !!k.isRectInViewport(n, o) && (!t || k.isElementVisible(e));
        }
        static intersectsRect(e, t) {
            return (
                e.left < t.right &&
                t.left < e.right &&
                e.top < t.bottom &&
                t.top < e.bottom
            );
        }
        static isRectInViewport(e, t) {
            const n = t.defaultView,
                o = new DOMRect(
                    0,
                    0,
                    n.innerWidth || t.documentElement.clientWidth,
                    n.innerHeight || t.documentElement.clientHeight,
                );
            if (!k.intersectsRect(o, e)) return !1;
            if (!n.frameElement || !n.frameElement.contentDocument) return !0;
            const i = n.frameElement.getBoundingClientRect();
            return k.isRectInViewport(
                new DOMRect(e.x - i.left, e.y - i.top, e.width, e.height),
                n.frameElement.ownerDocument,
            );
        }
        static isElementVisible(e) {
            const t = e.ownerDocument.defaultView.getComputedStyle(e),
                n = t.getPropertyValue("visibility");
            return (
                !!Boolean("visible" === n || "collapsed" === n) &&
                "0" !== t.getPropertyValue("opacity")
            );
        }
        static nodeIsBeforeOtherNode(e, t) {
            if (e.ownerDocument !== t.ownerDocument) return !1;
            const n = document.createRange();
            n.selectNodeContents(e);
            const o = document.createRange();
            return (
                o.selectNodeContents(t),
                Boolean(-1 === n.compareBoundaryPoints(Range.END_TO_START, o))
            );
        }
        static elementFromPoint(e, t, n, o) {
            return o && o.isOverDriveReader
                ? R.elementFromPoint(e, t, n)
                : e.elementFromPoint(t, n);
        }
    }
    class L {
        onMappingAboutToStart(e) {}
        onAboutToMapNode(e, t, n) {}
        onMapCharacter(e, t, n, o, i, r = !1) {}
        onNodeMapped(e, t) {}
        onMappingAboutToEnd(e) {}
        onNodeSkipped(e, t, n) {}
        onNodeAccepted(e, t) {}
    }
    class H extends L {
        constructor() {
            super(), (this.m_plugins = []);
        }
        addPlugin(e) {
            this.m_plugins.push(e);
        }
        setPlugins(e) {
            this.m_plugins = e;
        }
        onMappingAboutToStart(e) {
            e.text = "";
            const t = this.m_plugins.length;
            for (let n = 0; n < t; n += 1)
                this.m_plugins[n].onMappingAboutToStart(e);
        }
        onAboutToMapNode(e, t, n) {
            const o = this.m_plugins.length;
            for (let i = 0; i < o; i += 1)
                this.m_plugins[i].onAboutToMapNode(e, t, n);
        }
        onMapCharacter(e, t, n, o, i, r = !1) {
            e.text += t;
            const s = this.m_plugins.length;
            for (let a = 0; a < s; a += 1)
                this.m_plugins[a].onMapCharacter(e, t, n, o, i, r);
        }
        onNodeMapped(e, t) {
            const n = this.m_plugins.length;
            for (let o = 0; o < n; o += 1) this.m_plugins[o].onNodeMapped(e, t);
        }
        onNodeSkipped(e, t, n) {
            const o = this.m_plugins.length;
            for (let i = 0; i < o; i += 1)
                this.m_plugins[i].onNodeSkipped(e, t, n);
        }
        onNodeAccepted(e, t) {
            const n = this.m_plugins.length;
            for (let o = 0; o < n; o += 1)
                this.m_plugins[o].onNodeAccepted(e, t);
        }
        onMappingAboutToEnd(e) {
            const t = this.m_plugins.length;
            for (let n = 0; n < t; n += 1)
                this.m_plugins[n].onMappingAboutToEnd(e);
        }
    }
    class B {
        constructor(e) {
            (this.proxiedDelegate = e),
                (this.textContentForNodeCache = new Map()),
                (this.textContentWithSeparatorForNodeCache = new Map()),
                (this.valueForNodeCache = new Map()),
                (this.valueWithSeparatorForNodeCache = new Map());
        }
        get options() {
            return this.proxiedDelegate.options;
        }
        set options(e) {
            this.proxiedDelegate.options = e;
        }
        get type() {
            return this.proxiedDelegate.type;
        }
        get isEditor() {
            return this.proxiedDelegate.isEditor;
        }
        get markNodeValueSeparatorAsEmbedded() {
            return this.proxiedDelegate.markNodeValueSeparatorAsEmbedded;
        }
        get exclusionSelectors() {
            return this.proxiedDelegate.exclusionSelectors;
        }
        get updateInProgress() {
            return this.proxiedDelegate.updateInProgress;
        }
        get updatedAt() {
            return this.proxiedDelegate.updatedAt;
        }
        get caretPositioner() {
            return this.proxiedDelegate.caretPositioner;
        }
        get selectionHandler() {
            return this.proxiedDelegate.selectionHandler;
        }
        get paragraphIterator() {
            return this.proxiedDelegate.paragraphIterator;
        }
        get textHighlighter() {
            return this.proxiedDelegate.textHighlighter;
        }
        get textReader() {
            return this.proxiedDelegate.textReader;
        }
        getRootNode(e) {
            return this.proxiedDelegate.getRootNode(e);
        }
        acceptNodeForMapping(e, t, n) {
            return this.proxiedDelegate.acceptNodeForMapping(e, t, n);
        }
        createCaretPositioner() {
            return this.proxiedDelegate.createCaretPositioner();
        }
        createSelectionHandler() {
            return this.proxiedDelegate.createSelectionHandler();
        }
        createTextHighlighter() {
            return this.proxiedDelegate.createTextHighlighter();
        }
        createTreeWalker(e, t, n, o) {
            return this.proxiedDelegate.createTreeWalker(e, t, n, o);
        }
        createParagraphIterator() {
            return this.proxiedDelegate.createParagraphIterator();
        }
        getTextContentForNode(e, t = !0) {
            const n = t
                ? this.textContentWithSeparatorForNodeCache
                : this.textContentForNodeCache;
            let o = n.get(e);
            return (
                void 0 !== o ||
                    ((o = this.proxiedDelegate.getTextContentForNode(e, t)),
                    n.set(e, o)),
                o
            );
        }
        getValueForNode(e, t = !0) {
            const n = t
                ? this.valueWithSeparatorForNodeCache
                : this.valueForNodeCache;
            let o = n.get(e);
            return (
                void 0 !== o ||
                    ((o = this.proxiedDelegate.getValueForNode(e, t)),
                    n.set(e, o)),
                o
            );
        }
        getValueSeparatorForNode(e) {
            return this.proxiedDelegate.getValueSeparatorForNode(e);
        }
    }
    function U(e, t, n) {
        let o = 0;
        switch (e.origin) {
            case c.DOCUMENT_START:
                o = 0;
                break;
            case c.CARET:
                o = t.selectionStart;
                break;
            case c.DOCUMENT_END:
                o = n.length;
                break;
            case c.SELECTION_START:
                o = t.selectionStart;
                break;
            case c.SELECTION_END:
                o = t.selectionEnd;
        }
        const {increment: i} = e,
            r = n.length,
            s = o < r ? n[o] : void 0,
            a = o - 1,
            l = a >= 0 && a < r ? n[a] : void 0;
        e.initialize(t, o, s, l);
        let d = o;
        for (; !(e.positionReached || ((d += i), d < 0 || d >= r)); )
            e.process(t, n[d], d);
        return e.startingOffset;
    }
    function W(e, t, n, o, i) {
        const r = {node: e, offset: t, skipped: 0};
        if (
            e.nodeType === Node.TEXT_NODE ||
            "INPUT" === e.tagName ||
            "TEXTAREA" === e.tagName
        ) {
            const n = i.getTextContentForNode(e),
                r = t < n.length ? n[t] : void 0,
                s = t - 1,
                a = s >= 0 && s < n.length ? n[s] : void 0;
            o.initialize(e, t, r, a);
        } else o.initialize(e, t);
        if (o.positionReached) return r;
        n.currentNode = e;
        const s = {
                currentNode: e,
                endReached: !1,
                __nextNode: o.isBackward ? n.previousNode : n.nextNode,
                advance: () => {
                    const e = s.currentNode;
                    do {
                        const e = s.__nextNode.call(n);
                        if (!e) {
                            s.endReached = !0;
                            break;
                        }
                        s.currentNode = e;
                    } while (
                        s.currentNode === e ||
                        null === i.getValueForNode(s.currentNode)
                    );
                    return !s.endReached;
                },
            },
            a = Math.abs(o.increment);
        let l = 0;
        if (s.currentNode && null === i.getValueForNode(s.currentNode)) {
            do {
                if (o.isBackward) {
                    const e = i.getTextContentForNode(s.currentNode);
                    e.length > t && o.process(s.currentNode, e[0], 0);
                }
                s.advance();
            } while (
                !s.endReached &&
                s.currentNode &&
                null === i.getValueForNode(s.currentNode)
            );
            if (o.isBackward) {
                const e = s.currentNode
                    ? i.getValueForNode(s.currentNode)
                    : null;
                t = e ? e.length : 0;
            }
        }
        for (; !s.endReached && !o.positionReached; ) {
            const e = i.getValueForNode(s.currentNode),
                n = e.length;
            let c = t;
            for (; !o.positionReached; ) {
                if (((c += o.increment), c < 0 || c >= n)) {
                    s.advance()
                        ? (t =
                              o.isBackward && s.currentNode
                                  ? i.getValueForNode(s.currentNode).length
                                  : -1)
                        : o.isBackward || (t = n);
                    break;
                }
                (l += a),
                    o.process(s.currentNode, e[c], c) &&
                        ((t = o.startingOffset),
                        (r.node = o.startingNode),
                        (r.skipped = l));
            }
        }
        return (r.offset = t), r;
    }
    class V {
        constructor() {
            (this.m_startStrategy = void 0),
                (this.m_endStrategy = void 0),
                (this.m_delegate = void 0),
                (this.m_textAreaDelegate = void 0),
                (this.m_compositePlugin = new H());
        }
        get delegate() {
            return this.m_delegate;
        }
        addPlugin(e) {
            this.m_compositePlugin.addPlugin(e);
        }
        setPlugins(e) {
            this.m_compositePlugin.setPlugins(e);
        }
        getDefaultContextForDelegate(e) {
            return {
                type: e.type,
                isEditor: e.isEditor,
                clearSelectionAtEnd: e.clearSelectionAtEnd,
                text: "",
                version: 2,
                exclusionSelectors: e.exclusionSelectors,
                source: e,
                offset: 0,
                updateInProgress: e.updateInProgress,
                updatedAt: e.updatedAt,
                isLayered: e.isLayered,
                selection: {offset: 0, start: 0, length: 0},
                extended: {selection: {start: 0}},
                temp: {},
            };
        }
        mapDocumentText(e, t, n, o = null) {
            const i = n.element ? n : n.activeElemInfo;
            let r = o || O.createTextMapperDelegate(i?.element);
            const s = e || new d(c.DOCUMENT_START),
                a = t || new d(c.DOCUMENT_END);
            if (r.textReader)
                try {
                    const e = r.textReader.getTextContent(s, a, n);
                    if (e) {
                        const t = this.getDefaultContextForDelegate(r);
                        return (
                            Object.assign(t, e),
                            (t.source = r.textReader),
                            (t.activeElementInfo = i),
                            t
                        );
                    }
                } catch (e) {
                    r = O.createTextMapperDelegate(i?.element);
                }
            this.init(s, a, r);
            const l = this.getDefaultContextForDelegate(r);
            l.activeElementInfo = n.activeElemInfo || n;
            const h = (function (e, t) {
                const n = (function (e, t) {
                        switch (e.m_startStrategy.origin) {
                            case c.CARET:
                            case c.NODE:
                                return e.m_startStrategy.getCaretPosition(t);
                        }
                        return null;
                    })(e, (t = t || {})),
                    o = n ? n.anchorNode : null,
                    i =
                        n && n.anchorNode
                            ? n.anchorNode === n.focusNode
                                ? Math.min(n.anchorOffset, n.focusOffset)
                                : n.anchorOffset
                            : 0,
                    r = {
                        startNode: null,
                        startOffset: -1,
                        endNode: null,
                        endOffset: -1,
                        activeElementInfo: t,
                        caretPosition: n,
                    };
                let s = !1,
                    a = null === o;
                const l = {
                        acceptNode(n) {
                            switch (
                                ((a = Boolean(s || a || n === o)), n.nodeType)
                            ) {
                                case Node.TEXT_NODE: {
                                    if (!a) return NodeFilter.FILTER_REJECT;
                                    const i = e.m_delegate.acceptNodeForMapping(
                                        n,
                                        t,
                                        o,
                                    );
                                    return i === NodeFilter.FILTER_ACCEPT &&
                                        o &&
                                        o !== n &&
                                        !e.m_startStrategy.isBackward &&
                                        !e.m_endStrategy.isBackward &&
                                        k.nodeIsBeforeOtherNode(n, o)
                                        ? NodeFilter.FILTER_REJECT
                                        : i;
                                }
                                case Node.ELEMENT_NODE: {
                                    if (o === n)
                                        return NodeFilter.FILTER_ACCEPT;
                                    const i = e.m_delegate.acceptNodeForMapping(
                                        n,
                                        t,
                                        o,
                                    );
                                    return a && i === NodeFilter.FILTER_SKIP
                                        ? NodeFilter.FILTER_ACCEPT
                                        : i;
                                }
                                default:
                                    return NodeFilter.FILTER_REJECT;
                            }
                        },
                    },
                    d = e.m_delegate.getRootNode(t);
                if (!d) return r;
                const h = e.m_delegate.createTreeWalker(
                    d.ownerDocument,
                    d,
                    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
                    l,
                );
                let m = h.currentNode;
                for (; m; ) {
                    if (
                        null === r.startNode &&
                        ((s = (!o && m.nodeType === Node.TEXT_NODE) || m === o),
                        s)
                    ) {
                        let t = 0;
                        e.m_startStrategy.isFromCaret ||
                        e.m_startStrategy.isFromNode
                            ? (t = i)
                            : e.m_startStrategy.isBackward &&
                              (t = e.m_delegate.getTextContentForNode(
                                  m,
                                  !1,
                              ).length);
                        const n = W(m, t, h, e.m_startStrategy, e.m_delegate);
                        (r.startNode = n.node), (r.startOffset = n.offset);
                    }
                    if (r.startNode) {
                        if (e.m_endStrategy.isFromCaret) {
                            (r.endNode = m), (r.endOffset = i);
                            break;
                        }
                        if (e.m_endStrategy.isFromNode) {
                            const n = e.m_endStrategy.getCaretPosition(t),
                                o = W(
                                    n.anchorNode,
                                    n.anchorOffset,
                                    h,
                                    e.m_endStrategy,
                                    e.m_delegate,
                                );
                            return (
                                (r.endNode = o.node),
                                (r.endOffset = o.offset),
                                r
                            );
                        }
                        if (m.nodeType === Node.TEXT_NODE) {
                            const t = e.m_delegate.getTextContentForNode(
                                m,
                                !1,
                            ).length;
                            t > 0 && ((r.endNode = m), (r.endOffset = t));
                        } else
                            m.firstChild ||
                                ((r.endNode = m), (r.endOffset = 0));
                    }
                    m = h.nextNode();
                }
                if (r.endNode) {
                    let t = h.currentNode;
                    for (; m && r.endNode !== t; )
                        t = e.m_startStrategy.isBackward
                            ? h.nextNode()
                            : h.previousNode();
                    const n = W(
                        r.endNode,
                        r.endOffset,
                        h,
                        e.m_endStrategy,
                        e.m_delegate,
                    );
                    (r.endNode = n.node), (r.endOffset = n.offset);
                }
                return r;
            })(this, n);
            return (
                null === h.startNode ||
                    null === h.endNode ||
                    (this.mapTextBetweenNodes(l, h),
                    (l.extended.selection.start = l.offset)),
                l
            );
        }
        mapDocumentSelection(e, n) {
            let o = n.element ? n : n.activeElemInfo,
                i = e || O.createTextMapperDelegate(o?.element);
            if (i.textReader)
                try {
                    const e = i.textReader.getSelectedContent();
                    if (e) {
                        const t = this.getDefaultContextForDelegate(i);
                        return (
                            Object.assign(t, e),
                            (t.source = i.textReader),
                            (t.activeElementInfo = o),
                            t
                        );
                    }
                } catch (e) {
                    i = O.createTextMapperDelegate(o?.element);
                }
            const r = i.selectionHandler.getSelectionContext(n);
            let s = null;
            if (r)
                (s = this.getDefaultContextForDelegate(i)),
                    Object.assign(s, r),
                    (s.activeElementInfo = o);
            else {
                const e = n.selection
                    ? n.selection
                    : i.selectionHandler.getSelection(o);
                if (!e || null === e.anchorNode || null === e.focusNode)
                    return null;
                if ("Caret" === e.type || "None" === e.type) return null;
                const {
                        anchorNode: r,
                        anchorOffset: a,
                        focusNode: l,
                        focusOffset: c,
                        isEditor: d,
                    } = this.getSelectionNodes(e),
                    h = new P(),
                    m = new P(!0);
                t.Utils.isForwardSelection(e)
                    ? (h.setNodeAndOffset(r, a, !0, !0),
                      m.setNodeAndOffset(l, c, !0, !1))
                    : (h.setNodeAndOffset(l, c, !0, !0),
                      m.setNodeAndOffset(r, a, !0, !1)),
                    (s = this.mapDocumentText(
                        h,
                        m,
                        d ? Object.assign(n, {element: r}) : n,
                        i,
                    )),
                    s && (s.isEditor = s.isEditor || d);
            }
            return (
                s &&
                    (o || (o = n.element ? n : n.activeElemInfo),
                    (s.element = i.getRootNode(o)),
                    (s.custom = s.custom || {}),
                    Object.assign(s.custom, {selectionOffset: 0})),
                s
            );
        }
        getSelectionNodes(e) {
            let t = e.anchorNode,
                n = e.anchorOffset,
                o = e.focusNode,
                i = e.focusOffset,
                r = !1;
            if (
                e.anchorNode === e.focusNode &&
                e.anchorOffset === e.focusOffset
            ) {
                if (e.anchorNode.nodeType === Node.ELEMENT_NODE) {
                    const s = e.anchorNode;
                    if (s.children.length > e.anchorOffset) {
                        const a = s.children[e.anchorOffset];
                        a &&
                            (("INPUT" !== a.tagName &&
                                "TEXTAREA" !== a.tagName) ||
                                ((t = a),
                                (n = a.selectionStart),
                                (o = a),
                                (i = a.selectionEnd),
                                (r = !0)));
                    }
                }
            } else
                e.anchorNode.nodeType === Node.TEXT_NODE &&
                    e.anchorNode.parentElement.closest(
                        "div[contenteditable]",
                    ) &&
                    (r = !0);
            return {
                anchorNode: t,
                anchorOffset: n,
                focusNode: o,
                focusOffset: i,
                isEditor: r,
            };
        }
        mapInputText(e, n, o) {
            this.m_textAreaDelegate ||
                (this.m_textAreaDelegate = new u({type: "input"})),
                this.init(e, n, this.m_textAreaDelegate);
            const {element: i} = o,
                r = t.Utils.htmlToAscii(i.value),
                s = {
                    document: o.document,
                    element: i,
                    type: this.m_delegate.type,
                    text: "",
                    start: U(this.m_startStrategy, i, r),
                    end: U(this.m_endStrategy, i, r),
                    version: 2,
                    source: this.m_delegate,
                    extended: {selection: {start: 0, length: 0}, text: r},
                };
            return (
                (s.text = r.substring(s.start, s.end + 1)),
                (s.extended.selection.start = s.start),
                s
            );
        }
        init(e, t, n) {
            (this.m_delegate = new B(n || new u())),
                (this.m_startStrategy = e),
                (this.m_endStrategy = t),
                (this.m_startStrategy.mappingDelegate = this.m_delegate),
                (this.m_endStrategy.mappingDelegate = this.m_delegate);
        }
        mapTextBetweenNodes(e, n) {
            this.m_compositePlugin.onMappingAboutToStart(e);
            let o = Boolean(void 0 === n.startNode || null == n.startNode);
            const i = this,
                r = {
                    acceptNode(t) {
                        o = Boolean(
                            o || t === n.startNode || n.startNode.contains(t),
                        );
                        let r = NodeFilter.FILTER_REJECT;
                        switch (t.nodeType) {
                            case Node.TEXT_NODE:
                                r = o
                                    ? i.m_delegate.acceptNodeForMapping(
                                          t,
                                          n.activeElementInfo,
                                          n.startNode,
                                      )
                                    : NodeFilter.FILTER_REJECT;
                                break;
                            case Node.ELEMENT_NODE:
                                r =
                                    t === n.startNode || t === n.endNode
                                        ? "IMG" === t.tagName
                                            ? NodeFilter.FILTER_ACCEPT
                                            : NodeFilter.FILTER_SKIP
                                        : o || "IFRAME" === t.tagName
                                          ? i.m_delegate.acceptNodeForMapping(
                                                t,
                                                n.activeElementInfo,
                                                n.startNode,
                                            )
                                          : NodeFilter.FILTER_SKIP;
                                break;
                            default:
                                return r;
                        }
                        return (
                            r === NodeFilter.FILTER_SKIP
                                ? i.m_compositePlugin.onNodeSkipped(e, t, o)
                                : r === NodeFilter.FILTER_ACCEPT &&
                                  i.m_compositePlugin.onNodeAccepted(e, t),
                            r
                        );
                    },
                };
            let s = (function (e, n) {
                if (null === e && null === n) return null;
                if (null === e) return n.parentElement;
                if (null === n) return e.parentElement;
                if (e === n) return e;
                const o = (e.closest ? e : e.parentElement).closest(
                    "div[dji-sru-rewordify-body]",
                );
                return null !== o ? o : t.Utils.computeCommonAncestor(e, n);
            })(n.startNode, n.endNode);
            s || (s = this.m_delegate.getRootNode(e.activeElementInfo));
            const a = this.m_delegate.createTreeWalker(
                    s.ownerDocument,
                    s,
                    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
                    r,
                ),
                l =
                    n.endNode.nodeType === Node.TEXT_NODE
                        ? Math.min(n.endOffset, n.endNode.textContent.length)
                        : n.endOffset;
            let {currentNode: c} = a;
            for (e.caretPosition = n.caretPosition; c; ) {
                if (
                    c.nodeType !== Node.TEXT_NODE &&
                    "TEXTAREA" !== c.tagName &&
                    "INPUT" !== c.tagName &&
                    "IMG" !== c.tagName
                ) {
                    c = a.nextNode();
                    continue;
                }
                let o = "",
                    i = 0;
                const r = this.m_delegate.getTextContentForNode(c, !1);
                if (c === n.startNode)
                    (i = n.startOffset),
                        (o = r.substring(
                            n.startOffset,
                            n.startNode === n.endNode ? l : r.length,
                        ));
                else if (c === n.endNode) o = r.substring(0, l);
                else {
                    let e = n.endNode.compareDocumentPosition(c);
                    if (e === Node.DOCUMENT_POSITION_FOLLOWING) {
                        c = a.nextNode();
                        continue;
                    }
                    if (
                        ((e = n.startNode.compareDocumentPosition(c)),
                        e === Node.DOCUMENT_POSITION_PRECEDING)
                    ) {
                        c = a.nextNode();
                        continue;
                    }
                    o = r;
                }
                if (
                    (this.m_compositePlugin.onAboutToMapNode(e, c, i),
                    e.text.length > 0 || o.trim().length > 0)
                ) {
                    const n = o.length;
                    if (n > 0) {
                        const r = this.m_delegate.getValueSeparatorForNode(c);
                        o = o.concat(r);
                        const s = n + r.length;
                        let a = 0;
                        for (let r = 0; r < s; r += 1) {
                            let s = t.Utils.normalizedChar(o[r]);
                            if (0 === s.length) {
                                a += 1;
                                continue;
                            }
                            s = e.isTranslatedSection
                                ? s
                                : t.Utils.htmlToAscii(s);
                            const l = r + i;
                            this.m_compositePlugin.onMapCharacter(
                                e,
                                s,
                                l,
                                l + a,
                                c,
                                Boolean(
                                    r >= n &&
                                        this.m_delegate
                                            .markNodeValueSeparatorAsEmbedded,
                                ),
                            );
                        }
                    }
                }
                if (
                    (this.m_compositePlugin.onNodeMapped(e, c), c === n.endNode)
                )
                    break;
                c = a.nextNode();
            }
            this.m_compositePlugin.onMappingAboutToEnd(e),
                delete e.caretPosition;
        }
    }
    class j extends L {
        constructor() {
            super(),
                (this.m_sections = null),
                (this.m_lettersRegExp = new RegExp("[a-z\u0100-\uffff]", "iu"));
        }
        onMappingAboutToStart(e) {
            (e.translations = []),
                (e.isTranslatedSection = !1),
                (e.lastMathJaxNodeId = ""),
                (this.m_sections = [{start: 0, end: -1, translated: !1}]);
        }
        onNodeAccepted(e, t) {
            let n = e.isTranslatedSection;
            if (t.nodeType === Node.TEXT_NODE)
                n = Boolean(
                    t.parentNode.classList.contains(
                        "dji-sru-rewordify-translated",
                    ) &&
                        !t.parentNode.classList.contains(
                            "dji-sru-rewordify-translated-original",
                        ),
                );
            else if (j.isImageElement(t)) {
                const n = this.getTextContentForImage(t);
                if (n) {
                    const {math: o, mathFormat: i, altText: r} = n;
                    r &&
                        r.length > 0 &&
                        this.pushImageData(e, t, i, o || r, !o);
                }
            }
            n !== e.isTranslatedSection &&
                (this.m_sections[this.m_sections.length - 1].translated !== n &&
                    this.m_sections.push({
                        start: e.text.length,
                        end: -1,
                        translated: n,
                    }),
                (e.isTranslatedSection = n));
        }
        onNodeSkipped(e, n, o) {
            if (!o) return;
            const i =
                n.nodeType === Node.TEXT_NODE ? "" : n.getAttribute("id") || "";
            let r,
                s = n,
                a = "mathml";
            if (t.Utils.hasMathMLData(n)) r = n.dataset.mathml;
            else if (t.Utils.isEquatioImg(n))
                (r = t.Utils.latexFromEquatioUri(n.src)), (a = "latex");
            else if (i.startsWith("MathJax-Element-")) {
                const t = n.querySelector(".math");
                if (!t) return;
                if (((r = t.innerText), e.lastMathJaxNodeId === i)) return;
                e.lastMathJaxNodeId = i;
            } else if (t.Utils.isMathMLEquatioDescription(n))
                (r = n.textContent), (s = n.closest("svg") || n);
            else if (t.Utils.isMathMLElement(n)) {
                r = n.outerHTML;
                const e = n.closest("mjx-container");
                e &&
                    (s =
                        e.querySelector("svg") ||
                        e.querySelector("mjx-math") ||
                        n);
            }
            void 0 !== r && this.pushImageData(e, s, a, r, !1);
        }
        onMappingAboutToEnd(e) {
            delete e.isTranslatedSection,
                delete e.lastMathJaxNodeId,
                0 !== this.m_sections.length
                    ? (this.compactSections(e),
                      this.addSectionsToMappingContext(e))
                    : delete e.translations;
        }
        pushImageData(e, t, n, o, i) {
            this.m_sections.push({
                start: e.text.length,
                end: -1,
                translated: i,
                isMath: !0,
                mathFormat: n,
                text: o,
            }),
                e.custom.map.push({
                    element: t,
                    offset: 0,
                    text: "\xa0",
                    isMath: !0,
                    embedded: !0,
                }),
                this.m_sections.push({
                    start: e.text.length,
                    end: -1,
                    isMath: !1,
                    translated: e.isTranslatedSection,
                });
        }
        compactSections(e) {
            for (let t = 1; t < this.m_sections.length; t += 1) {
                const n = this.m_sections[t - 1],
                    o = this.m_sections[t];
                if (n.isMath || o.isMath) continue;
                if (n.translated === o.translated) {
                    this.m_sections.splice(t, 1), (t -= 1);
                    continue;
                }
                if (n.start === o.start) {
                    this.m_sections.splice(t - 1, 1), (t -= 1);
                    continue;
                }
                const i = e.text.substring(n.start, o.start);
                this.m_lettersRegExp.test(i)
                    ? (n.end = o.start - 1)
                    : ((o.start = n.start),
                      this.m_sections.splice(t - 1, 1),
                      (t -= 1));
            }
            for (let e = 1; e < this.m_sections.length; e += 1) {
                const t = this.m_sections[e - 1],
                    n = this.m_sections[e];
                t.isMath ||
                    n.isMath ||
                    (t.translated === n.translated &&
                        (this.m_sections.splice(e, 1), (e -= 1)));
            }
        }
        addSectionsToMappingContext(e) {
            if (this.m_sections.length > 1 || this.m_sections[0].translated) {
                for (let e = 1; e < this.m_sections.length; e += 1) {
                    const t = this.m_sections[e - 1],
                        n = this.m_sections[e];
                    t.end = n.start - 1;
                }
                this.m_sections[this.m_sections.length - 1].end = e.text.length;
                let t = !1;
                for (let n = 0; n < this.m_sections.length; n += 1) {
                    const o = this.m_sections[n];
                    o.isMath
                        ? (t = !0)
                        : (o.text = e.text.substring(o.start, o.end + 1));
                }
                (e.translations = this.m_sections), (e.withMath = t);
            }
        }
        getTextContentForImage(e) {
            try {
                const t = "" !== e.alt ? e.alt : e.title;
                if ("" === t) return null;
                const n = new DOMParser().parseFromString(t, "text/html");
                let o = "";
                return (
                    n.body.firstChild &&
                        n.body.firstChild.textContent &&
                        "" !== n.body.firstChild.textContent &&
                        (o = n.body.firstChild.textContent),
                    n.body.querySelector("math")
                        ? {
                              math: t.substring(t.indexOf("<math")),
                              mathFormat: "mathml",
                              altText: o,
                          }
                        : {math: null, altText: o}
                );
            } catch (e) {
                return null;
            }
        }
        static isImageElement(e) {
            return e && e.nodeType === Node.ELEMENT_NODE && "IMG" === e.tagName;
        }
    }
    class q extends L {
        onMappingAboutToStart(e) {
            (e.tags = {prevNode: null}), (e.custom = e.custom || {map: []});
        }
        onNodeSkipped(e, t, n) {
            0 !== e.custom.map.length && n && this.processNodeForTagging(e, t);
        }
        onNodeAccepted(e, t) {
            0 !== e.custom.map.length && this.processNodeForTagging(e, t);
        }
        onMappingAboutToEnd(e) {
            delete e.tags;
        }
        processNodeForTagging(e, t) {
            const n = t.tagName ? t : t.parentElement;
            if (null === e.tags.prevNode || e.tags.prevNode !== n) {
                e.tags.prevNode = n;
                const t = this.embedForNode(e, n);
                if (null === t) return;
                (e.text += t),
                    e.custom.map.push({
                        element: e.tags.prevNode,
                        offset: 0,
                        text: t,
                        embedded: !0,
                    });
            }
        }
        embedForNode(e, n) {
            const {tagName: o} = n,
                i = e.source.paragraphIterator;
            if (
                Boolean(
                    "SECTION" === o ||
                        "P" === o ||
                        "LI" === o ||
                        "TD" === o ||
                        "SCRIPT" === o ||
                        "ARTICLE" === o ||
                        (i && i.nodeIsParagraph(n)),
                )
            ) {
                let t = e.custom.map.length - 1;
                for (; t >= 0 && e.custom.map[t].embedded; ) t -= 1;
                const o = t >= 0 ? e.custom.map[t].element : null;
                return !o || n.contains(o) ? null : "\n";
            }
            return n.classList.contains("dji-sru-ocr-para")
                ? null
                : "DIV" === o
                  ? t.Utils.isSruPwaApp()
                      ? "\n"
                      : " "
                  : null;
        }
    }
    class z extends L {
        onMappingAboutToStart(e) {
            (e.custom = e.custom || {}),
                Object.assign(e.custom, {map: [], embeddedLocations: {}});
        }
        onMapCharacter(e, t, n, o, i, r = !1) {
            e.custom.map.push({offset: n, element: i, text: t, embedded: r}),
                r && (e.custom.embeddedLocations[e.custom.map.length] = t);
        }
    }
    class G extends L {
        constructor() {
            super(),
                (this.m_previousNode = null),
                (this.m_targetOffset = 0),
                (this.m_target = null);
        }
        onMappingAboutToStart(e) {
            (e.custom = e.custom || {}),
                (e.custom.paraMapping = {paragraphs: [], offsets: []}),
                (this.m_previousNode = null),
                (this.m_targetOffset = 0),
                (this.m_target = null);
        }
        onMapCharacter(e, t, n, o, i) {
            if (this.m_previousNode !== i)
                this.computeOffsetFromParagraph(e, i, o) &&
                    (this.m_previousNode = i);
            else {
                this.m_targetOffset += 1;
                const t = this.m_targetOffset;
                e.custom.paraMapping.offsets.push({
                    paraIndex: e.custom.paraMapping.paragraphs.length - 1,
                    offset: t,
                });
            }
        }
        computeOffsetFromParagraph(e, t, n) {
            const o = e.source.paragraphIterator.getParagraphForNode(t);
            if (!o) return !1;
            if (
                (this.m_target !== o &&
                    ((this.m_target = o),
                    (this.m_targetOffset = -1),
                    e.custom.paraMapping.paragraphs.push(o)),
                this.m_targetOffset >= 0)
            )
                this.m_targetOffset += 1;
            else {
                const i = {
                        acceptNode: (e) =>
                            null !== e.nodeValue
                                ? NodeFilter.FILTER_ACCEPT
                                : NodeFilter.FILTER_REJECT,
                    },
                    r = t.ownerDocument.createNodeIterator(
                        o,
                        NodeFilter.SHOW_TEXT,
                        i,
                    );
                let s = null;
                for (this.m_targetOffset = 0, s = r.nextNode(); s; ) {
                    if (this.m_targetOffset > 0) {
                        const t = e.source.getValueSeparatorForNode(s).length;
                        this.m_targetOffset += t;
                    }
                    if (s === t) {
                        this.m_targetOffset += n;
                        break;
                    }
                    (this.m_targetOffset += s.nodeValue.length),
                        (s = r.nextNode());
                }
            }
            return (
                e.custom.paraMapping.offsets.push({
                    paraIndex: e.custom.paraMapping.paragraphs.length - 1,
                    offset: this.m_targetOffset,
                }),
                !0
            );
        }
    }
    class X {
        constructor() {
            (this.m_translationPlugin = new j()),
                (this.m_tagEmbeddingPlugin = new q()),
                (this.m_nodeMappingPlugin = new z()),
                (this.m_allPlugins = [
                    this.m_translationPlugin,
                    this.m_tagEmbeddingPlugin,
                    this.m_nodeMappingPlugin,
                ]),
                (this.m_textMapper = new V()),
                (this.m_nodeMappingStartStrategy = new P()),
                (this.m_textMappingStartStrategy = new d(c.DOCUMENT_START)),
                (this.m_nodeMappingEndStrategy = new P(!0)),
                (this.m_textMappingEndStrategy = new d(c.DOCUMENT_END));
        }
        getContextWithParams(e) {
            e.textMapperDelegate ||
                (e.textMapperDelegate = O.createTextMapperDelegate(
                    e?.activeElemInfo?.element,
                ));
            const t = Boolean(e && e.entireDocument),
                n = Boolean(e && e.fromCaretToEnd);
            let o = null,
                i = !(t || n);
            i ||
                "speech" !== e.requestFor ||
                ((o = e.textMapperDelegate.selectionHandler.getSelection(
                    e.activeElemInfo,
                )),
                (i = Boolean(
                    !(
                        null === o ||
                        null === o.anchorNode ||
                        null === o.focusNode ||
                        (o.anchorNode === o.focusNode &&
                            o.anchorOffset === o.focusOffset)
                    ),
                )));
            const r = Boolean(!i && e && e.event && "click" === e.event.type);
            let s = null;
            return (
                (s = i
                    ? this.mapDocumentSelection({
                          activeElemInfo: e.activeElemInfo,
                          textMapperDelegate: e.textMapperDelegate,
                          selection: o,
                          requestFor: e.requestFor,
                      })
                    : r
                      ? this.getContextFromStartingElement(
                            {
                                activeElemInfo: e.activeElemInfo,
                                textMapperDelegate: e.textMapperDelegate,
                                requestFor: e.requestFor,
                            },
                            e.event.target,
                            e.event.clientX,
                            e.event.clientY,
                        )
                      : this.getContext({
                            activeElemInfo: e.activeElemInfo,
                            document: document,
                            textMapperDelegate: e.textMapperDelegate,
                            requestFor: e.requestFor,
                        })),
                s
            );
        }
        getContextFromStartingElement(e, t, n, o) {
            const i = (t && t.closest("[id^=MathJax-Element]")) || t,
                r = this.getDelegate(e);
            return (
                this.m_nodeMappingStartStrategy.setNodeAndCoordinates(
                    i,
                    n,
                    o,
                    !0,
                    !0,
                ),
                this.mapDocumentText(
                    this.m_nodeMappingStartStrategy,
                    this.m_textMappingEndStrategy,
                    r,
                    e,
                )
            );
        }
        getContext(e) {
            const t = this.getDelegate(e),
                n = this.mapDocumentText(
                    this.m_textMappingStartStrategy,
                    this.m_textMappingEndStrategy,
                    t,
                    e,
                );
            return (
                n &&
                    ((n.element = t.getRootNode(e)),
                    (n.custom = n.custom || {}),
                    Object.assign(n.custom, {selectionOffset: 0})),
                n
            );
        }
        mapDocumentSelection(e) {
            const t = this.getDelegate(e),
                n = this.getPluginsForMapping(t, e);
            this.m_textMapper.setPlugins(n);
            const o = this.m_textMapper.mapDocumentSelection(t, e);
            return (
                o &&
                    ((o.element = t.getRootNode(e)),
                    (o.custom = o.custom || {})),
                o
            );
        }
        mapDocumentText(e, t, n, o) {
            const i = this.getPluginsForMapping(n, o);
            return (
                this.m_textMapper.setPlugins(i),
                this.m_textMapper.mapDocumentText(
                    e,
                    t,
                    {...o.activeElemInfo, requestFor: o.requestFor},
                    n,
                )
            );
        }
        getPluginsForMapping(e, t) {
            let n = [];
            const o = "rewordify" === t.requestFor;
            if (
                ((n =
                    "speech" === t.requestFor || (o && e.isEditor)
                        ? [...this.m_allPlugins]
                        : [this.m_translationPlugin, this.m_nodeMappingPlugin]),
                "ms-office-word" === e.type && (n.push(new G()), !o))
            ) {
                const e = n.indexOf(this.m_tagEmbeddingPlugin);
                e >= 0 && n.splice(e, 1);
            }
            return n;
        }
        getDelegate(e) {
            return e.textMapperDelegate
                ? e.textMapperDelegate
                : O.createTextMapperDelegate(e.element);
        }
        getRectsByRange(e, t, n) {
            return e && e.source && e.source.selectionHandler
                ? e.source.selectionHandler.getRectsByRange(e, t, n)
                : null;
        }
    }
    class J {
        constructor() {
            (this.m_installed = !1),
                (this.m_selectionEnabled = !1),
                (this.m_selectionHelper = new b()),
                (this.m_textMapperDelegate = new g());
        }
        isInstalled() {
            return this.m_installed;
        }
        addSelectionEventListener(e, t) {
            this.m_selectionHelper.addEventListener(e, t);
        }
        install() {
            document.documentElement.setAttribute(
                "dji-sru-fullscreen-popup",
                "",
            ),
                (this.m_installed = !0);
        }
        uninstall() {
            (this.m_installed = !1),
                (this.m_selectionEnabled = !1),
                document.documentElement.removeAttribute(
                    "dji-sru-fullscreen-popup",
                );
        }
        enableSelection(e) {
            if (this.m_selectionEnabled === e) return;
            this.m_selectionEnabled = e;
            const t = this.m_textMapperDelegate.getRootNode().ownerDocument;
            this.m_selectionEnabled
                ? this.m_selectionHelper.install(t)
                : (this.m_selectionHelper.uninstall(t), this.clearSelection());
        }
        clearSelection() {
            this.m_textMapperDelegate
                .getRootNode()
                .ownerDocument.getSelection()
                .empty();
        }
        getActiveElement() {
            return this.m_textMapperDelegate.getRootNode();
        }
    }
    function $(e, n) {
        const o = e || document,
            i = t.Utils.findValidDocumentElements(e, n),
            r = window.dji.gdocsCanvasProjectionTagName || "dji-canvas",
            s = o.querySelector(r);
        return s && s.shadowRoot && i.push(s.shadowRoot), i;
    }
    class K {
        constructor() {
            if (K.instance) return K.instance;
            K.instance = this;
            const e = new X();
            let n = null,
                o = null,
                i = null,
                r = null,
                s = null,
                a = null,
                l = null,
                c = null;
            const d = {text: "#000000", word: "#71FDFE"};
            let h = "dji-sru-highlight-active";
            const m = "dji-sru-css-highlight";
            function u() {
                let e = d.text;
                const n = d.text,
                    o = t.Utils.colorToRgb(d.word.substring(0, 7));
                let i = 0.99;
                t.Utils.isSruPwaApp() && ((e = "#00000000"), (i = 0.4));
                const r = [o.r, o.g, o.b].join(", ");
                let s = `html.${h} *::selection {    background: rgba(${r}, ${i}) !important;    color: ${e} !important;}html.${h} img::selection {    background: rgba(${r}, 0.4) !important;    color: ${e} !important;}html.${h} #dji-sru-ocr-content *::selection {    background: rgba(${r}, 0.4) !important;    color: transparent !important;}html.${h} .dji-sru-math-highlight span.dji-sru-math-overlay {    background: rgba(${r}, 0.4) !important;    color: transparent !important;}html.${h} svg.dji-sru-math-highlight  {    background-color: rgba(${r}, 0.4) !important;}html.${h} mjx-math.dji-sru-math-highlight  {    background-color: rgba(${r}, 0.4) !important;}html.${h} img.dji-sru-math-highlight  {    background-color: rgba(${r}, 0.4) !important;}`;
                return (
                    t.Utils.isSruPwaApp()
                        ? (s += `html.${h} .PSPDFKit-Text-Annotation::selection, html.${h} div[contenteditable]::selection,html.${h} .dji-sru-define-word-content *::selection, html.${h} [dji-sru-rewordify-body] *::selection {    color: ${n} !important;}`)
                        : t.Utils.isGoogleDocs() &&
                          (s += `html.${h} div.kix-paragraphrenderer div.kix-lineview div.kix-lineview-content { user-select: initial !important;}:host-context(html.${h}) span.dji-canvas-word.dji-sru-math-highlight  {    background-color: rgba(${r}, 0.4) !important;}div.dji-canvas-content *::selection { --dji-canvas-selection-color: ${e}; --dji-canvas-selection-background-color: rgba(${r}, ${i}); }`),
                    t.Utils.isGoogleSlides() &&
                        ((s += `html.${h} *::selection {  fill: ${d.text} !important;}`),
                        (s += `html.${h} g text { user-select: initial !important;}`)),
                    s
                );
            }
            (this.addSelectionEventListener = function (e, t) {
                s && s.addSelectionEventListener
                    ? s.addSelectionEventListener(e, t)
                    : (c || (c = new b()), c.addEventListener(e, t));
            }),
                (this.getDocumentHandlerForElement = function (e, c = "") {
                    const d = t.Utils.elementContext(e);
                    if (!d) return null;
                    if (e && !d.isPlainEditor) {
                        if (
                            "rewordify" !== c &&
                            (function (e) {
                                return (
                                    "__dji_sru_main_container" === e.id ||
                                    !!(
                                        e.ownerDocument &&
                                        e.ownerDocument.defaultView &&
                                        e.ownerDocument.defaultView
                                            .frameElement &&
                                        "__dji_sru_main_container_iframe" ===
                                            e.ownerDocument.defaultView
                                                .frameElement.id
                                    )
                                );
                            })(e)
                        )
                            return o;
                        if (t.Utils.isSruPopupElement(e)) return o;
                        if (t.Utils.isSruOverlaySelectionElement(e)) return o;
                    }
                    return d.isOverDriveReader
                        ? s
                        : d.isBookshareReader
                          ? a
                          : d.isAmazonKindle
                            ? r
                            : d.isPlainEditor
                              ? n
                              : d.isMsOfficeWord
                                ? l
                                : d.isContentEditable
                                  ? o
                                  : d.isGoogleDocsEditor
                                    ? i
                                    : o;
                }),
                (this.getSelection = function (e = null) {
                    e = e || t.Utils.activeElementInfo();
                    const n = this.getDocumentHandlerForElement(e.element);
                    return n && n.getSelection
                        ? n.getSelection(e)
                        : (t.Logger.warning(
                              "Invalid doc handler or unsupported operation getSelection!",
                          ),
                          null);
                }),
                (this.extendCurrentSelection = function (e, n, o) {
                    const i = t.Utils.activeElementInfo(),
                        r = this.getDocumentHandlerForElement(i.element);
                    return r && r.extendCurrentSelection
                        ? r.extendCurrentSelection(i, e, n, o)
                        : null;
                }),
                (this.getSelectionRects = function (e, n) {
                    const o = n || t.Utils.activeElementInfo(),
                        i = o.document.getSelection();
                    if (o.isSruOutlines || !i || 0 === i.rangeCount)
                        return null;
                    const r = i.getRangeAt(0);
                    let s = r.getClientRects();
                    const a = r.getBoundingClientRect();
                    return (
                        a.bottom === s[0].bottom && (s = [a]), e && i.empty(), s
                    );
                }),
                (this.enableHighlight = function (e, n) {
                    const o = $(null, !0),
                        i = e ? u() : "";
                    for (let n = 0; n < o.length; n += 1) {
                        const r = o[n];
                        let s = r.getElementById(m);
                        if (s) {
                            (r.head || r.querySelector("head")).removeChild(s);
                            const e = r.querySelector(
                                '[class~="dji-sru-math-highlight"]',
                            );
                            e && e.classList.remove("dji-sru-math-highlight");
                        }
                        if (e) {
                            let e = r.head || r.querySelector("head");
                            e ||
                                ((e = document.createElement("head")),
                                r.appendChild(e)),
                                (s = document.createElement("style")),
                                (s.id = m),
                                (s.innerText = i),
                                e.appendChild(s),
                                t.Utils.addClassToElement(r.documentElement, h);
                        } else
                            t.Utils.removeClassFromElement(
                                r.documentElement,
                                h,
                            );
                    }
                    n &&
                        n.source &&
                        n.source.textHighlighter &&
                        (e
                            ? n.source.textHighlighter.enableHighlight(
                                  n,
                                  null,
                                  null,
                              )
                            : n.source.textHighlighter.disableHighlight(
                                  n,
                                  null,
                                  null,
                              ));
                }),
                (this.enableOverlays = function (e) {
                    const n = t.Utils.activeElementInfo(!0);
                    n &&
                        (n.isOverDriveReader || t.Utils.isOverDriveReader()) &&
                        s.enableOverlays(e);
                }),
                (this.enableSelection = function (e) {
                    const n = t.Utils.activeElementInfo(!0);
                    n &&
                        (n.isAmazonKindle
                            ? r.enableSelection(e)
                            : n.isOverDriveReader || t.Utils.isOverDriveReader()
                              ? s.enableSelection(e)
                              : n.isBookshareReader ||
                                  t.Utils.isBookshareReader()
                                ? a.enableSelection(e)
                                : (c || (c = new b()),
                                  e
                                      ? c.install(document)
                                      : c.uninstall(document)));
                }),
                (this.setOptions = function (e) {
                    e.id &&
                        "string" == typeof e.id &&
                        e.id.length > 0 &&
                        (h = `dji-${e.id}-highlight-active`),
                        this.setColors(
                            e.highlightTextColor,
                            e.highlightBackgroundColor,
                        );
                }),
                (this.setColors = function (e, n) {
                    e && (e = t.Utils.colorToHex(e)) && (d.text = e),
                        n && (n = t.Utils.colorToHex(n)) && (d.word = n);
                    const o = u(),
                        i = $();
                    for (let e = 0; e < i.length; e += 1) {
                        const t = i[e];
                        let n = t.getElementById(m);
                        if (n) {
                            const e = t.head || t.querySelector("head");
                            e.removeChild(n),
                                (n = document.createElement("style")),
                                (n.id = m),
                                (n.innerText = o),
                                e.appendChild(n);
                        }
                    }
                }),
                (this.getColors = function () {
                    return d;
                }),
                (this.mapSelection = function (e) {
                    const i = t.Utils.activeElementInfo(
                        !0,
                        e.event
                            ? {
                                  location: {
                                      x: e.event.clientX,
                                      y: e.event.clientY,
                                  },
                                  element: e.event.target,
                              }
                            : null,
                    );
                    if (!i) return null;
                    let r = null;
                    const {element: s} = i;
                    e.event &&
                        e.event.target &&
                        (r = this.getDocumentHandlerForElement(
                            e.event.target,
                            e.requestFor,
                        )),
                        r ||
                            (r = this.getDocumentHandlerForElement(
                                s,
                                e.requestFor,
                            )),
                        ((e = e || {}).entireDocument = Boolean(
                            e.entireDocument,
                        )),
                        (e.fromCaretToEnd = Boolean(
                            !e.entireDocument && e.fromCaretToEnd,
                        )),
                        (e.clearSelection = Boolean(e.clearSelection)),
                        (e.characterGranularity = Boolean(
                            e.characterGranularity,
                        )),
                        (e.caretOffset = e.caretOffset || 0);
                    const a = {
                        activeElemInfo: i,
                        entireDocument: e.entireDocument,
                        fromCaretToEnd: e.fromCaretToEnd,
                        clearSelection: e.clearSelection,
                        characterGranularity: e.characterGranularity,
                        caretOffset: e.caretOffset,
                        textMapperDelegate:
                            r && r.getTextMapperDelegate
                                ? r.getTextMapperDelegate(s)
                                : null,
                        event: e.event,
                        requestFor: e.requestFor,
                    };
                    return s && void 0 !== s.selectionStart
                        ? n.getContextFromInput(a)
                        : o.getContextFromDocument(a);
                }),
                (this.select = function (e, t, i, r) {
                    return (
                        (t = e.extended.selection.start + t),
                        r &&
                            ((r.word && d.word !== r.word) ||
                                (r.text && r.text !== d.text)) &&
                            this.setColors(r.text || d.text, r.word || d.word),
                        "input" === e.type
                            ? n.selectInInput(e, t, i)
                            : o.selectInDocument(e, t, i)
                    );
                }),
                (this.selectWord = function (e, t, i) {
                    return (
                        i &&
                            ((i.word && d.word !== i.word) ||
                                (i.text && i.text !== d.text)) &&
                            this.setColors(i.text || d.text, i.word || d.word),
                        "input" === e.type
                            ? n.selectWordInInput(e, t)
                            : o.selectWordInDocument(e, t)
                    );
                }),
                (this.mapText = function (e, i) {
                    const r = t.Utils.activeElementInfo(!0);
                    if (!r) return null;
                    const {element: s} = r;
                    return s && void 0 !== s.selectionStart
                        ? n.mapTextInInput(r, e, i)
                        : r.document &&
                            r.document.activeElement &&
                            void 0 !== r.document.activeElement.selectionStart
                          ? ((r.element = r.document.activeElement),
                            n.mapTextInInput(r, e, i))
                          : o.mapTextInDocument(r, e, i);
                }),
                (this.restoreSelection = function (e) {
                    if ("input" !== e.type)
                        if ("ms.office.word" !== e.type)
                            "amazon.kindle" !== e.type
                                ? o.restoreSelectionInDocument(e)
                                : r.restoreSelection(e);
                        else {
                            const n = t.Utils.activeElementInfo();
                            l.restoreSelection(n, e);
                        }
                    else n.restoreSelectionInInput(e);
                }),
                (this.clearSelection = function (e) {
                    e &&
                        ("input" !== e.type
                            ? "ms.office.word" !== e.type
                                ? "amazon.kindle" !== e.type
                                    ? o.clearSelectionInDocument(e)
                                    : r.clearSelection(e)
                                : l.clearSelection(e)
                            : n.clearSelectionInInput(e));
                }),
                (this.insertText = function (e, r, s, a) {
                    const l = t.Utils.elementContext(e);
                    l &&
                        (l.isPlainEditor
                            ? n.insertText(l, r, a)
                            : l.isContentEditable
                              ? o.insertContent(l, r, s, a)
                              : l.isGoogleDocsEditor && i.insertText(l, r, a));
                }),
                (function () {
                    const e = {};
                    let o = null;
                    (e.getContextFromInput = function (n) {
                        const {activeElemInfo: o} = n,
                            i = Boolean(n.entireDocument);
                        let r = Boolean(!i && n.fromCaretToEnd);
                        const s = Boolean(n.clearSelection),
                            a = Boolean(n.characterGranularity),
                            {element: l} = o,
                            c = t.Utils.htmlToAscii(l.value);
                        n.entireDocument &&
                            ((l.selectionStart = 0),
                            (l.selectionEnd = c.length),
                            (r = !1));
                        let d =
                            (r ? c.length : l.selectionEnd) - l.selectionStart;
                        if (d < 0) return null;
                        let {selectionStart: h} = l;
                        if (r)
                            0 !== n.caretOffset &&
                                ((h = Math.max(0, h + n.caretOffset)),
                                (d = l.selectionEnd - h));
                        else {
                            let e = l.selectionStart;
                            if (a) l.setSelectionRange(e, l.selectionEnd);
                            else {
                                for (
                                    ;
                                    e >= 0 &&
                                    !t.CharSet.wordSeparator.characterIsMemberNoHypen(
                                        c.charAt(e),
                                    );
                                    e -= 1
                                );
                                l.setSelectionRange(e + 1, l.selectionEnd);
                            }
                            if (a) l.setSelectionRange(l.selectionStart, e + 1);
                            else {
                                for (
                                    e = l.selectionEnd;
                                    e < c.length &&
                                    !t.CharSet.wordSeparator.characterIsMemberNoHypen(
                                        c[e],
                                    );
                                    e += 1
                                );
                                l.setSelectionRange(l.selectionStart, e);
                            }
                            (d = l.selectionEnd - l.selectionStart),
                                (h = l.selectionStart);
                        }
                        let m = {
                            type: "input",
                            activeElementInfo: o,
                            element: l,
                            isEditor: !0,
                            selection: {start: h, length: d},
                            text: c,
                            custom: {selectionOffset: 0},
                            extended: {
                                text: c,
                                selection: {start: h, length: d},
                            },
                            originalSelection: {start: h, end: l.selectionEnd},
                        };
                        if (m.text.length > 0) {
                            let {start: e} = m.selection;
                            const n = m.selection.start + m.selection.length;
                            if (r && !a) {
                                const n = Math.max(0, m.selection.start - 160);
                                for (; e >= n; e -= 1)
                                    if (
                                        t.CharSet.wordSeparator.characterIsMember(
                                            m.text.charAt(e),
                                        )
                                    ) {
                                        e += 1;
                                        break;
                                    }
                                e = Math.max(0, e);
                            }
                            const o = e - m.selection.start;
                            (m.selection.start += o),
                                (m.selection.length -= o),
                                (m.custom.selectionOffset = e),
                                (m.extended.selection = m.selection),
                                (m.text = e < n ? m.text.slice(e, n) : "");
                        }
                        return (
                            0 === m.text.trim().length && (m = null),
                            s && m && e.clearSelectionInInput(m),
                            m
                        );
                    }),
                        (e.selectInInput = function (e, t, n) {
                            return e.element.setSelectionRange(t, t + n), !0;
                        }),
                        (e.mapTextInInput = function (e, n, i) {
                            return (
                                t.Utils.isNullOrUndefined(o) && (o = new V()),
                                o.mapInputText(n, i, e)
                            );
                        }),
                        (e.selectWordInInput = function (n, o) {
                            let i = n.extended.selection.start + o,
                                r = i,
                                s = 1;
                            const {text: a} = n.extended;
                            let l = null;
                            const c = a.length;
                            for (
                                ;
                                i < c &&
                                ((l = a.charAt(i)),
                                t.CharSet.whiteSpace.characterIsMember(l));
                                i += 1
                            );
                            for (r = i; r < c; r += 1)
                                if (((l = a.charAt(r)), "-" !== l)) {
                                    if ("&" === l && r === i) {
                                        (r += 1), (s = 0);
                                        break;
                                    }
                                    if (
                                        t.CharSet.wordSeparator.characterIsMember(
                                            l,
                                        )
                                    ) {
                                        s = 0;
                                        break;
                                    }
                                }
                            return (
                                r < i
                                    ? (r = i)
                                    : a.length <= r && (r = a.length - 1),
                                e.selectInInput(n, i, r - i + s)
                            );
                        }),
                        (e.restoreSelectionInInput = function (e) {
                            if (e.originalSelection) {
                                const t = e.originalSelection;
                                e.element.setSelectionRange(t.start, t.end);
                            }
                        }),
                        (e.clearSelectionInInput = function (e) {
                            let t;
                            (t =
                                e.hasOwnProperty("selection") &&
                                e.selection.hasOwnProperty("start") &&
                                e.selection.hasOwnProperty("length")
                                    ? e.selection.start + e.selection.length
                                    : e.element.selectionEnd),
                                e.element.setSelectionRange(t, t);
                        }),
                        (e.insertText = function (e, t) {
                            e.document.execCommand("insertText", !1, t);
                        }),
                        (e.getSelection = function (e) {
                            return e.element &&
                                void 0 !== e.element.selectionStart &&
                                void 0 !== e.element.selectionEnd
                                ? {
                                      anchorNode: e.element,
                                      anchorOffset: e.element.selectionStart,
                                      focusNode: e.element,
                                      focusOffset: e.element.selectionEnd,
                                  }
                                : e.document.getSelection();
                        }),
                        (e.extendCurrentSelection = function (e, n, o, i) {
                            const r = e.document.getSelection();
                            return t.Utils.extendSelection(r, n, o, i);
                        }),
                        (e.setBaseAndExtent = function (e, n, o, i, r, s) {
                            const a = e.document.getSelection();
                            if (
                                ("Caret" === a.type || "None" === a.type) &&
                                e.element &&
                                Number.isInteger(e.element.selectionStart)
                            )
                                return !1;
                            try {
                                a.setBaseAndExtent(n, o, i, r);
                            } catch (e) {
                                return t.Logger.error(e), !1;
                            }
                            return !0;
                        }),
                        (n = e);
                })(),
                (function () {
                    const n = {};
                    let i;
                    (n.selectWordInDocument = function (e, o) {
                        const {map: i} = e.custom;
                        if (!i) return !1;
                        let r = (function (e, t) {
                                let n =
                                    (void 0 !== e.selection.offset
                                        ? e.selection.offset
                                        : e.extended.selection.start) + t;
                                return (
                                    e.custom.matrix &&
                                        n < e.custom.matrix.length &&
                                        (n = e.custom.matrix[n].index),
                                    n
                                );
                            })(e, o),
                            s = r,
                            a = null;
                        const l = i.length;
                        if (
                            r < l &&
                            i[r].isMath &&
                            i[r].element.nodeType === Node.ELEMENT_NODE
                        )
                            return n.highlightMathInDocument(e, r), !0;
                        for (
                            ;
                            r < l &&
                            ((a = i[r]),
                            a.ignore ||
                                a.embedded ||
                                t.CharSet.whiteSpace.characterIsMember(a.text));
                            r += 1
                        );
                        for (; r >= 0 && r < l; r -= 1)
                            if (
                                ((a = i[r]),
                                !a.ignore &&
                                    (a.embedded ||
                                        t.CharSet.wordSeparator.characterIsMember(
                                            a.text,
                                        )))
                            ) {
                                r += 1;
                                break;
                            }
                        if (((r = Math.max(r, 0)), l <= r)) return !1;
                        for (s = r; s < l; s += 1) {
                            if (
                                ((a = i[s]),
                                !a.ignore && a.embedded && a.text.length > 0)
                            ) {
                                s -= 1;
                                break;
                            }
                            if ("-" !== a.text) {
                                if ("&" === a.text && s === r) {
                                    s += 1;
                                    break;
                                }
                                if (
                                    t.CharSet.wordSeparator.characterIsMember(
                                        a.text,
                                    )
                                )
                                    break;
                            }
                        }
                        for (
                            ;
                            r <= s && r < l && ((a = i[r]), a.ignore);
                            r += 1
                        );
                        for (; r <= s && s >= 0; s -= 1)
                            try {
                                if (((a = i[s]), !a.ignore)) break;
                            } catch (e) {
                                break;
                            }
                        s < r ? (s = r) : i.length < s && (s = i.length - 1);
                        const c = Math.max(s - r + 1, 1);
                        return n.selectInDocument(e, r, c, s);
                    }),
                        (n.selectInDocument = function (e, o, i, r = -1) {
                            const {map: s} = e.custom;
                            if (!s) return !1;
                            const a = s[o],
                                l = a.element.getRootNode();
                            if (
                                ((c = l) === document ||
                                    (c && "#document" === c.nodeName)) &&
                                e.previousDocument !== l
                            ) {
                                if (e.previousDocument) {
                                    const t = e.previousDocument.getSelection();
                                    t && t.removeAllRanges(),
                                        this.clearMathHighlightingInDocument(
                                            e.previousDocument,
                                        );
                                }
                                e.previousDocument = l;
                            }
                            var c;
                            if (
                                (this.clearMathHighlightingInDocument(l),
                                a.isMath &&
                                    a.element.nodeType === Node.ELEMENT_NODE)
                            )
                                return n.highlightMathInDocument(e, o), !0;
                            const d = l.getSelection ? l.getSelection() : null;
                            if (!d) return !1;
                            try {
                                let n = null;
                                if (
                                    ((n =
                                        "TEXTAREA" === a.element.tagName ||
                                        "IMG" === a.element.tagName ||
                                        a.element.nodeType === Node.TEXT_NODE
                                            ? a.element
                                            : a.element.firstChild),
                                    n)
                                ) {
                                    const e =
                                        n.parentElement.tagName.toUpperCase();
                                    if ("TITLE" === e || "DESC" === e)
                                        return d.empty(), !1;
                                }
                                const o = t.Utils.isSruPwaApp();
                                if ("IMG" === n.tagName) {
                                    const e = l.createRange();
                                    e.selectNode(n),
                                        d.removeAllRanges(),
                                        d.addRange(e);
                                } else if (
                                    (o || "document" === e.type) &&
                                    r >= 0 &&
                                    r < s.length
                                ) {
                                    const e = s[r];
                                    n = e.element;
                                    const t =
                                        o && a.offset > 0
                                            ? a.offset - 1
                                            : a.offset;
                                    if (
                                        "TEXTAREA" === n.tagName &&
                                        "TEXTAREA" === e.element.tagName
                                    )
                                        (n.selectionStart = t),
                                            (e.element.selectionEnd = e.offset);
                                    else {
                                        const o =
                                                e.element.nodeType ===
                                                Node.TEXT_NODE
                                                    ? e.element
                                                    : e.element.firstChild,
                                            i = Math.min(
                                                e.offset + 1,
                                                o.textContent.length,
                                            );
                                        d.setBaseAndExtent(n, t, o, i);
                                    }
                                } else if ("TEXTAREA" === n.tagName)
                                    (n.selectionStart = a.offset),
                                        (n.selectionEnd = a.offset + i);
                                else {
                                    d.collapse(n, a.offset);
                                    for (let e = 0; e < i; e += 1)
                                        d.modify(
                                            "extend",
                                            "forward",
                                            "character",
                                        );
                                }
                            } catch (e) {
                                return t.Logger.error(e), !1;
                            }
                            return !0;
                        }),
                        (n.clearMathHighlightingInDocument = function (e, t) {
                            const n = e.querySelector(
                                '[class~="dji-sru-math-highlight"]',
                            );
                            return (
                                n &&
                                    n !== t &&
                                    n.classList.remove(
                                        "dji-sru-math-highlight",
                                    ),
                                n
                            );
                        }),
                        (n.highlightMathInDocument = function (e, t) {
                            const n =
                                    e.activeElementInfo.document.getSelection(),
                                {map: o} = e.custom,
                                i = o[t];
                            n.collapse(i.element, i.offset),
                                this.clearMathHighlightingInDocument(
                                    i.element.getRootNode(),
                                    i.element,
                                ) !== i.element &&
                                    i.element.classList.add(
                                        "dji-sru-math-highlight",
                                    );
                        }),
                        (n.getContextFromDocument = function (t) {
                            const {activeElemInfo: n} = t;
                            let o = null;
                            if (e && ((o = e.getContextWithParams(t)), o)) {
                                const e = n.document.getSelection();
                                (o.originalSelection = {
                                    type: e.type,
                                    anchorNode: e.anchorNode,
                                    anchorOffset: e.anchorOffset,
                                    focusNode: e.focusNode,
                                    focusOffset: e.focusOffset,
                                }),
                                    t.clearSelection &&
                                        this.clearSelectionInDocument(o);
                            }
                            return o;
                        }),
                        (n.restoreSelectionInDocument = function (e) {
                            try {
                                if (e.originalSelection) {
                                    let n = e.activeElementInfo;
                                    n || (n = t.Utils.activeElementInfo(!0));
                                    const o = e.originalSelection,
                                        i = n.document.getSelection();
                                    "None" === o.type ||
                                    null === o.anchorNode ||
                                    null === o.focusNode
                                        ? i.empty()
                                        : (i.collapse(
                                              o.anchorNode,
                                              o.anchorOffset,
                                          ),
                                          "Range" === o.type &&
                                              i.extend(
                                                  o.focusNode,
                                                  o.focusOffset,
                                              ));
                                }
                            } catch (e) {}
                        }),
                        (n.clearSelectionInDocument = function (e) {
                            try {
                                let n = e.activeElementInfo;
                                n || (n = t.Utils.activeElementInfo(!0)),
                                    n.document.getSelection().collapseToEnd();
                            } catch (e) {}
                        }),
                        (n.insertContent = function (e, t, n, o) {
                            o
                                ? e.document.execCommand("insertHTML", !1, t)
                                : e.document.execCommand("insertText", !1, t),
                                n &&
                                    e.document.execCommand(
                                        "insertImage",
                                        !1,
                                        n,
                                    );
                        }),
                        (n.getSelection = function (e) {
                            return e.document.getSelection();
                        }),
                        (n.extendCurrentSelection = function (e, n, o, i) {
                            const r = e.document.getSelection();
                            return t.Utils.extendSelection(r, n, o, i);
                        }),
                        (n.setBaseAndExtent = function (e, n, o, i, r, s) {
                            const a = e.document.getSelection();
                            try {
                                a.setBaseAndExtent(n, o, i, r);
                            } catch (e) {
                                return t.Logger.error(e), !1;
                            }
                            return !0;
                        }),
                        (n.mapTextInDocument = function (e, n, o) {
                            return (
                                t.Utils.isNullOrUndefined(i) && (i = new V()),
                                i.setPlugins([]),
                                i.addPlugin(new j()),
                                i.addPlugin(new z()),
                                e.isMsOfficeWord && i.addPlugin(new G()),
                                i.mapDocumentText(n, o, e)
                            );
                        }),
                        (o = n);
                })(),
                (function () {
                    if (!t.Utils.isGoogleDocs()) return;
                    const e = {
                        extendCurrentSelection: function (n, o, i, r) {
                            const s = n.document.getSelection();
                            if (!s) return null;
                            if ("None" === s.type) {
                                const t = e.getSelection(n);
                                let {anchorNode: i} = t,
                                    {anchorOffset: r} = t;
                                if (
                                    (a = i) &&
                                    a.parentElement &&
                                    a.parentElement.classList &&
                                    (a.parentElement.classList.contains(
                                        "docs-ui-unprintable",
                                    ) ||
                                        a.parentElement.classList.contains(
                                            "docs-smartcompose-suggestion",
                                        ))
                                ) {
                                    const e = "backward" === o,
                                        t = document.createNodeIterator(
                                            i.parentElement,
                                            NodeFilter.SHOW_TEXT,
                                            {
                                                acceptNode: (e) =>
                                                    e.textContent.trim()
                                                        .length > 0
                                                        ? NodeFilter.FILTER_ACCEPT
                                                        : NodeFilter.FILTER_REJECT,
                                            },
                                        );
                                    (i = e ? t.previousNode : t.nextNode),
                                        (r = e ? i.textContent.length : 0);
                                }
                                s.collapse(i, r);
                            }
                            var a;
                            return t.Utils.extendSelection(s, o, i, r);
                        },
                        setBaseAndExtent: function (e, n, o, i, r, s) {
                            if (!n.isConnected || !i.isConnected) return !1;
                            const a = e.document.getSelection();
                            try {
                                a.setBaseAndExtent(n, o, i, r);
                            } catch (e) {
                                return t.Logger.error(e), !1;
                            }
                            return !0;
                        },
                        insertText: function (e, n) {
                            t.Logger.log(
                                "Insert Text into to Google Docs is handled by Google!",
                            );
                        },
                    };
                    i = e;
                })(),
                (function () {
                    if (!t.Utils.isAmazonKindle()) return;
                    const e = {};
                    let n = null,
                        o = null,
                        i = null,
                        s = [],
                        a = null,
                        l = [],
                        c = null,
                        d = "-1",
                        h = "-1";
                    function m(e) {
                        if (!e) return !1;
                        const t = e.ownerDocument.defaultView;
                        if (!t) return !1;
                        const n = e.getBoundingClientRect();
                        return (
                            (n.y >= 0 || n.y + n.height / 2 > 0) &&
                            n.y < t.innerHeight &&
                            (n.x >= 0 || n.x + n.width / 2 > 0) &&
                            n.x < t.innerWidth
                        );
                    }
                    function u(e) {
                        return e.nextElementSibling
                            ? e.nextElementSibling
                            : e.parentElement
                              ? u(e.parentElement)
                              : null;
                    }
                    function g(e, t) {
                        if (t.className === e) return t;
                        let n = null;
                        const o = t.childNodes;
                        for (let t = 0; t < o.length; t += 1)
                            if (((n = g(e, o[t])), n)) return n;
                        return null;
                    }
                    function p(e, t) {
                        let n = u(t);
                        for (; n; ) {
                            const t = g(e, n);
                            if (null != t) return t;
                            n = u(n);
                        }
                        return null;
                    }
                    function f(e) {
                        const t = [],
                            n = e.body.getBoundingClientRect();
                        if (n.width <= 0 && n.height <= 0) return t;
                        const o = e.body.querySelectorAll("span.k4w");
                        for (let e = 0; e < o.length; e += 1) {
                            const n = o[e];
                            m(n) && t.push(n);
                        }
                        return t;
                    }
                    function _() {
                        window.top.sru.speech.stop();
                    }
                    function E(e) {
                        return (
                            e.keyCode >= 33 &&
                            e.keyCode <= 40 &&
                            (e.preventDefault(), e.stopPropagation(), !1)
                        );
                    }
                    (e.clearSelection = function (t) {
                        e.getTextMapperDelegate().selectionHandler.clearSelection(
                            t.activeElementInfo,
                        );
                    }),
                        (e.restoreSelection = function (t) {
                            e.getTextMapperDelegate().selectionHandler.clearSelection(
                                t.activeElementInfo,
                            );
                        }),
                        (e.getContext = function (e) {
                            const {activeElemInfo: t} = e,
                                r = Boolean(e.entireDocument);
                            let d = Boolean(!r && e.fromCaretToEnd);
                            const h = Boolean(!r && e.clearSelection);
                            n =
                                document.getElementById("KindleReaderIFrame")
                                    .contentWindow.document;
                            const u = [...n.querySelectorAll("iframe")].filter(
                                (e) =>
                                    Boolean(
                                        e.style &&
                                            "hidden" !== e.style.visibility,
                                    ),
                            );
                            if (
                                ((o =
                                    u.length > 0
                                        ? u[0].contentWindow.document
                                        : null),
                                (i =
                                    u.length > 1
                                        ? u[1].contentWindow.document
                                        : null),
                                r)
                            ) {
                                d = !0;
                                let e = f(o);
                                (s = e),
                                    (a = e.length > 0 ? e[0].id : null),
                                    i
                                        ? ((e = f(i)),
                                          (l = e),
                                          (c = e.length > 0 ? e[0].id : null))
                                        : ((l = []), (c = null));
                            } else {
                                if (
                                    o.getElementsByClassName("amazon-selection")
                                        .length > 0
                                ) {
                                    const e =
                                        o.getElementById("annotation-section");
                                    if (
                                        ((s =
                                            e.getElementsByClassName(
                                                "amazon-selection",
                                            )),
                                        e.childNodes.length > 0)
                                    ) {
                                        const t = e.childNodes;
                                        for (
                                            let e = t.length - 1;
                                            e >= 0;
                                            e -= 1
                                        ) {
                                            const n = t[e];
                                            "kindle.selection" ===
                                                n.getAttribute(
                                                    "annotationtype",
                                                ) &&
                                                (a =
                                                    n.attributes.annotationstart
                                                        .value);
                                        }
                                    } else (s = []), (a = null);
                                } else (s = []), (a = null);
                                if (
                                    i &&
                                    i.getElementsByClassName("amazon-selection")
                                        .length > 0
                                ) {
                                    const e =
                                        i.getElementById("annotation-section");
                                    if (
                                        ((l =
                                            e.getElementsByClassName(
                                                "amazon-selection",
                                            )),
                                        e.childNodes.length > 0)
                                    ) {
                                        const t = e.childNodes;
                                        for (
                                            let e = t.length - 1;
                                            e >= 0;
                                            e -= 1
                                        ) {
                                            const n = t[e];
                                            "kindle.selection" ===
                                                n.getAttribute(
                                                    "annotationtype",
                                                ) &&
                                                (c =
                                                    n.attributes.annotationstart
                                                        .value);
                                        }
                                    } else (l = []), (c = null);
                                } else (l = []), (c = null);
                            }
                            if (
                                !(
                                    (s && 0 !== s.length) ||
                                    (l && 0 !== l.length)
                                )
                            )
                                return null;
                            let g = "";
                            const _ = [];
                            let E = o.getElementById(a);
                            m(E) || ((s = []), (a = null), (E = null)),
                                !E && i && (E = i.getElementById(c)),
                                E &&
                                    ":" === E.id.charAt(1) &&
                                    ([E] = E.childNodes);
                            let N = E,
                                C = i && N ? i.getElementById(N.id) : null,
                                x = E ? E.parentNode : null;
                            for (; x && x.id.indexOf(":") < 0; )
                                x = x.parentNode;
                            let S = x,
                                T = !0,
                                I = !0;
                            if (d) {
                                const e = parseInt(
                                    t.iframes[0].style.height,
                                    10,
                                );
                                for (; T && N; ) {
                                    g += N.innerText;
                                    for (
                                        let e = 0;
                                        e < N.innerText.length;
                                        e += 1
                                    )
                                        _.push({
                                            element: N,
                                            offset: e,
                                            text: N.innerText.charAt(e),
                                            embedded: !1,
                                        });
                                    for (
                                        N = p("k4w", N), S = N;
                                        S && S.id.indexOf(":") < 0;

                                    )
                                        S = S.parentNode;
                                    N
                                        ? ((C = i ? i.getElementById(N.id) : N),
                                          (T =
                                              !!C &&
                                              C.getBoundingClientRect().bottom <
                                                  e),
                                          T &&
                                              ((g += x === S ? " " : "\n"),
                                              _.push({
                                                  element: null,
                                                  offset: 0,
                                                  text: " ",
                                                  embedded: !1,
                                              }),
                                              (x = S)))
                                        : (T = !1);
                                }
                            } else {
                                let e = null;
                                if ((s.length, ([e] = s), !e)) return null;
                                let t = e.getBoundingClientRect();
                                const n = 4;
                                for (; T && N && I; ) {
                                    C = i ? i.getElementById(N.id) : N;
                                    const o = N.getClientRects();
                                    let r = !1;
                                    const s = o.length;
                                    for (let e = 0; e < s; e += 1) {
                                        const i = o[e];
                                        if (
                                            Math.trunc(i.left + n) >=
                                                Math.trunc(t.left) &&
                                            Math.trunc(i.right) <=
                                                Math.trunc(t.right + n) &&
                                            Math.trunc(i.top + n) >=
                                                Math.trunc(t.top) &&
                                            Math.trunc(i.bottom) <=
                                                Math.trunc(t.bottom + n)
                                        ) {
                                            r = !0;
                                            break;
                                        }
                                    }
                                    if (r) {
                                        g += N.innerText;
                                        for (
                                            let e = 0;
                                            e < N.innerText.length;
                                            e += 1
                                        )
                                            _.push({
                                                element: N,
                                                offset: e,
                                                text: N.innerText.charAt(e),
                                                embedded: !1,
                                            });
                                        for (
                                            N = p("k4w", N), S = N;
                                            S && S.id.indexOf(":") < 0;

                                        )
                                            S = S.parentNode;
                                        if (S !== x && !e.nextElementSibling)
                                            break;
                                        N
                                            ? ((g += x === S ? " " : "\n"),
                                              _.push({
                                                  element: null,
                                                  offset: 0,
                                                  text: " ",
                                                  embedded: !1,
                                              }),
                                              (T = !0),
                                              (x = S))
                                            : (T = !1);
                                    } else
                                        (e = e.nextElementSibling),
                                            e
                                                ? ((t =
                                                      e.getBoundingClientRect()),
                                                  (I = !0))
                                                : (I = !1);
                                }
                            }
                            const R = [],
                                y = [];
                            for (let e = 0; e < s.length; e += 1)
                                R.push(s[e].cloneNode(!0));
                            for (let e = 0; e < l.length; e += 1)
                                y.push(l[e].cloneNode(!0));
                            let v = {
                                type: "amazon.kindle",
                                activeElementInfo: t,
                                element: n.body,
                                isEditor: !0,
                                selection: {start: 0, length: g.length},
                                text: g,
                                custom: {map: _, selectionOffset: 0},
                                extended: {
                                    text: g,
                                    selection: {start: 0, length: g.length},
                                },
                                originalSelection: {
                                    type: "amazon.kindle",
                                    leftPageSelection: R,
                                    rightPageSelection: y,
                                },
                            };
                            if (
                                (0 === v.text.trim().length && (v = null),
                                h && v)
                            ) {
                                let e = s[0] ? s[0].parentNode : null;
                                for (let e = s.length - 1; e >= 0; e -= 1)
                                    s[e].parentNode.removeChild(s[e]);
                                e &&
                                    0 === e.childNodes.length &&
                                    e.parentNode.removeChild(e),
                                    (e = l[0] ? l[0].parentNode : null);
                                for (let e = l.length - 1; e >= 0; e -= 1)
                                    l[e].parentNode.removeChild(l[e]);
                                e &&
                                    0 === e.childNodes.length &&
                                    e.parentNode.removeChild(e);
                            }
                            return v;
                        }),
                        (e.enableSelection = function (e) {
                            const n = t.Utils.activeElementInfo();
                            if (e) {
                                const e =
                                    n.element.getElementsByClassName("header");
                                e.length > 0 &&
                                    ((d = e[0].style.zIndex),
                                    (e[0].style.zIndex = -1));
                                const t =
                                    n.element.getElementsByClassName("footer");
                                t.length > 0 &&
                                    ((h = t[0].style.zIndex),
                                    (t[0].style.zIndex = -1));
                                const o =
                                    n.element.ownerDocument.getElementById(
                                        "appBarOverlay",
                                    );
                                o && o.click.apply(o),
                                    (n.iframes[0].contentWindow.document.body.style.webkitUserSelect =
                                        "auto"),
                                    n.iframes[1] &&
                                        (n.iframes[1].contentWindow.document.body.style.webkitUserSelect =
                                            "auto"),
                                    n.iframes[0].contentWindow.addEventListener(
                                        "resize",
                                        _,
                                    ),
                                    n.iframes[1] &&
                                        n.iframes[1].contentWindow.addEventListener(
                                            "resize",
                                            _,
                                        ),
                                    document.addEventListener("keydown", E, !0),
                                    document.addEventListener("keyup", E, !0);
                                const i =
                                    document.getElementById(
                                        "KindleReaderIFrame",
                                    ).contentWindow.document;
                                i.addEventListener("keydown", E, !0),
                                    i.addEventListener("keyup", E, !0);
                                for (let e = 0; e < n.iframes.length; e += 1) {
                                    const t =
                                        n.iframes[e].contentWindow.document;
                                    t.addEventListener("keydown", E, !0),
                                        t.addEventListener("keyup", E, !0);
                                }
                            } else {
                                const e =
                                    n.element.getElementsByClassName("header");
                                e.length > 0 && (e[0].style.zIndex = d);
                                const t =
                                    n.element.getElementsByClassName("footer");
                                t.length > 0 && (t[0].style.zIndex = h),
                                    (n.iframes[0].contentWindow.document.body.style.webkitUserSelect =
                                        "none"),
                                    n.iframes[1] &&
                                        (n.iframes[1].contentWindow.document.body.style.webkitUserSelect =
                                            "none"),
                                    n.iframes[0].contentWindow.removeEventListener(
                                        "resize",
                                        _,
                                    ),
                                    n.iframes[1] &&
                                        n.iframes[1].contentWindow.removeEventListener(
                                            "resize",
                                            _,
                                        ),
                                    document.removeEventListener(
                                        "keydown",
                                        E,
                                        !0,
                                    ),
                                    document.removeEventListener(
                                        "keyup",
                                        E,
                                        !0,
                                    );
                                const o =
                                    document.getElementById(
                                        "KindleReaderIFrame",
                                    ).contentWindow.document;
                                o.removeEventListener("keydown", E, !0),
                                    o.removeEventListener("keyup", E, !0);
                                for (let e = 0; e < n.iframes.length; e += 1) {
                                    const t =
                                        n.iframes[e].contentWindow.document;
                                    t.removeEventListener("keydown", E, !0),
                                        t.removeEventListener("keyup", E, !0);
                                }
                            }
                        }),
                        (r = e);
                })(),
                (function () {
                    if (!t.Utils.isOverDriveReader()) return;
                    const e = {},
                        n = new D(),
                        o = new M();
                    (e.addSelectionEventListener = function (e, t) {
                        o.addSelectionEventListener(e, t);
                    }),
                        (e.getContext = function (e, t) {
                            if (!o.isInstalled()) return null;
                            (t.fillMappings =
                                t.requestFor && "speech" === t.requestFor),
                                (t.completePartiallySelectedWords = !0);
                            const i = o.getContextWithParams(t);
                            return i && 0 !== i.text.trim().length
                                ? ((i.type = "over.drive.reader"),
                                  (i.activeElementInfo = e),
                                  (i.activeElementInfo.document =
                                      i.custom.map.length > 0
                                          ? i.custom.map[0].element
                                                .ownerDocument
                                          : i.activeElementInfo.document),
                                  (i.element = o.getActiveElement()),
                                  (i.isEditor = !0),
                                  (i.custom.selectionOffset = 0),
                                  (i.source = n),
                                  i)
                                : null;
                        }),
                        (e.enableOverlays = function (e) {
                            o.enableOverlays(e);
                        }),
                        (e.enableSelection = function (e) {
                            o.enableSelection(e);
                        }),
                        (e.clearSelection = function (e) {
                            o.clearSelection();
                        }),
                        (e.insertText = function (e, n) {
                            t.Logger.error("Insert Text not supported!");
                        }),
                        (e.getParagraphAtPoint = function (e, t, n) {
                            return o.getParagraphAtPoint(e, t, n);
                        }),
                        (e.getLineAtPoint = function (e, t, n) {
                            return o.getLineAtPoint(e, t, n);
                        }),
                        (e.ensureOverlayFilters = function () {
                            return null;
                        }),
                        o.install(),
                        (s = e);
                })(),
                (function () {
                    if (!t.Utils.isBookshareReader()) return;
                    const e = {},
                        n = new J();
                    (e.enableSelection = function (e) {
                        n && n.enableSelection(e);
                    }),
                        (e.clearSelection = function (e) {
                            n && n.clearSelection();
                        }),
                        (e.insertText = function (e, n) {
                            t.Logger.error("Insert Text not supported!");
                        }),
                        n && n.install(),
                        (a = e);
                })(),
                (function () {
                    if (!t.Utils.isMsOfficeWord()) return;
                    const e = {};
                    function n() {
                        return window.cwe ? window.cwe.msWordProxy : null;
                    }
                    (e.getContext = function (t, o) {
                        const i = n();
                        if (!i) return null;
                        const r = i.getContext();
                        return r
                            ? (void 0 === r.custom && (r.custom = {}),
                              (r.custom.selectionOffset = r.selection.offset),
                              (r.type = "ms.office.word"),
                              Boolean(o.clearSelection) && e.clearSelection(),
                              r)
                            : null;
                    }),
                        (e.getSelection = function (e) {
                            const t = e.document.getSelection();
                            if (
                                t &&
                                t.anchorNode &&
                                3 === t.anchorNode.nodeType &&
                                t.focusNode &&
                                3 === t.focusNode.nodeType
                            ) {
                                const n = e.document.createRange();
                                n.selectNode(t.anchorNode);
                                const o = n.getBoundingClientRect();
                                n.selectNode(t.focusNode);
                                const i = n.getBoundingClientRect();
                                return {
                                    anchorNode: t.anchorNode,
                                    anchorOffset: t.anchorOffset,
                                    focusNode: t.focusNode,
                                    focusOffset: t.focusOffset,
                                    type: t.type,
                                    positionInfo: {
                                        anchorNodeRect: o,
                                        focusNodeRect: i,
                                    },
                                };
                            }
                            return null;
                        }),
                        (e.extendCurrentSelection = function (e, n, o, i) {
                            const r = e.document.getSelection();
                            return t.Utils.extendSelection(r, n, o, i);
                        }),
                        (e.setBaseAndExtent = function (e, n, o, i, r, s) {
                            if (!n.isConnected) {
                                if (!s || !s.positionInfo) return !1;
                                const i = t.Utils.caretPositionFromPoint(
                                    s.positionInfo.anchorNodeRect.left,
                                    s.positionInfo.anchorNodeRect.top,
                                    e.document,
                                );
                                (n = i.offsetNode), (o = i.offset);
                            }
                            if (!i.isConnected) {
                                if (!s || !s.positionInfo) return !1;
                                const n = t.Utils.caretPositionFromPoint(
                                    s.positionInfo.focusNodeRect.left,
                                    s.positionInfo.focusNodeRect.top,
                                    e.document,
                                );
                                (i = n.offsetNode), (r = n.offset);
                            }
                            const a = e.document.getSelection();
                            try {
                                a.setBaseAndExtent(n, o, i, r);
                            } catch (e) {
                                return t.Logger.error(e), !1;
                            }
                            return !0;
                        }),
                        (e.restoreSelection = function (n, o) {
                            if (!o.originalSelection) return !1;
                            try {
                                return e.setBaseAndExtent(
                                    n,
                                    o.originalSelection.anchorNode,
                                    o.originalSelection.anchorOffset,
                                    o.originalSelection.focusNode,
                                    o.originalSelection.focusOffset,
                                    o.originalSelection,
                                );
                            } catch (e) {
                                return t.Logger.error(e), !1;
                            }
                        }),
                        (e.clearSelection = function (e) {
                            return n().clearSelection(null);
                        }),
                        (e.insertText = function (e, n) {
                            t.Logger.error("Insert Text not supported!");
                        }),
                        (l = e);
                })();
        }
        static getInstance() {
            return K.instance ? K.instance : new K();
        }
    }
    K.instance = null;
    const Y = {NONE: 0, WORD: 1, SENTENCE: 2, PARAGRAPH: 3, CHARACTER: 4};
    class Q extends d {
        constructor(e, t, n, o = c.CARET, i = !0) {
            super(o, i),
                (this.m_skip = e),
                (this.m_skipCount = t),
                (this.m_skipConsecutiveSeparatorsAsOne = n),
                (this.m_skipFunctor = this.getMethodForSkip()),
                (this.m_skipped = 0),
                (this.m_separatorsSkipped = 0),
                (this.m_previousNode = null),
                (this.m_previousPara = null),
                (this.m_state = {
                    previousWasSeparator: this.m_skip !== Y.CHARACTER,
                    preprocessingWhitespaces: !0,
                });
        }
        get positionReached() {
            return (
                (!this.m_skipConsecutiveSeparatorsAsOne &&
                    this.m_separatorsSkipped > 1) ||
                Boolean(this.m_skipCount <= this.m_skipped)
            );
        }
        getPositionInText(e, t, n) {
            let o = super.getPositionInText(e, t, n);
            if (!this.m_skipFunctor) return o;
            if (super.isBackward)
                for (; o > 0 && super.process(null, e[o - 1], o - 1); )
                    (this.positionReached && this.m_skip !== Y.CHARACTER) ||
                        (o -= 1);
            else {
                const t = e.length;
                for (; o < t - 1 && super.process(null, e[o + 1], o + 1); )
                    (this.positionReached && this.m_skip !== Y.CHARACTER) ||
                        (o += 1);
            }
            return o;
        }
        onInitialize(e, t, n, o) {
            (this.m_state = {
                previousWasSeparator: this.m_skip !== Y.CHARACTER,
                preprocessingWhitespaces: Boolean(
                    this.m_skipConsecutiveSeparatorsAsOne ||
                        this.m_skip !== Y.WORD,
                ),
            }),
                (this.m_skipped = 0),
                (this.m_separatorsSkipped = 0),
                (this.m_previousNode = null),
                (this.m_previousPara = null),
                (this.m_currentPara = null),
                (this.m_skipFunctor = this.getMethodForSkip());
        }
        onPreprocess(e, n, o) {
            return !(
                (this.m_state.preprocessingWhitespaces &&
                    (t.CharSet.whiteSpace.characterIsMember(n) ||
                        t.CharSet.invisibleWhiteSpace.characterIsMember(n))) ||
                ((this.m_state.preprocessingWhitespaces = !1), 0)
            );
        }
        onProcess(e, n, o) {
            const i = this.m_skipFunctor(e, n);
            return (
                i
                    ? (t.CharSet.invisibleWhiteSpace.characterIsMember(n) ||
                          ("\n" === n && this.m_skip === Y.WORD) ||
                          (this.m_separatorsSkipped += 1),
                      this.m_state.previousWasSeparator ||
                          (this.m_skipped += 1))
                    : (this.m_separatorsSkipped = 0),
                (this.m_state.previousWasSeparator =
                    this.m_skip !== Y.CHARACTER && i),
                this.m_previousNode !== e &&
                    ((this.m_previousNode = e),
                    (this.m_previousPara = this.m_currentPara)),
                this.m_skip === Y.CHARACTER ? i : !this.positionReached
            );
        }
        getMethodForSkip() {
            switch (this.m_skip) {
                case Y.NONE:
                    return null;
                case Y.WORD:
                    return (e, n) =>
                        t.CharSet.wordSeparator.characterIsMember(n) ||
                        t.CharSet.invisibleWhiteSpace.characterIsMember(n);
                case Y.SENTENCE:
                    return (e, n) =>
                        t.CharSet.sentenceSeparator.characterIsMember(n) &&
                        !t.CharSet.paragraphSeparator.characterIsMember(n);
                case Y.PARAGRAPH: {
                    const e = this.m_mappingDelegate
                        ? this.m_mappingDelegate.paragraphIterator
                        : null;
                    return e
                        ? (n, o) =>
                              this.m_previousNode !== n &&
                              !t.Utils.isNullOrUndefined(this.m_previousNode) &&
                              ((this.m_currentPara = e.getParagraphForNode(n)),
                              this.m_previousPara ||
                                  (this.m_previousPara = e.getParagraphForNode(
                                      this.m_previousNode,
                                  )),
                              this.m_currentPara !== this.m_previousPara)
                        : (e, n) =>
                              t.CharSet.paragraphSeparator.characterIsMember(n);
                }
                case Y.CHARACTER:
                    return (e, n) =>
                        !t.CharSet.invisibleWhiteSpace.characterIsMember(n);
                default:
                    return null;
            }
        }
    }
    class Z extends d {
        constructor(e = c.CARET, t = !0) {
            super(e, t),
                (this.m_positionReached = !1),
                (super.m_stopAtWordBoundary = !0);
        }
        get positionReached() {
            return this.m_positionReached;
        }
        onInitialize(e, t, n, o) {
            this.m_positionReached = !1;
        }
        onProcess(e, n, o) {
            return (
                this.m_positionReached ||
                    (this.m_positionReached = Boolean(
                        t.CharSet.whiteSpace.characterIsMember(n) ||
                            t.CharSet.invisibleWhiteSpace.characterIsMember(n),
                    )),
                !this.m_positionReached
            );
        }
    }
    const ee = {UNKNOWN: 0, SENTENCE: 1, WORD: 2, CHARACTER: 3};
    Object.freeze(ee);
    class te {
        constructor(e) {
            (this.m_eventTarget = new EventTarget()),
                (this.m_parts = []),
                (this.m_caretOptions = {
                    origin: r.NONE,
                    skip: Y.NONE,
                    skipCount: 1,
                }),
                (this.m_granularity = ee.UNKNOWN),
                (this.m_isHighlighting = !1),
                (this.m_lastHighlightedCharIndex = -1),
                (this.m_options = e),
                (this.m_cancelled = !1);
        }
        get hasText() {
            const e = this.m_parts.length;
            if (0 === e) return !1;
            for (let t = 0; t < e; t += 1)
                if (this.m_parts[t].text.trim().length > 0) return !0;
            return !1;
        }
        get granularity() {
            return this.m_granularity;
        }
        get caretOptions() {
            return this.m_caretOptions;
        }
        get highlightWhileTypingIsEnabled() {
            return this.m_caretOptions.origin === r.BACK_TO_CARET;
        }
        isHighlighting() {
            return this.m_isHighlighting;
        }
        onTTSMessage(e) {
            return e.message === t.Messages.cwe.tts.PROGRESS
                ? 0 !== this.m_parts.length &&
                      (this.isHighlighting() || this.enableHighlighting(null),
                      this.highlight(e.charIndex, e.info),
                      !0)
                : e.message === t.Messages.cwe.tts.START
                  ? 0 !== this.m_parts.length &&
                    !this.isHighlighting() &&
                    (this.enableHighlighting(null), !0)
                  : (e.message === t.Messages.cwe.tts.STOP ||
                        e.message === t.Messages.cwe.tts.ERROR) &&
                    (this.reset(null), !0);
        }
        setWordGranularity() {
            this.setGranularity(ee.WORD);
        }
        setGranularity(e) {
            this.m_granularity !== e &&
                ((this.m_granularity = e), this.onGranularityChanged(e));
        }
        onGranularityChanged(e) {}
        mapTextForHighlighting(e, n) {
            (this.m_parts = []),
                (this.m_caretOptions = e),
                this.doMapTextForHighlighting(this.m_caretOptions, (e) => {
                    (this.m_parts = e), t.Utils.callMethod(n, e);
                });
        }
        doMapTextForHighlighting(e, n) {
            t.Utils.callMethod(n, this.m_parts);
        }
        replaceLastWord(e, n) {
            if (0 === this.m_parts.length) return;
            const {text: o} = this.m_parts[this.m_parts.length - 1];
            let i = o.length - 1;
            for (
                ;
                i >= 0 &&
                t.CharSet.wordSeparator.characterIsMemberNoHypen(o[i]);
                i -= 1
            );
            for (
                ;
                i >= 0 &&
                !t.CharSet.wordSeparator.characterIsMemberNoHypen(o[i]);
                i -= 1
            );
            (this.m_parts[this.m_parts.length - 1].text =
                o.substring(0, i + 1) + e),
                this.onLastWordReplaced(e, n);
        }
        onLastWordReplaced(e, t) {}
        cancel() {
            this.m_cancelled || ((this.m_cancelled = !0), this.onCancelled());
        }
        onCancelled() {}
        reset(e) {
            this.isHighlighting()
                ? this.disableHighlighting(() => {
                      this.resetAndInitialize(e);
                  })
                : this.resetAndInitialize(e);
        }
        onDidReset() {}
        resetAsync() {
            return new Promise((e) => this.reset(e));
        }
        resetAndInitialize(e) {
            this.init(), this.onDidReset(), t.Utils.callMethod(e);
        }
        setOptions(e) {
            K.getInstance().setOptions(e);
        }
        enableHighlighting(e) {
            this.isHighlighting()
                ? t.Utils.callMethod(e)
                : ((this.m_isHighlighting = !0),
                  this.doEnableHighlighting(() => {
                      this.m_eventTarget.dispatchEvent(
                          new CustomEvent("highlighting-status-changed", {
                              detail: {source: this, status: !0},
                          }),
                      ),
                          t.Utils.callMethod(e);
                  }));
        }
        doEnableHighlighting(e) {
            t.Utils.callMethod(e);
        }
        disableHighlighting(e) {
            this.isHighlighting()
                ? ((this.m_isHighlighting = !1),
                  this.doDisableHighlighting(() => {
                      t.Utils.callMethod(e),
                          this.m_eventTarget.dispatchEvent(
                              new CustomEvent("highlighting-status-changed", {
                                  detail: {source: this, status: !1},
                              }),
                          );
                  }))
                : t.Utils.callMethod(e);
        }
        doDisableHighlighting(e) {
            t.Utils.callMethod(e);
        }
        disableHighlightingAsync() {
            return new Promise((e) => this.disableHighlighting(e));
        }
        highlight(e, n, o = !1, i = null) {
            if (!this.isHighlighting()) return !1;
            if (this.m_lastHighlightedCharIndex === e) return !1;
            this.m_lastHighlightedCharIndex = e;
            const r =
                o || Boolean(this.m_options && this.m_options.onHighlighted);
            return this.doHighlight(e, n, r, (n) => {
                r &&
                    Boolean(this.m_options && this.m_options.onHighlighted) &&
                    this.m_options.onHighlighted(this, e, n),
                    t.Utils.callMethod(i, n);
            });
        }
        doHighlight(e, t, n, o) {
            return !1;
        }
        addEventListener(e, t) {
            this.m_eventTarget.addEventListener(e, t);
        }
        removeEventListener(e, t) {
            this.m_eventTarget.removeEventListener(e, t);
        }
        init() {
            (this.m_parts = []),
                (this.m_caretOptions.origin = r.NONE),
                (this.m_isHighlighting = !1),
                (this.m_lastHighlightedCharIndex = -1),
                (this.m_cancelled = !1);
        }
    }
    class ne extends te {
        constructor(e) {
            super(e), (this.m_context = null);
        }
        getContext(e = !1) {
            return (
                (e || (this.isHighlighting() && null === this.m_context)) &&
                    this.mapContext(),
                this.m_context
            );
        }
        setContext(e) {
            this.m_context = e;
        }
        mapContext() {
            this.setContext(null),
                this.m_caretOptions.origin !== r.NONE && this.mapDocumentText();
        }
        mapDocumentText() {
            const e = this.getStartMappingStrategy(),
                t = this.getEndMappingStrategy();
            let n = K.getInstance().mapText(e, t);
            n ||
                t.origin() !== c.SELECTION_END ||
                ((t.origin = c.DOCUMENT_END),
                (n = K.getInstance().mapText(e, t))),
                n && this.setContext(n);
        }
        getStartMappingStrategy() {
            switch (this.m_caretOptions.origin) {
                case r.FROM_CARET_TO_END:
                case r.BACK_TO_CARET:
                    return this.m_caretOptions.skip === Y.NONE
                        ? new Z()
                        : new Q(
                              this.m_caretOptions.skip,
                              this.m_caretOptions.skipCount,
                              this.m_caretOptions.skipConsecutiveSeparatorsAsOne,
                          );
                default:
                    return null;
            }
        }
        getEndMappingStrategy() {
            switch (this.m_caretOptions.origin) {
                case r.FROM_CARET_TO_END:
                    return new Z(c.DOCUMENT_END, !1);
                case r.BACK_TO_CARET:
                    return new Q(
                        this.m_caretOptions.skip,
                        0,
                        this.m_caretOptions.skipConsecutiveSeparatorsAsOne,
                    );
                default:
                    return null;
            }
        }
        onDidReset() {
            this.m_context = null;
        }
        doEnableHighlighting(e) {
            const n = this.getContext();
            n &&
                n.source.textHighlighter.enableHighlight(
                    n,
                    this.m_caretOptions.origin,
                    () => {
                        t.Utils.callMethod(e);
                    },
                );
        }
        doDisableHighlighting(e) {
            const n = this.getContext();
            n &&
                n.source.textHighlighter.disableHighlight(
                    n,
                    this.m_caretOptions.origin,
                    () => {
                        t.Utils.callMethod(e);
                    },
                );
        }
        doHighlight(e, n, o, i) {
            const r = this.getContext();
            if (!r) return !1;
            const s = {colors: K.getInstance().getColors(), ...n},
                a = r.source.textHighlighter.highlightWithProperties(
                    r,
                    s,
                    e,
                    this.granularity === ee.CHARACTER ? 1 : void 0,
                );
            if (o) {
                const n =
                    r.source.textHighlighter.getHighlightedBoundingClientRect(
                        r,
                        e,
                        2,
                    );
                t.Utils.callMethod(i, n);
            }
            return a;
        }
        doMapTextForHighlighting(e, t) {
            const n = this.getContext(!0),
                o = this.preparePartsFromMappingContext(n);
            super.doMapTextForHighlighting(e, t(o));
        }
        onCancelled() {
            const e = this.getContext(!0);
            e && (e.cancelled = !0), super.onCancelled();
        }
        preparePartsFromMappingContext(e) {
            const t = [];
            if (e.translations && e.translations.length > 0)
                for (let n = 0; n < e.translations.length; n += 1) {
                    const o = e.translations[n];
                    t.push({
                        text: o.text,
                        isTranslated: o.translated,
                        isMath: o.isMath,
                        mathFormat: o.mathFormat,
                        indexOfPlaceholderText: o.indexOfPlaceholderText,
                    });
                }
            else t.push({text: e.text, isTranslated: !1});
            return t;
        }
    }
    let oe, ie;
    const re = {text: "#000000", word: "#71FDFE"},
        se = "dji-css-highlight",
        ae = "dji-mark";
    let le = !1;
    function ce() {
        return le;
    }
    function de(e) {
        ie !== e &&
            ((ie = e), (oe = e && window.Mark ? new window.Mark(e) : null));
    }
    function he() {
        const e = (function () {
                const e = t.Utils.colorToRgb(re.word.substring(0, 7));
                return `dji-mark { background: rgba(${[e.r, e.g, e.b].join(", ")}, 0.99) !important; color: ${re.text} !important;}`;
            })(),
            n = t.Utils.findValidDocumentElements();
        for (let t = 0; t < n.length; t += 1) {
            const o = n[t];
            let i = o.getElementById(se);
            i
                ? (i.innerText = e)
                : ((i = o.createElement("style")),
                  (i.id = se),
                  (i.innerText = e),
                  o.head.appendChild(i));
        }
    }
    function me() {
        const e = t.Utils.findValidDocumentElements();
        for (let t = 0; t < e.length; t += 1) {
            const n = e[t],
                o = n.getElementById(se);
            o && n.head.removeChild(o);
        }
    }
    function ue(e = null) {
        me(),
            (le = !1),
            oe
                ? oe.unmark({
                      element: ae,
                      done: () => {
                          de(null), t.Utils.callMethod(e);
                      },
                  })
                : t.Utils.callMethod(e);
    }
    function ge(e, n) {
        ce() && ue(), he(), (le = !0), t.Utils.callMethod(n);
    }
    const pe = {
        setColors: function (e, n) {
            if (e) {
                const n = t.Utils.colorToHex(e);
                n && (re.text = n);
            }
            if (n) {
                const e = t.Utils.colorToHex(n);
                e && (re.word = e);
            }
            ce() && (me(), he());
        },
        setHighlightEnabled: function (e, t, n) {
            if (e) {
                const {text: e, word: t} = K.getInstance().getColors();
                this.setColors(e, t), ge(0, n);
            } else ue(n);
        },
        enableHighlight: function (e, t, n) {
            pe.setHighlightEnabled(e, t, n);
        },
        highlight: function (e, n, o, i, r = null, s = ee.CHARACTER) {
            const a = (function (e, n, o, i) {
                const r = {start: 0, length: 0};
                return (
                    (r.start = (function (e, t) {
                        return e.offset + t;
                    })(e, n)),
                    (r.length = (function (e, n, o, i) {
                        switch (i) {
                            case ee.UNKNOWN:
                            case ee.CHARACTER:
                                return o;
                            case ee.WORD: {
                                const i = e.text.length;
                                let r = n,
                                    s = 0,
                                    a = !1,
                                    l = !0;
                                for (; r < i && s < o; r += 1)
                                    t.CharSet.wordSeparator.characterIsMemberNoHypen(
                                        e.text[r],
                                    )
                                        ? l || (a || (s += 1), (a = !0))
                                        : ((l = !1), (a = !1));
                                return Math.max(Math.abs(r - n), 1);
                            }
                            default:
                                return 10;
                        }
                    })(e, n, o, i)),
                    r
                );
            })(e, n, o, s);
            return (
                ce() || ge(0, null),
                t.Utils.isNullOrUndefined(oe)
                    ? (de(e.target),
                      oe.markRanges([a], {
                          element: ae,
                          exclude: e.exclusionSelectors,
                          filter: i,
                          done: () => {
                              t.Utils.callMethod(r);
                          },
                      }))
                    : oe.unmark({
                          element: ae,
                          done: () => {
                              de(e.target),
                                  oe.markRanges([a], {
                                      element: ae,
                                      exclude: e.exclusionSelectors,
                                      filter: i,
                                      done: () => {
                                          t.Utils.callMethod(r);
                                      },
                                  });
                          },
                      }),
                !0
            );
        },
        highlightWord: function (e, t, n, o = null) {
            return this.highlight(e, t, 1, n, o, ee.WORD);
        },
        clearHighlights: function () {
            oe && oe.unmark({element: ae, done: () => {}});
        },
        getMarkElementType: function () {
            return ae;
        },
    };
    class fe {
        static mImplArray = [];
        static mColors = {paragraphColor: "red", lineColor: "blue"};
        static registerGuideImpl(e) {
            fe.mImplArray.push(e), e.setColors(fe.mColors);
        }
        static setColors(e) {
            (fe.mColors = e),
                fe.mImplArray.forEach((t) => {
                    t.setColors(e);
                });
        }
        static paragraphAtPoint(e, t, n) {
            const o = fe.mImplArray.length;
            for (let i = 0; i < o; ++i) {
                const o = fe.mImplArray[i].paragraphAtPoint(e, t, n);
                if (o) return o;
            }
            return null;
        }
        static lineAtPoint(e, t, n) {
            const o = fe.mImplArray.length;
            for (let i = 0; i < o; ++i) {
                const o = fe.mImplArray[i].lineAtPoint(e, t, n);
                if (o) return o;
            }
            return null;
        }
        static highlightParagraphAt(e, t, n) {
            const o = fe.mImplArray.length;
            for (let i = 0; i < o; ++i)
                if (fe.mImplArray[i].highlightParagraphAt(e, t, n)) return !0;
            return !1;
        }
        static clearHighlights(e) {
            const t = fe.mImplArray.length;
            for (let n = 0; n < t; ++n)
                if (fe.mImplArray[n].clearHighlights(e)) return !0;
            return !1;
        }
    }
    class _e extends u {
        constructor() {
            super({type: "canvas-lms-document", isEditor: !0});
        }
        createSelectionHandler() {
            return new C(this);
        }
    }
    class Ee extends O {
        static isCanvas(e, t = null) {
            return (
                (t = t || window.location.hostname),
                !(
                    !/^texthelp\.quiz-.*\.instructure\.com$/.test(t) ||
                    "/" === window.location.pathname
                )
            );
        }
        doCreateDelegate(e = null) {
            return Ee.isCanvas(e) ? new _e() : null;
        }
    }
    O.registerFactory(new O()),
        Ee.isCanvas() && O.registerFactory(new Ee()),
        (e.CaretPositioner = i),
        (e.DocumentTextHighlighter = s),
        (e.DocumentTextMapper = V),
        (e.DocumentTextMapperAdapter = X),
        (e.DocumentTextMapperDelegate = u),
        (e.DocumentTextMapperUtils = k),
        (e.DocumentTextReader = h),
        (e.HighlightColors = class {
            text;
            word;
        }),
        (e.HighlightProperties = class {
            colors;
            chunkLen;
            chunkOffset;
            isMath;
            mathFormat;
            indexOfPlaceholderText;
        }),
        (e.MarkTextHighlighter = class extends s {
            constructor() {
                super(),
                    (this.m_context = void 0),
                    (this.m_origin = void 0),
                    (this.m_lastHighlightedCharIndex = -1),
                    (this.m_caretInfo = {targetOffset: -1, paragraph: null}),
                    (this.mSelectionChanged = !1),
                    (this.m_disableHighlightCallback = () => {
                        this.disableHighlight(
                            this.m_context,
                            this.m_origin,
                            null,
                        );
                    }),
                    (this.mSelectionChangedCallback = () => {
                        this.mSelectionChanged = !0;
                    }),
                    (this.m_filterCallback = (e, t, n, o) =>
                        this.filterCallback(e, t, n, o));
            }
            install(e) {
                (this.mSelectionChanged = !1),
                    e.activeElementInfo.document.addEventListener(
                        "keydown",
                        this.m_disableHighlightCallback,
                        !0,
                    ),
                    e.activeElementInfo.document.addEventListener(
                        "selectionchange",
                        this.mSelectionChangedCallback,
                        !0,
                    );
            }
            uninstall(e) {
                e.activeElementInfo.document.removeEventListener(
                    "keydown",
                    this.m_disableHighlightCallback,
                    !0,
                ),
                    e.activeElementInfo.document.removeEventListener(
                        "selectionchange",
                        this.mSelectionChangedCallback,
                        !0,
                    );
            }
            enableHighlight(e, n, o) {
                pe.setHighlightEnabled(!0, e, () => {
                    (this.m_context = e),
                        (this.m_origin = n),
                        this.install(e),
                        this.initCaretInfo(),
                        t.Utils.callMethod(o);
                });
            }
            disableHighlight(e, n, o) {
                this.sanitizeSelection(),
                    this.clearHighlights(),
                    pe.setHighlightEnabled(!1, e, () => {
                        (this.m_context = e),
                            this.uninstall(e),
                            t.Utils.callMethod(o);
                    });
            }
            highlightWord(e, t, n) {
                return (
                    (this.m_context = e),
                    (this.m_lastHighlightedCharIndex = t),
                    this.adjustContextBeforeHighlighting(e, t),
                    pe.highlightWord(e, t, this.m_filterCallback, null),
                    !0
                );
            }
            highlight(e, t, n, o) {
                return (
                    (this.m_context = e),
                    (this.m_lastHighlightedCharIndex = t),
                    this.adjustContextBeforeHighlighting(e, t),
                    pe.highlight(e, t, n, this.m_filterCallback, null),
                    !0
                );
            }
            clearHighlights() {
                pe.clearHighlights();
            }
            getHighlightedBoundingClientRect(e, t) {
                const n = e.activeElementInfo.document.querySelector(
                    pe.getMarkElementType(),
                );
                return n ? n.getBoundingClientRect() : null;
            }
            filterCallback(e, t, n, o) {
                const i =
                    this.m_context.activeElementInfo.document.getSelection();
                if (!i.containsNode(e, !0)) return !0;
                const r = k.targetOffsetFromCaretPosition(
                    this.m_caretInfo.paragraph,
                    e,
                    Math.max(i.anchorOffset, 0),
                );
                return !(r >= t.start && r <= t.start + t.length);
            }
            adjustContextBeforeHighlighting(e, t) {
                (e.target = null), (e.offset = 0);
            }
            sanitizeSelection() {
                if (t.Utils.isNullOrUndefined(this.m_context)) return;
                this.mSelectionChanged = !1;
                const e =
                    this.m_context.activeElementInfo.document.getSelection();
                if ("None" === e.type)
                    return (
                        t.Logger.log("No selection!"), void this.restoreCaret()
                    );
                null !== e.anchorNode &&
                    (this.m_caretInfo.targetOffset =
                        k.targetOffsetFromCaretPosition(
                            this.m_caretInfo.paragraph,
                            e.anchorNode,
                            e.anchorOffset,
                        ));
            }
            initCaretInfo() {
                this.m_caretInfo.paragraph =
                    this.m_context.source.paragraphIterator.getCurrentParagraph(
                        this.m_context.activeElementInfo,
                    );
                const e =
                    this.m_context.activeElementInfo.document.getSelection();
                null !== e.anchorNode
                    ? (this.m_caretInfo.targetOffset =
                          k.targetOffsetFromCaretPosition(
                              this.m_caretInfo.paragraph,
                              e.anchorNode,
                              e.anchorOffset,
                          ))
                    : (this.m_caretInfo.targetOffset = 0);
            }
            restoreCaret() {
                if (this.m_context)
                    try {
                        const e =
                                this.m_context.activeElementInfo.document.getSelection(),
                            n = k.caretPositionFromTargetOffset(
                                this.m_caretInfo.paragraph,
                                this.m_caretInfo.targetOffset,
                            );
                        null !== n.offsetNode &&
                            (n.offsetNode.textContent.length > n.offset &&
                            n.offset >= 0
                                ? e.collapse(n.offsetNode, n.offset)
                                : t.Logger.warn(
                                      "UUPS!",
                                      n.offset,
                                      n.offsetNode.textContent.length,
                                  ));
                    } catch (e) {
                        t.Logger.error(e);
                    }
            }
        }),
        (e.NodeMappingPlugin = z),
        (e.ParaLineGuide = fe),
        (e.ParaLineGuideImpl = class {
            setColors(e) {
                throw Error("Not implemented");
            }
            paragraphAtPoint(e, t, n) {
                return null;
            }
            lineAtPoint(e, t, n) {
                return null;
            }
            highlightParagraphAt(e, t, n) {
                throw Error("Not implemented");
            }
            clearHighlights(e) {
                throw Error("Not implemented");
            }
        }),
        (e.ParagraphIterator = class {
            constructor(e = "paraid") {
                this.m_paraIdAttributeName = e;
            }
            getParagraphForNode(e) {
                return null;
            }
            getNextParagraphForNode(e, t = !1) {
                return null;
            }
            getAllParagraphs(e) {
                return null;
            }
            getCurrentParagraph(e) {
                return null;
            }
            getParagraphWithId(e, t) {
                const n = this.getAllParagraphs(t);
                if (!n) return null;
                const o = n.length;
                for (let t = 0; t < o; t += 1) {
                    const o = n[t];
                    if (o.getAttribute(this.m_paraIdAttributeName) === e)
                        return o;
                }
                return null;
            }
            nodeIsParagraph(e) {
                return !1;
            }
            nodeIsLastInParagraph(e) {
                return !1;
            }
        }),
        (e.SelectionHandler = a),
        (e.SelectionMapper = K),
        (e.SelectionOffsetMapperPlugin = class extends L {
            constructor() {
                super(), this.init();
            }
            onMappingAboutToStart(e) {
                this.init(),
                    (e.selection = e.selection || {}),
                    Object.assign(e.selection, {start: 0, length: 0});
                const n = e.source.selectionHandler;
                if (!n) return;
                const o = n.getSelection(e.activeElementInfo);
                o &&
                    o.anchorNode &&
                    o.focusNode &&
                    (t.Utils.isForwardSelection(o)
                        ? ((this.m_startNode = o.anchorNode),
                          (this.m_startOffset = o.anchorOffset),
                          (this.m_endNode = o.focusNode),
                          (this.m_endOffset = o.focusOffset))
                        : ((this.m_startNode = o.focusNode),
                          (this.m_startOffset = o.focusOffset),
                          (this.m_endNode = o.anchorNode),
                          (this.m_endOffset = o.anchorOffset)));
            }
            onAboutToMapNode(e, t, n) {
                t === this.m_startNode &&
                    (e.selection.start =
                        e.text.length + this.m_startOffset - n),
                    t === this.m_endNode &&
                        (e.selection.length =
                            e.text.length -
                            e.selection.start +
                            this.m_endOffset -
                            n);
            }
            init() {
                (this.m_startNode = null),
                    (this.m_startOffset = -1),
                    (this.m_endNode = null),
                    (this.m_endOffset = -1);
            }
        }),
        (e.SelectionTextHighlighter = m),
        (e.Skip = Y),
        (e.SkipTextMappingStrategy = Q),
        (e.StartOfWordMappingStrategy = Z),
        (e.TTSTextHighlighter = ne),
        (e.TTSTextHighlighterProxy = class extends te {
            constructor(e) {
                super(e),
                    (this.m_messageProxy = null),
                    (this.m_remoteHighlighterId = -1),
                    (this.m_highlighterImpl = new ne(e));
            }
            setMessageProxy(e) {
                this.m_messageProxy !== e &&
                    (this.m_messageProxy &&
                        (this.reset(null),
                        this.m_messageProxy.send(
                            t.Messages.cwe.highlighting.DESTROY,
                            void 0,
                            this.m_remoteHighlighterId,
                        ),
                        (this.m_messageProxy = null),
                        (this.m_remoteHighlighterId = -1)),
                    (this.m_messageProxy = e),
                    this.m_messageProxy && this.initMessageProxy());
            }
            get remoteHighlighterId() {
                return this.m_remoteHighlighterId;
            }
            activeElementIsCrossDomainFrame() {
                const e = document.activeElement;
                return Boolean(
                    e &&
                        "IFRAME" === e.tagName.toUpperCase() &&
                        t.Utils.isNullOrUndefined(e.contentDocument),
                );
            }
            onGranularityChanged(e) {
                this.m_messageProxy &&
                    this.m_messageProxy.send(
                        t.Messages.cwe.highlighting.SET_GRANULARITY,
                        void 0,
                        e,
                        this.m_remoteHighlighterId,
                    ),
                    this.m_highlighterImpl.setGranularity(e);
            }
            doMapTextForHighlighting(e, n) {
                this.m_messageProxy && this.activeElementIsCrossDomainFrame()
                    ? this.m_messageProxy.send(
                          t.Messages.cwe.highlighting.MAP_TEXT_FOR_HIGHLIGHTING,
                          n,
                          e,
                          this.m_remoteHighlighterId,
                      )
                    : this.m_highlighterImpl.mapTextForHighlighting(e, n);
            }
            onLastWordReplaced(e, n) {
                this.m_messageProxy && this.activeElementIsCrossDomainFrame()
                    ? this.m_messageProxy.send(
                          t.Messages.cwe.highlighting.REPLACE_LAST_WORD,
                          n,
                          e,
                          this.m_remoteHighlighterId,
                      )
                    : this.m_highlighterImpl.replaceLastWord(e, n);
            }
            onDidReset() {
                this.m_messageProxy &&
                    this.m_messageProxy.send(
                        t.Messages.cwe.highlighting.RESET,
                        void 0,
                        this.m_remoteHighlighterId,
                    ),
                    this.m_highlighterImpl.reset();
            }
            setOptions(e) {
                this.m_messageProxy &&
                    this.m_messageProxy.send(
                        t.Messages.cwe.highlighting.SET_OPTIONS,
                        void 0,
                        e,
                        this.m_remoteHighlighterId,
                    ),
                    this.m_highlighterImpl.setOptions(e);
            }
            doEnableHighlighting(e) {
                this.m_messageProxy && this.activeElementIsCrossDomainFrame()
                    ? this.m_messageProxy.send(
                          t.Messages.cwe.highlighting.ENABLE_HIGHLIGHTING,
                          e,
                          this.m_remoteHighlighterId,
                      )
                    : this.m_highlighterImpl.enableHighlighting(e);
            }
            doDisableHighlighting(e) {
                this.m_messageProxy && this.activeElementIsCrossDomainFrame()
                    ? this.m_messageProxy.send(
                          t.Messages.cwe.highlighting.DISABLE_HIGHLIGHTING,
                          e,
                          this.m_remoteHighlighterId,
                      )
                    : this.m_highlighterImpl.disableHighlighting(e);
            }
            doHighlight(e, n, o, i) {
                return this.m_messageProxy &&
                    this.activeElementIsCrossDomainFrame()
                    ? (this.m_messageProxy.send(
                          t.Messages.cwe.highlighting.HIGHLIGHT,
                          i,
                          e,
                          n,
                          o,
                          this.m_remoteHighlighterId,
                      ),
                      !0)
                    : Boolean(this.m_highlighterImpl.highlight(e, n, o, i));
            }
            onCancelled() {
                this.m_messageProxy && this.activeElementIsCrossDomainFrame()
                    ? this.m_messageProxy.send(
                          t.Messages.cwe.highlighting.CANCEL,
                          void 0,
                          this.m_remoteHighlighterId,
                      )
                    : this.m_highlighterImpl.cancel();
            }
            initMessageProxy() {
                const e = this;
                this.m_messageProxy.on(
                    t.Messages.cwe.highlighting.RESET,
                    (t, n) => {
                        e.remoteHighlighterId === n && e.reset(null);
                    },
                ),
                    this.m_messageProxy.enable(!0),
                    this.m_messageProxy.send(
                        t.Messages.cwe.highlighting.INIT,
                        (e) => {
                            (this.m_remoteHighlighterId = e),
                                this.m_eventTarget.dispatchEvent(
                                    new CustomEvent("proxy-initialized"),
                                );
                        },
                    );
            }
        }),
        (e.TextHighlighterOrigin = r),
        (e.TextHighlightingGranularity = ee),
        (e.TextMapperDelegateFactory = O),
        (e.TextMappingStrategy = d),
        (e.TextMappingStrategyOrigin = c),
        Object.defineProperty(e, "__esModule", {value: !0});
});
