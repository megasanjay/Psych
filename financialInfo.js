var hot;
var hooks;
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

  if (sessionStorage.getItem("financialTimerStatus") == "timerComplete" || sessionStorage.getItem("financialTimerStatus") == undefined) {
    sessionStorage.setItem("financialTimer", Date.now());
    sessionStorage.setItem("financialTimerStatus", "timerStarted");
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
                    console.log("confirmed");
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
  var financialGoal = sessionStorage.getItem("financialGoal");
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
  httpRequest.send('userName=' + encodeURIComponent(user) + '&action=' + encodeURIComponent('financial') + '&reload=' + encodeURIComponent('true'));
}

function loadTable() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        response = JSON.parse(response);

        var tempLength = response.length;

        if (tempLength >= sessionStorage.getItem("financialGoal")) {
          if (tempLength == 1) {
            tempLength = 0;
          }
          sessionStorage.setItem("financialGoal", parseInt(tempLength) + parseInt(tempGoal));
          //sessionStorage.setItem("currentStatus", "goalUnmet");
        }

        loadGrid(response);
        registerHooks();
      } else {
        alert('There was a problem with request.');
      }
    }
    return 1;
  } catch (e) {
    alert('Caught Exception: ' + e.description);
  }
}

function reportState() {
  infoArray = [];
  for (let i = 0; i <= hot.countRows(); i++) {
    temp = new Object();
    temp.recordNum = i;
    temp.recordDate = hot.getDataAtCell(i, 0);
    temp.recordCheckNumber = hot.getDataAtCell(i, 1);
    temp.recordAmount = hot.getDataAtCell(i, 2);
    temp.recordUsername = sessionStorage.getItem("currentUser");
    infoArray.push(JSON.stringify(temp));
  }

  sendToServer(infoArray);
}

function sendToServer(infoArray) {
  var requestURL = "http://localhost:8888/PsychPHP/financialInfo.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('info=' + JSON.stringify(infoArray));
}

function checkForCompletion() {
  // rework code for row count
  let dataCount, rowCount;
  var goal = sessionStorage.getItem("financialGoal");

  if (goalStatus == "dayOneGoals") {
    return;
  }

  rowCount = 0;
  for (let i = 0; i < hot.countRows(); i++) {
    dataCount = 0;
    for (let j = 0; j < hot.countCols(); j++) {
      if (hot.getDataAtCell(i, j) != null && hot.getDataAtCell(i, j) != "") {
        dataCount++;
      }
    }
    if (dataCount == hot.countCols()) {
      rowCount++;
    }
  }

  if (parseInt(rowCount) >= parseInt(goal)) {
    submitGoalTime();

    sessionStorage.setItem("financialGoal", parseInt(goal) + parseInt(tempGoal));
    sessionStorage.setItem("currentStatus", "goalMet");

    if (goalStatus == "limitedGoals") {
      //sessionStorage.setItem("financialGoal", parseInt(financialGoal) + parseInt(limitedGoal));
    } else {
      alert("Goal Complete");
      //sessionStorage.setItem("financialGoal", parseInt(financialGoal) + parseInt(limiterGoal));
    }

    //recheck goals;
    if (goalStatus == "limiterGoals") {
      let limitArray = sessionStorage.getItem("limitors");
      limitArray = JSON.parse(limitArray);

      for (let i = 0; i < limitArray.length; i++) {
        if (limitArray[i].limiter == 1 && limitArray[i].status == "notMet") {
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
        if (limitArray[i].limited == 1) {
          limitArray[i].status = "notMet";
        }
      }
      limitArray = JSON.stringify(limitArray);
      sessionStorage.setItem("limitors", limitArray);
    }

    window.open("TestingHomepage.html", "_self", false);
  }
}

function loadGrid(response) {
  var data = response;

  var container = document.getElementById('gridContainer');

  hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    startCols: 3,
    minRows: 5,
    startRows: 5,
    columnSorting: false,
    colHeaders: ['Date', 'Check Number', 'Amount'],
    contextMenu: true,
    minSpareRows: 2,
    fillHandle: {
      autoInsertRow: false,
    }
  });
}

function submitGoalTime() {
  if (sessionStorage.getItem("financialTimerStatus") == "timerStarted") {
    var seconds = (Date.now() - sessionStorage.getItem("financialTimer")) / 1000;
    var goal = tempGoal;
    sessionStorage.setItem("financialTimerStatus", "timerComplete");
  }

  var requestURL = "http://localhost:8888/PsychPHP/goals.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName' + encodeURIComponent(user) + '&time=' + encodeURIComponent(seconds) + '&type=' + encodeURIComponent("financial") + '&goal=' + encodeURIComponent(goal));
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
    runSaveAnimation();
  }, hot);
}
