class DjiWasmWorkerProxy {
    constructor(a) {
        this.m_options = {
            url: a.url,
            appDir: a.appDir,
            memThreshold: a.memThreshold || 100663296,
            idleThreshold: a.idleThreshold || 18e4,
        };
        this.m_idleTimeout = this.m_worker = this.m_config = null;
        this.m_eventTarget = new EventTarget();
        this.m_commands = {
            load: "com.donjohnston.cowriter.worker.load",
            initialize: "com.donjohnston.cowriter.worker.initialize",
        };
        this.m_initPromise = null;
        this.m_isBusy = 0;
        this.__setup();
    }
    get isBusy() {
        return 0 < this.m_isBusy;
    }
    configure(a, c) {
        this.m_config = c ? a : JSON.parse(JSON.stringify(a));
    }
    async initAsync() {
        this.m_initPromise ||
            (this.m_initPromise = new Promise((a, c) => {
                this.__init(a, c);
            }));
        return this.m_initPromise;
    }
    terminate() {
        this.m_isBusy = 0;
        this.m_initPromise = null;
        this.__terminateWorker();
        this.__clearIdleTimeout();
    }
    __terminateWorker() {
        this.m_worker &&
            (this.m_worker.removeEventListener(
                "message",
                this.__onMessageProxy,
            ),
            this.m_worker.removeEventListener("error", this.__onMessageProxy),
            this.m_worker.terminate(),
            (this.m_worker = null));
    }
    __createIdleTimeout() {
        null !== this.m_initPromise &&
            (this.__clearIdleTimeout(),
            (this.m_idleTimeout = setTimeout(
                () => this.__onIdle(),
                this.m_options.idleThreshold,
            )));
    }
    __clearIdleTimeout() {
        this.m_idleTimeout &&
            (clearTimeout(this.m_idleTimeout), (this.m_idleTimeout = null));
    }
    __refreshIdleTimeout() {
        this.__clearIdleTimeout();
        this.__createIdleTimeout();
    }
    on(a, c) {
        this.m_eventTarget.addEventListener(a, c);
    }
    __setup() {
        const a = this;
        this.__onMessageProxy = function (c) {
            a.__onMessage(c);
        };
        this.__onErrorProxy = function (c) {
            a.__onError(c);
        };
    }
    async __init(a, c) {
        try {
            let b = null;
            this.m_worker = new Worker(this.m_options.url);
            this.m_worker.__pending = !0;
            b = await this.__waitForCallbackAsync(
                null,
                "com.donjohnston.cowriter.worker.ready",
            );
            if (b.error) throw Error(b.error);
            b = await this.__executeCommandAsync(null, this.m_commands.load, {
                appDir: this.m_options.appDir,
            });
            if (b.error) throw Error(b.error);
            if (
                this.m_config &&
                ((b = await this.__executeCommandAsync(
                    null,
                    this.m_commands.initialize,
                    this.m_config,
                )),
                b.error)
            )
                throw Error(b.error);
            this.m_worker.addEventListener("message", this.__onMessageProxy);
            this.m_worker.addEventListener("error", this.__onMessageProxy);
            this.__createIdleTimeout();
            a("ready");
        } catch (b) {
            this.terminate(), c(b);
        }
    }
    __onMessage(a) {}
    __onError(a) {}
    __onIdle() {
        dji.logger.warning(
            `Worker idle (threshold: ${this.m_options.idleThreshold})`,
        );
        this.m_idleTimeout = null;
        this.terminate();
    }
    __executeCommandAsync(a, c, b, g) {
        const d = this;
        return new Promise(function (e, f) {
            d.__executeCommand(a, c, b, g, e, f);
        });
    }
    __executeCommand(a, c, b, g, d, e) {
        this.__refreshIdleTimeout();
        if (d && !(d instanceof Function))
            throw Error(
                "Invalid arguments: successCallback is not a function!",
            );
        a = a || this.m_worker;
        g = g || {};
        if (!a) return e(Error("Worker not running!"));
        var f = (this.__executeCommand.session =
            (this.__executeCommand.session || 0) + 1);
        f = d ? `com.donjohnston.cwu.wasm.session.${f}` : void 0;
        c = {
            message: c,
            params: b,
            options: {
                wantDefaultCallbackMessage: g.wantDefaultCallbackMessage
                    ? !0
                    : void 0,
                callbackMessage: f,
            },
        };
        this.__watchForCallback(a, f, d, e);
        a.postMessage(c);
    }
    async __waitForCallbackAsync(a, c) {
        const b = this;
        return new Promise(function (g, d) {
            b.__watchForCallback(a, c, g, d);
        });
    }
    __watchForCallback(a, c, b, g) {
        if (b && !(b instanceof Function))
            throw Error(
                "Invalid arguments: successCallback is not a function!",
            );
        let d = void 0,
            e = void 0;
        a = a || this.m_worker;
        const f = this;
        b &&
            ((d = function (k) {
                f.__refreshIdleTimeout();
                let h = k.data;
                if (h && h.message === c) {
                    k.preventDefault();
                    k.stopPropagation();
                    e &&
                        (a.removeEventListener("error", e, !0),
                        a.removeEventListener("crash", e, !0));
                    a.removeEventListener("message", d, !0);
                    try {
                        b(h.params);
                    } catch (l) {
                        dji.logger.error(l);
                    } finally {
                        h.hasOwnProperty("stats") &&
                            h.stats &&
                            h.stats.hasOwnProperty("memory") &&
                            f.__isMemoryThresholdReached(h.stats.memory) &&
                            (dji.logger.warning(
                                `Reached memory threshold: ${f.m_options.memThreshold}, ${h.stats.memory}`,
                            ),
                            f.terminate());
                    }
                }
            }),
            a.addEventListener("message", d, !0));
        g &&
            ((e = function (k) {
                f.__refreshIdleTimeout();
                a.removeEventListener("error", e, !0);
                a.removeEventListener("crash", e, !0);
                b && a.removeEventListener("message", d, !0);
                try {
                    g(k);
                } catch (h) {
                    dji.logger.error(h);
                }
            }),
            a.addEventListener("error", e, !0),
            a.addEventListener("crash", e, !0));
    }
    __isMemoryThresholdReached(a) {
        return (
            void 0 !== a &&
            !isNaN(a) &&
            0 < a &&
            this.m_options.memThreshold < a
        );
    }
}
class SREWordDefinitionWorkerProxy extends DjiWasmWorkerProxy {
    constructor(a) {
        super(a);
        this.m_messages = {searchWord: "com.donjohnston.sr.worker.searchWord"};
    }
    async searchWord(a, c) {
        let b = void 0;
        this.m_isBusy++;
        try {
            b = await this.__executeCommandAsync(
                null,
                this.m_messages.searchWord,
                {timestamp: a, text: c},
                null,
            );
        } finally {
            this.m_isBusy--;
        }
        return b;
    }
}
class SREOcrWorkerProxy extends DjiWasmWorkerProxy {
    constructor(a) {
        super(a);
        this.m_messages = {ocr: "com.donjohnston.sr.worker.ocr"};
    }
    async ocrAsync(a, c) {
        let b = void 0;
        this.m_isBusy++;
        try {
            b = await this.__executeCommandAsync(
                null,
                this.m_messages.ocr,
                {timestamp: a, language: "eng", imageBytes: c},
                null,
            );
        } finally {
            this.m_isBusy--;
        }
        return b;
    }
}
