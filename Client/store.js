async function isLoggedIn(){
    document.getElementById('logOut').style.display = "none"
    document.getElementById('confirmOrder').style.display="none"
    const response = await fetch('/api/is-logged-in',{
        headers: { "Content-Type": "application/json" },
        method: "POST"
    })
    if (response.ok){
        document.getElementById('signIn').style.display="none"
        document.getElementById('signUp').style.display="none"
        document.getElementById('logOut').style.display = "block"
        const data = await response.json()
        if(data.inCart!=0 && data.inCart!=undefined){
            document.getElementById('confirmOrder').style.display="flex"
            document.getElementById('confirmOrder').style.marginLeft="70%"
            document.getElementById('cartCounter').textContent=`Go to cart(${data.inCart})`
        }
    }
}
async function presentAllProducts(){
    const productList = document.getElementById('productsList')
    productList.innerHTML=""
        const response = await fetch('/api/store/all-products',{
        headers: { "Content-Type": "application/json" },
        method: "POST",
    // body: JSON.stringify({emailInput,passwordInput}),
    })
    const data = await response.json()
    data.forEach(product => {
        const br = document.createElement('br')
        const br2 = document.createElement('br')
        const popup = document.createElement('p')
        popup.setAttribute('class','popups')
        popup.style.margin='auto'
        const positivePopup = document.createElement('p')
        positivePopup.style.margin='auto'
        const productDivTop = document.createElement('div')
        const productDivBot = document.createElement('div')
        productDivTop.style.display='flex'
        productDivTop.style.justifyContent='center';
        productDivBot.style.display='flex'
        productDivBot.style.flexDirection='column'
        productDivBot.style.justifyContent='center'
        const productDiv = document.createElement('div')
        productDiv.style.display='flex'
        productDiv.style.flexDirection='column'
        productDiv.append(productDivTop,productDivBot)
        const productDivBackground = document.createElement('div')
        productDivBackground.style.width='fit-content'
        productDivBackground.style.padding='10px'
        productDivBackground.style.margin='10px'
        productDivBackground.style.borderStyle='double'
        productDivBackground.style.borderRadius='15px'
        productDivBackground.style.borderWidth='20px'
        productDivBackground.style.borderColor='#181f26'
        productDivBackground.style.backgroundColor='#2f3c4a'
        productDivBackground.setAttribute('class','divEnterAnimation')
        productDiv.style.margin='5px'
        productDiv.style.borderRadius='10px'
        productDiv.style.padding='10px'
        productDiv.style.backgroundColor='white'
        productDivBackground.append(productDiv)
        productList.append(productDivBackground)
        const productName = product.name
        const productTitle = document.createElement('h2')
        productTitle.style.textDecoration='underline'
        productTitle.style.float='left'
        productTitle.textContent=productName
        const description = document.createElement('h3')
        description.innerHTML = `<span style='text-decoration: underline'>Description:</span>`
        const productPrice = product.price
        const price = document.createElement('h4')
        price.textContent=`Price: ${productPrice}$`
        price.style.margin='auto'
        const img = document.createElement('img')
        img.style.marginLeft='auto'
        img.style.maxHeight='250px'
        img.style.maxWidth='250px'
        img.src=product.image
        const buyButton = document.createElement('button')
        buyButton.innerHTML='Add to cart'
        buyButton.style.width='fit-content'
        buyButton.style.margin='auto'
        productDivTop.append(productTitle,img)
        productDivBot.append(description,product.description,br2,price,br,popup,positivePopup,buyButton)
        buyButton.onclick = ()=>addToCart(productName,productPrice,popup,positivePopup)
    });
}
async function chkCheck(checkbx){
    let searchInput = document.getElementById('searchInput').value
    if(checkbx.checked==true){
            const productList = document.getElementById('productsList')
            productList.innerHTML=""
            let category = checkbx.id
            const response = await fetch('/api/store/category-products',{
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({category,searchInput}),
            })
            const data = await response.json()
            data.forEach(product => {
                const br = document.createElement('br')
        const br2 = document.createElement('br')
        const popup = document.createElement('p')
        popup.setAttribute('class','popups')
        popup.style.margin='auto'
        const positivePopup = document.createElement('p')
        positivePopup.style.margin='auto'
        const productDivTop = document.createElement('div')
        const productDivBot = document.createElement('div')
        productDivTop.style.display='flex'
        productDivTop.style.justifyContent='center';
        productDivBot.style.display='flex'
        productDivBot.style.flexDirection='column'
        productDivBot.style.justifyContent='center'
        const productDiv = document.createElement('div')
        productDiv.style.display='flex'
        productDiv.style.flexDirection='column'
        productDiv.append(productDivTop,productDivBot)
        const productDivBackground = document.createElement('div')
        productDivBackground.style.width='fit-content'
        productDivBackground.style.padding='10px'
        productDivBackground.style.margin='10px'
        productDivBackground.style.borderStyle='double'
        productDivBackground.style.borderRadius='15px'
        productDivBackground.style.borderWidth='20px'
        productDivBackground.style.borderColor='#181f26'
        productDivBackground.style.backgroundColor='#2f3c4a'
        productDivBackground.setAttribute('class','divEnterAnimation')
        productDiv.style.margin='5px'
        productDiv.style.borderRadius='10px'
        productDiv.style.padding='10px'
        productDiv.style.backgroundColor='white'
        productDivBackground.append(productDiv)
        productList.append(productDivBackground)
        const productName = product.name
        const productTitle = document.createElement('h2')
        productTitle.style.textDecoration='underline'
        productTitle.style.float='left'
        productTitle.textContent=productName
        const description = document.createElement('h3')
        description.innerHTML = `<span style='text-decoration: underline'>Description:</span>`
        const productPrice = product.price
        const price = document.createElement('h4')
        price.textContent=`Price: ${productPrice}$`
        price.style.margin='auto'
        const img = document.createElement('img')
        img.style.marginLeft='auto'
        img.style.maxHeight='250px'
        img.style.maxWidth='250px'
        img.src=product.image
        const buyButton = document.createElement('button')
        buyButton.innerHTML='Add to cart'
        buyButton.style.width='fit-content'
        buyButton.style.margin='auto'
        productDivTop.append(productTitle,img)
        productDivBot.append(description,product.description,br2,price,br,popup,positivePopup,buyButton)
        buyButton.onclick = function(){addToCart(productName,productPrice,popup,positivePopup)}
            })
        }
}

function search(){
    let button = document.getElementById('allBox')
    if(button.checked)
        chkCheck(button)
    button = document.getElementById('classicalGuitars')
    if(button.checked)
        chkCheck(button)
    button = document.getElementById('acousticGuitars')
    if(button.checked)
        chkCheck(button)
    button = document.getElementById('electricGuitars')
    if(button.checked)
        chkCheck(button)
    button = document.getElementById('twelveStrings')
    if(button.checked)
        chkCheck(button)
    button = document.getElementById('tools')
    if(button.checked)
        chkCheck(button)
}
async function addToCart(productName,productPrice,popup,positivePopup){
    const response = await fetch('/api/is-logged-in',{
        headers: { "Content-Type": "application/json" },
    method: "POST"
    })
    if (response.ok){
        const response = await fetch('/api/store/add-to-cart',{
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({productName,productPrice}),
        })
        if(response.ok){
            data = await response.json()
            positivePopup.textContent='Product added to cart!'
            document.getElementById('confirmOrder').style.display='flex'
            document.getElementById('confirmOrder').style.marginLeft="70%"
            document.getElementById('cartCounter').textContent=`Go to cart(${data.inCart})`
        }
    }else{
        popup.textContent='Please sign in first.'
    }
}

window.onload=function(){
    isLoggedIn()
    presentAllProducts()
}