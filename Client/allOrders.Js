async function checkSession(){
    const response = await fetch('/api/all-orders/session',{
                        headers: { "Content-Type": "application/json" },
                        method: "POST"})
    if (response.status==401){
        location.href='/'
    }
}
checkSession()

async function showOrders(){
    const response = await fetch('/api/all-orders',{
        headers: { "Content-Type": "application/json" },
        method: "POST",
    })
    const orders = await response.json()
    const ordersList = document.getElementById('ordersList')
    orders.forEach(order => {
        const nameTitle = document.createElement('h2')
        const emailTitle = document.createElement('h2')
        const date = document.createElement('h3')
        const hour = document.createElement('h4')
        const time = order.time
        nameTitle.textContent=`Recipient name: ${order.recipientName}`
        emailTitle.textContent=`Recipient email: ${order.recipientEmail}`
        date.textContent=`Date of order: ${time.date}`
        hour.textContent=`Time: ${time.time}`
        emailTitle.style.marginBottom='50px'
        const recipientOrder = order.order
        const sumTitle = document.createElement('h2')
        sumTitle.textContent = `Order sum: ${order.orderSum}$`
        const orderDivBackground = document.createElement('div')
        orderDivBackground.style.width='fit-content'
        orderDivBackground.style.padding='10px'
        orderDivBackground.style.margin='10px'
        orderDivBackground.style.borderStyle='double'
        orderDivBackground.style.borderRadius='15px'
        orderDivBackground.style.borderWidth='20px'
        orderDivBackground.style.borderColor='#181f26'
        orderDivBackground.style.backgroundColor='#2f3c4a'
        const orderDiv = document.createElement('div')
        orderDivBackground.append(orderDiv)
        orderDiv.style.margin='5px'
        orderDiv.style.borderRadius='10px'
        orderDiv.style.padding='10px'
        orderDiv.style.backgroundColor='white'
        hour.style.marginBottom='60px'
        orderDiv.append(nameTitle,emailTitle,date,hour)
        recipientOrder.forEach(product => {
            const name = document.createElement('h4')
            name.textContent = `Product Name: ${product.name}`
            const price = document.createElement('p')
            price.textContent= `Price: ${product.price}$`
            price.style.marginBottom='40px'
            orderDiv.append(name,price)
        });
        orderDiv.append(sumTitle)
        ordersList.append(orderDivBackground)
        orderDiv.style.width='600px'
        orderDivBackground.style.margin='auto'
        orderDivBackground.style.marginBottom='10px'
    });
}
showOrders()