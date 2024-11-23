window.sru = window.sru || {};
(function (d) {
    let g = {};
    const h = ["en-US"],
        k = ["apa", "mla", "chicago-nb"],
        e = {MLA: "mla", APA: "apa", CHICAGO: "chicago-nb"};
    let f = {},
        l = {},
        m = {
            retrieveLocale: function (a) {
                return f.hasOwnProperty(a) ? f[a] : null;
            },
            retrieveItem: function (a) {
                return g[a];
            },
        };
    d.generateCition = function (a, b, c) {
        g = {id0: a};
        a = b;
        a = e.hasOwnProperty(a) ? e[a] : e.APA;
        c = new CSL.Engine(m, l[a], a, c);
        c.updateItems(["id0"]);
        return c.makeBibliography()[1][0];
    };
    d.initialize = async function () {
        for (var a = 0; a < h.length; a++) {
            var b = h[a];
            f[b] = await dji.utils.loadFile(
                `thirdParty/citeproc/locales-${b}.xml`,
            );
        }
        for (a = 0; a < k.length; a++)
            (b = k[a]),
                (l[b] = await dji.utils.loadFile(
                    `thirdParty/citeproc/${b}.csl`,
                ));
    };
    d.style = {APA: "APA", MLA: "MLA", CHICAGO: "CHICAGO"};
})((window.sru.citations = window.sru.citations || {}));
