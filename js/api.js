let API = {
    _APIBaseUrl: "https://admin.priceblox.com/",
    copyTrackerData: function(trackerData)
    {
        let cleanTrackerData = JSON.parse(JSON.stringify(trackerData));
        cleanTrackerData[Object.keys(cleanTrackerData)[0]].history = null;

        return cleanTrackerData;
    },
    upsertTrackerData: function(username, uid, trackerData)
    {
        if (typeof Settings.settings["share-data"] !== "undefined" && Settings.settings["share-data"] === false)
        {
            if (__DEBUG)
            {
                console.log("No consent");
            }

            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }

        return fetch(this._APIBaseUrl + "api/tracker/", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                uid: uid,
                version: version,
                navigator_language: navigator.language,
                time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                user_agent: navigator.userAgent,
                data: this.copyTrackerData(trackerData)
            })
        })
        .then(response => response.json())
        .catch((error) => {
            if (__DEBUG)
            {
                console.log("Fetch error in API.upsertTrackerData: ", error);
            }

            return null;
        });
    },
    updateTracker: function(uid, trackerId, updatedTrackerValues)
    {
        if (typeof Settings.settings["share-data"] !== "undefined" && Settings.settings["share-data"] === false)
        {
            if (__DEBUG)
            {
                console.log("No consent");
            }

            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }

        return fetch(this._APIBaseUrl + "api/tracker/?uid=" + uid + "&id=" + trackerId, {
            method: "PATCH",
            body: JSON.stringify(updatedTrackerValues),
        })
        .then(response => response.json())
        .catch((error) => {
            if (_DEBUG)
            {
                console.log("Fetch error in API.updateTracker: ", error);
            }

            return null;
        });
    },
    deleteTracker: function(uid, trackerId)
    {
        if (typeof Settings.settings["share-data"] !== "undefined" && Settings.settings["share-data"] === false)
        {
            if (__DEBUG)
            {
                console.log("No consent");
            }

            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }

        return fetch(this._APIBaseUrl + "api/tracker/?uid=" + uid + "&id=" + trackerId, {
            method: "DELETE"
        })
        .then(response => response.json())
        .catch((error) => {
            if (__DEBUG)
            {
                console.log("Fetch error in API.updateUrl:", error);
            }

            return null;
        });
    },
    getSelectorPresets: function(url)
    {
        return fetch(this._APIBaseUrl + "api/selectors/?url=" + encodeURIComponent(url) + "&uid=" + uid + "&v=" + version, {
            method: "GET"
        })
        .then(response => response.json())
        .catch((error) => {
            if (__DEBUG)
            {
                console.log("Fetch error in API.getSelectorPresets:", error);
            }

            return null;
        });
    },
    getDomain: function(url)
    {
        return fetch(this._APIBaseUrl + "api/domain/?url=" + encodeURIComponent(url) + "&uid=" + uid + "&v=" + version, {
            method: "GET"
        })
        .then(response => response.json())
        .catch((error) => {
            if (__DEBUG)
            {
                console.log("Fetch error in API.getDomain:", error);
            }

            return null;
        });
    },
    getNotifications: function()
    {
        return fetch(this._APIBaseUrl + "api/notifications/?uid=" + uid + "&v=" + version, {
            method: "GET"
        })
        .then(response => response.json())
        .catch((error) => {
            if (__DEBUG)
            {
                console.log("Fetch error in API.getNotifications:", error);
            }

            return null;
        });
    }
};