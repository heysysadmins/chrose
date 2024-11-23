window.sru = window.sru || {};
(function (f) {
    let c = null,
        g = $("#dji-sru-open-on-doubleclick");
    const d = {activate: [], deactivate: []};
    f.initialize = function (a) {
        c = a;
        a = $("#dji-sru-open-on-doubleclick");
        if (c) {
            c.openOnDoubleClick()
                ? g.addClass("dji-sru-on")
                : g.removeClass("dji-sru-on");
            var b = !0;
        } else b = !1;
        if (b)
            a.on("change", function (e) {
                e = e.checked;
                c.openOnDoubleClick(e ? 1 : 0);
                dji.utils.callListeners(d, e ? "activate" : "deactivate");
            });
    };
    f.addEventListener = function (a, b) {
        d.hasOwnProperty(a) &&
            "function" == typeof b &&
            -1 == d[a].indexOf(b) &&
            d[a].push(b);
    };
})((window.sru.defineWordOptions = window.sru.defineWordOptions || {}));
