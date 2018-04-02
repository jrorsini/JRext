console.log(document.querySelector('#activationBtn'))
document.querySelector('#activationBtn').addEventListener('click', () => {
	chrome.runtime.sendMessage({ greeting: 'hello' }, function(response) {
		console.log(response.farewell)
	})
})

chrome.runtime.sendMessage({ greeting: 'hello' }, function(response) {
	console.log(response.farewell)
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(
		sender.tab
			? 'from a content script:' + sender.tab.url
			: 'from the extension'
	)
	if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' })
})
