window.dji = window.dji || {};
window.dji.ui = window.dji.ui || {};
(function (k) {
    function m() {
        $(b).find(".dji-sru-option-dropdown-items").empty();
        $(b).removeClass("dji-sru-dropdown-on");
        b = null;
        f.removeClass("dji-sru-visible");
    }
    let f = null,
        b = null;
    k.init = function (c) {
        f = c;
        f.on("click", m);
    };
    k.showPopup = function (c, g) {
        if (f && !$(c).hasClass("dji-sru-dropdown-on")) {
            var d = c.getAttribute("dji-sru-dropdown-id");
            if (d && "" !== d && ((d = dji.templates.clone(d)), null !== d)) {
                g = g || {};
                b = c;
                $(b).addClass("dji-sru-dropdown-on");
                var a = c.querySelector(".dji-sru-option-dropdown-items");
                a.style.top = 0;
                a.style.bottom = "initial";
                a.style.height = "initial";
                g.hasOwnProperty("alignRight") && g.alignRight
                    ? (a.style.right = "-5px")
                    : (a.style.left = "20px");
                a.appendChild(d);
                f.addClass("dji-sru-visible");
                setTimeout(function () {
                    var e = b;
                    let h = a.getBoundingClientRect();
                    e = e.getBoundingClientRect();
                    let l = $(window).height();
                    h.height >= l - 20
                        ? ((a.style.top = -e.top + 10 + "px"),
                          (a.style.bottom = "intial"),
                          (a.style.height = l - 20 + "px"))
                        : h.bottom >= l - 10 &&
                          (20 < e.bottom - h.height
                              ? ((a.style.top =
                                    -h.height + e.height - 5 + "px"),
                                (a.style.bottom = "-5px"))
                              : ((a.style.top = -e.top + 10 + "px"),
                                (a.style.bottom = "inital"),
                                (a.style.height = a.height + "px")));
                });
            }
        }
    };
    k.hidePopup = function () {
        m();
    };
})((window.dji.ui.dropdown = window.dji.ui.dropdown || {}));
