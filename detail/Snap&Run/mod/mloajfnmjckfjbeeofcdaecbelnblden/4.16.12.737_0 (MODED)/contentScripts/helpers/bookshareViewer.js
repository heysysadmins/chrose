window.sru = window.sru || {};
window.sru.helpers = window.sru.helpers || {};
(function (c) {
    function e(b) {
        var d = function () {
            (a = document.body.querySelector(
                "iframe#readium-scrolling-content",
            ))
                ? b()
                : setTimeout(d, 1e3);
        };
        d();
    }
    var a = null;
    c.initialize = function (b) {
        a ||
            window.dji.utils.waitForDocumentToLoad(document, function () {
                e(function () {
                    a &&
                        a.contentDocument &&
                        window.dji.utils.waitForDocumentToLoad(
                            a.contentDocument,
                            function () {
                                window.dji.utils.addClassToElement(
                                    document.documentElement,
                                    "dji-sru-no-layout-alteration",
                                );
                                window.dji.utils.callMethod(b);
                            },
                        );
                });
            });
    };
    c.text = function () {
        return a
            ? window.dji.utils.extractVisibleTextFromElement(
                  a.contentDocument.body,
              )
            : "";
    };
})((window.sru.helpers.bookshare = window.sru.helpers.bookshare || {}));
