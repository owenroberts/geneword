import sys
import os
from img import create_image
from random import choice, sample

num = int(sys.argv[1])
directory = sys.argv[2]

filename = open('bot/ig/list.txt', 'r')
f = filename.readlines()
filename.close()

current_list = open('bot/ig/list.txt', 'w')
used_list = open('bot/ig/used.txt', 'a')

indexes = sample(range(0, len(f)), num)

for i in range(0,num):
	for index, line in enumerate(f):
		if index in indexes:
			noun, prefix = line.strip().split(" ")
			word = prefix + noun
			
			image = create_image(noun, prefix)
			filename = 'bot/ig/' + directory + '/' + word + '-geneword.png'
			image.save(filename)

			used_list.write(line)
		else:
			current_list.write(line)

used_list.close()
current_list.close()




	
