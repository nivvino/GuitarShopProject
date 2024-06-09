async function checkSession(){
  const response = await fetch('/api/is-logged-in',{
      headers: { "Content-Type": "application/json" },
  method: "POST"
  })
  if(response.ok)
    location.href='/'
}
checkSession()

async function signIn(event){
  event.preventDefault();
  document.getElementById('emailPopup').innerHTML=""
  document.getElementById('passwordPopup').innerHTML=""
  const emailInput = document.getElementById('emailInput').value
  const passwordInput = document.getElementById('passwordInput').value
  const response = await fetch('/api/sign-in',{
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({emailInput,passwordInput}),
  })
  if(response.status==404)
    document.getElementById('emailPopup').innerHTML="Incorrect email"
  if(response.status==401)
    document.getElementById('passwordPopup').innerHTML="Incorrect password"
  if(response.ok)
    location.href='/store'
}