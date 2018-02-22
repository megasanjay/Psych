function checkPrivilege()
{
  user = sessionStorage.getItem("currentUser");

  // Checks if user is logged in
  if (user == undefined)
  {
    //alert("Please log into your account.");
    //window.open("Login.html", "_self", false);   // Goes back to the login page
  }
  checkRestrictions();
}

function checkRestrictions()
{
  var requestURL = "http://localhost:8888/PsychPHP/Tester.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = imposeRestrictions;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('userName=' + encodeURIComponent(username));
}

function task(int taskNum)
{
  switch(taskNum)
  {
    case 1:
      //do task 1
      break;
    case 2:
      // do task 2
      break;
    case 3:
      // do task 3
      break;
    case 4:
      // do task 4
      break;
    case 5:
      // do task 5
      break;
    case 6:
      // do task 6
      break;
    default:
      break;
  }
}

function restrictControls(response)
{
  for(let i = 0; i < response.length; i++)
  {
    restriction = response[i];
    limiter = restriction.Limiter;
    limited = restriction.Limited;
    
    document.getElementById(limited).enabled = false;
  }
}

function resetAllButtons()
{
  temp = document.getElementsByClassName("taskButton");
  
  for(i = 0; i < temp.length; i++)
  {
    temp[i].enabled = true;
    temp[i].classList.remove("restricted");
    temp[i].classList.add("unrestricted");
  }
}

function imposeRestrictions()
{
  try
  {
    if (httpRequest.readyState === XMLHttpRequest.DONE)
    {
      if (httpRequest.status === 200)
      {
        var response = httpRequest.responseText;
        
        if (response == "None")
        {
          resetAllButtons();
        }
        else
        {
          response = JSON.parse(response);
          restrictControls(response);
        }
      }
      else
      {
        alert('There was a problem with the request.');
      }
    }
    return 1;
  }
  catch(e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: ' + e.description);
  }
}
