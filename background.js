'use strict'

// chrome.runtime.onInstalled.addListener(function() {
// 	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
// 		chrome.declarativeContent.onPageChanged.addRules([
// 			{
// 				conditions: [
// 					new chrome.declarativeContent.PageStateMatcher({
// 						pageUrl: { hostEquals: 'www.chatwork.com' }
// 					}),
// 					new chrome.declarativeContent.PageStateMatcher({
// 						pageUrl: { hostEquals: 'mail.google.com' }
// 					})
// 				],
// 				actions: [new chrome.declarativeContent.ShowPageAction()]
// 			}
// 		]);
// 	});
// });

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	// No tabs or host permissions needed!
	console.log('Turning ' + tab.url + ' red!')
	chrome.tabs.executeScript({
		code: 'document.body.style.backgroundColor="red"'
	})
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(
		sender.tab
			? 'from a content script:' + sender.tab.url
			: 'from the extension'
	)
	if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' })
})
