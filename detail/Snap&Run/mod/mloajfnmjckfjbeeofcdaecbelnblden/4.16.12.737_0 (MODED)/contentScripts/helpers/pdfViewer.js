window.sru = window.sru || {};
window.sru.helpers = window.sru.helpers || {};
(function (e) {
    function k(a) {
        let b = a.detail && a.detail.query && a.detail.query.pageText;
        if (b && b.message) {
            let f = b.params;
            f.callbackMessage = `${b.message}.sr.${Date.now()}.${Math.round(1e5 * Math.random())}`;
            dji.utils.callListeners(d, "pageChangedInPdf", a.detail.pageId);
            g[a.detail.pageId] ||
                (window.addEventListener(f.callbackMessage, h),
                window.dispatchEvent(
                    new CustomEvent(a.detail.query.pageText.message, {
                        detail: f,
                    }),
                ));
        }
    }
    function l(a) {
        c = null;
        dji.utils.callListeners(d, "pdfDocumentChanged");
    }
    function h(a) {
        window.removeEventListener(a.type, h);
        a.error ||
            ((c = a.detail.pageId),
            (g[c] = a.detail.text),
            dji.utils.callListeners(d, "textAvailableForPageInPdf", {
                text: a.detail.text,
                uuid: c,
            }));
    }
    var d = {
            newTextAvailable: [],
            pageChangedInPdf: [],
            textAvailableForPageInPdf: [],
            pdfDocumentChanged: [],
        },
        g = {},
        c = null;
    e.initialize = function (a) {
        dji.utils.isSruPwaApp() &&
            (window.addEventListener("dji.pdf.page.changed", k),
            window.addEventListener("dji.pdf.document.willChange", l),
            dji.utils.callMethod(a));
    };
    e.addEventListener = function (a, b) {
        dji.utils.addEventListener(d, a, b);
    };
    e.removeEventListener = function (a, b) {
        dji.utils.removeEventListener(d, a, b);
    };
    e.textInfo = function (a, b) {
        return dji.utils.isSruPwaApp()
            ? c && b !== c
                ? {text: g[c], pageId: c}
                : {text: "", pageId: c}
            : {text: "", pageId: -1};
    };
})((window.sru.helpers.pdfViewer = window.sru.helpers.pdfViewer || {}));
