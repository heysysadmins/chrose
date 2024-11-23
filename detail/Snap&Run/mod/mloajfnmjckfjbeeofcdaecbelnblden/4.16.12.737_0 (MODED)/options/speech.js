window.sru = window.sru || {};
(function (y) {
    function z() {
        if (!d) return !1;
        var a = d.speechVoice();
        let f = !1,
            c;
        var b = e ? e.voices() : [];
        let g = A(b),
            t = $("div[dji-sru-template-id=dji-sru-voices]");
        for (let n = 0; n < g.languages.length; n++) {
            b = $(dji.templates.clone("dji-sru-voice-group"));
            b.find("[dji-prediction-voice-group]").text(g.languages[n]);
            t.append(b);
            b = g.voicesPerLanguage[g.languages[n]];
            for (let m = 0; m < b.length; m++) {
                let p = $(dji.templates.clone("dji-sru-voice"));
                p.attr("dji-sru-value", b[m].voiceName);
                p.find(".dji-sru-menu-item-text").text(b[m].voiceName);
                c || (c = b[m].voiceName);
                t.append(p);
                a === b[m].voiceName && (p.attr("dji-check", ""), (f = !0));
            }
        }
        f ||
            ((a = c || ""),
            t.find("[dji-sru-value='" + a + "']").attr("dji-check", ""));
        u.find(".dji-sru-option-item-value").text(a);
        k.val(d.speechVolume());
        v();
        l.val(d.speechRate());
        w();
        h.val(d.speechPitch());
        x();
        a = e.voiceSupportsSettings(a);
        l.prop("disabled", !a.rate);
        h.prop("disabled", !a.pitch);
        k.prop("disabled", !a.volume);
        a.pitch || h.val(100).trigger({type: "change", noSpeak: !0});
        d.speechAuto() ? q.addClass("dji-sru-on") : q.removeClass("dji-sru-on");
        return !0;
    }
    function v(a) {
        a = void 0 === a ? parseInt(k.val()) : a;
        a = `${a}%`;
        k.closest(".dji-sru-option-slider-item")
            .find(".dji-sru-slider-value")
            .text(a);
    }
    function w(a) {
        a = void 0 === a ? parseInt(l.val()) : a;
        a = Math.ceil(a / 10) - 10;
        a = 0 === a ? "default" : 0 < a ? "+" + a : "" + a;
        l.closest(".dji-sru-option-slider-item")
            .find(".dji-sru-slider-value")
            .text(a);
    }
    function x(a) {
        a = void 0 === a ? parseInt(h.val()) : a;
        a = Math.ceil(a / 10) - 10;
        a = 0 === a ? "default" : 0 < a ? "+" + a : "" + a;
        h.closest(".dji-sru-option-slider-item")
            .find(".dji-sru-slider-value")
            .text(a);
    }
    function r() {
        e.settings(d.speech());
        e.isOnlineVoice(d.speech().voice)
            ? e.scheduleSpeak(
                  "Welcome to the Snap & Read extension, this voice requires an internet connection.",
                  !0,
                  200,
              )
            : e.scheduleSpeak(
                  "Welcome to the Snap & Read extension. You can change the pitch, rate, and volume of speech using the sliders below.",
                  !0,
                  200,
              );
    }
    function A(a) {
        let f = {};
        for (let c = 0; c < a.length; c++) {
            let b = "Unknown";
            a[c].lang &&
                (b =
                    B(a[c].lang.substr(0, 2)) +
                    " - " +
                    (a[c].gender || "other"));
            f[b] || (f[b] = []);
            f[b].push(a[c]);
        }
        a = Object.keys(f);
        a.sort(function (c, b) {
            return 0 <= c.indexOf("English") && 0 > b.indexOf("English")
                ? -1
                : (0 > c.indexOf("English") && 0 <= b.indexOf("English")) ||
                    (0 <= c.indexOf("Unknown") && 0 > b.indexOf("Unknown"))
                  ? 1
                  : 0 > c.indexOf("Unknown") && 0 <= b.indexOf("Unknown")
                    ? -1
                    : c < b
                      ? -1
                      : c > b
                        ? 1
                        : 0;
        });
        for (let c in f) f.hasOwnProperty(c) && f[c].sort();
        return {languages: a, voicesPerLanguage: f};
    }
    function B(a) {
        a = a.slice(0, 2);
        return (a = C[a]) ? a.name : void 0;
    }
    let d = null,
        e = null,
        u = $("#dji-sru-voices"),
        l = $("#dji-sru-speak-rate"),
        h = $("#dji-sru-speak-pitch"),
        k = $("#dji-sru-speak-volume"),
        q = $("#dji-sru-auto-speak");
    y.initialize = function (a, f) {
        d = a;
        e = f;
        u = $("#dji-sru-voices");
        l = $("#dji-sru-speak-rate");
        h = $("#dji-sru-speak-pitch");
        k = $("#dji-sru-speak-volume");
        q = $("#dji-sru-auto-speak");
        u.on("change", function (c) {
            var b = c.value;
            if (b !== d.speechVoice()) {
                var g = e.voiceSupportsSettings(b);
                e.stop();
                d.speechVoice(b);
                l.prop("disabled", !g.rate);
                h.prop("disabled", !g.pitch);
                k.prop("disabled", !g.volume);
                g.pitch || h.val(100).trigger({type: "change", noSpeak: !0});
                b = $("[dji-sru-template-id=dji-sru-voices]");
                b.find("[dji-check]").removeAttr("dji-check");
                b.find("[dji-sru-value='" + c.value + "']").attr(
                    "dji-check",
                    "",
                );
                r();
            }
        });
        k.on("input change", function (c) {
            let b = parseInt(c.currentTarget.value);
            d.speechVolume() !== b &&
                (e.stop(),
                d.speechVolume(b),
                v(b),
                (c.hasOwnProperty("noSpeak") && !1 !== c.noSpeak) || r());
        });
        l.on("input change", function (c) {
            let b = parseInt(c.currentTarget.value);
            d.speechRate() !== b &&
                (e.stop(),
                d.speechRate(b),
                w(b),
                (c.hasOwnProperty("noSpeak") && !1 !== c.noSpeak) || r());
        });
        h.on("input change", function (c) {
            let b = parseInt(c.currentTarget.value);
            d.speechPitch() !== b &&
                (e.stop(),
                d.speechPitch(b),
                x(),
                (c.hasOwnProperty("noSpeak") && !1 !== c.noSpeak) || r());
        });
        q.on("change", function (c) {
            c = c.checked;
            e.stop();
            d.speechAuto(c ? 1 : 0);
        });
        z();
    };
    let C = {
        ab: {
            name: "Abkhaz",
            nativeName:
                "\u00d0\u00b0\u00d2\u00a7\u00d1\u0081\u00d1\u0192\u00d0\u00b0",
        },
        aa: {name: "Afar", nativeName: "Afaraf"},
        af: {name: "Afrikaans", nativeName: "Afrikaans"},
        ak: {name: "Akan", nativeName: "Akan"},
        sq: {name: "Albanian", nativeName: "Shqip"},
        am: {
            name: "Amharic",
            nativeName:
                "\u00e1\u0160 \u00e1\u02c6\u203a\u00e1\u02c6\u00ad\u00e1\u0160\u203a",
        },
        ar: {
            name: "Arabic",
            nativeName:
                "\u00d8\u00a7\u00d9\u201e\u00d8\u00b9\u00d8\u00b1\u00d8\u00a8\u00d9\u0160\u00d8\u00a9",
        },
        an: {name: "Aragonese", nativeName: "Aragon\u00c3\u00a9s"},
        hy: {
            name: "Armenian",
            nativeName:
                "\u00d5\u20ac\u00d5\u00a1\u00d5\u00b5\u00d5\u00a5\u00d6\u20ac\u00d5\u00a5\u00d5\u00b6",
        },
        as: {
            name: "Assamese",
            nativeName:
                "\u00e0\u00a6\u2026\u00e0\u00a6\u00b8\u00e0\u00a6\u00ae\u00e0\u00a7\u20ac\u00e0\u00a6\u00af\u00e0\u00a6\u00bc\u00e0\u00a6\u00be",
        },
        av: {
            name: "Avaric",
            nativeName:
                "\u00d0\u00b0\u00d0\u00b2\u00d0\u00b0\u00d1\u20ac \u00d0\u00bc\u00d0\u00b0\u00d1\u2020\u00d3\u20ac, \u00d0\u00bc\u00d0\u00b0\u00d0\u00b3\u00d3\u20ac\u00d0\u00b0\u00d1\u20ac\u00d1\u0192\u00d0\u00bb \u00d0\u00bc\u00d0\u00b0\u00d1\u2020\u00d3\u20ac",
        },
        ae: {name: "Avestan", nativeName: "avesta"},
        ay: {name: "Aymara", nativeName: "aymar aru"},
        az: {name: "Azerbaijani", nativeName: "az\u00c9\u2122rbaycan dili"},
        bm: {name: "Bambara", nativeName: "bamanankan"},
        ba: {
            name: "Bashkir",
            nativeName:
                "\u00d0\u00b1\u00d0\u00b0\u00d1\u02c6\u00d2\u00a1\u00d0\u00be\u00d1\u20ac\u00d1\u201a \u00d1\u201a\u00d0\u00b5\u00d0\u00bb\u00d0\u00b5",
        },
        eu: {name: "Basque", nativeName: "euskara, euskera"},
        be: {
            name: "Belarusian",
            nativeName:
                "\u00d0\u2018\u00d0\u00b5\u00d0\u00bb\u00d0\u00b0\u00d1\u20ac\u00d1\u0192\u00d1\u0081\u00d0\u00ba\u00d0\u00b0\u00d1\u008f",
        },
        bn: {
            name: "Bengali",
            nativeName:
                "\u00e0\u00a6\u00ac\u00e0\u00a6\u00be\u00e0\u00a6\u201a\u00e0\u00a6\u00b2\u00e0\u00a6\u00be",
        },
        bh: {
            name: "Bihari",
            nativeName:
                "\u00e0\u00a4\u00ad\u00e0\u00a5\u2039\u00e0\u00a4\u0153\u00e0\u00a4\u00aa\u00e0\u00a5\u0081\u00e0\u00a4\u00b0\u00e0\u00a5\u20ac",
        },
        bi: {name: "Bislama", nativeName: "Bislama"},
        bs: {name: "Bosnian", nativeName: "bosanski jezik"},
        br: {name: "Breton", nativeName: "brezhoneg"},
        bg: {
            name: "Bulgarian",
            nativeName:
                "\u00d0\u00b1\u00d1\u0160\u00d0\u00bb\u00d0\u00b3\u00d0\u00b0\u00d1\u20ac\u00d1\u0081\u00d0\u00ba\u00d0\u00b8 \u00d0\u00b5\u00d0\u00b7\u00d0\u00b8\u00d0\u00ba",
        },
        my: {
            name: "Burmese",
            nativeName:
                "\u00e1\u20ac\u2014\u00e1\u20ac\u2122\u00e1\u20ac\u00ac\u00e1\u20ac\u2026\u00e1\u20ac\u00ac",
        },
        ca: {name: "Catalan; Valencian", nativeName: "Catal\u00c3 "},
        ch: {name: "Chamorro", nativeName: "Chamoru"},
        ce: {
            name: "Chechen",
            nativeName:
                "\u00d0\u00bd\u00d0\u00be\u00d1\u2026\u00d1\u2021\u00d0\u00b8\u00d0\u00b9\u00d0\u00bd \u00d0\u00bc\u00d0\u00be\u00d1\u201a\u00d1\u201a",
        },
        ny: {
            name: "Chichewa; Chewa; Nyanja",
            nativeName: "chiChe\u00c5\u00b5a, chinyanja",
        },
        zh: {
            name: "Chinese",
            nativeName:
                "\u00e4\u00b8\u00ad\u00e6\u2013\u2021 (Zh\u00c5\u008dngw\u00c3\u00a9n), \u00e6\u00b1\u2030\u00e8\u00af\u00ad, \u00e6\u00bc\u00a2\u00e8\u00aa\u017e",
        },
        cv: {
            name: "Chuvash",
            nativeName:
                "\u00d1\u2021\u00d3\u2018\u00d0\u00b2\u00d0\u00b0\u00d1\u02c6 \u00d1\u2021\u00d3\u2014\u00d0\u00bb\u00d1\u2026\u00d0\u00b8",
        },
        kw: {name: "Cornish", nativeName: "Kernewek"},
        co: {name: "Corsican", nativeName: "corsu, lingua corsa"},
        cr: {
            name: "Cree",
            nativeName:
                "\u00e1\u201c\u20ac\u00e1\u0090\u00a6\u00e1\u0090\u0192\u00e1\u201d\u00ad\u00e1\u0090\u008d\u00e1\u0090\u008f\u00e1\u0090\u00a3",
        },
        hr: {name: "Croatian", nativeName: "hrvatski"},
        cs: {
            name: "Czech",
            nativeName: "\u00c4\u008desky, \u00c4\u008de\u00c5\u00a1tina",
        },
        da: {name: "Danish", nativeName: "dansk"},
        dv: {
            name: "Divehi; Dhivehi; Maldivian;",
            nativeName:
                "\u00de\u2039\u00de\u00a8\u00de\u02c6\u00de\u00ac\u00de\u20ac\u00de\u00a8",
        },
        nl: {name: "Dutch", nativeName: "Nederlands, Vlaams"},
        en: {name: "English", nativeName: "English"},
        eo: {name: "Esperanto", nativeName: "Esperanto"},
        et: {name: "Estonian", nativeName: "eesti, eesti keel"},
        ee: {name: "Ewe", nativeName: "E\u00ca\u2039egbe"},
        fo: {name: "Faroese", nativeName: "f\u00c3\u00b8royskt"},
        fj: {name: "Fijian", nativeName: "vosa Vakaviti"},
        fi: {name: "Finnish", nativeName: "suomi, suomen kieli"},
        fr: {
            name: "French",
            nativeName: "fran\u00c3\u00a7ais, langue fran\u00c3\u00a7aise",
        },
        ff: {
            name: "Fula; Fulah; Pulaar; Pular",
            nativeName: "Fulfulde, Pulaar, Pular",
        },
        gl: {name: "Galician", nativeName: "Galego"},
        ka: {
            name: "Georgian",
            nativeName:
                "\u00e1\u0192\u00a5\u00e1\u0192\u0090\u00e1\u0192 \u00e1\u0192\u2014\u00e1\u0192\u00a3\u00e1\u0192\u0161\u00e1\u0192\u02dc",
        },
        de: {name: "German", nativeName: "Deutsch"},
        el: {
            name: "Greek, Modern",
            nativeName:
                "\u00ce\u2022\u00ce\u00bb\u00ce\u00bb\u00ce\u00b7\u00ce\u00bd\u00ce\u00b9\u00ce\u00ba\u00ce\u00ac",
        },
        gn: {
            name: "Guaran\u00c3\u00ad",
            nativeName: "Ava\u00c3\u00b1e\u00e1\u00ba\u00bd",
        },
        gu: {
            name: "Gujarati",
            nativeName:
                "\u00e0\u00aa\u2014\u00e0\u00ab\u0081\u00e0\u00aa\u0153\u00e0\u00aa\u00b0\u00e0\u00aa\u00be\u00e0\u00aa\u00a4\u00e0\u00ab\u20ac",
        },
        ht: {
            name: "Haitian; Haitian Creole",
            nativeName: "Krey\u00c3\u00b2l ayisyen",
        },
        ha: {
            name: "Hausa",
            nativeName:
                "Hausa, \u00d9\u2021\u00d9\u017d\u00d9\u02c6\u00d9\u008f\u00d8\u00b3\u00d9\u017d",
        },
        he: {
            name: "Hebrew (modern)",
            nativeName:
                "\u00d7\u00a2\u00d7\u2018\u00d7\u00a8\u00d7\u2122\u00d7\u00aa",
        },
        hz: {name: "Herero", nativeName: "Otjiherero"},
        hi: {
            name: "Hindi",
            nativeName:
                "\u00e0\u00a4\u00b9\u00e0\u00a4\u00bf\u00e0\u00a4\u00a8\u00e0\u00a5\u008d\u00e0\u00a4\u00a6\u00e0\u00a5\u20ac, \u00e0\u00a4\u00b9\u00e0\u00a4\u00bf\u00e0\u00a4\u201a\u00e0\u00a4\u00a6\u00e0\u00a5\u20ac",
        },
        ho: {name: "Hiri Motu", nativeName: "Hiri Motu"},
        hu: {name: "Hungarian", nativeName: "Magyar"},
        ia: {name: "Interlingua", nativeName: "Interlingua"},
        id: {name: "Indonesian", nativeName: "Bahasa Indonesia"},
        ie: {
            name: "Interlingue",
            nativeName:
                "Originally called Occidental; then Interlingue after WWII",
        },
        ga: {name: "Irish", nativeName: "Gaeilge"},
        ig: {
            name: "Igbo",
            nativeName: "As\u00e1\u00bb\u00a5s\u00e1\u00bb\u00a5 Igbo",
        },
        ik: {
            name: "Inupiaq",
            nativeName: "I\u00c3\u00b1upiaq, I\u00c3\u00b1upiatun",
        },
        io: {name: "Ido", nativeName: "Ido"},
        is: {name: "Icelandic", nativeName: "\u00c3\u008dslenska"},
        it: {name: "Italian", nativeName: "Italiano"},
        iu: {
            name: "Inuktitut",
            nativeName:
                "\u00e1\u0090\u0192\u00e1\u201c\u201e\u00e1\u2019\u0192\u00e1\u2018\u017d\u00e1\u2018\u0090\u00e1\u2018\u00a6",
        },
        ja: {
            name: "Japanese",
            nativeName:
                "\u00e6\u2014\u00a5\u00e6\u0153\u00ac\u00e8\u00aa\u017e (\u00e3\u0081\u00ab\u00e3\u0081\u00bb\u00e3\u201a\u201c\u00e3\u0081\u201d\u00ef\u00bc\u008f\u00e3\u0081\u00ab\u00e3\u0081\u00a3\u00e3\u0081\u00bd\u00e3\u201a\u201c\u00e3\u0081\u201d)",
        },
        jv: {name: "Javanese", nativeName: "basa Jawa"},
        kl: {
            name: "Kalaallisut, Greenlandic",
            nativeName: "kalaallisut, kalaallit oqaasii",
        },
        kn: {
            name: "Kannada",
            nativeName:
                "\u00e0\u00b2\u2022\u00e0\u00b2\u00a8\u00e0\u00b3\u008d\u00e0\u00b2\u00a8\u00e0\u00b2\u00a1",
        },
        kr: {name: "Kanuri", nativeName: "Kanuri"},
        ks: {
            name: "Kashmiri",
            nativeName:
                "\u00e0\u00a4\u2022\u00e0\u00a4\u00b6\u00e0\u00a5\u008d\u00e0\u00a4\u00ae\u00e0\u00a5\u20ac\u00e0\u00a4\u00b0\u00e0\u00a5\u20ac, \u00d9\u0192\u00d8\u00b4\u00d9\u2026\u00d9\u0160\u00d8\u00b1\u00d9\u0160\u00e2\u20ac\u017d",
        },
        kk: {
            name: "Kazakh",
            nativeName:
                "\u00d2\u0161\u00d0\u00b0\u00d0\u00b7\u00d0\u00b0\u00d2\u203a \u00d1\u201a\u00d1\u2013\u00d0\u00bb\u00d1\u2013",
        },
        km: {
            name: "Khmer",
            nativeName:
                "\u00e1\u017e\u2014\u00e1\u017e\u00b6\u00e1\u017e\u0178\u00e1\u017e\u00b6\u00e1\u017e\u0081\u00e1\u0178\u2019\u00e1\u017e\u02dc\u00e1\u0178\u201a\u00e1\u017e\u0161",
        },
        ki: {
            name: "Kikuyu, Gikuyu",
            nativeName: "G\u00c4\u00a9k\u00c5\u00a9y\u00c5\u00a9",
        },
        rw: {name: "Kinyarwanda", nativeName: "Ikinyarwanda"},
        ky: {
            name: "Kirghiz, Kyrgyz",
            nativeName:
                "\u00d0\u00ba\u00d1\u2039\u00d1\u20ac\u00d0\u00b3\u00d1\u2039\u00d0\u00b7 \u00d1\u201a\u00d0\u00b8\u00d0\u00bb\u00d0\u00b8",
        },
        kv: {
            name: "Komi",
            nativeName:
                "\u00d0\u00ba\u00d0\u00be\u00d0\u00bc\u00d0\u00b8 \u00d0\u00ba\u00d1\u2039\u00d0\u00b2",
        },
        kg: {name: "Kongo", nativeName: "KiKongo"},
        ko: {
            name: "Korean",
            nativeName:
                "\u00ed\u2022\u0153\u00ea\u00b5\u00ad\u00ec\u2013\u00b4 (\u00e9\u0178\u201c\u00e5\u0153\u2039\u00e8\u00aa\u017e), \u00ec\u00a1\u00b0\u00ec\u201e \u00eb\u00a7\u0090 (\u00e6\u0153\u009d\u00e9\u00ae\u00ae\u00e8\u00aa\u017e)",
        },
        ku: {
            name: "Kurdish",
            nativeName:
                "Kurd\u00c3\u00ae, \u00d9\u0192\u00d9\u02c6\u00d8\u00b1\u00d8\u00af\u00db\u0152\u00e2\u20ac\u017d",
        },
        kj: {name: "Kwanyama, Kuanyama", nativeName: "Kuanyama"},
        la: {name: "Latin", nativeName: "latine, lingua latina"},
        lb: {
            name: "Luxembourgish, Letzeburgesch",
            nativeName: "L\u00c3\u00abtzebuergesch",
        },
        lg: {name: "Luganda", nativeName: "Luganda"},
        li: {name: "Limburgish, Limburgan, Limburger", nativeName: "Limburgs"},
        ln: {name: "Lingala", nativeName: "Ling\u00c3\u00a1la"},
        lo: {
            name: "Lao",
            nativeName:
                "\u00e0\u00ba\u017e\u00e0\u00ba\u00b2\u00e0\u00ba\u00aa\u00e0\u00ba\u00b2\u00e0\u00ba\u00a5\u00e0\u00ba\u00b2\u00e0\u00ba\u00a7",
        },
        lt: {name: "Lithuanian", nativeName: "lietuvi\u00c5\u00b3 kalba"},
        lu: {name: "Luba-Katanga", nativeName: ""},
        lv: {name: "Latvian", nativeName: "latvie\u00c5\u00a1u valoda"},
        gv: {name: "Manx", nativeName: "Gaelg, Gailck"},
        mk: {
            name: "Macedonian",
            nativeName:
                "\u00d0\u00bc\u00d0\u00b0\u00d0\u00ba\u00d0\u00b5\u00d0\u00b4\u00d0\u00be\u00d0\u00bd\u00d1\u0081\u00d0\u00ba\u00d0\u00b8 \u00d1\u02dc\u00d0\u00b0\u00d0\u00b7\u00d0\u00b8\u00d0\u00ba",
        },
        mg: {name: "Malagasy", nativeName: "Malagasy fiteny"},
        ms: {
            name: "Malay",
            nativeName:
                "bahasa Melayu, \u00d8\u00a8\u00d9\u2021\u00d8\u00a7\u00d8\u00b3 \u00d9\u2026\u00d9\u201e\u00d8\u00a7\u00d9\u0160\u00d9\u02c6\u00e2\u20ac\u017d",
        },
        ml: {
            name: "Malayalam",
            nativeName:
                "\u00e0\u00b4\u00ae\u00e0\u00b4\u00b2\u00e0\u00b4\u00af\u00e0\u00b4\u00be\u00e0\u00b4\u00b3\u00e0\u00b4\u201a",
        },
        mt: {name: "Maltese", nativeName: "Malti"},
        mi: {name: "M\u00c4\u0081ori", nativeName: "te reo M\u00c4\u0081ori"},
        mr: {
            name: "Marathi (Mar\u00c4\u0081\u00e1\u00b9\u00adh\u00c4\u00ab)",
            nativeName:
                "\u00e0\u00a4\u00ae\u00e0\u00a4\u00b0\u00e0\u00a4\u00be\u00e0\u00a4 \u00e0\u00a5\u20ac",
        },
        mh: {
            name: "Marshallese",
            nativeName: "Kajin M\u00cc\u00a7aje\u00c4\u00bc",
        },
        mn: {
            name: "Mongolian",
            nativeName:
                "\u00d0\u00bc\u00d0\u00be\u00d0\u00bd\u00d0\u00b3\u00d0\u00be\u00d0\u00bb",
        },
        na: {name: "Nauru", nativeName: "Ekakair\u00c5\u00a9 Naoero"},
        nv: {
            name: "Navajo, Navaho",
            nativeName:
                "Din\u00c3\u00a9 bizaad, Din\u00c3\u00a9k\u00ca\u00bceh\u00c7\u00b0\u00c3\u00ad",
        },
        nb: {
            name: "Norwegian Bokm\u00c3\u00a5l",
            nativeName: "Norsk bokm\u00c3\u00a5l",
        },
        nd: {name: "North Ndebele", nativeName: "isiNdebele"},
        ne: {
            name: "Nepali",
            nativeName:
                "\u00e0\u00a4\u00a8\u00e0\u00a5\u2021\u00e0\u00a4\u00aa\u00e0\u00a4\u00be\u00e0\u00a4\u00b2\u00e0\u00a5\u20ac",
        },
        ng: {name: "Ndonga", nativeName: "Owambo"},
        nn: {name: "Norwegian Nynorsk", nativeName: "Norsk nynorsk"},
        no: {name: "Norwegian", nativeName: "Norsk"},
        ii: {
            name: "Nuosu",
            nativeName:
                "\u00ea\u2020\u02c6\u00ea\u0152 \u00ea\u2019\u00bf Nuosuhxop",
        },
        nr: {name: "South Ndebele", nativeName: "isiNdebele"},
        oc: {name: "Occitan", nativeName: "Occitan"},
        oj: {
            name: "Ojibwe, Ojibwa",
            nativeName:
                "\u00e1\u0090\u0160\u00e1\u201c\u201a\u00e1\u201d\u2018\u00e1\u201c\u02c6\u00e1\u0090\u00af\u00e1\u2019\u00a7\u00e1\u0090\u017d\u00e1\u201c\u0090",
        },
        cu: {
            name: "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
            nativeName:
                "\u00d1\u00a9\u00d0\u00b7\u00d1\u2039\u00d0\u00ba\u00d1\u0160 \u00d1\u0081\u00d0\u00bb\u00d0\u00be\u00d0\u00b2\u00d1\u00a3\u00d0\u00bd\u00d1\u0152\u00d1\u0081\u00d0\u00ba\u00d1\u0160",
        },
        om: {name: "Oromo", nativeName: "Afaan Oromoo"},
        or: {
            name: "Oriya",
            nativeName:
                "\u00e0\u00ac\u201c\u00e0\u00ac\u00a1\u00e0\u00ac\u00bc\u00e0\u00ac\u00bf\u00e0\u00ac\u2020",
        },
        os: {
            name: "Ossetian, Ossetic",
            nativeName:
                "\u00d0\u00b8\u00d1\u20ac\u00d0\u00be\u00d0\u00bd \u00c3\u00a6\u00d0\u00b2\u00d0\u00b7\u00d0\u00b0\u00d0\u00b3",
        },
        pa: {
            name: "Panjabi, Punjabi",
            nativeName:
                "\u00e0\u00a8\u00aa\u00e0\u00a9\u00b0\u00e0\u00a8\u0153\u00e0\u00a8\u00be\u00e0\u00a8\u00ac\u00e0\u00a9\u20ac, \u00d9\u00be\u00d9\u2020\u00d8\u00ac\u00d8\u00a7\u00d8\u00a8\u00db\u0152\u00e2\u20ac\u017d",
        },
        pi: {
            name: "P\u00c4\u0081li",
            nativeName:
                "\u00e0\u00a4\u00aa\u00e0\u00a4\u00be\u00e0\u00a4\u00b4\u00e0\u00a4\u00bf",
        },
        fa: {
            name: "Persian",
            nativeName:
                "\u00d9\u0081\u00d8\u00a7\u00d8\u00b1\u00d8\u00b3\u00db\u0152",
        },
        pl: {name: "Polish", nativeName: "polski"},
        ps: {
            name: "Pashto, Pushto",
            nativeName: "\u00d9\u00be\u00da\u0161\u00d8\u00aa\u00d9\u02c6",
        },
        pt: {name: "Portuguese", nativeName: "Portugu\u00c3\u00aas"},
        qu: {name: "Quechua", nativeName: "Runa Simi, Kichwa"},
        rm: {name: "Romansh", nativeName: "rumantsch grischun"},
        rn: {name: "Kirundi", nativeName: "kiRundi"},
        ro: {
            name: "Romanian, Moldavian, Moldovan",
            nativeName: "rom\u00c3\u00a2n\u00c4\u0192",
        },
        ru: {
            name: "Russian",
            nativeName:
                "\u00d1\u20ac\u00d1\u0192\u00d1\u0081\u00d1\u0081\u00d0\u00ba\u00d0\u00b8\u00d0\u00b9 \u00d1\u008f\u00d0\u00b7\u00d1\u2039\u00d0\u00ba",
        },
        sa: {
            name: "Sanskrit (Sa\u00e1\u00b9\u0081sk\u00e1\u00b9\u203ata)",
            nativeName:
                "\u00e0\u00a4\u00b8\u00e0\u00a4\u201a\u00e0\u00a4\u00b8\u00e0\u00a5\u008d\u00e0\u00a4\u2022\u00e0\u00a5\u0192\u00e0\u00a4\u00a4\u00e0\u00a4\u00ae\u00e0\u00a5\u008d",
        },
        sc: {name: "Sardinian", nativeName: "sardu"},
        sd: {
            name: "Sindhi",
            nativeName:
                "\u00e0\u00a4\u00b8\u00e0\u00a4\u00bf\u00e0\u00a4\u00a8\u00e0\u00a5\u008d\u00e0\u00a4\u00a7\u00e0\u00a5\u20ac, \u00d8\u00b3\u00d9\u2020\u00da\u0152\u00d9\u0160\u00d8\u0152 \u00d8\u00b3\u00d9\u2020\u00d8\u00af\u00da\u00be\u00db\u0152\u00e2\u20ac\u017d",
        },
        se: {name: "Northern Sami", nativeName: "Davvis\u00c3\u00a1megiella"},
        sm: {name: "Samoan", nativeName: "gagana faa Samoa"},
        sg: {
            name: "Sango",
            nativeName:
                "y\u00c3\u00a2ng\u00c3\u00a2 t\u00c3\u00ae s\u00c3\u00a4ng\u00c3\u00b6",
        },
        sr: {
            name: "Serbian",
            nativeName:
                "\u00d1\u0081\u00d1\u20ac\u00d0\u00bf\u00d1\u0081\u00d0\u00ba\u00d0\u00b8 \u00d1\u02dc\u00d0\u00b5\u00d0\u00b7\u00d0\u00b8\u00d0\u00ba",
        },
        gd: {name: "Scottish Gaelic; Gaelic", nativeName: "G\u00c3 idhlig"},
        sn: {name: "Shona", nativeName: "chiShona"},
        si: {
            name: "Sinhala, Sinhalese",
            nativeName:
                "\u00e0\u00b7\u0192\u00e0\u00b7\u2019\u00e0\u00b6\u201a\u00e0\u00b7\u201e\u00e0\u00b6\u00bd",
        },
        sk: {name: "Slovak", nativeName: "sloven\u00c4\u008dina"},
        sl: {name: "Slovene", nativeName: "sloven\u00c5\u00a1\u00c4\u008dina"},
        so: {name: "Somali", nativeName: "Soomaaliga, af Soomaali"},
        st: {name: "Southern Sotho", nativeName: "Sesotho"},
        es: {
            name: "Spanish; Castilian",
            nativeName: "espa\u00c3\u00b1ol, castellano",
        },
        su: {name: "Sundanese", nativeName: "Basa Sunda"},
        sw: {name: "Swahili", nativeName: "Kiswahili"},
        ss: {name: "Swati", nativeName: "SiSwati"},
        sv: {name: "Swedish", nativeName: "svenska"},
        ta: {
            name: "Tamil",
            nativeName:
                "\u00e0\u00ae\u00a4\u00e0\u00ae\u00ae\u00e0\u00ae\u00bf\u00e0\u00ae\u00b4\u00e0\u00af\u008d",
        },
        te: {
            name: "Telugu",
            nativeName:
                "\u00e0\u00b0\u00a4\u00e0\u00b1\u2020\u00e0\u00b0\u00b2\u00e0\u00b1\u0081\u00e0\u00b0\u2014\u00e0\u00b1\u0081",
        },
        tg: {
            name: "Tajik",
            nativeName:
                "\u00d1\u201a\u00d0\u00be\u00d2\u00b7\u00d0\u00b8\u00d0\u00ba\u00d3\u00a3, to\u00c4\u0178ik\u00c4\u00ab, \u00d8\u00aa\u00d8\u00a7\u00d8\u00ac\u00db\u0152\u00da\u00a9\u00db\u0152\u00e2\u20ac\u017d",
        },
        th: {
            name: "Thai",
            nativeName:
                "\u00e0\u00b9\u201e\u00e0\u00b8\u2014\u00e0\u00b8\u00a2",
        },
        ti: {
            name: "Tigrinya",
            nativeName:
                "\u00e1\u2030\u00b5\u00e1\u0152\u008d\u00e1\u02c6\u00ad\u00e1\u0160\u203a",
        },
        bo: {
            name: "Tibetan Standard, Tibetan, Central",
            nativeName:
                "\u00e0\u00bd\u2013\u00e0\u00bd\u00bc\u00e0\u00bd\u2018\u00e0\u00bc\u2039\u00e0\u00bd\u00a1\u00e0\u00bd\u00b2\u00e0\u00bd\u201a",
        },
        tk: {
            name: "Turkmen",
            nativeName:
                "T\u00c3\u00bcrkmen, \u00d0\u00a2\u00d2\u00af\u00d1\u20ac\u00d0\u00ba\u00d0\u00bc\u00d0\u00b5\u00d0\u00bd",
        },
        tl: {
            name: "Tagalog",
            nativeName:
                "Wikang Tagalog, \u00e1\u0153\u008f\u00e1\u0153\u2019\u00e1\u0153\u0192\u00e1\u0153\u2026\u00e1\u0153\u201d \u00e1\u0153\u2020\u00e1\u0153\u201e\u00e1\u0153\u017d\u00e1\u0153\u201c\u00e1\u0153\u201e\u00e1\u0153\u201d",
        },
        tn: {name: "Tswana", nativeName: "Setswana"},
        to: {name: "Tonga (Tonga Islands)", nativeName: "faka Tonga"},
        tr: {name: "Turkish", nativeName: "T\u00c3\u00bcrk\u00c3\u00a7e"},
        ts: {name: "Tsonga", nativeName: "Xitsonga"},
        tt: {
            name: "Tatar",
            nativeName:
                "\u00d1\u201a\u00d0\u00b0\u00d1\u201a\u00d0\u00b0\u00d1\u20ac\u00d1\u2021\u00d0\u00b0, tatar\u00c3\u00a7a, \u00d8\u00aa\u00d8\u00a7\u00d8\u00aa\u00d8\u00a7\u00d8\u00b1\u00da\u2020\u00d8\u00a7\u00e2\u20ac\u017d",
        },
        tw: {name: "Twi", nativeName: "Twi"},
        ty: {name: "Tahitian", nativeName: "Reo Tahiti"},
        ug: {
            name: "Uighur, Uyghur",
            nativeName:
                "Uy\u00c6\u00a3urq\u00c9\u2122, \u00d8\u00a6\u00db\u2021\u00d9\u0160\u00d8\u00ba\u00db\u2021\u00d8\u00b1\u00da\u2020\u00db\u2022\u00e2\u20ac\u017d",
        },
        uk: {
            name: "Ukrainian",
            nativeName:
                "\u00d1\u0192\u00d0\u00ba\u00d1\u20ac\u00d0\u00b0\u00d1\u2014\u00d0\u00bd\u00d1\u0081\u00d1\u0152\u00d0\u00ba\u00d0\u00b0",
        },
        ur: {
            name: "Urdu",
            nativeName: "\u00d8\u00a7\u00d8\u00b1\u00d8\u00af\u00d9\u02c6",
        },
        uz: {
            name: "Uzbek",
            nativeName:
                "zbek, \u00d0\u017d\u00d0\u00b7\u00d0\u00b1\u00d0\u00b5\u00d0\u00ba, \u00d8\u00a3\u00db\u2021\u00d8\u00b2\u00d8\u00a8\u00db\u0090\u00d9\u0192\u00e2\u20ac\u017d",
        },
        ve: {name: "Venda", nativeName: "Tshiven\u00e1\u00b8\u201ca"},
        vi: {
            name: "Vietnamese",
            nativeName: "Ti\u00e1\u00ba\u00bfng Vi\u00e1\u00bb\u2021t",
        },
        vo: {name: "Volap\u00c3\u00bck", nativeName: "Volap\u00c3\u00bck"},
        wa: {name: "Walloon", nativeName: "Walon"},
        cy: {name: "Welsh", nativeName: "Cymraeg"},
        wo: {name: "Wolof", nativeName: "Wollof"},
        fy: {name: "Western Frisian", nativeName: "Frysk"},
        xh: {name: "Xhosa", nativeName: "isiXhosa"},
        yi: {
            name: "Yiddish",
            nativeName:
                "\u00d7\u2122\u00d7\u2122\u00d6\u00b4\u00d7\u201c\u00d7\u2122\u00d7\u00a9",
        },
        yo: {name: "Yoruba", nativeName: "Yor\u00c3\u00b9b\u00c3\u00a1"},
        za: {
            name: "Zhuang, Chuang",
            nativeName:
                "Sa\u00c9\u00af cue\u00c5\u2039\u00c6\u2026, Saw cuengh",
        },
    };
})((window.sru.speechOptions = window.sru.speechOptions || {}));
