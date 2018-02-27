var hot;
var rowCount = 9;
var colCount = 5;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  // Checks if user is logged in
  if (user == undefined) {
    //alert("Please log into your account.");
    //window.open("Login.html", "_self", false);   // Goes back to the login page
  }
  //checkRestrictions();
  loadGrid();
  setInterval(reportState, 3000);
  setInterval(checkForCompletion, 5000);
}

function test() {
  alert(hot.getDataAtCell(3, 0));
}

function reportState() {
  //alert("running");
  infoArray = [];
  for (let i = 0; i < rowCount; i++) {
    temp = new Object();
    temp.recordNum = i;
    temp.recordData = hot.getDataAtCell(i, 0);
    //console.log(temp.recordData);
    temp.recordUsername = sessionStorage.getItem("currentUser");
    infoArray.push(JSON.stringify(temp));
  }

  //alert(infoArray[0]);
  sendToServer(infoArray);
}

function sendToServer(infoArray) {
  var requestURL = "http://localhost:8888/PsychPHP/financialInfo.php";
  httpRequest = new XMLHttpRequest();
  //httpRequest.onreadystatechange = imposeRestrictions;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('info=' + JSON.stringify(infoArray));
}

function checkForCompletion() {
  let dataCount = 0;
  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < colCount; j++) {
      if (hot.getDataAtCell(i, j) != '') {
        dataCount++;
      }
    }
  }
  if (dataCount >= rowCount * colCount) {
    // save data maybe?
    window.open("TestingHomepage.html", "_self", false);
  }
}

function loadGrid() {
  var data = function () {
    return Handsontable.helper.createSpreadsheetData(8, 5);
  };

  var container = document.getElementById('gridContainer');

  hot = new Handsontable(container, {
    data: data(),
    rowHeaders: true,
    minCols: 5,
    minRows: 15,
    columnSorting: true,
    colHeaders: ['col1', 'col2', 'col3', 'col4', 'col5'],
    contextMenu: true,
    hiddenColumns: {
      columns: [4],
      indicators: false
    },
    fillHandle: {
      autoInsertRow: false,
    }
  });
}
