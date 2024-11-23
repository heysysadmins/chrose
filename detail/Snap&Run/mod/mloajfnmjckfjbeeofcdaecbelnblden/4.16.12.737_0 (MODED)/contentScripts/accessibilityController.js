window.dji = window.dji || {};
window.dji.accessibility = (function () {
    function k(a) {
        return (a = a.match(n)) && 2 <= a.length ? a[1] : void 0;
    }
    const n = /^{([^}]+)}$/;
    class l {
        constructor(a, b) {
            this.m_domElem = a;
            this.m_parent = b;
            this.m_focused = !1;
        }
        get domElement() {
            return this.m_domElem;
        }
        get isUsable() {
            return !dji.utils.elementIsVisible(this.m_domElem) ||
                $(this.m_domElem).hasClass("dji-disable")
                ? !1
                : !0;
        }
        get isFocused() {
            return this.m_focused;
        }
        get requiresStrongFocus() {
            let a = this.m_domElem
                ? this.m_domElem.getAttribute("dji-accessible-strong-focus")
                : void 0;
            return null !== a && void 0 !== a;
        }
        get requiresNoFocus() {
            let a = this.m_domElem
                ? this.m_domElem.getAttribute("dji-accessible-no-focus")
                : void 0;
            return null !== a && void 0 !== a;
        }
        focus(a) {
            a = void 0 === a || !0 === a;
            this.m_focused = !0;
            $(this.m_domElem).addClass("dji-x-highlighted");
            a && ($(this.m_domElem).focus(), this.m_domElem.scrollIntoView(!1));
        }
        blur(a) {
            if ((a = void 0 === a || !0 === a)) {
                let b = dji.utils.focusedElement(this.m_domElem);
                b && $(b).blur();
            }
            this.m_focused &&
                ((this.m_focused = !1),
                a && $(this.m_domElem).blur(),
                $(this.m_domElem).removeClass("dji-x-highlighted"));
        }
        enter() {
            $(this.m_domElem).trigger("x-enter");
        }
        select() {
            $(this.m_domElem).trigger("x-select");
        }
        contextMenu() {
            $(this.m_domElem).trigger("x-contextmenu");
        }
        dismiss() {
            $(this.m_domElem).trigger("x-dismiss");
        }
        reset() {
            this.blur();
        }
    }
    class e extends l {
        constructor(a, b, c) {
            super(void 0, b);
            this.m_name = a;
            this.m_children = [];
            this.m_current = void 0;
            (this.m_setup = c || void 0) && this.setup();
        }
        get name() {
            return this.m_name;
        }
        get isUsable() {
            for (let a = 0; a < this.m_children.length; a++)
                if (this.m_children[a].isUsable) return !0;
            return !1;
        }
        get elements() {
            let a = [];
            for (let b = 0; b < this.m_children.length; b++) {
                let c = this.m_children[b];
                c instanceof e ? (a = a.concat(c.elements)) : a.push(c);
            }
            return a;
        }
        get domElements() {
            let a = this.elements,
                b = [];
            for (let c = 0; c < a.length; c++) b.push(a[c].m_domElem);
            return b;
        }
        focus() {}
        blur(a, b) {
            for (let c = 0; c < this.m_children.length; c++) {
                let d = this.m_children[c];
                d !== b && d.blur(a, b);
            }
        }
        findBlock(a) {
            for (let b = 0; b < this.m_children.length; b++) {
                let c = this.m_children[b];
                if (c instanceof e && c.name === a) return c;
            }
            return null;
        }
        findBlockInPath(a) {
            if (!(a instanceof Array) || 0 >= a.length) return null;
            let b = this;
            for (let c = 0; b && c < a.length; c++)
                0 < a[c].length && (b = b.findBlock(a[c]));
            return b;
        }
        addDomElementsUsingSelector(a, b) {
            let c = void 0;
            try {
                if ("string" === typeof b)
                    (c = k(b))
                        ? this.m_children.push(new e(c, this))
                        : this.addDomElements(a.querySelectorAll(b));
                else
                    for (let d = 0; d < b.length; d++)
                        (c = k(b[d]))
                            ? this.m_children.push(new e(c, this))
                            : this.addDomElements(a.querySelectorAll(b[d]));
            } catch (d) {
                throw (dji.logger.error(d), d);
            }
        }
        addDomElements(a) {
            for (let b = 0; b < a.length; b++)
                this.m_children.push(new l(a[b]));
        }
        setup() {
            if (this.m_setup.blocks)
                for (let b = 0; b < this.m_setup.blocks.length; b++) {
                    var a = this.m_setup.blocks[b];
                    a = new e(a.name, this, a);
                    this.m_children.push(a);
                }
            this.m_setup.dom &&
                this.addDomElementsUsingSelector(
                    this.m_setup.dom.element,
                    this.m_setup.dom.selectors,
                );
        }
        reload(a) {
            let b = a ? this.findFocusedElement() : void 0;
            this.clear();
            this.setup();
            a &&
                b &&
                ((a = this.elements),
                0 <= b.index && b.index < a.length && a[b.index].focus());
        }
        sync() {
            let a = this.elements,
                b = void 0;
            for (let c = 0; c < a.length; c++) {
                let d = a[c];
                dji.utils.focusedElement(d.domElement) && (b = d);
            }
            this.blur(void 0, b);
            return b ? (b.focus(), !0) : !1;
        }
        clear() {
            this.blur();
            this.m_children.splice(0, this.m_children.length);
            this.m_current = -1;
        }
        reset() {
            0 >= this.m_children.length ||
                (0 <= this.m_current && this.m_children[this.m_current].reset(),
                (this.m_current = -1));
        }
        findNextElement(a) {
            let b = this.elements,
                c = -1,
                d = void 0,
                h = -1,
                g = void 0,
                p = 0 > a ? b.length : 0;
            a = 0 > a ? -1 : 1;
            for (var f = 0; f < b.length; f++) {
                let m = b[f];
                if (m.isFocused) {
                    c = f;
                    d = m;
                    break;
                }
            }
            for (f = 0; f < b.length; f++) {
                h = (p + Math.max(c, 0) + a * f) % b.length;
                g = b[h];
                if (g !== d && g.isUsable) break;
                g = void 0;
            }
            g || (h = -1);
            return {oldIndex: c, oldElement: d, newIndex: h, newElement: g};
        }
        findFocusedElement(a) {
            a || (a = this.elements);
            for (let b = 0; b < a.length; b++) {
                let c = a[b];
                if (c.isFocused) return {index: b, element: c};
            }
            return null;
        }
        go(a) {
            a = this.findNextElement(a);
            if (a.newElement && a.newElement !== a.oldElement) {
                var b = !a.newElement.requiresNoFocus;
                a.oldElement && a.oldElement.blur(b);
                a.newElement.focus(b);
            }
        }
        goPrevious() {
            return this.go(-1);
        }
        goNext() {
            return this.go(1);
        }
        enter() {
            let a = this.findFocusedElement();
            a && a.element && a.element.enter();
        }
        select() {
            let a = this.findFocusedElement();
            a && a.element && a.element.select();
        }
        contextMenu() {
            let a = this.findFocusedElement();
            a && a.element && a.element.contextMenu();
        }
        dismiss() {
            let a = this.findFocusedElement();
            a && a.element && a.element.dismiss();
        }
    }
    class q {
        constructor() {
            this.m_enabled = !1;
            this.m_blocks = [new e("@default")];
        }
        get isEnabled() {
            return this.m_enabled;
        }
        get topBlock() {
            return 0 >= this.m_blocks.length ? null : this.m_blocks[0];
        }
        findBlockIndex(a) {
            let b = [];
            for (let c = 0; c < this.m_blocks.length; c++)
                this.m_blocks[c].name === a && b.push(c);
            return b;
        }
        findBlockInPath(a) {
            var b = !1;
            a instanceof Array ||
                ((a = (a || "").trim().replace(/[ ]+/g, "/")),
                (b = 0 === a.indexOf("/")),
                (a = a.split("/")));
            for (var c = 0; c < a.length; c++)
                if (a[c] && 0 < a[c].length) {
                    0 < c && a.splice(0, c);
                    break;
                }
            if (0 >= a.length) return null;
            0 === a[0].indexOf("#") && ((b = !0), (a[0] = a[0].substr(1)));
            c = void 0;
            b
                ? ((b = this.findBlockIndex(a[0])),
                  0 < b.length && (c = this.m_blocks[b[0]]),
                  a.splice(0, 1))
                : (c = this.topBlock);
            return c ? c.findBlockInPath(a) : null;
        }
        addBlockAndSetup(a, b, c) {
            c || ((c = this.topBlock) && c.blur(!1));
            a = new e(a, void 0, b);
            this.m_blocks.splice(0, 0, a);
            this.m_enabled = !1;
            return a;
        }
        popBlock(a) {
            if (a && 0 < this.m_blocks.length && this.m_blocks[0].name !== a)
                return null;
            a = this.m_blocks.splice(0, 1);
            0 < a.length && a[0].blur();
            this.m_enabled = !1;
            return a && 0 < a.length ? a[0] : null;
        }
        removeBlock(a) {
            a = this.findBlockIndex(a);
            for (let b = a.length - 1; 0 <= b; b--) {
                let c = this.m_blocks.splice(a[b], 1);
                0 < c.length && c[0].blur();
            }
        }
        clearBlock(a) {
            (a = this.findBlockInPath(a)) && a.clear();
        }
        reloadBlock(a, b) {
            (a = this.findBlockInPath(a)) && a.reload(b);
        }
        reset() {
            for (let a = this.m_blocks.length - 1; 0 <= a; a--)
                this.m_blocks[a].blur();
            this.m_blocks = [new e("@default")];
        }
        sync() {
            if (!this.m_enabled) return !1;
            let a = this.topBlock;
            return a ? a.sync() : !1;
        }
        enable(a) {
            void 0 === a && (a = !this.m_enabled);
            a = !!a;
            a !== this.m_enabled &&
                ((this.m_enabled = a),
                this.topBlock && !this.m_enabled && this.topBlock.blur(!1));
        }
        goPrevious() {
            if (this.m_enabled) {
                var a = this.topBlock;
                a && a.goPrevious();
            }
        }
        goNext() {
            if (this.m_enabled) {
                var a = this.topBlock;
                a && a.goNext();
            }
        }
        enter() {
            if (this.m_enabled) {
                var a = this.topBlock;
                a && a.enter();
            }
        }
        select() {
            if (this.m_enabled) {
                var a = this.topBlock;
                a && a.select();
            }
        }
        contextMenu() {
            if (this.m_enabled) {
                var a = this.topBlock;
                a && a.contextMenu();
            }
        }
        dismiss() {
            if (this.m_enabled) {
                var a = this.topBlock;
                a && a.dismiss();
            }
        }
        dump(a) {
            a = {};
            for (let b = 0; b < this.m_blocks.length; b++)
                a[b] = this.m_blocks[b].name;
            return JSON.stringify(a, null, 4);
        }
    }
    return {Manager: q};
})();
