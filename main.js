(function() {
    if (window.chrome) {
        chromeVersion = navigator.userAgent.substring(navigator.userAgent.lastIndexOf("Chrome/"), navigator.userAgent.lastIndexOf(" "));
        chromeVersion = chromeVersion.substring(chromeVersion.indexOf("/"), chromeVersion.indexOf(".")).replaceAll("/", "");
    } else {
        chromeVersion = "0";
    }
    const securlyVersion = document.getElementById("securly-version").textContent;
    const minVersion = 102;
    let patches = document.getElementsByClassName("patch");
    let minimum = document.getElementsByClassName("add");
    let maxVersion = 140;
    /* I suck at storing numerical data in objects honestly
    for(let i = 0; i < patches.length; i++) {
        if (patches[i].textContent > maxVersion) {
            maxVersion = patches[i].textContent;
        }
    }
    */
    for(let i = maxVersion; i >= minVersion; i--) {
        let button = document.createElement("button");
        button.className = "versionBtn";
        button.id = `versionBtn-${i}`;
        button.value = i;
        button.textContent = i;
        button.addEventListener("click", filterThis);
        document.getElementById("os-versions").appendChild(button);
    }
    function filterThis() {
        filterOptions(this.value);
    }
    let ver = sessionStorage.getItem("version");
    let ver_elem = document.getElementById("version");
    if (ver == null || ver == undefined) {
        if (chromeVersion > maxVersion) {
            document.getElementById("nopatches").style.display = "none";
            ver_elem.textContent = document.getElementsByClassName("versionBtn")[1].textContent;
        } else  {
            if (chromeVersion < minVersion) {
                if (chromeVersion > 0) /* Chrome instance */ {
                    ver_elem.textContent = document.getElementsByClassName("versionBtn").at(-1).textContent;
                } else {
                    ver_elem.textContent = "All";
                }
            } else {
                ver_elem.textContent = chromeVersion;
            }
            if (chromeVersion > 0) {
                document.getElementById(`versionBtn-${chromeVersion}`).style.fontWeight = "bold";
            }
        }
    } else {
        ver_elem.textContent = ver;
    }
    if (!localStorage.getItem("welcome")) {
        let logo, summary, note, disclaimer, continue_button, actual_logo;
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
                textContent: "EXT-REMOVER contains a collection of exploits discovered by various users to expand the capability of managed Chromebooks, making it easy to find the information and tools needed."
            }
        );
        note = Object.assign(
            document.createElement("p"),
            {
                textContent: "Exploit details, code, and styles have been modified for a better user experience."
            }
        );
        disclaimer = document.createElement("u");
        disclaimer.appendChild(
            Object.assign(
                document.createElement("b"),
                {
                    textContent: "Disclaimers:"
                }
            )
        );
        disclaimer.appendChild(
            document.createTextNode(
                " This site is not designed to encourage time wasting. Use these only in your free time, and do not let them lead to distraction. Property of your organization should always be returned in its proper condition. We are not liable for any damages or consequences caused by anything on this website."
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
        message([logo, summary, note, disclaimer, continue_button]);
        document.getElementById('filterMsg').hidden = false;
    }
    filterOptions(document.getElementById("version").textContent);
    document.getElementById("versionBtn-none").addEventListener("click", filterThis);
    if (localStorage.getItem("cloak")) {
        tabCloak(localStorage.getItem("cloak"));
    }
    if (localStorage.getItem("thumbnailHide")) {
        thumbnailHide(localStorage.getItem("thumbnailHide"));
    }
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
        }, 1000);
        logoImg.removeEventListener("click", startHueLoop);
        logoImg.addEventListener("click", () => {
            clearInterval(loop);
            this.style.padding = 0;
            logoImg.style.backgroundColor = "transparent";
            logoImg.style.filter = "none";
            logoImg.addEventListener("click", startHueLoop);
        });
    });
    logoImg.addEventListener("click", () => {
        logoImg.style.animationPlayState = "running";
    });
    function filterOptions(version) {
        sessionStorage.setItem("version", version);
        const options = document.getElementsByClassName("optionButton");
        for (let i = 0; i < options.length; i++) {
            let patch = document.getElementsByClassName("patch")[i].textContent, patch_securly, patch_securly_elem;
            if ((patch_securly_elem == options[i].getElementsByClassName("patch-securly"))[0]) {
                patch_securly = patch_securly_elem.textContent;
            }
            if ((version >= patch || securlyVersion >= patch_securly) && version !== "none" || patch == "Hidden") {
                options[i].parentElement.style.display = "none";
            } else {
                options[i].parentElement.style.display = "inline-block";
            }
        }
        const versionBtns = document.getElementsByClassName("versionBtn");
        for (let i = 0; i < versionBtns.length; i++) {
            versionBtns[i].setAttribute("selected", "false");
        }
        if (version == "none") {
            document.getElementById("version").textContent = "All";
        } else {
            document.getElementById("version").textContent = version;
        }
        document.getElementById(`versionBtn-${parseInt(version)?version:"none"}`).setAttribute("selected", "true");
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
        document.getElementById("divHeader").textContent = "Filters";
        document.getElementById("versionsContent").hidden = false;
        document.getElementById("details").hidden = false;
        document.getElementById("noclick").hidden = false;
        document.getElementById("noclick").style.animationPlayState = "running";
        document.getElementById("details").style.animationPlayState = "running";
        document.getElementById("close").addEventListener("click", close);
    }
    function settings() {
        document.body.style.overflow = "hidden";
        document.getElementById("divHeader").textContent = "Settings";
        document.getElementById("settingsContent").hidden = false;
        document.getElementById("details").hidden = false;
        document.getElementById("noclick").hidden = false;
        document.getElementById("noclick").style.animationPlayState = "running";
        document.getElementById("details").style.animationPlayState = "running";
        document.getElementById("close").addEventListener("click", close);
    }
    function tabCloak(cloak) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        switch (cloak) {
            case "none":
                localStorage.removeItem("cloak");
                document.title =  "Exploits - EXT-REMOVER";
                link.href = "assets/icon.png";
            case "empty":
                link.remove();
                document.title = "";
            default:
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