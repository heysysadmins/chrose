window.dji = window.dji || {};
(function () {
    window.helpers = window.helpers || {};
    (function (p) {
        function B(a) {
            a.attr("readability-id");
            return a.attr("readability-id");
        }
        function m(a) {
            a = a.attr("readability-score");
            return -1 === [null, void 0].indexOf(a) ? parseFloat(a) : 0;
        }
        function l(a, b) {
            a.attr("readability-score", b.toString().replace(/[ ,]/g, "."));
        }
        function k(a, b) {
            l(a, m(a) + b);
        }
        function q(a, b) {
            b && (b.removeAttr("style"), $("*", b).removeAttr("style"));
        }
        function u(a) {
            $("img", a).each(function () {
                var b = $(this);
                b.attr("src") &&
                    b.attr("data-lazy-src") &&
                    b.attr("src", b.attr("data-lazy-src"));
                if ("PICTURE" != b.parent().prop("tagName").toUpperCase())
                    for (var d = 0; d < this.attributes.length; d++) {
                        var c = this.attributes[d];
                        c &&
                            c.specified &&
                            "src" != c.name &&
                            "alt" != c.name &&
                            "height" != c.name &&
                            "width" != c.name &&
                            b.removeAttr(c.name);
                    }
            });
        }
        function n(a) {
            $("figure", a).each(function () {
                var b = $(this),
                    d = $("picture", b);
                $("div", b).each(function () {
                    var c = $(this);
                    if (
                        void 0 !== c.css("background-image") &&
                        0 === c.children().length &&
                        0 === d.length
                    ) {
                        var f = $("img", c.parent()),
                            g = c.css("background-image");
                        0 <= g.indexOf("url(") &&
                            ((g = g.slice(
                                g.indexOf("(") + 2,
                                g.lastIndexOf(")") - 1,
                            )),
                            0 < f.length && $(f[0]).attr("src") === g
                                ? c.remove()
                                : ((f = $("<img>")),
                                  f.attr("src", g),
                                  c.replaceWith(f)));
                    }
                });
            });
        }
        function y(a, b) {
            a = $("a", b);
            b = v(b).length;
            var d = 0;
            a.each(function (c, f) {
                f = $(f);
                c = f.attr("href");
                !c || (0 < c.length && "#" === c[0]) || (d += v(f).length);
            });
            return d / b;
        }
        function D(a) {
            var b = 0,
                d = a.attr("class");
            a = a.attr("id");
            d &&
                (-1 !== d.search(r.negativeRe) && (b -= 25),
                -1 !== d.search(r.positiveRe) && (b += 25));
            "string" === typeof a &&
                "" !== a &&
                (-1 !== a.search(r.negativeRe) && (b -= 25),
                -1 !== a.search(r.positiveRe) && (b += 25));
            return b;
        }
        function E(a, b, d) {
            $(d, b).each(function () {
                var c = $(this);
                if (!("div" == d && 0 < c.closest("figure").length)) {
                    var f = D(c);
                    if (0 > f) c.remove();
                    else {
                        var g = ",";
                        if (10 > v(c).split(g).length) {
                            g = $("p", c).length;
                            var w = $("img", c).length,
                                F = $("li", c).length - 100,
                                A = $("input", c).length,
                                C = y(a, c),
                                I = v(c).length,
                                e = !1;
                            w > g && 1 < w
                                ? (e = !0)
                                : F > g && "ul" !== d && "ol" !== d
                                  ? (e = !0)
                                  : A > Math.floor(g / 3)
                                    ? (e = !0)
                                    : 25 > I && (0 === w || 2 < w)
                                      ? (e = !0)
                                      : 25 > f && 0.5 < C
                                        ? (e = !0)
                                        : 25 <= f && 0.5 < C && (e = !0);
                            e && c.remove();
                        }
                    }
                }
            });
        }
        function x(a, b) {
            a = $(b, a);
            for (b = 0; b < a.length; b++) H($(a[b])) || $(a[b]).remove();
        }
        function H(a) {
            var b = !0;
            a = v(a);
            if (0 != a.length) {
                var d = a[a.length - 1];
                if (
                    25 > a.length ||
                    (100 > a.length && "." != d && "?" != d && "!" != d)
                )
                    b = !1;
            }
            return b;
        }
        function G(a, b) {
            b.isNationalGeographic &&
                ((b = $("section.main-section", a).clone()),
                $("div.inline-gallery--ui-variant-control, .promo", b).remove(),
                $("#contributor-portal-target", b).remove(),
                $(".LazyLoad > .external-image > img", b).remove(),
                a.children().remove(),
                a.append(b));
        }
        function M(a, b, d) {
            $("[__readability_hidden]", b).each(function () {
                $(this).remove();
            });
            q(a, b);
            u(b);
            E(a, b, "table");
            E(a, b, "ul");
            E(a, b, "div");
            $("p", b).each(function () {
                var c = $(this),
                    f = $("img", c).length,
                    g = $("embed", c).length,
                    w = $("object", c).length;
                0 === f && 0 === g && 0 === w && "" === v(c, !1) && c.remove();
            });
            d.forSummary && x(b, "li");
            x(b, "td");
            x(b, "option");
        }
        function K(a) {
            a.readability = !0;
            var b = B(a) || Math.random().toString(36).slice(2);
            a.attr("readability-id", b);
            switch (a[0].tagName.toUpperCase()) {
                case "ARTICLE":
                    k(a, 10);
                    break;
                case "SECTION":
                    k(a, 8);
                    break;
                case "DIV":
                    k(a, 5);
                    break;
                case "PRE":
                case "TD":
                case "BLOCKQUOTE":
                    k(a, 3);
                    break;
                case "ADDRESS":
                case "OL":
                case "UL":
                case "DL":
                case "DD":
                case "DT":
                case "LI":
                case "TH":
                case "FORM":
                    k(a, -3);
                    break;
                case "H1":
                case "H2":
                case "H3":
                case "H4":
                case "H5":
                case "H6":
                    k(a, 0);
            }
            a.is("[itemscope]") &&
                (k(a, 5),
                a.attr("itemtype") &&
                    /blog|post|article/i.test(a.attr("itemtype")) &&
                    k(a, 30));
            k(a, D(a));
        }
        function J(a) {
            return !a.attr("__readability_hidden");
        }
        var r = {
            unlikelyCandidatesClasses:
                ".combx,.modal,.lightbox,.comment,.disqus,.foot,.footer,.header,.menu,.meta,.nav,.rss,.shoutbox,.sidebar,.sponsor,.social,.teaserlist,.time,.tweet,.twitter,.low-rez-image",
            wikipediaUnlikelyCandidatesClasses:
                ".reflist,.mw-editsection,.navbox,.refbegin",
            wikipediaUnlikelyCandidatesIds:
                "#References,#Notes,#Bibliography,#Citations,#Further_reading",
            unlikelyCandidatesIds:
                "#combx,#modal,#lightbox,#comment,#disqus,#foot,#footer,#header,#menu,#meta,#nav,#rss,#shoutbox,#sidebar,#sponsor,#social,#teaserlist,#time,#tweet,#twitter",
            positiveRe:
                /article|body|content|entry|hentry|page|pagination|post|text|paragraph/i,
            negativeRe:
                /combx|comment|contact|foot|footer|footnote|link|meta|promo|related|scroll|shoutbox|sponsor|utility|tags|widget/i,
            divToPElements: "a,blockquote,dl,div,ol,p,pre,table,ul",
            trimRe: /^\s+|\s+$/g,
            normalizeRe: /\s{2,}/g,
            invalidElements:
                "script,noscript,style,footer,menu,nav,center,ins,iframe,form,object,.comment-count,.fb-comments,.close,sup,button",
        };
        p.debug = function (a) {};
        p.readabilityOptions = function () {
            return r;
        };
        var v = (p.getInnerText = function (a, b) {
            b = "undefined" === typeof b ? !0 : b;
            a = a.text().trim();
            return b ? a.replace(r.normalizeRe, " ") : a;
        });
        p.grabTitle = function (a) {
            a = $("head", a);
            var b = $("title", a).text() || "",
                d;
            " | ; _ ; - ;\u00c2\u00ab;\u00c2\u00bb;\u00e2\u20ac\u201d"
                .split(";")
                .forEach(function (c) {
                    if (d) return b;
                    c = b.split(c);
                    1 < c.length && (d = c[0].trim());
                });
            return d && 10 < d.length ? d : b;
        };
        p.grabAuthor = function (a, b) {
            b = $("div,p,span", a);
            for (var d = 0; d < b.length; d++) {
                var c = $(b[d]),
                    f = b[d].className;
                if (
                    f &&
                    -1 != f.indexOf("author") &&
                    ((c = v(c)), 50 > c.length)
                )
                    return c;
            }
            a = $("meta", a);
            for (b = 0; b < a.length; b++)
                if (
                    ($(a[b]).attr("name") &&
                        -1 != $(a[b]).attr("name").indexOf("author")) ||
                    ($(a[b]).attr("property") &&
                        -1 != $(a[b]).attr("property").indexOf("author"))
                )
                    return $(a[b]).attr("content");
            return "";
        };
        p.grabFormattedText = function (a) {
            var b = function (d) {
                var c = "";
                if (d.nodeType == document.TEXT_NODE)
                    c = d.nodeValue.replace(/\s+/g, " ");
                else if (d.nodeType == document.COMMENT_NODE) c = "";
                else {
                    for (var f = 0, g = d.childNodes.length; f < g; f++)
                        c += b(d.childNodes[f]);
                    f = d.currentStyle
                        ? d.currentStyle.display
                        : document.defaultView
                              .getComputedStyle(d, null)
                              .getPropertyValue("display");
                    if (
                        f.match(/^block/) ||
                        f.match(/list/) ||
                        f.match(/row/) ||
                        "BR" == d.tagName.toUpperCase() ||
                        "HR" == d.tagName.toUpperCase() ||
                        "P" == d.tagName.toUpperCase()
                    )
                        c += "\n\n";
                }
                return c;
            };
            return b(a);
        };
        p.grabArticle = function (a, b) {
            var d = {articleContent: null, originalLength: 0};
            b = b || {};
            b.hostnameInfo && G(a, b.hostnameInfo);
            $(r.invalidElements, a).remove();
            b.preserveUnlikelyCandidates ||
                ($(
                    r.unlikelyCandidatesIds + "," + r.unlikelyCandidatesClasses,
                    a,
                ).remove(),
                $(r.wikipediaUnlikelyCandidatesClasses, a).remove(),
                $(r.wikipediaUnlikelyCandidatesIds, a).remove());
            n(a);
            $("div", a).each(function () {
                var e = $(this);
                if (!J(e)) e.remove();
                else if (b.forSummary && 0 == e.children().length && !H(e))
                    e.remove();
                else if (0 === $(r.divToPElements, e).length) {
                    var h = $("<p>" + e.html() + "</p>");
                    h.attr("class", e.attr("class"));
                    h.attr("id", e.attr("id"));
                    e.replaceWith(h);
                }
            });
            var c = v(a, !0).length,
                f = [];
            $("p", a).each(function (e, h) {
                h = $(h);
                if (J(h)) {
                    e = h.parent();
                    var z = e.parent();
                    if (J(e)) {
                        if (((h = v(h)), !(25 > h.length))) {
                            B(e) || (K(e), f.push(e));
                            B(z) || (K(z), f.push(z));
                            var t = 0;
                            ++t;
                            t += h
                                .replace("\u00ef\u00bc\u0152", ",")
                                .split(",").length;
                            t += Math.min(Math.floor(h.length / 100), 3);
                            k(e, t);
                            k(z, t / 2);
                        }
                    } else e.remove();
                } else h.remove();
            });
            var g = null;
            f.forEach(function (e) {
                l(e, m(e) * (1 - y($, e)));
                if (!g || m(e) > m(g)) g = e;
            });
            if (!g) return d;
            var w = $('<div id="readability-content"></div>'),
                F =
                    !0 === b.onlyArticleBody
                        ? g.children()
                        : g.parent().children();
            if (2 >= F.length) {
                var A = g.parent().parent();
                if (A) {
                    A = A.children();
                    var C = [];
                    $(A).each(function (e, h) {
                        e = $(h).children();
                        0 < e.length && (C = C.concat(e));
                    });
                    0 < C.length && (F = $(C));
                }
            }
            A = m(g);
            var I = Math.min(5, 0.2 * A);
            F.each(function (e, h) {
                h = $(h);
                e = !1;
                !0 !== b.onlyArticleBody && B(h) === B(g) && (e = !0);
                var z = $("img", h).length,
                    t = m(h);
                if (t >= I || (0 == t && 0 < z)) e = !0;
                if ("P" === h[0].tagName.toUpperCase()) {
                    z = y(a, h);
                    t = v(h);
                    var L = t.length;
                    80 < L && 0.25 > z
                        ? (e = !0)
                        : 80 > L &&
                          0 === z &&
                          -1 !== t.search(/\.( |context)/) &&
                          (e = !0);
                }
                e && w.append(h);
            });
            M(a, w, b);
            d.articleContent = w;
            d.originalLength = c;
            return d;
        };
        p.stopAudioVideo = function (a) {
            $("audio,video", a).each(function (b, d) {
                d.muted = !0;
                d.pause();
            });
        };
        p.cleanTitleHeader = function (a, b, d) {
            for (a = 1; 4 > a; a++)
                $("h" + a, b).each(function () {
                    var c = $(this),
                        f = d.toUpperCase(),
                        g = c[0].innerText.toUpperCase();
                    (f === g || 0 <= g.indexOf(f)) && c.remove();
                });
        };
    })((window.helpers = window.helpers || {}));
    window.readability = window.readability || {};
    (function (p) {
        function B(l, k) {
            var q = m.readabilityOptions();
            k =
                q.invalidElements +
                (k.preserveUnlikelyCandidates
                    ? ""
                    : "," +
                      q.unlikelyCandidatesIds +
                      "," +
                      q.unlikelyCandidatesClasses +
                      "," +
                      q.wikipediaUnlikelyCandidatesClasses);
            $("*", l)
                .not(k)
                .each(function (u, n) {
                    "none" == getComputedStyle(n).getPropertyValue("display") &&
                        $(n).attr("__readability_hidden", !0);
                });
        }
        var m = window.helpers;
        p.read = function (l, k, q) {
            "function" === typeof k && ((q = k), (k = {}));
            a: {
                m.stopAudioVideo(l);
                try {
                    B(l, k);
                    var u = $("html", l).clone();
                    $("[__readability_hidden$=true]", l).removeAttr(
                        "__readability_hidden",
                    );
                } catch (G) {
                    var n = q(G);
                    break a;
                }
                l = l.location
                    ? l.location.hostname.startsWith(
                          "www.nationalgeographic.com",
                      )
                        ? {isNationalGeographic: !0}
                        : void 0
                    : null;
                k.hostnameInfo = l;
                b: {
                    Date.now();
                    l = !1;
                    var y = "";
                    try {
                        var D = m.grabAuthor(u, k);
                        var E = m.grabTitle(u);
                        n = m.grabArticle(u, k);
                        var x = n.articleContent;
                        var H = n.originalLength;
                        x &&
                            m.getInnerText(x, !0).length > 0.05 * H &&
                            (m.cleanTitleHeader(u, x, E),
                            (y = m.grabFormattedText(x[0]) || x.text()),
                            (l = !0));
                    } catch (G) {
                        q(G);
                        break b;
                    }
                    n = {
                        author: D,
                        title: E,
                        content: l ? x[0].innerHTML : null,
                        formattedText: l && 0 != y.trim().length ? y : null,
                        document: u,
                    };
                    q(null, n);
                }
                n = void 0;
            }
            return n;
        };
        p.readAsync = async function (l, k) {
            return new Promise((q, u) => {
                p.read(l, k, function (n, y, D) {
                    if (n) return u(n);
                    q({article: y, meta: D});
                });
            });
        };
    })((window.dji.readability = window.dji.readability || {}));
})();
