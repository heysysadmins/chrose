window.dji = window.dji || {};
window.dji.ui = window.dji.ui || {};
(function (d) {
    function e() {
        a && (clearTimeout(a), (a = null));
        c.removeClass("dji-sru-visible");
    }
    let c = null,
        a = null;
    d.init = function () {
        c = $("#dji-sru-toast");
        c.find(".dji-sru-toast-close-button").on("click", e);
    };
    d.show = function (b) {
        b = b || {};
        b.showTime = b.showTime || 5e3;
        b.message = b.message || "";
        c.find(".dji-sru-toast-message").text(b.message);
        a && (clearTimeout(a), (a = null));
        a = setTimeout(function () {
            c.removeClass("dji-sru-visible");
            a = null;
        }, b.showTime);
        c.addClass("dji-sru-visible");
    };
})((window.dji.ui.toast = window.dji.ui.toast || {}));
