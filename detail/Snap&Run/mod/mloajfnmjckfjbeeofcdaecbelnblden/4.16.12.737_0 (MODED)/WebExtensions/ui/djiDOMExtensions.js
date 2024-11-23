(function () {
    Node.prototype.removeAllChildren = function (b) {
        if (b) {
            b = this.querySelectorAll(b);
            for (let a = b.length - 1; 0 <= a; a--) this.removeChild(b[a]);
        } else for (; (b = this.lastChild); ) this.removeChild(b);
    };
})();
(function () {
    NodeList.prototype.setAttribute = function (b, a) {
        for (let c = 0; c < this.length; c++) this[c].setAttribute(b, a);
    };
    NodeList.prototype.removeAttribute = function (b) {
        for (let a = 0; a < this.length; a++) this[a].removeAttribute(b);
    };
    NodeList.prototype.addEventListener = function (b, a, c) {
        for (let d = 0; d < this.length; d++) this[d].addEventListener(b, a, c);
    };
    NodeList.prototype.removeEventListener = function (b, a, c) {
        for (let d = 0; d < this.length; d++)
            this[d].removeEventListener(b, a, c);
    };
})();
(function () {
    function b(a) {
        a.preventDefault();
        a.stopPropagation();
    }
    HTMLElement.prototype.toggleAttribute = function (a, c) {
        const d = this.getAttribute(a);
        if (null === d || void 0 === d) {
            if (null === c || void 0 === c) c = "";
            this.setAttribute(a, c);
        } else this.removeAttribute(a);
    };
    HTMLElement.prototype.enable = function (a) {
        a || 0 === arguments.length
            ? this.removeAttribute("disabled")
            : this.setAttribute("disabled", "");
    };
    HTMLElement.prototype.hide = function (a) {
        a || 0 === arguments.length
            ? this.setAttribute("dji-cwu-hidden", "")
            : this.removeAttribute("dji-cwu-hidden");
    };
    HTMLElement.prototype.isHidden = function () {
        return this.hasAttribute("dji-cwu-hidden");
    };
    HTMLElement.prototype.activate = function (a) {
        a || 0 === arguments.length
            ? this.setAttribute("dji-cwu-active", "")
            : this.removeAttribute("dji-cwu-active");
    };
    HTMLElement.prototype.isActive = function () {
        return this.hasAttribute("dji-cwu-active");
    };
    HTMLElement.prototype.turnOn = function (a) {
        a || 0 === arguments.length
            ? this.setAttribute("dji-cwu-on", "")
            : this.removeAttribute("dji-cwu-on");
    };
    HTMLElement.prototype.toggleOnOff = function () {
        this.toggleAttribute("dji-cwu-on", "");
        return this.isOn();
    };
    HTMLElement.prototype.isOn = function () {
        return this.hasAttribute("dji-cwu-on");
    };
    HTMLElement.prototype.focusAsync = function (a) {
        let c = this.getRootNode();
        if (c.activeElement === this) return a();
        let d = function (e) {
            c.removeEventListener("focus", d, !0);
            a();
        };
        c.addEventListener("focus", d, !0);
        this.focus();
    };
    HTMLElement.prototype.hasFocusWithin = function () {
        let a = this.getRootNode().activeElement;
        for (; a && a !== this; ) a = a.parentElement;
        return a === this;
    };
    HTMLElement.prototype.enableInputEvents = function (a) {
        const c =
            "click compositionstart compositionupdate compositionend dblclick input keydown keypress keyup mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup scroll wheel".split(
                " ",
            );
        if (a || 0 === arguments.length)
            for (var d = 0; d < c.length; d++)
                this.removeEventListener(c[d], b, !0);
        else for (d = 0; d < c.length; d++) this.addEventListener(c[d], b, !0);
    };
})();
(function () {
    SVGRect.prototype.containsX = function (b) {
        return this.x <= b && b <= this.x + this.width;
    };
    SVGRect.prototype.containsY = function (b) {
        return this.y <= b && b <= this.y + this.height;
    };
    SVGRect.prototype.contains = function (b, a) {
        return this.containsX(b) && this.containsY(a);
    };
})();
(function () {
    const b = MutationObserver.prototype.observe,
        a = MutationObserver.prototype.disconnect;
    MutationObserver.prototype.hasTarget = function (c) {
        return !!this.m_targets && this.m_targets.has(c);
    };
    MutationObserver.prototype.observe = function (c, d) {
        this.m_targets || (this.m_targets = new Set());
        this.m_targets.add(c);
        return b.call(this, c, d);
    };
    MutationObserver.prototype.disconnect = function () {
        this.m_targets && this.m_targets.clear();
        return a.call(this);
    };
})();
(function () {
    Event.prototype.isNonPrintable = function () {
        return this instanceof KeyboardEvent
            ? 1 === this.key.length
                ? !1
                : !0
            : !0;
    };
})();
