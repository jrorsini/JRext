$(document).ready(() => {
	var content;

	var getContent = setInterval(() => {
		if ($('.ii.gt')) {
			content = $('.ii.gt')
				.text()
				.trim();
			if (content.length > 0) {
				showContent();
				clearInterval(getContent);
			}
		}
	}, 1000);

	var showContent = function() {
		$('.ii.gt').text('Hello!');
	};
});

// if (document.querySelector('.ii') !== null) console.log('test');
