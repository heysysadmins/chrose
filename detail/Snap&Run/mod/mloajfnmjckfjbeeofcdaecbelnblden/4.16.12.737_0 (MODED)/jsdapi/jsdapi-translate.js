window.jsdapi = window.jsdapi || {};
(function (f) {
    var b = "https://translate.donjohnston.net",
        h = b + "/api",
        k = b + "/languages";
    f.setServerUrl = function (a) {
        b = a;
        h = b + "/api";
        k = b + "/languages";
    };
    f.translateText = function (a, c, d) {
        jsdapi.authorize(function (g) {
            g
                ? ((g = JSON.stringify({q: a, source: "en", target: c})),
                  jsdapi.http.sendRequest(
                      {
                          timeout: 3e5,
                          responseType: "json",
                          method: "POST",
                          url: h,
                          contentType: "application/json",
                          content: g,
                      },
                      function (l) {
                          e(d, l);
                      },
                  ))
                : e(d, {error: 401, message: "Authorization failed!"});
        });
    };
    f.languages = function (a) {
        jsdapi.authorize(function (c) {
            c
                ? jsdapi.http.sendRequest(
                      {
                          timeout: 3e5,
                          method: "POST",
                          url: k,
                          contentType: "application/json",
                      },
                      function (d) {
                          e(a, d);
                      },
                  )
                : e(a, {error: 401, message: "Authorization failed!"});
        });
    };
    var e = function (a) {
        if (a)
            try {
                a.apply(this, [].slice.call(arguments).splice(1));
            } catch (c) {
                dji.logger.error(c);
            }
    };
})((window.jsdapi.translate = window.jsdapi.translate || {}));
