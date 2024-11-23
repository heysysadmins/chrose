window.dji = window.dji || {};
window.dji.ui = window.dji.ui || {};
(function (f) {
    function h() {
        $(c).find(".dji-sru-option-dropdown-items").empty();
        c = null;
        b.removeClass("dji-sru-visible");
    }
    let b = null,
        c = null;
    f.init = function (a) {
        b = a;
        b.on("click", h);
    };
    f.showPopup = function (a) {
        if (b) {
            var g = dji.templates.clone("dji-sru-color-popup");
            if (null !== g) {
                c = a;
                var d = a.getBoundingClientRect(),
                    e = document.querySelector("html").scrollTop;
                e = d.top - e < window.innerHeight - d.top + e;
                a = a.querySelector(".dji-sru-option-dropdown-items");
                e
                    ? ((a.style.top = d.height + "px"),
                      (a.style.bottom = "initial"))
                    : ((a.style.top = "initial"),
                      (a.style.bottom = d.height + "px"));
                a.style.right = "-1px";
                a.style.width = "194px";
                a.append(g);
                b.addClass("dji-sru-visible");
            }
        }
    };
    f.hidePopup = function () {
        $(c).find(".dji-sru-option-dropdown-items").empty();
        c = null;
        b.removeClass("dji-sru-visible");
    };
})((window.dji.ui.colorPicker = window.dji.ui.colorPicker || {}));
