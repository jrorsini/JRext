/**
 * @param {string} Word from which we get audio ID.
 * @promise Get word's sound's id.
 * @resolve {string} passed in word's sound's ID.
 */
const postSoundText = txt =>
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
 * @param {string} word
 * @promise Get word's sound's source location
 * @resolve {string} word's sound's source location
 */
const soundTxt = w =>
	new Promise((resolve, reject) => {
		postSoundText(w)
			.then(id => getSoundTxt(id).then(location => resolve(location)))
			.catch(err => console.log(err))
	})

/**
 * @param {string} word
 * @promise Get translation information from word.
 * @resolve {object} data from word passed in param.
 * @reject {object} in case of failure reaching out to the API
 */
const getTranslation = word =>
	new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('GET', `https://jisho.org/api/v1/search/words?keyword=${word}/`)
		xhr.setRequestHeader('Accept', 'application/json')
		xhr.send()
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				const dataTemp = JSON.parse(xhr.responseText)['data'].filter(
					e => e['is_common']
				)
				const res = JSON.parse(xhr.responseText)['data']
					? JSON.parse(xhr.responseText)['data'][0]
					: 'nothing found'
				console.log(res)
				resolve(res)
			} else if (xhr.status !== 200) {
				reject(xhr.responseText)
			}
		}
	})
