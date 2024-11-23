const GoogleAnalytics = (function () {
    let c = null;
    return Object.freeze({
        setup: function (a, b) {
            c = new __ChromeAnalyticsGA4.ChromeExtensionAnalytics(a, b);
            c.setDebugEnabled(!1);
        },
        setLicense: function (a) {
            if (null === c)
                throw Error("ChromeExtensionAnalytics isn't initialised!");
            if (a && a.userEmail) {
                var b = __ChromeAnalyticsGA4.DomainLicense.fromUserEmail(
                    a.userEmail,
                );
                b.domain = a.domain;
                b.productCode = a.productCode;
                b.licenseGuid = a.guid;
                b.licenseType = a.type;
                b.licenseName = a.name;
                b.licenceStatus = a.status;
                b.licenceStartDate = a.startDate;
                c.setDomainLicense(b);
            } else dji.logger.error("Analytics: undefined license");
        },
        pushEvent: function (a, b) {
            try {
                if (null === c)
                    throw Error("ChromeExtensionAnalytics isn't initialised!");
                const d = new __ChromeAnalyticsGA4.AnalyticsEvent(
                    a.eventName,
                    a.category,
                    a.feature,
                    a.website,
                );
                a.customProperties = a.customProperties || {};
                if (
                    "object" === typeof a.customProperties ||
                    a.customProperties instanceof Object
                )
                    d.customProperties = a.customProperties;
                c.pushEvent(d, b);
            } catch (d) {
                dji.logger.error(d);
            }
        },
    });
})();
