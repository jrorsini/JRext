'use strict'

document.addEventListener('DOMContentLoaded', function() {
	const click = e => {
		if (!active) {
			chrome.tabs.executeScript(null, {
				code: 'var test'
			})
		}
		window.close()
	}

	document.getElementById('activationBtn').addEventListener('click', click)
})
