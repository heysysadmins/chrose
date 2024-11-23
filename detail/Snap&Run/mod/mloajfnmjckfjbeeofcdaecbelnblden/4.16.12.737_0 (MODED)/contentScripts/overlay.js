window.sru = window.sru || {};
(function (C) {
    function Q(a) {
        H &&
            (v &&
                dji.utils.addClassToHtmlElements("dji-sru-overlay-active", !0),
            dji.utils.removeEventListenerFromBodyElements(
                "pointermove",
                I,
                !1,
                !0,
            ),
            dji.utils.removeEventListenerFromDocumentElements("scroll", J),
            dji.utils.addEventListenerToBodyElements("pointermove", I, !1, !0),
            dji.utils.addEventListenerToDocumentElements("scroll", J));
    }
    function I(a) {
        M = !1;
        p.element && p.element.removeAttribute("dji-sru-no-cursor");
        M ||
            (N && clearTimeout(N),
            (N = setTimeout(function () {
                p.element && p.element.setAttribute("dji-sru-no-cursor", !0);
                M = !0;
            }, 1e3)));
        X(a.clientX, a.clientY, a.target.ownerDocument) ||
            (window.dji &&
                window.dji.ParaLineGuide &&
                window.dji.ParaLineGuide.highlightParagraphAt(
                    a.clientX,
                    a.clientY,
                    a.target.ownerDocument,
                ));
    }
    function J(a) {
        K(a.target.ownerDocument);
    }
    function X(a, b, c) {
        var d = c.documentElement.classList.contains(
                "dji-sru-screen-selection",
            ),
            k = c.documentElement.classList.contains(
                "dji-sru-rewordify-active",
            ),
            n = c.documentElement.classList.contains(
                "dji-sru-define-popup-active",
            ),
            m = d || k || n;
        v && (w.style.height = 0);
        n = v && !m ? "transparent" : x;
        k = dji.utils.activeElementInfo();
        a: {
            var h = a;
            var e = b,
                f = {element: null, x: h, y: e},
                l = c.elementFromPoint(h, e),
                g;
            b: {
                for (g = l; g; ) {
                    if (
                        g.hasAttribute("dji-sru-rewordify-group") ||
                        g.hasAttribute("dji-sru-rewordify-body") ||
                        g.hasAttribute("dji-sru-rewordify-popup")
                    ) {
                        g = !0;
                        break b;
                    }
                    g = g.parentElement;
                }
                g = !1;
            }
            if (!g)
                if (
                    k.isOverDriveReader &&
                    !c.documentElement.classList.contains(
                        "dji-sru-screen-selection",
                    )
                ) {
                    var r =
                        window.dji.mapping.DocumentTextMapperUtils.elementFromPoint(
                            c,
                            h,
                            e,
                            k,
                        );
                    if (
                        (g =
                            dji.selectionMapper.getDocumentHandlerForElement(
                                r,
                            )) &&
                        "function" === typeof g.getParagraphAtPoint &&
                        (r = g.getParagraphAtPoint(h, e, r))
                    ) {
                        "function" === typeof g.ensureOverlayFilters &&
                            g.ensureOverlayFilters();
                        f.element = r;
                        f.paragraph = r;
                        f.line =
                            "function" === typeof g.getLineAtPoint
                                ? g.getLineAtPoint(h, e, r)
                                : null;
                        h = f;
                        break a;
                    }
                } else if (
                    (k.isGoogleDocsEditor || k.isGoogleSlidesEditor) &&
                    window.dji &&
                    window.dji.ParaLineGuide &&
                    (g = window.dji.ParaLineGuide.paragraphAtPoint(h, e, c))
                ) {
                    f.element = g;
                    f.line = window.dji.ParaLineGuide.lineAtPoint(h, e, c);
                    h = f;
                    break a;
                }
            f.element = l;
            f.xyDocument = c;
            h = f;
        }
        f = h.paragraph;
        e = h.element;
        if (h.paragraph) l = h.element;
        else {
            if (!e) return !1;
            a = h.x;
            b = h.y;
            if (k.isGoogleSlidesEditor && !d) f = e;
            else {
                l = document.documentElement.classList.contains(
                    "dji-sru-screen-selection",
                );
                g = document.documentElement.classList.contains(
                    "dji-sru-rewordify-active",
                );
                r = document.documentElement.classList.contains(
                    "dji-sru-define-popup-active",
                );
                f =
                    "DIV P TABLE TBODY LI UL OL TD TH TR H1 H2 H3 H4 H5 DL DD".split(
                        " ",
                    );
                !v || l || g || r || f.push("SPAN");
                l = /kix-lineview-content|kix-lineview|dji-sru-tb-button/i;
                for (
                    g = e;
                    g &&
                    (0 > f.indexOf(g.tagName) || -1 !== g.className.search(l));

                )
                    g = g.parentElement;
                f = g;
            }
            if ((l = f) && l.classList.contains("kix-paragraphrenderer")) f = l;
            else
                a: if (
                    ((f = a),
                    (g = b),
                    e.classList && e.classList.contains("dji-svg-icon"))
                )
                    f = null;
                else if ("P" === e.tagName || e.classList.contains("k4w"))
                    f = e;
                else {
                    r =
                        "IFRAME" === e.tagName && e.contentDocument
                            ? e.contentDocument.body.childNodes
                            : e.childNodes;
                    for (var y = 0; y < r.length; y++) {
                        let R = r[y];
                        b: {
                            var A = R,
                                Y = f,
                                Z = g,
                                S = c;
                            if ("function" === typeof A.getClientRects)
                                var F = A.getClientRects();
                            else {
                                let O = S.createRange();
                                O.selectNode(A);
                                F = O.getClientRects();
                                O.detach();
                            }
                            A = T(A, Y, Z, S);
                            for (var q of F)
                                if (D(q, A.x, A.y)) {
                                    F = !0;
                                    break b;
                                }
                            F = !1;
                        }
                        if (F) {
                            f = R;
                            break a;
                        }
                    }
                    f = e.classList.contains("was-a-p") ? e : null;
                }
            (q = f)
                ? ((g = dji.utils.activeElementInfo().document),
                  (q =
                      ("DIV" === q.tagName &&
                          !q.classList.contains("was-a-p") &&
                          !q.classList.contains("kix-paragraphrenderer")) ||
                      ("function" === typeof q.getBoundingClientRect &&
                          q.getBoundingClientRect().height >=
                              0.5 * g.body.innerHeight) ||
                      (q.classList && q.classList.contains("dji-svg-icon")) ||
                      0 === q.textContent.trim().length
                          ? !1
                          : !0))
                : (q = !1);
            if (!q)
                return (
                    p.element &&
                        !p.element.classList.contains("dji-sru-ocr-para") &&
                        (p.element.style.background = n),
                    l == p.element ||
                        k.isGoogleDocsEditor ||
                        (l &&
                            l.classList.contains(
                                "dji-sru-overlay-selection",
                            )) ||
                        K(p.ownerDocument),
                    !1
                );
            l || (l = f);
            f = 1 !== l.nodeType || (k.isGoogleSlidesEditor && !d) ? e : l;
            v &&
                !m &&
                ((f = E
                    ? e.closest("div").parentElement
                    : f.closest(".textLayer")),
                f != B && ((B = f), B.insertBefore(w, B.firstChild)),
                (f = w));
        }
        if (p.element != f && (K(f.ownerDocument), (q = f), (p.element = q))) {
            q.classList.add("dji-sru-overlay-paragraph");
            g = q.querySelectorAll("g.sketchy-text-background");
            for (var u of g)
                u.classList.add("dji-sru-overlay-background-line"),
                    u.setAttribute("visibility", "hidden");
            p.background = q.style.background;
        }
        p.line !== h.line && (U(), (p.line = h.line));
        if (f.classList.contains("dji-sru-ocr-para"))
            return (
                (d = f),
                (k = dji.utils.addOpacityToColor(x, 0.3)),
                (n = dji.utils.addOpacityToColor(z, 0.3)),
                e.classList.contains("dji-sru-ocr-para")
                    ? (d.background = "${parColor}")
                    : ((h = parseFloat(e.style.top) - 2),
                      (b = h + parseFloat(e.style.height) + 4),
                      (d.style.background = `linear-gradient(${k}, ${h}px, transparent, ${h}px, ${n}, ${b}px, ${n}, ${b}px, ${k}, ${b}px, ${k})`)),
                !0
            );
        l && 3 === l.nodeType && (l = l.parentElement);
        u = l;
        c = T(u, a, b, h.xyDocument ? h.xyDocument : c);
        q = c.x;
        g = c.y;
        r = u.ownerDocument.createRange();
        y = V(u);
        if (0 === y.length) {
            r.selectNodeContents(u);
            var t = P(r, q, g);
        } else {
            c = null;
            r.setStart(u, 0);
            for (t of y)
                r.setEndBefore(t),
                    (c =
                        (y = P(r, q, g)) && (!c || c.height < y.height)
                            ? y
                            : c),
                    r.setStartAfter(t);
            r.setEnd(u, u.childNodes.length);
            t = c = (t = P(r, q, g)) && (!c || c.height < t.height) ? t : c;
        }
        if (E) var G = 1;
        else {
            c = l.clientHeight;
            u = 0;
            l = l.getClientRects();
            for (G of l) u += G.height;
            G = c / u;
        }
        if (v && !m) {
            a: {
                m = e;
                e = aa(B);
                E &&
                    !m.hasAttribute("data-textline-id") &&
                    (m = m.querySelector("span[data-textline-id]"));
                for (c = 0; c < e.length; c++)
                    if (((l = e[c]), (u = l.elements), (l = l.rect), E)) {
                        if (-1 !== u.indexOf(m)) {
                            b = l;
                            break a;
                        }
                    } else if (D(l, a, b)) {
                        b = l;
                        break a;
                    }
                b = null;
            }
            b ? ba(b) : (f = B);
        }
        if (t) {
            n = 2 * G;
            a: {
                b = f.getClientRects();
                a = 0;
                for (m = 0; m < b.length; m++) {
                    e = b[m];
                    if (
                        (e.top <= t.top || 5 >= e.top - t.top) &&
                        (t.bottom <= e.bottom || 5 >= t.bottom - e.bottom) &&
                        e.right > t.left &&
                        e.left < t.right
                    ) {
                        b = a + t.top - e.top;
                        break a;
                    }
                    a += e.height;
                }
                b = 0;
            }
            b -= n;
            n = b + G * t.height + n;
            f.style.setProperty("background-color", x, "important");
            f.style.setProperty(
                "background-image",
                `linear-gradient(transparent, ${b}px,
                                                                            transparent, ${b}px, ${z}, 
                                                                            ${n}px, ${z}, 
                                                                            ${n}px, transparent,
                                                                            ${n}px, transparent)`,
                "important",
            );
        } else f.style.setProperty("background-color", n, "important");
        k.isGoogleSlidesEditor &&
            !d &&
            ((d = h.line),
            f && f.setAttribute("filter", "url(#dji-overlay-para-filter)"),
            d && d.setAttribute("filter", "url(#dji-overlay-line-filter)"));
        return !0;
    }
    function V(a) {
        let b = [];
        a = a.childNodes;
        for (let c of a)
            (a = c) && "BR" !== a.nodeName.toUpperCase()
                ? a.getBoundingClientRect
                    ? ((a = a.getBoundingClientRect()),
                      (a = 0 < a.width && 0 <= a.height))
                    : (a =
                          "none" !==
                          a.ownerDocument.defaultView
                              .getComputedStyle(a.parentElement)
                              .getPropertyValue("display"))
                : (a = !1),
                a ? ((a = V(c)), 0 < a.length && (b = b.concat(a))) : b.push(c);
        return b;
    }
    function K(a) {
        if (
            !(
                window.dji &&
                window.dji.ParaLineGuide &&
                window.dji.ParaLineGuide.clearHighlights(a)
            ) &&
            p.element
        ) {
            p.element.style.background = p.background;
            p.element.classList.remove("dji-sru-overlay-paragraph");
            p.element.classList.remove("dji-sru-no-cursor");
            p.element.removeAttribute("filter");
            a = p.element.querySelectorAll("g.dji-sru-overlay-background-line");
            for (let b of a)
                b.classList.remove("dji-sru-overlay-background-line"),
                    b.setAttribute("visibility", "visible");
            p.element = null;
            p.background = "";
            U();
        }
    }
    function U() {
        p.line && (p.line.removeAttribute("filter"), (p.line = null));
    }
    function P(a, b, c) {
        a = a.getClientRects();
        let d = null,
            k = null;
        for (let n = 0; n < a.length; n++) {
            let m = a[n];
            for (let h = 0; 3 >= h; ++h) {
                if (
                    D(m, b, c + h) ||
                    D(m, b, c - h) ||
                    D(m, b + h, c) ||
                    D(m, b - h, c)
                ) {
                    k = !k || k.height < m.height ? m : k;
                    break;
                }
                d || (!W(m, b, c + h) && !W(m, b, c - h)) || (d = m);
            }
        }
        return k ? k : d;
    }
    function T(a, b, c, d) {
        if (a.ownerDocument === d) return {x: b, y: c};
        d = a.ownerDocument.defaultView.frameElement;
        if (!d) return {x: b, y: c};
        a = d.contentDocument.defaultView.visualViewport;
        d = d.getBoundingClientRect();
        return {
            x: (a.width / d.width) * (b - d.left),
            y: (a.height / d.height) * (c - d.top),
        };
    }
    function W(a, b, c) {
        b = Math.max(c, 0);
        return a.top <= b && b <= a.bottom;
    }
    function D(a, b, c) {
        b = Math.max(b, 0);
        c = Math.max(c, 0);
        return a.left <= b && b <= a.right && a.top <= c && c <= a.bottom;
    }
    function ba({top: a, left: b, width: c, height: d}) {
        let k = B.getBoundingClientRect();
        w.style.top = a - k.top + "px";
        w.style.left = b - k.left + "px";
        w.style.width = c + "px";
        w.style.height = d + "px";
    }
    function aa(a) {
        a = ca(a);
        if (0 === a.length) return null;
        var b = a[0].getBoundingClientRect(),
            c = Math.max(b.height / 2, 2);
        let d = [],
            k = [];
        var n = [];
        for (let m = 0; m < a.length; m++) {
            let h = a[m],
                e = h.getBoundingClientRect(),
                f = e.top - b.bottom;
            0 > e.top - b.top + e.height || 1 <= f - c || m == a.length - 1
                ? (m == a.length - 1 && d.push(h),
                  (b = d[0]),
                  (c = d[d.length - 1]),
                  (n = document.createRange()),
                  n.setStartBefore(b),
                  n.setEndAfter(c),
                  (b = n.getBoundingClientRect()),
                  k.push({elements: d, rect: b}),
                  (d = [h]),
                  (c = Math.max(Math.ceil(e.height / 2), 2)),
                  (n = [c]))
                : (0 < e.top - b.bottom &&
                      ((c = e.top - b.bottom),
                      n.push(c),
                      (c = n.reduce((l, g) => l + g, 0) / n.length)),
                  d.push(h));
            b = e;
        }
        return k;
    }
    function ca(a) {
        if (E) return Array.from(a.querySelectorAll("span[data-textline-id]"));
        a = Array.from(a.childNodes);
        return (a = a.filter(
            (b) =>
                !(
                    b.style.transform &&
                    -1 < b.style.transform.indexOf("rotate")
                ) && "__dji_pdf_paragraph" != b.id,
        ));
    }
    let H = !1,
        z = null,
        x = null,
        p = {element: null, background: ""},
        L = {showButton: [], analytics: []},
        M = !1,
        N = null,
        v = null,
        E = null,
        B = null,
        w = null;
    C.initialize = function () {
        dji.utils.isSruPwaApp() &&
            ((E = v = !0),
            (w = document.createElement("div")),
            (w.id = "__dji_pdf_paragraph"));
    };
    C.addEventListener = function (a, b) {
        dji.utils.addEventListener(L, a, b);
    };
    C.activate = function (a) {
        H !== a && dji.utils.callListeners(L, "analytics", a);
        (H = a)
            ? (v &&
                  dji.utils.addClassToHtmlElements(
                      "dji-sru-overlay-active",
                      !0,
                  ),
              dji.utils.addEventListenerToBodyElements(
                  "pointermove",
                  I,
                  !1,
                  !0,
              ),
              dji.utils.addEventListenerToDocumentElements("scroll", J),
              dji.pageObserver.addEventListener(
                  dji.pageObserver.EventTypes.IFRAME_LOADED,
                  Q,
              ))
            : (dji.pageObserver.removeEventListener(
                  dji.pageObserver.EventTypes.IFRAME_LOADED,
                  Q,
              ),
              dji.utils.removeEventListenerFromBodyElements(
                  "pointermove",
                  I,
                  !1,
                  !0,
              ),
              dji.utils.removeEventListenerFromDocumentElements("scroll", J),
              v &&
                  dji.utils.removeClassFromHtmlElements(
                      "dji-sru-overlay-active",
                      !0,
                  ),
              K(document));
    };
    C.isActive = function () {
        return H;
    };
    C.setColors = function ({overlay: a, lineGuide: b}) {
        var c =
            (null != x && "transparent" !== x) ||
            (null != z && "transparent" !== z);
        x = a || "transparent";
        z = b || "transparent";
        window.dji &&
            window.dji.ParaLineGuide &&
            window.dji.ParaLineGuide.setColors({
                paragraphColor: x,
                lineColor: z,
            });
        if (a || b) {
            c || dji.utils.callListeners(L, "showButton", {show: !0});
            var d = (c = null);
            a &&
                ((d = dji.utils.colorToRgb(dji.utils.colorToHex(a))),
                (x = dji.utils.colorFromRgb(d)));
            b &&
                ((c = dji.utils.colorToRgb(dji.utils.colorToHex(b))),
                (z = dji.utils.colorFromRgb(c)));
            a = c || d;
            b =
                0.5 <= (0.2126 * a.r + 0.7152 * a.g + 0.0722 * a.b) / 255
                    ? 1
                    : -1;
            d = dji.utils.activeElementInfo();
            c = [];
            c.push(d.document.documentElement);
            if (d.isAmazonKindle)
                for (var k = 0; k < d.iframes.length; k++)
                    d.iframes[k] &&
                        c.push(d.iframes[k].contentDocument.documentElement);
            for (d = 0; d < c.length; d++)
                (k = c[d]),
                    k.style.setProperty(
                        "--dji-parcolor",
                        dji.utils.colorFromRgb(a),
                    ),
                    k.style.setProperty("--dji-paracolor", x),
                    k.style.setProperty("--dji-linecolor", z),
                    k.style.setProperty("--dji-light", 0 < b ? "0%" : "100%"),
                    k.style.setProperty("--dji-sign", b);
            a = [
                "--dji-parcolor",
                "--dji-paracolor",
                "--dji-linecolor",
                "--dji-light",
                "--dji-sign",
            ];
            dji.utils.copyDocumentProperties(
                a,
                document,
                sru.mainContainer.mainContainer(),
            );
            sru.removeDistractions &&
                dji.utils.copyDocumentProperties(
                    a,
                    document,
                    sru.removeDistractions.removeDistractionsDocument(),
                );
        } else
            C.activate(!1),
                dji.utils.callListeners(L, "showButton", {show: !1});
    };
})((window.sru.overlay = window.sru.overlay || {}));
