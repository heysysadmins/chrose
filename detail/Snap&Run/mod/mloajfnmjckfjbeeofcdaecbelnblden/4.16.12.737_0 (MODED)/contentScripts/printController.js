window.sru = window.sru || {};
(function (q) {
    function r() {
        var a = document.getElementById("__dji_sru_print_preview");
        a
            ? (a.contentDocument.body.innerHTML = "")
            : ((a = document.createElement("iframe")),
              (a.id = "__dji_sru_print_preview"),
              (a.style.position = "fixed"),
              (a.style.top = "-10000px"),
              (a.style.left = "-10000px"),
              (a.style.width = "300px"),
              (a.style.height = "300px"),
              document.body.appendChild(a));
        return a;
    }
    function n(a, g, e) {
        var b;
        if (0 == g.length) return "";
        var c = e ? "<div>" : "<div class='dji-sru-indent-item'>";
        for (e = 0; e < g.length; e++) {
            var f = g[e];
            c += "<div class='dji-sru-outline-item'>";
            c += "<div class='dji-sru-outline-item-bullet'></div>";
            c +=
                "<div class='dji-sru-outline-item-content'>" +
                f.fullBody() +
                "</div>";
            var h = f.sources();
            for (var p = [], k = 0; k < h.length; k++) {
                var d = h[k].cslData();
                var l = (b = void 0);
                var m = null;
                d
                    ? ((b =
                          d.author &&
                          0 < d.author.length &&
                          "" != d.author[0].family
                              ? d.author[0].family
                              : d["container-title"]),
                      d.issued && d.issued.year && (m = d.issued.year),
                      (b = b && m ? b + " " + m : b ? b : "..."),
                      d.URL && (l = d.URL))
                    : d || (b = h[k].author().split(",")[0]);
                l = l
                    ? "(<a id='" +
                      h[k].uuid() +
                      "' href=" +
                      l +
                      ">" +
                      b +
                      "</a>)"
                    : "(<span>" + b + "</span>)";
                p.push(l);
            }
            h = p.join("");
            c += "<div class='dji-sru-outline-item-content'>" + h + "</div>";
            c += "</div>";
            c += n(a, a.topics(f), !1);
        }
        return c + "</div>";
    }
    function t(a, g, e) {
        var b = a.isSkeleton() ? "Outline Name" : a.title();
        b =
            "<html><head><title>" +
            b +
            "</title><style>body { -webkit-print-color-adjust: exact; font-family: Helvetica; margin: 15mm 3mm; } .dji-sru-outline-title { margin: 0 0 10mm 3mm; font-size: 18px; font-weight: bold; } .dji-sru-outline-group { margin: 0 0 5mm 3mm; font-size: 16px; font-weight: bold; } .dji-sru-outline-group:not(:first-child) { margin-top: 10mm; } .dji-sru-outline-item { position: relative; margin: 0 5mm 2mm 10mm; font-size: 14px; } .dji-sru-outline-item .dji-sru-outline-item-bullet { position: absolute; top: 0.5mm; left: -6mm; width: 3mm; height: 3mm; border-radius: 50%; background-color: #000000; } .dji-sru-indent-item { margin-left: 5mm }</style></head><body style='background-color: #FFFFFF'><div class='dji-sru-outline-title'>" +
            (b + "</div><div class='dji-sru-outline-group'>Topics</div>");
        var c = a.topics();
        b += n(a, c, !0);
        b += "<div class='dji-sru-outline-group'>Sources</div>";
        a = a.sources();
        for (c = 0; c < a.length; c++)
            b +=
                "<div class='dji-sru-outline-item'><div class='dji-sru-outline-item-bullet'></div><div class='dji-sru-outline-item-content'>" +
                (a[c].text(g) ||
                    "generate citation from source.data.fields with style " +
                        g) +
                "</div></div>";
        b += "</body></html>";
        var f = r();
        f.contentDocument.open();
        f.contentDocument.write(b);
        f.contentDocument.close();
        e();
        setTimeout(function () {
            f.contentWindow.focus();
            f.contentWindow.print();
        });
    }
    q.print = function (a, g) {
        var e = function () {
            dji.ui.effects.leaveBusyState();
        };
        dji.ui.effects.enterBusyState();
        setTimeout(function () {
            t(a, g, e);
        }, 0);
    };
})((window.sru.printController = window.sru.printController || {}));
