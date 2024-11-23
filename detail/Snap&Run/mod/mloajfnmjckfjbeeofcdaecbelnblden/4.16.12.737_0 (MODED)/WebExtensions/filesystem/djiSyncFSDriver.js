var SyncFSDriver = (function () {
    function n(a, b, c, e, f, d, k, g) {
        if (FS.isBlkdev(c) || FS.isFIFO(c))
            throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        l.ops_table ||
            (l.ops_table = {
                dir: {
                    node: {
                        getattr: p,
                        setattr: q,
                        lookup: w,
                        mknod: x,
                        rename: y,
                        unlink: z,
                        rmdir: A,
                        readdir: B,
                        symlink: C,
                    },
                    stream: {llseek: v},
                },
                file: {
                    node: {getattr: p, setattr: q},
                    stream: {llseek: v, read: D, write: E, allocate: F},
                },
                link: {node: {getattr: p, setattr: q, readlink: G}, stream: {}},
                chrdev: {
                    node: {getattr: p, setattr: q},
                    stream: FS.chrdev_stream_ops,
                },
            });
        c = FS.createNode(a, b, c, e);
        c.timestamp = d || Date.now();
        c.metadata = f;
        c.cached = k;
        c.vfs = g;
        FS.isDir(c.mode)
            ? ((c.node_ops = l.ops_table.dir.node),
              (c.stream_ops = l.ops_table.dir.stream),
              (c.contents = {}))
            : FS.isFile(c.mode)
              ? (c.metadata ||
                    ((f = {
                        name: c.name,
                        localPath: `${a.metadata.localPath}/${c.name}`,
                        remotePath: `${a.metadata.remotePath}/${c.name}`,
                        timestamp: c.timestamp,
                        size: 0,
                    }),
                    (c.metadata = f)),
                (c.node_ops = l.ops_table.file.node),
                (c.stream_ops = l.ops_table.file.stream),
                (c.usedBytes = f.size),
                (c.contents = null))
              : FS.isLink(c.mode)
                ? ((c.node_ops = l.ops_table.link.node),
                  (c.stream_ops = l.ops_table.link.stream))
                : FS.isChrdev(c.mode) &&
                  ((c.node_ops = l.ops_table.chrdev.node),
                  (c.stream_ops = l.ops_table.chrdev.stream));
        a && (a.contents[b] = c);
        return c;
    }
    function p(a) {
        var b = {};
        b.dev = FS.isChrdev(a.mode) ? a.id : 1;
        b.ino = a.id;
        b.mode = a.mode;
        b.nlink = 1;
        b.uid = 0;
        b.gid = 0;
        b.rdev = a.rdev;
        FS.isDir(a.mode)
            ? (b.size = 4096)
            : FS.isFile(a.mode)
              ? (b.size = a.usedBytes)
              : FS.isLink(a.mode)
                ? (b.size = a.link.length)
                : (b.size = 0);
        b.atime = new Date(a.timestamp);
        b.mtime = new Date(a.timestamp);
        b.ctime = new Date(a.timestamp);
        b.blksize = 4096;
        b.blocks = Math.ceil(b.size / b.blksize);
        return b;
    }
    function q(a, b) {
        void 0 !== b.mode && (a.mode = b.mode);
        void 0 !== b.timestamp && (a.timestamp = b.timestamp);
        void 0 !== b.size && l.resizeFileStorage(a, b.size);
    }
    function w(a, b) {
        throw FS.genericErrors[ERRNO_CODES.ENOENT];
    }
    function x(a, b, c, e) {
        return l.createNode(a, b, c, e);
    }
    function y(a, b, c) {
        if (FS.isDir(a.mode)) {
            try {
                var e = FS.lookupNode(b, c);
            } catch (d) {}
            if (e)
                for (var f in e.contents)
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        delete a.parent.contents[a.name];
        a.name = c;
        b.contents[c] = a;
        a.parent = b;
    }
    function z(a, b) {
        delete a.contents[b];
    }
    function A(a, b) {
        var c = FS.lookupNode(a, b),
            e;
        for (e in c.contents) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        delete a.contents[b];
    }
    function B(a) {
        var b = [".", ".."],
            c;
        for (c in a.contents) a.contents.hasOwnProperty(c) && b.push(c);
        return b;
    }
    function C(a, b, c) {
        a = l.createNode(a, b, 41471, 0);
        a.link = c;
        return a;
    }
    function G(a) {
        if (!FS.isLink(a.mode)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        return a.link;
    }
    function D(a, b, c, e, f) {
        if (isNaN(f) || (a.node.contents && a.node.contents.size <= f))
            return (a.node.contents = null), 0;
        if (!a.node.contents)
            try {
                if (a.node.vfs)
                    a.node.contents = a.node.vfs.readWithMetadata(
                        a.node.metadata,
                    );
                else {
                    let d = u.root.getFile(a.node.metadata.remotePath, {
                        create: !1,
                    });
                    a.node.contents = d.file();
                }
                if (a.node.cached) {
                    const d = H.readAsArrayBuffer(a.node.contents);
                    a.node.blobcache = new Uint8Array(d);
                }
            } catch (d) {
                return console.error(d), 0;
            }
        if (0 === e) return 0;
        try {
            if (a.node.cached) {
                const g = a.node.blobcache.length;
                f + e > g && (e = g - f);
                0 < e && b.set(a.node.blobcache.subarray(f, f + e), c);
                return e;
            }
            let d = a.node.contents.slice(f, f + e),
                k = H.readAsArrayBuffer(d);
            b.set(new Uint8Array(k), c);
            return d.size;
        } catch (d) {
            console.error(d);
        }
        return 0;
    }
    function E(a, b, c, e, f, d) {
        if (!e)
            return (
                a.node.contents &&
                    ((b = u.root
                        .getFile(a.node.metadata.remotePath, {create: !0})
                        .createWriter()),
                    (c = a.node.contents.slice(0, a.node.usedBytes)),
                    (c = new Blob([c], {type: "application/octet-stream"})),
                    b.truncate(0),
                    b.write(c),
                    (a.node.contents = null)),
                0
            );
        a = a.node;
        0 === f && (a.contents = null);
        l.expandFileStorage(a, f + e);
        if (0 < e) {
            if (b.subarray) a.contents.set(b.subarray(c, c + e), f);
            else for (d = 0; d < e; d++) a.contents[f + d] = b[c + d];
            a.usedBytes = Math.max(a.usedBytes, f + e);
        }
        return e;
    }
    function v(a, b, c) {
        1 === c
            ? (b += a.position)
            : 2 === c && FS.isFile(a.node.mode) && (b += a.node.usedBytes);
        if (0 > b) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        return b;
    }
    function F(a, b, c) {
        l.expandFileStorage(a.node, b + c);
        a.node.usedBytes = Math.max(a.node.usedBytes, b + c);
    }
    function I(a) {
        let b = [a ? u.root.getDirectory(a, {create: !1}) : u.root],
            c = [],
            e = {},
            f = {};
        for (let h = 0; h < b.length; h++) {
            var d = b[h];
            let m = d.createReader();
            var k = [];
            let r = d.getMetadata();
            k = d.fullPath.replace(a, "");
            0 >= k.length && (k = "/");
            let t = null;
            var g = null;
            let J = [];
            t = {
                id: d.fullPath,
                metadata: {
                    name: d.name,
                    localPath: k,
                    remotePath: d.fullPath,
                    timestamp: r.modificationTime.getTime(),
                    size: r.size,
                },
                files: J,
                node: null,
            };
            c.push(t);
            e[t.id] = t;
            do
                for (k = m.readEntries(), d = 0; d < k.length; d++)
                    (g = k[d]),
                        g.isDirectory && b.push(g),
                        g.isFile &&
                            ((r = g.getMetadata()),
                            (g = {
                                id: g.fullPath,
                                metadata: {
                                    name: g.name,
                                    localPath: g.fullPath.replace(a, ""),
                                    remotePath: g.fullPath,
                                    timestamp: r.modificationTime.getTime(),
                                    size: r.size,
                                },
                                parentId: t.id,
                                node: null,
                            }),
                            J.push(g),
                            (f[g.id] = g));
            while (0 < k.length);
        }
        c.sort(function (h, m) {
            return h.localPath < m.localPath
                ? -1
                : h.localPath > m.localPath
                  ? 1
                  : 0;
        });
        return {dirList: c, dirMap: e, fileMap: f};
    }
    let l = null;
    const u = webkitRequestFileSystemSync(PERSISTENT, 268435456),
        H = new FileReaderSync(),
        K = {};
    (function () {
        FS.extensions = FS.extensions || {};
        FS.extensions.mapSyncFS = function (a) {
            FS.mkdirTree(a);
            FS.mount(l, {syncFSPath: a}, a);
        };
        FS.extensions.mapVfsContainer = function (a, b, c) {
            FS.mkdirTree(a);
            FS.mount(l, {vfsContainer: b, cached: c}, a);
        };
        FS.extensions.syncAsyncFS = function (a) {
            var b = I(a).fileMap;
            a = K[a];
            let c = a.fileMap,
                e = {};
            for (var f in b)
                b.hasOwnProperty(f) && (e[f] = {local: null, remote: b[f]});
            for (let d in c)
                c.hasOwnProperty(d) &&
                    (e.hasOwnProperty(d)
                        ? (e[d].local = c[d])
                        : (e[d] = {local: c[d], remote: null}));
            for (let d in e)
                e.hasOwnProperty(d) &&
                    ((b = e[d]),
                    !((b.local && b.remote) || b.local) &&
                        b.remote &&
                        ((b = b.remote), (f = a.dirMap[b.parentId]))) &&
                    (f.files.push(b),
                    (a.fileMap[b.id] = b),
                    (b.node = n(
                        f.node,
                        b.metadata.name,
                        33279,
                        0,
                        b.metadata,
                        b.metadata.timestamp,
                    )));
        };
    })();
    return (l = {
        ops_table: null,
        mount: function (a) {
            const b = !(!a.opts.hasOwnProperty("cached") || !a.opts.cached);
            if (a.opts.hasOwnProperty("syncFSPath")) {
                var c = I(a.opts.syncFSPath);
                var e = c.dirList;
                var f = e;
                var d = {},
                    k = n(
                        null,
                        "/",
                        16895,
                        0,
                        f[0].metadata,
                        f[0].metadata.timestamp,
                    );
                d["/"] = d[""] = k;
                for (var g = 0; g < f.length; g++) {
                    var h = f[g];
                    if ("/" === h.metadata.localPath) h.node = k;
                    else {
                        var m = h.metadata.localPath.split("/");
                        m = `${m.slice(0, m.length - 1).join("/")}`;
                        h.node = n(
                            d[m] || k,
                            h.metadata.name,
                            16895,
                            0,
                            h.metadata,
                            h.metadata.timestamp,
                        );
                        d[h.metadata.localPath] = h.node;
                    }
                }
                f = k;
                for (d = 0; d < e.length; d++)
                    for (k = e[d], g = k.files, h = 0; h < g.length; h++)
                        (m = g[h]),
                            (m.node = n(
                                k.node,
                                m.metadata.name,
                                33279,
                                0,
                                m.metadata,
                                m.metadata.timestamp,
                                b,
                            ));
                K[a.opts.syncFSPath] = c;
                return f;
            }
            if (a.opts.hasOwnProperty("vfsContainer")) {
                c = a = new VfsContainer(a.opts.vfsContainer);
                e = {};
                f = c.dirs;
                d = n(null, "/", 16895, 0, {}, c.timestamp, c);
                e["/"] = e[""] = d;
                for (k = 0; k < f.length; k++)
                    (g = f[k]),
                        "" === g.path
                            ? (g.node = d)
                            : ((h = g.path.split("/")),
                              (h = `${h.slice(0, h.length - 1).join("/")}`),
                              (g.node = n(
                                  e[h] || d,
                                  g.name,
                                  16895,
                                  0,
                                  g.metadata,
                                  g.metadata.timestamp,
                                  c,
                              )),
                              (e[g.path] = g.node));
                c = d;
                e = a.dirs;
                for (f = 0; f < e.length; f++)
                    for (d = e[f], k = d.files, g = 0; g < k.length; g++)
                        (h = k[g]),
                            (h.node = n(
                                d.node,
                                h.name,
                                33279,
                                0,
                                h.metadata,
                                h.metadata.timestamp,
                                b,
                                a,
                            ));
                return c;
            }
            return null;
        },
        createNode: n,
        getFileDataAsRegularArray: function (a) {
            if (a.contents && a.contents.subarray) {
                for (var b = [], c = 0; c < a.usedBytes; ++c)
                    b.push(a.contents[c]);
                return b;
            }
            return a.contents;
        },
        getFileDataAsTypedArray: function (a) {
            return a.contents
                ? a.contents.subarray
                    ? a.contents.subarray(0, a.usedBytes)
                    : new Uint8Array(a.contents)
                : new Uint8Array();
        },
        expandFileStorage: function (a, b) {
            var c = a.contents ? a.contents.length : 0;
            b = 4096 * Math.ceil(b / 4096);
            b <= c ||
                ((c = new Uint8Array(b)),
                a.contents && 0 < a.usedBytes && c.set(a.contents, 0),
                c.fill(0, a.usedBytes),
                (a.contents = c),
                (a.usedBytes = Math.min(a.usedBytes, b)));
        },
        resizeFileStorage: function (a, b) {
            if (b !== a.usedBytes) {
                var c = 4096 * Math.ceil(b / 4096);
                c !== (a.contents ? a.contents.length : 0) &&
                    ((c = new Uint8Array(c)),
                    a.contents && 0 < a.usedBytes && c.set(a.contents, 0),
                    (a.contents = c));
                a.contents && a.contents.fill(0, b);
                a.usedBytes = b;
            }
        },
        node_ops: {
            getattr: p,
            setattr: q,
            lookup: w,
            mknod: x,
            rename: y,
            unlink: z,
            rmdir: A,
            readdir: B,
            symlink: C,
            readlink: G,
        },
        stream_ops: {read: D, write: E, llseek: v, allocate: F},
    });
})();
