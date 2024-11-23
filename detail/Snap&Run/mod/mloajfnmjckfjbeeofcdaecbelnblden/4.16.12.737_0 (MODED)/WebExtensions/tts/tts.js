globalThis.dji = globalThis.dji || {};
(function (l) {
    function X(a) {
        let b = function () {
            dji.logger.monitor({event: "tts_gv_step_3a", os: p.name});
            let c = window.speechSynthesis.getVoices();
            dji.logger.monitor({
                event: "tts_gv_step_3b",
                os: p.name,
                vl: c ? c.length : null,
            });
            if (p.chrome || (c && 0 < c.length))
                return (
                    dji.logger.monitor({
                        event: "tts_gv_step_3c",
                        os: p.name,
                        vl: c ? c.length : null,
                    }),
                    a(c)
                );
            setTimeout(b, 500);
        };
        b();
    }
    function N(a, b) {
        dji.logger.monitor({event: "tts_dv_step_2a", tryCount: a, os: p.name});
        X(function (c) {
            dji.logger.log("try to detect voices: ", a);
            dji.logger.monitor({
                event: "tts_dv_step_2b",
                vl: c ? c.length : null,
            });
            if (p.chrome && (null === c || 0 >= c.length))
                dji.logger.monitor({event: "tts_dv_step_2c"}),
                    setTimeout(function () {
                        function d(h) {
                            dji.logger.monitor({
                                event: "tts_dv_step_2e",
                                reason: h.type,
                            });
                            g ||
                                ((g = !0),
                                clearTimeout(e),
                                "timeout" === h.type &&
                                    window.speechSynthesis.cancel(),
                                ("timeout" !== h.type &&
                                    "end" !== h.type &&
                                    "error" !== h.type) ||
                                    setTimeout(
                                        N,
                                        "end" === h.type || "timeout" === h.type
                                            ? 10
                                            : 1e4,
                                        a + 1,
                                        b,
                                    ));
                        }
                        let g = !1,
                            e = null,
                            f = new SpeechSynthesisUtterance(" ");
                        f.onerror = d;
                        f.onend = d;
                        e = setTimeout(d, 1e4, {type: "timeout"});
                        window.speechSynthesis.speak(f);
                        dji.logger.monitor({event: "tts_dv_step_2d"});
                    }, 10);
            else {
                dji.logger.monitor({event: "tts_dv_step_2m"});
                const d = /Heather|Ryan|Graham|Lucy|SOLO|Flite|Acapela|Google/i;
                let g = [];
                for (let e = 0; e < c.length; e++) {
                    let f = c[e];
                    null === f.name || 0 === f.name.length || d.test(f.name)
                        ? dji.logger.warning("TTS voice excluded:", f.name, f)
                        : g.push(f);
                }
                t = Y(g, !1);
                dji.logger.monitor({event: "tts_dv_step_2n"});
                l.cacheOnlineVoices(function () {
                    dji.logger.monitor({event: "tts_dv_step_2o"});
                    for (let f = 0; f < t.length; f++) {
                        let h = t[f],
                            k = h.extras;
                        var e = (z[k.lang] = z[k.lang] || {});
                        e = e[k.culture] = e[k.culture] || {};
                        (e[k.gender] = e[k.gender] || []).push(h);
                    }
                    Z();
                    dji.logger.monitor({event: "tts_dv_step_2p"});
                    setTimeout(function () {
                        dji.logger.groupEnd();
                        G(b, !0);
                    }, 0);
                });
            }
        });
    }
    function O() {
        r.voice = l.defaultVoice();
        r.translationVoice = null;
        r.rate = r.pitch = r.volume = 1;
    }
    function y(a) {
        for (let b = 0; b < t.length; b++)
            if (t[b].voiceName === a) return t[b];
        return null;
    }
    function L(a) {
        return !!y(a);
    }
    function Y(a, b) {
        let c = [];
        for (let g = 0; g < a.length; g++) {
            var d = a[g];
            P(d, b) &&
                ((d = {
                    default: !(b || !d.default),
                    localService: !(b || !d.localService),
                    remote: !(!b || !d.remote),
                    lang: d.lang,
                    name: b ? d.voiceName : d.name,
                    voiceName: b ? d.voiceName : d.name,
                    voiceURI: b ? d.voiceIdentifier : d.voiceURI,
                    voiceIdentifier: b ? d.voiceIdentifier : d.voiceURI,
                    adjustable: !(b && !d.adjustable),
                    rawVoice: d,
                }),
                Q(d, b),
                c.push(d));
        }
        return c;
    }
    function P(a, b) {
        return p.chrome
            ? !(b ? a.voiceName : a.name)
                  .trim()
                  .toLowerCase()
                  .startsWith("heidiexpressive")
            : !0;
    }
    function Q(a, b) {
        let c = (a.lang || "neutral").split("-"),
            d = (2 <= c.length ? c[1] : "").toUpperCase(),
            g = (a.gender || "neutral").toLowerCase();
        const e = b ? a.voiceName : a.name;
        a.extras = {
            langInfo: dji.languages.languageInfo(c[0]),
            lang: (c[0] || "").toLowerCase(),
            culture: d,
            gender: g,
            isGoogle: l.isGoogleVoice(e),
            isMicrosoft: l.isMicrosoftVoice(e),
            isOnline: !!b,
        };
    }
    function Z() {
        for (let a in z) {
            if (!z.hasOwnProperty(a)) continue;
            let b = z[a],
                c = [];
            for (let d in b) {
                if (!b.hasOwnProperty(d)) continue;
                let g = b[d],
                    e = [];
                for (let f in g)
                    g.hasOwnProperty(f) &&
                        ((e = e.concat(g[f])), (c = c.concat(e)));
                g["@"] = e;
            }
            b["@"] = c;
        }
    }
    function R(a, b, c, d, g) {
        let e = null,
            f = null,
            h = null;
        for (let k = 0; k < b.length; k++) {
            let m = b[k];
            m === a ||
                (!c && m.extras.isOnline) ||
                (!d && !m.extras.isOnline) ||
                (c && !e && m.extras.isOnline && (e = m),
                !d || f || m.extras.isOnline || m.extras.isGoogle || (f = m),
                g && !h && m.extras.isGoogle && (h = m));
        }
        return f || h || e || null;
    }
    function H(a, b, c, d, g) {
        var e = b[a.extras.gender] || [];
        e = R(a, e, c, d, g);
        if (!e)
            for (let f in b)
                if (
                    f !== a.extras.gender &&
                    b.hasOwnProperty(f) &&
                    ((e = b[f] || []), (e = R(a, e, c, d, g)))
                )
                    break;
        return e || null;
    }
    function I(a) {
        if ((a = y(a)) && !a.extras.isOnline) return a.voiceName;
        if (!a || "en" === a.extras.lang) return l.defaultVoice(!0);
        let b = a.extras,
            c = z[b.lang] || {};
        var d = c[b.culture] || {};
        d = H(a, d, !1, !0, !0);
        if (!d)
            for (let g in c)
                if (
                    g !== b.culture &&
                    c.hasOwnProperty(g) &&
                    ((d = c[g] || {}), (d = H(a, d, !1, !0, !0)))
                )
                    break;
        return d ? d.voiceName : l.defaultVoice(!0);
    }
    function M() {
        null !== J && (clearTimeout(J), (J = null));
    }
    function S(a) {
        if (void 0 === a || null === a || 1 > a.length || 0 === a.trim().length)
            return !1;
        let b = !1;
        for (let c = 0; c < a.length; c++) {
            let d = a.charAt(c);
            if (!dji.charSet.wordSeparator.characterIsMember(d)) {
                b = !0;
                break;
            }
        }
        return b;
    }
    function T(a, b, c, d, g, e, f) {
        let h = [];
        e = e ? (e.extras.isGoogle ? 200 : 2e4) : -1;
        b = b || 0;
        if (0 > e)
            h.push({
                offset: b,
                text: a,
                isTranslated: c,
                isMath: d,
                mathFormat: g,
                indexOfPlaceholderText: f,
            });
        else {
            let u = 0;
            do {
                a: {
                    var k = a;
                    var m = u;
                    var q = e;
                    if (0 > q) {
                        k = Math.max(0, k.length - 1);
                        break a;
                    }
                    if (6 * (k.length - m) <= q) {
                        k = Math.max(0, k.length - 1);
                        break a;
                    }
                    let B = k.length,
                        C = 0,
                        n,
                        A,
                        U = m;
                    for (; m < B && C < q; m++) {
                        A = k.charCodeAt(m);
                        if (127 >= A) n = 1;
                        else if (2047 >= A) n = 2;
                        else if (65535 >= A) n = 3;
                        else for (n = 4; A >> (6 * n); ) n++;
                        if (q < C + n) break;
                        C += n;
                        U = m;
                    }
                    k = U;
                }
                k = m = k;
                if (k < a.length - 1)
                    for (
                        k = m;
                        u <= k &&
                        ((q = a.charAt(k)),
                        !dji.charSet.wordSeparator.characterIsMember(q));
                        k--
                    );
                k <= u && (k = m);
                h.push({
                    offset: d ? b : b + u,
                    text: a.substring(u, k + 1),
                    isTranslated: c,
                    isMath: d,
                    mathFormat: g,
                    indexOfPlaceholderText: f,
                });
                u = k + 1;
            } while (u < a.length);
        }
        0 < h.length &&
            (b = d
                ? h[h.length - 1].offset + 1
                : h[h.length - 1].offset + h[h.length - 1].text.length);
        return {chunks: h, additionalOffset: b};
    }
    function V(a, b, c, d) {
        let g = [];
        b = b || 0;
        for (let f = 0; f < a.length; f++) {
            var e = a[f].isTranslated ? d : c;
            if (a[f].isMath)
                e = {
                    chunks: [
                        {
                            offset: b,
                            text: a[f].text,
                            isTranslated: !1,
                            isMath: !0,
                            mathFormat: a[f].mathFormat,
                            mathReady: a[f].mathReady,
                        },
                    ],
                    additionalOffset: b + 1,
                };
            else {
                const h = a[f];
                e = T(
                    h.text,
                    b,
                    !!h.isTranslated,
                    h.isMath,
                    h.mathFormat,
                    e,
                    h.indexOfPlaceholderText,
                );
            }
            b = e.additionalOffset;
            g = g.concat(e.chunks);
        }
        return g;
    }
    function W(a, b, c, d, g, e) {
        e = y(r.voice);
        let f = y(r.translationVoice),
            h = {};
        h = g ? Object.assign(h, r, g) : r;
        a = {
            chunks: V(a, 0, e, f),
            isSpoken: !1,
            cancel: !1,
            userData: b,
            listener: c,
            sessionID: d,
            settings: JSON.parse(JSON.stringify(h)),
        };
        v.push(a);
        (D && 1 !== v.length) || (a.isSpoken = K(a));
    }
    function K(a) {
        var b = !D;
        D || (D = !0);
        if (0 >= a.chunks.length || 0 >= a.settings.volume)
            return (a.cancel = !0), setTimeout(E, 0, a), !0;
        a.startTime = Date.now();
        let c = a.chunks[0],
            d = c.isTranslated ? a.settings.translationVoice : a.settings.voice;
        if (!d) return (a.cancel = !0), setTimeout(E, 0, a), !0;
        let g = y(d);
        g || (g = I(d));
        let e =
            window.dji.tts_service && window.dji.tts_service.isOnlineVoice(d);
        b &&
            (w(a.listener, "wait", a.userData, a.sessionID),
            e || w(a.listener, "start", a.userData, a.sessionID, g.voiceName));
        b = [];
        c.isMath &&
            !c.mathReady &&
            (w(a.listener, "wait", a.userData, a.sessionID),
            b.push(
                new Promise(function (f, h) {
                    SreAdapter.mathToText(
                        c.text,
                        c.mathFormat,
                        l.localeFromVoiceName(d),
                        !0,
                        function (k) {
                            k.error ? h(k) : f(k);
                        },
                    );
                })
                    .then(function (f) {
                        c.text = f.text;
                        c.mathReady = !0;
                        f = T(
                            c.text,
                            c.offset,
                            !1,
                            !0,
                            c.mathFormat,
                            c.voice,
                            c.indexOfPlaceholderText,
                        );
                        for (let h = f.chunks.length - 1; 0 <= h; h--)
                            (f.chunks[h].mathReady = !0),
                                a.chunks.splice(1, 0, f.chunks[h]);
                        a.chunks.splice(0, 1);
                    })
                    .catch(function (f) {
                        dji.logger.error(
                            "__enqueueParts mathPromise failed",
                            f,
                            JSON.parse(JSON.stringify(c)),
                        );
                        w(a.listener, "error", a.userData, a.sessionID, f);
                    }),
            ));
        Promise.all(b).then(function () {
            c = a.chunks[0];
            e || w(a.listener, "start", a.userData, a.sessionID, g.voiceName);
            if (!S(c.text) || !d || "No Voice" === d)
                return setTimeout(E, 0, a), !0;
            dji.logger.log(
                "__doSpeak using voice:",
                d,
                " (translated:",
                c.isTranslated,
                ") / settings:",
                JSON.stringify(a.settings, !0, 2),
            );
            if (e) aa(a, c, d);
            else {
                let f = new SpeechSynthesisUtterance(c.text);
                f.lang = g.lang;
                f.voice = g.rawVoice;
                f.volume = a.settings.volume;
                f.rate = a.settings.rate;
                f.pitch = a.settings.pitch;
                f.addEventListener("start", (h) => {
                    f.addEventListener("boundary", (k) => {
                        var m = a,
                            q = c;
                        const u = k.charIndex || 0,
                            B = k.charLength || 0;
                        m = m || k.utterance.__item;
                        q = q || m.chunks[0];
                        w(
                            m.listener,
                            "progress",
                            q && q.isMath ? q.offset : u + m.chunks[0].offset,
                            B,
                            {
                                ...m.userData,
                                sessionID: m.sessionID,
                                chunkLen: q.text ? q.text.length : -1,
                                isMath: q.isMath,
                                indexOfPlaceholderText:
                                    q.indexOfPlaceholderText,
                                mathFormat: q.mathFormat,
                                chunkOffset: u,
                            },
                        );
                    });
                    f.addEventListener("end", (k) => {
                        var m = a;
                        m = m || k.utterance.__item;
                        E(m);
                    });
                });
                f.addEventListener("error", (h) => {
                    var k = a;
                    k = k || h.utterance.__item;
                    k.cancel = !0;
                    E(k);
                });
                window.speechSynthesis.speak(f);
            }
        });
        return !0;
    }
    function aa(a, b, c) {
        let d = !1,
            g = 0;
        window.dji.tts_service.onStart = function () {
            w(a.listener, "start", a.userData, a.sessionID, c);
            w(a.listener, "progress", b.offset, -1, a.userData);
        };
        window.dji.tts_service.onProgress = function (e, f) {
            g = f;
            b && b.isMath
                ? w(a.listener, "progress", b.offset, -1, {
                      ...a.userData,
                      sessionID: a.sessionID,
                      chunkLen: b.text ? b.text.length : -1,
                      isMath: !0,
                      indexOfPlaceholderText: b.indexOfPlaceholderText,
                      mathFormat: b.mathFormat,
                      chunkOffset: e,
                  })
                : w(a.listener, "progress", e + b.offset, f - e, {
                      ...a.userData,
                      sessionID: a.sessionID,
                      chunkLen: b.text ? b.text.length : -1,
                      isMath: !1,
                      indexOfPlaceholderText: b.indexOfPlaceholderText,
                      mathFormat: b.mathFormat,
                      chunkOffset: e,
                  });
        };
        window.dji.tts_service.onStop = function () {
            if (!d || 0 >= b.text.substring(g).trim().length)
                return setTimeout(E, 10, a);
            let e = a.settings.voice,
                f = a.settings.translationVoice;
            var h = g;
            let k = I(a.settings.voice),
                m = I(a.settings.translationVoice),
                q = y(k),
                u = y(m);
            a.settings.voice = k;
            a.settings.translationVoice = m;
            a.chunks[0].text = a.chunks[0].text.substring(h);
            a.chunks = V(a.chunks, h, q, u);
            dji.logger.warning(
                `Switching from Online to Local voice: [${e}, ${f}] -> [${a.settings.voice}, ${a.settings.translationVoice}]`,
            );
            setTimeout(K, 0, a);
        };
        window.dji.tts_service.onError = function (e) {
            d = !0;
            w(a.listener, "error", a.userData, a.sessionID, e);
        };
        window.dji.tts_service.play(b.text, c, {
            pitch: 50,
            rate: Math.max(0, 100 * r.rate - 50),
            volume: 100 * r.volume,
        });
    }
    function E(a) {
        if (a && !a.cancel && 1 < a.chunks.length)
            return a.chunks.splice(0, 1), K(a);
        D = !1;
        if (a) {
            var b = v.indexOf(a);
            -1 !== b &&
                (v.splice(b, 1),
                0 === v.length &&
                    ((b = Date.now() - a.startTime),
                    w(a.listener, "stop", a.userData, b, a.sessionID)));
        }
        for (
            ;
            0 < v.length &&
            ((a = v[0]), !a.isSpoken) &&
            ((a.isSpoken = K(a)), !a.isSpoken);

        )
            v.splice(0, 1), w(a.listener, "stop", a.userData, 0, a.sessionID);
    }
    function G(a) {
        if (a)
            try {
                a.apply(this, [].slice.call(arguments).splice(1));
            } catch (b) {
                dji.logger.error(b);
            }
    }
    function w(a, b) {
        if (a && a[b])
            try {
                a[b].apply(a, [].slice.call(arguments).splice(2));
            } catch (c) {
                dji.logger.error(c);
            }
    }
    let p = dji.utils.os(),
        r = {voice: null, translationVoice: null, rate: 1, pitch: 1, volume: 1},
        t = [],
        x = [],
        z = {},
        J = null,
        D = !1,
        v = [],
        F = null;
    const ba = {
        windows: {
            "fr-FR": ["fr-FR_ReneeVoice"],
            "de-DE": ["de-DE_BirgitVoice", "de-DE_DieterVoice"],
            "it-IT": ["it-IT_FrancescaVoice"],
            "ja-JP": ["ja-JP_EmiVoice"],
            "pt-BR": ["pt-BR_IsabelaVoice"],
            "es-LA": ["es-LA_SofiaVoice"],
            "es-ES": ["es-ES_EnriqueVoice"],
            "es-US": ["es-US_SofiaVoice"],
        },
    };
    l.initialize = function (a, b) {
        F = a;
        if (0 < t.length) return G(b, !0);
        O();
        dji.logger.group("Initialize TTS");
        dji.logger.monitor({event: "tts_init_step_1a", os: p.name});
        N(1, (c) => {
            dji.logger.monitor({event: "tts_init_step_1b", os: p.name});
            b(c);
        });
    };
    l.settings = function (a) {
        const b = F && F.settingsFactor ? F.settingsFactor : 100;
        if (void 0 === a)
            return {
                voice: r.voice,
                translationVoice: r.translationVoice,
                rate: r.rate * b,
                pitch: r.pitch * b,
                volume: r.volume * b,
            };
        if (null === a) O();
        else if (!a.voice || L(a.voice))
            a.voice && (r.voice = a.voice),
                a.translationVoice && (r.translationVoice = a.translationVoice),
                void 0 !== a.rate && null !== a.rate && (r.rate = a.rate / b),
                void 0 !== a.pitch &&
                    null !== a.pitch &&
                    (r.pitch = a.pitch / b),
                void 0 !== a.volume &&
                    null !== a.volume &&
                    (r.volume = a.volume / b);
    };
    l.voices = function (a) {
        if (a) return t;
        let b = [],
            c = l.isOnlineVoiceAllowed(a),
            d = c && (p.windows || p.chrome);
        for (let f = 0; f < t.length; f++)
            if (((a = t[f]), c || !a.extras.isOnline))
                if (d && a.extras.isOnline) {
                    var g = a;
                    if (p.chrome || window.dji.config.env().permissive) g = !0;
                    else if (p.windows) {
                        var e = ba[p.name];
                        e = e ? e[g.lang] : void 0;
                        g = !!(e && 0 <= e.indexOf(g.voiceIdentifier));
                    } else g = !1;
                    g && b.push(a);
                } else b.push(a);
        return b;
    };
    l.voicesMap = function () {
        return z;
    };
    l.hasVoice = L;
    l.hasVoiceForLanguage = function (a, b) {
        a = l.voicesForLanguage(a) || [];
        for (let c = 0; c < a.length; c++) if (a[c].voiceName == b) return !0;
        return !1;
    };
    l.defaultVoice = function (a) {
        if (p.mac) {
            a: {
                a = t.length;
                for (var b = 0; b < a; b++) {
                    var c = t[b].voiceName;
                    if (c.startsWith("Samantha")) {
                        a = c;
                        break a;
                    }
                }
                a = 0 < a ? t[0].voiceName : "Samantha";
            }
            return a;
        }
        if (!p.windows && !a && l.onlineServiceAllowed()) {
            if (L("Michael (Online)")) return "Michael (Online)";
            if (0 < x.length) return x[0].voiceName;
        }
        var d = (c = b = null),
            g = null,
            e = null,
            f = null,
            h = null,
            k = null,
            m = null,
            q = null,
            u = null,
            B = null;
        for (let C = 0; C < t.length; C++) {
            let n = t[C];
            if (a && n.extras.isOnline) continue;
            if (!n.voiceName) continue;
            let A = (n.lang || "").toUpperCase();
            "EN-US" === A
                ? (b || (b = n.voiceName),
                  !h && n.extras.isMicrosoft && p.windows && (h = n.voiceName))
                : "EN-GB" === A
                  ? (c || (c = n.voiceName),
                    !k &&
                        n.extras.isMicrosoft &&
                        p.windows &&
                        (k = n.voiceName))
                  : "EN-CA" === A &&
                    (d || (d = n.voiceName),
                    !m &&
                        n.extras.isMicrosoft &&
                        p.windows &&
                        (m = n.voiceName));
            0 <= n.voiceName.indexOf("English") &&
                (f || (f = n.voiceName),
                !B && n.extras.isMicrosoft && p.windows && (B = n.voiceName),
                0 <= n.voiceName.indexOf("US")
                    ? (g || (g = n.voiceName),
                      !q &&
                          n.extras.isMicrosoft &&
                          p.windows &&
                          (q = n.voiceName))
                    : 0 <= n.voiceName.indexOf("UK") &&
                      (e || (e = n.voiceName),
                      !u &&
                          n.extras.isMicrosoft &&
                          p.windows &&
                          (u = n.voiceName)));
        }
        return p.windows
            ? q
                ? q
                : h
                  ? h
                  : u
                    ? u
                    : k
                      ? k
                      : m
                        ? m
                        : B || "native"
            : g
              ? g
              : b
                ? b
                : e
                  ? e
                  : c
                    ? c
                    : d
                      ? d
                      : f || "";
    };
    l.defaultVoiceForLanguage = function (a) {
        a = (a || "").split("-");
        var b = a[0],
            c = (2 <= a.length ? a[1] : "").toUpperCase();
        a = (dji.languages.languageCode_639_1(b) || "").toUpperCase();
        if (0 >= a.length || "EN" === a) return l.defaultVoice();
        b = z[b] || {};
        var d = (b[c] || {})["@"] || [];
        let g = b["@"] || [];
        for (c = 0; c < d.length; c++)
            if (((b = d[c]), !b.extras.isOnline && !b.extras.isGoogle))
                return b.voiceName;
        if (l.onlineServiceAllowed())
            for (c = 0; c < x.length; c++)
                if (
                    ((b = x[c]),
                    (d = (b.lang || "").toUpperCase()),
                    0 === d.indexOf(a))
                )
                    return b.voiceName;
        let e = null,
            f = null;
        for (c = 0; c < g.length; c++)
            (b = g[c]),
                (d = (b.lang || "").toUpperCase()),
                0 === d.indexOf(a) &&
                    (e || (e = b.voiceName),
                    !f && b.extras.isGoogle && (f = b.voiceName));
        return f ? f : e || "";
    };
    l.isGoogleVoice = function (a) {
        if (!a) return !1;
        a = a.toUpperCase();
        return 0 <= a.indexOf("GOOGLE") || 0 <= a.indexOf("CHROME");
    };
    l.isMicrosoftVoice = function (a) {
        if (!a) return !1;
        a = a.toUpperCase();
        return 0 <= a.indexOf("MICROSOFT");
    };
    l.isOnlineVoice = function (a) {
        if (!a) return !1;
        a = y(a);
        return !(!a || !a.extras.isOnline);
    };
    l.onlineServiceAllowed = function () {
        return F && !F.onlineServiceAllowed
            ? !1
            : !!(window.dji.config.env().permissive || p.windows || p.chrome);
    };
    l.hasOnlineVoices = function () {
        return l.onlineServiceAllowed() && 0 < x.length;
    };
    l.cacheOnlineVoices = function (a) {
        0 >= x.length && l.onlineServiceAllowed()
            ? window.dji.tts_service.loadVoices(function (b) {
                  if (0 >= x.length && ((x = b || []), 0 < x.length))
                      for (b = 0; b < x.length; b++) {
                          const c = x[b];
                          P(c, !0) && (Q(c, !0), t.push(c));
                      }
                  G(a, 0 < x.length);
              })
            : G(a, 0 < x.length);
    };
    l.isOnlineVoiceAllowed = function (a) {
        return l.onlineServiceAllowed()
            ? p.chrome || p.windows
                ? !0
                : !!window.dji.config.env().permissive
            : !1;
    };
    l.voicesForLanguage = function (a, b) {
        let c = [];
        b = l.voices(b);
        for (let d = 0; d < b.length; d++) {
            let g = b[d];
            g.lang && 0 === g.lang.indexOf(a) && c.push(g);
        }
        return c;
    };
    l.localAlternativeForVoice = I;
    l.onlineAlternativeForVoice = function (a) {
        let b = y(a);
        if (b && b.extras.isOnline) return b.voiceName;
        if (!b || "en" === b.extras.lang) return l.defaultVoice(!1);
        let c = b.extras,
            d = z[c.lang] || {};
        var g = d[c.culture] || {};
        g = H(b, g, !0, !1, !1);
        if (!g)
            for (let e in d)
                if (
                    e !== c.culture &&
                    d.hasOwnProperty(e) &&
                    ((g = d[e] || {}), (g = H(b, g, !0, !1, !1)))
                )
                    break;
        return g ? g.voiceName : a;
    };
    l.voiceSupportsSettings = function (a) {
        a = y(a);
        return {
            volume: !(!a || (a.extras.isOnline && !a.adjustable)),
            rate: !(!a || (a.extras.isOnline && !a.adjustable)),
            pitch: !a.extras.isOnline,
        };
    };
    l.speak = function (a, b, c, d, g) {
        (g = !!g) || l.stop();
        M();
        "string" === typeof a
            ? (a = [{text: a, isTranslated: !1}])
            : a instanceof Array || (a = null);
        a && 0 < a.length && W(a, b, c, d, null, g);
    };
    l.scheduleSpeak = function (a, b, c, d, g, e, f) {
        if ("string" !== typeof a || S(a))
            b ? l.stop() : M(),
                (J = setTimeout(function () {
                    "string" === typeof a
                        ? (a = [{text: a, isTranslated: !1}])
                        : a instanceof Array || (a = null);
                    a && 0 < a.length && W(a, d, g, e, f);
                }, c || 200));
    };
    l.stop = function () {
        M();
        if (0 < v.length) {
            let a;
            D
                ? ((a = v.splice(1, v.length - 1)),
                  (v[0].cancel = !0),
                  window.speechSynthesis.cancel())
                : (a = v.splice(0, v.length));
            for (const b of a)
                b.listener && w(b.listener, "stop", b.userData, 0, b.sessionID);
        }
        window.dji.tts_service && window.dji.tts_service.stop();
    };
    l.localeFromVoiceName = function (a) {
        const b = t.find((c) => c.voiceName === a);
        return l.localeFromLanguage(b?.lang);
    };
    l.localeFromLanguage = function (a) {
        return (a || "en").split("-")[0];
    };
})((globalThis.dji.tts = globalThis.dji.tts || {}));
