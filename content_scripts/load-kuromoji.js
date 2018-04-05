let tokenizer = null
const kuromojiLoaded = () =>
	new Promise((resolve, reject) => {
		kuromoji
			.builder({ dicPath: chrome.extension.getURL('dict') })
			.build((err, _tokenizer) => {
				tokenizer = _tokenizer
				resolve('loaded')
			})
	})
