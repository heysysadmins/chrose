window.dji = window.dji || {};
window.dji.ui = window.dji.ui || {};
(function (e) {
    function f() {
        c.removeClass("dji-sru-visible").empty();
        $(document).off("keydown", g);
    }
    function g(a) {
        switch (a.keyCode) {
            case 13:
                $(".dji-sru-dlg-button[dji-sru-done]").click();
                break;
            case 27:
                $(".dji-sru-dlg-button[dji-sru-cancel]").click();
        }
    }
    let c = null;
    e.init = function (a) {
        c = a;
        c.on("click", "[dji-sru-cancel]", f);
    };
    e.showModalDlg = function (a, b) {
        if (c) {
            var d = dji.templates.clone(a);
            if (null !== d) {
                if (b && b.hasOwnProperty("doneCallback"))
                    $(d)
                        .find("[dji-sru-done]")
                        .on("click", function () {
                            b.doneCallback(function (h) {
                                h && f();
                            });
                        });
                else
                    $(d)
                        .find("[dji-sru-done]")
                        .on("click", function () {
                            f();
                        });
                c.append(d).addClass("dji-sru-visible");
                $(document).on("keydown", g);
                setTimeout(function () {
                    $(d).find("input:first").focus();
                });
            }
        }
    };
    e.showMessageDlg = function (a, b) {
        c &&
            ((a = dji.templates.clone(a)),
            null !== a &&
                ((b = b || {}),
                b.hasOwnProperty("title") &&
                    $(a).append(
                        jQuery("<div/>", {
                            class: "dji-sru-dlg-title",
                            text: b.title,
                        }),
                    ),
                b.hasOwnProperty("message") &&
                    $(a).append(
                        jQuery("<div/>", {
                            class: "dji-sru-dlg-message",
                            text: b.message,
                        }),
                    ),
                b.hasOwnProperty("html") &&
                    $(a).append(
                        jQuery("<div/>", {
                            class: "dji-sru-dlg-message",
                            html: b.html,
                        }),
                    ),
                b.hasOwnProperty("width") && $(a).css({width: b.width}),
                c.append(a).addClass("dji-sru-visible")));
    };
    e.hideDlg = function () {
        f();
    };
})((window.dji.ui.modalDlg = window.dji.ui.modalDlg || {}));
