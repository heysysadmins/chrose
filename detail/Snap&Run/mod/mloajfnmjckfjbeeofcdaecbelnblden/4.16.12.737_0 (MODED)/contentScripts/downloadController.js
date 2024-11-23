(function (q) {
    function n(h) {
        var d = {},
            e = {},
            f = function (a) {
                for (a = a.firstChild; a; ) b(a), (a = a.nextSibling);
            },
            b = function (a) {
                switch (a.nodeName.toLowerCase()) {
                    case "#text":
                        var c = {};
                        c.text = a.textContent;
                        d.hasOwnProperty("bold") && d.bold && (c.bold = !0);
                        d.hasOwnProperty("italics") &&
                            d.italics &&
                            (c.italics = !0);
                        d.hasOwnProperty("decoration") &&
                            d.decoration &&
                            (c.decoration = d.decoration);
                        e.text = e.text || [];
                        e.text.push(c);
                        break;
                    case "b":
                        d.bold = !0;
                        f(a);
                        d.bold = !1;
                        break;
                    case "i":
                        d.italics = !0;
                        f(a);
                        d.italics = !1;
                        break;
                    case "u":
                        d.decoration = "underline";
                        f(a);
                        d.decoration = !1;
                        break;
                    case "img":
                        (c = {}),
                            (c.image = a.src),
                            (c.height = a.height),
                            (c.width = a.width),
                            (e = c);
                }
            };
        h = $.parseHTML(h);
        for (var g = 0; g < h.length; g++) b(h[g]);
        e.margin = [0, 6, 0, 0];
        return e;
    }
    function p(h, d, e) {
        var f;
        var b = e.fullBody();
        b = b.trim();
        b = b.replace(/[\r\n]/g, " ");
        b = b.replace(/\r/g, "");
        b = b.replace(/\n/g, " ");
        for (
            var g = n(b), a = e.sources(), c = [], l, k, m = 0;
            m < a.length;
            m++
        )
            (k = a[m].cslData()),
                (b = f = void 0),
                (l = null),
                k
                    ? ((f =
                          k.author &&
                          0 < k.author.length &&
                          "" != k.author[0].family
                              ? k.author[0].family
                              : k["container-title"]),
                      k.issued && k.issued.year && (l = k.issued.year),
                      (f = f && l ? f + " " + l : f ? f : "..."),
                      k.URL && (b = k.URL))
                    : k || (f = a[m].author().split(",")[0]),
                c.push("("),
                b ? c.push({text: f, color: "blue"}) : c.push(f),
                c.push(m === a.length - 1 ? ")" : "), ");
        b = [g, {text: c, margin: [0, 3, 0, 0]}];
        e = d.topics(e);
        if (0 < e.length) {
            g = {ul: []};
            for (a = 0; a < e.length; a++) p(g, d, e[a]);
            b.push(g);
        }
        h.ul.push(b);
    }
    q.download = function (h, d) {
        var e = function () {
            dji.ui.effects.leaveBusyState();
        };
        dji.ui.effects.enterBusyState();
        setTimeout(function () {
            var f = (h.isSkeleton() ? "Outline Name" : h.title()) + ".pdf",
                b = h.isSkeleton() ? "Outline Name" : h.title(),
                g = {
                    pageSize: "A4",
                    pageOrientation: "portrait",
                    pageMargins: 40,
                    content: [],
                };
            g.content.push({
                margin: [0, 10, 0, 20],
                text: b,
                alignment: "center",
                fontSize: 16,
                bold: !0,
            });
            g.content.push({
                margin: [0, 10],
                text: "Topics",
                fontSize: 14,
                bold: !0,
            });
            var a = {fontSize: 12, ul: []},
                c = h.topics();
            for (b = 0; b < c.length; b++) p(a, h, c[b]);
            0 < a.ul.length && g.content.push(a);
            g.content.push({
                margin: [0, 10],
                text: "Source",
                fontSize: 14,
                bold: !0,
            });
            a = {fontSize: 12, ul: []};
            c = h.sources();
            for (b = 0; b < c.length; b++) {
                var l = (
                    c[b].text(d) ||
                    "generate citation from source.data.fields with style " + d
                ).trim();
                -1 !== l.indexOf('class="csl-entry"') &&
                    ((l = l.substr(23)), (l = l.slice(0, -6)));
                a.ul.push(n(l));
            }
            0 < a.ul.length && g.content.push(a);
            pdfMake.createPdf(g).download(f);
            e && e();
        }, 0);
    };
})((window.sru.downloadController = window.sru.downloadController || {}));
