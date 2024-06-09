async function isLoggedIn(){
    document.getElementById('logOut').style.display = "none"
    const response = await fetch('/api/is-logged-in',{
        headers: { "Content-Type": "application/json" },
    method: "POST"
    })
    if (response.ok){
        document.getElementById('signIn').style.display="none"
        document.getElementById('signUp').style.display="none"
        document.getElementById('logOut').style.display = "block"
    }
}

document.getElementById('container').style.width='60%'

async function loadHomeImage(){
    document.getElementById('homeImage').style.maxWidth='350px'
    document.getElementById('homeImage').style.maxHeight='350px'
    const guitarName = 'D10SCE-12 STRING'
    const response = await fetch('/api/home-image',{
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({guitarName}),
    })
    const result = await response.json()
    document.getElementById('homeImage').src=result.image
}
loadHomeImage()