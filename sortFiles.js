var user;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  // Checks if user is logged in
  if (user == undefined) {
    //alert("Please log into your account.");
    //window.open("Login.html", "_self", false);   // Goes back to the login page
  }

  loadData();
}

function loadData() {
  goalState = sessionStorage.getItem("sortFilesGoal");
  position = sessionStorage.getItem("filesSorted");

  if (position == undefined) {
    position = 0;
    sessionStorage.setItem("filesSorted", position);
  }

  if (position > goalState) {
    alert("goal complete");
    sessionStorage.setItem("filesSorted", 0);
    window.open("TestingHomepage.html", "_self", false);
  }

  document.getElementById("fileIdentifier").innerHTML = generateFileName();
}

function generateFileName() {
  text = "";
  start = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  text += start.charAt(Math.floor(Math.random() * possible.length));

  for (var i = 0; i < 7; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  text += ".pdf";
  return text;
}

function submitData() {
  fileName = document.getElementById("fileIdentifier").innerHTML;
  content = document.getElementById("sortFile").value;

  if (content == 'ns') {
    alert("Please select an option for the appointment");
    return;
  }

  temp = new Object();
  temp.username = user;
  temp.filename = fileName;
  temp.selected = content;
  sendData(temp);
}

function sendData(temp) {
  var requestURL = "http://localhost:8888/PsychPHP/sortFiles.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = confirmSave;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('action=' + encodeURIComponent('submit') + '&content=' + JSON.stringify(temp));
}

function confirmSave() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        if (response == 'Success') {
          alert("File saved in folder");
          position = sessionStorage.getItem("filesSorted");
          sessionStorage.setItem("filesSorted", parseInt(position) + 1);
          loadData();
        } else {
          alert("Something went wrong. Please try again in a few seconds");
        }
      } else {
        alert('There was a problem with the save.');
      }
    }
    return 1;
  } catch (e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: ' + e.description);
  }
}
