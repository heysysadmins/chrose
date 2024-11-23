window.dji = window.dji || {};
(function (p) {
    function r(a, b, c, e) {
        b = (b || "").toLowerCase();
        var g = -1 == b.indexOf("base64"),
            d = {format: "jpeg"};
        switch (b) {
            case n.PNG:
            case n.PNG_BASE64:
                d.format = "png";
        }
        "number" == typeof c && "jpeg" == d.format && (d.quality = parseInt(c));
        chrome.tabs.captureVisibleTab(null, d, function (h) {
            if (a) {
                var f = new Image();
                f.onload = function () {
                    var t = a.left,
                        u = a.top,
                        k = a.right - a.left,
                        l = a.bottom - a.top;
                    if (k != f.width || l != f.height) {
                        var v = "png" === d.format ? "image/png" : "image/jpeg",
                            m = document.createElement("canvas");
                        m.width = k;
                        m.height = l;
                        m.getContext("2d").drawImage(f, t, u, k, l, 0, 0, k, l);
                        h = m.toDataURL(v);
                    }
                    q(h, g, e);
                };
                f.src = h;
            } else q(h, g, e);
        });
    }
    function q(a, b, c) {
        a &&
            b &&
            ((a = dji.crypt.base64.decodeDataUrlStringToByteArray(a)),
            (a = new Uint8Array(a)));
        c(a);
    }
    var n = {
        JPEG: "jpeg",
        PNG: "png",
        JPEG_BASE64: "jpeg_base64",
        PNG_BASE64: "png_base64",
    };
    p.ImageFormats = n;
    p.takeScreenshot = function (a, b) {
        a = a || {};
        a.fileSystem = a.fileSystem || dji.fileSystem.temporary;
        r(a.rect, a.imageFormat, a.imageQuality, function (c) {
            var e = null !== c && void 0 !== c;
            e && a.fileName
                ? a.fileSystem.writeFile(a.fileName, c, function (g, d) {
                      dji.utils.callMethod(
                          b,
                          g,
                          a.fileName,
                          d ? d.toURL() : "",
                      );
                  })
                : dji.utils.callMethod(b, e, c);
        });
    };
})((window.dji.screenshot = window.dji.screenshot || {}));
