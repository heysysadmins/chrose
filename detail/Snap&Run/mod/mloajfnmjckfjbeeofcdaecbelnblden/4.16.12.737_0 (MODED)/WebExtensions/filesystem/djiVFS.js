var VfsContainer = (function () {
    const k = 120 === new Uint8Array(new Uint32Array([305419896]).buffer)[0];
    new Uint8Array(new Uint32Array([305419896]).buffer);
    const h = "function" === typeof FileReaderSync;
    class p {
        constructor() {
            this.m_fileReader = h ? new FileReaderSync() : new FileReader();
        }
        readAsArrayBuffer(a) {
            if (!h) throw Error("Sync FS is not available!");
            return this.m_fileReader.readAsArrayBuffer(a);
        }
        readAsText(a, b) {
            if (!h) throw Error("Sync FS is not available!");
            return this.m_fileReader.readAsText(a, b);
        }
        async readAsArrayBufferAsync(a) {
            if (h) return this.m_fileReader.readAsArrayBuffer(a);
            const b = this;
            return new Promise((c, d) => b.__readAsArrayBuffer(a, c, d));
        }
        async readAsTextAsync(a, b) {
            if (h) return this.m_fileReader.readAsText(a, b);
            const c = this;
            return new Promise((d, e) => c.__readAsText(a, b, d, e));
        }
        __readAsArrayBuffer(a, b, c) {
            const d = this.m_fileReader;
            d.onloadend = function () {
                this.onerror = this.onloadend = null;
                b(this.result);
            };
            d.onerror = function (e) {
                this.onerror = this.onloadend = null;
                c(e);
            };
            d.readAsArrayBuffer(a);
        }
        __readAsText(a, b, c, d) {
            const e = this.m_fileReader;
            e.onloadend = function () {
                this.onerror = this.onloadend = null;
                c(this.result);
            };
            e.onerror = function (f) {
                this.onerror = this.onloadend = null;
                d(f);
            };
            e.readAsText(a, b);
        }
    }
    class l {
        constructor(a) {
            this.m_fileReader = new p();
            this.m_container = a;
            this.m_timestamp = Date.now();
            this.m_content = this.m_header = this.m_priv = null;
        }
        get timestamp() {
            return this.m_timestamp;
        }
        get header() {
            return this.m_header;
        }
        get dirs() {
            return this.m_content.dirs;
        }
        get files() {
            return this.m_content.files;
        }
        dir(a) {
            a = a.split("/").slice(0, -1).join("/");
            return this.m_content.dirsMap.get(a) || null;
        }
        getDirectoryFiles(a) {
            return (a = this.m_content.dirsMap.get(a))
                ? a.files.map((b) => b.path)
                : [];
        }
        __buildContent() {
            var a = this.m_header.content.dirs;
            let b = this.m_header.content.files,
                c = new Map(),
                d = new Map(),
                e = new Map();
            for (var f = 0; f < a.length; f++) {
                var g = a[f];
                g.files = [];
                c.set(g.id, g);
                d.set(g.path, g);
            }
            for (a = 0; a < b.length; a++)
                (f = b[a]),
                    (g = c.get(f.parentId)),
                    e.set(f.path, f),
                    g && g.files.push(f);
            this.m_content = Object.freeze({
                dirs: this.m_header.content.dirs,
                files: this.m_header.content.files,
                dirsMap: d,
                filesMap: e,
            });
        }
        readWithMetadata(a, b, c) {
            b = Math.max(0, void 0 === b ? 0 : b);
            c = void 0 === c ? a.size : c;
            c = Math.max(0, Math.min(c, a.size - b));
            b += this.m_priv.cso + a.offset;
            return this.m_container.slice(b, b + c);
        }
        readFile(a) {
            return (a = this.m_content.filesMap.get(a))
                ? this.readWithMetadata(a.metadata, 0)
                : null;
        }
    }
    class m extends l {
        static fromContainer(a) {
            return new m(a);
        }
        constructor(a) {
            super(a);
            this.__init();
        }
        __init() {
            this.__readPriv();
            this.__readHeader();
            this.__buildContent();
        }
        __readPriv() {
            this.m_priv = Object.freeze({
                v: this.readUInt32LE(0),
                hso: this.readUInt32LE(4),
                hl: this.readUInt32LE(8),
                cso: this.readUInt32LE(12),
            });
        }
        __readHeader() {
            let a = this.readJSON(this.m_priv.hso, this.m_priv.hl);
            this.m_header = Object.freeze(a);
        }
        readUInt32LE(a) {
            a = this.m_fileReader.readAsArrayBuffer(
                this.m_container.slice(a, a + 4),
            );
            return k
                ? new Uint32Array(a)[0]
                : new Uint32Array(
                      new Uint8Array([...new Uint8Array(a).reverse()]).buffer,
                  )[0];
        }
        readText(a, b, c) {
            return this.m_fileReader.readAsText(
                this.m_container.slice(a, a + b),
                c || "UTF-8",
            );
        }
        readJSON(a, b, c) {
            a = this.readText(a, b, c);
            return JSON.parse(a);
        }
        readFileAsText(a, b) {
            return (a = this.readFile(a))
                ? this.m_fileReader.readAsText(a, b || "UTF-8")
                : null;
        }
        readFileAsJSON(a, b) {
            a = this.readFileAsText(a, b);
            return JSON.parse(a);
        }
    }
    class n extends l {
        static async fromContainerAsync(a) {
            a = new n(a);
            await a.__initAsync();
            return a;
        }
        constructor(a) {
            super(a);
        }
        async __initAsync() {
            await this.__readPrivAsync();
            await this.__readHeaderAsync();
            this.__buildContent();
        }
        async __readPrivAsync() {
            let a = await this.readUInt32LEAsync(0),
                b = await this.readUInt32LEAsync(4),
                c = await this.readUInt32LEAsync(8),
                d = await this.readUInt32LEAsync(12);
            this.m_priv = Object.freeze({v: a, hso: b, hl: c, cso: d});
        }
        async __readHeaderAsync() {
            let a = await this.readJSONAsync(this.m_priv.hso, this.m_priv.hl);
            this.m_header = Object.freeze(a);
        }
        async readUInt32LEAsync(a) {
            a = await this.m_fileReader.readAsArrayBufferAsync(
                this.m_container.slice(a, a + 4),
            );
            return k
                ? new Uint32Array(a)[0]
                : new Uint32Array(
                      new Uint8Array([...new Uint8Array(a).reverse()]).buffer,
                  )[0];
        }
        async readTextAsync(a, b, c) {
            return this.m_fileReader.readAsTextAsync(
                this.m_container.slice(a, a + b),
                c || "UTF-8",
            );
        }
        async readJSONAsync(a, b, c) {
            a = await this.readTextAsync(a, b, c);
            return JSON.parse(a);
        }
        async readFileAsTextAsync(a, b) {
            return (a = this.readFile(a))
                ? this.m_fileReader.readAsTextAsync(a, b || "UTF-8")
                : null;
        }
        async readFileAsJSONAsync(a, b) {
            a = await this.readFileAsTextAsync(a, b);
            return JSON.parse(a);
        }
    }
    return h ? m : n;
})();
