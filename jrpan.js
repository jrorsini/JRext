// https://gist.github.com/ryanmcgrath/982242

/**
 * - TODO
 * x can't seem to select 譌･譛ｬ隱� it only selects 譌･譛ｬ (handling suffixes)
 * x japanesePod101 font-size and line-height to fix.
 * x sort out code (re-usable vs not re-usable)
 * x Add Manual
 * x -Te form of a verb
 * x Set up mocha tests.
 */

/**
 * - DONE
 * o| close popup definition
 * o| side out words that don't contain kanjis or hiragana.
 * o| Check if word is only made of romaji.
 * o| Check if word is only made of numbers.
 * o| pure-function.js
 * o| checks if selection contains japanese characters.
 * o| bold katakana words
 * o| checks if word is katakana
 * o| show every examples.
 */

/**
 * @param {object} fetched data from jisho's API.
 * @return {string} HTML text value.
 */
const generateContentFromWord = data => {
	return `
		<div class="jrpan-popup">
			<audio controls id="jrpan-sound">
				<source src="" type="audio/mpeg">
			</audio>
			${
				data['japanese'][0]['word']
					? `<small>${data['japanese'][0]['word']}</small>`
					: ''
			}
			<p><b>${data['japanese'][0]['reading']}</b></p>
			<ul class="jrpan-words-definition">
			${data['senses']
				.map(e => {
					return `
						<li>
							${
								e['parts_of_speech'] && e['parts_of_speech'].length > 0
									? `
									<small><u><i>
										${e['parts_of_speech'].map(e => e).join(', ')}
									</i></u></small><br/>
									`
									: ``
							}
							${e['english_definitions'].join(', ')}
						</li>
					`;
				})
				.join('')}
			<ul/>
		</div>
		<button class="jrpan-btn">JRpan it</button>
	`;
};

/**
 * @param {String} word to display
 * @function Combine promises and functions interacting with the DOM in order to
 */

const showWord = word => {
	getTranslation(word).then(res => {
		fillPopup(res);
		soundTxt(word).then(setAudio);
	});
};

const mouseUpEventHandler = event => {
	const selected_text = getSelectionText();
	if (selected_text) console.log(selected_text);
	// const jrpan_selection = document.querySelector('.jrpan-selection');
	// const selected_text = getSelectionText();
	// const whole_text = event.target.innerHTML;
	// if (isSelectable(selected_text)) {
	// 	//Checks if there is already a text selected in the page
	// 	if (jrpan_selection) {
	// 		event.target.innerHTML = removeMarkedUpText(
	// 			jrpan_selection.innerHTML,
	// 			whole_text
	// 		);
	// 	}

	// 	const re = new RegExp(escaped(selected_text), 'g');
	// 	event.target.innerHTML = whole_text.replace(
	// 		re,
	// 		markedUp(kuromojiMarkup(selected_text))
	// 	);
	// 	Object.values(document.getElementsByClassName('jrpan-gloss-tag')).map(
	// 		tagEl => {
	// 			tagEl.addEventListener('click', e => {
	// 				showWord(event.target.innerHTML);
	// 			});
	// 		}
	// 	);
	// }
};

createElement('jrpan-block');

kuromojiLoaded().then(msg => {
	document.addEventListener('mouseup', mouseUpEventHandler);
});
