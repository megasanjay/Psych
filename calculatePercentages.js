var hot, hooks;
var setter = true;
var tempGoal, goalStatus;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  tempGoal = sessionStorage.getItem("tempGoal");

  // Checks if user is logged in
  if (user == undefined) {
    alert("Please log into your account.");
    window.open("Login.html", "_self", false); // Goes back to the login page
  }

  if (sessionStorage.getItem("calculatePercentageTimerStatus") == "timerComplete" || sessionStorage.getItem("calculatePercentageTimerStatus") == undefined) {
    sessionStorage.setItem("calculatePercentageTimer", Date.now());
    sessionStorage.setItem("calculatePercentageTimerStatus", "timerStarted");
  }

  if (sessionStorage.getItem("day") == 1) {
    setInterval(checkForRefresh, 2000);
  }

  checkRestrictions();
  loadLastState();
}

function checkForRefresh() {
  var requestURL = "http://localhost:8888/PsychPHP/Tester.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    try {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          var response = httpRequest.responseText;
          if (response == 1) {
            var xrequestURL = "http://localhost:8888/PsychPHP/Tester.php";
            xhttpRequest = new XMLHttpRequest();
            xhttpRequest.onreadystatechange = function () {
              if (xhttpRequest.readyState === XMLHttpRequest.DONE) {
                if (xhttpRequest.status === 200) {
                  var response = xhttpRequest.responseText;
                  if (response == "confirmed") {
                    sessionStorage.setItem("reloadConfirmed", true);
                    sessionStorage.setItem("financialTimerStatus", "timerComplete");
                    sessionStorage.setItem("memoTimerStatus", "timerComplete");
                    sessionStorage.setItem("crossCheckTimerStatus", "timerComplete");
                    sessionStorage.setItem("sortFilesTimerStatus", "timerComplete");
                    sessionStorage.setItem("calculatePercentageTimerStatus", "timerComplete");
                    sessionStorage.setItem("labelApptTimerStatus", "timerComplete");
                    window.open("TestingHomepage.html", "_self", false);
                    window.open("TestingHomepage.html", "_self", false);
                  }
                }
              }
            };
            xhttpRequest.open('POST', requestURL);
            xhttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhttpRequest.send('userName=' + encodeURIComponent(user) + '&action=' + encodeURIComponent('confirmReload'));
          }
        } else {
          alert('There was a problem with request.');
        }
      }
    } catch (e) {
      alert('Caught Exception: checkForRefresh' + e.description);
    }
  };
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(user) + '&action=' + encodeURIComponent('checkForReload'));
}

function checkRestrictions() {
  var percentageGoal = sessionStorage.getItem("percentageGoal");
  var limitArray = sessionStorage.getItem("limitors");
  limitArray = JSON.parse(limitArray);

  if (sessionStorage.getItem("currentStatus") == "dayOneTesting") {
    goalStatus = "dayOneGoals";
    return;
  } else {
    goalStatus = "restricted";
  }

  for (let i = 0; i < limitArray.length; i++) {
    if (limitArray[i].limiter == 1 && limitArray[i].status == "notMet") {
      goalStatus = "limiterGoals";
      break;
    }
    if (limitArray[i].limited == 1 && limitArray[i].status == "Met") {
      goalStatus = "limitedGoals";
      break;
    }
  }
}

function loadLastState() {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer'></div>";
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(user) + '&action=' + encodeURIComponent('percentage') + '&reload=' + encodeURIComponent('true'));
}

function loadTable() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        response = JSON.parse(response);

        var tempLength = response.length;

        if (tempLength >= sessionStorage.getItem("percentageGoal")) {
          if (tempLength == 1) {
            tempLength = 0;
          }
          sessionStorage.setItem("percentageGoal", parseInt(tempLength) + parseInt(tempGoal));
          //sessionStorage.setItem("currentStatus", "goalUnmet");
        }

        loadGrid(response);
        registerHooks();
      } else {
        alert('There was a problem with request.');
      }
    }
    return 1;
  } catch (e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: ' + e.description);
  }
}

function reportState() {
  infoArray = [];
  for (let i = 0; i < hot.countRows(); i++) {
    temp = new Object();
    temp.recordNum = i;
    temp.recordApptAttend = hot.getDataAtCell(i, 0);
    temp.recordApptLate = hot.getDataAtCell(i, 1);
    temp.recordApptNotAttend = hot.getDataAtCell(i, 2);
    temp.recordPercentAttend = hot.getDataAtCell(i, 3);
    temp.recordPercentLate = hot.getDataAtCell(i, 4);
    temp.recordUsername = sessionStorage.getItem("currentUser");
    infoArray.push(JSON.stringify(temp));
  }

  sendToServer(infoArray);
}

function sendToServer(infoArray) {
  var requestURL = "http://localhost:8888/PsychPHP/percentage.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('info=' + JSON.stringify(infoArray));
}

function checkForCompletion() {
  // rework code for row count
  let dataCount, rowCount;
  var goal = sessionStorage.getItem("percentageGoal");

  if (goalStatus == "dayOneGoals") {
    return;
  }

  rowCount = 0;
  for (let i = 0; i < hot.countRows(); i++) {
    dataCount = 0;
    for (let j = 0; j < hot.countCols(); j++) {
      if (hot.getDataAtCell(i, j) != null || hot.getDataAtCell(i, j) != "") {
        dataCount++;
      }
    }
    if (dataCount == hot.countCols()) {
      rowCount++;
    }
  }

  if (parseInt(rowCount) >= parseInt(goal)) {
    submitGoalTime();

    sessionStorage.setItem("percentageGoal", parseInt(goal) + parseInt(tempGoal));
    sessionStorage.setItem("currentStatus", "goalMet");

    if (goalStatus == "limitedGoals") {
      //sessionStorage.setItem("percentageGoal", parseInt(percentageGoal) + parseInt(limitedGoal));
    } else {
      alert("Goal Complete");
      //sessionStorage.setItem("percentageGoal", parseInt(percentageGoal) + parseInt(limiterGoal));
    }

    if (goalStatus == "limiterGoals") {
      let limitArray = sessionStorage.getItem("limitors");
      limitArray = JSON.parse(limitArray);

      for (let i = 0; i < limitArray.length; i++) {
        if (limitArray[i].limiter == 5 && limitArray[i].status == "notMet") {
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
        if (limitArray[i].limited == 5) {
          limitArray[i].status = "notMet";
        }
      }
      limitArray = JSON.stringify(limitArray);
      sessionStorage.setItem("limitors", limitArray);
    }
    window.open("TestingHomepage.html", "_self", false);
  }
}

function submitGoalTime() {
  if (sessionStorage.getItem("calculatePercentageTimerStatus") == "timerStarted") {
    var seconds = (Date.now() - sessionStorage.getItem("calculatePercentageTimer")) / 1000;
    var goal = tempGoal;
    sessionStorage.setItem("calculatePercentageTimerStatus", "timerComplete");

    var requestURL = "http://localhost:8888/PsychPHP/goals.php";
    httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', requestURL);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send('userName=' + encodeURIComponent(user) + '&time=' + encodeURIComponent(seconds) + '&type=' + encodeURIComponent("calculatePercentages") + '&goal=' + encodeURIComponent(goal));
  }
  return;
}

function loadGrid(response) {
  var data = response;

  var container = document.getElementById('gridContainer');

  hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    startCols: 5,
    minRows: 5,
    startRows: 5,
    columnSorting: false,
    colHeaders: ['Appointments Attended', 'Arrived Late', 'Appointments Not Attended', '% Attended', '% Late'],
    contextMenu: true,
    minSpareRows: 2,
    fillHandle: {
      autoInsertRow: true,
    }
  });
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

function registerHooks() {
  Handsontable.hooks.add('afterChange', function (change, source) {
    reportState();
    checkForCompletion();
    if (source == 'edit' && setter == true) {
      loadNewApptInfo();
    }
    runSaveAnimation();
  }, hot);
}

function isFull(numRows) {
  var flag = true;
  for (let i = 0; i < numRows; i++) {
    if (hot.getDataAtCell(i, 3) == "" || hot.getDataAtCell(i, 4) == "" || hot.getDataAtCell(i, 3) == null || hot.getDataAtCell(i, 4) == null) {
      flag = false;
      break;
    } else {
      flag = true;
    }
  }
  return flag;
}

function loadNewApptInfo() {
  var numRows = hot.countRows();

  if (isFull(numRows - 2) == true) {
    var apptAttend = Math.floor(Math.random() * (15 - 3 + 1) + 3);
    var apptLate = Math.floor(Math.random() * (apptAttend - 0 + 1) + 0);
    var apptNotAttend = Math.floor(Math.random() * (10 - 3 + 1) + 3);

    setter = false;
    hot.setDataAtCell(numRows - 2, 0, apptAttend);
    hot.setDataAtCell(numRows - 2, 1, apptLate);
    hot.setDataAtCell(numRows - 2, 2, apptNotAttend);
    setter = true;
    return;
  }
}
