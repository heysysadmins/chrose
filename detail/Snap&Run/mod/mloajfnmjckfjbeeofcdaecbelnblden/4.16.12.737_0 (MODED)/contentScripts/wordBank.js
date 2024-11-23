window.dji = window.dji || {};
window.dji.sru = window.dji.sru || {};
(function (h) {
    h.getWordBankData = async function (k) {
        try {
            const d = document.baseURI;
            if (document) {
                var e = "",
                    f = document.querySelectorAll("title");
                for (let a = 0; a < f.length; a++)
                    try {
                        if (((e = (f[a].innerText || "").trim()), 0 < e.length))
                            break;
                    } catch (l) {}
                var c = e;
            } else c = "";
            let g = await k(),
                b = g && g.text.trim();
            !b &&
                dji.utils.isSruPwaApp() &&
                (b = sru.helpers.pdfViewer.textInfo(!1).text.trim());
            if (!b) {
                let a = await dji.readability.readAsync(document, {
                    onlyArticleBody: !0,
                });
                (b =
                    (a &&
                        a.article &&
                        a.article.formattedText &&
                        a.article.formattedText.trim()) ||
                    null) && (c = a.article.title || c);
            }
            return {success: !!b, title: c, url: d, text: b};
        } catch (d) {
            return dji.logger.error(d), {success: !1};
        }
    };
})((window.dji.sru.wb = window.dji.sru.wb || {}));
