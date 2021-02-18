window.addEventListener('load', function() {

	const words = document.getElementsByClassName('new-word');
	const word = document.getElementById('word');
	const prefixDef = document.getElementById('prefix-def');
	const nounDefList = document.getElementById('noun-defs');
	const gallery = document.getElementById('gallery');
	const progress = document.getElementById('progress');
	const loading = document.getElementById('gallery-loading');

	const Gallery = {
		time: 3000,
		start: performance.now(),
		timing: true, // if true this counts down and updates the timiing
	};

	Gallery.loadNextWord = function() {
		progress.style.background = 'transparent';
		loading.style.display = 'block';
		fetch(`https://indexi.herokuapp.com/random_embed`)
			.then(response => { return response.json(); })
			.then(json => {
				Gallery.update(json);
			});
	};

	Gallery.update = function(data) {
		loading.style.display = 'none';
		const { noun, defs, prefix, prefix_def } = data;
		word.textContent = `${prefix}${noun}`;
		prefixDef.textContent = prefix_def;
		nounDefList.innerHTML = '';
		for (let i = 0; i < defs.length; i++) {
			const li = document.createElement('li');
			li.textContent = defs[i];
			nounDefList.appendChild(li);
		}
		Gallery.start = performance.now();
		Gallery.time = 3000 + defs.length * 200;
		GalleryColor.update();
	};

	var wordInterval = setInterval(function() {
		const color = document.getElementsByClassName('new-word')[0].style.color;
		if (Gallery.timing) {
			if (performance.now() > Gallery.start + Gallery.time) {
				// clearInterval(wordInterval);
				Gallery.loadNextWord(true);
			} else {
				const pct =  100 - (performance.now() - Gallery.start) / Gallery.time * 100;
				progress.style.background = `linear-gradient(90deg, ${color} ${pct - 2}%, transparent ${pct + 2}%`;
			}
		}
	}, 1000 / 60);

	Gallery.loadNextWord();
});