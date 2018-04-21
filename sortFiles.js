var user;
var tempGoal, goalStatus;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  tempGoal = sessionStorage.getItem("tempGoal");

  // Checks if user is logged in
  if (user == undefined) {
    sessionStorage.clear();
    alert("Please log into your account.");
    window.open("Login.html", "_self", false); // Goes back to the login page
  }

  checkRestrictions();
  loadData();
}

function checkRestrictions() {
  var sortFilesGoal = sessionStorage.getItem("sortFilesGoal");
  var limitArray = sessionStorage.getItem("limitors");
  limitArray = JSON.parse(limitArray);

  if (sessionStorage.getItem("currentStatus") == "dayOneTesting") {
    goalStatus = "dayOneGoals";
    return;
  } else {
    goalStatus = "restricted";
  }

  for (let i = 0; i < limitArray.length; i++) {
    if (limitArray[i].limiter == 4 && limitArray[i].status == "notMet") {
      goalStatus = "limiterGoals";
      break;
    }
    if (limitArray[i].limited == 4 && limitArray[i].status == "Met") {
      goalStatus = "limitedGoals";
      break;
    }
  }
}

function loadData() {
  position = sessionStorage.getItem("filesSorted");

  if (position == undefined) {
    position = 0;
    sessionStorage.setItem("filesSorted", position);
    sessionStorage.setItem("sortFilesGoal", tempGoal);
  }

  checkForCompletion(position);

  document.getElementById("fileIdentifier").innerHTML = generateFileName();

  document.getElementById("sortFile").selectedIndex = 0;
}

function checkForCompletion(position) {
  var goal = sessionStorage.getItem("sortFilesGoal");

  if (goalStatus == "dayOneGoals") {
    return;
  }

  if (parseInt(position) >= parseInt(goal)) {
    sessionStorage.removeItem("filesSorted");
    if (goalStatus != "limitedGoals") {
      alert("Goal Complete!");
    }

    if (goalStatus == "limiterGoals") {
      let limitArray = sessionStorage.getItem("limitors");
      limitArray = JSON.parse(limitArray);

      for (let i = 0; i < limitArray.length; i++) {
        if (limitArray[i].limiter == 4 && limitArray[i].status == "notMet") {
          limitArray[i].status = "Met";
        }
      }
      limitArray = JSON.stringify(limitArray);
      sessionStorage.setItem("limitors", limitArray);
    }
    if (goalStatus == "limitedGoals") {
      let limitArray = sessionStorage.getItem("limitors");
      limitArray = JSON.parse(limitArray);

      for (let i = 0; i < limitArray.length; i++) {
        if (limitArray[i].limited == 4) {
          limitArray[i].status = "notMet";
        }
      }
      limitArray = JSON.stringify(limitArray);
      sessionStorage.setItem("limitors", limitArray);
    }
    window.open("TestingHomepage.html", "_self", false);
  }

}

function generateFileName() {
  text = "";
  start = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
  possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  text += start.charAt(Math.floor(Math.random() * start.length));

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
    return false;
  }

  runSaveAnimation();

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
        alert("Something went wrong with the save. Please contact the System Administrator");
      }
    }
    return 1;
  } catch (e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: ' + e.description);
  }
}

function runSaveAnimation() {
  var wedge = document.getElementById("refreshing");

  wedge.classList.remove("hidden");
  wedge.classList.add("shown");

  setTimeout(function () {
    var wedge = document.getElementById("refreshing");

    wedge.classList.remove("shown");
    wedge.classList.add("hidden");
  }, 600);
}
