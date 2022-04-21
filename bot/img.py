import sys
import colorsys
import base64
import csv
from nltk.corpus import wordnet as wn

from io import BytesIO
from random import randint, choice
from PIL import Image, ImageDraw, ImageFont

def get_prefix_def(prefix):
	prefix_def = ''
	with open('input/prefix.csv', 'rt') as f:
		reader = csv.reader(f)
		for row in reader:
			if row[0] == prefix:
				prefix_def = row[1]
	return prefix_def

def get_noun_defs(noun):
	# nltk.download('omw-1.4')
	# nltk.download('wordnet')

	sets = wn.synsets(noun, wn.NOUN)
	defs = []
	for s in sets:
		defs.append(s.definition())
	if len(sets) == 0:
		defs.append("Not found.") # start over ?
	return defs

# https://stackoverflow.com/questions/24852345/hsv-to-rgb-color-conversion
def hsv2rgb(h,s,v):
	return tuple(round(i * 255) for i in colorsys.hsv_to_rgb(h,s,v))

def text_wrap(text, font, max_width):
	# https://itnext.io/how-to-wrap-text-on-image-using-python-8f569860f89e
	lines = []
	if font.getsize(text)[0]  <= max_width:
		lines.append(text)
	else:
		words = text.split(' ')
		i = 0
		while i < len(words):
			line = ''
			while i < len(words) and font.getsize(line + words[i])[0] <= max_width:
				line = line + words[i] + ' '
				i += 1
			if not line:
				line = words[i]
				i += 1
			lines.append(line)
	return lines

def random_color():
	h = randint(0, 360)
	s = randint(50, 80)
	v = randint(50, 80)
	return hsv2rgb(h/360, s/100, v/100)

def create_image(noun, prefix):
	im = Image.new('RGB', (512, 512), (255, 255, 255))
	draw = ImageDraw.Draw(im)

	color = random_color()

	s = 64
	word_font = ImageFont.truetype("bot/arial.ttf", s)
	def_font = ImageFont.truetype("bot/arial.ttf", 20)

	while word_font.getsize(prefix + noun)[0] > 512 - 64:
		s = s - 2
		word_font = ImageFont.truetype("bot/arial.ttf", s)
	
	draw.text([32, 16], prefix + noun, font=word_font, fill=color)
	draw.text([32, 112], get_prefix_def(prefix), font=def_font, fill=(0, 0, 0))
	draw.text([32, 146], "+", font=def_font, fill=(0, 0, 0))
	y = 180
	for index, noun_def in enumerate(get_noun_defs(noun)):
		if index < 5 and y < 512 - 64:
			lines = text_wrap(noun_def, def_font, 512 - 64)
			for line in lines:
				draw.multiline_text([32, y], line, font=def_font, fill=(0, 0, 0))
				y += 32
			y += 12

	# draw.text([64, 256], get_noun_defs(noun), font=font)
	draw.text([32, 512 - 32], "@geneword", font=def_font, fill=color)

	return im

def get_image_data(noun, prefix):
	im = create_image(noun, prefix)
	buffered = BytesIO()
	im.save(buffered, format="PNG")
	img_str = base64.b64encode(buffered.getvalue())
	file = BytesIO(base64.b64decode(img_str))
	return file

if __name__ == '__main__':
	noun = 'world'
	if len(sys.argv) > 1:
		noun = sys.argv[1]
	prefix = 'geo'
	if len(sys.argv) > 2:
		prefix = sys.argv[2]
	im = create_image(noun, prefix)
	im.show()