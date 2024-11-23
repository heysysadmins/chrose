window.sru = window.sru || {};
window.sru.userData = window.sru.userData || {};
(function (P) {
    function F(c, a, n) {
        var e = [],
            g = [],
            b = [],
            k = [],
            l,
            q,
            h,
            d;
        for (d in c)
            if (c.hasOwnProperty(d)) {
                var f = (l = q = h = !1);
                var r = c[d];
                var m = r.local;
                r = r.remote;
                m
                    ? m.__dapiInfo
                        ? !n && m.__dapiInfo
                            ? m.deleted
                                ? (h = !0)
                                : m.modifiedDate > m.__dapiInfo.modifiedDate &&
                                  (l = !0)
                            : n &&
                              m.__dapiInfo &&
                              (r
                                  ? m.deleted
                                      ? (h = !0)
                                      : m.modifiedDate > r.modifiedDate
                                        ? (l = !0)
                                        : m.__dapiInfo.version < r.version &&
                                          (f = !0)
                                  : (q = !0))
                        : m.deleted
                          ? (q = !0)
                          : (l = !0)
                    : r && (f = !0);
                q
                    ? b.push(N(d, m, a))
                    : h
                      ? k.push(N(d, m, a))
                      : f
                        ? ((m = {uuid: r.uuid}),
                          a === u.Image && (m.data = r),
                          e.push(m))
                        : l && g.push(N(d, m, a, !0));
            }
        return {
            toDownload: 0 < e.length ? e : null,
            toUpload: 0 < g.length ? g : null,
            toDeleteRemote: 0 < k.length ? k : null,
            toDeleteLocal: 0 < b.length ? b : null,
        };
    }
    function N(c, a, n, e) {
        var g = null;
        n == u.Directory || n == u.Outline
            ? ((g = {uuid: c}),
              e &&
                  ((g.parentUuid = a.parentUuid),
                  (g.title = a.title),
                  (g.creationDate = a.creationDate),
                  (g.modifiedDate = a.modifiedDate)))
            : n == u.Topic
              ? ((g = {uuid: c}),
                e &&
                    ((g.parentUuid = a.parentUuid),
                    (g.outlineUuid = a.outlineUuid),
                    (g.body = a.body),
                    (g.location = a.location),
                    (g.creationDate = a.creationDate),
                    (g.modifiedDate = a.modifiedDate)))
              : n == u.Source
                ? ((g = {uuid: c}),
                  e &&
                      ((a.data.boundToOutline = a.boundToOutline),
                      (a.data.fromHighlight = a.fromHighlight),
                      (g.outlineUuid = a.outlineUuid),
                      (g.data = JSON.stringify(a.data)),
                      (g.creationDate = a.creationDate),
                      (g.modifiedDate = a.modifiedDate),
                      delete a.data.boundToOutline,
                      delete a.data.fromHighlight))
                : n == u.Image &&
                  ((g = {uuid: c}),
                  e &&
                      ((g.checksum = a.checksum),
                      (g.body = a.body),
                      (g.creationDate = a.creationDate),
                      (g.modifiedDate = a.modifiedDate)));
        return g;
    }
    function G(c, a, n) {
        a = a || {};
        c.hasOwnProperty("uuid") &&
            !a.hasOwnProperty("uuid") &&
            (a.uuid = c.uuid);
        c.hasOwnProperty("creationDate") &&
            !a.hasOwnProperty("creationDate") &&
            (a.creationDate = c.creationDate);
        c.hasOwnProperty("modifiedDate") && (a.modifiedDate = c.modifiedDate);
        if (n == u.Directory || n == u.Outline)
            c.hasOwnProperty("title") && (a.title = c.title),
                c.hasOwnProperty("parentUuid") && (a.parentUuid = c.parentUuid);
        else if (n == u.Topic)
            c.hasOwnProperty("parentUuid") && (a.parentUuid = c.parentUuid),
                c.hasOwnProperty("outlineUuid") &&
                    (a.outlineUuid = c.outlineUuid),
                c.hasOwnProperty("location") && (a.location = c.location),
                c.hasOwnProperty("body") && (a.body = c.body),
                (a.linkedSources = a.linkedSources || {});
        else if (n == u.Source) {
            c.hasOwnProperty("outlineUuid") && (a.outlineUuid = c.outlineUuid);
            if (c.hasOwnProperty("data"))
                try {
                    var e = JSON.parse(c.data);
                    e &&
                        (e.hasOwnProperty("boundToOutline") &&
                            ((a.boundToOutline = e.boundToOutline),
                            delete e.boundToOutline),
                        e.hasOwnProperty("fromHighlight") &&
                            ((a.fromHighlight = e.fromHighlight),
                            delete e.fromHighlight),
                        (a.data = e));
                } catch (g) {
                    dji.logger.error(g);
                }
            a.boundToOutline = a.boundToOutline || !1;
            a.fromHighlight = a.fromHighlight || !1;
        } else
            n == u.Image &&
                (c.hasOwnProperty("checksum") && (a.checksum = c.checksum),
                c.hasOwnProperty("body") && (a.body = c.body));
        a.__dapiInfo = a.__dapiInfo || {};
        c.hasOwnProperty("modifiedDate") &&
            (a.__dapiInfo.modifiedDate = c.modifiedDate);
        c.hasOwnProperty("version") && (a.__dapiInfo.version = c.version);
        return a;
    }
    function Q(c, a, n) {
        var e = {},
            g = {},
            b = {},
            k = {},
            l = {},
            q = {},
            h,
            d,
            f,
            r,
            m,
            w,
            B,
            t = function (v, x, C) {
                if (v && x && C)
                    for (h = 0; h < v.length; h++)
                        (f = v[h]),
                            (d = f.uuid),
                            x.hasOwnProperty(d) || (x[d] = {}),
                            (x[d][C] = f);
            },
            E = function (v, x, C) {
                if (v && x && C)
                    for (h = 0; h < v.length; h++)
                        if (
                            ((r = v[h].topicUuid),
                            (w = v[h].sourcesUuids),
                            (y = x[r] = x[r] || {}),
                            w)
                        )
                            for (var H = 0; H < w.length; H++)
                                (m = w[H]),
                                    (B = y[m] = y[m] || {}),
                                    (B[C] = {modifiedDate: -1});
            };
        for (d in c.directories) e[d] = {local: c.directories[d]};
        for (d in c.outlines) g[d] = {local: c.outlines[d]};
        for (d in c.topics) {
            var D = c.topics[d];
            b[d] = {local: D};
            var y = {isEmpty: !0};
            for (m in D.linkedSources)
                (y[m] = {local: D.linkedSources[m]}), (y.isEmpty = !1);
            y.isEmpty || (delete y.isEmpty, (l[d] = y));
        }
        for (d in c.sources) k[d] = {local: c.sources[d]};
        for (d in c.images) q[d] = {local: c.images[d]};
        n
            ? (t(a.directories, e, "remote"),
              t(a.outlines, g, "remote"),
              t(a.topics, b, "remote"),
              t(a.sources, k, "remote"),
              t(a.images, q, "remote"))
            : (a.download &&
                  (t(a.download.directories, e, "download"),
                  t(a.download.outlines, g, "download"),
                  t(a.download.topics, b, "download"),
                  t(a.download.sources, k, "download"),
                  t(a.download.images, q, "download")),
              a.update &&
                  (t(a.update.directories, e, "update"),
                  t(a.update.outlines, g, "update"),
                  t(a.update.topics, b, "update"),
                  t(a.update.sources, k, "update"),
                  t(a.update.images, q, "update"),
                  E(a.update.topicsSources, l, "update")),
              a["delete"] &&
                  (t(a["delete"].directories, e, "delete"),
                  t(a["delete"].outlines, g, "delete"),
                  t(a["delete"].topics, b, "delete"),
                  t(a["delete"].sources, k, "delete"),
                  t(a["delete"].images, q, "delete"),
                  E(a["delete"].topicsSources, l, "delete")));
        return {
            directories: e,
            outlines: g,
            topics: b,
            sources: k,
            topicsSources: l,
            images: q,
        };
    }
    var u = {
        Directory: 1,
        Outline: 2,
        Topic: 3,
        Source: 4,
        TopicsSources: 5,
        Image: 6,
    };
    P.syncPrepareOutlinesUpdate = function (c, a, n) {
        if (!a) return null;
        try {
            var e,
                g = !1,
                b = {},
                k = {
                    directories: [],
                    outlines: [],
                    topics: [],
                    sources: [],
                    topicsSources: [],
                    images: [],
                },
                l = Q(c, a, !0),
                q = F(l.directories, u.Directory, n),
                h = F(l.outlines, u.Outline, n),
                d = F(l.topics, u.Topic, n),
                f = F(l.sources, u.Source, n),
                r = l.topics,
                m = l.topicsSources;
            a = [];
            var w = [],
                B = [],
                t = [],
                E,
                D,
                y,
                v,
                x;
            for (v in m)
                if (m.hasOwnProperty(v)) {
                    var C = m[v];
                    var H = r[v];
                    for (x in C) {
                        var R = (E = D = y = !1);
                        var A = null;
                        var S = C[x];
                        var J = S.local;
                        var W = S.remote;
                        J
                            ? J.__dapiInfo
                                ? J.deleted && (y = !0)
                                : J.deleted
                                  ? (D = !0)
                                  : H.local.deleted || (E = !0)
                            : W && (R = !0);
                        D ? (A = B) : y ? (A = t) : R ? (A = a) : E && (A = w);
                        if (A) {
                            var I = 0 < A.length ? A[A.length - 1] : null;
                            (I && I.topicUuid == v) ||
                                ((I = {topicUuid: v, sourcesUuids: []}),
                                A.push(I));
                            I.sourcesUuids.push(x);
                        }
                    }
                }
            var T = 0 < w.length ? w : null;
            var U = 0 < t.length ? t : null;
            var K = 0 < B.length ? B : null;
            var z = F(l.images, u.Image, n);
            if (q.toDeleteLocal && 0 < q.toDeleteLocal.length)
                for (g = !0, e = 0; e < q.toDeleteLocal.length; e++) {
                    var p = q.toDeleteLocal[e].uuid;
                    c.directories[p] &&
                        !c.directories[p].deleted &&
                        k.directories.push(p);
                    delete c.directories[p];
                }
            if (h.toDeleteLocal && 0 < h.toDeleteLocal.length)
                for (g = !0, e = 0; e < h.toDeleteLocal.length; e++)
                    (p = h.toDeleteLocal[e].uuid),
                        c.outlines[p] &&
                            !c.outlines[p].deleted &&
                            k.outlines.push(p),
                        delete c.outlines[p];
            if (d.toDeleteLocal && 0 < d.toDeleteLocal.length)
                for (g = !0, e = 0; e < d.toDeleteLocal.length; e++)
                    (p = d.toDeleteLocal[e].uuid),
                        c.topics[p] && !c.topics[p].deleted && k.topics.push(p),
                        delete c.topics[p];
            if (f.toDeleteLocal && 0 < f.toDeleteLocal.length)
                for (g = !0, e = 0; e < f.toDeleteLocal.length; e++)
                    (p = f.toDeleteLocal[e].uuid),
                        c.sources[p] &&
                            !c.sources[p].deleted &&
                            k.sources.push(p),
                        delete c.sources[p];
            if (K && 0 < K.length) {
                var L, M;
                g = !0;
                for (e = 0; e < K.length; e++) {
                    var O = K[e];
                    if ((L = c.topics[O.topicUuid])) {
                        var V = O.sourcesUuids;
                        for (M = 0; M < V.length; M++)
                            (n = []),
                                (p = V[M]),
                                L.linkedSources[p] &&
                                    !L.linkedSources[p].deleted &&
                                    n.push(p),
                                0 < n.length &&
                                    k.topicsSources.push({
                                        topicUuid: O.topicUuid,
                                        sourcesUuids: n,
                                    }),
                                delete L.linkedSources[p];
                    }
                }
            }
            if (z.toDeleteLocal && 0 < z.toDeleteLocal.length)
                for (g = !0, e = 0; e < z.toDeleteLocal.length; e++)
                    (p = z.toDeleteLocal[e].uuid),
                        c.images[p] && !c.images[p].deleted && k.images.push(p),
                        delete c.images[p];
            q.toUpload &&
                ((b.update = b.update || {}),
                (b.update.directories = q.toUpload));
            h.toUpload &&
                ((b.update = b.update || {}), (b.update.outlines = h.toUpload));
            d.toUpload &&
                ((b.update = b.update || {}), (b.update.topics = d.toUpload));
            f.toUpload &&
                ((b.update = b.update || {}), (b.update.sources = f.toUpload));
            T && ((b.update = b.update || {}), (b.update.topicsSources = T));
            z.toUpload &&
                ((b.update = b.update || {}), (b.update.images = z.toUpload));
            q.toDeleteRemote &&
                ((b["delete"] = b["delete"] || {}),
                (b["delete"].directories = q.toDeleteRemote));
            h.toDeleteRemote &&
                ((b["delete"] = b["delete"] || {}),
                (b["delete"].outlines = h.toDeleteRemote));
            d.toDeleteRemote &&
                ((b["delete"] = b["delete"] || {}),
                (b["delete"].topics = d.toDeleteRemote));
            f.toDeleteRemote &&
                ((b["delete"] = b["delete"] || {}),
                (b["delete"].sources = f.toDeleteRemote));
            U &&
                ((b["delete"] = b["delete"] || {}),
                (b["delete"].topicsSources = U));
            z.toDeleteRemote &&
                ((b["delete"] = b["delete"] || {}),
                (b["delete"].images = z.toDeleteRemote));
            q.toDownload &&
                ((b.download = b.download || {}),
                (b.download.directories = q.toDownload));
            h.toDownload &&
                ((b.download = b.download || {}),
                (b.download.outlines = h.toDownload));
            d.toDownload &&
                ((b.download = b.download || {}),
                (b.download.topics = d.toDownload));
            f.toDownload &&
                ((b.download = b.download || {}),
                (b.download.sources = f.toDownload));
            z.toDownload &&
                ((b.download = b.download || {}),
                (b.download.images = z.toDownload));
            b.update || b["delete"] || b.download || (b = null);
            g && (g = !0);
            0 == k.directories.length && delete k.directories;
            0 == k.outlines.length && delete k.outlines;
            0 == k.topics.length && delete k.topics;
            0 == k.sources.length && delete k.sources;
            0 == k.images.length && delete k.images;
            k.directories ||
                k.outlines ||
                k.topics ||
                k.sources ||
                k.images ||
                (k = null);
            return {save: g, data: b, deleted: k};
        } catch (X) {
            dji.logger.error(X);
        }
    };
    P.syncPrepareOutlinesSave = function (c, a) {
        if (!a) return null;
        try {
            var n,
                e,
                g,
                b,
                k = !1,
                l = {
                    directories: [],
                    outlines: [],
                    topics: [],
                    sources: [],
                    images: [],
                },
                q = {topicsSources: []},
                h = Q(c, a, !1);
            for (e in h.sources)
                if (h.sources.hasOwnProperty(e)) {
                    var d = h.sources[e];
                    if ((b = d.download || d.update)) {
                        var f = G(b, d.local, u.Source);
                        d.local = f;
                        c.sources[f.uuid] = f;
                        d.download && l.sources.push(f);
                        k = !0;
                    }
                }
            for (e in h.topics)
                if (
                    h.topics.hasOwnProperty(e) &&
                    ((d = h.topics[e]), (b = d.download || d.update)) &&
                    ((f = G(b, d.local, u.Topic)),
                    (d.local = f),
                    (c.topics[f.uuid] = f),
                    (k = !0),
                    d.download)
                ) {
                    a = [];
                    b.sourcesUuids = b.sourcesUuids || [];
                    for (n = 0; n < b.sourcesUuids.length; n++) {
                        var r = b.sourcesUuids[n];
                        var m = f.linkedSources[r] || {};
                        m.modifiedDate = f.modifiedDate;
                        m.__dapiInfo = {modifiedDate: f.modifiedDate};
                        f.linkedSources[r] = m;
                    }
                    for (r in f.linkedSources)
                        !f.linkedSources[r].deleted &&
                            f.linkedSources[r].__dapiInfo &&
                            -1 == b.sourcesUuids.indexOf(r) &&
                            (a.push(r), delete f.linkedSources[r]);
                    0 < a.length &&
                        q.topicsSources.push({topicUuid: e, sourcesUuids: a});
                    l.topics.push(f);
                }
            for (e in h.topicsSources)
                if (h.topics.hasOwnProperty(e)) {
                    var w = h.topicsSources[e];
                    if ((g = c.topics[e]) && w)
                        for (r in w)
                            if (((d = w[r]), (f = d.local)))
                                d["delete"]
                                    ? (delete g.linkedSources[r], (k = !0))
                                    : d.update &&
                                      ((f.__dapiInfo = f.__dapiInfo || {}),
                                      (f.__dapiInfo.modifiedDate =
                                          f.modifiedDate),
                                      (k = !0));
                }
            for (e in h.outlines)
                h.outlines.hasOwnProperty(e) &&
                    ((d = h.outlines[e]), (b = d.download || d.update)) &&
                    ((f = G(b, d.local, u.Outline)),
                    (d.local = f),
                    (c.outlines[f.uuid] = f),
                    d.download && l.outlines.push(f),
                    (k = !0));
            for (e in h.directories)
                h.directories.hasOwnProperty(e) &&
                    ((d = h.directories[e]), (b = d.download || d.update)) &&
                    ((f = G(b, d.local, u.Directory)),
                    (d.local = f),
                    (c.directories[f.uuid] = f),
                    d.download && l.directories.push(f),
                    (k = !0));
            for (e in h.images)
                h.images.hasOwnProperty(e) &&
                    ((d = h.images[e]), (b = d.download || d.update)) &&
                    ((f = G(b, d.local, u.Image)),
                    (d.local = f),
                    (c.images[f.uuid] = f),
                    d.download && l.images.push(f),
                    (k = !0));
            0 == l.directories.length && delete l.directories;
            0 == l.outlines.length && delete l.outlines;
            0 == l.topics.length && delete l.topics;
            0 == l.sources.length && delete l.sources;
            0 == l.images.length && delete l.images;
            l.directories ||
                l.outlines ||
                l.topics ||
                l.sources ||
                l.images ||
                (l = null);
            0 == q.topicsSources.length && (q = null);
            return {save: k, downloaded: l, deleted: q};
        } catch (B) {
            dji.logger.error(B);
        }
    };
})((window.sru.userData.helper = window.sru.userData.helper || {}));
