from os import system, name
import requests, sys

endpoint = 'https://api.roblox.com/users/'

print('Finding the newest user... please wait.')

def search(min, max, previous):
	index = round((max + min) / 2)
	if previous == index: index += 1#random.randint(1, 3)

	req = requests.get(endpoint + str(index))

	if ',"Username":"' in req.text:
		if max == index: max += 1#random.randint(1, 3)
		min = index

		new(index, req.json()['Username'])
	elif '"code":400' in req.text: max = index
	
	search(min, max, index)

def new(id, username):
	if name == 'nt': system('cls')
	else: system('clear')

	print('Total Accounts: ' + str(id) + '\nNewest Account: ' + username)

sys.setrecursionlimit(5000)
search(1000000000, 100000000000, -1)

