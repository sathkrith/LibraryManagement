<?php

extract($_GET);
$connect=mysqli_connect('localhost','root','','library');

$result=mysqli_query($connect,"SELECT user.name,user.email,user.mobile FROM user,borrowed WHERE user.id = borrowed.uid and borrowed.bid='".$isbn."'");
$output="";
if($result){
    while($row=mysqli_fetch_array($result))
    {
        $output = $output.$row['name'].','.$row['mobile'].','.$row['email'].';';
    }
    echo $output;
}
else
{
    echo $isbn ;
}







?>