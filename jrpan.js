let txtStyle = `
	background: -webkit-linear-gradient(#f30065, #ff7e8a);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent; 
	position: relative;
	`
let selectedText
let wholeText

let getSelectionText = () => {
	var text = ''
	if (window.getSelection) {
		text = window.getSelection().toString()
	} else if (document.selection && document.selection.type != 'Control') {
		text = document.selection.createRange().text
	}
	return text
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(
		sender.tab
			? 'from a content script:' + sender.tab.url
			: 'from the extension'
	)
	if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' })
})

/**
 * @param {string} Word to get the sound of
 * @promise Get word's sound's id.
 * @resolve {string} word's sound's ID
 */
const postSoundText = txt =>
	new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('POST', 'https://api.soundoftext.com/sounds', true)
		xhr.setRequestHeader('Content-type', 'application/json')
		xhr.onreadystatechange = function() {
			if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
				resolve(JSON.parse(xhr.response).id)
			}
		}
		xhr.send(
			JSON.stringify({
				engine: 'Google',
				data: {
					text: txt,
					voice: 'ja-JP'
				}
			})
		)
	})

/**
 * @param {string} id
 * @promise Get word's sound's source location
 * @resolve {string} word's sound's source location
 */
const getSoundTxt = id =>
	new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest()
		xhr.open('GET', `https://api.soundoftext.com/sounds/${id}`, true)

		xhr.onload = function() {
			resolve(JSON.parse(xhr.response).location)
		}

		xhr.send()
	})

/**
 * @param {string} word
 * @promise Get word's sound's source location
 * @resolve {string} word's sound's source location
 */
const soundTxt = w =>
	new Promise((resolve, reject) => {
		postSoundText(w)
			.then(id => getSoundTxt(id).then(location => resolve(location)))
			.catch(err => console.log(err))
	})

/**
 * @param {string} word
 * @promise Get translation information from word.
 * @resolve {object} data from word passed in param.
 * @reject {object} in case of failure reaching out to the API
 */
const getTranslation = word =>
	new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('GET', `https://jisho.org/api/v1/search/words?keyword=${word}/`)
		xhr.setRequestHeader('Accept', 'application/json')
		xhr.send()
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				let data = JSON.parse(xhr.responseText)['data'][0]
				// console.log(data['japanese'][0]['word'])
				// console.log(data['japanese'][0]['reading'])
				// console.log(data['senses'][0]['english_definitions'])
				resolve(data)
			} else if (xhr.status !== 200) {
				console.log(xhr.responseText)
				reject(xhr.responseText)
			}
		}
	})

const createElement = () => {
	let node = document.createElement('div')
	node.id = 'jrpan-block'
	document.body.appendChild(node)
}
const generateContentFromWord = data => {
	return `
		<div class="jrpan-popup">
			${
				data['japanese'][0]['word']
					? `<small>${data['japanese'][0]['word']}</small>`
					: ''
			}
			<p><b>${data['japanese'][0]['reading']}</b></p>
			<i>${data['senses'][0]['english_definitions'].join(', ')}</i>
			<audio controls id="jrpan-sound">
				<source src="" type="audio/mpeg">
			</audio>
		</div>
		<button class="jrpan-btn">JRpan it</button>
	`
}

const fillPopup = data => {
	const jrpanBlockElement = document.getElementById('jrpan-block')
	jrpanBlockElement.innerHTML = generateContentFromWord(data)
}

createElement()

document.addEventListener('mouseup', e => {
	const jrpanSelectionElements = document.getElementsByClassName(
		'jrpan-selection'
	)

	selectedText = getSelectionText()

	if (jrpanSelectionElements.length) {
		Object.values(jrpanSelectionElements).map((e, i) => {
			e.parentNode.innerHTML = e.parentNode.innerText
		})
	}

	if (selectedText !== '') {
		wholeText = e.target.innerText
		const re = new RegExp(selectedText, 'g')
		const selectionElement = `<b class="jrpan-selection" style="${txtStyle}">${selectedText}</b>`
		e.target.innerHTML = wholeText.replace(re, selectionElement)
		getTranslation(selectedText).then(res => {
			fillPopup(res)
			soundTxt(selectedText).then(res => {
				document.getElementById('jrpan-sound').src = res
				document.getElementById('jrpan-sound').play()
			})
		})
	} else {
		Object.values(jrpanSelectionElements).map((e, i) => {
			e.innerHTML = e.innerText
		})
	}
})
