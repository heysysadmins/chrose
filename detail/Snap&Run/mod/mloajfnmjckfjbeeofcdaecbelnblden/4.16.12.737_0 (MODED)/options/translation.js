window.sru = window.sru || {};
(function (r) {
    function v() {
        if (!d) return !1;
        d.enableTranslation()
            ? (p.addClass("dji-sru-on"),
              e.removeAttr("disabled"),
              h.removeAttr("disabled"))
            : (p.removeClass("dji-sru-on"),
              e.attr("disabled", !0),
              h.attr("disabled", !0));
        let a = d.translationLanguage();
        t(a.name, a.abbr);
        w(function (c) {
            let k = $("div[dji-sru-template-id=dji-sru-translation-language]");
            for (let b = 0; b < c.length; b++) {
                let f = $(
                        dji.templates.clone(
                            "dji-sru-translation-language-item",
                        ),
                    ),
                    g = c[b];
                f.attr("dji-sru-value", g.language);
                f.find(".dji-sru-menu-item-text").text(g.name);
                a.abbr === c[b].language && f.attr("dji-check", "");
                k.append(f);
            }
            h.find(".dji-sru-option-item-value").text(a.name ? a.name : "");
        });
        return !0;
    }
    function w(a) {
        u.languages(function (c) {
            !c || c.error
                ? a([{language: "en", name: "English"}])
                : a(JSON.parse(c));
        });
    }
    function t(a, c) {
        let k = $("div[dji-sru-template-id=dji-sru-translation-voices]");
        k.empty();
        if ("english" === a.trim().toLowerCase())
            e.attr("disabled", "true"),
                e.find(".dji-sru-option-item-value").text("No voice"),
                d.translationVoice(d.speechVoice());
        else if (((c = n ? n.voicesForLanguage(c, !0) : []), 0 === c.length))
            e.attr("disabled", "true"),
                e
                    .find(".dji-sru-option-item-value")
                    .text("No " + a + " Voice Installed"),
                d.translationVoice("No Voice");
        else {
            d.enableTranslation()
                ? e.removeAttr("disabled")
                : e.attr("disabled", "true");
            a = d.translationVoice().trim();
            var b = !1,
                f;
            for (let g = 0; g < c.length; g++) {
                let l = $(dji.templates.clone("dji-sru-voice")),
                    q = c[g].voiceName.trim();
                l.attr("dji-sru-value", q);
                l.find(".dji-sru-menu-item-text").text(q);
                f || (f = q);
                k.append(l);
                a.toLowerCase() === q.toLowerCase() &&
                    (l.attr("dji-check", ""), (b = !0));
            }
            b ||
                ((a = f || ""),
                k.find("[dji-sru-value='" + a + "']").attr("dji-check", ""));
            e.find(".dji-sru-option-item-value").text(a);
            d.translationVoice(a);
        }
    }
    let d = null,
        n = null,
        u = null,
        e = $("#dji-sru-translate-voice"),
        h = $("#dji-sru-translate"),
        p = $("#dji-sru-enable-translation");
    const m = {activate: [], deactivate: [], intoChanged: [], voiceChanged: []};
    r.initialize = function (a, c, k) {
        d = a;
        n = c;
        u = k;
        e = $("#dji-sru-translate-voice");
        h = $("#dji-sru-translate");
        p = $("#dji-sru-enable-translation");
        v() &&
            (p.on("change", function (b) {
                b = b.checked;
                d.enableTranslation(b ? 1 : 0);
                b
                    ? ((b = d.translationLanguage().name),
                      h.removeAttr("disabled"),
                      "english" === b.trim().toLowerCase()
                          ? e.attr("disabled")
                          : e.removeAttr("disabled", !0),
                      dji.utils.callListeners(m, "activate"))
                    : (e.attr("disabled", !0),
                      h.attr("disabled", !0),
                      dji.utils.callListeners(m, "deactivate"));
            }),
            h.on("change", function (b) {
                let f = b.text,
                    g = b.value;
                t(f, g);
                let l = $("[dji-sru-template-id=dji-sru-translation-language]");
                l.find("[dji-check]").removeAttr("dji-check");
                l.find("[dji-sru-value=" + b.value + "]").attr("dji-check", "");
                d.translationLanguage({name: f, abbr: g});
                n.settings(d.translation());
                dji.utils.callListeners(m, "intoChanged");
            }),
            e.on("change", function (b) {
                d.translationVoice(b.text);
                n.settings(d.translation());
                let f = $("[dji-sru-template-id=dji-sru-translation-voices]");
                f.find("[dji-check]").removeAttr("dji-check");
                f.find("[dji-sru-value='" + b.value + "']").attr(
                    "dji-check",
                    "",
                );
                dji.utils.callListeners(m, "voiceChanged");
            }));
    };
    r.addEventListener = function (a, c) {
        m.hasOwnProperty(a) &&
            "function" == typeof c &&
            -1 == m[a].indexOf(c) &&
            m[a].push(c);
    };
})((window.sru.translationOptions = window.sru.translationOptions || {}));
