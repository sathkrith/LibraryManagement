<?php
	extract($_POST);
	
	$connect=mysqli_connect('localhost','root','','library');
	$count=0;
	$result=mysqli_query($connect,"SELECT * FROM user WHERE username='".$user."' AND password='".$pass."'");
	while($row=mysqli_fetch_array($result))
	{
        $count++;
	}
	$result=mysqli_query($connect,"SELECT * FROM user WHERE username='".$user."' AND password='".$pass."'");

	
	if($count==0)
	{
		echo 'False';
	}
	else
	{
		while($row=mysqli_fetch_array($result))
		{
			echo $row['type'];
		}
	}
?>