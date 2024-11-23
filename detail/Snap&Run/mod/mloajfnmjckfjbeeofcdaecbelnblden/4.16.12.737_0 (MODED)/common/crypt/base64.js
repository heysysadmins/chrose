window.dji = window.dji || {};
window.dji.crypt = window.dji.crypt || {};
(function (g) {
    var l = null,
        p = null,
        m = null,
        q = null;
    g.encodeString = function (a, c) {
        return window.btoa(a);
    };
    g.decodeString = function (a, c) {
        return window.atob(a);
    };
    g.encodeByteArray = function (a, c) {
        var d = a instanceof Array ? "array" : typeof a;
        if ("array" != d && ("object" != d || "number" != typeof a.length))
            return null;
        c = c ? m : l;
        d = [];
        for (var b = 0; b < a.length; b += 3) {
            var f = a[b],
                h = b + 1 < a.length,
                e = h ? a[b + 1] : 0,
                k = b + 2 < a.length,
                n = k ? a[b + 2] : 0,
                r = f >> 2;
            f = ((f & 3) << 4) | (e >> 4);
            e = ((e & 15) << 2) | (n >> 6);
            n &= 63;
            k || ((n = 64), h || (e = 64));
            d.push(c[r], c[f], c[e], c[n]);
        }
        return d.join("");
    };
    g.decodeStringToByteArray = function (a, c) {
        c = c ? q : p;
        for (var d = [], b = 0; b < a.length; ) {
            var f = c[a.charAt(b++)],
                h = b < a.length ? c[a.charAt(b)] : 0;
            ++b;
            var e = b < a.length ? c[a.charAt(b)] : 0;
            ++b;
            var k = b < a.length ? c[a.charAt(b)] : 0;
            ++b;
            if (null == f || null == h || null == e || null == k) return null;
            d.push((f << 2) | (h >> 4));
            64 != e &&
                (d.push(((h << 4) & 240) | (e >> 2)),
                64 != k && d.push(((e << 6) & 192) | k));
        }
        return d;
    };
    g.decodeDataUrlStringToByteArray = function (a, c) {
        if (!a) return null;
        var d = a.indexOf(",");
        -1 !== d && (a = a.slice(d + 1));
        return g.decodeStringToByteArray(a, c);
    };
    (function () {
        l = {};
        p = {};
        m = {};
        q = {};
        for (var a = 0; 65 > a; a++)
            (l[a] =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(
                    a,
                )),
                (p[l[a]] = a),
                (m[a] =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(
                        a,
                    )),
                (q[m[a]] = a);
    })();
})((window.dji.crypt.base64 = window.dji.crypt.base64 || {}));
