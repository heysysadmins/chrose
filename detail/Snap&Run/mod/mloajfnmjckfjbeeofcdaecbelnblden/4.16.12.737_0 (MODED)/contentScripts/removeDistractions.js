window.sru = window.sru || {};
(function (f) {
    async function t() {
        try {
            let b = chrome.extension.getURL(
                    "contentScripts/removeDistractions.html",
                ),
                a = await fetch(b);
            a = await a.text();
            let d = document.createRange().createContextualFragment(a);
            if (d) return d.querySelector(".dji-sru-distractions-main");
        } catch (b) {
            dji.logger.error(b);
        }
    }
    function q(b) {
        sru.screenSelection.isActive() && sru.screenSelection.activate(!1);
        dji.rewordify.isActive() && dji.rewordify.deactivate();
        dji.translate.isActive() && dji.translate.activate(!1);
        sru.defineWord.isActive() && sru.defineWord.hide();
        b
            ? (g.classList.add("dji-visible"),
              dji.utils.addClassToHtmlElements("dji-sru-distractions-active"),
              document.documentElement.classList.add("dji-no-scroll"),
              c && c.classList.remove("dji-no-scroll"))
            : (document.documentElement.classList.remove("dji-no-scroll"),
              g.classList.remove("dji-visible"),
              dji.utils.removeClassFromHtmlElements(
                  "dji-sru-distractions-active",
              ),
              setTimeout(function () {
                  c.blur();
                  document.body.focus();
              }, 0));
    }
    function u() {
        let b = c.contentDocument.querySelectorAll("a");
        for (let a = 0; a < b.length; a++) {
            let d = b[a],
                r = d.href;
            r &&
                (r.startsWith("#")
                    ? d.setAttribute("target", "_self")
                    : d.setAttribute("target", "_blank"));
        }
    }
    function v() {
        dji.readability.read(
            window.document,
            {onlyArticleBody: !1},
            function (b, a, d) {
                a.content
                    ? k &&
                      ((k.innerHTML = a.content),
                      a.title || a.author
                          ? dji.utils.addClassToElement(m, "dji-visible")
                          : dji.utils.removeClassFromElement(m, "dji-visible"),
                      a.title && (n.innerHTML = a.title),
                      a.author && (p.innerHTML = a.author),
                      u(),
                      q(!0),
                      setTimeout(function () {
                          c.focus();
                      }))
                    : (DjiSruToast.show(
                          "Can't remove distractions. No article found.",
                          {closeOnClick: !0},
                          5e3,
                      ),
                      f.activate(!1));
            },
        );
    }
    function w(b) {
        dji.utils.addMultipleCssToDocument(
            b,
            "common/ui/effects.css contentScripts/mainContainer.css contentScripts/toolbar.css contentScripts/screenSelection.css contentScripts/speech.css contentScripts/defineWord.css contentScripts/removeDistractions.css contentScripts/overlay.css contentScripts/cursors.css".split(
                " ",
            ),
        );
        dji.rewordify.injectStyleInDocument(b);
    }
    let g = null,
        c = null,
        h = !1,
        k = null,
        m = null,
        p = null,
        n = null,
        e = null,
        l = {activate: [], removeDistractions: [], analytics: []};
    f.initialize = async function () {
        g = document.createElement("dji-sru-distraction");
        let b = g.attachShadow({mode: "open"}),
            a = document.createElement("style");
        a.innerHTML = await dji.utils.loadFile(
            "contentScripts/removeDistractions.css",
        );
        b.appendChild(a);
        c = document.createElement("iframe");
        c.id = "dji-sru-remove-distractions-iframe";
        c.classList.add("dji-sru-remove-distractions-iframe");
        b.appendChild(c);
        document.body.appendChild(g);
        if ((e = await t()))
            c.contentDocument.documentElement.setAttribute(
                "dji-theme",
                "light",
            ),
                c.contentDocument.documentElement.setAttribute(
                    "dji-sru-remove-distractions",
                    "true",
                ),
                c.contentDocument.body.appendChild(e),
                e.querySelector(".dji-sru-distractions-menu"),
                (k = e.querySelector(".dji-sru-distractions-content")),
                (m = e.querySelector(".dji-sru-distractions-header")),
                (p = e.querySelector(".dji-sru-distractions-author")),
                (n = e.querySelector(".dji-sru-distractions-title")),
                w(c.contentDocument);
        c.contentWindow.addEventListener("focus", function () {
            b.activeElement !== c && c.contentDocument.body.focus();
        });
    };
    f.activate = function () {
        h = !h;
        dji.utils.callListeners(l, "analytics", h);
        h
            ? v()
            : ((k.innerHTML = ""),
              (p.innerHTML = ""),
              (n.innerHTML = ""),
              q(!1));
    };
    f.active = function () {
        return h;
    };
    f.addEventListener = function (b, a) {
        l.hasOwnProperty(b) &&
            "function" == typeof a &&
            -1 == l[b].indexOf(a) &&
            l[b].push(a);
    };
    f.removeDistractionsDocument = function () {
        return c.contentDocument;
    };
})((window.sru.removeDistractions = window.sru.removeDistractions || {}));
