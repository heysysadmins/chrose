window.sru = window.sru || {};
window.dji = window.dji || {};
(function () {
    async function t() {
        window !== window.top ||
            dji.utils.isLoginApp() ||
            (await dji.utils.waitDOMContentLoaded(),
            chrome.runtime.sendMessage(
                {
                    message:
                        window.dji.messages.sru.content_script
                            .RESTRICTIONS_READY,
                    params: {url: window.location},
                },
                function (a) {
                    dji.utils.ignoreLastError();
                    a && a.params.allowed
                        ? chrome.runtime.sendMessage(
                              {
                                  message:
                                      window.dji.messages.sru.content_script
                                          .CSS_READY,
                                  params: {url: window.location},
                              },
                              function (b) {
                                  dji.utils.ignoreLastError();
                                  b && b.params.allowed
                                      ? (window.dji.ui.effects.initialize(),
                                        sru.mainContainer.initialize(J))
                                      : dji.logger.warning(
                                            `${chrome.runtime.getManifest().name} not allowed by CSS!`,
                                        );
                              },
                          )
                        : dji.logger.warning(
                              `${chrome.runtime.getManifest().name} restricted!`,
                          );
                },
            ));
    }
    async function J() {
        dji.shortcuts.initialize();
        sru.toolbar.initialize();
        sru.toolbar.addEventListener("speak", K);
        sru.toolbar.addEventListener("screenshot", v);
        sru.toolbar.addEventListener("rewordify", w);
        sru.toolbar.addEventListener("translate", x);
        sru.toolbar.addEventListener("showOutlines", L);
        sru.toolbar.addEventListener("highlight", M);
        sru.toolbar.addEventListener("overlay", y);
        sru.toolbar.addEventListener("wordBank", N);
        await sru.removeDistractions.initialize();
        sru.removeDistractions.addEventListener("analytics", O);
        sru.outlines.initialize();
        sru.outlines.addEventListener("searchSources", P);
        sru.outlines.addEventListener("options", Q);
        sru.outlines.addEventListener("signOut", R);
        sru.outlines.addEventListener("activateHighlightChange", S);
        sru.outlines.addEventListener("outlineOpened", T);
        sru.outlines.addEventListener("outlineModified", U);
        sru.outlines.addEventListener("outlineTextAdded", V);
        sru.outlines.addEventListener("sourcesOpened", W);
        sru.outlines.addEventListener("sourcesDownloaded", X);
        sru.outlines.setDelegate("pageContextRequired", Y);
        sru.outlinesDataManager.addEventListener("dataUpdated", Z);
        sru.outlinesDataManager.addEventListener("uiPathUpdated", aa);
        sru.speech.addEventListener("activate", ba);
        sru.speech.addEventListener("start", z);
        sru.speech.addEventListener("stop", A);
        sru.speech.addEventListener("analytics", ca);
        sru.screenSelection.initialize();
        sru.screenSelection.addEventListener("activate", da);
        sru.screenSelection.addEventListener("deactivate", ea);
        sru.screenSelection.addEventListener("selectionDone", fa);
        sru.screenSelection.addEventListener("resultsProcessed", ha);
        sru.screenSelection.addEventListener("analytics", ia);
        dji.rewordify.initialize(u);
        dji.rewordify.addEventListener("ACTIVATE", ja);
        dji.rewordify.addEventListener("DEACTIVATE", ka);
        l.isPdf &&
            (sru.helpers.pdfViewer.addEventListener("newTextAvailable", la),
            sru.helpers.pdfViewer.addEventListener("pageChangedInPdf", ma),
            sru.helpers.pdfViewer.addEventListener(
                "textAvailableForPageInPdf",
                na,
            ),
            sru.helpers.pdfViewer.addEventListener("pdfDocumentChanged", oa));
        dji.translate.initialize();
        dji.translate.addEventListener("translateFromToolbar", pa);
        dji.translate.addEventListener("translateDone", qa);
        dji.translate.addEventListener("activate", ra);
        dji.translate.addEventListener("deactivate", sa);
        dji.translate.addEventListener("cursorChange", ta);
        dji.translate.addEventListener("analytics", ua);
        dji.translate.setDelegate(
            "pageContextRequired",
            async () => await q("translate"),
        );
        sru.overlay.initialize();
        sru.overlay.addEventListener("showButton", va);
        sru.overlay.addEventListener("analytics", wa);
        await sru.defineWord.initialize();
        sru.defineWord.addEventListener("activate", xa);
        sru.defineWord.addEventListener("enable", ya);
        await sru.citations.initialize();
        chrome.runtime.onMessage.addListener(za);
        window.addEventListener("message", Aa, !0);
        window.addEventListener("message", (a) => {
            null != a.data &&
                "LOAD_PDF_EXTENSION" === a.data.sender &&
                chrome.runtime.sendMessage(
                    {
                        message: "com.snapandread.app.download-file.orbitnote",
                        options: {url: a.data.url},
                    },
                    async (b) => {
                        b.url &&
                            ((b = await (await fetch(b.url)).blob()),
                            window.postMessage(
                                {type: "PDF_FILE_LOAD", text: b},
                                "*",
                            ));
                    },
                );
        });
        dji.selectionMapper.addSelectionEventListener("selectionDone", Ba);
        B(!0);
        e(window.dji.messages.sru.content_script.READY, {uuid: g});
    }
    function Aa(a) {
        a.data &&
            a.data.hasOwnProperty("message") &&
            a.data.message ===
                window.dji.utils.MessageProxy.MSG_SRV_AVAILABLE &&
            Ca(a);
    }
    function Da(a, b) {
        return "ms-office-word-editor" === a
            ? "sru-frame-manager" === b
            : "over-drive-reader" === a || "canvas-lms" === a;
    }
    function Ca(a) {
        if (a.source && a.data.service && Da(a.data.service, a.data.key)) {
            const b = new MessageChannel(),
                d = new window.dji.utils.MessageProxy(
                    `CSM::${a.data.service}`,
                    {wnd: a.source, port: b.port1, service: a.data.service},
                );
            h.set(d.uuid, {proxy: d, channel: b});
            d.on(window.dji.messages.sru.tts.START, function (f, k) {
                z(k, this.uuid);
            });
            d.on(window.dji.messages.sru.tts.STOP, function (f) {
                A();
            });
            d.on("com.donjohnston.sru.rewordify.process", function (f, k, p) {
                C(k, p);
            });
            d.on("com.donjohnston.sru.translate.selectiondone", function (f) {
                dji.translate.start();
            });
            d.on("com.donjohnston.sru.outlines.selectiondone", function (f) {
                sru.outlines.createTopicFromHighlight();
            });
            a.source.postMessage(
                {
                    isTrusted: !0,
                    message:
                        window.dji.utils.MessageProxy.MSG_SRV_AVAILABLE_ACK,
                    timestamp: Date.now(),
                    service: a.data.service,
                    checksum: a.data.checksum,
                },
                "*",
                [b.port2],
            );
            d.enable(!0);
            d.ping();
        }
    }
    function D(a) {
        n("com.donjohnston.sru.translate.activation.change", void 0, a);
    }
    function n(a) {
        for (let [, b] of h)
            b && b.proxy && b.proxy.send(a, ...[].slice.call(arguments, 1));
    }
    function za(a, b, d) {
        if (a.message) return E(a.message, d);
        dji.logger.log("Request: " + JSON.stringify(a));
    }
    function E(a, b) {
        if (a.message == window.dji.messages.sru.tts.PROGRESS) Ea(a.params);
        else if (a.message === window.dji.messages.sru.BACKGROUND_READY)
            B(!0),
                m.postMessage({
                    message: window.dji.messages.sru.content_script.READY,
                    params: {uuid: g},
                });
        else if (a.message === window.dji.messages.sru.SIGNIN)
            sru.defineWord.addListeners();
        else if (a.message === window.dji.messages.sru.SIGNOUT)
            sru.defineWord.removeListeners(), F();
        else if (a.message === window.dji.messages.sru.USER)
            a.params.isLoggedIn
                ? sru.defineWord.addListeners()
                : sru.defineWord.removeListeners(),
                sru.toolbar.enableWordBankButton(a.params.enableWB);
        else if (a.message === window.dji.messages.sru.ACTIVATE_EXTENSION)
            Fa(a.params.active),
                sru.mainContainer.show(a.params.active),
                a.params.active
                    ? (sru.outlines.outlineTemplates(a.params.outlineTemplates),
                      l.isPdf &&
                          window.dispatchEvent(new Event("dji.pdf.discover")))
                    : (sru.speech.stop(),
                      dji.rewordify.deactivate(),
                      dji.translate.activate(!1),
                      sru.removeDistractions.active() &&
                          sru.removeDistractions.activate(),
                      sru.defineWord.isActive() && sru.defineWord.hide(),
                      sru.defineWord.removeListeners(),
                      sru.toolbar.isHighlightActive() &&
                          sru.toolbar.disableHighlight(),
                      sru.screenSelection.activate(!1),
                      sru.outlines.setData(null, null),
                      sru.overlay.isActive() && y());
        else if (a.message == window.dji.messages.sru.SETTINGS) {
            var d = a.params.translationEnabled
                ? a.params.translationLanguage.name
                : null;
            dji.selectionMapper.setColors(
                a.params.colors.text,
                a.params.colors.wordHighlight,
            );
            sru.defineWord.setColor(a.params.colors.wordHighlight);
            sru.defineWord.applyDefineWordSettings(a.params.defineWord);
            sru.screenSelection.setAutoSpeak(a.params.autoSpeak);
            dji.translate.toggleTranslateButton(d);
            sru.overlay.setColors(a.params.readingGuide);
            dji.rewordify.setFluencyLevel(a.params.rewordify.fluencyLevel);
            sru.toolbar.showButtons({rewordify: a.params.rewordify.enable});
            dji.rewordify.enableTranslation(!!a.params.translationEnabled);
            window.dji._goog = a.params.gdocsConfig;
            n(window.dji.messages.sru.SETTINGS, void 0, a.params);
        } else if (a.message == window.dji.messages.sru.OCR)
            sru.screenSelection.processDone(a.params.token, a.params.data);
        else if (a.message == window.dji.messages.sru.REWORDIFY)
            u.processRewordifyResponse(a.params.token, a.params.data);
        else if (a.message == window.dji.messages.sru.TRANSLATE)
            u.translator?.processTranslation(a.params.result, a.params.token);
        else if (a.message == window.dji.messages.sru.TRANSLATE_FROM_TOOLBAR)
            dji.translate.processTranslationDone(
                a.params.token,
                a.params.result,
            );
        else if (a.message == window.dji.messages.sru.tts.START) Ga(a.params);
        else if (a.message == window.dji.messages.sru.tts.WAIT) Ha(a.params);
        else if (a.message == window.dji.messages.sru.tts.STOP) Ia(a.params);
        else if (a.message == window.dji.messages.sru.tts.ERROR) Ja(a.params);
        else if ("com.donjohnston.sru.syncUI" === a.message)
            sru.outlines.setData(a.params.outlines, a.params.outlinesUiPath),
                sru.toolbar.expandOutlinesPanel(a.params.outlinesVisible);
        else if ("com.donjohnston.sru.outlines.dataUpdated" === a.message)
            sru.outlines.updateData(a.params.outlines, a.params.outlinesUiPath);
        else if ("com.donjohnston.sru.searchCitations" === a.message)
            if ((d = a.params ? a.params.sources : null))
                sru.outlines.onSearchSourcesFinished(d, a.params.catalog);
            else sru.outlines.onSearchSourcesFinished(null, null);
        else if ("com.donjohnston.sru.showOutlines" === a.message)
            sru.toolbar.triggerShowOutlines();
        else if ("com.donjohnston.sru.query.outlinesState" === a.message)
            (a = sru.toolbar.isOutlinesPanelExpanded()), b && b({state: a});
        else if ("com.donjohnston.sru.define" === a.message)
            sru.defineWord.activate(a.params.text);
        else if ("com.donjohnston.sru.define.text" === a.message)
            sru.defineWord.displayPopup(a.params);
        else if ("com.donjohnston.sru.define.icons" === a.message)
            sru.defineWord.displayIcons(a.params);
        else if ("com.donjohnston.sru.removeDistractions" === a.message)
            sru.screenSelection.isActive()
                ? v()
                : document.documentElement.hasAttribute(
                      "dji-sru-rewordify-active",
                  ) &&
                  (dji.rewordify.isActive()
                      ? w()
                      : dji.translate.isActive() && x()),
                sru.defineWord.isActive() && sru.defineWord.hide(),
                sru.removeDistractions.activate();
        else if ("com.donjohnston.sru.query.distractionsState" === a.message)
            (a = sru.removeDistractions.active()), b && b({active: a});
        else if ("com.donjohnstone.sru.document.info" === a.message)
            (a = window.sru.documentInfo.detectDocumentInfo()), b(a);
        else if (a.message === window.dji.messages.sru.LOG)
            dji.logger.warning("BM_LOG:", a.params.message);
        else if ("com.donjohnston.sru.wb.data" === a.message && b)
            return (
                dji.sru.wb
                    .getWordBankData(async () => await q("wordbank"))
                    .then((f) => b(f)),
                !0
            );
    }
    function e(a, b) {
        m.postMessage({message: a, params: b});
    }
    function B(a) {
        m && (m.disconnect(), (m = null));
        a &&
            ((m = chrome.runtime.connect({name: "__dji__sru_port"})),
            m.onMessage.addListener(E));
    }
    function Ga(a) {
        a && a.targetUuid && a.targetUuid !== g
            ? (a = h.get(a.targetUuid).proxy) &&
              a.send(window.dji.messages.sru.tts.START, void 0)
            : sru.speech.speakStart();
    }
    function Ha(a) {
        a && a.targetUuid && a.targetUuid !== g
            ? (a = h.get(a.targetUuid).proxy) &&
              a.send(window.dji.messages.sru.tts.WAIT, void 0)
            : sru.speech.speakWait();
    }
    function Ea(a) {
        if (a && a.targetUuid && a.targetUuid !== g) {
            var b = h.get(a.targetUuid).proxy;
            b && b.send(window.dji.messages.sru.tts.PROGRESS, void 0, a);
        } else sru.speech.speakProgress(a);
    }
    function Ia(a) {
        sru.speech.speakStop();
        a &&
            a.targetUuid &&
            a.targetUuid !== g &&
            (a = h.get(a.targetUuid).proxy) &&
            a.send(window.dji.messages.sru.tts.STOP, void 0);
    }
    function Ja(a) {
        if (a && a.targetUuid && a.targetUuid !== g) {
            var b = h.get(a.targetUuid).proxy;
            b && b.send(window.dji.messages.sru.tts.ERROR, void 0, a.err);
        } else sru.speech.speakError(a.err);
    }
    function K() {
        sru.speech.isActive() ? sru.speech.stop() : sru.speech.start();
    }
    function v() {
        sru.speech.stop();
        sru.defineWord.hide();
        let a = !sru.screenSelection.isActive();
        a
            ? (dji.rewordify.deactivate(),
              sru.toolbar.enableButtons({
                  speak: !1,
                  ocr: !0,
                  rewordify: !1,
                  translate: !1,
                  highlight: !1,
                  overlay: !1,
                  wordBank: !1,
              }),
              sru.toolbar.activateButtons({
                  speak: !1,
                  ocr: !0,
                  rewordify: !1,
                  translate: !1,
                  highlight: !1,
                  overlay: !1,
                  wordBank: !1,
              }))
            : (sru.toolbar.enableButtons({
                  speak: !0,
                  ocr: !0,
                  rewordify: !0,
                  translate: !0,
                  highlight: !0,
                  overlay: !0,
                  wordBank: sru.toolbar.hasWordBank(),
              }),
              sru.toolbar.activateButtons({
                  speak: !1,
                  ocr: !1,
                  rewordify: !1,
                  translate: !1,
                  highlight: !1,
                  overlay: !1,
                  wordBank: !1,
              }));
        sru.screenSelection.activate(a);
    }
    function w() {
        sru.speech.stop();
        dji.rewordify.isActive()
            ? (sru.defineWord.hide(), dji.rewordify.deactivate())
            : (sru.toolbar.enableButtons({
                  speak: !1,
                  ocr: !1,
                  rewordify: !0,
                  translate: !1,
                  highlight: !1,
                  overlay: !1,
                  wordBank: !1,
              }),
              sru.toolbar.activateButtons({rewordify: !0, translate: !1}),
              dji.rewordify.activate({
                  showBusyEffect: !0,
                  showTextNotFoundToast: !0,
                  preventInputEventsOnBodyElements: !0,
              }));
    }
    function x() {
        sru.speech.stop();
        let a = !dji.translate.isActive();
        a
            ? (sru.toolbar.enableButtons({
                  speak: !1,
                  ocr: !1,
                  rewordify: !1,
                  translate: !0,
                  highlight: !1,
                  overlay: !1,
                  wordBank: !1,
              }),
              sru.toolbar.activateButtons({translate: !0}))
            : (sru.toolbar.enableButtons({
                  speak: !0,
                  ocr: !0,
                  rewordify: !0,
                  translate: !0,
                  highlight: !0,
                  overlay: !0,
                  wordBank: sru.toolbar.hasWordBank(),
              }),
              sru.toolbar.activateButtons({translate: !1}));
        dji.translate.activate(a);
    }
    function M(a) {
        var b = !sru.outlines.isHighlightActive();
        sru.outlines.activateHighlight(b);
        if (b) Ka();
        else {
            b = dji.translate.isActive();
            let d = dji.rewordify.isActive();
            sru.toolbar.enableButtons({
                speak: !0,
                ocr: b || d ? !1 : !0,
                rewordify: b ? !1 : !0,
                translate: d ? !1 : !0,
                highlight: "boolean" === typeof a && 1 == a ? !1 : !0,
                wordBank: sru.toolbar.hasWordBank(),
            });
            sru.toolbar.activateButtons({highlight: !1});
        }
    }
    function Ka() {
        let a = sru.screenSelection.isActive();
        sru.outlines.startHighlight((b) => {
            b ||
                (sru.toolbar.enableButtons({
                    speak: !1,
                    ocr: !1,
                    rewordify: !1,
                    translate: !1,
                    highlight: !0,
                    wordBank: !1,
                }),
                sru.toolbar.activateButtons({
                    speak: !1,
                    ocr: a,
                    highlight: !0,
                }));
        });
    }
    function y() {
        let a = !sru.overlay.isActive();
        sru.overlay.activate(a);
        sru.toolbar.activateButtons({overlay: a});
        dji.selectionMapper.enableSelection(
            dji.rewordify.isActive() ||
                sru.speech.isActive() ||
                dji.translate.isActive() ||
                sru.outlines.isHighlightActive(),
        );
        n("com.donjohnston.sru.overlay.activation.change", void 0, a);
    }
    function L(a) {
        sru.defineWord.isActive() && sru.defineWord.hide();
        sru.screenSelection.isActive() && sru.screenSelection.activate(!1);
        dji.rewordify.isActive() && dji.rewordify.deactivate();
        dji.translate.isActive() && dji.translate.activate(!1, !0);
        e("com.donjohnston.sru.ui.outlinesVisible", {outlinesVisible: a});
        e("com.donjohnston.sru.ga4-event", {
            website: location.hostname,
            eventName: "OutlinesUsed",
            category: "Feature",
            feature: "Outlines",
            customProperties: {openclosed_state: a ? "open" : "closed"},
        });
    }
    async function N() {
        e("com.donjohnston.sru.wordbank");
    }
    function ba(a) {
        let b = !a,
            d = !a,
            f = !a,
            k = !a,
            p = !a;
        d && (dji.rewordify.isActive() || dji.translate.isActive()) && (d = !1);
        b && dji.translate.isActive() && (b = !1);
        f && dji.rewordify.isActive() && (f = !1);
        !k ||
            (!sru.toolbar.isHighlightActive() &&
                sru.outlines.isOutlineView()) ||
            (k = !1);
        p && (p = sru.toolbar.hasWordBank());
        sru.toolbar.enableButtons({
            ocr: d,
            rewordify: b,
            translate: f,
            highlight: k,
            overlay: !0,
            wordBank: p,
        });
        sru.toolbar.activateButtons({speak: a});
        a ? dji.utils.addMathOverlay() : dji.utils.removeMathOverlay();
        ((dji.translate.isActive() ||
            dji.rewordify.isActive() ||
            sru.screenSelection.isActive()) &&
            dji.utils.visibleSruPopup()) ||
            n("com.donjohnston.sru.tts.activation.change", void 0, a);
        dji.selectionMapper.enableSelection(
            dji.rewordify.isActive() ||
                a ||
                dji.translate.isActive() ||
                sru.outlines.isHighlightActive(),
        );
    }
    function z(a, b) {
        b = b || g;
        "string" === typeof a
            ? (a = {uuid: g, targetUuid: b, text: a})
            : a instanceof Array && (a = {uuid: g, targetUuid: b, parts: a});
        e("com.donjohnston.sru.speak", a);
    }
    function A() {
        e("com.donjohnston.sru.stopSpeak", {});
    }
    function ca(a) {
        e("com.donjohnston.sru.ga4-event", {
            website: location.hostname,
            eventName: a ? "SpeakOn" : "SpeakOff",
            category: "Feature",
            feature: "Speech",
        });
    }
    function O(a) {
        e("com.donjohnston.sru.ga4-event", {
            website: location.hostname,
            eventName: a ? "RemoveDistractionsOn" : "RemoveDistractionsOff",
            category: "Feature",
            feature: "Remove Distractions",
        });
    }
    function da() {}
    function ea() {
        sru.speech.stop();
        sru.outlines.isHighlightActive()
            ? (sru.overlay.activate(!1),
              sru.toolbar.enableButtons({
                  speak: !1,
                  ocr: !1,
                  rewordify: !1,
                  translate: !1,
                  highlight: !0,
                  overlay: !0,
                  wordBank: sru.toolbar.hasWordBank(),
              }),
              sru.toolbar.activateButtons({
                  speak: !1,
                  ocr: !1,
                  rewordify: !1,
                  translate: !1,
                  highlight: !0,
                  overlay: !0,
                  wordBank: !1,
              }))
            : (dji.rewordify.deactivate(),
              sru.toolbar.enableButtons({
                  speak: !0,
                  ocr: !0,
                  rewordify: !0,
                  translate: !0,
                  highlight: sru.outlines.isOutlineView(),
                  overlay: !0,
                  wordBank: sru.toolbar.hasWordBank(),
              }),
              sru.toolbar.activateButtons({
                  speak: !1,
                  ocr: !1,
                  rewordify: !1,
                  translate: !1,
                  highlight: !1,
                  overlay: sru.overlay.isActive(),
                  wordBank: !1,
              }));
    }
    function fa(a, b) {
        e(window.dji.messages.sru.OCR, {token: a, rect: b});
    }
    function ha() {
        sru.outlines.isHighlightActive() ||
            (sru.toolbar.enableButtons({
                speak: !0,
                rewordify: !0,
                translate: !0,
                highlight: !0,
                overlay: !0,
                wordBank: sru.toolbar.hasWordBank(),
            }),
            sru.toolbar.activateButtons({
                speak: !1,
                rewordify: !1,
                translate: !1,
                highlight: !1,
                overlay: sru.overlay.isActive(),
                wordBank: !1,
            }));
    }
    function ia(a) {
        e("com.donjohnston.sru.ga4-event", a);
    }
    function ja() {
        G(!0);
    }
    function ka() {
        G(!1);
        sru.screenSelection.isActive()
            ? (sru.toolbar.enableButtons({
                  speak: !0,
                  ocr: !0,
                  rewordify: !0,
                  translate: !0,
                  highlight: sru.outlines.isOutlineView(),
                  overlay: !0,
                  wordBank: sru.toolbar.hasWordBank(),
              }),
              sru.toolbar.activateButtons({rewordify: !1, translate: !1}))
            : (sru.speech.stop(),
              sru.toolbar.enableButtons({
                  speak: !0,
                  ocr: !0,
                  rewordify: !0,
                  translate: !0,
                  highlight: sru.outlines.isOutlineView(),
                  overlay: !0,
                  wordBank: sru.toolbar.hasWordBank(),
              }),
              sru.toolbar.activateButtons({
                  speak: !1,
                  ocr: !1,
                  rewordify: !1,
                  translate: !1,
                  wordBank: !1,
              }));
    }
    function C(a, b) {
        sru.toolbar.enableButtons({
            speak: !0,
            ocr: !1,
            translate: !1,
            highlight: !0,
            overlay: !0,
            wordBank: !1,
        });
        e(window.dji.messages.sru.REWORDIFY, {text: a, token: b});
    }
    function G(a) {
        e("com.donjohnston.sru.ga4-event", {
            website: location.hostname,
            eventName: a ? "SimplifyVocabularyOn" : "SimplifyVocabularyOff",
            category: "Feature",
            feature: "Simplify Vocabulary",
        });
    }
    async function q(a) {
        if (0 === h.size) return H(a);
        const b = window.dji.utils.activeElementInfo();
        return b &&
            (window.dji.utils.isSruPopupElement(b.element) ||
                window.dji.utils.isSruOverlaySelectionElement(b.element))
            ? H(a)
            : new Promise(async (d, f) => {
                  for (let [, k] of h)
                      if (
                          k &&
                          k.proxy &&
                          (f = await k.proxy.sendAsync(
                              `com.donjohnston.sru.${a}.getcontext`,
                          ))
                      ) {
                          f.element = document.body;
                          f.activeElementInfo = dji.utils.activeElementInfo();
                          d(f);
                          return;
                      }
                  d(null);
              });
    }
    function H(a) {
        let b = dji.selectionMapper.mapSelection({
            fromCaretToEnd: !1,
            clearSelection: !0,
            requestFor: a,
        });
        (b && b.text && 0 < b.text.length) ||
            ("rewordify" !== a && "wordbank" !== a) ||
            (b = dji.selectionMapper.mapSelection({
                entireDocument: !0,
                requestFor: a,
            }));
        return b;
    }
    async function La(a) {
        return 0 === h.size
            ? (dji.selectionMapper.enableSelection(
                  a ||
                      sru.speech.isActive() ||
                      dji.translate.isActive() ||
                      sru.outlines.isHighlightActive(),
              ),
              a)
            : await new Promise(async (b, d) => {
                  for (let [, f] of h)
                      f &&
                          f.proxy &&
                          ((d = await f.proxy.sendAsync(
                              "com.donjohnston.sru.rewordify.changeselectionstate",
                              a,
                          )),
                          d === a && b(d));
                  b(null);
              });
    }
    function pa(a, b) {
        e(window.dji.messages.sru.TRANSLATE_FROM_TOOLBAR, {text: a, token: b});
    }
    function qa(a) {
        sru.outlines.isHighlightActive() ||
            (sru.toolbar.enableButtons({
                speak: !0,
                ocr: !1,
                rewordify: !1,
                translate: !0,
                highlight: !0,
                overlay: !0,
                wordBank: !1,
            }),
            sru.toolbar.activateButtons({translate: !0}));
    }
    function ra() {
        dji.selectionMapper.enableSelection(!0);
        D(!0);
    }
    function sa() {
        sru.speech.stop();
        sru.toolbar.enableButtons({
            speak: !0,
            ocr: !0,
            rewordify: !0,
            translate: !0,
            highlight: sru.outlines.isOutlineView(),
            overlay: !0,
            wordBank: sru.toolbar.hasWordBank(),
        });
        sru.toolbar.activateButtons({speak: !1, translate: !1});
        dji.selectionMapper.enableSelection(
            dji.rewordify.isActive() ||
                sru.speech.isActive() ||
                sru.outlines.isHighlightActive(),
        );
        D(!1);
    }
    function ta(a) {
        n("com.donjohnston.sru.translate.cursor.change", void 0, a);
    }
    function ua(a) {
        e("com.donjohnston.sru.ga4-event", {
            website: location.hostname,
            eventName: a ? "TranslateOn" : "TranslateOff",
            category: "Feature",
            feature: "Translate",
        });
    }
    function va({show: a}) {
        sru.toolbar.showButtons({overlay: a});
        a || sru.toolbar.activateButtons({overlay: a});
    }
    function Ba() {
        dji.translate.isActive()
            ? dji.translate.start()
            : sru.outlines.isHighlightActive() &&
              sru.outlines.createTopicFromHighlight();
    }
    function wa(a) {
        e("com.donjohnston.sru.ga4-event", {
            website: location.hostname,
            eventName: a ? "ColourOverlayOn" : "ColourOverlayOff",
            category: "Feature",
            feature: "Colour Overlay",
        });
    }
    function xa(a) {
        e("com.donjohnston.sru.define", a);
    }
    function ya(a) {
        e("com.donjohnston.sru.define.enable", a);
    }
    function Z(a) {
        e("com.donjohnston.sru.outlines.dataUpdated", a);
    }
    function aa(a) {
        e("com.donjohnston.sru.outlines.uiPathUpdated", a);
    }
    function P(a) {
        e("com.donjohnston.sru.searchCitations", {searchData: a});
    }
    function Q() {
        e("com.donjohnston.sru.options", {});
    }
    function R() {
        e(window.dji.messages.sru.SIGNOUT, {});
    }
    function S(a) {
        dji.selectionMapper.enableSelection(
            a ||
                dji.rewordify.isActive() ||
                sru.speech.isActive() ||
                dji.translate.isActive(),
        );
        n(
            "com.donjohnston.sru.outlines.highlight.activation.change",
            void 0,
            a,
        );
    }
    function T(a) {
        !a ||
            a.isHome() ||
            a.isDirectory() ||
            e("com.donjohnston.sru.ga4-event", {
                website: location.hostname,
                eventName: "OutlineOpened",
                category: "Feature",
                feature: "Outline",
            });
    }
    function U(a) {
        e("com.donjohnston.sru.ga4-event", {
            website: location.hostname,
            eventName: "OutlineModified",
            category: "Feature",
            feature: "Outline",
            customProperties: {outline_modified: a.outlineModified},
        });
    }
    function V(a) {
        e("com.donjohnston.sru.ga4-event", {
            website: location.hostname,
            eventName: "OutlineTextAdded",
            category: "Feature",
            feature: "Outline",
            customProperties: {
                text: a.text,
                text_captured: a.textCaptured,
                added_manually: a.addedManually,
            },
        });
    }
    function W() {
        e("com.donjohnston.sru.ga4-event", {
            website: location.hostname,
            eventName: "SourcesOpened",
            category: "Feature",
            feature: "Outline",
        });
    }
    function X() {
        e("com.donjohnston.sru.ga4-event", {
            website: location.hostname,
            eventName: "SourcesDownloaded",
            category: "Feature",
            feature: "Outline",
        });
    }
    async function Y() {
        return q("outlines");
    }
    function Fa(a) {
        if (a) {
            if (!c.running)
                if (c.initialized)
                    (c.running = !0),
                        (c.timestamp = Date.now()),
                        (c.timer = setTimeout(r, c.timeout)),
                        l.isPdf &&
                            ((a = sru.helpers.pdfViewer.textInfo(
                                !0,
                                c.pageUuid,
                            )),
                            a.text &&
                                0 < a.text.length &&
                                e("com.donjohnston.sru.measure", {
                                    uuid: a.pageId || g,
                                    text: a.text,
                                }));
                else {
                    var b = g;
                    l.isPdf
                        ? ((b = sru.helpers.pdfViewer.textInfo(!0, c.pageUuid)),
                          (a = b.text),
                          (b = b.pageId || g))
                        : (a = l.isBookshare
                              ? sru.helpers.bookshare.text()
                              : dji.utils.extractVisibleTextFromElement(
                                    document.body,
                                ));
                    e("com.donjohnston.sru.measure", {
                        uuid: b,
                        text: a,
                        isNew: !0,
                    });
                    c.initialized = !0;
                    c.running = !0;
                    c.timestamp = Date.now();
                    c.timer = setTimeout(r, c.timeout);
                }
        } else
            c.running &&
                ((a = Date.now() - c.timestamp),
                clearTimeout(c.timer),
                (c.timer = null),
                (c.running = !1),
                (c.timestamp = 0),
                (b = c.pageUuid || g),
                (c.pageUuid = null),
                0 < a &&
                    e("com.donjohnston.sru.measure", {uuid: b, timeSpent: a}));
    }
    function r() {
        I();
        c.timer = setTimeout(r, c.timeout);
    }
    function I() {
        let a = Date.now(),
            b = a - c.timestamp;
        c.timestamp = a;
        0 < b &&
            b <= 2 * c.timeout &&
            e("com.donjohnston.sru.measure", {
                uuid: c.pageUuid || g,
                timeSpent: b,
            });
    }
    function la() {
        if (c.running) {
            let a = sru.helpers.pdfViewer.textInfo(!0);
            a.text &&
                0 < a.text.length &&
                e("com.donjohnston.sru.measure", {uuid: g, text: a.text});
        }
    }
    function na({text: a, uuid: b}) {
        c.running &&
            a &&
            0 < a.length &&
            e("com.donjohnston.sru.measure", {uuid: b, text: a});
    }
    function oa() {
        c.running &&
            (c.pageUuid && I(), (c.pageUuid = null), clearTimeout(c.timer));
    }
    function ma(a) {
        c.running &&
            ((c.pageUuid = a),
            (c.timestamp = Date.now()),
            clearTimeout(c.timer),
            (c.timer = setTimeout(r, c.timeout)));
    }
    function F() {
        c = {
            initialized: !1,
            running: !1,
            timestamp: 0,
            timer: null,
            pageUuid: null,
            timeout: 1e4,
        };
    }
    dji.logger.logLevel(dji.logger.levels.ERROR);
    window.dji.rewordify = new window.__RewordifyUI.RewordifyUIController();
    class Ma extends window.__RewordifyUI.DocumentParser {
        constructor() {
            super();
            this.m_mapperAdapter = new window.dji.DocumentTextMapperAdapter();
        }
        async getPageContext() {
            const a = await q("rewordify");
            a &&
                dji.utils.elementHasClass(
                    document.documentElement,
                    "dji-sru-screen-selection",
                ) &&
                (a.isEditor = !0);
            return a;
        }
        getContextForElement(a) {
            return this.m_mapperAdapter.getContextWithParams({
                entireDocument: !0,
                activeElemInfo: {
                    iframes: [],
                    document: a.ownerDocument,
                    element: a,
                },
            });
        }
    }
    class Na extends window.__RewordifyUI
        .RewordifyUIControllerAbstractDelegate {
        constructor() {
            super(new Ma(), new Oa());
            this.mRewordifyPromises = new Map();
        }
        changeSelectionState(a) {
            La();
        }
        clearSelection(a) {
            dji.selectionMapper.clearSelection(a);
        }
        rewordify(a, b) {
            return new Promise((d) => {
                this.mRewordifyPromises.set(b, d);
                C(a, b);
            });
        }
        processRewordifyResponse(a, b) {
            const d = this.mRewordifyPromises.get(a);
            d && (this.mRewordifyPromises.delete(a), d(b));
        }
        getToolbarRect() {
            return sru.mainContainer.getBoundingClientRect();
        }
        toggleRewordifyButton(a) {
            sru.toolbar.showButtons({rewordify: a});
        }
    }
    class Oa extends window.__RewordifyUI.ITranslator {
        constructor() {
            super();
            this.mTranslatePromises = new Map();
        }
        translateText(a) {
            let b = this.mTranslatePromises.get(a)?.p;
            return b
                ? b
                : (b = new Promise((d) => {
                      this.mTranslatePromises.set(a, {p: b, resolve: d});
                      e(window.dji.messages.sru.TRANSLATE, {text: a, token: a});
                  }));
        }
        processTranslation(a, b) {
            a.source = "google";
            const d = this.mTranslatePromises.get(b);
            d && (this.mTranslatePromises.delete(b), d.resolve(a));
        }
    }
    let m = null,
        u = new Na(),
        g = dji.utils.generateUUID(),
        c = {
            initialized: !1,
            running: !1,
            timestamp: 0,
            timer: null,
            pageUuid: null,
            timeout: 1e4,
        },
        l = {
            isPdf: dji.utils.isSruPwaApp(),
            isBookshare: dji.utils.isBookshareBook(),
            isAmazonKindle: dji.utils.isAmazonKindle(),
        },
        h = new Map();
    F();
    (function () {
        window.dji.pageObserver.initialize();
        window.dji.utils.isIframeFree() ||
            window.dji.pageObserver.addEventListener(
                window.dji.pageObserver.EventTypes.IFRAME_LOADED,
                (a) => {
                    if (window.dji.utils.validateIframe(a.iframe)) {
                        a = a.iframe.contentDocument;
                        a.documentElement &&
                            document.documentElement.hasAttribute(
                                "dji-sru-active",
                            ) &&
                            a.documentElement.setAttribute(
                                "dji-sru-active",
                                "true",
                            );
                        if (a.head) {
                            let b = [
                                "contentScripts/speech.css",
                                "contentScripts/defineWord.css",
                                "contentScripts/overlay.css",
                            ];
                            l.isAmazonKindle &&
                                (b.push("contentScripts/mainContainer.css"),
                                b.push("contentScripts/amazonKindleDji.css"));
                            window.dji.utils.addMultipleCssToDocument(a, b);
                        }
                        window.sru.outlines.iframeDocLoaded(a);
                    }
                },
            );
    })();
    l.isPdf
        ? sru.helpers.pdfViewer.initialize(t)
        : l.isBookshare
          ? sru.helpers.bookshare.initialize(t)
          : t();
})();
