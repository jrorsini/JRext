let txtStyle = `
	background: -webkit-linear-gradient(#f30065, #ff7e8a);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent; 
	position: relative;
	`
let selected_text
let wholeText
let jrpanActive = false

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

console.log(kuromoji)

// kuromoji.builder({ dicPath: './dict/' }).build(function(err, tokenizer) {
// 	var path = tokenizer.tokenize('すもももももももものうち')
// 	console.log(path)
// })

/**
 * @param {string} Word from which we get audio ID
 * @promise Get word's sound's id.
 * @resolve {string} passed in word's sound's ID
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
 * @param {string} word's audio's id
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
 * @param {string} audio file source.
 * @function set the audio file source and plays it.
 */
const setAudio = src => {
	const audio = document.getElementById('jrpan-sound')
	audio.src = src
	audio.play()
}

const fillPopup = data => {
	const jrpanBlockElement = document.getElementById('jrpan-block')
	jrpanBlockElement.innerHTML = generateContentFromWord(data)
}

createElement()

document.addEventListener('mouseup', e => {
	const jrpan_selected_element = document.getElementsByClassName(
		'jrpan-selection'
	)

	if (jrpan_selected_element.length) {
		Object.values(jrpan_selected_element).map((e, i) => {
			e.parentNode.innerHTML = e.parentNode.innerText
		})
	}

	selected_text = getSelectionText()

	if (selected_text !== '') {
		wholeText = e.target.innerHTML
		const re = new RegExp(selected_text, 'g')
		const selection_element_html = `<b class="jrpan-selection" style="${txtStyle}">${selected_text}</b>`
		e.target.innerHTML = wholeText.replace(re, selection_element_html)
		getTranslation(selected_text).then(res => {
			fillPopup(res)
			soundTxt(selected_text).then(setAudio)
		})
	} else {
		Object.values(jrpan_selected_element).map((e, i) => {
			e.innerHTML = e.innerHTML
		})
	}
})
