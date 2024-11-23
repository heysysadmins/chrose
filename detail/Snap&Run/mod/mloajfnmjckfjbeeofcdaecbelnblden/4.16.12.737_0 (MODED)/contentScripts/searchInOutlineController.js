window.sru = window.sru || {};
(function (f) {
    function r(a) {
        d = a || 0;
        a = h.find("mark");
        e = a.length;
        var c = b.find(".dji-sru-page-content"),
            g = c.scrollTop();
        a.each(function (k) {
            var p =
                    "dji-sru-highlight-item" +
                    (d == k ? " dji-sru-active" : ""),
                n = this.getBoundingClientRect();
            $("<div/>", {"class": p, "dji-sru-item": k + 1})
                .css({
                    top: n.top - 104 + g + "px",
                    left: n.left - 32 + "px",
                    width: n.width + "px",
                    height: n.height + "px",
                })
                .appendTo(c);
        });
        a = 0 == e ? "&nbsp;" : d + 1 + "/" + e;
        b.find(
            ".dji-sru-search-in-topics-overlay .dji-sru-search-container .dji-search-result-info",
        ).html(a);
        a = c.find(".dji-sru-highlight-item[dji-sru-item=" + (d + 1) + "]");
        q(a);
    }
    function q(a) {
        if (!(0 >= a.length)) {
            var c = b.find(".dji-sru-page-content"),
                g = c.scrollTop(),
                k = g + 20,
                p = k + c.height() - 20;
            g = a.position().top + g;
            a = g + a.height();
            g < k ? c.scrollTop(g - 20) : a > p && c.scrollTop(a + 20);
        }
    }
    var l = null,
        h = null,
        b = null,
        d = 0,
        e = 0,
        m = "";
    f.init = function (a) {
        b = $(a);
        switch (
            b
                .find(
                    ".dji-sru-page-toolbar .dji-sru-tab-items .dji-sru-tab-item.dji-selected",
                )
                .attr("dji-item")
        ) {
            case "dji-sru-outline-details":
                var c = b.find("ul#u000").clone(!1).removeAttr("id");
                h = b.find(
                    ".dji-sru-page-content .dji-sru-search-in-topics-highlights",
                );
                break;
            case "dji-sru-outline-sources":
                (c = b
                    .find("ul#dji-workaround-s000")
                    .clone(!1)
                    .removeAttr("id")),
                    (h = b.find(
                        ".dji-sru-page-content .dji-sru-search-in-sources-highlights",
                    ));
        }
        h.append(c);
        l = new Mark(h[0]);
    };
    f.mark = function (a, c) {
        m != a &&
            ((m = a),
            (c = c || {separateWordSearch: !1}),
            a.toLowerCase(),
            b.find(".dji-sru-page-content .dji-sru-highlight-item").remove(),
            l.unmark(),
            l.mark(m, c),
            r());
    };
    f.highlightPrevSearchItem = function () {
        if (0 != e && 1 != e) {
            var a = b.find(".dji-sru-page-content");
            a.find(
                ".dji-sru-highlight-item[dji-sru-item=" + (d + 1) + "]",
            ).removeClass("dji-sru-active");
            d--;
            0 > d && (d = e - 1);
            a = a.find(".dji-sru-highlight-item[dji-sru-item=" + (d + 1) + "]");
            a.addClass("dji-sru-active");
            var c = 0 == e ? "&nbsp;" : d + 1 + "/" + e;
            b.find(
                ".dji-sru-search-in-topics-overlay .dji-sru-search-container .dji-search-result-info",
            ).html(c);
            q(a);
        }
    };
    f.highlightNextSearchItem = function () {
        if (0 != e && 1 != e) {
            var a = b.find(".dji-sru-page-content");
            a.find(
                ".dji-sru-highlight-item[dji-sru-item=" + (d + 1) + "]",
            ).removeClass("dji-sru-active");
            d++;
            d == e && (d = 0);
            a = a.find(".dji-sru-highlight-item[dji-sru-item=" + (d + 1) + "]");
            a.addClass("dji-sru-active");
            q(a);
            a = 0 == e ? "&nbsp;" : d + 1 + "/" + e;
            b.find(
                ".dji-sru-search-in-topics-overlay .dji-sru-search-container .dji-search-result-info",
            ).html(a);
        }
    };
    f.reset = function () {
        b &&
            (b.find(".dji-sru-page-content .dji-sru-highlight-item").remove(),
            b
                .find(
                    ".dji-sru-search-in-topics-overlay .dji-sru-search-container .dji-search-result-info",
                )
                .html("&nbsp;"),
            (b = null),
            (m = ""),
            l.unmark(),
            (l = null),
            h.empty(),
            (d = e = 0));
    };
    f.updatePageHighlight = function () {
        if (b) {
            var a = b,
                c = m;
            f.reset();
            f.init(a);
            f.mark(c);
        }
    };
})(
    (window.sru.searchInOutlineController =
        window.sru.searchInOutlineController || {}),
);
