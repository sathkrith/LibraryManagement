import string
import glob
import sys
import os
import datetime
import psutil
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

a = datetime.datetime.now()

with open("./input.txt","r") as f:
    filelist = f.readlines()
filelist = [x.strip() for x in filelist]

count = 0
booleanindex = {}
vectorindex = {}
termcount = {}

for filename in filelist:
	with open('./rfcs/'+filename,"r") as f:
		content=f.read().lower()

	transform1 = [',', '.', '@', '/', '#', '_']
	rx1 = '[' + re.escape(''.join(transform1)) + ']'
	content = re.sub(rx1, '', content)

	transform2 = ['[', ']', '+', '=', '\\', '&', '-', '|', '<', '>', '?', '{', '}', '(', ')', '\'', '\"', ';', ':', '\n', '!', '$', '%', '*']
	rx2 = '[' + re.escape(''.join(transform2)) + ']'
	content = re.sub(rx2, ' ', content)

	rx3 = '[^A-Za-z0-9 ]'
	content = re.sub(rx3, '', content)

	stop_words = set(stopwords.words("english"))
	tokenized = content.split()
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
	
	for w in wordlist:
		if w in booleanindex:
			booleanindex[w].add(count)
		else:
			booleanindex[w] = {count}
		if count in termcount:
			termcount[count] = termcount[count]+1
		else:
			termcount[count] = 1
		if w in vectorindex:
			if count in vectorindex[w]:
				vectorindex[w][count] = vectorindex[w][count] + 1
			else:
				vectorindex[w][count] = 1
		else:
			vectorindex[w] = {}
			vectorindex[w][count] = 1
	count = count + 1

f = open("vectorindex.txt","w")
for i, j in vectorindex.items():
	f.write(i+",")
	for k,l in vectorindex[i].items():
		f.write (","+str(k)+":"+str(l))
	f.write("\n")
f.close()

f = open("booleanindex.txt","w")
for i, j in booleanindex.items():
	f.write (str(i) + ' ' + ','.join(str(e) for e in j))
	f.write ("\n")
f.close()

f = open("termcount.txt","w")
for i, j in termcount.items():
	f.write (str(i) + ' ' + str(j))
	f.write ("\n")
f.close()

f = open("indexresource.txt","w")
pid = os.getpid()
py = psutil.Process(pid)
memoryUse = py.memory_info()[0]/2.**30
f.write ('memory use:' + str(memoryUse))
f.write ("\n")
b = datetime.datetime.now()
f.write ('time:' + str(b-a))
f.write ("\n")
f.close()