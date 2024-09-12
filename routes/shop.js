const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/barbers', shopController.getBarbers);

router.get('/about', shopController.getAbout);

router.get('/contactUs', shopController.getContactUs);

router.get('/barbers/:productId', shopController.getBarber);


module.exports = router;
