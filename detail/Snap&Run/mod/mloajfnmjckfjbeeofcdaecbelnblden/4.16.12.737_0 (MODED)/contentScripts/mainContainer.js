window.sru = window.sru || {};
(function (b) {
    function e(c, f) {
        a = dji.ui.templates.load(
            c.templateMainContainer,
            "__dji_sru_main_container_iframe",
        );
        a.id = "__dji_sru_main_container_iframe";
        a.style.border = "none";
        a.style.width = "100%";
        a.style.height = "100%";
        d.shadowRoot.appendChild(a);
        dji.utils.addMultipleCssToDocument(a.contentDocument, l);
        h = dji.ui.templates.load(
            c.templateMainContainer,
            "__dji_sru_main_container_content",
        );
        h.id = h.getAttribute("dji-template-id");
        a.contentDocument.body.appendChild(h);
        f();
    }
    var g = !1,
        d = null,
        a = null,
        h = null,
        l =
            "common/ui/effects.css resources/sprite/sr/sprite.css resources/sprite/sprite-common.css contentScripts/mainContainer.css contentScripts/toolbar.css contentScripts/screenSelection.css contentScripts/speech.css contentScripts/sruToast.css contentScripts/cursors.css".split(
                " ",
            );
    b.initialize = function (c) {
        if (!g) {
            var f =
                document.documentElement.querySelector(
                    ":root > dji-word-bank",
                ) ||
                document.documentElement.querySelector(
                    ":root > dji-cowriter",
                ) ||
                null;
            d = document.createElement("dji-sru");
            d.id = "__dji_sru_main_container";
            document.documentElement.insertBefore(d, f);
            d.attachShadow({mode: "open"});
            dji.ui.templates.cache(
                "contentScripts/mainContainer.html",
                "__dji_sru_link_outlines",
                function (k) {
                    dji.utils.os().chrome &&
                        dji.utils.isGoogleForms() &&
                        k
                            .querySelectorAll("[dji-no-lqm]")
                            .forEach((m) => m.remove());
                    e({templateMainContainer: k}, c);
                },
            );
            g = !0;
        }
    };
    b.show = function (c) {
        c
            ? window.dji.utils.addClassToHtmlElements("dji-sru-active")
            : (window.dji.utils.removeClassFromHtmlElements("dji-sru-active"),
              window.dji.utils.removeClassFromHtmlElements(
                  "dji-sru-outline-active",
              ));
        window.dji.shortcuts.activate(c);
    };
    b.focus = function (c) {
        if (
            (document.activeElement === d &&
                d.shadowRoot.activeElement === a) ||
            document.activeElement === a
        )
            return c(!1);
        const f = function () {
            a.removeEventListener("focusin", f);
            c && c(!0);
        };
        a.addEventListener("focusin", f);
        a.focus();
    };
    b.contentWindow = function () {
        return a.contentWindow;
    };
    b.mainContainer = function () {
        return a.contentDocument;
    };
    b.getBoundingClientRect = function () {
        return d ? d.getBoundingClientRect() : null;
    };
    b.enterBusyState = function () {
        dji.utils.addClassToElement(
            a.contentDocument.documentElement,
            "dji-sru-main-container-busy",
        );
        dji.utils.addClassToElement(
            document.documentElement,
            "dji-sru-main-container-busy",
        );
    };
    b.leaveBusyState = function () {
        dji.utils.removeClassFromElement(
            a.contentDocument.documentElement,
            "dji-sru-main-container-busy",
        );
        dji.utils.removeClassFromElement(
            document.documentElement,
            "dji-sru-main-container-busy",
        );
    };
})((window.sru.mainContainer = window.sru.mainContainer || {}));
var __$ = (function () {
    var b = function (e, g) {
        g = g || sru.mainContainer.mainContainer();
        return $(e, g);
    };
    b.getElementById = function (e) {
        return sru.mainContainer.mainContainer().getElementById(e);
    };
    b.querySelector = function (e) {
        return sru.mainContainer.mainContainer().querySelector(e);
    };
    return b;
})();
