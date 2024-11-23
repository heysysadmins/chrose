(function () {
    try {
        const e = document.head || document.documentElement,
            b = [
                "libs/core-lib-gdocs-canvas.js",
                "libs/google-docs-integration.js",
            ];
        let c = -1;
        const k = (g) => {
            const h = chrome.runtime.getURL(g),
                d = document.createElement("link");
            d.rel = "preload";
            d.href = h;
            d.as = "script";
            e.prepend(d);
            const a = document.createElement("script");
            a.dataset.extensionId = chrome.runtime.id;
            a.onload = () => {
                try {
                    delete a.dataset.extensionId;
                    if ("libs/core-lib-gdocs-canvas.js" === g) {
                        const f = a.dataset.projTagName;
                        window.dji = window.dji || {};
                        window.dji.gdocsCanvasProjectionTagName = f;
                    }
                    ++c < b.length && k(b[c]);
                } catch (f) {
                    console.error(f);
                }
            };
            a.src = h;
            e.prepend(a);
        };
        ++c < b.length && k(b[c]);
    } catch (e) {}
})();
