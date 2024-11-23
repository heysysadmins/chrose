window.sru = window.sru || {};
(function (g) {
    function q(b, d) {
        b = e[b];
        d
            ? dji.utils.removeClassFromElement(b.button, "dji-sru-disabled")
            : dji.utils.addClassToElement(b.button, "dji-sru-disabled");
        b.enabled = d;
    }
    function h(b, d) {
        var l = e[b];
        d != l.active &&
            (d
                ? (dji.utils.addClassToElement(l.button, "dji-sru-active"),
                  b === a.wordBank
                      ? ((b = l.button.querySelector("i.dji-svg-icon")),
                        b.classList.remove("svg-scanner"),
                        b.classList.add("svg-scanner_active"))
                      : b === a.overlay &&
                        ((b = l.button.querySelector("i.dji-svg-icon")),
                        b.classList.remove("svg-colored_overlay"),
                        b.classList.add("svg-colored_overlay_active")))
                : (dji.utils.removeClassFromElement(l.button, "dji-sru-active"),
                  b === a.wordBank
                      ? ((b = l.button.querySelector("i.dji-svg-icon")),
                        b.classList.remove("svg-scanner_active"),
                        b.classList.add("svg-scanner"))
                      : b === a.overlay &&
                        ((b = l.button.querySelector("i.dji-svg-icon")),
                        b.classList.remove("svg-colored_overlay_active"),
                        b.classList.add("svg-colored_overlay"))),
            (l.active = d));
    }
    function m(b, d) {
        b = e[b];
        d != b.visible &&
            (d
                ? dji.utils.removeClassFromElement(b.button, "dji-sru-hidden")
                : dji.utils.addClassToElement(b.button, "dji-sru-hidden"),
            (b.visible = d));
    }
    function p(b) {
        b.preventDefault();
        b.stopPropagation();
    }
    function k() {
        e[a.speak].enabled && dji.utils.callListeners(n, "speak");
    }
    function r() {
        e[a.screenshot].enabled && dji.utils.callListeners(n, "screenshot");
    }
    function B() {
        e[a.rewordify].enabled && dji.utils.callListeners(n, "rewordify");
    }
    function t() {
        e[a.translate].enabled && dji.utils.callListeners(n, "translate");
    }
    function y() {
        dji.utils.callListeners(n, "showOutlines", !e[a.showOutlines].enabled);
        u(!e[a.showOutlines].enabled);
    }
    function c(b) {
        (e[a.highlight].enabled || 1 == b) &&
            dji.utils.callListeners(n, "highlight", b);
    }
    function z() {
        e[a.wordBank].enabled && dji.utils.callListeners(n, "wordBank");
    }
    function u(b) {
        (e[a.showOutlines].enabled = b)
            ? (dji.utils.addClassToHtmlElements("dji-sru-outline-active", !0),
              (__$.getElementById(a.showOutlines).title = "Hide outlines"))
            : (dji.utils.removeClassFromHtmlElements(
                  "dji-sru-outline-active",
                  !0,
              ),
              (__$.getElementById(a.showOutlines).title = "Show outlines"),
              sru.outlines.hideBulletToolbars());
    }
    var C = !1,
        n = {
            speak: [],
            screenshot: [],
            rewordify: [],
            translate: [],
            showOutlines: [],
            highlight: [],
            overlay: [],
            wordBank: [],
        },
        a = {
            speak: "__dji_sru_speakButton",
            screenshot: "__dji_sru_screenshotButton",
            rewordify: "__dji_sru_rewordifyButton",
            translate: "__dji_sru_translateButton",
            showOutlines: "__dji_sru_showButton",
            highlight: "__dji_sru_highlightButton",
            overlay: "__dji_sru_overlayButton",
            wordBank: "__dji_sru_wordBankButton",
        },
        f = {
            speak: k,
            screenshot: r,
            rewordify: B,
            translate: t,
            showOutlines: y,
            highlight: c,
            overlay: function () {
                e[a.overlay].enabled && dji.utils.callListeners(n, "overlay");
            },
            wordBank: z,
        },
        e = {},
        D = null,
        E = !1;
    g.initialize = function () {
        if (!C) {
            D = sru.mainContainer
                .mainContainer()
                .querySelector(".dji-sru-toolbar");
            dji.shortcuts.addEventListener("speak", k);
            dji.shortcuts.addEventListener("screenshot", r);
            dji.shortcuts.addEventListener("rewordify", B);
            dji.shortcuts.addEventListener("translate", t);
            dji.shortcuts.addEventListener("toggleOutlines", y);
            dji.shortcuts.addEventListener("wordbank", z);
            for (var b in a)
                if (a.hasOwnProperty(b)) {
                    var d = D.querySelector("#" + a[b]);
                    d.addEventListener("mousedown", p);
                    d.onclick = f[b];
                    e[a[b]] = {button: d, active: !1, enabled: !0, visible: !0};
                    "highlight" === b &&
                        ((e[a[b]].highlightable = !1), q(a.highlight, !1));
                }
            e[a.showOutlines].enabled = !1;
            g.enableWordBankButton(!1);
            C = !0;
        }
    };
    g.addEventListener = function (b, d) {
        n.hasOwnProperty(b) &&
            "function" == typeof d &&
            -1 == n[b].indexOf(d) &&
            n[b].push(d);
    };
    g.hasWordBank = function () {
        return E;
    };
    g.enableWordBankButton = function (b) {
        E = b;
        q(a.wordBank, b);
        m(a.wordBank, b);
    };
    g.enableButtons = function ({
        speak: b = null,
        ocr: d = null,
        rewordify: l = null,
        translate: v = null,
        highlight: w = null,
        overlay: x = null,
        wordBank: A = null,
    } = {}) {
        null !== b && q(a.speak, b);
        null !== d && q(a.screenshot, d);
        null !== l && q(a.rewordify, l);
        null !== v && q(a.translate, v);
        null !== w && sru.outlines.isHighlightable() && q(a.highlight, w);
        null !== x && q(a.overlay, x);
        null !== A && void 0 !== A && q(a.wordBank, A);
    };
    g.enableHighlightButton = function (b) {
        (b &&
            (e[a.translate].active || e[a.rewordify].active) &&
            !e[a.speak].enabled) ||
            q(a.highlight, b);
    };
    g.activateHighlightButton = function (b) {
        h(a.highlight, b);
    };
    g.disableHighlight = function () {
        c(!0);
    };
    g.isHighlightActive = function () {
        return e[a.highlight].active && e[a.highlight].enabled;
    };
    g.activateButtons = function ({
        speak: b = null,
        ocr: d = null,
        rewordify: l = null,
        translate: v = null,
        highlight: w = null,
        overlay: x = null,
        wordBank: A = null,
    } = {}) {
        null !== b && void 0 !== b && h(a.speak, b);
        null !== d && h(a.screenshot, d);
        null !== l && h(a.rewordify, l);
        null !== v && h(a.translate, v);
        null !== w && h(a.highlight, w);
        null !== x && h(a.overlay, x);
        null !== A && void 0 !== A && h(a.wordBank, A);
    };
    g.showButtons = function ({
        speak: b = null,
        ocr: d = null,
        rewordify: l = null,
        translate: v = null,
        overlay: w = null,
        wordBank: x = null,
    }) {
        null !== b && void 0 !== b && m(a.speak, b);
        null !== d && void 0 !== d && m(a.screenshot, d);
        null !== l && void 0 !== l && m(a.rewordify, l);
        null !== v && void 0 !== v && m(a.translate, v);
        null !== w && void 0 !== w && m(a.overlay, w);
        null !== x && void 0 !== x && m(a.wordBank, x);
    };
    g.triggerShowOutlines = y;
    g.expandOutlinesPanel = function (b) {
        u(b);
    };
    g.isOutlinesPanelExpanded = function () {
        return dji.utils.elementHasClass(
            document.documentElement,
            "dji-sru-outline-active",
        );
    };
    g.setTitle = function (b) {
        var d = sru.mainContainer
            .mainContainer()
            .querySelector(".dji-sru-outline-title-in-toolbar");
        d &&
            (b
                ? b.isSkeleton()
                    ? (d.innerText = "Outline Name")
                    : b.isHome()
                      ? (d.innerText = "")
                      : (d.innerText = b.title())
                : (d.innerText = ""));
    };
})((window.sru.toolbar = window.sru.toolbar || {}));
window.dji = window.dji || {};
(function (g) {
    function q(k) {
        if (!k.__handled) {
            var r = k.path[0].parentElement === p ? k.path[0] : null,
                B = new Event("dji-apps-action-blur");
            p.childNodes.forEach((t) => {
                r !== t &&
                    t.nodeType === Node.ELEMENT_NODE &&
                    t.dispatchEvent(B);
            });
            k.__handled = !0;
        }
    }
    let h = null,
        m = null,
        p = null;
    g.init = async function () {
        await dji.utils.waitDOMContentLoaded();
        const k = document;
        if ((h = document.querySelector("dji-apps-actions")))
            (m = h.shadowRoot),
                (p = m.querySelector('div[dji-role="apps-actions"]'));
        else {
            h = document.createElement("dji-apps-actions");
            h.setAttribute("tabindex", "-1");
            document.body.appendChild(h);
            m = h.attachShadow({mode: "open"});
            let r = h.ownerDocument.createElement("style");
            r.textContent =
                '\n:host {\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    width: 0px;\n    height: 0px;\n    box-sizing: border-box;\n    margin: 0;\n    z-index: 8888888;\n}\n\ndiv[dji-role="apps-actions"] {\n    --dji-item-size: 24px;\n    --dji-item-count: 0; \n    \n    display: grid;\n    grid-template-rows: repeat(var(--dji-item-count), var(--dji-item-size));\n    grid-row-gap: 8px;\n\n    position: fixed;\n    bottom: 50px;\n    left: 10px;\n\n    width: var(--dji-item-size);\n    height: auto;\n    margin: 0;\n    padding: 0 0 8px 0;\n    box-sizing: border-box;\n\n    border-bottom: solid 2px rgba(0,0,0,0.12);\n\n    font-family: sans, sans-serif, Arial;\n    outline: none;\n    user-select: none;\n}\ndiv[dji-role="apps-actions"]:empty {\n    display: none;\n}\n        ';
            m.append(r);
            p = k.createElement("div");
            p.setAttribute("dji-role", "apps-actions");
            p.setAttribute("tabindex", "-1");
            k.createElement("div").setAttribute(
                "style",
                "background-color: #b8e4b8",
            );
            p.addEventListener("click", q, !0);
            window.addEventListener("click", q, !0);
            m.append(p);
        }
        p.setAttribute("dji-visible", "");
    };
    g.addApp = function (k) {
        k = k instanceof HTMLElement ? k : h.ownerDocument.createElement(k);
        p.appendChild(k);
        p.style.setProperty("--dji-item-count", p.childElementCount);
        return k;
    };
})((window.dji.appsToolbar = window.dji.appsToolbar || {}));
(async function () {
    function g() {
        const a = document;
        let f = null;
        t = document.createElement("dji-sru-action");
        t.setAttribute("tabindex", "-1");
        y = t.attachShadow({mode: "closed"});
        q();
        c = a.createElement("div");
        c.setAttribute("dji-role", "app");
        c.setAttribute("tabindex", "-1");
        z = a.createElement("div");
        z.setAttribute("dji-role", "icon");
        n = a.createElement("div");
        n.setAttribute("dji-role", "not-auth-info");
        n.textContent =
            "Please sign in to Snap&Read before launching a quiz in locked mode.";
        n.addEventListener("click", m);
        u = a.createElement("div");
        u.setAttribute("dji-role", "menu");
        f = a.createElement("div");
        f.setAttribute("dji-role", "menu-item");
        f.setAttribute(
            "dji-icon",
            chrome.runtime.getURL(
                "/resources/sprite/sr/power_settings_new.svg",
            ),
        );
        f.textContent = "Snap&Read On/Off";
        f.addEventListener("click", m);
        u.appendChild(f);
        f = a.createElement("div");
        f.setAttribute("dji-role", "menu-item-separator");
        u.appendChild(f);
        f = a.createElement("div");
        f.setAttribute("dji-role", "menu-item");
        f.setAttribute(
            "dji-icon",
            chrome.runtime.getURL("/resources/sprite/account_face"),
        );
        f.textContent = "";
        u.appendChild(f);
        C = f;
        c.appendChild(z);
        c.appendChild(n);
        c.appendChild(u);
        y.append(c);
        c.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        z.addEventListener("click", h);
        dji.appsToolbar.addApp(t);
        t.addEventListener("dji-apps-action-blur", (e) => {
            c.removeAttribute("dji-menu");
        });
    }
    function q() {
        let a = t.ownerDocument.createElement("style");
        a.textContent =
            '\n:host {\n    position: relative;\n    top: 0px;\n    left: 0px;\n    box-sizing: border-box;\n    margin: 0;\n    z-index: 8888888;\n    display: block;\n}\n\ndiv[dji-role="app"] {\n    --dji-icon-size: 24px;\n    --dji-menu-item-height: 32px;\n\n    display: none;\n    position: absolute;\n    bottom: 0px;\n    left: 0px;\n\n    width: 0;\n    height: 0;\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n\n    font-family: sans, sans-serif, Arial;\n    user-select: none;\n}\ndiv[dji-role="app"][dji-visible] {\n    display: block;\n}\n\ndiv[dji-role="app"] div[dji-role="icon"] {\n\n    position: absolute;\n    box-sizing: border-box;\n    bottom: 0;\n    left: 0;\n    width: var(--dji-icon-size);\n    height: var(--dji-icon-size);\n    line-height: var(--dji-icon-size);\n\n    padding: 0;\n    font-size: 0;\n\n    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAABGdBTUEAALGPC/xhBQAAA3hJREFUOBF9k19IU1Ecx8+9u845/24PkVrqgyKoVEJB/ikRtB40QUOUSihtTKzQR03yQSTqSQlmukoRZJmCgVn24B+EgmCEJfqkE10vtWjTptPNzdv3d/TKtOzCub9zf38+95zv+R2B/eeRZfmG2Ww2OJ1Of0xMDKutrW0VBGH6qBLhXwFAyJ/i8/kMJSUl5YFAIFGlUtlHR0dtkiTVIrYAqHy49i8YQLFzc3Omjo4O3crKyhkUxAQVrSYmJn5paGj4lZGRcRfA70ExdgAGUGpvb+8zi8VyFklhwYnBc0A8FRUVH2pqagi4oMREZQJQHPR5AtAF+DhIq9V6srOzf9KWcnNzXeHh4ZuUj1ztwMDApb6+vheYH1cY3MIhzM7ODhcUFHgwZIwdk8m0vr29jZAst7W1cev3++Wuri4fxSmvsLBwY35+fliBKStLhUZ6OPmKysrKturq6sIhNs+rqqriFofAjEZjSHl5ORcff9CStrAplCBichEreGq320lsRlsxGAwH9EpISKDQ/lNdXS1GRUVtk2N5efkUVmwA56UqNja2p6WlJRkfxyiYlZXlzc/PV9OcHofDwQYHB1l8fDz9iPtEUSSIamlpib7DoF+Cx+MJqCDsLZvNdppn4YUVqjFYUlISi46O5iAcCtNoNCwzM5PirLOzk01NTdFB8DLY6Li4uCVJp9OJ0OIbGvMkRfLy8jabm5v3t1lUVMQLFEtbbmpqYrS68fFxHkP9Cm6ILIBq8nq9m403c4wpOneEV4z03Xs0qpYiDp44r9p7QSNWWVkZWFtbU6FtnGNjYzMAtkrMLDSEavRv2vOdEXu56i1LsiwVvRZYfCF30daCD6Gnp4cRiIKQYxYgI6A2kYnsPttyXt4DcaNhG8LW21LZv757W/r7+7mfVtTd3c2Ghoa4WABs0NUiECVITGbXeOahFwHbG6/4vSeusunpaQkFO1arNeB2u0OQyq8htvoxLS3tjlJKXclbQnEE29Cd39K7iQnumpycpAbnTQ6wB438GaMO8x9KDcGsGLviKN49u7ga5cY0UnGj0AWNvtbX1zvT09MPgChHkJ+zTLbDPmG7+43Ki0N17/3XHeri4uIUahuIbB8ZGXmlVqvNgC4qPwi2knCbzQB4HsDHCJzDcEARC/O6HuJu5pSWlj5wuVwLer1eAmj+KBBB/wBMlnqIOqbMuwAAAABJRU5ErkJggg==");\n    background-position: center;\n    background-repeat: no-repeat;\n    background-size: 16px;\n\n    background-color: transparent;\n    border-radius: 50%;\n\n    color: #444444;\n}\n\ndiv[dji-role="app"][dji-state="not-auth"] div[dji-role="icon"] {\n    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAABGdBTUEAALGPC/xhBQAAA2RJREFUOBF9U19I01EUvr9tDt1yuj2ETppCqaBSDQryT4ng6sE/MGUokQ8qQ7FCHzPJB5GgpySYqVEiiJmCgQwUEUQoCEZY4p50w60XW7Qly83NzV/fufqTubIL5557z3fOd88991yB/WeIonhvbGzM6vf7Y5mZmayzs3NAEITVs0KEfwEgIXt+NBq11tfXW+LxeK5cLvfa7XaXQqHoBLYJUjE59i8yEGVvbGzYhoaGtB6P5yoCMhOCfuXm5n7p6en5WVJS8gCEOwkYO0UGosLx8fFXU1NT1+CUluiYuAZJqKmp6UN7ezsRbkqYTFqASI/6vADRTdg4kUqlCpWVlf2gK1VUVATUanWY/OGrmp6evj0xMfEa6yyJg2sYhPX19bnq6uoQRIQc2my23wcHB4BEcXBwkOtYLCaOjIxECSc/k8m053Q65yQyKbNC1EgHI8+ooaFhv6urS41ic7+Wlhau8Qiso6MjxWKx8OLjBBXVFjqfHGRY3EIGL71eLxWb0VWsVuupehkMBoJORltbm0yj0RyQYXt7+zIytoLnrTw7O/tNf3//JWzOE1haWhqpqqpS0pqGz+djMzMzLCcnhw7iNplMRiRyt9tN+zTUzxAKheJyFLbV5XJd4V6YkKESwvLy8lhGRgYnwqOw1NRUZjQaCWfDw8NsZWWFHoKHQWfo9Xq3QqvVylCLb2jMC4RUVlaG+/r6Tq5ZU1PDAyRNV+7t7WWU3fLyMscQ78EPEQWw2iKRSPhReXlHfjB4LpKeHn1otysVWadfnEcdT6gRa25uju/u7srRNv6FhYU1EA4wJJoi6nSL0JQ0l7BafSguLeGco4GfIC25Hh0dpfbhgsdagfEinUOt8Zj5/XeOD+UqdW9P2DebxdjO0W+ZnJzkdsoIRGx2dpYXC1nt0deCdpEDNdJd7pk0EeHzurpYpLGRra6uKhBw6HA44sFgMAWu/Bviqh+LioruS6H09QPYJH5mCWPDBQXsfVKPEQjiEBr5M6RVyorslJkDYqJN8tjSaIKwpUt2BAbQMl+7u7v9xcXFXdh/lzDSlJkR+hPkpFEJYFrtYsznU9bW1uZT2+C1vPPz8++USuUYSLa4T9KkwOXXQHgD9meQ6xAfZIoFAk/xN8vNZvOTQCCwqdPpFCBynkWEGPYHXMaTmYkN1kQAAAAASUVORK5CYII=");\n    cursor: pointer;\n}\n\ndiv[dji-role="app"][dji-state="not-active"] div[dji-role="icon"] {\n    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAABGdBTUEAALGPC/xhBQAAA0VJREFUOBF9lN1Lk1Ecx8+ezTk3dC8X0SZtXjS8UCohBMV8Ae1GERSGChmojY0V6K1IXph/gATzZbWJIG6peCGCEIIU3UlkQy/KJrpuymhLbNO9+fT9nXjGnNmB5znn/F4+53e+zzmPjP2niaL4wOPx2CORSFqn0zGn0zkmk8neXJUi+5cDELJbk8mkvb293ZbJZCxyuTy8trYWUigUTvj2ABXzcy/BADLu7Oy4JyYm9IeHh3eQoMtJ+mWxWLaHhoZ+VlZWPgHwW46PXYABVD47O/tiYWHhLoKKcgNzx4DEu7q63g0MDBBwT/IJ0gAgE/R5DtA92DhIrVbHa2trf9CW6urqohqN5pTiEasOBAL35+bmvBhflxi8h0EWDAZXmpub43hEPOdut/t3KpWCSxTHx8d5n06nxenp6ST5Ka6lpSW2u7u7IsGkysqhkQFGXlFnZ+eZy+XSQGwe19vby3t8BOZwOApsNhsXHyuoSVv0VgoQMKhHBVPhcJjEZrQVu91+QS+z2UyubOvv7xdKSkpSZDg4OLiFiu3g+OVGo9E3Ojp6E5Nr5KypqUk0NTUpaUzt6OiILS4ustLSUlqI2wRBIIh8f3+f5kXQzxyPxzNyCNsXCoVu8yi8UKESDysrK2NarZaD8FGYSqViVVVV5GeTk5Nsc3OTPgRPQ681mUz7Cr1eL0CLrziYN8jT0NBwOjIykt1ma2srT5B62vLw8DCj6jY2NrgP+Ye4IaIMVHcikThta2t7BI8WWzlbXl5WSeLz6LwXNGLd3d2Z4+NjOY5NZH19/QOAYwImjwsLC19ixW3KicViKq/Xm87Np63lNp/PxwhENsgRBMgBzlvpaHzCFYnAxw8lKpPjAGeoAmrz8/O8p/nMzAxbWlriYgEQo6uFPkQB2euE7RqxYsDv99fzTLyKi4uT1dXVAsRWNDY2nm9tbWVOTk4KJH9PT89rHJOHgH0nWxZGEwDL6Uph5eyVInt+Q3IcB/k9nj6pKoq5ACMDVXjVXwOJUWj0cXBwMFJRUeHCnFdEedQuwcgIINmt0GgKX9lKxwYih1dXV18plUoPIF8oLr/9vXx5VgSTwJ8BfdbR0fE0Go3uGQwGBUC7V4EI8QeASoO1yr+agQAAAABJRU5ErkJggg==");\n    cursor: pointer;\n}\n\ndiv[dji-role="app"][dji-state="active"] div[dji-role="icon"] {\n    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAABGdBTUEAALGPC/xhBQAAA0dJREFUOBGFVFtIFGEUPrOzF9ddzd1M09AUNRVfKoykyHywtELqpQdNikoxssUeAgkJ0lBLg8gww1tFkCZlFIUQmBa+REolFdnuoq5E3nZ2U/c6O/6df3S8ph3YOXMu3zf/nv+cw8A6QgjJvd7E5Y9N8r5gvRxK8jeWMQzzbh3I6hCSMPjb5vaQ6pjDpqGoDCNBPezlyVvqp/HVKIBVTkwM+/jVU1tSM64zWrzbAUjQIpCxx0UqP1cUhViTk1QX8JSji7EVZEgUf/Mh11DbaksGQtRLE5e9M4zz3HFdT/EZPSU0SjGZ9IJE4eUN1praFm6fRKRVs84De7QTCCAZezW2QA3rEvMJ8b/Xxh289cjWhLjNEsd8jDAf+p3tUZkmJ61PVIZptvTuxAzWSBRDxaioeR8h5fWTXhoX8zJNjr7v7vaVZAnp+ZbuOSIjKaubcM7RzD2Nw96lJqlomBSk3IwCSxcG4yghvbVUDw+liVnmHQTIhgB/1tXXFq1WyJd9b5nB+wB25wzytilBgQFu4FVsk1IOEaxqi6E57+rv2FlCQigiPUXjyUrTKiX0r3Ef1D+1w9ZwBQRq5krMohoY8rI/Br00TV33xBbpdIMgm7D7ZIJAIiRwR49Da6gcA5OFF10tHVOAlwJUUzGP8FB0YwxedM2INn1Q/LiVF+QheoWMZZkRifBIqsZ153LoQltkHwoUQZKOiVDA7eJQoKd73jktxhA/vEknFzu91uUBV9JRcx6tWaCWdfe2Rvv9r2YpOUMCN+VjkY0zvo79JGehTIY9VKhWQWMMdjb9zNSM4FfVbMUSL4r0lyVP9X0rzBNBQrSqH4kKkOe91LQD5YZgDhhGbMrGdjtb2WgV6K1RqXnMiZra2NjQ8MxORAeAo9wQYkUiM7UXZhNbJKzqAdda18qlzidCUADrTdulkb3snpZn7dfOdvc6hD/Ts7QdRCnM1r+5dEp/EsnGqGOBjBpIGE9HCk+2MFLUv0pwNotO6Psu5upOS6eiOcvIqIOecM2twTC2+K3KL7g1uJ2JqvPSiShuTUFCcZ/hbHbiHrPQ0aH7DPdbFcZi1wL+c2jwi7TAPxF47eyxoCvjnM8YGqyQq5TwDWOmtcj+ApRjxJjiB7kiAAAAAElFTkSuQmCC");\n    cursor: pointer;\n}\n\ndiv[dji-role="app"][dji-busy] div[dji-role="icon"] {\n    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAABGdBTUEAALGPC/xhBQAAA3hJREFUOBF9k19IU1Ecx8+9u845/24PkVrqgyKoVEJB/ikRtB40QUOUSihtTKzQR03yQSTqSQlmukoRZJmCgVn24B+EgmCEJfqkE10vtWjTptPNzdv3d/TKtOzCub9zf38+95zv+R2B/eeRZfmG2Ww2OJ1Of0xMDKutrW0VBGH6qBLhXwFAyJ/i8/kMJSUl5YFAIFGlUtlHR0dtkiTVIrYAqHy49i8YQLFzc3Omjo4O3crKyhkUxAQVrSYmJn5paGj4lZGRcRfA70ExdgAGUGpvb+8zi8VyFklhwYnBc0A8FRUVH2pqagi4oMREZQJQHPR5AtAF+DhIq9V6srOzf9KWcnNzXeHh4ZuUj1ztwMDApb6+vheYH1cY3MIhzM7ODhcUFHgwZIwdk8m0vr29jZAst7W1cev3++Wuri4fxSmvsLBwY35+fliBKStLhUZ6OPmKysrKturq6sIhNs+rqqriFofAjEZjSHl5ORcff9CStrAplCBichEreGq320lsRlsxGAwH9EpISKDQ/lNdXS1GRUVtk2N5efkUVmwA56UqNja2p6WlJRkfxyiYlZXlzc/PV9OcHofDwQYHB1l8fDz9iPtEUSSIamlpib7DoF+Cx+MJqCDsLZvNdppn4YUVqjFYUlISi46O5iAcCtNoNCwzM5PirLOzk01NTdFB8DLY6Li4uCVJp9OJ0OIbGvMkRfLy8jabm5v3t1lUVMQLFEtbbmpqYrS68fFxHkP9Cm6ILIBq8nq9m403c4wpOneEV4z03Xs0qpYiDp44r9p7QSNWWVkZWFtbU6FtnGNjYzMAtkrMLDSEavRv2vOdEXu56i1LsiwVvRZYfCF30daCD6Gnp4cRiIKQYxYgI6A2kYnsPttyXt4DcaNhG8LW21LZv757W/r7+7mfVtTd3c2Ghoa4WABs0NUiECVITGbXeOahFwHbG6/4vSeusunpaQkFO1arNeB2u0OQyq8htvoxLS3tjlJKXclbQnEE29Cd39K7iQnumpycpAbnTQ6wB438GaMO8x9KDcGsGLviKN49u7ga5cY0UnGj0AWNvtbX1zvT09MPgChHkJ+zTLbDPmG7+43Ki0N17/3XHeri4uIUahuIbB8ZGXmlVqvNgC4qPwi2knCbzQB4HsDHCJzDcEARC/O6HuJu5pSWlj5wuVwLer1eAmj+KBBB/wBMlnqIOqbMuwAAAABJRU5ErkJggg==");\n    cursor: default;\n}\n\ndiv[dji-role="app"] div[dji-role="not-auth-info"] {\n    display: none;\n    position: absolute;\n    bottom: calc(var(--dji-icon-size) - var(--dji-menu-item-height));\n    left: calc(var(--dji-icon-size) + 8px);\n    width: 210px;\n    padding: 16px;\n    box-sizing: border-box;\n\n    font-family: "Roboto", "sans-serif";\n    font-size: 14px;\n\n    background-color: #FEFEFE;\n    color: rgba(0, 0, 0, 0.87);\n    box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px 0 rgba(0,0,0,0.20);\n}\ndiv[dji-role="app"][dji-state="not-auth"][dji-not-auth-info] div[dji-role="not-auth-info"] {\n    display: block;\n}\n\ndiv[dji-role="app"] div[dji-role="menu"], div[dji-role="app"] div[dji-role="dev-menu"] {\n    display: none;\n    position: absolute;\n    bottom: calc(var(--dji-icon-size) - var(--dji-menu-item-height));\n    left: calc(var(--dji-icon-size) + 8px);\n    width: 180px;\n    padding: 2px 0;\n    box-sizing: border-box;\n\n    background-color: #FEFEFE;\n    box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px 0 rgba(0,0,0,0.20);\n}\ndiv[dji-role="app"][dji-menu] div[dji-role="menu"] {\n    display: block;\n}\ndiv[dji-role="app"] div[dji-role="dev-menu"] {\n    position: fixed;\n    display: block;\n    top: auto;\n    right: 0;\n    bottom: 0;\n}\n\ndiv[dji-role="app"] div[dji-role$="menu"] div[dji-role="menu-item"] {\n    position: relative;\n    width: 100%;\n    height: var(--dji-menu-item-height);\n    padding: 0 10px 0 0;\n    margin: 4px 0;\n    box-sizing: border-box;\n    line-height: var(--dji-menu-item-height);\n    font-size: 14px;\n\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    overflow: hidden;\n\n    color: rgba(0,0,0,0.6);\n    cursor: pointer;\n}\n\ndiv[dji-role="app"] div[dji-role$="menu"] div[dji-role="menu-item"]::before {\n    display: inline-block;\n\n    width: 40px;\n    height: 100%;\n    box-sizing: border-box;\n\n    margin: 0;\n    padding: 0 0 0 10px;\n\n    line-height: var(--dji-menu-item-height);\n    content: "";\n    background: url(attr(dji-icon)) 0 0 no-repeat;\n    width: 24px;\n\theight: 24px;\n\tbackground-repeat: no-repeat;\n\n    text-align: left;\n}\n\ndiv[dji-role="app"] div[dji-role$="menu"] div[dji-role="menu-item"]:hover {\n    background-color: rgba(0,0,0,0.06);\n}\n\ndiv[dji-role="app"] div[dji-role$="menu"] div[dji-role="menu-item-separator"] {\n    position: relative;\n    width: 100%;\n    height: 1px;\n    box-sizing: border-box;\n    background-color: rgba(0,0,0,0.20);\n}\n        ';
        y.append(a);
    }
    function h(a) {
        c.hasAttribute("dji-busy") ||
            ("not-auth" === c.getAttribute("dji-state")
                ? m()
                : c.hasAttribute("dji-menu")
                  ? c.removeAttribute("dji-menu")
                  : c.setAttribute("dji-menu", ""));
    }
    async function m() {
        c.removeAttribute("dji-menu");
        if (!c.hasAttribute("dji-busy"))
            if ("not-auth" === c.getAttribute("dji-state"))
                c.hasAttribute("dji-not-auth-info")
                    ? c.removeAttribute("dji-not-auth-info")
                    : c.setAttribute("dji-not-auth-info", "");
            else if (
                "not-auth" === c.getAttribute("dji-state") ||
                "not-active" === c.getAttribute("dji-state")
            ) {
                c.setAttribute("dji-busy", "");
                c.setAttribute("dji-state", "");
                const a = await p(),
                    f = !(!a || !a.authenticated);
                f &&
                    a.user &&
                    (C.textContent =
                        a.user.name || a.user.username || a.user.email);
                c.setAttribute("dji-state", f ? "active" : "not-auth");
                c.removeAttribute("dji-busy");
            } else
                "active" === c.getAttribute("dji-state") &&
                    (c.setAttribute("dji-busy", ""),
                    await k(),
                    c.setAttribute("dji-state", "not-active"),
                    c.removeAttribute("dji-busy"));
    }
    async function p() {
        return new Promise((a) => {
            chrome.runtime.sendMessage(
                {message: "com.donjohnston.sru.activate"},
                a,
            );
        });
    }
    async function k() {
        return new Promise((a) => {
            chrome.runtime.sendMessage(
                {message: "com.donjohnston.sru.deactivate"},
                a,
            );
        });
    }
    function r() {
        r.__busy ||
            ((r.__busy = !0),
            chrome.runtime.sendMessage(
                {message: "com.donjohnston.sru.query.state"},
                function (a) {
                    const f = !(!a || !a.authenticated),
                        e = !(!a || !a.active);
                    chrome.runtime.lastError || !a || !a.loaded || a.busy
                        ? (c.removeAttribute("dji-menu"),
                          c.setAttribute("dji-busy", ""))
                        : (a &&
                              f &&
                              a.user &&
                              (C.textContent =
                                  a.user.name ||
                                  a.user.username ||
                                  a.user.email),
                          f && c.removeAttribute("dji-not-auth-info"),
                          c.setAttribute(
                              "dji-state",
                              f ? (e ? "active" : "not-active") : "not-auth",
                          ),
                          c.removeAttribute("dji-busy"));
                    r.__busy = !1;
                },
            ));
    }
    async function B() {
        await dji.utils.waitDOMContentLoaded();
        await dji.appsToolbar.init();
        g();
        c.setAttribute("dji-state", "");
        c.setAttribute("dji-busy", "");
        c.setAttribute("dji-visible", "");
        r();
        chrome.runtime.onMessage.addListener(function (a, f, e) {
            if ("com.donjohnston.sru.notification" === a.message) {
                f = !1;
                switch (a.reason) {
                    case "load":
                    case "activationStatus":
                    case "activate":
                    case "deactivate":
                    case "update_topic_finished":
                    case "update_topic_started":
                    case "update_user_settings":
                        f = !0;
                }
                f && r();
            }
        });
    }
    let t = null,
        y = null,
        c = null,
        z = null,
        u = null,
        C = null,
        n = null;
    dji.utils.os().chrome && dji.utils.isGoogleForms() && B();
})();
