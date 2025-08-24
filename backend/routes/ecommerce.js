// Backend/routes/ecommerce.js
const express = require('express');
const { getProducts, createOrder } = require('../controllers/ecommerceController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/products', getProducts);
router.post('/orders', auth, createOrder);

module.exports = router;