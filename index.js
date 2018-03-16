document.addEventListener('DOMContentLoaded', () => {
	var script = 'document.body.style.backgroundColor="red";';
	chrome.tabs.executeScript({
		code: script
	});
});
