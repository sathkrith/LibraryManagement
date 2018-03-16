flag = 1

function checkUser()
{
	user=document.getElementById('reguname').value;
	if(user.localeCompare('')==0 || user==null)
	{
		document.getElementById('errorbox').innerHTML='<center><center>';
		document.getElementById('errorbox').style='font-size: 25px; color: white; background-color: none';		
	}
	else
	{
		xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if(this.readyState==4 && this.status==200)
			{
				if(this.responseText.localeCompare('False')==0)
				{
					document.getElementById('errorbox').innerHTML='<center>Username Already Taken<center>';
					document.getElementById('errorbox').style='font-size: 25px; color: white; background-color: red';
					flag = 0
				}
				else
				{	
					document.getElementById('errorbox').innerHTML='<center>Username Available<center>';
					document.getElementById('errorbox').style='font-size: 25px; color: black; background-color: #99ff99';
					flag = 1
				}
			}
		};
		xhr.open('POST','../../Backend/CheckUser.php',false);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send('user='+user);
	}
}

function signIn()
{
	user=document.getElementById('loginuname').value;
	pass=document.getElementById('loginpass').value;
	if(user.localeCompare('')==0 || user==null)
	{
		document.getElementById('errorbox').innerHTML='<center>Enter Username<center>';
		document.getElementById('errorbox').style='font-size: 25px; color: white; background-color: red';		
	}
	else
	{		
		xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if(this.readyState==4 && this.status==200)
			{
				myObj = this.responseText.split(';');
				if(myObj[0].localeCompare('False')==0)
				{
					document.getElementById('errorbox').innerHTML='<center>Wrong Username or Password<center>';
					document.getElementById('errorbox').style='font-size: 25px; color: white; background-color: red';
				}
				else if(myObj[0].localeCompare('user')==0)
				{	
					sessionStorage.setItem("uid", myObj[1]);
					sessionStorage.setItem("username", user);
					sessionStorage.setItem("role", myObj[0]);
					//document.location.href = './UserHome.html';
				}
				else if(myObj[0].localeCompare('admin')==0)
				{	
					sessionStorage.setItem("uid", myObj[1]);
					sessionStorage.setItem("username", user);
					sessionStorage.setItem("role", myObj[0]);
					//document.location.href = './AdminHome.html';
				}
				else if(myObj[0].localeCompare('retail')==0)
				{	
					sessionStorage.setItem("uid", myObj[1]);
					sessionStorage.setItem("username", user);
					sessionStorage.setItem("role", myObj[0]);
					//document.location.href = './RetailHome.html';
				}
			}
		};
		xhr.open('POST','../../backend/login.php',true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send('user='+user+'&pass='+pass);
	}
}

function signUp()
{
	if(flag==1)
	{	
		user=document.getElementById('reguname').value;
		pass=document.getElementById('regpass').value;
		name=document.getElementById('regname').value;
		type=document.getElementById('regtype').value;
		id=document.getElementById('regid').value;
		email=document.getElementById('regemail').value;
		phone=document.getElementById('regphone').value;
		if(name.localeCompare('')==0 || name==null || user.localeCompare('')==0 || user==null)
		{
			document.getElementById('errorbox').innerHTML='<center>Fill All Empty Fields<center>';
			document.getElementById('errorbox').style='font-size: 25px; color: white; background-color: red';		
		}
		else
		{
			xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function()
			{
				if(this.readyState==4 && this.status==200)
				{
					if(this.responseText.localeCompare('False')==0)
					{
						document.getElementById('errorbox').innerHTML='<center>Error in Registration<center>';
						document.getElementById('errorbox').style='font-size: 25px; color: white; background-color: red';
					}
					else if(this.responseText.localeCompare('True')==0 )
					{	
						document.getElementById('errorbox').innerHTML='<center>Registration successfull. Proceed to LogIn<center>';
						document.getElementById('errorbox').style='font-size: 25px; color: black; background-color: #99ff99';
						document.location.href = 'login.html';
					}
					else{
						alert(this.responseText);
					}
				}
			};
			xhr.open('POST','../../backend/register.php',true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.send('user='+user+'&pass='+pass+'&name='+name+'&type='+type+'&id='+id+'&email='+email+'&phone='+phone);
		}
	}
}