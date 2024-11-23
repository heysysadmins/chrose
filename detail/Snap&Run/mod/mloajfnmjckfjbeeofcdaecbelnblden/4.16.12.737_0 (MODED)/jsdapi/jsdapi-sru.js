window.jsdapi = window.jsdapi || {};
(function (h) {
    function g(c) {
        var b = jsdapi.url() + "/sru";
        c && (b += "/" + c);
        return b;
    }
    function k(c) {
        var b = g("files");
        c && (b += "/" + c);
        return b;
    }
    function n(c) {
        var b = g("outlines");
        c && (b += "/" + c);
        return b;
    }
    function p(c) {
        var b = g("measurements");
        c && (b += "/" + c);
        return b;
    }
    function l(c) {
        if (c)
            try {
                c.apply(this, [].slice.call(arguments).splice(1));
            } catch (b) {
                dji.logger.error(b);
            }
    }
    h.privacyModeAsync = function () {
        return new Promise((c) => {
            jsdapi.authorize(function (b) {
                if (!b)
                    return c({error: 401, message: "Authorization failed!"});
                b = {
                    responseType: "json",
                    method: "GET",
                    url: g("privacyMode"),
                    query: {access_token: b},
                };
                jsdapi.http.sendRequest(b, c);
            });
        });
    };
    h.checkSyncOptionsAsync = async function () {
        return new Promise((c) => {
            jsdapi.authorize(function (b) {
                if (!b)
                    return c({error: 401, message: "Authorization failed!"});
                b = {
                    ignoreStatusCode: !0,
                    responseType: "json",
                    method: "GET",
                    url: g("sync/options"),
                    query: {access_token: b},
                };
                jsdapi.http.sendRequest(b, c);
            });
        });
    };
    h.checkForUpdates = function (c, b) {
        jsdapi.authorize(function (e) {
            if (!e) return l(b, {error: 401, message: "Authorization failed!"});
            e = {
                responseType: "json",
                method: "POST",
                url: k("check/updates"),
                query: {dapiAuthToken: e},
                contentType: "application/json",
                content: JSON.stringify({basic: !0, types: c}),
            };
            jsdapi.http.sendRequest(e, function (d) {
                if (d && !d.error && d.files)
                    for (var a in d.files)
                        if (d.files.hasOwnProperty(a)) {
                            var f = d.files[a],
                                m;
                            if ("outlines/*" !== a)
                                for (m = 0; m < f.length; m++)
                                    f[m] = jsdapi.sru.types.File.fromJSON(f[m]);
                        }
                l(b, d);
            });
        });
    };
    h.listFiles = function (c, b, e) {
        jsdapi.authorize(function (d) {
            if (!d) return l(e, {error: 401, message: "Authorization failed!"});
            d = {
                responseType: "json",
                method: "POST",
                url: k("list"),
                query: {dapiAuthToken: d},
                contentType: "application/json",
                content: JSON.stringify({type: c, language: b}),
            };
            jsdapi.http.sendRequest(d, function (a) {
                if (a && !a.error && a.files)
                    for (var f = 0; f < a.files.length; f++)
                        a.files[f] = jsdapi.sru.types.File.fromJSON(a.files[f]);
                l(e, a);
            });
        });
    };
    h.createFile = function (c, b, e) {
        jsdapi.authorize(function (d) {
            if (!d) return l(e, {error: 401, message: "Authorization failed!"});
            var a = new jsdapi.utf8.Utf8Data();
            a.appendString("--004460bc4277474996e8e922d1b4b4ecbf5a4c7c\r\n");
            a.appendString("Content-ID: info\r\n");
            a.appendString('Content-Disposition: inline; name="info";\r\n');
            a.appendString("Content-Type: application/octet-stream\r\n");
            a.appendString("Content-Transfer-Encoding: binary\r\n\r\n");
            a.appendString(c.toJSONString());
            a.appendString("\r\n");
            a.appendString("--004460bc4277474996e8e922d1b4b4ecbf5a4c7c\r\n");
            a.appendString("Content-ID: body\r\n");
            a.appendString('Content-Disposition: inline; name="body";\r\n');
            a.appendString("Content-Type: application/octet-stream\r\n");
            a.appendString("Content-Transfer-Encoding: binary\r\n\r\n");
            b instanceof ArrayBuffer || "[object ArrayBuffer]" == b.toString()
                ? a.appendArrayBuffer(b)
                : a.appendString(b);
            a.appendString("\r\n");
            a.appendString("--004460bc4277474996e8e922d1b4b4ecbf5a4c7c--");
            d = {
                responseType: "json",
                method: "POST",
                url: "image" === c.type ? n("images/create") : k("create"),
                query: {dapiAuthToken: d},
                contentType:
                    'multipart/related; boundary="004460bc4277474996e8e922d1b4b4ecbf5a4c7c"',
                content: a.toUint8Array(),
            };
            jsdapi.http.sendRequest(d, function (f) {
                f &&
                    !f.error &&
                    f.file &&
                    (f.file = jsdapi.sru.types.File.fromJSON(f.file));
                l(e, f);
            });
        });
    };
    h.updateFile = function (c, b, e) {
        jsdapi.authorize(function (d) {
            if (!d) return l(e, {error: 401, message: "Authorization failed!"});
            var a = new jsdapi.utf8.Utf8Data();
            a.appendString("--004460bc4277474996e8e922d1b4b4ecbf5a4c7c\r\n");
            a.appendString("Content-ID: info\r\n");
            a.appendString('Content-Disposition: inline; name="info";\r\n');
            a.appendString("Content-Type: application/octet-stream\r\n");
            a.appendString("Content-Transfer-Encoding: binary\r\n\r\n");
            a.appendString(c.toJSONString());
            a.appendString("\r\n");
            a.appendString("--004460bc4277474996e8e922d1b4b4ecbf5a4c7c\r\n");
            a.appendString("Content-ID: body\r\n");
            a.appendString('Content-Disposition: inline; name="body";\r\n');
            a.appendString("Content-Type: application/octet-stream\r\n");
            a.appendString("Content-Transfer-Encoding: binary\r\n\r\n");
            a.appendString(b);
            a.appendString("\r\n");
            a.appendString("--004460bc4277474996e8e922d1b4b4ecbf5a4c7c--");
            d = {
                responseType: "json",
                method: "POST",
                url: k("update"),
                query: {dapiAuthToken: d},
                contentType:
                    'multipart/related; boundary="004460bc4277474996e8e922d1b4b4ecbf5a4c7c"',
                content: a.toUint8Array(),
            };
            jsdapi.http.sendRequest(d, function (f) {
                f &&
                    !f.error &&
                    f.file &&
                    (f.file = jsdapi.sru.types.File.fromJSON(f.file));
                l(e, f);
            });
        });
    };
    h.downloadFile = function (c, b, e) {
        jsdapi.authorize(function (d) {
            if (!d) return l(e, {error: 401, message: "Authorization failed!"});
            d = {
                responseType: b || "binary",
                method: "GET",
                url: "image" === c.type ? n("images/content") : k("content"),
                query: {
                    dapiAuthToken: d,
                    type: c.type,
                    uuid: c.uuid instanceof Object ? c.uuid.uuid : c.uuid,
                },
            };
            jsdapi.http.sendRequest(d, function (a) {
                l(e, a);
            });
        });
    };
    h.testUpdateOutlines = function () {
        var c = {
            update: {
                directories: [
                    {
                        uuid: "d3",
                        parentUuid: "d1",
                        title: "Directory 03",
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "d1.a.1.x",
                        parentUuid: "d1.a.1",
                        title: "Directory 01.a.1.x",
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "d1.a.1.y",
                        parentUuid: "d1.a.1",
                        title: "Directory 01.a.1.y",
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "d1.a",
                        parentUuid: "d1",
                        title: "Directory 01.a",
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "d1.b",
                        parentUuid: "d1",
                        title: "Directory 01.b",
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "d1.a.1",
                        parentUuid: "d1.a",
                        title: "Directory 01.a.1",
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "d1.a.2",
                        parentUuid: "d1.a",
                        title: "Directory 01.a.2",
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "d1",
                        title: "Directory 01",
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "d2",
                        title: "Directory 02",
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                ],
                outlines: [
                    {
                        uuid: "o1",
                        parentUuid: "d1",
                        title: "Outline 01",
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "o2",
                        parentUuid: null,
                        title: "Outline 02",
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "o3",
                        title: "Outline 03",
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                ],
                topics: [
                    {
                        uuid: "t1",
                        outlineUuid: "o1",
                        body: "<b>Topic 01 content</b>",
                        location: 10,
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                        sourcesUuids: ["s1", "s3"],
                    },
                    {
                        uuid: "t2",
                        outlineUuid: "o1",
                        body: "<b>Topic 02 content</b>",
                        location: 3,
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "t3",
                        outlineUuid: "o1",
                        body: "<b>Topic 03 content</b>",
                        location: 2,
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                ],
                sources: [
                    {
                        uuid: "s1",
                        outlineUuid: "o1",
                        data: JSON.stringify({
                            info: {author: "Codrin", title: "About ice"},
                            text: {MLA: "<p>Codrin, About ice</p>"},
                        }),
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "s4",
                        outlineUuid: "o1",
                        data: JSON.stringify({
                            info: {author: "Alina", title: "About earth"},
                            text: {MLA: "<p>Alina, About earth</p>"},
                        }),
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                    {
                        uuid: "s3",
                        outlineUuid: "o1",
                        data: JSON.stringify({
                            info: {author: "Otilia", title: "About water"},
                            text: {MLA: "<p>Otila, About water</p>"},
                        }),
                        creationDate: Date.now(),
                        modifiedDate: Date.now(),
                    },
                ],
            },
            delete: {
                directories: [{uuid: "d2"}],
                outlines: [{uuid: "o2"}],
                topics: [{uuid: "t3"}],
                sources: [{uuid: "s2"}],
            },
        };
        h.comboUpdateOutlinesData(c, function (b) {});
    };
    h.comboUpdateOutlinesData = function (c, b) {
        jsdapi.authorize(function (e) {
            if (!e) return l(b, {error: 401, message: "Authorization failed!"});
            e = {
                responseType: "json",
                method: "POST",
                url: n("data/combo-update"),
                query: {dapiAuthToken: e},
                contentType: "application/json",
                content: JSON.stringify(c),
            };
            jsdapi.http.sendRequest(e, function (d) {
                l(b, d);
            });
        });
    };
    h.downloadOutlinesData = function (c, b) {
        jsdapi.authorize(function (e) {
            if (!e) return l(b, {error: 401, message: "Authorization failed!"});
            e = {
                responseType: "json",
                method: "POST",
                url: n("data/download"),
                query: {dapiAuthToken: e},
                contentType: "application/json",
                content: JSON.stringify(c),
            };
            jsdapi.http.sendRequest(e, function (d) {
                l(b, d);
            });
        });
    };
    h.updateMeasurements = function (c, b) {
        jsdapi.authorize(function (e) {
            if (!e) return l(b, {error: 401, message: "Authorization failed!"});
            e = {
                responseType: "json",
                method: "POST",
                url: p("update"),
                query: {dapiAuthToken: e},
                contentType: "application/json",
                content: JSON.stringify(c),
            };
            jsdapi.http.sendRequest(e, function (d) {
                l(b, d);
            });
        });
    };
})((window.jsdapi.sru = window.jsdapi.sru || {}));
(function (h) {
    h.File = function (g, k) {
        this.uuid = g;
        this.type = k;
        this.comment =
            this.version =
            this.modifiedUuid =
            this.modifiedDate =
            this.creationDate =
            this.checksum =
            this.language =
                null;
    };
    h.File.fromJSON = function (g) {
        var k = new h.File(g.uuid, g.type);
        k.language = g.language;
        k.checksum = g.checksum;
        k.creationDate = g.creationDate;
        k.modifiedDate = g.modifiedDate;
        k.modifiedUuid = g.modifiedUuid;
        k.version = g.version;
        k.comment = g.comment;
        return k;
    };
    h.File.fromJSONString = function (g) {
        try {
            g = JSON.parse(g);
        } catch (k) {
            dji.logger.error(k);
        }
        return h.File.fromJSON(g);
    };
    h.File.prototype.toJSON = function () {
        return {
            uuid: this.uuid,
            type: this.type,
            language: this.language,
            checksum: this.checksum,
            creationDate: this.creationDate,
            modifiedDate: this.modifiedDate,
            modifiedUuid: this.modifiedUuid,
            version: this.version,
            comment: this.comment,
        };
    };
    h.File.prototype.toJSONString = function () {
        return JSON.stringify(this.toJSON());
    };
})((window.jsdapi.sru.types = window.jsdapi.sru.types || {}));
