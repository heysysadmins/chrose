window.jsdapi = window.jsdapi || {};
(function (c) {
    var g = "https://login.donjohnston.net",
        h = "https://dapi.donjohnston.net",
        a = {client_id: null, access_token: null, expires_at: null},
        f = null;
    c.setRefreshTokenDelegate = function (b) {
        "function" === typeof b && (f = b);
    };
    c.setServerUrl = function (b) {
        c.clearAuth();
        g = b.login;
        h = b.dapi;
    };
    c.setClientId = function (b) {
        c.clearAuth();
        a.client_id = b;
    };
    c.url = function () {
        return h;
    };
    c.setAuth = function (b) {
        b = b || {};
        a.access_token = b.access_token || null;
        a.expires_at = b.expires_at || null;
    };
    c.clearAuth = function () {
        a.access_token = null;
        a.expires_at = null;
    };
    c.authorize = function (b) {
        if (!a.access_token || !a.expires_at) return b(null);
        if (a.access_token && Date.now() <= a.expires_at - 6e5)
            return b(a.access_token);
        c.refreshToken(function (d) {
            d ? b(a.access_token) : b(null);
        });
    };
    c.authorizeAsync = async function () {
        try {
            return a.access_token && a.expires_at
                ? a.access_token && Date.now() <= a.expires_at - 6e5
                    ? a.access_token
                    : await c.refreshTokenAsync()
                : null;
        } catch (b) {
            return null;
        }
    };
    c.refreshToken = function (b) {
        f
            ? f(
                  {
                      login_url: g,
                      client_id: a.client_id,
                      refresh_token: a.access_token,
                  },
                  function (d) {
                      if (
                          !(
                              d &&
                              d.hasOwnProperty("code") &&
                              0 === d.code &&
                              d.hasOwnProperty("access_token") &&
                              d.hasOwnProperty("expires_at")
                          )
                      )
                          return b(null);
                      a.access_token = d.access_token;
                      a.expires_at = d.expires_at;
                      b(a);
                  },
              )
            : b(null);
    };
    c.refreshTokenAsync = async function () {
        return new Promise(function (b, d) {
            f
                ? f(
                      {
                          login_url: g,
                          client_id: a.client_id,
                          refresh_token: a.access_token,
                      },
                      function (e) {
                          if (
                              !(
                                  e &&
                                  e.hasOwnProperty("code") &&
                                  0 === e.code &&
                                  e.hasOwnProperty("access_token") &&
                                  e.hasOwnProperty("expires_at")
                              )
                          )
                              return d(null);
                          a.access_token = e.access_token;
                          a.expires_at = e.expires_at;
                          b(a);
                      },
                  )
                : d(null);
        });
    };
    c.getAuthToken = function () {
        return a.access_token;
    };
})(window.jsdapi);
