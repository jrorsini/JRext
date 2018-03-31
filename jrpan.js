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
				let data = JSON.parse(xhr.responseText)['data'][0]
				// console.log(data['japanese'][0]['word'])
				// console.log(data['japanese'][0]['reading'])
				// console.log(data['senses'][0]['english_definitions'])
				resolve(data)
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
}

const fillPopup = data => {
	document.getElementById('jrpan-block').innerHTML = ''
	document.getElementById('jrpan-block').innerHTML = `
	<div class="jrpan-popup">
		<small>${data['japanese'][0]['word']}</small>
		<p><b>${data['japanese'][0]['reading']}</b></p>
		<i>${data['senses'][0]['english_definitions'].join(', ')}</i>
	</div>
	<button class="jrpan-btn">JRpan it</button>
`
}

createElement()

document.addEventListener('mouseup', e => {
	selectedText = getSelectionText()
	if (document.getElementsByClassName('jrpan-selection').length) {
		Object.values(document.getElementsByClassName('jrpan-selection')).map(
			(e, i) => {
				e.parentNode.innerHTML = e.parentNode.innerText
			}
		)
	}
	if (selectedText !== '') {
		wholeText = e.target.innerText
		const re = new RegExp(selectedText, 'g')
		const selectionElement = `<b class="jrpan-selection" style="${txtStyle}">${selectedText}</b>`
		e.target.innerHTML = wholeText.replace(re, selectionElement)
		getTranslation(selectedText).then(res => {
			fillPopup(res)
		})
	} else {
		Object.values(document.getElementsByClassName('jrpan-selection')).map(
			(e, i) => {
				e.innerHTML = e.innerText
			}
		)
	}
})
