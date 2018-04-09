import string
import glob
import sys
import os
import datetime
import psutil
import re
import math
from math import exp, expm1
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

with open("./input.txt","r") as f:
    filelist = f.readlines()
filelist = [x.strip() for x in filelist]

with open("./vectorindex.txt","r") as f:
    content = f.readlines()
content = [x.strip() for x in content]

index = {}
vectorspace = {}
idf = {}
den2 = {}

for x in content:
	line = x.split(',,')
	index[line[0]] = {}
	vectorspace[line[0]] = {}	
	idf[line[0]] = 0	
	linecontent = line[1].strip().split(',')
	for y in linecontent:
		values = y.strip().split(':')
		index[line[0]][values[0]] = int(values[1])
		vectorspace[line[0]][values[0]] = int(values[1])
		if values[0] in den2:
			den2[values[0]] = den2[values[0]] + (int(values[1])*int(values[1]))
		else:
			den2[values[0]] = (int(values[1])*int(values[1]))
		
with open("./termcount.txt","r") as f:
    content = f.readlines()
content = [x.strip() for x in content]

termcount = {}

for x in content:
	line = x.split()
	termcount[line[0]] = int(line[1])

for x in index:
	idf[x] = math.log10(len(filelist)/len(index[x]))

for x in index:
	for y in index[x]:
		vectorspace[x][y] = (vectorspace[x][y]/termcount[y])*idf[x]

universal = {}
count = 0
for x in filelist:
	universal[str(count)] = 0
	den2[str(count)] = math.sqrt(den2[str(count)])
	count = count + 1

a = datetime.datetime.now()
fa = open("vectorresult.txt","w")

with open("./vector.txt","r") as f:
    querylist = f.readlines()
querylist = [x.strip() for x in querylist]

querycount =1
for x in querylist:
	
	x=x.lower()
	
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
	
	queryspace = {}
	queryfreq = {}
	for w in wordlist:
		if w in queryfreq:
			queryfreq[w] = queryfreq[w] + 1
		else:
			queryfreq[w] = 1
		if w in index:
			if w in queryspace:
				queryspace[w] = queryspace[w] + (idf[w]/len(wordlist))
			else:
				queryspace[w] = idf[w]/len(wordlist)
	
	for w in universal:
		for v in queryspace:
			if w in index[v]:
				universal[w] = universal[w]+vectorspace[v][w]*queryspace[v]
		den1 = 0
		for v in queryfreq:
			den1 = den1+ (queryfreq[v]*queryfreq[v])
		den1 = math.sqrt(den1)
		if (den1*den2[w]) > 0:
			universal[w] = universal[w]/(den1*den2[w])
		else:
			universal[w] = 0
		
	result = sorted(universal.items() , key=lambda t : t[1] , reverse=True)
	final = result[:10]
	
	if final[0][1] == 0:
		fa.write ("Q"+str(querycount)+": No Result\n")
	else:
		fa.write ("Q"+str(querycount)+": ")
		if final[0][1] > 0:
			fa.write (filelist[int(final[0][0])])
		for w in range(1,len(final)):
			if final[w][1] > 0:
				fa.write (", "+filelist[int(final[w][0])])
		fa.write('\n')
	querycount = querycount +1

f = open("vectorresource.txt","w")
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