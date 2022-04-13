#!/usr/bin/python
# -*- coding: utf-8 -*-

# google api AIzaSyDBZBVHLGKYGVXZJDCg-jQbsqDlOjf5dZE
# tinyurl api 0799849963HI948658B

import tweepy, time
import requests, json
from random import randint

import tinyurl

CONSUMER_KEY = 'kAkybroMhUSsSUw8U34Ni4aMQ'
CONSUMER_SECRET = 'D4Glo4z7tzXM35Pk1NOSq0Wab6SFMgKM6RPXAWcTIYOsFvg7s1'
ACCESS_KEY = '803460332660334592-upGctFdETpHWwte82tzAEMSoaCxnB8Z'
ACCESS_SECRET = 'XqZDKQl6jisnwtzQs6fjPxnuQJu6UOJ0NywyyvLPpL40J'
auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
api = tweepy.API(auth)

filename = open('list.txt', 'r')
f = filename.readlines()
filename.close()
r = randint(0,len(f))

n = open('list.txt', 'w')
u = open('used.txt', 'a')

num = len(f)

if num > 0:
	for index, line in enumerate(f):
		if index == r:
			word = line.split(" ")[0]
			url = line.split(" ")[1]
			
			# google shortener
			# headers = {'content-type': 'application/json'}
			# payload = {"longUrl": url}
			# google = "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyDBZBVHLGKYGVXZJDCg-jQbsqDlOjf5dZE"
			# r = requests.post(google, data=json.dumps(payload), headers=headers)
			# link = json.loads(r.text)['id']
			
			# tinyurl  shortener
			link = tinyurl.create_one(url)

			if num % 7 == 0:
				msg = str(num) + " tweets, " + str(num/7) + " weeks, " + str(num/365) + " years to go" 
				api.update_status(word + '\n' + link  + '\n' + msg)
				u.write( word + ' ' + link  + ' ' + msg + '\n' )
			else:
				api.update_status(word + '\n' + link )
				u.write(  word + ' ' + link + '\n' )
		else:
			n.write(line)
else:
	api.update_status("That's it :)")

n.close()
u.close()
