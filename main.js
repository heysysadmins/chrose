(function() {
    if (window.chrome) {
        chromeVersion = navigator.userAgent.substring(navigator.userAgent.lastIndexOf("Chrome/"), navigator.userAgent.lastIndexOf(" "));
        chromeVersion = chromeVersion.substring(chromeVersion.indexOf("/"), chromeVersion.indexOf(".")).replaceAll("/", "");
        console.log(`Chrome ${chromeVersion}`);
    } else {
        chromeVersion = "0";
    }
    const securlyVersion = document.getElementById("securly-version").innerText;
    const minVersion = 102;

    let patches = document.getElementsByClassName("patch");
    let maxVersion = 132;
    /* I suck at storing such data in objects honestly
    for(i = 0; i < patches.length; i++) {
        if (patches[i].innerText > maxVersion) {
            maxVersion = patches[i].innerText;
        }
    }
    */
    for(i = maxVersion; i >= minVersion; i--) {
        button = document.createElement("button");
        button.className = "versionBtn";
        button.id = `versionBtn-${i}`;
        button.value = i;
        button.textContent = i;
        button.addEventListener("click", () => {filterOptions("129");});
        document.getElementById("os-versions").appendChild(button);
    }
    if (sessionStorage.getItem("version") == undefined) {
        if (chromeVersion > maxVersion) {
            document.getElementById("nopatches").hidden = false;
            document.getElementById("version").innerText = document.getElementsByClassName("versionBtn")[1].innerText;
        } else {
            if (chromeVersion < minVersion) {
                if (chromeVersion > 0) /* Checks if it's Chrome instance */ {
                    document.getElementById("version").innerText = document.getElementsByClassName("versionBtn")[-1].innerText;
                } else {
                    document.getElementById("version").innerText = "All";
                }
            } else {
                document.getElementById("version").innerText = chromeVersion;
            }
            if (chromeVersion > 0) {
                document.getElementById(`versionBtn-${chromeVersion}`).innerHTML += " <small>*</small>";
                document.getElementById(`versionBtn-${chromeVersion}`).style.fontWeight = "bold";
            }
        }
    } else {
        document.getElementById("version").innerText = sessionStorage.getItem("version");
    }
    if (localStorage.getItem("welcome")) {
        let logo, summary, disclaimer1, disclaimer2, continue_button, actual_logo;
        logo = document.createElement("div");
        logo.id = "logo"
        actual_logo = document.createElement("img");
        actual_logo.src = "assets/icon.png"
        actual_logo.style.height = "64px"
        logo.appendChild(actual_logo);
        logo.appendChild(
            document.createTextNode(
                "EXT-REMOVER"
            )
        );
        summary = Object.assign(
            document.createElement("p"),
            {
                textContent: "EXT-REMOVER contains a collection of exploits discovered by various users to expand the capability of managed Chromebooks, making it easy to find the information you need."
            }
        );
        disclaimer1 = Object.assign(
            document.createElement("p"),
            {
                textContent: "Exploit details, code, and styles have been modified for a better user experience."
            }
        );
        disclaimer2 = document.createElement("u");
        disclaimer2.appendChild(
            Object.assign(
                document.createElement("b"),
                {
                    textContent: "Disclaimers:"
                }
            )
        );
        disclaimer2.appendChild(
            document.createTextNode(
                " This service is not designed to encourage time wasting. Use these only in your free time, and do not let them lead to distraction. Property of your organization should always be returned in its proper condition."
            )
        );
        continue_button = Object.assign(
            document.createElement("button"),
            {
                className: "continue",
                textContent: "Continue"
            }
        );
        continue_button.addEventListener("click", close)
        message([logo, summary, disclaimer1, disclaimer2, continue_button]);
        document.getElementById('filterMsg').hidden = false;
    }
    filterOptions(document.getElementById("version").innerText);
    thumbnailHide(localStorage.getItem("thumbnailHide"));
    document.getElementById("version").addEventListener("mousedown", selectVersion);
    document.getElementById("settingsBtn").addEventListener("click", settings);
    const logoImg = document.getElementById("logo").getElementsByTagName("img")[0];
    logoImg.addEventListener("click", function startHueLoop() {
        this.style.padding = "2px";
        this.style.backgroundColor = "#FFC0CB"/*pink*/;
        hue = 200;
        logoImg.style.filter = `hue-rotate(${hue}deg)`;
        loop = setInterval(function() {
            logoImg.style.filter = `hue-rotate(${hue}deg)`;
            hue = (hue + 100) % 300;
        }, 1000); // 1 second
        logoImg.removeEventListener("click", startHueLoop);
        logoImg.addEventListener("click", () => {
            clearInterval(loop);
            this.style.padding = 0;
            logoImg.style.backgroundColor = "transparent";
            logoImg.addEventListener("click", startHueLoop);
        });
    });
    logoImg.addEventListener("click", () => {
        logoImg.style.animationPlayState = "running";
    });
    function filterOptions(version) {
        sessionStorage.setItem("version", version);
        if (localStorage.getItem("cloak") !== null && localStorage.getItem("cloak") !== undefined) {
            tabCloak(localStorage.getItem("cloak"));
        } else {
            document.title =  "Exploits - EXT-REMOVER";
        }
        const options = document.getElementsByClassName("optionButton");
        for (let i = 0; i < options.length; i++) {
            let patch_securly, patch, patch_securly_elem;
            patch = document.getElementsByClassName("patch")[0].innerText;
            if ((patch_securly_elem = options[i].getElementsByClassName("patch-securly"))[0]) {
                patch_securly = patch_securly_elem.innerText;
            }
            if ((version >= patch || securlyVersion >= patch_securly) && version !== "All" || patch == "Hidden") {
                options[i].parentElement.style.display = "none";
            } else {
                options[i].parentElement.style.display = "inline-block";
            }
        }
        const versionBtns = document.getElementsByClassName("versionBtn");
        for (let i = 0; i < versionBtns.length; i++) {
            document.getElementById(`versionBtn-${versionBtns[i].id.substring(versionBtns[i].id.indexOf("-") + 1)}`).setAttribute("selected", "false");
        }
        document.getElementById("version").innerText = version;
        document.getElementById("version").innerText = version;
        document.getElementById(`versionBtn-${version}`).setAttribute("selected", "true");
    }
    function message(messages) {
        let new_message = document.createElement("div");
        new_message.classList.add("details");
        new_message.id = "message";
        messages.map(m => {
            new_message.appendChild(m);
        });
        document.body.style.overflow = "hidden";
        document.getElementById("message").replaceWith(new_message);
        document.getElementById("noclick").hidden = false;
        document.getElementById("noclick").style.animationPlayState = "running";
        new_message.style.animationPlayState = "running";
    }
    function selectVersion() {
        document.body.style.overflow = "hidden";
        document.getElementById("divHeader").innerText = "Filters";
        document.getElementById("versionsContent").hidden = false;
        document.getElementById("details").hidden = false;
        document.getElementById("noclick").hidden = false;
        document.getElementById("noclick").style.animationPlayState = "running";
        document.getElementById("details").style.animationPlayState = "running";
        document.getElementById("close").addEventListener("click", close);
    }
    function settings() {
        document.body.style.overflow = "hidden";
        document.getElementById("divHeader").innerText = "Settings";
        document.getElementById("settingsContent").hidden = false;
        document.getElementById("details").hidden = false;
        document.getElementById("noclick").hidden = false;
        document.getElementById("noclick").style.animationPlayState = "running";
        document.getElementById("details").style.animationPlayState = "running";
        document.getElementById("close").addEventListener("click", close);
        document.getElementById("lightOptn").addEventListener("change",
            function() {
                alert(this.checked);
            }
        );
    }
    function tabCloak(cloak) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        if (cloak == "none") {
            localStorage.removeItem("cloak");
            filterOptions(document.getElementById("version").value);
            link.href = "assets/icon.png";
        } else {
            document.title = cloak;
            link.href = `assets/cloak/${cloak}.png`;
            localStorage.setItem("cloak", cloak);
        }
    }
    function thumbnailHide(hide) {
        const thumbnails = document.getElementsByClassName("thumbnail");
        for (let i = 0; i < thumbnails.length; i++) {
            thumbnails[i].hidden = hide;
            if (hide == true) {
                thumbnails[i].parentElement.style.height = "100px";
            } else {
                thumbnails[i].parentElement.style.height = thumbnails[i].parentElement.style.maxHeight;
            }
        }
        localStorage.setItem("thumbnailHide", hide);
    }
    function close() {
        document.getElementById("details").hidden = true;
        document.getElementById("message").hidden = true;
        document.getElementById("noclick").hidden = true;
        const divContent = document.getElementsByClassName("divContent");
        for (let i = 0; i < divContent.length; i++) {
            divContent[i].hidden = true;
        }
        document.body.style.overflow = "visible";
        localStorage.setItem("welcome", true);
    }
})()