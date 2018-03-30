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
  
  if ($action == 'requestParticipants')
  {
    $sql = "SELECT * FROM currenttask ORDER BY username ASC";        
    $result = mysqli_query($conn,$sql);

    $rows = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
      $rows[] = array("username"=>$row["username"],"tasknum"=>$row["tasknum"]); // Put the data into an associative array
    }
    
    if ($result->num_rows != 0)          // Results returned increment comment ID value for new comment
    {
      echo json_encode($rows);    // Json encode the data to send back
      $conn->close();
      return;
    }
    else
    {
      echo "empty";
      return;
    }
  }
  
  if ($action == 'financial')
  {
    $sql = "SELECT * FROM financialinfo WHERE username = '{$userName}' ORDER BY recordnum DESC";        
    $result = mysqli_query($conn2,$sql);

    $rows = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
      $rows[] = array($row["recorddate"],$row["checknumber"], $row["amount"]); // Put the data into an associative array
    }
    
    if (count($rows) > 0)          // Results returned increment comment ID value for new comment
    {
      echo json_encode($rows);    // Json encode the data to send back
      $conn->close();
      return;
    }
    else
    {
      $temp[] = array("", "", "");
      echo json_encode($temp);
      return;
    }
  }
  
  if ($action == 'files')
  {
    $sql = "SELECT * FROM sortedfiles WHERE username = '{$userName}' ORDER BY recordnum DESC";        
    $result = mysqli_query($conn2,$sql);

    $rows = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
      $rows[] = array($row["inputfile"],$row["selected"]); // Put the data into an associative array
    }
    
    if (count($rows) > 0)          // Results returned increment comment ID value for new comment
    {
      echo json_encode($rows);    // Json encode the data to send back
      $conn->close();
      return;
    }
    else
    {
      echo "[]";
      return;
    }
  }
  
  if ($action == 'crossCheck')
  {
    $sql = "SELECT * FROM crosscheck WHERE username = '{$userName}' ORDER BY recordnum DESC";        
    $result = mysqli_query($conn2,$sql);

    $rows = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
      $rows[] = array($row["recordDate"],$row["patientName"],$row["patientAge"],$row["patientHeight"],$row["patientWeight"]); // Put the data into an associative array
    }
    
    if (count($rows) > 0)          // Results returned increment comment ID value for new comment
    {
      echo json_encode($rows);    // Json encode the data to send back
      $conn->close();
      return;
    }
    else
    {
      $temp[] = array("", "", "", "", "");
      echo json_encode($temp);
      return;
    }
  }
  
  if ($action == 'percentage')
  {
    $sql = "SELECT * FROM percentageinput WHERE username = '{$userName}' ORDER BY recordnum ASC";        
    $result = mysqli_query($conn2,$sql);

    $rows = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
      $rows[] = array($row["data1"],$row["data2"]); // Put the data into an associative array
    }
    
    if (count($rows) > 0)          // Results returned increment comment ID value for new comment
    {
      echo json_encode($rows);    // Json encode the data to send back
      $conn->close();
      return;
    }
    else
    {
      echo "[]";
      return;
    }
  }
  
  if ($action == 'memo')
  {
    $sql = "SELECT * FROM memoinput WHERE username = '{$userName}' ORDER BY id DESC LIMIT 1";        
    $result = mysqli_query($conn2,$sql);

    $rows = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
      $rows[] = array($row["data1"],$row["data2"]); // Put the data into an associative array
    }
    
    if (count($rows) > 0)          // Results returned increment comment ID value for new comment
    {
      echo json_encode($rows);    // Json encode the data to send back
      $conn->close();
      return;
    }
    else
    {
      echo "[]";
      return;
    }
  }
  
  if ($action == 'labelAppointment')
  {
    $sql = "SELECT labelappointmentinfo.firstname AS firstname, labelappointmentinfo.lastname AS lastname, labelappointmentinfo.age AS age, labelappointmentinput.selected AS selected FROM labelappointmentinput, labelappointmentinfo WHERE labelappointmentinput.username = '{$userName}' AND labelappointmentinput.position = labelappointmentinfo.id";        
    $result = mysqli_query($conn2,$sql);

    $rows = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
      $rows[] = array($row["firstname"],$row["lastname"], $row["age"], $row["selected"]); // Put the data into an associative array
    }
    
    if (count($rows) > 0)          // Results returned increment comment ID value for new comment
    {
      echo json_encode($rows);    // Json encode the data to send back
      $conn->close();
      return;
    }
    else
    {
      echo "[]";
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
