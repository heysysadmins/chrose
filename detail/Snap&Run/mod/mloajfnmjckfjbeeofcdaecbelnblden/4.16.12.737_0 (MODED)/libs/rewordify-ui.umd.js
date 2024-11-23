!(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module
        ? e(exports, require("@donjohnston/core-lib-utils"))
        : "function" == typeof define && define.amd
          ? define(["exports", "@donjohnston/core-lib-utils"], e)
          : e(
                ((t =
                    "undefined" != typeof globalThis
                        ? globalThis
                        : t || self).__RewordifyUI = {}),
                t.__DjiCoreLibUtils,
            );
})(this, function (t, e) {
    "use strict";
    class i {
        constructor(t, e) {
            (this.m_element = t),
                (this.m_callback = e),
                (this.m_dragOverlayContainer = null),
                (this.ResizeBounds = {MinWidth: 200, MinHeight: 200}),
                (this.m_drag = {
                    state: 0,
                    start: {x: 0, y: 0},
                    end: {x: 0, y: 0},
                    offset: {x: 0, y: 0},
                    initial: {height: 0, width: 0},
                    hitTest: 0,
                    action: 0,
                    onMouseDown: null,
                    onMouseUp: null,
                    onMouseMove: null,
                    onMouseOver: null,
                    onMouseOut: null,
                });
        }
        __initialize() {
            var t,
                e = this.m_element.querySelectorAll("iframe"),
                i = [
                    {hitTest: 3, class: "dji-geom-ctrl-resize-top"},
                    {hitTest: 7, class: "dji-geom-ctrl-resize-bottom"},
                    {hitTest: 9, class: "dji-geom-ctrl-resize-left"},
                    {hitTest: 5, class: "dji-geom-ctrl-resize-right"},
                    {hitTest: 2, class: "dji-geom-ctrl-resize-top-left"},
                    {hitTest: 4, class: "dji-geom-ctrl-resize-top-right"},
                    {hitTest: 6, class: "dji-geom-ctrl-resize-bottom-right"},
                    {hitTest: 8, class: "dji-geom-ctrl-resize-bottom-left"},
                ];
            for (t = 0; t < i.length; t++) {
                var s = document.createElement("div");
                (s.hitTest = i[t].hitTest),
                    s.setAttribute("class", i[t].class),
                    this.m_element.appendChild(s);
            }
            (this.m_dragOverlayContainer = document.createElement("div")),
                this.m_dragOverlayContainer.classList.add(
                    "geomCtrlContainerOverlay",
                ),
                this.m_element.appendChild(this.m_dragOverlayContainer);
            var n = [document];
            for (t = 0; t < e.length; t++)
                try {
                    n.push(e[t].contentDocument, e[t]);
                } catch (i) {
                    console.error(
                        "Error while attaching to iframe",
                        e[t],
                        ":",
                        i,
                    );
                }
            for (
                this.m_drag.onMouseDown = (t) => {
                    if (this.__isDraggable(t.target) && this.__onDragStart(t)) {
                        t.preventDefault(), t.stopPropagation();
                        for (var e = 0; e < n.length; e++)
                            n[e].addEventListener(
                                "mousemove",
                                this.m_drag.onMouseMove,
                                !0,
                            ),
                                n[e].addEventListener(
                                    "mouseup",
                                    this.m_drag.onMouseUp,
                                    !0,
                                );
                        document.addEventListener(
                            "mouseover",
                            this.m_drag.onMouseOver,
                            !0,
                        ),
                            document.addEventListener(
                                "mouseout",
                                this.m_drag.onMouseOut,
                                !0,
                            );
                    }
                },
                    this.m_drag.onMouseMove = (t) => {
                        this.__onDrag(t) &&
                            (t.preventDefault(), t.stopPropagation());
                    },
                    this.m_drag.onMouseOver = (t) => {
                        t.preventDefault(), t.stopPropagation();
                    },
                    this.m_drag.onMouseOut = (t) => {
                        !t.toElement ||
                        (t.toElement === document &&
                            t.toElement === document.documentElement)
                            ? this.m_drag.onMouseUp(t)
                            : (t.preventDefault(), t.stopPropagation());
                    },
                    this.m_drag.onMouseUp = (t) => {
                        this.__onDragEnd(t),
                            t.preventDefault(),
                            t.stopPropagation();
                        for (var e = 0; e < n.length; e++)
                            n[e].removeEventListener(
                                "mousemove",
                                this.m_drag.onMouseMove,
                                !0,
                            ),
                                n[e].removeEventListener(
                                    "mouseup",
                                    this.m_drag.onMouseUp,
                                    !0,
                                );
                        document.removeEventListener(
                            "mouseover",
                            this.m_drag.onMouseOver,
                            !0,
                        ),
                            document.removeEventListener(
                                "mouseout",
                                this.m_drag.onMouseOut,
                                !0,
                            );
                    },
                    t = 0;
                t < n.length;
                t++
            )
                n[t].addEventListener("mousedown", this.m_drag.onMouseDown, !0);
        }
        __isDraggable(t) {
            for (; t && "function" == typeof t.getAttribute; ) {
                if ("true" === t.getAttribute("dji-non-draggable")) return !1;
                t = t.parentElement;
            }
            return !0;
        }
        __onDragStart(t) {
            if (0 !== this.m_drag.state) return this.m_drag.onMouseUp(t), !1;
            if (1 !== t.which) return !1;
            if ("INPUT" == t.target.nodeName) return !1;
            var e = this.__hitTest(t.target, {x: t.browserX, y: t.browserY});
            return (
                0 != e &&
                (1 == e
                    ? this.__addClassToElement(
                          this.m_dragOverlayContainer,
                          "dji-geom-ctrl-move",
                      )
                    : 3 == e || 7 == e
                      ? this.__addClassToElement(
                            document.documentElement,
                            "dji-geom-ctrl-resize-ns",
                        )
                      : 9 == e || 5 == e
                        ? this.__addClassToElement(
                              document.documentElement,
                              "dji-geom-ctrl-resize-ew",
                          )
                        : 2 == e || 6 == e
                          ? this.__addClassToElement(
                                document.documentElement,
                                "dji-geom-ctrl-resize-nwse",
                            )
                          : (4 != e && 8 != e) ||
                            this.__addClassToElement(
                                document.documentElement,
                                "dji-geom-ctrl-resize-nesw",
                            ),
                (this.m_drag.state = 1),
                (this.m_drag.hitTest = e),
                (this.m_drag.start.x = this.m_drag.end.x = t.screenX),
                (this.m_drag.start.y = this.m_drag.end.y = t.screenY),
                (this.m_drag.action = 1 == e ? 1 : 2),
                !0)
            );
        }
        __onDrag(t) {
            if (1 == this.m_drag.state || 2 == this.m_drag.state) {
                var e = this.m_element.getBoundingClientRect();
                if (
                    ((this.m_drag.end.x = t.screenX),
                    (this.m_drag.end.y = t.screenY),
                    1 == this.m_drag.state)
                )
                    5 <
                        Math.sqrt(
                            (this.m_drag.end.x - this.m_drag.start.x) *
                                (this.m_drag.end.x - this.m_drag.start.x) +
                                (this.m_drag.end.y - this.m_drag.start.y) *
                                    (this.m_drag.end.y - this.m_drag.start.y),
                        ) &&
                        ((this.m_drag.state = 2),
                        (this.m_drag.start.x = this.m_drag.end.x = t.screenX),
                        (this.m_drag.start.y = this.m_drag.end.y = t.screenY),
                        (this.m_drag.offset.x = this.m_drag.start.x - e.left),
                        (this.m_drag.offset.y = this.m_drag.start.y - e.top),
                        (this.m_drag.initial.height = e.height),
                        (this.m_drag.initial.width = e.width),
                        this.__addClassToElement(
                            this.m_element,
                            "dji-geom-ctrl-dragging",
                        ),
                        (this.m_element.style.left = e.left + "px"),
                        (this.m_element.style.top = e.top + "px"));
                else if (2 == this.m_drag.state) {
                    var i,
                        s,
                        n = this.m_drag.initial.height,
                        o = this.m_drag.initial.width;
                    (2 != this.m_drag.hitTest &&
                        3 != this.m_drag.hitTest &&
                        4 != this.m_drag.hitTest &&
                        1 != this.m_drag.hitTest) ||
                        (s = this.m_drag.end.y - this.m_drag.offset.y),
                        (2 != this.m_drag.hitTest &&
                            9 != this.m_drag.hitTest &&
                            8 != this.m_drag.hitTest &&
                            1 != this.m_drag.hitTest) ||
                            (i = this.m_drag.end.x - this.m_drag.offset.x),
                        8 == this.m_drag.hitTest ||
                        7 == this.m_drag.hitTest ||
                        6 == this.m_drag.hitTest
                            ? (n =
                                  this.m_drag.initial.height +
                                  (this.m_drag.end.y - this.m_drag.start.y))
                            : (2 != this.m_drag.hitTest &&
                                  3 != this.m_drag.hitTest &&
                                  4 != this.m_drag.hitTest) ||
                              (n =
                                  this.m_drag.initial.height +
                                  (this.m_drag.start.y - this.m_drag.end.y)),
                        2 == this.m_drag.hitTest ||
                        9 == this.m_drag.hitTest ||
                        8 == this.m_drag.hitTest
                            ? (o =
                                  this.m_drag.initial.width +
                                  (this.m_drag.start.x - this.m_drag.end.x))
                            : (6 != this.m_drag.hitTest &&
                                  5 != this.m_drag.hitTest &&
                                  4 != this.m_drag.hitTest) ||
                              (o =
                                  this.m_drag.initial.width +
                                  (this.m_drag.end.x - this.m_drag.start.x)),
                        o &&
                            this.ResizeBounds.MinWidth <= o &&
                            (i &&
                                0 < i &&
                                i + o < window.innerWidth &&
                                (this.m_element.style.left = i + "px"),
                            (this.m_element.style.width = o + "px")),
                        n &&
                            this.ResizeBounds.MinHeight <= n &&
                            (s &&
                                0 < s &&
                                s + n < window.innerHeight &&
                                (this.m_element.style.top = s + "px"),
                            (this.m_element.style.height = n + "px"));
                }
            }
            return 2 == this.m_drag.state;
        }
        __onDragEnd(t) {
            if (1 == this.m_drag.state || 2 == this.m_drag.state) {
                this.__removeClassFromElement(
                    this.m_element,
                    "dji-geom-ctrl-dragging",
                ),
                    this.__removeClassFromElement(
                        document.documentElement,
                        "dji-geom-ctrl-resize-ns",
                    ),
                    this.__removeClassFromElement(
                        document.documentElement,
                        "dji-geom-ctrl-resize-ew",
                    ),
                    this.__removeClassFromElement(
                        document.documentElement,
                        "dji-geom-ctrl-resize-nwse",
                    ),
                    this.__removeClassFromElement(
                        document.documentElement,
                        "dji-geom-ctrl-resize-nesw",
                    ),
                    this.__removeClassFromElement(
                        this.m_dragOverlayContainer,
                        "dji-geom-ctrl-move",
                    );
                var e =
                    2 == this.m_drag.action &&
                    (this.m_drag.end.x != this.m_drag.start.x ||
                        this.m_drag.end.y != this.m_drag.start.y);
                (this.m_drag.state = 0),
                    (this.m_drag.action = 0),
                    e && this.m_callback && this.m_callback();
            }
        }
        __hitTest(t, e) {
            if (t.hasOwnProperty("hitTest") && t.hitTest) return t.hitTest;
            for (; t && t != this.m_element; )
                t =
                    t.nodeType == Node.DOCUMENT_NODE &&
                    t.defaultView &&
                    t.defaultView.top != t.defaultView &&
                    t.defaultView.frameElement
                        ? t.defaultView.frameElement
                        : t.parentNode;
            return t == this.m_element ? 1 : 0;
        }
        __addClassToElement(t, e) {
            t &&
                e &&
                -1 == t.className.indexOf(e) &&
                (t.className ? (t.className += " " + e) : (t.className = e));
        }
        __removeClassFromElement(t, e) {
            if (t && e) {
                var i = " " + e,
                    s = t.className.indexOf(i);
                -1 == s && ((i = e + " "), (s = t.className.indexOf(i))),
                    -1 == s && ((i = e), (s = t.className.indexOf(i))),
                    -1 != s && (t.className = t.className.replace(i, ""));
            }
        }
    }
    class s {
        constructor() {
            (this.mPopup = {
                main: null,
                close: null,
                body: null,
                bodyText: null,
                isActive: !1,
            }),
                (this.mEventTarget = new EventTarget()),
                (this.mLayoutAttempts = 0),
                this.init();
        }
        addEventListener(t, e) {
            this.mEventTarget.addEventListener(t, e);
        }
        removeEventListener(t, e) {
            this.mEventTarget.removeEventListener(t, e);
        }
        get isActive() {
            return this.mPopup.isActive;
        }
        get bodyTextElement() {
            return this.mPopup.bodyText;
        }
        show() {
            e.Utils.addClassToElement(this.mPopup.main, "dji-working"),
                e.Utils.addClassToElement(this.mPopup.main, "dji-visible"),
                document.body.appendChild(this.mPopup.main);
        }
        init() {
            var t, e;
            (this.mPopup.main = document.createElement("div")),
                this.mPopup.main.setAttribute(
                    "dji-sru-rewordify-popup",
                    "true",
                ),
                this.mPopup.main.addEventListener(
                    "mousedown",
                    (t) => this.onMouseDown(t),
                    !0,
                ),
                (this.mPopup.close = document.createElement("div")),
                this.mPopup.close.setAttribute("class", "dji-sru-close-btn"),
                this.mPopup.close.addEventListener(
                    "mousedown",
                    (t) => this.onMouseDown(t),
                    !0,
                ),
                this.mPopup.close.addEventListener(
                    "click",
                    () => this.onClose(),
                    !0,
                ),
                this.mPopup.main.appendChild(this.mPopup.close),
                (this.mPopup.body = document.createElement("div")),
                this.mPopup.body.setAttribute("dji-sru-rewordify-body", "true"),
                this.mPopup.body.setAttribute("tabindex", "0"),
                (this.mPopup.bodyText = document.createElement("div")),
                this.mPopup.bodyText.setAttribute("dji-non-draggable", "true"),
                this.mPopup.body.appendChild(this.mPopup.bodyText),
                this.mPopup.main.appendChild(this.mPopup.body),
                document.body.appendChild(this.mPopup.main),
                (t = this.mPopup.main),
                (e = new i(t, null)).__initialize(),
                (t.__geometryController = e);
        }
        onMouseDown(t) {
            let e = t.toElement;
            if (
                e != this.mPopup.main.tl &&
                e != this.mPopup.main.bl &&
                e != this.mPopup.main.br
            ) {
                for (; e && e != this.mPopup.body && e != this.mPopup.main; )
                    e = e.parentElement;
                e != this.mPopup.body &&
                    (t.preventDefault(), t.stopPropagation());
            }
        }
        activate(t) {
            (this.mPopup.isActive = !0),
                (this.mPopup.bodyText.innerHTML = t),
                (this.mPopup.body.scrollTop = 0);
        }
        async onDeactivate() {
            e.Utils.preventInputEventsOnBodyElements(!1),
                e.Utils.removeClassFromElement(this.mPopup.main, "dji-visible"),
                this.mPopup.isActive &&
                    ((this.mPopup.bodyText.innerHTML = ""),
                    this.mPopup.main.style.setProperty("left", "-10000px"),
                    this.mPopup.main.style.setProperty("top", "-10000px"),
                    this.mPopup.main.style.setProperty("width", "auto"),
                    this.mPopup.main.style.setProperty("height", "auto"),
                    (this.mPopup.isActive = !1)),
                e.Utils.removeClassFromHtmlElements("dji-sru-rewordify-active"),
                e.Utils.removeClassFromElement(
                    document.documentElement,
                    "dji-sru-bodycover",
                );
        }
        onClose() {
            this.mEventTarget.dispatchEvent(new CustomEvent("close"));
        }
        layoutPopup(t, e, i) {
            if (
                this.mPopup.main.ownerDocument.documentElement.hasAttribute(
                    "dji-sru-fullscreen-popup",
                )
            )
                return (
                    (this.mPopup.body.scrollTop = 0),
                    void this.mPopup.body.focus()
                );
            (this.mLayoutAttempts = 0), this.doLayout(t, e, i);
        }
        doLayout(t, i, s) {
            let n = t.activeElementInfo.iframes,
                o = this.mPopup.main.getBoundingClientRect(),
                r = this.mPopup.body.getBoundingClientRect(),
                a = Math.max(1, window.devicePixelRatio),
                l = e.Utils.elementIsVisible(t.element, null),
                d = 30 / a,
                m = o.height,
                u = o.width;
            (this.mPopup.body.scrollTop = 0),
                (u = Math.max(50, Math.min(s.left - 2 * d, u))),
                (this.mPopup.main.style.width = u + "px"),
                (o = this.mPopup.main.getBoundingClientRect()),
                (m = o.height),
                this.mPopup.body.scrollHeight > 0 &&
                    (m = Math.min(
                        400,
                        this.mPopup.body.scrollHeight + r.height,
                    )),
                (m = Math.max(50, Math.min(window.innerHeight - 2 * d, m))),
                (this.mPopup.main.style.height = m + "px"),
                (o = this.mPopup.main.getBoundingClientRect());
            let h = i.top,
                c = i.left;
            if (n.length > 0)
                for (let t = 0; t < n.length; t++) {
                    let e = n[t].getBoundingClientRect();
                    (h += e.top), (c += e.left);
                }
            window.innerHeight < h + m &&
                (h = window.innerHeight - m - d / 2 - 1),
                (h = Math.max(h, d)),
                (c = Math.max(0, l ? c + i.width + 10 : c)),
                s.left < c + o.width + d && (c = s.left - o.width - d - 3),
                (this.mPopup.main.style.top = h + "px"),
                (this.mPopup.main.style.left = c + "px"),
                this.mPopup.body.focus(),
                e.Utils.removeClassFromElement(this.mPopup.main, "dji-working"),
                r.height < 10 &&
                    window.setTimeout(() => {
                        ++this.mLayoutAttempts > 3 || this.doLayout(t, i, s);
                    }, 10);
        }
    }
    class n {
        constructor(t, e, i) {
            const s = this;
            (i = i || {}),
                (this.m_this = t),
                (this.m_handler = e),
                (this.m_timer = null),
                (this.m_options = {
                    timeout: isNaN(i.timeout) ? 0 : i.timeout,
                    singleShot:
                        !i.hasOwnProperty("singleShot") ||
                        Boolean(i.singleShot),
                }),
                (this.m_internalHandler = function () {
                    s.m_options.singleShot && (s.m_timer = null),
                        s.m_handler.call(s.m_this, ...arguments);
                });
        }
        trigger(t) {
            this.stop();
            let e = [this.m_internalHandler, ...arguments];
            isNaN(e[1]) && (e[1] = this.m_options.timeout),
                this.m_options.singleShot
                    ? (this.m_timer = setTimeout(...e))
                    : (this.m_timer = setInterval(...e));
        }
        stop() {
            this.m_timer &&
                (this.m_options.singleShot
                    ? clearTimeout(this.m_timer)
                    : clearInterval(this.m_timer),
                (this.m_timer = null));
        }
    }
    class o {
        constructor(t, e, i) {
            (this.m_ui = null), (this.m_options = null), (this.m_timers = null);
            const s = this;
            (this.m_ui = {
                mainView: document.createElement("dji-sru-toast"),
                contentView: document.createElement("dji-sru-toast-content"),
                textView: document.createElement("dji-sru-toast-content-text"),
                actionView: void 0,
            }),
                (this.m_timers = {autoHide: void 0}),
                (this.m_options = {
                    error: Boolean(e && e.error),
                    closeOnClick: Boolean(e && e.closeOnClick),
                    action: void 0,
                }),
                e &&
                    e.action &&
                    ((this.m_options.action = {
                        url: e.action.url || null,
                        message: e.action.message || null,
                        close: Boolean(e.action.close),
                    }),
                    (this.m_ui.actionView = document.createElement(
                        "dji-sru-toast-content-action",
                    ))),
                (this.m_ui.textView.innerText = t || ""),
                this.m_ui.contentView.appendChild(this.m_ui.textView),
                this.m_ui.actionView &&
                    ((this.m_ui.actionView.innerText = "TOPICS"),
                    this.m_ui.contentView.appendChild(this.m_ui.actionView),
                    this.m_ui.mainView.setAttribute("dji-sru-mode", "action")),
                this.m_ui.mainView.appendChild(this.m_ui.contentView),
                document.documentElement.appendChild(this.m_ui.mainView),
                this.m_options.closeOnClick &&
                    this.m_ui.contentView.addEventListener(
                        "click",
                        function () {
                            s.__destroy();
                        },
                    ),
                this.m_options.error &&
                    this.m_ui.contentView.setAttribute(
                        "dji-sru-toast-error",
                        "true",
                    ),
                this.m_ui.actionView &&
                    this.m_ui.actionView.addEventListener(
                        "click",
                        function (t) {
                            t.preventDefault(),
                                t.stopPropagation(),
                                s.__onAction();
                        },
                    ),
                !isNaN(i) &&
                    i > 0 &&
                    ((this.m_timers.autoHide = new n(this, this.__destroy)),
                    this.m_timers.autoHide.trigger(i));
        }
        static show(t, e, i) {
            o.hide(), (o.__instance = new o(t, e, i)), o.applyStyle();
        }
        static applyStyle() {
            const t = document.createElement("style");
            (t.textContent =
                ':root{--dji-sru-toolbar-width:32px;--dji-sru-outlines-width:442px}dji-sru-toast{all:initial}dji-sru-toast *,dji-sru-toast :after,dji-sru-toast :before,dji-sru-toast:after,dji-sru-toast:before{all:unset}dji-sru-toast{background-color:transparent;bottom:0;box-sizing:border-box;display:block;height:0;line-height:0;margin:0;padding:0;position:fixed;width:100%;z-index:10000000000000000!important}.dji-sru-active dji-sru-toast{width:calc(100% - var(--dji-sru-toolbar-width))}.dji-sru-outline-active dji-sru-toast{width:calc(100% - var(--dji-sru-outlines-width))}dji-sru-toast>dji-sru-toast-content{background-color:#000;border-radius:2px;bottom:50px;box-sizing:border-box;color:#fff;display:block;font-family:Roboto,"sans-serif";font-size:14px;font-weight:400;line-height:30px;margin:0 auto;padding:10px 24px;position:relative;user-select:none;width:433px}dji-sru-toast>dji-sru-toast-content[dji-sru-toast-error]{background-color:#701010}dji-sru-toast[dji-sru-mode=action]>dji-sru-toast-content{grid-column-gap:48px;display:grid;grid-template-columns:300px 49px;width:444px}dji-sru-toast>dji-sru-toast-content>dji-sru-toast-content-text{display:block;position:relative;text-align:center;width:100%}dji-sru-toast>dji-sru-toast-content>dji-sru-toast-content-action{color:#68efad;cursor:pointer;display:block;font-weight:500;position:relative;width:100%}'),
                document.documentElement.append(t);
        }
        static hide() {
            o.__instance && (o.__instance.__destroy(), (o.__instance = void 0));
        }
        __destroy() {
            this.m_ui && this.m_ui.mainView.remove(),
                this.m_timers &&
                    this.m_timers.autoHide &&
                    this.m_timers.autoHide.stop(),
                o.__instance === this && (o.__instance = void 0);
        }
        __onAction() {
            var t, e, i, s;
            if (
                null ===
                    (e =
                        null === (t = this.m_options) || void 0 === t
                            ? void 0
                            : t.action) || void 0 === e
                    ? void 0
                    : e.message
            )
                chrome.runtime.sendMessage(
                    {message: this.m_options.action.message},
                    () => {
                        var t, e;
                        (null ===
                            (e =
                                null === (t = this.m_options) || void 0 === t
                                    ? void 0
                                    : t.action) || void 0 === e
                            ? void 0
                            : e.close) && this.__destroy();
                    },
                );
            else if (
                null ===
                    (s =
                        null === (i = this.m_options) || void 0 === i
                            ? void 0
                            : i.action) || void 0 === s
                    ? void 0
                    : s.url
            ) {
                const t = o.__urlToWindowName(this.m_options.action.url);
                window.open(this.m_options.action.url, t),
                    this.m_options.action.close && this.__destroy();
            }
        }
        static __urlToWindowName(t) {
            return "_blank";
        }
    }
    o.__instance = void 0;
    class r {
        static initialize() {
            if (!r.overlayDiv) {
                let t = document.querySelector("div#dji-sru-busy-state");
                if (t) return void (r.overlayDiv = t);
                (t = document.createElement("div")),
                    (t.id = "dji-sru-busy-state"),
                    e.Utils.preventInputEventsOnTree(t, !0),
                    document.body.appendChild(t),
                    (r.overlayDiv = t),
                    r.applyStyle();
            }
        }
        static enterBusyState() {
            r.initialize(),
                e.Utils.addClassToElement(
                    document.documentElement,
                    "dji-sru-busy-state",
                );
        }
        static leaveBusyState() {
            e.Utils.removeClassFromElement(
                document.documentElement,
                "dji-sru-busy-state",
            );
        }
        static applyStyle() {
            const t = document.createElement("style");
            (t.textContent =
                ".dji-all-initial{all:initial!important}#dji-sru-busy-state{background-color:hsla(0,0%,8%,.5);cursor:default!important;display:none;height:100%;left:0;position:fixed;top:0;width:100%;z-index:2147483647}html.dji-sru-busy-state #dji-sru-busy-state{cursor:wait!important;display:block}html.dji-sru-main-container-busy #dji-sru-busy-state{cursor:default!important;display:block;width:calc(100% - 442px)}html.dji-sru-bodycover #dji-sru-busy-state{display:block}.dji-sru-initial *{box-sizing:initial;-webkit-box-sizing:initial;margin:0;padding:initial}.dji-sru-initial-display{display:initial!important}html[dji-sru-active] #__dji_sru_main_container .sHideObjectEmbedPlaceholderd{display:none!important}.dji-sru-pagination-container{-webkit-backface-visibility:hidden!important;background-color:#096;bottom:0;display:none;left:32px;overflow:hidden!important;position:absolute;top:0;width:410px!important}.dji-sru-pagination-container-viewport{width:410px;z-index:100}.dji-sru-pagination-container-overlay,.dji-sru-pagination-container-viewport{-webkit-backface-visibility:hidden!important;bottom:0;left:0;overflow:hidden!important;position:absolute;top:0}.dji-sru-pagination-container-overlay{background-color:transparent;display:none;right:0;z-index:999999}.dji-sru-pagination-container.dji-transition .dji-sru-pagination-container-overlay{display:block}\n    /*!*-webkit-backface-visibility: hidden !important;*!*/.dji-sru-pagination-container-viewport .dji-sru-page.dji-sru-page-current{background-color:red}.dji-sru-pagination-container-viewport .dji-sru-page.dji-sru-page-next{background-color:#00f}.dji-sru-pagination-container .dji-sru-pagination-container-viewport.dji-transition{-webkit-transition:left .2s linear}.dji-sru-pagination-container .dji-sru-pagination-container-viewport.dji-notransition{-webkit-transition:none!important}"),
                document.documentElement.append(t);
        }
    }
    function a() {
        const t = document
            .getElementsByClassName("dji-sru-google-translate-logo")
            .item(0);
        null !== t &&
            0 ==
                document.getElementsByClassName("dji-sru-rewordify-translated")
                    .length &&
            document.body.removeChild(t);
    }
    (r.overlayDiv = null),
        (t.DocumentParser = class {}),
        (t.ITranslator = class {}),
        (t.RewordifyUIController = class {
            constructor(t = 1) {
                (this.mEventTarget = new EventTarget()),
                    (this.mDelegate = null),
                    (this.m_token = null),
                    (this.mFluencyLevel = 1),
                    (this.m_active = !1),
                    (this.m_popup = new s()),
                    this.m_popup.addEventListener("close", () => {
                        this.onDeactivate();
                    }),
                    this.setFluencyLevel(t),
                    (this.m_context = {
                        initialContext: null,
                        selectionContext: null,
                        boundingRect: void 0,
                    });
            }
            setFluencyLevel(t) {
                this.mFluencyLevel = t;
            }
            enableTranslation(t) {
                this.mDelegate.enableTranslation(t);
            }
            initialize(t) {
                (this.mDelegate = t), this.injectStyleInDocument(document);
            }
            addEventListener(t, e) {
                this.mEventTarget.addEventListener(t, e);
            }
            removeEventListener(t, e) {
                this.mEventTarget.removeEventListener(t, e);
            }
            isActive() {
                return this.m_active;
            }
            async activate(t) {
                return (
                    !!this.isActive() ||
                    (t ||
                        (t = {
                            showBusyEffect: !1,
                            showTextNotFoundToast: !1,
                            preventInputEventsOnBodyElements: !1,
                        }),
                    (this.m_active = !0),
                    this.mEventTarget.dispatchEvent(new Event("ACTIVATE")),
                    t.preventInputEventsOnBodyElements &&
                        e.Utils.preventInputEventsOnBodyElements(!0),
                    (this.m_active = await this.start(t)),
                    !!this.m_active ||
                        (t.showTextNotFoundToast &&
                            this.showTextNotFoundToast(),
                        t.preventInputEventsOnBodyElements &&
                            e.Utils.preventInputEventsOnBodyElements(!1),
                        t.showBusyEffect && r.leaveBusyState(),
                        this.mEventTarget.dispatchEvent(
                            new Event("DEACTIVATE"),
                        ),
                        !1))
                );
            }
            async deactivate() {
                return (
                    !!this.isActive() && (this.onDeactivate(), this.isActive())
                );
            }
            injectStyleInDocument(t) {
                let e =
                    "html[dji-sru-rewordify-active] span.dji-sru-rewordify-chunk{background-color:rgba(200,0,0,0)}html[dji-sru-rewordify-active] span.dji-sru-rewordify-chunk.dji-sru-rewordify-match:not([dji-sru-rewordify-ignore]),html[dji-sru-rewordify-active] span.dji-sru-rewordify-chunk.dji-sru-rewordify-match[dji-sru-rewordify-replace]{cursor:help;font-style:italic}span.dji-sru-rewordify-chunk.dji-sru-rewordify-translated{cursor:help}.dji-sru-active a.dji-sru-google-translate-logo{bottom:0;position:fixed;right:40px;z-index:9999999910}.dji-sru-outline-active a.dji-sru-google-translate-logo{bottom:0;position:fixed;right:445px;z-index:9999999910}a.dji-sru-google-translate-logo img.dji-sru-google-translate-logo-img{background:url(chrome-extension://__MSG_@@extension_id__/resources/images/translatedByGoogle.png) 0 0/130px 48px no-repeat;display:inline-table;height:0;outline:none;padding-bottom:60px;padding-right:145px;width:0}div[dji-sru-rewordify-popup]{background-color:#fff;border:3px solid #4f6175;border-radius:5px;box-sizing:border-box;-webkit-box-sizing:border-box;color:#000!important;display:none;left:30px;min-height:50px;min-width:300px;opacity:0;overflow:visible;padding:0;pointer-events:none;position:fixed;top:30px;z-index:2147483647}html[dji-sru-fullscreen-popup] div[dji-sru-rewordify-popup]{bottom:10%!important;left:10%!important;right:10%!important;top:10%!important}div[dji-sru-rewordify-body]{bottom:10px;font-family:Arial,sans,sans-serif;font-size:14px;left:20px;outline:none;overflow-x:hidden;overflow-y:auto;position:absolute;right:15px;top:30px;white-space:pre-line}div[dji-sru-rewordify-body]:focus{outline:none}div[dji-sru-rewordify-popup] div.dji-sru-close-btn{background-image:url(chrome-extension://__MSG_@@extension_id__/resources/images/close.svg);cursor:pointer!important;display:none;height:25px;position:absolute;right:-14px;top:-14px;width:25px;z-index:2147483647}div[dji-sru-rewordify-popup] div.dji-sru-close-btn:before{content:url(chrome-extension://__MSG_@@extension_id__/resources/images/close-hover.svg);height:0;visibility:hidden;width:0}div[dji-sru-rewordify-popup] div.dji-sru-close-btn:hover{background-image:url(chrome-extension://__MSG_@@extension_id__/resources/images/close-hover.svg)}@media not print{html[dji-sru-rewordify-active] div[dji-sru-rewordify-popup].dji-working{display:block;left:-10000px;top:-10000px}html[dji-sru-rewordify-active] div[dji-sru-rewordify-popup].dji-visible{display:block;opacity:1;pointer-events:auto}html[dji-sru-rewordify-active] div[dji-sru-rewordify-popup].dji-visible div.dji-sru-close-btn{display:block}}html[dji-sru-rewordify-active] .kix-selection-overlay{opacity:0!important}";
                if (chrome && chrome.runtime) {
                    const t = /__MSG_@@extension_id__/gi;
                    e = e.replace(t, chrome.runtime.id);
                }
                const i = t.createElement("style");
                (i.textContent = e), (t.head || t.documentElement).append(i);
            }
            async start(
                t = {
                    showBusyEffect: !0,
                    showTextNotFoundToast: !0,
                    preventInputEventsOnBodyElements: !0,
                },
            ) {
                var i;
                try {
                    let s = await (null === (i = this.mDelegate) || void 0 === i
                        ? void 0
                        : i.getPageContext(document));
                    if (
                        !(
                            s &&
                            s.text &&
                            s.text.length > 0 &&
                            s.text.trim().length > 0
                        )
                    )
                        return !1;
                    let n = {
                        context: s,
                        boundingRect: s.element.getBoundingClientRect(),
                        options: t,
                    };
                    if (
                        (e.Utils.addClassToHtmlElements(
                            "dji-sru-rewordify-active",
                        ),
                        (this.m_token = e.Utils.generateUUID()),
                        s.isEditor)
                    ) {
                        const t = s.text.trim(),
                            e = await this.mDelegate.textToHtml(t);
                        this.m_popup.activate(e);
                    }
                    return (
                        this.mDelegate.changeSelectionState(!0),
                        t.showBusyEffect &&
                            (r.enterBusyState(),
                            this.m_popup.isActive &&
                                e.Utils.addClassToElement(
                                    document.documentElement,
                                    "dji-sru-bodycover",
                                )),
                        setTimeout(() => {
                            this.doStart(n, this.m_token);
                        }, 0),
                        !0
                    );
                } catch (t) {
                    console.error(t);
                }
                return !1;
            }
            async doStart(t, e) {
                var i, s;
                if (this.m_token !== e) return;
                let n = t.context;
                if (
                    ((null === (i = t.context) || void 0 === i
                        ? void 0
                        : i.isEditor) &&
                        (this.m_popup.show(),
                        (t.context = null),
                        (null === (s = this.m_popup.bodyTextElement) ||
                        void 0 === s
                            ? void 0
                            : s.firstChild) &&
                            (t.context =
                                await this.mDelegate.getContextForElement(
                                    this.m_popup.bodyTextElement,
                                ))),
                    !t.context || t.context.text.length <= 0)
                )
                    return this.onDeactivate();
                this.m_context = {
                    initialContext: n,
                    selectionContext: t.context,
                    boundingRect: t.boundingRect,
                };
                const o = await this.mDelegate.rewordify(
                    this.m_context.selectionContext.text,
                    e,
                );
                this.processRewordifyResult(e, o, t.options);
            }
            showTextNotFoundToast() {
                o.show(
                    "We could not find any text to rewordify",
                    {closeOnClick: !0},
                    5e3,
                );
            }
            processRewordifyResult(t, i, s) {
                var n;
                if (!this.m_context || this.m_token !== t) return !1;
                if (!i || !i.found || !i.tokens || i.tokens.length <= 0)
                    return (
                        s.showTextNotFoundToast && this.showTextNotFoundToast(),
                        this.onDeactivate(),
                        !0
                    );
                try {
                    let t = this.prepareDocument(i.tokens);
                    if (
                        (this.mEventTarget.dispatchEvent(
                            new CustomEvent("RESULTS_PROCESSED", {
                                detail: {result: !0},
                            }),
                        ),
                        0 === t.length)
                    )
                        return (
                            s.showTextNotFoundToast &&
                                this.showTextNotFoundToast(),
                            this.onDeactivate()
                        );
                    s.preventInputEventsOnBodyElements &&
                        e.Utils.preventInputEventsOnBodyElements(!1),
                        s.showBusyEffect && r.leaveBusyState();
                    const o =
                        (null === (n = this.mDelegate) || void 0 === n
                            ? void 0
                            : n.getToolbarRect()) || new DOMRect(0, 0, 0, 0);
                    this.m_popup.layoutPopup(
                        this.m_context.initialContext,
                        this.m_context.boundingRect,
                        o,
                    );
                } catch (t) {
                    console.error(t),
                        this.mEventTarget.dispatchEvent(
                            new CustomEvent("RESULTS_PROCESSED", {
                                detail: {result: !1},
                            }),
                        ),
                        this.onDeactivate();
                }
                return !0;
            }
            prepareDocument(t) {
                let e,
                    i = this.m_context.selectionContext,
                    s = i.custom.selectionOffset,
                    n = [],
                    o = null,
                    r = [],
                    a = null,
                    l = null,
                    d = null,
                    m = null,
                    u = null,
                    h = null,
                    c = null,
                    p = -1,
                    g = -1,
                    _ = -1;
                for (let e = 0; e < t.length; e++) {
                    let o = t[e];
                    (g = o.pos),
                        (_ = o.pos + o.length),
                        (u = h = null),
                        (d = {
                            index: n.length,
                            range: {
                                pos: o.pos,
                                start: o.pos + s,
                                length: o.length,
                            },
                            chunks: [],
                            words: o.words,
                            currentWord: 0,
                            tooltip: o.words.join(", "),
                        });
                    for (let t = g; t < _; t++) {
                        try {
                            (c = i.custom.map[t + s]), (h = c.element);
                        } catch (t) {
                            throw (console.error(t), t);
                        }
                        m && u == h
                            ? m.range.length++
                            : ((m = {
                                  element: h,
                                  range: {
                                      offset: t,
                                      start: c.offset,
                                      length: 1,
                                  },
                                  group: d.index,
                              }),
                              d.chunks.push(m),
                              (a && a.element == h) ||
                                  ((a = {element: h, chunks: []}), r.push(a)),
                              a.chunks.push(m)),
                            (u = h);
                    }
                    n.push(d);
                }
                for (i.words = n, p = 0; p < r.length; p++) {
                    (a = r[p]), (u = a.element), (o = a.chunks);
                    let t = document.createDocumentFragment(),
                        i = 0,
                        s = u.textContent;
                    if (s) {
                        for (let r = 0; r < o.length; r++) {
                            (m = o[r]),
                                i < m.range.start &&
                                    ((e = s.substring(i, m.range.start)),
                                    t.appendChild(document.createTextNode(e))),
                                (e = s.substring(
                                    m.range.start,
                                    m.range.start + m.range.length,
                                )),
                                (i = m.range.start + m.range.length),
                                (l = document.createElement("span")),
                                (l.innerText = e),
                                l.setAttribute(
                                    "dji-sru-rewordify-group",
                                    m.group.toString(),
                                ),
                                l.setAttribute(
                                    "class",
                                    "dji-sru-rewordify-chunk dji-sru-rewordify-match",
                                );
                            let a = this.shouldReplaceToken(n[m.group]);
                            (n[m.group].replace = a),
                                a &&
                                    (l.setAttribute(
                                        "dji-sru-rewordify-replace",
                                        "true",
                                    ),
                                    l.setAttribute(
                                        "title",
                                        n[m.group].tooltip,
                                    )),
                                l.addEventListener("click", (t) =>
                                    this.onDjiSpanClick(t),
                                ),
                                t.appendChild(l),
                                (l.__dji_sru_rewordify_data = {
                                    word: n[m.group],
                                    originalText: e,
                                }),
                                (m.dji_span = l);
                        }
                        i < s.length &&
                            ((e = s.substring(i)),
                            t.appendChild(document.createTextNode(e))),
                            u.parentElement &&
                                u.parentElement.replaceChild(t, u);
                    }
                }
                for (p = 0; p < n.length; p++) {
                    let t = n[p];
                    (t.currentWord = t.replace
                        ? Math.min(1, n[p].words.length)
                        : 0),
                        this.updateWordOnUI(n[p], !1, !0);
                }
                return t;
            }
            shouldReplaceToken(t) {
                switch (this.mFluencyLevel) {
                    case 0:
                        return !1;
                    case 2:
                        return !0;
                    default: {
                        let e = t.words[1];
                        return (
                            -1 === e.indexOf("(") &&
                            (-1 === e.indexOf(" ") || -1 === e.indexOf("/"))
                        );
                    }
                }
            }
            async onDjiSpanClick(t) {
                var e;
                t.preventDefault(), t.stopPropagation();
                let i = t.srcElement.__dji_sru_rewordify_data.word;
                if (
                    (null === (e = this.mDelegate) || void 0 === e
                        ? void 0
                        : e.translator) &&
                    !i.translatedText &&
                    i.currentWord == i.words.length - 1
                ) {
                    this.m_context.word = i;
                    const t = await this.mDelegate.translator.translateText(
                        i.words[i.currentWord],
                    );
                    this.processTranslationDone(t);
                } else
                    (i.currentWord = (i.currentWord + 1) % i.words.length),
                        this.updateWordOnUI(
                            i,
                            i.currentWord == i.words.length - 1,
                        );
            }
            processTranslationDone(t) {
                if (!t || t.error || !t.translatedText) {
                    const t = this.m_context.word;
                    return (
                        (t.currentWord = (t.currentWord + 1) % t.words.length),
                        void this.updateWordOnUI(this.m_context.word, !1)
                    );
                }
                const e = this.m_context.word;
                (e.translatedText = t.translatedText),
                    (e.translateSource = t.source),
                    e.words.push(t.translatedText),
                    (e.currentWord = (e.currentWord + 1) % e.words.length),
                    (e.tooltip = e.words.join(", "));
                for (let t = 0; t < e.chunks.length; t++)
                    e.chunks[t].dji_span.setAttribute("title", e.tooltip);
                this.updateWordOnUI(e, !0);
            }
            updateWordOnUI(t, i, s = !1) {
                var n;
                let o = t.chunks,
                    r = 0,
                    l = t.words[t.currentWord],
                    d = !1;
                for (let a = 0; a < o.length; a++) {
                    let m = o[a],
                        u =
                            a < o.length - 1
                                ? l.substring(r, r + m.range.length)
                                : l.substring(r);
                    (s && !t.replace) ||
                        ((r += m.range.length),
                        a < o.length - 1
                            ? (m.dji_span.innerText = u)
                            : (m.dji_span.innerText =
                                  u + String.fromCharCode(8203))),
                        i &&
                        t.translatedText &&
                        (null === (n = this.mDelegate) || void 0 === n
                            ? void 0
                            : n.translator)
                            ? (e.Utils.addClassToElement(
                                  m.dji_span,
                                  "dji-sru-rewordify-translated",
                              ),
                              0 == t.currentWord
                                  ? e.Utils.addClassToElement(
                                        m.dji_span,
                                        "dji-sru-rewordify-translated-original",
                                    )
                                  : e.Utils.removeClassFromElement(
                                        m.dji_span,
                                        "dji-sru-rewordify-translated-original",
                                    ),
                              d || "google" !== t.translateSource || (d = !0))
                            : (e.Utils.removeClassFromElement(
                                  m.dji_span,
                                  "dji-sru-rewordify-translated",
                              ),
                              e.Utils.removeClassFromElement(
                                  m.dji_span,
                                  "dji-sru-rewordify-translated-original",
                              ));
                }
                d
                    ? (function () {
                          if (
                              document.getElementsByClassName(
                                  "dji-sru-google-translate-logo",
                              ).length > 0
                          )
                              return;
                          let t = document.createElement("a");
                          t.setAttribute("href", "http://translate.google.com"),
                              t.setAttribute(
                                  "class",
                                  "dji-sru-google-translate-logo",
                              ),
                              document.body.appendChild(t),
                              (document.getElementsByClassName(
                                  "dji-sru-google-translate-logo",
                              )[0].instances = 1);
                          let e = document.createElement("img");
                          e.setAttribute(
                              "class",
                              "dji-sru-google-translate-logo-img",
                          ),
                              t.appendChild(e);
                      })()
                    : a();
            }
            async onDeactivate() {
                e.Utils.preventInputEventsOnBodyElements(!1),
                    this.m_popup && this.m_popup.onDeactivate(),
                    this.resetSpans(),
                    a(),
                    await this.mDelegate.changeSelectionState(!1),
                    this.m_context &&
                        this.mDelegate.clearSelection(
                            this.m_context.initialContext,
                        ),
                    (this.m_context = null),
                    (this.m_token = null),
                    (this.m_active = !1),
                    this.mEventTarget.dispatchEvent(new Event("DEACTIVATE")),
                    e.Utils.removeClassFromElement(
                        document.documentElement,
                        "dji-sru-bodycover",
                    ),
                    r.leaveBusyState();
            }
            resetSpans() {
                if (!this.m_context || !this.m_context.initialContext) return;
                let t = null,
                    e = this.m_context.initialContext.element.ownerDocument,
                    i = e.getElementsByClassName("dji-sru-rewordify-chunk");
                for (let s = i.length - 1; s >= 0; s--) {
                    let n = i.item(s);
                    if (!n) continue;
                    let o = n.__dji_sru_rewordify_data
                        ? n.__dji_sru_rewordify_data.originalText
                        : n.firstChild.textContent;
                    t && t != n.parentElement && t.normalize(),
                        (t = n.parentElement),
                        n.parentElement &&
                            n.parentElement.replaceChild(
                                e.createTextNode(o),
                                n,
                            );
                }
                t && t.normalize();
            }
        }),
        (t.RewordifyUIControllerAbstractDelegate = class {
            constructor(t, e) {
                (this.mParser = null),
                    (this.mTranslator = null),
                    (this.mTranslationEnabled = !1),
                    (this.mParser = t),
                    (this.mTranslator = e);
            }
            async getPageContext(t) {
                return this.mParser ? this.mParser.getPageContext(t) : null;
            }
            async getContextForElement(t) {
                return this.mParser
                    ? this.mParser.getContextForElement(t)
                    : null;
            }
            get translator() {
                return this.mTranslationEnabled ? this.mTranslator : null;
            }
            enableTranslation(t) {
                this.mTranslationEnabled = t;
            }
            changeSelectionState(t) {}
            clearSelection(t) {}
            getToolbarRect() {
                return new DOMRect(0, 0, 0, 0);
            }
            toggleRewordifyButton(t) {}
            textToHtml(t) {
                return new Promise((e) => {
                    let i = "";
                    const s = t.split("\n\n");
                    for (const t of s) (i += "<p>"), (i += t), (i += "</p>");
                    e(i);
                });
            }
        }),
        (t.RewordifyUIOptions = class {
            constructor() {
                (this.showBusyEffect = !0),
                    (this.showTextNotFoundToast = !0),
                    (this.preventInputEventsOnBodyElements = !0);
            }
        }),
        Object.defineProperty(t, "__esModule", {value: !0});
});
