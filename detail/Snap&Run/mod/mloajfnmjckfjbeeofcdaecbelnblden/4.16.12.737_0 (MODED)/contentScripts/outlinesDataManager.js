window.sru = window.sru || {};
(function (h) {
    function G() {
        var a = q.slice();
        if (0 < a.length) {
            var b = r[r.length - 1];
            b && b.isSkeleton() && a.splice(a.length - 1);
        }
        dji.utils.callListeners(H, "uiPathUpdated", a);
    }
    function v(a, b) {
        (a || b) &&
            dji.utils.callListeners(H, "dataUpdated", {
                update: a || null,
                delete: b || null,
            });
    }
    function t() {
        var a = {
                directories: [],
                outlines: [],
                topics: [],
                sources: [],
                topicsSources: [],
                images: [],
            },
            b,
            c = !1,
            d = Array.prototype.slice.call(arguments);
        0 < d.length &&
            "boolean" === typeof d[d.length - 1] &&
            ((c = !!d[d.length - 1]), d.splice(d.length - 1));
        for (b = 0; b < d.length; b++) {
            var e = d[b];
            e instanceof Array &&
                (0 < e.length
                    ? Array.prototype.splice.apply(d, [b, 1].concat(e))
                    : d.splice(b, 1),
                b--);
        }
        for (b = 0; b < d.length; b++)
            if (((e = d[b]), e instanceof p))
                e.isDirectory()
                    ? a.directories.push(c ? {uuid: e.uuid()} : e.__info())
                    : e.isHome() ||
                      a.outlines.push(c ? {uuid: e.uuid()} : e.__info());
            else if (e instanceof n)
                a.topics.push(c ? {uuid: e.uuid()} : e.__info());
            else if (e instanceof u)
                a.sources.push(c ? {uuid: e.uuid()} : e.__info());
            else if (e instanceof C) a.topicsSources.push(e.__info());
            else if (e instanceof B) {
                let k = JSON.parse(JSON.stringify(e.__info()));
                k.body = dji.utils.toUint8Array(e.body());
                a.images.push(k);
            }
        for (var f in a) a.hasOwnProperty(f) && 0 == a[f].length && delete a[f];
        return a;
    }
    function J() {
        for (var a = 1; a < q.length; a++) {
            var b = q[a];
            if (b.uuid && !h.outlineByUuid(b.uuid)) {
                q.splice(a);
                break;
            }
        }
    }
    function K(a) {
        if (!a) return null;
        var b,
            c,
            d = {topOutline: !1, topDirectory: !1, topTopic: !1, topSource: !1};
        if (a.directories) {
            var e = a.directories;
            for (b = 0; b < e.length; b++) {
                var f = e[b];
                (c = g.directories[f.uuid])
                    ? (c.m_info = f)
                    : ((c = new D(f)), (g.directories[c.uuid()] = c));
                if (-1 != z(c.uuid(), !0) || 0 <= z(c.parentUuid(), !0))
                    d.topDirectory = !0;
            }
        }
        if (a.outlines)
            for (e = a.outlines, b = 0; b < e.length; b++)
                if (
                    ((f = e[b]),
                    (c = g.outlines[f.uuid])
                        ? (c.m_info = f)
                        : ((c = new p(f)), (g.outlines[c.uuid()] = c)),
                    -1 != z(c.uuid(), !0) || 0 <= z(c.parentUuid(), !0))
                )
                    d.topOutline = !0;
        if (a.topics)
            for (e = a.topics, b = 0; b < e.length; b++)
                if (
                    ((f = e[b]),
                    (c = g.topics[f.uuid])
                        ? (c.m_info = f)
                        : ((c = new n(f)), (g.topics[c.uuid()] = c)),
                    (f = c.uuid()),
                    -1 != E("uuidTopic", f, !0) || 0 <= z(c.outlineUuid(), !0))
                )
                    d.topTopic = !0;
        if (a.sources)
            for (e = a.sources, b = 0; b < e.length; b++)
                if (
                    ((f = e[b]),
                    (c = g.sources[f.uuid])
                        ? (c.m_info = f)
                        : ((c = new u(f)), (g.sources[c.uuid()] = c)),
                    (f = c.uuid()),
                    -1 != E("uuidSource", f, !0) || 0 <= z(c.outlineUuid(), !0))
                )
                    d.topSource = !0;
        if (a.images)
            for (e = a.images, b = 0; b < e.length; b++)
                (f = e[b]),
                    (c = g.images[f.uuid])
                        ? (c.m_info = f)
                        : ((f.body = dji.utils.toArrayBuffer(f.body)),
                          (c = new B(f)),
                          (g.images[c.uuid()] = c)),
                    -1 !== L(f.uuid) && (d.topImage = !0);
        return d;
    }
    function z(a, b) {
        return E("uuid", a, b);
    }
    function E(a, b, c) {
        if (!a) return -1;
        if (c) {
            if (0 < q.length) {
                var d = q[q.length - 1];
                if (d[a] == b) return q.length - 1;
            }
        } else
            for (c = 1; c < q.length; c++)
                if (((d = q[c]), d[a] == b)) return c;
        return -1;
    }
    function L(a) {
        if (0 === q.length) return -1;
        var b = q[q.length - 1],
            c = g.outlines[b.uuid];
        if ("outline" === b.pageType && c)
            for (b = c.topics(), c = 0; c < b.length; c++) {
                let d = b[c].bodyImageUuid();
                if (d && d === a) return c;
            }
        return -1;
    }
    function I(a, b) {
        return void 0 === a.m_info.modifiedDate || void 0 === a.m_info.title
            ? 1
            : void 0 === b.m_info.modifiedDate || void 0 === b.m_info.title
              ? -1
              : a.m_info.modifiedDate < b.m_info.modifiedDate
                ? 1
                : a.m_info.modifiedDate > b.m_info.modifiedDate
                  ? -1
                  : a.m_info.title.localeCompare(b.m_info.title);
    }
    function M(a) {
        var b = function (c) {
            var d = c.cslData();
            return d
                ? d.author[0] && d.author[0].family
                    ? d.author[0].family
                    : "No author"
                : c.author().split(",")[0];
        };
        a.sort(function (c, d) {
            return b(c).localeCompare(b(d));
        });
    }
    function N(a) {
        a.sort(function (b, c) {
            return b.m_info.location - c.m_info.location;
        });
    }
    function T(a) {
        var b = dji.utils.splitInWords(a.trim().toUpperCase(), !1);
        if (!b || 0 == b.length) return [];
        a = [];
        for (e in g.directories)
            if (g.directories.hasOwnProperty(e)) {
                var c = g.directories[e];
                var d = O(c, b);
                0 < d && a.push({outline: c, matches: d});
            }
        for (e in g.outlines)
            g.outlines.hasOwnProperty(e) &&
                ((c = g.outlines[e]),
                (d = O(c, b)),
                0 < d && a.push({outline: c, matches: d}));
        if (0 == a.length) return [];
        if (1 == a.length) return [a[0].outline];
        a.sort(function (f, k) {
            return f.matches < k.matches
                ? 1
                : f.matches > k.matches
                  ? -1
                  : I(f.outline, k.outline);
        });
        var e = [];
        for (b = 0; b < a.length; b++) e.push(a[b].outline);
        return e;
    }
    function O(a, b) {
        for (var c = 0, d = 0; d < b.length; d++)
            -1 !== a.title().toUpperCase().indexOf(b[d]) && c++;
        return c;
    }
    function P(a, b) {
        var c = {directoriesUuids: []},
            d;
        for (d in g.directories) {
            var e = g.directories[d];
            e.parentUuid() == a &&
                (c.directoriesUuids.push(e.uuid()),
                (e = P(e.uuid(), !1)),
                (c.directoriesUuids = c.directoriesUuids.concat(
                    e.directoriesUuids,
                )));
        }
        if (b)
            for (d in (c.directoriesUuids.unshift(a),
            (c.outlinesUuids = []),
            (c.topicsUuids = []),
            (c.sourcesUuids = []),
            g.outlines))
                (e = g.outlines[d]),
                    -1 != c.directoriesUuids.indexOf(e.parentUuid()) &&
                        (c.outlinesUuids.push(e.uuid()),
                        (e = Q(e.uuid())),
                        (c.topicsUuids = c.topicsUuids.concat(e.topicsUuids)),
                        (c.sourcesUuids = c.sourcesUuids.concat(
                            e.sourcesUuids,
                        )));
        return c;
    }
    function Q(a) {
        var b = {topicsUuids: [], sourcesUuids: [], imagesUuids: []};
        for (var c in g.topics) {
            const d = g.topics[c];
            d.outlineUuid() == a &&
                (b.topicsUuids.push(d.uuid()),
                b.imagesUuids.push(d.bodyImageUuid()));
        }
        for (let d in g.sources)
            (c = g.sources[d]),
                c.outlineUuid() == a && b.sourcesUuids.push(c.uuid());
        return b;
    }
    function R(a) {
        var b = [],
            c;
        for (c in g.topics) {
            var d = g.topics[c];
            d.parentUuid() == a.uuid() && b.push(d);
        }
        for (a = 0; a < b.length; a++) (d = R(b[a])), (b = b.concat(d));
        return b;
    }
    function S(a) {
        let b = new Set();
        for (var c = 0; c < a.length; c++) {
            let d = a[c].bodyImageUuid();
            d && b.add(d);
        }
        if (0 < b.size)
            for (let d in g.topics)
                (c = g.topics[d]),
                    -1 === a.indexOf(c) &&
                        (c = c.bodyImageUuid()) &&
                        b.has(c) &&
                        b.delete(c);
        return [...b];
    }
    function w(a, b) {
        this.m_info = a;
        if ((this.m_isSkeleton = !!b))
            (this.m_info.uuid = dji.utils.generateUUID()),
                (this.m_info.creationDate = Date.now()),
                (this.m_info.modifiedDate = this.m_info.creationDate);
    }
    function p(a, b) {
        w.call(this, a, b);
        this.m_isPdf = this.m_isDirectory = this.m_isHome = !1;
        this.m_isSkeleton &&
            ((this.m_info.parentUuid = a.parentUuid || null),
            (this.m_info.title = null));
    }
    function D(a, b) {
        p.call(this, a, b);
        this.m_isDirectory = !0;
    }
    function F() {
        p.call(this, null);
        this.m_isHome = !0;
    }
    function n(a, b) {
        w.call(this, a, b);
        this.m_isSkeleton &&
            ((this.m_info.outlineUuid = a.outlineUuid || null),
            (this.m_info.parentUuid = a.parentUuid || null),
            (this.m_info.location = a.hasOwnProperty("location")
                ? a.location
                : -1),
            (this.m_info.body = a.body || ""),
            (this.m_info.sourcesUuids = []));
    }
    function u(a, b) {
        w.call(this, a, b);
        this.m_isSkeleton &&
            ((this.m_info.outlineUuid = a.outlineUuid || null),
            (this.m_info.boundToOutline = a.hasOwnProperty("boundToOutline")
                ? !!a.boundToOutline
                : !1),
            (this.m_info.fromHighlight = a.hasOwnProperty("fromHighlight")
                ? !!a.fromHighlight
                : !1),
            (this.m_info.data = this.m_info.data || {}),
            a.hasOwnProperty("cslData") &&
                (this.m_info.data.cslData = a.cslData),
            a.hasOwnProperty("text") && (this.m_info.data.text = a.text));
    }
    function C(a) {
        this.m_topicUuid = a;
        this.m_sourcesUuids = [];
        for (var b = 1; b < arguments.length; b++)
            this.m_sourcesUuids.push(arguments[b]);
    }
    function B(a, b) {
        w.call(this, a, b);
        a.checksum
            ? (this.m_info.checksum = a.checksum)
            : ((b = new TextDecoder("utf-8")),
              (a = new Uint8Array(a.body)),
              (a = b.decode(a)),
              (this.m_info.checksum = CryptoJS.MD5(a).toString()));
    }
    var H = {dataUpdated: [], uiPathUpdated: []},
        g = {},
        q = [],
        r = [];
    h.addEventListener = function (a, b) {
        dji.utils.addEventListener(H, a, b);
    };
    h.setData = function (a, b) {
        a || ((a = {}), (b = null));
        (b && 0 != b.length) ||
            (b = [{uuid: null, pageType: "outline", view: "outline"}]);
        g = {
            directories: {},
            outlines: {},
            topics: {},
            sources: {},
            images: {},
        };
        K(a);
        q = b;
        J();
        r = [new F()];
        for (a = 1; a < q.length; a++)
            (b = q[a]),
                b.uuid &&
                    b.uuid != r[r.length - 1].uuid() &&
                    r.push(h.outlineByUuid(b.uuid));
    };
    h.updateData = function (a, b) {
        if (a) {
            b = K(a.update);
            if ((a = a["delete"])) {
                var c,
                    d = {
                        topOutline: !1,
                        topDirectory: !1,
                        topTopic: !1,
                        topSource: !1,
                    };
                if (a.directories) {
                    var e = a.directories;
                    for (c = 0; c < e.length; c++) {
                        var f = e[c];
                        var k = g.directories[f];
                        delete g.directories[f];
                        if (-1 != z(f) || (k && 0 <= z(k.parentUuid(), !0)))
                            d.topDirectory = !0;
                    }
                }
                if (a.outlines)
                    for (e = a.outlines, c = 0; c < e.length; c++)
                        if (
                            ((f = e[c]),
                            (k = g.outlines[f]),
                            delete g.outlines[f],
                            -1 != z(f) || (k && 0 <= z(k.parentUuid(), !0)))
                        )
                            d.topOutline = !0;
                if (a.topics)
                    for (e = a.topics, c = 0; c < e.length; c++)
                        if (
                            ((f = e[c]),
                            (k = g.topics[f]),
                            delete g.topics[f],
                            -1 != E("uuidTopic", f, void 0) ||
                                (k && 0 <= z(k.outlineUuid(), !0)))
                        )
                            d.topTopic = !0;
                if (a.sources)
                    for (e = a.sources, c = 0; c < e.length; c++)
                        if (
                            ((f = e[c]),
                            (k = g.sources[f]),
                            delete g.sources[e],
                            -1 != E("uuidSource", f, void 0) ||
                                (k && 0 <= z(k.outlineUuid(), !0)))
                        )
                            d.topSource = !0;
                if (a.topicsSources)
                    for (e = a.topicsSources, c = 0; c < e.length; c++)
                        (f = e[c]),
                            g.topics[f.topicUuid].__removeLinkedSourcesUuids(
                                f.sourcesUuids,
                            );
                if (a.images)
                    for (e = a.images, c = 0; c < e.length; c++)
                        (f = e[c]),
                            delete g.images[f],
                            -1 !== L(f) && (d.topImage = !0);
                a = d;
            } else a = null;
            J();
            return {updateInfo: b, deleteInfo: a};
        }
    };
    h.outlineStackSize = function () {
        return r ? r.length : 0;
    };
    h.outlineFromStack = function (a) {
        return r[a];
    };
    h.pushOutlineToStack = function (a) {
        r.push(a);
        var b = {uuid: a.uuid(), pageType: "outline", view: "outline"};
        a.isDirectory() ||
            ((b.selTab = "dji-sru-outline-details"), (b.sourceType = "APA"));
        h.pushUiPathState(b);
    };
    h.pushOutlineLinkToSourceToStack = function (a, b) {
        r.push(a);
        a = {
            uuid: a.uuid(),
            pageType: "linkToSource",
            view: "linkToSource",
            uuidTopic: b.uuid(),
        };
        h.pushUiPathState(a);
    };
    h.popOutlineFromStack = function () {
        r.splice(r.length - 1);
        h.popUiPathState();
    };
    h.activeOutline = function () {
        return r[r.length - 1];
    };
    h.uiPathSize = function () {
        return q.length;
    };
    h.uiPathState = function (a) {
        return q[a];
    };
    h.currentUiPathState = function () {
        return q[q.length - 1];
    };
    h.updateUiPathState = function (a) {
        G();
    };
    h.pushUiPathState = function (a) {
        q.push(a);
        G();
    };
    h.popUiPathState = function () {
        q.splice(q.length - 1);
        G();
    };
    h.outlineFromUiPathState = function (a) {
        return h.outlineByUuid(a ? a.uuid : null);
    };
    h.topicFromUiPathState = function (a) {
        return h.topicByUuid(a ? a.uuidTopic : null);
    };
    h.sourceFromUiPathState = function (a) {
        return h.sourceByUuid(a ? a.uuidSource : null);
    };
    h.home = function () {
        return 0 < r.length ? r[0] : null;
    };
    h.outlineByUuid = function (a) {
        if (!a) return r[0];
        var b = g.directories[a];
        b || (b = g.outlines[a]);
        return b || null;
    };
    h.topicByUuid = function (a) {
        return g.topics[a] || null;
    };
    h.sourceByUuid = function (a) {
        return g.sources[a] || null;
    };
    h.createDirectory = function (a, b) {
        var c = new D({}, !0);
        c.m_info.parentUuid = b ? b.uuid() : null;
        c.title(a);
        return c;
    };
    h.createSkeletonOutline = function (a) {
        a = new p({parentUuid: a.uuid()}, !0);
        h.pushOutlineToStack(a);
        return a;
    };
    h.moveOutlines = function (a, b) {
        for (var c, d = [], e = b ? b.uuid() : null, f = 0; f < a.length; f++)
            (c = a[f]), c.parentUuid(e) && d.push(c);
        0 < d.length && (b && (b.markAsModified(), d.push(b)), v(t(d)));
    };
    h.directories = function (a) {
        var b = [],
            c = a ? a.uuid() : null,
            d;
        for (d in g.directories)
            if (g.directories.hasOwnProperty(d)) {
                var e = g.directories[d];
                ((c && e.parentUuid() == c) || (!a && !e.parentUuid())) &&
                    b.push(e);
            }
        b.sort(I);
        return b;
    };
    h.outlineNameIsUnique = function (a) {
        var b = 0,
            c;
        for (c in g.outlines)
            if (
                g.outlines.hasOwnProperty(c) &&
                g.outlines[c].title() == a &&
                (b++, 1 < b)
            )
                return !1;
        return !0;
    };
    h.folderNameIsUnique = function (a) {
        var b = 0,
            c;
        for (c in g.directories)
            if (
                g.directories.hasOwnProperty(c) &&
                g.directories[c].title() == a &&
                (b++, 1 < b)
            )
                return !1;
        return !0;
    };
    h.getImageData = function (a) {
        return (a = g.images[a]) ? a.body() : null;
    };
    h.createImage = async function (a) {
        let b = [];
        a = await a.arrayBuffer();
        a = new B({body: a}, !0);
        a: {
            var c = a.checksum();
            for (d in g.images) {
                let e = g.images[d];
                if (e.checksum() === c) {
                    var d = e;
                    break a;
                }
            }
            d = null;
        }
        d ? (a = d) : ((g.images[a.uuid()] = a), b.push(a), v(t(b)));
        return a;
    };
    w.prototype.__info = function () {
        return this.m_info;
    };
    w.prototype.isSkeleton = function () {
        return this.m_isSkeleton;
    };
    w.prototype.uuid = function () {
        return this.m_info ? this.m_info.uuid : null;
    };
    w.prototype.parentUuid = function (a) {
        if (void 0 === a) return this.m_info ? this.m_info.parentUuid : null;
        if (this.m_info.parentUuid == a || this.m_info.uuid == a) return !1;
        this.m_info.parentUuid = a;
        this.markAsModified();
        return !0;
    };
    w.prototype.parent = function () {
        return null;
    };
    w.prototype.modifiedDate = function () {
        return this.m_info ? this.m_info.modifiedDate : null;
    };
    w.prototype.markAsModified = function (a) {
        this.m_info &&
            ((this.m_info.modifiedDate = a || Date.now()),
            this.m_info.creationDate ||
                (this.m_info.creationDate = this.m_info.modifiedDate));
    };
    p.prototype = Object.create(w.prototype);
    p.prototype.constructor = p;
    p.prototype.parent = function () {
        return this.m_info.parentUuid
            ? h.outlineByUuid(this.m_info.parentUuid)
            : r[0];
    };
    p.prototype.isHome = function () {
        return this.m_isHome;
    };
    p.prototype.isSkeleton = function () {
        return this.m_isSkeleton;
    };
    p.prototype.isDirectory = function () {
        return this.m_isDirectory;
    };
    p.prototype.isPdf = function () {
        return this.m_isPdf;
    };
    p.prototype.title = function (a) {
        if (void 0 === a) return this.m_info.title;
        if (this.m_info.title != a) {
            this.m_info.title = a;
            if ((a = this.m_isSkeleton))
                this.m_isDirectory
                    ? (g.directories[this.m_info.uuid] = this)
                    : (g.outlines[this.m_info.uuid] = this),
                    (this.m_isSkeleton = !1);
            var b = Date.now(),
                c = this.parent();
            this.markAsModified(b);
            c.markAsModified(b);
            v(t([c, this]));
            a && G();
        }
    };
    p.prototype.outlines = function (a) {
        var b = [];
        if ((a = a ? a.trim().toUpperCase() : null) && 0 < a.length) b = T(a);
        else {
            var c;
            for (c in g.directories)
                if (g.directories.hasOwnProperty(c)) {
                    var d = g.directories[c];
                    var e = !!(
                        (this.m_isHome && !d.m_info.parentUuid) ||
                        (!this.m_isHome &&
                            this.m_info.uuid == d.m_info.parentUuid)
                    );
                    var f =
                        !a ||
                        0 == a.length ||
                        -1 != d.m_info.title.toUpperCase().indexOf(a);
                    e && f && b.push(d);
                }
            for (c in g.outlines)
                g.outlines.hasOwnProperty(c) &&
                    ((d = g.outlines[c]),
                    (e = !!(
                        (this.m_isHome && !d.m_info.parentUuid) ||
                        (!this.m_isHome &&
                            this.m_info.uuid == d.m_info.parentUuid)
                    )),
                    (f =
                        !a ||
                        0 == a.length ||
                        -1 != d.m_info.title.toUpperCase().indexOf(a)),
                    e && f && b.push(d));
            b.sort(I);
        }
        return b;
    };
    p.prototype.topics = function (a) {
        var b = [],
            c;
        for (c in g.topics)
            if (g.topics.hasOwnProperty(c)) {
                var d = g.topics[c];
                d &&
                    d.outlineUuid() == this.m_info.uuid &&
                    ((!a && !d.parentUuid()) ||
                        (a && a.uuid() == d.parentUuid())) &&
                    b.push(d);
            }
        N(b);
        return b;
    };
    p.prototype.sources = function () {
        var a = [],
            b;
        for (b in g.sources)
            if (g.sources.hasOwnProperty(b)) {
                var c = g.sources[b];
                c && c.outlineUuid() == this.m_info.uuid && a.push(c);
            }
        M(a);
        return a;
    };
    p.prototype.deleteOutlines = function (a) {
        var b = [],
            c = [],
            d = [],
            e = [],
            f = [],
            k = Date.now(),
            m = [],
            x = [],
            l;
        for (l = 0; l < a.length; l++) {
            var y = a[l];
            if (y.isDirectory()) {
                var A = P(y.uuid(), !0);
                b = b.concat(A.directoriesUuids);
                c = c.concat(A.outlinesUuids);
            } else (A = Q(y.uuid())), c.push(y.uuid());
            d = d.concat(A.topicsUuids);
            e = e.concat(A.sourcesUuids);
            f = f.concat(A.imagesUuids);
        }
        for (l = 0; l < b.length; l++)
            x.push(g.directories[b[l]]), delete g.directories[b[l]];
        for (l = 0; l < c.length; l++)
            x.push(g.outlines[c[l]]), delete g.outlines[c[l]];
        a = [];
        for (l = 0; l < d.length; l++)
            x.push(g.topics[d[l]]),
                a.push(g.topics[d[l]]),
                delete g.topics[d[l]];
        f = S(a);
        for (l = 0; l < f.length; l++)
            x.push(g.images[f[l]]), delete g.images[f[l]];
        for (l = 0; l < e.length; l++)
            x.push(g.sources[e[l]]), delete g.sources[e[l]];
        this.m_isHome || (m.push(this), this.markAsModified(k));
        v(t(m), t(x, !0));
    };
    p.prototype.createTopic = function (a, b, c) {
        this.m_info.title ||
            (dji.logger.warning(
                "Adding topic to an outline without title: ",
                this.m_info.uuid,
            ),
            this.title("Outline Name"));
        var d = Date.now(),
            e = [this],
            f = this.topics(c);
        if (-1 == b || f.length <= b) b = f.length;
        for (var k = b; k < f.length; k++) {
            var m = f[k];
            m.m_info.location++;
            m.markAsModified(d);
            e.push(m);
        }
        m = new n(
            {
                outlineUuid: this.m_info.uuid,
                location: b,
                body: a,
                parentUuid: c ? c.uuid() : null,
            },
            !0,
        );
        m.m_isSkeleton = !1;
        e.push(m);
        g.topics[m.uuid()] = m;
        this.markAsModified(d);
        v(t(e));
        return m;
    };
    p.prototype.deleteTopic = function (a) {
        if (a && a.outlineUuid() == this.m_info.uuid) {
            var b = Date.now(),
                c = [this],
                d = [],
                e = a.siblings(),
                f = R(a);
            f.unshift(a);
            var k = [];
            var m = {};
            for (var x, l = 0; l < f.length; l++) {
                var y = f[l].sourcesUuids();
                for (var A = 0; A < y.length; A++)
                    (x = y[A]),
                        m.hasOwnProperty(x) ||
                            ((m[x] = !0), k.push(g.sources[x]));
            }
            for (m = 0; m < k.length; m++)
                (y = k[m]),
                    y.boundToOutline() ||
                        this.hasOtherCitingTopics(y, f) ||
                        (delete g.sources[y.uuid()], d.push(y));
            k = S(f);
            for (m = 0; m < k.length; m++)
                (y = g.images[k[m]]), delete g.images[k[m]], d.push(y);
            for (m = a.location() + 1; m < e.length; m++)
                (a = e[m]), a.m_info.location--, a.markAsModified(b), c.push(a);
            for (m = 0; m < f.length; m++)
                d.push(f[m]), delete g.topics[f[m].uuid()];
            this.markAsModified(b);
            v(t(c), t(d, !0));
        }
    };
    p.prototype.createSource = function (a, b, c) {
        this.m_info.title ||
            (dji.logger.warning(
                "Adding source to an outline without title: ",
                this.m_info.uuid,
            ),
            this.title("Untitled"));
        var d = {};
        if (a.id) {
            var e = Object.assign({}, a);
            d.text = {};
            d.text.MLA = sru.citations.generateCition(
                e,
                sru.citations.style.MLA,
                "en-US",
            );
            d.text.APA = sru.citations.generateCition(
                e,
                sru.citations.style.APA,
                "en-US",
            );
            d.text.CHICAGO = sru.citations.generateCition(
                e,
                sru.citations.style.CHICAGO,
                "en-US",
            );
            d.manuallyEdited = !1;
            delete a.id;
            d.cslData = JSON.parse(JSON.stringify(a));
        } else
            (d.cslData = null),
                (d.author = a.authors),
                (d.title = a.title),
                (d.text.MLA = a.citation.MLA),
                (d.text.APA = a.citation.APA),
                (d.text.CHICAGO = a.citation.CHICAGO),
                (d.text.HARVARD = a.citation.HARVARD);
        a = new u(
            {
                outlineUuid: this.m_info.uuid,
                boundToOutline: !c,
                fromHighlight: !!b,
                data: d,
            },
            !0,
        );
        a.m_isSkeleton = !1;
        b = Date.now();
        a: {
            d = a;
            for (f in g.sources)
                if (g.sources.hasOwnProperty(f)) {
                    e = g.sources[f];
                    if (d === e || d.uuid() == e.uuid()) {
                        var f = e;
                        break a;
                    }
                    if (d.outlineUuid() == e.outlineUuid() && e.matches(d)) {
                        f = e;
                        break a;
                    }
                }
            f = null;
        }
        f
            ? f.isEqual(a)
                ? (a = f)
                : (f.data().manuallyEdited || f.update(a.cslData(), !1, !0),
                  (a = f),
                  (f = null))
            : (g.sources[a.uuid()] = a);
        c && c.linkSource(a, !0);
        d = [this];
        this.markAsModified(b);
        f || (d.push(a), a.markAsModified(b));
        c &&
            (d.push(c), c.markAsModified(b), d.push(new C(c.uuid(), a.uuid())));
        v(t(d));
        return a;
    };
    p.prototype.deleteSource = function (a, b) {
        var c = Date.now(),
            d = [this],
            e = [a];
        b &&
            (d.push(b), b.markAsModified(c), e.push(new C(b.uuid(), a.uuid())));
        for (var f in g.topics)
            g.topics.hasOwnProperty(f) &&
                (b = g.topics[f]) &&
                b.outlineUuid() == this.m_info.uuid &&
                b.unlinkSource(a, !0, !0) &&
                (d.push(b),
                b.markAsModified(c),
                e.push(new C(b.uuid(), a.uuid())));
        delete g.sources[a.uuid()];
        this.markAsModified(c);
        v(t(d), t(e, !0));
    };
    p.prototype.hasCitingTopics = function (a) {
        for (var b in g.topics)
            if (g.topics.hasOwnProperty(b)) {
                var c = g.topics[b];
                if (
                    c &&
                    c.outlineUuid() == this.m_info.uuid &&
                    c.hasLinkedSource(a)
                )
                    return !0;
            }
        return !1;
    };
    p.prototype.hasOtherCitingTopics = function (a, b) {
        for (var c in g.topics)
            if (g.topics.hasOwnProperty(c)) {
                var d = g.topics[c];
                if (
                    d &&
                    d.outlineUuid() == this.m_info.uuid &&
                    d.hasLinkedSource(a) &&
                    -1 == b.indexOf(d)
                )
                    return !0;
            }
        return !1;
    };
    D.prototype = Object.create(p.prototype);
    D.prototype.constructor = D;
    F.prototype = Object.create(p.prototype);
    F.prototype.constructor = F;
    F.prototype.title = function () {
        return "Home";
    };
    n.prototype = Object.create(w.prototype);
    n.prototype.constructor = n;
    n.prototype.__info = function () {
        return {
            uuid: this.m_info.uuid,
            outlineUuid: this.m_info.outlineUuid,
            parentUuid: this.m_info.parentUuid,
            location: this.m_info.location,
            body: this.m_info.body,
            creationDate: this.m_info.creationDate,
            modifiedDate: this.m_info.modifiedDate,
        };
    };
    n.prototype.outlineUuid = function () {
        return this.m_info.outlineUuid;
    };
    n.prototype.outline = function () {
        return g.outlines[this.m_info.outlineUuid] || null;
    };
    n.prototype.location = function () {
        return this.m_info.location;
    };
    n.prototype.body = function (a) {
        if (void 0 === a) return this.m_info.body;
        a != this.m_info.body &&
            ((this.m_info.body = a), this.markAsModified(), v(t(this)));
    };
    n.prototype.sourcesUuids = function () {
        return this.m_info.sourcesUuids;
    };
    n.prototype.sources = function () {
        for (var a = [], b = 0; b < this.m_info.sourcesUuids.length; b++) {
            var c = g.sources[this.m_info.sourcesUuids[b]];
            c && a.push(c);
        }
        M(a);
        return a;
    };
    n.prototype.fullBody = function () {
        let a = this.imageElement();
        return a ? a : this.m_info.body;
    };
    n.prototype.bodyImageUuid = function () {
        let a = new DOMParser()
                .parseFromString(
                    "<root>" + this.m_info.body + "</root>",
                    "text/xml",
                )
                .querySelector("img"),
            b = null;
        a && a.hasAttribute("__uuid") && (b = a.getAttribute("__uuid"));
        return b;
    };
    n.prototype.imageElement = function () {
        let a = document.createElement("dji-elem");
        a.innerHTML = this.m_info.body;
        let b = a.querySelector("img");
        if (!b) return null;
        var c = b.getAttribute("__uuid");
        if ((c = h.getImageData(c)))
            b.src =
                "data:image/jpeg;base64," + dji.utils.arrayBufferToBase64(c);
        return a.innerHTML;
    };
    n.prototype.imageUrl = function (a) {
        a = a || this.bodyImageUuid();
        a = h.getImageData(a);
        if (!a) return null;
        a = new Blob([a], {type: "image/jpeg"});
        return URL.createObjectURL(a);
    };
    n.prototype.imageDataToBase64 = function (a) {
        a = a || this.bodyImageUuid();
        return (a = h.getImageData(a))
            ? "data:image/jpeg;base64," + dji.utils.arrayBufferToBase64(a)
            : null;
    };
    n.prototype.__removeLinkedSourcesUuids = function (a) {
        if (a && 0 < a.length)
            for (var b, c = 0; c < a.length; c++)
                (b = this.m_info.sourcesUuids.indexOf(a[c])),
                    -1 != b && this.m_info.sourcesUuids.splice(b, 1);
    };
    n.prototype.linkSource = function (a, b) {
        -1 == this.m_info.sourcesUuids.indexOf(a.uuid()) &&
            (this.m_info.sourcesUuids.push(a.uuid()),
            b ||
                ((a = [this.outline(), this, new C(this.uuid(), a.uuid())]),
                (b = Date.now()),
                this.outline().markAsModified(b),
                this.markAsModified(b),
                v(t(a))));
    };
    n.prototype.unlinkSource = function (a, b, c) {
        var d = this.m_info.sourcesUuids.indexOf(a.uuid());
        if (-1 == d) return !1;
        c = !c;
        this.m_info.sourcesUuids.splice(d, 1);
        b ||
            a.boundToOutline() ||
            ((b = this.outline()),
            b.hasCitingTopics(a) || ((c = !1), b.deleteSource(a, this)));
        c &&
            ((b = [this.outline(), this]),
            (a = [new C(this.uuid(), a.uuid())]),
            (d = Date.now()),
            this.outline().markAsModified(d),
            this.markAsModified(d),
            v(t(b), t(a)));
        return !0;
    };
    n.prototype.hasLinkedSource = function (a) {
        return -1 != this.m_info.sourcesUuids.indexOf(a.uuid());
    };
    n.prototype.hasLinkedSources = function () {
        return 0 < this.m_info.sourcesUuids.length;
    };
    n.prototype.indent = function () {
        if (!(1 > this.m_info.location)) {
            var a = this.outline(),
                b = this.siblings(),
                c = this.m_info.location,
                d = b[this.m_info.location - 1],
                e = d.lastChildLocation() + 1,
                f = Date.now();
            this.m_info.parentUuid = d.m_info.uuid;
            this.m_info.location = e;
            for (d = c + 1; d < b.length; d++)
                b[d].m_info.location--, b[d].markAsModified(f);
            b = [a, this, b.slice(c + 1)];
            a.markAsModified(f);
            this.markAsModified(f);
            v(t(b));
        }
    };
    n.prototype.outdent = function () {
        var a = this.parent();
        if (a) {
            var b = this.outline(),
                c = a ? a.parent() : null,
                d = a.m_info.location + 1,
                e = h.outlineByUuid(this.m_info.outlineUuid).topics(c),
                f = this.siblings(),
                k = this.m_info.location;
            a = Date.now();
            this.m_info.parentUuid = c ? c.m_info.uuid : null;
            this.m_info.location = d;
            for (c = k + 1; c < f.length; c++)
                f[c].m_info.location--, f[c].markAsModified(a);
            for (c = d; c < e.length; c++)
                e[c].m_info.location++, e[c].markAsModified(a);
            c = [b, this, f.slice(k + 1), e.slice(d)];
            b.markAsModified(a);
            this.markAsModified(a);
            v(t(c));
        }
    };
    n.prototype.moveTo = function (a, b) {
        if (b == this || this.hasDescendant(a)) return !1;
        var c = this.outline(),
            d = [c, this],
            e = !!(
                (!a && this.m_info.parentUuid) ||
                (a && this.m_info.parentUuid != a.m_info.uuid)
            ),
            f = b;
        f == a && (f = null);
        b = f ? f.m_info.location + 1 : 0;
        var k = h.outlineByUuid(this.m_info.outlineUuid).topics(a),
            m = this.siblings(),
            x = this.m_info.location,
            l = Date.now();
        !e && f && this.m_info.location < f.m_info.location && b--;
        this.m_info.parentUuid = a ? a.m_info.uuid : null;
        this.m_info.location = b;
        f = e ? m.length : b + 1;
        for (a = x + 1; a < f; a++)
            m[a].m_info.location--, m[a].markAsModified(l), d.push(m[a]);
        if (e)
            for (a = b; a < k.length; a++)
                k[a].m_info.location++, k[a].markAsModified(l), d.push(k[a]);
        else
            for (a = b; a < x; a++)
                k[a].m_info.location++, k[a].markAsModified(l), d.push(k[a]);
        c.markAsModified(l);
        this.markAsModified(l);
        v(t(d));
        return !0;
    };
    n.prototype.siblings = function () {
        var a = [],
            b;
        for (b in g.topics)
            if (g.topics.hasOwnProperty(b)) {
                var c = g.topics[b];
                this.m_info.outlineUuid == c.m_info.outlineUuid &&
                    this.m_info.parentUuid == c.m_info.parentUuid &&
                    a.push(c);
            }
        N(a);
        return a;
    };
    n.prototype.lastChildLocation = function () {
        var a = -1,
            b;
        for (b in g.topics)
            if (g.topics.hasOwnProperty(b)) {
                var c = g.topics[b];
                this.m_info.outlineUuid == c.m_info.outlineUuid &&
                    this.m_info.uuid == c.m_info.parentUuid &&
                    (a = Math.max(a, c.m_info.location));
            }
        return a;
    };
    n.prototype.parent = function () {
        return this.m_info.parentUuid
            ? g.topics[this.m_info.parentUuid] || null
            : null;
    };
    n.prototype.hasDescendant = function (a) {
        if (a === this) return !0;
        for (; a && a.m_info.parentUuid; ) {
            if (a.m_info.parentUuid === this.m_info.uuid) return !0;
            a = g.topics[a.m_info.parentUuid];
        }
        return !1;
    };
    u.prototype = Object.create(w.prototype);
    u.prototype.constructor = u;
    u.prototype.outlineUuid = function () {
        return this.m_info.outlineUuid;
    };
    u.prototype.outline = function () {
        return g.outlines[this.m_info.outlineUuid];
    };
    u.prototype.data = function (a) {};
    u.prototype.boundToOutline = function () {
        return this.m_info.boundToOutline;
    };
    u.prototype.data = function () {
        return this.m_info.data;
    };
    u.prototype.author = function () {
        return this.m_info.data.author;
    };
    u.prototype.cslData = function (a) {
        return a
            ? JSON.parse(JSON.stringify(this.m_info.data.cslData))
            : this.m_info.data.cslData;
    };
    u.prototype.text = function (a) {
        return a ? this.m_info.data.text[a] : this.m_info.data.text;
    };
    u.prototype.matches = function (a) {
        return this.m_info.fromHighlight &&
            a.m_info.fromHighlight &&
            this.m_info.data.cslData.URL === a.m_info.data.cslData.URL
            ? !0
            : !1;
    };
    u.prototype.isEqual = function (a) {
        return a && this.m_info.fromHighlight && a.m_info.fromHighlight
            ? dji.utils.objectsAreEqual(
                  this.m_info.data.cslData,
                  a.m_info.data.cslData,
              )
            : !1;
    };
    u.prototype.update = function (a, b, c) {
        (b && dji.utils.objectsAreEqual(this.m_info.data.cslData, a)) ||
            (a.id || (a.id = "id0"),
            (this.m_info.data.text.MLA = sru.citations.generateCition(
                a,
                "mla",
                "en-US",
            )),
            (this.m_info.data.text.APA = sru.citations.generateCition(
                a,
                "apa",
                "en-US",
            )),
            (this.m_info.data.text.CHICAGO = sru.citations.generateCition(
                a,
                "chicago-nb",
                "en-US",
            )),
            delete a.id,
            (this.m_info.data.cslData = JSON.parse(JSON.stringify(a))),
            (this.m_info.data.manuallyEdited = b),
            c ||
                ((a = this.outline()),
                (b = Date.now()),
                (c = [a, this]),
                a.markAsModified(b),
                this.markAsModified(b),
                v(t(c))));
    };
    C.prototype.__info = function () {
        return {topicUuid: this.m_topicUuid, sourcesUuids: this.m_sourcesUuids};
    };
    B.prototype = Object.create(w.prototype);
    B.prototype.constructor = B;
    B.prototype.checksum = function () {
        return this.m_info.checksum;
    };
    B.prototype.body = function () {
        return this.m_info.body;
    };
})((window.sru.outlinesDataManager = window.sru.outlinesDataManager || {}));
