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
	let text = '';
	if (window.getSelection) {
		text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != 'Control') {
		text = document.selection.createRange().text;
	}
	return text;
};

/**
 * @param {String} element's ID
 * @function add jrpan-block to document's body.
 */
const createJrpanButton = id => {
	const node = document.createElement('div');
	node.id = id;
	node.classList.add(id);
	node.innerHTML = 'JR';
	document.body.appendChild(node);
};

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
		.replace(/\_/g, '\\_');

/**
 * @param {String} selected text to markup.
 * @return {String} marked up selection.
 */
const markedUp = selection => `<div class="jrpan-selection">${selection}</div>`;

/**
 * @param {Object} word's object
 * @return {String} Marked up word
 */
const generateMarkup = word =>
	hasjapaneseCharacter(word.surface_form)
		? isKatakana(word.surface_form)
			? `<div class="jrpan-gloss-tag jrpan-gloss-tag--selectable katakana-gloss">${
					word.surface_form
			  }</div>`
			: `<div class="jrpan-gloss-tag jrpan-gloss-tag--selectable ${
					part_of_speech[word.pos]
			  }-gloss">${word.surface_form}</div>`
		: `<div class="jrpan-gloss-tag">${word.surface_form}</div>`;

/**
 * @param {String, String} Jrpan marked up element inner text, outer html
 * @return inner HTML without marked up jrpan Selection
 */
const removeMarkedUpText = (selected_markup, parent_inner_html) => {
	const re = new RegExp(markedUp(kuromojiMarkup(selected_markup)), 'g');
	return parent_inner_html.replace(re, selected_markup);
};

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
	selection.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) !== null;

/**
 * @param {String} word
 * @return {Boolean} if the word is only made out of Katakana.
 */
const isKatakana = word =>
	word.match(/[\u30A0-\u30FF]/g)
		? word.match(/[\u30A0-\u30FF]/g).length === word.length
		: false;

/**
 * @param {String} word
 * @return {Boolean} if the word is only made out of Katakana.
 */
const hasjapaneseCharacter = word =>
	word.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) ? true : false;
