/*
|--------------------------------------------------------------------------
| Functions that interact with the DOM.
|--------------------------------------------------------------------------
|
*/

/**
 * @return {String} text from cursor selection
 */
let getSelectionText = () => {
	let text = ''
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
	const node = document.createElement('div')
	node.id = 'jrpan-block'
	document.body.appendChild(node)
}

/*
|--------------------------------------------------------------------------
| Functions that deal with text or DOM fomatting.
|--------------------------------------------------------------------------
|
*/

/**
 * @param {String} text selected
 * @return {String} text with brackets escaped
 */
const escaped = text =>
	text
		.replace(/\(/g, '\\(')
		.replace(/\)/g, '\\)')
		.replace(/\）/g, '\\）')
		.replace(/\（/g, '\\（')
		.replace(/\_/g, '\\_')

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

/**
 * @param {String, String} Jrpan marked up element inner text, outer html
 * @return inner HTML without marked up jrpan Selection
 */
const removeMarkedUpText = (selected_markup, parent_inner_html) => {
	const re = new RegExp(markedUp(kuromojiMarkup(selected_markup)), 'g')
	return parent_inner_html.replace(re, selected_markup)
}

/*
|--------------------------------------------------------------------------
| Functions that check input type.
|--------------------------------------------------------------------------
|
*/

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
