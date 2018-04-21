var user, startPos;
var tempGoal, goalStatus;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  tempGoal = sessionStorage.getItem("tempGoal");

  // Checks if user is logged in
  if (user == undefined) {
    alert("Please log into your account.");
    window.open("Login.html", "_self", false); // Goes back to the login page
  }

  startPos = sessionStorage.getItem("lastMemoViewed");

  if (startPos == undefined) {
    startPos = 1;
  }

  checkRestrictions();
  setInterval(submitChanges, 5000);
  loadMemo();
}

function checkRestrictions() {
  var memoGoal = sessionStorage.getItem("memoGoal");
  var limitArray = sessionStorage.getItem("limitors");
  limitArray = JSON.parse(limitArray);

  if (sessionStorage.getItem("currentStatus") == "dayOneTesting") {
    goalStatus = "dayOneGoals";
    return;
  } else {
    goalStatus = "restricted";
  }

  for (let i = 0; i < limitArray.length; i++) {
    if (limitArray[i].limiter == 2 && limitArray[i].status == "notMet") {
      goalStatus = "limiterGoals";
      break;
    }
    if (limitArray[i].limited == 2 && limitArray[i].status == "Met") {
      //tempGoal = parseInt(startPos) + parseInt(limiterGoal);
      goalStatus = "limitedGoals";
      break;
    }
  }
}

function loadMemo() {
  position = sessionStorage.getItem("lastMemoViewed");
  goalState = sessionStorage.getItem("memoGoal");

  if (position == undefined) {
    position = 1;
    sessionStorage.setItem("lastMemoViewed", position);
    startPos = position;
    sessionStorage.setItem("memoGoal", tempGoal);
  }

  checkForCompletion(position);
  requestMemo(position);
}

function checkForCompletion(position) {
  var goal = sessionStorage.getItem("memoGoal");

  if (goalStatus == "dayOneGoals") {
    return;
  }

  if (parseInt(position) > parseInt(goal)) {
    sessionStorage.setItem("memoGoal", parseInt(goal) + parseInt(tempGoal));
    sessionStorage.setItem("currentStatus", "goalMet");

    if (goalStatus == "limitedGoals") {
      //sessionStorage.setItem("memoGoal", parseInt(memoGoal) + parseInt(limitedGoal));
    } else {
      alert("Goal Complete!");
      //sessionStorage.setItem("memoGoal", parseInt(memoGoal) + parseInt(limiterGoal));
    }

    if (goalStatus == "limiterGoals") {
      let limitArray = sessionStorage.getItem("limitors");
      limitArray = JSON.parse(limitArray);

      for (let i = 0; i < limitArray.length; i++) {
        if (limitArray[i].limiter == 2 && limitArray[i].status == "notMet") {
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
        if (limitArray[i].limited == 2) {
          limitArray[i].status = "notMet";
        }
      }
      limitArray = JSON.stringify(limitArray);
      sessionStorage.setItem("limitors", limitArray);
    }
    window.open("TestingHomepage.html", "_self", false);
  }
}

function requestMemo(position) {
  var requestURL = "http://localhost:8888/PsychPHP/editMemo.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = displayMemo;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('action=' + encodeURIComponent('request') + '&position=' + encodeURIComponent(position));
}

function submitMemo() {
  runSaveAnimation();
  position = sessionStorage.getItem("lastMemoViewed");
  content = document.getElementById("editTextBox").value;
  sendMemo(position, content);
}

function submitChanges() {
  position = sessionStorage.getItem("lastMemoViewed");
  content = document.getElementById("editTextBox").value;
  var requestURL = "http://localhost:8888/PsychPHP/editMemo.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('action=' + encodeURIComponent('submit') + '&username=' + encodeURIComponent(user) + '&position=' + encodeURIComponent(position) + '&memo=' + encodeURIComponent(content));
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
