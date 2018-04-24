<?php
date_default_timezone_set('America/Los_Angeles');

require_once("nameGenerator.php");

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
    $content = $_POST["content"];
    $content = json_decode($content);
    
    $username = $content->username;
    $position = $content->position;
    $selected = $content->selected;
    
    submitMemo($username, $position, $selected);
  }
  if ($action == 'move')
  {
    $position = $_POST["position"];
    
    checkMove($position);
  }
}
else
{
  echo "No connection";
}

function checkMove($position)
{
  if ($position <= 0)
  {
    echo "Rejected";
    return;
  }
  
  // Create connection
  $conn = new mysqli('localhost', 'psychUser', 'N20t54TjPQKEmVhl', 'psych');

  // Check connection
  if ($conn->connect_error)
  {
      die("Connection failed: " . $conn->connect_error ."<br>");
  }
  // Prepare sql statement
  $stmt = $conn->prepare("SELECT * FROM labelappointmentinfo WHERE id = ?");
  
  if ($stmt==FALSE)
  {
  	echo "There is a problem with prepare <br>";
  	echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
  }
  $stmt->bind_param("i", $position);
  
  $stmt->execute();
  $result = $stmt->get_result();
  if ($result->num_rows == 0)     // Results returned
  {
    addNewRecord($position);
  }
  
  $conn->close();
  
  echo $position;
  return;
}

function addNewRecord($position)
{
  // Create connection
  $conn = new mysqli('localhost', 'psychUser', 'N20t54TjPQKEmVhl', 'psych');

  // Check connection
  if ($conn->connect_error)
  {
      die("Connection failed: " . $conn->connect_error ."<br>");
  }
  
  $firstName = generateFirstName();
  $lastName = generateLastName();
  $apptNum = generateRandomNumber();
  
  // Prepare sql statement
  $stmt = $conn->prepare("INSERT INTO labelappointmentinfo (id, firstname, lastname, apptnum) VALUES (?,?,?,?)");
  
  if ($stmt==FALSE)
  {
  	echo "There is a problem with prepare <br>";
  	echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
  }
  $stmt->bind_param("issi", $position, $firstName, $lastName, $apptNum);
  
  $stmt->execute();
  $conn->close();
  return;
}

function submitMemo($username, $position, $selected)
{
  // Create connection
  $conn = new mysqli('localhost', 'psychUser', 'N20t54TjPQKEmVhl', 'psych');

  // Check connection
  if ($conn->connect_error)
  {
      die("Connection failed: " . $conn->connect_error ."<br>");
  }
  // Prepare sql statement
  $stmt = $conn->prepare("SELECT * FROM labelappointmentinput WHERE position = ? AND username = ?");
  
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
    $timestamp = date("Y-m-d H:i:s");
    $stmt = $conn->prepare("UPDATE labelappointmentinput SET selected = ?, timestamp = ? WHERE position = ? AND username = ?");
    
    if ($stmt==FALSE)
    {
      echo "There is a problem with prepare <br>";
      echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
    }
    $stmt->bind_param("ssis", $selected, $timestamp, $position, $username);
    $stmt->execute(); // Run query
    echo "Success";
  }
  else
  {
    $timestamp = date("Y-m-d H:i:s");
    $stmt = $conn->prepare("INSERT INTO labelappointmentinput (position, username, selected, timestamp) VALUES (?,?,?,?)");
    
    if ($stmt==FALSE)
    {
      echo "There is a problem with prepare <br>";
      echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
      return;
    }
    $stmt->bind_param("isss", $position, $username, $selected, $timestamp);
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
  
  $stmt = $conn->prepare("SELECT * FROM labelappointmentinfo WHERE id = ?");
  
  if ($stmt==FALSE)
  {
  	echo "There is a problem with prepare <br>";
  	echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
  }
  $stmt->bind_param("i", $position);

  $stmt->execute();
  $result = $stmt->get_result();
  
  if ($result->num_rows != 0)
  {
    $row = $result->fetch_assoc(); // Fetch a result row as an associative array
    echo json_encode($row);
  }
  else
  {
    addNewRecord($position);
    echo requestMemo($position);
    return;
  }
  
  return;
}
?>
