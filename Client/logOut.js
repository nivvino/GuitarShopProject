async function logOut(){
    const response = await fetch('/api/log-out',{
        headers: { "Content-Type": "application/json" },
        method: "POST"
    })
    if (response.ok){
        location.href='/'
    }
}