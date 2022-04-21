import json
bd = open('bot/badwords.json')
blacklist = json.load(bd)
print(blacklist)

original_lines = open('bot/original_list.txt').readlines()
used_lines = open('bot/used_pa.txt', 'r').readlines()
f = open('bot/list.txt', 'w')
used_words = [line.split(' ')[0] for line in used_lines]

for line in original_lines:
	if line.split(' ')[0] not in used_words:
		word, url = line.split(' ')
		new_line = ' '.join(url.split('/')[-2:])
		word= new_line.split(' ')[0]
		if word not in blacklist:
			f.write(new_line)
		else:
			print(word)
f.close()

