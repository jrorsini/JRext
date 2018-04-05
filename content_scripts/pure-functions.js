/**
 * @param {Object} word's object
 * @return {String} Marked up word
 */
const generateMarkup = word => {
	const part_of_speech = {
		����: 'noun',
		����: 'verb',
		�L��: 'symbol',
		����: 'adverb',
		����: 'particle',
		������: 'auxiliaryVerb',
		�ړ���: 'prefix',
		�ڑ���: 'conjuction',
		�`�e��: 'i-adjective',
		�A�̎�: 'abdominalAdj',
		������: 'interjection',
		�t�B���[: 'filler'
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
		.replace(/\�i/g, '\\�i')
		.replace(/\_/g, '\\_')
		.replace(/\�j/g, '\\�j')

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
