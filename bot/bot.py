#!/usr/bin/python
# -*- coding: utf-8 -*-

# google api AIzaSyDBZBVHLGKYGVXZJDCg-jQbsqDlOjf5dZE
# tinyurl api 0799849963HI948658B

import tweepy, time
import requests, json
import tinyurl.tinyurl
import os

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

filename = open('list.txt', 'r')
f = filename.readlines()
filename.close()
r = randint(0,len(f))

current_list = open('list.txt', 'w')
used_list = open('used.txt', 'a')

num = len(f)

word = ''
url = ''
tweet_text = ''

# get a random line and then rewrite the list.txt
if num > 0:
	for index, line in enumerate(f):
		if index == r:
			word = line.split(" ")[0]
			url = line.split(" ")[1]

			# tinyurl  shortener
			link = tinyurl.create_one(url)

			if num % 7 == 0:
				msg = str(num) + " tweets, " + str(num/7) + " weeks, " + str(num/365) + " years to go"
				tweet_text = word + '\n' + link  + '\n' + msg
				used_list.write( word + ' ' + link  + ' ' + msg + '\n')
			else:
				tweet_text = word + '\n' + link
				used_list.write(word + ' ' + link + '\n')

		else:
			current_list.write(line)
else:
	tweet_text = "That's it :)"

used_list.close()
used_list.close()

try:
	api.update_status(tweet_text)
except tweepy.TweepError as e:
	print("Tweepy Error: {}".format(e))
