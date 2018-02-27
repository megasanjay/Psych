function submit() {
  let username = document.getElementById("usernameTextBox");
  let password = document.getElementById("passwordTextBox");
  let emailAddress = document.getElementById("emailTextBox");

  // Calls the get password function if input fields are not empty
  if (username.value != '' && password.value != '') {
    GetPassword(username.value.toLowerCase(), emailAddress);
    return;
  }
  // If input fields are empty, error message will appear
  alert("Please fill all the fields in the page before clicking the 'Login' button.")
  if (username.value == '') {
    username.classList.remove("regularTextbox");
    username.classList.add("errorTextbox");
  }
  if (password.value == '') {
    password.classList.remove("regularTextbox");
    password.classList.add("errorTextbox");
  }
  if (emailAddress.value = '') {
    emailAddress.classList.remove("regularTextBox");
    emailAddress.classList.add("errorTextBox");
  }
}

function GetPassword(username, emailAddress) {
  var requestURL = "http://localhost:8888/PsychPHP/loginValidation.php";
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = alertContents_getPassword;
  httpRequest.open('POST', requestURL);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send('username=' + encodeURIComponent(username) + '&emailaddress=' + encodeURIComponent(emailAddress));
}

function alertContents_getPassword() {
  try {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        if (response == "Username does not exist") {
          document.getElementById("usernameTextBox").classList.remove("regularTextbox");
          document.getElementById("usernameTextBox").classList.add("errorTextbox");
          document.getElementById("passwordTextBox").classList.remove("regularTextbox");
          document.getElementById("passwordTextBox").classList.add("errorTextbox");
          alert("This username does not exist. Please check your login info before trying again.");
          return;
        }

        response = JSON.parse(response);
        responsePassword = response["password"];
        responseEmailAddress = response["emailaddress"];
        responsePassword = responsePassword.split("\'").join("'");

        // Checks if password is incorrect
        if (document.getElementById("passwordTextBox").value != responsePassword) {
          document.getElementById("passwordTextBox").classList.remove("regularTextbox");
          document.getElementById("passwordTextBox").classList.add("errorTextbox");
          alert("Incorrect Password. Please enter the correct password");
          return;
        }

        // Checks to see if the email is correct
        if (document.getElementById("emailTextBox").value != responseEmailAddress) {
          document.getElementById("emailTextBox").classList.remove("regularTextbox");
          document.getElementById("emailTextBox").classList.add("errorTextbox");
          alert(responseEmailAddress);
          alert("Incorrect email address. Please enter the correct email address");
        }

        // Validates the password is correct
        if (document.getElementById("passwordTextBox").value == responsePassword && document.getElementById("emailTextBox").value == responseEmailAddress) {
          sessionStorage.setItem("currentUser", document.getElementById('usernameTextBox').value.toLowerCase());

          if (response["admin"] == 1) {
            sessionStorage.setItem("admin", 1);
            window.open("AdminPage.html", "_self", false);
          } else {
            sessionStorage.setItem("admin", 0);
            window.open("TestingHomepage.html", "_self", false);
          }
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
