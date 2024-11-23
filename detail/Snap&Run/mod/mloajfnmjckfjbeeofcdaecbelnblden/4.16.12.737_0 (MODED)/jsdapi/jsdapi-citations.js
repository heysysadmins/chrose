window.jsdapi = window.jsdapi || {};
(function (d) {
    var c = "https://citations.donjohnston.net",
        e = c + "/api";
    d.setServerUrl = function (a) {
        c = a;
        e = c + "/api";
    };
    d.search = function (a, b) {
        jsdapi.authorize(function (g) {
            g
                ? jsdapi.http.sendRequest(
                      {
                          timeout: 3e5,
                          responseType: "json",
                          method: "GET",
                          url: e,
                          query: {q: a.query, mt: a.materialType},
                      },
                      function (h) {
                          f(b, h);
                      },
                  )
                : f(b, {error: 401, message: "Authorization failed!"});
        });
    };
    var f = function (a) {
        if (a)
            try {
                a.apply(this, [].slice.call(arguments).splice(1));
            } catch (b) {
                dji.logger.error(b);
            }
    };
})((window.jsdapi.citations = window.jsdapi.citations || {}));
