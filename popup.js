'use strict';

const click = e => {
	chrome.tabs.insertCSS(null, {
		file: 'jrpan.css'
	});
	window.close();
};
document.addEventListener('DOMContentLoaded', function() {
	// chrome.browserAction.setBadgeText({ text: 'ON' });
	// document.getElementById('activationBtn').addEventListener('click', click);
});
