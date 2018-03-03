var hot;
var rowCount = 9;
var colCount = 5;
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
  position = sessionStorage.getItem("lastApptViewed");
  goalState = sessionStorage.getItem("labelApptGoal");

  if (position == undefined) {
    position = 0;
    sessionStorage.setItem("lastApptViewed", position);
  }

  if (position > goalState) {
    alert("goal complete");
    sessionStorage.removeItem("lastApptViewed");
    window.open("TestingHomepage.html", "_self", false);
  }

  requestData(position);
}

function requestData(position) {
  var requestURL = "http://localhost:8888/PsychPHP/editMemo.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = displayMemo;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('action=' + encodeURIComponent('request') + '&position=' + encodeURIComponent(position));
}

function submitMemo() {
  position = sessionStorage.getItem("lastMemoViewed");
  content = document.getElementById("editTextBox").value;
  sendMemo(position, content);
}

function sendMemo(position, content) {
  var requestURL = "http://localhost:8888/PsychPHP/editMemo.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = confirmSave;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('action=' + encodeURIComponent('submit') + '&username=' + encodeURIComponent(user) + '&position=' + encodeURIComponent(position) + '&memo=' + encodeURIComponent(content));
}

function displayMemo() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;

        document.getElementById("editTextBox").value = response;
      } else {
        alert('There was a problem with the request.');
      }
    }
    return 1;
  } catch (e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: ' + e.description);
  }
}

function confirmSave() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        if (response == 'Success') {
          alert("Memo edits saved");
          position = sessionStorage.getItem("lastMemoViewed");
          sessionStorage.setItem("lastMemoViewed", parseInt(position) + 1);
          loadMemo();
        } else {
          alert("Something went wrong. Please try again in a few seconds");
        }
      } else {
        alert('There was a problem with the request.');
      }
    }
    return 1;
  } catch (e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: ' + e.description);
  }
}
