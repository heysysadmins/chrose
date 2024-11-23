window.dji = window.dji || {};
(function (c) {
    const e = {
        production: {
            name: "Production",
            clientID: "sru-extesion-78b4f8eb198c464d99747047fec1655f",
            loginServerURL: "https://login.donjohnston.net",
            dapiServerURL: "https://dapi.donjohnston.net",
            translateServerURL: "https://translate.donjohnston.net",
            resourcesURL: "https://cdn.donjohnston.net",
            citationsServerURL: "https://citations.donjohnston.net",
            ttsServerURL: "https://tts.donjohnston.net",
            pdfOrbitNoteRedirectUrl: "https://orbit.texthelp.com/snapread",
            sruUrl: "https://snapandread.com",
            defineUrl: "https://definition.donjohnston.net",
            wbPWAUrl: "https://app.wordbank.io",
            gaMeasurementId: "G-07QKDNKKLY",
            gaApiSecret: "4qHQ6oRGTKSVdh0d_qkKZg",
            relatedUris:
                "*://snapandread.com/* *://cowriter.com/* *://quizbot.com/* *://wordbank.io/* *://universalpar.com/* *://educatordashboard.com/* *://startpar.com/* *://app.snapandread.com/* *://app.wordbank.io/*".split(
                    " ",
                ),
        },
        stage: {
            name: "Stage",
            clientID: "sru-extesion-78b4f8eb198c464d99747047fec1655f",
            loginServerURL: "https://login.stagedji.com",
            dapiServerURL: "https://dapi.stagedji.com",
            translateServerURL: "https://translate.stagedji.com",
            resourcesURL: "https://cdn.donjohnston.net",
            citationsServerURL: "https://citations.stagedji.com",
            ttsServerURL: "https://tts.stagedji.com",
            pdfOrbitNoteRedirectUrl: "https://orbit.texthelp.com/snapread",
            sruUrl: "https://snapandread.stagedji.com",
            defineUrl: "https://definition.stagedji.com",
            wbPWAUrl: "https://app.wordbank.stagedji.com",
            gaMeasurementId: "G-754B1KENT5",
            gaApiSecret: "Pm2vqJqiSGSZwTA9edkX4A",
            relatedUris:
                "*://snapandread.stagedji.com/* *://cowriter.stagedji.com/* *://quizbot.stagedji.com/* *://wordbank.stagedji.com/* *://universalpar.stagedji.com/* *://educatordashboard.stagedji.com/* *://startpar.stagedji.com/* *://app.snapandread.stagedji.com/* *://app.wordbank.stagedji.com/*".split(
                    " ",
                ),
        },
        qa: {
            name: "QA",
            clientID: "sru-extesion-78b4f8eb198c464d99747047fec1655f",
            loginServerURL: "https://login.qadji.com",
            dapiServerURL: "https://dapi.qadji.com",
            translateServerURL: "https://translate.qadji.com",
            resourcesURL: "https://cdn.devdji.com",
            citationsServerURL: "https://citations.qadji.com",
            ttsServerURL: "https://tts.qadji.com",
            pdfOrbitNoteRedirectUrl: "https://pdf.dev.texthelp.com/snapread",
            sruUrl: "https://snapandread.qadji.com",
            defineUrl: "https://definition.qadji.com",
            wbPWAUrl: "https://app.wordbank.qadji.com",
            gaMeasurementId: "G-754B1KENT5",
            gaApiSecret: "Pm2vqJqiSGSZwTA9edkX4A",
            relatedUris:
                "*://snapandread.qadji.com/* *://cowriter.qadji.com/* *://quizbot.qadji.com/* *://wordbank.qadji.com/* *://universalpar.qadji.com/* *://educatordashboard.qadji.com/* *://startpar.qadji.com/* *://app.snapandread.qadji.com/* *://app.wordbank.qadji.com/*".split(
                    " ",
                ),
        },
    };
    let a = e.production;
    c.allEnvs = function () {
        let b = [];
        for (let f in e)
            if (e.hasOwnProperty(f)) {
                let d = e[f];
                b.push({
                    name: d.name,
                    login: d.loginServerURL,
                    dapi: d.dapiServerURL,
                    translate: d.translateServerURL,
                    resources: d.resourcesURL,
                    citations: d.citationsServerURL,
                    tts: d.ttsServerURL,
                    pdfOrbitNote: d.pdfOrbitNoteRedirectUrl,
                    sru: d.sruUrl,
                    define: d.defineUrl,
                    wbPWA: d.wbPWAUrl,
                    gaMeasurementId: d.gaMeasurementId,
                    gaApiSecret: d.gaApiSecret,
                    relatedUris: d.relatedUris,
                });
                d.hasOwnProperty("permissive") &&
                    (b[b.length - 1].permissive = !!d.permissive);
            }
        return b;
    };
    c.env = function () {
        return a;
    };
    c.update = function (b) {
        a = {
            name: b.name,
            clientID: a.clientID,
            loginServerURL: b.login,
            dapiServerURL: b.dapi,
            translateServerURL: b.translate,
            resourcesURL: b.resources,
            citationsServerURL: b.citations,
            ttsServerURL: b.tts,
            pdfOrbitNoteRedirectUrl: b.pdfOrbitNote,
            sruUrl: b.sru,
            relatedUris: b.relatedUris,
            defineUrl: b.define,
            wbPWAUrl: b.wbPWA,
            gaMeasurementId: b.gaMeasurementId,
            gaApiSecret: b.gaApiSecret,
            gdocsConfig: b.gdocsConfig,
        };
        b.hasOwnProperty("permissive") && (a.permissive = !!b.permissive);
    };
    c.clientID = function () {
        return a.clientID;
    };
    c.loginUrlSignature = function () {
        return btoa(a.loginServerURL);
    };
    c.loginUrl = function (b) {
        return b
            ? a.loginServerURL
            : a.loginServerURL +
                  `?client_id=${encodeURIComponent(a.clientID)}` +
                  `&client_version=${encodeURIComponent(chrome.runtime.getManifest().version)}` +
                  `&redirect_uri=https://${chrome.runtime.id}.chromiumapp.org/auth/callback`;
    };
    c.silentAuthUrl = function () {
        return (
            `${a.loginServerURL}/silent/v2/auth` +
            `?client_id=${encodeURIComponent(a.clientID)}` +
            `&redirect_uri=${encodeURIComponent(chrome.runtime.getURL("silent/auth/callback"))}`
        );
    };
    c.silentSignoutUrl = function () {
        return (
            a.loginServerURL +
            "/silent/signout?redirect_uri=https://" +
            chrome.runtime.id +
            ".chromiumapp.org/silent/signout/callback"
        );
    };
    c.dapiUrl = function () {
        return a.dapiServerURL;
    };
    c.translateUrl = function () {
        return a.translateServerURL;
    };
    c.resourcesUrl = function () {
        return a.resourcesURL;
    };
    c.citationsUrl = function () {
        return a.citationsServerURL;
    };
    c.pdfUrl = function () {
        return a.pdfOrbitNoteRedirectUrl;
    };
    c.pdfOrbitNoteUrl = function () {
        return a.pdfOrbitNoteRedirectUrl;
    };
    c.pdfViewerUrl = function (b) {
        return `${a.pdfOrbitNoteRedirectUrl}?file=${encodeURIComponent(b)}`;
    };
    c.sruUrl = function () {
        return a.sruUrl;
    };
    c.relatedUris = function () {
        return a.relatedUris;
    };
    c.defineUrl = function () {
        return a.defineUrl;
    };
    c.wbPWAUrl = function () {
        return a.wbPWAUrl;
    };
    c.gaMeasurementId = function () {
        return a.gaMeasurementId;
    };
    c.gaApiSecret = function () {
        return a.gaApiSecret;
    };
    c.gdocsConfig = function () {
        return a.gdocsConfig || {disablePrimaryRenderer: !1};
    };
})((window.dji.config = window.dji.config || {}));
