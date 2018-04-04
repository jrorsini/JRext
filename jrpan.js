const createElement = () => {
	let node = document.createElement('div');
	node.id = 'jrpan-block';
	document.body.appendChild(node);
};

/**
 * @param {object} fetched data from jisho's API.
 * @return {string} HTML text value.
 */
const generateContentFromWord = data => {
	return `
		<div class="jrpan-popup">
			${
				data['japanese'][0]['word']
					? `<small>${data['japanese'][0]['word']}</small>`
					: ''
			}
			<p><b>${data['japanese'][0]['reading']}</b></p>
			<i>${data['senses'][0]['english_definitions'].join(', ')}</i>
			<audio controls id="jrpan-sound">
				<source src="" type="audio/mpeg">
			</audio>
		</div>
		<button class="jrpan-btn">JRpan it</button>
	`;
};

/**
 * @param {string} data is the HTML to insert
 * @function that inject HTML markup for the bottom right block
 */
const fillPopup = data => {
	const jrpanBlockElement = document.getElementById('jrpan-block');
	jrpanBlockElement.innerHTML = generateContentFromWord(data);
};

/**
 * @param {string} audio file source.
 * @function set the audio file source and plays it.
 */
const setAudio = src => {
	const audio = document.getElementById('jrpan-sound');
	audio.src = src;
	audio.play();
};

createElement();
// addColorSelectionStyle()

document.addEventListener('mouseup', e => {
	const jrpan_slctd_el = document.getElementsByClassName('jrpan-selection');

	// Remove existing marked up words from jrpan.
	if (jrpan_slctd_el) {
		Object.values(jrpan_slctd_el).map((e, i) => {
			const el_parent = e.parentNode;
			const re = new RegExp(escapesBrackets(markup(e.innerText)), 'g');
			if (el_parent) {
				el_parent.innerHTML = el_parent.innerHTML.replace(re, e.innerText);
			}
		});
	}

	selected_text = getSelectionText();

	if (selected_text !== '') {
		wholeText = e.target.innerHTML;
		const re = new RegExp(escapesBrackets(selected_text), 'g');
		e.target.innerHTML = wholeText.replace(re, markup(selected_text));
		console.log(kuromojiMarkup(selected_text));
		// getTranslation(selected_text).then(res => {
		// 	fillPopup(res);
		// 	soundTxt(selected_text).then(setAudio);
		// });
	} else {
		Object.values(jrpan_slctd_el).map((e, i) => {
			e.innerHTML = e.innerHTML;
		});
	}
});
