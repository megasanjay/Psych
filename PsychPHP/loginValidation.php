<?php

$servername = 'localhost'; // default server name
$username = 'psychlogin'; // user name that you created
$password = 'YLUCndOFS3qIKwtS'; // password that you created
$dbname = 'psych';

if (!empty($_POST))
{
  $userName = $_POST['userName'];

  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);

  // Check connection
  if ($conn->connect_error)
  {
      die("Connection failed: " . $conn->connect_error ."<br>");
  }

  // Prepare the sql statement
  $stmt = $conn->prepare("SELECT * FROM LoginInfo WHERE username = ?");
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
    echo "Username does not exist";
  }

  $conn->close();
}
else
{
  echo "Error 2";
}

?>