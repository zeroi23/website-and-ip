chrome.webRequest.onCompleted.addListener(function(detail) {
	// console.debug(detail);
	chrome.tabs.sendMessage(detail.tabId, detail);
	return;
}, {
	urls : []
});
