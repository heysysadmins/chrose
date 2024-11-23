window.sru = window.sru || {};
(function (f) {
    async function q({
        fromCursorToEnd: a,
        clearSelectionAtEnd: c,
        speakImage: e,
        event: h,
        entireDocument: m,
    }) {
        try {
            e && (h || window.dji.utils.getTextFromImage(e), (b = null));
            b ||
                (b = window.dji.selectionMapper.mapSelection({
                    fromCaretToEnd: a,
                    entireDocument: m,
                    clearSelection: !0,
                    requestFor: "speech",
                    event: h,
                }));
            if (b) {
                b.temp || (b.temp = {});
                b.temp.lastSelectedWordIndex = -1;
                b.clearSelectionAtEnd =
                    (dji.utils.isAmazonKindle() && a) ||
                    window.dji.utils.isOverDriveReader()
                        ? !0
                        : c;
                a = b;
                c = [];
                if (a.translations && 0 < a.translations.length)
                    for (e = 0; e < a.translations.length; e++) {
                        const k = a.translations[e];
                        c.push({
                            text: k.text,
                            isTranslated: k.translated,
                            isMath: k.isMath,
                            mathFormat: k.mathFormat,
                            indexOfPlaceholderText: k.indexOfPlaceholderText,
                        });
                    }
                else c.push({text: a.text, isTranslated: !1});
                var l = c;
                if (
                    !l ||
                    0 === l.length ||
                    (1 === l.length && (!l[0].text || 0 === l[0].text.length))
                ) {
                    b = null;
                    return;
                }
                dji.utils.preventInputEventsOnBodyElements(!0, !1, null, !0, [
                    "__dji_sru_overlaybutton",
                ]);
                window.dji.selectionMapper.enableHighlight(!0, b);
                dji.utils.addClassToHtmlElements("dji-sru-speak-waiting", !0);
                dji.utils.callListeners(g, "start", l);
            }
            return !0;
        } catch (k) {
            b &&
                (window.dji.selectionMapper.enableHighlight(!1, b), (b = null)),
                dji.logger.error(k);
        }
        return !1;
    }
    function r() {
        let a = null != b;
        dji.utils.removeEventListenerFromBodyElements("pointerdown", t, !0, !1);
        dji.utils.removeEventListenerFromBodyElements("click", u, !0, !0);
        dji.utils.preventInputEventsOnBodyElements(!1, !1, null, !0, [
            "__dji_sru_overlaybutton",
        ]);
        b &&
            (b.clearSelectionAtEnd
                ? window.dji.selectionMapper.clearSelection(b)
                : window.dji.selectionMapper.restoreSelection(b),
            window.dji.selectionMapper.enableHighlight(!1, b));
        dji.utils.removeClassFromHtmlElements("dji-sru-speak-from-cursor", !0);
        dji.utils.removeClassFromHtmlElements("dji-sru-speak-active", !0);
        dji.utils.removeClassFromHtmlElements("dji-sru-speak-waiting", !0);
        return a;
    }
    function w(a) {
        for (; a; ) {
            if (a.classList) {
                if (
                    a.classList.contains("dji-sru-toolbar") ||
                    a.classList.contains("dji-sru-outline-topic-content") ||
                    a.classList.contains("dji-sru-outline-source-content") ||
                    a.classList.contains("dji-sru-folder-page-info") ||
                    a.classList.contains("dji-sru-page-content")
                )
                    break;
                if (
                    a.classList.contains("dji-sru-outline-topic-bullet") ||
                    a.classList.contains("dji-sru-outline-source-bullet") ||
                    a.classList.contains("dji-sru-pie-toolbar")
                )
                    return !0;
            }
            if ("__dji_sru_main_container_content" === a.id) return !0;
            a = a.parentNode;
        }
        return !1;
    }
    function t(a) {
        window.dji.utils.isMathEquatioImage(a.target) && a.preventDefault();
    }
    async function u(a) {
        if (
            a.target &&
            !(
                a.target.closest(".modal-dialog.docs-dialog") ||
                dji.utils.elementHasId(a.target, "__dji_sru_overlayButton") ||
                (a.target.parentElement &&
                    dji.utils.elementHasId(
                        a.target.parentElement,
                        "__dji_sru_overlayButton",
                    ))
            )
        )
            if (
                (dji.utils.elementHasId(a.target, "__dji_sru_speakButton") ||
                    dji.utils.elementHasClass(a.target, "dji-sru-close-btn") ||
                    (a.stopPropagation(), a.preventDefault()),
                b)
            )
                dji.utils.elementHasId(a.target, "__dji_sru_speakButton") ||
                    (dji.utils.elementHasClass(a.target, "dji-sru-close-btn")
                        ? f.stop()
                        : f.restart());
            else if (!w(a.target)) {
                var c = [
                    "dji-sru-close-btn",
                    "dji-sru-overlay-child",
                    "dji-sru-toolbar",
                    "dji-sru-toolbar-button",
                ];
                if (
                    !dji.utils.elementHasId(a.target, [
                        "dji-sru-busy-state",
                        "dji-sru-screen-selection",
                        "dji-sru-x-line",
                        "dji-sru-y-line",
                        "dji-sru-crosshair",
                    ]) &&
                    !dji.utils.elementHasClass(a.target, c)
                ) {
                    let m = null;
                    a.__dji_sru_speak_cursor = !0;
                    if (
                        a.target.classList.contains("dji-sru-speak-image") &&
                        !window.dji.utils.isEquatioImg(a.target)
                    )
                        f.restart(), (m = a.target);
                    else if (
                        "A" === a.target.tagName ||
                        dji.utils.elementHasClass(a.target, [
                            "dji-sru-ocr-word",
                            "dji-sru-outline-title-in-toolbar",
                            "dji-sru-math-overlay",
                            "PSPDFKit-Text-Annotation",
                        ])
                    ) {
                        a.preventDefault();
                        a.stopPropagation();
                        var e = dji.utils.documentForElement(a.target);
                        c = e.getSelection();
                        if (
                            dji.utils.elementHasClass(a.target, [
                                "dji-sru-math-overlay",
                            ])
                        ) {
                            var h = e.getElementById(
                                a.target.getAttribute("data-parent-id") ||
                                    "__null__",
                            );
                            if (!h) {
                                dji.logger.error(
                                    "dji-sru-math-overlay doesn't have proper data-parent-id",
                                );
                                return;
                            }
                            c.removeAllRanges();
                            e = e.createRange();
                            e.selectNode(h);
                            c.addRange(e);
                            c.collapseToStart();
                        } else
                            a.target.classList.contains(
                                "PSPDFKit-Text-Annotation",
                            )
                                ? (c.empty(),
                                  (h = e.caretRangeFromPoint(
                                      a.clientX,
                                      a.clientY,
                                  )),
                                  c.addRange(h))
                                : (c.selectAllChildren(a.target),
                                  c.collapseToStart());
                    }
                    setTimeout(function () {
                        q(
                            {
                                fromCursorToEnd: !0,
                                clearSelectionAtEnd: !1,
                                speakImage: m,
                                event: a,
                            },
                            a,
                        );
                    }, 0);
                }
            }
    }
    function x(a) {
        let c = dji.utils.activeElementInfo();
        c &&
            c.document &&
            c.document.querySelectorAll("img").forEach(function (e) {
                0 < e.alt.length &&
                    (a
                        ? e.classList.add("dji-sru-speak-image")
                        : e.classList.remove("dji-sru-speak-image"));
            });
    }
    let g = {activate: [], start: [], stop: [], analytics: []},
        b = null,
        d = !1,
        n = !1,
        p = 0;
    f.addEventListener = function (a, c) {
        g.hasOwnProperty(a) &&
            "function" === typeof c &&
            -1 === g[a].indexOf(c) &&
            g[a].push(c);
    };
    f.isActive = function () {
        return d;
    };
    let v = function () {
        f.restart();
    };
    f.start = function (a, c = !1) {
        d ||
            ((d = !0),
            dji.utils.callListeners(g, "activate", d),
            dji.utils.callListeners(g, "analytics", d),
            (d = q({
                fromCursorToEnd: !1,
                clearSelectionAtEnd: a,
                entireDocument: c,
                speakImage: !1,
            })),
            x(d),
            (p = 0),
            d
                ? (dji.utils.addClassToHtmlElements(
                      "dji-sru-speak-from-cursor",
                      !0,
                  ),
                  dji.utils.preventInputEventsOnBodyElements(!0, !1, null, !0, [
                      "__dji_sru_overlaybutton",
                  ]),
                  dji.utils.addEventListenerToBodyElements(
                      "pointerdown",
                      t,
                      !0,
                      !1,
                  ),
                  dji.utils.addEventListenerToBodyElements("click", u, !0, !0))
                : (dji.utils.callListeners(g, "activate", d),
                  dji.utils.callListeners(g, "analytics", d)));
    };
    f.restart = function () {
        d && ((n = !0), dji.utils.callListeners(g, "stop"));
    };
    f.stop = function () {
        d &&
            ((n = !1),
            b ? dji.utils.callListeners(g, "stop") : r(),
            (d = !1),
            dji.utils.callListeners(g, "analytics", d),
            dji.utils.callListeners(g, "activate", d));
    };
    f.speakStart = function () {
        dji.utils.removeClassFromHtmlElements("dji-sru-speak-waiting", !0);
        dji.utils.addClassToHtmlElements("dji-sru-speak-active", !0);
        window.addEventListener("click", v);
    };
    f.speakWait = function () {
        dji.utils.removeClassFromHtmlElements("dji-sru-speak-active", !0);
        dji.utils.addClassToHtmlElements("dji-sru-speak-waiting", !0);
    };
    f.speakProgress = function (a) {
        if (d && b && a && b.temp.lastSelectedWordIndex !== a.charIndex) {
            b.temp.lastSelectedWordIndex = a.charIndex;
            if (b.source && b.source.textHighlighter) {
                const c = window.dji.selectionMapper.getColors();
                b.source.textHighlighter.highlightWithProperties(
                    b,
                    {
                        colors: c,
                        chunkLen: a.chunkLen,
                        isMath: a.isMath,
                        indexOfPlaceholderText: a.indexOfPlaceholderText,
                        mathFormat: a.mathFormat,
                        chunkOffset: a.chunkOffset,
                    },
                    a.charIndex,
                    a.charLength,
                );
            }
            p++;
        }
    };
    f.speakStop = function () {
        window.removeEventListener("click", v);
        n
            ? (dji.utils.removeClassFromHtmlElements(
                  "dji-sru-speak-waiting",
                  !0,
              ),
              dji.utils.removeClassFromHtmlElements("dji-sru-speak-active", !0),
              dji.utils.addClassToHtmlElements("dji-sru-speak-from-cursor", !0))
            : (r(),
              d && dji.utils.callListeners(g, "analytics", !1),
              (d = !1),
              dji.utils.callListeners(g, "activate", d));
        b &&
            (window.dji.selectionMapper.clearSelection(b),
            window.dji.selectionMapper.enableHighlight(!1, b),
            (b = null));
    };
    f.speakError = function (a) {
        d &&
            (dji.logger.error(a),
            DjiSruToast.show(
                "No connection. Snap&Read will use offline voice.",
                {error: !0, closeOnClick: !1},
                5e3,
            ));
    };
    f.wordsRead = function () {
        return p;
    };
})((window.sru.speech = window.sru.speech || {}));
