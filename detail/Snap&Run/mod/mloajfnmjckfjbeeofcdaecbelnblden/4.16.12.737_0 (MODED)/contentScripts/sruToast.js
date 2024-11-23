class DjiSruToast {
    constructor(b, a, c) {
        const d = this;
        this.m_ui = {
            mainView: document.createElement("dji-sru-toast"),
            contentView: document.createElement("dji-sru-toast-content"),
            textView: document.createElement("dji-sru-toast-content-text"),
            actionView: void 0,
        };
        this.m_timers = {autoHide: void 0};
        this.m_options = {
            error: !(!a || !a.error),
            closeOnClick: !(!a || !a.closeOnClick),
            action: void 0,
        };
        a &&
            a.action &&
            ((this.m_options.action = {
                url: a.action.url || null,
                message: a.action.message || null,
                close: !!a.action.close,
            }),
            (this.m_ui.actionView = document.createElement(
                "dji-sru-toast-content-action",
            )));
        this.m_ui.textView.innerText = b || "";
        this.m_ui.contentView.appendChild(this.m_ui.textView);
        this.m_ui.actionView &&
            ((this.m_ui.actionView.innerText = "TOPICS"),
            this.m_ui.contentView.appendChild(this.m_ui.actionView),
            this.m_ui.mainView.setAttribute("dji-sru-mode", "action"));
        this.m_ui.mainView.appendChild(this.m_ui.contentView);
        document.documentElement.appendChild(this.m_ui.mainView);
        this.m_options.closeOnClick &&
            this.m_ui.contentView.addEventListener("click", function () {
                d.__destroy();
            });
        this.m_options.error &&
            this.m_ui.contentView.setAttribute("dji-sru-toast-error", "true");
        this.m_ui.actionView &&
            this.m_ui.actionView.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                d.__onAction();
            });
        !isNaN(c) &&
            0 < c &&
            ((this.m_timers.autoHide = new globalThis.dji.Timer(
                this,
                this.__destroy,
            )),
            this.m_timers.autoHide.trigger(c));
    }
    static show(b, a, c) {
        DjiSruToast.hide();
        DjiSruToast.__instance = new DjiSruToast(b, a, c);
    }
    static hide() {
        DjiSruToast.__instance &&
            (DjiSruToast.__instance.__destroy(),
            (DjiSruToast.__instance = void 0));
    }
    __destroy() {
        this.m_ui.mainView.remove();
        this.m_timers.autoHide && this.m_timers.autoHide.stop();
        DjiSruToast.__instance === this && (DjiSruToast.__instance = void 0);
    }
    __onAction() {
        const b = this;
        if (this.m_options.action.message)
            chrome.runtime.sendMessage(
                {message: this.m_options.action.message},
                function () {
                    dji.utils.ignoreLastError();
                    b.m_options.action.close && b.__destroy();
                },
            );
        else if (this.m_options.action.url) {
            const a = DjiSruToast.__urlToWindowName(this.m_options.action.url);
            window.open(this.m_options.action.url, a);
            b.m_options.action.close && b.__destroy();
        }
    }
    static __urlToWindowName(b) {
        return "_blank";
    }
}
