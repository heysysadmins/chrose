window.sru = window.sru || {};
(function (g) {
    function p(a) {
        let b = c.selectionRect;
        b.x = a.x;
        b.y = a.y;
        b.left = b.x;
        b.top = b.y;
        b.right = b.x;
        b.bottom = b.y;
        c.selectionRect = b;
    }
    function n() {
        e === d.select &&
            (p({x: 0, y: 0}),
            (e = d.start),
            dji.utils.removeClassFromElement(
                c.rootNode,
                "dji-sru-screen-select",
            ));
    }
    function q(a) {
        let b = c.selectionRect;
        a.x <= b.x ? (b.left += a.x - b.left) : (b.right += a.x - b.right);
        a.y <= b.y ? (b.top += a.y - b.top) : (b.bottom += a.y - b.bottom);
        b.left > b.right && (b.right = b.left);
        b.top > b.bottom && (b.bottom = b.top);
        c.selectionRect = b;
    }
    function x(a) {
        e != d.ready &&
            ((a = {x: a.clientX, y: a.clientY}),
            c.updateOverlayCursorPosition(a),
            e === d.select && q(a));
    }
    function y(a) {
        a.stopPropagation();
        a.preventDefault();
        e != d.ready &&
            e === d.start &&
            (p({x: a.clientX, y: a.clientY}),
            (e = d.select),
            dji.utils.addClassToElement(c.rootNode, "dji-sru-screen-select"));
    }
    function z(a) {
        if (
            e != d.ready &&
            e === d.select &&
            a.clientX !== c.selectionRect.x &&
            a.clientY != c.selectionRect.y &&
            ((a = {x: a.clientX, y: a.clientY}), e === d.select)
        ) {
            q(a);
            a = c.selectionRect;
            a.left += 4;
            a.top += 5;
            a.right -= 4;
            a.bottom -= 4;
            const b = window.devicePixelRatio;
            a = {
                zoomLevel: b,
                left: a.left * b,
                right: a.right * b,
                top: a.top * b,
                bottom: a.bottom * b,
            };
            e = d.ready;
            dji.utils.removeClassFromElement(
                c.rootNode,
                "dji-sru-screen-select",
            );
            c.state = e === d.ready ? "busy" : "";
            dji.utils.callListeners(f, "selectionDone", l, a);
        }
    }
    function r(a) {
        A.has(a.key) ||
            (a.stopPropagation(),
            a.preventDefault(),
            e !== d.ready &&
                e === d.select &&
                "Escape" === a.key &&
                ((c.state = ""), n()));
    }
    function t(a) {
        a.isTrusted &&
            (e === d.select ? ((c.state = ""), n()) : e === d.ready && k(),
            a.stopPropagation(),
            a.preventDefault());
    }
    function u(a) {
        (c.ownerDocument && a.target !== c.ownerDocument.defaultView) || k();
    }
    function k() {
        h &&
            (dji.utils.callListeners(f, "analytics", {
                website: location.hostname,
                eventName: "OCRUsed",
                category: "Feature",
                feature: "Screenshot Reader",
                customProperties: {
                    words_included: m,
                    words_read: sru.speech.wordsRead(),
                },
            }),
            dji.utils.callListeners(f, "analytics", {
                website: location.hostname,
                eventName: "ScreenshotReaderOff",
                category: "Feature",
                feature: "Screenshot Reader",
            }));
        h = !1;
        document.removeEventListener("keydown", r, !0);
        document.removeEventListener("scroll", t, !0);
        window.removeEventListener("resize", u, !0);
        c.state = "";
        n();
        l = null;
        e = d.none;
        c.hide();
        dji.utils.callListeners(f, "deactivate");
    }
    let h = !1,
        l = null,
        f = {
            activate: [],
            deactivate: [],
            selectionDone: [],
            resultsProcessed: [],
            analytics: [],
        },
        c = null,
        d = {none: 0, start: 1, select: 2, ready: 3},
        e = d.none,
        v = !1;
    const A = new Set(
        "BrowserBack BrowserForward BrowserRefresh ZoomToggle LaunchApplication1 BrightnessDown BrightnessUp AudioVolumeMute AudioVolumeDown AudioVolumeUp".split(
            " ",
        ),
    );
    let m = 0;
    g.initialize = function () {
        c = new window.__dji.utils.ScreenSelectionOverlay();
        c.closeDelegate = () => {
            k();
        };
        c.initialize();
        c.rootNode.addEventListener("mousemove", x, !0);
        c.rootNode.addEventListener("mouseup", z, !0);
        c.rootNode.addEventListener("mousedown", y, !0);
    };
    g.addEventListener = function (a, b) {
        f.hasOwnProperty(a) &&
            "function" == typeof b &&
            -1 == f[a].indexOf(b) &&
            f[a].push(b);
    };
    g.activate = function (a) {
        c &&
            a != h &&
            (a
                ? ((m = 0),
                  (l = dji.utils.generateUUID()),
                  h ||
                      dji.utils.callListeners(f, "analytics", {
                          website: location.hostname,
                          eventName: "ScreenshotReaderOn",
                          category: "Feature",
                          feature: "Screenshot Reader",
                      }),
                  (h = !0),
                  document.getSelection().empty(),
                  c.moveOverlayCursorToCenter(),
                  document.addEventListener("keydown", r, !0),
                  document.addEventListener("scroll", t, !0),
                  window.addEventListener("resize", u, !0),
                  (e = d.start),
                  c.show(),
                  dji.utils.callListeners(f, "activate"))
                : k());
    };
    g.isActive = function () {
        return h;
    };
    g.setAutoSpeak = function (a) {
        v = a;
    };
    g.processDone = function (a, b) {
        if (l === a) {
            if (!b || !b.paragraphs) return k();
            m = 0;
            for (let w of b.paragraphs) {
                w.bounds.absolute = !0;
                for (let B of w.lines) m += B.words.length;
            }
            var C = c.appendContent(b.paragraphs);
            setTimeout(function () {
                c.state = e === d.ready ? "ready" : "";
                dji.utils.callListeners(f, "resultsProcessed");
                v && C && sru.speech.start(!0, !0);
            }, 0);
        }
    };
})((window.sru.screenSelection = window.sru.screenSelection || {}));
