const Barber = require('../models/barber');

exports.getBarbers = (req, res, next) => {
  Barber.find()
    .then(barbers => {
      console.log(barbers);
      res.render('shop/barber-list', {
        barbers: barbers,
        pageTitle: 'All Barbers',
        path: '/barbers',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getBarber = (req, res, next) => {
  const prodId = req.params.productId;
  Barber.findById(prodId)
    .then(barber => {
      res.render('shop/barber-detail', {
        barber: barber,
        pageTitle: barber.title,
        path: '/barbers',
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Barber.find()
    .then(barbers => {
      res.render('shop/index', {
        barbers: barbers,
        pageTitle: 'UniSalon',
        path: '/',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getAbout = (req, res, next) => {
  Barber.find()
    .then(barbers => {
      res.render('shop/about', {
        barbers: barbers,
        pageTitle: 'About Us',
        path: '/',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getContactUs = (req, res, next) => {
  Barber.find()
    .then(barbers => {
      res.render('shop/contactUs', {
        barbers: barbers,
        pageTitle: 'Contact Us',
        path: '/',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

