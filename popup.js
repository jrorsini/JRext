'use strict'

let injected = false
const click = e => {
	if (injected === false) {
		chrome.tabs.executeScript(null, {
			file: 'jrpan.js'
		})
		window.close()
		injected = true
	}
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('activationBtn').addEventListener('click', click)
})
