<?php

$servername = 'localhost'; // default server name
$username = 'psychUser'; // user name that you created
$password = 'N20t54TjPQKEmVhl'; // password that you created
$dbname = 'psych';

if (!empty($_POST))
{
  $infoArray = $_POST['info'];

  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);

  // Check connection
  if ($conn->connect_error)
  {
    die("Connection failed: " . $conn->connect_error ."<br>");
  }
  
  $infoArray = json_decode($infoArray);
  
  foreach($infoArray as $arrayObject)
  {
    $arrayObject = json_decode($arrayObject);
    $id = $arrayObject->recordNum;
    $tblUsername = $arrayObject->recordUsername;
    $recordDate = $arrayObject->recordDate;
    $recordCheckNumber = $arrayObject->recordCheckNumber;
    $recordAmount = $arrayObject->recordAmount;
    
    // Prepare the sql restrictions
    $stmt = $conn->prepare("SELECT * FROM financialinfo WHERE username = ? AND recordnum = ?");
    
    if ($stmt == FALSE)
    {
      echo "There is a problem with prepare <br>";
      echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
    }
    $stmt->bind_param("si", $tblUsername, $id);
    
    $stmt->execute();               // Run query
    $result = $stmt->get_result();  // query result
    
    if ($result->num_rows != 0)     // Results returned
    {
      $stmt = $conn->prepare("UPDATE financialinfo SET recorddate = ?, checknumber = ?, amount = ? WHERE username = ? AND recordnum = ?");
      
      if ($stmt==FALSE)
      {
      	echo "There is a problem with prepare <br>";
      	echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
      }
      $stmt->bind_param("sidsi", $recordDate, $recordCheckNumber, $recordAmount, $tblUsername, $id);
      $stmt->execute(); // Run query
      
    }
    else
    {
      $stmt = $conn->prepare("INSERT INTO financialinfo (recordnum, username, recorddate, checknumber, amount) VALUES (?, ?, ?, ?, ?)");
      
      if ($stmt==FALSE)
      {
      	echo "There is a problem with prepare <br>";
      	echo $conn->error; // Need to connect/reconnect before the prepare call otherwise it doesnt work
      }
      $stmt->bind_param("isssd", $id, $tblUsername, $recordDate, $recordCheckNumber, $recordAmount);
      $stmt->execute(); // Run query
    }
  }
  
  $conn->close();
}
else
{
  echo "Error 2";
}

?>
