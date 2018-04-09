import string
import glob
import sys
import os
import datetime
import psutil
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

os.listdir("path")

with open("./input.txt","r") as f:
    filelist = f.readlines()
filelist = [x.strip() for x in filelist]

with open("./booleanindex.txt","r") as f:
    content = f.readlines()
content = [x.strip() for x in content]

index = {}

for x in content:
	line = x.split()
	index[line[0]] = set(line[1].split(','))

universal = {'0'}
count = 0
for x in filelist:
	universal.add(str(count))
	count = count + 1
	
a = datetime.datetime.now()
fa = open("booleanresult.txt","w")

with open("./boolean.txt","r") as f:
    querylist = f.readlines()
querylist = [x.strip() for x in querylist]

operatorlist = ["NOTBOOLEANOPERATOR","ANDBOOLEANOPERATOR","ORBOOLEANOPERATOR"]

querycount =1
for x in querylist:
	
	x=x.lower()
	
	x = x.replace("not ","NOTBOOLEANOPERATOR ")
	x = x.replace(" and "," ANDBOOLEANOPERATOR ")
	x = x.replace(" or "," ORBOOLEANOPERATOR ")
	
	transform1 = [',', '.', '@', '/', '#', '_']
	rx1 = '[' + re.escape(''.join(transform1)) + ']'
	x = re.sub(rx1, '', x)

	transform2 = ['[', ']', '+', '=', '\\', '&', '-', '|', '<', '>', '?', '{', '}', '(', ')', '\'', '\"', ';', ':', '\n', '!', '$', '%', '*']
	rx2 = '[' + re.escape(''.join(transform2)) + ']'
	x = re.sub(rx2, ' ', x)

	rx3 = '[^A-Za-z0-9 ]'
	x = re.sub(rx3, '', x)

	stop_words = set(stopwords.words("english"))
	tokenized = x.split()
	lemmatizer = WordNetLemmatizer()
	wordlist = []

	for w in tokenized:
		flag = 0
		pattern = re.compile('^([0-9]|[1-9][0-9]|[1-9][0-9][0-9])$')
		if pattern.match(w):
			flag = 1
		if len(w) > 1 and flag == 0:
			if w not in stop_words:
				wordlist.append(lemmatizer.lemmatize(w))
	querystring = ""
	count = 0
	flag = 0
	while count < len(wordlist):
		if wordlist[count] == "NOTBOOLEANOPERATOR" and (flag !=1):
			querystring = querystring + " ( universal - "
			flag = 1
		elif wordlist[count] == "ANDBOOLEANOPERATOR" and (flag ==2):
			querystring = querystring + " & "
			flag = 3
		elif wordlist[count] == "ORBOOLEANOPERATOR" and (flag ==2):
			querystring = querystring + " | "
			flag = 4
		elif wordlist[count] not in operatorlist and (flag ==3 or flag ==0 or flag ==4):
			if wordlist[count] in index:
				querystring = querystring + " index['" + wordlist[count] + "'] "
			else:
				querystring = querystring + " set() "
			flag = 2
		elif wordlist[count] not in operatorlist and (flag ==1):
			if wordlist[count] in index:
				querystring = querystring + " index['" + wordlist[count] + "'] ) "
			else:
				querystring = querystring + " set() "
			flag = 2
		elif wordlist[count] not in operatorlist and (flag ==2):
			if wordlist[count] in index:
				querystring = querystring + " & index['" + wordlist[count] + "'] "
			else:
				querystring = querystring + " & set() "
			flag = 2
		count = count + 1
	if flag ==1:
		querystring = re.sub(' ( universal - $', '', querystring)
	elif flag ==3:
		querystring = re.sub(' & $', '', querystring)
	elif flag ==4:
		querystring = re.sub(' | $', '', querystring)
		
	
	if querystring == "":
		fa.write ("Q" + str(querycount) + ": No Query")
		fa.write ("\n")
	else:
		try:
			if len(eval(querystring)) ==0:
				fa.write ("Q" + str(querycount) + ": No Result")
				fa.write ("\n")
			else:
				fa.write ("Q" + str(querycount) + ": " + str(len(eval(querystring))))
				fa.write ("\n")
		except:
			fa.write ("Q" + str(querycount) + ': Query Error')
			fa.write ("\n")
	querycount = querycount + 1
			
f = open("booleanresource.txt","w")
pid = os.getpid()
py = psutil.Process(pid)
memoryUse = py.memory_info()[0]/2.**30
f.write ('memory use:' + str(memoryUse))
f.write ("\n")
b = datetime.datetime.now()
f.write ('time:' + str(b-a))
f.write ("\n")
f.close()
fa.close()