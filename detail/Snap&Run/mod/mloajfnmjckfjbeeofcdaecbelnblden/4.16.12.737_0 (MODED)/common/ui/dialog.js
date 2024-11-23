window.dji = window.dji || {};
window.dji.ui = window.dji.ui || {};
(function (f) {
    f.showModal = function (g, e) {
        var a = $("#" + g),
            b = a.find(".__dji_cwe_dialog_close button")[0],
            c = a.find(".__dji_cwe_dialog_footer button")[0];
        $(document.body).addClass("__dji_cwe_dialog");
        a.show();
        let d = function () {
            b && b.removeEventListener("click", d, !1);
            c && c.removeEventListener("click", d, !1);
            a.hide();
            $(document.body).removeClass("__dji_cwe_dialog");
            e && e();
        };
        b && b.addEventListener("click", d, !1);
        c && c.addEventListener("click", d, !1);
    };
})((window.dji.ui.dialog = window.dji.ui.dialog || {}));
