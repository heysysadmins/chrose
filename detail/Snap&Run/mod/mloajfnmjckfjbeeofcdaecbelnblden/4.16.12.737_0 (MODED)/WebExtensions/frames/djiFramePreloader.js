window.dji = window.dji || {};
(function (c) {
    function b() {
        b.__rules ||
            (b.__rules = [
                {
                    hostname: /^.*word-edit.officeapps.live.com$/,
                    pathname: /^.*\/wordeditorframe.aspx$/,
                },
            ]);
        for (let a = 0; a < b.__rules.length; a++)
            if (
                b.__rules[a].hostname.test(window.location.hostname) &&
                b.__rules[a].pathname.test(window.location.pathname)
            )
                return !0;
        return !1;
    }
    function d() {
        if (
            (/^.*odcom-.*.read.overdrive.com$/.test(window.location.hostname) &&
                "/" === window.location.pathname) ||
            /^.*sample-.*.read.overdrive.com$/.test(window.location.hostname)
        )
            return !0;
        if (/^.*read.soraapp.com$/.test(window.location.hostname))
            try {
                return "" === document.referrer
                    ? !0
                    : new URL(document.referrer).hostname !==
                          window.location.hostname;
            } catch (e) {
                return !1;
            }
        const a = /^.*.read.libbyapp.com$/;
        if (
            /^.*.read.libbyshelf.com$/.test(window.location.hostname) ||
            a.test(window.location.hostname)
        )
            try {
                return (
                    new URL(document.referrer).hostname !==
                    window.location.hostname
                );
            } catch (e) {}
        return !1;
    }
    c.serviceName = function () {
        if (b()) return "ms-office-word-editor";
        if (d()) return "over-drive-reader";
        var a =
            /^texthelp\.quiz-.*\.instructure\.com$/.test(
                window.location.hostname,
            ) && "/" !== window.location.pathname
                ? !0
                : !1;
        return a ? "canvas-lms" : null;
    };
    (c = c.serviceName()) &&
        chrome.runtime.sendMessage(null, {
            message: "com.donjohnston.dji.service.load",
            service: c,
        });
})((window.dji.framePreloader = window.dji.framePreloader || {}));
