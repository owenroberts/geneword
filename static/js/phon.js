meSpeak.loadConfig("/static/js/synth/mespeak_config.json");
meSpeak.loadVoice("/static/js/synth/en.json");

var spoken;

function process(uipa) {
	// nothing to process      
	if (uipa == null || uipa.length == 0) {
		return;
	}

	//translate
	var mappings = [
		{ 'src': /^\s*\//g, 'dest': '' },
		{ 'src': /\/\s*$/g, 'dest': '' },

		{ 'src': /(\.)/g, 'dest': '%' },
		{ 'src': /(\u02c8)/g, 'dest': '\'' },
		{ 'src': /(\u02cc)/g, 'dest': ',' },
		{ 'src': /(\u0251)/g, 'dest': 'A:' },
		{ 'src': /(\u02d0)/g, 'dest': ':' },
		{ 'src': /(\u0251\u02d0)/g, 'dest': 'A' },
		{ 'src': /(\u0251\u0279)/g, 'dest': 'A' },
		{ 'src': /(a\u02d0)/g, 'dest': 'A' },

		// feedback from formantzero via r/linguistics
		{ 'src': /(\u0329)/g, 'dest': 'r' },  
		
		// feedback from scharfes_s via r/linguistics
		{ 'src': /(\u027e)/g, 'dest': 't' },  

		{ 'src': /(\xe6)/g, 'dest': 'a' },
		{ 'src': /(a)/g, 'dest': 'a' },
		{ 'src': /(\u028c)/g, 'dest': 'V' },
		{ 'src': /(\u0252)/g, 'dest': '0' },
		{ 'src': /(\u0254)/g, 'dest': '0' },
		{ 'src': /(a\u028a)/g, 'dest': 'aU' },
		{ 'src': /(\xe6\u0254)/g, 'dest': 'aU' },
		{ 'src': /(\u0259)/g, 'dest': '@' },
		{ 'src': /(\u025a)/g, 'dest': '3' },
		{ 'src': /(\u0259\u02d0)/g, 'dest': '3:' },
		{ 'src': /(a\u026a)/g, 'dest': 'aI' },
		{ 'src': /(\u028c\u026a)/g, 'dest': 'aI' },
		{ 'src': /(\u0251e)/g, 'dest': 'aI' },
		{ 'src': /(b)/g, 'dest': 'b' },
		{ 'src': /(t\u0283)/g, 'dest': 'tS' },
		{ 'src': /(\u02a7)/g, 'dest': 'tS' },
		{ 'src': /(d)/g, 'dest': 'd' },
		{ 'src': /(\xf0)/g, 'dest': 'D' },
		{ 'src': /(\u025b)/g, 'dest': 'E' },
		{ 'src': /(e)/g, 'dest': 'E' },
		{ 'src': /(\u025d)/g, 'dest': '3:' },
		{ 'src': /(\u025c\u02d0)/g, 'dest': '3:' },
		{ 'src': /(\u025b\u0259)/g, 'dest': 'e@' },
		{ 'src': /(e)/g, 'dest': 'E' },
		{ 'src': /(\u025d)/g, 'dest': '3:' },
		{ 'src': /(\u025c\u02d0)/g, 'dest': '3:' },
		{ 'src': /(e\u026a)/g, 'dest': 'eI' },
		{ 'src': /(\xe6\u026a)/g, 'dest': 'eI' },
		{ 'src': /(f)/g, 'dest': 'f' },
		{ 'src': /(\u0261)/g, 'dest': 'g' },
		{ 'src': /(g)/g, 'dest': 'g' },
		{ 'src': /(h)/g, 'dest': 'h' },
		{ 'src': /(\u026a)/g, 'dest': 'I' },
		{ 'src': /(\u0268)/g, 'dest': 'I' },
		{ 'src': /(\u026a\u0259)/g, 'dest': 'i@' },
		{ 'src': /(\u026a\u0279)/g, 'dest': 'i@' },
		{ 'src': /(\u026a\u0279\u0259)/g, 'dest': 'i@3' },
		{ 'src': /(i)/g, 'dest': 'i:' },
		{ 'src': /(i\u02d0)/g, 'dest': 'i:' },
		{ 'src': /(d\u0292)/g, 'dest': 'dZ' },
		{ 'src': /(\u02a4)/g, 'dest': 'dZ' },
		{ 'src': /(k)/g, 'dest': 'k' },
		{ 'src': /(x)/g, 'dest': 'x' },
		{ 'src': /(l)/g, 'dest': 'l' },
		{ 'src': /(d\u026b)/g, 'dest': 'l' }, 
		{ 'src': /(m)/g, 'dest': 'm' },
		{ 'src': /(n)/g, 'dest': 'n' },
		{ 'src': /(\u014b)/g, 'dest': 'N' },
		{ 'src': /(\u0259\u028a)/g, 'dest': 'oU' },
		{ 'src': /(o)/g, 'dest': 'oU' },
		{ 'src': /(o\u028a)/g, 'dest': 'oU' },
		{ 'src': /(\u0259\u0289)/g, 'dest': 'V' },
		{ 'src': /(\u0254\u026a)/g, 'dest': 'OI' },
		{ 'src': /(o\u026a)/g, 'dest': 'OI' },
		{ 'src': /(p)/g, 'dest': 'p' },
		{ 'src': /(\u0279)/g, 'dest': 'r' },
		{ 'src': /(s)/g, 'dest': 's' },
		{ 'src': /(\u0283)/g, 'dest': 'S' },
		{ 'src': /(t)/g, 'dest': 't' },
		{ 'src': /(\u027e)/g, 'dest': 't' },
		{ 'src': /(\u03b8)/g, 'dest': 'T' },
		{ 'src': /(\u028a\u0259)/g, 'dest': 'U@' },
		{ 'src': /(\u028a\u0279)/g, 'dest': 'U@' },
		{ 'src': /(\u028a)/g, 'dest': 'U' },
		{ 'src': /(\u0289\u02d0)/g, 'dest': 'u:' },
		{ 'src': /(u\u02d0)/g, 'dest': 'u:' },
		{ 'src': /(u)/g, 'dest': 'u:' },
		{ 'src': /(\u0254\u02d0)/g, 'dest': 'O:' },
		{ 'src': /(o\u02d0)/g, 'dest': 'O:' },
		{ 'src': /(v)/g, 'dest': 'v' },
		{ 'src': /(w)/g, 'dest': 'w' },
		{ 'src': /(\u028d)/g, 'dest': 'w' },
		{ 'src': /(j)/g, 'dest': 'j' },
		{ 'src': /(z)/g, 'dest': 'z' },
		{ 'src': /(\u0292)/g, 'dest': 'Z' },
		{ 'src': /(\u0294)/g, 'dest': '?' },

		// special edits
		{ 'src': /(k\'a2n)/g, 'dest': 'k\'@n' },
		{ 'src': /(ka2n)/g, 'dest': 'k@n' },
		{ 'src': /(gg)/g, 'dest': 'g' },
		{ 'src': /(@U)/g, 'dest': 'oU' },
		{ 'src': /rr$/g, 'dest': 'r' },
		{ 'src': /3r$/g, 'dest': '3:' },
		{ 'src': /([iU]|([AO]:))@r$/g, 'dest': '$1@' },
		{ 'src': /([^e])@r/g, 'dest': '$1:3' },
		{ 'src': /e@r$/g, 'dest': 'e@' },
		{ 'src': /e@r([bdDfghklmnNprsStTvwjzZ])/g, 'dest': 'e@$1' },

			// edits arising from testing
			{ 'src': /(\'k)+/g, 'dest': 'k\'' },  
			{ 'src': /(\??)+/g, 'dest': ':' },
			{ 'src': /(\:)+/g, 'dest': ':' },      
			{ 'src': /(???)/g, 'dest': 'I' },
			{ 'src': /(??)/g, 'dest': '3' },  
			{ 'src': /(??)/g, 'dest': 'O' },  

		// feedback from formantzero via r/linguistics
		{ 'src': /\u0361(.)/g, 'dest': '$1\'' },  
		{ 'src': /3$/g, 'dest': 'R' }
	];

	for (var i = 0; i < mappings.length; i++) {
		uipa = uipa.replace(mappings[i].src, mappings[i].dest);
		//console.log(mappings[i].src + uipa);
	}
	console.log(uipa);
	spoken = meSpeak.speak('[['+uipa+']]', { 'rawdata': 'mime', 'speed': 75, 'variant': "f3" });
	if (spoken == null) {
		alert("An error occurred: speaking failed.");
	}
	meSpeak.play(spoken);
}

const videoMap = {
	// https://www.seeingspeech.ac.uk/ipa-charts/
	// consonants (pulmonic) left to right, top to bottom
	'p': 'MRI_vl_bilabial_plosive',
	'b': 'MRI_vd_bilabial_plosive',
	't': 'MRI_vl_alveolar_plosive',
	'd': 'MRI_vd_alveolar_plosive',
	'??': 'MRI_vl_retroflex_plosive',
	'??': 'MRI_vd_retroflex_plosive',
	'c': 'MRI_vl_palatal_plosive',
	'??': 'MRI_vd_palatal_plosive',
	'k': 'MRI_vl_velar_plosive',
	'g': 'MRI_vd_velar_plosive',
	'q': 'MRI_vl_uvular_plosive',
	'??': 'MRI_vd_uvular_plosive',
	'??': 'MRI_vl_glottal_plosive',
	'm': 'MRI_vd_bilabial_nasal',
	'??': 'MRI_vd_labiodental_nasal',
	'n': 'MRI_vd_alveolar_nasal',
	'??': 'MRI_vd_retroflex_nasal',
	'??': 'MRI_vd_palatal_nasal',
	'??': 'MRI_vd_velar_nasal',
	'??': 'MRI_vd_uvular_nasal',
	'??': 'MRI_vd_bilabial_trill',
	'r': 'MRI_vd_alveolar_trill',
	'??': 'MRI_vd_uvular_trill',
	'???': 'MRI_vd_labiodental_flap',
	'??': 'MRI_vd_alveolar_tap',
	'??': 'MRI_vd_retroflex_flap',
	'??': 'MRI_vl_bilabial_fricative', 
	'??': 'MRI_vd_bilabial_fricative',
	'f': 'MRI_vl_labiodental_fricative',
	'v': 'MRI_vd_labiodental_fricative',
	'??': 'MRI_vl_dental_fricative',
	'??': 'MRI_vd_dental_fricative',	
	's': 'MRI_vl_alveolar_fricative',
	'z': 'MRI_vd_alveolar_fricative',
	'??': 'MRI_vl_postalveolar_fricative',
	'??': 'MRI_vd_postalveolar_fricative',	
	'??': 'MRI_vl_retroflex_fricative',
	'??': 'MRI_vd_retroflex_fricative',	
	'??': 'MRI_vl_palatal_fricative',
	'??': 'MRI_vd_palatal_fricative',	
	'x': 'MRI_vl_velar_fricative',
	'??': 'MRI_vd_velar_fricative',	
	'??': 'MRI_vl_uvular_fricative',
	'??': 'MRI_vd_uvular_fricative',	
	'??': 'MRI_vl_pharyngeal_fricative',
	'??': 'MRI_vd_pharyngeal_fricative',	
	'h': 'MRI_vl_glottal_fricative',
	'??': 'MRI_vd_glottal_fricative',
	'??': 'MRI_vl_alveolar-lateral_fricative',
	'??': 'MRI_vd_alveolar_approximant',
	'??': 'MRI_vd_labiodental_approximant',
	'??': 'MRI_vd_alveolar_approximant',
	'??': 'MRI_vd_retroflex_approximant',
	'j': 'MRI_vd_palatal_approximant',
	'??': '', // impossible
	'l': 'MRI_vd_alveolar-lateral_approximant',
	'??': 'MRI_vd_retroflex-lateral_approximant',
	'??': 'MRI_vd_palatal-lateral_approximant',
	'??': 'MRI_vd_velar_approximant',

	// Consonants (Non-Pulmonic)
	//  left to right, top to bottom

	'??': 'MRI_bilabial_click',
	'??': 'MRI_vd_bilabial_implosive',		 	 
	'??': 'MRI_dental_click',
	'??': 'MRI_vd_alveolar_implosive',
	'p??': 'MRI_vl_bilabial_ejective',	
	'??': 'MRI_postalveolar_click',
	'??': 'MRI_vd_palatal_implosive_non',
	't??': 'MRI_vl_alveolar_ejective',
	'??': 'MRI_palato-alveolar_click',
	'??': 'MRI_vd_velar_implosive',
	'k??': 'MRI_vl_velar_ejective',	
	'??': 'MRI_alveolar-lateral_click',
	'??': 'MRI_vd_uvular_implosive',
	's??': 'MRI_vl_alveolar_fricative_ejective',

	// Vowels
	'i': 'MRI_cardinal_1_vowel',
	'y': 'MRI_cardinal_9_vowel',
	'??': 'MRI6-58_03_cls_cnt_new',
	'??': 'MRI6-58_06_cls_cnt_rnd_new',
	'??': 'MRI_cardinal_16_vowel',
	'u': 'MRI_cardinal_8_vowel',
	'??': 'MRI_front_close_float_vowel',
	// '??': '', // wiki only? https://en.wikipedia.org/wiki/International_Phonetic_Alphabet_chart
	'??': 'MRI_close_back_float_vowel',
	'e': 'MRI_cardinal_2_vowel',
	'??': 'MRI_cardinal_10_vowel',
	// '??': '', wiki only
	// '??': '', wiki only
	'??': 'MRI_cardinal_15_vowel',
	'o': 'MRI_cardinal_7_vowel',
	// '????': '',
	'??': 'MRI_central_schwa_float_vowel',
	// 'o??': '',
	'??': 'MRI_cardinal_3_vowel',
	'??': 'MRI_cardinal_11_vowel',
	// '??': '',
	// '??': '',
	'??': 'MRI_cardinal_14_vowel',
	'??': 'MRI_cardinal_6_vowel',
	// '??': '',
	// '??': '',
	'a': 'MRI_cardinal_4_vowel',
	'??': 'MRI_cardinal_12_vowel',
	// '??': '',
	'??': 'MRI_cardinal_5_vowel',
	'??': 'MRI_cardinal_13_vowel'
};

const videoPlayer = document.getElementById('video');
videoPlayer.volume = 0;
let playPromise;
let playWaiting = false;

var words = document.getElementsByClassName("phon-word");
for (let i = 0; i < words.length; i++) {
	words[i].addEventListener("click", function() {
		process(this.dataset.word);
	});

	const color = `hsla(${ getRandomInt(120, 350) }, ${getRandomInt(50, 90)}%, ${getRandomInt(50, 70)}%, 1)`;
	words[i].style.color = color;

	/* hover over letters to see them */
	const label = document.getElementById('character-label');
	const letters = words[i].children; 
	for (let j = 0; j < letters.length; j++) {
		letters[j].addEventListener('mouseover', ev => {
			const letter = letters[j].dataset.letter;
			const src = `/static/seeing_videos/${videoMap[letter]}.mp4`;
			if (videoMap[letter] && src != videoPlayer.src.split('/').pop()) {
				if (!playWaiting) {
					label.textContent = letter;
					label.style.color = color;
					videoPlayer.src = src;
					playWaiting = true;
					playPromise = videoPlayer.play();
					playPromise.then(() => {
						playWaiting = false;
					});
				} 
				
			}
		});
	}
}

var playButtons = document.getElementsByClassName('play');
for (let i = 0; i < playButtons.length; i++) {
	playButtons[i].addEventListener("click", function() {
		var sentence = this.parentNode.dataset.sentence;
		process(sentence);
	});
}

