window.dji = window.dji || {};
(function (e) {
    var k = dji.utils.generateUUID(),
        l = dji.utils.generateUUID(),
        d = {};
    e.show = function (b) {
        for (
            var a = b.uuid || k,
                c = {
                    type: b.type || "basic",
                    iconUrl: chrome.extension.getURL(
                        "resources/graphics/sruIcon-48x48.png",
                    ),
                    title: b.title || chrome.runtime.getManifest().name,
                },
                g =
                    "type iconUrl message contextMessage items requireInteraction buttons".split(
                        " ",
                    ),
                f = null,
                h = 0;
            h < g.length;
            h++
        )
            (f = g[h]), b.hasOwnProperty(f) && b[f] && (c[f] = b[f]);
        delete d[a];
        chrome.notifications.create(a, c, function (m) {
            d[m] = b;
        });
    };
    e.showByAuthCode = function (b) {
        var a = "We could not sign you in automatically.";
        switch (b) {
            case 800001:
                a = "To sign in, click Snap&Read's icon.";
                break;
            case 800002:
                a =
                    "We could not sign you in automatically: click Snap&Read's icon and pick the organization you'd like to use.";
                break;
            case 800003:
                a =
                    "We could not sign you in automatically: your license has expired.";
                break;
            case 800004:
                a =
                    "We could not sign you in automatically: your organization has canceled the license.";
                break;
            case 800005:
                a =
                    "We could not sign you in automatically: click Snap&Read's icon and enter payment information.";
                break;
            case 800020:
                a =
                    "We could not sign you in automatically: you must have at least one student to gain access to Snap&Read.";
                break;
            case 800021:
                a =
                    "We could not sign you in automatically: you must have at least one child to gain access to Snap&Read.";
                break;
            case 810401:
                a =
                    "We could not sign you in automatically: you don't have a license for Snap&Read.";
        }
        e.show({message: a});
    };
    e.showNewVoices = function (b, a, c) {
        e.show({
            uuid: l,
            isClickable: !0,
            requireInteraction: !0,
            title: "Try New Voices in Snap&Read?",
            message:
                "We have new and more human-sounding voices. Would you like to try a new voice?",
            buttons: [{title: "SWITCH VOICE"}, {title: "NO, THANKS"}],
            listeners: {onClicked: b, onButtonClicked: [a, c]},
        });
    };
    e.clearAll = function () {
        chrome.notifications.clear(l);
        chrome.notifications.clear(k);
    };
    chrome.notifications.onClosed.addListener(function (b) {
        delete d[b];
    });
    chrome.notifications.onClicked.addListener(function (b) {
        if (d.hasOwnProperty(b)) {
            var a = d[b];
            chrome.notifications.clear(b);
            if (
                a.listeners &&
                a.listeners.onClicked &&
                "function" == typeof a.listeners.onClicked
            )
                try {
                    a.listeners.onClicked();
                } catch (c) {}
        }
    });
    chrome.notifications.onButtonClicked.addListener(function (b, a) {
        if (d.hasOwnProperty(b)) {
            var c = d[b];
            chrome.notifications.clear(b);
            if (
                c.listeners &&
                c.listeners.onButtonClicked &&
                a < c.listeners.onButtonClicked.length &&
                "function" == typeof c.listeners.onButtonClicked[a]
            )
                try {
                    c.listeners.onButtonClicked[a]();
                } catch (g) {}
        }
    });
})((window.dji.notifications = window.dji.notifications || {}));
