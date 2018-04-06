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
 * @function add jrpan-block to document's body.
 */
const createElement = () => {
	let node = document.createElement('div')
	node.id = 'jrpan-block'
	document.body.appendChild(node)
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
const isKatakana = word =>
	word.match(/[\u30A0-\u30FF]/g)
		? word.match(/[\u30A0-\u30FF]/g).length === word.length
		: false

/**
 * @param {String} word
 * @return {Boolean} if the word is only made out of Katakana.
 */
const hasjapaneseCharacter = word =>
	word.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) ? true : false

/**
 * @param {String} selected text to markup.
 * @return {String} marked up selection.
 */
const markedUp = selection => `<p class="jrpan-selection">${selection}</p>`

/**
 * @param {Object} word's object
 * @return {String} Marked up word
 */
const generateMarkup = word =>
	hasjapaneseCharacter(word.surface_form)
		? isKatakana(word.surface_form)
			? `<span class="jrpan-gloss-tag katakana-gloss">${
					word.surface_form
			  }</span>`
			: `<span class="jrpan-gloss-tag ${part_of_speech[word.pos]}-gloss">${
					word.surface_form
			  }</span>`
		: `<span>${word.surface_form}</span>`
