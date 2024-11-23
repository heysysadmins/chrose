window.jsdapi = window.jsdapi || {};
(function (g) {
    function r(b) {
        var c = jsdapi.url();
        b && (c += "/" + b);
        return c;
    }
    function k(b) {
        var c = jsdapi.url() + "/account";
        b && (c += "/" + b);
        return c;
    }
    function h(b, c) {
        if (b.url) {
            var a = new XMLHttpRequest(),
                d = b.url + t(b.query);
            a.open(b.method, d, !0);
            if (
                "arraybuffer" === b.responseType ||
                "binaryToBase64" === b.responseType
            )
                a.responseType = "arraybuffer";
            else if ("blob" === b.responseType || "binary" === b.responseType)
                a.responseType = "blob";
            b.accessToken &&
                a.setRequestHeader("Authorization", "Bearer " + b.accessToken);
            b.contentType && a.setRequestHeader("Content-Type", b.contentType);
            a.onreadystatechange = function () {
                if (4 === a.readyState) {
                    var f = null;
                    200 === a.status &&
                        (f =
                            "json" === b.responseType
                                ? JSON.parse(a.responseText)
                                : "blob" === b.responseType ||
                                    "arraybuffer" === b.responseType ||
                                    "binary" === b.responseType
                                  ? a.response
                                  : a.responseText);
                    setTimeout(function () {
                        e(c, f);
                    }, 0);
                }
            };
            b.content ? a.send(b.content) : a.send();
        } else e(c, null);
    }
    function t(b) {
        var c = "";
        if (void 0 !== b && null !== b)
            for (var a in b)
                b.hasOwnProperty(a) &&
                    ((c = "" === c ? "?" : c + "&"),
                    (c =
                        c +
                        encodeURIComponent(a) +
                        "=" +
                        encodeURIComponent(b[a])));
        return c;
    }
    function e(b) {
        if (b)
            try {
                b.apply(this, [].slice.call(arguments).splice(1));
            } catch (c) {
                dji.logger.error(c);
            }
    }
    g.me = function (b) {
        jsdapi.authorize(function (c) {
            c
                ? ((c = {
                      responseType: "json",
                      method: "GET",
                      url: r("openid/me"),
                      query: {
                          access_token: c,
                          ignoreGrantsGiven: !0,
                          ignoreGrantsGivenBy: !0,
                          ignoreProducts: !0,
                          ignoreTags: !0,
                          analytics: !0,
                      },
                  }),
                  h(c, function (a) {
                      if (!a || a.error) return e(b, a || {error: 500});
                      var d = {checksum: a.me.checksum, name: a.me.name};
                      a.me.email && (d.email = a.me.email);
                      a.me.anonymous && (d.anonymous = a.me.anonymous);
                      if (a.me.accounts)
                          try {
                              var f = JSON.parse(a.me.accounts);
                              0 < f.length &&
                                  ((d.account = f[0]),
                                  d.account.username &&
                                      (d.username = d.account.username),
                                  d.account.provider &&
                                      (d.provider = d.account.provider));
                          } catch (l) {
                              dji.logger.error(l);
                          }
                      a.me["@dem"] && (d["@dem"] = a.me["@dem"]);
                      if (!d.account) return e(b, {error: 500});
                      a.me.analytics instanceof Object &&
                          (d.analytics = a.me.analytics);
                      delete d.account;
                      a: {
                          if ((a = a.me) && a instanceof Object)
                              try {
                                  const l = JSON.parse(a.products);
                                  for (let p of l)
                                      if ("WBU" === p.tag.toUpperCase()) {
                                          const u = p.dapiProductId,
                                              v = JSON.parse(a.grants);
                                          for (let m of v)
                                              if (
                                                  m.dapiProductId === u &&
                                                  !m.isRevoked &&
                                                  (!m.expirationDateTimestamp ||
                                                      Date.now() <=
                                                          m.expirationDateTimestamp)
                                              ) {
                                                  const w = m.dapiLicenseId,
                                                      x = JSON.parse(
                                                          a.licenses,
                                                      );
                                                  for (let n of x)
                                                      if (
                                                          w ===
                                                              n.dapiLicenseId &&
                                                          !n.isTerminated &&
                                                          !n.isRevoked &&
                                                          (!n.expirationDateTimestamp ||
                                                              Date.now() <=
                                                                  n.expirationDateTimestamp)
                                                      ) {
                                                          var q = !0;
                                                          break a;
                                                      }
                                              }
                                      }
                              } catch (l) {
                                  dji.logger.error(l);
                              }
                          q = !1;
                      }
                      d.enableWB = q;
                      e(b, d);
                  }))
                : e(b, {error: 401, message: "Authorization failed!"});
        });
    };
    g.updatePassword = function (b, c) {
        jsdapi.authorize(function (a) {
            if (a) {
                var d = JSON.stringify(b);
                a = {
                    responseType: "json",
                    method: "POST",
                    url: k("password/update"),
                    query: {access_token: a},
                    contentType: "application/json",
                    content: d,
                };
                h(a, function (f) {
                    e(c, f);
                });
            } else e(c, {error: 401, message: "Authorization failed!"});
        });
    };
    g.updateAccount = function (b, c) {
        jsdapi.authorize(function (a) {
            if (a) {
                var d = JSON.stringify(b);
                a = {
                    responseType: "json",
                    method: "POST",
                    url: k("update"),
                    query: {access_token: a},
                    contentType: "application/json",
                    content: d,
                };
                h(a, function (f) {
                    e(c, f);
                });
            } else e(c, {error: 401, message: "Authorization failed!"});
        });
    };
    g.changePassword = function (b, c) {
        jsdapi.authorize(function (a) {
            if (a) {
                var d = JSON.stringify(b);
                a = {
                    responseType: "json",
                    method: "POST",
                    url: k("password/change"),
                    query: {access_token: a},
                    contentType: "application/json",
                    content: d,
                };
                h(a, function (f) {
                    e(c, f);
                });
            } else e(c, {error: 401, message: "Authorization failed!"});
        });
    };
    g.applyActivationCode = function (b, c) {
        jsdapi.authorize(function (a) {
            if (a) {
                var d = JSON.stringify(b);
                a = {
                    responseType: "json",
                    method: "POST",
                    url: k("applyActivationCode"),
                    query: {access_token: a},
                    contentType: "application/json",
                    content: d,
                };
                h(a, function (f) {
                    e(c, f);
                });
            } else e(c, {error: 401, message: "Authorization failed!"});
        });
    };
    g.getSettings = function (b) {
        jsdapi.authorize(function (c) {
            c
                ? ((c = {
                      responseType: "json",
                      method: "GET",
                      url: k("settings"),
                      query: {access_token: c},
                  }),
                  h(c, function (a) {
                      e(b, a);
                  }))
                : e(b, {error: 401, message: "Authorization failed!"});
        });
    };
    g.updateSettings = function (b, c) {
        jsdapi.authorize(function (a) {
            if (a) {
                var d = JSON.stringify(b);
                a = {
                    responseType: "json",
                    method: "POST",
                    url: k("settings/update"),
                    query: {access_token: a},
                    contentType: "application/json",
                    content: d,
                };
                h(a, function (f) {
                    e(c, f);
                });
            } else e(c, {error: 401, message: "Authorization failed!"});
        });
    };
})((window.jsdapi.account = window.jsdapi.account || {}));
