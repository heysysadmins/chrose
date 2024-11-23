window.jsdapi = window.jsdapi || {};
(function (p) {
    function t(a, c) {
        window.jsdapi.authorize(function (d) {
            if (!d) return g(c, {errorCode: 401});
            d = {
                responseType: "json",
                method: "GET",
                url: u(a, "manifest.json"),
                query: {validator: q.dapi, access_token: d},
            };
            window.jsdapi.http.sendRequest(d, function (b, e, h) {
                if (!b || b.errorCode) return g(c, {errorCode: 500});
                g(c, null, b);
            });
        });
    }
    function x(a, c, d, b, e) {
        t(a, function (h, f) {
            if (h || !f || f.errorCode) return g(e, h || {errorCode: 500});
            h = f.hasOwnProperty(c) ? f[c] || void 0 : void 0;
            let l = void 0;
            if (h && h instanceof Array)
                for (let k = 0; k < h.length; k++)
                    if (h[k][d] === b) {
                        l = h[k];
                        break;
                    }
            if (!l) return g(e, {errorCode: 404});
            let n = `${a}/${l.location}`;
            t(n, function (k, m) {
                if (k || !m || m.errorCode) return g(e, {errorCode: 500});
                m.location = n;
                g(e, null, m, l, f);
            });
        });
    }
    function D(a, c, d, b, e, h, f, l) {
        x(a, c, d, b, function (n, k, m, r) {
            if (n || !k || !k.files || !m || !r)
                return g(l, n || {errorCode: 500});
            let y = JSON.stringify(r),
                E = CryptoJS.MD5(y).toString(),
                F = `${e}/manifest.json`,
                G = `${e}/checksum`,
                z = JSON.stringify(k),
                A = CryptoJS.MD5(z).toString(),
                w = B(e, m.location),
                H = `${w}/manifest.json`,
                C = `${w}/checksum`,
                N = function () {
                    I(k, w, h, f, function (v) {
                        if (v.errorCode) return g(l, v);
                        f.writeFile(H, z, function (J) {
                            if (!J) return g(l, {errorCode: 500});
                            f.writeFile(C, A, function (K) {
                                if (!K) return g(l, {errorCode: 500});
                                f.writeFile(F, y, function (L) {
                                    if (!L) return g(l, {errorCode: 500});
                                    f.writeFile(G, E, function (M) {
                                        return M
                                            ? g(l, {errorCode: 0})
                                            : g(l, {errorCode: 500});
                                    });
                                });
                            });
                        });
                    });
                };
            f.readFileAsText(C, function (v) {
                if (v === A) return g(l, {errorCode: 0});
                f.removeDirectory(e, N);
            });
        });
    }
    function I(a, c, d, b, e) {
        let h = {},
            f = [];
        for (let k = 0; k < a.files.length; k++) {
            let m = a.files[k].replace(/\\/g, "/").split("/");
            d.hasOwnProperty(m[0]) && (m[0] = d[m[0]]);
            let r = B(c, ...m.slice(0, m.length - 1));
            f.push({
                remote: `${a.location}/${a.files[k]}`,
                local: `${r}/${m[m.length - 1]}`,
            });
            h[r] = !0;
        }
        let l = -1,
            n = function (k) {
                if (k && k.errorCode) return g(e, k);
                if (f.length <= ++l) return g(e, {errorCode: 0});
                O(f[l].remote, f[l].local, b, n);
            };
        b.createDirectories(Object.keys(h), function () {
            n(void 0);
        });
    }
    function O(a, c, d, b) {
        window.jsdapi.authorize(function (e) {
            if (!e) return g(b, {errorCode: 401});
            e = {
                responseType: "binary",
                method: "GET",
                url: u(a),
                query: {validator: q.dapi, access_token: e},
            };
            window.jsdapi.http.sendRequest(e, function (h, f, l) {
                if (!h || 200 !== f) return g(b, {errorCode: 500});
                d.writeFile(c, h, function (n, k) {
                    if (!n) return g(b, {errorCode: 500});
                    g(b, {errorCode: 0, fileEntry: k});
                });
            });
        });
    }
    function u(...a) {
        let c = q.resources;
        if (0 < a.length) {
            let d = [];
            for (let b = 0; b < a.length; b++)
                a[b] && 0 < a[b].length && d.push(a[b]);
            d = d.join("/");
            c = 0 < d.length && "/" === d[0] ? c + d : c + ("/" + d);
        }
        return c;
    }
    function B(a) {
        return [...arguments].join("/");
    }
    function g(a) {
        if (a)
            try {
                a.apply(this, [].slice.call(arguments).splice(1));
            } catch (c) {
                Logger.instance.error(c);
            }
    }
    let q = {resources: void 0};
    p.setUrls = function (a) {
        q.dapi = a.dapi;
        q.resources = a.resources;
    };
    p.downloadManifest = t;
    p.downloadManifestAsync = async function (a) {
        let c = await window.jsdapi.authorizeAsync();
        c || (c = btoa(chrome.runtime.getURL("")));
        a = {
            responseType: "json",
            method: "GET",
            url: u(a, "manifest.json"),
            query: {validator: q.dapi, access_token: c},
        };
        a = await window.jsdapi.http.sendRequestAsync(a);
        if (200 !== a.status) throw ((a = Error()), (a.code = 500), a);
        return await a.json();
    };
    p.downloadResourceManifest = x;
    p.downloadCommonResourcesAsync = async function (a, c, d) {
        let b = await window.jsdapi.resources.downloadManifestAsync(a),
            e = JSON.stringify(b),
            h = CryptoJS.MD5(e).toString();
        if (
            !b.dataDefinition ||
            (await d.readFileAsTextAsync(`${c}/checksum`)) === h
        )
            return !1;
        await d.removeDirectoryAsync(c);
        await d.createDirectoryAsync(c);
        await d.writeFileAsTextAsync(`${c}/manifest.json`, e);
        await d.writeFileAsText(`${c}/checksum`, h);
        for (let f of b.dataDefinition.sensitiveWords.en)
            await window.jsdapi.resources.downloadResourceFileAsync(
                `${a}/${f}`,
                `${c}/${f}`,
                d,
            );
        for (let f of b.dataDefinition.sensitiveImages.en)
            await window.jsdapi.resources.downloadResourceFileAsync(
                `${a}/${f}`,
                `${c}/${f}`,
                d,
            );
        return !0;
    };
    p.listAvailableLanguages = function (a, c) {
        t(a, function (d, b) {
            if (d || !b || b.errorCode || !b.languages)
                return g(c, {errorCode: 500});
            g(c, b);
        });
    };
    p.downloadLanguageResources = function (a, c, d, b, e, h) {
        D(c, "languages", "language_code", a, d, b, e, h);
    };
    p.downloadResourceFileAsync = async function (a, c, d, b) {
        var e = await window.jsdapi.authorizeAsync();
        e || (e = btoa(chrome.runtime.getURL("")));
        e = {
            method: "GET",
            url: u(a),
            query: {validator: q.dapi, access_token: e},
        };
        a = await window.jsdapi.http.sendRequestAsync(e);
        if (200 !== a.status) throw Error(`Error downloading file ${e.url}`);
        e = a.blob;
        b &&
            (b = a.headers.get("content-type")) &&
            b.startsWith("text/plain") &&
            (e = a.text);
        b = await e.call(a);
        return d.writeFileAsync(c, b);
    };
})((window.jsdapi.resources = window.jsdapi.resources || {}));
