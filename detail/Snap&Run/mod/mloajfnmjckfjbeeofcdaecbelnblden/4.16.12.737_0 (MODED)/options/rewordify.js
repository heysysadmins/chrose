window.sru = window.sru || {};
(function (h) {
    let b = null,
        e = $("#dji-sru-show-readability-in-icon"),
        c = $("#dji-sru-simplify-fluency"),
        g = $("#dji-sru-enable-simplify");
    h.initialize = function (f) {
        b = f;
        e = $("#dji-sru-show-readability-in-icon");
        c = $("#dji-sru-simplify-fluency");
        b
            ? (c.val(b.rewordifyFluency()).trigger({type: "change"}),
              b.enableRewordify()
                  ? (g.addClass("dji-sru-on"), c.removeAttr("disabled"))
                  : (g.removeClass("dji-sru-on"), c.attr("disabled", !0)),
              b.showReadability()
                  ? e.addClass("dji-sru-on")
                  : e.removeClass("dji-sru-on"),
              (f = !0))
            : (f = !1);
        f &&
            (g.on("change", function (a) {
                a = a.checked;
                b.enableRewordify(a ? 1 : 0);
                a ? c.removeAttr("disabled") : c.attr("disabled", !0);
            }),
            c.on("input change", function (a) {
                let d = parseInt($(a.currentTarget).val());
                switch (d) {
                    case 0:
                        d = "original";
                        break;
                    case 1:
                        d = "default";
                        break;
                    default:
                        d = "maximum words";
                }
                $(a.currentTarget)
                    .closest(".dji-sru-option-slider-item")
                    .find(".dji-sru-slider-value")
                    .text(d);
                b.rewordifyFluency(parseInt(c.val()));
            }),
            e.on("change", function (a) {
                b.showReadability(a.checked ? 1 : 0);
            }));
    };
})((window.sru.rewordifyOptions = window.sru.rewordifyOptions || {}));
