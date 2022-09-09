import sys
import os
from img import create_image
from random import choice, sample

num = 1

filename = open('bot/ig/curated_list_08_2022.txt', 'r')
f = filename.readlines()
filename.close()

for line in f:
	noun, prefix = line.strip().split(" ")
	word = prefix + noun
	image = create_image(noun, prefix)
	filename = 'bot/ig/ig_08_2022/' + word + '-geneword.png'
	image.save(filename)
