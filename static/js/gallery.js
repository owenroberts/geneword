window.addEventListener('load', function() {

	const words = document.getElementsByClassName('new-word');

	const gallery = document.getElementById('gallery');
	const progress = document.getElementById('progress');
	const loading = document.getElementById('gallery-loading');
	const storedNoun = localStorage.getItem('noun');
	const storedPrefix = localStorage.getItem('prefix');

	// recursively get text on screen to set timer length
	function getText(element) {
		if (element.textContent) 
			text += element.textContent;
		if (element.children) {
			for (let i = 0; i < element.children.length; i++) {
				getText(element.children[i]);
			}
		}
	}
	let text = '';
	getText(gallery);

	window.Gallery = {
		text: text,
		time: text.split(' ').length * 0.3 * 1000,
		start: performance.now(),
		timing: startSlideshow, // if true this counts down and updates the timiing
		offset: 0,
	};

	Gallery.loadNextWord = function(reload) {
		progress.style.background = 'transparent';
		loading.style.display = 'block';
		localStorage.setItem('prefix', prefix);
		localStorage.setItem('noun', noun);
		if (isEmbedded) {
			const url = `${location.origin}/embed`;
			window.open(url, '_self');
		} else {
			fetch('/random_gallery_word')
				.then(response => { return response.json(); })
				.then(json => {
					const url = `${location.origin}/gallery/word/${json[0]}/${json[1]}`;
					window.open(url, '_self');
				});
		}
	};

	var wordInterval = setInterval(function() {
		const color = document.getElementsByClassName('new-word')[0].style.color;
		if (Gallery.timing) {
			if (performance.now() > Gallery.start + Gallery.time) {
				clearInterval(wordInterval);
				Gallery.loadNextWord(true);
			} else {
				const pct =  100 - (performance.now() - Gallery.start) / Gallery.time * 100;
				progress.style.background = `linear-gradient(90deg, ${color} ${pct - 2}%, transparent ${pct + 2}%`;
			}
		}
	}, 1000 / 60);

});