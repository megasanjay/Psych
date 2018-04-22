var user;
var taskNumber;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  // Checks if user is logged in
  if (user == undefined) {
    alert("Please log into your account.");
    window.open("Login.html", "_self", false); // Goes back to the login page
  }

  var loadState = sessionStorage.getItem("loadState");

  if (loadState == undefined) {
    sessionStorage.setItem("limitors", "[]");
    checkRestrictions();
  }

  styleButtons(loadState);
}

function styleButtons(loadState) {
  if (loadState == "noRestrictions") {
    var temp = document.getElementsByClassName("shadow");

    for (let i = 0; i < temp.length; i++) {
      temp[i].classList.remove("yellow");
      temp[i].classList.remove("purple");
      temp[i].classList.add("blue");
    }
  }

  if (loadState == "restrictionsPresent") {
    let limitArray = sessionStorage.getItem("limitors");
    limitArray = JSON.parse(limitArray);
    for (let i = 0; i < limitArray.length; i++) {
      if (limitArray[i].limited == 1 && limitArray[i].status == "notMet") {
        limitedNotMetColor("financial");
      }
      if (limitArray[i].limited == 2 && limitArray[i].status == "notMet") {
        limitedNotMetColor("memo");
      }
      if (limitArray[i].limited == 3 && limitArray[i].status == "notMet") {
        limitedNotMetColor("crosscheck");
      }
      if (limitArray[i].limited == 4 && limitArray[i].status == "notMet") {
        console.log('asd');
        limitedNotMetColor("sort");
      }
      if (limitArray[i].limited == 5 && limitArray[i].status == "notMet") {
        limitedNotMetColor("percentage");
      }
      if (limitArray[i].limited == 6 && limitArray[i].status == "notMet") {
        limitedNotMetColor("appointment");
      }
      if (limitArray[i].limited == 1 && limitArray[i].status == "Met") {
        limitedMetColor("financial");
      }
      if (limitArray[i].limited == 2 && limitArray[i].status == "Met") {
        limitedMetColor("memo");
      }
      if (limitArray[i].limited == 3 && limitArray[i].status == "Met") {
        limitedMetColor("crosscheck");
      }
      if (limitArray[i].limited == 4 && limitArray[i].status == "Met") {
        limitedMetColor("sort");
      }
      if (limitArray[i].limited == 5 && limitArray[i].status == "Met") {
        limitedMetColor("percentage");
      }
      if (limitArray[i].limited == 6 && limitArray[i].status == "Met") {
        limitedMetColor("appointment");
      }
      if (limitArray[i].limiter == 1) {
        limiterColor("financial");
      }
      if (limitArray[i].limiter == 2) {
        limiterColor("memo");
      }
      if (limitArray[i].limiter == 3) {
        limiterColor("crosscheck");
      }
      if (limitArray[i].limiter == 4) {
        limiterColor("sort");
      }
      if (limitArray[i].limiter == 5) {
        limiterColor("percentage");
      }
      if (limitArray[i].limiter == 6) {
        limiterColor("appointment");
      }
    }
    return true;
  }
}

function limitedNotMetColor(name) {
  document.getElementById(name).classList.remove("blue");
  document.getElementById(name).classList.remove("yellow");
  document.getElementById(name).classList.add("purple");
}

function limitedMetColor(name) {
  document.getElementById(name).classList.add("blue");
  document.getElementById(name).classList.remove("yellow");
  document.getElementById(name).classList.remove("purple");
}

function limiterColor(name) {
  document.getElementById(name).classList.remove("blue");
  document.getElementById(name).classList.add("yellow");
  document.getElementById(name).classList.remove("purple");
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

  taskNumber = taskNum;
  getGoal(taskNum);
}

function getGoal(taskNum) {
  var requestURL = "http://localhost:8888/PsychPHP/Tester.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = alertGetGoal;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  switch (taskNum) {
    case 1:
      httpRequest.send('userName=' + encodeURIComponent(user) + "&action=" + encodeURIComponent("getGoal") + "&field=" + encodeURIComponent("financial"));
      break;
    case 2:
      httpRequest.send('userName=' + encodeURIComponent(user) + "&action=" + encodeURIComponent("getGoal") + "&field=" + encodeURIComponent("memo"));
      break;
    case 3:
      httpRequest.send('userName=' + encodeURIComponent(user) + "&action=" + encodeURIComponent("getGoal") + "&field=" + encodeURIComponent("crosscheck"));
      break;
    case 4:
      httpRequest.send('userName=' + encodeURIComponent(user) + "&action=" + encodeURIComponent("getGoal") + "&field=" + encodeURIComponent("sortfiles"));
      break;
    case 5:
      httpRequest.send('userName=' + encodeURIComponent(user) + "&action=" + encodeURIComponent("getGoal") + "&field=" + encodeURIComponent("percentage"));
      break;
    case 6:
      httpRequest.send('userName=' + encodeURIComponent(user) + "&action=" + encodeURIComponent("getGoal") + "&field=" + encodeURIComponent("appointments"));
      break;
    default:
      break;
  }
}

function alertGetGoal() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;

        if (response == "None") {
          alert("No goals have been set. Please contact the administrator.");
        } else {
          sessionStorage.setItem("tempGoal", response);
          moveToPage(taskNumber);
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

function moveToPage(taskNum) {
  switch (taskNum) {
    case 1:
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

  sessionStorage.setItem("financialGoal", 99999999999);
  sessionStorage.setItem("memoGoal", 99999999999);
  sessionStorage.setItem("crossCheckGoal", 99999999999);
  sessionStorage.setItem("sortFilesGoal", 99999999999);
  sessionStorage.setItem("percentageGoal", 99999999999);
  sessionStorage.setItem("labelApptGoal", 99999999999);
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
    }
  }
  sessionStorage.setItem("loadState", "restrictionsPresent");
  styleButtons(sessionStorage.getItem("loadState"));
  setfunctionalGoals();
}

function setfunctionalGoals() {
  // add code to make button dissappear here or in the else above
  sessionStorage.setItem("financialGoal", 0);
  sessionStorage.setItem("memoGoal", 3);
  sessionStorage.setItem("crossCheckGoal", 0);
  sessionStorage.setItem("sortFilesGoal", 10);
  sessionStorage.setItem("percentageGoal", 0);
  sessionStorage.setItem("labelApptGoal", 3);
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
          sessionStorage.setItem("loadState", "noRestrictions");
          resetAllButtons();
        } else {
          sessionStorage.setItem("loadState", "loadedRestrictions");
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
