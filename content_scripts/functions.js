/**
 * @param {String} selected text
 * @return {String} marked up from kuromoji.
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
 * @param {Object} word's object
 * @return {String} Marked up word
 */
const generateMarkup = word => {
	const part_of_speech = {
		名詞: 'noun',
		動詞: 'verb',
		記号: 'symbol',
		副詞: 'adverb',
		助詞: 'particle',
		助動詞: 'auxiliaryVerb',
		接頭詞: 'prefix',
		接続詞: 'conjuction',
		形容詞: 'i-adjective',
		連体詞: 'abdominalAdj',
		感動詞: 'interjection',
		フィラー: 'filler'
	}
	return `<span class="jrpan-gloss-tag ${part_of_speech[word.pos]}-gloss">${
		word.surface_form
	}</span>`
}

/**
 * @param {String} text selected
 * @return {String} text with brackets escaped
 */
const escaped = text =>
	text
		.replace(/\(/g, '\\(')
		.replace(/\)/g, '\\)')
		.replace(/\（/g, '\\（')
		.replace(/\_/g, '\\_')
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

/**
 * @param {String} selected text to markup.
 * @return {String} marked up selection.
 */
const markedUp = selection => `<p class="jrpan-selection">${selection}</p>`
