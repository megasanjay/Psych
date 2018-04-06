var user;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  // Checks if user is logged in
  if (user == undefined) {
    alert("Please log into your account.");
    window.open("Login.html", "_self", false); // Goes back to the login page
  }

  var currentStatus = sessionStorage.getItem("currentStatus");

  if (currentStatus == undefined) {
    sessionStorage.setItem("currentStatus", "loadedRestrictions");
    sessionStorage.setItem("limitors", "[]");
    checkRestrictions();
  }
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
  if (checkLegality(taskNum) == false) {
    return;
  };

  switch (taskNum) {
    case 1:
      //sessionStorage.setItem("variablename", variable value);
      window.open("financialInfo.html", "_self", false);
      break;
    case 2:
      // do task 2
      window.open("editMemo.html", "_self", false);
      break;
    case 3:
      window.open("crossCheck.html", "_self", false);
      break;
    case 4:
      // do task 4
      window.open("sortFiles.html", "_self", false);
      break;
    case 5:
      // do task 5
      window.open("calculatePercentages.html", "_self", false);
      break;
    case 6:
      // do task 6
      window.open("labelAppointment.html", "_self", false);
      break;
    default:
      break;
  }
}

function checkLegality(taskNum) {
  let limitArray = sessionStorage.getItem("limitors");
  limitArray = JSON.parse(limitArray);
  alert(limitArray[0].limited);
  for (let i = 0; i < limitArray.length; i++) {
    if (limitArray[i].limited == taskNum && limitArray[i].status == "notMet") {
      alert("Condition Not Met");
      //do something else;
      return false;
    }
  }
  return true;
}

function dayOneGoals() {
  setfunctionalGoals();
  sessionStorage.setItem("day", 1);
  sessionStorage.setItem("currentStatus", "dayOneTesting");
}

function restrictControls(response) {
  for (let i = 0; i < response.length; i++) {
    var restriction = response[i];
    if (restriction.day == 1) {
      dayOneGoals();
      return;
    } else {
      limiter = restriction.limiter;
      limited = restriction.limited;
      setGoals(limiter, limited);

      //document.getElementById(limited).enabled = false;
    }
  }
  setfunctionalGoals();
}

function setfunctionalGoals() {
  sessionStorage.setItem("financialGoal", 10);
  sessionStorage.setItem("memoGoal", 3);
  sessionStorage.setItem("crossCheckGoal", 10);
  sessionStorage.setItem("sortFilesGoal", 10);
  sessionStorage.setItem("percentageGoal", 10);
  sessionStorage.setItem("labelApptGoal", 10);
}

function setGoals(limiter, limited) {
  var temp = new Object();
  temp.limiter = limiter;
  temp.limited = limited;
  temp.status = "notMet";

  var limitArray = sessionStorage.getItem("limitors");
  limitArray = JSON.parse(limitArray);
  limitArray.push(temp);
  limitArray = JSON.stringify(limitArray);
  sessionStorage.setItem("limitors", limitArray);
}

function resetAllButtons() {
  var temp = document.getElementsByClassName("taskButton");

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
