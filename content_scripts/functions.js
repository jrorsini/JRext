/**
 * @param {String} selected text
 * @return {String} marked up from kuromoji.
 */
const kuromojiMarkup = selection => {
	let path = tokenizer.tokenizeForSentence(selection);
	console.log(path);
	return path
		.map((e, i) => {
			return `<span>${e.surface_form}</span>`;
		})
		.join('');
};

/**
 * @param {String} text selected
 * @return {String} text with brackets escaped
 */

const escapesBrackets = text =>
	text
		.replace(/\(/g, '\\(')
		.replace(/\)/g, '\\)')
		.replace(/\（/g, '\\（')
		.replace(/\）/g, '\\）');

/**
 * @return {String} text from cursor selection
 */
let getSelectionText = () => {
	var text = '';
	if (window.getSelection) {
		text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != 'Control') {
		text = document.selection.createRange().text;
	}
	return text;
};

/**
 * @param {String} selected text to markup.
 * @return {String} marked up selection.
 */
const markup = selection => `<b class="jrpan-selection">${selection}</b>`;
