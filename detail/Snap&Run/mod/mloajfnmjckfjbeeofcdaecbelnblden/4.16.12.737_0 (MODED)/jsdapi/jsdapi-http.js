window.jsdapi = window.jsdapi || {};
(function (p) {
    function r(a, c, b) {
        if (a.url) {
            var d = new XMLHttpRequest(),
                g = a.url + q(a.query);
            d.open(a.method, g, !0);
            if (
                "arraybuffer" === a.responseType ||
                "binaryToBase64" === a.responseType
            )
                d.responseType = "arraybuffer";
            else if ("blob" === a.responseType || "binary" === a.responseType)
                d.responseType = "blob";
            if (c)
                for (var l in c)
                    c.hasOwnProperty(l) && c[l] && d.setRequestHeader(l, c[l]);
            a.accessToken &&
                d.setRequestHeader("Authorization", "Bearer " + a.accessToken);
            a.contentType && d.setRequestHeader("Content-Type", a.contentType);
            a.timeout && (d.timeout = a.timeout);
            d.onreadystatechange = function () {
                if (d.readyState === XMLHttpRequest.DONE && 0 < d.status) {
                    var k = null,
                        e = this.status,
                        f = null;
                    if (a.responseHeaders) {
                        f = {};
                        for (var n = 0; n < a.responseHeaders.length; n++)
                            f[a.responseHeaders[n]] = this.getResponseHeader(
                                a.responseHeaders[n],
                            );
                    } else f = this.getAllResponseHeaders();
                    if (200 === e || a.ignoreStatusCode)
                        if ("json" === a.responseType)
                            try {
                                k = JSON.parse(this.responseText);
                            } catch (u) {}
                        else
                            k =
                                "blob" === a.responseType ||
                                "arraybuffer" === a.responseType ||
                                "binary" === a.responseType
                                    ? this.response
                                    : "binaryToBase64" === a.responseType
                                      ? t(this.response)
                                      : this.responseText;
                    setTimeout(function () {
                        0 == b.length
                            ? h(b)
                            : 1 == b.length
                              ? h(b, k)
                              : 2 == b.length
                                ? h(b, e, k)
                                : h(b, e, f, k);
                    }, 0);
                }
            };
            d.ontimeout =
                d.onerror =
                d.onabort =
                    function () {
                        setTimeout(function () {
                            0 == b.length
                                ? h(b)
                                : 1 == b.length
                                  ? h(b, void 0)
                                  : 2 == b.length
                                    ? h(b, d.status, void 0)
                                    : h(b, d.status, void 0, void 0);
                        }, 0);
                    };
            a.content ? d.send(a.content) : d.send();
        } else h(b, null, 10);
    }
    var m = {};
    p.setup = function (a) {
        if (a && a.headers)
            for (var c in a.headers)
                a.headers.hasOwnProperty(c) &&
                    a.headers[c] &&
                    (m[c] = a.headers[c]);
    };
    p.sendRequestAsync = function (a) {
        const c = a.headers || {};
        for (var b in m)
            m.hasOwnProperty(b) && !c.hasOwnProperty(b) && (c[b] = m[b]);
        b = a.url + q(a.query);
        let d = {method: a.method, headers: {}};
        if (c)
            for (let g in c)
                c.hasOwnProperty(g) && c[g] && (d.headers[g] = c[g]);
        a.accessToken && (d.headers.Authorization = `Bearer ${a.accessToken}`);
        a.contentType && (d.headers["Content-Type"] = a.contentType);
        return fetch(b, d);
    };
    p.sendRequest = function (a, c) {
        var b = a.headers || {},
            d;
        for (d in m)
            m.hasOwnProperty(d) && !b.hasOwnProperty(d) && (b[d] = m[d]);
        r(a, b, c);
    };
    var q = function (a) {
            var c = "";
            if (void 0 !== a && null !== a)
                for (var b in a)
                    a.hasOwnProperty(b) &&
                        ((c = "" === c ? "?" : c + "&"),
                        (c =
                            c +
                            encodeURIComponent(b) +
                            "=" +
                            encodeURIComponent(a[b])));
            return c;
        },
        t = function (a) {
            var c = "";
            a = new Uint8Array(a);
            var b = a.byteLength,
                d = b % 3;
            b -= d;
            for (var g, l, k, e, f = 0; f < b; f += 3)
                (e = (a[f] << 16) | (a[f + 1] << 8) | a[f + 2]),
                    (g = (e & 16515072) >> 18),
                    (l = (e & 258048) >> 12),
                    (k = (e & 4032) >> 6),
                    (e &= 63),
                    (c +=
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                            g
                        ] +
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                            l
                        ] +
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                            k
                        ] +
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                            e
                        ]);
            1 == d
                ? ((e = a[b]),
                  (c +=
                      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                          (e & 252) >> 2
                      ] +
                      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                          (e & 3) << 4
                      ] +
                      "=="))
                : 2 == d &&
                  ((e = (a[b] << 8) | a[b + 1]),
                  (c +=
                      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                          (e & 64512) >> 10
                      ] +
                      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                          (e & 1008) >> 4
                      ] +
                      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                          (e & 15) << 2
                      ] +
                      "="));
            return c;
        },
        h = function (a) {
            if (a)
                try {
                    a.apply(this, [].slice.call(arguments).splice(1));
                } catch (c) {
                    dji.logger.error(c);
                }
        };
})((window.jsdapi.http = window.jsdapi.http || {}));
