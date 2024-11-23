window.sru = window.sru || {};
(function (l) {
    function m(b, a, f, h) {
        var d = null;
        switch (b) {
            case "classroom":
            case "drive":
                0 <
                    document.querySelectorAll(
                        `[href*='${a}'], [jsdata*='${a}'], [targetid='${a}'], [data-tile-entry-id='${a}']`,
                    ).length &&
                    (d = {
                        provider: "google",
                        scope: b,
                        doc: {id: a, type: f, fileName: h},
                    });
                break;
            case "gmail":
                var c = (d = null);
                if (a.startsWith("drv_")) {
                    a = a.replace("drv_", "");
                    a = k(a);
                    var e = document.querySelector(`[download_url*='${a}']`);
                } else
                    (c = a.split("_")),
                        (d = c[1]),
                        (c = c[2]),
                        (e = document.querySelector(
                            `[download_url*='attid=${c}']`,
                        ));
                e
                    ? (e = e
                          .getAttribute("download_url")
                          .split(":")
                          .slice(2)
                          .join(":"))
                    : ((e = window.location.href.split("#")[0]),
                      (g = g.replace("#", "")),
                      (e = d
                          ? `${e}?attid=${c}&permmsgid=${g}&th=${d}&view=att&disp=inline`
                          : `${e}?attid=${c}&permmsgid=${g}&view=att&disp=inline`));
                d = {
                    provider: "google",
                    scope: b,
                    doc: {id: c || a, downloadUrl: e, type: f, fileName: h},
                };
        }
        return d;
    }
    function k(b) {
        if (b && 0 === b.length % 2) {
            let a = b.substring(0, b.length / 2),
                f = b.substring(b.length / 2, b.length);
            a === f && (b = a);
        }
        return b;
    }
    let g = null;
    l.detectDocumentInfo = function () {
        let b = null,
            a = null;
        try {
            if (
                (dji.utils.isGoogleClassroom()
                    ? (a = "classroom")
                    : dji.utils.isGoogleDrive()
                      ? (a = "drive")
                      : dji.utils.isGoogleMail() && (a = "gmail"),
                a)
            ) {
                let f = document.querySelector("#drive-active-item-info");
                if (f) {
                    let h = f.textContent.replace(
                            /\\x([0-9a-f]{1,4})/g,
                            (q, n) => `\\u${n.padStart(4, "0")}`,
                        ),
                        d = JSON.parse(h),
                        c = d.id,
                        e = d.mimeType,
                        p = d.title;
                    c = k(c);
                    b = m(a, c, e, p);
                }
            }
        } catch (f) {
            dji.logger.error(f);
        }
        return b;
    };
    if (dji.utils.isGoogleMail())
        $(document.body).on("click", "table tbody div[data-index]", (b) => {
            var a = b.target.closest("tr");
            b = b.target.closest("[data-index]");
            a &&
                b &&
                b.closest("tr") === a &&
                ((b = (b = a.querySelector("[data-thread-id]"))
                    ? b.getAttribute("data-thread-id")
                    : null),
                (a = a.querySelector("[data-standalone-draft-id]")) &&
                    (b = a.getAttribute("data-standalone-draft-id")),
                (g = b));
        });
})((window.sru.documentInfo = window.sru.documentInfo || {}));
