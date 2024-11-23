window.jsdapi = window.jsdapi || {};
(function (a) {
    const b = Object.create(null, {
        SensitiveWords: {value: "snapread/sensitive-words"},
    });
    a.Type = b;
    a.downloadSensitiveWordsResourcesAsync = async function (c, d) {
        return a.downloadCommonResourcesAsync(
            window.jsdapi.resources.Type.SensitiveWords,
            c,
            d,
        );
    };
})((window.jsdapi.resources = window.jsdapi.resources || {}));
