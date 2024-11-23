(function (q) {
    function F(a, d, b) {
        if ((d || b === f.Download) && J(null, x.UserSettings, null)) {
            a = a || {};
            var c = new jsdapi.sru.types.File(
                a ? a.uuid : null,
                y.settingsUser,
            );
            if (b == f.Update || b == f.Create)
                (c.checksum = a.checksum),
                    (c.creationDate = a.creationDate),
                    (c.modifiedDate = a.modifiedDate),
                    (c.modifiedUuid = a.modifiedUuid),
                    (c.version = a.version || 0),
                    dji.utils.callListeners(k, "syncProgress", !0);
            g.push({
                file: c,
                type: x.UserSettings,
                action: b,
                body: d,
                extra: a,
                session: null,
            });
            1 == g.length && n == l.Idle && r();
        }
    }
    function K(a, d) {
        var b = null;
        d == f.Update && (a.update || a["delete"])
            ? ((b = {}),
              a.update && (b.update = a.update),
              a["delete"] && (b["delete"] = a["delete"]),
              dji.utils.callListeners(k, "syncProgress", !0))
            : d == f.Download && a.download && (b = {download: a.download});
        if (b || J(null, x.Outlines, null))
            g.push({
                file: null,
                type: x.Outlines,
                action: d,
                body: b,
                extra: null,
                session: null,
            }),
                1 == g.length && n == l.Idle && r();
    }
    function L(a, d) {
        if (a || d === f.Download) {
            var b = a || {},
                c = new jsdapi.sru.types.File(b ? b.uuid : null, y.image);
            d == f.Create &&
                ((c.checksum = b.checksum),
                (c.creationDate = b.creationDate),
                (c.modifiedDate = b.modifiedDate),
                (c.modifiedUuid = b.modifiedUuid),
                (c.version = b.version || 0),
                dji.utils.callListeners(k, "syncProgress", !0));
            g.push({
                file: c,
                type: x.Image,
                action: d,
                body: a.body,
                extra: b,
                session: null,
            });
            1 == g.length && n == l.Idle && r();
        }
    }
    function J(a, d, b) {
        a: {
            for (var c = 0; c < g.length; c++) {
                var u = g[c];
                if (
                    !(
                        (a && u.id !== a) ||
                        u.type !== d ||
                        (b && u.action !== b)
                    )
                ) {
                    a = c;
                    break a;
                }
            }
            a = -1;
        }
        if (-1 !== a) {
            if (g[a].session) return !1;
            g.splice(a, 1);
        }
        return !0;
    }
    function r(a) {
        t &&
            (G(),
            0 ===
                g.filter((d) => d.action != f.None && d.action !== f.Download)
                    .length && dji.utils.callListeners(k, "syncProgress", !1),
            (e.timer = setTimeout(
                N,
                a || 0 < g.length ? e.timeout.near : e.timeout.far,
            )));
    }
    function G() {
        e.timer && (clearTimeout(e.timer), (e.timer = null));
    }
    function N() {
        if (t && D) return r(!1);
        n = l.Busy;
        G();
        if (t) {
            var a = 0 < g.length ? g[0] : null;
            null === a
                ? O()
                : a.type === x.UserSettings
                  ? P(a)
                  : a.type === x.Outlines
                    ? Q(a)
                    : a.type === x.Image
                      ? R(a)
                      : (g.splice(g.indexOf(a), 1), (n = l.Idle), r());
        } else n = l.Idle;
    }
    function O() {
        var a = m,
            d = [
                {type: y.settingsUser},
                {type: y.privacyMode},
                {type: y.outlinesData},
            ],
            b = !1,
            c = !0;
        let u = !1;
        var A = {settingsUpdates: !1},
            B = function () {
                e.checkFiles.max <= e.checkFiles.counter
                    ? ((e.checkFiles.max = Math.min(5, e.checkFiles.max + 1)),
                      (e.checkFiles.counter = 0))
                    : e.checkFiles.counter++;
                e.checkFiles.updateMeasurementsMax <=
                e.checkFiles.updateMeasurementsCounter
                    ? ((e.checkFiles.updateMeasurementsMax = 3),
                      (e.checkFiles.updateMeasurementsCounter = 0))
                    : e.checkFiles.updateMeasurementsCounter++;
                c ||
                    (b && (e.checkFiles.counter = e.checkFiles.max = 0),
                    u &&
                        (e.checkFiles.updateMeasurementsCounter =
                            e.checkFiles.updateMeasurementsMax =
                                0));
                n = l.Idle;
                r();
                dji.utils.callListeners(k, "checkForUpdatesFinished", A);
            },
            C = function () {
                e.checkFiles.updateMeasurementsCounter >=
                e.checkFiles.updateMeasurementsMax
                    ? S(function (h) {
                          h
                              ? ((u = !0),
                                jsdapi.sru.updateMeasurements(h, function (v) {
                                    dji.utils.callListeners(
                                        k,
                                        "measurementsSyncFinished",
                                        v && !v.error,
                                        B,
                                    );
                                }))
                              : B();
                      })
                    : B();
            };
        e.checkFiles.max <= e.checkFiles.counter
            ? ((b = !0),
              jsdapi.sru.checkForUpdates(d, function (h) {
                  if (a === m) {
                      if (h && !h.error && h.files) {
                          var v = h.files[y.privacyMode];
                          v = v && 1 === v.length ? v[0] : null;
                          a: {
                              if (p.privacyModeAvailable)
                                  try {
                                      var z = p.privacyModeAvailable(
                                          v ? "on" === v.comment : !1,
                                      );
                                      break a;
                                  } catch (H) {}
                              z = !1;
                          }
                          z && (c = !1);
                          z =
                              (z = h.files[y.settingsUser]) && 1 === z.length
                                  ? z[0]
                                  : null;
                          a: {
                              if (p.checkSettingsUpdate)
                                  try {
                                      var I = p.checkSettingsUpdate(z);
                                      break a;
                                  } catch (H) {}
                              I = f.None;
                          }
                          if (I == f.Upload) {
                              a: {
                                  if (p.needSettingsData)
                                      try {
                                          var E = p.needSettingsData();
                                          break a;
                                      } catch (H) {}
                                  E = null;
                              }
                              E && ((c = !1), F(E.fileInfo, E.data, f.Create));
                          } else
                              I == f.Download &&
                                  ((c = !1),
                                  (A.settingsUpdates = !0),
                                  F(z, null, f.Download));
                          if ((h = h.files[y.outlinesData])) {
                              a: {
                                  if (p.checkOutlinesUpdate)
                                      try {
                                          var w = p.checkOutlinesUpdate(h);
                                          break a;
                                      } catch (H) {}
                                  w = null;
                              }
                              if (
                                  w &&
                                  ((c = !1),
                                  (h = w.download ? w.download.images : null) &&
                                      delete w.download.images,
                                  q.enqueueOutlinesData(w),
                                  (w = h))
                              )
                                  for (h = 0; h < w.length; h++)
                                      L(w[h], f.Download);
                          }
                      }
                      C();
                  }
              }))
            : C();
    }
    function P(a) {
        a.session = m;
        var d = function () {
                if (a.session === m) {
                    var c = g.indexOf(a);
                    -1 != c && g.splice(c, 1);
                    n = l.Idle;
                    r();
                }
            },
            b = function (c) {
                c &&
                    !c.error &&
                    dji.utils.callListeners(
                        k,
                        "settingsUpdateAvailable",
                        c.file.toJSON(),
                    );
                d();
            };
        a.action == f.Create || a.action == f.Update
            ? jsdapi.sru.listFiles(a.file.type, null, function (c) {
                  if (a.session === m) {
                      if (!c || c.error) return d();
                      (c = c.files && 0 < c.files.length ? c.files[0] : null) &&
                          a.action == f.Create &&
                          (a.action = f.Update);
                      a.action == f.Update
                          ? a.file.version == c.version
                              ? ((c.modifiedDate = Date.now()),
                                jsdapi.sru.updateFile(c, a.body, b))
                              : d()
                          : jsdapi.sru.createFile(a.file, a.body, b);
                  }
              })
            : a.action == f.Download &&
              jsdapi.sru.downloadFile(a.file, "json", function (c) {
                  c &&
                      dji.utils.callListeners(
                          k,
                          "settingsUpdateAvailable",
                          a.extra.toJSON(),
                          c,
                      );
                  d();
              });
    }
    function Q(a) {
        a.session = m;
        var d = function (b) {
            b &&
                !b.error &&
                dji.utils.callListeners(k, "outlinesUpdateAvailable", b);
            a.session === m &&
                ((b = g.indexOf(a)),
                -1 != b && g.splice(b, 1),
                (n = l.Idle),
                r());
        };
        a.action == f.Update
            ? jsdapi.sru.comboUpdateOutlinesData(a.body, function (b) {
                  a.session === m && d(b);
              })
            : a.action == f.Download &&
              jsdapi.sru.downloadOutlinesData(a.body, function (b) {
                  a.session === m && d(b);
              });
    }
    function R(a) {
        a.session = m;
        var d = function () {
            if (a.session === m) {
                var b = g.indexOf(a);
                -1 != b && g.splice(b, 1);
                n = l.Idle;
                r();
            }
        };
        a.action == f.Create
            ? jsdapi.sru.createFile(a.file, a.body, function (b) {
                  a.session === m &&
                      (b &&
                          !b.error &&
                          dji.utils.callListeners(
                              k,
                              "outlinesUpdateAvailable",
                              b,
                          ),
                      d());
              })
            : a.action == f.Download &&
              jsdapi.sru.downloadFile(a.file, "arraybuffer", function (b) {
                  if (b && !b.error) {
                      let c = a.extra.data;
                      c.body = b;
                      dji.utils.callListeners(k, "outlinesUpdateAvailable", {
                          download: {images: [c]},
                      });
                  }
                  d();
              });
    }
    function M() {
        return (m = dji.utils.generateUUID());
    }
    function S(a) {
        if (p.needMeasurementsData)
            try {
                return p.needMeasurementsData(a);
            } catch (d) {}
        a(null);
    }
    var x = {None: 0, UserSettings: 1, Outlines: 2, Image: 3},
        f = {None: 0, Create: 1, Update: 2, Upload: 3, Download: 4},
        y = {
            settingsUser: "settings/user",
            privacyMode: "settings/privacy/mode",
            outlinesData: "outlines/*",
            image: "image",
        },
        l = {Idle: 0, Busy: 1},
        m = null,
        g = [],
        e = {
            timer: null,
            timeout: {near: 10, far: 6e4},
            checkFiles: {
                max: 0,
                counter: 0,
                updateMeasurementsMax: 0,
                updateMeasurementsCounter: 0,
            },
        },
        n = l.Idle,
        t = !1,
        D = !1,
        k = {
            checkForUpdatesFinished: [],
            settingsUpdateAvailable: [],
            measurementsSyncFinished: [],
            outlinesUpdateAvailable: [],
            syncProgress: [],
        },
        p = {
            checkSettingsUpdate: null,
            needSettingsData: null,
            needMeasurementsData: null,
            checkOutlinesUpdate: null,
            privacyModeAvailable: null,
        };
    q.ActionType = f;
    q.setDelegate = function (a, d) {
        !p.hasOwnProperty(a) ||
            (null !== d && "function" != typeof d) ||
            (p[a] = d);
    };
    q.addEventListener = function (a, d) {
        k.hasOwnProperty(a) &&
            "function" == typeof d &&
            -1 == k[a].indexOf(d) &&
            k[a].push(d);
    };
    q.start = function () {
        t ||
            (M(),
            (t = !0),
            (D = !1),
            (n = l.Idle),
            (e.checkFiles.counter = 0),
            (e.checkFiles.max = 0),
            (e.checkFiles.updateMeasurementsCounter = 0),
            (e.checkFiles.updateMeasurementsMax = 0),
            r(!0));
    };
    q.stop = function () {
        t &&
            (G(),
            (t = D = !1),
            (n = l.Idle),
            (e.checkFiles.counter = 0),
            (e.checkFiles.max = 0),
            (e.checkFiles.updateMeasurementsCounter = 0),
            (e.checkFiles.updateMeasurementsMax = 0),
            M(),
            (g = []),
            dji.utils.callListeners(k, "syncProgress", !1));
    };
    q.pause = function (a) {
        D = a;
    };
    q.enqueueUserSettings = function (a, d) {
        t && F(a, d, a && a.uuid ? f.Update : f.Create);
    };
    q.enqueueOutlinesData = function (a) {
        if (
            t &&
            a &&
            ((a.update || a["delete"]) && K(a, f.Update), a.download)
        ) {
            if ((a = a.download)) {
                for (
                    var d = [],
                        b,
                        c,
                        u = [
                            "directories",
                            "outlines",
                            "sources",
                            "topics",
                            "images",
                        ],
                        A,
                        B = 0;
                    B < u.length;
                    B++
                )
                    if (((A = u[B]), a.hasOwnProperty(A))) {
                        if ((b = a[A])) {
                            for (c = []; 0 < b.length; )
                                c.push(b.splice(0, 50));
                            b = c;
                        } else b = null;
                        if (b && !(0 >= b.length))
                            for (var C = 0; C < b.length; C++)
                                (c = {download: {}}),
                                    (c.download[A] = b[C]),
                                    d.push(c);
                    }
                a = d;
            } else a = null;
            if (a) for (d = 0; d < a.length; d++) K(a[d], f.Download);
        }
    };
    q.enqueueImage = function (a, d) {
        t && ((d = d || f.Create), L(a, d));
    };
})((window.sru.sync = window.sru.sync || {}));
