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
    class r extends t.CaretPositioner {
        constructor(e) {
            super(e);
        }
        onMoveCaret(e, t) {
            try {
                let r = Math.max(0, t),
                    i = Math.min(t + 1, e.textContent.length);
                r === i && (r = Math.max(0, i - 1));
                const a = e.ownerDocument,
                    n = a.createRange();
                n.setStart(e, r), n.setEnd(e, i);
                const o = n.getBoundingClientRect(),
                    l = {
                        bubbles: !0,
                        cancelable: !0,
                        clientX: o.left,
                        clientY: o.top + o.height / 2,
                    },
                    s = new MouseEvent("mousedown", l),
                    g = new MouseEvent("mouseup", l),
                    h = new MouseEvent("click", l);
                let c = this.delegate.getContentEditableForNode(e);
                c || (c = this.delegate.getViewPanel(a)),
                    window.requestIdleCallback(() => {
                        c.dispatchEvent(s),
                            c.dispatchEvent(g),
                            c.dispatchEvent(h);
                    });
            } catch (e) {}
        }
        getCaretPositionFromPoint(t, r, i) {
            let a,
                n = [],
                o = [],
                l = null;
            try {
                do {
                    l = e.Utils.caretPositionFromPoint(t, r, i);
                    const s = l.offsetNode
                        ? l.offsetNode.nodeType === Node.ELEMENT_NODE
                            ? l.offsetNode
                            : l.offsetNode.parentElement
                        : null;
                    if (!s) break;
                    if (s === a) break;
                    if (((a = s), s.matches("span.WACImageBorder"))) {
                        l.offsetNode = s.parentElement;
                        break;
                    }
                    (s.matches("div#textareaCaretTracker *") ||
                        s.matches("div#textareaCaretTracker") ||
                        s.matches("div#predictionFeedbackTooltip *") ||
                        s.matches("div#predictionFeedbackTooltip")) &&
                        (n.push(s.style.visibility),
                        o.push(s),
                        (s.style.visibility = "hidden"),
                        (l.offsetNode = null),
                        (l.offset = -1));
                } while (!l.offsetNode);
            } finally {
                const e = o.length;
                for (let t = 0; t < e; ++t) o[t].style.visibility = n[t];
            }
            return l;
        }
    }
    class i extends t.ParagraphIterator {
        mParaMatchString = "p.Paragraph";
        mDelegate = null;
        constructor(e) {
            super("paraid"), (this.mDelegate = e);
        }
        getParagraphForNode(e) {
            return e
                ? (e.nodeType === Node.ELEMENT_NODE
                      ? e
                      : e.parentElement
                  ).closest(this.mParaMatchString)
                : null;
        }
        getAllParagraphs(e) {
            return this.mDelegate
                .getRootNode(e)
                .querySelectorAll(this.mParaMatchString);
        }
        getCurrentParagraph(e) {
            return this.mDelegate
                .getRootNode(e)
                .querySelector(
                    'div#WACViewPanel_EditingElement[contenteditable="true"]',
                );
        }
        nodeIsParagraph(e) {
            return (
                e.nodeType === Node.ELEMENT_NODE &&
                e.matches(this.mParaMatchString)
            );
        }
        getClosestParagraph(e) {
            return e.querySelector(this.mParaMatchString);
        }
    }
    class a extends t.SelectionHandler {
        getSelection(e) {
            const t = this.getSelectionArray(e);
            if (0 === t.length) return null;
            const r = t[0],
                i =
                    (r.hasOwnProperty("_customData") &&
                        r._customData.CurrentCp) ||
                    0,
                a = t[t.length - 1],
                n =
                    (a.hasOwnProperty("_customData") && a._customData.NextCp) ||
                    a.textContent.length;
            return {
                anchorNode: r,
                anchorOffset: i,
                focusNode: a,
                focusOffset: n,
            };
        }
        clearSelection(e) {
            const t = this.getSelectionArray(e);
            if (0 === t.length) return null;
            t.forEach((e) => {
                e.classList.remove("Selected");
            });
        }
        getSelectionArray(e) {
            const t = [],
                r = e.document.querySelectorAll("span.Selected"),
                i = r.length;
            for (let e = 0; e < i; e += 1) {
                const i = r[e];
                t.push(i);
            }
            return t;
        }
    }
    class n extends t.MarkTextHighlighter {
        mHiddenParaSelector = "div.ParaWrappingDiv.HiddenParagraph";
        mHighlightedImageOverlay = null;
        mHighlightedImageOverlayBackColorToRestore = "";
        mImageSelections = new Array();
        mImageHighlightedCount = 0;
        enableHighlight(e, t, r) {
            this.hideImageSelections(), super.enableHighlight(e, t, r);
        }
        disableHighlight(e, t, r) {
            this.restoreImageSelections(),
                (this.mImageHighlightedCount = 0),
                super.disableHighlight(e, t, r);
        }
        highlightWord(e, t, r) {
            if (e.custom.map && e.custom.map.length > t) {
                const i = e.custom.map[t].element;
                if (i && i.matches && i.matches("img.WACImage"))
                    return super.clearHighlights(), this.highlightImage(i, r);
            }
            return (
                this.mHighlightedImageOverlay && this.clearHighlights(),
                super.highlightWord(e, t - this.mImageHighlightedCount, r)
            );
        }
        highlight(e, t, r, i) {
            if (e.custom.map && e.custom.map.length > t) {
                const r = e.custom.map[t].element;
                if (r && r.matches && r.matches("img.WACImage"))
                    return super.clearHighlights(), this.highlightImage(r, i);
            }
            return (
                this.mHighlightedImageOverlay && this.clearHighlights(),
                super.highlight(e, t - this.mImageHighlightedCount, r, i)
            );
        }
        getHighlightedBoundingClientRect(e, t) {
            if (e.custom.map && e.custom.map.length > t) {
                const r = e.custom.map[t].element;
                if (r && r.matches && r.matches("img.WACImage"))
                    return r.getBoundingClientRect();
            }
            return super.getHighlightedBoundingClientRect(e, t);
        }
        adjustContextBeforeHighlighting(e, t) {
            const r = e.custom.paraMapping.offsets[t];
            if (
                ((e.target = e.custom.paraMapping.paragraphs[r.paraIndex]),
                !e.target.isConnected)
            ) {
                const t = e.target.getAttribute("paraid");
                (e.target = e.source.paragraphIterator.getParagraphWithId(
                    t,
                    e.activeElementInfo,
                )),
                    (e.custom.paraMapping.paragraphs[r.paraIndex] = e.target);
            }
            if (this.isHiddenParagraph(e.target)) {
                const t = this.getEditingElement(e.target);
                e.target = t;
            }
            e.offset = r.offset - t;
        }
        isHiddenParagraph(e) {
            return e && null !== e.closest(this.mHiddenParaSelector);
        }
        getEditingElement(e) {
            return e.ownerDocument.querySelector(
                "div#WACViewPanel_EditingElement",
            );
        }
        clearHighlights() {
            this.mHighlightedImageOverlay &&
                ((this.mHighlightedImageOverlay.style.backgroundColor =
                    this.mHighlightedImageOverlayBackColorToRestore),
                (this.mHighlightedImageOverlay = null)),
                super.clearHighlights();
        }
        highlightImage(e, t) {
            let r = e.parentElement.querySelector("span.WACImageOverlay");
            if (
                !r &&
                ((r = e.parentElement.querySelector("span.WACImageBorder")), !r)
            )
                return;
            if (this.mHighlightedImageOverlay === r) return;
            (this.mHighlightedImageOverlay = r),
                (this.mHighlightedImageOverlayBackColorToRestore =
                    this.mHighlightedImageOverlay.style.backgroundColor);
            let i = (t.colors && t.colors.word) || "#71FDFEAA";
            7 === i.length && (i += "AA"),
                (this.mHighlightedImageOverlay.style.backgroundColor = i),
                ++this.mImageHighlightedCount;
        }
        hideImageSelections() {
            const e = document.querySelectorAll("span.WACImgSelection");
            for (const t of e) {
                const e = t;
                "none" !== e.style.display &&
                    (this.mImageSelections.push([e, e.style.display]),
                    (e.style.display = "none"));
            }
        }
        restoreImageSelections() {
            for (const [e, t] of this.mImageSelections) e.style.display = t;
            this.mImageSelections = [];
        }
    }
    class o extends t.DocumentTextMapperDelegate {
        constructor() {
            super({
                type: "ms-office-word",
                isEditor: !0,
                exclusionSelectors: [
                    "div#textareaCaretTracker",
                    "div#textareaCaretTracker *",
                    "div#predictionFeedbackTooltip *",
                    "div.ContentControlAcetateRootContainer",
                    "div.ContentControlAcetateRootContainer *",
                    "div.ClientPaginationPageAdornmentContainer",
                    "div.ClientPaginationPageAdornmentContainer *",
                    "div#WACViewPanel_ClipboardElement",
                ],
            });
        }
        getRootNode(e) {
            return this.getViewPanel(e.document || document);
        }
        createCaretPositioner() {
            return new r(this);
        }
        createParagraphIterator() {
            return new i(this);
        }
        createTextHighlighter() {
            return new n();
        }
        createSelectionHandler() {
            return new a();
        }
        acceptNodeForMapping(e, t, r) {
            const i = super.acceptNodeForMapping(e, t, r);
            if (
                e.nodeType !== Node.ELEMENT_NODE ||
                i === NodeFilter.FILTER_REJECT
            )
                return i;
            const a = e;
            if (i === NodeFilter.FILTER_SKIP) {
                if (
                    a.matches("div.WordSectionBreakContainer") ||
                    a.matches("div.PageAdornmentContainer") ||
                    a.matches("div.ContentControlAcetateRootContainer")
                )
                    return NodeFilter.FILTER_REJECT;
                if (a.matches("div.ClientPaginationPageAdornmentContainer"))
                    return NodeFilter.FILTER_REJECT;
                if (
                    a.matches("div#WACViewPanel_EditingElement") &&
                    "rewordify" === t.requestFor
                )
                    return NodeFilter.FILTER_REJECT;
            }
            if (r) {
                const i = super.paragraphIterator;
                let n = i.nodeIsParagraph(e) ? e : i.getParagraphForNode(e);
                if (
                    (!n &&
                        a.matches("div.OutlineElement") &&
                        (n = i.getClosestParagraph(a)),
                    n)
                ) {
                    const e = t.document || document,
                        a = i.getParagraphForNode(r);
                    if (!a) return NodeFilter.FILTER_REJECT;
                    if (
                        a !== n &&
                        a.parentElement === this.getParagraphEditingElement(e)
                    ) {
                        const t = this.getHiddenParagraph(e);
                        if (
                            t &&
                            (n === t ||
                                n.parentElement === t ||
                                n.compareDocumentPosition(t) &
                                    Node.DOCUMENT_POSITION_FOLLOWING)
                        )
                            return NodeFilter.FILTER_REJECT;
                    }
                }
            }
            return i;
        }
        getContentEditableForNode(e) {
            if (!e) return null;
            let t = e.parentElement;
            for (; t; ) {
                if (
                    t.getAttribute &&
                    "true" === t.getAttribute("contenteditable")
                )
                    return t;
                t = t.parentElement;
            }
            return null;
        }
        getParagraphEditingElement(e) {
            return e.querySelector("div#WACViewPanel_EditingElement");
        }
        getViewPanel(e) {
            return e.querySelector("div#WACViewPanel");
        }
        getHiddenParagraph(e) {
            return e.querySelector("div.ParaWrappingDiv.HiddenParagraph");
        }
    }
    class l extends t.TextMapperDelegateFactory {
        doCreateDelegate(t = null) {
            return e.Utils.isSruPopupElement(t) ||
                e.Utils.isSruMainContainerFrame(t) ||
                e.Utils.isSruOverlaySelectionElement(t)
                ? null
                : e.Utils.isMsOfficeWord()
                  ? new o()
                  : null;
        }
    }
    !(async function () {
        e.Logger.warn(
            `DJI Office365 Word Proxy loading into: ${window.location}`,
        ),
            t.TextMapperDelegateFactory.registerFactory(new l()),
            e.Logger.warn(
                `DJI Office365 Word Proxy loaded into: ${window.location}`,
            );
    })();
});
