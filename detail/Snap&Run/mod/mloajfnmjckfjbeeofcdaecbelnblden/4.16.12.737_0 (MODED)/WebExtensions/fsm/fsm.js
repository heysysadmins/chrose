globalThis.dji = globalThis.dji || {};
(function (h) {
    h.create = function (c) {
        const e = {
            value: c.initialState,
            transition(a, b, f) {
                const g = c[a],
                    d = g.transitions[b];
                if (!d) return null;
                b = d.target(f);
                d.action(f);
                if (a === b) return a;
                g.actions.onExit();
                a = c[b];
                a.actions.onAboutToEnter();
                e.value = b;
                a.actions.onEntered();
                return e.value;
            },
        };
        return e;
    };
})((globalThis.dji.fsm = globalThis.dji.fsm || {}));
