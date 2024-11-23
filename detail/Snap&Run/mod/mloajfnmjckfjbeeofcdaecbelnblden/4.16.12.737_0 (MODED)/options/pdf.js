window.sru = window.sru || {};
(function (d) {
    let a = null,
        b = $("#dji-sru-load-pdfs-in-sru");
    d.initialize = function (c) {
        a = c;
        b = $("#dji-sru-load-pdfs-in-sru");
        a
            ? (a.pdfAutoOpen()
                  ? b.addClass("dji-sru-on")
                  : b.removeClass("dji-sru-on"),
              (c = !0))
            : (c = !1);
        if (c)
            b.on("change", function (e) {
                a.pdfAutoOpen(e.checked ? 1 : 0);
            });
    };
})((window.sru.pdf = window.sru.pdf || {}));
