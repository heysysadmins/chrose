(function () {
    async function h() {
        try {
            let a = chrome.extension.getURL(
                    "contentScripts/pdfPopupChoice.html",
                ),
                b = await fetch(a);
            b = await b.text();
            let c = document.createRange().createContextualFragment(b);
            if (c) return c.querySelector("dji-sru-pdf-choice-popup");
        } catch (a) {}
    }
    function d() {
        document
            .getElementById("dji-sru-open-pdf-with-sru")
            .removeEventListener("click", e);
        document
            .getElementById("dji-sru-open-pdf-dismiss")
            .removeEventListener("click", f);
        document.querySelector("dji-sru-pdf-choice-popup").remove();
    }
    function e(a) {
        a.stopPropagation();
        a.preventDefault();
        chrome.runtime.sendMessage(
            {message: "com.donjohnston.sru.pdf.autoOpen", params: {state: !0}},
            function (b) {
                dji.utils.ignoreLastError();
                d();
            },
        );
    }
    function f(a) {
        a.stopPropagation();
        a.preventDefault();
        chrome.runtime.sendMessage(
            {message: "com.donjohnston.sru.pdf.autoOpen", params: {state: !1}},
            function (b) {
                dji.utils.ignoreLastError();
                d();
            },
        );
    }
    async function g() {
        if (!document.querySelector("dji-sru-pdf-choice-popup")) {
            var a = await h();
            a &&
                (document.body.appendChild(a),
                document
                    .getElementById("dji-sru-open-pdf-with-sru")
                    .addEventListener("click", e),
                document
                    .getElementById("dji-sru-open-pdf-dismiss")
                    .addEventListener("click", f));
        }
    }
    "interactive" === document.readyState || "complete" === document.readyState
        ? g()
        : (document.onreadystatechange = function () {
              ("interactive" !== document.readyState &&
                  "complete" !== document.readyState) ||
                  g();
          });
})();
