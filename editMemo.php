<?php

// do memo escape string

$servername = 'localhost'; // default server name
$serverusername = 'psychUser'; // user name that you created
$serverpassword = 'N20t54TjPQKEmVhl'; // password that you created
$dbname = 'psych';

if (!empty($_POST))
{
  $action = $_POST['action'];
  
  if ($action == 'request')
  {
    $position = $_POST["position"];
    
    requestMemo($position);
  }
  if ($action == 'submit')
  {
    $username = $_POST["username"];
    $position = $_POST["position"];
    $memo = $_POST["memo"];
    
    submitMemo($username, $position, $memo);
  }
}
else
{
  echo "No connection";
}

function submitMemo($username, $position, $memo)
{
  // Create connection
  $conn = new mysqli('localhost', 'psychUser', 'N20t54TjPQKEmVhl', 'psych');
  
  // Check connection
  if ($conn->connect_error)
  {
      die("Connection failed: " . $conn->connect_error ."<br>");
  }
  
  $memo = $conn->real_escape_string($memo);
  
  // Prepare sql statement
  $stmt = $conn->prepare("SELECT * FROM memoinput WHERE memoID = ? AND username = ?");
  
  if ($stmt==FALSE)
  {
  	echo "There is a problem with prepare <br>";
  	echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
  }
  $stmt->bind_param("is", $position, $username);
  
  $stmt->execute();
  $result = $stmt->get_result();
  
  if ($result->num_rows != 0)     // Results returned
  {
    $stmt = $conn->prepare("UPDATE memoinput SET memotext = ? WHERE memoID = ? AND username = ?");
    
    if ($stmt==FALSE)
    {
      echo "There is a problem with prepare <br>";
      echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
    }
    $stmt->bind_param("sis", $memo, $position, $username);
    $stmt->execute(); // Run query
    echo "Success";
  }
  else
  {
    $sql = "SELECT * FROM memoinput";
    $numResult = $conn->query($sql);
    
    $stmt = $conn->prepare("INSERT INTO memoinput (memoID, username, memotext) VALUES (?,?,?)");

    if ($stmt==FALSE)
    {
      echo "There is a problem with prepare <br>";
      echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
    }
    $stmt->bind_param("iss", $position, $username, $memo);
    $stmt->execute(); // Run query
    echo "Success";
  }
  return;
}

function requestMemo($position)
{
  // Create connection
  $conn = new mysqli('localhost', 'psychUser', 'N20t54TjPQKEmVhl', 'psych');

  // Check connection
  if ($conn->connect_error)
  {
      die("Connection failed: " . $conn->connect_error ."<br>");
  }
  // Prepare sql statement
  
  $stmt = $conn->prepare("SELECT * FROM memoinfo WHERE id = ?");
  
  if ($stmt==FALSE)
  {
  	echo "There is a problem with prepare <br>";
  	echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
  }
  $stmt->bind_param("s", $position);

  $stmt->execute();
  $result = $stmt->get_result();

  $row = $result->fetch_assoc(); // Fetch a result row as an associative array
  $response = $row["memotext"];
  echo $response;
  return;
}
?>
