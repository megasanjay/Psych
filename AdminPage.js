var hot, hotter, hottest, hooks;
var currentInterval;
var user;
var columnHeaders;

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

function insertParticipant(username, tasknum) {
  //alert(adding);
  unorderedlist = document.getElementById("participantsList");
  listItem = "<li><button onclick=\"getTaskNum('" + username + "'," + tasknum + ")\">" + username + "</button></li>";
  temp = unorderedlist.innerHTML;
  unorderedlist.innerHTML = temp + listItem;
}

function getTaskNum(username, tasknum) {
  currentInterval = clearInterval(currentInterval);
  user = username;

  requestTask(username);

  if (document.getElementById("autoRefreshCheckBox").checked == true) {
    autoRefresh();
    currentInterval = setInterval(requestTask, 3000, username);
  }

}

function requestTask(username) {
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest()
  httpRequest.onreadystatechange = loadCurrentTask;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + "&action=" + encodeURIComponent("requestTask"));
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
  } catch (e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: loadCurrentTask' + e.description);
  }
}

function viewLiveFeed(username, tasknum) {

  if (tasknum == 1) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
    loadFinancialInfoTable(username);
    //currentInterval = setInterval(loadFinancialInfoTable, 3000, username);
  }
  if (tasknum == 2) {
    document.getElementById("mainContainer").innerHTML = "<textarea id = 'memoTextArea'></textarea></div>";
    loadMemo(username);
    //currentInterval = setInterval(loadMemo, 5000, username);
  }
  if (tasknum == 3) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
    loadCrossCheckInfoTable(username);
    //currentInterval = setInterval(loadCrossCheckInfoTable, 3000, username);
  }
  if (tasknum == 4) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
    loadSortedFiles(username);
    //currentInterval = setInterval(loadSortedFiles, 3000, username);
  }
  if (tasknum == 5) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
    loadPercentages(username);
    //currentInterval = setInterval(loadPercentages, 3000, username);
  }
  if (tasknum == 6) {
    document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
    loadLabelingApointments(username);
    //currentInterval = setInterval(loadLabelingApointments, 3000, username);
  }
}

function loadFinancialInfoTable(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('financial'));
}

function loadSortedFiles(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer'></div>";
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('files'));
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
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('labelAppointment'));
}

function loadCrossCheckInfoTable(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
  var requestURL = "http://localhost:8888/PsychPHP/AdminDetails.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = loadTable;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username) + '&action=' + encodeURIComponent('crossCheck'));
}

function loadPercentages(username) {
  document.getElementById("mainContainer").innerHTML = "<div id='gridContainer' ></div>";
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
  } catch (e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: ' + e.description);
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
    startCols: 3,
    minSpareRows: 2,
    columnSorting: false,
    colHeaders: ['Username', 'Password', 'Email Address'],
    contextMenu: true,
    fillHandle: {
      autoInsertRow: false,
    },
  });
}

function showParticipants() {
  var x = document.getElementById("participantsContainer");
  var y = document.getElementById("particpantsCheckBox");

  if (y.checked == true) {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function showLiveFeed() {
  var x = document.getElementById("mainContainer");
  var y = document.getElementById("liveFeedCheckBox");

  if (y.checked == true) {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function registerHooks() {
  Handsontable.hooks.add('afterChange', function (change, source) {
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
  } catch (e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: ' + e.description);
  }
}

function autoRefresh() {
  var y = document.getElementById("autoRefreshCheckBox");
  var icon = document.getElementById("refreshing");

  if (y.checked == false) {
    icon.classList.remove("shown");
    icon.classList.add("hidden");
    currentInterval = clearInterval(currentInterval);
  } else {
    icon.classList.add("shown");
    icon.classList.remove("hidden");
    requestTask(user);
    currentInterval = setInterval(requestTask, 3000, user);
  }
}

function showRestrictions() {
  var x = document.getElementById("mainContainer2");
  var y = document.getElementById("restrictionsCheckBox");

  if (y.checked == true) {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function showLogin() {
  var x = document.getElementById("mainContainer3");
  var y = document.getElementById("loginCheckBox");

  if (y.checked == true) {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
