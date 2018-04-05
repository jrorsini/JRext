/**
 * @param {String} selected text
 * @return {String} marked up from kuromoji.
 */
const kuromojiMarkup = selection => {
	let path = tokenizer.tokenizeForSentence(selection)
	console.log(path)
	path.map(e => {
		if (part_of_speech[e.pos] === undefined) {
			console.log(e.pos)
		}
	})
	return path
		.map((e, i) => {
			return `<span class="${part_of_speech[e.pos]}-gloss">${
				e.surface_form
			}</span>`
		})
		.join('')
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
 * @param {String} selected text to markup.
 * @return {String} marked up selection.
 */
const markedUp = selection => `<p class="jrpan-selection">${selection}</p>`