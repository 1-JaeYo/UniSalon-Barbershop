const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get('/add-barber', isAuth, adminController.getAddBarber);

router.get('/barbers', isAuth, adminController.getBarbers);

router.post('/add-barber', isAuth, adminController.postAddBarber);

router.get('/edit-barber/:productId', isAuth, adminController.getEditBarber);

router.post('/edit-barber', isAuth, adminController.postEditBarber);

router.post('/delete-barber', isAuth, adminController.postDeleteProfile);

module.exports = router;
