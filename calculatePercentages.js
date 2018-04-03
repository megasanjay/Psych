var hot, hooks;
var setter = true;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  // Checks if user is logged in
  if (user == undefined) {
    //alert("Please log into your account.");
    //window.open("Login.html", "_self", false);   // Goes back to the login page
  }
  //loadGrid([[2, 23, 34, 343, 343]]);
  loadLastState();
  //registerHooks();
  setInterval(reportState, 3000);
  setInterval(checkForCompletion, 5000);
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
  let dataCount = 0;
  let goal = sessionStorage.getItem("percentageGoal");
  for (let i = 0; i < hot.countRows(); i++) {
    for (let j = 0; j < hot.countCols(); j++) {
      if (hot.getDataAtCell(i, j) != null || hot.getDataAtCell(i, j) != "") {
        dataCount++;
      }
    }
  }

  if (dataCount >= goal) {
    window.open("TestingHomepage.html", "_self", false);
  }
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

function registerHooks() {
  Handsontable.hooks.add('afterChange', function (change, source) {
    if (source == 'edit' && setter == true) {
      loadNewApptInfo();
    }
  }, hot);
  Handsontable.hooks.add('afterCreateRow', function () {
    if (setter == true) {
      //loadNewApptInfo();
    }
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
