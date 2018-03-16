<?php

	extract($_POST);
	$connect=mysqli_connect('localhost','root','','library');
	if(mysqli_query($connect,"INSERT INTO user (id,name, username, password,mobile,email,type) VALUES ('".$id."','".$name."', '".$user."', '".$pass."', '".$phone."', '".$email."', '".$type."')"))
		{
			echo 'True';
		}
		else
		{
			echo 'False';
		}
	
		
?>