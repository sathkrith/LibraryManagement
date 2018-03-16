<?php

	extract($_GET);
	
	$uid="";
	$connect=mysqli_connect('localhost','root','','library');
	$result=mysqli_query($connect,"SELECT * FROM user WHERE username='".$_SESSION["username"] user."' AND password='".$pass."'");
	while($row=mysqli_fetch_array($result))
		{
			$uid=$row['uid'];
		}


	if(mysqli_query($connect,"INSERT INTO borrowed (uid,bid) VALUES ('".$uid."','".$isbn."')"))
		{
			echo 'True';
		}
		else
		{
			echo 'False';
		}
	
		
?>