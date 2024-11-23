window.dji = window.dji || {};
window.dji.ui = window.dji.ui || {};
(function (c) {
    var e = null,
        g = null,
        h = null,
        q = null,
        r = null,
        u = null,
        v = null,
        f = null,
        l = null,
        m = null,
        n = null,
        p = null,
        k = function (a) {
            var b = n.getBoundingClientRect(),
                d = p.getBoundingClientRect();
            (b.left <= a.x &&
                a.x <= b.right &&
                b.top <= a.y &&
                a.y <= b.bottom) ||
                (d.left <= a.x &&
                    a.x <= d.right &&
                    d.top <= a.y &&
                    a.y <= d.bottom) ||
                (a.preventDefault(), a.stopPropagation(), w());
        },
        x = function () {
            h.removeClass("active");
            g.addClass("active");
            r.hide();
            q.show();
        },
        y = function () {
            g.removeClass("active");
            h.addClass("active");
            q.hide();
            r.show();
        },
        z = function () {
            var a = t($(this).css("backgroundColor"));
            f.val(a);
            a = new CustomEvent("change", {detail: a});
            f[0].dispatchEvent(a);
        },
        A = function () {
            var a = t($(this).css("color")),
                b = t($(this).css("backgroundColor"));
            l.val(a);
            m.val(b);
            a = new CustomEvent("change", {detail: a});
            m[0].dispatchEvent(a);
            l[0].dispatchEvent(a);
        },
        t = function (a) {
            a = a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            delete a[0];
            for (var b = 1; 3 >= b; ++b)
                (a[b] = parseInt(a[b]).toString(16)),
                    1 == a[b].length && (a[b] = "0" + a[b]);
            return ("#" + a.join("")).toUpperCase();
        },
        w = function () {
            document.removeEventListener("mousedown", k, !0);
            document.removeEventListener("mouseup", k, !0);
            document.removeEventListener("click", k, !0);
            e.hide();
            p = m = l = f = null;
        };
    c.show = function (a, b, d) {
        null !== f && f.attr("id") == a
            ? setTimeout(w, 0)
            : (null === e &&
                  ((e = $("#colorPicker")),
                  (n = $(e)[0]),
                  (g = $("#colorPicker .colorPickerHeader .colors")),
                  (h = $("#colorPicker .colorPickerHeader .templates")),
                  (q = $("#colorPicker .colorsContainer")),
                  (r = $("#colorPicker .templatesContainer")),
                  (u = $("#colorPicker .colorsContainer .colorDiv")),
                  (v = $("#colorPicker .templatesContainer .colorTemplateDiv")),
                  g.click(x),
                  h.click(y),
                  u.click(z),
                  v.click(A)),
              document.addEventListener("mousedown", k, !0),
              document.addEventListener("mouseup", k, !0),
              document.addEventListener("click", k, !0),
              (f = $("#" + a)),
              (l = b && d ? $("#" + b) : null),
              (m = b && d ? $("#" + d) : null),
              (p = $(f)[0]),
              x(),
              (a = p.getBoundingClientRect()),
              (n.style.top = a.bottom + 2 + "px"),
              (n.style.right = window.innerWidth - a.right + "px"),
              l && m ? h.show() : h.hide(),
              e.show());
    };
})((window.dji.ui.colorPicker = window.dji.ui.colorPicker || {}));
$(document).ready(function () {
    $("input[type=color]").mousedown(function (c) {
        c.preventDefault();
        c.stopPropagation();
    });
    $("input[type=color]").mouseup(function (c) {
        c.preventDefault();
        c.stopPropagation();
    });
    $("input[type=color]").click(function (c) {
        c.preventDefault();
        c.stopPropagation();
        c = $(this).attr("id");
        var e = $(this).attr("fgColorElem"),
            g = $(this).attr("bgColorElem");
        window.dji.ui.colorPicker.show(c, e, g);
    });
});
