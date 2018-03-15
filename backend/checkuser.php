<?php
	extract($_POST);
	
	$connect=mysqli_connect('localhost','root','','Library');
	
	$result=mysqli_query($connect,"SELECT username FROM user WHERE username='".$user."'");
	
	$count=0;
	while($row=mysqli_fetch_array($result))
	{
        $count++;
	}
	
	$result=mysqli_query($connect,"SELECT username FROM pending WHERE username='".$user."'");
	
	while($row=mysqli_fetch_array($result))
	{
        $count++;
	}
	
	if($count==0)
	{
		echo 'True';
	}
	else
	{
		echo 'False';
	}
	
?>