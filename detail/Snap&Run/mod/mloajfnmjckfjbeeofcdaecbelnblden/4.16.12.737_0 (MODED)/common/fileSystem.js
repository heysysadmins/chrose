window.dji = window.dji || {};
(function (q) {
    function t(f, l, n, r) {
        var h = null;
        f.getDirectory = function (c, a, b) {
            if (!h) return e(b, null);
            h.root.getDirectory(
                c,
                {create: a},
                function (d) {
                    e(b, d);
                },
                function (d) {
                    dji.logger.group("getDirectory failed for file: " + c);
                    dji.logger.error(d);
                    dji.logger.groupEnd();
                    e(b, null);
                },
            );
        };
        f.getFile = function (c, a, b) {
            if (!h) return e(b, null);
            h.root.getFile(
                c,
                {create: a},
                function (d) {
                    e(b, d);
                },
                function (d) {
                    dji.logger.group("getFile failed for file: " + c);
                    dji.logger.error(d);
                    dji.logger.groupEnd();
                    e(b, null);
                },
            );
        };
        f.directoryExistsAsync = function (c) {
            return new Promise((a) => this.directoryExists(c, a));
        };
        f.directoryExists = function (c, a) {
            h.root.getDirectory(
                c,
                {create: !1},
                function () {
                    a(!0);
                },
                function () {
                    a(!1);
                },
            );
        };
        f.createDirectory = function (c, a) {
            if (!h) return e(a, null);
            var b = w(c);
            if (!b || 0 >= b.length) e(a, null);
            else {
                var d = h.root,
                    g = -1,
                    k = function () {
                        g++;
                        g < b.length
                            ? d.getDirectory(
                                  b[g],
                                  {create: !0},
                                  function (p) {
                                      dji.logger.log(p);
                                      d = p;
                                      g + 1 < b.length ? k() : e(a, d);
                                  },
                                  function (p) {
                                      dji.logger.error(p);
                                      e(a, null);
                                  },
                              )
                            : e(a, d);
                    };
                k();
            }
        };
        f.createDirectoryAsync = async function (c, a) {
            a && (await f.removeDirectoryAsync(c));
            return new Promise((b) => {
                f.createDirectory(c, function (d) {
                    b(d);
                });
            });
        };
        f.writeFile = function (c, a, b) {
            if (!h) return e(b, !1, null);
            h.root.getFile(
                c,
                {create: !0},
                function (d) {
                    d.createWriter(
                        function (g) {
                            var k = function () {
                                    e(b, !0, d);
                                },
                                p = function (m) {
                                    dji.logger.error(m);
                                    e(b, !1, null);
                                };
                            g.onwriteend = function () {
                                g.onwriteend = k;
                                g.onerror = p;
                                var m =
                                    a instanceof Blob
                                        ? a
                                        : new Blob([a], {
                                              type: "application/octet-stream",
                                          });
                                g.write(m);
                            };
                            g.onerror = function (m) {
                                dji.logger.error(m);
                                e(b, !1, null);
                            };
                            g.truncate(0);
                        },
                        function (g) {
                            dji.logger.error(g);
                            e(b, !1, null);
                        },
                    );
                },
                function (d) {
                    dji.logger.error(d);
                    e(b, !1, null);
                },
            );
        };
        f.writeFileAsync = function (c, a) {
            return new Promise((b, d) => {
                f.writeFile(c, a, function (g, k) {
                    if (g) return b(k);
                    d(null);
                });
            });
        };
        f.writeFileAsText = function (c, a, b) {
            if (!h) return e(b, !1, null);
            h.root.getFile(
                c,
                {create: !0},
                function (d) {
                    d.createWriter(
                        function (g) {
                            var k = function () {
                                    e(b, !0, d);
                                },
                                p = function (m) {
                                    dji.logger.error(m);
                                    e(b, !1, null);
                                };
                            g.onwriteend = function () {
                                g.onwriteend = k;
                                g.onerror = p;
                                var m =
                                    a instanceof Blob
                                        ? a
                                        : new Blob([a], {
                                              type: "text/plain;charset=UTF-8",
                                          });
                                g.write(m);
                            };
                            g.onerror = function (m) {
                                dji.logger.error(m);
                                e(b, !1, null);
                            };
                            g.truncate(0);
                        },
                        function (g) {
                            dji.logger.error(g);
                            e(b, !1, null);
                        },
                    );
                },
                function (d) {
                    dji.logger.error(d);
                    e(b, !1, null);
                },
            );
        };
        f.writeFileAsTextAsync = function (c, a) {
            return new Promise((b) => f.writeFileAsText(c, a, b));
        };
        f.readFile = function (c, a) {
            if (!h) return e(a, null, null);
            h.root.getFile(
                c,
                {},
                function (b) {
                    b.file(
                        function (d) {
                            var g = new FileReader();
                            g.onloadend = function () {
                                e(a, this.result, b);
                            };
                            g.onerror = function (k) {
                                dji.logger.error(k);
                                e(a, null, null);
                            };
                            g.readAsText(d);
                        },
                        function (d) {
                            dji.logger.error(d);
                            e(a, null, null);
                        },
                    );
                },
                function (b) {
                    dji.logger.group("readFile failed for file: " + c);
                    dji.logger.error(b);
                    dji.logger.groupEnd();
                    e(a, null, null);
                },
            );
        };
        f.readFileAsBinaryString = function (c, a) {
            if (!h) return e(a, null, null);
            h.root.getFile(
                c,
                {},
                function (b) {
                    b.file(
                        function (d) {
                            var g = new FileReader();
                            g.onloadend = function () {
                                e(a, this.result, b);
                            };
                            g.onerror = function (k) {
                                dji.logger.error(k);
                                e(a, null, null);
                            };
                            g.readAsBinaryString(d);
                        },
                        function (d) {
                            dji.logger.error(d);
                            e(a, null, null);
                        },
                    );
                },
                function (b) {
                    dji.logger.group("readFile failed for file: " + c);
                    dji.logger.error(b);
                    dji.logger.groupEnd();
                    e(a, null, null);
                },
            );
        };
        f.readFileAsBinaryStringAsync = function (c) {
            return new Promise((a, b) => {
                f.readFileAsBinaryString(c, function (d, g) {
                    a(d);
                });
            });
        };
        f.readFileAsArrayBuffer = function (c, a) {
            if (!h) return e(a, null, null);
            h.root.getFile(
                c,
                {},
                function (b) {
                    b.file(
                        function (d) {
                            var g = new FileReader();
                            g.onloadend = function () {
                                e(a, this.result, b);
                            };
                            g.onerror = function (k) {
                                dji.logger.error(k);
                                e(a, null, null);
                            };
                            g.readAsArrayBuffer(d);
                        },
                        function (d) {
                            dji.logger.error(d);
                            e(a, null, null);
                        },
                    );
                },
                function (b) {
                    dji.logger.group("readFile failed for file: " + c);
                    dji.logger.error(b);
                    dji.logger.groupEnd();
                    e(a, null, null);
                },
            );
        };
        f.readFileAsArrayBufferAsync = function (c) {
            return new Promise((a) => f.readFileAsArrayBuffer(c, a));
        };
        f.readFileAsText = function (c, a) {
            h.root.getFile(
                c,
                {},
                function (b) {
                    b.file(
                        function (d) {
                            var g = new FileReader();
                            g.onloadend = function () {
                                e(a, this.result, b);
                            };
                            g.onerror = function (k) {
                                Logger.instance.error(k);
                                e(a, null, null);
                            };
                            g.readAsText(d);
                        },
                        function (d) {
                            window.dji.logger.error(d);
                            e(a, null, null);
                        },
                    );
                },
                function (b) {
                    "NotFoundError" !== b.name &&
                        (window.dji.logger.groupCollapsed(
                            "readFile failed for file: " + c,
                        ),
                        window.dji.logger.error(b),
                        window.dji.logger.groupEnd());
                    e(a, null, null);
                },
            );
        };
        f.readFileAsTextAsync = async function (c) {
            return new Promise((a) => {
                f.readFileAsText(c, (b) => {
                    a(b);
                });
            });
        };
        f.readFileAsJSONAsync = async function (c) {
            return new Promise((a, b) => {
                f.readFileAsText(c, (d) => {
                    if (null !== d)
                        try {
                            d = JSON.parse(d);
                        } catch (g) {
                            b(g);
                        }
                    a(d);
                });
            });
        };
        f.removeDirectory = function (c, a) {
            if (!h) return e(a, !1);
            h.root.getDirectory(
                c,
                {},
                function (b) {
                    b.removeRecursively(
                        function () {
                            e(a, !0);
                        },
                        function (d) {
                            dji.logger.error(d);
                            e(a, !1);
                        },
                    );
                },
                function (b) {
                    dji.logger.error(b);
                    e(a, "NotFoundError" === b.name);
                },
            );
        };
        f.removeDirectoryAsync = function (c) {
            return new Promise((a, b) => {
                f.removeDirectory(c, function (d) {
                    a(d);
                });
            });
        };
        f.removeFile = function (c, a) {
            if (!h) return e(a, !1);
            h.root.getFile(
                c,
                {},
                function (b) {
                    b.remove(
                        function () {
                            e(a, !0);
                        },
                        function (d) {
                            dji.logger.error(d);
                            e(a, !1);
                        },
                    );
                },
                function (b) {
                    dji.logger.error(b);
                    e(a, "NotFoundError" === b.name);
                },
            );
        };
        f.removeFiles = function (c, a) {
            if (!h || !c || 0 >= c.length) e(a);
            else {
                var b = -1,
                    d = function () {
                        b++;
                        b < c.length
                            ? f.removeFile(c[b], function () {
                                  setTimeout(d, 0);
                              })
                            : e(a);
                    };
                d();
            }
        };
        f.removeFileAsync = function (c) {
            return new Promise((a) => f.removeFile(c, a));
        };
        window.webkitRequestFileSystem(
            l,
            n,
            function (c) {
                dji.logger.log("fileSystem: ", c);
                h = c;
                setTimeout(function () {
                    r(!0);
                }, 0);
            },
            function (c) {
                dji.logger.error(c);
                r(!1);
            },
        );
    }
    function w(f) {
        if (!f || 0 >= f.length) return null;
        f = f.split("/");
        for (var l = [], n = 0; n < f.length; n++)
            0 < f[n].length && l.push(f[n]);
        return l;
    }
    function e(f) {
        if (f)
            try {
                f.apply(this, [].slice.call(arguments).splice(1));
            } catch (l) {
                dji.logger.error(l);
            }
    }
    var u = {},
        v = {};
    q.persistent = null;
    q.temporary = null;
    q.initialize = function (f) {
        if (q.persistent) return e(f, !0);
        try {
            dji.logger.group("Initialize HTML5 file system"),
                dji.logger.log("requesting quota: ", 104857600),
                navigator.webkitPersistentStorage.requestQuota(
                    104857600,
                    function (l) {
                        dji.logger.log("quota granted: ", l);
                        t(u, window.PERSISTENT, l, function (n) {
                            if (!n) return dji.logger.groupEnd(), e(f, !1);
                            q.persistent = u;
                            t(v, window.TEMPORARY, l, function (r) {
                                q.temporary = v;
                                dji.logger.groupEnd();
                                setTimeout(function () {
                                    e(f, r);
                                }, 0);
                            });
                        });
                    },
                    function (l) {
                        dji.logger.error(l);
                        dji.logger.groupEnd();
                        e(f, !1);
                    },
                );
        } catch (l) {
            dji.logger.error(l), dji.logger.groupEnd(), e(f, !1);
        }
    };
})((window.dji.fileSystem = window.dji.fileSystem || {}));
