window.sru = window.sru || {};
(function (e) {
    function f(a) {
        b.css({"background-color": a.color});
        a.noOverlay
            ? b.addClass("dji-sru-no-overlay-color")
            : b.removeClass("dji-sru-no-overlay-color");
        c.overlayColor(a.noOverlay ? null : a.color);
    }
    function g(a) {
        d.css({"background-color": a.color});
        a.noOverlay
            ? d.addClass("dji-sru-no-overlay-color")
            : d.removeClass("dji-sru-no-overlay-color");
        c.lineGuideColor(a.noOverlay ? null : a.color);
    }
    let c = null,
        b = null,
        d = null;
    e.initialize = function (a) {
        c = a;
        b = $("#dji-sru-overlay-color");
        d = $("#dji-sru-line-color");
        if (c) {
            a = c.overlayColor();
            var h = c.lineGuideColor();
            a
                ? b.css({"background-color": a})
                : b.addClass("dji-sru-no-overlay-color");
            h
                ? d.css({"background-color": c.lineGuideColor()})
                : d.addClass("dji-sru-no-overlay-color");
            a = !0;
        } else a = !1;
        a && (d.on("change", g), b.on("change", f));
    };
})((window.sru.overlayOptions = window.sru.overlayOptions || {}));
