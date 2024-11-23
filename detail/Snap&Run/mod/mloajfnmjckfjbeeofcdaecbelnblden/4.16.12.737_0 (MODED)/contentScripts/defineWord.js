window.sru = window.sru || {};
(function (g) {
    function M(a) {
        return (
            null !== a &&
            null !== a.documentElement &&
            a.documentElement.hasAttribute("dji-sru-remove-distractions")
        );
    }
    function X() {
        if (h) {
            if (h.ownerDocument === n) return h.shadowRoot;
            h.ownerDocument.documentElement.removeChild(h);
            h = null;
        }
        if ((h = n.querySelector("dji-sru#__dji_sru_components")))
            return h.shadowRoot;
        h = n.createElement("dji-sru");
        h.id = "__dji_sru_components";
        h.attachShadow({mode: "open"});
        const a = n.querySelector("dji-sru#__dji_sru_main_container");
        a ? n.documentElement.insertBefore(h, a) : n.documentElement.append(h);
        return h.shadowRoot;
    }
    async function Y() {
        return new Promise(async (a, b) => {
            try {
                const c = chrome.extension.getURL(
                    "contentScripts/defineWord.html",
                );
                let d = await (await fetch(c)).text();
                d = d.replace(
                    "defineWord.css",
                    chrome.extension.getURL("contentScripts/defineWord.css"),
                );
                d = d.replace(
                    "/resources/sprite/sprite-common.css",
                    chrome.extension.getURL(
                        "resources/sprite/sprite-common.css",
                    ),
                );
                d = d.replace(
                    "/resources/sprite/sr/sprite.css",
                    chrome.extension.getURL("resources/sprite/sr/sprite.css"),
                );
                const f = document.createElement("iframe");
                f.style.left = "0px";
                f.style.top = "0px";
                f.style.width = "100%";
                f.style.height = "100%";
                f.style.position = "fixed";
                f.id = "dji_sru_define_word";
                f.addEventListener(
                    "load",
                    (p) => {
                        if (
                            (p = f.contentDocument
                                .createRange()
                                .createContextualFragment(d))
                        ) {
                            var Z = p.querySelectorAll("link");
                            for (const aa of Z)
                                f.contentDocument.head.append(aa);
                            f.contentDocument.addEventListener("click", E);
                            N = f;
                            a(p.querySelector("dji-sru-define-container"));
                        } else b();
                    },
                    {once: !0},
                );
                X().append(f);
            } catch (c) {
                dji.logger.error(c), b();
            }
        });
    }
    function O(a) {
        a.stopPropagation();
        a.preventDefault();
        chrome.runtime.sendMessage(
            {
                message: "com.donjohnston.sru.defineWord.openOnDoubleClick",
                params: {state: !0},
            },
            function (b) {
                dji.utils.ignoreLastError();
                w = x = !0;
                u();
            },
        );
    }
    function P(a) {
        a.stopPropagation();
        a.preventDefault();
        chrome.runtime.sendMessage(
            {
                message: "com.donjohnston.sru.defineWord.openOnDoubleClick",
                params: {state: !1},
            },
            function (b) {
                dji.utils.ignoreLastError();
                x = !0;
                w = !1;
                u();
            },
        );
    }
    function ba(a) {}
    function F(a) {
        y.innerHTML = "";
        e.querySelector(".dji-sru-define-word-title").innerHTML = k.text;
        let b = m.querySelector(
                "[dji-sru-template-id=dji-sru-word-definition]",
            ),
            c = function (d) {
                let f = b.cloneNode(!0),
                    p = f.querySelector(
                        ".dji-sru-word-definition-text-content",
                    );
                p.innerHTML = ca(d);
                y.append(f);
                f.querySelector("[dji-copy]").addEventListener(
                    "click",
                    function () {
                        Q(p);
                    },
                );
            };
        if (a)
            k.bestSense
                ? (c(k.bestSense),
                  1 === k.senses.length + k.baseSenses.length &&
                      e.classList.add("dji-sru-one-result"))
                : e.classList.add("dji-sru-no-result");
        else {
            for (a = 0; a < k.senses.length; a++) c(k.senses[a]);
            for (a = 0; a < k.baseSenses.length; a++) c(k.baseSenses[a]);
        }
        setTimeout(() => {
            R();
        });
    }
    function S() {
        let a = q.getElementsByClassName("dji-sru-icon");
        for (; 0 < a.length; ) q.removeChild(a[0]);
    }
    function da(a) {
        let b = m
                .querySelector("[dji-sru-temple-id='dji-sru-icon']")
                .cloneNode(!0),
            c = b.querySelector("img");
        b.addEventListener("pointerenter", function () {
            b.classList.add("dji-visible");
        });
        b.addEventListener("mouseleave", function () {
            b.classList.remove("dji-visible");
        });
        b.querySelector(".dji-sru-copy-icon").addEventListener(
            "click",
            function () {
                Q(c);
            },
        );
        c.src = a.url;
        b.querySelector(".dji-sru-icon-tooltip").innerText = a.attribution;
        return b;
    }
    function Q(a) {
        let b = a.ownerDocument.getSelection();
        var c = a.ownerDocument.createRange();
        c.selectNode(a);
        b.addRange(c);
        "Range" !== b.type && (b.empty(), b.addRange(c));
        c = a.ownerDocument.execCommand("copy");
        b.empty();
        c &&
            ((a =
                "IMG" === a.tagName.toUpperCase()
                    ? "Image copied"
                    : "Text copied"),
            DjiSruToast.show(a, {closeOnClick: !0}, 3e3));
    }
    function ea(a) {
        let b = [],
            c = [];
        if (a.senses)
            for (var d = 0; d < a.senses.length; d++) {
                var f = G(a.senses[d]);
                b.push(f);
            }
        if (a.baseSenses)
            for (d = 0; d < a.baseSenses.length; d++)
                (f = G(a.baseSenses[d])), c.push(f);
        return {
            senses: b,
            baseSenses: c,
            bestSense: a.bestSense ? G(a.bestSense) : null,
            icons: v,
            text: a.text,
        };
    }
    function G(a) {
        let b = {};
        a = a.split("###");
        5 === a.length &&
            ((b.baseForm = a[0]),
            (b.pos = a[1]),
            (b.frequency = a[2]),
            (b.definition = a[3]),
            (b.synonims = a[4]));
        return b;
    }
    function ca(a) {
        let b;
        b =
            a.baseForm.toUpperCase() !== k.text.toUpperCase()
                ? "<b>" + a.baseForm + "</b> "
                : "";
        b += 0 < a.pos.length ? "(" + a.pos + ") " : "";
        b += a.definition;
        return (b +=
            0 < a.synonims.length ? " (<i>" + a.synonims + "</i>)" : "");
    }
    function z() {
        A.removeAttribute("active");
    }
    function u() {
        r.removeAttribute("active");
        r.querySelector("#dji-sru-open-on-doubleclick").removeEventListener(
            "click",
            O,
        );
        r.querySelector(
            "#dji-sru-open-on-doubleclick-dismiss",
        ).removeEventListener("click", P);
    }
    function H() {
        k = null;
        window.dji.utils.removeClassFromHtmlElements(
            "dji-sru-define-popup-active",
        );
        var a = l.querySelectorAll(".dji-sru-define-popup-selection");
        for (let b = 0; b < a.length; b++) a[b].remove();
        a = e.querySelector("#dji-sru-more-definition i");
        a.classList.remove("svg-expand_less");
        a.classList.add("svg-expand_more");
        a.removeAttribute("expanded");
        y.innerHTML = "";
        e.className = "";
        e.querySelector(".dji-sru-define-popup-arrow").style.left = "";
        S();
        l.parentElement && l.parentElement.removeChild(l);
        window.dji.utils.preventInputEventsOnBodyElements(!1);
        t.__activeWindow &&
            (t.__activeWindow.removeEventListener("scroll", t),
            (t.__activeWindow = null));
    }
    function E(a) {
        a.target.closest("#dji-sru-define-popup") || (H(), z(), u());
    }
    function fa(a) {
        if (
            a.target === l ||
            a.target.classList.contains("dji-sru-define-no-result")
        )
            H(), z(), u();
    }
    function T(a, b, c) {
        if (e) {
            var d = window
                .getComputedStyle(e.ownerDocument.documentElement)
                .getPropertyValue("--dji-sru-define-popup-width");
            d && "" !== d
                ? b(!0)
                : 0 > a
                  ? b(!1)
                  : ((a -= 100), window.setTimeout(() => T(a, b, c), 100));
        } else b(!1);
    }
    function ha(a) {
        return new Promise((b, c) => {
            T(a, b, c);
        });
    }
    async function R() {
        await ha(1e3);
        var a =
            B && 0 < B.length
                ? B
                : window.dji.selectionMapper.getSelectionRects(!0, I);
        if (a && 0 !== a.length) {
            var b = a[0];
            b = b.rect ? b.rect : b;
            var c = m.querySelector(
                "[dji-sru-template-id=dji-sru-define-popup-selection]",
            );
            if (!J) {
                for (var d of a) {
                    a = c.cloneNode(!0);
                    a.removeAttribute("dji-sru-template-id");
                    var f = d.bbox ? d.bbox : d;
                    l.append(a);
                    a.style.top = f.top + "px";
                    a.style.left = f.left + "px";
                    a.style.width = f.width + "px";
                    a.style.height = f.height + "px";
                    a.style.transform = d.matrix ? d.matrix.toString() : void 0;
                    a.style.transformOrigin = d.matrix ? "top left" : void 0;
                    a.style.backgroundColor = C || "rgba(11, 175, 29, 0.4)";
                }
                J = !0;
            }
            d = e.getBoundingClientRect();
            c = d.height;
            d = d.width;
            15 <= b.top - c
                ? (e.classList.remove("dji-sru-reverse"),
                  (e.style.top = b.top - c - 5 + "px"))
                : (e.classList.add("dji-sru-reverse"),
                  (e.style.top =
                      (void 0 !== b.bottom ? b.bottom : b.top + b.height) +
                      5 +
                      "px"));
            f = sru.mainContainer.getBoundingClientRect();
            c = (d - b.width) / 2;
            a = c < b.left;
            f = b.left + c + b.width < f.left;
            var p = e.querySelector(".dji-sru-define-popup-arrow");
            a && f
                ? (e.style.left = b.left - c + "px")
                : a
                  ? f ||
                    ((e.style.left = b.right - d + "px"),
                    (p.style.left = d - b.width / 2 + "px"))
                  : ((e.style.left = b.left + "px"),
                    (p.style.left = b.width / 2 + "px"));
            e.style.visibility = "visible";
        }
    }
    function ia(a) {
        a.stopPropagation();
        a.preventDefault();
        z();
    }
    function ja(a) {
        a.preventDefault();
        a.stopPropagation();
        a = e.getBoundingClientRect();
        K.scrollTop = 0;
        var b = e.querySelector("#dji-sru-more-definition i");
        b.hasAttribute("expanded")
            ? (b.removeAttribute("expanded"),
              b.classList.remove("svg-expand_less"),
              b.classList.add("svg-expand_more"),
              F(!0),
              e.classList.remove("dji-sru-more-definition"),
              e.classList.contains("dji-sru-reverse") ||
                  ((b = a.top),
                  (a = a.height - e.getBoundingClientRect().height),
                  (e.style.top = b + a + "px")))
            : (b.setAttribute("expanded", "true"),
              b.classList.remove("svg-expand_more"),
              b.classList.add("svg-expand_less"),
              F(!1),
              e.classList.add("dji-sru-more-definition"));
    }
    function U() {
        var a = g.openOnDoubleClick()
            ? !(
                  sru.speech.isActive() ||
                  sru.screenSelection.isActive() ||
                  dji.translate.isActive() ||
                  sru.toolbar.isHighlightActive() ||
                  g.isActive()
              )
            : !1;
        if (a) {
            I = window.dji.utils.activeElementInfo();
            var b = new window.dji.DocumentTextMapperAdapter();
            a = b.mapDocumentSelection(
                Object.assign(I, {requestFor: "defineWord"}),
            );
            const c = a?.text;
            c &&
                0 < c.length &&
                ((b =
                    null != a.boundingRect
                        ? [a.boundingRect]
                        : b.getRectsByRange(a, a.offset, a.text.length)),
                g.activate(c, b),
                b &&
                    0 < b.length &&
                    window.dji.selectionMapper.clearSelection(a));
        }
    }
    function V(a) {
        a = !(
            sru.speech.isActive() ||
            sru.screenSelection.isActive() ||
            g.isActive()
        );
        dji.utils.callListeners(L, "enable", {enable: a});
    }
    let L = {activate: [], enable: []},
        n = document,
        h = null,
        N = null,
        l = null,
        m = null,
        e = null,
        K = null,
        y = null,
        A = null,
        q = null,
        r = null,
        k = null,
        v = null,
        C = void 0,
        w = !1,
        x = !1,
        W = null,
        B = null,
        D = !1,
        I = null,
        J = !1,
        t = (a) => {
            l.classList.add("dji-sru-parent-page-content-scrolled");
        };
    g.initialize = async function () {
        if ((m = await Y()))
            (l = m.querySelector("#dji-sru-define-popup-overlay")),
                l.addEventListener("click", E),
                (e = m.querySelector("#dji-sru-define-popup")),
                (r = m.querySelector("#dji-sru-doubleclick-choice-popup")),
                (K = m.querySelector(".dji-sru-define-word-container")),
                (y = m.querySelector(".dji-sru-define-word-content")),
                (A = m.querySelector(".dji-sru-popup-info")),
                (q = m.querySelector(".dji-sru-images-container")),
                e
                    .querySelector("#dji-sru-more-definition")
                    .addEventListener("click", ja),
                A.addEventListener("click", ia),
                l.addEventListener("click", E),
                l.addEventListener("dblclick", fa),
                K.addEventListener("click", ba);
    };
    g.addEventListener = function (a, b) {
        dji.utils.addEventListener(L, a, b);
    };
    g.activate = function (a, b) {
        W = dji.utils.generateUUID();
        B = b;
        J = !1;
        dji.utils.callListeners(L, "activate", {session: W, text: a});
    };
    g.displayPopup = async function (a) {
        const b = window.dji.utils.activeElementInfo().document;
        n !== b && (M(n) || M(b)) && ((n = b), await g.initialize());
        window.dji.utils.preventInputEventsOnBodyElements(!0);
        l.classList.remove("dji-sru-parent-page-content-scrolled");
        b.defaultView.addEventListener("scroll", t);
        t.__activeWindow = b.defaultView;
        N.contentDocument.body.appendChild(l);
        e.style.visibility = "hidden";
        k = ea(a);
        S();
        q.classList.add("dji-sru-icons-loading");
        F(!0);
        window.dji.utils.addClassToHtmlElements(
            "dji-sru-define-popup-active",
            !0,
        );
        setTimeout(async function () {
            await R();
            A.setAttribute("active", !0);
            x ||
                (r.setAttribute("active", !0),
                r
                    .querySelector("#dji-sru-open-on-doubleclick")
                    .addEventListener("click", O),
                r
                    .querySelector("#dji-sru-open-on-doubleclick-dismiss")
                    .addEventListener("click", P));
        }, 0);
    };
    g.displayIcons = function (a) {
        v = a.icons || [];
        if (k && k.bestSense && 0 !== v.length) {
            e.classList.remove("dji-sru-no-images");
            a = Math.min(4, v.length);
            for (var b = 0; b < a; b++) {
                const c = da(v[b]);
                q.append(c);
            }
        } else
            e.classList.contains("dji-sru-reverse") ||
                ((a = q.getBoundingClientRect().height),
                (b = e.getBoundingClientRect().top),
                (e.style.top = b + a + "px")),
                e.classList.add("dji-sru-no-images");
        q.classList.remove("dji-sru-icons-loading");
    };
    g.setColor = function (a) {
        a = dji.utils.colorToHex(a);
        a = dji.utils.colorToRgb(a);
        C = [a.r, a.g, a.b].join(", ");
        C = "rgba(" + C + ", 0.4)";
    };
    g.applyDefineWordSettings = function (a) {
        w = a.openOnDoubleClick;
        x = a.userDefined;
    };
    g.openOnDoubleClick = function () {
        return w;
    };
    g.hide = function () {
        H();
        z();
        u();
    };
    g.isActive = function () {
        return dji.utils.elementHasClass(
            document.documentElement,
            "dji-sru-define-popup-active",
        );
    };
    g.addListeners = function () {
        D ||
            (dji.utils.addEventListenerToBodyElements("dblclick", U),
            dji.utils.addEventListenerToBodyElements("contextmenu", V),
            (D = !0));
    };
    g.removeListeners = function () {
        D &&
            (dji.utils.removeEventListenerFromBodyElements("dblclick", U),
            dji.utils.removeEventListenerFromBodyElements("contextmenu", V),
            (D = !1));
    };
})((window.sru.defineWord = window.sru.defineWord || {}));
