/**
 * @param {String} selected text
 * @return {String} marked up selected text from kuromoji's tokenizer.
 */
const kuromojiMarkup = selection => {
	let path = tokenizer.tokenizeForSentence(selection)
	path.map(e => {
		if (part_of_speech[e.pos] === undefined) {
			console.log(e.pos)
		}
	})
	return path.map(generateMarkup).join('')
}

/**
 * @param {string} data is the HTML to insert
 * @function that inject HTML markup for the bottom right block
 */
const fillPopup = data => {
	const jrpanBlockElement = document.getElementById('jrpan-block')
	jrpanBlockElement.innerHTML = generateContentFromWord(data)
	document.querySelector('.jrpan-btn').addEventListener('click', e => {
		console.log(document.querySelector('.jrpan-popup').classList)
		if (
			document
				.querySelector('.jrpan-popup')
				.classList.value.split(/\s/g)
				.indexOf('jrpan-popup--hidden')
		) {
			console.log('show it')
			document
				.querySelector('.jrpan-popup')
				.classList.remove('jrpan-popup--hidden')
		} else {
			console.log('hide it')
			document
				.querySelector('.jrpan-popup')
				.classList.add('jrpan-popup--hidden')
		}
	})
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
