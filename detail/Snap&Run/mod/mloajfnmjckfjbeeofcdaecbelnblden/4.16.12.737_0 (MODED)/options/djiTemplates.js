window.dji = window.dji || {};
(function (e) {
    let b = {};
    e.cache = function () {
        let a = $("div[template]").children();
        for (let c = 0; c < a.length; c++) {
            let f = a[c],
                d = f.getAttribute("dji-sru-template-id");
            d && "" !== d && (b[d] = f);
        }
    };
    e.clone = function (a) {
        return b.hasOwnProperty(a)
            ? ((a = b[a].cloneNode(!0)),
              (a.id = a.getAttribute("dji-sru-template-id")),
              a.removeAttribute("dji-sru-template-id"),
              a)
            : null;
    };
})((window.dji.templates = window.dji.templates || {}));
