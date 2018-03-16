<?php

extract($_GET);
$connect=mysqli_connect('localhost','root','','library');
$result=mysqli_query($connect,"select isbn from book where name=\"$name\" and count>0");

if($row=mysqli_fetch_array($result))
{
    echo json_encode($row);

}
else
{
    echo "no copies" ;
}







?>