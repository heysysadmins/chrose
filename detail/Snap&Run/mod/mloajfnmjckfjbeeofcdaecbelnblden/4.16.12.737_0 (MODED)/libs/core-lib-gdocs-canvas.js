/*!***************************************************
 * core-lib-gdocs-canvas v1.1.0
 *
 * Copyright (c) 2022-2023, DJI
 * Released under the DJI license
 *****************************************************/
!(function () {
    "use strict";
    class t {
        constructor() {
            (this.t = new Set()),
                (this.i = {
                    onClearRect: [],
                    onFillRect: [],
                    onFillText: [],
                    o: [],
                });
            const t = this;
            this.h = {
                clearRect(...n) {
                    return t.u("onClearRect", this, n);
                },
                fillRect(...n) {
                    return t.u("onFillRect", this, n);
                },
                fillText(...n) {
                    return t.u("onFillText", this, n);
                },
                drawImage(...n) {
                    return t.u("onDrawImage", this, n);
                },
            };
        }
        get l() {
            return this.t.size;
        }
        addEventListener(t, n) {
            return (
                !(
                    !this.i.hasOwnProperty(t) ||
                    "function" != typeof n ||
                    -1 !== this.i[t].indexOf(n)
                ) && (this.i[t].push(n), !0)
            );
        }
        v(t) {
            return (
                !(!t || this.t.has(t)) &&
                !t.classList.contains("dji-canvas-content") &&
                ((t.m = new Proxy(this.h, {})), this.t.add(t), !0)
            );
        }
        p(t) {
            return (
                !(!t || !this.t.has(t)) && (this.t.delete(t), delete t.m, !0)
            );
        }
        u(t, n, e) {
            this.t.has(n.canvas) &&
                (function (t, n, ...e) {
                    if (!t || !t.hasOwnProperty(n)) return;
                    const i = t[n];
                    if (!(i && i.length > 0)) return;
                    const s = i.length;
                    for (let t = 0; t < s; t += 1) {
                        const n = i[t];
                        if (n)
                            try {
                                n.apply(this, e);
                            } catch (t) {}
                    }
                })(this.i, t, n, ...e);
        }
    }
    class n {
        g = new t();
        C = new EventTarget();
        constructor() {
            this.g.addEventListener("onClearRect", (t, n, e, i, s) => {
                this.M(t, n, e, i, s);
            }),
                this.g.addEventListener("onFillRect", (t, n, e, i, s) => {
                    this.R(t, n, e, i, s);
                }),
                this.g.addEventListener("onFillText", (t, n, e, i, s) => {
                    this.D(t, n, e, i, s);
                }),
                this.g.addEventListener(
                    "onDrawImage",
                    (t, n, e, i, s, o, r, a, c, h) => {
                        this.j(t, n, e, i, s, o, r, a, c, h);
                    },
                );
        }
        v(t) {
            return !!this.g.v(t) && (this.N(t), !0);
        }
        p(t) {
            return !!this.g.p(t) && (this.O(t), !0);
        }
        addEventListener(t, n) {
            this.C.addEventListener(t, n);
        }
        removeEventListener(t, n) {
            this.C.removeEventListener(t, n);
        }
        notify(t, n) {
            this.C.dispatchEvent(new CustomEvent(t, {detail: n}));
        }
        M(t, n, e, i, s) {}
        R(t, n, e, i, s) {}
        D(t, n, e, i, s) {}
        j(t, n, e, i, s, o, r, a, c, h) {}
        N(t) {}
        O(t) {}
    }
    var e =
        e ||
        (function (t, n) {
            var e = {},
                i = (e.F = {}),
                s = function () {},
                o = (i.P = {
                    extend: function (t) {
                        s.prototype = this;
                        var n = new s();
                        return (
                            t && n.I(t),
                            n.hasOwnProperty("init") ||
                                (n.init = function () {
                                    n.S.init.apply(this, arguments);
                                }),
                            (n.init.prototype = n),
                            (n.S = this),
                            n
                        );
                    },
                    create: function () {
                        var t = this.extend();
                        return t.init.apply(t, arguments), t;
                    },
                    init: function () {},
                    I: function (t) {
                        for (var n in t)
                            t.hasOwnProperty(n) && (this[n] = t[n]);
                        t.hasOwnProperty("toString") &&
                            (this.toString = t.toString);
                    },
                    clone: function () {
                        return this.init.prototype.extend(this);
                    },
                }),
                r = (i.T = o.extend({
                    init: function (t, n) {
                        (t = this.k = t || []),
                            (this._ = null != n ? n : 4 * t.length);
                    },
                    toString: function (t) {
                        return (t || c).stringify(this);
                    },
                    concat: function (t) {
                        var n = this.k,
                            e = t.k,
                            i = this._;
                        if (((t = t._), this.A(), i % 4))
                            for (var s = 0; s < t; s++)
                                n[(i + s) >>> 2] |=
                                    ((e[s >>> 2] >>> (24 - (s % 4) * 8)) &
                                        255) <<
                                    (24 - ((i + s) % 4) * 8);
                        else if (65535 < e.length)
                            for (s = 0; s < t; s += 4)
                                n[(i + s) >>> 2] = e[s >>> 2];
                        else n.push.apply(n, e);
                        return (this._ += t), this;
                    },
                    A: function () {
                        var n = this.k,
                            e = this._;
                        (n[e >>> 2] &= 4294967295 << (32 - (e % 4) * 8)),
                            (n.length = t.ceil(e / 4));
                    },
                    clone: function () {
                        var t = o.clone.call(this);
                        return (t.k = this.k.slice(0)), t;
                    },
                    random: function (n) {
                        for (var e = [], i = 0; i < n; i += 4)
                            e.push((4294967296 * t.random()) | 0);
                        return new r.init(e, n);
                    },
                })),
                a = (e.B = {}),
                c = (a.$ = {
                    stringify: function (t) {
                        var n = t.k;
                        t = t._;
                        for (var e = [], i = 0; i < t; i++) {
                            var s = (n[i >>> 2] >>> (24 - (i % 4) * 8)) & 255;
                            e.push((s >>> 4).toString(16)),
                                e.push((15 & s).toString(16));
                        }
                        return e.join("");
                    },
                    parse: function (t) {
                        for (var n = t.length, e = [], i = 0; i < n; i += 2)
                            e[i >>> 3] |=
                                parseInt(t.substr(i, 2), 16) <<
                                (24 - (i % 8) * 4);
                        return new r.init(e, n / 2);
                    },
                }),
                h = (a.U = {
                    stringify: function (t) {
                        var n = t.k;
                        t = t._;
                        for (var e = [], i = 0; i < t; i++)
                            e.push(
                                String.fromCharCode(
                                    (n[i >>> 2] >>> (24 - (i % 4) * 8)) & 255,
                                ),
                            );
                        return e.join("");
                    },
                    parse: function (t) {
                        for (var n = t.length, e = [], i = 0; i < n; i++)
                            e[i >>> 2] |=
                                (255 & t.charCodeAt(i)) << (24 - (i % 4) * 8);
                        return new r.init(e, n);
                    },
                }),
                u = (a.W = {
                    stringify: function (t) {
                        try {
                            return decodeURIComponent(escape(h.stringify(t)));
                        } catch (t) {
                            throw Error("Malformed UTF-8 data");
                        }
                    },
                    parse: function (t) {
                        return h.parse(unescape(encodeURIComponent(t)));
                    },
                }),
                l = (i.V = o.extend({
                    reset: function () {
                        (this.H = new r.init()), (this.L = 0);
                    },
                    G: function (t) {
                        "string" == typeof t && (t = u.parse(t)),
                            this.H.concat(t),
                            (this.L += t._);
                    },
                    J: function (n) {
                        var e = this.H,
                            i = e.k,
                            s = e._,
                            o = this.blockSize,
                            a = s / (4 * o);
                        if (
                            ((n =
                                (a = n
                                    ? t.ceil(a)
                                    : t.max((0 | a) - this.K, 0)) * o),
                            (s = t.min(4 * n, s)),
                            n)
                        ) {
                            for (var c = 0; c < n; c += o) this.q(i, c);
                            (c = i.splice(0, n)), (e._ -= s);
                        }
                        return new r.init(c, s);
                    },
                    clone: function () {
                        var t = o.clone.call(this);
                        return (t.H = this.H.clone()), t;
                    },
                    K: 0,
                }));
            i.X = l.extend({
                Y: o.extend(),
                init: function (t) {
                    (this.Y = this.Y.extend(t)), this.reset();
                },
                reset: function () {
                    l.reset.call(this), this.Z();
                },
                update: function (t) {
                    return this.G(t), this.J(), this;
                },
                tt: function (t) {
                    return t && this.G(t), this.nt();
                },
                blockSize: 16,
                et: function (t) {
                    return function (n, e) {
                        return new t.init(e).tt(n);
                    };
                },
                it: function (t) {
                    return function (n, e) {
                        return new d.st.init(t, e).tt(n);
                    };
                },
            });
            var d = (e.ot = {});
            return e;
        })(Math);
    !(function (t) {
        function n(t, n, e, i, s, o, r) {
            return (
                (((t = t + ((n & e) | (~n & i)) + s + r) << o) |
                    (t >>> (32 - o))) +
                n
            );
        }
        function i(t, n, e, i, s, o, r) {
            return (
                (((t = t + ((n & i) | (e & ~i)) + s + r) << o) |
                    (t >>> (32 - o))) +
                n
            );
        }
        function s(t, n, e, i, s, o, r) {
            return (
                (((t = t + (n ^ e ^ i) + s + r) << o) | (t >>> (32 - o))) + n
            );
        }
        function o(t, n, e, i, s, o, r) {
            return (
                (((t = t + (e ^ (n | ~i)) + s + r) << o) | (t >>> (32 - o))) + n
            );
        }
        for (
            var r = e, a = (h = r.F).T, c = h.X, h = r.ot, u = [], l = 0;
            64 > l;
            l++
        )
            u[l] = (4294967296 * t.abs(t.sin(l + 1))) | 0;
        (h = h.rt =
            c.extend({
                Z: function () {
                    this.ct = new a.init([
                        1732584193, 4023233417, 2562383102, 271733878,
                    ]);
                },
                q: function (t, e) {
                    for (var r = 0; 16 > r; r++) {
                        var a = t[(c = e + r)];
                        t[c] =
                            (16711935 & ((a << 8) | (a >>> 24))) |
                            (4278255360 & ((a << 24) | (a >>> 8)));
                    }
                    r = this.ct.k;
                    var c = t[e + 0],
                        h = ((a = t[e + 1]), t[e + 2]),
                        l = t[e + 3],
                        d = t[e + 4],
                        f = t[e + 5],
                        v = t[e + 6],
                        m = t[e + 7],
                        p = t[e + 8],
                        g = t[e + 9],
                        w = t[e + 10],
                        y = t[e + 11],
                        C = t[e + 12],
                        b = t[e + 13],
                        x = t[e + 14],
                        M = t[e + 15],
                        R = n(
                            (R = r[0]),
                            (N = r[1]),
                            (j = r[2]),
                            (D = r[3]),
                            c,
                            7,
                            u[0],
                        ),
                        D = n(D, R, N, j, a, 12, u[1]),
                        j = n(j, D, R, N, h, 17, u[2]),
                        N = n(N, j, D, R, l, 22, u[3]);
                    (R = n(R, N, j, D, d, 7, u[4])),
                        (D = n(D, R, N, j, f, 12, u[5])),
                        (j = n(j, D, R, N, v, 17, u[6])),
                        (N = n(N, j, D, R, m, 22, u[7])),
                        (R = n(R, N, j, D, p, 7, u[8])),
                        (D = n(D, R, N, j, g, 12, u[9])),
                        (j = n(j, D, R, N, w, 17, u[10])),
                        (N = n(N, j, D, R, y, 22, u[11])),
                        (R = n(R, N, j, D, C, 7, u[12])),
                        (D = n(D, R, N, j, b, 12, u[13])),
                        (j = n(j, D, R, N, x, 17, u[14])),
                        (R = i(
                            R,
                            (N = n(N, j, D, R, M, 22, u[15])),
                            j,
                            D,
                            a,
                            5,
                            u[16],
                        )),
                        (D = i(D, R, N, j, v, 9, u[17])),
                        (j = i(j, D, R, N, y, 14, u[18])),
                        (N = i(N, j, D, R, c, 20, u[19])),
                        (R = i(R, N, j, D, f, 5, u[20])),
                        (D = i(D, R, N, j, w, 9, u[21])),
                        (j = i(j, D, R, N, M, 14, u[22])),
                        (N = i(N, j, D, R, d, 20, u[23])),
                        (R = i(R, N, j, D, g, 5, u[24])),
                        (D = i(D, R, N, j, x, 9, u[25])),
                        (j = i(j, D, R, N, l, 14, u[26])),
                        (N = i(N, j, D, R, p, 20, u[27])),
                        (R = i(R, N, j, D, b, 5, u[28])),
                        (D = i(D, R, N, j, h, 9, u[29])),
                        (j = i(j, D, R, N, m, 14, u[30])),
                        (R = s(
                            R,
                            (N = i(N, j, D, R, C, 20, u[31])),
                            j,
                            D,
                            f,
                            4,
                            u[32],
                        )),
                        (D = s(D, R, N, j, p, 11, u[33])),
                        (j = s(j, D, R, N, y, 16, u[34])),
                        (N = s(N, j, D, R, x, 23, u[35])),
                        (R = s(R, N, j, D, a, 4, u[36])),
                        (D = s(D, R, N, j, d, 11, u[37])),
                        (j = s(j, D, R, N, m, 16, u[38])),
                        (N = s(N, j, D, R, w, 23, u[39])),
                        (R = s(R, N, j, D, b, 4, u[40])),
                        (D = s(D, R, N, j, c, 11, u[41])),
                        (j = s(j, D, R, N, l, 16, u[42])),
                        (N = s(N, j, D, R, v, 23, u[43])),
                        (R = s(R, N, j, D, g, 4, u[44])),
                        (D = s(D, R, N, j, C, 11, u[45])),
                        (j = s(j, D, R, N, M, 16, u[46])),
                        (R = o(
                            R,
                            (N = s(N, j, D, R, h, 23, u[47])),
                            j,
                            D,
                            c,
                            6,
                            u[48],
                        )),
                        (D = o(D, R, N, j, m, 10, u[49])),
                        (j = o(j, D, R, N, x, 15, u[50])),
                        (N = o(N, j, D, R, f, 21, u[51])),
                        (R = o(R, N, j, D, C, 6, u[52])),
                        (D = o(D, R, N, j, l, 10, u[53])),
                        (j = o(j, D, R, N, w, 15, u[54])),
                        (N = o(N, j, D, R, a, 21, u[55])),
                        (R = o(R, N, j, D, p, 6, u[56])),
                        (D = o(D, R, N, j, M, 10, u[57])),
                        (j = o(j, D, R, N, v, 15, u[58])),
                        (N = o(N, j, D, R, b, 21, u[59])),
                        (R = o(R, N, j, D, d, 6, u[60])),
                        (D = o(D, R, N, j, y, 10, u[61])),
                        (j = o(j, D, R, N, h, 15, u[62])),
                        (N = o(N, j, D, R, g, 21, u[63]));
                    (r[0] = (r[0] + R) | 0),
                        (r[1] = (r[1] + N) | 0),
                        (r[2] = (r[2] + j) | 0),
                        (r[3] = (r[3] + D) | 0);
                },
                nt: function () {
                    var n = this.H,
                        e = n.k,
                        i = 8 * this.L,
                        s = 8 * n._;
                    e[s >>> 5] |= 128 << (24 - (s % 32));
                    var o = t.floor(i / 4294967296);
                    for (
                        e[15 + (((s + 64) >>> 9) << 4)] =
                            (16711935 & ((o << 8) | (o >>> 24))) |
                            (4278255360 & ((o << 24) | (o >>> 8))),
                            e[14 + (((s + 64) >>> 9) << 4)] =
                                (16711935 & ((i << 8) | (i >>> 24))) |
                                (4278255360 & ((i << 24) | (i >>> 8))),
                            n._ = 4 * (e.length + 1),
                            this.J(),
                            e = (n = this.ct).k,
                            i = 0;
                        4 > i;
                        i++
                    )
                        (s = e[i]),
                            (e[i] =
                                (16711935 & ((s << 8) | (s >>> 24))) |
                                (4278255360 & ((s << 24) | (s >>> 8))));
                    return n;
                },
                clone: function () {
                    var t = c.clone.call(this);
                    return (t.ct = this.ct.clone()), t;
                },
            })),
            (r.rt = c.et(h)),
            (r.ht = c.it(h));
    })(Math);
    class i {
        ut;
        lt;
        constructor() {
            (this.ut = []), (this.lt = "");
        }
        get bounds() {
            return this.ut;
        }
        clear() {
            this.ut = [];
        }
        extend(t, n, e, i, s) {
            const {offsetTop: o} = t.canvas.offsetParent,
                {offsetLeft: r} = t.canvas.offsetParent,
                a = t.canvas.getBoundingClientRect();
            (n = a.x + n - r + 1), (e = a.y + e - o);
            const c = this.ut.length;
            for (let t = 0; t < c; t += 1) {
                const o = this.ut[t];
                if (o.x === n && o.y === e)
                    return (o.width = i), void (o.height = s);
            }
            this.ut.push(new DOMRect(n, e, i, s));
        }
        dt() {
            const t = e.rt(JSON.stringify(this.ut)).toString();
            return this.lt !== t && ((this.lt = t), !0);
        }
    }
    class s {
        static ft(t) {
            const n = t.parentElement.querySelector(
                "svg > g > rect[aria-label]",
            );
            return n
                ? n.ownerSVGElement
                : t.parentElement
                  ? t.parentElement.querySelector("svg")
                  : null;
        }
        static vt(t) {
            let n = t.parentElement;
            for (; n; ) {
                if (n.matches("div.kix-page-paginated")) return !1;
                if (n.matches("div.kix-rotatingtilemanager-content")) return !0;
                n = n.parentElement;
            }
            return !1;
        }
    }
    class o {
        static gt(t, n, e) {
            const i = t.getBoundingClientRect();
            return o.wt(i, t.width, t.height, n, e);
        }
        static wt(t, n, e, i, s) {
            const o = t.width / n,
                r = t.height / e,
                a = t.left + i * o,
                c = t.top + s * r;
            return new DOMPoint(a, c);
        }
        static yt(t, n, e) {
            const i = t.getBoundingClientRect();
            return o.Ct(i, t.width, t.height, n, e);
        }
        static Ct(t, n, e, i, s) {
            const o = n / t.width,
                r = e / t.height,
                a = (i - t.left) * o,
                c = (s - t.top) * r;
            return new DOMPoint(a, c);
        }
        static bt(t, n, e, i, s) {
            return o.gt(t, n + i / 2, e + s / 2);
        }
        static xt(t, n, e, i, s) {
            return o.gt(t, n + i / 2, e + s);
        }
    }
    const r = new DOMParser();
    const a = new Map();
    let c = !1;
    function h(t) {
        const n = (function (t) {
            const n = t.getElementsByTagName("script"),
                e = "DOCS_timing['sac'] ",
                i = [...n].filter(
                    (t) => t.innerHTML.substring(0, e.length) === e,
                );
            if (0 !== i.length) return i[0].innerHTML;
        })(t);
        if (!n) return !1;
        const e = "DOCS_modelChunk = [",
            i = [...t.getElementsByTagName("script")].filter(
                (t) => t.innerHTML.substring(0, e.length) === e,
            ),
            s = new Set(),
            o = new Map();
        return (
            i.forEach((t) => {
                try {
                    let i = t.innerHTML;
                    const r = i.indexOf(e) + e.length,
                        a = i.lastIndexOf("];");
                    i = i.substring(r - 1, a + 1);
                    const c = JSON.parse(i).filter((t) => {
                        const {Mt: n} = t,
                            e = n && n.Rt;
                        return n && e && e.Dt;
                    });
                    for (let t = 0; t < c.length; t += 1) {
                        const e = c[t].Mt.Rt.jt;
                        if (!s.has(e)) {
                            const i = c[t].Mt.Rt.Dt;
                            let r = n.indexOf(e);
                            if (
                                ((r += e.length),
                                (r = n.indexOf('"', r + 1)),
                                r >= 0)
                            ) {
                                const t = n.substring(
                                    r + 1,
                                    n.indexOf('"', r + 1),
                                );
                                s.add(e), o.set(t, {id: e, description: i});
                            }
                        }
                    }
                } catch (t) {}
            }),
            o.forEach((t, n) => {
                const e = (function (t) {
                        try {
                            return (
                                null !==
                                r
                                    .parseFromString(t, "text/html")
                                    .body.querySelector("math")
                            );
                        } catch (t) {
                            return !1;
                        }
                    })(t.description),
                    i = {
                        Nt: t.id,
                        Ot: n,
                        Ft: t.description,
                        Pt: e,
                        It: e ? "mathml" : "",
                    };
                a.set(n, i);
            }),
            !0
        );
    }
    let u = null;
    class l {
        St = new Map();
        Tt = !1;
        kt = new Set();
        constructor() {}
        static Et() {
            return u || (u = new l()), u;
        }
        async _t() {
            this.Tt ||
                ((this.Tt = !0),
                setTimeout(async () => {
                    try {
                        let t = !1;
                        for (const [n, e] of this.St.entries())
                            this.kt.has(n) || (this.kt.add(n), (t = !0));
                        if (!t) return;
                        const n = await fetch(window.location.href),
                            e = await n.text();
                        h(r.parseFromString(e, "text/html")), this.next();
                    } finally {
                        this.Tt = !1;
                    }
                }, 1e3));
        }
        async At(t, n, e, i, s, o, r) {
            return new Promise((a, c) => {
                this.Bt(t, n, e, i, s, o, r, a, c);
            });
        }
        async Bt(t, n, e, i, s, o, r, a, c) {
            if (!n) return void a(null);
            let h = this.St.get(n);
            h || ((h = new Array()), this.St.set(n, h)),
                h.push({
                    canvas: t,
                    href: n,
                    resolve: a,
                    reject: c,
                    x: i,
                    y: s,
                    width: o,
                    height: r,
                    zt: e,
                }),
                this.next();
        }
        async next() {
            const t = this.St.keys().next().value;
            if (!t || 0 === t.length) return;
            c || (c = h(document));
            const n = this.St.get(t);
            if (!n || 0 === n.length)
                return this.St.delete(t), void this.next();
            const e = a.get(t);
            if (void 0 !== e) {
                let t = null;
                return (
                    (t = e instanceof Promise ? await e : e),
                    this.resolve(n, t),
                    void this.next()
                );
            }
        }
        resolve(t, n) {
            if (null == t || 0 === t.length) return;
            const e = t[0].href;
            a.set(e, n);
            try {
                t.forEach((t) => {
                    t.resolve(n);
                });
            } finally {
                if (void 0 !== n) this.St.delete(e), this.next();
                else {
                    const t = this.St.get(e);
                    this.St.delete(e), t && this.St.set(e, t);
                }
            }
        }
        static $t(t) {
            let n = t;
            if (n.startsWith("filesystem:")) {
                const n = new URL(t).searchParams.get("cacheKey");
                return n ? l.Ut(n) : null;
            }
            const e = a.get(n);
            return null != e && e instanceof Promise ? null : e;
        }
        static Ut(t) {
            for (const [n, e] of a)
                if (e && t && (e.Nt === t || t.indexOf(e.Nt) >= 0)) return e;
            return null;
        }
    }
    function d(t) {
        switch (t.charCodeAt(0)) {
            case 8203:
            case 8204:
            case 8237:
            case 8236:
                return "";
            case 160:
                return " ";
            default:
                return t;
        }
    }
    function f(t) {
        if (!t || t.length <= 0) return t;
        const n = t.split("");
        for (let e = 0; e < n.length; e += 1) {
            const i = t[e],
                s = d(i);
            i !== s && (n[e] = s);
        }
        return n.join("");
    }
    function v(t, n) {
        const e = t.length,
            i = n.length;
        if (i > e) return !1;
        let s = 0;
        for (let e of t)
            if (((e = d(e)), "" !== e)) {
                if (s >= i || n[s] !== e) return !1;
                s += 1;
            }
        return !0;
    }
    class m {
        Wt;
        Vt;
        Ht;
        Lt;
        Gt;
        lt;
        C;
        Jt;
        Kt;
        qt;
        Qt;
        Xt;
        Yt;
        Zt;
        constructor() {
            (this.Wt = []),
                (this.Vt = []),
                (this.Ht = []),
                (this.Lt = new Map()),
                (this.Gt = 4.07),
                (this.lt = ""),
                (this.C = new EventTarget()),
                (this.Jt = new l()),
                (this.Kt = []),
                (this.qt = !1),
                (this.Qt = (t, n) => {
                    const e = t.getBoundingClientRect(),
                        i = n.getBoundingClientRect();
                    return m.sort(e.left, e.top, i.left, i.top);
                }),
                (this.Xt = (t, n) => m.sort(t.x, t.y, n.x, n.y)),
                (this.Yt = (t, n) =>
                    m.sort(
                        t.bounds.left,
                        t.bounds.top,
                        n.bounds.left,
                        n.bounds.top,
                    )),
                (this.Zt = (t, n) => m.tn(t.bounds.left, n.bounds.left));
        }
        nn(t, n) {
            this.C.addEventListener(t, n);
        }
        get en() {
            return this.Wt;
        }
        dt() {
            const t = e.rt(JSON.stringify(this.Wt)).toString();
            return this.lt !== t && ((this.lt = t), !0);
        }
        clear(t, n, e, i) {
            const s = n + i,
                o = t + e;
            (this.Vt = this.Vt.filter(
                (e) => e.x < t || o < e.x || e.y < n || s < e.y,
            )),
                (this.Ht = this.Ht.filter(
                    (e) => e.x < t || o < e.x || e.y < n || s < e.y,
                )),
                (this.Wt = []),
                (this.qt = !1),
                this.Vt.length <= 0 && this.Lt.clear();
        }
        sn(t, n, e, i, s) {
            let o = this.Lt.get(t.font);
            void 0 === o &&
                ((o = t.measureText(" ").width), this.Lt.set(t.font, o)),
                this.Vt.push({
                    text: n,
                    font: t.font,
                    x: e,
                    y: i,
                    on: o.valueOf(),
                }),
                (this.qt = !1);
        }
        static rn(t, n, e, i) {
            const s = t.canvas.getBoundingClientRect(),
                r = t.canvas.width,
                a = t.canvas.height,
                c = t.measureText(i),
                h = t.getTransform();
            let u = h ? h.transformPoint({x: n, y: e}) : {x: n, y: e};
            u = o.wt(s, r, a, u.x, u.y);
            const l =
                    Math.abs(c.actualBoundingBoxLeft) +
                    Math.abs(c.actualBoundingBoxRight),
                d = c.an + c.cn;
            let f = h
                ? h.transformPoint({x: n + l, y: e + d})
                : {x: n + l, y: e + d};
            f = o.wt(s, r, a, f.x, f.y);
            const v = {
                x: u.x,
                y: u.y,
                left: u.x,
                top: u.y,
                width: Math.abs(f.x - u.x),
                height: Math.abs(f.y - u.y),
                right: 0,
                bottom: 0,
            };
            switch (t.textAlign) {
                case "start":
                    break;
                case "end":
                case "right":
                    v.left = u.x - v.width;
                    break;
                case "center":
                    v.left = u.x - v.width / 2;
            }
            switch (t.textBaseline) {
                case "alphabetic":
                    v.top -= v.height / 3;
                    break;
                case "bottom":
                case "ideographic":
                    v.top -= v.height;
                    break;
                case "middle":
                    v.top -= v.width / 2;
            }
            return (
                (v.right = v.left + v.width), (v.bottom = v.top + v.height), v
            );
        }
        hn(t, n, e, i, s, o, r, a, c, h) {
            if (!n || !n.id) return;
            let u = e,
                d = i,
                f = s,
                v = o;
            void 0 !== r && ((u = r), (d = a), (f = c), (v = h));
            const m = t.getTransform().transformPoint(new DOMPoint(u, d)),
                p = l.$t(n.id),
                g = {
                    text: null,
                    font: null,
                    x: m.x,
                    y: m.y,
                    canvas: t.canvas,
                    Nt: n.id,
                    un: n.ownerDocument,
                    width: f,
                    height: v,
                    ln: p,
                },
                w = this.Ht.findIndex(
                    (t) => t.x === m.x && t.y === m.y && t.Nt === n.id,
                );
            w < 0 ? this.Ht.push(g) : (this.Ht[w] = g),
                (this.qt = !1),
                p || this.Bt(t.canvas, g);
        }
        Bt(t, n) {
            this.Jt.Bt(
                t,
                n.Nt,
                n.un,
                n.x,
                n.y,
                n.width,
                n.height,
                (t) => {
                    let e = !1;
                    if (t) {
                        const i = this.Ht.length;
                        for (let s = 0; s < i; s += 1) {
                            const i = this.Ht[s];
                            i.Nt === n.Nt &&
                                i.ln !== t &&
                                ((i.ln = t), (e = !0));
                        }
                    } else void 0 === t && this.Kt.push(n);
                    e &&
                        ((this.Wt = []),
                        (this.qt = !1),
                        this.C.dispatchEvent(
                            new CustomEvent("updated", {
                                detail: {source: this},
                            }),
                        ));
                },
                () => {},
            );
        }
        dn(t) {
            const n = this.Kt;
            this.Kt = [];
            const e = n.length;
            for (let i = 0; i < e; i += 1) {
                const e = n[i];
                this.Bt(t, e);
            }
        }
        fn(t) {
            if (this.qt) return;
            const n = s.ft(t);
            if (!n) return;
            const e = this.vn(n);
            this.mn(t, e), this.pn(n), (this.qt = !0);
        }
        vn(t) {
            const n = Array.from(t.querySelectorAll("g")).sort(this.Qt),
                e = [],
                i = n.length;
            for (let t = 0; t < i; t += 1) {
                const i = n[t],
                    s = {bounds: i.getBoundingClientRect(), lines: []},
                    o = i.querySelectorAll("rect[aria-label]");
                let r = -1;
                const a = o.length;
                for (let t = 0; t < a; t += 1) {
                    const n = o[t],
                        e = Number.parseFloat(n.getAttribute("x") || ""),
                        i = Number.parseFloat(n.getAttribute("y") || ""),
                        a = Number.parseFloat(n.getAttribute("width") || ""),
                        c = Number.parseFloat(n.getAttribute("height") || "");
                    if (
                        Number.isNaN(e) ||
                        Number.isNaN(i) ||
                        Number.isNaN(a) ||
                        Number.isNaN(c)
                    ) {
                        console.warn("Invalid x/y coordinates for annotation!");
                        continue;
                    }
                    let h = new DOMPoint(e, i),
                        u = new DOMPoint(e + a, i + c);
                    const l = n.getAttribute("transform");
                    if (l && l.length > 0) {
                        const t = new DOMMatrixReadOnly(l);
                        (h = t.transformPoint(h)), (u = t.transformPoint(u));
                    }
                    h.y !== r &&
                        (s.lines.push({bounds: m.gn(), k: []}), (r = h.y));
                    const d = s.lines[s.lines.length - 1],
                        f = {
                            bounds: {
                                left: h.x - 0,
                                top: h.y - 0,
                                width: Math.abs(u.x - h.x),
                                height: Math.abs(u.y - h.y),
                            },
                            text: n.getAttribute("aria-label"),
                            wn: n.getAttribute("data-font-css"),
                            transform: l,
                        };
                    m.yn(f, d, d.k);
                }
                e.push(s);
            }
            return e;
        }
        mn(t, n) {
            let e = 0,
                i = 0;
            this.Vt.sort(this.Xt);
            const s = new Set();
            n.forEach((t) => {
                const n = {bounds: m.gn(), lines: []};
                s.clear(),
                    t.lines.forEach((t) => {
                        const o = {bounds: m.gn(), k: []};
                        t.k.forEach((t) => {
                            const n = {
                                    bounds: t.bounds,
                                    text: f(t.text),
                                    style: {Cn: t.wn},
                                    data: {spacewidth: this.Gt},
                                    transform: t.transform,
                                },
                                r = `${n.bounds.top}${n.bounds.left}${n.bounds.width}${n.bounds.height}${n.text}`;
                            if (!s.has(r)) {
                                s.add(r);
                                let a = null;
                                for (e = i; e < this.Vt.length; ) {
                                    const t = this.Vt[e];
                                    if (
                                        ((e += 1),
                                        null !== t.text && v(t.text, n.text))
                                    ) {
                                        (a = t), (i = e - 1);
                                        break;
                                    }
                                }
                                let c = this.Gt;
                                a && ((c = a.on), (n.style.Cn = a.font));
                                const h = new DOMMatrix(t.transform);
                                (n.data.spacewidth = c * h.a), m.yn(n, o, o.k);
                            }
                        }),
                            m.yn(o, n, n.lines);
                    }),
                    this.Wt.push(n);
            });
        }
        pn(t) {
            if (0 === this.Ht.length) return;
            const n = t.getBoundingClientRect();
            this.Ht.forEach((t) => {
                if (t.ln && t.ln.Pt) {
                    const e = o.gt(t.canvas, t.x, t.y),
                        i = e.x - n.left,
                        s = e.y - n.top,
                        r = new DOMRect(i, s, t.width, t.height),
                        a = {
                            bounds: {
                                left: i,
                                top: s,
                                width: t.width,
                                height: t.height,
                            },
                            text: null,
                            style: null,
                            data: {bn: t.ln?.Ft},
                        },
                        c = m.xn(r, this.Wt, () => ({
                            bounds: m.gn(),
                            lines: [],
                        })),
                        h = m.xn(r, c.lines, () => ({bounds: m.gn(), k: []}));
                    m.yn(a, h, h.k), h.k.sort(this.Zt), m.Mn(h, c);
                }
            }),
                this.Wt.sort(this.Yt);
        }
        static xn(t, n, e) {
            const i = n.length;
            let s = 0,
                o = 0,
                r = null,
                a = null,
                c = -1;
            for (let e = 0; e < i; e += 1) {
                const i = n[e],
                    h = new DOMRect(
                        i.bounds.left,
                        i.bounds.top,
                        i.bounds.width,
                        i.bounds.height,
                    ).Rn(t);
                h.height <= 0
                    ? i.bounds.top < t.top && (c = e)
                    : (o <= h.height && ((o = h.height), (a = i)),
                      s <= h.width && ((s = h.width), (r = i)));
            }
            if (r) return r;
            if (a) return a;
            const h = e();
            return c >= 0 ? n.splice(c + 1, 0, h) : n.push(h), h;
        }
        static yn(t, n, e) {
            m.Mn(t, n), e.push(t);
        }
        static Mn(t, n) {
            const e = {x: t.bounds.left, y: t.bounds.top};
            (n.bounds.left = Math.min(n.bounds.left, e.x)),
                (n.bounds.top = Math.min(n.bounds.top, e.y)),
                (n.bounds.right = Math.max(
                    n.bounds.right,
                    e.x + t.bounds.width,
                )),
                (n.bounds.bottom = Math.max(
                    n.bounds.bottom,
                    e.y + t.bounds.height,
                )),
                (n.bounds.width = Math.abs(n.bounds.right - n.bounds.left)),
                (n.bounds.height = Math.abs(n.bounds.bottom - n.bounds.top));
        }
        static gn() {
            return {
                left: Number.MAX_SAFE_INTEGER,
                top: Number.MAX_SAFE_INTEGER,
                right: Number.MIN_SAFE_INTEGER,
                bottom: Number.MIN_SAFE_INTEGER,
                width: 0,
                height: 0,
            };
        }
        static sort(t, n, e, i) {
            return n !== i ? n - i : m.tn(t, e);
        }
        static tn(t, n) {
            return t !== n ? t - n : 0;
        }
    }
    class p extends n {
        Dn;
        jn;
        Nn;
        On;
        Fn;
        Pn;
        constructor() {
            super(),
                (this.Dn = new Map()),
                (this.jn = new Map()),
                (this.Nn = !1),
                (this.On = this.In.bind(this)),
                (this.Fn = void 0),
                (this.Pn = new Set(["#76a7fa80", "#00000025"])),
                window.addEventListener("dji.animationframe.begin", (t) =>
                    this.Sn(t.detail && t.detail.Tn),
                ),
                window.addEventListener("dji.animationframe.end", (t) =>
                    this.kn(t.detail && t.detail.Tn),
                );
        }
        En(t) {
            const n = this.Dn.get(t);
            return null != n ? n.en : null;
        }
        dn(t) {
            const n = this.Dn.get(t);
            n && n.dn(t);
        }
        N(t) {
            const n = new m(),
                e = () => {
                    this._n(), this.In(t, n);
                };
            n.nn("updated", e),
                this.Dn.set(t, n),
                this.jn.set(t, new i()),
                e(),
                super.N(t);
        }
        O(t) {
            this.Dn.delete(t), this.jn.delete(t), super.O(t);
        }
        Sn(t) {}
        kn(t) {
            this.In(null, null);
        }
        M(t, n, e, i, s) {
            const o = this.Dn.get(t.canvas);
            o && o.clear(n, e, i, s);
            const r = this.jn.get(t.canvas);
            r && r.clear(), this._n(), super.M(t, n, e, i, s);
        }
        R(t, n, e, i, s) {
            const o = (function (t) {
                    if (t)
                        return (
                            (t = t.trim()).startsWith("rgb") &&
                                (t = t
                                    .replace(/rgba?|\(|\)/g, "")
                                    .split(",")
                                    .map((t, n) =>
                                        Number.parseInt(
                                            3 === n
                                                ? String(255 * parseFloat(t))
                                                : t,
                                            10,
                                        )
                                            .toString(16)
                                            .padStart(2, "0"),
                                    )
                                    .join("")),
                            t.startsWith("#") || (t = `#${t}`),
                            t
                        );
                })(String(t.fillStyle)),
                r = this.Pn.has(o),
                a = t.An || null,
                c = (a && a[a.length - 1]) || null,
                h =
                    (c && c.Bn && c.Bn.Rn(new DOMRect(n, e, i, s))) ||
                    new DOMRect(n, e, i, s);
            if (r) this.zn(t, n, e, i, s);
            else {
                const n = this.Dn.get(t.canvas);
                n && n.clear(h.x, h.y, h.width, h.height);
            }
            this._n(), super.R(t, n, e, i, s);
        }
        D(t, n, e, i, s) {
            const o = this.Dn.get(t.canvas);
            o && (o.sn(t, n, e, i, s), this._n(), super.D(t, n, e, i, s));
        }
        j(t, n, e, i, s, o, r, a, c, h) {
            const u = this.Dn.get(t.canvas);
            u &&
                (u.hn(t, n, e, i, s, o, r, a, c, h),
                this._n(),
                super.j(t, n, e, i, s, o, r, a, c, h));
        }
        _n() {
            this.Nn ||
                ((this.Nn = !0),
                (this.Fn = setTimeout(this.On, 0)),
                this.notify("canvas-updates-willBegin"));
        }
        $n() {
            this.Nn && (this.notify("canvas-updates-didEnd"), (this.Nn = !1));
        }
        In(t, n) {
            if (this.Nn) {
                this.Fn && (clearTimeout(this.Fn), (this.Fn = void 0));
                try {
                    t && n
                        ? this.Un(t, n)
                        : this.Dn.forEach((t, n) => {
                              this.Un(n, t);
                          }),
                        this.jn.forEach((t, n) => {
                            this.Wn(n, t);
                        });
                } finally {
                    this.$n();
                }
            }
        }
        Un(t, n) {
            t && n.fn(t),
                n.dt() &&
                    super.notify("canvas-text-changed", {canvas: t, en: n.en});
        }
        zn(t, n, e, s, o) {
            let r = this.jn.get(t.canvas);
            r || ((r = new i()), this.jn.set(t.canvas, r)),
                r.extend(t, n, e, s, o);
        }
        Wn(t, n) {
            n &&
                n.dt() &&
                super.notify("canvas-selection-changed", {
                    canvas: t,
                    bounds: n.bounds,
                });
        }
    }
    class g {
        Vn;
        Hn;
        Ln;
        constructor(t) {
            (this.Vn = null),
                (this.Hn = {
                    Gn: "dji-canvas-overlay",
                    Jn: "dji-canvas-content",
                    ...t,
                }),
                (this.Ln = null);
        }
        get options() {
            return this.Hn;
        }
        initialize(t = null) {
            if (this.Vn) return;
            this.Vn = document.createElement("div");
            const {Gn: n} = this.Hn;
            n && n.length > 0 && this.Vn.classList.add(n);
            const e = this.Kn();
            e &&
                (e.classList.add(this.options.Jn),
                e.setAttribute("tabindex", "0"),
                this.Vn.appendChild(e)),
                (this.Ln = t || document.body);
        }
        set qn(t) {
            this.Qn(t);
        }
        Qn(t) {
            (this.Vn.style.top = `${t.top}px`),
                (this.Vn.style.left = `${t.left}px`),
                (this.Vn.style.width = `${t.width}px`),
                (this.Vn.style.height = `${t.height}px`),
                this.Vn.parentElement && this.show();
        }
        set state(t) {
            switch (
                (this.Vn.classList.remove(
                    "dji-sru-screen-select-busy",
                    "dji-sru-screen-select-ready",
                ),
                t)
            ) {
                case "busy":
                    this.Vn.classList.add("dji-sru-screen-select-busy");
                    break;
                case "ready":
                    this.Vn.classList.add("dji-sru-screen-select-ready");
            }
        }
        get ownerDocument() {
            return this.Vn ? this.Vn.ownerDocument : null;
        }
        Xn(t) {
            (this.Vn.style.width = t.width),
                (this.Vn.style.height = t.height),
                (this.Vn.style.marginLeft = t.marginLeft),
                (this.Vn.style.marginTop = t.marginTop);
        }
        show() {
            this.Ln.append(this.Vn);
        }
        Yn() {
            this.Zn(), this.Ln.removeChild(this.Vn);
        }
        Zn() {
            throw String("Implement this in derived class!");
        }
        te(t, n) {
            throw String("Implement this in derived class!");
        }
        ne(t, n) {
            this.Zn(), this.te(t, n);
        }
        ee(t) {
            throw String("Implement this in derived class!");
        }
        Kn() {
            throw String("Implement this in derived class!");
        }
    }
    function w(t) {
        if (1 !== t.length) return !1;
        switch (t.charCodeAt(0)) {
            case 8203:
            case 8204:
                return !0;
        }
        return !1;
    }
    const y = 0.4;
    function C(t) {
        t.offsetNode &&
            ((function (t) {
                if (t.offsetNode.nodeType !== Node.ELEMENT_NODE) return;
                const n = {
                    acceptNode(n) {
                        if ("hidden" === n.style.visibility)
                            return NodeFilter.FILTER_REJECT;
                        if (-1 === n.style.zIndex)
                            return NodeFilter.FILTER_REJECT;
                        const e = n.getBoundingClientRect();
                        if (
                            (e.left <= t.ie.left ||
                                Math.abs(t.ie.left - e.left) < 0.65) &&
                            (e.right >= t.ie.right ||
                                Math.abs(t.ie.right - e.right) < 0.65)
                        ) {
                            const n = t.ie.top + t.ie.height / 2;
                            return n >= e.top && n <= e.bottom
                                ? NodeFilter.FILTER_ACCEPT
                                : NodeFilter.FILTER_SKIP;
                        }
                        return NodeFilter.FILTER_SKIP;
                    },
                };
                let e = document.createTreeWalker(
                        t.offsetNode,
                        NodeFilter.SHOW_ELEMENT,
                        n,
                    ),
                    i = e.currentNode;
                i === t.offsetNode && (i = e.nextNode());
                let s = t.offsetNode;
                for (; i; )
                    (s = i),
                        (e = document.createTreeWalker(
                            i,
                            NodeFilter.SHOW_ELEMENT,
                            n,
                        )),
                        (i = e.nextNode());
                t.offsetNode !== s && ((t.offsetNode = s), (t.offset = 0));
            })(t),
            (function (t) {
                const n = document.createRange(),
                    e = {acceptNode: () => NodeFilter.FILTER_ACCEPT},
                    i = document.createNodeIterator(
                        t.offsetNode,
                        NodeFilter.SHOW_TEXT,
                        e,
                    );
                let s = i.nextNode(),
                    o = null,
                    r = Number.MAX_SAFE_INTEGER;
                const a = t.ie.top + t.ie.height / 2;
                for (; s; ) {
                    n.setStart(s, 0), n.setEnd(s, s.textContent.length);
                    const e = n.getBoundingClientRect(),
                        c = Math.abs(t.ie.left - e.left);
                    if (
                        a >= e.top &&
                        a <= e.bottom &&
                        Boolean(e.left <= t.ie.left || c < y)
                    ) {
                        if (
                            Boolean(
                                e.right >= t.ie.right ||
                                    Math.abs(t.ie.right - e.right) < y,
                            )
                        )
                            return void (t.offsetNode = s);
                        s.parentElement === t.offsetNode &&
                            r > c &&
                            ((r = c), (o = s));
                    }
                    s = i.nextNode();
                }
                o && ((t.offsetNode = o), (t.offset = o.textContent.length));
            })(t));
    }
    class b {
        static se(t) {
            C(t),
                (function (t) {
                    let n = t.offset;
                    try {
                        const e = document.createRange();
                        e.setStart(t.offsetNode, t.offset),
                            e.setEnd(t.offsetNode, t.offset);
                        const i = t.ie.right,
                            s = t.ie.top,
                            o = t.ie.bottom;
                        let r = e.getBoundingClientRect();
                        if (r.bottom < s || r.top > o) return;
                        let a = Math.min(
                            Math.abs(i - r.right),
                            Math.abs(i - r.right),
                        );
                        if (a > y) {
                            const s = t.offsetNode.nodeValue;
                            if (!s) return;
                            const o = s.length;
                            let c = 0,
                                h = o,
                                u = 0;
                            for (; c < h; ) {
                                if (
                                    ((u = Math.floor((c + h) / 2)),
                                    e.setStart(t.offsetNode, u),
                                    e.setEnd(t.offsetNode, u + 1),
                                    (r = e.getBoundingClientRect()),
                                    (a = Math.min(
                                        Math.abs(i - r.right),
                                        Math.abs(i - r.right),
                                    )),
                                    a <= y)
                                ) {
                                    c = u;
                                    break;
                                }
                                r.right < i ? (c = u + 1) : (h = u);
                            }
                            if (((n = c), c > 0)) {
                                const o = s.length,
                                    u = c;
                                (c = Math.max(0, u - 3)),
                                    (h = Math.min(u + 3, o));
                                let l = Number.MAX_SAFE_INTEGER;
                                for (a = 0; c <= h; c += 1)
                                    (c < o && w(s[c])) ||
                                        (e.setStart(t.offsetNode, c),
                                        e.setEnd(t.offsetNode, c),
                                        (r = e.getBoundingClientRect()),
                                        (a = Math.min(
                                            Math.abs(i - r.right),
                                            Math.abs(i - r.right),
                                        )),
                                        a < l && ((n = c), (l = a)));
                            }
                        }
                    } catch (t) {}
                    t.offset = n;
                })(t),
                (t.oe = !0);
        }
        static re(t, n) {
            const e = {offsetNode: null, offset: 0},
                i = {
                    acceptNode: (t) =>
                        t.nodeType === Node.TEXT_NODE
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT,
                },
                s = t.ownerDocument.createNodeIterator(
                    t,
                    NodeFilter.SHOW_TEXT,
                    i,
                );
            let o = s.nextNode(),
                r = n;
            for (; o; ) {
                if (((r -= o.textContent.length), r <= 0)) {
                    (e.offset = Math.abs(r)), (e.offsetNode = o);
                    break;
                }
                o = s.nextNode();
            }
            return e;
        }
        static ae(t, n, e) {
            let i = 0;
            const s = {
                    acceptNode: (t) =>
                        t.nodeType === Node.TEXT_NODE
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT,
                },
                o = t.ownerDocument.createNodeIterator(
                    t,
                    NodeFilter.SHOW_TEXT,
                    s,
                );
            let r = o.nextNode();
            for (; r; ) {
                if (r === n) {
                    i += e;
                    break;
                }
                (i += r.textContent.length), (r = o.nextNode());
            }
            return i;
        }
        static ce(t, n) {
            let e = null;
            if (t.getBoundingClientRect) e = t.getBoundingClientRect();
            else {
                const n = document.createRange();
                n.selectNodeContents(t), (e = n.getBoundingClientRect());
            }
            const i = t.ownerDocument;
            return !!b.he(e, i) && (!n || b.ue(t));
        }
        static le(t, n) {
            return (
                t.left < n.right &&
                n.left < t.right &&
                t.top < n.bottom &&
                n.top < t.bottom
            );
        }
        static he(t, n) {
            const e = n.defaultView,
                i = new DOMRect(
                    0,
                    0,
                    e.innerWidth || n.documentElement.clientWidth,
                    e.innerHeight || n.documentElement.clientHeight,
                );
            if (!b.le(i, t)) return !1;
            if (!e.frameElement || !e.frameElement.contentDocument) return !0;
            const s = e.frameElement.getBoundingClientRect();
            return b.he(
                new DOMRect(t.x - s.left, t.y - s.top, t.width, t.height),
                e.frameElement.ownerDocument,
            );
        }
        static ue(t) {
            const n = t.ownerDocument.defaultView.getComputedStyle(t),
                e = n.getPropertyValue("visibility");
            if (!Boolean("visible" === e || "collapsed" === e)) return !1;
            return "0" !== n.getPropertyValue("opacity");
        }
        static de(t, n) {
            if (t.ownerDocument !== n.ownerDocument) return !1;
            const e = document.createRange();
            e.selectNodeContents(t);
            const i = document.createRange();
            return (
                i.selectNodeContents(n),
                Boolean(-1 === e.compareBoundaryPoints(Range.END_TO_START, i))
            );
        }
    }
    class x {
        static fe(t) {
            const n = t.document.querySelector(
                "div#kix-current-user-cursor-caret",
            );
            if (!n) return null;
            const e = n.getBoundingClientRect();
            if (0 === e.width || 0 === e.height) {
                const n = t.document.getSelection();
                if ("none" === n.type) return null;
                if (null === n.focusNode || void 0 === n.focusNode) return null;
                const e = new Range();
                return (
                    e.setStart(n.focusNode, n.focusOffset),
                    e.setEnd(n.focusNode, n.focusOffset),
                    {
                        offsetNode: n.focusNode,
                        offset: n.focusOffset,
                        ie: e.getBoundingClientRect(),
                    }
                );
            }
            const i = e.left + e.width / 2,
                s = e.top + e.height / 2,
                o = x.ve(t, i, s);
            return o ? ((o.ie = e), o.oe || b.se(o), o) : null;
        }
        static elementFromPoint(t, n, e) {
            let i = null;
            const s = t.document.querySelectorAll(".has-canvas-annotations");
            let o = s.length;
            for (let t = 0; t < o; t += 1) {
                const n = s[t];
                n && (n.style.pointerEvents = "");
            }
            const r = t.document.elementsFromPoint(n, e);
            for (let t = 0; t < o; t += 1) {
                const n = s[t];
                n && (n.style.pointerEvents = "none");
            }
            const a = r.find((n) => n.matches(t.me));
            if (a) {
                let t = !0;
                for (
                    i = a.shadowRoot.getElementById("dji-canvas-annotations");
                    t && i;

                ) {
                    (t = !1), (o = i.children.length);
                    for (let s = 0; s < o; s += 1) {
                        const o = i.children[s],
                            r = o.getBoundingClientRect();
                        if (
                            r.left <= n &&
                            n <= r.right &&
                            r.top <= e &&
                            e <= r.bottom
                        ) {
                            (i = o), (t = !0);
                            break;
                        }
                    }
                }
            } else
                i = r.find(
                    (t) =>
                        !t.matches(".kix-cursor") &&
                        !t.matches(".kix-cursor-caret") &&
                        !t.matches(".kix-spell-bubble-suggestion-text") &&
                        t.closest(".kix-page"),
                );
            return i;
        }
        static pe(t, n, e) {
            const i = x.elementFromPoint(t, n, e);
            if (!i) return i;
            let s = null;
            if (i.classList.contains("dji-canvas-content")) {
                const t = new DOMRect(n, e, 1, 1),
                    o = t.left + t.width / 2,
                    r = t.top + t.height / 2;
                s = x.ge(i, o, r);
            } else {
                if (!i.matches || !i.matches("div.dji-canvas-para")) return i;
                s = i;
            }
            return s || i;
        }
        static ve(t, n, e) {
            const i = x.elementFromPoint(t, n, e);
            if (!i) return null;
            let s = {offsetNode: i, offset: 0, ie: new DOMRect(n, e, 0, 1)};
            return (
                s.offsetNode &&
                    (s.offsetNode.classList.contains("dji-canvas-content")
                        ? (s = x.we(s.offsetNode, s.ie))
                        : s.offsetNode.matches &&
                            s.offsetNode.matches("div.dji-canvas-para")
                          ? (s = x.ye(s.offsetNode, s.ie))
                          : (s.offsetNode.classList.contains(
                                "dji-canvas-word",
                            ) &&
                                s.offsetNode.firstChild &&
                                (s.offsetNode = s.offsetNode.firstChild),
                            b.se(s))),
                s.offsetNode ? s : null
            );
        }
        static ge(t, n, e) {
            let i = Number.MAX_SAFE_INTEGER,
                s = Number.MAX_SAFE_INTEGER,
                o = Number.MAX_SAFE_INTEGER,
                r = null,
                a = null;
            const c = t.querySelectorAll("div.dji-canvas-para"),
                h = c.length;
            for (let t = 0; t < h; t += 1) {
                const h = c[t],
                    u = h.getBoundingClientRect(),
                    l =
                        e > u.top && e < u.bottom
                            ? 0
                            : Math.min(
                                  Math.abs(u.top - e),
                                  Math.abs(u.bottom - e),
                              );
                if (l <= i) {
                    i = l;
                    const t =
                        n > u.left && n < u.right
                            ? 0
                            : Math.min(
                                  Math.abs(u.left - n),
                                  Math.abs(u.right - n),
                              );
                    if (0 === l) {
                        if (0 === t) {
                            (r = h), (a = null);
                            break;
                        }
                        o > t && ((o = t), (a = h));
                    }
                    t < s && ((s = t), (r = h));
                }
            }
            return a && (r = a), r;
        }
        static Ce(t, n) {
            const e = {offsetNode: null, offset: -1, ie: null};
            let i = Number.MAX_SAFE_INTEGER,
                s = null;
            const o = t.querySelectorAll("span.dji-canvas-word"),
                r = o.length;
            for (let t = 0; t < r; t += 1) {
                const r = o[t],
                    a = r.getBoundingClientRect();
                if (!(n.top > a.bottom || n.bottom < a.top)) {
                    if (n.x >= a.left && n.x <= a.right) {
                        (e.offsetNode = r.firstChild),
                            (e.offset = 0),
                            (s = null);
                        break;
                    }
                    {
                        const t = Math.min(
                            Math.abs(n.x - a.left),
                            Math.abs(n.x - a.right),
                        );
                        t < i && ((i = t), (s = r.firstChild));
                    }
                }
            }
            return s && (e.offsetNode = s), e;
        }
        static be(t, n, e, i = 1, s = 1) {
            return x.Ce(t, new DOMRectReadOnly(n, e, i, s));
        }
        static xe(t, n) {
            const e = (function (t) {
                let n = (t.dataset || t.parentElement.dataset).spacewidth;
                return (
                    "string" == typeof n && (n = Number.parseFloat(n)),
                    "number" != typeof n ? null : n
                );
            })(t);
            if (!e) return 0;
            const i = document.createRange();
            i.selectNodeContents(t);
            const s = n - i.getBoundingClientRect().right,
                o = Math.trunc(s / e);
            return s > 0 ? Math.max(o, 0) : 0;
        }
        static Me(t, n, e) {
            const i = t.nodeType === Node.TEXT_NODE ? t.parentElement : t,
                s = x.ge(i.closest("div.dji-canvas-content"), n, e),
                o = i.closest("div.dji-canvas-para");
            if (s !== o) return 0;
            return x.be(o, n, e).offsetNode !== t ? 0 : x.xe(t, n);
        }
        static we(t, n) {
            const e = n.left + n.width / 4,
                i = n.top + n.height / 4,
                s = x.ge(t, e, i);
            return s ? x.ye(s, n) : {offsetNode: null, offset: -1, ie: null};
        }
        static ye(t, n) {
            const e = x.be(t, n.left, n.top, 1, n.height);
            if (!e.offsetNode) return e;
            const i = x.xe(e.offsetNode, n.left);
            return (e.offset = e.offsetNode.textContent.length + i), e;
        }
    }
    class M extends g {
        Re;
        De;
        constructor(t) {
            super({je: "dji-canvas-para", Ne: "dji-canvas-word"}),
                (this.Re = null),
                (this.De = t);
        }
        Zn() {
            this.Re.innerHTML = "";
        }
        Kn() {
            return (
                this.Re || (this.Re = document.createElement("div")), this.Re
            );
        }
        te(t) {
            const n = this.options.je,
                e = this.options.Ne;
            let i = !1,
                s = -1;
            const o = document.createDocumentFragment();
            return (
                t.forEach((t) => {
                    s += 1;
                    const r = document.createElement("div");
                    r.setAttribute("class", n),
                        r.style.setProperty("left", t.bounds.left / 1 + "px"),
                        r.style.setProperty("top", t.bounds.top / 1 + "px"),
                        r.style.setProperty("width", t.bounds.width / 1 + "px"),
                        r.style.setProperty(
                            "height",
                            t.bounds.height / 1 + "px",
                        );
                    let a = -1;
                    const {lines: c} = t;
                    c.forEach((n) => {
                        a += 1;
                        const {k: o} = n;
                        o.forEach((n) => {
                            const o = n.bounds.left - t.bounds.left,
                                c = n.bounds.top - t.bounds.top,
                                {height: h} = n.bounds,
                                u = document.createElement("span");
                            if (
                                (u.setAttribute("class", e),
                                u.style.setProperty("left", o / 1 + "px"),
                                u.style.setProperty("top", c / 1 + "px"),
                                n.style &&
                                    (n.style.Cn
                                        ? u.style.setProperty(
                                              "font",
                                              n.style.Cn,
                                          )
                                        : (n.style.Oe
                                              ? u.style.setProperty(
                                                    "font-size",
                                                    n.style.Oe / 1 + "pt",
                                                )
                                              : n.style.Fe &&
                                                u.style.setProperty(
                                                    "font-size",
                                                    `${n.style.Fe}px`,
                                                ),
                                          n.font &&
                                              u.style.setProperty(
                                                  "font-family",
                                                  n.font,
                                              ))),
                                n.Pe && (u.style.alignmentBaseline = n.Pe),
                                n.align && (u.style.textAlign = n.align),
                                n.direction &&
                                    (u.style.direction = n.direction),
                                n.transform)
                            ) {
                                const t = new DOMMatrix(n.transform);
                                (t.e = 0),
                                    (t.f = 0),
                                    (u.style.transform = t.toString()),
                                    (u.style.transformOrigin = "top left");
                            }
                            if (
                                (n.bounds.width &&
                                    u.style.setProperty(
                                        "width",
                                        n.bounds.width / 1 + "px",
                                    ),
                                n.bounds.height &&
                                    (u.style.setProperty(
                                        "height",
                                        h / 1 + "px",
                                    ),
                                    u.style.setProperty(
                                        "line-height",
                                        h / 1 + "px",
                                    )),
                                (u.innerText = n.text),
                                n.classList)
                            ) {
                                n.classList.split(",").forEach((t) => {
                                    u.classList.add(t);
                                });
                            }
                            if (n.data) {
                                Object.keys(n.data).forEach((t) => {
                                    u.setAttribute(`data-${t}`, n.data[t]);
                                });
                            }
                            u.setAttribute("data-lineno", a.toString()),
                                u.setAttribute("data-parano", s.toString()),
                                r.appendChild(u),
                                (i = !0);
                        });
                    }),
                        o.appendChild(r);
                }),
                this.Re.appendChild(o),
                i
            );
        }
        ee(t) {
            const n = document.getSelection();
            if (0 === t.bounds.length) return n.empty(), !0;
            const e = t.bounds[0],
                i = t.bounds[t.bounds.length - 1],
                s = x.ve(
                    {document: document, me: this.De},
                    e.x,
                    e.y + e.height / 2,
                ),
                o = x.ve(
                    {document: document, me: this.De},
                    i.x + i.width - 0,
                    i.y + i.height / 2 - 2,
                );
            try {
                s && o
                    ? n.setBaseAndExtent(
                          s.offsetNode,
                          M.Ie(s),
                          o.offsetNode,
                          M.Ie(o),
                      )
                    : n.empty();
            } catch (t) {
                return !1;
            }
            return !0;
        }
        static Ie(t) {
            return t.offset < 0
                ? 0
                : t.offset > t.offsetNode.textContent.length
                  ? t.offsetNode.textContent.length
                  : t.offset;
        }
    }
    class R {
        Se;
        Te;
        Ln;
        ke;
        De;
        constructor(t, n, e) {
            (this.Se = null),
                (this.Te = null),
                (this.Ln = n),
                (this.De = e),
                (this.ke = t),
                this.ke.addEventListener("canvas-updates-willBegin", (t) => {
                    this.Ee(t.detail);
                }),
                this.ke.addEventListener("canvas-updates-didEnd", (t) => {
                    this._e(t.detail);
                }),
                this.ke.addEventListener("canvas-text-changed", (t) => {
                    this.Ae(t.detail);
                }),
                this.ke.addEventListener("canvas-selection-changed", (t) => {
                    this.ee(t.detail);
                });
        }
        Be(t) {
            if (this.Te === t) return;
            if (((this.Te = t), !t))
                return void (this.Se && (this.Se.Yn(), (this.Se = null)));
            this.Se || this.init();
            const n = {canvas: this.Te, en: this.ke.En(this.Te)};
            this.Ae(n), this.Se.show();
        }
        ze() {
            this.Te && (this.Se.qn = this.Te.getBoundingClientRect());
        }
        init() {
            (this.Se = new M(this.De)),
                (this.Ln = this.Ln || this.Te.parentElement),
                this.Se.initialize(this.Ln);
        }
        Ee(t) {
            this.Ln.setAttribute(
                "data-update-inprogress",
                Date.now().toString(),
            );
        }
        _e(t) {
            this.Ln.setAttribute("data-updated-at", Date.now().toString()),
                this.Ln.removeAttribute("data-update-inprogress");
        }
        Ae(t) {
            if (!t) return !1;
            if (t.canvas !== this.Te) return !1;
            this.Se.Zn(),
                t.en
                    ? (this.Se.te(t.en, 1), (this.Se.state = "ready"))
                    : (this.Se.state = "");
            const n = this.Te.getBoundingClientRect();
            return (this.Se.qn = n), !0;
        }
        ee(t) {
            if (!t) return !1;
            if (t.canvas !== this.Te) return !1;
            const n = document.getSelection();
            if (0 === t.bounds.length) return n.empty(), !0;
            const e = t.bounds[0],
                i = t.bounds[t.bounds.length - 1],
                s = x.ve(
                    {document: document, me: this.De},
                    e.x,
                    e.y + e.height / 2,
                ),
                o = x.ve(
                    {document: document, me: this.De},
                    i.x + i.width - 0,
                    i.y + i.height / 2 - 2,
                );
            try {
                s && o
                    ? n.setBaseAndExtent(
                          s.offsetNode,
                          R.Ie(s),
                          o.offsetNode,
                          R.Ie(o),
                      )
                    : n.empty();
            } catch (t) {
                return console.error(t), !1;
            }
            return !0;
        }
        static Ie(t) {
            return t.offset < 0
                ? 0
                : t.offset > t.offsetNode.textContent.length
                  ? t.offsetNode.textContent.length
                  : t.offset;
        }
    }
    function D(t) {
        return Boolean(
            t.matches && t.matches("canvas.kix-canvas-tile-content"),
        );
    }
    class j {
        t = new Map();
        ke = null;
        Ln = null;
        $e = void 0;
        Ue = void 0;
        We;
        Ve;
        He;
        Le;
        Ge;
        Je;
        Ke;
        qe;
        Qe = void 0;
        De;
        constructor(t, n) {
            (this.We = new ResizeObserver((t) => {
                this.Xe(t);
            })),
                (this.Ve = new MutationObserver((t) => {
                    this.Ye(t);
                })),
                (this.He = new MutationObserver((t) => {
                    this.Ye(t);
                })),
                (this.Le = t || document.body),
                (this.De = n),
                (this.Ge = !1),
                (this.Je = !1),
                (this.Ke = -1),
                (this.qe = (t) => {
                    this.Ze(t);
                }),
                (this.Qe = void 0);
        }
        get root() {
            return (
                this.Ln ||
                    ((this.Ln = document.createElement("div")),
                    this.Ln.setAttribute("id", "dji-canvas-annotations"),
                    this.Ln.setAttribute("aria-hidden", "true"),
                    (this.Ln.style.position = "fixed"),
                    (this.Ln.style.overflow = "hidden"),
                    (this.Ln.style.width = "100%"),
                    (this.Ln.style.height = "100%"),
                    (this.Ln.style.zIndex = "2147483646"),
                    this.Le.appendChild(this.Ln)),
                this.Ln
            );
        }
        get ti() {
            return (
                (this.$e && this.$e.isConnected) ||
                    (this.$e = document.querySelector(
                        "div.kix-appview-editor",
                    )),
                this.$e
            );
        }
        get ni() {
            return (
                (this.Ue && this.Ue.isConnected) ||
                    (this.Ue = document.querySelector(
                        "div.kix-rotatingtilemanager",
                    )),
                this.Ue
            );
        }
        ei() {
            if (this.Ge) return;
            const t = this.ni;
            t &&
                (this.We.observe(t),
                this.Ve.observe(t, {
                    attributes: !0,
                    attributeFilter: ["style"],
                }),
                (this.Ge = !0));
        }
        ii() {
            if (!this.Ge) return;
            this.Ve.disconnect();
            const t = this.ni;
            t && (this.We.unobserve(t), (this.Ge = !1));
        }
        si() {
            if (this.Je) return;
            const t = this.ti;
            t &&
                (t.addEventListener("scroll", this.qe),
                this.He.observe(t, {
                    attributes: !0,
                    attributeFilter: ["style"],
                }),
                (this.Je = !0));
        }
        oi() {
            if (!this.Je) return;
            this.He.disconnect();
            const t = this.ti;
            t && (t.removeEventListener("scroll", this.qe), (this.Je = !1));
        }
        start() {
            this.ke ||
                ((this.ke = new p()),
                this.ri(document),
                document.dispatchEvent(
                    new CustomEvent("webkitvisibilitychange", {
                        cancelable: !1,
                        bubbles: !0,
                    }),
                ));
        }
        Ze(t) {
            this.Ln && this.ai();
        }
        ai() {
            this.Ke > 0 ||
                (this.Ke = window.setTimeout(() => {
                    this.Ke = -1;
                    let t = !1;
                    for (let [n, e] of this.t)
                        n.isConnected ? e.ze() : (t = !0);
                    t && this.ci();
                }, 50));
        }
        Xe(t) {
            t.length > 0 && this.ai();
        }
        ri(t) {
            const n = D(t)
                ? [t]
                : t.querySelectorAll
                  ? t.querySelectorAll("canvas.kix-canvas-tile-content")
                  : [];
            for (let t = 0; t < n.length; t++) this.hi(n[t]);
            this.ci();
        }
        ui(t) {
            const n = D(t)
                ? [t]
                : t.querySelectorAll
                  ? t.querySelectorAll("canvas.kix-canvas-tile-content")
                  : [];
            for (let t = 0; t < n.length; t++) this.li(n[t]);
        }
        ci() {
            for (let [t, n] of this.t) t.isConnected || this.ui(t);
        }
        Ye(t) {
            for (let n of t)
                if ("attributes" === n.type && "style" === n.attributeName) {
                    this.ai();
                    break;
                }
        }
        hi(t) {
            this.ke.v(t);
            let n = this.t.get(t);
            if (n) return;
            this.ei(),
                this.si(),
                (n = new R(this.ke, this.root, this.De)),
                n.Be(t),
                this.t.set(t, n);
            const e = j.di(t);
            this.fi(e);
        }
        li(t) {
            this.ke.p(t);
            let n = this.t.get(t);
            n &&
                (n.Be(null),
                this.t.delete(t),
                0 === this.t.size &&
                    this.Ln &&
                    (this.Ln.remove(), (this.Ln = null), this.ii(), this.oi()));
        }
        fi(t) {
            (void 0 !== this.Qe && this.Qe === t) || ((this.Qe = t), this.ai());
        }
        static di(t) {
            return (
                null === t.parentElement.querySelector("div.kix-page-paginated")
            );
        }
    }
    const N = `${"1.1.0"}`;
    class O {
        constructor(t) {
            (this.vi = null), (this.mi = null), this.pi(t);
        }
        get gi() {
            return this.vi;
        }
        get shadowRoot() {
            return this.mi;
        }
        static wi(t) {
            let n = document.querySelector(t);
            if (!n) {
                const e = new O(t);
                (n = e.gi), (n.yi = e);
            }
            return n.yi;
        }
        static Ci(t) {
            const n = document.querySelector(t);
            return !!n && !!n.yi;
        }
        pi(t) {
            (this.vi = document.createElement(t)),
                this.vi.setAttribute("tabindex", "-2"),
                (this.vi.dataset.version = N),
                this.vi.classList.add("has-canvas-annotations"),
                this.vi.classList.add("dji-temp-selection"),
                (this.vi.style.pointerEvents = "none"),
                (this.mi = this.vi.attachShadow({mode: "open"})),
                this.bi(),
                document.documentElement.append(this.vi),
                document.addEventListener("DOMContentLoaded", () => this.xi());
        }
        bi() {
            const t = document.createElement("style");
            (t.textContent =
                ":host{overflow:hidden}@media print{:host{display:none}}div.dji-canvas-overlay{background-color:transparent;border:none;cursor:none;display:none;overflow:hidden;position:fixed;z-index:-1}div.dji-canvas-overlay.dji-sru-screen-select,div.dji-canvas-overlay.dji-sru-screen-select-busy,div.dji-canvas-overlay.dji-sru-screen-select-ready{display:block!important}div.dji-canvas-overlay div.dji-canvas-content{background-color:transparent;cursor:default;display:none;height:100%;outline:none;overflow:hidden;position:absolute;width:100%}div.dji-canvas-overlay div.dji-canvas-content:focus{outline:none}div.dji-canvas-overlay.dji-sru-screen-select-ready div.dji-canvas-content{display:block!important}div.dji-canvas-overlay div.dji-canvas-para{background-color:transparent;display:inline-block;position:absolute}div.dji-canvas-overlay div.dji-canvas-para.dji-sru-overlay-paragraph{opacity:.33}div.dji-canvas-overlay div.dji-canvas-para span.dji-canvas-word{background-color:transparent;border:0 solid transparent;color:transparent;display:inline-block;position:absolute;white-space:pre}#dji-canvas.dji-temp-selection div.dji-canvas-overlay div.dji-canvas-para span.dji-canvas-word ::selection{color:transparent!important}div.dji-canvas-content ::selection{--dji-canvas-selection-color:transparent;--dji-canvas-selection-background-color:transparent;background-color:var(--dji-canvas-selection-background-color)!important;color:var(--dji-canvas-selection-color)!important}"),
                this.mi.append(t);
        }
        xi() {
            document.documentElement.append(this.vi);
        }
    }
    let F = null;
    function P(t) {
        t.forEach((t) => {
            t.endsWith(".js")
                ? (function (t) {
                      const n = document.createElement("script");
                      (n.type = "text/javascript"),
                          (n.src = t),
                          F.querySelector("head").appendChild(n);
                  })(t)
                : t.endsWith(".css") &&
                  (function (t) {
                      const n = document.createElement("link");
                      n.setAttribute("rel", "stylesheet"),
                          n.setAttribute("href", t),
                          F.querySelector("head").appendChild(n);
                  })(t);
        });
    }
    class I {
        static inject(t, n) {
            if (
                !(function (t) {
                    const n = !O.Ci(t);
                    return (F = O.wi(t).shadowRoot), n;
                })(t)
            )
                return null;
            P(n);
            const e = new j(F, t);
            return e.start(), e;
        }
    }
    function S(t) {
        const n = t || document.currentScript.dataset.extensionId,
            e = "dji-canvas-v1";
        console.warn("********* [__dji__gdocsInit]", n, e),
            window._docs_annotate_canvas_by_ext ||
                (window._docs_annotate_canvas_by_ext = n);
        const i = "__dji_preloads_override_dji-canvas-v1";
        if (window[i]) return e;
        window.trustedTypes &&
            window.trustedTypes.createPolicy &&
            window.trustedTypes.createPolicy("default", {
                createHTML: (t, n) => t,
            }),
            (window[i] = !0);
        let s = null;
        function o(t, n) {
            return n && !t.An && (t.An = []), t.An;
        }
        function r(t) {
            const n = o(t);
            return n[n.length - 1] || null;
        }
        var a;
        return (
            (DOMRect.prototype.Rn = function (t) {
                if (this === t) return DOMRect.fromRect(this);
                const n = Math.max(this.x, t.x),
                    e = Math.max(this.y, t.y),
                    i = Math.min(this.right, t.right),
                    s = Math.min(this.bottom, t.bottom);
                return new DOMRect(n, e, i - n, s - e);
            }),
            (a = window.requestAnimationFrame),
            (window.requestAnimationFrame = function (t) {
                const n = a(() => {
                    window.dispatchEvent(
                        new CustomEvent("dji.animationframe.begin", {
                            detail: {Tn: n},
                        }),
                    );
                    try {
                        t();
                    } finally {
                        window.dispatchEvent(
                            new CustomEvent("dji.animationframe.end", {
                                detail: {Tn: n},
                            }),
                        );
                    }
                });
                return n;
            }),
            (function (t) {
                CanvasRenderingContext2D.prototype.clearRect = function (...n) {
                    try {
                        !this.canvas.m && s && s.ri(this.canvas);
                        const t = this.canvas.m && this.canvas.m.clearRect;
                        t instanceof Function && t.apply(this, n);
                    } catch (t) {
                        console.error(t);
                    }
                    t.apply(this, n);
                };
            })(CanvasRenderingContext2D.prototype.clearRect),
            (function (t) {
                CanvasRenderingContext2D.prototype.fillRect = function (...n) {
                    try {
                        !this.canvas.m && s && s.ri(this.canvas);
                        const t = this.canvas.m && this.canvas.m.fillRect;
                        t instanceof Function && t.apply(this, n);
                    } catch (t) {
                        console.error(t);
                    }
                    t.apply(this, n);
                };
            })(CanvasRenderingContext2D.prototype.fillRect),
            (function (t) {
                CanvasRenderingContext2D.prototype.fillText = function (...n) {
                    try {
                        !this.canvas.m && s && s.ri(this.canvas);
                        const t = this.canvas.m && this.canvas.m.fillText;
                        t instanceof Function && t.apply(this, n);
                    } catch (t) {
                        console.error(t);
                    }
                    t.apply(this, n);
                };
            })(CanvasRenderingContext2D.prototype.fillText),
            (function (t) {
                CanvasRenderingContext2D.prototype.drawImage = function (...n) {
                    try {
                        !this.canvas.m && s && s.ri(this.canvas);
                        const t = this.canvas.m && this.canvas.m.drawImage;
                        t instanceof Function && t.apply(this, n);
                    } catch (t) {
                        console.error(t);
                    }
                    t.apply(this, n);
                };
            })(CanvasRenderingContext2D.prototype.drawImage),
            (function (t) {
                CanvasRenderingContext2D.prototype.beginPath = function (...n) {
                    try {
                        !(function (t) {
                            const n = r(t);
                            n && (n.path = []);
                        })(this);
                    } catch (t) {
                        console.error(t);
                    }
                    t.apply(this, n);
                };
            })(CanvasRenderingContext2D.prototype.beginPath),
            (function (t) {
                CanvasRenderingContext2D.prototype.rect = function (...n) {
                    try {
                        !(function (t, n, e, i, s) {
                            const o = r(t);
                            o && o.path && o.path.push(new DOMRect(n, e, i, s));
                        })(this, ...n);
                    } catch (t) {
                        console.error(t);
                    }
                    t.apply(this, n);
                };
            })(CanvasRenderingContext2D.prototype.rect),
            (function (t) {
                CanvasRenderingContext2D.prototype.clip = function (...n) {
                    try {
                        !(function (t) {
                            const n = r(t);
                            if (n && n.path) {
                                let t = n.Bn || n.path[0] || null;
                                t &&
                                    (n.path.forEach((n) => {
                                        t = t.Rn(n);
                                    }),
                                    (n.Bn = t)),
                                    (n.path = null);
                            }
                            n && n.Bn;
                        })(this);
                    } catch (t) {
                        console.error(t);
                    }
                    t.apply(this, n);
                };
            })(CanvasRenderingContext2D.prototype.clip),
            (function (t) {
                CanvasRenderingContext2D.prototype.save = function (...n) {
                    try {
                        !(function (t) {
                            const n = o(t, !0),
                                e = n[n.length - 1] || null,
                                i = {Bn: (e && e.Bn) || null, path: null};
                            n.push(i);
                        })(this);
                    } catch (t) {
                        console.error(t);
                    }
                    t.apply(this, n);
                };
            })(CanvasRenderingContext2D.prototype.save),
            (function (t) {
                CanvasRenderingContext2D.prototype.restore = function (...n) {
                    try {
                        !(function (t) {
                            const n = o(t);
                            n && n.pop();
                        })(this);
                    } catch (t) {
                        console.error(t);
                    }
                    t.apply(this, n);
                };
            })(CanvasRenderingContext2D.prototype.restore),
            (s = I.inject(e, [])),
            e
        );
    }
    !(function () {
        const t = S(document.currentScript.dataset.extensionId);
        document.currentScript.dataset.projTagName = t;
    })();
})();
