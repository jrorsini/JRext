'use strict'

const click = e => {
	chrome.tabs.executeScript(null, {
		file: 'kuromoji.js'
	})
	chrome.tabs.executeScript(null, {
		file: 'jrpan.js'
	})
	chrome.tabs.insertCSS(null, {
		file: 'jrpan.css'
	})
	window.close()
}
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('activationBtn').addEventListener('click', click)
})
