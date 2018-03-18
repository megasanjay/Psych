<?php

$servername = 'localhost'; // default server name
$username = 'psychUser'; // user name that you created
$password = 'N20t54TjPQKEmVhl'; // password that you created
$dbname = 'psych';

if (!empty($_POST))
{
  $userName = $_POST['username'];
  $action = $_POST['action'];
  
  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);

  // Check connection
  if ($conn->connect_error)
  {
    die("Connection failed: " . $conn->connect_error ."<br>");
  }
  
  if ($action == 'setCurrentState')
  {
    $task = $_POST['task'];
    $stmt = $conn->prepare("SELECT * FROM currenttask WHERE username = ?");
    if ($stmt==FALSE)
    {
      echo "There is a problem with prepare <br>";
      echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
    }
    $stmt->bind_param("s", $userName);
    
    $stmt->execute();               // Run query
    $result = $stmt->get_result();  // query result

    if ($result->num_rows != 0)     // Results returned
    {
      $stmt = $conn->prepare("UPDATE currenttask SET tasknum = ? WHERE username = ?");
      if ($stmt==FALSE)
      {
        echo "There is a problem with prepare <br>";
        echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
      }
      $stmt->bind_param("is", $task, $userName);
      $stmt->execute();               // Run query
    }
    else
    {
      $stmt = $conn->prepare("INSERT INTO currenttask (username, task) VALUES (?,?)");
      if ($stmt==FALSE)
      {
        echo "There is a problem with prepare <br>";
        echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
      }
      $stmt->bind_param("si", $userName, $task);
      $stmt->execute();   
      return;
    }
  }
  
  // Prepare the sql restrictions
  $stmt = $conn->prepare("SELECT * FROM restrictions WHERE username = ?");
  if ($stmt==FALSE)
  {
  	echo "There is a problem with prepare <br>";
  	echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
  }
  $stmt->bind_param("s", $userName);

  $stmt->execute();               // Run query
  $result = $stmt->get_result();  // query result

  if ($result->num_rows != 0)     // Results returned
  {
    $row = $result->fetch_assoc(); // Fetch a result row as an associative array
    echo json_encode($row, JSON_PRETTY_PRINT);    // Return data encoded in JSON
    return;
  }
  else
  {
    echo "None";
  }

  $conn->close();
}
else
{
  echo "Error 2";
}

?>
