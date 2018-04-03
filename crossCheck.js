var hot;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  // Checks if user is logged in
  if (user == undefined) {
    sessionStorage.clear();
    alert("Please log into your account.");
    window.open("Login.html", "_self", false); // Goes back to the login page
  }
  //checkRestrictions();
  loadLastState();
  //loadGrid();
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
  httpRequest.send('userName=' + encodeURIComponent(user) + '&action=' + encodeURIComponent('crossCheck') + '&reload=' + encodeURIComponent('true'));
}

function loadTable() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        response = JSON.parse(response);
        loadGrid(response);
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
  let dataCount = 0;
  let goal = sessionStorage.getItem("crossCheckGoal");
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
