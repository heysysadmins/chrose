globalThis.dji = globalThis.dji || {};
globalThis.dji.Timer = class {
    constructor(c, a, b, e) {
        const d = this;
        b = b || {};
        this.m_this = c;
        this.m_handler = a;
        this.m_userData = e;
        this.m_timer = null;
        this.m_options = {
            timeout: isNaN(b.timeout) ? 0 : b.timeout,
            singleShot: b.hasOwnProperty("singleShot") ? !!b.singleShot : !0,
        };
        this.m_internalHandler = function () {
            d.m_options.singleShot && (d.m_timer = null);
            d.m_handler.call(d.m_this, ...arguments);
        };
    }
    set userData(c) {
        this.m_userData = c;
    }
    get userData() {
        return this.m_userData;
    }
    trigger(c) {
        this.stop();
        let a = [this.m_internalHandler, ...arguments];
        isNaN(a[1]) && (a[1] = this.m_options.timeout);
        this.m_timer = this.m_options.singleShot
            ? setTimeout(...a)
            : setInterval(...a);
    }
    stop() {
        this.m_timer &&
            (this.m_options.singleShot
                ? clearTimeout(this.m_timer)
                : clearInterval(this.m_timer),
            (this.m_timer = null));
    }
};
