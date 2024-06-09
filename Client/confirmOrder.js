async function checkSession(){
    const response = await fetch('/api/is-logged-in',{
        headers: { "Content-Type": "application/json" },
    method: "POST"
    })
    if(!response.ok)
      location.href='/store'
    else
        showCart()
  }
  checkSession()

  async function showCart(){
        const response = await fetch('/api/confirm-order',{
        headers: { "Content-Type": "application/json" },
        method: "POST",
    })
    const data = await response.json()
    if(data.inCart == 0)
        location.href='/store'
    const productList = document.getElementById('productsList')
    productList.innerHTML=""
    let sum = 0
    data.order.forEach(product => {
        const br = document.createElement('br')
        const br2 = document.createElement('br')
        const popup = document.createElement('p')
        popup.setAttribute('class','popups')
        popup.style.margin='auto'
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
        sum+=productPrice
        const removeButton = document.createElement('button')
        removeButton.innerHTML='Remove from cart'
        removeButton.style.width='fit-content'
        removeButton.style.margin='auto'
        removeButton.style.backgroundColor='red'
        removeButton.style.borderColor='#400c0e'
        removeButton.addEventListener("mouseover",()=>{removeButton.style.backgroundColor='#400c0e'})
        removeButton.addEventListener("mouseleave",()=>{removeButton.style.backgroundColor='red'})
        removeButton.onclick = function(){removeProduct(productName)}
        productDivTop.append(productTitle,img)
        productDivBot.append(description,product.description,br2,price,br,removeButton)
    });
    showButton(sum)
}
async function showButton(sum){
    const buttonDiv = document.getElementById('hide')
    buttonDiv.style.display = 'block'
    document.getElementById('container').style.width='300px'
    document.getElementById('cartSum').textContent=`Total price: ${sum}$`
    const confirmButton = document.getElementById('confirm')
    confirmButton.onclick = function(){confirmOrder(sum)}
}
async function removeProduct(productName){
    const response = await fetch('/api/confirm-order/remove-product',{
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({productName})
    })
    if (response.ok){
        showCart()
    }
}
async function confirmOrder(orderSum){
    const response = await fetch('/api/confirm-order/confirmed',{
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({orderSum})
    })
    if (response.ok){
        document.body.innerHTML=""
        const container = document.createElement("div")
        container.setAttribute('id',"container")
        document.body.append(container)
        let h1 = document.createElement("h1");
        h1.style.position = "relative";
        h1.style.marginTop='30px'
        let h2 = document.createElement("h1");
        h2.style.position = "relative";
        h2.style.marginTop='30px'
        h1.innerHTML = "Order Recieved, one of our";
        h2.innerHTML = "representatives will contact you shortly."
        container.append(h1,h2)
        setTimeout(() => {
            location.href='/'
        }, 4700);
    }
}