window.sru = window.sru || {};
(function (n) {
    function rb() {
        let a = function () {
            k.enable(!1);
        };
        dji.shortcuts.addEventListener("goPrevious", function () {
            sru.toolbar.isOutlinesPanelExpanded() &&
                (k.isEnabled
                    ? k.goPrevious()
                    : (k.enable(!0), k.sync() || k.goPrevious()));
        });
        dji.shortcuts.addEventListener("goNext", function () {
            sru.toolbar.isOutlinesPanelExpanded() &&
                (k.isEnabled
                    ? k.goNext()
                    : (k.enable(!0), k.sync() || k.goNext()));
        });
        dji.shortcuts.addEventListener("enter", function () {
            k.enter();
        });
        dji.shortcuts.addEventListener("select", function () {
            k.select();
        });
        dji.shortcuts.addEventListener("contextMenu", function () {
            k.contextMenu();
        });
        dji.shortcuts.addEventListener("escape", function () {
            k.dismiss();
        });
        window.addEventListener("mousedown", a, !0);
        sru.mainContainer.contentWindow().addEventListener("mousedown", a, !0);
    }
    function sb() {
        __$(".dji-sru-pagination-container").on(
            "click",
            ".dji-sru-page-content",
            X,
        );
        __$(".dji-sru-pagination-container").on(
            "dblclick x-enter",
            ".dji-sru-folder-item",
            tb,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-select",
            ".dji-sru-folder-item",
            ub,
        );
        __$(".dji-sru-pagination-container").on(
            "contextmenu x-contextmenu",
            ".dji-sru-folder-item",
            vb,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-search-folder-item",
            wb,
        );
        __$(".dji-sru-pagination-container").on(
            "click",
            ".dji-sru-folder-page .dji-sru-page-toolbar .dji-sru-folder-page-info .dji-sru-folder-name span#dji-sru-folder-name",
            xb,
        );
        __$(".dji-sru-pagination-container").on(
            "input",
            ".dji-sru-folder-page input[dji-sru-search-outlines-input]",
            yb,
        );
        __$(".dji-sru-pagination-container").on(
            "click",
            ".dji-sru-outline-page .dji-sru-page-toolbar .dji-sru-folder-page-info",
            ya,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-back-to-parent-folder-page",
            za,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-tb-button.dji-sru-show-search-outlines",
            zb,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-tb-button.dji-sru-hide-search-outlines",
            Aa,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-tb-button.dji-sru-reset-search-outlines",
            Ba,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-folder-page-new-folder",
            Ab,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-folder-page-menu",
            Bb,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-outline-page-menu",
            Cb,
        );
        __$(".dji-sru-pagination-container").on(
            "mousedown x-enter",
            ".dji-sru-outline-new-topic",
            Db,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-page-folder-new.dji-outline",
            Eb,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-tb-button.dji-sru-hide-search-outline-template",
            Ca,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-tb-button.dji-sru-reset-search-outline-template",
            Da,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-tb-button.dji-sru-show-search-in-topics",
            Fb,
        );
        __$(".dji-sru-pagination-container").on(
            "input",
            "input[dji-sru-search-in-topic-input]",
            Gb,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-tb-button.dji-sru-hide-search-in-topics",
            S,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-tb-button.dji-sru-highlight-prev-item",
            function () {
                sru.searchInOutlineController.highlightPrevSearchItem();
            },
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-tb-button.dji-sru-highlight-next-item",
            function () {
                sru.searchInOutlineController.highlightNextSearchItem();
            },
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-tb-button.dji-sru-hide-search-in-topics",
            S,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-back-button",
            za,
        );
        __$(".dji-sru-pagination-container").on(
            "input",
            ".dji-sru-outline-page input[dji-sru-search-outline-template-input]",
            Hb,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-outline-page .dji-sru-search-outline-template-overlay .dji-sru-search-result .dji-sru-search-outline-template",
            Ib,
        );
        __$(".dji-sru-pagination-container").on(
            "click",
            ".dji-sru-outline-sources-page .dji-sru-outline-source .dji-sru-check-box",
            Jb,
        );
        __$("#dji-folder-page-template-dlg-1-cancel").on(
            "click x-enter",
            function () {
                y(!1);
            },
        );
        __$("#dji-sru-outline-move-to-dlg-cancel").on(
            "click x-enter",
            function () {
                z({show: !1, updateUIPathState: !0});
            },
        );
        __$("#dji-sru-outline-move-to-dlg .dji-sru-outline-new-folder").on(
            "click x-enter",
            function (a) {
                $(a.currentTarget).hasClass("dji-disable")
                    ? (a.stopPropagation(), a.preventDefault())
                    : y(!0, {
                          title: "New Folder",
                          value: "New Folder",
                          placeholder: "Folder Name",
                          doneBtnText: "CREATE FOLDER",
                          doneCallback: Kb,
                      });
            },
        );
        __$("#dji-sru-outline-move-to-dlg .dji-sru-dialog-close").on(
            "click x-enter",
            function () {
                A(g());
                z({show: !1, updateUIPathState: !0});
            },
        );
        __$("#dji-sru-outline-move-to-dlg .dji-sru-dialog-back").on(
            "click x-enter",
            Lb,
        );
        __$("#dji-sru-outline-move-to-dlg").on(
            "dblclick x-enter",
            ".dji-sru-folder-item",
            Mb,
        );
        __$("#dji-sru-outline-move-to-dlg").on(
            "click x-select",
            ".dji-sru-folder-item",
            Nb,
        );
        __$("#dji-sru-outline-move-to-dlg-done").on("click x-enter", Ob);
        __$("#dji-sru-outline-source-dlg .dji-sru-dialog-close").on(
            "click x-enter",
            function () {
                E({page: g(), show: !1, updateUIPathState: !0});
                k.popBlock("source_dialog");
            },
        );
        __$("#dji-sru-outline-source-dlg").on(
            "click x-enter",
            ".dji-sru-tab-item-more[dji-item=dji-sru-outline-source-more]",
            Pb,
        );
        __$("#dji-sru-outline-source-dlg").on(
            "click x-enter",
            ".dji-sru-combobox-contributors",
            Qb,
        );
        __$("#dji-sru-outline-source-dlg").on(
            "blur x-dismiss",
            ".dji-sru-combobox-contributors",
            Rb,
        );
        __$("#dji-sru-outline-source-dlg").on(
            "click x-enter",
            ".dji-sru-combobox-contributors .dji-sru-contributor-option",
            Sb,
        );
        __$("#dji-sru-outline-source-dlg").on(
            "click x-enter",
            ".dji-sru-form-button.dji-sru-source-add-author-button",
            Tb,
        );
        __$("#dji-sru-outline-source-dlg").on(
            "click x-enter",
            ".dji-sru-tb-text-button.dji-sru-outline-source-save",
            Ea,
        );
        __$("#dji-sru-outline-source-dlg").on(
            "click x-enter",
            ".dji-sru-tb-button.dji-sru-hide-search-sources",
            Fa,
        );
        __$("#dji-sru-outline-source-dlg").on(
            "click x-enter",
            ".dji-sru-tb-button.dji-sru-reset-search-sources",
            Ga,
        );
        __$("#dji-sru-outline-source-dlg").on(
            "keydown",
            "input[dji-sru-search-sources-input]",
            Ub,
        );
        __$("#dji-sru-outline-source-dlg").on(
            "click x-enter",
            ".dji-sru-search-result .dji-sru-search-source",
            Vb,
        );
        __$("#dji-folder-page-delete-outline-dlg-save").on("click x-enter", Ha);
        __$("#dji-folder-page-delete-outline-dlg-delete").on(
            "click x-enter",
            Ia,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-tab-item",
            Wb,
        );
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-sru-oss-tab-item",
            Xb,
        );
        __$("#dji-sru-outline-source-dlg").on(
            "click x-enter",
            ".dji-sru-tab-item",
            Yb,
        );
        __$(".dji-sru-pagination-container").on(
            "click",
            ".dji-sru-outline-source-bullet",
            Zb,
        );
        __$("#dji-sru-sources-toolbar").on("click", $b);
        __$(".dji-sru-pagination-container").on(
            "click x-enter",
            ".dji-page-folder-new.dji-outline-new-source",
            ac,
        );
        __$(".dji-sru-pagination-container").on(
            "x-enter",
            ".dji-sru-outline-topic-element",
            bc,
        );
        __$(".dji-sru-pagination-container").on(
            "click",
            ".dji-sru-outline-details",
            ia,
        );
        __$(".dji-sru-pagination-container").on(
            "click",
            ".dji-sru-outline-sources",
            ia,
        );
        __$(".dji-sru-pagination-container").on(
            "dragleave",
            ".dji-sru-outline-topic",
            cc,
        );
        __$(".dji-sru-pagination-container").on(
            "mousedown",
            ".dji-sru-outline-topic-bullet",
            dc,
        );
        __$(".dji-sru-pagination-container").on(
            "click",
            ".dji-sru-outline-topic-content",
            ec,
        );
        __$(".dji-sru-pagination-container").on(
            "keydown",
            ".dji-sru-outline-topic-content",
            fc,
        );
        __$(".dji-sru-pagination-container").on(
            "paste",
            ".dji-sru-outline-topic-content",
            gc,
        );
        __$(".dji-sru-pagination-container").on(
            "input",
            ".dji-sru-outline-topic-content",
            hc,
        );
        __$(".dji-sru-pagination-container").on(
            "blur",
            ".dji-sru-outline-topic-content",
            ic,
        );
        __$(".dji-sru-pagination-container").on(
            "focus",
            ".dji-sru-outline-topic-content",
            jc,
        );
        __$(".dji-sru-pagination-container").on(
            "click",
            ".dji-sru-ellipses",
            Ja,
        );
        __$(".dji-sru-pagination-container").on(
            "click",
            ".dji-sru-collapse",
            Ja,
        );
        __$("#dji-sru-topics-toolbar").on("click", kc);
        __$(".dji-sru-pagination-container").on(
            "click",
            '[dji-template-id="template-page-topic-element"] .dji-sru-intext-citation a',
            lc,
        );
        dji.utils.addEventListenerToDocumentElements("drop", Ka, !0);
        __$("body").on("contextmenu", mc);
        __$(".dji-sru-pagination-container").on("focus", "input", La);
        __$(".dji-sru-pagination-container").on(
            "focus",
            "*[contenteditable]",
            La,
        );
        __$("#dji-sru-folder-page-context-menu").on(
            "click x-enter x-dismiss",
            function () {
                $(this).removeClass("dji-visible");
                k.removeBlock("submenu_pdf");
                k.removeBlock("folder_context_menu");
                __$("#dji-sru-outline-open-pdf-sources").removeClass(
                    "dji-visible",
                );
            },
        );
        __$("#dji-sru-folder-page-item-context-menu").on(
            "click x-enter x-dismiss",
            function () {
                k.removeBlock("folder_item_context_menu");
                $(this).removeClass("dji-visible");
            },
        );
        __$("#dji-sru-outline-page-context-menu").on(
            "click x-enter x-dismiss",
            function () {
                $(this).removeClass("dji-visible");
                k.removeBlock("submenu_pdf");
                k.removeBlock("menu_outline");
                __$("#dji-sru-outline-open-pdf-sources").removeClass(
                    "dji-visible",
                );
            },
        );
        __$("#dji-sru-outline-open-pdf-sources").on(
            "click x-enter",
            function () {
                $(this).removeClass("dji-visible");
                __$("#dji-sru-folder-page-context-menu").removeClass(
                    "dji-visible",
                );
                __$("#dji-sru-outline-page-context-menu").removeClass(
                    "dji-visible",
                );
                k.removeBlock("submenu_pdf");
                k.removeBlock("folder_context_menu");
                k.removeBlock("menu_outline");
            },
        );
        __$("#dji-sru-outline-new-source-more-context-menu").on(
            "click x-enter x-dismiss",
            function () {
                __$(
                    ".dji-sru-tab-item-more[dji-item=dji-sru-outline-source-more]",
                ).removeClass("dji-dropdown");
                $(this).removeClass("dji-visible");
                k.removeBlock("menu_source_type");
            },
        );
        __$("#dji-sru-folder-page-sort-by-alpha").on(
            "click x-enter",
            Y.alphabetical,
            Ma,
        );
        __$("#dji-sru-folder-page-sort-by-time").on(
            "click x-enter",
            Y.recent,
            Ma,
        );
        __$("#dji-sru-folder-page-move-to-outline-items").on(
            "click x-enter",
            Na,
        );
        __$("#dji-sru-folder-page-delete-outline-items").on(
            "click x-enter",
            Oa,
        );
        __$("#dji-sru-outline-page-rename-outline").on("click x-enter", ya);
        __$("#dji-sru-folder-page-option-page").on(
            "click x-enter",
            function () {
                dji.utils.callListeners(u, "options");
            },
        );
        __$("#dji-sru-folder-page-sign-out").on("click x-enter", function () {
            dji.utils.callListeners(u, "signOut");
        });
        __$("#dji-sru-outline-page-download").on("click x-enter", nc);
        __$("#dji-sru-outline-page-print").on("click x-enter", oc);
        __$("#dji-sru-search-sources").on("click x-enter", pc);
        __$("#dji-sru-folder-page-item-rename-outline").on("click x-enter", qc);
        __$("#dji-sru-folder-page-item-move-to-outline").on(
            "click x-enter",
            Na,
        );
        __$("#dji-sru-folder-page-item-delete-outline").on("click x-enter", Oa);
        __$("#dji-sru-outline-new-source-more-context-menu").on(
            "click x-enter",
            ".dji-sru-menu-item[dji-item]",
            rc,
        );
        __$("#dji-sru-search-outline-template").on("click x-enter", sc);
    }
    function La(a) {
        sru.mainContainer.focus(function (b) {
            b && a.target.focus();
        });
    }
    function Pa() {
        q = null;
        w = !1;
        y(!1);
        Z(!1);
        z({show: !1, updateUIPathState: !1});
        E({page: g(), show: !1, updateUIPathState: !1});
        var a = sru.outlinesDataManager.uiPathSize();
        dji.ui.pagination.createPages(
            x,
            a,
            null,
            function (b, c, d) {
                sru.toolbar.enableHighlightButton(!1);
                d = sru.outlinesDataManager.uiPathState(c);
                var e = sru.outlinesDataManager.outlineFromUiPathState(d),
                    f = sru.outlinesDataManager.topicFromUiPathState(d),
                    h = sru.outlinesDataManager.sourceFromUiPathState(d);
                d.outlineViewMode && (aa = d.outlineViewMode);
                0 == c
                    ? (T(b, e, d.selectedOutlines),
                      "moveTo" == d.view &&
                          ((c = null),
                          d.moveToOutline &&
                              (c =
                                  "home" == d.moveToOutline
                                      ? sru.outlinesDataManager.home()
                                      : sru.outlinesDataManager.outlineByUuid(
                                            d.moveToOutline,
                                        )),
                          z({
                              show: !0,
                              outline: c,
                              selOutline: d.moveToSelOutline,
                              updateUIPathState: !1,
                          }),
                          sru.toolbar.enableHighlightButton(!1)))
                    : ("outline" == d.pageType &&
                          (T(b, e, d.selectedOutlines, d.selTab, d.sourceType),
                          "moveTo" == d.view
                              ? ((c = null),
                                d.moveToOutline &&
                                    (c =
                                        "home" == d.moveToOutline
                                            ? sru.outlinesDataManager.home()
                                            : sru.outlinesDataManager.outlineByUuid(
                                                  d.moveToOutline,
                                              )),
                                z({
                                    show: !0,
                                    outline: c,
                                    selOutline: d.moveToSelOutline,
                                    updateUIPathState: !1,
                                }),
                                sru.toolbar.enableHighlightButton(!1))
                              : "source" == d.view &&
                                (E({
                                    page: b,
                                    show: !0,
                                    dlgMode: d.dlgMode,
                                    selTabItem: d.sourceTabItem,
                                    source: h,
                                    updateUIPathState: !1,
                                }),
                                sru.toolbar.enableHighlightButton(!1))),
                      "linkToSource" == d.pageType &&
                          ((b.outline = e),
                          (b.topic = f),
                          Qa(b, e, f),
                          "source" == d.view &&
                              E({
                                  page: b,
                                  show: !0,
                                  dlgMode: d.dlgMode,
                                  selTabItem: d.sourceTabItem,
                                  source: h,
                                  updateUIPathState: !1,
                              })));
            },
            ja,
        );
    }
    function ja(a) {
        a &&
            a.querySelector(".dji-sru-outline-page") &&
            setTimeout(function () {
                a.removeAttribute("dji-loading");
            }, 4e3);
    }
    function g() {
        return x.querySelector(".dji-sru-page-current");
    }
    function Eb() {
        dji.ui.pagination.nextPage(
            x,
            function (a) {
                var b = sru.outlinesDataManager.createSkeletonOutline(
                    g().outline,
                );
                T(a, b);
            },
            function (a) {
                ja(a);
                $(g())
                    .find(
                        ".dji-sru-page-content ul#u000 li.dji-sru-outline-topic .dji-sru-outline-topic-content",
                    )
                    .focus();
            },
        );
    }
    function tc() {
        let a = g().topic;
        $(g())
            .find(".dji-sru-page-content.dji-sru-outline-sources")
            .children()
            .each(function () {
                let b = this.__state;
                if (b.currentLinked != b.originalLinked) {
                    let c = this.source;
                    b.currentLinked ? a.linkSource(c) : a.unlinkSource(c);
                }
            });
    }
    function za(a) {
        sru.toolbar.enableHighlightButton(!1);
        g().outline.isSkeleton()
            ? (J && sru.toolbar.disableHighlight(), Z(!0, g().outline))
            : ($(a.currentTarget).hasClass("dji-sru-link-to-source") && tc(),
              dji.ui.pagination.previousPage(x, function (b) {
                  var c = b.outline;
                  c.isHome() || c.isDirectory()
                      ? A(b)
                      : (ka(b),
                        la(b),
                        (c = $(b)
                            .find(
                                ".dji-sru-tab-items .dji-sru-tab-item.dji-selected",
                            )
                            .attr("dji-item")),
                        sru.toolbar.enableHighlightButton(
                            "dji-sru-outline-details" == c,
                        ));
                  J && sru.toolbar.disableHighlight();
                  sru.outlinesDataManager.popOutlineFromStack();
                  sru.toolbar.setTitle(b.outline);
                  k.popBlock();
              }));
    }
    function tb(a) {
        __$(g())
            .find(".dji-sru-page-content")
            .hasClass("dji-sru-outline-select") ||
            dji.ui.pagination.nextPage(
                x,
                function (b) {
                    var c = a.currentTarget.outline;
                    sru.outlinesDataManager.pushOutlineToStack(c);
                    T(b, c);
                    dji.utils.callListeners(u, "outlineOpened", c);
                },
                ja,
            );
    }
    function ub(a) {
        if (a.ctrlKey || a.metaKey || "x-select" === a.type)
            (F = $(a.currentTarget).hasClass("dji-selected")
                ? a.currentTarget
                : null),
                $(a.currentTarget).toggleClass("dji-selected");
        else if (a.shiftKey)
            if (
                ($(a.currentTarget)
                    .parent()
                    .find(".dji-sru-folder-item")
                    .removeClass("dji-selected"),
                $(a.currentTarget).addClass("dji-selected"),
                null == F)
            )
                F = a.currentTarget;
            else {
                if (F == a.currentTarget) return;
                var b = $(F).index(),
                    c = $(a.currentTarget).index();
                if (b > c) {
                    var d = b;
                    b = c;
                    c = d + 1;
                }
                $(F).parent().children().slice(b, c).addClass("dji-selected");
                a.preventDefault();
                a.stopPropagation();
            }
        else
            $(a.currentTarget).hasClass("dji-selected")
                ? ($(a.currentTarget)
                      .parent()
                      .find(".dji-sru-folder-item")
                      .removeClass("dji-selected"),
                  (F = null))
                : ($(a.currentTarget)
                      .parent()
                      .find(".dji-sru-folder-item")
                      .removeClass("dji-selected"),
                  $(a.currentTarget).addClass("dji-selected"),
                  (F = a.currentTarget));
        if ((a = sru.outlinesDataManager.currentUiPathState()))
            (a.selectedOutlines = uc()),
                sru.outlinesDataManager.updateUiPathState(a);
    }
    function vb(a) {
        if (sru.speech.isActive()) a.preventDefault(), a.stopPropagation();
        else if (
            !__$(g())
                .find(".dji-sru-page-content")
                .hasClass("dji-sru-outline-select")
        ) {
            $(a.currentTarget)
                .parent()
                .find(".dji-sru-folder-item")
                .removeClass("dji-selected");
            $(a.currentTarget).addClass("dji-selected");
            var b = a.clientX,
                c = a.clientY;
            if (void 0 === b || void 0 === c)
                (c = a.currentTarget.getBoundingClientRect()),
                    (b = c.left + c.width / 10),
                    (c = c.top + c.height / 2);
            var d = a.currentTarget.outline,
                e = __$("#dji-sru-folder-page-item-context-menu");
            K = d;
            d = e.find(".dji-sru-context-menu")[0];
            b + $(d).width() >= e.width() - 10 &&
                (b = e.width() - 10 - $(d).width());
            c + 200 >= $(window).height() && (c = $(window).height() - 200);
            d.style.left = b + "px";
            d.style.top = c + "px";
            e.addClass("dji-visible");
            k.addBlockAndSetup("folder_item_context_menu", {
                name: "folder_item_context_menu",
                dom: {element: d, selectors: ["[dji-accessible]"]},
            });
            a.preventDefault();
            a.stopPropagation();
        }
    }
    function wb(a) {
        Aa();
        dji.ui.pagination.nextPage(x, function (b) {
            var c = a.currentTarget.outline;
            sru.outlinesDataManager.pushOutlineToStack(c);
            T(b, c);
        });
    }
    function ma(a) {
        if (!a || a.isHome())
            return "<div class='dji-sru-folder-name'>Home</div>";
        var b = 30 - Math.min(a.title().length, 10);
        for (var c = "", d = [], e = a.parent(); !e.isHome(); )
            d.push(e.title()), (c = e.title() + " > " + c), (e = e.parent());
        d.push("Home");
        c = "Home > " + c;
        if (c.length > b)
            if (
                (d.reverse(),
                (e = d[d.length - 1].length),
                d[0].length + e > b - 6)
            )
                c = d[0] + " > ... > ";
            else {
                var f = 0;
                for (c = ""; e + d[f].length + 5 < b && f < d.length - 1; )
                    (c += d[f] + " > "), (e += d[f].length + 3), f++;
                c += " ... > " + d[d.length - 1] + " > ";
            }
        return (
            "<div class='dji-sru-folder-full-path'>" +
            (c +
                "&nbsp;</div><div class='dji-sru-folder-name'><span id='dji-sru-folder-name'>") +
            a.title() +
            "</span></div>"
        );
    }
    function T(a, b, c, d, e) {
        a.outline = b;
        if (b.isHome() || b.isDirectory())
            sru.toolbar.enableHighlightButton(!1),
                a.appendChild(
                    dji.ui.templates.load(t, "dji-template-folder-page"),
                ),
                (c = c || []),
                A(a, c),
                (d = ma(b)),
                M(a, d, !0);
        else {
            a.appendChild(
                dji.ui.templates.load(t, "dji-template-sru-outline-page"),
            );
            N(null);
            a.querySelector(".dji-sru-page-content")
                .querySelector(".dji-sru-outline-content")
                .addEventListener("scroll", X);
            q = null;
            w = !1;
            c = a.outline.topics();
            if (0 < c.length)
                for (var f = a.querySelector("#u000"), h = 0; h < c.length; h++)
                    na(a, c[h], f);
            else L({page: a});
            Ra(a);
            e = e || "APA";
            if ((f = a.outline))
                if (
                    ($(a)
                        .find(
                            ".dji-sru-tab-items.dji-outline-sources-style .dji-sru-oss-tab-item.dji-selected",
                        )
                        .removeClass("dji-selected"),
                    $(a)
                        .find(
                            ".dji-sru-tab-items.dji-outline-sources-style .dji-sru-oss-tab-item[dji-oss-style=" +
                                e +
                                "]",
                        )
                        .addClass("dji-selected"),
                    (c = $(a).find("#dji-workaround-s000")),
                    (f = f.sources()),
                    (e = e || "APA"),
                    0 == f.length)
                )
                    $(a)
                        .find(
                            ".dji-sru-page-content .dji-tab-item-view.dji-sru-outline-content.dji-sru-outline-sources",
                        )
                        .addClass("dji-empty");
                else
                    for (
                        $(a)
                            .find(
                                ".dji-sru-page-content .dji-tab-item-view.dji-sru-outline-content.dji-sru-outline-sources",
                            )
                            .removeClass("dji-empty"),
                            h = 0;
                        h < f.length;
                        h++
                    )
                        Sa(c, f[h], e);
            e = b.isSkeleton() ? "Outline Name" : b.title();
            M(a, e);
            d = d || "dji-sru-outline-details";
            sru.toolbar.enableHighlightButton("dji-sru-outline-details" == d);
            B(a, d);
        }
        sru.toolbar.setTitle(b);
        b.isHome()
            ? __$(a).find(".dji-sru-page-toolbar").removeAttr("dji-back-button")
            : __$(a).find(".dji-sru-page-toolbar").attr("dji-back-button", "");
        Ta(a, b.title());
    }
    function A(a, b) {
        var c = a.querySelector(".dji-sru-page-content");
        vc(c);
        var d = a.outline,
            e = d.outlines();
        if (d.isHome() && 0 == e.length)
            $(a).find(".dji-sru-page-content").addClass("dji-sru-no-outline");
        else {
            $(a)
                .find(".dji-sru-page-content")
                .removeClass("dji-sru-no-outline");
            var f;
            b = b || [];
            if (aa == Y.recent) {
                if (
                    (e.sort(function (v, U) {
                        return v.modifiedDate() < U.modifiedDate()
                            ? 1
                            : v.modifiedDate() > U.modifiedDate()
                              ? -1
                              : 0;
                    }),
                    0 != e.length)
                ) {
                    var h = !1,
                        l = Date.now(),
                        m = !1;
                    for (f = 0; f < e.length; f++) {
                        d = e[f];
                        var p = -1 != b.indexOf(d.uuid());
                        m ||
                            (2592e6 >= l - d.modifiedDate()
                                ? h || ((h = !0), V(c, "Recent"))
                                : ((m = !0), V(c, "Oldest", h)));
                        O(c, d, p);
                    }
                }
            } else {
                e.sort(function (v, U) {
                    return v.title().toLowerCase() > U.title().toLowerCase()
                        ? 1
                        : v.title().toLowerCase() < U.title().toLowerCase()
                          ? -1
                          : 0;
                });
                h = [];
                l = [];
                m = [];
                for (f = 0; f < e.length; f++)
                    (d = e[f]),
                        d.isDirectory()
                            ? h.push(d)
                            : d.isPdf()
                              ? m.push(d)
                              : l.push(d);
                if (0 != h.length)
                    for (V(c, "Folders"), f = 0; f < h.length; f++)
                        (d = h[f]), (p = -1 != b.indexOf(d.uuid())), O(c, d, p);
                if (0 != l.length)
                    for (
                        V(c, "Outlines", 0 != h.length), f = 0;
                        f < l.length;
                        f++
                    )
                        (d = l[f]), (p = -1 != b.indexOf(d.uuid())), O(c, d, p);
                if (0 !== m.length)
                    for (V(c, "PDFs", 0 !== h.length), f = 0; f < m.length; f++)
                        (d = m[f]), (p = -1 != b.indexOf(d.uuid())), O(c, d, p);
            }
            Ta(a);
        }
    }
    function vc(a) {
        for (; a.firstChild; ) a.removeChild(a.firstChild);
    }
    function Ta(a, b) {
        a.accessibilityBlock
            ? a.accessibilityBlock.findBlock("content").reload()
            : (a.accessibilityBlock = k.addBlockAndSetup(b, {
                  name: b,
                  blocks: [
                      {
                          name: "toolbar",
                          dom: {
                              element: a,
                              selectors: [
                                  ".dji-sru-page-content .dji-outline-new-source",
                                  ".dji-sru-page-toolbar [dji-accessible]",
                              ],
                          },
                      },
                      {
                          name: "toolbar_sources",
                          dom: {
                              element: a,
                              selectors: [
                                  ".dji-sru-page-content .dji-sru-tab-items [dji-accessible]",
                              ],
                          },
                      },
                      {
                          name: "content",
                          blocks: [
                              {
                                  name: "outlines",
                                  dom: {
                                      element: a,
                                      selectors: [
                                          ".dji-sru-page-content .dji-sru-folder-item[dji-accessible]",
                                      ],
                                  },
                              },
                              {
                                  name: "topics",
                                  dom: {
                                      element: a,
                                      selectors: [
                                          ".dji-sru-page-content .dji-sru-outline-list [dji-accessible]",
                                      ],
                                  },
                              },
                              {
                                  name: "sources",
                                  dom: {
                                      element: a,
                                      selectors: [
                                          ".dji-sru-page-content .dji-sru-outline-source-list [dji-accessible]",
                                      ],
                                  },
                              },
                          ],
                      },
                  ],
              }));
    }
    function V(a, b, c) {
        var d = dji.ui.templates.load(t, "dji-sru-folder-item-group-label");
        c && (d.className += " dji-top-border");
        d.innerText = b;
        a.appendChild(d);
    }
    function O(a, b, c) {
        var d = "dji-sru-folder-item-";
        d = b.isHome()
            ? d + "home"
            : b.isDirectory()
              ? d + "subfolder"
              : b.isPdf()
                ? d + "pdf"
                : d + "outline";
        d = dji.ui.templates.load(t, d);
        d.outline = b;
        d.id = b.uuid();
        if (!b.isHome()) {
            var e = new Date(b.modifiedDate()),
                f = e.getMonthName("en"),
                h = e.getDate();
            e = e.getFullYear();
            f = f + " " + h + ", " + e;
            d.querySelector(".dji-sru-folder-item-name").innerText = b.title();
            d.querySelector(".dji-sru-folder-item-date").innerText = f;
        }
        c && $(d).addClass("dji-selected");
        a.appendChild(d);
    }
    function Ua(a, b) {
        switch (b) {
            case "dji-sru-outline-source-book":
                b = "template-page-book-citation-form";
                break;
            case "dji-sru-outline-source-webpage":
                b = "template-page-webpage-citation-form";
                break;
            case "dji-sru-outline-source-journal":
                b = "template-page-journal-citation-form";
                break;
            case "dji-sru-outline-source-magazine":
                b = "template-page-magazine-citation-form";
                break;
            case "dji-sru-outline-source-newspaper":
                b = "template-page-newspaper-citation-form";
                break;
            case "dji-sru-outline-source-tv-radio":
                b = "template-page-television-citation-form";
                break;
            case "dji-sru-outline-source-visual-art":
                b = "template-page-visual-citation-form";
                break;
            default:
                return;
        }
        var c = dji.ui.templates.load(
            t,
            "dji-sru-template-page-source-author-line",
        );
        a.append(c);
        c = dji.ui.templates.load(t, b);
        a.append(c);
    }
    function P(a, b) {
        b = b.find(".dji-sru-tab-item.dji-selected");
        b.removeClass("dji-selected");
        $(a)
            .find(".dji-tab-item-view[" + b.attr("dji-item") + "]")
            .removeClass("dji-visible");
    }
    function B(a, b, c) {
        $(a)
            .find(".dji-sru-tab-item[dji-item=" + b + "]")
            .addClass("dji-selected");
        switch (b) {
            case "dji-sru-outline-details":
                sru.toolbar.enableHighlightButton(
                    !sru.screenSelection.isActive(),
                );
                $(a)
                    .find(
                        ".dji-sru-page-toolbar .dji-sru-tb-button.dji-sru-outline-new-topic",
                    )
                    .removeClass("dji-hidden");
                a.topic = null;
                break;
            case "dji-sru-outline-sources":
                J && sru.toolbar.disableHighlight(),
                    sru.toolbar.enableHighlightButton(!1),
                    $(a)
                        .find(
                            ".dji-sru-page-toolbar .dji-sru-tb-button.dji-sru-outline-new-topic",
                        )
                        .addClass("dji-hidden");
        }
        a = $(a).find(".dji-tab-item-view[" + b + "]");
        c && a.is(":empty") && Ua(a, b);
        a.addClass("dji-visible");
    }
    function M(a, b, c) {
        c
            ? __$(a)
                  .find(".dji-sru-page-toolbar .dji-sru-folder-page-info")
                  .html(b)
            : __$(a)
                  .find(".dji-sru-page-toolbar .dji-sru-folder-page-info")
                  .text(b);
    }
    function Qa(a, b, c) {
        var d = dji.ui.templates.load(t, "dji-template-outline-link-to-source");
        a.appendChild(d);
        a = $(d).find(".dji-sru-page-content");
        Va(a, c, b, "APA");
    }
    function ka(a) {
        N(null);
        a.querySelector(".dji-sru-page-content").querySelector(
            ".dji-sru-outline-content",
        );
        var b = a.querySelector("#u000");
        $(b).empty();
        q = null;
        w = !1;
        var c = a.outline.topics();
        if (0 < c.length) {
            for (var d = 0; d < c.length; d++) na(a, c[d], b);
            Ra(a);
        } else L({page: a});
    }
    function N(a, b) {
        Q &&
            (Q.removeAttribute("selected-element"),
            Q.classList.remove("selected-image"));
        a &&
            (a.setAttribute("selected-element", !0),
            b && a.classList.add("selected-image"));
        Q = a;
    }
    function la(a) {
        var b = a.outline;
        if (b) {
            var c = $(a).find("#dji-workaround-s000");
            c.empty();
            b = b.sources();
            var d = $(a)
                .find(
                    ".dji-sru-page-content .dji-tab-item-view.dji-sru-outline-sources .dji-sru-oss-tab-item.dji-selected",
                )
                .attr("dji-oss-style");
            d = d || "APA";
            if (0 == b.length)
                $(a)
                    .find(
                        ".dji-sru-page-content .dji-tab-item-view.dji-sru-outline-content.dji-sru-outline-sources",
                    )
                    .addClass("dji-empty");
            else
                for (
                    $(a)
                        .find(
                            ".dji-sru-page-content .dji-tab-item-view.dji-sru-outline-content.dji-sru-outline-sources",
                        )
                        .removeClass("dji-empty"),
                        a = 0;
                    a < b.length;
                    a++
                )
                    Sa(c, b[a], d);
        }
    }
    function na(a, b, c) {
        c = Wa(a, b, c);
        b = a.outline.topics(b);
        if (0 < b.length) {
            c = c.querySelector("ul");
            c.style.display = "block";
            for (var d = 0; d < b.length; d++) na(a, b[d], c);
        }
    }
    function Wa(a, b, c, d) {
        var e = dji.ui.templates.load(t, "template-page-topic-element");
        b ? ((e.id = b.uuid()), (e.topic = b)) : (e.id = "0");
        e.setAttribute("draggable", "true");
        e.addEventListener("dragstart", Xa);
        e.addEventListener("dragover", wc);
        e.addEventListener("drop", xc);
        e.addEventListener("dragend", yc);
        var f = e.querySelector(".dji-sru-outline-topic-content");
        f.innerHTML = b ? b.body() : "";
        a = c || a.querySelector("#u000");
        d ? a.insertBefore(e, d.nextSibling) : a.appendChild(e);
        f.querySelector("img") &&
            ((f.tabIndex = -1), f.classList.add("dji-notLoaded"));
        b && Ya(b, e);
        k.reloadBlock("content topics");
        return e;
    }
    function Ra(a) {
        let b = a.querySelectorAll(".dji-sru-outline-topic");
        a.counter = a.querySelectorAll("img").length;
        for (let d = 0; d < b.length; d++) {
            let e = b[d],
                f = e.querySelector("img");
            if (f) {
                let h = e.topic,
                    l = e.querySelector(".dji-sru-outline-topic-content");
                f.onload = function (m) {
                    setTimeout(function () {
                        l.classList.remove("dji-notLoaded");
                    }, 0);
                    oa(m.target, l, a);
                    a.counter--;
                    c || (c = Date.now());
                    (0 === a.counter || 4e3 <= Date.now() - c) &&
                        a.removeAttribute("dji-loading");
                };
                f.removeAttribute("src");
                f.src = h.imageUrl(f.getAttribute("__uuid"));
            }
        }
        let c = Date.now();
        0 < a.counter && a.setAttribute("dji-loading", !0);
    }
    function L(a) {
        var b = a.page,
            c = a.prevElement;
        a = a.noFocus;
        if (q) {
            var d = q.querySelector(".dji-sru-outline-topic-content");
            (d && "" !== d.innerText) || ba(g(), q);
        }
        b = Wa(b, null, c ? c.parentNode : null, c);
        var e = b.querySelector(".dji-sru-outline-topic-content");
        q = b;
        w = !1;
        b = e.getBoundingClientRect();
        c = __$(e).closest(
            ".dji-sru-outline-content.dji-sru-outline-details",
        )[0];
        d = c.getBoundingClientRect();
        b.bottom + 60 > d.bottom && (c.scrollTop += d.bottom - b.bottom + 60);
        !a &&
            __$.querySelector("html").hasAttribute("dji-sru-outline-active") &&
            (e.setAttribute("contenteditable", !0),
            setTimeout(function () {
                e.focus();
                k.sync();
            }, 0));
    }
    function Ya(a, b) {
        var c;
        b = b || __$.getElementById(a.uuid());
        if (
            !a.hasLinkedSources() &&
            b.querySelector(".dji-sru-intext-citation")
        )
            b.querySelector(".dji-sru-intext-citation").innerHTML = "";
        else {
            var d = a.sources();
            a = [];
            for (var e, f, h = 0; h < d.length; h++) {
                f = d[h].cslData();
                "webpage" !== f.type ||
                    f.URL ||
                    f["container-title"] ||
                    (f["container-title"] = f.title);
                var l = (c = void 0);
                e = null;
                f
                    ? ((c =
                          f.author &&
                          0 < f.author.length &&
                          "" != f.author[0].family
                              ? f.author[0].family
                              : f["container-title"]),
                      f.issued && f.issued.year && (e = f.issued.year),
                      (c = c && e ? c + " " + e : c ? c : "..."),
                      f.URL && 0 < f.URL.length && (l = f.URL))
                    : f || (c = d[h].author().split(",")[0]);
                l = l
                    ? "(<a id='" +
                      d[h].uuid() +
                      "' href=" +
                      l +
                      ">" +
                      c +
                      "</a>)"
                    : "(<span>" + c + "</span>)";
                a.push(l);
            }
            d = a[0];
            h = "";
            for (l = 1; l < a.length; l++)
                (d = d + ", " + a[l]),
                    1 == l &&
                        (h =
                            d +
                            "<span class = 'dji-sru-ellipses'> &nbsp ...</span>");
            a = 3 <= a.length ? h : d;
            b.querySelector(".dji-sru-intext-citation").innerHTML = a;
            b.fullIntextCitations = d;
            b.partialIntextCitations = h;
        }
    }
    function X(a) {
        a.target.closest(".dji-sru-outline-topic-content") || N(null);
        g().querySelector("[dji-template-id=template-page-outline-topics]")
            ? n.hideBulletToolbars()
            : g().querySelector(".dji-sru-manually-cite-view") &&
              ((a = g().querySelector(".dji-sru-material-selection")),
              __$(a).hasClass("dji-visible") &&
                  __$(a).removeClass("dji-visible"),
              (a = g().querySelector(".dji-sru-contributors-selection")),
              __$(a).hasClass("dji-visible") &&
                  (k.removeBlock("menu_source_contributor_type"),
                  __$(a).removeClass("dji-visible")));
    }
    function Wb(a) {
        var b = $(a.target);
        if (!b.hasClass("dji-selected")) {
            a = b.attr("dji-item");
            var c = g();
            P(c, b.parent());
            (b = c.outline) && N(null);
            !b || b.isHome() || b.isDirectory()
                ? B(c, a)
                : (B(c, a),
                  (c = sru.outlinesDataManager.currentUiPathState()),
                  (c.selTab = a),
                  sru.outlinesDataManager.updateUiPathState(c),
                  sru.searchInOutlineController.updatePageHighlight());
            "dji-sru-outline-sources" === a &&
                dji.utils.callListeners(u, "sourcesOpened");
        }
    }
    function zc(a, b) {
        dji.ui.pagination.nextPage(x, function (c) {
            c.outline = a;
            c.topic = b;
            Qa(c, a, b);
        });
    }
    function Jb(a) {
        var b = $(a.currentTarget.parentNode);
        a = a.currentTarget.parentNode.__state;
        a.currentLinked = !a.currentLinked;
        b.hasClass("dji-selected")
            ? (b.removeClass("dji-selected"),
              b.find(".dji-sru-check-box i").text("check_box_outline_blank"))
            : (b.addClass("dji-selected"),
              b.find(".dji-sru-check-box i").text("check_box"));
    }
    function Va(a, b, c, d) {
        a.empty();
        if (c) {
            c = c.sources();
            0 == c.length
                ? a.addClass("dji-empty")
                : a.removeClass("dji-empty");
            d = d || "APA";
            for (var e = 0; e < c.length; e++) {
                var f = a,
                    h = b,
                    l = c[e],
                    m = d,
                    p = !1;
                var v = dji.ui.templates.load(
                    t,
                    "dji-sru-template-outline-checked-source",
                );
                h.hasLinkedSource(l) &&
                    ((p = !0),
                    $(v).addClass("dji-selected"),
                    $(v).find(".dji-sru-check-box i").text("check_box"));
                __$(v)
                    .find(".dji-sru-outline-source-content")
                    .html(
                        l.text(m) ||
                            "generate citation from source.data.fields with style " +
                                m,
                    );
                v.topics = h;
                v.source = l;
                v.__state = {originalLinked: p, currentLinked: p};
                f.append(v);
            }
        }
    }
    function Sa(a, b, c, d) {
        var e = dji.ui.templates.load(t, "dji-sru-template-outline-source");
        e.setAttribute("draggable", "true");
        e.addEventListener("dragstart", Xa);
        __$(e)
            .find(".dji-sru-outline-source-content")
            .html(
                b.text(c) ||
                    "generate citation from source.data.fields with style " + c,
            );
        e.topics = d;
        e.source = b;
        a.append(e);
    }
    function Xb(a) {
        a = $(a.target);
        if (!a.hasClass("dji-selected")) {
            a.parent()
                .find(".dji-sru-oss-tab-item.dji-selected")
                .removeClass("dji-selected");
            a.addClass("dji-selected");
            var b = a.attr("dji-oss-style");
            $(g())
                .find(
                    ".dji-sru-page-content #dji-workaround-s000 li.dji-sru-outline-source",
                )
                .each(function () {
                    var c = this.source;
                    $(this)
                        .find(".dji-sru-outline-source-content")
                        .html(c.text(b));
                });
            sru.searchInOutlineController.updatePageHighlight();
            a = sru.outlinesDataManager.currentUiPathState();
            a.sourceType = b;
            sru.outlinesDataManager.updateUiPathState(a);
        }
    }
    function Ac() {
        var a = !0,
            b = g().source ? g().source.cslData(!0) : {};
        b.id = "id0";
        var c = __$("#dji-sru-outline-source-dlg")
            .find(".dji-sru-tab-items .dji-sru-tab-item.dji-selected")
            .attr("dji-item");
        b.type = pa[c].cslType;
        c = __$("#dji-sru-outline-source-dlg").find(
            ".dji-tab-item-view.dji-source-view.dji-visible",
        );
        var d = [],
            e = [],
            f = [];
        c.find(".dji-sru-form-line.dji-sru-page-source-author-line").each(
            function () {
                var m = $(this)
                        .find(".dji-sru-edit-fname-container input")
                        .val(),
                    p = $(this)
                        .find(".dji-sru-edit-lname-container input")
                        .val(),
                    v = $(this).find(".dji-sru-combobox-label").text();
                if ("" != m || "" != p)
                    switch (((m = {family: p, given: m}), v)) {
                        case C.Author:
                        case C.Director:
                        case C.Artist:
                        case C.Writer:
                            d.push(m);
                            break;
                        case C.Editor:
                            e.push(m);
                            break;
                        case C.Translator:
                            f.push(m);
                    }
            },
        );
        b.author = d;
        b.editor = e;
        b.translator = f;
        a =
            0 == b.author.length &&
            0 == b.editor.length &&
            0 == b.translator.length;
        var h = c.find("input[dji-csl-item]");
        h.each(function () {
            var m = $(this).val();
            if (m && "" !== m) {
                var p = $(this).attr("dji-csl-item");
                b[p] = m;
                a = !1;
            }
        });
        h = c.find("input[dji-csl-add-to-item]");
        h.each(function () {
            var m = $(this).val();
            if (m && "" !== m) {
                var p = $(this).attr("dji-csl-add-to-item");
                b[p] = (b[p] ? b[p] + ", " : "") + m;
                a = !1;
            }
        });
        b.issued = {};
        var l = [];
        h = c.find("input[dji-csl-item-year]");
        (h = h.val()) && "" !== h && l.push(h);
        h = c.find("input[dji-csl-item-month]");
        (h = h.val()) && "" !== h && l.push(h);
        h = c.find("input[dji-csl-item-day]");
        (h = h.val()) && "" !== h && l.push(h);
        0 < l.length && ((b.issued["date-parts"] = [l]), (a = !1));
        return a ? null : b;
    }
    function Ea() {
        var a = g(),
            b = Ac();
        if (null != b) {
            a.source
                ? g().source.update(b, !0)
                : sru.outlinesDataManager
                      .activeOutline()
                      .createSource(b, !1, g().topic);
            if (
                "new-link-source" ===
                __$("#dji-sru-outline-source-dlg").attr("dji-sru-mode")
            ) {
                b = a.outline;
                var c = a.topic;
                a = $(a).find(".dji-sru-page-content");
                Va(a, c, b, "APA");
            } else la(a);
            E({page: g(), show: !1, updateUIPathState: !0});
            k.reloadBlock("content sources");
            dji.utils.callListeners(u, "outlineModified", {outlineModified: 1});
        }
    }
    function Ja(a) {
        var b = a.currentTarget.parentNode.parentNode;
        __$(a.currentTarget).hasClass("dji-sru-ellipses")
            ? (b.querySelector(".dji-sru-intext-citation").innerHTML =
                  b.fullIntextCitations +
                  "<span class = 'dji-sru-collapse'></span>")
            : (b.querySelector(".dji-sru-intext-citation").innerHTML =
                  b.partialIntextCitations);
        sru.searchInOutlineController.updatePageHighlight();
    }
    function Xa(a) {
        var b = dji.utils.closestParent(a.target, ".dji-sru-outline-drag-item"),
            c =
                "dji-sru-template-outline-source" ==
                b.getAttribute("dji-template-id");
        if (c) {
            var d = ".dji-sru-outline-source-content";
            var e = ".dji-sru-outline-source-bullet";
        } else
            (d = ".dji-sru-outline-topic-content"),
                (e = ".dji-sru-outline-topic-bullet");
        var f = dji.utils.closestParent(a.target, d);
        f ||
            (dji.utils.closestParent(a.target, e)
                ? (f = b.querySelector(d))
                : a.target.nodeType == Node.ELEMENT_NODE &&
                  (f = a.target.querySelector(d)));
        if (f) {
            e = f.querySelector("img");
            d = f.isContentEditable
                ? dji.utils.documentForElement(f).getSelection().toString()
                : f.innerText;
            if (0 != d.length || e)
                return (
                    " " != d.charAt(d.length - 1) && (d += " "),
                    a.stopPropagation(),
                    a.dataTransfer.clearData(),
                    f.isContentEditable ||
                        c ||
                        a.dataTransfer.setData("snap-read/topic-id", b.id),
                    a.dataTransfer.setData("text/plain", d),
                    c && a.dataTransfer.setData("text/html", f.innerHTML),
                    e &&
                        ((c = a.target.closest(".dji-sru-outline-topic").topic),
                        (b = c.imageElement()),
                        (c = c.imageDataToBase64()),
                        a.dataTransfer.setData("text/uri-list", c),
                        a.dataTransfer.setData("text/html", b)),
                    a.dataTransfer.setData("snap-read/has-text", "true"),
                    (e = e ? e : __$.querySelector("#dji-sru-drag-ghost")),
                    (e.innerText = d),
                    a.dataTransfer.setDragImage(e, 0, 0),
                    !0
                );
            a.stopPropagation();
            a.preventDefault();
        }
    }
    function wc(a) {
        if (-1 != a.dataTransfer.types.indexOf("snap-read/topic-id"))
            return (
                a.preventDefault(),
                (a.dataTransfer.dropEffect = "move"),
                (a = dji.utils.closestParent(a.target, "li")) &&
                    dji.utils.addClassToElement(a, "dji-sru-topic-over"),
                !1
            );
    }
    function cc(a) {
        -1 !=
            a.originalEvent.dataTransfer.types.indexOf("snap-read/topic-id") &&
            (a = dji.utils.closestParent(a.target, "li")) &&
            dji.utils.removeClassFromElement(a, "dji-sru-topic-over");
    }
    function xc(a) {
        if (-1 == a.dataTransfer.types.indexOf("snap-read/topic-id"))
            a.stopPropagation(), a.preventDefault();
        else {
            var b = dji.utils.closestParent(a.target, "li");
            dji.utils.removeClassFromElement(b, "dji-sru-topic-over");
            if (b.topic) {
                var c = a.dataTransfer.getData("snap-read/topic-id");
                c = __$.getElementById(c);
                if (
                    c.previousSibling !== b ||
                    0 !== b.querySelector("ul").childNodes.length
                ) {
                    var d =
                        0 < b.querySelector("ul").childNodes.length
                            ? b
                            : b.parentNode.closest("li");
                    if (d) var e = d.topic;
                    else (d = g().querySelector("#u000")), (e = null);
                    c.topic.moveTo(e, b.topic) && qa(c, d, b);
                    a.stopPropagation();
                    a.preventDefault();
                }
            }
        }
    }
    function Ka(a) {
        if (-1 != a.dataTransfer.types.indexOf("snap-read/has-text")) {
            var b = dji.utils.elementContext(a.srcElement);
            if (
                b &&
                b.isEditor &&
                (b.isGoogleDocsEditor || b.editor.focus(),
                b.isYahooMail ||
                    b.isGoogleHangouts ||
                    b.isMicrosoftOutlook ||
                    (b.isGoogleDocs && b.isPlainEditor))
            ) {
                a.stopPropagation();
                a.preventDefault();
                if (b.isContentEditable) {
                    var c = b.document.caretRangeFromPoint(
                        a.clientX,
                        a.clientY,
                    );
                    b.document
                        .getSelection()
                        .setBaseAndExtent(
                            c.startContainer,
                            c.startOffset,
                            c.endContainer,
                            c.endOffset,
                        );
                }
                var d = a.dataTransfer.getData("text/plain"),
                    e = a.dataTransfer.getData("text/uri-list");
                setTimeout(function () {
                    dji.selectionMapper.insertText(b.editor, d, e, !1);
                    if (b.isGoogleHangouts) {
                        var f = new KeyboardEvent("keypress", {
                            bubbles: !0,
                            cancelable: !0,
                            key: " ",
                            char: " ",
                        });
                        b.editor.dispatchEvent(f);
                    }
                }, 0);
            }
        }
    }
    function yc(a) {
        "none" === a.dataTransfer.dropEffect &&
            DjiSruToast.show(
                "Topic could not be dropped",
                {closeOnClick: !0},
                3e3,
            );
    }
    function ec() {
        S();
    }
    function fc(a) {
        if (W) a.preventDefault(), a.stopPropagation();
        else {
            var b = !1,
                c = a.target,
                d = dji.utils.closestParent(c, ".dji-sru-outline-topic"),
                e = d.querySelector("img");
            if (13 === a.keyCode)
                a.preventDefault(),
                    a.stopPropagation(),
                    "" !== c.innerHTML
                        ? setTimeout(function () {
                              L({page: g(), prevElement: d});
                              var h = g().outline;
                              h.isSkeleton() && ra(h, f);
                          }, 0)
                        : (d === q && (w = !0),
                          sa(d),
                          c.setAttribute("contenteditable", null === e),
                          setTimeout(function () {
                              c.focus();
                              w = !1;
                          }, 0));
            else if (9 == a.keyCode) {
                a.preventDefault();
                if ("" === c.innerHTML) {
                    a.stopPropagation();
                    return;
                }
                d === q && (w = !0);
                a.shiftKey ? ((b = d !== q), sa(d)) : ((b = d !== q), Za(d));
                setTimeout(function () {
                    c.setAttribute("contenteditable", null === e);
                    c.focus();
                    w = !1;
                }, 100);
            } else if (a.ctrlKey || a.metaKey)
                switch (String.fromCharCode(a.keyCode).toLowerCase()) {
                    case "b":
                        a.preventDefault();
                        sru.mainContainer
                            .mainContainer()
                            .execCommand("bold", !1, null);
                        break;
                    case "i":
                        a.preventDefault();
                        sru.mainContainer
                            .mainContainer()
                            .execCommand("italic", !1, null);
                        break;
                    case "u":
                        a.preventDefault(),
                            sru.mainContainer
                                .mainContainer()
                                .execCommand("underline", !1, null);
                }
            else {
                if (
                    46 == a.keyCode ||
                    8 == a.keyCode ||
                    (37 <= a.keyCode && 40 >= a.keyCode)
                )
                    return;
                var f = c.innerText;
                if (2e3 <= f.length) {
                    a.preventDefault();
                    a.stopPropagation();
                    return;
                }
            }
            b &&
                dji.utils.callListeners(u, "outlineModified", {
                    outlineChanged: 1,
                });
        }
    }
    function gc(a) {
        a.preventDefault();
        a.stopPropagation();
        var b = a.target,
            c = b.innerText;
        a = a.originalEvent.clipboardData.getData("text/plain");
        2e3 < (a + c).length
            ? setTimeout(function () {
                  alert(
                      "The text in your topic too long!\n Try separating your text into more than one topic",
                  );
              }, 0)
            : dji.utils.documentForElement(b).execCommand("insertText", !1, a);
    }
    function hc(a) {
        a = a.target;
        var b = a.innerHTML.toString();
        2e3 < a.innerText.length &&
            ((b = b.replace(/&nbsp;/g, " ")),
            (a.innerHTML = b.toString().slice(0, 2e3)));
    }
    function Za(a) {
        a = dji.utils.closestParent(a, ".dji-sru-outline-topic");
        let b = a.previousSibling;
        if (!b || b.topic) {
            var c = b ? ca(b) : -1,
                d = ca(a);
            11 < d + 1 ||
                d !== c ||
                11 <= a.querySelectorAll("ul").length - 1 ||
                (a.topic && a.topic.indent(), qa(a, b, null));
        }
    }
    function ca(a, b) {
        b = b || g();
        b = b.querySelector("#u000");
        for (var c = 0; a.parentNode !== b; )
            c++, (a = a.parentNode.parentNode);
        return c;
    }
    function qa(a, b, c) {
        var d = g().querySelector("#u000");
        b !== d && ((d = b.querySelector("ul")), (d.style.display = "block"));
        !c || (c !== b && !c.nextSibling)
            ? d.appendChild(a)
            : c === b
              ? d.insertBefore(a, d.firstChild)
              : d.insertBefore(a, c.nextSibling);
        a.querySelectorAll("img").forEach((e) => {
            oa(e, e.parentElement);
        });
    }
    function sa(a) {
        a = dji.utils.closestParent(a, ".dji-sru-outline-topic");
        if (!(0 >= ca(a))) {
            var b = g().querySelector("#u000");
            a.topic && a.topic.outdent();
            var c = a.parentNode.parentNode;
            qa(a, c.parentNode === b ? b : c.parentNode.parentNode, c);
        }
    }
    function ic(a) {
        var b = a.target,
            c = dji.utils.closestParent(b, ".dji-sru-outline-topic"),
            d = dji.utils.closestParent(b, ".dji-sru-page");
        if (!(w || (q && c === q && w)))
            if (D && G && D === b && "" === b.innerText)
                (D.innerHTML = G), (G = D = null);
            else if (
                ((G = D = null),
                c === q
                    ? "" !== b.innerText &&
                      dji.utils.callListeners(u, "outlineTextAdded", {
                          text: b.innerHTML,
                          addedManually: 1,
                          textCaptured: 0,
                      })
                    : ("true" !== b.getAttribute("contenteditable") &&
                          "0" !== c.id) ||
                      b.innerHTML.toString() === c.topic.body() ||
                      dji.utils.callListeners(u, "outlineModified", {
                          outlineModified: "" === b.innerText ? 0 : 1,
                      }),
                dji.utils.documentForElement(a.target).getSelection().empty(),
                "0" === c.id)
            )
                "" === b.innerText
                    ? ba(d, c)
                    : ((d = d.outline),
                      d.isSkeleton() && ra(d, b.innerText),
                      setTimeout(function () {
                          $a(c);
                      }, 0));
            else if ("0" !== c.id) {
                b.setAttribute("contenteditable", !1);
                a = c.topic;
                const e = b.innerHTML.toString();
                "" !== b.innerText || b.querySelector("img")
                    ? a &&
                      0 < e.length &&
                      (b.setAttribute("contenteditable", !1), a.body(ab(b)))
                    : a
                      ? ba(d, c)
                      : c.remove();
            }
    }
    function jc(a) {
        let b = a.target,
            c = sru.mainContainer.mainContainer().getSelection();
        c.selectAllChildren(b);
        c.collapseToEnd();
        D = a.target;
        G = a.target.innerHTML;
    }
    function $a(a) {
        var b = a.querySelector(".dji-sru-outline-topic-content");
        var c =
            (c = a.previousSibling) && $(c).hasClass("dji-sru-outline-topic")
                ? c.topic.location() + 1
                : 0;
        var d = null,
            e = a.parentNode;
        "u000" != e.id && (d = e.parentNode.topic);
        b = sru.outlinesDataManager.activeOutline().createTopic(ab(b), c, d);
        a.id = b.uuid();
        a.topic = b;
        a === q && (q = null);
        return a;
    }
    function ab(a) {
        let b = a.querySelector("img");
        return b
            ? ((a = b.cloneNode(!0)), (a.src = ""), a.outerHTML)
            : a.innerHTML;
    }
    function bc(a) {
        a.target = a.target.querySelector(".dji-sru-outline-topic-content");
        a.target && ia(a);
    }
    function ia(a) {
        a = a.target;
        if (W) H(null, !1);
        else if (ta) R(null, !1);
        else {
            var b = a.closest(".dji-sru-outline-topic-content");
            b &&
                ((a = b.querySelector("img")),
                a ||
                    "true" === b.getAttribute("contenteditable") ||
                    (b.setAttribute("contenteditable", !0),
                    sru.mainContainer.focus(function () {
                        b.focus();
                    })),
                N(b.parentNode, null !== a));
        }
    }
    function ba(a, b) {
        var c = $(a).find("#u000 .dji-sru-outline-topic").length;
        if (
            "0" != b.id ||
            1 != c ||
            a.querySelector("#u000").childNodes[0] != b
        ) {
            try {
                b.parentNode.removeChild(b);
            } catch (d) {}
            b.topic ? g().outline.deleteTopic(b.topic) : ((q = null), (w = !1));
            0 == $(a).find("#u000 .dji-sru-outline-topic").length &&
                L({page: a, prevElement: null});
        }
    }
    function dc(a) {
        if ((a = dji.utils.closestParent(a.target, ".dji-sru-outline-topic"))) {
            var b = a.querySelector(".dji-sru-outline-topic-content");
            "" === b.innerText && $(b).is(":focus") && (w = !0);
            D && G && "" === b.innerText && ((D.innerHTML = G), (G = D = null));
            H(a, !0);
        }
    }
    function Zb(a) {
        a.preventDefault();
        a.stopPropagation();
        R(a.target.parentNode, !0);
    }
    function bb(a, b) {
        b = b.getBoundingClientRect();
        var c = b.left,
            d = b.top - 62,
            e = a.querySelector(".dji-sru-pie-toolbar");
        e.style.left = c - 49 + "px";
        e.style.top = d + "px";
        a == r &&
            setTimeout(function () {
                var f = e.getBoundingClientRect().bottom,
                    h = g().querySelector(".dji-sru-page-content"),
                    l = h.getBoundingClientRect();
                if (f + 10 > l.bottom) {
                    f = f - l.bottom + 20;
                    var m = h.querySelector(".dji-sru-outline-content");
                    m.removeEventListener("scroll", X);
                    e.style.top = d - f + "px";
                    h.scrollTop += f;
                    setTimeout(function () {
                        m.addEventListener("scroll", X);
                    }, 100);
                }
            }, 0);
        __$(a).addClass("dji-visible");
    }
    function H(a, b) {
        __$(g())
            .find(".dji-sru-outline-topic-content-active")
            .removeClass("dji-sru-outline-topic-content-active");
        if (b) {
            r.topicElement = a;
            var c = a.querySelector(".dji-sru-outline-topic-content");
            __$(c).addClass("dji-sru-outline-topic-content-active");
            "" === c.innerHTML
                ? $(r).find("#__dji_sru_linkButton").addClass("dji-disable")
                : $(r).find("#__dji_sru_linkButton").removeClass("dji-disable");
            "" !== c.innerHTML && r.topicElement.topic
                ? $(r)
                      .find("#__dji_sru_deleteTopicButton")
                      .removeClass("dji-disable")
                : $(r)
                      .find("#__dji_sru_deleteTopicButton")
                      .addClass("dji-disable");
            a = a.querySelector(".dji-sru-outline-topic-bullet");
            bb(r, a);
            setTimeout(function () {
                W = b;
            }, 300);
        } else
            __$(r).removeClass("dji-visible"), (W = !1), (r.topicElement = !1);
    }
    function kc(a) {
        let b = !0,
            c = 1;
        var d = $(r.topicElement).children(".dji-sru-outline-topic-content");
        if (a.target.id === da["delete"]) {
            if ($(a.target).hasClass("dji-disable") || !r.topicElement.topic)
                return;
            ba(g(), r.topicElement);
            H(null, !1);
            sru.searchInOutlineController.updatePageHighlight();
            c = 0;
        } else if (a.target.id === da.indent) {
            if ("" === d.innerHTML) {
                a.preventDefault();
                a.stopPropagation();
                return;
            }
            Za(r.topicElement);
            H(r.topicElement, !0);
            sru.searchInOutlineController.updatePageHighlight();
        } else if (a.target.id === da.outdent) {
            if ("" === d.innerHTML) {
                a.preventDefault();
                a.stopPropagation();
                return;
            }
            sa(r.topicElement);
            H(r.topicElement, !0);
            sru.searchInOutlineController.updatePageHighlight();
        } else if (a.target.id == da.link) {
            if ($(a.target).hasClass("dji-disable") || !r.topicElement.topic)
                return;
            a = g().outline;
            d = r.topicElement.topic;
            sru.outlinesDataManager.pushOutlineLinkToSourceToStack(a, d);
            H(null, !1);
            S();
            sru.toolbar.enableHighlightButton(!1);
            zc(a, d);
        } else (b = !1), d.focus(), H(null, !1), (w = !1);
        b &&
            (console.warn("outlineModified"),
            dji.utils.callListeners(u, "outlineModified", {
                outlineModified: c,
            }));
    }
    function R(a, b) {
        if ((ta = b)) {
            var c = a.querySelector(".dji-sru-outline-source-bullet");
            b = $(I).find("#" + ea["delete"]);
            var d = $(I).find("#" + ea.edit);
            b.removeClass("dji-disable");
            d.removeClass("dji-disabled");
            var e = a.source;
            (e.data() && e.cslData()) || d.addClass("dji-disable");
            e.cslData() && e.cslData().URL && b.addClass("dji-disable");
            setTimeout(function () {
                bb(I, c);
            }, 0);
            I.sourceElement = a;
        } else __$(I).removeClass("dji-visible");
    }
    function $b(a) {
        if (!dji.utils.elementHasClass(a.target, "dji-disable"))
            if (a.target.id === ea["delete"]) {
                a = I.sourceElement;
                var b = a.source,
                    c = a.parentNode;
                c.removeChild(a);
                c.hasChildNodes() || $(c.parentNode).addClass("dji-empty");
                sru.outlinesDataManager.activeOutline().deleteSource(b);
                ka(g());
                R(null, !1);
                sru.searchInOutlineController.updatePageHighlight();
                dji.utils.callListeners(u, "outlineModified", {
                    outlineModified: 0,
                });
            } else
                a.target.id == ea.edit
                    ? ((a = I.sourceElement.source),
                      R(null, !1),
                      S(),
                      E({
                          page: g(),
                          show: !0,
                          dlgMode: "edit-source",
                          source: a,
                          updateUIPathState: !0,
                      }))
                    : R(null, !1);
    }
    function cb(a) {
        dji.utils.elementHasClass(a.target, "dji-sru-close-btn") ||
            dji.utils.elementHasParent(
                a.srcElement,
                document.getElementById("dji-sru-doubleclick-choice-popup"),
            ) ||
            (dji.utils.elementHasClass(
                document.documentElement,
                "dji-sru-distractions-active",
            ) &&
                "A" !== a.target.tagName) ||
            (a.preventDefault(), a.stopPropagation());
    }
    function db(a) {
        if (
            sru.toolbar.isHighlightActive() &&
            !a.__djiHandledBySelectionEnabler
        ) {
            a.target.closest(".kix-appview-editor") ||
                dji.utils.activeElementInfo().isAmazonKindle ||
                (a.preventDefault(), a.stopPropagation());
            if (
                sru.removeDistractions.active() &&
                a.target.closest("[dji-sru-remove-distractions]")
            ) {
                let b = document.querySelector("dji-sru-distraction"),
                    c = b.shadowRoot.getElementById(
                        "dji-sru-remove-distractions-iframe",
                    );
                b.focus();
                c.focus();
            }
            n.createTopicFromHighlight(
                null,
                "IMG" === a.target.tagName ? a.target : null,
            );
        }
    }
    function mc(a) {
        a = a.target;
        var b = a.tagName ? a.tagName.toLowerCase() : null;
        return (
            a.isContentEditable ||
            (a.tagName && ("textarea" == b || "input" == b))
        );
    }
    async function eb() {
        if (!J || !n.isHighlightable()) return null;
        let a = {text: null, isTooLong: !1},
            b = null;
        try {
            fa.pageContextRequired && (b = await fa.pageContextRequired()),
                b &&
                    ((b.clearSelectionAtEnd = !1),
                    window.dji.utils.isSruPwaApp() ||
                        window.dji.utils.isCambridgeLMS() ||
                        window.dji.utils.preventInputEventsOnBodyElements(!0),
                    (a.text = (b.text || "").trim()),
                    2e3 < a.text.length &&
                        ((a.text = null),
                        (a.isTooLong = !0),
                        setTimeout(function () {
                            alert(
                                "The text in your topic is too long.\nTry separating your text into more than one topic.",
                            );
                        }, 0)),
                    a.text && (a.text = '"' + a.text + '"'));
        } catch (c) {
            b && (b = null), dji.logger.error(c);
        }
        return a;
    }
    async function Bc(a) {
        let b = dji.utils.getImageSrc(a);
        if (!b || 0 === b.length) return null;
        a = null;
        try {
            var c = await fetch(b, {credentials: "same-origin"});
            let d = c.headers.get("Content-Type") || "";
            if (!c.ok || -1 === d.indexOf("image")) return null;
            let e = await c.blob();
            a = await fb(e);
        } catch (d) {
            dji.logger.error(d), (c = await Cc(b)) && (a = await fb(c));
        }
        return a;
    }
    function Cc(a) {
        return new Promise((b) => {
            chrome.runtime.sendMessage(
                {message: "com.donjohnston.sru.fetchImage", params: {url: a}},
                function (c) {
                    (c && c.data) || (c.data = null);
                    b(c.data);
                },
            );
        });
    }
    async function Dc(a, b) {
        let c = URL.createObjectURL(a);
        a = await sru.outlinesDataManager.createImage(a);
        let d = document.createElement("img");
        d.setAttribute("__uuid", a.uuid());
        d.onload = function (e) {
            oa(e.target, e.target.parentElement);
        };
        d.src = c;
        b.appendChild(d);
        b.contentEditable = !1;
        b.tabIndex = -1;
    }
    function fb(a) {
        var b = new Image();
        let c = a;
        "Blob" === a.constructor.name && (c = URL.createObjectURL(a));
        return new Promise((d) => {
            b.onload = async function () {
                let e = await Ec(b, 448, 448);
                URL.revokeObjectURL(c);
                d(e);
            };
            b.src = c;
        });
    }
    async function Ec(a, b, c) {
        var d = a.width,
            e = a.height;
        b = Math.min(1, Math.min(b / d, c / e));
        1 > b && ((d = parseInt(d * b)), (e = parseInt(e * b)));
        var f = document.createElement("canvas");
        f.width = d;
        f.height = e;
        b = f.getContext("2d");
        b.fillStyle = "white";
        b.fillRect(0, 0, d, e);
        b.drawImage(a, 0, 0, d, e);
        return new Promise((h) => f.toBlob(h, "image/jpeg", 0.8));
    }
    function oa(a, b, c) {
        let d = b.closest(".dji-sru-outline-topic-element");
        d.classList.remove("dji-indent");
        d.style.removeProperty("--offset-left");
        b.style.removeProperty("--image-width");
        a = a.naturalWidth;
        var e = b.offsetWidth / a;
        c = ca(b, c);
        if (0.8 > e && 1 < c) {
            c = b.closest("#u000");
            e = c.offsetWidth;
            let f = Math.min(a, e);
            d.classList.add("dji-indent");
            b.style.setProperty("--image-width", f + "px");
            f == e &&
                c.offsetWidth !== e &&
                b.style.setProperty("--image-width", c.offsetWidth + "px");
            d.style.setProperty(
                "--offset-left",
                d.offsetWidth - Math.min(a, c.offsetWidth) + "px",
            );
        }
    }
    function lc(a) {
        a.stopPropagation();
        a.preventDefault();
        var b = a.target.id,
            c = sru.outlinesDataManager.activeOutline().sources();
        let d = 0;
        for (; d < c.length && c[d].uuid() !== b; d++);
        if (d < c.length) {
            b = c[d].cslData();
            b.id = "id0";
            var e = new Date(),
                f = e.getMonth() + 1,
                h = e.getDate();
            e = [e.getFullYear(), f, h];
            b.accessed = {};
            b.accessed["date-parts"] = [e];
            c[d].markAsModified();
        }
        (a = a.target.getAttribute("href")) && "" != a && (window.location = a);
    }
    function ra(a, b) {
        b || dji.logger.error("Invalid title for outline", b);
        b = b.trim().substr(0, 33);
        var c = b.lastIndexOf(" ");
        b = -1 === c ? b.substr(0, 32) : b.substr(0, c);
        a.title(b);
        M(g(), b);
        sru.toolbar.setTitle(a);
    }
    function ua() {
        var a = [];
        $(g())
            .find(".dji-sru-page-content .dji-sru-folder-item.dji-selected")
            .each(function () {
                a.push(this.outline);
            });
        return a;
    }
    function uc() {
        var a = [];
        $(g())
            .find(".dji-sru-page-content .dji-sru-folder-item.dji-selected")
            .each(function () {
                a.push(this.outline.uuid());
            });
        return a;
    }
    function Fc() {
        var a = __$("#dji-sru-outline-source-dlg"),
            b = a.find(".dji-sru-tab-items");
        P(a, b);
        a.find(
            ".dji-sru-page-content .dji-tab-item-view.dji-source-view",
        ).empty();
    }
    function va(a, b, c, d) {
        if (b && 0 != b.length)
            for (d = 0; d < b.length; d++) {
                var e = b[d],
                    f = a.find(
                        ".dji-sru-form-line.dji-sru-page-source-author-line",
                    );
                f.addClass("dji-sru-hide-add-button");
                var h = $(
                    dji.ui.templates.load(
                        t,
                        "dji-sru-template-page-source-author-line",
                    ),
                );
                h.find(
                    ".dji-sru-combobox-contributors .dji-sru-combobox-label",
                ).text(c);
                h.find(".dji-sru-edit-fname-container input").val(e.given);
                h.find(".dji-sru-edit-lname-container input").val(e.family);
                0 == f.length ? a.prepend(h) : h.insertAfter(f.last());
            }
    }
    function gb(a, b, c) {
        a = a.find(".dji-tab-item-view[" + c + "]");
        a.find(".dji-sru-form-line.dji-sru-page-source-author-line").remove();
        var d = !1;
        b.hasOwnProperty("author") &&
            (va(a, b.author, C.Author, c), 0 != b.author.length && (d = !0));
        b.hasOwnProperty("editor") &&
            (va(a, b.editor, C.Editor, c), 0 != b.editor.length && (d = !0));
        b.hasOwnProperty("translator") &&
            (va(a, b.translator, C.Translator, c),
            0 != b.translator.length && (d = !0));
        d ||
            ((c = $(
                dji.ui.templates.load(
                    t,
                    "dji-sru-template-page-source-author-line",
                ),
            )),
            a.prepend(c));
        for (var e in b)
            switch (e) {
                case "publisher-place":
                    c = b[e].split(", ");
                    a.find("input[dji-csl-item=" + e + "]").val(c[0]);
                    1 < c.length &&
                        a
                            .find("input[dji-csl-add-to-item=" + e + "]")
                            .val(c[1]);
                    break;
                default:
                    a.find("input[dji-csl-item=" + e + "]").val(b[e]);
            }
        b.hasOwnProperty("issued") &&
            ((b = b.issued),
            b.hasOwnProperty("year") &&
                a.find("input[dji-csl-item-year]").val(b.year),
            b.hasOwnProperty("month") &&
                a.find("input[dji-csl-item-month]").val(b.month),
            b.hasOwnProperty("day") &&
                a.find("input[dji-csl-item-day]").val(b.day));
    }
    function Gc(a, b) {
        var c = a.find(".dji-sru-tab-items .dji-sru-tab-item").last();
        switch (b) {
            case "dji-sru-outline-source-book":
            case "dji-sru-outline-source-webpage":
                c.text("JOURNAL");
                c.attr("dji-item", "dji-sru-outline-source-journal");
                break;
            default:
                c.text(pa[b].tabName.toUpperCase()), c.attr("dji-item", b);
        }
        a.find(
            ".dji-sru-tab-items .dji-sru-tab-item[dji-item=" + b + "]",
        ).addClass("dji-selected");
    }
    function hb(a, b, c) {
        b = b.cslData();
        var d = ib[b.type];
        c = c || d;
        B(a, c, !0);
        d != c && ((c = a.find(".dji-tab-item-view[" + d + "]")), Ua(c, d));
        gb(a, b, d);
        return d;
    }
    function E(a) {
        var b = __$("#dji-sru-outline-source-dlg");
        a.show
            ? (a.source
                  ? (b
                        .find(
                            ".dji-sru-page-toolbar-line1 .dji-sru-folder-page-info",
                        )
                        .text("Edit Source"),
                    b.attr("dji-sru-mode", a.dlgMode),
                    (a.page.source = a.source),
                    a.selTabItem
                        ? (hb(b, a.source, a.selTabItem),
                          B(b, a.selTabItem, !0))
                        : (a.selTabItem = hb(b, a.source, a.selTabItem)))
                  : (b
                        .find(
                            ".dji-sru-page-toolbar-line1 .dji-sru-folder-page-info",
                        )
                        .text("New Source"),
                    b.attr("dji-sru-mode", a.dlgMode),
                    (a.selTabItem =
                        a.selTabItem || "dji-sru-outline-source-book"),
                    B(b, a.selTabItem, !0)),
              Gc(b, a.selTabItem),
              b.on("keydown", jb),
              b.addClass("dji-visible"),
              setTimeout(function () {
                  b.focus();
                  k.addBlockAndSetup("source_dialog", {
                      name: "source_dialog",
                      blocks: [
                          {
                              name: "toolbar",
                              dom: {
                                  element: b[0],
                                  selectors: [
                                      ".dji-sru-page-toolbar .dji-sru-dialog-close",
                                      ".dji-sru-page-toolbar .dji-sru-outline-source-save",
                                      ".dji-sru-page-toolbar .dji-sru-tab-items .dji-sru-tab-item",
                                      ".dji-sru-page-toolbar .dji-sru-tab-items .dji-sru-tab-item-more",
                                  ],
                              },
                          },
                          {
                              name: "content",
                              blocks: [
                                  {
                                      name: "authors",
                                      dom: {
                                          element: b.find(
                                              ".dji-sru-page-content",
                                          )[0],
                                          selectors: [
                                              ".dji-sru-page-source-author-line [dji-accessible]",
                                          ],
                                      },
                                  },
                                  {
                                      name: "form",
                                      dom: {
                                          element: b.find(
                                              ".dji-sru-page-content",
                                          )[0],
                                          selectors: [
                                              ".dji-sru-citation-form [dji-accessible]",
                                          ],
                                      },
                                  },
                              ],
                          },
                      ],
                  });
              }, 0))
            : (b.off("keydown", jb),
              b.removeClass("dji-visible"),
              (a.page.source = null),
              Fc(),
              k.popBlock("source_dialog"));
        if (a.updateUIPathState) {
            var c = sru.outlinesDataManager.currentUiPathState();
            a.show
                ? ((c.lastView = c.view),
                  (c.view = "source"),
                  (c.dlgMode = a.dlgMode),
                  (c.sourceTabItem = a.selTabItem),
                  a.source && (c.uuidSource = a.source.uuid()))
                : ((c.view = c.lastView),
                  delete c.lastView,
                  c.source && delete c.source,
                  delete c.sourceTabItem);
            sru.outlinesDataManager.updateUiPathState(c);
        }
    }
    function kb(a, b, c) {
        var d = !1;
        if (null == b)
            (d = c && "home" == c),
                O(a, sru.outlinesDataManager.home(), d),
                __$("#dji-sru-outline-move-to-dlg").attr("dji-home-folder", "");
        else {
            var e = b.outlines("");
            e.sort(function (h, l) {
                return h.title().toLowerCase() > l.title().toLowerCase()
                    ? 1
                    : h.title().toLowerCase() < l.title().toLowerCase()
                      ? -1
                      : 0;
            });
            for (var f = 0; f < e.length; f++)
                (b = e[f]),
                    b.isDirectory() && ((d = b.uuid() == c), O(a, b, d));
            __$("#dji-sru-outline-move-to-dlg").removeAttr(
                "dji-home-folder",
                "",
            );
        }
    }
    function wa(a, b, c) {
        var d = __$("#dji-sru-outline-move-to-dlg .dji-sru-page-content");
        d.empty();
        var e = ma(b);
        __$(
            "#dji-sru-outline-move-to-dlg .dji-sru-page-toolbar-line2 .dji-sru-folder-page-info",
        ).html(e);
        kb(d[0], b, c);
        d = a.find(".dji-sru-tb-button.dji-sru-outline-new-folder");
        a.data("outline", b);
        null == b ? d.addClass("dji-disable") : d.removeClass("dji-disable");
        c
            ? __$("#dji-sru-outline-move-to-dlg-done").removeClass(
                  "dji-disable",
              )
            : __$("#dji-sru-outline-move-to-dlg-done").addClass("dji-disable");
        k.reloadBlock("content");
    }
    function z(a) {
        var b = __$("#dji-sru-outline-move-to-dlg");
        if (a.show) {
            var c = a.outline || null,
                d = a.selOutline || null;
            k.addBlockAndSetup("move_to_folder", {
                name: "move_to_folder",
                blocks: [
                    {
                        name: "toolbar",
                        dom: {
                            element: b.find(".dji-sru-page-toolbar")[0],
                            selectors: ["[dji-accessible]"],
                        },
                    },
                    {
                        name: "content",
                        dom: {
                            element: b.find(".dji-sru-page-content")[0],
                            selectors: ["[dji-accessible]"],
                        },
                    },
                    {
                        name: "footer",
                        dom: {
                            element: b.find(".dji-sru-popup-buttons")[0],
                            selectors: ["[dji-accessible]"],
                        },
                    },
                ],
            });
            wa(b, c, d);
            b.on("keydown", lb);
            b.addClass("dji-visible");
            setTimeout(function () {
                b.focus();
            }, 0);
        } else
            k.popBlock("move_to_folder"),
                b.off("keydown", lb),
                b.removeClass("dji-visible"),
                __$(
                    "#dji-sru-outline-move-to-dlg .dji-sru-page-content",
                ).empty(),
                __$("#dji-sru-outline-move-to-dlg-done").addClass(
                    "dji-disable",
                );
        if (a.updateUIPathState) {
            var e = sru.outlinesDataManager.currentUiPathState();
            a.show
                ? ((e.view = "moveTo"),
                  (e.moveToOutline = c ? c.uuid() : null),
                  d && (e.moveToSelOutline = d.uuid()))
                : ((e.view = "outline"),
                  delete e.moveToOutline,
                  delete e.moveToSelOutline);
            sru.outlinesDataManager.updateUiPathState(e);
        }
    }
    function y(a, b) {
        function c() {
            if (b.doneCallback && $.isFunction(b.doneCallback)) {
                var m = h.val().trim();
                b.doneCallback(m, function (p) {
                    p && !p.error && y(!1);
                });
            } else y(!1);
            k.reloadBlock("content");
        }
        function d(m) {
            13 == m.keyCode ? l.click() : 27 == m.keyCode && y(!1);
        }
        function e() {
            y(!1);
        }
        var f = __$("#dji-folder-page-template-dlg-1"),
            h = f.find("#dji-folder-page-template-dlg-1-input"),
            l = f.find("#dji-folder-page-template-dlg-1-done");
        a
            ? (f.find(".dji-sru-dialog-title").text(b.title),
              h.attr("placeholder", b.placeholder).val(b.value),
              l.text(b.doneBtnText),
              l.on("click x-enter", c),
              f.on("keydown", d),
              f.on("x-dismiss", e),
              f.addClass("dji-visible"),
              setTimeout(function () {
                  h.focus();
                  b.highlight && h.select();
                  k.addBlockAndSetup("new_folder", {
                      name: "new_folder",
                      dom: {element: f[0], selectors: ["[dji-accessible]"]},
                  });
              }, 0))
            : (l.off("click x-enter"),
              f.off("x-dismiss", e),
              f.off("keydown", d),
              f.removeClass("dji-visible"),
              k.popBlock("new_folder"));
    }
    function Z(a, b) {
        var c = __$("#dji-folder-page-delete-outline-dlg");
        a
            ? (c.on("keydown", mb),
              c.addClass("dji-visible"),
              setTimeout(function () {
                  c.focus();
                  k.addBlockAndSetup("delete_outline", {
                      name: "delete_outline",
                      dom: {element: c[0], selectors: ["[dji-accessible]"]},
                  });
              }, 0))
            : (c.off("keydown", mb),
              c.removeClass("dji-visible"),
              k.popBlock("delete_outline"));
    }
    function zb() {
        k.addBlockAndSetup("search_outlines", {
            name: "search_outlines",
            blocks: [
                {
                    name: "toolbar",
                    dom: {
                        element: g().querySelector(
                            ".dji-sru-search-container .dji-sru-page-toolbar",
                        ),
                        selectors: ["[dji-accessible]"],
                    },
                },
                {
                    name: "content",
                    dom: {
                        element: g().querySelector(
                            ".dji-sru-search-container .dji-sru-search-result",
                        ),
                        selectors: ["[dji-accessible]"],
                    },
                },
            ],
        });
        $(g()).find(".dji-sru-folder-page").attr("dji-sru-search-outlines", !0);
        setTimeout(function () {
            __$("input[dji-sru-search-outlines-input]").focus();
        }, 0);
    }
    function Aa() {
        $(g())
            .find(".dji-sru-folder-page")
            .removeAttr("dji-sru-search-outlines");
        Ba();
        k.popBlock("search_outlines");
    }
    function Ba() {
        var a = $(g()).find(".dji-sru-folder-page .dji-sru-search-container");
        a.removeAttr("dji-sru-show-result");
        a.find(".dji-sru-search-result").empty();
        __$("input[dji-sru-search-outlines-input]").val("");
        k.reloadBlock("content");
    }
    function yb(a) {
        a = $(a.currentTarget).val();
        a = a.trim().toLowerCase();
        if ("" == a)
            $(g())
                .find(".dji-sru-folder-page .dji-sru-search-container")
                .removeAttr("dji-sru-show-result");
        else {
            a = g().outline.outlines(a);
            var b = $(g()).find(".dji-sru-folder-page .dji-sru-search-result");
            b.empty();
            if (a && a.length) {
                for (var c = 0; c < a.length; c++) {
                    var d = b,
                        e = a[c],
                        f = e.isHome()
                            ? "dji-sru-folder-item-home"
                            : e.isDirectory()
                              ? "dji-sru-folder-item-subfolder"
                              : "dji-sru-folder-item-outline";
                    f = dji.ui.templates.load(t, f);
                    f.outline = e;
                    f.id = e.uuid();
                    f = $(f);
                    if (!e.isHome()) {
                        var h = new Date(e.modifiedDate()),
                            l = h.getMonthName("en"),
                            m = h.getDate();
                        h = h.getFullYear();
                        l = l + " " + m + ", " + h;
                        f.find(".dji-sru-folder-item-name").text(e.title());
                        f.find(".dji-sru-folder-item-date").text(l);
                    }
                    f.addClass("dji-sru-search-folder-item").removeClass(
                        "dji-sru-folder-item",
                    );
                    d.append(f);
                }
                $(g())
                    .find(".dji-sru-folder-page .dji-sru-search-container")
                    .attr("dji-sru-show-result", "");
            } else
                $(g())
                    .find(".dji-sru-folder-page .dji-sru-search-container")
                    .removeAttr("dji-sru-show-result");
        }
        k.reloadBlock("content");
    }
    function xa(a, b) {
        var c = !1;
        a = a.find(
            ".dji-sru-outline-page .dji-sru-search-container .dji-sru-search-result",
        );
        a.empty();
        b = (b || "").toLowerCase();
        for (var d in ha)
            "" == b
                ? ((c = !0),
                  $("<div/>", {
                      class: "dji-sru-search-outline-template",
                      text: d,
                  })
                      .attr({"dji-accessible": ""})
                      .data("dji-outline-template", ha[d])
                      .appendTo(a))
                : -1 != d.toLowerCase().indexOf(b) &&
                  ((c = !0),
                  $("<div/>", {
                      class: "dji-sru-search-outline-template",
                      text: d,
                  })
                      .attr({"dji-accessible": ""})
                      .data("dji-outline-template", ha[d])
                      .appendTo(a));
        c
            ? $(g())
                  .find(".dji-sru-outline-page .dji-sru-search-container")
                  .attr("dji-sru-show-result", "")
            : $(g())
                  .find(".dji-sru-outline-page .dji-sru-search-container")
                  .removeAttr("dji-sru-show-result");
    }
    function sc(a) {
        $(a.currentTarget).hasClass("dji-disable")
            ? (a.preventDefault(), a.stopPropagation())
            : ((a = $(g())),
              xa(a, ""),
              $(g())
                  .find(".dji-sru-outline-page")
                  .attr("dji-sru-search-outline-template", !0),
              k.addBlockAndSetup("search_in_topic_templates", {
                  name: "search_in_topic_templates",
                  blocks: [
                      {
                          name: "toolbar",
                          dom: {
                              element: $(g()).find(
                                  ".dji-sru-search-outline-template-overlay .dji-sru-search-container .dji-sru-search-toolbar",
                              )[0],
                              selectors: ["[dji-accessible]"],
                          },
                      },
                      {
                          name: "content",
                          dom: {
                              element: $(g()).find(
                                  ".dji-sru-search-outline-template-overlay .dji-sru-search-container .dji-sru-search-result",
                              )[0],
                              selectors: ["[dji-accessible]"],
                          },
                      },
                  ],
              }),
              setTimeout(function () {
                  $(g())
                      .find("input[dji-sru-search-outline-template-input]")
                      .focus();
              }, 0));
    }
    function Ca() {
        $(g())
            .find(".dji-sru-outline-page")
            .removeAttr("dji-sru-search-outline-template");
        Da();
        k.popBlock("search_in_topic_templates");
    }
    function Da() {
        $(g()).find("input[dji-sru-search-outline-template-input]").val("");
        xa($(g()), "");
        k.reloadBlock("content");
    }
    function Hb(a) {
        a = $(a.currentTarget).val().trim();
        xa($(g()), a);
        k.reloadBlock("content");
    }
    function nb(a, b, c, d) {
        b = a.createTopic(c.body, d, b);
        for (d = 0; d < c.children.length; d++) nb(a, b, c.children[d], d);
    }
    function ob(a) {
        let b;
        b = "" + a.body;
        for (let c of a.children) b += " " + ob(c);
        return b;
    }
    function Ib(a) {
        a = $(a.currentTarget).data("dji-outline-template");
        var b = g().outline,
            c = $(g())
                .find(".dji-sru-page-content #u000.dji-sru-outline-list")
                .children(".dji-sru-outline-topic:last-child")[0];
        c = c.topic ? c.topic.location() + 1 : -1;
        for (var d = 0; d < a.length; d++) {
            var e = a[d];
            b.isSkeleton() &&
                (b.title(e.body), M(g(), e.body), sru.toolbar.setTitle(b));
            for (
                var f = b.createTopic(e.body, c, null), h = 0;
                h < e.children.length;
                h++
            )
                nb(b, f, e.children[h], h);
            c++;
        }
        ka(g());
        Ca();
        k.reloadBlock("content");
        dji.utils.callListeners(u, "outlineTextAdded", {
            text: ob(a[0]),
            addedManually: 1,
            textCaptured: 0,
        });
    }
    function pc() {
        let a = __$("#dji-sru-outline-source-dlg"),
            b = {
                name: "search_sources",
                blocks: [
                    {
                        name: "toolbar",
                        dom: {
                            element: a.find(
                                ".dji-sru-search-container .dji-sru-search-toolbar",
                            )[0],
                            selectors: [
                                "input[dji-sru-search-sources-input]",
                                ".dji-sru-hide-search-sources",
                                ".dji-sru-reset-search-sources",
                            ],
                        },
                    },
                    {
                        name: "content-sources",
                        dom: {
                            element: a.find(
                                ".dji-sru-search-container .dji-sru-search-result",
                            )[0],
                            selectors: [".dji-sru-search-source"],
                        },
                    },
                ],
            };
        k.addBlockAndSetup("search_sources", b);
        a.attr("dji-sru-search-sources", !0);
        setTimeout(function () {
            __$("input[dji-sru-search-sources-input]").focus();
        }, 0);
    }
    function Fa() {
        __$("#dji-sru-outline-source-dlg").removeAttr("dji-sru-search-sources");
        Ga();
        k.popBlock("search_sources");
    }
    function Ga() {
        __$("#dji-sru-outline-source-dlg")
            .find(".dji-sru-search-container")
            .removeAttr("dji-sru-show-result");
        __$(
            "#dji-sru-outline-source-dlg input[dji-sru-search-sources-input]",
        ).val("");
        k.clearBlock("content-sources");
    }
    function Ub(a) {
        13 === a.keyCode &&
            (a.preventDefault(),
            a.stopPropagation(),
            (a = $(a.currentTarget).val().trim()),
            "" !== a &&
                ((a = {query: a, materialType: "all"}),
                sru.mainContainer.enterBusyState(),
                dji.utils.callListeners(u, "searchSources", a)));
    }
    function Vb(a) {
        var b = $(a.currentTarget).data("dji-source");
        if (b) {
            a = __$("#dji-sru-outline-source-dlg");
            b = b.cslData;
            var c = ib[b.type],
                d = a.find(".dji-sru-tab-items .dji-sru-tab-item.dji-selected");
            d.attr("dji-item") != c && P(a, d.parent());
            B(a, c, !0);
            gb(a, b, c);
            Fa();
        }
    }
    function Fb() {
        $(g())
            .find(".dji-sru-outline-page")
            .attr("dji-sru-search-in-topics", !0);
        sru.searchInOutlineController.init(g());
        k.addBlockAndSetup("search_in_topics", {
            name: "search_in_topics",
            dom: {
                element: $(g()).find(".dji-sru-search-toolbar")[0],
                selectors: ["[dji-accessible]"],
            },
        });
        setTimeout(function () {
            __$("input[dji-sru-search-in-topic-input]").focus();
        }, 0);
    }
    function Gb(a) {
        a = $(a.currentTarget).val().trim();
        sru.searchInOutlineController.mark(a);
    }
    function S() {
        $(g())
            .find(".dji-sru-outline-page")
            .removeAttr("dji-sru-search-in-topics");
        __$("input[dji-sru-search-in-topic-input]").val("");
        sru.searchInOutlineController.reset();
        k.popBlock("search_in_topics");
    }
    function ac(a) {
        a = $(a.currentTarget).attr("dji-sru-source-dlg");
        E({
            page: g(),
            show: !0,
            selTab: "dji-sru-outline-source-book",
            dlgMode: a,
            updateUIPathState: !0,
        });
    }
    function Ma(a) {
        if (aa != a.data) {
            var b = sru.outlinesDataManager.currentUiPathState();
            aa = b.outlineViewMode = a.data;
            $(x)
                .find(".dji-sru-page .dji-sru-folder-page")
                .each(function () {
                    A(this.parentNode, "");
                });
            sru.outlinesDataManager.updateUiPathState(b);
        }
    }
    function pb(a, b) {
        var c = g().outline;
        a && "" != a
            ? (c.title(a),
              sru.toolbar.setTitle(c),
              c.isDirectory()
                  ? ((a = ma(c)), M(g(), a, !0))
                  : M(g(), c.title()),
              b({error: 0, message: "Outline title has been changed!!!"}))
            : b({error: 500, message: "Invalid title!!!"});
    }
    function Hc(a, b) {
        if (!K) return b({error: 500, message: "No outline selected!!!"});
        a && "" != a
            ? (K.title(a),
              $(g())
                  .find(
                      "#" +
                          K.uuid() +
                          " .dji-sru-folder-item-info .dji-sru-folder-item-name",
                  )
                  .text(a),
              b({error: 0, message: "Outline title has been changed!!!"}))
            : b({error: 500, message: "Invalid title!!!"});
    }
    function xb(a) {
        $(a.currentTarget).hasClass("dji-disable")
            ? (a.preventDefault(), a.stopPropagation())
            : ((a = {
                  title: "Rename",
                  value: g().outline.title(),
                  placeholder: "Outline Name",
                  highlight: !0,
                  doneBtnText: "RENAME",
                  doneCallback: pb,
              }),
              y(!0, a));
    }
    function qc(a) {
        $(a.currentTarget).hasClass("dji-disable")
            ? (a.preventDefault(), a.stopPropagation())
            : ((a = {
                  title: "Rename",
                  value: K.title(),
                  placeholder: "Outline Name",
                  highlight: !0,
                  doneBtnText: "RENAME",
                  doneCallback: Hc,
              }),
              y(!0, a));
    }
    function Ic(a, b) {
        if (a && "" != a) {
            var c = g().outline;
            c.isHome() && (c = null);
            sru.outlinesDataManager.createDirectory(a, c);
            A(g());
            b({error: 0, message: "Folder has been created!!!"});
        } else
            b({
                error: 500,
                message: "Invalid folder name!!!",
            });
    }
    function Kb(a, b) {
        if (a && "" != a) {
            var c = __$("#dji-sru-outline-move-to-dlg"),
                d = c.data("outline"),
                e = d.isHome() ? null : d;
            g();
            sru.outlinesDataManager.createDirectory(a, e);
            a = c.find(".dji-sru-page-content");
            a.empty();
            c = sru.outlinesDataManager.currentUiPathState();
            kb(a[0], d, c.moveToSelOutline);
            b({error: 0, message: "Folder has been created!!!"});
        } else b({error: 500, message: "Invalid folder name!!!"});
    }
    function Mb(a) {
        a = a.currentTarget.outline;
        var b = __$("#dji-sru-outline-move-to-dlg");
        b.data("outline", a);
        wa(b, a, null);
        b = sru.outlinesDataManager.currentUiPathState();
        b.moveToOutline = a ? (a.isHome() ? "home" : a.uuid()) : null;
        b.moveToSelOutline = null;
        sru.outlinesDataManager.updateUiPathState(b);
    }
    function Nb(a) {
        var b = a.currentTarget.outline,
            c = sru.outlinesDataManager.currentUiPathState();
        $(a.currentTarget).hasClass("dji-selected")
            ? ($(a.currentTarget).removeClass("dji-selected"),
              __$("#dji-sru-outline-move-to-dlg-done").addClass("dji-disable"),
              (c.moveToSelOutline = null))
            : ($(a.currentTarget)
                  .parent()
                  .find(".dji-sru-folder-item")
                  .removeClass("dji-selected"),
              $(a.currentTarget).addClass("dji-selected"),
              __$("#dji-sru-outline-move-to-dlg-done").removeClass(
                  "dji-disable",
              ),
              (c.moveToSelOutline = b.isHome() ? "home" : b.uuid()));
        sru.outlinesDataManager.updateUiPathState(c);
    }
    function lb(a) {
        if (13 == a.keyCode) {
            if (
                !__$("#dji-sru-outline-move-to-dlg-done").hasClass(
                    "dji-disable",
                )
            ) {
                var b = ua(),
                    c = __$(
                        "#dji-sru-outline-move-to-dlg .dji-sru-page-content .dji-sru-folder-item.dji-selected",
                    )[0].outline;
                sru.outlinesDataManager.moveOutlines(b, c);
                A(g());
                z({show: !1, updateUIPathState: !0});
            }
            a.preventDefault();
            a.stopPropagation();
        } else
            27 == a.keyCode &&
                (z({show: !1, updateUIPathState: !0}),
                a.preventDefault(),
                a.stopPropagation());
    }
    function Lb() {
        var a = __$("#dji-sru-outline-move-to-dlg").data("outline");
        a = a.isHome() ? null : a.parent();
        var b = __$("#dji-sru-outline-move-to-dlg");
        wa(b, a, null);
        b = sru.outlinesDataManager.currentUiPathState();
        b.moveToOutline = a ? (a.isHome() ? "home" : a.uuid()) : null;
        b.moveToSelOutline = null;
        sru.outlinesDataManager.updateUiPathState(b);
    }
    function Ob(a) {
        if ($(a.currentTarget).hasClass("dji-disable"))
            a.preventDefault(), a.stopPropagation();
        else {
            a = ua();
            var b = __$(
                "#dji-sru-outline-move-to-dlg .dji-sru-page-content .dji-sru-folder-item.dji-selected",
            )[0].outline;
            sru.outlinesDataManager.moveOutlines(a, b);
            A(g());
            z({show: !1, updateUIPathState: !0});
        }
    }
    function Ab() {
        y(!0, {
            title: "New Folder",
            value: "New Folder",
            placeholder: "Folder Name",
            doneBtnText: "CREATE FOLDER",
            doneCallback: Ic,
        });
    }
    function ya() {
        var a = {
            title: "Rename Outline",
            value: g().outline.title(),
            placeholder: "Outline Name",
            highlight: !0,
            doneBtnText: "RENAME",
            doneCallback: pb,
        };
        y(!0, a);
    }
    function mb(a) {
        13 == a.keyCode
            ? (Ia(), a.stopPropagation(), a.preventDefault())
            : 27 == a.keyCode &&
              (Ha(), a.stopPropagation(), a.preventDefault());
    }
    function Ha() {
        g().outline.title("Outline Name");
        Z(!1);
        dji.ui.pagination.previousPage(x, function (a) {
            A(a);
            sru.outlinesDataManager.popOutlineFromStack();
            sru.toolbar.setTitle(a.outline);
            k.popBlock();
        });
    }
    function Ia() {
        var a = g().outline;
        Z(!1);
        dji.ui.pagination.previousPage(x, function (b) {
            b.outline.deleteOutlines([a]);
            sru.outlinesDataManager.popOutlineFromStack();
            sru.toolbar.setTitle(b.outline);
            k.popBlock();
        });
    }
    function Na(a) {
        $(a.currentTarget).hasClass("dji-disable")
            ? (a.preventDefault(), a.stopPropagation())
            : z({show: !0, outline: null, updateUIPathState: !0});
    }
    function Oa(a) {
        $(a.currentTarget).hasClass("dji-disable")
            ? (a.preventDefault(), a.stopPropagation())
            : ((a = ua()),
              0 < a.length && (g().outline.deleteOutlines(a), A(g())));
    }
    function Db(a) {
        a.preventDefault();
        a.stopPropagation();
        a = g();
        var b = $(a).find(
                ".dji-sru-page-content ul#u000 li.dji-sru-outline-topic",
            ),
            c = b.find(".dji-sru-outline-topic-content");
        if (0 == $(c).find("img").length && "" == c.text() && 1 == b.length)
            c.click();
        else if (
            ((b = $(a)
                .find(
                    ".dji-sru-page-content ul#u000 li.dji-sru-outline-topic .dji-sru-outline-topic-element[selected-element]",
                )
                .first()),
            0 == b.length || "" != b.text())
        )
            (c = null),
                0 != b.length &&
                    (c = dji.utils.closestParent(
                        b[0],
                        ".dji-sru-outline-topic",
                    )),
                L({page: a, prevElement: c});
    }
    function Bb() {
        if ((K = g().outline)) {
            var a = __$("#dji-sru-folder-page-context-menu");
            0 != $(g()).find(".dji-sru-folder-item.dji-selected").length
                ? (__$(
                      "#dji-sru-folder-page-move-to-outline-items",
                  ).removeClass("dji-disable"),
                  __$("#dji-sru-folder-page-delete-outline-items").removeClass(
                      "dji-disable",
                  ))
                : (__$("#dji-sru-folder-page-move-to-outline-items").addClass(
                      "dji-disable",
                  ),
                  __$("#dji-sru-folder-page-delete-outline-items").addClass(
                      "dji-disable",
                  ));
            a.addClass("dji-visible");
            k.addBlockAndSetup("folder_context_menu", {
                name: "folder_context_menu",
                dom: {element: a[0], selectors: ["[dji-accessible]"]},
            });
        }
    }
    function Cb() {
        var a = g();
        if ((K = a.outline))
            "dji-sru-outline-details" ==
            $(a)
                .find(
                    ".dji-sru-page-toolbar .dji-sru-tab-items .dji-sru-tab-item.dji-selected",
                )
                .attr("dji-item")
                ? __$("#dji-sru-search-outline-template").removeClass(
                      "dji-disable",
                  )
                : __$("#dji-sru-search-outline-template").addClass(
                      "dji-disable",
                  ),
                __$("#dji-sru-outline-page-context-menu").addClass(
                    "dji-visible",
                ),
                k.addBlockAndSetup("menu_outline", {
                    name: "menu_outline",
                    dom: {
                        element: __$("#dji-sru-outline-page-context-menu")[0],
                        selectors: ["[dji-accessible]"],
                    },
                });
    }
    function jb(a) {
        a.altKey ||
            a.ctrlKey ||
            a.shiftKey ||
            a.metaKey ||
            (13 === a.keyCode
                ? Ea()
                : 27 === a.keyCode &&
                  E({page: g(), show: !1, updateUIPathState: !0}));
    }
    function Pb() {
        __$(
            ".dji-sru-tab-item-more[dji-item=dji-sru-outline-source-more]",
        ).addClass("dji-dropdown");
        __$("#dji-sru-outline-new-source-more-context-menu").addClass(
            "dji-visible",
        );
        k.addBlockAndSetup("menu_source_type", {
            name: "menu_source_type",
            dom: {
                element: __$(
                    "#dji-sru-outline-new-source-more-context-menu",
                )[0],
                selectors: ["[dji-accessible]"],
            },
        });
    }
    function Qb(a) {
        a = $(a.currentTarget).find(".dji-sru-contributors-selection");
        a.addClass("dji-visible");
        k.addBlockAndSetup(
            "menu_source_contributor_type",
            {
                name: "menu_source_contributor_type",
                dom: {element: a[0], selectors: ["[dji-accessible]"]},
            },
            !0,
        );
    }
    function Sb(a) {
        var b = $(a.currentTarget),
            c = b.parent().parent();
        b = b.attr("dji-value");
        c.find(".dji-sru-combobox-label").text(b);
        c.find(".dji-sru-contributors-selection").removeClass("dji-visible");
        a.preventDefault();
        a.stopPropagation();
        k.removeBlock("menu_source_contributor_type");
    }
    function Tb() {
        var a = __$("#dji-sru-outline-source-dlg").find(
            ".dji-tab-item-view.dji-source-view.dji-visible .dji-sru-form-line.dji-sru-page-source-author-line",
        );
        if (!(3 <= a.length)) {
            a.addClass("dji-sru-hide-add-button");
            var b = dji.ui.templates.load(
                t,
                "dji-sru-template-page-source-author-line",
            );
            $(b).insertAfter(a.last());
            k.reloadBlock("content authors", !0);
        }
    }
    function Rb(a) {
        $(a.currentTarget)
            .find(".dji-sru-contributors-selection")
            .removeClass("dji-visible");
        k.removeBlock("menu_source_contributor_type");
    }
    function Yb(a) {
        var b = $(a.target);
        if (!b.hasClass("dji-selected")) {
            a = b.attr("dji-item");
            var c = __$("#dji-sru-outline-source-dlg");
            P(c, b.parent());
            B(c, a, !0);
            b = sru.outlinesDataManager.currentUiPathState();
            b.sourceTabItem = a;
            sru.outlinesDataManager.updateUiPathState(b);
            k.reloadBlock("content");
        }
    }
    function rc(a) {
        a = $(a.currentTarget);
        var b = __$("#dji-sru-outline-source-dlg"),
            c = b.find(
                ".dji-sru-tab-items .dji-sru-tab-item[dji-item=" +
                    a.attr("dji-item") +
                    "]",
            );
        if (0 == c.length)
            (c = b.find(".dji-sru-tab-items .dji-sru-tab-item").last()),
                P(b, c.parent()),
                c.text(a.attr("dji-item-text")),
                c.attr("dji-item", a.attr("dji-item"));
        else {
            if (c.hasClass("dji-selected")) return;
            P(b, c.parent());
        }
        B(b, a.attr("dji-item"), !0);
        b = sru.outlinesDataManager.currentUiPathState();
        b.sourceTabItem = a.attr("dji-item");
        sru.outlinesDataManager.updateUiPathState(b);
        k.reloadBlock("#source_dialog content");
    }
    function nc() {
        let a = g(),
            b =
                $(a)
                    .find(".dji-sru-oss-tab-item.dji-selected")
                    .attr("dji-oss-style") || "APA";
        sru.downloadController.download(a.outline, b);
    }
    function oc() {
        let a = g(),
            b =
                $(a)
                    .find(".dji-sru-oss-tab-item.dji-selected")
                    .attr("dji-oss-style") || "APA";
        sru.printController.print(a.outline, b);
    }
    var u = {
        searchSources: [],
        options: [],
        signOut: [],
        activateHighlightChange: [],
        outlineOpened: [],
        outlineModified: [],
        outlineTextAdded: [],
        sourcesOpened: [],
        sourcesDownloaded: [],
    };
    let fa = {pageContextRequired: null, insertText: null};
    var t = null,
        qb = !1,
        x;
    var q = null;
    var w = void 0;
    var W = !1,
        ta = !1,
        r,
        I,
        D = null,
        G = null,
        Q = null,
        ha = null,
        Y = {recent: 1, alphabetical: 2},
        aa = Y.alphabetical,
        da = {
            indent: "__dji_sru_indentButton",
            outdent: "__dji_sru_outdentButton",
            link: "__dji_sru_linkButton",
            delete: "__dji_sru_deleteTopicButton",
        },
        ea = {
            edit: "__dji_sru_editSourceButton",
            delete: "__dji_sru_deleteSourceButton",
        },
        pa = {
            "dji-sru-outline-source-book": {tabName: "Book", cslType: "book"},
            "dji-sru-outline-source-journal": {
                tabName: "Journal",
                cslType: "article-journal",
            },
            "dji-sru-outline-source-webpage": {
                tabName: "Website",
                cslType: "webpage",
            },
            "dji-sru-outline-source-movie": {
                tabName: "Movie",
                cslType: "motion_picture",
            },
            "dji-sru-outline-source-magazine": {
                tabName: "Magazine",
                cslType: "article-magazine",
            },
            "dji-sru-outline-source-newspaper": {
                tabName: "Newspaper",
                cslType: "article-newspaper",
            },
            "dji-sru-outline-source-tv-radio": {
                tabName: "TV/Radio",
                cslType: "broadcast",
            },
            "dji-sru-outline-source-visual-art": {
                tabName: "Visual Art",
                cslType: "graphic",
            },
        },
        ib = {
            "book": "dji-sru-outline-source-book",
            "journal": "dji-sru-outline-source-journal",
            "article-journal": "dji-sru-outline-source-journal",
            "webpage": "dji-sru-outline-source-webpage",
            "movie": "dji-sru-outline-source-movie",
            "motion_picture": "dji-sru-outline-source-movie",
            "magazine": "dji-sru-outline-source-magazine",
            "article-magazine": "dji-sru-outline-source-magazine",
            "newspaper": "dji-sru-outline-source-newspaper",
            "article-newspaper": "dji-sru-outline-source-newspaper",
            "television": "dji-sru-outline-source-tv-radio",
            "broadcast": "dji-sru-outline-source-tv-radio",
            "visual": "dji-sru-outline-source-visual-art",
            "graphic": "dji-sru-outline-source-visual-art",
        },
        C = {
            Author: "Author",
            Editor: "Editor",
            Translator: "Translator",
            Compiler: "Compiler",
            Director: "Director",
            Artist: "Artist",
            Writer: "Writer",
        },
        J = !1,
        K = null;
    var F = null;
    let k = new window.dji.accessibility.Manager();
    n.activateHighlight = function (a) {
        J !== a &&
            ((J = a)
                ? (window.dji.utils.isSruPwaApp() ||
                      window.dji.utils.isCambridgeLMS() ||
                      window.dji.utils.preventInputEventsOnBodyElements(!0),
                  window.dji.utils.addEventListenerToBodyElements(
                      "pointerup",
                      db,
                      !0,
                  ),
                  window.dji.utils.addEventListenerToBodyElements(
                      "click",
                      cb,
                      !0,
                  ),
                  window.dji.utils.addClassToHtmlElements(
                      "dji-sru-outline-highlight-active",
                  ))
                : (window.dji.utils.preventInputEventsOnBodyElements(!1),
                  window.dji.utils.removeEventListenerFromBodyElements(
                      "pointerup",
                      db,
                      !0,
                  ),
                  window.dji.utils.removeEventListenerFromBodyElements(
                      "click",
                      cb,
                      !0,
                  ),
                  window.dji.utils.removeClassFromHtmlElements(
                      "dji-sru-outline-highlight-active",
                  )),
            window.dji.utils.callListeners(u, "activateHighlightChange", a));
    };
    n.isHighlightActive = function () {
        return J;
    };
    n.initialize = function () {
        qb ||
            (k.reset(),
            (t = dji.ui.templates.source("__dji_sru_link_outlines")),
            (x = sru.mainContainer
                .mainContainer()
                .querySelector(".dji-sru-pagination-container")),
            dji.ui.pagination.initializeContainer(x, {
                source: t,
                name: "template-page",
            }),
            (r = __$.getElementById("dji-sru-topics-toolbar")),
            (I = __$.getElementById("dji-sru-sources-toolbar")),
            sb(),
            rb(),
            (qb = !0),
            dji.logger.log("Outlines initialized"));
    };
    n.setData = function (a, b) {
        k.reset();
        sru.outlinesDataManager.setData(a, b);
        Pa();
    };
    n.updateData = function (a, b) {
        if (
            (b = sru.outlinesDataManager.updateData(a, b)) &&
            ((b.updateInfo &&
                (b.updateInfo.topOutline ||
                    b.updateInfo.topDirectory ||
                    b.updateInfo.topTopic ||
                    b.updateInfo.topImage)) ||
                (b.deleteInfo &&
                    (b.deleteInfo.topOutline ||
                        b.deleteInfo.topDirectory ||
                        b.deleteInfo.topTopic ||
                        b.deleteInfo.topSource ||
                        b.deleteInfo.topImage)))
        ) {
            var c = !1;
            if (b.updateInfo && b.updateInfo.topImage)
                a: if (((a = a.update.images), (b = g()))) {
                    for (c = 0; c < a.length; c++) {
                        let d = a[c],
                            e = b.querySelector(`[__uuid='${d.uuid}']`);
                        if (!e) {
                            c = !1;
                            break a;
                        }
                        let f = e.closest(".dji-sru-outline-topic").topic;
                        e.removeAttribute("src");
                        e.src = f.imageUrl(d.uuid);
                    }
                    c = !0;
                } else c = !1;
            c || Pa();
        }
    };
    n.createEmptyTopic = function () {
        L({page: g()});
    };
    n.hideBulletToolbars = function () {
        ta && R(null, !1);
        W && H(null, !1);
    };
    n.displaySources = function (a, b, c) {
        if ("OL" == c) {
            b = (b || g()).querySelector(
                ".dji-sru-searched-citations-container",
            );
            __$(b).empty();
            for (var d = 0; d < a.length; d++) {
                var e = dji.ui.templates.load(
                    t,
                    "template-page-citation-searched-element",
                );
                e.source = a[d].cslData;
                for (var f = "", h = 0; h < a[d].cslData.author.length; h++)
                    f =
                        f +
                        a[d].cslData.author[h].given +
                        " " +
                        a[d].cslData.author[h].family +
                        (h == a[d].cslData.author.length - 1 ? "" : ", ");
                e.querySelector(".dji-sru-citation-author").innerText = f;
                e.querySelector(".dji-sru-citation-title").innerText =
                    a[d].cslData.title;
                e.querySelector(".dji-sru-citation-tooltip").innerHTML =
                    a[d].text;
                b.appendChild(e);
            }
        } else
            for (
                b = (b || g()).querySelector(
                    ".dji-sru-searched-citations-container",
                ),
                    __$(b).empty(),
                    d = 0;
                d < a.length;
                d++
            )
                (e = dji.ui.templates.load(
                    t,
                    "template-page-citation-searched-element",
                )),
                    (e.source = a[d]),
                    (e.querySelector(".dji-sru-citation-author").innerText =
                        a[d].authors),
                    (e.querySelector(".dji-sru-citation-title").innerText =
                        a[d].title),
                    (e.querySelector(".dji-sru-citation-tooltip").innerHTML =
                        a[d].citation.APA),
                    b.appendChild(e);
        __$.querySelector(".dji-sru-waiting").style.display = "none";
        b = sru.outlinesDataManager.currentUiPathState();
        b.dataType = c;
        b.data = a;
        sru.outlinesDataManager.updateUiPathState(b);
        __$.querySelector(".dji-sru-waiting").style.display = "none";
    };
    n.iframeDocLoaded = function (a) {
        a.body.addEventListener("drop", Ka, !0);
    };
    n.startHighlight = async function (a) {
        var b = await eb();
        b && (b.isTooLong || (b.text && 0 != b.text.length))
            ? (b.isTooLong || (await n.createTopicFromHighlight(b.text, null)),
              setTimeout(function () {
                  n.activateHighlight(!1);
                  sru.toolbar.activateHighlightButton(!1);
              }, 100),
              a(!0))
            : a(!1);
    };
    n.isHighlightable = function () {
        if (!g()) return !1;
        var a = g().children[0];
        return (
            "dji-template-sru-outline-page" ==
                a.getAttribute("dji-template-id") &&
            !$(a).hasClass("dji-sru-sources")
        );
    };
    n.createTopicFromHighlight = async function (a, b) {
        var c = null;
        if (!((a && 0 != a.length) || b)) {
            if ((c = await eb())) a = c.text;
            if (!((a && 0 != a.length) || b)) return;
        } else if (b && ((c = await Bc(b)), !c)) return;
        b ||
            dji.utils.callListeners(u, "outlineTextAdded", {
                text: a,
                addedManually: 0,
                textCaptured: 1,
            });
        var d = Q ? Q.closest(".dji-sru-outline-topic") : null;
        q || L({page: g(), prevElement: d, noFocus: !0});
        d = q.querySelector(".dji-sru-outline-topic-content");
        b ? await Dc(c, d) : (d.innerHTML = a);
        c = sru.outlinesDataManager.activeOutline();
        c.isSkeleton() && ra(c, b ? "Image" : a);
        b = $a(q);
        N(b.querySelector(".dji-sru-outline-topic-element"));
        a = dji.utils.getMetadata();
        a.id = "id0";
        a.type = pa["dji-sru-outline-source-webpage"].cslType;
        c.createSource(a, !0, b.topic);
        Ya(b.topic, b);
        la(g());
    };
    n.searchSourcesFinished = function (a, b) {
        let c;
        if (a)
            if ("OL" === b) {
                let d = $(g())
                    .find(
                        ".dji-sru-page-content .dji-tab-item-view.dji-sru-outline-sources .dji-sru-oss-tab-item.dji-selected",
                    )
                    .attr("dji-oss-style");
                d = d || "APA";
                c = [];
                for (let e = 0; e < a.length; e++) {
                    let f = a[e];
                    f.id = "id0";
                    f.type = "book";
                    let h = {};
                    h.cslData = f;
                    h.text = sru.citations.generateCition(f, d, "en-US");
                    c.push(h);
                }
            } else c = a;
        else c = [];
        n.displaySources(c, null, b);
        g().querySelector("#__dji_sru_searchSource").focus();
    };
    n.addEventListener = function (a, b) {
        u.hasOwnProperty(a) &&
            "function" == typeof b &&
            -1 == u[a].indexOf(b) &&
            u[a].push(b);
    };
    n.setDelegate = function (a, b) {
        !fa.hasOwnProperty(a) ||
            (null !== b && "function" != typeof b) ||
            (fa[a] = b);
    };
    n.onSearchSourcesFinished = function (a, b) {
        if (a)
            if ("OL" === b) {
                b = [];
                var c = $(g())
                    .find(
                        ".dji-sru-page-content .dji-tab-item-view.dji-sru-outline-sources .dji-sru-oss-tab-item.dji-selected",
                    )
                    .attr("dji-oss-style");
                c = c || "APA";
                for (var d = 0; d < a.length; d++) {
                    var e = a[d];
                    e.id = "id0";
                    e.type = "book";
                    var f = {};
                    f.cslData = e;
                    f.text = sru.citations.generateCition(e, c, "en-US");
                    b.push(f);
                }
            } else b = a;
        else b = [];
        a = __$("#dji-sru-outline-source-dlg");
        if (0 === b.length)
            a
                .find(".dji-sru-search-container")
                .removeAttr("dji-sru-show-result"),
                a
                    .find(".dji-sru-search-container .dji-sru-search-result")
                    .empty();
        else {
            c = a.find(".dji-sru-search-container .dji-sru-search-result");
            c.empty();
            for (d = 0; d < b.length; d++)
                (e = b[d]),
                    (f = $("<div/>", {class: "dji-sru-search-source"})),
                    f.data("dji-source", e),
                    f.html(e.text),
                    c.append(f);
            a.find(".dji-sru-search-container").attr("dji-sru-show-result", !0);
        }
        sru.mainContainer.leaveBusyState();
        k.reloadBlock("content-sources");
    };
    n.outlineTemplates = function (a) {
        ha = a;
    };
    n.isOutlineView = function () {
        let a = g(),
            b = a.outline;
        return !b || (b && (b.isHome() || b.isDirectory()))
            ? !1
            : $(a)
                  .find('.dji-sru-tab-item[dji-item="dji-sru-outline-details"]')
                  .hasClass("dji-selected");
    };
})((window.sru.outlines = window.sru.outlines || {}));
