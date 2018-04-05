const createElement = () => {
	let node = document.createElement('div')
	node.id = 'jrpan-block'
	document.body.appendChild(node)
}

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
	`
}

/**
 * @param {string} data is the HTML to insert
 * @function that inject HTML markup for the bottom right block
 */
const fillPopup = data => {
	const jrpanBlockElement = document.getElementById('jrpan-block')
	jrpanBlockElement.innerHTML = generateContentFromWord(data)
}

/**
 * @param {string} audio file source.
 * @function set the audio file source and plays it.
 */
const setAudio = src => {
	const audio = document.getElementById('jrpan-sound')
	audio.src = src
	audio.play()
}
/**
 * @param {String, String} Jrpan marked up element inner text, outer html
 * @return inner HTML without marked up jrpan Selection
 */
const removeMarkedUpText = (jrpan_selection, inner_html) => {
	const re = new RegExp(markedUp(kuromojiMarkup(jrpan_selection)), 'g')
	return inner_html.replace(re, jrpan_selection)
}

createElement()

kuromojiLoaded().then(msg => {
	console.log(msg)
	document.addEventListener('mouseup', e => {
		jrpan_selection = document.querySelector('.jrpan-selection')
		selected_text = getSelectionText()
		whole_text = e.target.innerHTML
		if (selected_text.trim() !== '') {
			//Checks if there is already a text selected in the page
			if (jrpan_selection) {
				e.target.innerHTML = removeMarkedUpText(
					jrpan_selection.innerHTML,
					whole_text
				)
			}

			const re = new RegExp(escaped(selected_text), 'g')
			e.target.innerHTML = whole_text.replace(
				re,
				markedUp(kuromojiMarkup(selected_text))
			)
			document.getElementsByClassName('jrpan-gloss-tag').map(tagEl => {
				tagEl.addEventListener('click', e => {
					console.log(e.target)
				})
			})
		}
	})
})
