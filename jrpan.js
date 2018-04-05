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

createElement()

kuromojiLoaded().then(msg => {
	console.log(msg)
	document.addEventListener('mouseup', e => {
		jrpan_selection = document.querySelector('.jrpan-selection')
		selected_text = getSelectionText()
		whole_text = e.target.innerHTML

		//Checks if there is already a text selected in the page
		if (jrpan_selection) {
			//if there is remove it
			const re = new RegExp(escaped(markedUp(jrpan_selection.innerText)), 'g')
			e.target.innerHTML = whole_text.replace(re, jrpan_selection.innerText)
		}

		if (selected_text !== '') {
			const re = new RegExp(escaped(selected_text), 'g')
			e.target.innerHTML = whole_text.replace(re, markedUp(selected_text))
		}
	})
})
