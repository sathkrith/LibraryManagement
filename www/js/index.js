/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 function load(){
    if(sessionStorage.getItem('username')==null)
        window.location.href = "./account/signup.html";
    else{
        document.getElementById("deviceready").innerHTML = "logged in as <br>"
        +sessionStorage.getItem("username")+"</br>";
        document.getElementById("book").hidden=false;
        }
}
isbn=null;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) 
        console.log('Received Event: ' + id);
    }
};


 function scan(){
    var permissions = cordova.plugins.permission;
   // permissions.requestPermissio(permissions.CAMERA, success, error);
    alert(permissions);
    function error() {
    alert('Camera permission is not turned on');
    }
    
    function success( status ) {
    if( !status.hasPermission ) error();
    }


    cordova.plugins.barcodeScanner.scan(
        function (result) {
            alert("We got a barcode\n" +
                  "Result: " + result.text + "\n" +
                  "Format: " + result.format + "\n" +
                  "Cancelled: " + result.cancelled);
                  if(result.text.length>0){
                  getBookDetails(result.text)
                 document.getElementById("borrow").hidden = false;
                 
                  }
        },
        function (error) {
            alert("Scanning failed: " + error);
        },
        {
            preferFrontCamera : false, // iOS and Android
            showFlipCameraButton : true, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: true, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
             // default: all but PDF_417 and RSS_EXPANDED
            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
     );
 }

 function search(){
     //query=document.forms['search']['name'].value;
    searchString=document.getElementById('searchString').value;
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if(this.readyState==4 && this.status==200)
        {
            if(this.responseText.localeCompare('no copies')==0)
            {   
                document.getElementById('errorbox').className='alert alert-info';
                    document.getElementById('errorbox').style='display:block';
                    document.getElementById('errorbox').innerHTML='No results'
            }
            else
            {	
                displaybook(this.responseText);
                document.getElementById('errorbox').style='display:none';
                
                //document.getElementById("bookdetails").innerHTML=isbn;
                //getBookDetails(isbn);
                
            }
        
        }
    };
    xhr.open('GET','http://192.168.43.229/backend/search.php?name='+searchString,true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
    return false;
 }
function displaybook(responseText){
    tablebody=document.getElementById("booktable");
                tablebody.innerHTML="";
                books=responseText.split(';').slice(0,-1);
                console.log(books);
                for(i=0;i<books.length;i++){
                    eachbook=books[i].split(',')
                    name=eachbook[0]
                    isbn=eachbook[1]
                    count=eachbook[2]
                    console.log(isbn);
                    status=count+" left";
                    
                    console.log(name)
                    row=document.createElement("tr");
                    nam=document.createElement("td");
                    isb=document.createElement("td");
                    sta=document.createElement("td");
                    btn=document.createElement("td");
                    var inputElement = document.createElement('input');
                    inputElement.type = "button";
                    inputElement.value = "borrow";
                    
                    inputElement.id=isbn;
                    inputElement.className = "btn btn-primary";
                    
                    btn.appendChild(inputElement);
                    nam.innerHTML=name;
                    isb.innerHTML=isbn;
                    sta.innerHTML=status;
                    row.appendChild(nam);
                    row.appendChild(isb);
                    row.appendChild(sta);
                    row.appendChild(btn);
                    tablebody.appendChild(row);
                    
                    if(count<1){
                        cur_btn=document.getElementById(isbn);
                        cur_btn.value="get holdings"
                        cur_btn.addEventListener('click', function(){
                            getholdings(this.id);
                        });
                    }
                    else{
                        isbnele=document.getElementById(isbn).value;
                        getElementById(isbn).style.visibility="hidden";
                        document.getElementById(isbn).addEventListener('click', function(){
                            borrow(this.id);
                            
                        });
                    }
                }
}
 function getBookDetails(isbn) {
    // Query the book database by ISBN code.
    isbn = isbn || "9781451648546"; // Steve Jobs book 
    
    var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
    
    var response;
        // Get the data from the API
        $.getJSON(url, displayBooks);
    
        // We've got the JSON data. Now let's do something with it
        function displayBooks(data) {
            // Start off by defining a variable called htmlString
            var htmlString = "<div>";
            htmlString +=JSON.stringify(data);
            $('#bookdet').html(htmlString + "</div>");
            // For each of the JSON API results... 
           $.each(data.items, function (i, item) {
                // Add some HTML with CSS
                var htmlString = "<div>";

                htmlString += '<div class="col-xs-3">';
                // Build up the HTML using the data from the API
                htmlString += '<img src="' + item.volumeInfo.imageLinks.thumbnail + '" alt="' + item.id + '" title="' + item.id + '", class ="img-thumbnail img-responsive"/><br/>';
                htmlString += '<strong class="small">Pub: ' + item.volumeInfo.publishedDate + '</strong></div>';
                htmlString += '<div class="col-xs-9"><h1>' + item.volumeInfo.title + '</h1>';
                $.each(item.volumeInfo.authors, function (i, author) {
                    htmlString += '<p class="bg-info"><i>' + author + '</i></p>';
                });
                htmlString += '<p class="small">' + item.volumeInfo.description + '</p>';
                htmlString += '<p class="well small">Extract: "' + item.searchInfo.textSnippet + '"<a href="' + item.accessInfo.webReaderLink + '" target="_blank"> Read more</a></p>';
                htmlString += '</div>';
                $('#bookdet').html(htmlString + "</div>");
                
            });
            var inputElement = document.createElement('input');
                    inputElement.type = "button";
                    inputElement.value = "borrow";
                    inputElement.id=isbn;
                    inputElement.className = "btn btn-primary";
                    document.getElementById('bookdet').appendChild(inputElement);
                    document.getElementById(isbn).addEventListener('click', function(){
                        borrow(this.id);});
            // And then wherever there's a div with an ID of 'book' in the HTML, replace it with our htmlString. See over on the right for the results!     
        }
        
    }

    
  function logout(){
    sessionStorage.removeItem("uid");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");

    window.location.href = "./account/signup.html";


  }
  function returnbook(){

  }
  function getholdings(isbn){
    if(isbn!=null){
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if(this.readyState==4 && this.status==200)
            {
                if(this.responseText.localeCompare('False')==0)
                {
                    document.getElementById('errorbox').className='alert alert-danger';
                    document.getElementById('errorbox').style='display:block';
                    document.getElementById('errorbox').innerHTML='Error in getting holdings';
                }
                
                else
                {   
                    
                    getUserDetails(this.responseText);
                }
            
            }
        };
        xhr.open('GET','http://192.168.43.229/backend/holdings.php?isbn='+isbn,true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(); 
    }
  }
  function getUserDetails(responseText){
        tablebody=document.getElementById("usertable");
                tablebody.innerHTML="";
                users=responseText.split(';').slice(0,-1);
                console.log(users);
                for(i=0;i<users.length;i++){
                    eachuser=users[i].split(',')
                    name=eachuser[0]
                    phone=eachuser[1]
                    email=eachuser[2]
                    console.log(email);
                    
                    console.log(name)
                    row=document.createElement("tr");
                    nam=document.createElement("td");
                    ph=document.createElement("td");
                    em=document.createElement("td");
                    //btn=document.createElement("td");
                    
                    nam.innerHTML=name;
                    ph.innerHTML=phone;
                    em.innerHTML=email;
                    row.appendChild(nam);
                    row.appendChild(ph);
                    row.appendChild(em);
                    tablebody.appendChild(row);
                }
}
  function borrow(isbn){
    user=sessionStorage.username;
    console.log(isbn);
    if(isbn!=null){
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if(this.readyState==4 && this.status==200)
            {
                if(this.responseText.localeCompare('False')==0)
                {
                    document.getElementById('errorbox').className='alert alert-danger';
                    document.getElementById('errorbox').style='display:block';
                    document.getElementById('errorbox').innerHTML='Error in borrow';
                }
                else if(this.responseText.localeCompare('Exist')==0)
                {
                    document.getElementById('errorbox').className='alert alert-warning';
                    document.getElementById('errorbox').style='display:block';
                    document.getElementById('errorbox').innerHTML='Already added';
                    
                }
                else
                {	
                    document.getElementById('errorbox').innerHTML='Book Added';
                    document.getElementById('errorbox').style='display:block';
                    document.getElementById('errorbox').className='alert alert-success';
                    getBookDetails(this.responseText);
                }
            
            }
        };
        xhr.open('GET','http://192.168.43.229/backend/borrow.php?isbn='+isbn+'&username='+user,true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(); 
    }
  }

                
