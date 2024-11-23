(function () {
    function k() {
        $("body").addClass("dji-sru-busy");
    }
    function l() {
        $("body").removeClass("dji-sru-busy");
    }
    async function n() {
        return new Promise((a, c) => {
            chrome.windows.getCurrent(function (e) {
                chrome.tabs.query(
                    {highlighted: !0, windowId: e.id, windowType: "normal"},
                    function (d) {
                        a(1 === d.length ? d[0] : null);
                    },
                );
            });
        });
    }
    async function t() {
        let a = await n();
        return new Promise((c, e) => {
            chrome.tabs.sendMessage(
                a.id,
                {message: {message: "com.donjohnstone.sru.document.info"}},
                function (d) {
                    c(d);
                },
            );
        });
    }
    async function h() {
        let a = await n();
        return b.tabInfo(a.id);
    }
    function u() {
        b.toggleExtension();
        window.close();
    }
    function v() {
        k();
        b.onGA4Event({
            website: location.hostname,
            eventName: b.isOn() ? "ApplicationStopped" : "ApplicationStarted",
            category: "Application",
        });
        b.toggleExtension(function () {
            l();
            p();
            b.isOn()
                ? $("#dji-sru-on").addClass("dji-sru-on")
                : $("#dji-sru-on").removeClass("dji-sru-on");
        });
    }
    function w() {
        b.goToOptions();
        window.close();
    }

    //  Toggle Outlines Setup:
    function x() {
        b.toggleOutlines("true");
        window.close();
    }

    function y() {
        b.openPDFReader();
        window.close();
    }
    async function z() {
        if (f) b.openPDFWithInfo(f);
        else {
            let a = await h();
            a && a.extras && a.extras.isPdf && b.openPDFOnlyOnce(a);
        }
        window.close();
    }
    function m() {
        b.syncInProgress() ? (b.signOutInProgress(!0), A()) : B();
        b.onGA4Event({
            website: location.hostname,
            eventName: "SignedOut",
            category: "Application",
        });
    }
    function B() {
        b.signOut(function (a) {
            b.signOutInProgress(!1);
            window.close();
        });
    }
    function C(a) {
        a.stopPropagation();
        b.signOutInProgress(!1);
        let c = $("[dji-sru-view='dji-sru-main-view']");
        setTimeout(function () {
            c.removeAttr("dji-sru-saving");
        }, 0);
    }
    async function D() {
        let a = await h();
        b.onRemoveDistractions(a);
        window.close();
    }
    async function E() {
        let a = await h();
        b.createWordBank(a);
        window.close();
    }
    function F(a, c, e) {
        "com.donjohnston.sru.notification" === a.message
            ? q()
            : "com.donjohnston.sru.syncInProgress" === a.message && r(a.status);
    }
    function p() {
        b.isOn()
            ? b.queryOutlinesState(function (a) {
                  let c = $("#dji-sru-toggle-outline");
                  a &&
                      a.state &&
                      ((a = c.find(".dji-sru-menu-item-icon i")),
                      a.removeClass("svg-show_outline"),
                      a.addClass("svg-hide_outline"),
                      c.find(".dji-sru-menu-item-text").text("Hide outlines"),
                      c.attr("dji-sru-outline-active", !1));
                  c.removeClass("dji-sru-disabled");
              })
            : $("#dji-sru-toggle-outline").addClass("dji-sru-disabled");
    }
    function G(a) {
        let c = $("#dji-sru-remove-distractions");
        a.isSpecialUrl
            ? c.addClass("dji-sru-disabled")
            : c.removeClass("dji-sru-disabled");
        b.queryDistractionsState(function (e) {
            if (e) {
                const d = c.find(".dji-sru-menu-item-icon i");
                e.active
                    ? (d.addClass("svg-show_original"),
                      d.removeClass("svg-remove_distractions"),
                      c.find(".dji-sru-menu-item-text").text("Show original"))
                    : (d.addClass("svg-remove_distractions"),
                      d.removeClass("svg-show_original"),
                      c
                          .find(".dji-sru-menu-item-text")
                          .text("Remove distractions"));
            }
        });
    }
    async function q() {
        b && b.isLoaded() ? l() : k();
        let a = await h(),
            c = !!(a && a.extras && a.extras.isPdf);
        c
            ? $("#dji-sru-open-pdf-in-sru").show()
            : $("#dji-sru-open-pdf-in-sru").hide();
        b.isLoggedIn()
            ? ($("#dji-sru-user-name")
                  .find(".dji-sru-menu-item-text")
                  .text(b.userInfo().name),
              $("[dji-sru-login]").show(),
              $("[dji-sru-no-login]").hide(),
              $("#dji-sru-open-pdf-reader").removeClass("dji-sru-disabled"),
              $("#dji-sru-open-pdf-in-sru").removeClass("dji-sru-disabled"),
              b.userInfo().enableWB || $("#dji-sru-create-word-bank").remove(),
              b.isTurnOnInProgress() ? k() : l())
            : ($("#dji-sru-open-pdf-reader").addClass("dji-sru-disabled"),
              $("#dji-sru-open-pdf-in-sru").addClass("dji-sru-disabled"),
              $("[dji-sru-login]").show(),
              $("[dji-sru-no-login]").hide());
        p();
        G(a);
        b.isOn()
            ? $("#dji-sru-on").addClass("dji-sru-on")
            : $("#dji-sru-on").removeClass("dji-sru-on");
        !c &&
            b.isLoggedIn() &&
            ((f = await t()) &&
            f.doc &&
            f.doc.id &&
            "application/pdf" === f.doc.type
                ? $("#dji-sru-open-pdf-in-sru").show()
                : $("#dji-sru-open-pdf-in-sru").hide());
        b.signOutInProgress() ? m() : r(b.syncInProgress());
    }
    function r(a) {
        let c = $("[dji-sru-view='dji-sru-main-view']");
        a
            ? c.attr("dji-sru-sync", !0)
            : (c.removeAttr("dji-sru-sync"), b.signOutInProgress() && m());
    }
    function A() {
        let a = $("[dji-sru-view='dji-sru-main-view']");
        setTimeout(function () {
            a.attr("dji-sru-saving", !0);
        }, 0);
    }
    function H() {
        b.onGA4Event({
            website: location.hostname,
            eventName: "ProfileOpened",
            category: "Settings",
        });
    }
    let g = chrome.extension.getBackgroundPage(),
        b = g.sru ? g.sru.backgroundManager : null,
        f = null;
    $(document).ready(function () {
        chrome.runtime.onMessage.addListener(F);
        $("#dji-sru-sign-in").on("click", u);
        $("#dji-sru-on").on("click", v);
        $("#dji-sru-toggle-outline").on("click", x);
        $("#dji-sru-options").on("click", w);
        $("#dji-sru-sign-out").on("click", m);
        $("#dji-sru-cancel-saving").on("click", C);
        $("#dji-sru-open-pdf-reader").on("click", y);
        $("#dji-sru-open-pdf-in-sru").on("click", z);
        $("#dji-sru-remove-distractions").on("click", D);
        $("#dji-sru-user-name").on("click", H);
        var a = b.userInfo();
        if (a && a.enableWB) $("#dji-sru-create-word-bank").on("click", E);
        q();
        g || (g = chrome.extension.getBackgroundPage());
        g && ((a = g.dji.config.sruUrl()), $("a[dji-sru-url]").attr("href", a));
    });
})();
