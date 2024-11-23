(function () {
    function k() {
        dji.account.initialize(e);
        sru.colorOptions.initialize(d.sru.userData.settings);
        sru.speechOptions.initialize(d.sru.userData.settings, d.dji.tts);
        sru.rewordifyOptions.initialize(d.sru.userData.settings);
        sru.translationOptions.initialize(
            d.sru.userData.settings,
            d.dji.tts,
            d.jsdapi.translate,
        );
        sru.pdf.initialize(d.sru.userData.settings);
        sru.defineWordOptions.initialize(d.sru.userData.settings);
        sru.overlayOptions.initialize(d.sru.userData.settings);
        dji.ui.modalDlg.hideDlg();
        var a = e.allowChanges();
        (-1 === a.indexOf("<none>") && -1 === a.indexOf("<no-overrides>")) ||
            $("div[dji-sru-options]").addClass("dji-sru-not-allow-changes");
        a = e.userInfo();
        $("#dji-sru-user-name")
            .find("span")
            .text(a.name || a.email || a.username);
        a &&
            a.anonymous &&
            ($("#dji-sru-connect-with-educator").remove(),
            $("#dji-sru-change-user-password").remove());
        $("#dji-sru-user-name")
            .on("click", "#dji-sru-connect-with-educator", h)
            .on("click", "#dji-sru-change-user-password", n)
            .on("click", "#dji-sru-sign-out", U)
            .on("click", m);
        $(".dji-sru-option-color-picker-value")
            .on("click", ".dji-sru-color-item", V)
            .on("click", ".dji-sru-color-template", y)
            .on("click", ".dji-sru-colors-tab-items .dji-sru-tab-button", J);
        $(".dji-sru-color-picker-value").on("click", x);
        $(".dji-sru-options-view").on("click", ".dji-sru-switch-container", v);
        $(".dji-sru-option-dropdown-item")
            .on("click", ".dji-sru-menu-item", z)
            .on("click", A);
        dji.ui.modalDlg.hideDlg();
        $("body").removeClass("dji-sru-not-ready");
    }
    function t(a) {
        (e = d.sru ? d.sru.backgroundManager : null) &&
        e.isLoaded() &&
        e.isLoggedIn()
            ? k()
            : (1 === a &&
                  dji.ui.modalDlg.showMessageDlg("dji-sru-wait-message"),
              e &&
                  e.isLoaded() &&
                  !e.isLoggedIn() &&
                  (dji.ui.modalDlg.hideDlg(),
                  dji.ui.modalDlg.showMessageDlg(
                      "dji-sru-please-sign-in-message",
                  )),
              setTimeout(function () {
                  t(a + 1);
              }, 1e3));
    }
    function m(a) {
        dji.ui.dropdown.showPopup(a.currentTarget, {
            alignTop: !0,
            alignRight: !0,
        });
    }
    function h(a) {
        a.stopPropagation();
        a.preventDefault();
        dji.ui.dropdown.hidePopup();
        dji.account.showConnectToEducatorModalDlg();
    }
    function n(a) {
        a.stopPropagation();
        a.preventDefault();
        dji.ui.dropdown.hidePopup();
        a =
            d.dji.config.sruUrl() +
            "/change-password?redirect_uri=" +
            chrome.runtime.getURL("go.html");
        window.location = a;
    }
    function U(a) {
        a.stopPropagation();
        a.preventDefault();
        dji.ui.dropdown.hidePopup();
        dji.ui.modalDlg.showMessageDlg("dji-sru-signing-out-message");
        e.signOut(function (l) {
            l || dji.ui.modalDlg.hideDlg();
        });
    }
    function V(a) {
        let l = a.currentTarget.style.backgroundColor,
            q =
                a.currentTarget.children[0] &&
                a.currentTarget.children[0].classList.contains(
                    "dji-sru-no-color-icon",
                );
        a.preventDefault();
        a.stopPropagation();
        $(a.currentTarget)
            .closest(".dji-sru-color-picker-value")
            .trigger({type: "change", color: l, noOverlay: q});
    }
    function y(a) {
        let l = a.currentTarget.style.backgroundColor,
            q = a.currentTarget.style.color;
        a.preventDefault();
        a.stopPropagation();
        $("body").trigger({
            type: "dji-sru-change-colors",
            color: q,
            highlightColor: l,
        });
    }
    function J(a) {
        $(a.currentTarget)
            .parent()
            .find(".dji-sru-tab-button.dji-sru-selected")
            .removeClass("dji-sru-selected");
        $(a.currentTarget).addClass("dji-sru-selected");
        $(a.currentTarget)
            .closest(".dji-sru-color-popup")
            .attr("dji-sru-view-mode", $(a.currentTarget).attr("dji-sru-item"));
        a.preventDefault();
        a.stopPropagation();
    }
    function x(a) {
        $(a.target).hasClass("dji-sru-color-picker-value")
            ? dji.ui.colorPicker.showPopup(a.target)
            : $(a.target.parentElement.parentElement).hasClass(
                  "dji-sru-color-picker-value",
              ) &&
              dji.ui.colorPicker.showPopup(
                  a.target.parentElement.parentElement,
              );
    }
    function v(a) {
        $(a.currentTarget).toggleClass("dji-sru-on");
        let l = $(a.currentTarget).hasClass("dji-sru-on");
        $(a.currentTarget).trigger({type: "change", checked: l});
    }
    function A(a) {
        ($(a.currentTarget).hasClass("dji-sru-option-dropdown-item") ||
            $(a.currentTarget).hasClass("dji-sru-dropdown")) &&
            dji.ui.dropdown.showPopup(a.currentTarget);
    }
    function z(a) {
        let l = $(a.currentTarget).text().trim(),
            q = $(a.currentTarget).closest(".dji-sru-option-dropdown-item");
        q.find(".dji-sru-option-item-value").text(l);
        q.trigger({
            type: "change",
            value: $(a.currentTarget).attr("dji-sru-value"),
            text: l,
        });
        dji.ui.dropdown.hidePopup();
        a.stopPropagation();
        a.preventDefault();
    }
    function B() {
        if (e)
            e.onGA4Event({
                website: location.hostname,
                eventName: "TranslateSettingChanged",
                category: "Settings",
                customProperties: {
                    onoff_state: "on",
                    into_language:
                        d.sru.userData.settings.translationLanguage().name,
                    translate_voice: d.sru.userData.settings.translationVoice(),
                },
            });
    }
    function C() {
        if (e)
            e.onGA4Event({
                website: location.hostname,
                eventName: "TranslateSettingChanged",
                category: "Settings",
                customProperties: {onoff_state: "off"},
            });
    }
    function D() {
        if (e)
            e.onGA4Event({
                website: location.hostname,
                eventName: "TranslateIntoChanged",
                category: "Settings",
                customProperties: {
                    into_language:
                        d.sru.userData.settings.translationLanguage().name,
                },
            });
    }
    function E() {
        if (e)
            e.onGA4Event({
                website: location.hostname,
                eventName: "TranslateVoiceChanged",
                category: "Settings",
                customProperties: {
                    translate_voice: d.sru.userData.settings.translationVoice(),
                },
            });
    }
    function F() {
        if (e)
            e.onGA4Event({
                website: location.hostname,
                eventName: "DictionarySettingChanged",
                category: "Settings",
                customProperties: {onoff_state: "on"},
            });
    }
    function G() {
        if (e)
            e.onGA4Event({
                website: location.hostname,
                eventName: "DictionarySettingChanged",
                category: "Settings",
                customProperties: {onoff_state: "off"},
            });
    }
    dji.logger.logLevel(dji.logger.levels.TODO);
    dji.logger.info(
        'Options page for "' +
            chrome.runtime.getManifest().name +
            '" (' +
            chrome.runtime.id +
            ")",
    );
    let d = chrome.extension.getBackgroundPage(),
        e = d.sru ? d.sru.backgroundManager : null;
    $(document).ready(function () {
        $("body").addClass("dji-sru-not-ready");
        dji.templates.cache();
        d || (d = chrome.extension.getBackgroundPage());
        if ((e = d.sru ? d.sru.backgroundManager : null)) {
            var a = d.dji.config.sruUrl();
            $("a[dji-sru-url]").attr("href", a);
            $("a[dji-sru-privacy-policy-url]").attr(
                "href",
                a + "/privacy-policy",
            );
            $("a[dji-sru-tos-url]").attr("href", a + "/tos");
        }
        a = $("#dji-sru-main-overlay");
        dji.ui.colorPicker.init(a);
        a = $("#dji-sru-main-overlay");
        dji.ui.dropdown.init(a);
        a = $("#dji-sru-modal-dlg-overlay");
        dji.ui.modalDlg.init(a);
        dji.ui.toast.init();
        sru.translationOptions.addEventListener("activate", B);
        sru.translationOptions.addEventListener("deactivate", C);
        sru.translationOptions.addEventListener("intoChanged", D);
        sru.translationOptions.addEventListener("voiceChanged", E);
        sru.defineWordOptions.addEventListener("activate", F);
        sru.defineWordOptions.addEventListener("deactivate", G);
        t(1);
    });
})();
(function () {
    function k() {
        for (
            var b = A.value.trim(),
                c = z.value.trim(),
                g = B.value.trim(),
                w = C.value.trim(),
                H = D.value.trim(),
                K = E.value.trim(),
                r = F.value.trim().split("\n"),
                L = G.checked,
                M = d.value.trim(),
                N = e.value.trim(),
                O = a.value.trim(),
                P = l.value.trim(),
                Q = S.value.trim(),
                R = T.value.trim(),
                p = 0;
            p < r.length;
            p++
        )
            (r[p] = r[p].trim()), 0 === r[p].length && (r.splice(p, 1), p--);
        if (
            0 !== b.length &&
            0 !== c.length &&
            0 !== g.length &&
            0 !== w.length &&
            0 !== H.length &&
            0 !== r.length
        ) {
            p = {disablePrimaryRenderer: q.checked};
            var f = h(b);
            f
                ? ((f.login = c),
                  (f.dapi = g),
                  (f.translate = w),
                  (f.citations = H),
                  (f.tts = K),
                  (f.relatedUris = r),
                  (f.pdfOrbitNote = M),
                  (f.sru = N),
                  (f.define = O),
                  (f.wbPWA = P),
                  (f.gdocsConfig = p),
                  (f.gaMeasurementId = Q),
                  (f.gaApiSecret = R))
                : ((f = {
                      name: b,
                      login: c,
                      dapi: g,
                      translate: w,
                      citations: H,
                      tts: K,
                      relatedUris: r,
                      pdfOrbitNote: M,
                      sru: N,
                      define: O,
                      wbPWA: P,
                      gaMeasurementId: Q,
                      gaApiSecret: R,
                      gdocsConfig: p,
                  }),
                  u.push(f));
            L ? (f.permissive = L) : delete f.permissive;
            I = b;
            x.style.display = "none";
            b = {configName: I, configs: u};
            b = JSON.stringify(b);
            J.writeFile("env.config", b, () => chrome.runtime.reload());
        }
    }
    function t() {
        x.style.display = "none";
    }
    function m() {
        let b = u[v.selectedIndex];
        A.value = b.name;
        z.value = b.login;
        B.value = b.dapi;
        C.value = b.translate;
        D.value = b.citations;
        E.value = b.tts;
        F.value = b.relatedUris.join("\n");
        G.checked = !!b.permissive;
        d.value = b.pdfOrbitNote;
        e.value = b.sru;
        a.value = b.define;
        l.value = b.wbPWA;
        S.value = b.gaMeasurementId;
        T.value = b.gaApiSecret;
        q.checked = b.gdocsConfig?.disablePrimaryRenderer;
    }
    function h(b) {
        for (let c = 0; c < u.length; c++) {
            let g = u[c];
            if (g.name === b) return g;
        }
        return null;
    }
    function n() {
        if (!x) {
            var b = Date.now(),
                c = "__dapi-0-" + b,
                g = "__dapi-1-" + b,
                w = "__dapi-2-" + b,
                H = "__dapi-3-" + b,
                K = "__dapi-4-" + b,
                r = "__dapi-5-" + b,
                L = "__dapi-6-" + b,
                M = "__dapi-7-" + b,
                N = "__dapi-8-" + b,
                O = "__dapi-9-" + b,
                P = "__dapi-11-" + b,
                Q = "__dapi-12-" + b,
                R = "__dapi-13-" + b,
                p = "__dapi-14-" + b,
                f = "__dapi-15-" + b,
                W = "__dapi-16-" + b,
                X = "__dapi-17-" + b,
                Y = "__dapi-18-" + b,
                Z = "__dapi-100-" + b,
                aa = "__dapi-101-" + b;
            b = (
                '<div id="#0" style="display:none;position:fixed;top:0;left:0;bottom:0;right:0;background-color:rgba(100,0,0,0.8);cursor:default;z-index:9999999999;"><style>table.opt-' +
                b +
                " input, table.opt-" +
                b +
                ' textarea {font-family: monospace;font-size: 12px;}</style><div style="margin:50px auto;width:500px;height:630px;background-color:#FFFFFF;padding:20px;"><h2>Login &amp; D:API settings (<i>you better logout first</i>)</h2><table style="width:100%;margin-top:2px;font-size:14px;" class="opt-' +
                b +
                '"><tr><td style="width:125px;">Predefined:</td><td><select id="#1" style="width:100%"></select></td></tr><tr><td colspan="2" align="right"><hr/></td></tr><tr><td>Name*:</td><td><input id="#2" type="text" style="width:100%;"/></td></tr><tr><td>Login URL*:</td><td><input id="#3" type="text" style="width:100%;"/></td></tr><tr><td style="width:125px;">D:API URL*:</td><td><input id="#4" type="text" style="width:100%;"/></td></tr><tr><td style="width:125px;">Translate URL*:</td><td><input id="#5" type="text" style="width:100%;"/></td></tr><tr><td style="width:125px;">Citations URL*:</td><td><input id="#6" type="text" style="width:100%;"/></td></tr><tr><td style="width:125px;">TTS URL*:</td><td><input id="#7" type="text" style="width:100%;"/></td></tr><tr><td valign="top" style="width:125px;">Related URL*:</td><td><textarea id="#8" style="width:100%;height: 60px;"></textarea></td></tr><tr><td style="width:125px;">Permissive:</td><td><input id="#9" type="checkbox"/></td></tr><tr><td style="width:125px;">OrbitNote URL*:</td><td><input id="#14" type="text" style="width:100%;"/></td></tr><tr><td style="width:125px;">Snap&amp;Read URL*:</td><td><input id="#11" type="text" style="width:100%;"/></td></tr><tr><td style="width:125px;">Define URL*:</td><td><input id="#12" type="text" style="width:100%;"/></td></tr><tr><td style="width:125px;">WB PWA URL*:</td><td><input id="#13" type="text" style="width:100%;"/></td></tr><tr><td style="width:125px;">GA Measurement ID*:</td><td><input id="#17" type="text" style="width:100%;"/></td></tr><tr><td style="width:125px;">GA API Secret*:</td><td><input id="#18" type="text" style="width:100%;"/></td></tr><tr><td colspan="2" align="right"><hr/></td></tr><tr><td valign="top" style="width:100px;">Google docs:</td><td><input type="checkbox" id="#15" name="#15"/><label id="#16" for="#15" valign="top"> Disable primary renderer</label><br></td></tr><tr><td colspan="2" style="text-align:right;padding-top:10px;">The new settings will be applied next time you reload the extension and login.</td></tr><tr><td colspan="2" style="text-align:right;padding-top:10px;"><button id="#100">OK</button>&nbsp;<button id="#101">Cancel</button></td></tr></table></div></div>'
            )
                .replace("#0", c)
                .replace("#1", g)
                .replace("#2", w)
                .replace("#3", H)
                .replace("#4", K)
                .replace("#5", r)
                .replace("#6", L)
                .replace("#7", M)
                .replace("#8", N)
                .replace("#9", O)
                .replace("#11", P)
                .replace("#12", Q)
                .replace("#13", R)
                .replace("#14", p)
                .replace("#15", f)
                .replace("#16", W)
                .replace("#17", X)
                .replace("#18", Y)
                .replace("#100", Z)
                .replace("#101", aa);
            document.body.insertAdjacentHTML("beforeend", b);
            x = document.getElementById(c);
            v = document.getElementById(g);
            A = document.getElementById(w);
            z = document.getElementById(H);
            B = document.getElementById(K);
            C = document.getElementById(r);
            D = document.getElementById(L);
            E = document.getElementById(M);
            F = document.getElementById(N);
            G = document.getElementById(O);
            e = document.getElementById(P);
            a = document.getElementById(Q);
            l = document.getElementById(R);
            d = document.getElementById(p);
            q = document.getElementById(f);
            S = document.getElementById(X);
            T = document.getElementById(Y);
            v.addEventListener("change", m);
            document.getElementById(Z).addEventListener("click", k);
            document.getElementById(aa).addEventListener("click", t);
            q.addEventListener("change", function () {
                document.getElementById(W).style.color = this.checked
                    ? "red"
                    : "black";
            });
        }
        if ("block" !== x.style.display) {
            for (c = null; (c = v.lastChild); ) v.removeChild(c);
            for (c = 0; c < u.length; c++)
                (g = u[c]),
                    (w = document.createElement("option")),
                    (w.innerText = g.name),
                    v.appendChild(w),
                    g.name === I && (v.selectedIndex = c);
            if ((c = h(I)))
                (A.value = c.name),
                    (z.value = c.login),
                    (B.value = c.dapi),
                    (C.value = c.translate),
                    (D.value = c.citations),
                    (E.value = c.tts),
                    (F.value = c.relatedUris.join("\n")),
                    (G.checked = !!c.permissive),
                    (d.value = c.pdfOrbitNote),
                    (e.value = c.sru),
                    (a.value = c.define),
                    (l.value = c.wbPWA),
                    (S.value = c.gaMeasurementId),
                    (T.value = c.gaApiSecret),
                    (q.checked = c.gdocsConfig?.disablePrimaryRenderer);
            x.style.display = "block";
        }
    }
    function U() {
        let b = "";
        document.addEventListener(
            "keydown",
            function (c) {
                if (!c.repeat) {
                    var g = !1;
                    !c.altKey || c.ctrlKey || c.shiftKey || c.metaKey
                        ? 0 < b.length && (b = "")
                        : ((c = String.fromCharCode(c.keyCode)),
                          32 <= c.charCodeAt(0) &&
                              (0 === b.length ||
                                  b.charAt(b.length - 1) !== c) &&
                              ((b += c), (g = !0)));
                    g && "QSX" === b && ((b = ""), n());
                }
            },
            !0,
        );
        document.addEventListener(
            "keyup",
            function (c) {
                !c.altKey && 0 < b.length && (b = "");
            },
            !0,
        );
    }
    function V(b) {
        J &&
            J.readFile("env.config", function (c) {
                if (c)
                    try {
                        let g = JSON.parse(c);
                        I = g.configName;
                        u = g.configs;
                    } catch (g) {
                        dji.logger.error(g);
                    }
                0 === u.length &&
                    ((u = y.dji.config.allEnvs()),
                    (I = y.dji.config.env().name));
                b();
            });
    }
    var y = chrome.extension.getBackgroundPage(),
        J = y.dji ? y.dji.fileSystem.persistent : null,
        x = null,
        v = null,
        A = null,
        z = null,
        B = null,
        C = null,
        D = null,
        E = null,
        F = null,
        G = null,
        d = null,
        e = null,
        a = null,
        l = null;
    let q = null,
        S = null,
        T = null;
    var I = null,
        u = [];
    $(document).ready(function () {
        V(U);
    });
})();
(function () {
    let k = null,
        t = null;
    $(document).ready(function () {
        let m = "";
        document.addEventListener(
            "keydown",
            function (h) {
                if (!h.repeat) {
                    var n = !1;
                    !h.altKey || h.ctrlKey || h.shiftKey || h.metaKey
                        ? 0 < m.length && (m = "")
                        : ((h = String.fromCharCode(h.keyCode)),
                          32 <= h.charCodeAt(0) &&
                              (0 === m.length ||
                                  m.charAt(m.length - 1) !== h) &&
                              ((m += h), (n = !0)));
                    n &&
                        "LOG" === m &&
                        ((m = ""),
                        (n = chrome.extension.getBackgroundPage()),
                        (n = new Blob([n.dji.logger.dump()], {
                            type: "application/octet-stream",
                        })),
                        (n = URL.createObjectURL(n)),
                        k ||
                            ((k = document.createElement("iframe")),
                            (k.style.position = "absolute"),
                            (k.style.top = "-5000px"),
                            (k.style.left = "-5000px"),
                            (k.style.width = "0"),
                            (k.style.height = "0"),
                            (k.style.overlay = "hidden"),
                            (k.style.display = "none"),
                            document.body.append(k),
                            (t = k.contentDocument.createElement("a")),
                            k.contentDocument.body.append(t)),
                        (t.href = n),
                        (t.download = `snapread-extension-${Date.now()}.log`),
                        t.click(),
                        URL.revokeObjectURL(n));
                }
            },
            !0,
        );
        document.addEventListener(
            "keyup",
            function (h) {
                !h.altKey && 0 < m.length && (m = "");
            },
            !0,
        );
    });
})();
