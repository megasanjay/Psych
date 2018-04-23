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
  var crossCheckGoal;
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
      //crossCheckGoal = sessionStorage.getItem("crossCheckGoal");
      //tempGoal = crossCheckGoal;
      goalStatus = "limiterGoals";
      break;
    }
    if (limitArray[i].limited == 1 && limitArray[i].status == "Met") {
      //crossCheckGoal = sessionStorage.getItem("crossCheckGoal");
      //tempGoal = parseInt(crossCheckGoal) - (limiterGoal - limitedGoal);
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
  httpRequest.send('userName=' + encodeURIComponent(user) + '&action=' + encodeURIComponent('crossCheck') + '&reload=' + encodeURIComponent('true'));
}

function loadTable() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        response = JSON.parse(response);

        var tempLength = response.length;

        if (tempLength >= sessionStorage.getItem("crossCheckGoal")) {
          if (tempLength == 1) {
            tempLength = 0;
          }
          sessionStorage.setItem("crossCheckGoal", parseInt(tempLength) + parseInt(tempGoal));
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
  for (let i = 0; i < hot.countRows; i++) {
    temp = new Object();
    temp.recordNum = i;
    temp.recordDate = hot.getDataAtCell(i, 0);
    temp.patientName = hot.getDataAtCell(i, 1);
    temp.patientAge = hot.getDataAtCell(i, 2);
    temp.patientHeight = hot.getDataAtCell(i, 3);
    temp.patientWeight = hot.getDataAtCell(i, 4);
    temp.recordUsername = sessionStorage.getItem("currentUser");
    infoArray.push(JSON.stringify(temp));
  }

  sendToServer(infoArray);
}

function sendToServer(infoArray) {
  var requestURL = "http://localhost:8888/PsychPHP/crossCheck.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('info=' + JSON.stringify(infoArray));
}

function checkForCompletion() {
  // rework code for row count
  let dataCount, rowCount;
  var goal = sessionStorage.getItem("crossCheckGoal");;

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

    sessionStorage.setItem("crossCheckGoal", parseInt(goal) + parseInt(tempGoal));
    sessionStorage.setItem("currentStatus", "goalMet");

    if (goalStatus == "limitedGoals") {
      //sessionStorage.setItem("crossCheckGoal", parseInt(crossCheckGoal) + parseInt(limitedGoal));
    } else {
      alert("Goal Complete");
      //sessionStorage.setItem("crossCheckGoal", parseInt(crossCheckGoal) + parseInt(limiterGoal));
    }

    if (goalStatus == "limiterGoals") {
      let limitArray = sessionStorage.getItem("limitors");
      limitArray = JSON.parse(limitArray);

      for (let i = 0; i < limitArray.length; i++) {
        if (limitArray[i].limiter == 3 && limitArray[i].status == "notMet") {
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
        if (limitArray[i].limited == 3) {
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
    colHeaders: ['Date', 'Patient Name', 'Age (in Years)', 'Weight (in kg)', 'Height (in m)'],
    contextMenu: true,
    minSpareRows: 2,
    fillHandle: {
      autoInsertRow: false,
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
    runSaveAnimation();
  }, hot);
}
