let txtStyle = `
	background: -webkit-linear-gradient(#f30065, #ff7e8a);;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent; 
	position: relative;
	`
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
			`<b class="jrpan-selection" style="${txtStyle}">${selectedText}</b>`
		)
	} else {
		Object.values(document.getElementsByClassName('jrpan-selection')).map(
			(e, i) => {
				e.innerHTML = e.innerText
			}
		)
	}
})
