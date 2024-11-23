(function () {
    function p() {
        var a = document.getElementsByClassName(
            "docs-texteventtarget-iframe",
        )[0].contentDocument;
        if (
            null !== a &&
            ((a = a.querySelectorAll("div[contenteditable='true'")),
            0 !== a.length)
        )
            return a[0];
    }
    function q(a, b, c, d) {
        if (!a || (a instanceof Array && 0 >= a.length)) return c();
        d = d || 0;
        if (a instanceof Array) m(a, 0, b, c, d);
        else {
            let e = Object.keys(a);
            n(a, e, 0, b, c, d);
        }
    }
    function m(a, b, c, d, e) {
        if (a.length <= b) return d();
        2 === c.length
            ? c(a[b], function (f) {
                  f ? setTimeout(d, e, f) : setTimeout(m, e, a, b + 1, c, d, e);
              })
            : c(b, a[b], function (f) {
                  f ? setTimeout(d, e, f) : setTimeout(m, e, a, b + 1, c, d, e);
              });
    }
    function n(a, b, c, d, e, f) {
        if (b.length <= c) return e();
        2 === d.length
            ? d(a[b[c]], function (g) {
                  g
                      ? setTimeout(e, f, g)
                      : setTimeout(n, f, a, b, c + 1, d, e, f);
              })
            : d(b[c], a[b[c]], function (g) {
                  g
                      ? setTimeout(e, f, g)
                      : setTimeout(n, f, a, b, c + 1, d, e, f);
              });
    }
    function u(a, b) {
        let c = a.text;
        if (!c || 0 >= c.length || null === p()) return b();
        b = a.extended.backspaceKey;
        var d = a.extended.rightKey;
        a = [];
        if (void 0 !== d && "number" === typeof d)
            for (; 0 < d; ) a.push(h("keydown", 0, 39)), --d;
        if (void 0 !== b && "number" === typeof b)
            for (; 0 < b; ) a.push(h("keydown", 8, 8)), --b;
        if (null !== c)
            for (b = 0; b < c.length; b++) {
                var e = c.charCodeAt(b);
                let f = c.charAt(b);
                d = f.toUpperCase() === f;
                e = h("keypress", f, e);
                e.shiftKey = d;
                a.push(e);
            }
        k(a, !1, 5, null, null);
    }
    function v(a, b) {
        a = a && void 0 !== a.repeats ? a.repeats : 1;
        if (0 >= a) return b();
        a = w([
            {id: 1, type: "keydown", key: "Delete", keyCode: 46, repeats: a},
            {type: "keyup", key: "Delete", keyCode: 46},
        ]);
        k(
            a,
            !0,
            0,
            function (c, d, e) {
                e ||
                    1 !== d.__id ||
                    document.execCommand("forwardDelete", !1, null);
            },
            function () {
                setTimeout(b, 10);
            },
        );
    }
    function x(a, b) {
        a = [];
        a.push(h("keydown", 37, 37));
        a.push(h("keyup", 37, 37));
        k(a, !1, 5, null, null);
    }
    function y(a, b) {
        a = [];
        a.push(h("keydown", 8, 8));
        a.push(h("keyup", 8, 8));
        k(a, !1, 5, null, null);
    }
    function z(a, b) {
        q(
            a,
            function (c, d, e) {
                c = A(d);
                k(
                    c,
                    !1,
                    0,
                    function (f, g, l) {
                        d.callbackMessage &&
                            ((f = new CustomEvent(d.callbackMessage, {
                                detail: {index: f, cancelled: l, params: d},
                            })),
                            document.documentElement.dispatchEvent(f));
                    },
                    e,
                );
            },
            function () {
                setTimeout(b, 10);
            },
        );
    }
    function k(a, b, c, d, e) {
        let f = p();
        if (b)
            q(
                a,
                function (g, l, r) {
                    let B = !f.dispatchEvent(l);
                    d && d(g, l, B) ? r(!0) : r(!1);
                },
                e,
                c,
            );
        else {
            for (b = 0; b < a.length; b++) {
                c = a[b];
                let g = !f.dispatchEvent(c);
                if (d && d(b, c, g)) break;
            }
            e();
        }
    }
    function h(a, b, c) {
        a = new Event(a, {bubbles: !0, cancelable: !0});
        a.__isDjiSyntheticEvent = !0;
        a.altKey = !1;
        a.ctrlKey = !1;
        a.metaKey = !1;
        a.shiftKey = !1;
        a.key = b;
        a.keyCode = c;
        a.charCode = c;
        a.which = c;
        a.location = 0;
        a.repeat = !1;
        a.isComposing = !1;
        return a;
    }
    function t(a) {
        let b = new Event(a.type, {bubbles: !0, cancelable: !0}),
            c = "keypress" === a.type;
        b.__isDjiSyntheticEvent = !0;
        a.hasOwnProperty("id") && (b.__id = a.id);
        b.altKey = !!a.altKey;
        b.ctrlKey = !!a.ctrlKey;
        b.metaKey = !!a.metaKey;
        b.shiftKey = !!a.shiftKey;
        b.key = a.key;
        b.keyCode = a.keyCode;
        b.code = a.key;
        b.charCode = c ? a.keyCode : 0;
        b.which = a.keyCode;
        b.location = 0;
        b.repeat = !!a.repeat;
        b.isComposing = !1;
        return b;
    }
    function A(a) {
        let b = [],
            c = a.repeats || 1,
            d = !a.hasOwnProperty("repeat");
        for (let e = 0; e < c; e++) d && (a.repeat = 0 < e), b.push(t(a));
        return b;
    }
    function w(a) {
        let b = [];
        for (let c = 0; c < a.length; c++) {
            let d = a[c],
                e = d.repeats || 1,
                f = !d.hasOwnProperty("repeat");
            for (let g = 0; g < e; g++) f && (d.repeat = 0 < g), b.push(t(d));
        }
        return b;
    }
    document.querySelector("dji-cowriter").addEventListener(
        "com.donjohnston.cwu.dispatch",
        function (a) {
            a.preventDefault();
            a.stopPropagation();
            if (a.detail)
                try {
                    "keyboardEvents" === a.detail.command
                        ? z(a.detail.params, function () {
                              if (a.detail.callbackMessage) {
                                  let b = new CustomEvent(
                                      a.detail.callbackMessage,
                                      {detail: {userData: a.detail.userData}},
                                  );
                                  document.documentElement.dispatchEvent(b);
                              }
                          })
                        : "text" === a.detail.command
                          ? u(a.detail.params, function () {
                                if (a.detail.callbackMessage) {
                                    let b = new CustomEvent(
                                        a.detail.callbackMessage,
                                        {detail: {userData: a.detail.userData}},
                                    );
                                    document.documentElement.dispatchEvent(b);
                                }
                            })
                          : "moveBackward" === a.detail.command
                            ? x(a.detail.params, function () {
                                  if (a.detail.callbackMessage) {
                                      let b = new CustomEvent(
                                          a.detail.callbackMessage,
                                          {
                                              detail: {
                                                  userData: a.detail.userData,
                                              },
                                          },
                                      );
                                      document.documentElement.dispatchEvent(b);
                                  }
                              })
                            : "deleteBackward" === a.detail.command
                              ? y(a.detail.params, function () {
                                    if (a.detail.callbackMessage) {
                                        let b = new CustomEvent(
                                            a.detail.callbackMessage,
                                            {
                                                detail: {
                                                    userData: a.detail.userData,
                                                },
                                            },
                                        );
                                        document.documentElement.dispatchEvent(
                                            b,
                                        );
                                    }
                                })
                              : "deleteForward" === a.detail.command &&
                                v(a.detail.params, function () {
                                    if (a.detail.callbackMessage) {
                                        let b = new CustomEvent(
                                            a.detail.callbackMessage,
                                            {
                                                detail: {
                                                    userData: a.detail.userData,
                                                },
                                            },
                                        );
                                        document.documentElement.dispatchEvent(
                                            b,
                                        );
                                    }
                                });
                } catch (b) {}
        },
        !0,
    );
})();
