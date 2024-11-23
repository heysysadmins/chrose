window.sru = window.sru || {};
(function (k) {
    function C(a, d, c) {
        if (a && 0 != a.length)
            for (
                var e, h = d ? r.directories : r.outlines, g = 0;
                g < a.length;
                g++
            )
                (d = a[g]),
                    (e = h[d.uuid]),
                    c
                        ? e && (e.deleted = !0)
                        : (e ||
                              ((e = {
                                  uuid: d.uuid,
                                  creationDate: d.creationDate,
                              }),
                              (h[d.uuid] = e)),
                          (e.parentUuid = d.parentUuid),
                          (e.title = d.title || "Untitled"),
                          (e.modifiedDate = d.modifiedDate));
    }
    function J(a, d) {
        if (a && 0 != a.length)
            for (var c, e, h = r.topics, g = 0; g < a.length; g++)
                (c = a[g]),
                    (e = h[c.uuid]),
                    d
                        ? e && (e.deleted = !0)
                        : (e ||
                              ((e = {
                                  uuid: c.uuid,
                                  outlineUuid: c.outlineUuid,
                                  creationDate: c.creationDate,
                                  linkedSources: {},
                              }),
                              (h[c.uuid] = e)),
                          (e.parentUuid = c.parentUuid),
                          (e.location = c.location),
                          (e.body = c.body),
                          (e.modifiedDate = c.modifiedDate));
    }
    function K(a, d) {
        if (a && 0 != a.length)
            for (var c, e, h = r.sources, g = 0; g < a.length; g++)
                (c = a[g]),
                    (e = h[c.uuid]),
                    d
                        ? e && (e.deleted = !0)
                        : (e ||
                              ((e = {
                                  uuid: c.uuid,
                                  outlineUuid: c.outlineUuid,
                                  creationDate: c.creationDate,
                                  boundToOutline: c.boundToOutline,
                                  fromHighlight: c.fromHighlight,
                              }),
                              (h[c.uuid] = e)),
                          (e.data = c.data),
                          (e.modifiedDate = c.modifiedDate));
    }
    function L(a, d) {
        if (a && 0 != a.length)
            for (var c, e, h, g, f = r.topics, l = 0; l < a.length; l++) {
                c = a[l];
                h = c.sourcesUuids;
                c = f[c.topicUuid];
                e = c.linkedSources;
                for (var q = 0; q < h.length; q++)
                    if (d) {
                        if ((g = e[h[q]])) g.deleted = !0;
                    } else
                        (g = e[h[q]] || {}),
                            (g.modifiedDate = c.modifiedDate),
                            delete g.deleted,
                            (e[h[q]] = g);
            }
    }
    function M(a, d) {
        if (a && 0 != a.length) {
            for (var c, e, h = r.images, g = [], f = 0; f < a.length; f++)
                (c = a[f]),
                    (e = h[c.uuid]),
                    d
                        ? e && ((e.deleted = !0), g.push(e.uuid))
                        : (e ||
                              ((e = {
                                  uuid: c.uuid,
                                  checksum: c.checksum,
                                  creationDate: c.creationDate,
                                  body: dji.utils.toArrayBuffer(c.body),
                              }),
                              (h[e.uuid] = e),
                              g.push(e)),
                          (e.modifiedDate = c.modifiedDate));
            return g;
        }
    }
    function N() {
        b = {
            color: {
                text: "#000000",
                sentenceHighlight: "#FF0000",
                wordHighlight: "#00FF00",
            },
            readingGuide: {overlay: "#99CCCC", lineGuide: "#FFFFCC"},
            speech: {
                voice: dji.tts.defaultVoice(),
                autoSpeak: 1,
                volume: 100,
                rate: 100,
                pitch: 100,
            },
            rewordify: {enable: !0, level: "1", fluencyLevel: 1},
            measurements: {showReadability: !1},
            translation: {
                enable: !0,
                language: {name: "English", abbr: "en"},
                translationVoice: "",
            },
            pdf: {autoOpen: !1, userDefined: !1, app: null},
            defineWord: {openOnDoubleClick: !1, userDefined: !1},
            __fileInfo: {},
            __data: {},
        };
        b.__fileInfo.creationDate = b.__fileInfo.modifiedDate = Date.now();
        b.__fileInfo.modifiedUuid = dji.utils.generateUUID();
        b.__fileInfo.version = 0;
        F();
        p = {current: {}, history: {}};
        r = {
            version: 1,
            directories: {},
            outlines: {},
            topics: {},
            sources: {},
            images: {},
        };
        z = null;
        A = {};
    }
    function m(a) {
        var d = y;
        a ||
            (G(),
            (b.__fileInfo.modifiedDate = Date.now()),
            (b.__fileInfo.modifiedUuid = dji.utils.generateUUID()));
        dji.fileSystem.persistent.writeFile(
            n.settingsFileName,
            JSON.stringify(b, null, "  "),
            function () {
                a ||
                    d !== y ||
                    (G(),
                    (u.settings.timer = setTimeout(T, u.settings.timeout)));
            },
        );
    }
    function H(a) {
        dji.fileSystem.persistent.writeFile(
            n.measurementsFileName,
            JSON.stringify(p),
            a,
        );
    }
    async function D(a, d, c) {
        var e = y;
        c || B();
        let h = JSON.parse(JSON.stringify(r)),
            g = h.images;
        for (var f in g) delete g[f].body;
        h = JSON.stringify(h, null, "  ");
        await dji.fileSystem.persistent.writeFileAsText(n.outlinesFileName, h);
        c ||
            e !== y ||
            (B(), (u.outlines.timer = setTimeout(U, u.outlines.timeout)));
        (a || d) && (await V(a, d));
    }
    async function V(a, d) {
        if (a)
            for (let h = 0; h < a.length; h++) {
                var c = a[h];
                if (c) {
                    var e = n.imagesDir + "/" + c.uuid;
                    try {
                        await dji.fileSystem.persistent.writeFileAsync(
                            e,
                            c.body,
                        );
                    } catch (g) {
                        dji.logger.error(g);
                    }
                }
            }
        if (d)
            for (a = 0; a < d.length; a++)
                try {
                    (e = n.imagesDir + "/" + d[a]),
                        await dji.fileSystem.persistent.removeFileAsync(e);
                } catch (h) {
                    dji.logger.error(h);
                }
    }
    function W(a) {
        dji.fileSystem.persistent.readFile(n.settingsFileName, function (d) {
            if (d && 0 < d.length) {
                try {
                    b = JSON.parse(d);
                    if (null === b.translation || void 0 === b.translation)
                        b.translation = {
                            language: {name: "English", abbr: "en"},
                            translationVoice: "",
                            enable: !1,
                        };
                    if (
                        null === b.translation.enable ||
                        void 0 === b.translation.enable
                    )
                        b.translation.enable =
                            b.translation.language &&
                            b.translation.language.name &&
                            "ENGLISH" !=
                                b.translation.language.name.toUpperCase();
                    b.__data &&
                        b.__data.common &&
                        b.__data.common.translation &&
                        delete b.__data.common.translation;
                    b.measurements || (b.measurements = {showReadability: !1});
                    b.pdf ||
                        (b.pdf = {autoOpen: !1, userDefined: !1, app: null});
                    b.defineWord ||
                        (b.defineWord = {
                            openOnDoubleClick: !1,
                            userDefined: !1,
                        });
                    b.readingGuide ||
                        (b.readingGuide = {
                            overlay: "#99CCCC",
                            lineGuide: "#FFFFCC",
                        });
                } catch (c) {
                    dji.logger.error(c);
                }
                F();
                O();
            }
            b.hasOwnProperty("__privacyMode") || (b.__privacyMode = !1);
            b.__privacyMode
                ? dji.fileSystem.persistent.readFile(
                      n.measurementsFileName,
                      function (c) {
                          if (c && 0 < c.length)
                              try {
                                  (p = JSON.parse(c)), P();
                              } catch (e) {
                                  dji.logger.error(e);
                              }
                          Q(a);
                      },
                  )
                : Q(a);
        });
    }
    function Q(a) {
        dji.fileSystem.persistent.readFile(
            n.outlinesFileName,
            async function (d) {
                if (d && 0 < d.length)
                    try {
                        d = JSON.parse(d);
                        d.hasOwnProperty("version") && (r = d);
                        d.images = d.images || {};
                        var c = d.outlines;
                        if (c)
                            for (var e in c)
                                if (c.hasOwnProperty(e)) {
                                    var h = c[e];
                                    h.title || (h.title = "Untitled");
                                }
                        var g = d.topics;
                        if (g)
                            for (var f in g)
                                if (g.hasOwnProperty(f)) {
                                    var l = g[f].linkedSources;
                                    if (l)
                                        for (var q in l)
                                            l.hasOwnProperty(q) &&
                                                ((d.sources &&
                                                    d.sources.hasOwnProperty(
                                                        q,
                                                    )) ||
                                                    delete l[q]);
                                }
                        var t = d.images;
                        if (t)
                            for (var v in t) {
                                let E = t[v];
                                var w =
                                    await dji.fileSystem.persistent.readFileAsArrayBufferAsync(
                                        n.imagesDir + "/" + E.uuid,
                                    );
                                w ? (E.body = w) : delete t[v];
                            }
                    } catch (E) {
                        dji.logger.error(E);
                    }
                x(a);
            },
        );
    }
    function F() {
        dji.tts.hasVoice(b.speech.voice) ||
            (b.speech.voice = dji.tts.defaultVoice());
        k.settings.translationEnabled() &&
            !dji.tts.hasVoice(b.translation.translationVoice) &&
            (b.translation.translationVoice = dji.tts.defaultVoiceForLanguage(
                b.translation.language.abbr,
            ));
    }
    function O() {
        let a = !1;
        switch (b.rewordify.level) {
            case "E":
                b.rewordify.level = "1";
                a = !0;
                break;
            case "1":
            case "2":
            case "3":
            case "4":
            case "H":
                break;
            case "5":
                b.rewordify.level = "H";
                a = !0;
                break;
            default:
                (b.rewordify.level = "1"), (a = !0);
        }
        if (null === b.rewordify.enable || void 0 === b.rewordify.enable)
            a = b.rewordify.enable = !0;
        a &&
            ((b.__fileInfo.modifiedDate = Date.now()),
            (b.__fileInfo.modifiedUuid = dji.utils.generateUUID()));
    }
    function G() {
        u.settings.timer &&
            (clearTimeout(u.settings.timer), (u.settings.timer = null));
    }
    function B() {
        u.outlines.timer &&
            (clearTimeout(u.outlines.timer), (u.outlines.timer = null));
    }
    function R() {
        let a;
        b.__data
            ? ((a = JSON.parse(JSON.stringify(b.__data))),
              (a.common = a.common || {}),
              (a.platform = a.platform || {}),
              (a.platform.chrome = a.platform.chrome || {}))
            : (a = {common: {}, platform: {chrome: {}}});
        a.common.color = b.color;
        a.common.translationLanguage = b.translation.language;
        a.common.translationEnable = b.translation.enable;
        a.common.speech = a.common.speech || {};
        a.common.speech.autoSpeak = b.speech.autoSpeak;
        var d = a.common.rewordify || {};
        d.level = b.rewordify.level;
        d.enable = b.rewordify.enable;
        a.common.rewordify = d;
        d = a.common.pdf || {};
        d.autoOpen = b.pdf.autoOpen;
        d.userDefined = b.pdf.userDefined;
        a.common.pdf = d;
        d = a.common.defineWord || {};
        d.openOnDoubleClick = b.defineWord.openOnDoubleClick;
        d.userDefined = b.defineWord.userDefined;
        a.common.defineWord = d;
        d = a.common.readingGuide || {};
        d.overlay = b.readingGuide.overlay;
        d.lineGuide = b.readingGuide.lineGuide;
        a.common.readingGuide = d;
        d = a.common.measurements || {};
        d.showReadability = !!b.measurements.showReadability;
        a.common.measurements = d;
        d = a.platform.chrome[I.name] || {};
        let c = d.speech || {};
        c.voice = b.speech.voice;
        c.volume = b.speech.volume;
        c.rate = b.speech.rate;
        c.pitch = b.speech.pitch;
        d.speech = c;
        d.translationVoice = b.translation.translationVoice;
        a.platform.chrome[I.name] = d;
        return (a = JSON.stringify(a));
    }
    function T() {
        var a = R();
        sru.sync.enqueueUserSettings(b.__fileInfo, a);
    }
    function P() {
        for (var a in p.history)
            if (p.history.hasOwnProperty(a)) {
                var d = p.history[a],
                    c = p.current[a];
                c || ((c = {}), (p.current[a] = c));
                for (var e in d) {
                    var h = d[e],
                        g = c[e];
                    if (g) {
                        h.timeSpent += g.timeSpent;
                        for (var f in g)
                            "timeSpent" !== f &&
                                g.hasOwnProperty(f) &&
                                (h[f] = g[f]);
                    }
                    c[e] = h;
                }
            }
        p.history = {};
    }
    async function U() {
        B();
        var a = sru.userData.helper.syncPrepareOutlinesUpdate(r, {}, !1);
        if (a && (a.save && D(null, null, !0), a.data)) {
            if (a.data.update && a.data.update.images) {
                for (let d = 0; d < a.data.update.images.length; d++)
                    sru.sync.enqueueImage(a.data.update.images[d]);
                delete a.data.update.images;
            }
            sru.sync.enqueueOutlinesData(a.data);
        }
    }
    function x(a) {
        if (a)
            try {
                a.apply(this, [].slice.call(arguments).splice(1));
            } catch (d) {
                dji.logger.error(d);
            }
    }
    var I = dji.utils.os(),
        y = dji.utils.generateUUID(),
        S = {},
        b = {
            color: {
                text: "#000000",
                sentenceHighlight: "#FF0000",
                wordHighlight: "#00FF00",
            },
            readingGuide: {overlay: "#99CCCC", lineGuide: "#FFFFCC"},
            speech: {
                voice: "",
                autoSpeak: 1,
                volume: 100,
                rate: 100,
                pitch: 100,
            },
            rewordify: {enable: !0, level: "1", fluencyLevel: 1},
            measurements: {showReadability: !1},
            translation: {
                enable: !0,
                language: {name: "English", abbr: "en"},
                translationVoice: "",
            },
            pdf: {autoOpen: !1, userDefined: !1},
            defineWord: {openOnDoubleClick: !1, userDefined: !1},
            __fileInfo: {},
            __data: {},
            __privacyMode: !1,
        },
        p = {current: {}, history: {}},
        r = {
            version: 1,
            directories: {},
            outlines: {},
            topics: {},
            sources: {},
            images: {},
        };
    var z = null;
    var A = {};
    var n = {
            userDir: "/Users/Demo",
            settingsFileName: "/Users/Demo/settings.txt",
            measurementsFileName: "/Users/Demo/measurements.txt",
            outlinesFileName: "/Users/Demo/outlines.txt",
            imagesDir: "User/Images/",
        },
        u = {
            settings: {timeout: 300, timer: null},
            outlines: {timeout: 1e3, timer: null},
        };
    k.initialize = function (a, d) {
        y = dji.utils.generateUUID();
        n.userDir = a ? "/Users/" + a : null;
        n.settingsFileName = a ? n.userDir + "/settings.txt" : null;
        n.measurementsFileName = a ? n.userDir + "/measurements.txt" : null;
        n.outlinesFileName = a ? n.userDir + "/outlines.txt" : null;
        n.imagesDir = a ? n.userDir + "/Images" : null;
        N();
        z = "notification-" + a;
        try {
            var c = localStorage[z];
            c && (c = JSON.parse(localStorage[z])) && (A = c);
        } catch (e) {}
        a
            ? dji.fileSystem.persistent.createDirectory(
                  n.userDir,
                  function (e) {
                      dji.fileSystem.persistent.createDirectory(
                          n.imagesDir,
                          function (h) {
                              W(d);
                          },
                      );
                  },
              )
            : x(d);
    };
    k.uninitialize = function (a, d) {
        var c = a ? "/Users/" + a : n.userDir;
        a ||
            (G(),
            B(),
            (n.userDir = null),
            (n.settingsFileName = null),
            (y = dji.utils.generateUUID()),
            N());
        c ? dji.fileSystem.persistent.removeDirectory(c, d) : d && x(d);
    };
    k.dump = function () {
        dji.logger.dump(
            "****************** _data.dump BEGIN ************************\n" +
                JSON.stringify(r, null, "    ") +
                "****************** _data.dump END ************************\n",
        );
    };
    k.runtime = {};
    k.runtime.notification = function (a, d) {
        if (a)
            if (d) (A[a] = d), (localStorage[z] = JSON.stringify(A));
            else return A[a];
    };
    k.settings = {};
    k.settings.colors = function () {
        return b.color;
    };
    k.settings.textColor = function (a) {
        if (a) b.color.text != a && ((b.color.text = a), m());
        else return b.color.text;
    };
    k.settings.sentenceHighlightColor = function (a) {
        if (a)
            b.color.sentenceHighlight != a &&
                ((b.color.sentenceHighlight = a), m());
        else return b.color.sentenceHighlight;
    };
    k.settings.wordHighlightColor = function (a) {
        if (a) b.color.wordHighlight != a && ((b.color.wordHighlight = a), m());
        else return b.color.wordHighlight;
    };
    k.settings.overlayColor = function (a) {
        if (void 0 !== a)
            b.readingGuide.overlay != a && ((b.readingGuide.overlay = a), m());
        else return b.readingGuide.overlay;
    };
    k.settings.lineGuideColor = function (a) {
        if (void 0 !== a)
            b.readingGuide.lineGuide != a &&
                ((b.readingGuide.lineGuide = a), m());
        else return b.readingGuide.lineGuide;
    };
    k.settings.speechVoice = function (a) {
        if (a) b.speech.voice != a && ((b.speech.voice = a), m());
        else return b.speech.voice;
    };
    k.settings.speechAuto = function (a) {
        if (null !== a && void 0 !== a)
            b.speech.autoSpeak != a && ((b.speech.autoSpeak = a), m());
        else return b.speech.autoSpeak;
    };
    k.settings.speechVolume = function (a) {
        if (null !== a && void 0 !== a)
            b.speech.volume != a && ((b.speech.volume = a), m());
        else return b.speech.volume;
    };
    k.settings.speechRate = function (a) {
        if (null !== a && void 0 !== a)
            b.speech.rate != a && ((b.speech.rate = a), m());
        else return b.speech.rate;
    };
    k.settings.speechPitch = function (a) {
        if (null !== a && void 0 !== a)
            b.speech.pitch != a && ((b.speech.pitch = a), m());
        else return b.speech.pitch;
    };
    k.settings.speech = function () {
        return b.speech;
    };
    k.settings.rewordifyLevel = function (a) {
        if (null !== a && void 0 !== a)
            b.rewordify.level != a && ((b.rewordify.level = a), m());
        else return b.rewordify.level;
    };
    k.settings.rewordifyFluency = function (a) {
        if (null !== a && void 0 !== a)
            b.rewordify.fluencyLevel != a &&
                ((b.rewordify.fluencyLevel = a), m());
        else return b.rewordify.fluencyLevel;
    };
    k.settings.enableRewordify = function (a) {
        if (null !== a && void 0 !== a)
            b.rewordify.enable !== a && ((b.rewordify.enable = a), m());
        else return b.rewordify.enable;
    };
    k.settings.showReadability = function (a) {
        if (null !== a && void 0 !== a)
            b.measurements.showReadability !== a &&
                ((b.measurements.showReadability = !!a), m());
        else return !!b.measurements.showReadability;
    };
    k.settings.translationEnabled = function () {
        return !!b.translation.enable;
    };
    k.settings.enableTranslation = function (a) {
        if (null !== a && void 0 !== a)
            b.translation.enable !== a && ((b.translation.enable = a), m());
        else return b.translation.enable;
    };
    k.settings.translationLanguage = function (a) {
        if (null !== a && void 0 !== a)
            b.translation.language != a && ((b.translation.language = a), m());
        else return b.translation.language;
    };
    k.settings.translationVoice = function (a) {
        if (a)
            b.translation.translationVoice != a &&
                ((b.translation.translationVoice = a), m());
        else return b.translation.translationVoice;
    };
    k.settings.translation = function () {
        return b.translation;
    };
    k.settings.pdfAutoOpen = function (a) {
        if (null !== a && void 0 !== a)
            b.pdf.autoOpen !== a && ((b.pdf.autoOpen = a), m());
        else return b.pdf.autoOpen;
    };
    k.settings.pdfUserDefined = function (a) {
        if (null !== a && void 0 !== a)
            b.pdf.userDefined !== a && ((b.pdf.userDefined = a), m());
        else return b.pdf.userDefined;
    };
    k.settings.openOnDoubleClick = function (a) {
        if (null != a && void 0 != a)
            b.defineWord.openOnDoubleClick != a &&
                ((b.defineWord.openOnDoubleClick = a), m());
        else return b.defineWord.openOnDoubleClick;
    };
    k.settings.defineWordUserDefined = function (a) {
        if (null !== a && void 0 !== a)
            b.defineWord.userDefined != a &&
                ((b.defineWord.userDefined = a), m());
        else return b.defineWord.userDefined;
    };
    k.privacyMode = function (a) {
        if (!a) return b.__privacyMode;
        b.__privacyMode = a;
    };
    k.measurements = {};
    k.measurements.update = function (a, d, c, e) {
        if (b.__privacyMode) return x(e, null);
        d = d || dji.utils.generateUUID();
        var h = p.current[a];
        h || ((h = {}), (p.current[a] = h));
        if ((a = h[d])) {
            a.timeSpent += c.timeSpent;
            for (var g in c)
                "timeSpent" !== g && c.hasOwnProperty(g) && (a[g] = c[g]);
        } else h[d] = c;
        H(function () {
            x(e, d);
        });
    };
    k.outlines = {};
    k.outlines.all = function (a) {
        var d = {
                directories: [],
                outlines: [],
                topics: [],
                sources: [],
                images: [],
            },
            c,
            e;
        a = a || r;
        var h = d.directories;
        var g = a.directories;
        for (c in g) {
            var f = g[c];
            if (!f.deleted) {
                var l = {
                    uuid: f.uuid,
                    parentUuid: f.parentUuid,
                    title: f.title,
                    creationDate: f.creationDate,
                    modifiedDate: f.modifiedDate,
                };
                h.push(l);
            }
        }
        h = d.outlines;
        g = a.outlines;
        for (c in g)
            (f = g[c]),
                f.deleted ||
                    ((l = {
                        uuid: f.uuid,
                        parentUuid: f.parentUuid,
                        title: f.title,
                        creationDate: f.creationDate,
                        modifiedDate: f.modifiedDate,
                    }),
                    h.push(l));
        h = d.topics;
        g = a.topics;
        for (c in g)
            if (((f = g[c]), !f.deleted)) {
                l = {
                    uuid: f.uuid,
                    outlineUuid: f.outlineUuid,
                    parentUuid: f.parentUuid,
                    location: f.location,
                    body: f.body,
                    creationDate: f.creationDate,
                    modifiedDate: f.modifiedDate,
                    sourcesUuids: [],
                };
                for (e in f.linkedSources) {
                    var q = f.linkedSources[e];
                    q.deleted || l.sourcesUuids.push(e);
                }
                h.push(l);
            }
        h = d.sources;
        g = a.sources;
        for (c in g)
            (f = g[c]),
                f.deleted ||
                    ((l = {
                        uuid: f.uuid,
                        outlineUuid: f.outlineUuid,
                        boundToOutline: f.boundToOutline,
                        fromHighlight: f.fromHighlight,
                        data: f.data,
                        creationDate: f.creationDate,
                        modifiedDate: f.modifiedDate,
                    }),
                    h.push(l));
        h = d.images;
        g = a.images;
        for (c in g)
            (f = g[c]),
                f.deleted ||
                    ((l = {
                        uuid: f.uuid,
                        checksum: f.checksum,
                        body: dji.utils.toUint8Array(f.body),
                        creationDate: f.creationDate,
                        modifiedDate: f.modifiedDate,
                    }),
                    h.push(l));
        return d;
    };
    k.outlines.updateDataFromUI = function (a) {
        let d = null,
            c = null;
        a.update &&
            (C(a.update.directories, !0, !1),
            C(a.update.outlines, !1, !1),
            J(a.update.topics, !1),
            K(a.update.sources, !1),
            L(a.update.topicsSources, !1),
            (d = M(a.update.images, !1)));
        a["delete"] &&
            (C(a["delete"].directories, !0, !0),
            C(a["delete"].outlines, !1, !0),
            J(a["delete"].topics, !0),
            K(a["delete"].sources, !0),
            L(a["delete"].topicsSources, !0),
            (c = M(a["delete"].images, !0)));
        (a.update || a["delete"]) && D(d, c, !1);
    };
    k.syncUpdatePrivacyMode = function (a) {
        return b.__privacyMode !== a
            ? (dji.logger.log("__syncUpdatePrivacyMode", a, "has changed"),
              (b.__privacyMode = a) && (p = {current: {}, history: {}}),
              m(!0),
              !0)
            : !1;
    };
    k.syncCheckSettingsUpdate = function (a) {
        return a
            ? b.__fileInfo.version < a.version
                ? sru.sync.ActionType.Download
                : a.modifiedDate < b.__fileInfo.modifiedDate
                  ? sru.sync.ActionType.Upload
                  : sru.sync.ActionType.None
            : sru.sync.ActionType.Upload;
    };
    k.syncNeedSettingsData = function () {
        return {fileInfo: JSON.parse(JSON.stringify(b.__fileInfo)), data: R()};
    };
    k.syncSaveSettingsData = function (a, d) {
        if (a || d) {
            a &&
                ((b.__fileInfo.creationDate = a.creationDate),
                (b.__fileInfo.modifiedDate = a.modifiedDate),
                (b.__fileInfo.modifiedUuid = a.modifiedUuid),
                (b.__fileInfo.version = a.version));
            if (d) {
                var c = d.common || {};
                let g = c.color || {},
                    f = c.rewordify || {},
                    l = c.measurements || {},
                    q = c.speech || {};
                let t = c.pdf || {},
                    v = c.defineWord || {},
                    w = c.readingGuide || {};
                a = c.translationEnable;
                if (c.translationLanguage) var e = c.translationLanguage;
                c = d.platform || {};
                c = c.chrome || {};
                c = c[I.name] || {};
                if (c.translationVoice) var h = c.translationVoice;
                c = c.speech || {};
                b.color.text = g.text || b.color.text;
                b.color.sentenceHighlight =
                    g.sentenceHighlight || b.color.sentenceHighlight;
                b.color.wordHighlight =
                    g.wordHighlight || b.color.wordHighlight;
                null !== q.autoSpeak &&
                    void 0 !== q.autoSpeak &&
                    (b.speech.autoSpeak = q.autoSpeak);
                b.speech.voice = c.voice || b.speech.voice;
                null !== c.volume &&
                    void 0 !== c.volume &&
                    (b.speech.volume = c.volume);
                null !== c.rate &&
                    void 0 !== c.rate &&
                    (b.speech.rate = c.rate);
                null !== c.pitch &&
                    void 0 !== c.pitch &&
                    (b.speech.pitch = c.pitch);
                null !== f.level &&
                    void 0 !== f.level &&
                    (b.rewordify.level = "1");
                null !== f.fluencyLevel &&
                    void 0 !== f.fluencyLevel &&
                    (b.rewordify.fluencyLevel = f.fluencyLevel);
                null !== f.enable &&
                    void 0 !== f.enable &&
                    (b.rewordify.enable = f.enable);
                null !== t.autoOpen &&
                    void 0 !== t.autoOpen &&
                    (b.pdf.autoOpen = t.autoOpen);
                null !== t.userDefined &&
                    void 0 !== t.userDefined &&
                    (b.pdf.userDefined = t.userDefined);
                null !== v.openOnDoubleClick &&
                    void 0 !== v.userDefined &&
                    (b.defineWord.openOnDoubleClick = v.openOnDoubleClick);
                null !== v.userDefined &&
                    void 0 !== v.userDefined &&
                    (b.defineWord.userDefined = v.userDefined);
                void 0 !== w.overlay && (b.readingGuide.overlay = w.overlay);
                void 0 !== w.lineGuide &&
                    (b.readingGuide.lineGuide = w.lineGuide);
                null !== l.showReadability &&
                    void 0 !== l.showReadability &&
                    (b.measurements.showReadability = l.showReadability);
                h && 50 < h
                    ? ((b.translation = {
                          language: {name: "English", abbr: "en"},
                          translationVoice: "",
                      }),
                      dji.logger.warn(
                          "syncSaveUserSettings: reset translation because of invalid translate voice!",
                      ))
                    : (null !== e &&
                          void 0 !== e &&
                          (b.translation.language = e),
                      null !== h &&
                          void 0 !== h &&
                          (b.translation.translationVoice = h));
                b.translation.enable = a;
                d.common && d.common.translation && delete d.common.translation;
                F();
                O();
                b.__data = d;
            }
            m(!0);
        }
    };
    k.syncNeedMeasurementsData = function (a) {
        var d = !1;
        if (!b.__privacyMode)
            for (var c in p.current)
                if (p.current.hasOwnProperty(c)) {
                    d = !0;
                    break;
                }
        if (d) {
            var e = (p.history = p.current);
            p.current = {};
            H(function () {
                x(a, e);
            });
        } else x(a, null);
    };
    k.syncMeasurementsFinished = function (a, d) {
        a ? (p.history = {}) : P();
        H(d);
    };
    k.syncCheckOutlinesUpdate = function (a) {
        B();
        return (a = sru.userData.helper.syncPrepareOutlinesUpdate(r, a, !0))
            ? (a.save &&
                  D(
                      null,
                      a.deleted && a.deleted.images ? a.deleted.images : null,
                      !0,
                  ),
              a)
            : null;
    };
    k.syncSaveOutlinesData = function (a) {
        (a = sru.userData.helper.syncPrepareOutlinesSave(r, a)) &&
            a.save &&
            D(
                a.downloaded && a.downloaded.images
                    ? a.downloaded.images
                    : null,
                null,
                !0,
            );
        return a;
    };
    (function () {
        var a = new XMLHttpRequest();
        a.open(
            "GET",
            chrome.extension.getURL("resources/data/outline-template.json"),
            !0,
        );
        a.onreadystatechange = function () {
            if (a.readyState == XMLHttpRequest.DONE && 200 == a.status) {
                var d = a.responseText;
                try {
                    S = JSON.parse(d);
                } catch (c) {
                    dji.logger.error("Error: ", c);
                }
            }
        };
        a.send();
    })();
    k.outlineTemplates = function () {
        return S;
    };
})((window.sru.userData = window.sru.userData || {}));
