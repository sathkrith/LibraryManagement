<?php

extract($_GET);
$connect=mysqli_connect('localhost','root','','library');
$result=mysqli_query($connect,"select name,isbn,count from book where name like '%".$name."%' ");
$output="";
if($result){
	while($row=mysqli_fetch_array($result))
	{
    	$output = $output.$row['name'].','.$row['isbn'].','.$row['count'].';';
	}
	echo $output;
}
else
{
    echo "no copies" ;
}







?>