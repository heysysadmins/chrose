window.dji = window.dji || {};
(function (x) {
    function ba() {
        E();
    }
    function E() {
        dji.utils.preventInputEventsOnBodyElements(!1);
        dji.utils.removeEventListenerFromBodyElements("mouseup", O, !0, !0);
        dji.utils.removeEventListenerFromBodyElements("click", P, !0, !0);
        dji.utils.removeClassFromHtmlElements("dji-sru-translate-from-cursor");
        dji.utils.removeClassFromHtmlElements("dji-sru-rewordify-active");
        dji.utils.removeClassFromElement(b.main, "dji-visible");
        dji.utils.callListeners(r, "cursorChange", !1);
        b.isActive &&
            ((b.bodyText.innerText = ""),
            b.main.style.setProperty("left", "-10000px"),
            b.main.style.setProperty("top", "-10000px"),
            b.main.style.setProperty("width", "auto"),
            b.main.style.setProperty("height", "auto"),
            (b.isActive = !1));
        if (g) {
            for (
                var a = null,
                    c = g.initialContext.activeElementInfo.document,
                    f = c.getElementsByClassName("dji-sru-rewordify-chunk"),
                    l = f.length - 1;
                0 <= l;
                l--
            ) {
                var d = f[l],
                    e = d.__dji_sru_rewordify_data
                        ? d.__dji_sru_rewordify_data.originalText
                        : d.firstChild.textContent;
                a && a != d.parentElement && a.normalize();
                a = d.parentElement;
                d.parentElement.replaceChild(c.createTextNode(e), d);
            }
            a && a.normalize();
        }
        U();
        g && g && dji.selectionMapper.clearSelection(g.initialContext);
        z && dji.utils.callListeners(r, "analytics", !1);
        F = g = null;
        z = !1;
        dji.utils.callListeners(r, "deactivate");
        dji.utils.removeClassFromElement(
            document.documentElement,
            "dji-sru-bodycover",
        );
        window.dji.ui.effects.leaveBusyState();
    }
    async function Q(a) {
        try {
            if (!K.pageContextRequired) return !1;
            let d = await K.pageContextRequired();
            if (d && d.text && 0 < d.text.length && 0 < d.text.trim().length) {
                var c = d,
                    f = d.boundingRect || d.element?.getBoundingClientRect();
                dji.utils.addClassToHtmlElements("dji-sru-rewordify-active");
                V() && (d.isEditor = !0);
                F = dji.utils.generateUUID();
                if (d.isEditor) {
                    b.isActive = !0;
                    b.bodyText.innerHTML = ca(d.text.trim());
                    b.body.scrollTop = 0;
                    var l =
                        "input" !== d.type && d.custom.map
                            ? d.custom.map[0].element.parentElement
                            : d.element;
                    V() &&
                        (l = document
                            .getElementById("dji-sru-overlay-selection")
                            .getElementsByTagName("span")[0]);
                    if (l) {
                        const e = window.getComputedStyle(l, null);
                        b.body.style.fontSize = e.getPropertyValue("font-size");
                        b.body.style.fontStyle =
                            e.getPropertyValue("font-style");
                        b.body.style.fontFamily =
                            e.getPropertyValue("font-family");
                        b.body.style.fontVariant =
                            e.getPropertyValue("font-variant");
                        b.body.style.fontWeight =
                            e.getPropertyValue("font-weight");
                        l.getBoundingClientRect &&
                            (f = l.getBoundingClientRect());
                    }
                }
                window.dji.ui.effects.enterBusyState();
                b.isActive &&
                    (dji.utils.addClassToElement(
                        document.documentElement,
                        "dji-sru-bodycover",
                    ),
                    dji.utils.removeClassFromHtmlElements(
                        "dji-sru-translate-from-cursor",
                    ),
                    dji.utils.removeEventListenerFromBodyElements(
                        "mouseup",
                        O,
                        !0,
                        !0,
                    ),
                    dji.utils.removeEventListenerFromBodyElements(
                        "click",
                        P,
                        !0,
                        !0,
                    ),
                    dji.utils.callListeners(r, "cursorChange", !1));
                setTimeout(function () {
                    if (F === F) {
                        var e = c;
                        c.isEditor &&
                            (dji.utils.addClassToElement(b.main, "dji-working"),
                            dji.utils.addClassToElement(b.main, "dji-visible"),
                            (c = null),
                            b.bodyText.firstChild
                                ? (c = da.getContextWithParams({
                                      entireDocument: !0,
                                      activeElemInfo: {
                                          iframes: [],
                                          document,
                                          element: b.bodyText,
                                      },
                                  }))
                                : document.getSelection().empty());
                        if (!c || 0 >= c.text.length) E();
                        else {
                            g = {
                                initialContext: e,
                                selectionContext: c,
                                boundingRect: f,
                                translateTokens: [],
                            };
                            e = "";
                            for (
                                var m = [
                                        {
                                            length: g.selectionContext.text
                                                .length,
                                            pos: 0,
                                            words: [g.selectionContext.text],
                                        },
                                    ],
                                    n = g.selectionContext,
                                    w = n.custom.selectionOffset,
                                    h = [],
                                    k = null,
                                    u = null,
                                    t,
                                    p,
                                    G = null,
                                    y,
                                    H,
                                    q = 0;
                                q < m.length;
                                q++
                            )
                                if (
                                    ((t = m[q]),
                                    t.words && !(0 >= t.words.length))
                                )
                                    for (
                                        y = t.pos,
                                            H = t.pos + t.length,
                                            t = p = null;
                                        y < H;
                                        y++
                                    ) {
                                        try {
                                            (G = n.custom.map[y + w]),
                                                (p = G.element);
                                        } catch (A) {
                                            throw (dji.logger.error(A), A);
                                        }
                                        u && t == p
                                            ? u.range.length++
                                            : ((u = {
                                                  element: p,
                                                  range: {
                                                      offset: y,
                                                      start: G.offset,
                                                      length: 1,
                                                  },
                                              }),
                                              (k && k.element == p) ||
                                                  ((k = {
                                                      element: p,
                                                      chunks: [],
                                                  }),
                                                  h.push(k)),
                                              k.chunks.push(u));
                                        t = p;
                                    }
                            for (m = 0; m < h.length; m++)
                                if (
                                    h[m].element &&
                                    h[m].element.data &&
                                    "" != h[m].element.data.trim()
                                ) {
                                    n = h[m].chunks;
                                    w = "";
                                    for (k = 0; k < n.length; k++)
                                        (e += n[k].element.data.substr(
                                            n[k].range.start,
                                            n[k].range.length,
                                        )),
                                            (w += n[k].element.data.substr(
                                                n[k].range.start,
                                                n[k].range.length,
                                            ));
                                    g.translateTokens.push({
                                        words: [w],
                                        pos: n[0].range.offset,
                                        length: w.length,
                                    });
                                    m < h.length - 1 && (e += "||");
                                }
                            dji.utils.callListeners(
                                r,
                                "translateFromToolbar",
                                e,
                                F,
                            );
                        }
                    }
                }, 0);
            } else
                a &&
                    (window.dji.utils.addClassToHtmlElements(
                        "dji-sru-translate-from-cursor",
                    ),
                    window.dji.utils.addEventListenerToBodyElements(
                        "mouseup",
                        O,
                        !0,
                        !0,
                    ),
                    window.dji.utils.addEventListenerToBodyElements(
                        "click",
                        P,
                        !0,
                        !0,
                    ),
                    window.dji.utils.callListeners(r, "cursorChange", !0));
            return !0;
        } catch (d) {
            window.dji.logger.error(d);
        }
        return !1;
    }
    function O(a) {
        if (
            a &&
            !dji.utils.isSruMainContainerFrame(a.target) &&
            !dji.utils.elementHasSpecialAttribute(
                document.documentElement,
                "dji-sru-speak-from-cursor",
            ) &&
            !dji.utils.elementHasSpecialAttribute(
                document.documentElement,
                "dji-sru-outline-highlight-active",
            )
        ) {
            var c =
                    "dji-sru-close-btn dji-sru-overlay-child dji-sru-toolbar dji-sru-rewordify-translated svg-expand_more svg-expand_less".split(
                        " ",
                    ),
                f = ["dji-sru-rewordify-body"];
            dji.utils.elementHasId(a.target, [
                "dji-sru-busy-state",
                "dji-sru-screen-selection",
                "dji-sru-x-line",
                "dji-sru-y-line",
                "dji-sru-crosshair",
            ]) ||
                dji.utils.elementHasClass(a.target, c) ||
                dji.utils.elementHasAttribute(a.target, f) ||
                Q(!1);
        }
    }
    function P(a) {
        dji.utils.isSruMainContainerFrame(a.srcElement) ||
            dji.utils.elementHasClass(a.srcElement, [
                "dji-sru-rewordify-translated",
                "svg-expand_more",
                "svg-expand_less",
            ]) ||
            dji.utils.elementHasParent(
                a.srcElement,
                document.getElementById("dji-sru-doubleclick-choice-popup"),
            ) ||
            (a.preventDefault(), a.stopPropagation());
    }
    function ea(a) {
        a.__dji_sru_speak_cursor ||
            sru.speech.isActive() ||
            (a.preventDefault(),
            a.stopPropagation(),
            (a = a.srcElement.__dji_sru_rewordify_data.word),
            (a.currentWord = (a.currentWord + 1) % a.words.length),
            W(a),
            a.currentWord == a.words.length - 1 ? X() : U());
    }
    function W(a) {
        for (
            var c = a.chunks, f = 0, l = a.words[a.currentWord], d = 0;
            d < c.length;
            d++
        ) {
            var e = c[d],
                m = "";
            l &&
                (m =
                    d < c.length - 1
                        ? l.substring(f, f + e.range.length)
                        : l.substring(f));
            f += e.range.length;
            0 == a.currentWord
                ? dji.utils.addClassToElement(
                      e.dji_span,
                      "dji-sru-rewordify-translated-original",
                  )
                : dji.utils.removeClassFromElement(
                      e.dji_span,
                      "dji-sru-rewordify-translated-original",
                  );
            e.dji_span.innerText =
                d < c.length - 1 ? m : m + String.fromCharCode(8203);
        }
    }
    function X() {
        if (
            !(
                0 <
                document.getElementsByClassName("dji-sru-google-translate-logo")
                    .length
            )
        ) {
            var a = document.createElement("a");
            a.setAttribute("href", "http://translate.google.com");
            a.setAttribute("class", "dji-sru-google-translate-logo");
            document.body.appendChild(a);
            var c = document.createElement("img");
            c.setAttribute("class", "dji-sru-google-translate-logo-img");
            a.appendChild(c);
        }
    }
    function U() {
        0 <
            document.getElementsByClassName("dji-sru-google-translate-logo")
                .length &&
            0 ==
                document.getElementsByClassName("dji-sru-rewordify-translated")
                    .length &&
            document.body.removeChild(
                document.getElementsByClassName(
                    "dji-sru-google-translate-logo",
                )[0],
            );
    }
    function Y(a) {
        for (var c = a.toElement; c && c != b.body && c != b.main; )
            c = c.parentElement;
        c != b.body && (a.preventDefault(), a.stopPropagation());
    }
    function V() {
        return dji.utils.elementHasClass(
            document.documentElement,
            "dji-sru-screen-selection",
        );
    }
    function ca(a) {
        let c = "";
        a = a.split("\n\n");
        for (const f of a) (c += "<p>"), (c += f), (c += "</p>");
        return c;
    }
    var Z = !1,
        r = {
            activate: [],
            deactivate: [],
            translateFromToolbar: [],
            translateDone: [],
            cursorChange: [],
            analytics: [],
        };
    let K = {pageContextRequired: null};
    var z = !1,
        F = null,
        g = null,
        b = {main: null, close: null, body: null, bodyText: null, isActive: !1};
    let da = new window.dji.DocumentTextMapperAdapter();
    x.initialize = function () {
        Z = !0;
        b.main = document.createElement("div");
        b.main.setAttribute("dji-sru-rewordify-popup", !0);
        b.main.addEventListener("mousedown", Y, !0);
        b.close = document.createElement("div");
        b.close.setAttribute("class", "dji-sru-close-btn");
        b.close.addEventListener("mousedown", Y, !0);
        b.close.addEventListener("click", ba, !0);
        b.main.appendChild(b.close);
        b.body = document.createElement("div");
        b.body.setAttribute("dji-sru-rewordify-body", !0);
        b.body.setAttribute("tabindex", "0");
        b.bodyText = document.createElement("div");
        b.bodyText.setAttribute("dji-non-draggable", !0);
        b.body.appendChild(b.bodyText);
        b.main.appendChild(b.body);
        document.body.appendChild(b.main);
        dji.geometryController.attachToDOMElement(b.main, null);
    };
    x.addEventListener = function (a, c) {
        r.hasOwnProperty(a) &&
            "function" == typeof c &&
            -1 == r[a].indexOf(c) &&
            r[a].push(c);
    };
    x.setDelegate = function (a, c) {
        !K.hasOwnProperty(a) ||
            (null !== c && "function" != typeof c) ||
            (K[a] = c);
    };
    x.isActive = function () {
        return z;
    };
    x.activate = function (a, c) {
        Z &&
            a != z &&
            (a
                ? (window.dji.utils.callListeners(r, "activate"),
                  window.dji.utils.isSruPwaApp() ||
                      window.dji.utils.isCambridgeLMS() ||
                      window.dji.utils.preventInputEventsOnBodyElements(!0),
                  dji.utils.callListeners(r, "analytics", !0),
                  (z = Q(!0)),
                  z || (dji.utils.callListeners(r, "analytics", !1), E()))
                : (c && !b.isActive) || E());
    };
    x.start = function () {
        if (z) return Q(!1);
    };
    x.processTranslationDone = function (a, c) {
        if (a !== F) return !1;
        if (!c || !c.translatedText) return E(), !0;
        g.translatedText = c.translatedText;
        g.originalText = c.originalText;
        try {
            var f = g.translatedText.split("||");
            for (a = 0; a < f.length; a++)
                g.translateTokens[a]
                    ? g.translateTokens[a].words.push(f[a])
                    : g.translateTokens.push({words: [""], pos: 0, length: 0});
            var l = g.selectionContext,
                d = l.custom.selectionOffset;
            f = [];
            a = null;
            c = [];
            for (
                var e = null,
                    m = null,
                    n = null,
                    w = null,
                    h = null,
                    k = null,
                    u = null,
                    t = null,
                    p = -1,
                    G = -1,
                    y = -1,
                    H = 0;
                H < g.translateTokens.length;
                H++
            ) {
                var q = g.translateTokens[H];
                if (q.words && !(0 >= q.words.length)) {
                    G = q.pos;
                    y = q.pos + q.length;
                    k = u = null;
                    dji.logger.log(
                        g.selectionContext.text.substr(q.pos, q.length),
                        JSON.stringify(q),
                    );
                    w = {
                        index: f.length,
                        range: {start: q.pos + d, length: q.length},
                        chunks: [],
                        words: q.words,
                        currentWord: 0,
                        tooltip: q.words.join(", "),
                    };
                    for (var A = G; A < y; A++) {
                        try {
                            (t = l.custom.map[A + d]), (u = t.element);
                        } catch (L) {
                            throw (dji.logger.error(L), L);
                        }
                        h && k == u
                            ? h.range.length++
                            : ((h = {
                                  element: u,
                                  range: {
                                      offset: A,
                                      start: t.offset,
                                      length: 1,
                                  },
                                  group: w.index,
                              }),
                              w.chunks.push(h),
                              (e && e.element == u) ||
                                  ((e = {element: u, chunks: []}), c.push(e)),
                              e.chunks.push(h));
                        k = u;
                    }
                    f.push(w);
                }
            }
            g.words = f;
            for (p = 0; p < c.length; p++) {
                e = c[p];
                k = e.element;
                a = e.chunks;
                var v = document.createDocumentFragment();
                l = 0;
                var M = k.textContent;
                for (d = 0; d < a.length; d++)
                    (h = a[d]),
                        l < h.range.start &&
                            ((m = M.substring(l, h.range.start)),
                            v.appendChild(document.createTextNode(m))),
                        (m = M.substring(
                            h.range.start,
                            h.range.start + h.range.length,
                        )),
                        (l = h.range.start + h.range.length),
                        (n = document.createElement("span")),
                        (n.innerText = m),
                        n.setAttribute("dji-sru-rewordify-group", h.group),
                        n.setAttribute(
                            "class",
                            "dji-sru-rewordify-chunk dji-sru-rewordify-translated",
                        ),
                        n.addEventListener("click", ea),
                        v.appendChild(n),
                        (n.__dji_sru_rewordify_data = {
                            word: f[h.group],
                            originalText: m,
                        }),
                        (h.dji_span = n);
                l < M.length &&
                    ((m = M.substring(l)),
                    v.appendChild(document.createTextNode(m)));
                k && k.parentElement && k.parentElement.replaceChild(v, k);
            }
            for (p = 0; p < f.length; p++)
                (f[p].currentWord = Math.min(1, f[p].words.length)),
                    W(f[p]),
                    X();
            dji.utils.callListeners(r, "translateDone", !0);
            dji.utils.preventInputEventsOnBodyElements(!1);
            window.dji.ui.effects.leaveBusyState();
            var N = g.initialContext?.activeElementInfo?.iframes,
                R = g.boundingRect,
                B = b.main.getBoundingClientRect(),
                J = b.body.getBoundingClientRect(),
                S = sru.mainContainer.getBoundingClientRect(),
                fa = Math.max(1, window.devicePixelRatio),
                ha = dji.utils.elementIsVisible(g.initialContext.element);
            v = 30 / fa;
            var C = B.height,
                T = B.width;
            b.body.scrollTop = 0;
            T = Math.max(50, Math.min(S.left - 2 * v, T));
            b.main.style.height = T + "px";
            B = b.main.getBoundingClientRect();
            C = B.height;
            0 < b.body.scrollHeight &&
                (C = Math.min(400, b.body.scrollHeight + J.height));
            C = Math.max(50, Math.min(window.innerHeight - 2 * v, C));
            b.main.style.height = C + "px";
            B = b.main.getBoundingClientRect();
            var I = R.top,
                D = R.left;
            if (N && 0 < N.length)
                for (J = 0; J < N.length; J++) {
                    var aa = N[J].getBoundingClientRect();
                    I += aa.top;
                    D += aa.left;
                }
            window.innerHeight < I + C &&
                (I = window.innerHeight - C - v / 2 - 1);
            I = Math.max(I, v);
            D = Math.max(0, ha ? D + R.width + 10 : D);
            S.left < D + B.width + v && (D = S.left - B.width - v - 3);
            b.main.style.top = I + "px";
            b.main.style.left = D + "px";
            b.body.focus();
            dji.utils.removeClassFromElement(b.main, "dji-working");
        } catch (L) {
            dji.logger.error(L),
                dji.utils.callListeners(r, "translateDone", !1),
                E();
        }
        return !0;
    };
    x.toggleTranslateButton = function (a) {
        a && "english" !== a.trim().toLowerCase()
            ? sru.toolbar.showButtons({translate: !0})
            : sru.toolbar.showButtons({translate: !1});
    };
})((window.dji.translate = window.dji.translate || {}));
