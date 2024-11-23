window.dji = window.dji || {};
window.dji.ui = window.dji.ui || {};
(function (m) {
    m.initialize = function () {
        var b = document.createElement("div");
        b.id = "dji-sru-busy-state";
        dji.utils.preventInputEventsOnTree(b, !0);
        document.body.appendChild(b);
    };
    m.enterBusyState = function () {
        window.dji.utils.addClassToElement(
            document.documentElement,
            "dji-sru-busy-state",
        );
    };
    m.leaveBusyState = function () {
        window.dji.utils.removeClassFromElement(
            document.documentElement,
            "dji-sru-busy-state",
        );
    };
})((window.dji.ui.effects = window.dji.ui.effects || {}));
(function (m) {
    var b = new Map();
    m.cache = async function (d, g, e) {
        let a = null;
        try {
            let c =
                    chrome && chrome.extension && chrome.extension.getURL
                        ? chrome.extension.getURL(d)
                        : d,
                f = await fetch(c);
            f = await f.text();
            (a = document.createRange().createContextualFragment(f)) &&
                b.set(g, a);
        } catch (c) {
            dji.logger.error(c);
        }
        e && e(a);
    };
    m.source = function (d) {
        return b.get(d) || null;
    };
    m.load = function (d, g) {
        1 === arguments.length && ((g = d), (d = void 0));
        var e = `[dji-template-id="${g}"]`;
        let a = void 0;
        if (d) (a = d.querySelector(e)) && (a = a.cloneNode(!0));
        else {
            let c = b.values();
            for (let f = c.next(); !f.done; f = c.next())
                if ((a = f.value.querySelector(e))) {
                    a = a.cloneNode(!0);
                    break;
                }
        }
        e = null;
        a && ((e = a), e.removeAttribute("id"));
        return e;
    };
})((window.dji.ui.templates = window.dji.ui.templates || {}));
(function (m) {
    m.initializeContainer = function (b, d, g) {
        var e = document,
            a = d;
        "object" === typeof d && ((e = d.source || document), (a = d.name));
        d = dji.ui.templates.load(e, a);
        if (!d) return !1;
        var c = b.querySelector(".dji-sru-pagination-container-viewport");
        b.pageTemplateInfo = {source: e, name: a};
        b.setAttribute("dji-page-template", a);
        $(d).addClass("dji-sru-page-current");
        d.style.left = "0px";
        if (g)
            try {
                g(d);
            } catch (f) {
                dji.logger.error(f);
            }
        c.appendChild(d);
        return !0;
    };
    m.initViewport = function (b) {
        b = b.querySelector(".dji-sru-pagination-container-viewport");
        b.style.left = "0px";
        b.style.width = "410px";
    };
    m.createPages = function (b, d, g, e, a) {
        var c = b.pageTemplateInfo;
        if (!c) return !1;
        var f = b.querySelector(".dji-sru-pagination-container-viewport");
        b =
            b.getBoundingClientRect().width ||
            parseInt(window.getComputedStyle(b).width);
        0 >= b &&
            (dji.logger.warning(
                "pagination.createPages: container has invalid width (",
                b,
                "). Fallback top 410px!",
            ),
            (b = 410));
        var k = b,
            h = 0,
            n = 0;
        $(f).empty();
        for (var l, p = 0; p < d; p++) {
            l = dji.ui.templates.load(c.source, c.name);
            if (!l) return !1;
            if (e)
                try {
                    e(l, p, g);
                } catch (q) {
                    dji.logger.error(q);
                }
            l.style.left = n + "px";
            l.style.display = "none";
            f.appendChild(l);
            h += b;
            n += b;
            k -= b;
        }
        l.style.display = "block";
        $(l).addClass("dji-sru-page-current");
        f.style.width = h + "px";
        f.style.left = k + "px";
        a && a(l);
    };
    m.nextPage = function (b, d, g) {
        var e = b.pageTemplateInfo;
        if (!e) return !1;
        var a = dji.ui.templates.load(e.source, e.name);
        if (!a) return !1;
        var c = b.querySelector(".dji-sru-pagination-container-viewport"),
            f = c.querySelector(".dji-sru-page-current"),
            k = b.getBoundingClientRect(),
            h = c.getBoundingClientRect();
        e = h.left - k.left - k.width;
        k = h.width + k.width;
        h = h.width;
        if (0 < e) g && g();
        else {
            var n = function () {
                c.removeEventListener("webkitTransitionEnd", n);
                f.style.display = "none";
                $(b).removeClass("dji-transition");
                $(c).removeClass("dji-transition");
                $(f).removeClass("dji-sru-page-current");
                $(a)
                    .removeClass("dji-sru-page-next")
                    .addClass("dji-sru-page-current");
                g && g(a);
            };
            c.addEventListener("webkitTransitionEnd", n);
            if (d)
                try {
                    d(a);
                } catch (l) {
                    dji.logger.error(l);
                }
            $(b).addClass("dji-transition");
            $(c).addClass("dji-transition");
            $(a).addClass("dji-sru-page-next");
            a.style.left = h + "px";
            a.style.display = "block";
            c.appendChild(a);
            c.style.width = k + "px";
            c.style.left = e + "px";
        }
    };
    m.previousPage = function (b, d, g, e) {
        var a = b.querySelector(".dji-sru-pagination-container-viewport"),
            c = a.querySelector(".dji-sru-page-current"),
            f = c.previousElementSibling;
        if (f) {
            for (var k = 1, h = c; h.previousElementSibling; )
                (h = h.previousElementSibling), k++;
            var n = 410 * (k - 1);
            h = 410 * -(k - 2);
            k = 410 * (k - 2);
            if (0 < h) e && e();
            else {
                var l = function () {
                    a.removeEventListener("webkitTransitionEnd", l);
                    c.style.display = "none";
                    a.style.width = n + "px";
                    $(b).removeClass("dji-transition");
                    $(a).removeClass("dji-transition");
                    $(c).removeClass("dji-sru-page-current");
                    $(f)
                        .removeClass("dji-sru-page-next")
                        .addClass("dji-sru-page-current");
                    if (g)
                        try {
                            g(c);
                        } catch (p) {
                            dji.logger.error(p);
                        }
                    a.removeChild(c);
                    e && e();
                };
                a.addEventListener("webkitTransitionEnd", l);
                if (d)
                    try {
                        d(f);
                    } catch (p) {
                        dji.logger.error(p);
                    }
                $(b).addClass("dji-transition");
                $(a).addClass("dji-transition");
                $(f).addClass("dji-sru-page-next");
                f.style.left = k + "px";
                f.style.display = "block";
                a.style.left = h + "px";
            }
        } else e && e();
    };
    m.homePage = function (b, d, g, e) {
        var a = b.querySelector(".dji-sru-pagination-container-viewport"),
            c = a.querySelector(".dji-sru-page-current"),
            f = a.firstElementChild;
        if (f && c != f) {
            var k = b.getBoundingClientRect();
            a.getBoundingClientRect();
            var h = k.width,
                n = function () {
                    a.removeEventListener("webkitTransitionEnd", n);
                    c.style.display = "none";
                    a.style.width = h + "px";
                    $(b).removeClass("dji-transition");
                    $(a).removeClass("dji-transition");
                    $(c).removeClass("dji-sru-page-current");
                    $(f)
                        .removeClass("dji-sru-page-next")
                        .addClass("dji-sru-page-current");
                    if (g)
                        try {
                            g(c);
                        } catch (l) {
                            dji.logger.error(l);
                        }
                    a.removeChild(c);
                    e && e(f);
                };
            a.addEventListener("webkitTransitionEnd", n);
            if (d)
                try {
                    d(f);
                } catch (l) {
                    dji.logger.error(l);
                }
            for (d = 1; d < a.children.length - 1; d++)
                a.removeChild(a.children[d]);
            $(b).addClass("dji-transition");
            $(f).addClass("dji-sru-page-next");
            f.style.left = "0px";
            f.style.display = "block";
            a.style.left = -h + "px";
            a.style.width = 2 * h + "px";
            c.style.left = k.width + "px";
            setTimeout(function () {
                $(a).addClass("dji-transition");
                a.style.left = "0px";
            }, 0);
        } else e && e(f);
    };
})((window.dji.ui.pagination = window.dji.ui.pagination || {}));
