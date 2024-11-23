window.dji = window.dji || {};
(function (k) {
    function f(a, b) {
        this.m_element = a;
        this.m_callback = b;
        this.m_dragOverlayContainer = null;
        this.ResizeBounds = {MinWidth: 200, MinHeight: 200};
        this.m_drag = {
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
        };
        return this;
    }
    f.attachToElement = function (a, b) {
        b = new f(a, b);
        b.__initialize();
        a.__geometryController = b;
    };
    f.prototype.__initialize = function () {
        var a,
            b = this,
            d = this.m_element.querySelectorAll("iframe"),
            e = [
                {hitTest: 3, class: "dji-geom-ctrl-resize-top"},
                {hitTest: 7, class: "dji-geom-ctrl-resize-bottom"},
                {hitTest: 9, class: "dji-geom-ctrl-resize-left"},
                {hitTest: 5, class: "dji-geom-ctrl-resize-right"},
                {hitTest: 2, class: "dji-geom-ctrl-resize-top-left"},
                {hitTest: 4, class: "dji-geom-ctrl-resize-top-right"},
                {hitTest: 6, class: "dji-geom-ctrl-resize-bottom-right"},
                {hitTest: 8, class: "dji-geom-ctrl-resize-bottom-left"},
            ];
        for (a = 0; a < e.length; a++) {
            var h = document.createElement("div");
            h.hitTest = e[a].hitTest;
            h.setAttribute("class", e[a].class);
            this.m_element.appendChild(h);
        }
        this.m_dragOverlayContainer = document.createElement("div");
        this.m_dragOverlayContainer.classList.add("geomCtrlContainerOverlay");
        this.m_element.appendChild(this.m_dragOverlayContainer);
        var g = [document];
        for (a = 0; a < d.length; a++)
            try {
                g.push(d[a].contentDocument, d[a]);
            } catch (c) {
                dji.logger.error(
                    "Error while attaching to iframe",
                    d[a],
                    ":",
                    c,
                );
            }
        this.m_drag.onMouseDown = function (c) {
            if (
                b.__isDraggable(c.target) &&
                !sru.speech.isActive() &&
                b.__onDragStart(c)
            ) {
                c.preventDefault();
                c.stopPropagation();
                for (c = 0; c < g.length; c++)
                    g[c].addEventListener(
                        "mousemove",
                        b.m_drag.onMouseMove,
                        !0,
                    ),
                        g[c].addEventListener(
                            "mouseup",
                            b.m_drag.onMouseUp,
                            !0,
                        );
                document.addEventListener(
                    "mouseover",
                    b.m_drag.onMouseOver,
                    !0,
                );
                document.addEventListener("mouseout", b.m_drag.onMouseOut, !0);
            }
        };
        this.m_drag.onMouseMove = function (c) {
            b.__onDrag(c) && (c.preventDefault(), c.stopPropagation());
        };
        this.m_drag.onMouseOver = function (c) {
            c.preventDefault();
            c.stopPropagation();
        };
        this.m_drag.onMouseOut = function (c) {
            if (
                !c.toElement ||
                (c.toElement == document &&
                    c.toElement == document.documentElement)
            )
                b.m_drag.onMouseUp(c);
            else c.preventDefault(), c.stopPropagation();
        };
        this.m_drag.onMouseUp = function (c) {
            b.__onDragEnd(c);
            c.preventDefault();
            c.stopPropagation();
            for (c = 0; c < g.length; c++)
                g[c].removeEventListener("mousemove", b.m_drag.onMouseMove, !0),
                    g[c].removeEventListener("mouseup", b.m_drag.onMouseUp, !0);
            document.removeEventListener("mouseover", b.m_drag.onMouseOver, !0);
            document.removeEventListener("mouseout", b.m_drag.onMouseOut, !0);
        };
        for (a = 0; a < g.length; a++)
            g[a].addEventListener("mousedown", this.m_drag.onMouseDown, !0);
    };
    f.prototype.__isDraggable = function (a) {
        for (; a && "function" === typeof a.getAttribute; ) {
            if ("true" === a.getAttribute("dji-non-draggable")) return !1;
            a = a.parentElement;
        }
        return !0;
    };
    f.prototype.__onDragStart = function (a) {
        if (0 !== this.m_drag.state) return this.m_drag.onMouseUp(a), !1;
        if (1 !== a.which || "INPUT" == a.target.nodeName) return !1;
        var b = this.__hitTest(a.target, {x: a.browserX, y: a.browserY});
        if (0 == b) return !1;
        1 == b
            ? this.__addClassToElement(
                  this.m_dragOverlayContainer,
                  "dji-geom-ctrl-move",
              )
            : 3 == b || 7 == b
              ? this.__addClassToElement(
                    document.documentElement,
                    "dji-geom-ctrl-resize-ns",
                )
              : 9 == b || 5 == b
                ? this.__addClassToElement(
                      document.documentElement,
                      "dji-geom-ctrl-resize-ew",
                  )
                : 2 == b || 6 == b
                  ? this.__addClassToElement(
                        document.documentElement,
                        "dji-geom-ctrl-resize-nwse",
                    )
                  : (4 == b || 8 == b) &&
                    this.__addClassToElement(
                        document.documentElement,
                        "dji-geom-ctrl-resize-nesw",
                    );
        this.m_drag.state = 1;
        this.m_drag.hitTest = b;
        this.m_drag.start.x = this.m_drag.end.x = a.screenX;
        this.m_drag.start.y = this.m_drag.end.y = a.screenY;
        this.m_drag.action = 1 == b ? 1 : 2;
        return !0;
    };
    f.prototype.__onDrag = function (a) {
        if (1 == this.m_drag.state || 2 == this.m_drag.state) {
            var b = this.m_element.getBoundingClientRect();
            this.m_drag.end.x = a.screenX;
            this.m_drag.end.y = a.screenY;
            if (1 == this.m_drag.state)
                5 <
                    Math.sqrt(
                        (this.m_drag.end.x - this.m_drag.start.x) *
                            (this.m_drag.end.x - this.m_drag.start.x) +
                            (this.m_drag.end.y - this.m_drag.start.y) *
                                (this.m_drag.end.y - this.m_drag.start.y),
                    ) &&
                    ((this.m_drag.state = 2),
                    (this.m_drag.start.x = this.m_drag.end.x = a.screenX),
                    (this.m_drag.start.y = this.m_drag.end.y = a.screenY),
                    (this.m_drag.offset.x = this.m_drag.start.x - b.left),
                    (this.m_drag.offset.y = this.m_drag.start.y - b.top),
                    (this.m_drag.initial.height = b.height),
                    (this.m_drag.initial.width = b.width),
                    this.__addClassToElement(
                        this.m_element,
                        "dji-geom-ctrl-dragging",
                    ),
                    (this.m_element.style.left = b.left + "px"),
                    (this.m_element.style.top = b.top + "px"));
            else if (2 == this.m_drag.state) {
                a = this.m_drag.initial.height;
                b = this.m_drag.initial.width;
                if (
                    2 == this.m_drag.hitTest ||
                    3 == this.m_drag.hitTest ||
                    4 == this.m_drag.hitTest ||
                    1 == this.m_drag.hitTest
                )
                    var d = this.m_drag.end.y - this.m_drag.offset.y;
                if (
                    2 == this.m_drag.hitTest ||
                    9 == this.m_drag.hitTest ||
                    8 == this.m_drag.hitTest ||
                    1 == this.m_drag.hitTest
                )
                    var e = this.m_drag.end.x - this.m_drag.offset.x;
                if (
                    8 == this.m_drag.hitTest ||
                    7 == this.m_drag.hitTest ||
                    6 == this.m_drag.hitTest
                )
                    a =
                        this.m_drag.initial.height +
                        (this.m_drag.end.y - this.m_drag.start.y);
                else if (
                    2 == this.m_drag.hitTest ||
                    3 == this.m_drag.hitTest ||
                    4 == this.m_drag.hitTest
                )
                    a =
                        this.m_drag.initial.height +
                        (this.m_drag.start.y - this.m_drag.end.y);
                if (
                    2 == this.m_drag.hitTest ||
                    9 == this.m_drag.hitTest ||
                    8 == this.m_drag.hitTest
                )
                    b =
                        this.m_drag.initial.width +
                        (this.m_drag.start.x - this.m_drag.end.x);
                else if (
                    6 == this.m_drag.hitTest ||
                    5 == this.m_drag.hitTest ||
                    4 == this.m_drag.hitTest
                )
                    b =
                        this.m_drag.initial.width +
                        (this.m_drag.end.x - this.m_drag.start.x);
                b &&
                    this.ResizeBounds.MinWidth <= b &&
                    (e &&
                        0 < e &&
                        e + b < window.innerWidth &&
                        (this.m_element.style.left = e + "px"),
                    (this.m_element.style.width = b + "px"));
                a &&
                    this.ResizeBounds.MinHeight <= a &&
                    (d &&
                        0 < d &&
                        d + a < window.innerHeight &&
                        (this.m_element.style.top = d + "px"),
                    (this.m_element.style.height = a + "px"));
            }
        }
        return 2 == this.m_drag.state;
    };
    f.prototype.__onDragEnd = function (a) {
        if (1 == this.m_drag.state || 2 == this.m_drag.state)
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
                ),
                (a =
                    2 == this.m_drag.action &&
                    (this.m_drag.end.x != this.m_drag.start.x ||
                        this.m_drag.end.y != this.m_drag.start.y)),
                (this.m_drag.state = 0),
                (this.m_drag.action = 0),
                a && this.m_callback && this.m_callback();
    };
    f.prototype.__hitTest = function (a, b) {
        if (a.hasOwnProperty("hitTest") && a.hitTest) return a.hitTest;
        for (; a && a != this.m_element; )
            a =
                a.nodeType == Node.DOCUMENT_NODE &&
                a.defaultView &&
                a.defaultView.top != a.defaultView &&
                a.defaultView.frameElement
                    ? a.defaultView.frameElement
                    : a.parentNode;
        return a == this.m_element ? 1 : 0;
    };
    f.prototype.__addClassToElement = function (a, b) {
        a &&
            b &&
            -1 == a.className.indexOf(b) &&
            (a.className = a.className ? a.className + (" " + b) : b);
    };
    f.prototype.__removeClassFromElement = function (a, b) {
        if (a && b) {
            var d = " " + b,
                e = a.className.indexOf(d);
            -1 == e && ((d = b + " "), (e = a.className.indexOf(d)));
            -1 == e && ((d = b), (e = a.className.indexOf(d)));
            -1 != e && (a.className = a.className.replace(d, ""));
        }
    };
    k.attachToDOMElement = f.attachToElement;
})((window.dji.geometryController = window.dji.geometryController || {}));
