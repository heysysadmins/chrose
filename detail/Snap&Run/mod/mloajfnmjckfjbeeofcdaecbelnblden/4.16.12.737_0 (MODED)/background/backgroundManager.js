window.sru = window.sru || {};
(function (e) {
    function fa() {
        dji.logger.monitor({event: "bm_intialize_step_1a"});
        dji.fileSystem.initialize(function (a) {
            dji.logger.monitor({event: "bm_intialize_step_1b"});
            dji.fileSystem.temporary.removeDirectory("/ocr", function () {
                dji.logger.monitor({event: "bm_intialize_step_1c"});
                dji.fileSystem.temporary.removeDirectory(
                    "/rewordify",
                    function () {
                        dji.logger.monitor({event: "bm_intialize_step_1d"});
                        setTimeout(ha, 10);
                    },
                );
            });
        });
    }
    function ha() {
        dji.logger.monitor({event: "bm_intialize_step_2a"});
        R(function () {
            dji.logger.monitor({event: "bm_intialize_step_2b"});
            setTimeout(ia, 10);
        });
    }
    function ia() {
        dji.logger.monitor({event: "bm_intialize_step_3a"});
        dji.tts.initialize(
            {settingsFactor: 100, onlineServiceAllowed: !0},
            function (a) {
                dji.logger.monitor({event: "bm_intialize_step_3b"});
                setTimeout(ja, 10);
            },
        );
    }
    function S() {
        chrome.contextMenus.removeAll();
        l.SR = chrome.contextMenus.create({
            title: "Snap&Read",
            contexts: ["all"],
        });
        l.define = chrome.contextMenus.create({
            title: "Define",
            contexts: ["selection"],
            parentId: l.SR,
            onclick: function (a, b) {
                {
                    b = b.id;
                    const c = (a.selectionText || "").trim();
                    256 <= c.length ||
                        ((a = c.split(dji.charSet.whiteSpace.whiteSpaces())),
                        0 >= a.length ||
                            10 <= a.length ||
                            dji.tabsManager.sendPortMessage(
                                b,
                                "com.donjohnston.sru.define",
                                {text: c},
                            ));
                }
            },
        });
    }
    function ja() {
        GoogleAnalytics.setup(
            dji.config.gaMeasurementId(),
            dji.config.gaApiSecret(),
        );
        dji.logger.monitor({event: "bm_intialize_step_4a"});
        T(function (a) {
            dji.logger.monitor({event: "bm_intialize_step_4b"});
            dji.login.silentAuth(async function (b) {
                dji.logger.monitor({
                    event: "bm_intialize_step_4c",
                    code: b ? b.code : null,
                });
                if (b && 500 != b.code)
                    if (0 == b.code) {
                        if (b.user instanceof Object) {
                            GoogleAnalytics.setLicense(b.user.analytics);
                            const c = await jsdapi.sru.privacyModeAsync();
                            sru.userData.privacyMode(c.privacyMode);
                            k({
                                website: chrome.runtime.id,
                                eventName: "th_global_license_check",
                                category: "Application",
                            });
                        }
                        dji.logger.monitor({event: "bm_intialize_step_4f"});
                        a && a.checksum !== b.user.checksum
                            ? (dji.logger.monitor({
                                  event: "bm_intialize_step_4j",
                              }),
                              U(a, function () {
                                  dji.logger.monitor({
                                      event: "bm_intialize_step_4k",
                                  });
                                  w(function () {
                                      dji.logger.monitor({
                                          event: "bm_intialize_step_4l",
                                      });
                                      setTimeout(z, 10);
                                  });
                              }))
                            : (dji.logger.monitor({
                                  event: "bm_intialize_step_4g",
                              }),
                              A(function () {
                                  dji.logger.monitor({
                                      event: "bm_intialize_step_4h",
                                  });
                                  w(function () {
                                      dji.logger.monitor({
                                          event: "bm_intialize_step_4i",
                                      });
                                      setTimeout(z, 10);
                                  });
                              }));
                    } else
                        dji.logger.monitor({event: "bm_intialize_step_4m"}),
                            U(a, function () {
                                dji.logger.monitor({
                                    event: "bm_intialize_step_4n",
                                });
                                w(function () {
                                    dji.logger.monitor({
                                        event: "bm_intialize_step_4o",
                                    });
                                    setTimeout(z, 10);
                                });
                            });
                else
                    dji.logger.monitor({event: "bm_intialize_step_4d"}),
                        w(function () {
                            dji.logger.monitor({event: "bm_intialize_step_4e"});
                            setTimeout(z, 10);
                        });
            });
        });
    }
    function z() {
        dji.logger.monitor({event: "bm_intialize_step_5a"});
        dji.tabsManager.initialize(function () {
            dji.logger.monitor({event: "bm_intialize_step_5b"});
            dji.tabsManager.addTabCreatedListener(ka);
            dji.tabsManager.addTabChangedListener(la);
            dji.tabsManager.addTabUpdatedListener(ma);
            dji.tabsManager.addTabRemovedListener(na);
            dji.tabsManager.addTabMessageListener(oa);
            dji.tabsManager.addPortDisconnectedListener(pa);
            dji.logger.monitor({event: "bm_intialize_step_5c"});
            setTimeout(qa, 10);
        });
    }
    async function qa() {
        try {
            window.dji.logger.monitor({event: "bm_intialize_step_6"}),
                await B();
        } catch (a) {
            window.dji.logger.error(a);
        } finally {
            setTimeout(ra, 10);
        }
    }
    function ra() {
        dji.logger.monitor({event: "bm_intialize_step_6a"});
        t.start = sa;
        t.progress = ta;
        t.stop = ua;
        t.error = va;
        t.wait = wa;
        sru.sync.setDelegate(
            "checkSettingsUpdate",
            sru.userData.syncCheckSettingsUpdate,
        );
        sru.sync.setDelegate(
            "needSettingsData",
            sru.userData.syncNeedSettingsData,
        );
        sru.sync.setDelegate("checkOutlinesUpdate", xa);
        sru.sync.setDelegate(
            "needMeasurementsData",
            sru.userData.syncNeedMeasurementsData,
        );
        sru.sync.setDelegate(
            "privacyModeAvailable",
            sru.userData.syncUpdatePrivacyMode,
        );
        sru.sync.addEventListener("checkForUpdatesFinished", ya);
        sru.sync.addEventListener(
            "settingsUpdateAvailable",
            sru.userData.syncSaveSettingsData,
        );
        sru.sync.addEventListener("settingsUpdateAvailable", za);
        sru.sync.addEventListener("outlinesUpdateAvailable", Aa);
        sru.sync.addEventListener(
            "measurementsSyncFinished",
            sru.userData.syncMeasurementsFinished,
        );
        sru.sync.addEventListener("syncProgress", Ba);
        dji.logger.monitor({event: "bm_intialize_step_6b"});
        e.isLoggedIn()
            ? (dji.logger.monitor({event: "bm_intialize_step_6c"}),
              chrome.browserAction.setIcon({path: m.inactive}),
              dji.logger.monitor({event: "bm_intialize_step_6d"}),
              n(),
              dji.logger.monitor({event: "bm_intialize_step_6e"}))
            : (dji.logger.monitor({event: "bm_intialize_step_6f"}),
              chrome.browserAction.setIcon({path: m.notLoggedIn}),
              dji.logger.monitor({event: "bm_intialize_step_6g"}));
        dji.logger.groupEnd();
        dji.logger.log(
            'Background manager initialized for "' +
                chrome.runtime.getManifest().name +
                '" (' +
                chrome.runtime.id +
                ")",
        );
        g.loaded = !0;
        dji.logger.monitor({event: "bm_intialize_step_6h"});
        dji.tabsManager.broadcastTabMessage(
            window.dji.messages.sru.BACKGROUND_READY,
        );
        dji.logger.monitor({event: "bm_intialize_step_6i"});
        dji.login.monitor({authRequired: V, signoutRequired: H});
        dji.logger.monitor({event: "bm_intialize_step_6j"});
        dji.proxy.init({onNotification: Ca});
        dji.logger.monitor({event: "bm_intialize_step_6k"});
        u("load");
        dji.logger.monitor({event: "bm_intialize_step_6l"});
    }
    function Ca(a) {
        if (a) {
            var b = dji.config.loginUrlSignature();
            "auth" === a.category &&
                (!a.hasOwnProperty("version") ||
                    (a.hasOwnProperty("version") &&
                        2 === a.version &&
                        a.signature === b)) &&
                ("auth" === a.reason ? V() : "signout" === a.reason && H());
        }
    }
    function V() {
        p ||
            ((p = !0),
            dji.login.userInfo(),
            dji.login.silentAuth(function (a) {
                a && 500 != a.code
                    ? 0 == a.code
                        ? A(function () {
                              w(function () {
                                  e.isLoggedIn()
                                      ? (chrome.browserAction.setIcon({
                                            path: m.inactive,
                                        }),
                                        n())
                                      : chrome.browserAction.setIcon({
                                            path: m.notLoggedIn,
                                        });
                                  p = !1;
                              });
                          })
                        : ((p = !1), dji.notifications.showByAuthCode(a.code))
                    : ((p = !1),
                      dji.notifications.showByAuthCode(a ? a.code : null));
            }));
    }
    function H(a) {
        chrome.tabs.query({url: r.optionsPattern}, function (b) {
            if (b && 0 < b.length) {
                let c = [];
                for (let d = 0; d < b.length; d++) c.push(b[d].id);
                chrome.tabs.remove(c, function () {
                    e.signOut(a);
                });
            } else e.signOut(a);
        });
    }
    async function n() {
        const a = (n.__session = dji.utils.generateUUID());
        let b = null,
            c = 0;
        for (
            ;
            a === n.__session &&
            !(b = await jsdapi.sru.checkSyncOptionsAsync()) &&
            a === n.__session;

        )
            (c = Math.min(c + 2e3, 6e4)), await dji.utils.sleep(c);
        b && b.allowed && a === n.__session && sru.sync.start();
    }
    function W(a) {
        dji.logger.log("Reload related websites:", a, dji.config.relatedUris());
        dji.proxy.broadcastNotification({
            category: "auth",
            version: 2,
            reason: a ? "auth" : "signout",
            signature: dji.config.loginUrlSignature(),
        });
        chrome.tabs.query({url: dji.config.relatedUris()}, function (b) {
            chrome.runtime.lastError &&
                dji.logger.error(chrome.runtime.lastError.message);
            if (b)
                for (let c = 0; c < b.length; c++)
                    chrome.tabs.reload(b[c].id, {bypassCache: !0});
        });
    }
    function X() {
        if (window.dji.tts.hasOnlineVoices()) {
            var a = dji.login.isLoggedIn() ? dji.login.userInfo() : null;
            if (a && a.checksum) {
                var b = sru.userData.runtime.notification("new-voice");
                if (!b || (!b.rejected && b.displayed != g.uuid)) {
                    var c = sru.userData.settings.speechVoice(),
                        d = "";
                    sru.userData.settings.translationEnabled() &&
                        (d = sru.userData.settings.translationVoice() || "");
                    var f =
                            dji.tts.isGoogleVoice(c) &&
                            dji.tts.isOnlineVoiceAllowed(),
                        q =
                            dji.tts.isGoogleVoice(d) &&
                            dji.tts.isOnlineVoiceAllowed(!0);
                    if (f || q)
                        (b = b || {}),
                            (b.displayed = g.uuid),
                            sru.userData.runtime.notification("new-voice", b),
                            dji.notifications.showNewVoices(
                                function () {
                                    I();
                                },
                                function () {
                                    var J = f
                                            ? window.dji.tts.onlineAlternativeForVoice(
                                                  c,
                                              )
                                            : null,
                                        K = q
                                            ? window.dji.tts.onlineAlternativeForVoice(
                                                  d,
                                              )
                                            : null;
                                    J && sru.userData.settings.speechVoice(J);
                                    K &&
                                        sru.userData.settings.translationVoice(
                                            K,
                                        );
                                    (J || K) && C();
                                },
                                function () {
                                    b = b || {};
                                    b.rejected = !0;
                                    sru.userData.runtime.notification(
                                        "new-voice",
                                        b,
                                    );
                                },
                            );
                }
            }
        }
    }
    function u(a) {
        const b = {message: "com.donjohnston.sru.notification", reason: a};
        chrome.runtime.sendMessage(b);
        chrome.tabs.query({}, function (c) {
            for (let d = 0; d < c.length; d++)
                chrome.tabs.sendMessage(c[d].id, b);
        });
    }
    function L(a) {
        if (!p) {
            p = !0;
            u("activationStatus");
            var b = function () {
                p = !1;
                a && a();
                u("activationStatus");
            };
            dji.login.isLoggedIn()
                ? (g.on || S(), M(!g.on), b())
                : R(function () {
                      dji.login.login(function (c) {
                          c
                              ? sru.userData.initialize(
                                    c.checksum,
                                    async function () {
                                        GoogleAnalytics.setLicense(c.analytics);
                                        const d =
                                            await jsdapi.sru.privacyModeAsync();
                                        sru.userData.privacyMode(d.privacyMode);
                                        k(
                                            {
                                                website: chrome.runtime.id,
                                                eventName:
                                                    "th_global_license_check",
                                                category: "Application",
                                            },
                                            !0,
                                        );
                                        k({
                                            website: chrome.runtime.id,
                                            eventName: "ApplicationStarted",
                                            category: "Application",
                                        });
                                        n();
                                        A();
                                        D();
                                        S();
                                        M(!0);
                                        b();
                                        W(!0);
                                        dji.tabsManager.broadcastTabMessage(
                                            window.dji.messages.sru.SIGNIN,
                                            {},
                                        );
                                    },
                                )
                              : b();
                      });
                  });
        }
    }
    function M(a) {
        g.on = a;
        g.on
            ? (D(),
              E(null),
              setTimeout(function () {
                  N(dji.tabsManager.activeTabId());
              }, 0))
            : setTimeout(function () {
                  chrome.browserAction.setIcon({path: m.inactive});
              });
        let b = dji.tabsManager.activeTab();
        x(b ? b.tabId : -1);
        F(null, a);
    }
    function F(a, b) {
        if (b) {
            var c = sru.userData.outlines.all();
            dji.tabsManager.sendTabMessage(a, "com.donjohnston.sru.syncUI", {
                outlinesVisible: v.outlinesVisible,
                outlines: c,
                outlinesUiPath: v.outlinesUiPath,
            });
        }
        c = {active: b};
        b && (c.outlineTemplates = sru.userData.outlineTemplates());
        dji.tabsManager.sendTabMessage(a, window.dji.messages.sru.USER, {
            isLoggedIn: dji.login.isLoggedIn(),
            enableWB: e.userInfo() ? e.userInfo().enableWB : !1,
        });
        dji.tabsManager.sendTabMessage(
            a,
            window.dji.messages.sru.ACTIVATE_EXTENSION,
            c,
        );
    }
    function I() {
        chrome.tabs.query({url: r.optionsPattern}, function (a) {
            if (a && 0 < a.length) {
                try {
                    for (let b = 0; b < a.length; b++)
                        chrome.tabs.reload(a[b].id, {bypassCache: !0});
                } catch (b) {
                    dji.logger.error(b);
                }
                chrome.tabs.update(a[0].id, {active: !0});
                k({
                    website: chrome.runtime.id,
                    eventName: "OptionsOpened",
                    category: "Settings",
                });
            } else chrome.tabs.create({url: r.options, active: !0});
        });
    }
    function x(a) {
        0 > a ||
            chrome.tabs.get(a, function (b) {
                let c = "";
                g.on &&
                    !sru.userData.privacyMode() &&
                    sru.userData.settings.showReadability() &&
                    h.hasOwnProperty(a) &&
                    b &&
                    b.url &&
                    b.url !== r.optionsPattern &&
                    0 !== b.url.indexOf("chrome://") &&
                    (h[a].measurements &&
                    h[a].measurements.hasOwnProperty("averageGradeLevel")
                        ? ((b = h[a].measurements.averageGradeLevel),
                          (c = 1 > b ? "<1" : Math.round(b) + ""))
                        : (c = "..."));
                chrome.browserAction.setBadgeText({text: c});
            });
    }
    function N(a) {
        g.on &&
            a === dji.tabsManager.activeTabId() &&
            ((a = e.getActiveTabInfo()) && a.extras && a.extras.isPdf
                ? chrome.browserAction.setIcon({path: m.pdfInactive})
                : chrome.browserAction.setIcon({path: m.active}));
    }
    function ka(a, b) {
        h[a] = {session: dji.utils.generateUUID()};
        dji.login.isLoggedIn() &&
            b.pendingUrl ===
                `chrome-extension://${chrome.runtime.id}${r.options}` &&
            k({
                website: chrome.runtime.id,
                eventName: "OptionsOpened",
                category: "Settings",
            });
    }
    function la(a, b) {
        dji.tts.stop();
        b && F(b, !1);
        g.on && (F(a, !0), E(a));
        x(a);
        N(a);
    }
    function ma(a, b, c, d) {
        b.active && N(a);
        dji.login.isLoggedIn() &&
            b.extras.isPdf &&
            "complete" === b.status &&
            !sru.userData.settings.pdfUserDefined() &&
            chrome.tabs.insertCSS(
                a,
                {
                    file: "contentScripts/pdfPopupChoice.css",
                    frameId: 0,
                    runAt: "document_start",
                },
                function () {
                    dji.utils.checkLastError();
                    chrome.tabs.executeScript(
                        a,
                        {
                            file: "contentScripts/pdfPopupChoice.js",
                            frameId: 0,
                            runAt: "document_start",
                        },
                        dji.utils.checkLastError,
                    );
                },
            );
    }
    function na(a) {
        delete h[a];
    }
    function oa(a, b, c) {
        b === window.dji.messages.sru.content_script.READY
            ? Da(a, c)
            : "com.donjohnston.sru.measure" === b
              ? Ea(a, c)
              : "com.donjohnston.sru.speak" === b
                ? Fa(a, c)
                : "com.donjohnston.sru.stopSpeak" === b
                  ? dji.tts.stop()
                  : b === window.dji.messages.sru.OCR
                    ? Ga(a, c)
                    : b === window.dji.messages.sru.REWORDIFY
                      ? Ha(a, c)
                      : b === window.dji.messages.sru.TRANSLATE
                        ? Y(a, c, !1)
                        : b === window.dji.messages.sru.TRANSLATE_FROM_TOOLBAR
                          ? Y(a, c, !0)
                          : "com.donjohnston.sru.searchCitations" === b
                            ? Ia(a, c.searchData)
                            : "com.donjohnston.sru.outlines.dataUpdated" === b
                              ? sru.userData.outlines.updateDataFromUI(c)
                              : "com.donjohnston.sru.outlines.uiPathUpdated" ===
                                  b
                                ? (v.outlinesUiPath = c)
                                : "com.donjohnston.sru.ui.outlinesVisible" === b
                                  ? (v.outlinesVisible = c.outlinesVisible)
                                  : "com.donjohnston.sru.options" === b
                                    ? I()
                                    : "com.donjohnston.sru.define" === b
                                      ? Ja(a, c)
                                      : "com.donjohnston.sru.define.enable" ===
                                          b
                                        ? l.define &&
                                          chrome.contextMenus.update(
                                              l.define,
                                              {enabled: c.enable},
                                              null,
                                          )
                                        : "com.donjohnston.sru.wordbank" === b
                                          ? ((a = dji.tabsManager.tab(a)),
                                            e.createWordBank(a))
                                          : b ===
                                              window.dji.messages.sru.SIGNOUT
                                            ? H(function () {})
                                            : "com.donjohnston.sru.ga4-event" ===
                                                  b && k(c);
    }
    function pa(a, b) {
        b && b.active && dji.tts.stop();
    }
    function Ka(a, b, c) {
        if ("com.donjohnston.sru.activate" === a.message)
            return (
                dji.tabsManager.detectActiveTab(() => {
                    L(() => {
                        var d = e.userInfo();
                        d = {active: e.isOn(), authenticated: !!d, user: d};
                        c(d);
                    });
                }),
                !0
            );
        if ("com.donjohnston.sru.deactivate" === a.message)
            return (
                dji.tabsManager.detectActiveTab(() => {
                    L(c);
                }),
                !0
            );
        if ("com.donjohnston.sru.query.state" === a.message)
            (a = e.userInfo()),
                (a = {
                    loaded: e.isLoaded(),
                    busy: e.isTurnOnInProgress(),
                    active: e.isOn(),
                    authenticated: !!a,
                    user: a,
                }),
                c(a);
        else if (
            a.message ===
            window.dji.messages.sru.content_script.RESTRICTIONS_READY
        ) {
            b = !0;
            for (let d = 0; d < y.length; d++)
                if (
                    (y[d].hostPattern &&
                        y[d].hostPattern.test(a.params.url.host)) ||
                    (y[d].hrefPattern &&
                        y[d].hrefPattern.test(a.params.url.href))
                ) {
                    b = !1;
                    break;
                }
            c({message: a.message, params: {allowed: b}});
        } else if ("com.donjohnston.sru.pdf.autoOpen" === a.message)
            sru.userData.settings.pdfAutoOpen(!!a.params.state),
                sru.userData.settings.pdfUserDefined(!0),
                a.params.state &&
                    e.openPDFOnlyOnce(dji.tabsManager.tab(b.tab.id)),
                C(),
                c({message: a.message, params: {}});
        else if ("com.donjohnston.sru.config" === a.message)
            c({
                usable: g.loaded,
                pdfRedirectUrl: dji.config.env().pdfRedirectUrl,
            });
        else if (
            "com.donjohnston.sru.defineWord.openOnDoubleClick" === a.message
        )
            sru.userData.settings.openOnDoubleClick(!!a.params.state),
                sru.userData.settings.defineWordUserDefined(!0),
                C(),
                c({message: a.message, params: {}});
        else {
            if ("com.donjohnston.sru.settings.request" === a.message)
                return (
                    (b = Z()),
                    c({message: a.message, params: {settings: b}}),
                    !0
                );
            if ("com.donjohnston.sru.fetchImage" === a.message) {
                let d = {message: a.message};
                La(a.params.url, function (f) {
                    d.data = f;
                    c(d);
                });
                return !0;
            }
        }
    }
    function Da(a, b) {
        h[a] = {session: dji.utils.generateUUID()};
        let c = dji.tabsManager.userDataForTab(a) || {};
        c.uuid = b.uuid;
        dji.tabsManager.setUserDataForTab(a, c);
        g.on && (E(a), F(a, !0));
        (b = dji.tabsManager.activeTab()) && b.tabId === a && x(a);
    }
    function Ea(a, b) {
        let c = (h[a] || {}).session;
        sru.measurements.update(
            {
                scope: sru.measurements.Scope.Page,
                uuid: b.uuid,
                timeSpent: b.timeSpent,
                text: b.text,
                isNew: b.isNew,
            },
            null,
            function (d) {
                if (
                    d &&
                    d.measurements &&
                    h.hasOwnProperty(a) &&
                    c === h[a].session
                ) {
                    var f = (h[a].measurements = h[a].measurements || {});
                    for (let q in d.measurements)
                        d.measurements.hasOwnProperty(q) &&
                            (f[q] = d.measurements[q]);
                    f = dji.tabsManager.activeTab();
                    d.measurements.hasOwnProperty("averageGradeLevel") &&
                        f &&
                        f.tabId === a &&
                        x(a);
                }
            },
        );
    }
    function Fa(a, b) {
        let c = "";
        if (b.hasOwnProperty("text")) c = b.text;
        else if (b.hasOwnProperty("parts"))
            for (let d = 0; d < b.parts.length; d++) c += " " + b.parts[d].text;
        if (!c || 0 >= c.length)
            return dji.tabsManager.sendPortMessage(
                a,
                window.dji.messages.sru.tts.STOP,
            );
        sru.measurements.update(
            {
                scope: sru.measurements.Scope.TTS,
                pageUuid: b.uuid,
                targetUuid: b.targetUuid,
                text: c,
                isNew: !0,
            },
            function (d) {
                dji.tts.speak(
                    b.text || b.parts,
                    {
                        tabId: a,
                        ttsUuid: d,
                        pageUuid: b.uuid,
                        targetUuid: b.targetUuid,
                    },
                    t,
                );
            },
        );
    }
    function sa(a) {
        dji.tabsManager.sendPortMessage(
            a.tabId,
            window.dji.messages.sru.tts.START,
            {targetUuid: a.targetUuid},
        );
    }
    function wa(a) {
        dji.tabsManager.sendPortMessage(
            a.tabId,
            window.dji.messages.sru.tts.WAIT,
            {targetUuid: a.targetUuid},
        );
    }
    function ta(a, b, c) {
        dji.tabsManager.sendPortMessage(
            c.tabId,
            window.dji.messages.sru.tts.PROGRESS,
            {
                charIndex: a,
                charLength: b,
                targetUuid: c.targetUuid,
                chunkLen: c.chunkLen || -1,
                isMath: c.isMath,
                mathFormat: c.mathFormat,
                indexOfPlaceholderText: c.indexOfPlaceholderText,
                chunkOffset: c.chunkOffset,
            },
        );
    }
    function ua(a, b) {
        a.ttsUuid && 0 < b
            ? sru.measurements.update(
                  {
                      scope: sru.measurements.Scope.TTS,
                      uuid: a.ttsUuid,
                      pageUuid: a.pageUuid,
                      targetUuid: a.targetUuid,
                      timeSpent: b,
                  },
                  function () {
                      dji.tabsManager.sendPortMessage(
                          a.tabId,
                          window.dji.messages.sru.tts.STOP,
                          {targetUuid: a.targetUuid},
                      );
                  },
              )
            : dji.tabsManager.sendPortMessage(
                  a.tabId,
                  window.dji.messages.sru.tts.STOP,
                  {targetUuid: a.targetUuid},
              );
    }
    function va(a, b, c) {
        dji.tabsManager.sendPortMessage(
            a.tabId,
            window.dji.messages.sru.tts.ERROR,
            {err: c.toString(), targetUuid: a.targetUuid},
        );
    }
    function Ga(a, b) {
        dji.screenshot.takeScreenshot(
            {
                rect: b.rect,
                imageFormat: dji.screenshot.ImageFormats.PNG,
                fileSystem: null,
                fileName: null,
            },
            async function (c, d) {
                if (!c)
                    return dji.tabsManager.sendPortMessage(
                        a,
                        window.dji.messages.sru.OCR,
                        {token: b.token, data: null},
                    );
                try {
                    let f = await sru.native.ocrAsync(d);
                    aa(f, b.token, {tabId: a});
                } catch (f) {
                    dji.logger.error(f), aa(!1, b.token, {tabId: a});
                }
            },
        );
    }
    function aa(a, b, c) {
        if (a)
            try {
                a = JSON.parse(a);
                a.rect = c.rect;
                for (let d of a.paragraphs) for (let f of d.lines);
            } catch (d) {
                (a = null), dji.logger.error(d);
            }
        dji.logger.log(c);
        dji.logger.log(a);
        return dji.tabsManager.sendPortMessage(
            c.tabId,
            window.dji.messages.sru.OCR,
            {token: b, data: a},
        );
    }
    async function Ha(a, b) {
        try {
            let c = await sru.native.rewordifyAsync(
                sru.userData.settings.rewordifyLevel(),
                b.text,
            );
            ba(!0, b.token, c, {tabId: a});
        } catch (c) {
            dji.logger.error(c), ba(!1, b.token, null, {tabId: a});
        }
    }
    function ba(a, b, c, d) {
        if (!a)
            return dji.tabsManager.sendPortMessage(
                d.tabId,
                window.dji.messages.sru.REWORDIFY,
                {token: b, data: null},
            );
        dji.logger.log(d);
        dji.logger.log(c);
        return dji.tabsManager.sendPortMessage(
            d.tabId,
            window.dji.messages.sru.REWORDIFY,
            {token: b, data: c},
        );
    }
    async function Ja(a, b) {
        const c = b.text.split(dji.charSet.whiteSpace.whiteSpaces());
        k({
            eventName: "DefinitionShown",
            category: "Feature",
            feature: "Dictionary",
        });
        if (10 > c.length && 256 > b.text.length)
            try {
                let d = await sru.native.searchWordAsync(b.text);
                O(d, {session: b.session, text: b.text, tabId: a});
            } catch (d) {
                dji.logger.error(d), O({}, {session: b.session, tabId: a});
            }
        else O({}, {session: b.session, tabId: a});
    }
    async function O(a, b) {
        let c = null;
        dji.tabsManager.sendPortMessage(
            b.tabId,
            "com.donjohnston.sru.define.text",
            {
                session: b.session,
                senses: a.senses,
                baseSenses: a.baseSenses,
                bestSense: a.bestSense,
                text: b.text,
            },
        );
        if (
            a.hasOwnProperty("bestSense") &&
            ((a = (a.bestSense || "").split("###")),
            (a = 0 < a.length ? a[0] : void 0) &&
                !window.sru.native.isSensitiveImage(a))
        )
            try {
                let d = window.devicePixelRatio,
                    f = `${dji.config.defineUrl()}/icons/${a}?dpr=${d}`;
                c =
                    (
                        await (
                            await fetch(f, {
                                method: "GET",
                                headers: {
                                    "X-dapi-auth-token":
                                        window.jsdapi.getAuthToken(),
                                },
                            })
                        ).json()
                    ).icons || null;
            } catch (d) {
                dji.logger.error(d);
            }
        dji.tabsManager.sendPortMessage(
            b.tabId,
            "com.donjohnston.sru.define.icons",
            {session: b.session, icons: c},
        );
    }
    function Y(a, b, c) {
        const d = c
            ? window.dji.messages.sru.TRANSLATE_FROM_TOOLBAR
            : window.dji.messages.sru.TRANSLATE;
        sru.userData.settings.translationEnabled() &&
        "en" !== sru.userData.settings.translationLanguage().abbr
            ? jsdapi.translate.translateText(
                  b.text,
                  sru.userData.settings.translationLanguage().abbr,
                  function (f) {
                      if (!f || f.error) f = null;
                      dji.tabsManager.sendPortMessage(a, d, {
                          result: f,
                          token: b.token,
                      });
                  },
              )
            : dji.tabsManager.sendPortMessage(a, d, {
                  result: JSON.stringify({translated: !1}),
              });
    }
    function Ia(a, b) {
        k({
            eventName: "SourcesDownloaded",
            category: "Feature",
            feature: "Outline",
        });
        jsdapi.citations.search(b, function (c) {
            if (!c || c.error) c = null;
            dji.tabsManager.sendTabMessage(
                a,
                "com.donjohnston.sru.searchCitations",
                c,
            );
        });
    }
    function E(a) {
        dji.tabsManager.sendTabMessage(
            a,
            window.dji.messages.sru.SETTINGS,
            Z(),
        );
    }
    function Z() {
        return {
            colors: sru.userData.settings.colors(),
            autoSpeak: sru.userData.settings.speechAuto(),
            translationEnabled: sru.userData.settings.enableTranslation(),
            translationLanguage: sru.userData.settings.translationLanguage(),
            defineWord: {
                userDefined: sru.userData.settings.defineWordUserDefined(),
                openOnDoubleClick: sru.userData.settings.openOnDoubleClick(),
            },
            readingGuide: {
                overlay: sru.userData.settings.overlayColor(),
                lineGuide: sru.userData.settings.lineGuideColor(),
            },
            rewordify: {
                enable: sru.userData.settings.enableRewordify(),
                fluencyLevel: sru.userData.settings.rewordifyFluency(),
            },
            pdf: {
                autoOpen: sru.userData.settings.pdfAutoOpen(),
                userDefined: sru.userData.settings.pdfUserDefined(),
            },
            gdocsConfig: window.dji.config.gdocsConfig(),
        };
    }
    async function ca(a, b) {
        return new Promise((c) => {
            sru.measurements.update(
                {scope: b, text: a, isNew: !0},
                null,
                (d) => {
                    c(d.measurements);
                },
            );
        });
    }
    async function k(a, b) {
        if (!sru.userData.privacyMode()) {
            if (!a.website) {
                var c = dji.tabsManager.activeTab();
                c = (c && c.url.hostname) || "extensions";
                "extensions" === c && (c = chrome.runtime.id);
                a.website = c;
            }
            a.feature = a.feature || "NA";
            switch (a.eventName) {
                case "TranslateOn":
                    a.customProperties = a.customProperties || {};
                    a.customProperties.language_used =
                        sru.userData.settings.translationLanguage().name;
                    a.customProperties.voice_used =
                        sru.userData.settings.translationVoice();
                    break;
                case "SimplifyVocabularyOn":
                    a.customProperties = a.customProperties || {};
                    a.customProperties.fluency_level =
                        sru.userData.settings.rewordifyFluency();
                    break;
                case "SpeakOn":
                    a.customProperties = a.customProperties || {};
                    a.customProperties.voice_used =
                        sru.userData.settings.speechVoice();
                    break;
                case "ColourOverlayOn":
                    a.customProperties = a.customProperties || {};
                    a.customProperties.highlight_color =
                        sru.userData.settings.lineGuideColor();
                    a.customProperties.highlight_background =
                        sru.userData.settings.overlayColor();
                    break;
                case "OutlineTextAdded":
                    (c = a.customProperties.text),
                        delete a.customProperties.text,
                        (c = await ca(c, sru.measurements.Scope.OAT)),
                        (a.customProperties.number_of_words = c.wordCount);
            }
            GoogleAnalytics.pushEvent(a, b);
        }
    }
    function R(a) {
        dji.fileSystem.persistent.readFile("env.config", function (b) {
            if (b)
                try {
                    var c = JSON.parse(b),
                        d = c.configName;
                    for (b = 0; b < c.configs.length; b++) {
                        var f = c.configs[b];
                        f.name === d && dji.config.update(f);
                    }
                } catch (q) {
                    dji.logger.error(q);
                }
            jsdapi.http.setup({
                headers: {
                    "x-dji-app-product": "sru",
                    "x-dji-app-platform": "chrome-extension",
                    "x-dji-app-os": dji.utils.os().name,
                },
            });
            jsdapi.setServerUrl({
                login: dji.config.loginUrl(!0),
                dapi: dji.config.dapiUrl(),
            });
            window.jsdapi.resources.setUrls({
                resources: dji.config.resourcesUrl(),
                dapi: dji.config.dapiUrl(),
            });
            jsdapi.setRefreshTokenDelegate(dji.login.silentRefreshToken);
            jsdapi.setClientId(dji.config.clientID());
            jsdapi.translate.setServerUrl(dji.config.translateUrl());
            jsdapi.citations.setServerUrl(dji.config.citationsUrl());
            a();
        });
    }
    function Ma(a) {
        dji.fileSystem.persistent.removeFile("/info", function () {
            a && a();
        });
    }
    function A(a) {
        var b = dji.login.userInfo();
        b = b ? JSON.stringify(b) : "";
        b = CryptoJS.AES.encrypt(b, "#@$2sdfs%4wdfsdfgfsdada#$#$@#Qw");
        dji.fileSystem.persistent.writeFile("/info", b, function () {
            a && a();
        });
    }
    function w(a) {
        dji.login.isLoggedIn()
            ? da(dji.login.userInfo(), a)
            : T(function (b) {
                  b && dji.login.userInfo(b);
                  dji.login.isLoggedIn()
                      ? da(dji.login.userInfo(), a)
                      : a && a();
              });
    }
    function T(a) {
        dji.fileSystem.persistent.readFileAsBinaryString("/info", function (b) {
            var c = null;
            if (b && 0 < b.length)
                try {
                    (b = CryptoJS.AES.decrypt(
                        b,
                        "#@$2sdfs%4wdfsdfgfsdada#$#$@#Qw",
                    )) &&
                        0 < b.sigBytes &&
                        (c = JSON.parse(CryptoJS.enc.Utf8.stringify(b)));
                } catch (d) {
                    dji.logger.error(d);
                }
            a(c);
        });
    }
    function da(a, b) {
        a
            ? sru.userData.initialize(a.checksum, function () {
                  D();
                  b && b();
              })
            : b && b();
    }
    function U(a, b) {
        a
            ? sru.userData.uninitialize(a.checksum, function () {
                  Ma(b);
              })
            : b && b();
    }
    function Ba(a) {
        P = a;
        chrome.runtime.sendMessage({
            message: "com.donjohnston.sru.syncInProgress",
            status: P,
        });
    }
    function ya(a) {
        a.settingsUpdates || X();
    }
    function za(a, b) {
        b && (D(), E(null), X(), C());
    }
    function xa(a) {
        a = sru.userData.syncCheckOutlinesUpdate(a);
        g.on &&
            a &&
            a.deleted &&
            dji.tabsManager.sendTabMessage(
                null,
                "com.donjohnston.sru.outlines.dataUpdated",
                {
                    outlines: {delete: a.deleted},
                    outlinesUiPath: v.outlinesUiPath,
                },
            );
        return a ? a.data : null;
    }
    function Aa(a) {
        a = sru.userData.syncSaveOutlinesData(a);
        g.on &&
            a &&
            (a.downloaded || a.deleted) &&
            dji.tabsManager.sendTabMessage(
                null,
                "com.donjohnston.sru.outlines.dataUpdated",
                {
                    outlines: {
                        update: a.downloaded
                            ? sru.userData.outlines.all(a.downloaded)
                            : null,
                        delete: a.deleted,
                    },
                },
            );
    }
    function D() {
        dji.tts.settings(sru.userData.settings.speech());
        dji.tts.settings(sru.userData.settings.translation());
    }
    function C() {
        chrome.tabs.query({url: r.optionsPattern}, function (a) {
            try {
                for (let b = 0; b < a.length; b++)
                    chrome.tabs.reload(a[b].id, {bypassCache: !0});
            } catch (b) {
                dji.logger.error(b);
            }
        });
    }
    function Na(a, b) {
        chrome.tabs.query({url: a}, function (c) {
            try {
                for (let d = 0; d < c.length; d++) chrome.tabs.remove(c[d].id);
            } catch (d) {
                dji.logger.error(d);
            }
            b instanceof Function && b();
        });
    }
    function G(a) {
        var b = dji.login.userInfo();
        const c = new URL(dji.config.pdfOrbitNoteUrl());
        "drive" === a.scope
            ? (c.searchParams.set(
                  "file",
                  `https://drive.google.com/uc?id=${a.doc.id}`,
              ),
              c.searchParams.set("export", "download"))
            : a.url &&
              ((a = new URL(a.url)),
              (a.hash = ""),
              c.searchParams.set("file", a.href));
        if ((a = b.email || b["@dem"])) {
            var d = b.provider.toLowerCase();
            d = Oa.has(d) ? d : "dapi";
            c.searchParams.set("provider", d);
            c.searchParams.set("email", a);
        }
        (b = b.name || b.username) && c.searchParams.set("name", b);
        return c.href;
    }
    async function La(a, b) {
        let c = null;
        try {
            let d = await fetch(a, {credentials: "same-origin"});
            if (d.ok) {
                let f = await d.blob();
                c = await dji.utils.blobToBase64(f);
            }
        } catch (d) {
            dji.logger.error(d);
        }
        b(c);
    }
    async function B() {
        var a = (B.__timestamp = B.__timestamp || 0);
        a = Date.now() - a;
        if (!(-1e3 < a && 9e5 > a)) {
            a = window.dji.fileSystem.persistent;
            try {
                (!(await window.jsdapi.resources.downloadSensitiveWordsResourcesAsync(
                    Q.sensitiveWords,
                    a,
                )) &&
                    window.sru.native.hasSensitiveWords()) ||
                    window.sru.native.reloadSensitiveWordsAsync(
                        a,
                        Q.sensitiveWords,
                    ),
                    (B.__timestamp = Date.now());
            } catch (b) {
                window.dji.logger.error(b);
                try {
                    await a.removeDirectoryAsync(Q.sensitiveWords);
                } catch (c) {
                    window.dji.logger.error(c);
                }
            }
        }
    }
    const Oa = new Set(["google", "microsoft"]);
    let r = {
            pattern: `chrome-extension://${chrome.runtime.id}/*`,
            optionsPattern: `chrome-extension://${chrome.runtime.id}/options/options.html`,
            options: "/options/options.html",
        },
        m = {
            loading: {
                19: "../resources/graphics/sruLoading_19.png",
                38: "../resources/graphics/sruLoading_38.png",
            },
            notLoggedIn: {
                19: "../resources/graphics/sruNotLoggedIn_19.png",
                38: "../resources/graphics/sruNotLoggedIn_38.png",
            },
            active: {
                19: "../resources/graphics/sruActive_19.png",
                38: "../resources/graphics/sruActive_38.png",
            },
            inactive: {
                19: "../resources/graphics/sruInactive_19.png",
                38: "../resources/graphics/sruInactive_38.png",
            },
            pdfInactive: {
                19: "../resources/graphics/sruPDFinactive_19.png",
                38: "../resources/graphics/sruPDFinactive_38.png",
            },
        },
        g = {uuid: dji.utils.generateUUID(), loaded: !1, on: !1},
        v = {outlinesVisible: !1, outlinesUiPath: []},
        t = {start: null, progress: null, stop: null},
        p = !1,
        h = {},
        y = [],
        l = {},
        P = !1,
        ea = !1,
        Q = {sensitiveWords: "/common/sensitive-words"};
    e.isLoaded = function () {
        return g.loaded;
    };
    e.isTurnOnInProgress = function () {
        return p;
    };
    e.isLoggedIn = function () {
        return dji.login.isLoggedIn();
    };
    e.isOn = function () {
        return g.on;
    };
    e.userInfo = function () {
        return dji.login.userInfo();
    };
    e.allowChanges = function () {
        return ["<all>"];
    };
    e.initialize = function () {
        dji.logger.monitor({event: "bm_intialize_start"});
        dji.logger.groupCollapsed("Initialize background manager");
        chrome.browserAction.setIcon({path: m.loading});
        chrome.browserAction.setBadgeBackgroundColor({color: "#777777"});
        chrome.runtime.onMessage.addListener(Ka);
        fa();
    };
    e.onRemoveDistractions = function (a) {
        dji.tabsManager.sendTabMessage(
            a.tabId,
            "com.donjohnston.sru.removeDistractions",
        );
    };
    e.queryDistractionsState = function (a) {
        let b = dji.tabsManager.activeTab().tabId;
        dji.tabsManager.sendTabMessage(
            b,
            "com.donjohnston.sru.query.distractionsState",
            void 0,
            function (c) {
                dji.utils.ignoreLastError();
                "function" === typeof a && a(...arguments);
            },
        );
    };
    e.onGA4Event = k;
    e.getMe = function (a) {
        jsdapi.account.me(a);
    };
    e.applyActivationCode = function (a, b) {
        jsdapi.account.applyActivationCode({activationCode: a}, b);
    };
    e.signOut = function (a) {
        u("activationStatus");
        dji.notifications.clearAll();
        dji.tts.stop();
        dji.tts.settings(null);
        for (var b in h)
            h.hasOwnProperty(b) && (h[b] = {session: dji.utils.generateUUID()});
        b = dji.tabsManager.activeTab();
        x(b ? b.tabId : -1);
        g.uuid = dji.utils.generateUUID();
        g.on && M(!1);
        dji.tabsManager.broadcastTabMessage(
            window.dji.messages.sru.SIGNOUT,
            {},
        );
        sru.measurements.reset();
        delete n.__session;
        sru.sync.stop();
        l.SR &&
            (chrome.contextMenus.remove(l.SR), delete l.define, delete l.SR);
        dji.login.silentSignout(function (c) {
            if (c) {
                v = {outlinesVisible: !1, outlinesUiPath: []};
                sru.userData.uninitialize();
                jsdapi.setAuth(null);
                sru.native.closeWorkers();
                if (a)
                    try {
                        a(c);
                    } catch (d) {
                        dji.logger.error(d);
                    }
                A(function () {
                    chrome.browserAction.setIcon({path: m.notLoggedIn});
                });
                a && W(!1);
                Na(r.optionsPattern, () => {
                    u("activationStatus");
                });
            } else {
                n();
                if (a)
                    try {
                        a(c);
                    } catch (d) {
                        dji.logger.error(d);
                    }
                u("activationStatus");
            }
        });
    };
    dji.pdf.__djiPdfExtSetGreenlightHandler(function (a) {
        return !(
            !dji.login.isLoggedIn() || !sru.userData.settings.pdfAutoOpen()
        );
    });
    dji.pdf.setComputePdfViewerUrlHandler(G);
    e.openPDFOnlyOnce = function (a, b) {
        if (a && a.extras.isPdf && a.url) {
            var c = G({url: a.url.href});
            c && chrome.tabs.update(a.tabId, {url: c}, b);
        }
    };
    e.isOn = function () {
        return dji.login.isLoggedIn() && g.on;
    };
    e.toggleExtension = function (a) {
        L(a);
    };
    e.goToOptions = function () {
        I();
    };
    e.queryOutlinesState = function (a) {
        dji.tabsManager.sendTabMessage(
            null,
            "com.donjohnston.sru.query.outlinesState",
            void 0,
            a,
        );
    };
    e.toggleOutlines = function (a) {
        dji.tabsManager.sendPortMessage(
            null,
            "com.donjohnston.sru.showOutlines",
            {show: a},
        );
    };
    e.openPDFReader = async function () {
        const a = G({});
        if (a) {
            var b = (d) => new Promise((f) => chrome.tabs.query({url: d}, f)),
                c = await dji.tabsManager.detectActiveTabAsync();
            if (c && c.url && c.url.origin === a)
                return chrome.tabs.update(c.id, {active: !0});
            c = await b(a);
            if (!c || 0 >= c.length) c = await b(`${a}/*`);
            if (c && 0 < c.length)
                return chrome.tabs.update(c[0].id, {active: !0});
            k({
                eventName: "PDFReaderOpened",
                category: "Feature",
                feature: "PDF Reader",
            });
            chrome.tabs.create({url: a, active: !0});
        }
    };
    e.openPDFWithInfo = function (a) {
        (a = G(a)) && chrome.tabs.create({url: a, active: !0});
    };
    e.getActiveTabInfo = function () {
        return dji.tabsManager.activeTab();
    };
    e.syncInProgress = function () {
        return P;
    };
    e.signOutInProgress = function (a) {
        if (void 0 === a) return ea;
        ea = a;
    };
    e.detectActiveTabInfoAsync = dji.tabsManager.detectActiveTabAsync;
    e.tabInfo = dji.tabsManager.tab;
    e.createWordBank = function (a) {
        const b = dji.config.wbPWAUrl();
        var c = a.tabId;
        a = a.url;
        c = btoa(
            JSON.stringify({
                timestamp: Date.now(),
                extensionId: chrome.runtime.id,
                tabId: c,
                checksum: btoa(`${chrome.runtime.id} / ${c} / ${a}`),
            }),
        );
        chrome.tabs.create({
            url: `${b}/create?token=${encodeURIComponent(c)}`,
            active: !0,
        });
    };
    e.getWordBankData = function (a, b) {
        dji.tabsManager.sendTabMessage(
            a,
            "com.donjohnston.sru.wb.data",
            void 0,
            function (c) {
                dji.utils.ignoreLastError();
                if (!c || !c.success) return b({success: !1});
                const d = dji.tabsManager.tab(a);
                ca(c.text, sru.measurements.Scope.CWB).then((f) => {
                    k({
                        website: d.url.hostname,
                        eventName: "WordbankCreated",
                        category: "Feature",
                        feature: "WordBank",
                        customProperties: {
                            word_count: f.wordCount,
                            text_level: f.averageGradeLevel,
                        },
                    });
                    b({
                        success: !!c.success,
                        title: c.title,
                        url: c.url,
                        text: c.text,
                    });
                });
                return !0;
            },
        );
    };
})((window.sru.backgroundManager = window.sru.backgroundManager || {}));
