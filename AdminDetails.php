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
  
  if ($action == 'requestTask')
  {
    $sql = "SELECT tasknum FROM currenttask WHERE username = '{$userName}'";
    $result = mysqli_query($conn,$sql);
    
    if ($result->num_rows != 0) 
    {
      $row = mysqli_fetch_assoc($result);
      echo $row["tasknum"];
    }
    else
    {
      echo "No Task";
    }
    return;
  }
  
  if ($action == 'requestGoals')
  {
    $user = $_POST["user"];
    $sql = "SELECT * FROM goals WHERE username = '{$userName}' ORDER BY id DESC";
           
    $result = mysqli_query($conn2,$sql);

    $rows = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
      $rows[] = array($row["goaltype"],$row["goalamount"],$row["goaltimer"]); // Put the data into an associative array
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
  
  if ($action == 'saveLogin')
  {
    $infoArray = $_POST['info'];
    $infoArray = json_decode($infoArray);
    
    foreach($infoArray as $arrayObject)
    {
      $arrayObject = json_decode($arrayObject);
      $recordUsername = $arrayObject->recordUsername;
      $recordPassword = $arrayObject->recordPassword;
      $recordEmail = $arrayObject->recordEmail;
      $recordAdmin = $arrayObject->recordAdmin;
      $recordFinancial = $arrayObject->recordFinancial;
      $recordMemo = $arrayObject->recordMemo;
      $recordCrossCheck = $arrayObject->recordCrossCheck;
      $recordSortFiles = $arrayObject->recordSortFiles;
      $recordPercentage = $arrayObject->recordPercentage;
      $recordAppointments = $arrayObject->recordAppointments;
    
      $stmt = $conn->prepare("SELECT * FROM logininfo WHERE username = ?");

      if ($stmt == FALSE)
      {
        echo "There is a problem with prepare <br>";
        echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
      }
      $stmt->bind_param("s", $recordUsername);

      $stmt->execute();               // Run query
      $result = $stmt->get_result();  // query result
    
      if ($result->num_rows != 0)     // Results returned
      {
        $stmt = $conn->prepare("UPDATE logininfo SET password = ?, emailaddress = ?, admin = ?, financial = ?, memo = ? , crosscheck = ? , sortfiles = ?, percentage = ?, appointments = ? WHERE username = ?");

        if ($stmt==FALSE)
        {
          echo "There is a problem with prepare <br>";
          echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
        }
        $stmt->bind_param("ssiiiiiiis", $recordPassword, $recordEmail, $recordAdmin, $recordFinancial, $recordMemo, $recordCrossCheck, $recordSortFiles, $recordPercentage, $recordAppointments, $recordUsername);
        $stmt->execute(); // Run query
      }
      else
      {
        $stmt = $conn->prepare("INSERT INTO logininfo (username, password, emailaddress, admin, financial, memo, crosscheck, sortfiles, percentage, appointments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        if ($stmt==FALSE)
        {
          echo "There is a problem with prepare <br>";
          echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
        }
        $stmt->bind_param("sssiiiiiii", $recordUsername, $recordPassword, $recordEmail, $recordAdmin, $recordFinancial, $recordMemo, $recordCrossCheck, $recordSortFiles, $recordPercentage, $recordAppointments);
        $stmt->execute(); // Run query
      }
    }
    return;
  }
  
  if ($action == 'saveRestriction')
  {
    $infoArray = $_POST['info'];
    $infoArray = json_decode($infoArray);
    
    $sql = "DELETE FROM restrictions ";
    $result = mysqli_query($conn,$sql);
    
    foreach($infoArray as $arrayObject)
    {
      $arrayObject = json_decode($arrayObject);
      $recordUsername = $arrayObject->recordUsername;
      $recordLimiter = $arrayObject->recordLimiter;
      $recordLimited = $arrayObject->recordLimited;
      $recordDay = $arrayObject->recordDay;
      
      $stmt = $conn->prepare("INSERT INTO restrictions (username, limiter, limited, day) VALUES (?, ?, ?, ?)");

      if ($stmt==FALSE)
      {
        echo "There is a problem with prepare <br>";
        echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
      }
      
      $stmt->bind_param("siii", $recordUsername, $recordLimiter, $recordLimited, $recordDay);
      $stmt->execute(); // Run query
    }
    return;
  }
  
  if ($action == 'requestRestrictions')
  {
    $sql = "SELECT * FROM restrictions ORDER BY username ASC";        
    $result = mysqli_query($conn,$sql);

    $rows = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
      $rows[] = array("username"=>$row["username"],"limiter"=>$row["limiter"],"limited"=>$row["limited"],"day"=>$row["day"]); // Put the data into an associative array
    }
    
    if ($result->num_rows != 0)          // Results returned increment comment ID value for new comment
    {
      echo json_encode($rows);    // Json encode the data to send back
      $conn->close();
      return;
    }
    else
    {
      $temp[] = array("", "", "", "");
      echo json_encode($temp);
      return;
    }
  }
  
  if ($action == 'requestLogin')
  {
    $sql = "SELECT * FROM logininfo ORDER BY username ASC";        
    $result = mysqli_query($conn,$sql);

    $rows = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
      if ($row["username"] != 'robbyn')
      {
        $rows[] = array("username"=>$row["username"], "password"=>$row["password"], "emailaddress"=>$row["emailaddress"], "financial"=>$row["financial"], "memo"=>$row["memo"], "crosscheck"=>$row["crosscheck"], "sortfiles"=>$row["sortfiles"], "percentage"=>$row["percentage"], "appointments"=>$row["appointments"]); // Put the data into an associative array
      }
    }
    
    if ($result->num_rows != 0)          // Results returned increment comment ID value for new comment
    {
      echo json_encode($rows);    // Json encode the data to send back
      $conn->close();
      return;
    }
    else
    {
      $temp[] = array("", "", "", "", "", "", "", "", "");
      echo json_encode($temp);
      return;
    }
  }
  
  if ($action == 'financial')
  {
    if (isset($_POST['reload']))
    {
      $sql = "SELECT * FROM financialinfo WHERE username = '{$userName}' ORDER BY recordnum ASC"; 
    }
    else
    {
      $sql = "SELECT * FROM financialinfo WHERE username = '{$userName}' ORDER BY recordnum DESC";        
    }
            
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
      $temp[] = array("", "");
      echo json_encode($temp);
      return;
    }
  }
  
  if ($action == 'crossCheck')
  {
    if (isset($_POST['reload']))
    {
      $sql = "SELECT * FROM crosscheck WHERE username = '{$userName}' ORDER BY recordnum ASC"; 
    }
    else
    {
      $sql = "SELECT * FROM crosscheck WHERE username = '{$userName}' ORDER BY recordnum DESC";        
    }
           
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
    if (isset($_POST['reload']))
    {
      $sql = "SELECT * FROM percentageinput WHERE username = '{$userName}' ORDER BY recordnum ASC";
    }
    else
    {
      $sql = "SELECT * FROM percentageinput WHERE username = '{$userName}' ORDER BY recordnum DESC";        
    }
    
    $result = mysqli_query($conn2,$sql);

    $rows = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
      $rows[] = array($row["apptattend"],$row["apptlate"],$row["apptnotattend"],$row["percentattend"],$row["percentlate"]); // Put the data into an associative array
    }
    
    if (count($rows) > 4)          // Results returned increment comment ID value for new comment
    {
      echo json_encode($rows);    // Json encode the data to send back
      $conn->close();
      return;
    }
    else
    {
      $temp[] = array(9, 3, 8, "", "");
      $temp[] = array(10, 6, 3, "", "");
      $temp[] = array(1, 0, 2, "", "");
      $temp[] = array(2, 1, 2, "", "");
      $temp[] = array(2, 1, 2, "", "");
      echo json_encode($temp);
      return;
    }
  }
  
  if ($action == 'memo')
  {
    $sql = "SELECT * FROM memoinput WHERE username = '{$userName}' ORDER BY id DESC LIMIT 1";        
    $result = mysqli_query($conn2,$sql);
    
    if ($result->num_rows != 0)
    {
      $row = mysqli_fetch_assoc($result);
      $row = $row["memotext"];
    }
    else
    {
      $row = "No Text";
    }
    echo $row;
    return;
  }
  
  if ($action == 'labelAppointment')
  {
    $sql = "SELECT labelappointmentinfo.firstname AS firstname, labelappointmentinfo.lastname AS lastname, labelappointmentinfo.apptnum AS apptnum, labelappointmentinput.selected AS selected FROM labelappointmentinput, labelappointmentinfo WHERE labelappointmentinput.username = '{$userName}' AND labelappointmentinput.position = labelappointmentinfo.id";        
    $result = mysqli_query($conn2,$sql);

    $rows = array();
    
    while($row = mysqli_fetch_assoc($result))
    {
      $rows[] = array($row["firstname"],$row["lastname"], $row["apptnum"], $row["selected"]); // Put the data into an associative array
    }
    
    if (count($rows) > 0)          // Results returned increment comment ID value for new comment
    {
      echo json_encode($rows);    // Json encode the data to send back
      $conn->close();
      return;
    }
    else
    {
      $temp[] = array("", "", "", "");
      echo json_encode($temp);
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
  echo "You shouldn't be here";
}

?>
