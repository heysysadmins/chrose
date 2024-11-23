window.sru = window.sru || {};
(function (e) {
    function f(a) {
        c.css({"background-color": a.color});
        b.textColor(a.color);
    }
    function g(a) {
        d.css({"background-color": a.color});
        b.wordHighlightColor(a.color);
    }
    function h(a) {
        c.css({"background-color": a.color});
        d.css({"background-color": a.highlightColor});
        b.textColor(a.color);
        b.wordHighlightColor(a.highlightColor);
    }
    let b = null,
        c = document.getElementById("textColor"),
        d = document.getElementById("wordHighlightColor");
    e.initialize = function (a) {
        b = a;
        c = $("#dji-sru-text-color");
        d = $("#dji-sru-word-highlight-color");
        b
            ? (c.css({"background-color": b.textColor()}),
              d.css({"background-color": b.wordHighlightColor()}),
              (a = !0))
            : (a = !1);
        a &&
            (c.on("change", f),
            d.on("change", g),
            $("body").on("dji-sru-change-colors", h));
    };
})((window.sru.colorOptions = window.sru.colorOptions || {}));
