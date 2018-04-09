import json
import urllib 
import csv
from bs4 import BeautifulSoup
import codecs

def get_isbn_all():
    csv_path = ".\\resources\\BX-Books.csv"
    with open(csv_path) as csvfile:
        reader = csv.DictReader(csvfile,delimiter=';')
        rows = [r for r in reader]
        for row in range(1000,len(rows)):
            #print(row.keys())
            isbn = rows[row]['ISBN']
            save_title_abstract(isbn)           
    
def save_title_abstract(isbn):
   # print(isbn)
    url = "https://www.googleapis.com/books/v1/volumes?key=AIzaSyCuIZP8krlxqlsNE7a8lGGDObtQQ2pi68I&q=isbn:" + isbn
    print(url)
    request = urllib.request.Request(url)
    opener = urllib.request.build_opener()
    response = opener.open(request)
    soup = BeautifulSoup(response,"html5lib")
    soup = soup.find('body').get_text()
   #print(soup)\
    try:
        content = json.loads( str(soup))
        if "items" in content:
            if(content["items"][0]["volumeInfo"]["title"] and content["items"][0]["volumeInfo"]["categories"] and content["items"][0]["volumeInfo"]["description"]):
                f = open("resources\\title_abstract\\"+isbn+".txt","w+")
                f.write("title:")
                f.write(content["items"][0]["volumeInfo"]["title"]+"\r\n")
                f.write("category:")
                f.write(content["items"][0]["volumeInfo"]["categories"][0]+"\r\n")
                f.write("abstract:")
                f.write(content["items"][0]["volumeInfo"]["description"]+"\r\n")
                f.close()
    except:
        print("exception")
get_isbn_all()

