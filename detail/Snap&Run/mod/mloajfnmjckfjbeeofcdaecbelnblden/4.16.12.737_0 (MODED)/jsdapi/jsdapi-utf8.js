window.jsdapi = window.jsdapi || {};
(function (k) {
    function f() {
        this.m_data = [];
    }
    k.Utf8Data = f;
    f.prototype.appendString = function (a) {
        if (a && a.length) {
            var h = a.length,
                b = new Uint8Array(new ArrayBuffer(4 * h)),
                d = 0,
                g,
                e;
            for (g = 0; g < h; ++g) {
                var c = a.charCodeAt(g);
                if (127 >= c) b[d++] = c;
                else if (2047 >= c)
                    (b[d++] = 192 | (c >>> 6)), (b[d++] = 128 | (c & 63));
                else if (65535 >= c)
                    (b[d++] = 224 | (c >>> 12)),
                        (b[d++] = 128 | ((c >>> 6) & 63)),
                        (b[d++] = 128 | (c & 63));
                else {
                    for (e = 4; c >> (6 * e); ) e++;
                    for (
                        b[d++] = ((65280 >>> e) & 255) | (c >>> (6 * --e));
                        e--;

                    )
                        b[d++] = 128 | ((c >>> (6 * e)) & 63);
                }
            }
            this.m_data.push.apply(this.m_data, b.subarray(0, d));
        }
    };
    f.prototype.appendArray = function (a) {
        a && a.length && this.m_data.push.apply(this.m_data, a);
    };
    f.prototype.appendArrayBuffer = function (a) {
        if (
            a &&
            (a instanceof ArrayBuffer ||
                "[object ArrayBuffer]" === a.toString())
        ) {
            a = new Uint8Array(a);
            var h = a.length,
                b = 0,
                d = parseInt(h / 10240) + (0 == h % 10240 ? 0 : 1);
            for (let e = 0; e < d; e++) {
                var g = Math.min(10240, h - b);
                this.m_data.push.apply(this.m_data, a.subarray(b, b + g));
                b += g;
            }
        }
    };
    f.prototype.appendData = function (a) {
        a &&
            (a instanceof ArrayBuffer || "[object ArrayBuffer]" === a.toString()
                ? this.appendArrayBuffer(a)
                : a instanceof Array
                  ? this.appendArray(a)
                  : this.appendString(a));
    };
    f.prototype.toBlob = function () {
        return new Blob([this.m_data], {type: "application/octet-stream"});
    };
    f.prototype.toArrayBuffer = function () {
        return new ArrayBuffer(this.m_data);
    };
    f.prototype.toUint8Array = function () {
        return new Uint8Array(this.m_data);
    };
})((window.jsdapi.utf8 = window.jsdapi.utf8 || {}));
