var user;

function checkPrivilege() {
  user = sessionStorage.getItem("currentUser");

  // Checks if user is logged in
  if (user == undefined) {
    //alert("Please log into your account.");
    //window.open("Login.html", "_self", false);   // Goes back to the login page
  }

  loadData();
}

function loadData() {
  position = sessionStorage.getItem("lastApptViewed");
  goalState = sessionStorage.getItem("labelApptGoal");

  if (position == undefined) {
    position = 0;
    sessionStorage.setItem("lastApptViewed", position);
  }

  if (position > goalState) {
    alert("goal complete");
    sessionStorage.removeItem("lastApptViewed");
    window.open("TestingHomepage.html", "_self", false);
  }

  requestData(position);
}

function requestData(position) {
  var requestURL = "http://localhost:8888/PsychPHP/labelAppointment.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = displayData;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('action=' + encodeURIComponent('request') + '&position=' + encodeURIComponent(position));
}

function submitData() {
  position = sessionStorage.getItem("lastApptViewed");
  content = document.getElementById("labelValue").value;

  if (content == 'ns') {
    alert("Please select an option for the appointment");
    return;
  }

  temp = new Object();
  temp.position = position;
  temp.username = user;
  temp.selected = content;
  sendData(temp);
}

function sendData(temp) {
  var requestURL = "http://localhost:8888/PsychPHP/labelAppointment.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = confirmSave;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('action=' + encodeURIComponent('submit') + '&content=' + JSON.stringify(temp));
}

function moveAppointment(direction) {
  position = sessionStorage.getItem("lastApptViewed");
  var requestURL = "http://localhost:8888/PsychPHP/labelAppointment.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = confirmMove;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  if (direction == 'prev') {
    position--;
    httpRequest.send('action=' + encodeURIComponent('move') + '&position=' + encodeURIComponent(position));
  } else {
    position++;
    httpRequest.send('action=' + encodeURIComponent('move') + '&position=' + encodeURIComponent(position));
  }
}

function displayData() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;

        if (response == "No Data") {
          alert("End of data");
          sessionStorage.removeItem("lastApptViewed");
          window.open("TestingHomepage.html", "_self", false);
          return;
        }

        response = JSON.parse(response);
        document.getElementById("idLabel").value = response.id;
        document.getElementById("firstNameLabel").value = response.firstname;
        document.getElementById("lastNameLabel").value = response.lastname;
        document.getElementById("apptNumLabel").value = response.apptnum;
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

function confirmMove() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        if (response == 'Rejected') {
          alert("Selection out of bounds");
          return;
        } else {
          requestData(position);
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

function confirmSave() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        if (response == 'Success') {
          alert("Appointment saved");
          position = sessionStorage.getItem("lastApptViewed");
          sessionStorage.setItem("lastApptViewed", parseInt(position) + 1);
          loadData();
        } else {
          alert("Something went wrong. Please try again in a few seconds");
        }
      } else {
        alert('There was a problem with the save.');
      }
    }
    return 1;
  } catch (e) // Always deal with what can happen badly, client-server applications --> there is always something that can go wrong on one end of the connection
  {
    alert('Caught Exception: ' + e.description);
  }
}
