let txtStyle = `
	background: -webkit-linear-gradient(#f30065, #ff7e8a);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent; 
	position: relative;
	`
let selectedText
let wholeText

let getSelectionText = () => {
	var text = ''
	if (window.getSelection) {
		text = window.getSelection().toString()
	} else if (document.selection && document.selection.type != 'Control') {
		text = document.selection.createRange().text
	}
	return text
}

const getTranslation = word =>
	new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('GET', `https://jisho.org/api/v1/search/words?keyword=${word}/`)
		xhr.setRequestHeader('Accept', 'application/json')
		xhr.send()
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				console.log(xhr.responseText)
				resolve(xhr.responseText)
			} else if (xhr.status !== 200) {
				console.log(xhr.responseText)
				resolve(xhr.responseText)
			}
		}
	})

const createElement = () => {
	let node = document.createElement('div')
	node.id = 'jrpan-block'
	document.body.appendChild(node)
	document.getElementById('jrpan-block').innerHTML =
		'<button class="jrpan-btn">JRpan it</button>'
}

createElement()

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
		getTranslation(selectedText).then(res => {})
	} else {
		Object.values(document.getElementsByClassName('jrpan-selection')).map(
			(e, i) => {
				e.innerHTML = e.innerText
			}
		)
	}
})
