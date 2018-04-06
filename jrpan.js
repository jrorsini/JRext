// https://gist.github.com/ryanmcgrath/982242

/**
 * - TODO
 * x japanesePod101 font-size and line-height to fix.
 * x sort out code (re-usable vs not re-usable)
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
					`
				})
				.join('')}
			<ul/>
		</div>
		<button class="jrpan-btn">JRpan it</button>
	`
}

/**
 * @param {String, String} Jrpan marked up element inner text, outer html
 * @return inner HTML without marked up jrpan Selection
 */
const removeMarkedUpText = (jrpan_selection, inner_html) => {
	const re = new RegExp(markedUp(kuromojiMarkup(jrpan_selection)), 'g')
	return inner_html.replace(re, jrpan_selection)
}

/**
 * @param {String} word to display
 * @function Combine promises and functions interacting with the DOM in order to
 */

const showWord = word => {
	getTranslation(word).then(res => {
		fillPopup(res)
		soundTxt(word).then(setAudio)
	})
}

createElement()

kuromojiLoaded().then(msg => {
	console.log(msg)
	document.addEventListener('mouseup', e => {
		jrpan_selection = document.querySelector('.jrpan-selection')
		selected_text = getSelectionText()
		whole_text = e.target.innerHTML
		if (isSelectable(selected_text)) {
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
			Object.values(document.getElementsByClassName('jrpan-gloss-tag')).map(
				tagEl => {
					tagEl.addEventListener('click', e => {
						showWord(e.target.innerHTML)
					})
				}
			)
		}
	})
})
