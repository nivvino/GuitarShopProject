async function checkSession(){
  const response = await fetch('/api/is-logged-in',{
      headers: { "Content-Type": "application/json" },
      method: "POST"
  })
  if(response.ok)
    location.href='/'
}
checkSession()

async function checkDetails() {
  event.preventDefault();
  if (!checkFullName() || !checkEmail() || !checkPassword()) return;
  let fullName = document.getElementById("fullNameInput").value;
  let email = document.getElementById("emailInput").value;
  let password = document.getElementById("passwordInput").value;
  let passwordConfirm = document.getElementById("confirmPassword").value;
  const response = await fetch("/api/sign-up", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, password, passwordConfirm}),
  });
  const message = await response.text()
  if (response.ok) {
    const container = document.getElementById('container')
    container.innerHTML=""
    let h1 = document.createElement("h1");
    h1.style.position = "relative";
    h1.style.marginTop='30px'
    let h2 = document.createElement("h1");
    h2.style.position = "relative";
    h2.style.marginTop='30px'
    h1.innerHTML = "Registered successfully,";
    h2.innerHTML = "please sign in"
    container.append(h1,h2);
    setTimeout(() => {
      location.href = "/sign-in";
    }, 3500);
  }else if(message == 'No name has been entered'){
    document.getElementById('fullNamePopup').innerhtml='No name has been entered.'
  }else if(message == 'Name cannot contain numbers'){
    document.getElementById('fullNamePopup').innerhtml='Name cannot contain numbers.'
  }else if(message == 'Email not valid'){
    document.getElementById('EmailPopup').innerHTML='Please enter a valid email.'
  }else if(message == 'Email is already registered'){
    document.getElementById('EmailPopup').innerHTML='Email is already registered.'
  }else if(message=="The password's length must be between 5-10 characters"){
    document.getElementById('passwordPopup').innerHTML="The password's length must be between 5-10 characters."
  }else if(message=='Passwords must match'){
    document.getElementById('confirmPasswordPopup').innerHTML="Passwords do not match,<br>please confirm your password."
  }
}
function checkFullName() {
  let name = document.getElementById('fullNameInput').value
  if(name.length==0){
    document.getElementById('fullNamePopup').innerHTML='Please enter full name.'
    return false
  }
  if(/\d/.test(name)) {
    document.getElementById('fullNamePopup').innerHTML="Name cannot contain numbers."
    return false
  }
  document.getElementById('fullNamePopup').innerHTML=""
  return true
}
function checkEmail() {
  let email = document.getElementById("emailInput").value;
  for (let i = 0; i < email.length; i++) {
    if (email.charAt(i) == "@" && email.length>6){
      document.getElementById('EmailPopup').innerHTML=""
      return true;
    } 
  }
  document.getElementById('EmailPopup').innerHTML="Please enter a valid email."
  return false;
}
function checkPassword() {
  let password = document.getElementById("passwordInput").value;
  let passwordConfirm = document.getElementById("confirmPassword").value;
  let neededChar = false;
  if (password != passwordConfirm) {
    document.getElementById('confirmPasswordPopup').innerHTML="Passwords do not match,<br>please confirm your password."
    return false;
  }else{
    document.getElementById('confirmPasswordPopup').innerHTML=""
  }
  if (password.length < 5 || password.length > 10) {
    document.getElementById('passwordPopup').innerHTML="The password's length must be between 5-10 characters."
    return false;
  }
  document.getElementById('passwordPopup').innerHTML=""
  return true;
}
