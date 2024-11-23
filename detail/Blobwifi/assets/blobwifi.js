//  This script has been modified from the original by Ashton Davies for integration and clarity.

function gen() {
    try {
        var networks = document.getElementById("blobwifi-networks").value;
        networks = networks.replace(/(?<=[+-]..){/g, "");
        networks = networks.replace(/(?<=})[^{\]}]*(?={.."C)/g, ",");
        networks = networks.substring(networks.indexOf("{"));
        networks = networks.substring(0, networks.lastIndexOf("}") + 1);
        networks = JSON.parse("[" + networks + "]");
        var onc = {
            Type: "UnencryptedConfiguration",
            NetworkConfigurations: [],
        };
        networks.forEach(function (network) {
            if (!network.WiFi || !network.Connectable) return;
            onc.NetworkConfigurations.push({
                GUID: network.GUID,
                Metered: true,
                Name: network.Name,
                Type: "WiFi",
                WiFi: {
                    AutoConnect: true,
                    SSID: network.Name,
                    Security: "None",
                },
                NameServersConfigType: "Static",
                StaticIPConfig: {
                    NameServers: ["8.8.8.8", "8.8.4.4", "8.8.8.8", "8.8.4.4"],
                },
                ProxySettings: {
                    Type: "Direct",
                },
            });
        });

        if (!onc.NetworkConfigurations[0]) return;
        var link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([JSON.stringify(onc)]));
        link.download = "blobwifi.onc";
        link.click();
        link.remove();
    } catch (error) {
        console.error(error);
        alert("An error occurred, check console logs");
    }
}

function generateONC() {
    try {
        var networks = document.getElementById("caub-networks").value;
        networks = networks.replace(/(?<=[+-]..){/g, "");
        networks = networks.replace(/(?<=})[^{\]}]*(?={.."C)/g, ",");
        networks = networks.substring(networks.indexOf("{"));
        networks = networks.substring(0, networks.lastIndexOf("}") + 1);
        networks = JSON.parse("[" + networks + "]");
        var onc = {
            Type: "UnencryptedConfiguration",
            NetworkConfigurations: [],
        };
        networks.forEach(function (network) {
            if (!network.WiFi || !network.Connectable) return;
            onc.NetworkConfigurations.push({
                GUID: network.GUID,
                Metered: true,
                Name: network.Name,
                Type: "WiFi",
                WiFi: {
                    AutoConnect: true,
                    SSID: network.Name,
                    Security: "None",
                },
            });
        });
        if (!onc.NetworkConfigurations[0]) return;
        var link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([JSON.stringify(onc)]));
        link.download = "caub.onc";
        link.click();
        link.remove();
    } catch (error) {
        console.error(error);
        alert("Error: Failed to generate ONC file.");
    }
}
