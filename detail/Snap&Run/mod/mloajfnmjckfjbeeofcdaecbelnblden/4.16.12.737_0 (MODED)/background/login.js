window.dji = window.dji || {};
(function (k) {
    function D(a) {
        e && e.id == a && ((e = null), setTimeout(M, 0));
    }
    function N() {
        chrome.tabs.create(
            {url: window.dji.config.loginUrl(), active: !0},
            function (a) {
                e = a;
                chrome.tabs.onRemoved.addListener(D);
            },
        );
    }
    function E(a) {
        u = a.url;
        chrome.tabs.remove(e.id);
    }
    function F(a) {
        dji.logger.monitor({event: "login_bsrrr_1a"});
        if ((a = dji.utils.jsonFromUrlQueryAndHash(a.url))) a = a.query;
        if (a) {
            if (a.hasOwnProperty("code"))
                try {
                    a.code = parseInt(a.code);
                } catch (b) {}
            if (a.hasOwnProperty("expires_at"))
                try {
                    a.expires_at = parseInt(a.expires_at);
                } catch (b) {}
        }
        dji.logger.monitor({event: "login_bsrrr_1b"});
        setTimeout(z, 0, a);
        return {redirectUrl: "javascript:"};
    }
    function G(a) {
        dji.logger.monitor({event: "login_hsrrr_1a", ...a});
        400 <= a.statusCode &&
            -1 == a.tabId &&
            0 < a.frameId &&
            (dji.logger.monitor({event: "login_hsrrr_1b"}),
            setTimeout(z, 0, {code: a.statusCode}));
        dji.logger.monitor({event: "login_hsrrr_1c"});
    }
    function H(a) {
        dji.logger.monitor({event: "login_esr_1a", ...a});
        -1 == a.tabId &&
            0 < a.frameId &&
            (dji.logger.monitor({event: "login_esr_1b"}),
            dji.logger.error(a),
            setTimeout(z, 0, null));
        dji.logger.monitor({event: "login_esr_1a"});
    }
    function I(a) {
        dji.logger.monitor({event: "login_bssr_1a"});
        if ((a = dji.utils.jsonFromUrlQueryAndHash(a.url))) a = a.query;
        if (a && a.hasOwnProperty("code"))
            try {
                a.code = parseInt(a.code);
            } catch (b) {}
        dji.logger.monitor({event: "login_bssr_1b"});
        setTimeout(A, 0, a);
        return {redirectUrl: "javascript:"};
    }
    function J(a) {
        dji.logger.monitor({event: "login_hsr_1a", ...a});
        400 <= a.statusCode &&
            -1 == a.tabId &&
            0 < a.frameId &&
            (dji.logger.monitor({event: "login_hsr_1b"}),
            setTimeout(A, 0, {code: a.statusCode}));
        dji.logger.monitor({event: "login_hsr_1c"});
    }
    function K(a) {
        dji.logger.monitor({event: "login_ess_1a", ...a});
        -1 == a.tabId &&
            0 < a.frameId &&
            (dji.logger.monitor({event: "login_ess_1b"}),
            dji.logger.error(a),
            setTimeout(A, 0, null));
        dji.logger.monitor({event: "login_ess_1c"});
    }
    async function O(a, b, c, d, n) {
        c = c || 3;
        d = d || 1e4;
        n = n || 0;
        dji.logger.monitor({
            event: "login_lr_1a",
            baseUrl: b,
            retryCount: c,
            baseTimeout: d,
            timeoutIncrement: n,
        });
        const B = new URL(b).origin,
            p = document.createElement("iframe");
        p.setAttribute("id", a);
        document.body.appendChild(p);
        try {
            for (a = 0; a < c; a++) {
                const l = `${chrome.runtime.id}/${Date.now()}/${Math.round(1e5 * Math.random())}`,
                    g = `${Date.now()}/${Math.round(1e5 * Math.random())}`,
                    q = `${b}&response_mode=message_post&response_message=${encodeURIComponent(l)}&state=${encodeURIComponent(g)}`,
                    v = d + a * n,
                    y = P(p.contentWindow, B, l, g, v);
                p.src = q;
                dji.logger.monitor({
                    event: "login_lr_2a",
                    url: q,
                    message: l,
                    state: g,
                    timeout: v,
                });
                try {
                    let m = await y;
                    dji.logger.monitor({
                        event: "login_lr_3a",
                        url: q,
                        message: l,
                        state: g,
                        timeout: v,
                    });
                    return m;
                } catch (m) {
                    if (
                        (dji.logger.monitor({
                            event: "login_lr_3b",
                            error: m,
                        }),
                        dji.logger.error(m),
                        "timeout" !== m.code)
                    )
                        throw m;
                }
            }
            dji.logger.monitor({
                event: "login_lr_1b",
                baseUrl: b,
                retryCount: c,
                baseTimeout: d,
                timeoutIncrement: n,
            });
            let r = Error("All retries have been used!");
            r.code = "no_more_retry";
            throw r;
        } finally {
            p.remove();
        }
    }
    async function P(a, b, c, d, n) {
        return new Promise((B, p) => {
            let r = null,
                l = null,
                g = null;
            const q = (f) => {
                    if (g) {
                        try {
                            g.port1.close();
                        } catch (V) {}
                        g = g.port1.onmessage = null;
                    }
                    f ||
                        (l && (clearInterval(l), (l = null)),
                        r && (clearTimeout(r), (r = null)),
                        window.removeEventListener("message", y));
                },
                v = () => {
                    q();
                    let f = Error(
                        "Timeout encountered while waiting for response!",
                    );
                    f.code = "timeout";
                    p(f);
                },
                y = (f) => {
                    f.source === a && f.origin === b && m(f);
                },
                m = (f) => {
                    if (
                        f.data instanceof Object &&
                        f.data.message === c &&
                        (void 0 === d || f.data.state === d)
                    )
                        return q(), B(f.data.data);
                };
            window.addEventListener("message", y);
            l = setInterval(() => {
                q(!0);
                g = new MessageChannel();
                g.port1.onmessage = m;
                a.postMessage({message: c, state: d}, b, [g.port2]);
            }, 2e3);
            n && (r = setTimeout(v, n));
        });
    }
    var Q = "https://" + chrome.runtime.id + ".chromiumapp.org",
        R = "https://" + chrome.runtime.id + ".chromiumapp.org/auth/callback",
        S =
            "https://" +
            chrome.runtime.id +
            ".chromiumapp.org/silent/token/refresh/callback",
        T =
            "https://" +
            chrome.runtime.id +
            ".chromiumapp.org/silent/token/refresh/callback?*",
        U =
            "https://" +
            chrome.runtime.id +
            ".chromiumapp.org/silent/signout/callback?*",
        L = /[?&](auth|lauth|sauth|signout)_stamp=97eb647a233b(&|#|$)/i,
        e = null,
        w = null,
        t = !1,
        u = null,
        h = null,
        x = dji.utils.generateUUID(),
        C = dji.utils.generateUUID();
    k.monitor = function (a) {
        a &&
            chrome.webRequest.onBeforeRequest.addListener(
                function (b) {
                    if (!(0 > b.tabId)) {
                        var c = null;
                        (0 == b.url.indexOf("https://") ||
                            0 == b.url.indexOf("http://")) &&
                            0 > b.url.indexOf(Q) &&
                            0 < b.url.indexOf("_stamp=97eb647a233b") &&
                            (c = new URL(b.url));
                        if (c && c.search)
                            if (
                                (dji.logger.monitor({event: "login_m_1a"}),
                                (b = c.search.match(L)))
                            )
                                if (
                                    ((b = b[1].toUpperCase()),
                                    "AUTH" == b || "LAUTH" == b)
                                )
                                    dji.logger.monitor({event: "login_m_1c"}),
                                        k.isLoggedIn() ||
                                            (dji.logger.monitor({
                                                event: "login_m_1d",
                                            }),
                                            a.authRequired(),
                                            dji.logger.monitor({
                                                event: "login_m_1e",
                                            }));
                                else {
                                    if ("SIGNOUT" == b)
                                        if (
                                            (dji.logger.monitor({
                                                event: "login_m_1f",
                                            }),
                                            (b = c.search.match(L)))
                                        ) {
                                            c = 500;
                                            try {
                                                dji.logger.monitor({
                                                    event: "login_m_1h",
                                                }),
                                                    (c = parseInt(b[1])),
                                                    dji.logger.monitor({
                                                        event: "login_m_1i",
                                                    });
                                            } catch (d) {
                                                dji.logger.monitor({
                                                    event: "login_m_1j",
                                                    error: d,
                                                }),
                                                    dji.logger.error(d);
                                            }
                                            500 != c &&
                                                (dji.logger.monitor({
                                                    event: "login_m_1k",
                                                }),
                                                a.signoutRequired());
                                            dji.logger.monitor({
                                                event: "login_m_1l",
                                            });
                                        } else
                                            dji.logger.monitor({
                                                event: "login_m_1g",
                                            });
                                }
                            else dji.logger.monitor({event: "login_m_1b"});
                    }
                },
                {urls: ["<all_urls>"]},
            );
    };
    k.userInfo = function (a) {
        h = a;
    };
    k.isLoggedIn = function () {
        return true; //  LOGIN KEY HACK - FOR TESTING PURPOSES ONLY
    };
    k.login = function (a) {
        dji.logger.monitor({event: "login_l_1a"});
        if (t)
            return (
                dji.logger.monitor({event: "login_l_1b"}),
                e &&
                    (dji.logger.monitor({event: "login_l_1c"}),
                    chrome.tabs.update(e.id, {active: !0, highlighted: !0})),
                dji.logger.monitor({event: "login_l_1d"}),
                !1
            );
        if (h)
            try {
                dji.logger.monitor({event: "login_l_1e"}),
                    a(h),
                    dji.logger.monitor({event: "login_l_1f"});
            } catch (b) {
                dji.logger.monitor({event: "login_l_1g", error: b}),
                    dji.logger.error(b);
            }
        else
            return (
                (t = !0),
                (w = a),
                (u = null),
                dji.logger.monitor({event: "login_l_1h"}),
                chrome.webRequest.onBeforeRequest.addListener(E, {urls: [R]}),
                N(),
                dji.logger.monitor({event: "login_l_1i"}),
                !0
            );
    };
    k.silentAuth = async function (a) {
        dji.logger.monitor({event: "login_sa_1a"});
        if (document.getElementById(x))
            return dji.logger.monitor({event: "login_sa_1b"}), a(null);
        dji.logger.monitor({event: "login_sa_1c"});
        let b = null;
        try {
            (b = await O(x, window.dji.config.silentAuthUrl(), 5, 1e4, 5e3)),
                dji.logger.monitor({event: "login_sa_1d"});
        } catch (c) {
            return (
                dji.logger.error(c),
                dji.logger.monitor({
                    event: "login_sa_1e",
                    error: c,
                }),
                a(null)
            );
        }
        dji.logger.monitor({
            event: "login_sa_2a",
            status: b ? b.error : null,
            code: b ? b.code : null,
        });
        if (500 == b.code)
            return dji.logger.monitor({event: "login_sa_2b"}), a(null);
        0 == b.code
            ? (dji.logger.monitor({event: "login_sa_2c"}),
              jsdapi.setAuth(b),
              jsdapi.account.me(function (c) {
                  dji.logger.monitor({
                      event: "login_sa_2d",
                      status: c ? c.error : null,
                  });
                  if (c)
                      if (c.error)
                          switch (c.error) {
                              case 401:
                                  b.code = 800002;
                          }
                      else (h = c), (b.user = c);
                  dji.logger.monitor({
                      event: "login_sa_2e",
                      status: b ? b.error : null,
                  });
                  a(b);
                  dji.logger.monitor({event: "login_sa_2f"});
              }))
            : (dji.logger.monitor({event: "login_sa_2g"}),
              a(b),
              dji.logger.monitor({event: "login_sa_2h"}));
    };
    k.silentSignout = function (a) {
        dji.logger.monitor({event: "login_ss_1a"});
        var b = document.getElementById(x);
        if (b) return dji.logger.monitor({event: "login_ss_1b"}), a(null);
        dji.logger.monitor({event: "login_ss_1c"});
        b = document.createElement("iframe");
        b.setAttribute("id", x);
        b.__calback = a;
        b.src = window.dji.config.silentSignoutUrl();
        chrome.webRequest.onBeforeRequest.addListener(I, {urls: [U]}, [
            "blocking",
        ]);
        chrome.webRequest.onHeadersReceived.addListener(
            J,
            {urls: [window.dji.config.silentAuthUrl()]},
            ["blocking"],
        );
        chrome.webRequest.onErrorOccurred.addListener(K, {
            urls: [window.dji.config.silentSignoutUrl()],
        });
        document.body.appendChild(b);
        dji.logger.monitor({event: "login_ss_1d"});
    };
    k.isPreparing = function () {
        return t && !e;
    };
    k.windowId = function () {
        return e ? e.id : null;
    };
    k.silentRefreshToken = function (a, b) {
        dji.logger.monitor({event: "login_srt_1a"});
        var c = document.getElementById(C);
        if (c) return dji.logger.monitor({event: "login_srt_1b"}), b(null);
        dji.logger.monitor({event: "login_srt_1c"});
        a =
            a.login_url +
            "/silent/token/refresh?client_id=" +
            encodeURIComponent(a.client_id) +
            "&refresh_token=" +
            encodeURIComponent(a.refresh_token) +
            "&redirect_uri=" +
            encodeURIComponent(S);
        c = document.createElement("iframe");
        c.setAttribute("id", C);
        c.__calback = b;
        c.src = a;
        chrome.webRequest.onBeforeRequest.addListener(F, {urls: [T]}, [
            "blocking",
        ]);
        chrome.webRequest.onHeadersReceived.addListener(G, {urls: [a]}, [
            "blocking",
        ]);
        chrome.webRequest.onErrorOccurred.addListener(H, {urls: [a]});
        document.body.appendChild(c);
        dji.logger.monitor({event: "login_srt_1d"});
    };
    var M = function () {
            dji.logger.monitor({event: "login_af_1a"});
            chrome.tabs.onRemoved.removeListener(D);
            chrome.webRequest.onBeforeRequest.removeListener(E);
            e && (chrome.tabs.remove(e.id), (e = null));
            var a = dji.utils.jsonFromUrlQueryAndHash(u);
            if ((a = a ? a.hash : null) && a.access_token && a.expires_at)
                dji.logger.monitor({event: "login_af_1f"}),
                    jsdapi.setAuth(a),
                    jsdapi.account.me(function (b) {
                        dji.logger.monitor({
                            event: "login_af_1g",
                            status: b ? b.error : null,
                        });
                        if (b && !b.error) {
                            h = b;
                            try {
                                dji.logger.monitor({event: "login_af_1h"}),
                                    w(h),
                                    dji.logger.monitor({event: "login_af_1i"});
                            } catch (c) {
                                dji.logger.monitor({
                                    event: "login_af_1j",
                                    error: c,
                                }),
                                    dji.logger.error(c);
                            }
                            w = u = null;
                            t = !1;
                        }
                    }),
                    dji.logger.monitor({event: "login_af_1k"});
            else {
                try {
                    dji.logger.monitor({event: "login_af_1b"}),
                        w(h),
                        dji.logger.monitor({event: "login_af_1c"});
                } catch (b) {
                    dji.logger.monitor({event: "login_af_1d"}),
                        dji.logger.error(b);
                }
                w = u = null;
                t = !1;
                dji.logger.monitor({event: "login_af_1e"});
            }
        },
        z = function (a) {
            chrome.webRequest.onBeforeRequest.removeListener(F);
            chrome.webRequest.onHeadersReceived.removeListener(G);
            chrome.webRequest.onErrorOccurred.removeListener(H);
            var b = document.getElementById(C);
            if (!b) return dji.log.error("Invalid state for silent refresh.");
            var c = b.__calback;
            document.body.removeChild(b);
            c(a);
        },
        A = function (a) {
            dji.logger.monitor({event: "login_ssf_1a"});
            chrome.webRequest.onBeforeRequest.removeListener(I);
            chrome.webRequest.onHeadersReceived.removeListener(J);
            chrome.webRequest.onErrorOccurred.removeListener(K);
            var b = document.getElementById(x);
            if (!b)
                return (
                    dji.logger.monitor({event: "login_ssf_1b"}),
                    dji.log.error("Invalid state for silent signout.")
                );
            var c = b.__calback;
            document.body.removeChild(b);
            if (!a || 500 == a.code)
                return dji.logger.monitor({event: "login_ssf_1c"}), c(!1);
            h = null;
            try {
                dji.logger.monitor({event: "login_ssf_1d"}),
                    c(!0),
                    dji.logger.monitor({event: "login_ssf_1e"});
            } catch (d) {
                dji.logger.monitor({event: "login_ssf_1f"}),
                    dji.logger.error(d);
            }
        };
})((window.dji.login = window.dji.login || {}));
