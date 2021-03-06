/*
|--------------------------------------------------------------------------
| Functions to get the sound of any word past in.
|--------------------------------------------------------------------------
|
*/

/**
 * @param {string} word
 * @promise Get word's sound's source location
 * @resolve {string} word's sound's source location
 */
const soundTxt = w =>
	new Promise((resolve, reject) => {
		japanesePostSoundText(w)
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
