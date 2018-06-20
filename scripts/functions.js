/**
 * @param {String} selected text
 * @return {String} marked up selected text from kuromoji's tokenizer.
 */
const kuromojiMarkup = selection => {
	let path = tokenizer.tokenizeForSentence(selection);
	console.log(path);
	path.map(e => {
		if (part_of_speech[e.pos] === undefined) {
			console.log(e.pos);
		}
	});
	return path.map(generateMarkup).join('');
};

/**
 * @function Toggles class name for jrpan popup when clicking on it.
 */
const toggleJrpanPopup = () => {
	const jrpanPopupElement = document.querySelector('.jrpan-popup');
	jrpanPopupElement.classList.value
		.split(/\s/g)
		.indexOf('jrpan-popup--hidden') !== -1
		? jrpanPopupElement.classList.remove('jrpan-popup--hidden')
		: jrpanPopupElement.classList.add('jrpan-popup--hidden');
};

/**
 * @param {string} data is the HTML to insert
 * @function that inject HTML markup for the bottom right block
 */
const fillPopup = data => {
	const jrpanBlockElement = document.getElementById('jrpan-block');
	jrpanBlockElement.innerHTML = generateContentFromWord(data);
	document
		.querySelector('.jrpan-btn')
		.addEventListener('click', toggleJrpanPopup);
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
