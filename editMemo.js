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

  loadMemo();
}

function loadMemo() {
  position = sessionStorage.getItem("lastMemoViewed");
  goalState = sessionStorage.getItem("goal");

  if (position == undefined) {
    position = 0;
    sessionStorage.setItem("lastMemoViewed", position);
  }

  if (position > goalState) {
    alert("goal complete");
    window.open("TestingHomepage.html", "_self", false);
  }

  requestMemo(position);
}

function requestMemo(position) {
  var requestURL = "http://localhost:8888/PsychPHP/editMemo.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = displayMemo;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('action=' + encodeURIComponent('request') + '&position=' + encodeURIComponent(position));
}

function sendMemo(position) {
  var requestURL = "http://localhost:8888/PsychPHP/editMemo.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = confirmSave;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('action=' + encodeURIComponent('submit') + '&username=' + encodeURIComponent(user) + '&position=' + encodeURIComponent(position) + '&memo=' + encodeURIComponent(document.getElementById('editTextBox').innerHTML));
}

function submitMemo() {
  position = sessionStorage.getItem("lastMemoViewed");
  goalState = sessionStorage.getItem("goal");

  sendMemo(position);

  position++;
  sessionStorage.setItem("lastMemoViewed", position);

}

function displayMemo() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;

        document.getElementById("editTextBox").innerHTML = response;
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
