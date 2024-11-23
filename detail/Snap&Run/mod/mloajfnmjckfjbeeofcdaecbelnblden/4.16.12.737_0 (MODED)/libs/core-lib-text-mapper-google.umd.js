/*!************************************************************************
 **
 ** Copyright (c) 2022-2024 Don Johnston, Inc. All rights reserved.
 **
 **************************************************************************/
!(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module
        ? e(exports, require("core-lib-text-mapper"), require("core-lib-utils"))
        : "function" == typeof define && define.amd
          ? define(["exports", "core-lib-text-mapper", "core-lib-utils"], e)
          : e(
                ((t =
                    "undefined" != typeof globalThis
                        ? globalThis
                        : t || self).GoogleDocsApiDjiWrapper = {}),
                t.__DjiTextMapper,
                t.__DjiCoreLibUtils,
            );
})(this, function (t, e, n) {
    "use strict";
    class r {
        static findCaretPosition(t) {
            const n = t.document.querySelector(
                "div#kix-current-user-cursor-caret",
            );
            if (!n) return null;
            const o = n.getBoundingClientRect();
            if (0 === o.width || 0 === o.height) {
                const e = t.document.getSelection();
                if ("none" === e.type) return null;
                if (null === e.focusNode || void 0 === e.focusNode) return null;
                const n = new Range();
                return (
                    n.setStart(e.focusNode, e.focusOffset),
                    n.setEnd(e.focusNode, e.focusOffset),
                    {
                        offsetNode: e.focusNode,
                        offset: e.focusOffset,
                        bcr: n.getBoundingClientRect(),
                    }
                );
            }
            const s = o.left + o.width / 2,
                i = o.top + o.height / 2,
                l = r.getCaretPositionFromPoint(t, s, i);
            return l
                ? ((l.bcr = o),
                  l.normalized ||
                      e.DocumentTextMapperUtils.normalizeCaretPositionInfo(l),
                  l)
                : null;
        }
        static elementFromPoint(t, e, n) {
            let r = null;
            const o = window.dji.gdocsCanvasProjectionTagName || "dji-canvas";
            let s = t.querySelector(o);
            s && (s.style.pointerEvents = "");
            const i = t.elementsFromPoint(e, n);
            if (
                (s && (s.style.pointerEvents = "none"),
                (s = i.find((t) => t.matches(o))),
                s)
            ) {
                let t = !0;
                for (
                    r = s.shadowRoot.getElementById("dji-canvas-annotations");
                    t && r;

                ) {
                    t = !1;
                    for (let o = 0; o < r.children.length; o += 1) {
                        const s = r.children[o],
                            i = s.getBoundingClientRect();
                        if (
                            i.left <= e &&
                            e <= i.right &&
                            i.top <= n &&
                            n <= i.bottom
                        ) {
                            (r = s), (t = !0);
                            break;
                        }
                    }
                }
            } else
                r = i.find(
                    (t) =>
                        !t.matches(".kix-cursor") &&
                        !t.matches(".kix-cursor-caret") &&
                        !t.matches(".kix-spell-bubble-suggestion-text") &&
                        t.closest(".kix-page"),
                );
            return r;
        }
        static paragraphFromPoint(t, e, n) {
            const o = r.elementFromPoint(t, e, n);
            if (!o) return o;
            let s = null;
            if (o.classList.contains("dji-canvas-content")) {
                const t = new DOMRect(e, n, 1, 1),
                    i = t.left + t.width / 2,
                    l = t.top + t.height / 2;
                s = r.getProximityParagraph(o, i, l);
            } else {
                if (!o.matches || !o.matches("div.dji-canvas-para")) return o;
                s = o;
            }
            return s || o;
        }
        static getCaretPositionFromPoint(t, n, o) {
            const s = r.elementFromPoint(t.document, n, o);
            if (!s) return null;
            let i = {offsetNode: s, offset: 0, bcr: new DOMRect(n, o, 0, 1)};
            return (
                i.offsetNode &&
                    (i.offsetNode.classList.contains("dji-canvas-content")
                        ? (i = r.getCaretPositionFromCanvasContent(
                              i.offsetNode,
                              i.bcr,
                          ))
                        : i.offsetNode.matches &&
                            i.offsetNode.matches("div.dji-canvas-para")
                          ? (i = r.getCaretPositionFromCanvasParagraph(
                                i.offsetNode,
                                i.bcr,
                            ))
                          : (i.offsetNode.classList.contains(
                                "dji-canvas-word",
                            ) &&
                                i.offsetNode.firstChild &&
                                (i.offsetNode = i.offsetNode.firstChild),
                            e.DocumentTextMapperUtils.normalizeCaretPositionInfo(
                                i,
                            ))),
                i.offsetNode ? i : null
            );
        }
        static getProximityParagraph(t, e, n) {
            let r = Number.MAX_SAFE_INTEGER,
                o = Number.MAX_SAFE_INTEGER,
                s = Number.MAX_SAFE_INTEGER,
                i = null,
                l = null;
            const a = t.querySelectorAll("div.dji-canvas-para"),
                c = a.length;
            for (let t = 0; t < c; t += 1) {
                const c = a[t],
                    u = c.getBoundingClientRect(),
                    h =
                        n > u.top && n < u.bottom
                            ? 0
                            : Math.min(
                                  Math.abs(u.top - n),
                                  Math.abs(u.bottom - n),
                              );
                if (h <= r) {
                    r = h;
                    const t =
                        e > u.left && e < u.right
                            ? 0
                            : Math.min(
                                  Math.abs(u.left - e),
                                  Math.abs(u.right - e),
                              );
                    if (0 === h) {
                        if (0 === t) {
                            (i = c), (l = null);
                            break;
                        }
                        s > t && ((s = t), (l = c));
                    }
                    t < o && ((o = t), (i = c));
                }
            }
            return l && (i = l), i;
        }
        static getProximityNodeInCanvasParaRect(t, e) {
            const n = {offsetNode: null, offset: -1, bcr: null};
            let r = Number.MAX_SAFE_INTEGER,
                o = null,
                s = Number.MAX_SAFE_INTEGER,
                i = null;
            const l = t.querySelectorAll("span.dji-canvas-word"),
                a = l.length;
            for (let t = 0; t < a; t += 1) {
                const a = l[t],
                    c = a.getBoundingClientRect();
                if (!(e.top > c.bottom || e.bottom < c.top)) {
                    if (e.x >= c.left && e.x <= c.right)
                        return (n.offsetNode = a.firstChild), (n.offset = 0), n;
                    const t = Math.min(
                        Math.abs(e.x - c.left),
                        Math.abs(e.x - c.right),
                    );
                    t < r && ((r = t), (o = a.firstChild));
                }
                const u = Math.min(
                    Math.abs(e.top - c.top),
                    Math.abs(e.bottom - c.bottom),
                );
                u < s && ((s = u), (i = a.firstChild));
            }
            return o ? (n.offsetNode = o) : i && (n.offsetNode = i), n;
        }
        static getProximityNodeInCanvasParagraph(t, e, n, o = 1, s = 1) {
            return r.getProximityNodeInCanvasParaRect(
                t,
                new DOMRectReadOnly(e, n, o, s),
            );
        }
        static getTrailingWhitespaceCountForProximityNode(t, e) {
            const n = (function (t) {
                let e = (t.dataset || t.parentElement.dataset).spacewidth;
                return (
                    "string" == typeof e && (e = Number.parseFloat(e)),
                    "number" != typeof e ? null : e
                );
            })(t);
            if (!n) return 0;
            const r = document.createRange();
            r.selectNodeContents(t);
            const o = e - r.getBoundingClientRect().right,
                s = Math.trunc(o / n + 0.4);
            return o > 0 ? Math.max(s, 0) : 0;
        }
        static getTrailingWhitespaceCountForNode(t, e, n) {
            const o = t.nodeType === Node.TEXT_NODE ? t.parentElement : t,
                s = r.getProximityParagraph(
                    o.closest("div.dji-canvas-content"),
                    e,
                    n,
                ),
                i = o.closest("div.dji-canvas-para");
            return s !== i ||
                r.getProximityNodeInCanvasParagraph(i, e, n).offsetNode !== t
                ? 0
                : r.getTrailingWhitespaceCountForProximityNode(t, e);
        }
        static getCaretPositionFromCanvasContent(t, e) {
            const n = e.left + e.width / 4,
                o = e.top + e.height / 4,
                s = r.getProximityParagraph(t, n, o);
            return s
                ? r.getCaretPositionFromCanvasParagraph(s, e)
                : {offsetNode: null, offset: -1, bcr: null};
        }
        static getCaretPositionFromCanvasParagraph(t, e) {
            const n = r.getProximityNodeInCanvasParagraph(
                t,
                e.left,
                e.top,
                1,
                e.height,
            );
            if (!n.offsetNode) return n;
            const o = r.getTrailingWhitespaceCountForProximityNode(
                n.offsetNode,
                e.left,
            );
            return (n.offset = n.offsetNode.textContent.length + o), n;
        }
    }
    class o extends e.CaretPositioner {
        getCaretPosition(t) {
            t.canvasAnnoTagName = super.delegate.mCanvasAnnoTagName;
            const e = r.findCaretPosition(t);
            return {
                anchorNode: e ? e.offsetNode : null,
                anchorOffset: e ? e.offset : -1,
            };
        }
        getCaretPositionFromPoint(t, e, n) {
            return (
                r.getCaretPositionFromPoint(
                    {
                        document: n,
                        canvasAnnoTagName: this.delegate.mCanvasAnnoTagName,
                    },
                    t,
                    e,
                ) || super.getCaretPositionFromPoint(t, e, n)
            );
        }
        onMoveCaret(t, e) {
            super.onMoveCaret(t, e);
            const r = t.ownerDocument;
            let o = r.querySelector("div#kix-current-user-cursor-caret");
            if (!o) return;
            o = o.parentElement;
            const s = o.offsetParent
                ? o.offsetParent
                : r.querySelector("div.kix-appview-editor");
            if (s)
                try {
                    const n = r.createRange();
                    n.setStart(t, e), n.setEnd(t, e);
                    const o = n.getBoundingClientRect(),
                        i = o.left,
                        l = o.top + 4,
                        a = {
                            bubbles: !0,
                            cancelable: !0,
                            view: window,
                            clientX: i,
                            clientY: l,
                        },
                        c = new MouseEvent("mousedown", a),
                        u = new MouseEvent("mouseup", a);
                    s.dispatchEvent(c), s.dispatchEvent(u);
                } catch (t) {
                    n.Logger.error(t);
                }
        }
        getCursorBoundingClientRect(t) {
            const e = t.document.querySelector(
                "div#kix-current-user-cursor-caret",
            );
            return e ? e.getBoundingClientRect() : null;
        }
    }
    function s(t, e) {
        if (t.nextSibling) return t.nextSibling;
        if (t.nextElementSibling) return t.nextElementSibling;
        let n = t.parentElement;
        for (; n && n !== e; ) {
            if (n.nextElementSibling) return n.nextElementSibling;
            n = n.parentElement;
        }
        return null;
    }
    class i extends e.ParagraphIterator {
        constructor() {
            super(""),
                (this.m_paragraphDivMatch = "div.kix-paragraphrenderer"),
                (this.m_canvasModeParaDivMatch = "div.dji-canvas-para");
        }
        getParagraphForNode(t) {
            if (!t) return null;
            const e = t.nodeType === Node.ELEMENT_NODE ? t : t.parentElement;
            return (
                e.closest(this.m_paragraphDivMatch) ||
                e.closest(this.m_canvasModeParaDivMatch)
            );
        }
        getNextParagraphForNode(t, e = !1) {
            const n = this.getParagraphForNode(t);
            if (!n) return null;
            const r = e ? n.previousElementSibling : n.nextElementSibling;
            return r && this.nodeIsParagraph(r) ? r : null;
        }
        nodeIsParagraph(t) {
            return Boolean(
                t &&
                    t.matches &&
                    (t.matches(this.m_paragraphDivMatch) ||
                        t.matches(this.m_canvasModeParaDivMatch)),
            );
        }
        nodeIsLastInParagraph(t) {
            const e = this.getParagraphForNode(t);
            if (!e) return !1;
            let r = t.nodeValue;
            if (!r || 0 === r.length) return !1;
            if (0 === n.Utils.normalizedText(r).length) return !1;
            let o = s(t, e);
            for (; o; )
                if (o.classList && o.classList.contains("goog-inline-block"))
                    o = s(o, e);
                else {
                    if (this.nodeIsParagraph(o)) return !0;
                    if (this.getParagraphForNode(o) !== e) return !0;
                    if (
                        ((r = n.Utils.normalizedText(o.textContent)),
                        r.length > 0)
                    )
                        return !1;
                    o = s(o, e);
                }
            return !0;
        }
    }
    class l extends e.SelectionHandler {
        constructor(t) {
            super(), (this.m_delegate = t);
        }
        getSelectionContext(t) {
            const e = t.activeElemInfo || t,
                n = {text: null, offset: -1},
                r = this.getSelectionArray(e);
            if (!(r && r.length > 0)) return null;
            n.offset = 0;
            const o = new Range();
            return (
                r.forEach((t) => {
                    try {
                        if (t.anchorNode && t.focusNode) {
                            const e = t.anchorNode.textContent.length,
                                r = t.focusNode.textContent.length;
                            if (e > 0 && r > 0) {
                                o.setStart(
                                    t.anchorNode,
                                    Math.max(0, Math.min(t.anchorOffset, e)),
                                ),
                                    o.setEnd(
                                        t.focusNode,
                                        Math.max(0, Math.min(t.focusOffset, r)),
                                    );
                                const s = o.toString();
                                s &&
                                    s.length > 0 &&
                                    (n.text
                                        ? (n.text = n.text.concat(
                                              " ",
                                              o.toString(),
                                          ))
                                        : (n.text = s));
                            }
                        }
                    } catch (t) {
                        console.warn(t);
                    }
                }),
                n
            );
        }
        getSelection(t) {
            const e = this.getSelectionArray(t);
            return e && e.length > 0 ? e[0] : null;
        }
        getSelectionArray(t) {
            const e = [];
            if (
                !t.element.matches("div.kix-appview-editor") &&
                !this.m_delegate.getRootNode(t).contains(t.element)
            )
                return e.push(t.element.ownerDocument.getSelection()), e;
            const n = t.document.querySelectorAll(
                    "div.kix-canvas-tile-selection > svg",
                ),
                r = n.length;
            for (let o = 0; o < r; o += 1)
                n[o].querySelectorAll("rect").forEach((n) => {
                    const r = n.getBoundingClientRect(),
                        o = this.getRangeForRect(t, r);
                    o &&
                        l.isValidNodeForSelection(o.anchorNode) &&
                        l.isValidNodeForSelection(o.focusNode) &&
                        e.push({
                            anchorNode: o.anchorNode,
                            focusNode: o.focusNode,
                            anchorOffset: o.anchorOffset,
                            focusOffset: o.focusOffset,
                        });
                });
            if (0 === e.length) {
                const n = this.m_delegate.caretPositioner.getCaretPosition(t);
                n &&
                    e.push({
                        anchorNode: n.anchorNode,
                        focusNode: n.anchorNode,
                        anchorOffset: n.anchorOffset,
                        focusOffset: n.anchorOffset,
                    });
            }
            return e;
        }
        getRangeForRect(t, e) {
            const n = {
                    anchorNode: null,
                    anchorOffset: -1,
                    focusNode: null,
                    focusOffset: -1,
                },
                r = (e.top + e.bottom) / 2;
            let o = this.m_delegate.caretPositioner.getCaretPositionFromPoint(
                    e.left,
                    r,
                    t.document,
                ),
                s = 2;
            for (; o && !l.isValidNodeForSelection(o.offsetNode) && s < 8; ) {
                const n = e.top + (r - e.top) / s;
                (o = this.m_delegate.caretPositioner.getCaretPositionFromPoint(
                    e.left + s,
                    n,
                    t.document,
                )),
                    (s += 1);
            }
            s = 2;
            let i = this.m_delegate.caretPositioner.getCaretPositionFromPoint(
                e.right,
                r,
                t.document,
            );
            for (; i && !l.isValidNodeForSelection(i.offsetNode) && s < 8; ) {
                const n = e.top + (r - e.top) / s;
                (i = this.m_delegate.caretPositioner.getCaretPositionFromPoint(
                    e.right - s,
                    n,
                    t.document,
                )),
                    (s += 1);
            }
            return (
                o &&
                    i &&
                    l.isValidNodeForSelection(o.offsetNode) &&
                    l.isValidNodeForSelection(i.offsetNode) &&
                    ((n.anchorNode = o.offsetNode),
                    (n.anchorOffset = o.offset),
                    (n.focusNode = i.offsetNode),
                    (n.focusOffset = i.offset)),
                n
            );
        }
        static isValidNodeForSelection(t) {
            return (
                !!t &&
                t.parentElement &&
                t.parentElement.matches("span.dji-canvas-word")
            );
        }
    }
    class a extends e.SelectionTextHighlighter {
        getHighlightedBoundingClientRect(t, e) {
            if (!(t && t.activeElementInfo && t.activeElementInfo.document))
                return null;
            const n = t.activeElementInfo.document.querySelector(
                t.activeElementInfo.canvasAnnoTagName,
            )?.shadowRoot;
            if (!n) return null;
            const r = n.getSelection();
            return r && "Range" === r.type
                ? r.getRangeAt(0).getBoundingClientRect()
                : null;
        }
    }
    function c(t) {
        const e = t.document || t.activeElemInfo?.document;
        if (!e) return null;
        const n = e.querySelector(t.canvasAnnoTagName);
        if (n && n.shadowRoot) {
            const t = n.shadowRoot.querySelector("div#dji-canvas-annotations");
            if (t) return t;
        }
        return null;
    }
    class u extends e.DocumentTextMapperDelegate {
        constructor() {
            super({
                type: "google.docs",
                markNodeValueSeparatorAsEmbedded: !0,
                isEditor: !0,
                clearSelectionAtEnd: !0,
            }),
                (this.mCanvasAnnoTagName =
                    window.dji.gdocsCanvasProjectionTagName || "dji-canvas");
        }
        get isLayered() {
            return !0;
        }
        get canvasAnnoTagName() {
            return this.mCanvasAnnoTagName;
        }
        get updateInProgress() {
            const t = c({
                document: document,
                canvasAnnoTagName: this.mCanvasAnnoTagName,
            });
            return !(!t || !t.hasAttribute("data-update-inprogress"));
        }
        get updatedAt() {
            const t = c({
                    document: document,
                    canvasAnnoTagName: this.mCanvasAnnoTagName,
                }),
                e = t && t.getAttribute("data-updated-at");
            return (e && parseInt(e, 10)) || void 0;
        }
        getRootNode(t) {
            t.canvasAnnoTagName = this.mCanvasAnnoTagName;
            const e = c(t);
            if (e) return e;
            const n = t.document.querySelector("div.kix-appview-editor");
            if (n) {
                return n.querySelector("div.kix-paginateddocumentplugin") || n;
            }
            return super.getRootNode(t);
        }
        createCaretPositioner() {
            return new o(this);
        }
        createParagraphIterator() {
            return new i();
        }
        createSelectionHandler() {
            return new l(this);
        }
        createTextHighlighter() {
            return new a();
        }
        getTextContentForNode(t, e = !0) {
            const n = t.classList ? t : t.parentElement;
            return n.classList.contains("goog-inline-block")
                ? this.getTextContentForGoogInlineBlock(n)
                : super.getTextContentForNode(t, e);
        }
        getValueForNode(t, e = !0) {
            return t.nodeType !== Node.TEXT_NODE
                ? super.getValueForNode(t, e)
                : this.getTextContentForNode(t, e);
        }
        getValueSeparatorForNode(t) {
            if (
                (t.classList ? t : t.parentElement).classList.contains(
                    "dji-canvas-word",
                )
            )
                return this.getSeparatorForWordInCanvasLine(t);
            const e = this.paragraphIterator;
            if (e && e.nodeIsLastInParagraph(t)) {
                const r = e.getParagraphForNode(t).textContent;
                for (let t = r.length - 1; t >= 0; t -= 1) {
                    const e = n.Utils.normalizedChar(r[t]);
                    if (
                        "" !== e &&
                        !n.CharSet.sentenceSeparator.characterIsMember(e)
                    ) {
                        if (
                            n.CharSet.wordSeparator.characterIsMember(e) ||
                            n.CharSet.invisibleWhiteSpace.characterIsMember(e)
                        )
                            continue;
                        return "\n";
                    }
                }
            }
            return super.getValueSeparatorForNode(t);
        }
        getTextContentForGoogInlineBlock(t) {
            const e = t.textContent;
            if (1 === e.length && 160 === e.charCodeAt(0)) {
                const n = t.parentElement.querySelectorAll(
                    "span.goog-inline-block",
                );
                let r = 0,
                    o = Number.MAX_VALUE;
                const s = n.length;
                for (let t = 0; t < s; t += 1) {
                    const e = n[t],
                        s = e.textContent;
                    if (1 === s.length && 160 === s.charCodeAt(0)) {
                        const t = Number.parseFloat(e.style.width);
                        (r = Math.max(r, t)), (o = Math.min(o, t));
                    }
                }
                const i = Number.parseFloat(t.style.width),
                    l =
                        Math.abs(i - o) <= 0.001
                            ? 1
                            : Math.floor(Math.max(r / i, 2));
                return l <= 1 ? e : e[0].repeat(l);
            }
            return super.getTextContentForNode(t);
        }
        static containsY(t, e) {
            return t.y <= e && e <= t.y + t.height;
        }
        static getClientRectForNode(t) {
            const e = document.createRange();
            return e.selectNodeContents(t), e.getBoundingClientRect();
        }
        getSeparatorForWordInCanvasLine(t) {
            let e = 0;
            const n = t.nodeType === Node.TEXT_NODE ? t : t.firstChild || t,
                o = this.caretPositioner.getCursorBoundingClientRect({
                    document: t.ownerDocument,
                });
            if (o) {
                const s = u.getClientRectForNode(t),
                    i = (o.top + o.bottom) / 2;
                u.containsY(s, i) &&
                    s.right < o.x &&
                    (e = r.getTrailingWhitespaceCountForNode(
                        n,
                        (o.left + o.right) / 2,
                        (o.top + o.bottom) / 2,
                    ));
            }
            const s = t.nodeType === Node.TEXT_NODE ? t.parentElement : t;
            if (null !== s.nextSibling) {
                const t =
                    s.nextSibling.nodeType === Node.TEXT_NODE
                        ? s.nextSibling
                        : s.nextSibling.firstChild || s.nextSibling;
                if (t) {
                    const o = s.dataset.lineno,
                        i = s.nextElementSibling;
                    if (o !== (i.dataset ? i.dataset.lineno : -1)) e += 1;
                    else {
                        const o = u.getClientRectForNode(t);
                        e += r.getTrailingWhitespaceCountForProximityNode(
                            n,
                            o.left,
                        );
                    }
                }
            }
            let i = e > 0 ? String(" ").repeat(e) : "";
            return null === s.nextSibling && (i = i.concat("\n")), i;
        }
    }
    const h = {
        editorIdRegEx:
            /^(?:editor|speakernotes)(?:[-_](?!paragraph|bg|workspace)\w+)+$/,
        paragraphIdRegEx:
            /^(?:editor|speakernotes)(?:[-_](?!paragraph|bg|workspace)\w+)+(?:[-_]paragraph)(?:[-_]\w+)*$/,
        blinkCursorClassName: "docs-text-ui-cursor-blink",
        workspaceId: "workspace",
        slidesViewId: "slides-view",
        speakerNotesId: "speakernotes",
        selectionPath1: "rect.sketchy-text-selection-overlay",
        selectionPath2:
            "g.sketchy-text-background + g > g > rect[fill-opacity]",
    };
    class d extends e.CaretPositioner {
        mHook = null;
        constructor(t, e) {
            super(t), (this.mHook = e);
        }
        getCaretPosition(t) {
            this.mHook.resetCaretPosition();
            const e = this.mHook.getCaret();
            if (!e) return null;
            const n = (e.left + e.right) / 2,
                r = (e.top + e.bottom) / 2;
            return this.getCaretPositionFromPoint(n, r, t.document);
        }
        getCaretPositionFromPoint(t, e, r) {
            const o = [],
                s = [];
            let i = null,
                l = null;
            try {
                do {
                    if (
                        ((i = n.Utils.caretPositionFromPoint(t, e, r)),
                        i.offsetNode === l)
                    ) {
                        (i.offsetNode = null), (i.offset = -1);
                        break;
                    }
                    (l = i.offsetNode),
                        i.offsetNode &&
                            null === i.offsetNode.nodeValue &&
                            (o.push(i.offsetNode.getAttribute("visibility")),
                            s.push(i.offsetNode),
                            i.offsetNode.setAttribute("visibility", "hidden"),
                            (i.offsetNode = null),
                            (i.offset = -1));
                } while (!i.offsetNode);
            } finally {
                const t = s.length;
                for (let e = 0; e < t; e += 1)
                    s[e].setAttribute("visibility", o[e]);
            }
            return {
                offsetNode: i.offsetNode,
                offset: i.offset,
                anchorNode: i.offsetNode,
                anchorOffset: i.offset,
            };
        }
        onMoveCaret(t, e) {
            super.onMoveCaret(t, e);
            const r = t.ownerDocument,
                o = r.getElementsByClassName(h.blinkCursorClassName);
            if (null !== o && 0 !== o.length)
                try {
                    const s = r.createRange();
                    s.setStart(t, e),
                        s.setEnd(t, Math.min(e + 1, t.textContent.length));
                    const i = s.getBoundingClientRect(),
                        l = n.Utils.computeCommonAncestor(t, o[0]);
                    let a = null;
                    const c = i.right;
                    let u = i.top;
                    if (
                        l.hasAttribute("id") &&
                        l.getAttribute("id") === h.slidesViewId
                    ) {
                        const t = r.getElementById(h.speakerNotesId);
                        if (!t) return;
                        if (((a = t.querySelector("svg")), !a)) return;
                    } else
                        (u = i.top + i.height / 2),
                            (a = r.elementFromPoint(c, u));
                    const d = {
                            bubbles: !0,
                            cancelable: !0,
                            clientX: c,
                            clientY: u,
                        },
                        m = new MouseEvent("mousedown", d),
                        g = new MouseEvent("mouseup", d);
                    window.requestIdleCallback(() => {
                        a.dispatchEvent(m),
                            a.isConnected || (a = r.elementFromPoint(c, u)),
                            a.dispatchEvent(g);
                    });
                } catch (t) {
                    n.Logger.error(t);
                }
        }
    }
    class m extends e.ParagraphIterator {
        constructor() {
            super("");
        }
        getParagraphForNode(t) {
            return this.getParentForNode(t, h.paragraphIdRegEx);
        }
        getParentForNode(t, e) {
            if (!t) return null;
            let n = t.nodeType === Node.ELEMENT_NODE ? t : t.parentElement;
            for (; n; ) {
                if (n.hasAttribute("id")) {
                    const t = n.getAttribute("id");
                    if (e.test(t)) return n;
                }
                n = n.parentElement;
            }
            return null;
        }
        nodeIsParagraph(t) {
            const e = t.nodeType === Node.ELEMENT_NODE ? t : null;
            return Boolean(
                e &&
                    e.hasAttribute("id") &&
                    h.paragraphIdRegEx.test(e.getAttribute("id")),
            );
        }
    }
    class g extends e.SelectionHandler {
        mDelegate = null;
        constructor(t) {
            super(), (this.mDelegate = t);
        }
        getSelection(t) {
            if (
                !Boolean(
                    "IFRAME" === t.element.tagName.toUpperCase() &&
                        t.element.classList.contains(
                            "docs-texteventtarget-iframe",
                        ),
                ) &&
                !this.mDelegate.getRootNode(t).contains(t.element)
            )
                return t.element.ownerDocument.getSelection();
            let e = t.document.querySelectorAll(h.selectionPath1);
            if (
                0 === e.length &&
                ((e = t.document.querySelectorAll(h.selectionPath2)),
                0 === e.length)
            )
                return t.element.ownerDocument.getSelection();
            const n = {
                    anchorNode: null,
                    anchorOffset: 0,
                    focusNode: null,
                    focusOffset: 0,
                },
                r = e[0],
                o = e[e.length - 1];
            let s = r.getBoundingClientRect(),
                i = (s.top + s.bottom) / 2;
            const l = this.mDelegate.caretPositioner.getCaretPositionFromPoint(
                s.left + 5,
                i,
                t.document,
            );
            if (!l) return n;
            r !== o &&
                ((s = o.getBoundingClientRect()), (i = (s.top + s.bottom) / 2));
            const a = this.mDelegate.caretPositioner.getCaretPositionFromPoint(
                s.right,
                i,
                t.document,
            );
            return a
                ? ((n.anchorNode = l.anchorNode),
                  (n.anchorOffset = l.anchorOffset),
                  (n.focusNode = a.anchorNode),
                  (n.focusOffset = a.anchorOffset),
                  n)
                : n;
        }
    }
    class p extends e.DocumentTextMapperDelegate {
        mHook = null;
        constructor(t) {
            super({
                type: "google.slides",
                markNodeValueSeparatorAsEmbedded: !1,
                isEditor: !0,
            }),
                (this.mHook = t);
        }
        getRootNode(t) {
            return (
                (t.document || document).querySelector("div#slides-view") ||
                super.getRootNode(t)
            );
        }
        acceptNodeForMapping(t, e, n) {
            if (
                super.acceptNodeForMapping(t, e, n) === NodeFilter.FILTER_ACCEPT
            )
                return NodeFilter.FILTER_ACCEPT;
            if (t.nodeType === Node.ELEMENT_NODE) {
                const n = t;
                if (
                    n.matches("div[aria-hidden='true']") ||
                    n.matches("div.docs-ui-unprintable") ||
                    n.matches("div.docos-show-more") ||
                    n.matches("div.docos-show-less")
                )
                    return NodeFilter.FILTER_REJECT;
                if (n.matches("div.sketchy-comment-anchor"))
                    return "rewordify" === e.requestFor
                        ? NodeFilter.FILTER_REJECT
                        : NodeFilter.FILTER_SKIP;
                const {style: r} = n;
                return r && "none" === r.getPropertyValue("display")
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_SKIP;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
        createCaretPositioner() {
            return new d(this, this.mHook);
        }
        createParagraphIterator() {
            return new m();
        }
        createSelectionHandler() {
            return new g(this);
        }
        getValueSeparatorForNode(t) {
            return " ";
        }
        getWorkspaceElement() {
            return document.getElementById(h.workspaceId);
        }
    }
    class f {
        static sSvgNamespaceUri = null;
        static elementIdMatchesRegExp(t, e) {
            return (
                null !== t &&
                t.hasAttribute("id") &&
                !0 === e.test(t.getAttribute("id"))
            );
        }
        static isEditor(t) {
            return (
                this.elementIdMatchesRegExp(t, h.editorIdRegEx) ||
                this.isSpeakernotes(t)
            );
        }
        static isParagraph(t) {
            return this.elementIdMatchesRegExp(t, h.paragraphIdRegEx);
        }
        static isSpeakernotes(t) {
            return (
                t.hasAttribute("id") &&
                t.getAttribute("id") === h.speakerNotesId
            );
        }
        static getCurrentPageElement() {
            const t = document.getElementById("pages");
            if (null === t) return null;
            const e = t.querySelectorAll("svg:not([style*='display: none;'])");
            return null === e || 0 === e.length ? null : e[0];
        }
        static getParentEditor(t) {
            let e = t.parentNode;
            for (; null !== e && f.isElement(e); ) {
                if (this.isEditor(e) || this.isSpeakernotes(e)) return e;
                if (e.hasAttribute("id")) {
                    const t = e.getAttribute("id");
                    if ("pages" === t || "filmstrip" === t) break;
                }
                e = e.parentNode;
            }
            return null;
        }
        static svgNamespaceUri() {
            if (!f.sSvgNamespaceUri) {
                const t = document.querySelector("svg");
                f.sSvgNamespaceUri = t ? t.namespaceURI : null;
            }
            return f.sSvgNamespaceUri;
        }
        static isElement(t) {
            return t && t.nodeType === Node.ELEMENT_NODE;
        }
        static isSVGElement(t) {
            return t && t.ownerSVGElement;
        }
    }
    class E extends e.ParaLineGuideImpl {
        static sOverlayParaFilterId = "dji-overlay-para-filter";
        static sOverlayLineFilterId = "dji-overlay-line-filter";
        static sDefsElemId = "dji-defs";
        setColors(t) {}
        paragraphAtPoint(t, e, n) {
            return E.ensureOverlayFilters(), E.getParagraphAtPoint(t, e, null);
        }
        lineAtPoint(t, e, n) {
            return E.ensureOverlayFilters(), E.getLineAtPoint(t, e, null);
        }
        highlightParagraphAt(t, e, n) {
            return !1;
        }
        clearHighlights(t) {
            return !1;
        }
        static ensureOverlayFilters() {
            if (document.getElementById(E.sOverlayLineFilterId)) return;
            const t = E.ensureDjiDefsElem(),
                e = E.createFilterElement(
                    "var(--dji-paracolor)",
                    this.sOverlayParaFilterId,
                    "",
                    !1,
                );
            t.appendChild(e);
            const n = E.createFilterElement(
                "var(--dji-linecolor)",
                this.sOverlayLineFilterId,
                "",
                !0,
            );
            t.appendChild(n);
        }
        static createFilterElement(t, e, n, r) {
            const o = document.createElementNS(f.svgNamespaceUri(), "filter");
            o.setAttribute("id", e),
                o.setAttribute("x", "-2%"),
                o.setAttribute("y", r ? "-1%" : "-2%"),
                o.setAttribute("width", "104%"),
                o.setAttribute("height", r ? "102%" : "104%"),
                o.setAttribute("filterUnits", "objectBoundingBox");
            const s = document.createElementNS(f.svgNamespaceUri(), "feFlood");
            s.setAttribute("id", n),
                s.setAttribute("flood-color", t),
                s.setAttribute("flood-opacity", "1");
            const i = document.createElementNS(
                f.svgNamespaceUri(),
                "feComposite",
            );
            return (
                i.setAttribute("in", "SourceGraphic"),
                o.appendChild(s),
                o.appendChild(i),
                o
            );
        }
        static ensureDjiDefsElem() {
            const t = document.getElementById(E.sDefsElemId);
            if (t) return t;
            const e = document.createElementNS(f.svgNamespaceUri(), "defs");
            e.setAttribute("id", E.sDefsElemId);
            const n = document.createElementNS(f.svgNamespaceUri(), "svg");
            return (
                n.setAttribute("id", "dji-svg"),
                n.setAttribute("visibility", "hidden"),
                n.appendChild(e),
                document.body.appendChild(n),
                e
            );
        }
        static getParagraphAtPoint(t, e, n) {
            let r = E.getParagraphAtPointFromEditor(
                t,
                e,
                n || E.getEditorAtPoint(t, e),
            );
            if (r) return r;
            const o = E.getAllEditorsAtPoint(t, e);
            if (!o || 0 === o.length) return null;
            const s = o.length;
            for (let n = 0; n < s; n += 1) {
                const s = o[n];
                if (((r = E.getParagraphAtPointFromEditor(t, e, s)), r))
                    return r;
            }
            return null;
        }
        static getLineAtPoint(t, e, n) {
            const r = n || E.getParagraphAtPoint(t, e, null);
            if (!f.isSVGElement(r)) return null;
            const o = r.ownerSVGElement.createSVGPoint();
            (o.x = t), (o.y = e);
            const s = r.getElementsByClassName("sketchy-text-content-text"),
                i = s.length;
            for (let t = 0; t < i; t += 1) {
                const e = s[t];
                if (this.elementContainsPoint(e, o)) return e;
            }
            return this.getProximityElement(s, o);
        }
        static getEditorAtPoint(t, e) {
            const n = document.elementFromPoint(t, e);
            return n ? f.getParentEditor(n) : null;
        }
        static getParagraphAtPointFromEditor(t, e, n) {
            if (!n) return null;
            const r = n.ownerSVGElement
                ? n.ownerSVGElement
                : n.querySelector("svg");
            if (!r) return null;
            const o = r.createSVGPoint();
            (o.x = t), (o.y = e);
            const s = n.querySelectorAll("g[id*='-paragraph-']"),
                i = s.length;
            for (let t = 0; t < i; t += 1) {
                const e = s[t];
                if (this.elementContainsPoint(e, o)) return e;
            }
            return this.getProximityElement(s, o);
        }
        static getAllEditorsAtPoint(t, e) {
            const n = f.getCurrentPageElement();
            if (!n) return null;
            const r = [],
                o = n.querySelectorAll("g[id^='editor']"),
                s = o.length;
            for (let n = 0; n < s; n += 1) {
                const s = o[n];
                if (!f.isEditor(s)) continue;
                const i = s.ownerSVGElement
                    ? s.ownerSVGElement
                    : s.querySelector("svg");
                if (!i) continue;
                const l = i.createSVGPoint();
                (l.x = t), (l.y = e), E.elementContainsPoint(s, l) && r.push(s);
            }
            return r;
        }
        static elementContainsPoint(t, e) {
            const r = E.mapPointToElement(e, t),
                o = t.getBBox();
            return n.DOMRectExtensions.contains(o, r.x, r.y);
        }
        static getProximityElement(t, e) {
            let n = null,
                r = Number.MAX_SAFE_INTEGER;
            const o = t.length;
            for (let s = 0; s < o; s += 1) {
                const o = t[s],
                    i = E.getVerticalVicinityAndHorizontalDisplacementOfElement(
                        o,
                        e,
                    );
                i.inVerticalVicinity &&
                    r > i.horizontalDisplacement &&
                    ((n = o), (r = i.horizontalDisplacement));
            }
            return n;
        }
        static getVerticalVicinityAndHorizontalDisplacementOfElement(t, e) {
            const n = E.mapPointToElement(e, t),
                r = t.getBBox();
            return {
                inVerticalVicinity: r.y <= n.y && r.y + r.height >= n.y,
                horizontalDisplacement: Math.abs(r.x + r.width - n.x),
            };
        }
        static mapPointToElement(t, e) {
            const n = e.getScreenCTM().inverse();
            return t.matrixTransform(n);
        }
    }
    class x {
        m_ime = null;
        m_mainObserver = null;
        m_svgObserver = null;
        m_currentEditorElement = null;
        m_currentParagraphElement = null;
        m_currentLineElement = null;
        m_currentTextElement = null;
        m_lastClickedSvgElement = null;
        m_cursorElement = null;
        m_cursorRect = null;
        m_installed = !1;
        m_dispatchingEvents = !1;
        m_lastState = null;
        m_mouseDownEventListener = (t) => {
            this.onWorkspaceMouseDown(t);
        };
        m_mouseUpEditorListener = (t) => {
            this.onWorkspaceMouseUp(t);
        };
        m_contentEditableOnFocusListener = (t) => {
            this.onFocus(t);
        };
        m_contentEditableOnBlurListener = (t) => {
            this.onBlur(t);
        };
        m_contentEditableOnKeyDownListener = (t) => {
            this.onKeyDown(t);
        };
        m_contentEditableOnKeyUpListener = (t) => {
            this.onKeyUp(t);
        };
        m_contentEditableOnKeyPressListener = (t) => {
            this.onKeyPress(t);
        };
        m_caretEventTarget = null;
        m_windowProxy = null;
        constructor(t, e, n) {
            (this.m_ime = t), (this.m_windowProxy = n), this.initialize(e);
        }
        install() {
            this.installMainObserver();
        }
        uninstall() {
            this.unistallMainObserver(),
                this.uninstallSvgListeners(),
                this.removeEventListenersForEditableContent(),
                this.uninstallSvgObserver(),
                (this.m_installed = !1),
                this.resetCurrentElements(!0);
        }
        reload() {}
        getState() {
            const t = this.m_installed && this.hasFocus();
            return {
                installed: this.m_installed,
                cursorRect: this.cursorRect(),
                selectionRects: this.currentSelection(),
                active: t,
                hook: t ? this : null,
                editor: t ? this.getContentEditableElement() : null,
            };
        }
        isInstalled() {
            return this.m_installed;
        }
        resetCaretPosition() {
            this.m_cursorRect = null;
        }
        getCaret() {
            const t = this.cursorRect();
            return null === t
                ? null
                : {
                      left: t.x,
                      top: t.y,
                      right: t.x + t.width,
                      bottom: t.y + t.height,
                  };
        }
        setTrueKeyMode() {}
        getContext(t, e, r, o) {
            this.resetCacheIfStatic();
            let s = "",
                i = 0,
                l = 0,
                a = 0,
                c = !1,
                u = this.currentTextElement();
            const h = this.currentParagraphElement();
            let d = !r && (void 0 === o || Boolean(!o)),
                m = !r;
            const g = {},
                p = e
                    ? [f.getCurrentPageElement(), this.getSpeakerNotesElement()]
                    : [this.currentEditorElement()],
                E = p.length;
            for (let t = 0; t < E; t += 1) {
                const e = p[t];
                if (e) {
                    const t = e.querySelectorAll("g[id*='-paragraph-']"),
                        r = t.length;
                    for (let e = 0; e < r; e += 1) {
                        let r = t[e];
                        if (f.isParagraph(r)) {
                            const t = r;
                            if (((d = d || r === h), !d)) continue;
                            let e = t.ownerSVGElement.createSVGPoint();
                            const o = r.getElementsByClassName(
                                    "sketchy-text-content-text",
                                ),
                                p = o.length;
                            for (let t = 0; t < p; t += 1) {
                                const h = o[t],
                                    d = this.selectionRectForLine(h),
                                    p = h.querySelectorAll("text"),
                                    f = p.length;
                                let E = !0;
                                for (let t = 0; t < f; t += 1) {
                                    const o = p[t];
                                    if (((m = m || o === u), !m)) continue;
                                    E &&
                                        ((E = !1),
                                        s.length > 0 &&
                                            ((s += "\n"),
                                            (a += 1),
                                            (g[s.length] = "\n"),
                                            c && (l += 1))),
                                        0 !== a &&
                                            " " !== s[s.length - 1] &&
                                            ((s += " "),
                                            (a += 1),
                                            c && (l += 1));
                                    const h = o.textContent;
                                    if (
                                        ((s += h),
                                        null !== d &&
                                            this.nodeIntersectsRect(o, d, null))
                                    ) {
                                        const t = o.getScreenCTM(),
                                            r = o.getNumberOfChars();
                                        for (let s = 0; s < r; s += 1) {
                                            const r = o.getExtentOfChar(s);
                                            (e.x = r.x),
                                                (e.y = r.y),
                                                (e = e.matrixTransform(t)),
                                                n.DOMRectExtensions.contains(
                                                    d,
                                                    e.x,
                                                    e.y,
                                                )
                                                    ? ((l += 1),
                                                      (i = 1 === l ? a : i),
                                                      (c = !0))
                                                    : (c = !1),
                                                (a += 1);
                                        }
                                    } else {
                                        if (
                                            (null === u &&
                                                (u = this.currentTextElement()),
                                            o === u)
                                        ) {
                                            const t = this.cursorPosition();
                                            let e = 0;
                                            if (null !== t) {
                                                const n = o.getNumberOfChars();
                                                for (; e < n; e += 1) {
                                                    const n =
                                                        this.mapRectToElement(
                                                            o.getExtentOfChar(
                                                                e,
                                                            ),
                                                            o,
                                                            r,
                                                        );
                                                    if (
                                                        t.midLeft <
                                                        n.x + n.width / 2
                                                    )
                                                        break;
                                                }
                                            }
                                            (i = a + e),
                                                this.caretIsPastCurrentWord() &&
                                                    ((s += " "),
                                                    (a += 1),
                                                    (i += 1));
                                        }
                                        (a += h.length), (c = !1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return {
                selection: {start: i, length: l},
                text: s,
                custom: {
                    embeddedLocations: g,
                    caretIsPastCurrentWord: this.caretIsPastCurrentWord(),
                },
                extended: {text: s, selection: {start: i, length: l}},
            };
        }
        getContextWithParams(t) {
            if ((this.resetCacheIfStatic(), Boolean(t && t.fillMappings)))
                return this.getContextWithMappings(t);
            const e = Boolean(t && t.entireDocument),
                n = Boolean(t && t.fromCaretToEnd);
            return e || n
                ? this.getContext(null, e, n, !1)
                : this.getContextFromSelection(
                      Boolean(t && t.completePartiallySelectedWords),
                      !1,
                  );
        }
        getSelectionRects() {
            if ((this.resetCacheIfStatic(), !this.hasSelection())) return null;
            const t = this.currentEditorElement();
            if (!t) return null;
            const e = [],
                n = t.querySelectorAll("g[id*='-paragraph-']"),
                r = n.length;
            for (let t = 0; t < r; t += 1) {
                const r = n[t];
                if (f.isParagraph(r)) {
                    const t = r.getElementsByClassName(
                            "sketchy-text-content-text",
                        ),
                        n = t.length;
                    for (let r = 0; r < n; r += 1) {
                        const n = t[r],
                            o = this.selectionForLine(n);
                        if (o) {
                            let t = o.getScreenCTM();
                            t = t.translate(
                                o.x.baseVal.value,
                                o.y.baseVal.value,
                            );
                            const n = t
                                ? new DOMMatrix([t.a, t.b, t.c, t.d, t.e, t.f])
                                : null;
                            e.push({
                                rect: o.getBoundingClientRect(),
                                bbox: o.getBBox(),
                                matrix: n,
                            });
                        }
                    }
                }
            }
            return e;
        }
        getSelectedText() {
            this.resetCacheIfStatic();
            const t = this.getContextFromSelection(!1, !1);
            return t ? t.text.trim() : "";
        }
        clearSelection() {
            document.getSelection().empty();
        }
        getAllText() {
            let t = "";
            const e = document.getElementById("pages");
            if (null === e) return t;
            const n = e.querySelectorAll("svg");
            if (null === n || 0 === n.length) return t;
            const r = n.length;
            for (let e = 0; e < r; e += 1) {
                const r = n[e];
                (t += this.getPageText(r)), (t += "\r\n");
            }
            return t;
        }
        getCurrentPageText() {
            return this.getPageText(f.getCurrentPageElement());
        }
        getPageText(t) {
            let e = "";
            if (null === t) return e;
            const n = t.querySelectorAll("g[id*='-paragraph-']"),
                r = n.length;
            for (let t = 0; t < r; t += 1) {
                const r = n[t];
                f.isParagraph(r) &&
                    ((e += this.getParagraphText(r)), (e += "\r\n"));
            }
            return e;
        }
        getContextForMomentaryTopic(t, e) {
            e(this.getAllText());
        }
        async replaceText(t, e, r) {
            if (this.m_dispatchingEvents)
                return void n.Logger.warn(
                    "Ignoring replaceText() request while dispatching! ",
                    e,
                );
            if (0 === r.selection.length && r.selection.start < e.selection.end)
                for (let t = e.selection.end; t > e.selection.start; t -= 1)
                    t in r.custom.embeddedLocations &&
                        (e.selection.end = t - 1);
            const o =
                void 0 !== e.removeLeadingSpaces && !!e.removeLeadingSpaces;
            o && (await this.removeLeadingSpacesAsync());
            const s = r.custom.caretIsPastCurrentWord ? 1 : 0;
            (e.extended = {
                rightKey: Math.max(
                    0,
                    0 !== r.selection.length || o
                        ? 0
                        : e.selection.end - r.selection.start - s,
                ),
                backspaceKey: Math.max(
                    0,
                    0 !== r.selection.length || o
                        ? 0
                        : e.selection.end - e.selection.start - s,
                ),
            }),
                this.dispatchEvent("text", e);
        }
        async acquireTextForTopicAsync(t) {
            let e = null;
            return (
                "selection" === t
                    ? (e = this.getSelectedText())
                    : "page" === t && (e = this.getCurrentPageText()),
                e
            );
        }
        shouldIgnoreMutations() {
            return !0;
        }
        getActiveElement() {
            return this.getContentEditableElement();
        }
        resetCacheIfStatic() {
            this.m_ime || this.resetCurrentElements();
        }
        getContextWithMappingsFromCaretToEnd() {
            if (!this.cursorPosition()) return null;
            const t = this.currentTextElement();
            if (!t) return null;
            const e = this.currentParagraphElement();
            return e
                ? this.getContextWithMappingsFromStartingElements(t, e)
                : null;
        }
        getContextWithMappingsForEntireDocument() {
            if (!this.cursorPosition()) return null;
            let t = this.currentEditorElement();
            if (!t) return null;
            const e = [t.previousElementSibling, t];
            for (t = t.nextElementSibling; t; )
                e.push(t), (t = t.nextElementSibling);
            return (
                e.push(this.getSpeakerNotesElement()),
                this.getContextWithMappingsForEditors(e)
            );
        }
        getContextWithMappingsForCurrentEditor() {
            if (!this.cursorPosition()) return null;
            const t = this.currentEditorElement();
            return t ? this.getContextWithMappingsForEditors([t]) : null;
        }
        getContextWithMappingsForEditors(t) {
            let e = [];
            const n = t.length;
            for (let r = 0; r < n; r += 1) {
                const n = t[r];
                if (!n) continue;
                const o = n.querySelectorAll("g[id*='-paragraph-']");
                0 !== o.length && (e = e.concat([...o]));
            }
            const r = [];
            let o = "",
                s = 0,
                i = 0;
            const l = " ",
                a = this.currentTextElement(),
                c = e.length;
            for (let t = 0; t < c; t += 1) {
                const n = e[t];
                if (!f.isParagraph(n)) continue;
                const c = n.querySelectorAll("text");
                let u = null;
                const h = c.length;
                for (let t = 0; t < h; t += 1) {
                    const e = c[t];
                    if (
                        ((i = 0),
                        r.length > 0 &&
                            o[o.length - 1] !== l &&
                            (this.updateMappings(l, i, !0, r, u || e),
                            (o += l)),
                        e === a)
                    ) {
                        const t = this.cursorOrSelection();
                        let a = 0;
                        if (t) {
                            const r = this.consolidatedPositionForNode(t),
                                o = e.getNumberOfChars();
                            for (; a < o; a += 1) {
                                const t = this.mapRectToElement(
                                    e.getExtentOfChar(a),
                                    e,
                                    n,
                                );
                                if (r.midLeft < t.x + t.width / 2) break;
                            }
                        }
                        (s = r.length + a),
                            this.caretIsPastElement(e) &&
                                (this.updateMappings(l, i, !0, r, e),
                                (o += l),
                                (s += 1));
                    }
                    if (e.children && e.children.length > 0) {
                        const t = e.children.length;
                        for (let n = 0; n < t; n += 1) {
                            const t = e.children[n],
                                s = this.updateMappingsFromNode(t, i, r);
                            (o += s), (i += s.length);
                        }
                    } else {
                        const t = this.updateMappingsFromNode(e, i, r);
                        (o += t), (i += t.length);
                    }
                    u = e;
                }
            }
            return {
                selection: {start: s, length: 0},
                text: o,
                custom: {
                    embeddedLocations: {},
                    caretIsPastCurrentWord: this.caretIsPastCurrentWord(),
                    map: r,
                    selectionOffset: s,
                },
                extended: {text: o, selection: {start: s, length: 0}},
            };
        }
        getContextWithMappingsFromStartingElements(t, e) {
            const n = [];
            let r = "",
                o = 0,
                s = 0;
            const i = " ";
            let l = null === t,
                a = null === e;
            const c = [
                    f.getCurrentPageElement(),
                    this.getSpeakerNotesElement(),
                ],
                u = c.length;
            for (let h = 0; h < u; h += 1) {
                const u = c[h].querySelectorAll("g[id*='-paragraph-']"),
                    d = u.length;
                for (let c = 0; c < d; c += 1) {
                    const h = u[c];
                    if (!f.isParagraph(h)) continue;
                    if (((a = a || h === e), !a)) continue;
                    const d = h.querySelectorAll("text"),
                        m = d.length;
                    for (let a = 0; a < m; a += 1) {
                        const c = d[a];
                        if (((l = l || c === t), l)) {
                            if (
                                ((s = 0),
                                n.length > 0 &&
                                    r[r.length - 1] !== i &&
                                    (this.updateMappings(i, s, !0, n, c),
                                    (r += i)),
                                c === t)
                            ) {
                                const t = this.cursorOrSelection();
                                let l = 0;
                                if (t) {
                                    const n =
                                            this.consolidatedPositionForNode(t),
                                        r = c.getNumberOfChars();
                                    for (; l < r; l += 1) {
                                        const t = this.mapRectToElement(
                                            c.getExtentOfChar(l),
                                            c,
                                            e,
                                        );
                                        if (n.midLeft < t.x + t.width / 2)
                                            break;
                                    }
                                }
                                (o = n.length + l),
                                    this.caretIsPastCurrentWord() &&
                                        (this.updateMappings(i, s, !0, n, c),
                                        (r += i));
                            }
                            if (c.children && c.children.length > 0) {
                                const {children: t} = c,
                                    e = t.length;
                                for (let o = 0; o < e; o += 1) {
                                    const e = t[o],
                                        i = this.updateMappingsFromNode(
                                            e,
                                            s,
                                            n,
                                        );
                                    (r += i), (s += i.length);
                                }
                            } else {
                                const t = this.updateMappingsFromNode(c, s, n);
                                (r += t), (s += t.length);
                            }
                        }
                    }
                }
            }
            return {
                selection: {start: o, length: 0},
                text: r,
                custom: {
                    embeddedLocations: {},
                    caretIsPastCurrentWord: this.caretIsPastCurrentWord(),
                    map: n,
                },
                extended: {text: r, selection: {start: o, length: 0}},
            };
        }
        updateMappingsFromNode(t, e, n) {
            const r = t.textContent.replace(/\u200B/g, ""),
                o = r.length;
            for (let s = 0; s < o; s += 1)
                this.updateMappings(r.charAt(s), e + s, !1, n, t);
            return (e += o), r;
        }
        getContextFromSelection(t, e) {
            const r = this.currentEditorElement();
            if (!r) return null;
            const o = e ? [] : void 0;
            let s = "",
                i = 0,
                l = 0,
                a = 0,
                c = !1,
                u = !1;
            const h = r.querySelectorAll("g[id*='-paragraph-']"),
                d = h.length;
            for (let r = 0; r < d; r += 1) {
                const d = h[r];
                if (!f.isParagraph(d)) continue;
                const m = d.getElementsByClassName("sketchy-text-content-text"),
                    g = m.length;
                for (let r = 0; r < g; r += 1) {
                    const h = m[r],
                        g = this.selectionForLine(h);
                    if (!g) continue;
                    const p = this.mapToElement(g, d),
                        f = h.querySelectorAll("text"),
                        E = f.length;
                    for (let r = 0; r < E; r += 1) {
                        const h = f[r];
                        if (!this.nodeIntersectsRect(h, p, d)) continue;
                        0 !== a &&
                            " " !== s[s.length - 1] &&
                            (e && this.updateMappings(" ", a, !0, o, h),
                            (s += " "),
                            (a += 1),
                            c && (l += 1));
                        const m =
                                h.children && h.children.length > 0
                                    ? h.children
                                    : [h],
                            g = m.length;
                        for (let r = 0; r < g; r += 1) {
                            const h = m[r],
                                g = this.nodeIntersectsRect(h, p, d),
                                f = h.textContent,
                                E = h.getNumberOfChars();
                            let x = 0;
                            for (let r = 0; r < E; r += 1) {
                                let m = !1;
                                if (g && t) m = !0;
                                else {
                                    const t = this.mapRectToElement(
                                        h.getExtentOfChar(r),
                                        h,
                                        d,
                                    );
                                    m = n.DOMRectExtensions.contains(
                                        p,
                                        t.x + t.width / 2,
                                        t.y + t.height / 2,
                                    );
                                }
                                if (m) {
                                    const t = f.charAt(r);
                                    if ("​" === t) {
                                        x += 1;
                                        continue;
                                    }
                                    (l += 1),
                                        (i = 1 === l ? a : i),
                                        (c = !0),
                                        e &&
                                            this.updateMappings(
                                                t,
                                                a + r - x,
                                                !1,
                                                o,
                                                h,
                                            ),
                                        (s += t),
                                        (a += 1);
                                } else (u = c), (c = !1);
                                if (u) break;
                            }
                        }
                        if (u) break;
                    }
                    if (u) break;
                }
                if (u) break;
            }
            return {
                selection: {start: i, length: l},
                text: s,
                custom: {
                    embeddedLocations: {},
                    caretIsPastCurrentWord: this.caretIsPastCurrentWord(),
                    map: o,
                },
                extended: {text: s, selection: {start: i, length: l}},
            };
        }
        getContextWithMappings(t) {
            return t && t.fromCaretToEnd
                ? this.getContextWithMappingsFromCaretToEnd()
                : t && t.entireDocument
                  ? this.getContextWithMappingsForEntireDocument()
                  : this.getContextFromSelection(
                        Boolean(t && t.completePartiallySelectedWords),
                        !0,
                    );
        }
        updateMappings(t, e, n, r, o) {
            r &&
                r.push({
                    index: r.length,
                    element: o,
                    offset: e,
                    text: t,
                    embedded: n,
                });
        }
        nodeIntersectsRect(t, e, n) {
            const r = n ? this.mapToElement(t, n) : t.getBoundingClientRect();
            return r.x < e.x ? r.x + r.width > e.x : r.x < e.x + e.width;
        }
        lineHasSelection(t) {
            return t && this.selectionForLine(t);
        }
        selectionForLine(t) {
            let e = t;
            for (; e && e.parentNode && !f.isParagraph(e.parentNode); )
                e = e.parentNode;
            const n = e.querySelectorAll(h.selectionPath);
            return n && n.length > 0 ? n[0] : null;
        }
        selectionRectForLine(t) {
            const e = this.selectionForLine(t);
            return e ? e.getBoundingClientRect() : null;
        }
        caretIsPastCurrentWord() {
            return this.caretIsPastElement(this.currentTextElement());
        }
        caretIsPastElement(t) {
            if (null === t) return !1;
            const {textContent: e} = t;
            if (null === e || 0 === e.length) return !1;
            const n = this.cursorElement();
            if (null === n) return !1;
            const r = this.mapToElement(t, this.currentParagraphElement()),
                o = n.getBBox();
            return o.x > r.x + r.width + o.width / 2;
        }
        caretIsAfterWhitespace() {
            if (null === this.cursorElement()) return !1;
            const t = this.currentTextElement();
            if (null === t) return !1;
            const {textContent: e} = t;
            if (null === e || 0 === e.length) return !1;
            const n = this.currentParagraphElement(),
                r = this.mapToElement(t, n),
                o = this.cursorElement().getBBox();
            if (o.x - o.width / 2 < r.x) {
                const e = t.previousSibling;
                if (null === e) return !1;
                const r = this.mapToElement(e, n);
                return r.x + r.width + o.width < o.x;
            }
            return o.x > r.x + r.width + o.width / 2;
        }
        mapToElement(t, e) {
            const n = t.getBBox();
            return this.mapRectToElement(n, t, e);
        }
        mapRectToElement(t, e, n) {
            const r = e.ownerSVGElement.createSVGPoint(),
                o = new DOMRect(t.x, t.y, t.width, t.height);
            let s = e;
            for (; null !== s && 1 === s.nodeType; ) {
                const t = s.hasAttribute("transform")
                    ? s.transform.baseVal.consolidate()
                    : null;
                if (null !== t) {
                    (r.x = o.x), (r.y = o.y);
                    const e = r.matrixTransform(t.matrix);
                    (r.x += o.width), (r.y += o.height);
                    const n = r.matrixTransform(t.matrix);
                    (o.x = e.x),
                        (o.y = e.y),
                        (o.width = n.x - e.x),
                        (o.height = n.y - e.y);
                }
                if (s === n) break;
                s = s.parentNode;
            }
            return o;
        }
        async removeLeadingSpacesAsync() {
            const t = this;
            return new Promise((e) => {
                t.caretIsAfterWhitespace()
                    ? ((t.m_caretEventTarget = new EventTarget()),
                      t.m_caretEventTarget.addEventListener(
                          "com.donjohnston.cwu.caretPositionChanged",
                          (n) => {
                              if (!t.caretIsAfterWhitespace())
                                  return (
                                      (t.m_caretEventTarget = null), void e()
                                  );
                              !t.dispatchEvent("deleteBackward", null) &&
                                  ((t.m_caretEventTarget = null), e());
                          },
                      ),
                      !t.dispatchEvent("deleteBackward", null) &&
                          ((t.m_caretEventTarget = null), e()))
                    : e();
            });
        }
        getSlidesViewElement() {
            return document.getElementById(h.slidesViewId);
        }
        getSpeakerNotesElement() {
            return document.getElementById(h.speakerNotesId);
        }
        getParagraphText(t) {
            let e = "";
            if (null !== t) {
                const n = t.getElementsByClassName("sketchy-text-content"),
                    r = n.length;
                for (let t = 0; t < r; t += 1) {
                    const r = n[t].querySelectorAll("text"),
                        o = r.length;
                    for (let t = 0; t < o; t += 1)
                        (e += r[t].textContent), (e += " ");
                }
            }
            return e;
        }
        dispatchEvent(t, e) {
            if (!this.m_windowProxy) return !1;
            const r = new CustomEvent("com.donjohnston.cwu.dispatch", {
                detail: {command: t, params: e},
            });
            let o = !1;
            try {
                (this.m_dispatchingEvents = !0),
                    (o = this.m_windowProxy.dispatchEvent(r));
            } catch (t) {
                n.Logger.error(t);
            } finally {
                this.m_dispatchingEvents = !1;
            }
            return o;
        }
        initialize(t) {
            if (!this.m_ime) return;
            const e = (t = t || document.documentElement).getRootNode(),
                {ownerDocument: r} = e,
                o = r.createElement("script");
            (o.type = "text/javascript"),
                (o.async = !0),
                (o.src = chrome.extension.getURL(
                    "WebExtensions/selection/cweEventDispatcherGS.js",
                )),
                (o.onload = function () {
                    n.Logger.log("Javascript for Google Slides downloaded!");
                }),
                t.appendChild(o);
        }
        installMainObserver() {
            (this.m_mainObserver = new MutationObserver((t) => {
                this.checkIsDocumentLoadedAndContinue();
            })),
                this.m_mainObserver.observe(document, {
                    subtree: !0,
                    childList: !0,
                }),
                this.checkIsDocumentLoadedAndContinue();
        }
        unistallMainObserver() {
            null !== this.m_mainObserver &&
                (this.m_mainObserver.disconnect(),
                (this.m_mainObserver = null));
        }
        checkIsDocumentLoadedAndContinue() {
            this.isDocumentLoaded() &&
                (!this.m_installed && this.m_ime && this.installSvgListeners(),
                this.unistallMainObserver(),
                (this.m_installed = !0),
                this.updatePredictionState());
        }
        isDocumentLoaded() {
            return (
                !!document.getElementById(h.workspaceId) &&
                !!document.getElementById("pages") &&
                !!document.getElementById(h.speakerNotesId) &&
                0 !==
                    document.getElementsByClassName(
                        "docs-texteventtarget-iframe",
                    ).length
            );
        }
        installSvgListeners() {
            const t = document.getElementById("pages"),
                e = document.getElementById(h.speakerNotesId);
            this.addEventListenersForElement(t),
                this.addEventListenersForElement(e),
                this.addEventListenersForEditableContent(),
                this.installSvgObserver();
        }
        uninstallSvgListeners() {
            const t = document.getElementById("pages");
            null !== t && this.removeEventListenersForElement(t);
            const e = document.getElementById(h.speakerNotesId);
            null !== e && this.removeEventListenersForElement(e);
        }
        installSvgObserver() {
            const t = document.getElementById(h.workspaceId),
                e = document.getElementById(h.speakerNotesId),
                n = {
                    subtree: !0,
                    childList: !0,
                    attributes: !0,
                    attributeFilter: ["style", "x", "y", "class"],
                    attributeOldFilter: !1,
                };
            (this.m_svgObserver = new MutationObserver((t) => {
                this.onDOMSubtreeModified(t);
            })),
                this.m_svgObserver.observe(t, n),
                this.m_svgObserver.observe(e, n);
        }
        uninstallSvgObserver() {
            null !== this.m_svgObserver &&
                (this.m_svgObserver.disconnect(), (this.m_svgObserver = null));
        }
        onDOMSubtreeModified(t) {
            let e = !1;
            if (((this.m_cursorElement = null), this.hasFocus() && t)) {
                const n = t.length;
                for (let r = 0; r < n; r += 1) {
                    const n = t[r];
                    if ("childList" === n.type) {
                        if (t.removedNodes) {
                            const n = t.removedNodes.length;
                            for (let r = 0; r < n; r += 1) {
                                const n = t.removedNodes[r];
                                this.isSelectionMarker(n) && (e = !0);
                            }
                        }
                        if (t.addedNodes) {
                            const n = t.addedNodes.length;
                            for (let r = 0; r < n; r += 1) {
                                const n = t.addedNodes[r];
                                this.isSelectionMarker(n) && (e = !0);
                            }
                        }
                        continue;
                    }
                    if ("attributes" !== n.type) continue;
                    const o = n.target;
                    this.isSelectionMarker(o)
                        ? (e = !0)
                        : this.isCursor(o) && (this.m_cursorElement = o);
                }
            }
            (this.m_cursorElement || e || !this.hasFocus()) &&
                ((this.m_cursorElement &&
                    this.setCursorRect(
                        this.m_cursorElement.getBoundingClientRect(),
                    )) ||
                    e ||
                    !this.hasFocus()) &&
                this.updatePredictionState();
        }
        isCursor(t) {
            if (
                "rect" !== t.nodeName ||
                "1" !== t.style.opacity ||
                0 === t.width.baseVal.value ||
                0 === t.height.baseVal.value
            )
                return !1;
            if (
                t.hasAttribute("class") &&
                t.getAttribute("class") === h.blinkCursorClassName
            )
                return !0;
            let {parentNode: e} = t;
            for (; null !== e; ) {
                if (
                    e === this.m_currentLineElement ||
                    e === this.m_lastClickedSvgElement
                )
                    return !0;
                e = e.parentNode;
            }
            return !1;
        }
        isSelectionMarker(t) {
            return t.matches(h.selectionPath);
        }
        onWorkspaceMouseDown(t) {
            const e = t.composedPath()[0];
            f.isSVGElement(e) &&
                (this.setLastClickedSvgElement(e),
                this.resetCurrentElements(!0),
                this.m_ime.onEditorEvent(this, null, t),
                this.m_ime.onMouseDown(this, t));
        }
        onWorkspaceMouseUp(t) {
            const e = t.composedPath()[0];
            f.isSVGElement(e) &&
                (this.setLastClickedSvgElement(e),
                this.hasSelection() || this.resetCurrentElements(!0),
                this.m_ime.onEditorEvent(this, null, t),
                this.m_ime.onMouseUp(this, t));
        }
        resetCurrentElements(t = !1) {
            (this.m_currentEditorElement = null),
                (this.m_currentParagraphElement = null),
                (this.m_currentLineElement = null),
                (this.m_currentTextElement = null),
                (this.m_cursorElement = null),
                t && (this.m_cursorRect = null);
        }
        currentEditorElement() {
            return (
                (null !== this.m_currentEditorElement &&
                    null !== this.m_currentEditorElement.ownerSVGElement) ||
                    (this.m_currentEditorElement =
                        this.computeCurrentEditorElement()),
                this.m_currentEditorElement
            );
        }
        currentParagraphElement() {
            return (
                (null !== this.m_currentParagraphElement &&
                    null !== this.m_currentParagraphElement.ownerSVGElement) ||
                    (this.m_currentParagraphElement =
                        this.computeCurrentParagraphElement()),
                this.m_currentParagraphElement
            );
        }
        currentLineElement() {
            return (
                (null !== this.m_currentLineElement &&
                    null !== this.m_currentLineElement.ownerSVGElement) ||
                    (this.m_currentLineElement =
                        this.computeCurrentLineElement()),
                this.m_currentLineElement
            );
        }
        currentTextElement() {
            return (
                (null !== this.m_currentTextElement &&
                    null !== this.m_currentTextElement.ownerSVGElement) ||
                    (this.m_currentTextElement =
                        this.computeCurrentTextElement()),
                this.m_currentTextElement
            );
        }
        currentSelectionElements() {
            const t = document.getElementById(h.slidesViewId);
            return null === t ? null : t.querySelectorAll(h.selectionPath);
        }
        hasSelection() {
            const t = this.currentSelectionElements();
            return t && t.length > 0;
        }
        currentSelection() {
            const t = this.currentSelectionElements(),
                e = [],
                n = t.length;
            for (let r = 0; r < n; r += 1) {
                const n = t[r];
                e.push(n.getBoundingClientRect());
            }
            return e;
        }
        computeCurrentTextElement() {
            const t = this.currentLineElement();
            if (null === t) return null;
            const e = this.cursorOrSelection();
            if (null === e) return null;
            const r = e.getBBox(),
                o = new DOMRect(r.x, r.y, r.width, r.height);
            let s = null;
            const i = t.querySelectorAll("text"),
                l = i.length;
            for (let t = 0; t < l; t += 1) {
                const e = i[t],
                    r = e.getBBox(),
                    l = new DOMRect(r.x, r.y, r.width, r.height);
                if (n.DOMRectExtensions.intersectsRect(o, l)) return e;
                o.x > l.x && (s = e);
            }
            return null !== s ? s : i.length > 0 ? i[i.length - 1] : null;
        }
        computeCurrentEditorElement() {
            let t = this.cursorOrSelection();
            if (null === t) return null;
            let e = t.parentNode;
            for (; e && "function" == typeof e.hasAttribute; ) {
                const t = e;
                if (t.hasAttribute("id")) {
                    const n = t.getAttribute("id");
                    if (!0 === h.paragraphIdRegEx.test(n)) {
                        (this.m_currentParagraphElement = t),
                            (e = t.parentNode);
                        continue;
                    }
                    if (!0 === h.editorIdRegEx.test(n)) return e;
                    if ("pages" === n) break;
                    if (n === h.speakerNotesId) return e;
                }
                e = t.parentNode;
            }
            return null;
        }
        computeCurrentParagraphElement() {
            const t = this.currentEditorElement();
            if (null === t) return null;
            if (this.m_currentParagraphElement)
                return this.m_currentParagraphElement;
            const e = this.cursorOrSelection();
            if (null === e) return null;
            const r = t.querySelectorAll("g[id*='-paragraph-']"),
                o = r.length;
            for (let t = 0; t < o; t += 1) {
                const o = r[t];
                if (n.Utils.computeCommonAncestor(e, o) === o) return o;
            }
            const s = e.getBoundingClientRect();
            return E.getParagraphAtPoint(s.x, s.y + s.height / 2, t);
        }
        computeCurrentLineElement() {
            const t = this.currentParagraphElement();
            if (null === t) return null;
            const e = this.cursorOrSelection();
            if (null === e) return null;
            const r = t.getElementsByClassName("sketchy-text-content-text"),
                o = r.length;
            for (let t = 0; t < o; t += 1) {
                const o = r[t],
                    s = n.Utils.computeCommonAncestor(e, o);
                if (s === o.parentNode || s === o.parentNode.parentNode)
                    return o;
            }
            const s = e.getBoundingClientRect();
            return (
                E.getLineAtPoint(s.x, s.y + s.height / 2, t) ||
                (r.length > 0 ? r[r.length - 1] : null)
            );
        }
        cursorOrSelection() {
            let t = this.cursorElement();
            if (null === t) {
                const e = this.currentSelectionElements();
                t = e && e.length > 0 ? e[0] : null;
            }
            return t;
        }
        cursorElement() {
            return (
                (null !== this.m_cursorElement &&
                    null !== this.m_cursorElement.ownerSVGElement) ||
                    (this.m_cursorElement = this.computeCurrentCursorElement()),
                this.m_cursorElement
            );
        }
        computeCurrentCursorElement() {
            const t = this.computeCurrentCursorElementFromParent(
                this.m_lastClickedSvgElement,
            );
            if (t) return t;
            const e = this.computeCurrentCursorElementFromParent(
                this.getSlidesViewElement(),
            );
            return (
                e && (this.m_lastClickedSvgElement = f.getParentEditor(e)), e
            );
        }
        computeCurrentCursorElementFromParent(t) {
            const e = t || document.documentElement;
            if (!e) return null;
            const n = e.getElementsByClassName(h.blinkCursorClassName);
            if (null !== n && 1 === n.length) return n[0];
            const r = e.querySelectorAll("rect[style*='opacity: 1;']");
            if (null === r || 0 === r.length) return null;
            const o = r.length;
            for (let t = 0; t < o; t += 1) {
                const e = r[t];
                if (0 !== e.width.baseVal.value && 0 !== e.height.baseVal.value)
                    return e;
            }
            return null;
        }
        cursorPosition() {
            const t = this.cursorElement();
            return null === t ? null : this.consolidatedPositionForNode(t);
        }
        consolidatedPositionForNode(t) {
            const e = t.ownerSVGElement.createSVGPoint(),
                n = t.getBBox(),
                r = t.transform.baseVal.consolidate();
            (e.x = n.x), (e.y = n.y);
            const o =
                null !== r ? e.matrixTransform(r.matrix) : {x: e.x, y: e.y};
            (e.x += n.width / 2), (e.y += n.height / 2);
            const s =
                    null !== r ? e.matrixTransform(r.matrix) : {x: e.x, y: e.y},
                i = (o.x + s.x) / 2,
                l = (o.y + s.y) / 2;
            return {x: o.x, y: o.y, midLeft: i, midTop: l};
        }
        currentTextContent() {
            const t = this.currentTextElement();
            return null === t ? null : t.textContent;
        }
        cursorRect() {
            if (!this.m_cursorRect) {
                const t = this.cursorElement();
                t && this.setCursorRect(t.getBoundingClientRect());
            }
            return this.m_cursorRect;
        }
        setCursorRect(t) {
            const e =
                !this.m_cursorRect ||
                !n.DOMRectExtensions.equalsTo(this.m_cursorRect, t);
            return (
                (this.m_cursorRect = t),
                e &&
                    (this.resetCurrentElements(!1),
                    null !== this.m_caretEventTarget &&
                        this.dispatchCaretPositionChangedEvent()),
                e
            );
        }
        dispatchCaretPositionChangedEvent() {
            const t = new CustomEvent(
                "com.donjohnston.cwu.caretPositionChanged",
                null,
            );
            try {
                this.m_caretEventTarget.dispatchEvent(t);
            } catch (t) {
                n.Logger.error(t);
            }
        }
        updatePredictionState() {
            if (!this.m_ime) return;
            const t = this.m_lastState,
                e = this.getState();
            if (
                ((this.m_lastState = e),
                (!t || t.active !== e.active) &&
                    this.m_ime.onEditorChanged(e.hook, e.editor),
                !e.active)
            )
                return;
            const n =
                ((t && t.cursorRect ? t.cursorRect.width : 3) +
                    (e.cursorRect ? e.cursorRect.width : 3)) /
                2;
            (!t ||
                !this.rectsAreWithinProximity(t.cursorRect, e.cursorRect, n) ||
                !this.rectArrayAreEqual(t.selectionRects, e.selectionRects)) &&
                this.m_ime.onContextChanged(this);
        }
        rectArrayAreEqual(t, e) {
            if (t === e) return !0;
            if (t && e) {
                const n = t.length;
                if (n !== e.length) return !1;
                for (let r = 0; r < n; r += 1)
                    if (!this.rectsAreEqual(t[r], e[r])) return !1;
            }
            return !0;
        }
        rectsAreEqual(t, e) {
            return Boolean(
                t === e || (t && n.DOMRectExtensions.equalsTo(t, e)),
            );
        }
        rectsAreWithinProximity(t, e, r) {
            return Boolean(
                t === e ||
                    (t && n.DOMRectExtensions.isWithinProximityTo(t, e, r)),
            );
        }
        getContentEditableElement() {
            const t = document.getElementsByClassName(
                "docs-texteventtarget-iframe",
            );
            if (null === t || 0 === t.length) return null;
            const e = t[0],
                {contentDocument: n} = e;
            return null === n
                ? null
                : n.querySelector("div[contenteditable='true'");
        }
        addEventListenersForElement(t) {
            t.addEventListener("mousedown", this.m_mouseDownEventListener, !0),
                t.addEventListener("mouseup", this.m_mouseUpEditorListener, !0);
        }
        removeEventListenersForElement(t) {
            t.removeEventListener(
                "mousedown",
                this.m_mouseDownEventListener,
                !0,
            ),
                t.removeEventListener(
                    "mouseup",
                    this.m_mouseUpEditorListener,
                    !0,
                );
        }
        addEventListenersForEditableContent() {
            const t = this.getContentEditableElement();
            null !== t &&
                (t.addEventListener(
                    "focus",
                    this.m_contentEditableOnFocusListener,
                    !0,
                ),
                t.addEventListener(
                    "blur",
                    this.m_contentEditableOnBlurListener,
                    !0,
                ),
                t.addEventListener(
                    "keydown",
                    this.m_contentEditableOnKeyDownListener,
                    !0,
                ),
                t.addEventListener(
                    "keyup",
                    this.m_contentEditableOnKeyUpListener,
                    !0,
                ),
                t.addEventListener(
                    "keypress",
                    this.m_contentEditableOnKeyPressListener,
                    !0,
                ));
        }
        removeEventListenersForEditableContent() {
            const t = this.getContentEditableElement();
            null !== t &&
                (t.removeEventListener(
                    "focus",
                    this.m_contentEditableOnFocusListener,
                    !0,
                ),
                t.removeEventListener(
                    "blur",
                    this.m_contentEditableOnBlurListener,
                    !0,
                ),
                t.removeEventListener(
                    "keydown",
                    this.m_contentEditableOnKeyDownListener,
                    !0,
                ),
                t.removeEventListener(
                    "keyup",
                    this.m_contentEditableOnKeyUpListener,
                    !0,
                ),
                t.removeEventListener(
                    "keypress",
                    this.m_contentEditableOnKeyPressListener,
                    !0,
                ));
        }
        onFocus(t) {
            this.m_ime.onEditorEvent(this, null, t),
                this.updatePredictionState();
        }
        onBlur(t) {
            this.m_ime.onEditorEvent(this, null, t),
                this.updatePredictionState();
        }
        onKeyDown(t) {
            this.m_dispatchingEvents ||
                (this.m_ime.onEditorEvent(this, null, t),
                this.m_ime.onKeyDown(this, t) &&
                    (t.stopPropagation(), t.preventDefault()));
        }
        onKeyUp(t) {
            this.m_dispatchingEvents ||
                (this.m_ime.onEditorEvent(this, null, t),
                this.m_ime.onKeyUp(this, t) &&
                    (t.stopPropagation(), t.preventDefault()));
        }
        onKeyPress(t) {
            this.m_dispatchingEvents ||
                (this.m_ime.onEditorEvent(this, null, t),
                this.m_ime.onKeyPress(this, t) &&
                    (t.stopPropagation(), t.preventDefault()));
        }
        hasFocus() {
            return (
                this.contentEditableHasFocus() &&
                null !== this.currentEditorElement() &&
                (null !== this.cursorElement() || this.hasSelection())
            );
        }
        contentEditableHasFocus() {
            const t = document.activeElement;
            return (
                t &&
                ("docs-toolbar" === t.id ||
                    t.classList.contains("docs-texteventtarget-iframe") ||
                    t === this.getContentEditableElement())
            );
        }
        setLastClickedSvgElement(t) {
            let e = t;
            for (; null !== e; ) {
                if (f.isEditor(e))
                    return void (this.m_lastClickedSvgElement = e);
                if (
                    ((e = e.parentElement), null !== e && e.hasAttribute("id"))
                ) {
                    const t = e.getAttribute("id");
                    if ("pages" === t) break;
                    if (t === h.speakerNotesId)
                        return void (this.m_lastClickedSvgElement = e);
                }
            }
            this.m_lastClickedSvgElement = t;
        }
        getSelection() {
            const t = this.getContext(null, !1, !1, !0);
            return t
                ? {
                      anchorNode: null,
                      anchorOffset: t.selection.start,
                      focusNode: null,
                      focusOffset: t.selection.start + t.selection.length,
                  }
                : null;
        }
    }
    class v extends e.TextMapperDelegateFactory {
        mGoogleSlidesHook = null;
        constructor() {
            super(),
                n.Utils.isGoogleSlides() &&
                    ((this.mGoogleSlidesHook = new x(null, null, null)),
                    this.mGoogleSlidesHook.install());
        }
        doCreateDelegate(t = null) {
            return n.Utils.isSruPopupElement(t) ||
                n.Utils.isSruMainContainerFrame(t) ||
                n.Utils.isSruOverlaySelectionElement(t)
                ? null
                : n.Utils.isGoogleDocs()
                  ? new u()
                  : n.Utils.isGoogleSlides()
                    ? new p(this.mGoogleSlidesHook)
                    : null;
        }
    }
    const C = "wizkids-google-docs-outbound";
    let y = Number.MIN_SAFE_INTEGER,
        _ = {start: 0, end: 0};
    function b(t, e) {
        if ("string" != typeof e) return e;
        const n = e.substring(0, 1),
            r = e.substring(1);
        switch (n) {
            case "":
                return r;
            case "":
                return null;
            default:
                throw new Error("Unknown identifier in beginning of text");
        }
    }
    function P(t, e) {
        return "string" == typeof e ? "" + e : e;
    }
    function S(t) {
        document.dispatchEvent(
            new CustomEvent("wizkids-google-docs-inbound", {
                cancelable: !0,
                bubbles: !0,
                detail: JSON.stringify(t, P),
            }),
        );
    }
    document.addEventListener(C, (t) => {
        if ("string" != typeof t.detail) return;
        let e;
        try {
            e = JSON.parse(t.detail, b);
        } catch (t) {
            return void console.error(t);
        }
        if (
            "object" == typeof e &&
            "string" == typeof e.id &&
            "__onSelectionChange" === e.id
        ) {
            const t = JSON.parse(e.result, b);
            if (!t) return;
            "InlineLocation" === t.type && (_ = t.range);
        }
    });
    class w {
        constructor(t) {
            this.mCallback = t;
        }
        listen() {
            const t = (++y === Number.MAX_SAFE_INTEGER && (y = 0),
            y).toString();
            let e = null;
            const n = (r) => {
                try {
                    const o = JSON.parse(r.detail, b);
                    if (o.id !== t) return;
                    document.removeEventListener(C, n),
                        (e = JSON.parse(o.result, b));
                } catch (t) {
                    throw ((e = null), (N.error = new Error(t)), N.error);
                }
            };
            return document.addEventListener(C, n), this.mCallback(t), e;
        }
    }
    class N {
        static error = null;
        static get hasErrors() {
            return null != N.error;
        }
        static get lastError() {
            return N.error;
        }
        static getDocumentText() {
            return new w((t) => {
                S({id: t, type: "wnZK", args: []});
            }).listen();
        }
        static getDocsSelection() {
            try {
                const t = N.getDocumentText(),
                    e = N.getCursor();
                return t.substring(e.start, e.end);
            } catch (t) {
                throw ((N.error = new Error(t)), N.error);
            }
        }
        static getCursor() {
            return _;
        }
        static removeHighlight(t) {
            var e;
            S({
                id: (e = t),
                type: "32eB",
                args: "string" == typeof e ? [e] : e,
            });
        }
        static clearHighlights() {
            S({id: "_", type: "L81W", args: []});
        }
        static setHighlight(t) {
            !(function (t, e) {
                S({id: t, type: "H6uf", args: [t, e]});
            })(t.id, t);
        }
        static getRectsByRange(t) {
            const e = new w((e) => {
                !(function (t, e) {
                    S({id: t, type: "kQIP", args: [e]});
                })(e, t);
            });
            return e.listen();
        }
        static getParagraphStarts() {
            return new w((t) => {
                S({id: t, type: "N+aV", args: []});
            }).listen();
        }
        static getAllObjects() {
            return new w((t) => {
                S({id: t, type: "wdbv", args: []});
            }).listen();
        }
        static getObjectById(t) {
            return new w((e) => {
                !(function (t, e) {
                    S({id: t, type: "6cLn", args: ["inline", e]});
                })(e, t);
            }).listen();
        }
        static getInlineObjectByIndex(t) {
            return new w((e) => {
                !(function (t, e) {
                    S({id: t, type: "K37Y", args: ["inline", e]});
                })(e, t);
            }).listen();
        }
    }
    const T = N;
    class O extends e.SelectionHandler {
        getSelectionContext() {
            if (T.hasErrors) return null;
            try {
                return {
                    text: T.getDocsSelection(),
                    offset: T.getCursor().start,
                };
            } catch (t) {
                return null;
            }
        }
        getRectsByRange(t, e, n) {
            if (T.hasErrors) return null;
            try {
                return T.getRectsByRange({start: e, end: e + n});
            } catch (t) {
                return null;
            }
        }
    }
    class k {
        static sObjectMarker = "*";
        isImageObjectAtIndex(t, e) {
            return (
                t.text.length > e &&
                t.text[e] === k.sObjectMarker &&
                null !== T.getInlineObjectByIndex(e + t.offset)
            );
        }
        readObjects(t, e) {
            const n = [];
            try {
                let r = 0;
                for (; r > -1; )
                    if (((r = t.indexOf(k.sObjectMarker, r)), r > -1)) {
                        const t = T.getInlineObjectByIndex(r + e);
                        t && n.push({index: r, object: t}), ++r;
                    }
            } catch (t) {
                return [];
            }
            return n;
        }
    }
    const F = "dji-overlay-id";
    class M extends e.DocumentTextHighlighter {
        mHighlight = {
            range: {start: 0, end: 0},
            backgroundColor: "#000000",
            textColor: "#71FDFE",
            zIndex: 1e4,
            id: F,
        };
        mFocusListener = (t) => {
            t.isTrusted || (t.preventDefault(), t.stopImmediatePropagation());
        };
        enableHighlight(t, e, r) {
            return T.hasErrors
                ? (n.Utils.callMethod(r), !1)
                : (document.addEventListener("focus", this.mFocusListener),
                  this.removeHighlight(),
                  n.Utils.callMethod(r),
                  !0);
        }
        disableHighlight(t, e, r) {
            if (T.hasErrors) return n.Utils.callMethod(r), !1;
            const o = this.removeHighlight();
            return (
                document.removeEventListener("focus", this.mFocusListener),
                n.Utils.callMethod(r),
                o
            );
        }
        highlightWord(t, e, r) {
            if (T.hasErrors) return !1;
            if (!this.removeHighlight()) return !1;
            let o =
                    void 0 !== r.indexOfPlaceholderText
                        ? r.indexOfPlaceholderText
                        : e,
                s = o,
                i = r.colors;
            if (
                r.isMath ||
                "mathml" === r.mathFormat ||
                this.isImageObjectAtIndex(t, o)
            )
                (s = o + 1),
                    i &&
                        i.word &&
                        7 === i.word.length &&
                        (i.word = i.word + "AA");
            else {
                for (
                    o +=
                        void 0 !== r.indexOfPlaceholderText ? r.chunkOffset : 0,
                        s = o;
                    o > 0 &&
                    !n.CharSet.wordSeparator.characterIsMember(t.text[o - 1]);
                    o -= 1
                );
                for (
                    ;
                    s < t.text.length &&
                    !n.CharSet.wordSeparator.characterIsMember(t.text[s]);
                    s += 1
                );
            }
            return this.setHighlight(o + t.offset, s + t.offset, i);
        }
        highlight(t, e, n, r) {
            if (T.hasErrors) return !1;
            if (!this.removeHighlight()) return !1;
            let o =
                    void 0 !== r.indexOfPlaceholderText
                        ? r.indexOfPlaceholderText
                        : e,
                s = r.colors;
            return (
                r.isMath ||
                "mathml" === r.mathFormat ||
                this.isImageObjectAtIndex(t, o)
                    ? ((n = 1),
                      s.word && 7 === s.word.length && (s.word = s.word + "AA"))
                    : (o +=
                          void 0 !== r.indexOfPlaceholderText
                              ? r.chunkOffset
                              : 0),
                this.setHighlight(o + t.offset, o + n + t.offset, s)
            );
        }
        setHighlight(t, e, n) {
            if (T.hasErrors) return !1;
            (this.mHighlight.range = {start: t, end: t === e ? e + 1 : e}),
                (this.mHighlight.textColor = n ? n.text : "#000000"),
                (this.mHighlight.backgroundColor = n ? n.word : "#71FDFE");
            try {
                return T.setHighlight(this.mHighlight), !0;
            } catch (t) {
                return !1;
            }
        }
        removeHighlight() {
            if (T.hasErrors) return !1;
            try {
                return T.removeHighlight(F), !0;
            } catch (t) {
                return !1;
            }
        }
        isImageObjectAtIndex(t, e) {
            return (
                !(!t.source || !t.source.objectReader) &&
                t.source.objectReader.isImageObjectAtIndex(t, e)
            );
        }
    }
    function I(t) {
        const e = t;
        return void 0 !== e.url && void 0 !== e.description;
    }
    class L extends e.TextMappingStrategy {
        constructor() {
            super(e.TextMappingStrategyOrigin.CARET, !1);
        }
        getPositionInText(t, e, r) {
            super.initialize(null, 0);
            let o = Math.max(e.end - 1, 0);
            const s = t.length;
            for (
                ;
                o < s - 1 && !n.CharSet.wordSeparator.characterIsMember(t[o]);

            )
                o += 1;
            return o;
        }
    }
    class A extends e.DocumentTextReader {
        mSelectionHandler = null;
        mTextHighlighter = null;
        mObjectReader = null;
        get selectionHandler() {
            return (
                this.mSelectionHandler || (this.mSelectionHandler = new O()),
                this.mSelectionHandler
            );
        }
        get textHighlighter() {
            return (
                this.mTextHighlighter || (this.mTextHighlighter = new M()),
                this.mTextHighlighter
            );
        }
        get objectReader() {
            return (
                this.mObjectReader || (this.mObjectReader = new k()),
                this.mObjectReader
            );
        }
        getTextContent(t, e, n) {
            if (T.hasErrors) throw T.lastError;
            const r = T.getDocumentText(),
                o = r.length,
                s = T.getCursor();
            if (0 === o) return {text: "", offset: 0};
            const i = t.getPositionInText(r, s, !0);
            if (i < 0) return {text: null, offset: 0};
            const l = e.getPositionInText(r, {start: s.start, end: s.end}, !1);
            if (l < 0) return {text: null, offset: 0};
            const a = Math.min(i, l);
            let c = Math.max(i, l);
            a === c && (c += 1);
            let u = r
                .substring(a, c)
                .replaceAll(/[\x03\x10\x11\x12\x1C]/g, " ");
            u = u.replaceAll(/[\u2019]/g, "'");
            let h = {
                text: u,
                offset: a,
                selection: {
                    start: s.start - a,
                    length: Math.abs(s.end - s.start),
                },
                custom: {embeddedLocations: []},
            };
            if ((this.updateContextWithDocumentObjects(h), T.hasErrors))
                throw T.lastError;
            return h;
        }
        getSelectedContent() {
            if (T.hasErrors) throw T.lastError;
            const t = T.getCursor();
            if (t.start === t.end) return {text: null, offset: 0};
            const n = new e.StartOfWordMappingStrategy(),
                r = new L(),
                o = this.getTextContent(n, r, null);
            if (
                (o &&
                    o.text &&
                    (this.updateContextWithSelectionBoundingRect(o),
                    this.updateContextWithDocumentObjects(o)),
                T.hasErrors)
            )
                throw T.lastError;
            return o;
        }
        updateContextWithDocumentObjects(t) {
            const e = this.objectReader.readObjects(t.text, t.offset);
            if (0 === e.length) return;
            const n = new DOMParser();
            t.translations = [];
            let r = 0,
                o = 0,
                s = 0;
            const i = t.text.length,
                l = e.length;
            for (; r < i && s < l; ) {
                const i = e[s];
                if (i && i.index === r && I(i.object) && i.object.description) {
                    o < r &&
                        t.translations.push({
                            text: t.text.substring(o, r),
                            isTranslated: !0,
                            indexOfPlaceholderText: o,
                        });
                    const e = n.parseFromString(
                        i.object.description,
                        "text/html",
                    );
                    let l = "";
                    e.body.firstChild &&
                        e.body.firstChild.textContent &&
                        "" !== e.body.firstChild.textContent &&
                        (l = e.body.firstChild.textContent);
                    const a = e.body.querySelector("math");
                    t.translations.push({
                        text: a
                            ? i.object.description.substring(
                                  i.object.description.indexOf("<math"),
                              )
                            : l,
                        isTranslated: null === a,
                        isMath: null != a,
                        mathFormat: "mathml",
                        indexOfPlaceholderText: r,
                    }),
                        (o = r + 1),
                        (s += 1);
                }
                ++r;
            }
            o < i &&
                t.translations.length > 0 &&
                t.translations.push({
                    text: t.text.substring(o, i),
                    isTranslated: !0,
                    indexOfPlaceholderText: o,
                });
        }
        updateContextWithSelectionBoundingRect(t) {
            t.boundingRect = null;
            const e = T.getRectsByRange({
                start: t.offset + t.selection.start,
                end: t.offset + t.selection.start + t.selection.length - 1,
            });
            if (e && e.length > 0) {
                const n = e.reduce((t, e, n, r) =>
                    t ? (t.width < e.width ? e : t) : e,
                );
                t.boundingRect = new DOMRectReadOnly(
                    n.left,
                    n.top,
                    n.width,
                    n.height,
                );
            }
        }
    }
    class R extends u {
        createTextReader() {
            return T.hasErrors ? null : new A();
        }
        createSelectionHandler() {
            return T.hasErrors ? null : new O();
        }
        get isLayered() {
            return !!T.hasErrors && super.isLayered;
        }
    }
    class D extends e.TextMapperDelegateFactory {
        doCreateDelegate(t = null) {
            return n.Utils.isGoogleDocs()
                ? (window.dji &&
                      window.dji._goog &&
                      Boolean(window.dji._goog.disablePrimaryRenderer)) ||
                  n.Utils.isSruPopupElement(t) ||
                  n.Utils.isSruMainContainerFrame(t) ||
                  n.Utils.isSruOverlaySelectionElement(t) ||
                  T.hasErrors
                    ? null
                    : new R()
                : null;
        }
    }
    class B extends e.ParaLineGuideImpl {
        setColors(t) {
            return !1;
        }
        paragraphAtPoint(t, e, n) {
            const o = document.elementFromPoint(t, e);
            return o &&
                (o.closest("div.kix-canvas-tile-content") ||
                    o.closest("div.kix-rotatingtilemanager"))
                ? r.paragraphFromPoint(n, t, e)
                : null;
        }
        highlightParagraphAt(t, e, n) {
            return !1;
        }
        clearHighlights(t) {
            return !1;
        }
    }
    e.TextMapperDelegateFactory.registerFactory(new v()),
        e.TextMapperDelegateFactory.registerFactory(new D()),
        e.ParaLineGuide.registerGuideImpl(new B()),
        e.ParaLineGuide.registerGuideImpl(new E()),
        (t.DJIHookGoogleSlides = x),
        (t.GoogleTextEventTargetListener = class {
            constructor(t) {
                (this.m_textEventTargetDoc = null),
                    (this.m_appView = null),
                    (this.m_appViewEditor = null),
                    (this.m_cursor = null),
                    (this.m_caret = null),
                    (this.m_hookOnFocus = null),
                    (this.m_hookOnBlur = null),
                    (this.m_hookOnSelect = null),
                    (this.m_hookOnMouseDown = null),
                    (this.m_hookOnMouseUp = null),
                    (this.m_hookOnKeyDown = null),
                    (this.m_hookOnKeyPress = null),
                    (this.m_hookOnKeyUp = null),
                    (this.m_hookOnScroll = null),
                    (this.m_hookOnInput = null),
                    (this.m_hookOnCompositionStart = null),
                    (this.m_hookOnCompositionUpdate = null),
                    (this.m_hookOnCompositionEnd = null),
                    (this.m_hookOnContextMenu = null),
                    (this.mCallback = t),
                    (this.m_watchKeyCodes = new Set([
                        "Backspace",
                        "Delete",
                        "Tab",
                        "Enter",
                    ])),
                    (this.m_lastKeyPressTimestamp = void 0),
                    (this.m_forwardEvents = !0);
            }
            initialize() {
                null === this.m_hookOnFocus &&
                    ((this.m_hookOnFocus = (t) => {
                        this.m_forwardEvents &&
                            this.onFocus(this.m_appViewEditor, t);
                    }),
                    (this.m_hookOnBlur = (t) => {
                        this.m_forwardEvents &&
                            this.onBlur(this.m_appViewEditor, t);
                    }),
                    (this.m_hookOnSelect = (t) => {
                        this.m_forwardEvents &&
                            this.onSelect(this.m_appViewEditor, t);
                    }),
                    (this.m_hookOnMouseDown = (t) => {
                        this.m_forwardEvents &&
                            this.onMouseDown(this.m_appViewEditor, t);
                    }),
                    (this.m_hookOnMouseUp = (t) => {
                        this.m_forwardEvents &&
                            this.onMouseUp(this.m_appViewEditor, t);
                    }),
                    (this.m_hookOnKeyDown = (t) => {
                        this.m_forwardEvents &&
                            this.onKeyDown(this.m_appViewEditor, t),
                            this.m_watchKeyCodes.has(t.code) &&
                                (this.m_lastKeyPressTimestamp = Date.now());
                    }),
                    (this.m_hookOnKeyPress = (t) => {
                        this.m_forwardEvents &&
                            this.onKeyPress(this.m_appViewEditor, t),
                            (this.m_lastKeyPressTimestamp = Date.now());
                    }),
                    (this.m_hookOnKeyUp = (t) => {
                        this.m_forwardEvents &&
                            this.onKeyUp(this.m_appViewEditor, t);
                    }),
                    (this.m_hookOnScroll = (t) => {
                        this.m_forwardEvents &&
                            this.onScroll(this.m_appViewEditor, t);
                    }),
                    (this.m_hookOnInput = (t) => {
                        this.m_forwardEvents &&
                            this.onInput(this.m_appViewEditor, t);
                    }),
                    (this.m_hookOnCompositionStart = (t) => {
                        this.m_forwardEvents &&
                            this.onCompositionStart(this.m_appViewEditor, t);
                    }),
                    (this.m_hookOnCompositionUpdate = (t) => {
                        this.m_forwardEvents &&
                            this.onCompositionUpdate(this.m_appViewEditor, t);
                    }),
                    (this.m_hookOnCompositionEnd = (t) => {
                        this.m_forwardEvents &&
                            this.onCompositionEnd(this.m_appViewEditor, t);
                    }),
                    (this.m_hookOnContextMenu = (t) =>
                        this.onContextMenu(this.m_appViewEditor, t))),
                    this.findEditors();
            }
            install() {
                this.initialize(),
                    this.m_textEventTargetDoc.addEventListener(
                        "keydown",
                        this.m_hookOnKeyDown,
                        !0,
                    ),
                    this.m_textEventTargetDoc.addEventListener(
                        "keypress",
                        this.m_hookOnKeyPress,
                        !0,
                    ),
                    this.m_textEventTargetDoc.addEventListener(
                        "keyup",
                        this.m_hookOnKeyUp,
                        !0,
                    ),
                    this.m_textEventTargetDoc.addEventListener(
                        "focus",
                        this.m_hookOnFocus,
                        !0,
                    ),
                    this.m_textEventTargetDoc.addEventListener(
                        "blur",
                        this.m_hookOnBlur,
                        !0,
                    ),
                    this.m_textEventTargetDoc.addEventListener(
                        "input",
                        this.m_hookOnInput,
                        !0,
                    ),
                    this.m_textEventTargetDoc.addEventListener(
                        "compositionstart",
                        this.m_hookOnCompositionStart,
                        !0,
                    ),
                    this.m_textEventTargetDoc.addEventListener(
                        "compositionupdate",
                        this.m_hookOnCompositionUpdate,
                        !0,
                    ),
                    this.m_textEventTargetDoc.addEventListener(
                        "compositionend",
                        this.m_hookOnCompositionEnd,
                        !0,
                    ),
                    this.m_appViewEditor &&
                        (this.m_appViewEditor.addEventListener(
                            "mousedown",
                            this.m_hookOnMouseDown,
                            !0,
                        ),
                        this.m_appViewEditor.addEventListener(
                            "mouseup",
                            this.m_hookOnMouseUp,
                            !0,
                        ));
            }
            uninstall() {
                this.m_textEventTargetDoc &&
                    (this.m_textEventTargetDoc.removeEventListener(
                        "keydown",
                        this.m_hookOnKeyDown,
                        !0,
                    ),
                    this.m_textEventTargetDoc.removeEventListener(
                        "keypress",
                        this.m_hookOnKeyPress,
                        !0,
                    ),
                    this.m_textEventTargetDoc.removeEventListener(
                        "keyup",
                        this.m_hookOnKeyUp,
                        !0,
                    ),
                    this.m_textEventTargetDoc.removeEventListener(
                        "focus",
                        this.m_hookOnFocus,
                        !0,
                    ),
                    this.m_textEventTargetDoc.removeEventListener(
                        "blur",
                        this.m_hookOnBlur,
                        !0,
                    ),
                    this.m_textEventTargetDoc.removeEventListener(
                        "input",
                        this.m_hookOnInput,
                        !0,
                    ),
                    this.m_textEventTargetDoc.removeEventListener(
                        "compositionstart",
                        this.m_hookOnCompositionStart,
                        !0,
                    ),
                    this.m_textEventTargetDoc.removeEventListener(
                        "compositionupdate",
                        this.m_hookOnCompositionUpdate,
                        !0,
                    ),
                    this.m_textEventTargetDoc.removeEventListener(
                        "compositionend",
                        this.m_hookOnCompositionEnd,
                        !0,
                    ),
                    (this.m_textEventTargetDoc = null)),
                    this.m_appViewEditor &&
                        (this.m_appViewEditor.removeEventListener(
                            "mousedown",
                            this.m_hookOnMouseDown,
                            !0,
                        ),
                        this.m_appViewEditor.removeEventListener(
                            "mouseup",
                            this.m_hookOnMouseUp,
                            !0,
                        ),
                        (this.m_appViewEditor = null));
            }
            set forwardEvents(t) {
                this.m_forwardEvents !== t &&
                    ((this.m_forwardEvents = t),
                    t && (this.m_lastKeyPressTimestamp = Date.now()));
            }
            isAppViewVisible() {
                if (!this.m_appView) return !1;
                const t = document.defaultView.getComputedStyle(this.m_appView),
                    e = t.getPropertyValue("display"),
                    n = t.getPropertyValue("visibility");
                return "none" !== e && "hidden" !== n;
            }
            get editor() {
                return this.m_appViewEditor;
            }
            get view() {
                return this.m_appView;
            }
            get lastKeyPressTimestamp() {
                return this.m_lastKeyPressTimestamp;
            }
            getCaret() {
                const t = this.m_cursor
                        ? this.m_cursor.getBoundingClientRect()
                        : this.m_appView
                              .getElementsByClassName("kix-cursor")[0]
                              .getBoundingClientRect(),
                    e = this.m_caret
                        ? this.m_caret.getBoundingClientRect()
                        : this.m_appView
                              .getElementsByClassName("kix-cursor-caret")[0]
                              .getBoundingClientRect();
                return {
                    left: t.left,
                    top: e.top,
                    right: t.right,
                    bottom: e.bottom,
                };
            }
            findEditors() {
                if (this.m_textEventTargetDoc) return;
                const t = document.getElementsByClassName(
                    "docs-texteventtarget-iframe",
                )[0];
                t &&
                    ((this.m_textEventTargetDoc = t.contentDocument),
                    (this.m_appView = document.getElementById("kix-appview")),
                    this.m_appView &&
                        (([this.m_appViewEditor] =
                            this.m_appView.getElementsByClassName(
                                "kix-appview-editor",
                            )),
                        ([this.m_cursor] =
                            this.m_appView.getElementsByClassName(
                                "kix-cursor",
                            )),
                        ([this.m_caret] =
                            this.m_appView.getElementsByClassName(
                                "kix-cursor-caret",
                            ))));
            }
            onFocus(t, e) {
                this.mCallback.onFocus(t, e);
            }
            onBlur(t, e) {
                this.mCallback.onBlur(t, e);
            }
            onSelect(t, e) {
                this.mCallback.onSelect(t, e);
            }
            onMouseDown(t, e) {
                this.mCallback.onMouseDown(t, e);
            }
            onMouseUp(t, e) {
                this.mCallback.onMouseUp(t, e);
            }
            onKeyDown(t, e) {
                this.mCallback.onKeyDown(t, e);
            }
            onKeyPress(t, e) {
                this.mCallback.onKeyPress(t, e);
            }
            onKeyUp(t, e) {
                this.mCallback.onKeyUp(t, e);
            }
            onScroll(t, e) {
                this.mCallback.onScroll(t, e);
            }
            onInput(t, e) {
                this.mCallback.onInput(t, e);
            }
            onCompositionStart(t, e) {
                this.mCallback.onCompositionStart(t, e);
            }
            onCompositionUpdate(t, e) {
                this.mCallback.onCompositionUpdate(t, e);
            }
            onCompositionEnd(t, e) {
                this.mCallback.onCompositionEnd(t, e);
            }
            onContextMenu(t, e) {
                let n = null;
                for (
                    n = e.toElement;
                    n && n !== this.m_appViewEditor;
                    n = n.parentElement
                );
            }
        }),
        Object.defineProperty(t, "__esModule", {value: !0});
});
