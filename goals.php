<?php

$servername = 'localhost'; // default server name
$username = 'psychUser'; // user name that you created
$password = 'N20t54TjPQKEmVhl'; // password that you created
$dbname = 'psych';

if (!empty($_POST))
{
  $userName = $_POST['userName'];
  $seconds = $_POST['time'];
  $type = $_POST['type'];
  $goal = $_POST['goal'];
  
  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);
  
  // Check connection
  if ($conn->connect_error)
  {
    die("Connection failed: " . $conn->connect_error ."<br>");
  }
  
  $stmt = $conn->prepare("INSERT INTO goals (username, goaltype, goalamount, goaltimer) VALUES (?,?,?,?)");
  
  if ($stmt==FALSE)
  {
    echo "There is a problem with prepare <br>";
    echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
  }
  $stmt->bind_param("ssid", $userName, $type, $goal, $seconds);
  $stmt->execute();   
  return;
}
else
{
  echo "Error 2";
}

?>
