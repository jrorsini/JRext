/**
 * @param {string} word's audio's id.
 * @promise Get word's sound's source location.
 * @resolve {string} word's sound's source location.
 */
const getSoundTxt = id =>
	new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest()
		xhr.open('GET', `https://api.soundoftext.com/sounds/${id}`, true)
		xhr.onload = () => {
			resolve(JSON.parse(xhr.response).location)
		}
		xhr.send()
	})

/**
 * @param {string} Word from which we get audio ID.
 * @promise Get word's sound's id.
 * @resolve {string} passed in word's sound's ID.
 */
const japanesePostSoundText = txt =>
	new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('POST', 'https://api.soundoftext.com/sounds', true)
		xhr.setRequestHeader('Content-type', 'application/json')
		xhr.onreadystatechange = () => {
			if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
				resolve(JSON.parse(xhr.response).id)
			}
		}
		xhr.send(
			JSON.stringify({
				engine: 'Google',
				data: {
					text: txt,
					voice: 'ja-JP'
				}
			})
		)
	})
