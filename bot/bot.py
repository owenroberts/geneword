#!/usr/bin/python
# -*- coding: utf-8 -*-

import tweepy, time
import requests, json
import tinyurl.tinyurl as tinyurl
import os
import img

from dotenv import load_dotenv
from random import randint

load_dotenv()

CONSUMER_KEY = os.environ.get('CONSUMER_KEY')
CONSUMER_SECRET = os.environ.get('CONSUMER_SECRET')
ACCESS_KEY = os.environ.get('ACCESS_KEY')
ACCESS_SECRET = os.environ.get('ACCESS_SECRET')

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
api = tweepy.API(auth)

filename = open('bot/list.txt', 'r')
f = filename.readlines()
filename.close()
r = randint(0,len(f))

current_list = open('bot/list.txt', 'w')
used_list = open('bot/used.txt', 'a')

num = len(f)

word = ''
url = ''
tweet_text = ''
noun = ''
prefix = ''

# get a random line and then rewrite the list.txt
if num > 0:
	for index, line in enumerate(f):
		if index == r:
			noun, prefix = line.strip().split(" ")
			word = prefix + noun
			url = 'https://geneword.ayinpress.org/gallery/word/' + noun + '/' + prefix

			if num % 7 == 0:
				msg = str(num) + " tweets, " + str(num/7) + " weeks, " + str(num/365) + " years to go"
				tweet_text = word + '\n' + url  + '\n' + msg
				used_list.write(line)
			else:
				tweet_text = word + '\n' + url
				used_list.write(line)

		else:
			current_list.write(line)
else:
	tweet_text = "That's it :)"

used_list.close()
current_list.close()

file = img.get_image_data(noun, prefix)
filename = word + "-geneword.png"

try:
	res = api.media_upload(filename=filename, file=file)
	api.update_status(status=tweet_text, media_ids=[res.media_id])
except tweepy.TweepError as e:
	print("Tweepy Error: {}".format(e))
