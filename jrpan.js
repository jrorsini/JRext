$(document).ready(() => {
	alert('jrpan');

	var content;

	var getContent = setInterval(() => {
		if ($('.ii.gt')) {
			content = $('.ii.gt')
				.text()
				.trim();
			alert(content.length);
			if (content.length > 0) {
				showContent();
				clearInterval(getContent);
			}
		}
	}, 1000);

	var showContent = function() {
		alert(content);
	};
});

// if (document.querySelector('.ii') !== null) console.log('test');
