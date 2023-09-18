const productsList = document.querySelector("#product-list");
const productForm = document.querySelector("#product-form");
const name = document.querySelector("#name");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const image = document.querySelector("#image");
const formSubmit = document.querySelector("#form-submit");
const idHidden =  document.querySelector("#id-input");
const shopingCart =document.querySelector("#shopping-cart");
let shopArr = [];


function addShop(id){
    let filteredLen = shopArr.filter(x => x.id==id).length;
    if(filteredLen>0){
        shopArr.forEach(x=>{
            if(x.id==id){
                x.qty = x.qty+1;
            }

        })
        getShop();
        return
    }
    fetch("http://localhost:3000/products/"+id)
        .then((response) => response.json())
        .then((product) => {
            shopArr.push({
                name : product.name,
                price: product.price,
                id:product.id,
                qty:1
            })
            getShop()
        });
}
function getShop(){
    shopingCart.innerHTML = "";
    let h2 = document.createElement("h2");
    h2.innerText="shopping cart";
    shopingCart.appendChild(h2);
    shopArr.forEach(shop => {
        let divItem = document.createElement("div");
        divItem.classList.add("cart-element");
        let content =`
                    <p>name: ${shop.name}</p>
                    <p>price: ${shop.price}</p>
                    <p>qty:${shop.qty}</p>
                    <button class="delete-shop" data-id="${shop.id}"><i class="fa-solid fa-x"></i></button>`
        divItem.innerHTML = content;
        const deleteShopButton = divItem.querySelector(".delete-shop");
        deleteShopButton.addEventListener("click", () => {
            deleteShop(shop.id);
        });
        shopingCart.appendChild(divItem);
    })

    const finishShop = document.createElement("button");
    finishShop.innerText = "finish shopping";
    finishShop.classList.add("finish-shop-class");
    finishShop.addEventListener("click", () => {
        shopArr = [];
        getShop();
        alert("finished");
    })
    shopingCart.appendChild(finishShop);
}
function deleteShop(id){
    shopArr =  shopArr.filter(y => y.id != id);
    getShop()

}


function getProducts() {
    fetch("http://localhost:3000/products")
        .then((response) => response.json())
        .then((products) => {
            productsList.innerHTML = "";

            products.forEach((product) => {
                const listItem = document.createElement("li");

                listItem.innerHTML = `
        <div class="productDiv">
        <img src="${product.image}" alt="${product.name}" width="100%"/>
        <strong>${product.name}</strong> - $${product.price}
        <p>${product.description}</p>
        <button class="shopping-button" data-id="${product.id}"><span><i class="fa-solid fa-cart-shopping"></i></span>  ADD TO CART</button>
        <div class="buttons-div">
        <button class="delte-button" data-id="${product.id}">Delete</button>
        <button class="edit-button" data-id="${product.id}">Edit</button>
        </div>
        </div>
        `;

                const deleteButton = listItem.querySelector(".delte-button");
                deleteButton.addEventListener("click", () => {
                    deleteProduct(product.id);
                });

                const editButton = listItem.querySelector(".edit-button");
                editButton.addEventListener("click", () => {
                    editProduct(product.id);
                });
                const shopButton = listItem.querySelector(".shopping-button");
                shopButton.addEventListener("click", () => {
                    addShop(product.id);
                });

                productsList.appendChild(listItem);
            });
        });
}

function delteProduct1(id) {
    console.log(id);
}

function addProduct() {
    const productName = name.value;
    const productPrice = parseFloat(price.value);
    const productDescription = description.value;
    const productImage = image.value;

    const newProduct = {
        name: productName,
        price: productPrice,
        description: productDescription,
        image: productImage,
    };

    fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
    }).then(() => {
        getProducts();
        productForm.reset();
    });
}

function editProduct(id) {
    fetch("http://localhost:3000/products/"+id)
        .then((response) => response.json())
        .then((product) => {
            name.value = product.name;
            price.value = product.price;
            idHidden.value = product.id;
            formSubmit.innerHTML = "edit";
            description.value = product.description;
            image.value = product.image;
        });
}

function finishEdit(){

    const productName = name.value;
    const productPrice = parseFloat(price.value);
    const productDescription = description.value;
    const productImage = image.value;
    const id = idHidden.value;


    const editProduct = {
        id: id,
        name: productName,
        price: productPrice,
        description: productDescription,
        image: productImage,
    };

    fetch(`http://localhost:3000/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(editProduct)
    }).then(() => {
        getProducts();
        productForm.reset();
    });

    formSubmit.innerHTML = "add product";
}

function deleteProduct(id) {
    fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
    }).then(() => {
        getProducts();
    });
}

productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if(formSubmit.innerHTML == "edit"){
        finishEdit();
    }else {
        addProduct();
    }
});
getProducts();