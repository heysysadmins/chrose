window.sru = window.sru || {};
(function (d) {
    function m(a) {
        switch (a) {
            case sru.measurements.Scope.Page:
                return "page";
            case sru.measurements.Scope.TTS:
                return "tts";
            case sru.measurements.Scope.CWB:
                return "create WordBank";
            case sru.measurements.Scope.OAT:
                return "add text to outline";
        }
        return null;
    }
    function n(a) {
        switch (a.toUpperCase()) {
            case "PAGE":
                return sru.measurements.Scope.Page;
            case "TTS":
                return sru.measurements.Scope.TTS;
            case "CREATE WORDBANK":
                return sru.measurements.Scope.CWB;
            case "ADD TEXT TO OUTLINE":
                return sru.measurements.Scope.OAT;
        }
        return null;
    }
    function p(a) {
        if (
            (a = a.data) &&
            "com.donjohnston.sru.measureText" === a.message &&
            a.params.session === g
        ) {
            var b = n(a.params.scope);
            (b !== h.TTS && b !== h.Page) ||
                sru.userData.measurements.update(
                    a.params.scope,
                    a.params.uuid,
                    a.params.measurements,
                );
            if ((b = e[a.params.uuid]))
                delete e[a.params.uuid],
                    b({measurements: a.params.measurements});
        }
    }
    const h = {Page: 0, TTS: 1, CWB: 2, OAT: 3};
    var c = null,
        g = dji.utils.generateUUID(),
        e = {};
    d.Scope = h;
    d.reset = function () {
        g = dji.utils.generateUUID();
        e = {};
        c && (c.terminate(), (c = null));
        c = new Worker("measurementsWorker.js");
        c.addEventListener("message", p);
    };
    d.update = function (a, b, k) {
        var l = m(a.scope);
        if (c && l && !sru.userData.privacyMode()) {
            var f = {};
            a.isNew && (f.dateViewed = Date.now());
            a.uuid = a.uuid || dji.utils.generateUUID();
            f.timeSpent = a.timeSpent || 0;
            a.scope === sru.measurements.Scope.TTS && (f.pageUuid = a.pageUuid);
            k && (e[a.uuid] = k);
            c.postMessage({
                message: "com.donjohnston.sru.measureText",
                params: {
                    session: g,
                    scope: l,
                    uuid: a.uuid,
                    text: a.text,
                    measurements: f,
                    allowEmptyText: a.isNew,
                },
            });
            b && b(a.uuid);
        } else b && b(null);
    };
    d.reset();
})((window.sru.measurements = window.sru.measurements || {}));
