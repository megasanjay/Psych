var user;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  // Checks if user is logged in
  if (user == undefined) {
    //alert("Please log into your account.");
    //window.open("Login.html", "_self", false);   // Goes back to the login page
  }
  checkRestrictions();
}

function checkRestrictions() {
  var requestURL = "http://localhost:8888/PsychPHP/Tester.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = imposeRestrictions;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(user) + "&action=" + encodeURIComponent("request"));
}

function setCurrentState(taskNum) {
  var requestURL = "http://localhost:8888/PsychPHP/Tester.php";
  httpRequest = new XMLHttpRequest()
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(user) + "&action=" + encodeURIComponent("setCurrentState") + "&task=" + encodeURIComponent(taskNum));
}

function task(taskNum) {

  setCurrentState(taskNum);

  switch (taskNum) {
    case 1:
      //sessionStorage.setItem("variablename", variable value);
      sessionStorage.setItem("financialGoal", 50);
      window.open("financialInfo.html", "_self", false);
      break;
    case 2:
      // do task 2
      //sessionStorage.setItem("lastMemoViewed", 0);
      sessionStorage.setItem("memoGoal", 2);
      window.open("editMemo.html", "_self", false);
      break;
    case 3:
      sessionStorage.setItem("crossCheckGoal", 50);
      window.open("crossCheck.html", "_self", false);
      break;
    case 4:
      // do task 4
      sessionStorage.setItem("sortFilesGoal", 50);
      window.open("sortFiles.html", "_self", false);
      break;
    case 5:
      // do task 5
      sessionStorage.setItem("percentageGoal", 50);
      window.open("calculatePercentages.html", "_self", false);
      break;
    case 6:
      // do task 6
      sessionStorage.setItem("labelApptGoal", 10);
      sessionStorage.setItem("lastApptViewed", 0);
      window.open("labelAppointment.html", "_self", false);
      break;
    default:
      break;
  }
}

function restrictControls(response) {
  for (let i = 0; i < response.length; i++) {
    restriction = response[i];
    limiter = restriction.Limiter;
    limited = restriction.Limited;

    document.getElementById(limited).enabled = false;
  }
}

function resetAllButtons() {
  temp = document.getElementsByClassName("taskButton");

  for (i = 0; i < temp.length; i++) {
    temp[i].enabled = true;
    temp[i].classList.remove("restricted");
    temp[i].classList.add("unrestricted");
  }
}

function imposeRestrictions() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;

        if (response == "None") {
          resetAllButtons();
        } else {
          response = JSON.parse(response);
          restrictControls(response);
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
