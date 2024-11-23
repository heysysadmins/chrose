!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
        ? t(exports)
        : "function" == typeof define && define.amd
          ? define(["exports"], t)
          : t(
                ((e =
                    "undefined" != typeof globalThis
                        ? globalThis
                        : e || self).__ChromeAnalyticsGA4 = {}),
            );
})(this, function (e) {
    "use strict";
    class t {
        constructor() {
            (this.f0 = (e) => t.ROTR(2, e) ^ t.ROTR(13, e) ^ t.ROTR(22, e)),
                (this.f1 = (e) => t.ROTR(6, e) ^ t.ROTR(11, e) ^ t.ROTR(25, e)),
                (this.g0 = (e) => t.ROTR(7, e) ^ t.ROTR(18, e) ^ (e >>> 3)),
                (this.g1 = (e) => t.ROTR(17, e) ^ t.ROTR(19, e) ^ (e >>> 10)),
                (this.Ch = (e, t, s) => (e & t) ^ (~e & s)),
                (this.Maj = (e, t, s) => (e & t) ^ (e & s) ^ (t & s));
        }
        hash(e) {
            e = unescape(encodeURIComponent(e));
            const s = [
                    1116352408, 1899447441, 3049323471, 3921009573, 961987163,
                    1508970993, 2453635748, 2870763221, 3624381080, 310598401,
                    607225278, 1426881987, 1925078388, 2162078206, 2614888103,
                    3248222580, 3835390401, 4022224774, 264347078, 604807628,
                    770255983, 1249150122, 1555081692, 1996064986, 2554220882,
                    2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
                    113926993, 338241895, 666307205, 773529912, 1294757372,
                    1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
                    2730485921, 2820302411, 3259730800, 3345764771, 3516065817,
                    3600352804, 4094571909, 275423344, 430227734, 506948616,
                    659060556, 883997877, 958139571, 1322822218, 1537002063,
                    1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
                    2428436474, 2756734187, 3204031479, 3329325298,
                ],
                i = [
                    1779033703, 3144134277, 1013904242, 2773480762, 1359893119,
                    2600822924, 528734635, 1541459225,
                ],
                n = (e += String.fromCharCode(128)).length / 4 + 2,
                r = Math.ceil(n / 16),
                o = new Array(r);
            for (let t = 0; t < r; t += 1) {
                o[t] = new Array(16);
                for (let s = 0; s < 16; s += 1)
                    o[t][s] =
                        (e.charCodeAt(64 * t + 4 * s) << 24) |
                        (e.charCodeAt(64 * t + 4 * s + 1) << 16) |
                        (e.charCodeAt(64 * t + 4 * s + 2) << 8) |
                        e.charCodeAt(64 * t + 4 * s + 3);
            }
            (o[r - 1][14] = (8 * (e.length - 1)) / 2 ** 32),
                (o[r - 1][14] = Math.floor(o[r - 1][14])),
                (o[r - 1][15] = (8 * (e.length - 1)) & 4294967295);
            const a = new Array(64);
            let c, h, m, u, l, d, g, p;
            for (let e = 0; e < r; e += 1) {
                for (let t = 0; t < 16; t += 1) a[t] = o[e][t];
                for (let e = 16; e < 64; e += 1)
                    a[e] =
                        (this.g1(a[e - 2]) +
                            a[e - 7] +
                            this.g0(a[e - 15]) +
                            a[e - 16]) &
                        4294967295;
                [c, h, m, u, l, d, g, p] = i;
                for (let e = 0; e < 64; e += 1) {
                    const t = p + this.f1(l) + this.Ch(l, d, g) + s[e] + a[e],
                        i = this.f0(c) + this.Maj(c, h, m);
                    (p = g),
                        (g = d),
                        (d = l),
                        (l = (u + t) & 4294967295),
                        (u = m),
                        (m = h),
                        (h = c),
                        (c = (t + i) & 4294967295);
                }
                (i[0] = (i[0] + c) & 4294967295),
                    (i[1] = (i[1] + h) & 4294967295),
                    (i[2] = (i[2] + m) & 4294967295),
                    (i[3] = (i[3] + u) & 4294967295),
                    (i[4] = (i[4] + l) & 4294967295),
                    (i[5] = (i[5] + d) & 4294967295),
                    (i[6] = (i[6] + g) & 4294967295),
                    (i[7] = (i[7] + p) & 4294967295);
            }
            return (
                t.toHexStr(i[0]) +
                t.toHexStr(i[1]) +
                t.toHexStr(i[2]) +
                t.toHexStr(i[3]) +
                t.toHexStr(i[4]) +
                t.toHexStr(i[5]) +
                t.toHexStr(i[6]) +
                t.toHexStr(i[7])
            );
        }
        static ROTR(e, t) {
            return (t >>> e) | (t << (32 - e));
        }
        static toHexStr(e) {
            let t,
                s = "";
            for (let i = 7; i >= 0; i -= 1)
                (t = (e >>> (4 * i)) & 15), (s += t.toString(16));
            return s;
        }
    }
    class s {
        constructor(
            e,
            t = "",
            s = "",
            i = "",
            n = "",
            r = "Unknown",
            o = "",
            a = "",
        ) {
            (this.mDomain = ""),
                (this.mProductCode = ""),
                (this.mLicenseType = ""),
                (this.mLicenceName = ""),
                (this.mLicenseStatus = "Unknown"),
                (this.mLicenceStartDate = ""),
                (this.mLicenseGuid = ""),
                (this.mUserId = e),
                (this.mDomain = t),
                (this.mProductCode = s),
                (this.mLicenseType = i),
                (this.mLicenceName = n),
                (this.mLicenseStatus = r),
                (this.mLicenceStartDate = o),
                (this.mLicenseGuid = a);
        }
        static fromUserEmail(e) {
            if (!e || 0 === e.length) return null;
            const i = e.split("@");
            if (i.length < 1 || i.length > 2) return null;
            let n = new t().hash(i[0]);
            return 2 === i.length && (n = `${n}@${i[1]}`), new s(n);
        }
        get userId() {
            return this.mUserId;
        }
        get domain() {
            return this.mDomain;
        }
        set domain(e) {
            this.mDomain = e;
        }
        get productCode() {
            return this.mProductCode;
        }
        set productCode(e) {
            this.mProductCode = e;
        }
        get licenseType() {
            return this.mLicenseType;
        }
        set licenseType(e) {
            this.mLicenseType = e;
        }
        get licenseName() {
            return this.mLicenceName;
        }
        set licenseName(e) {
            this.mLicenceName = e;
        }
        get licenseStatus() {
            return this.mLicenseStatus;
        }
        set licenseStatus(e) {
            this.mLicenseStatus = e;
        }
        get licenseStartDate() {
            return this.mLicenceStartDate;
        }
        set licenseStartDate(e) {
            this.mLicenceStartDate = e;
        }
        get licenseGuid() {
            return this.mLicenseGuid;
        }
        set licenseGuid(e) {
            this.mLicenseGuid = e;
        }
    }
    var i;
    !(function (e) {
        (e.CLIENT_ID = "client_id"),
            (e.SESSION_ID = "session_id"),
            (e.DOMAIN_LICENSE = "domain_license"),
            (e.PAYLOADS = "analytics_payloads");
    })(i || (i = {}));
    class n {
        constructor() {
            this.mDomainLicense = n.defaultDomainLicense();
        }
        getDomainLicense() {
            return this.mDomainLicense;
        }
        setDomainLicense(e) {
            this.mDomainLicense = e;
        }
        async getUserId() {
            return this.mDomainLicense ? this.mDomainLicense.userId : null;
        }
        static defaultDomainLicense() {
            return new s("", "", "");
        }
    }
    class r {
        isValid() {
            if (
                !this.events ||
                0 === this.events.length ||
                this.events.length > 25
            )
                return !1;
            for (let e = 0; e < this.events.length; e += 1)
                if (!this.events[e].isValid()) return !1;
            return !(JSON.stringify(this).length > 13e4);
        }
        toJSON() {
            return {
                user_id: this.userId,
                client_id: this.clientId,
                user_properties: this.userProperties,
                events: this.events,
            };
        }
    }
    class o {
        constructor() {
            (this.mTasks = []), (this.mBusy = !1);
        }
        enqueueTask(e) {
            this.mTasks.push(e), this.next();
        }
        async next() {
            if (this.mBusy || 0 === this.mTasks.length) return;
            this.mBusy = !0;
            const e = this.mTasks.shift();
            try {
                e && (await e());
            } catch (e) {
                console.error(e);
            }
            (this.mBusy = !1), this.next();
        }
    }
    function a() {
        const e = new Date().getTimezoneOffset(),
            t = Math.floor(Math.abs(e) / 60),
            s = Math.abs(e) % 60;
        return `UTC${e > 0 ? "-" : "+"}${t}:${s < 10 ? "0" : ""}${s}`;
    }
    function c() {
        return Math.floor(new Date().getTime() / 1e3);
    }
    function h(e) {
        try {
            const t = new URL(e),
                s =
                    t.host.match(/word-edit\.officeapps\.live\.com$/) &&
                    t.pathname.match(/^\/we\/wordeditorframe\.aspx/),
                i = !(
                    "docs.google.com" !== t.host ||
                    !t.pathname.match(/^(\/a\/[^/]+)?\/document\/(d|u)\//i)
                ),
                n = !(
                    "docs.google.com" !== t.host ||
                    !t.pathname.match(/^(\/a\/[^/]+)?\/presentation\/d\//i)
                );
            return s
                ? "Microsoft Word"
                : i
                  ? "Google Docs"
                  : n
                    ? "Google Slides"
                    : "Page";
        } catch (e) {
            throw new Error(
                `Error processing the URL string ${JSON.stringify(e)}`,
            );
        }
    }
    class m {
        constructor(e, t, s) {
            (this.mEndpoint = null),
                (this.mDebugEnabled = !0),
                (this.mGoogleEndpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${e}&api_secret=${t}`),
                (this.mGoogleDebugEndpoint = `https://www.google-analytics.com/debug/mp/collect?measurement_id=${e}&api_secret=${t}`),
                (this.mStorage = s),
                (this.mTaskManager = new o());
        }
        get storage() {
            return this.mStorage;
        }
        async getPayloads() {
            if (!this.mPayloads) {
                const e = await this.mStorage.getPayloads();
                this.mPayloads = e || [];
            }
            return this.mPayloads;
        }
        setDomainLicense(e) {
            this.storage.setDomainLicense(e);
        }
        async pushEvent(e, t) {
            if (!e.isValid())
                throw new Error(
                    `Invalid event for analytics! ${JSON.stringify(e)}`,
                );
            (e.session_id = Number.parseInt(
                await this.storage.getSessionId(!!t),
                10,
            )),
                (e.session_time = c() - e.session_id),
                this.mTaskManager.enqueueTask(async () => {
                    const t = await this.getPayloadFromEvents([e]);
                    this.mPayloadsPromise ||
                        (this.mPayloadsPromise = this.getPayloads()),
                        (await this.mPayloadsPromise).push(t),
                        await this.postPayloads();
                });
        }
        setDebugEnabled(e) {
            this.mDebugEnabled = e;
        }
        set endPoint(e) {
            this.mEndpoint = e;
        }
        get endPoint() {
            return this.mEndpoint
                ? this.mEndpoint
                : this.mDebugEnabled
                  ? this.mGoogleDebugEndpoint
                  : this.mGoogleEndpoint;
        }
        async postPayloads() {
            if (!this.mPayloads || this.mPayloads.length <= 0)
                return this.mStorage.setPayloads([]), !1;
            let e = !0;
            for (; this.mPayloads.length > 0 && e; )
                e = await this.postNextPayload();
            return 0 === this.mPayloads.length;
        }
        async postNextPayload() {
            if (!this.mPayloads || this.mPayloads.length <= 0)
                return this.mStorage.setPayloads([]), !1;
            const e = this.mPayloads.shift();
            if (!e) return !1;
            let t = !1;
            try {
                t = await this.postPayload(e);
            } catch {
                t = !1;
            }
            return (
                t || this.mPayloads.unshift(e),
                this.mStorage.setPayloads(this.mPayloads),
                t
            );
        }
        async postPayload(e) {
            const t = JSON.stringify(e);
            if (!e.isValid())
                throw new Error(`Invalid payload for analytics! ${t}`);
            try {
                return (await fetch(this.endPoint, {method: "post", body: t}))
                    .ok;
            } catch {
                return !1;
            }
        }
        async getPayloadFromEvents(e) {
            const t = await this.mStorage.getUserId(),
                s = await this.mStorage.getClientId(),
                i = new r();
            return (
                (i.clientId = s || ""),
                (i.userId = t || ""),
                (i.userProperties = await this.getUserProperties()),
                (i.events = e),
                i
            );
        }
    }
    let u;
    const l = new Uint8Array(16);
    function d() {
        if (
            !u &&
            ((u =
                "undefined" != typeof crypto &&
                crypto.getRandomValues &&
                crypto.getRandomValues.bind(crypto)),
            !u)
        )
            throw new Error(
                "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported",
            );
        return u(l);
    }
    const g = [];
    for (let e = 0; e < 256; ++e) g.push((e + 256).toString(16).slice(1));
    var p = {
        randomUUID:
            "undefined" != typeof crypto &&
            crypto.randomUUID &&
            crypto.randomUUID.bind(crypto),
    };
    function y(e, t, s) {
        if (p.randomUUID && !t && !e) return p.randomUUID();
        const i = (e = e || {}).random || (e.rng || d)();
        if (((i[6] = (15 & i[6]) | 64), (i[8] = (63 & i[8]) | 128), t)) {
            s = s || 0;
            for (let e = 0; e < 16; ++e) t[s + e] = i[e];
            return t;
        }
        return (function (e, t = 0) {
            return (
                g[e[t + 0]] +
                g[e[t + 1]] +
                g[e[t + 2]] +
                g[e[t + 3]] +
                "-" +
                g[e[t + 4]] +
                g[e[t + 5]] +
                "-" +
                g[e[t + 6]] +
                g[e[t + 7]] +
                "-" +
                g[e[t + 8]] +
                g[e[t + 9]] +
                "-" +
                g[e[t + 10]] +
                g[e[t + 11]] +
                g[e[t + 12]] +
                g[e[t + 13]] +
                g[e[t + 14]] +
                g[e[t + 15]]
            ).toLowerCase();
        })(i);
    }
    class f extends n {
        constructor(e) {
            super(), (this.mPropNamePrefix = `${btoa(e)}_WAS_`);
        }
        async getClientId() {
            const e = this.getPropertyNameForStorageItem(i.CLIENT_ID);
            let t = window.localStorage.getItem(e);
            return t || ((t = y()), window.localStorage.setItem(e, t)), t;
        }
        async getPayloads() {
            const e = this.getPropertyNameForStorageItem(i.PAYLOADS),
                t = window.localStorage.getItem(e);
            if (!t) return [];
            try {
                return JSON.parse(t[e]);
            } catch {
                return [];
            }
        }
        async setPayloads(e) {
            const t = this.getPropertyNameForStorageItem(i.PAYLOADS);
            try {
                const s = JSON.stringify(e);
                window.localStorage.setItem(t, s);
            } catch (e) {
                console.error(e);
            }
        }
        async getSessionId(e) {
            const t = this.getPropertyNameForStorageItem(i.SESSION_ID);
            let s = null;
            return (
                e
                    ? window.sessionStorage.removeItem(t)
                    : (s = window.sessionStorage.getItem(t)),
                (s && "" !== s) ||
                    ((s = f.createSessionId()),
                    window.sessionStorage.setItem(t, s)),
                s
            );
        }
        getPropertyNameForStorageItem(e) {
            return `${this.mPropNamePrefix}${e}`;
        }
        static createSessionId() {
            return c().toString();
        }
    }
    class S extends m {
        constructor(e, t, s, i, n) {
            var r;
            super(e, t, n || new f(s)),
                (this.mAppName = s),
                (this.mAppVersion = i),
                (this.mOS = (function () {
                    const {platform: e} = navigator,
                        t = {
                            Win: () =>
                                `Windows ${(navigator.userAgent.match(/Windows NT (\d+\.\d+)/) || [""])[1]}`,
                            Mac: () =>
                                `macOS ${(navigator.userAgent.match(/Mac OS X (\d+[_.]\d+[_.]\d+)/) || [""])[1].replace(/_/g, ".")}`,
                            CrO: () => "Chrome OS",
                            Lin: () => {
                                const e = navigator.userAgent.match(
                                    /(?:Ubuntu|Fedora|Red Hat|Gentoo|Debian|Linux Mint)\/([\d.]+)/,
                                );
                                return e ? `Linux (${e[0]})` : "Linux";
                            },
                            default: () => "Unknown OS",
                        };
                    return (t[e.substring(0, 3)] || t.default)();
                })()),
                (this.mOSVersion = "null"),
                (this.mBrowser = (function () {
                    const e = Object.values(
                            navigator.userAgentData.brands.at(-1),
                        ).toString(),
                        t = navigator.userAgent.match(
                            /((Firefox))(.*?)((\s)|(\S))+/,
                        );
                    return e && (null == t ? void 0 : t.length) ? t[0] : e;
                })()),
                (this.mBrowserVersion =
                    (null ===
                        (r = navigator.userAgentData.brands.find(
                            (e) =>
                                "Google Chrome" === e.brand ||
                                "Microsoft Edge" === e.brand,
                        )) || void 0 === r
                        ? void 0
                        : r.version) || "unknown browser"),
                (this.mDeviceType = navigator.userAgent.match(/Mobi/g)
                    ? "Mobile"
                    : navigator.userAgent.match(/Tablet/g)
                      ? "Tablet"
                      : "Desktop"),
                (this.dpi = 0),
                (this.screenRes = {width: 0, height: 0}),
                (this.screenUrl = "");
        }
        async getUserProperties() {
            const e =
                this.storage.getDomainLicense() || n.defaultDomainLicense();
            return {
                timezone: {value: a()},
                platform: {value: "Chrome"},
                device_type: {value: this.mDeviceType},
                app_name: {value: this.getAppName()},
                app_version: {value: this.getAppVersion()},
                os: {value: this.mOS},
                os_language: {
                    value:
                        (navigator.languages[0].includes("-")
                            ? navigator.languages[0]
                            : navigator.languages[1]) || navigator.language,
                },
                os_version: {value: this.mOSVersion},
                browser_version: {value: this.mBrowserVersion},
                screen_resolution: {
                    value: `${this.getScreenRes().width}x${this.getScreenRes().height}`,
                },
                dpi: {value: 100 * this.getDpi() + "%"},
                domain: {value: e.domain},
                license_type: {value: e.licenseType},
                product_code: {value: e.productCode},
                license_name: {value: e.licenseName},
                license_status: {value: e.licenseStatus},
                license_start_date: {value: e.licenseStartDate},
                license_guid: {value: e.licenseGuid},
                screen: {value: this.getScreen()},
                monitor_count: {value: "unknown"},
            };
        }
        getAppName() {
            return this.mAppName;
        }
        getAppVersion() {
            return this.mAppVersion;
        }
        getDpi() {
            return "undefined" != typeof window
                ? window.devicePixelRatio
                : this.dpi;
        }
        getScreenRes() {
            return "undefined" != typeof window
                ? {
                      width: window.screen.availWidth,
                      height: window.screen.availHeight,
                  }
                : this.screenRes;
        }
        getScreen() {
            return "undefined" != typeof window
                ? h(window.location.href)
                : h(this.screenUrl);
        }
    }
    class w extends f {
        constructor() {
            super(chrome.runtime.getManifest().name);
        }
        async getClientId() {
            const e = this.getPropertyNameForStorageItem(i.CLIENT_ID);
            return new Promise((t) => {
                chrome.storage.local.get({[e]: null}, async (s) => {
                    if (s[e]) {
                        const i = s[e];
                        t(i);
                    } else {
                        const s = y();
                        chrome.storage.local.set({[e]: s}), t(s);
                    }
                });
            });
        }
        async getPayloads() {
            const e = this.getPropertyNameForStorageItem(i.PAYLOADS);
            return new Promise((t) => {
                chrome.storage.local.get({[e]: void 0}, (s) => {
                    try {
                        const i = JSON.parse(s[e]);
                        t(i);
                    } catch {
                        t([]);
                    }
                });
            });
        }
        async setPayloads(e) {
            const t = this.getPropertyNameForStorageItem(i.PAYLOADS);
            return new Promise((s, i) => {
                try {
                    const i = JSON.stringify(e);
                    chrome.storage.local.set({[t]: i}, () => {
                        s();
                    });
                } catch {
                    i();
                }
            });
        }
    }
    class v extends w {
        async getSessionId(e) {
            const t = this.getPropertyNameForStorageItem(i.SESSION_ID);
            let s = null;
            if (
                (e
                    ? await chrome.storage.session.remove(t)
                    : (s = await chrome.storage.session.get({[t]: null})),
                !s || !s[t])
            ) {
                const e = v.createSessionId();
                return await chrome.storage.session.set({[t]: e}), e;
            }
            return s[t];
        }
    }
    class P extends S {
        constructor(e, t, s = void 0) {
            super(
                e,
                t,
                chrome.runtime.getManifest().name,
                chrome.runtime.getManifest().version,
                s || P.defaultStorage(),
            );
        }
        static defaultStorage() {
            return 3 === chrome.runtime.getManifest().manifest_version
                ? new v()
                : new w();
        }
    }
    (e.AnalyticsEvent = class {
        constructor(e, t, s, i) {
            (this.eventName = e),
                (this.params = {}),
                (this.category = t),
                (this.feature = s),
                (this.website = i),
                (this.mCustomProperties = null);
        }
        get name() {
            return this.eventName;
        }
        get parameters() {
            return this.params;
        }
        get session_id() {
            return this.params.session_id;
        }
        set session_id(e) {
            this.params.session_id = e;
        }
        get session_time() {
            return this.params.session_time;
        }
        set session_time(e) {
            this.params.session_time = e;
        }
        get category() {
            return this.params.category;
        }
        set category(e) {
            this.params.category = e;
        }
        get feature() {
            return this.params.feature;
        }
        set feature(e) {
            this.params.feature = e;
        }
        get website() {
            return this.params.website;
        }
        set website(e) {
            this.params.website = e;
        }
        get customProperties() {
            return this.mCustomProperties;
        }
        set customProperties(e) {
            this.mCustomProperties = e;
        }
        isValid() {
            if ("" === this.name.trim()) return !1;
            if (this.parameters) {
                const e = Object.getOwnPropertyNames(this.parameters);
                if (e.length > 25) return !1;
                for (let t = 0; t < e.length; t += 1);
            }
            return !0;
        }
        toJSON() {
            return {
                name: this.name,
                params: {
                    category: this.category,
                    feature: this.feature,
                    website: this.website,
                    engagement_time_msec: 1,
                    ga_session_id: this.session_id,
                    session_time: this.session_time,
                    ...this.customProperties,
                },
            };
        }
    }),
        (e.AnalyticsStorage = n),
        (e.ChromeExtensionAnalytics = P),
        (e.ChromeExtensionAnalyticsStorage = w),
        (e.ChromeExtensionAnalyticsStorageMV3 = v),
        (e.DomainLicense = s),
        (e.ServiceWorkerAnalytics = class extends P {
            constructor(e, t, s = void 0) {
                super(e, t, s);
            }
            setServiceWorkerScreenUrl(e) {
                super.screenUrl = e;
            }
            setScreenRes(e, t) {
                super.screenRes = {width: t, height: e};
            }
            setDpi(e) {
                super.dpi = e;
            }
        });
});
