fetch ('https://fakestoreapi.com/products') 
.then(res => {      
    return res.json(); 
})
.then(data => {         
    data.forEach(product => {
        let description = product.description;
        let title = product.title;
        let id = product.id;
        const markup = `
    <div class="col">
        <div class="card border-dark m-2" style="height:80vh; min-height:750px;">
            <div class="card-body">
            <img src="${product.image}" class="card-img-top" style= "width: 100%; height: 35vh; object-fit: contain;"></img>
            <h3 class="card-title" style="font-size:large;">${product.title}</h3>
            <p class="card-text text-secondary ">${product.category}</p>
            <p class="card-text">${description.length > 20 ? description.substring(0, 20).concat(
               `<a href = "#" data-bs-toggle="modal" data-bs-target="#${product.id}">...more</a>`) : description}</p>
            <div class="row">
                <div class="col">
                    <h4 class="card-text d-md-inline-block">&dollar;${product.price}</h4>
                    <a onclick="addItem(${product.id})" class="btn btn-secondary d-md-inline-block ms-md-3">Add to Cart</a>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="${product.id}">
        <div class="modal-dialog" >
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title style="max-width: 400px;"" id="${product.id}">${product.title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex" style="max-width: 500px;">
                    <div class="row">
                        <div class="col col-12 d-flex justify-content-center">
                            <img src="${product.image}" style="object-fit: contain; max-width: 400px;"></img>
                        </div>
                        <p class="col text-secondary">${product.category}</p>
                        <p>${product.description}</p>
                        <div>
                            <h4 class="card-text d-md-inline-block">${product.price}kr</h4>
                            <a onclick="addItem(${product.id})"  class="btn btn-secondary d-md-inline-block ms-md-3">Add to Cart</a>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `
    const productCol = document.createElement('div');
    productCol.classList.add('col-md-4');
    productCol.innerHTML = markup;
    document.querySelector('#product-row').appendChild(productCol); 
    })
})


// *** Item Handling ***

// Async function to wait for fetch

async function getJSON(product) {
    return await fetch(product)
        .then((response)=>response.json())
        .then((responseJson)=>{return responseJson});
}

// Add item to shopping Cart

async function addItem(itemId){
    let product = "https://fakestoreapi.com/products/" + itemId;
    shoppingCart.push(await this.getJSON(product));
    
    localStorage.setItem('storedCart', JSON.stringify(shoppingCart));
}


//Check out code

const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const telephone = document.getElementById('telephone');
const street = document.getElementById('street');
const zipcode = document.getElementById('zipcode');
const city = document.getElementById('city');
const shoppingCart = [];

form.addEventListener('submit', e => {
    e.preventDefault();
    checkInputs();
});

function checkInputs() {

    // Get values from fields
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const telephoneValue = telephone.value.trim();
    const streetValue = street.value.trim();
    const zipcodeValue = zipcode.value.trim();
    const cityValue = city.value.trim();

    // For form to show error in all fields -> need to go through all checks everytime
    let arr = [];
    arr.push(checkUserName(usernameValue));
    arr.push(checkEmail(emailValue));
    arr.push(checkTelephone(telephoneValue));
    arr.push(checkStreet(streetValue));
    arr.push(checkZipCode(zipcodeValue));
    arr.push(checkCity(cityValue));

    if (!arr.includes(false)) {
        successPurchase();
    }
}

function successPurchase() {
    // Show modal
    let myModal = new bootstrap.Modal('#confirmation-modal');
    myModal.show();
  
    // Set modal text
    var modalText = document.getElementById("modal-bodyText");
    modalText.appendChild(document.createTextNode("Shipped to:"));
    modalText.appendChild(document.createElement("br"));
    modalText.appendChild(document.createTextNode(username.value.trim()));
    modalText.appendChild(document.createElement("br"));
    modalText.appendChild(document.createTextNode(street.value.trim()));
    modalText.appendChild(document.createElement("br"));
    modalText.appendChild(document.createTextNode(zipcode.value.trim()));
    modalText.appendChild(document.createElement("br"));
    modalText.appendChild(document.createTextNode(city.value.trim()));
}


// *** Input checks ***

function checkUserName(usernameValue) {
    if (usernameValue === '') {
        setErrorFor(username, 'Name cannot be blank');
        return false;
    } else if (usernameValue.length < 2) {
        setErrorFor(username, 'Name must be more than one character');
        return false;
    } else if (usernameValue.length > 50) {
        setErrorFor(username, 'Name cannot be more than 50 characters');
        return false;
    } else {
        setSuccessFor(username);
        return true;
    }
}
function checkEmail(emailValue) {
    if (emailValue === '') {
        setErrorFor(email, 'Email cannot be blank');
        return false;
    } else if (emailValue.length > 50) {
        setErrorFor(username, 'Email cannot be more than 50 characters');
        return false;
    } else if (!isEmail(emailValue)) {
        setErrorFor(email, 'Not a valid email');
        return false;
    } else {
        setSuccessFor(email);
        return true;
    }
}
function checkTelephone(telephoneValue) {
    if (telephoneValue === '') {
        setErrorFor(telephone, 'Telephone cannot be blank');
        return false;
    } else if (!checkTelephoneString(telephoneValue)) {
        setErrorFor(telephone, 'Number can only be 1-9, "-", or "()"');
        return false;
    } else {
        setSuccessFor(telephone);
        return true;
    }
}

function checkTelephoneString(telephoneValue){
    for (var i=0; i < telephoneValue.length; i++) {
        if (!((telephoneValue.charAt(i) === "-") || (/^\d$/.test(telephoneValue.charAt(i))) ||
        (telephoneValue.charAt(i) === "(") || (telephoneValue.charAt(i) === ")"))) {
            return false;
        }  
    } return true;
}

function checkStreet(streetValue) {
    if (streetValue === '') {
        setErrorFor(street, 'Street cannot be blank');
        return false;
    } else {
        setSuccessFor(street);
        return true;
    }
}

function checkZipCode(zipcodeValue){
    if (zipcodeValue === '') {
        setErrorFor(zipcode, 'Zip Code cannot be blank');
        return false;
    } else if ( !(/(^[0-9]{3}\s?[0-9]{2}$)/.test(zipcodeValue))) {
        setErrorFor(zipcode, 'Zip Code must be in format "000 00"');
        return false;
    } else {
        setSuccessFor(zipcode);
        return true;
    }
}

function checkCity(cityValue){
    if (cityValue === '') {
        setErrorFor(city, 'City cannot be blank');
        return false;
    } else if (cityValue.length > 50) {
        setErrorFor(city, 'City cannot be more than 50 characters');
        return false;
    } else {
        setSuccessFor(city);
        return true;
    }
}

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control error';
    small.innerText = message;
}

function setSuccessFor(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function increaseAmount(item){
    let amountId = item.id
    let amountCol = document.querySelector(`#amount${amountId}`)
    let currentAmount = amountCol.innerHTML
    let newAmount = parseInt(currentAmount)+1 
    amountCol.innerHTML = newAmount
    let priceCol = document.querySelector(`#price${amountId}`)
    let price = parseFloat(priceCol.innerHTML)
    let priceSumCol = document.querySelector(`#priceSum${amountId}`)
    let priceSum = parseFloat(priceSumCol.innerHTML)
    let newSum = parseFloat((priceSum+price).toFixed(2))
    priceSumCol.innerHTML = newSum
    adjustTotal()
}
function decreaseAmount(item){
    let amountId = item.id
    let amountCol = document.querySelector(`#amount${amountId}`)
    let currentAmount = amountCol.innerHTML
    let newAmount = parseInt(currentAmount)-1
    let priceCol = document.querySelector(`#price${amountId}`)
    let price = parseFloat(priceCol.innerHTML)
    let priceSumCol = document.querySelector(`#priceSum${amountId}`)
    let priceSum = parseFloat(priceSumCol.innerHTML)
    let newSum = parseFloat((priceSum-price).toFixed(2))
    priceSumCol.innerHTML = newSum
    if(parseInt(currentAmount) <= 0){
        removeProduct(item)
    }else{
        amountCol.innerHTML = newAmount
        adjustTotal()
    }  
}

function removeProduct(item){
    let id = parseInt(item.id)
    let tempArr = JSON.parse(localStorage.getItem('storedCart'))
    item.parentElement.parentElement.parentElement.parentElement.     parentElement.remove()
    for(i = 0; i < tempArr.length; i++){
        if(tempArr[i].id === id){
            tempArr.splice(i,1)
            console.log(tempArr)
        }
    }
    localStorage.setItem('storedCart', JSON.stringify(tempArr))
    adjustTotal()
}

function displayAddedProducts(){
    const loadedCart= JSON.parse(localStorage.getItem('storedCart'))
    loadedCart.forEach(product => {
        let markup = `
        <div class="row p-2 borders bg-white mb-2" >
            <div class="col col-12 ">
                <div class="row">
                    <div class="col ">
                        <img src="${product.image}" style="object-fit: contain; height:60px;">
                    </div>
                    <div class="col">
                        <div class="col">Amount:</div>
                        <div class="col" id="amount${product.id}">1</div>
                    </div>
                    <div class="col">
                        <div class="col justify-content-center d-flex">${product.title}</div>
                    </div>
                    <div class="col">
                        <div class="col">&dollar;Price:</div>
                        <div class="col d-flex" id="price${product.id}">${product.price}</div>
                    </div>
                    <div class="col">
                        <div class="col">&dollar;Total:</div>
                        <div class="col priceSum"" d-flex" id="priceSum${product.id}">${product.price}</div>
                    </div>
                    <div class="col ">
                        <div class="btn btn-outline-secondary d-flex justify-content-center" onclick="increaseAmount(this)" id ="${product.id}">&plus;</div>
                    </div>
                    <div class="col ">
                        <div class="btn btn-outline-secondary d-flex justify-content-center" onclick="decreaseAmount(this)" id ="${product.id}">&minus;</div>
                    </div>
                    <div class="col">
                        <div class="btn btn-danger d-flex justify-content-center" onclick="removeProduct(this)" id ="${product.id}">Remove</div>
                    </div>
                </div>     
            </div>
        </div>
        `
    const productCol = document.createElement('div');
    productCol.classList.add('col');
    productCol.innerHTML = markup;
    document.querySelector('#insertPlace').appendChild(productCol);
    adjustTotal()
    })  
}
function adjustTotal(){
    let priceTotalCol = document.querySelector('#priceTotal')
    let tempArr = Array.from(document.getElementsByClassName('priceSum'))
    let priceTotal = 0
    for(i = 0; i < tempArr.length;i++){
        let x = parseFloat(tempArr[i].innerHTML)
        let y = parseFloat((priceTotal += x).toFixed(2))
        priceTotal = parseFloat(y)

    }
    priceTotalCol.innerHTML = priceTotal
}
function emptyCart(){
    localStorage.removeItem('storedCart')
    location.reload()
}

