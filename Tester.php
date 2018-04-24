<?php

$servername = 'localhost'; // default server name
$username = 'psychUser'; // user name that you created
$password = 'N20t54TjPQKEmVhl'; // password that you created
$dbname = 'psych';

if (!empty($_POST))
{
  $userName = $_POST['userName'];
  $action = $_POST['action'];
  
  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);
  $conn2 = mysqli_connect($servername, $username, $password, $dbname);

  // Check connection
  if ($conn->connect_error)
  {
    die("Connection failed: " . $conn->connect_error ."<br>");
  }
  
  if ($action == "forceRefresh")
  {
    $user = $_POST['endUser'];
    $subaction = $_POST['subaction'];
    
    if ($subaction == 'request')
    {
      $stmt = $conn->prepare("UPDATE currenttask SET refresh = 1 WHERE username = ?");
    }
    if ($subaction == 'cancel')
    {
      $stmt = $conn->prepare("UPDATE currenttask SET refresh = 0 WHERE username = ?");
    }
    
    if ($stmt==FALSE)
    {
      echo "There is a problem with prepare <br>";
      echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
    }
    $stmt->bind_param("s", $user);
    $stmt->execute();               // Run query
  }
  
  if ($action == "confirmReload")
  { 
    $stmt = $conn->prepare("UPDATE currenttask SET refresh = 0 WHERE username = ?");
    if ($stmt==FALSE)
    {
      echo "There is a problem with prepare <br>";
      echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
    }
    $stmt->bind_param("s", $userName);
    $stmt->execute();               // Run query
    
    echo "confirmed";
    return;
  }
  
  if ($action == "checkForReload")
  { 
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
      $row = $result->fetch_assoc(); // Fetch a result row as an associative array
      $response = $row["refresh"];
    }
    else
    {
      $response = "none";
    }
    echo $response;
    return;
  }
  
  if ($action == 'getGoal')
  {
    $field = $_POST['field'];
    
    $stmt = $conn->prepare("SELECT * FROM logininfo WHERE username = ?");
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
      $response = $row[$field];
    }
    else
    {
      $response = "None";
    }
    
    echo $response;
    return;
  }
  
  if ($action == 'getChoices')
  { 
    $stmt = $conn->prepare("SELECT * FROM logininfo WHERE username = ?");
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
      $temp = new stdClass;
      $temp->financial = $row["financial"];
      $temp->memo = $row["memo"];
      $temp->crosscheck = $row["crosscheck"];
      $temp->sort = $row["sortfiles"];
      $temp->percentage = $row["percentage"];
      $temp->appointment = $row["appointments"];
      $response = json_encode($temp);
    }
    else
    {
      $response = "None";
    }
    
    echo $response;
    return;
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
      return;
    }
    else
    {
      $stmt = $conn->prepare("INSERT INTO currenttask (username, tasknum) VALUES (?,?)");
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
  $sql = "SELECT * FROM restrictions WHERE username = '{$userName}'";
  
  $result = mysqli_query($conn2,$sql);
  $rows = array();
  
   if ($result->num_rows != 0)     // Results returned
   {
     while($row = mysqli_fetch_assoc($result))
    {
      $safetyCheck = $row["day"];

      if ($safetyCheck == NULL || $safetyCheck == 0)
      {
        $safetyCheck = 1;
      }

      $rows[] = array("limiter"=>$row["limiter"],"limited"=>$row["limited"], "day"=>$safetyCheck); // Put the data into an associative array
    }
   }
  else
  {
    $rows[] = array("limiter"=>0,"limited"=>0,"day"=>1); // Put the data into an associative array
  }
  
  echo json_encode($rows);
  return;
}
else
{
  echo "Error 2";
}

?>
