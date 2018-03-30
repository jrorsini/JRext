const kuromojiLoaded = () =>
	new Promise((resolve, reject) => {
		kuromoji.builder({ dicPath: './dict' }).build((error, _tokenizer) => {
			if (error != null) console.log(error)
			resolve(_tokenizer)
		})
	})

let selectedText
let wholeText
getSelectionText = () => {
	var text = ''
	if (window.getSelection) {
		text = window.getSelection().toString()
	} else if (document.selection && document.selection.type != 'Control') {
		text = document.selection.createRange().text
	}
	return text
}

kuromojiLoaded().then(res => {
	document.addEventListener('mouseup', e => {
		selectedText = getSelectionText()

		Object.values(document.getElementsByClassName('jrpan-selection')).map(
			(e, i) => {
				e.parentNode.innerHTML = e.parentNode.innerText
			}
		)
		if (selectedText !== '') {
			wholeText = e.target.innerText
			var re = new RegExp(selectedText, 'g')
			e.target.innerHTML = wholeText.replace(
				re,
				`<b class="jrpan-selection" style="color: red; position: relative">${selectedText}</b>`
			)
		} else {
			Object.values(document.getElementsByClassName('jrpan-selection')).map(
				(e, i) => {
					e.innerHTML = e.innerText
				}
			)
		}
	})
})
