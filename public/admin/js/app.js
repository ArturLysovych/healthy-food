const logForm = $('#log-admin-menu-form');
const logBtn = $('#admin-menu-button');
const addProductForm = $('#addProductForm');
const productContainer = $('#productContainer');
const deleteBtn = $('#deleteBtn');
const openProductsList = $('#btn-products-page');
const openAddProducts = $('#btn-addProducts-page');
const openProfile = $('#btn-profile-page');
const productsListPage = $('#productsList-page');
const addProductsPage = $('#addProducts-page');
const profilePage = $('#profile-page');
const changePasswordForm = $('#changePassword-form');
const adminPanel = $('#admin-panel');
let burgerIndicator = 0;

logForm.on('submit', (event) => {
    event.preventDefault();
    const passwordVal = $('#admin-menu-input').val();
    axios
    .get('/admin/check-password')
    .then((response) => {
        const adminPassword = response.data;
        if (passwordVal === adminPassword) {
            alert('Successful login');
            addProductForm.show();
            logForm.hide();
            adminPanel.css('display', 'flex');
        } else {
            alert('Invalid password');
        }
    })
    .catch((error) => {
        console.error(`ERROR: ${error}`);
    });
});
changePasswordForm.on('submit', (event) => {
    event.preventDefault();
    const lastPassword = $('#lastPassword').val();
    const newPassword = $('#newPassword').val();

    axios
    .get('/admin/check-password')
    .then((response) => {
        const adminPassword = response.data;
        if (lastPassword === adminPassword) {
            axios
            .post('/admin/change-password', { newPassword })
            .then((response) => {
                if (response.data.success) {
                    alert('Password changed successfully');
                } else {
                    alert('Failed to change password');
                }
            })
            .catch((error) => {
                console.error(`ERROR: ${error}`);
            });
        } else {
            alert('Invalid password');
        }
    })
    .catch((error) => {
        console.error(`ERROR: ${error}`);
    });
});
openProductsList.on('click', () => {
    productsListPage.css('display', 'flex');
    addProductsPage.hide();
    profilePage.hide();
});
openAddProducts.on('click', () => {
    addProductsPage.css('display', 'flex');
    productsListPage.hide();
    profilePage.hide();
});
openProfile.on('click', () => {
    profilePage.css('display', 'flex');
    productsListPage.hide();
    addProductsPage.hide();
});
addProductForm.on('submit', (event) => {
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);
    axios.post('/admin/add-product', formData)
    .then((response) => {
        const newProduct = response.data;
        alert('Додано новий товар');
        form.reset();
        getList ();
    })
    .catch((error) => {
        console.error(`Помилка при додаванні товару :${error}`);
    });
});
getList ();
function getList () {
    axios
    .get('/products')
    .then((response) => {
        let products = response.data;
        let sortedByNameProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
        let sortedByPriceProducts = [...products].sort((a, b) => a.price - b.price);

        function showList(arr) {
            productContainer.html('');
            for(let el of arr) {
                productContainer.append(`
                    <div class="product">
                        <div class="checkbox-wrapper">
                            <div class="checkbox"><i class="fa-solid fa-check"></i></div>
                        </div>
                        <div class="vrLine"></div>
                        <h2>${el.name}</h2>
                        <div class="vrLine"></div>
                        <h3>${el.price}$</h3>
                        <div class="vrLine"></div>
                        <div class="stars">
                            <img src="./images/star.svg" height="40" width="40" alt="">
                            <img src="./images/star.svg" height="40" width="40" alt="">
                            <img src="./images/star.svg" height="40" width="40" alt="">
                            <img src="./images/star.svg" height="40" width="40" alt="">
                            <img src="./images/star.svg" height="40" width="40" alt="">
                        </div>
                    </div>     
                `)
            }
            $('.checkbox').on('click', function() {
                $(this).find('i').toggle();
            });
        }
        showList(products);       

        $('#filterBtn').on('click', () => {
            $('.filterOptions').toggle();
        });
        
        $('.filterOptions div').on('click', function() {
            let thisArr = $(this).attr('data-arr');
            showList(eval(thisArr));
            $('.filterOptions div').css('background', '#FFFFFF');
            $(this).css('background', '#DC780B');
            if (thisArr === 'products') {
                deleteBtn.css('pointerEvents', 'auto');
            } else deleteBtn.css('pointerEvents', 'none');
        });
        deleteBtn.on('click', function() {
            $(productContainer.children().get().reverse()).each(function(index, element) {
                if($(this).find('.checkbox i').css('display') == 'block') {
                    console.log(index);
                    products.splice($(this).index(), 1);
                    setTimeout(()=>{ $(this).remove() })
                } else ;
            });
            axios.post('/admin/update-product', products)
            .then((response) => {
                alert('Видалено 1 товар');
            })
            .catch((error) => {
                console.error(`Помилка при оновленні товару :${error}`);
            });
        });
    })
    .catch((error) => {
        console.error(`ERROR: ${error}`);
    });
}
$('.burger').on('click', () => {
    burgerIndicator++;
    if(burgerIndicator%2 === 0) {
        adminPanel.find('.leftPart').css('left', '-100%');
    }else {
        adminPanel.find('.leftPart').css('left', '0');
    }
});
$('.pages div').on('click', () => {
    adminPanel.find('.leftPart').css('left', '-100%');
    burgerIndicator = 0;
});