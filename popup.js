'use strict'

let injected = false
const click = e => {
	if (!injected) {
		chrome.tabs.executeScript(null, {
			file: 'jrpan.js'
		})
		window.close()
	}
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('activationBtn').addEventListener('click', click)
})
