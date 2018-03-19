var hot;
var rowCount = 15;
var colCount = 5;
var currentInterval;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  // Checks if user is logged in
  if (user == undefined) {
    //alert("Please log into your account.");
    //window.open("Login.html", "_self", false);   // Goes back to the login page
  }
  //checkRestrictions();
  loadParticipants(user);
  //loadGrid();
  //setInterval(reportState, 3000);
  //setInterval(checkForCompletion, 5000);
}

function loadParticipants(username) {
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest()
  httpRequest.onreadystatechange = loadCurrentParticipants;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + "&action=" + encodeURIComponent("requestParticipants"));
}

function loadCurrentParticipants() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        //alert(response);
        if (response == "empty") {
          alert("No participants");
          return;
        } else {
          response = JSON.parse(response);
          document.getElementById("participantsList").innerHTML = "";
          document.getElementById("participantsContainer").style.display = "block";
          //hide other things
          for (i = 0; i < response.length; i++) {
            obj = response[i];
            //alert(obj.username);
            insertParticipant(obj.username, obj.tasknum);
          }
          return;
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

function insertParticipant(username, tasknum) {
  //alert(adding);
  unorderedlist = document.getElementById("participantsList");
  listItem = "<li><button onclick=\"viewLiveFeed('" + username + "'," + tasknum + ")\">" + username + "</button></li>";
  temp = unorderedlist.innerHTML;
  unorderedlist.innerHTML = temp + listItem;
}

function viewLiveFeed(username, tasknum) {

  currentInterval = clearInterval(currentInterval);

  if (tasknum == 1) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer'><div class='hideBottomText' </div></div>";
    loadFinancialInfoTable(username);
    currentInterval = setInterval(loadFinancialInfoTable, 3000, username);
  }
  if (tasknum == 2) {
    document.getElementById("mainContainer").innerHTML = "<textarea id = 'memoTextArea'></textarea></div>";
    loadMemo(username);
    currentInterval = setInterval(loadMemo, 5000, username);
    // Show finanical info table
  }
  if (tasknum == 3) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer'><div class='hideBottomText' </div></div>";
    loadCrossCheckInfoTable(username);
    currentInterval = setInterval(loadCrossCheckInfoTable, 3000, username);
    // Show finanical info table
  }
  if (tasknum == 4) {
    // Show finanical info table
  }
  if (tasknum == 5) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer'><div class='hideBottomText' </div></div>";
    loadPercentages(username);
    currentInterval = setInterval(loadPercentages, 3000, username);
    // Show finanical info table
  }
  if (tasknum == 6) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer'><div class='hideBottomText' </div></div>";
    loadLabelingApointments(username);
    currentInterval = setInterval(loadLabelingApointments, 3000, username);
    // Show finanical info table
  }
}

function test() {
  alert(hot.getDataAtCell(3, 0));
}

function loadFinancialInfoTable(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer'><div class='hideBottomText' </div></div>";
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('financial'));
}

function loadMemo(username) {
  document.getElementById("mainContainer").innerHTML = "<textarea id = 'memoTextArea'></textarea></div>";
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadMemoText;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('memo'));
}

function loadMemoText() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        //alert(response);
        //if response
        //response = JSON.parse(response);
        document.getElementById("memoTextArea").innerHTML = response;
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


function loadLabelingApointments(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer'><div class='hideBottomText' </div></div>";
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('labelAppointment'));
}

function loadCrossCheckInfoTable(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer'><div class='hideBottomText' </div></div>";
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('crossCheck'));
}

function loadPercentages(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer'><div class='hideBottomText' </div></div>";
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('percentage'));
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

function loadGrid(response) {
  //var data = function () {
  //return Handsontable.helper.createSpreadsheetData(8, //5);
  //};

  var data = response;

  var container = document.getElementById('gridContainer');

  hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    minCols: 0,
    minRows: 0,
    minSpareRows: 2,
    columnSorting: true,
    //colHeaders: ['col1', 'col2', 'col3', 'col4', 'col5'],
    readOnly: true,
    contextMenu: true,
    //hiddenColumns: {
    //columns: [4],
    //indicators: false
    //},
    fillHandle: {
      autoInsertRow: false,
    }
  });
}
