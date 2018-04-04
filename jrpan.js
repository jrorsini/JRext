let selected_text
let wholeText
let jrpanActive = false

/**
 * @param {String} selected text
 * @return {String} marked up from kuromoji.
 */
const kuromojiMarkup = selection => {
	let path = tokenizer.tokenizeForSentence(selection)
	return path
		.map((e, i) => {
			return `<span>${e.surface_form}</span>`
		})
		.join('')
}

/**
 * @param {String} text selected
 * @return {String} text with brackets escaped
 */

const escapesBrackets = text =>
	text
		.replace(/\(/g, '\\(')
		.replace(/\)/g, '\\)')
		.replace(/\（/g, '\\（')
		.replace(/\）/g, '\\）')

/**
 * @return {String} text from cursor selection
 */
let getSelectionText = () => {
	var text = ''
	if (window.getSelection) {
		text = window.getSelection().toString()
	} else if (document.selection && document.selection.type != 'Control') {
		text = document.selection.createRange().text
	}
	return text
}

/**
 * @param {String} selected text to markup.
 * @return {String} marked up selection.
 */
const markup = selection => `<b class="jrpan-selection">${selection}</b>`

/**
 * @param {string} Word from which we get audio ID.
 * @promise Get word's sound's id.
 * @resolve {string} passed in word's sound's ID.
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
 * @param {string} word's audio's id.
 * @promise Get word's sound's source location.
 * @resolve {string} word's sound's source location.
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

/**
 * @param {object} fetched data from jisho's API.
 * @return {string} HTML text value.
 */
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

/**
 * @param {string} data is the HTML to insert
 * @function that inject HTML markup for the bottom right block
 */
const fillPopup = data => {
	const jrpanBlockElement = document.getElementById('jrpan-block')
	jrpanBlockElement.innerHTML = generateContentFromWord(data)
}

/**
 * @param {string} audio file source.
 * @function set the audio file source and plays it.
 */
const setAudio = src => {
	const audio = document.getElementById('jrpan-sound')
	audio.src = src
	audio.play()
}

createElement()
// addColorSelectionStyle()

document.addEventListener('mouseup', e => {
	const jrpan_slctd_el = document.getElementsByClassName('jrpan-selection')

	// Remove existing marked up words from jrpan.
	if (jrpan_slctd_el) {
		Object.values(jrpan_slctd_el).map((e, i) => {
			const el_parent = e.parentNode
			const re = new RegExp(escapesBrackets(markup(e.innerText)), 'g')
			if (el_parent) {
				el_parent.innerHTML = el_parent.innerHTML.replace(re, e.innerText)
			}
		})
	}

	selected_text = getSelectionText()

	if (selected_text !== '') {
		wholeText = e.target.innerHTML
		const re = new RegExp(escapesBrackets(selected_text), 'g')
		e.target.innerHTML = wholeText.replace(re, markup(selected_text))
		console.log(kuromojiMarkup(selected_text))
		getTranslation(selected_text).then(res => {
			fillPopup(res)
			soundTxt(selected_text).then(setAudio)
		})
	} else {
		Object.values(jrpan_slctd_el).map((e, i) => {
			e.innerHTML = e.innerHTML
		})
	}
})
