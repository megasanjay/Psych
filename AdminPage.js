var hot, hotter, hottest, tooHot, hooks;
var currentInterval = [];
var user;
var columnHeaders;
var columnWidths;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  // Checks if user is logged in
  if (user == undefined) {
    alert("Please log into your account.");
    window.open("Login.html", "_self", false); // Goes back to the login page
  }

  loadParticipants(user);
}

function loadParticipants(username) {
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest()
  httpRequest.onreadystatechange = loadCurrentParticipants;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + "&action=" + encodeURIComponent("requestParticipants"));
}

function loadLastState() {
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest()
  httpRequest.onreadystatechange = loadRestrictionsTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent("admin") + "&action=" + encodeURIComponent("requestRestrictions"));
}

function loadLoginInfo() {
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest()
  httpRequest.onreadystatechange = loadLoginTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent("admin") + "&action=" + encodeURIComponent("requestLogin"));
}

function loadRestrictionsTable() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        response = JSON.parse(response);
        loadSecondGrid(response);
        registerHooks();
        loadLoginInfo();
      } else {
        alert('There was a problem with request.');
      }
    }
    return 1;
  } catch (e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: loadRestrictionsTable' + e.description);
  }
}

function loadLoginTable() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        response = JSON.parse(response);
        loadThirdGrid(response);
        registerSecondHooks();
      } else {
        alert('There was a problem login load request.');
      }
    }
    return 1;
  } catch (e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: loadLoginTable -' + e.description);
  }
}

function loadCurrentParticipants() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        //alert(response);
        if (response == "empty") {
          alert("No participants");
        } else {
          response = JSON.parse(response);
          document.getElementById("participantsList").innerHTML = "";
          document.getElementById("participantsContainer").style.display = "block";
          //hide other things
          for (i = 0; i < response.length; i++) {
            obj = response[i];
            insertParticipant(obj.username, obj.tasknum);
          }
        }
        loadLastState();
        return;
      } else {
        alert('There was a problem with the request.');
      }
    }
    return 1;
  } catch (e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: loadCurrentParticipants ' + e.description);
  }
}

function forceRefresh(subaction) {
  var tempUserName;
  var elements = document.getElementsByClassName("activeUser");

  if (elements.length != 1) {
    alert("No user has been selected.");
    return;
  } else {
    tempUserName = elements[0].innerHTML;
  }

  var temp = confirm("This will force a refresh of the user's screen");

  if (temp == false) {
    return;
  }

  var requestURL = "http://localhost:8888/PsychPHP/Tester.php";
  httpRequest = new XMLHttpRequest()
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent("admin") + "&endUser=" + encodeURIComponent(tempUserName) + "&action=" + encodeURIComponent("forceRefresh") + "&subaction=" + encodeURIComponent(subaction));
  alert("Refresh command sent.");
}

function cancelRefresh() {
  var tempUserName;
  var elements = document.getElementsByClassName("activeUser");

  if (elements.length != 1) {
    alert("No user has been selected.");
    return;
  } else {
    tempUserName = elements[0].innerHTML;
  }

  var temp = confirm("This will cancel the refresh request of the user's screen. WARNING! The refresh may have already been completed");

  if (temp == false) {
    return;
  }

  var requestURL = "http://localhost:8888/PsychPHP/Tester.php";
  httpRequest = new XMLHttpRequest()
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent("admin") + "&endUser=" + encodeURIComponent(tempUserName) + "&action=" + encodeURIComponent("forceRefresh"));

  alert("Refresh command sent.");
}


function insertParticipant(username, tasknum) {
  //alert(adding);
  unorderedlist = document.getElementById("participantsList");
  listItem = "<li><button class='btn' onclick=\"getTaskNum('" + username + "'," + tasknum + ")\">" + username + "</button></li>";
  temp = unorderedlist.innerHTML;
  unorderedlist.innerHTML = temp + listItem;
}

function getTaskNum(username, tasknum) {
  for (let i = 0; i < currentInterval.length; i++) {
    clearInterval(currentInterval[i]);
  }

  user = username;

  var temp = document.getElementsByClassName("activeUser");

  for (let i = 0; i < temp.length; i++) {
    temp[i].classList.remove("activeUser");
  }

  event.srcElement.classList.add("activeUser");

  requestTask(username);

  if (document.getElementById("autoRefreshCheckBox").checked == true) {
    autoRefresh();
    for (let i = 0; i < currentInterval.length; i++) {
      clearInterval(currentInterval[i]);
    }
    var temp = setInterval(requestTask, 3000, username);
    currentInterval.push(temp);
  }
}

function requestGoals(user) {
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  xhttpRequest = new XMLHttpRequest()
  xhttpRequest.onreadystatechange = loadGoals;
  xhttpRequest.open('POST', requestURL);
  xhttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhttpRequest.send('userName=' + encodeURIComponent("admin") + '&user=' + encodeURIComponent(user) + "&action=" + encodeURIComponent("requestGoals"));
}

function loadGoals() {
  try {
    if (xhttpRequest.readyState === XMLHttpRequest.DONE) {
      if (xhttpRequest.status === 200) {
        var response = xhttpRequest.responseText;
        response = JSON.parse(response);
        document.getElementById("gridContainer4").innerHTML = "";
        loadGoalsTable(response);
      } else {
        alert('There was a problem with the request.');
      }
    }
    return 1;
  } catch (e) {
    alert('Caught Exception: loadGoals' + e.description);
  }
}

function requestTask(username) {
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest()
  httpRequest.onreadystatechange = loadCurrentTask;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + "&action=" + encodeURIComponent("requestTask"));
  requestGoals(username);
}

function loadCurrentTask() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;

        if (response == "No Task") {
          return;
        }

        viewLiveFeed(user, response);
      } else {
        alert('There was a problem with the request.');
      }
    }
    return 1;
  } catch (e) {
    alert('Caught Exception: loadCurrentTask' + e.description);
  }
}

function viewLiveFeed(username, tasknum) {

  if (tasknum == 1) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
    loadFinancialInfoTable(username);
  }
  if (tasknum == 2) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
    loadMemo(username);
  }
  if (tasknum == 3) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
    loadCrossCheckInfoTable(username);
  }
  if (tasknum == 4) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
    loadSortedFiles(username);
  }
  if (tasknum == 5) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
    loadPercentages(username);
  }
  if (tasknum == 6) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
    loadLabelingApointments(username);
  }
}

function loadFinancialInfoTable(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
  columnHeaders = ['Date', 'Check Number', 'Amount', 'Timestamp'];
  columnWidths = undefined;
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('financial'));
}

function loadSortedFiles(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer'></div>";
  columnHeaders = ['File Name', 'Folder Selected', 'Timestamp'];
  columnWidths = undefined;
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('files'));
}

function loadMemo(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer'></div>";
  columnHeaders = ['Memo Text', 'Timestamp'];
  columnWidths = [500, 200];
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('memo'));
}

function loadLabelingApointments(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
  columnHeaders = ['First Name', 'Last Name', 'Appointmnet Number', 'Selected Option', 'Timestamp'];
  columnWidths = undefined;
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('labelAppointment'));
}

function loadCrossCheckInfoTable(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
  columnHeaders = ['Date', 'Patient Name', 'Patient Age', 'Patient Height', 'Patient Weight', 'Timestamp'];
  columnWidths = undefined;
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('crossCheck'));
}

function loadPercentages(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
  columnHeaders = ['Appts Attended', 'Appts Late', 'Appts Missed', '% Attended', '% Late', 'Timestamp'];
  columnWidths = undefined;
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('percentage'));
}

function pes() {
  //document.documentElement.scrollTop =
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
  } catch (e) {
    alert('Caught Exception: loadTable -' + e.description);
  }
}

function loadGrid(response) {
  var data = response;

  var container = document.getElementById('gridContainer');

  hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    minCols: 0,
    minRows: 0,
    minSpareRows: 2,
    columnSorting: true,
    readOnly: true,
    colHeaders: columnHeaders,
    colWidths: columnWidths,
    contextMenu: true,
    fillHandle: {
      autoInsertRow: false,
    }
  });
}

function loadSecondGrid(response) {
  var data = response;

  var container = document.getElementById('gridContainer2');

  hotter = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    minCols: 0,
    minRows: 0,
    startCols: 4,
    minSpareRows: 2,
    columnSorting: false,
    colHeaders: ['Username', 'Limiter', 'Limited', 'Day'],
    contextMenu: true,
    fillHandle: {
      autoInsertRow: false,
    },
  });
}

function loadThirdGrid(response) {
  var data = response;

  var container = document.getElementById('gridContainer3');

  hottest = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    minCols: 0,
    minRows: 0,
    startCols: 9,
    minSpareRows: 2,
    columnSorting: false,
    colHeaders: ['Username', 'Password', 'Email Address', 'Financial', 'Memo', 'X-Check', 'Sort Files', 'Percentages', 'Appointments'],
    contextMenu: true,
    fillHandle: {
      autoInsertRow: false,
    },
  });
}

function loadGoalsTable(response) {
  var data = response;

  var container = document.getElementById('gridContainer4');

  tooHot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    minCols: 0,
    minRows: 0,
    startCols: 3,
    minSpareRows: 1,
    columnSorting: false,
    colHeaders: ['Goal Type', 'Goal Amount', 'Time taken to hit goal (in seconds)'],
    contextMenu: true,
    readOnly: true,
    fillHandle: {
      autoInsertRow: false,
    },
  });
}

function registerHooks() {
  Handsontable.hooks.add('afterChange', function (change, source) {
    saveChanges();
  }, hotter);
  Handsontable.hooks.add('afterRemoveRow', function (change, source) {
    saveChanges();
  }, hotter);
}

function registerSecondHooks() {
  Handsontable.hooks.add('afterChange', function (change, source) {
    saveLoginChanges();
  }, hottest);
}

function saveChanges() {
  var infoArray = [];
  for (let i = 0; i <= hotter.countRows(); i++) {
    temp = new Object();
    temp.recordUsername = hotter.getDataAtCell(i, 0);
    temp.recordLimiter = hotter.getDataAtCell(i, 1);
    temp.recordLimited = hotter.getDataAtCell(i, 2);
    temp.recordDay = hotter.getDataAtCell(i, 3);
    infoArray.push(JSON.stringify(temp));
  }

  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent("admin") + "&action=" + encodeURIComponent("saveRestriction") + '&info=' + JSON.stringify(infoArray));
}

function saveLoginChanges() {
  var infoArray = [];
  for (let i = 0; i <= hottest.countRows(); i++) {
    temp = new Object();
    temp.recordUsername = hottest.getDataAtCell(i, 0);
    temp.recordPassword = hottest.getDataAtCell(i, 1);
    temp.recordEmail = hottest.getDataAtCell(i, 2);
    temp.recordAdmin = 0;
    temp.recordFinancial = hottest.getDataAtCell(i, 3);
    temp.recordMemo = hottest.getDataAtCell(i, 4);
    temp.recordCrossCheck = hottest.getDataAtCell(i, 5);
    temp.recordSortFiles = hottest.getDataAtCell(i, 6);
    temp.recordPercentage = hottest.getDataAtCell(i, 7);
    temp.recordAppointments = hottest.getDataAtCell(i, 8);
    infoArray.push(JSON.stringify(temp));
  }

  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent("admin") + "&action=" + encodeURIComponent("saveLogin") + '&info=' + JSON.stringify(infoArray));
}

function testFunc() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        alert(response);
      } else {
        alert('There was a problem with request.');
      }
    }
    return 1;
  } catch (e) {
    alert('Caught Exception: testFunc -' + e.description);
  }
}

function autoRefresh() {
  var y = document.getElementById("autoRefreshCheckBox");
  var icon = document.getElementById("refreshing");

  if (y.checked == false) {
    icon.classList.remove("shown");
    icon.classList.add("hidden");
    for (let i = 0; i < currentInterval.length; i++) {
      clearInterval(currentInterval[i]);
    }
  } else {
    icon.classList.add("shown");
    icon.classList.remove("hidden");
    requestTask(user);
    for (let i = 0; i < currentInterval.length; i++) {
      clearInterval(currentInterval[i]);
    }
    var temp = setInterval(requestTask, 3000, user);
    currentInterval.push(temp);
  }
}

function showPane(activePane) {
  document.getElementById("goals").style.display = "none";
  document.getElementById("loginInfo").style.display = "none";
  document.getElementById("liveFeed").style.display = "none";
  document.getElementById("refreshPage").style.display = "none";

  document.getElementById(activePane).style.display = "block";
}
