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
 * @param {String} selected text to markup.
 * @return {String} marked up selection.
 */
const markedUp = selection => `<p class="jrpan-selection">${selection}</p>`

/**
 * @param {String} Selection.
 * @return {Boolean} contains any Japanese character.
 */

const isSelectable = selection =>
	selection.trim() !== '' &&
	selection.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) !== null

/**
 * @param {String} word
 * @return {Boolean} if the word is only made out of Katakana.
 */

const isKatakana = word => {
	word.match(/[\u30A0-\u30FF]/g)
		? word.match(/[\u30A0-\u30FF]/g).length === word.length
		: false
}
