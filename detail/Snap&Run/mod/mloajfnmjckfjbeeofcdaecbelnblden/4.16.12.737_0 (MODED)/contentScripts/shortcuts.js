window.dji = window.dji || {};
(function (l) {
    function n() {
        let a = dji.utils.findValidIframeElements(void 0, !0);
        for (let e = 0; e < a.length; e++) {
            let f = a[e];
            try {
                f.removeEventListener("load", m);
            } catch (h) {}
            m.apply(f);
            f.addEventListener("load", m);
        }
    }
    function m() {
        dji.utils.validateIframe(this, !0) && p(this.contentWindow);
    }
    function p(a) {
        a = a.document;
        a.documentElement &&
            (a.removeEventListener("keydown", q),
            a.removeEventListener("keyup", r),
            a.addEventListener("keydown", q, !0),
            a.addEventListener("keyup", r, !0));
    }
    function q(a) {
        if (k)
            if (
                !a.altKey ||
                (a.ctrlKey && 32 !== a.which) ||
                a.shiftKey ||
                a.metaKey
            )
                c = b.None;
            else {
                49 === a.which
                    ? (c = b.Speak)
                    : 50 === a.which
                      ? (c = b.ScreenShot)
                      : 51 === a.which
                        ? (c = b.Rewordify)
                        : 52 === a.which
                          ? (c = b.Translate)
                          : 53 !== a.which &&
                            (37 === a.which
                                ? (c = b.Previous)
                                : 39 === a.which
                                  ? (c = b.Next)
                                  : 13 === a.which
                                    ? (c = b.Enter)
                                    : 32 === a.which && a.ctrlKey
                                      ? (c = b.Select)
                                      : 27 === a.which
                                        ? (c = b.Escape)
                                        : 88 === a.which
                                          ? (c = b.ContextMenu)
                                          : "Alt" !== a.key && (c = b.None));
                switch (c) {
                    case b.Previous:
                    case b.Next:
                    case b.Enter:
                    case b.Select:
                    case b.Escape:
                    case b.ContextMenu:
                        g() || (c = b.None);
                }
                c !== b.None && (a.stopPropagation(), a.preventDefault());
            }
    }
    function r(a) {
        if (k && c !== b.None) {
            let e = c;
            c = b.None;
            a.stopPropagation();
            a.preventDefault();
            a = e;
            a !== b.Ignore &&
                (a === b.Speak
                    ? dji.utils.callListeners(d, "speak")
                    : a === b.ScreenShot
                      ? dji.utils.callListeners(d, "screenshot")
                      : a === b.Rewordify
                        ? dji.utils.callListeners(d, "rewordify")
                        : a === b.Translate
                          ? dji.utils.callListeners(d, "translate")
                          : a === b.ToggleOutlines &&
                            dji.utils.callListeners(d, "toggleOutlines"),
                a === b.Previous
                    ? dji.utils.callListeners(d, "goPrevious")
                    : a === b.Next
                      ? dji.utils.callListeners(d, "goNext")
                      : a === b.Enter
                        ? dji.utils.callListeners(d, "enter")
                        : a === b.Select
                          ? dji.utils.callListeners(d, "select")
                          : a === b.Escape
                            ? dji.utils.callListeners(d, "escape")
                            : a === b.ContextMenu &&
                              dji.utils.callListeners(d, "contextMenu"));
        }
    }
    function g() {
        var a = (g.session = (g.session || 0) + 1);
        let e = new CustomEvent("com.donjohnston.query.vpat", {
                detail: {
                    app: "sru",
                    answer: {
                        event: "com.donjohnston.query.vpat.sru.ack",
                        session: a,
                    },
                },
            }),
            f = (g.ack = []);
        1 === a &&
            document.documentElement.addEventListener(
                "com.donjohnston.query.vpat.sru.ack",
                function (h) {
                    g.session === h.detail.session &&
                        g.ack.push({
                            app: h.detail.app,
                            priority: h.detail.priority,
                            active: h.detail.active,
                        });
                },
                !0,
            );
        document.documentElement.dispatchEvent(e);
        f.sort(t);
        for (a = 0; a < f.length; a++)
            if (f[a].active && 9e5 < f[a].priority) return !1;
        return !0;
    }
    function t(a, e) {
        return (e.priority || 0) - (a.priority || 0);
    }
    let b = {
            Ignore: -1,
            None: 0,
            Speak: 1,
            ScreenShot: 2,
            Rewordify: 3,
            Translate: 4,
            ToggleOutlines: 5,
            Previous: 200,
            Next: 201,
            Enter: 202,
            Select: 203,
            ContextMenu: 204,
            Escape: 205,
        },
        d = {
            speak: [],
            screenshot: [],
            rewordify: [],
            translate: [],
            toggleOutlines: [],
            enableNavigation: [],
            goPrevious: [],
            goNext: [],
            enter: [],
            select: [],
            contextMenu: [],
            escape: [],
        },
        k = !1,
        c = b.None;
    l.initialize = function () {
        p(window);
        dji.utils.isIframeFree() ||
            (new MutationObserver(n).observe(document, {childList: !0}), n());
    };
    l.addEventListener = function (a, e) {
        d.hasOwnProperty(a) &&
            "function" === typeof e &&
            -1 === d[a].indexOf(e) &&
            d[a].push(e);
    };
    l.isActive = function () {
        return k;
    };
    l.activate = function (a) {
        k = a;
        k || (c = b.None);
    };
})((window.dji.shortcuts = window.dji.shortcuts || {}));
