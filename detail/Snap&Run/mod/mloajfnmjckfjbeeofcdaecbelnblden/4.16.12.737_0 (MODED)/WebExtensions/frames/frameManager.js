(function () {})((window.dji = window.dji || {}));
(function (l) {
    function m() {
        if (window.cwe) return "cwe-frame-manager";
        if (window.sru) return "sru-frame-manager";
        dji.logger.warn("Using default frame manager registration key!");
        return "frame-manager";
    }
    class g {
        constructor(a) {
            this.m_mainMessageProxy = a.messageProxy;
        }
        init() {}
    }
    class h extends g {
        constructor(a) {
            super(a);
            this.m_speechActive =
                this.m_outlinesHighlightActiveState =
                this.m_rewordifyActiveState =
                this.m_translateActiveState =
                    !1;
        }
        init() {
            this.m_mainMessageProxy.on(
                "com.donjohnston.sru.tts.activation.change",
                (a, b) => {
                    this.m_speechActive = b;
                    this.__applySelectionState();
                    b ? sru.speech.start(!0) : sru.speech.stop();
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.sru.tts.START,
                function (a) {
                    sru.speech.speakStart();
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.sru.tts.WAIT,
                function (a) {
                    sru.speech.speakWait();
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.sru.tts.PROGRESS,
                function (a, b) {
                    sru.speech.speakProgress(b);
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.sru.tts.STOP,
                function (a) {
                    sru.speech.speakStop();
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.sru.tts.ERROR,
                function (a, b) {
                    sru.speech.speakError(b);
                },
            );
            this.m_mainMessageProxy.on(
                "com.donjohnston.sru.rewordify.getcontext",
                (a) => {
                    this.m_mainMessageProxy.respond(
                        "com.donjohnston.sru.rewordify.getcontext",
                        a,
                        this.__pageContext("rewordify"),
                    );
                },
            );
            this.m_mainMessageProxy.on(
                "com.donjohnston.sru.rewordify.changeselectionstate",
                (a, b) => {
                    this.m_rewordifyActiveState = b;
                    this.__applySelectionState();
                    this.m_mainMessageProxy.respond(
                        "com.donjohnston.sru.rewordify.changeselectionstate",
                        a,
                        b,
                    );
                },
            );
            this.m_mainMessageProxy.on(
                "com.donjohnston.sru.translate.getcontext",
                (a) => {
                    this.m_mainMessageProxy.respond(
                        "com.donjohnston.sru.translate.getcontext",
                        a,
                        this.__pageContext("translate"),
                    );
                },
            );
            this.m_mainMessageProxy.on(
                "com.donjohnston.sru.translate.activation.change",
                (a, b) => {
                    this.m_translateActiveState = b;
                    this.__applySelectionState();
                },
            );
            this.m_mainMessageProxy.on(
                "com.donjohnston.sru.translate.cursor.change",
                function (a, b) {
                    b
                        ? dji.utils.addClassToHtmlElements(
                              "dji-sru-translate-from-cursor",
                          )
                        : (dji.utils.removeClassFromHtmlElements(
                              "dji-sru-translate-from-cursor",
                          ),
                          dji.utils.removeClassFromHtmlElements(
                              "dji-sru-rewordify-active",
                          ));
                },
            );
            this.m_mainMessageProxy.on(
                "com.donjohnston.sru.overlay.activation.change",
                (a, b) => {
                    sru.overlay.activate(b);
                    this.__applySelectionState();
                },
            );
            this.m_mainMessageProxy.on(
                "com.donjohnston.sru.outlines.getcontext",
                (a) => {
                    this.m_mainMessageProxy.respond(
                        "com.donjohnston.sru.outlines.getcontext",
                        a,
                        this.__pageContext("outlines"),
                    );
                },
            );
            this.m_mainMessageProxy.on(
                "com.donjohnston.sru.outlines.highlight.activation.change",
                (a, b) => {
                    this.m_outlinesHighlightActiveState = b;
                    this.__applySelectionState();
                    b
                        ? dji.utils.addClassToHtmlElements(
                              "dji-sru-outline-highlight-active",
                          )
                        : dji.utils.removeClassFromHtmlElements(
                              "dji-sru-outline-highlight-active",
                          );
                },
            );
            this.m_mainMessageProxy.on(
                "com.donjohnston.sru.wordbank.getcontext",
                (a) => {
                    this.m_mainMessageProxy.respond(
                        "com.donjohnston.sru.wordbank.getcontext",
                        a,
                        this.__pageContext("wordbank"),
                    );
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.sru.SETTINGS,
                (a, b) => {
                    this.__applySettings(b);
                },
            );
            this.m_mainMessageProxy.on(
                "com.donjohnston.sru.emptySelection",
                (a, b) => {
                    this.__emptySelection();
                },
            );
            this.__requestSettings();
        }
        __finishInitialize(a) {
            this.__applySettings(a);
            sru.speech.addEventListener("start", (b) => {
                this.__onSpeechStart(b);
            });
            sru.speech.addEventListener("stop", () => {
                this.__onSpeechStop();
            });
            dji.pageObserver.initialize();
            sru.overlay.initialize();
            dji.selectionMapper.addSelectionEventListener(
                "selectionDone",
                () => {
                    this.__onSelectionDone();
                },
            );
            this.m_mainMessageProxy.enable(!0);
            this.m_mainMessageProxy.ping();
        }
        __requestSettings() {
            chrome.runtime.sendMessage(
                {
                    message: "com.donjohnston.sru.settings.request",
                    params: {url: window.location},
                },
                (a) => {
                    dji.utils.ignoreLastError();
                    const b = a.params.settings;
                    sru.mainContainer.initialize(() => {
                        this.__finishInitialize(b);
                    });
                },
            );
        }
        __applySettings(a) {
            window.dji.selectionMapper &&
                window.dji.selectionMapper.setColors(
                    a.colors.text,
                    a.colors.wordHighlight,
                );
            window.dji.textHighlighter &&
                window.dji.textHighlighter.setColors(
                    a.colors.text,
                    a.colors.wordHighlight,
                );
            window.sru.overlay && window.sru.overlay.setColors(a.readingGuide);
        }
        __applySelectionState() {
            const a =
                    this.m_rewordifyActiveState ||
                    this.m_speechActive ||
                    this.m_translateActiveState ||
                    this.m_outlinesHighlightActiveState,
                b = a || sru.overlay.isActive();
            dji.selectionMapper.enableOverlays(b);
            dji.selectionMapper.enableSelection(a);
        }
        __emptySelection(a = null) {
            a &&
                (a.source && a.source.selectionHandler
                    ? a.source.selectionHandler.clearSelection(
                          a.activeElementInfo,
                      )
                    : dji.selectionMapper.clearSelection(a));
        }
        __onSpeechStart(a) {
            this.m_mainMessageProxy.send(
                window.dji.messages.sru.tts.START,
                void 0,
                a,
            );
        }
        __onSpeechStop() {
            this.m_mainMessageProxy.send(
                window.dji.messages.sru.tts.STOP,
                void 0,
            );
        }
        __pageContext(a) {
            return "wordbank" === a || "rewordify" === a
                ? this.__pageContextForSelectionOrDocument(a)
                : "outlines" === a || "translate" === a
                  ? this.__pageContextForSelection(a, !0)
                  : this.__pageContextForDocument(a);
        }
        __pageContextForDocument(a) {
            const b = dji.utils.activeElementInfo();
            a = new window.dji.DocumentTextMapperAdapter().getContextWithParams(
                {
                    entireDocument: !0,
                    requestFor: a,
                    activeElemInfo: {
                        iframes: [],
                        document,
                        element: b.element || document.documentElement,
                    },
                },
            );
            return this.__simplifyContext(a);
        }
        __pageContextForSelection(a, b = !1) {
            const c = dji.utils.activeElementInfo();
            a = new window.dji.DocumentTextMapperAdapter().getContextWithParams(
                {
                    requestFor: a,
                    activeElemInfo: {
                        iframes: [],
                        document,
                        element: c.element || document.documentElement,
                    },
                },
            );
            b && this.__emptySelection(a);
            return this.__simplifyContext(a);
        }
        __pageContextForSelectionOrDocument(a) {
            const b = this.__pageContextForSelection(a);
            return b && b.text && 0 < b.text.length
                ? b
                : this.__pageContextForDocument(a);
        }
        __simplifyContext(a) {
            a &&
                (delete a.custom.map,
                delete a.custom.matrix,
                delete a.element,
                delete a.activeElementInfo,
                delete a.originalSelection,
                delete a.source,
                delete a.custom.paraMapping,
                delete a.exclusionSelectors);
            return a;
        }
        __onSelectionDone() {
            this.m_translateActiveState
                ? this.m_mainMessageProxy.send(
                      "com.donjohnston.sru.translate.selectiondone",
                      void 0,
                  )
                : this.m_outlinesHighlightActiveState &&
                  this.m_mainMessageProxy.send(
                      "com.donjohnston.sru.outlines.selectiondone",
                      void 0,
                  );
        }
    }
    class n extends h {
        constructor(a) {
            super(a);
        }
    }
    class p extends g {
        constructor(a) {
            super(a);
            this.mImpl = window.sru ? new h(a) : new g(a);
        }
        init() {
            this.mImpl.init();
        }
    }
    class q extends g {
        constructor(a) {
            super(a);
            this.m_TTSTextHighlighters = new Map();
            this.m_nextHighlighterID = 0;
            let b = this;
            l.resetHighlighter = function (c, d) {
                b.__internalResetHighlighter(c, () => {
                    window.dji.utils.callMethod(d);
                });
            };
            l.resetHighlighterAsync = async function (c) {
                return new Promise((d) => this.resetHighlighter(c, d));
            };
        }
        init() {
            this.__initTTSTextHighlighterHandlers();
        }
        __initTTSTextHighlighterHandlers() {
            let a = this;
            this.m_mainMessageProxy.on(
                window.dji.messages.cwe.highlighting.INIT,
                function (b) {
                    const c = a.__getNextHighlighterID();
                    a.m_TTSTextHighlighters.set(
                        c,
                        new window.dji.highlighting.TTSTextHighlighter(null),
                    );
                    a.m_mainMessageProxy.respond(
                        window.dji.messages.cwe.highlighting.INIT,
                        b,
                        c,
                    );
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.cwe.highlighting.SET_GRANULARITY,
                function (b, c, d, e) {
                    (b = a.__getHighlighter(e)) && b.setGranularity(c, d);
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.cwe.highlighting.REPLACE_LAST_WORD,
                function (b, c, d) {
                    let e = a.__getHighlighter(d);
                    e &&
                        (e.replaceLastWord(c),
                        a.m_mainMessageProxy.respond(
                            window.dji.messages.cwe.highlighting
                                .REPLACE_LAST_WORD,
                            b,
                            d,
                        ));
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.cwe.highlighting.RESET,
                function (b, c) {
                    a.__internalResetHighlighter(c);
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.cwe.highlighting.SET_OPTIONS,
                function (b, c, d) {
                    (b = a.__getHighlighter(d)) && b.setOptions(c);
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.cwe.highlighting.ENABLE_HIGHLIGHTING,
                function (b, c) {
                    let d = a.__getHighlighter(c);
                    d &&
                        (d.enableHighlighting(),
                        a.m_mainMessageProxy.respond(
                            window.dji.messages.cwe.highlighting
                                .ENABLE_HIGHLIGHTING,
                            b,
                            c,
                        ));
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.cwe.highlighting.DISABLE_HIGHLIGHTING,
                function (b, c) {
                    let d = a.__getHighlighter(c);
                    d &&
                        (d.disableHighlighting(),
                        a.m_mainMessageProxy.respond(
                            window.dji.messages.cwe.highlighting
                                .DISABLE_HIGHLIGHTING,
                            b,
                            c,
                        ));
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.cwe.highlighting.HIGHLIGHT,
                function (b, c, d, e, k) {
                    (k = a.__getHighlighter(k)) &&
                        k.highlight(c, d, e, (r) => {
                            a.m_mainMessageProxy.respond(
                                window.dji.messages.cwe.highlighting.HIGHLIGHT,
                                b,
                                r,
                            );
                        });
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.cwe.highlighting.MAP_TEXT_FOR_HIGHLIGHTING,
                function (b, c, d) {
                    (d = a.__getHighlighter(d)) &&
                        d.mapTextForHighlighting(c, (e) => {
                            a.m_mainMessageProxy.respond(
                                window.dji.messages.cwe.highlighting
                                    .MAP_TEXT_FOR_HIGHLIGHTING,
                                b,
                                e,
                            );
                        });
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.cwe.highlighting.CANCEL,
                function (b, c) {
                    (b = a.__getHighlighter(c)) && b.cancel();
                },
            );
            this.m_mainMessageProxy.on(
                window.dji.messages.cwe.highlighting.DESTROY,
                function (b, c) {
                    a.m_TTSTextHighlighters.delete(c);
                },
            );
            this.m_mainMessageProxy.enable(!0);
        }
        __getNextHighlighterID() {
            ++this.m_nextHighlighterID === Number.MAX_SAFE_INTEGER &&
                (this.m_nextHighlighterID = 0);
            return this.m_nextHighlighterID;
        }
        __getHighlighter(a) {
            return this.m_TTSTextHighlighters.get(a);
        }
        __internalResetHighlighter(a, b) {
            (a = this.__getHighlighter(a)) && a.reset(b);
        }
    }
    const f = window.dji.framePreloader.serviceName();
    f &&
        dji.utils.registerService(f, m(), window.top, function (a) {
            if (a.success) {
                var b;
                (b =
                    "over-drive-reader" === f
                        ? new n(a)
                        : "ms-office-word-editor" === f
                          ? window.sru
                              ? new h(a)
                              : new q(a)
                          : "canvas-lms" === f
                            ? new p(a)
                            : null)
                    ? b.init()
                    : a.messageProxy.disconnect();
            }
        });
})((window.dji.frameManager = window.dji.frameManager || {}));
