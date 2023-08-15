const express = require('express');
const axios = require('axios');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3001;
let adminPassword = 'admin';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: './uploads/' });

let products = [
    { name: 'Vegie Muffen', price: 16, imageUrl: 'card-image1.svg' },
    { name: 'Salads', price: 12, imageUrl: 'card-image2.svg' },
    { name: 'Burger', price: 10, imageUrl: 'card-image3.svg' },
    { name: 'Delmonico Steak dish', price: 14, imageUrl: 'card-image4.svg' },
    { name: 'Egg Masala', price: 9, imageUrl: 'card-image5.svg' },
    { name: 'Peach Melba dish', price: 15, imageUrl: 'card-image6.svg' },
];

app.get('/products', (req, res) => {
    res.json(products);
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin', 'admin.html'));
});
app.post('/admin/add-product', upload.single('image'), (req, res) => {
    const { name, price } = req.body;
    const image = req.file;

    if (!name || !price || !image) {
        return res.status(400).json({ error: 'Не всі поля заповнені' });
    }

    let newProduct = {
        name,
        price: price,
        imageUrl: image.filename
    };
    products.push(newProduct);
    res.json(newProduct);
});
app.post('/admin/update-product', (req, res) => {
    products = req.body;
});

app.post('/admin/change-password', (req, res) => {
    const newPassword = req.body.newPassword;
    adminPassword = newPassword;
    res.json({ success: true });
});

app.get('/admin/check-password', (req, res) => {
    res.send(adminPassword);
});
app.listen(PORT, () => {
    console.log(`Server work on port: ${PORT}`);
});