globalThis.dji = globalThis.dji || {};
(function (c) {
    function G(a) {
        return a
            .replace(/(\w)([&#~$%*])(\d|\w)/g, function (b) {
                return b[0] + " " + b[1] + " " + b[2];
            })
            .replace(/[()\[\]{}|]/g, " ")
            .replace(/[\u0022\u0060\u00B4\u2018\u2019\u201C\u201D]/g, " ")
            .replace(/\s+([.,:;])/g, function (b) {
                return b[0];
            });
    }
    let v = "",
        x = "",
        w = "",
        E = "",
        m = [],
        n = -1,
        p = -1,
        r = -1,
        g = null,
        t = null,
        f = null,
        u = !1,
        y = !1,
        h = [];
    c.onError = null;
    c.onProgress = null;
    c.onStart = null;
    c.onStop = null;
    const z = globalThis.dji.jsdapi ? globalThis.dji.jsdapi : globalThis.jsdapi;
    let H = function (a, b, d, e) {
            v = a;
            u = !1;
            a: {
                if (window.dji.config.env().ttsServerURL)
                    for (a = 0; a < h.length; a++)
                        if (h[a].voiceName === b) {
                            x = h[a].voiceIdentifier;
                            break a;
                        }
                u = !0;
                A(Error(b + " is not one of the known voices!"));
                c.onStop();
                x = void 0;
            }
            w = JSON.parse(JSON.stringify(d));
            E = e;
            m = [];
            r = p = n = -1;
            t = g = null;
            y = !1;
        },
        F = function () {
            c.onStart =
                c.onStart ||
                function () {
                    dji.logger.log("START PLAYBACK");
                };
            c.onProgress =
                c.onProgress ||
                function (a, b) {
                    dji.logger.log(a, b);
                };
            c.onStop =
                c.onStop ||
                function () {
                    dji.logger.log("STOP PLAYBACK");
                };
            c.onError =
                c.onError ||
                function (a) {
                    dji.logger.error(a);
                };
        },
        I = function () {
            if (g && g.timings && !(0 >= g.timings.length)) {
                var a = f.currentTime,
                    b = !1;
                for (let d = 0 > p ? 0 : p; d < g.timings.length; d++)
                    if (a > g.timings[d][1] && a < g.timings[d][2]) {
                        b = !0;
                        if (d !== p) {
                            p = d;
                            break;
                        }
                        return;
                    }
                if (b)
                    if (0 > p) c.onProgress(0, -1);
                    else
                        (a = g.timings[p][0]),
                            (r = v.indexOf(a, r)),
                            0 <= r &&
                                (c.onProgress(r, r + a.length),
                                (r += a.length));
                else
                    globalThis.dji.logger.warning(
                        "[__progressWatcher]. Progress not found for currentTime: ",
                        f?.currentTime,
                    );
            }
        },
        B = function () {
            u ||
                (!y && n + 1 < m.length
                    ? null === t
                        ? setTimeout(B, 50)
                        : (n++,
                          (g = t),
                          (t = null),
                          (p = -1),
                          (f.onplaying = J),
                          (f.onended = B),
                          (f.onerror = K),
                          (f.ontimeupdate = I),
                          (f.src = "data:audio/ogg;base64," + g.audio),
                          f.play())
                    : C());
        },
        J = function () {
            n + 1 < m.length && D();
        },
        K = function () {
            A(Error("Failed to switch audio track"));
            C();
        },
        D = function (a) {
            if (n + 1 >= m.length)
                A(
                    Error(
                        "This should never happen, getNextAudioData() called at bad time " +
                            (n + 1) +
                            ">=" +
                            m.length,
                    ),
                );
            else {
                var b = G(v.substring(m[n + 1][0], m[n + 1][1]));
                b = {
                    method: "POST",
                    responseType: "json",
                    timeout: 15e3,
                    url:
                        window.dji.config.env().ttsServerURL + "/v1/synthesize",
                    query: {access_token: E},
                    contentType: "application/json",
                    content: JSON.stringify({
                        voice: x,
                        settings: {
                            pitch: w.pitch,
                            rate: w.rate,
                            volume: w.volume,
                        },
                        text: b,
                    }),
                };
                z.http.sendRequest(b, function (d) {
                    if (!d || d.error || 1 < D.counter)
                        d = {audio: "INVALID_STREAM_DATA"};
                    t = d;
                    a && a();
                });
            }
        },
        C = function () {
            f && f.pause();
            u || (c.onStop(), (u = !0));
        },
        A = function (a) {
            y = !0;
            c.onError(a);
        };
    F();
    let L = function (a) {
        a = new window.ParseEnglish().parse(a);
        let b = [],
            d = function (e) {
                let q;
                if ("SentenceNode" === e.type) {
                    let k = e.position.start.offset,
                        l;
                    for (
                        q = 0;
                        q < e.children.length &&
                        !(k + 1e3 > e.position.end.offset);
                        q++
                    )
                        if (
                            ((l = e.children[q]),
                            ("PunctuationNode" === l.type &&
                                l.position.end.offset > k + 600) ||
                                ("WhiteSpaceNode" === l.type &&
                                    l.position.end.offset > k + 900) ||
                                (l.position.start.offset < k + 1e3 &&
                                    l.position.end.offset >= k + 1e3))
                        )
                            b.push([k, l.position.end.offset]),
                                (k = l.position.end.offset);
                    e.position.end.offset > k &&
                        b.push([k, e.position.end.offset]);
                } else if (e.children)
                    for (q = 0; q < e.children.length; q++) d(e.children[q]);
            };
        d(a);
        return b;
    };
    c.play = function (a, b, d) {
        F();
        H(a, b, d, z.getAuthToken());
        f = document.getElementById("dji-tts-service-audio");
        m = L(v);
        D(function () {
            c.onStart();
            B();
        });
    };
    c.stop = function () {
        C();
    };
    c.loadVoices = function (a) {
        if (0 < h.length) return a(h);
        let b = {
            method: "GET",
            url: window.dji.config.env().ttsServerURL + "/v1/voices",
            timeout: 5e3,
            responseType: "json",
        };
        z.http.sendRequest(b, function (d) {
            if (0 >= h.length) {
                if (!d || d.error) return a(null);
                h = d;
            }
            a(h);
        });
    };
    c.isOnlineVoice = function (a) {
        return 0 < a.indexOf("(Online)")
            ? !0
            : void 0 !== h.find((b) => b.voiceName === a);
    };
})((globalThis.dji.tts_service = globalThis.dji.tts_service || {}));
