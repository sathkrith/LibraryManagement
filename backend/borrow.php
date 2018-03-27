<?php

	extract($_GET);
	//echo $_SESSION["username"];
	//$username=$_SESSION["username"];
	$uid="";
	$exist=False;
	$connect=mysqli_connect('localhost','root','','library');
	$result=mysqli_query($connect,"SELECT * FROM user WHERE username='".$username."' ");
	while($row=mysqli_fetch_array($result))
		{
			$uid=$row['id'];
		}

	$result=mysqli_query($connect,"SELECT * FROM borrowed WHERE uid='".$uid."' and bid='".$isbn."'");
		while($row=mysqli_fetch_array($result))
		{
			$exist=True;
		}
	if($exist)
		{
			echo 'Exist';
		}
	else if(mysqli_query($connect,"INSERT INTO borrowed(uid,bid) VALUES ('".$uid."','".$isbn."')"))
		{
			$result=mysqli_query($connect,"UPDATE book SET count=count-1  WHERE isbn='".$isbn."'  ");
			echo 'True';
		}
	else
		{
			echo 'False';
		}
	
		
?>