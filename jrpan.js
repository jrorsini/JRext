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
 = if Japanese dictionaries are loaded
 + Creates jrpan button 
 + adds event to the DOM
 */
kuromojiLoaded().then(msg => {
	createJrpanButton('jrpan-translator');
	document.addEventListener('mouseup', mouseUpEventHandler);
});

/**
	Don't knwo exactly what it does so comment pending
 */

const showWord = word => {
	console.log(word);
	// getTranslation(word).then(res => {
	// 	fillPopup(res);
	// 	soundTxt(word).then(setAudio);
	// });
};

const mouseUpEventHandler = event => {
	const selection = getSelectionText().trim(),
		jrpan_btn = document.getElementById('jrpan-translator'),
		inner_txt = event.target.innerText;
	setTimeout(() => {
		selection !== '' && isSelectable(selection)
			? jrpan_btn.classList.add('jrpan-translator--active')
			: jrpan_btn.classList.remove('jrpan-translator--active');
	}, 0);

	Object.values(document.getElementsByClassName('jrpan-gloss-tag')).map(
		tagEl => {
			tagEl.addEventListener('click', e => {
				showWord(e.target.innerHTML);
			});
		}
	);

	jrpan_btn.addEventListener('mouseup', () => {
		const re = new RegExp(escaped(selection), 'g');
		event.target.innerHTML = inner_txt.replace(
			re,
			markedUp(kuromojiMarkup(selection))
		);
	});

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

// createElement('jrpan-block');
// jrpanBlockElement.innerHTML = 'test';
