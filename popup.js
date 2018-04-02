'use strict'

function click(e) {
	chrome.tabs.executeScript(null, {
		file: 'jrpan.js'
	})
	window.close()
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('activationBtn').addEventListener('click', click)
})
