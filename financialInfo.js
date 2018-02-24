var hot;
var rowCount = 10;
var colCount = 5;

function checkPrivilege()
{
  user = sessionStorage.getItem("currentUser");

  // Checks if user is logged in
  if (user == undefined)
  {
    //alert("Please log into your account.");
    //window.open("Login.html", "_self", false);   // Goes back to the login page
  }
  //checkRestrictions();
  loadGrid();
  setTimeout(checkForCompletion, 5000);
}

function checkForCompletion()
{
  let dataCount = 0;
  for(let i = 0; i < rowCount; i++)
  {
    for (let j = 0; j < colCount; j++)
    {
      if (hot.getDataAtCell(i, j) != '')
      {
        dataCount++;
      }
    }
  }
  if (dataCount >= rowCount*colCount)
  {
    //saveall data in the databse
    window.open("TestingHomepage.html", "_self", false);
  }
}

function loadGrid()
{
  var data = function () {
    return Handsontable.helper.createSpreadsheetData(10, 5);
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
    fillHandle: 
    {
      autoInsertRow: false,
    }
  });
}

  