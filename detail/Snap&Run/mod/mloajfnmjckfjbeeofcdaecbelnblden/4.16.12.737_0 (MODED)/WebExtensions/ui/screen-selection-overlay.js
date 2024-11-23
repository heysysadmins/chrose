window.__dji = window.__dji || {};
window.__dji.utils = window.__dji.utils || {};
window.__dji.utils.ScreenSelectionOverlay = (function () {
    class v {
        constructor(a = {}) {
            this.mOverlayCrosshair =
                this.mOverlayBottomChild =
                this.mOverlayRightChild =
                this.mOverlayLeftChild =
                this.mOverlayTopChild =
                this.mOverlayYLine =
                this.mOverlayXLine =
                this.mOverlayDiv =
                    null;
            this.mOverlayCrosshairWidth = 12;
            this.mCloseDelegate =
                this.mSelectionContent =
                this.mOverlaySelection =
                    null;
            this.mOptions = {};
            this.options = a;
            this.mSelectionRect = {
                x: 0,
                y: 0,
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            };
            this.mRoot = null;
        }
        get options() {
            return this.mOptions;
        }
        set options(a) {
            this.mOptions = Object.assign(
                {},
                {
                    documentClass: "dji-sru-screen-selection",
                    overlayID: "dji-sru-screen-selection",
                    overlayContentID: "dji-sru-ocr-content",
                    overlayContentClass: "",
                    overlayClass: "",
                    overlaySelectionID: "dji-sru-overlay-selection",
                    overlayParagraphClass: "dji-sru-ocr-para",
                    overlayWordClass: "dji-sru-ocr-word",
                    showCloseButton: !0,
                    enableSelectionTools: !0,
                    putSpaceBetweenWords: !0,
                },
                a,
            );
            Object.freeze(this.mOptions);
        }
        get selectionRect() {
            return this.mSelectionRect;
        }
        set selectionRect(a) {
            this.mSelectionRect.x = a.x;
            this.mSelectionRect.y = a.y;
            this.mSelectionRect.left = a.left;
            this.mSelectionRect.top = a.top;
            this.mSelectionRect.right = a.right;
            this.mSelectionRect.bottom = a.bottom;
            this._updateOverlayChild();
        }
        set overlayRect(a) {
            this._updateOverlayPosition(a);
        }
        get rootNode() {
            return this.mOverlayDiv;
        }
        set closeDelegate(a) {
            a && "function" === typeof a && (this.mCloseDelegate = a);
        }
        set state(a) {
            this.mOverlayDiv.classList.remove(
                "dji-sru-screen-select-busy",
                "dji-sru-screen-select-ready",
            );
            switch (a) {
                case "busy":
                    this.mOverlayDiv.classList.add(
                        "dji-sru-screen-select-busy",
                    );
                    break;
                case "ready":
                    this.mOverlayDiv.classList.add(
                        "dji-sru-screen-select-ready",
                    );
            }
        }
        get ownerDocument() {
            return this.mOverlayDiv ? this.mOverlayDiv.ownerDocument : null;
        }
        initialize(a = null) {
            if (!this.mOverlayDiv) {
                this.mOverlayDiv = document.createElement("div");
                var b = this.mOptions.overlayID;
                b && 0 < b.length
                    ? (this.mOverlayDiv.id = this.mOptions.overlayID)
                    : ((b = this.mOptions.overlayClass),
                      (b && 0 < b.length) || (b = this.mOptions.documentClass),
                      this.mOverlayDiv.classList.add(b));
                this._createSelectionTools();
                this._createChildLayout();
                0 < this.mOptions.overlaySelectionID.length &&
                    ((this.mOverlaySelection = document.createElement("div")),
                    (this.mOverlaySelection.id =
                        this.mOptions.overlaySelectionID),
                    this.mOverlayDiv.appendChild(this.mOverlaySelection));
                this._createCloseButton();
                this.mSelectionContent = document.createElement("div");
                this.mOptions.overlayContentID &&
                    (this.mSelectionContent.id =
                        this.mOptions.overlayContentID);
                this.mOptions.overlayContentClass &&
                    this.mSelectionContent.classList.add(
                        this.mOptions.overlayContentClass,
                    );
                this.mSelectionContent.setAttribute("tabindex", "0");
                this.mOverlaySelection
                    ? this.mOverlaySelection.appendChild(this.mSelectionContent)
                    : this.mOverlayDiv.appendChild(this.mSelectionContent);
                this.mRoot = a || document.body;
            }
        }
        updateOverlayCursorPosition(a, b = 0) {
            this.mOverlayXLine &&
                ((this.mOverlayXLine.style.left = a.x + "px"),
                (this.mOverlayYLine.style.top = a.y + "px"),
                (this.mOverlayCrosshair.style.left =
                    a.x - this.mOverlayCrosshairWidth / 2 + b + "px"),
                (this.mOverlayCrosshair.style.top =
                    a.y - this.mOverlayCrosshairWidth / 2 + b + "px"));
        }
        moveOverlayCursorToCenter() {
            this.updateOverlayCursorPosition(
                {x: window.innerWidth / 2, y: window.innerHeight / 2},
                1,
            );
        }
        clearContent() {
            this.mSelectionContent.innerHTML = "";
        }
        appendContent(a, b) {
            const n = this.options.overlayParagraphClass,
                h = this.options.overlayWordClass;
            b = "number" == typeof b ? b : window.devicePixelRatio;
            var c = !1;
            let t = document.createDocumentFragment();
            for (let k = 0; k < a.length; k++) {
                const f = a[k];
                let e = document.createElement("div");
                e.setAttribute("class", n);
                e.style.setProperty("left", f.bounds.left / b + "px");
                e.style.setProperty("top", f.bounds.top / b + "px");
                e.style.setProperty("width", f.bounds.width / b + "px");
                e.style.setProperty("height", f.bounds.height / b + "px");
                let p = f.lines;
                for (let l = 0; p && l < p.length; l++) {
                    let q = p[l].words;
                    for (let r = 0; q && r < q.length; r++) {
                        c = q[r];
                        var g = c.bounds.left - f.bounds.left;
                        const w = c.bounds.top - f.bounds.top,
                            u = c.bounds.height;
                        let d = document.createElement("span");
                        d.setAttribute("class", h);
                        d.style.setProperty("left", g / b + "px");
                        d.style.setProperty("top", w / b + "px");
                        c.style &&
                            (c.style.fontAll
                                ? d.style.setProperty("font", c.style.fontAll)
                                : (c.style.fontPointSize
                                      ? d.style.setProperty(
                                            "font-size",
                                            c.style.fontPointSize / b + "pt",
                                        )
                                      : c.style.fontPixelSize &&
                                        d.style.setProperty(
                                            "font-size",
                                            c.style.fontPixelSize + "px",
                                        ),
                                  c.style.font &&
                                      d.style.setProperty(
                                          "font-family",
                                          c.style.font,
                                      )));
                        c.transform
                            ? ((g = new DOMMatrix(c.transform)),
                              (g.e = 0),
                              (g.f = 0),
                              (d.style.transform = g.toString()),
                              (d.style.transformOrigin = "top left"))
                            : (c.bounds.width &&
                                  d.style.setProperty(
                                      "width",
                                      c.bounds.width / b + "px",
                                  ),
                              c.bounds.height &&
                                  (d.style.setProperty("height", u / b + "px"),
                                  d.style.setProperty(
                                      "line-height",
                                      u / b + "px",
                                  )));
                        d.innerText = c.text;
                        if (c.classList) {
                            g = c.classList.split(",");
                            for (let m of g) d.classList.add(m);
                        }
                        if (c.data)
                            for (let m in c.data)
                                d.setAttribute(`data-${m}`, c.data[m]);
                        d.setAttribute("data-lineno", l);
                        d.setAttribute("data-parano", k);
                        e.appendChild(d);
                        this.mOptions.putSpaceBetweenWords &&
                            e.appendChild(document.createTextNode(" "));
                        c = !0;
                    }
                }
                t.appendChild(e);
            }
            this.mSelectionContent.appendChild(t);
            return c;
        }
        show() {
            this.mOptions.documentClass &&
                document.documentElement.classList.add(
                    this.mOptions.documentClass,
                );
            const a = Number.parseInt(this.mOverlayDiv.style.top),
                b = this.mRoot.children,
                n = b.length;
            for (let h = 0; h < n; h += 1) {
                const c = b[h];
                if (
                    c !== this.mOverlayDiv &&
                    Number.parseInt(c.style.top) > a
                ) {
                    this.mRoot.insertBefore(this.mOverlayDiv, c);
                    return;
                }
            }
            this.mRoot.append(this.mOverlayDiv);
        }
        hide(a = !0, b = !1) {
            this.clearContent();
            a &&
                this.mOptions.documentClass &&
                document.documentElement.classList.remove(
                    this.mOptions.documentClass,
                );
            b && this.mRoot.removeChild(this.mOverlayDiv);
        }
        _createSelectionTools() {
            this.mOptions.enableSelectionTools &&
                !this.mOverlayXLine &&
                ((this.mOverlayXLine = document.createElement("div")),
                (this.mOverlayXLine.id = "dji-sru-x-line"),
                this.mOverlayDiv.appendChild(this.mOverlayXLine),
                (this.mOverlayYLine = document.createElement("div")),
                (this.mOverlayYLine.id = "dji-sru-y-line"),
                this.mOverlayDiv.appendChild(this.mOverlayYLine),
                (this.mOverlayCrosshair = document.createElement("div")),
                (this.mOverlayCrosshair.id = "dji-sru-crosshair"),
                this.mOverlayDiv.appendChild(this.mOverlayCrosshair));
        }
        _createChildLayout() {
            this.mOptions.enableChildLayout &&
                !this.mOverlayTopChild &&
                ((this.mOverlayTopChild = document.createElement("div")),
                (this.mOverlayTopChild.id = "dji-sru-overlay-top"),
                (this.mOverlayTopChild.className = "dji-sru-overlay-child"),
                this.mOverlayDiv.appendChild(this.mOverlayTopChild),
                (this.mOverlayLeftChild = document.createElement("div")),
                (this.mOverlayLeftChild.id = "dji-sru-overlay-left"),
                (this.mOverlayLeftChild.className = "dji-sru-overlay-child"),
                this.mOverlayDiv.appendChild(this.mOverlayLeftChild),
                (this.mOverlayRightChild = document.createElement("div")),
                (this.mOverlayRightChild.id = "dji-sru-overlay-right"),
                (this.mOverlayRightChild.className = "dji-sru-overlay-child"),
                this.mOverlayDiv.appendChild(this.mOverlayRightChild),
                (this.mOverlayBottomChild = document.createElement("div")),
                (this.mOverlayBottomChild.id = "dji-sru-overlay-bottom"),
                (this.mOverlayBottomChild.className = "dji-sru-overlay-child"),
                this.mOverlayDiv.appendChild(this.mOverlayBottomChild));
        }
        _createCloseButton() {
            if (this.options.showCloseButton) {
                var a = document.createElement("div");
                a.className = "dji-sru-close-btn";
                a.addEventListener(
                    "click",
                    (b) => {
                        this._onCloseSelection();
                        b.stopPropagation();
                        b.preventDefault();
                    },
                    !0,
                );
                this.mOverlaySelection.appendChild(a);
            }
        }
        _updateOverlayChild() {
            const a =
                    this.mSelectionRect.top < this.mSelectionRect.y
                        ? this.mSelectionRect.top + 2
                        : this.mSelectionRect.top,
                b =
                    this.mSelectionRect.left < this.mSelectionRect.x
                        ? this.mSelectionRect.left + 2
                        : this.mSelectionRect.left;
            this.mOverlayTopChild &&
                ((this.mOverlayTopChild.style.height =
                    this.mSelectionRect.top + 3 + "px"),
                (this.mOverlayLeftChild.style.top =
                    this.mSelectionRect.top + 3 + "px"),
                (this.mOverlayLeftChild.style.width = b + 3 + "px"),
                (this.mOverlayLeftChild.style.height =
                    Math.max(
                        this.mSelectionRect.bottom -
                            this.mSelectionRect.top -
                            3,
                        0,
                    ) + "px"),
                (this.mOverlayRightChild.style.top =
                    this.mSelectionRect.top + 3 + "px"),
                (this.mOverlayRightChild.style.left =
                    this.mSelectionRect.right - 3 + "px"),
                (this.mOverlayRightChild.style.width =
                    window.innerWidth - this.mSelectionRect.right + 3 + "px"),
                (this.mOverlayRightChild.style.height =
                    Math.max(
                        this.mSelectionRect.bottom -
                            this.mSelectionRect.top -
                            3,
                        0,
                    ) + "px"),
                (this.mOverlayBottomChild.style.top =
                    this.mSelectionRect.bottom + "px"),
                (this.mOverlayBottomChild.style.height =
                    window.innerHeight - this.mSelectionRect.bottom + "px"));
            this.mOverlaySelection &&
                ((this.mOverlaySelection.style.top = a + "px"),
                (this.mOverlaySelection.style.left = b + "px"),
                (this.mOverlaySelection.style.width =
                    this.mSelectionRect.right - b + "px"),
                (this.mOverlaySelection.style.height =
                    this.mSelectionRect.bottom - a + "px"));
        }
        _updateOverlayPosition(a) {
            this.mOverlayDiv.style.top = a.top + "px";
            this.mOverlayDiv.style.left = a.left + "px";
            this.mOverlayDiv.style.width = a.width + "px";
            this.mOverlayDiv.style.height = a.height + "px";
            this.mOverlayDiv.parentElement && this.show();
        }
        _onCloseSelection() {
            this.mCloseDelegate && this.mCloseDelegate();
        }
    }
    return v;
})();
