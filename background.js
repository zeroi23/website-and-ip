chrome.webRequest.onCompleted.addListener(function (detail) {
    // console.debug(detail);
    var tabId = detail.tabId;
    if (tabId != -1) {
        chrome.tabs.get(tabId, function (tab) {
            // console.debug(tab.status);
            if (tab.status == "loading") {
                //console.debug(tabId+" is loading");
                setTimeout(function () {
                    chrome.tabs.sendMessage(tabId, detail)
                }, 100);
            } else {
                chrome.tabs.sendMessage(tabId, detail)
            }
        })
    }
}, {
    urls: []
});
