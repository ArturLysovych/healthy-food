const burger = $('.burger');
const burgerMenu = $('.burgerMenu');
const openCart = $('#openCart');
const closeCart = $('#closeCart');
const cartDiv = $('#cart');
const logo = $('#logo');
let addToCartDiv = $('.addToCart');
let item = $('.itemPlace .item');
const orderingForm = $('#orderingForm');
let burgerCounter = 0;
let cart = [];
burger.on('click', () => {
    burgerCounter++;
    if(burgerCounter%2 == 0) {
        burgerMenu.css('left', '-100%');
    }else {
        burgerMenu.css('left', '0');
    }
});
burgerMenu.find('a').on('click', () => {
    burgerCounter = 0;
    burgerMenu.css('left', '-100%');
});
function displayProducts(products){
    const productsDiv = $('.menuContainer'); 
    productsDiv.innerHTML = '';
    for(let el of products) {
        productsDiv.append(`
        <div class="card">
            <img class="card-image" src="./${el.imageUrl}" alt="">
            <div class="cardBottom">
                <h2>
                    <span>${el.name}</span>
                    <span>${el.price}$</span>
                </h2>
                <p>There are many things are needed to start the Fast Food Business.</p>
                <div>
                    <button class="addToCart">+</button>
                    <div class="stars">
                        <img src="./images/menu/card-star.svg" alt="">
                        <img src="./images/menu/card-star.svg" alt="">
                        <img src="./images/menu/card-star.svg" alt="">
                        <img src="./images/menu/card-star.svg" alt="">
                        <img src="./images/menu/card-star.svg" alt="">
                    </div>
                </div>
            </div>
        </div>
    `);
    }
    for(let el of $('.menuContainer .card')) {
        if($(el).index()+1 > 6) {
            $(el).hide();
        }
    }
}
axios
.get('/products')
.then((response) => {
    const products = response.data;
    displayProducts(products);
    $('.addToCart').on('click', function() {
        let clickedIndex = $(this).closest('.card').index();
        let thisImage = $(this).closest('.card').find('.card-image').attr('src');
        cart.push(
            {
                name: products[clickedIndex].name,
                price: products[clickedIndex].price,
                imageUrl: thisImage
            },
        )
        cartDiv.find('.itemPlace').append(`
            <div class="item">
                <div class="leftPart">
                    <img class="itemImage" src="${thisImage}" alt="">
                </div>
                <div class="rightPart">
                    <h2 class="itemName">${products[clickedIndex].name}</h2>
                        <p>There are many things are needed to start the Fast Food Business.</p>
                        <div class="stars">
                            <img src="./images/menu/card-star.svg" alt="">
                            <img src="./images/menu/card-star.svg" alt="">
                            <img src="./images/menu/card-star.svg" alt="">
                            <img src="./images/menu/card-star.svg" alt="">
                            <img src="./images/menu/card-star.svg" alt="">
                        </div>
                    <p class="itemPrice">${products[clickedIndex].price}$</p>
                </div>
            </div>
        `);        
    });
    $(document).on('click', '#cart .item', function() {
        let thisIndex = $(this).index();
        cart.splice(thisIndex, 1);
        $(this).remove();
        console.log(cart);
    });
})
.catch((error) => {
    console.error(`ERROR: ${error}`);
});
openCart.on('click', () => {
    cartDiv.css('display', 'flex');
    $('.homePage, #fixed-header').css('filter', 'blur(10px)');
    $('.burgerIndicator').hide();
});
closeCart.on('click', () => {
    cartDiv.hide();
    $('.homePage, #fixed-header').css('filter', 'blur(0px)');
    $('.burgerIndicator').css('display', 'flex');
});
orderingForm.on('submit', (event) => {
    event.preventDefault();
    $('.menu input').val('');
    cart = [];
    alert('successfully ordered');
    cartDiv.hide();
    $('.homePage, #fixed-header').css('filter', 'blur(0px)');
    $('.burgerIndicator').css('display', 'flex');
})
$('#loadMore').on('click', () => {
    $('.menuContainer .card').show();
});
logo.on('dblclick', () => {
    window.location.href = '/admin';
});