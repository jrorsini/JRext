let tokenizer = null

kuromoji
	.builder({ dicPath: chrome.extension.getURL('dict') })
	.build((err, _tokenizer) => {
		tokenizer = _tokenizer.tokenizeForSentence
		console.log(tokenizer)
	})