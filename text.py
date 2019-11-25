import random
import nltk
import re
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
from nltk.tokenize import word_tokenize
from markov import MarkovGenerator

import sys  
reload(sys)  
sys.setdefaultencoding('utf8')

def load_text_from_file(title):
	return open("input/"+title+".txt").read()

def generate_text(text):
	prefix_file = open("input/pref.txt")
	prefixes = prefix_file.readlines()
	lines = text.splitlines()
	noun_types = ["NN", "NNS"]
	punc = [".",",",";","?","-",]
	bad_words = ['thee', 'hath']
	new_text = []
	for line in lines:
		sents = nltk.sent_tokenize( line )
		new_graf = ""
		for sent in sents:
			tokens = nltk.word_tokenize(sent)
			tagged = nltk.pos_tag(tokens)
			new_sent = sent
			for idx, tag in enumerate(tagged):
				if any(tag[1] in n for n in noun_types) and any(tag[0] not in b for b in bad_words):
					pref = random.choice(prefixes).rstrip().lower()
					new_word = pref + tag[0]
					new_sent = re.sub(r'(?<![>/])\b'+tag[0], '<a class="new-word" href="/new/'+tag[0]+'/'+pref+'">' + new_word + '</a>', new_sent)
			new_graf += new_sent + " "
		new_text.append( new_graf )
	
	generator = MarkovGenerator(n=2, max=2000)
	for line in new_text:
		generator.feed( line )
	gen_poem = generator.generate()
	while len( gen_poem ) < 100:
		gen_poem = generator.generate()
	
	poem_sents = nltk.sent_tokenize( gen_poem )

	if len(poem_sents) > 0:
		return { 'lines': new_text, 'poem': poem_sents }
	else:
		return { 'lines': new_text, 'poem': gen_poem }

if __name__ == '__main__':

	data = generateText(sys.argv[1])
	for line in data['lines'][:100]:
		print line

