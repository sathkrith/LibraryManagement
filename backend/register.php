<?php
	extract($_POST);
	
	$connect=mysqli_connect('localhost','root','','library
	');
	
	if(strcmp('retail',$role)==0)
	{
		if(mysqli_query($connect,"INSERT INTO pending (uname, username, password, urole) VALUES ('".$name."', '".$user."', '".$pass."', '".$role."')"))
		{
			echo 'True';
		}
		else
		{
			echo 'False';
		}
	}
	else if(strcmp('user',$role)==0)
	{
		if(mysqli_query($connect,"INSERT INTO user (wallet, uname, username, password, urole) VALUES (0, '".$name."', '".$user."', '".$pass."', '".$role."')"))
		{
			echo 'True';
		}
		else
		{
			echo 'False';
		}
	}
	
?>