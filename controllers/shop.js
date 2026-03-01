const Barber = require('../models/barber');
const ContactMessage = require('../models/contact-message');

const getFlashMessage = (req, type) => {
  const messages = req.flash(type);
  return messages.length > 0 ? messages[0] : null;
};

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

exports.getBarber = async (req, res, next) => {
  const prodId = req.params.productId;

  try {
    const barber = await Barber.findById(prodId);

    if (!barber) {
      return res.status(404).render('404', {
        pageTitle: 'Barber Not Found',
        path: '/barbers',
      });
    }

    res.render('shop/barber-detail', {
      barber: barber,
      pageTitle: barber.title,
      path: '/barbers',
    });
  } catch (err) {
    console.log(err);
    if (err.name === 'CastError') {
      return res.status(404).render('404', {
        pageTitle: 'Barber Not Found',
        path: '/barbers',
      });
    }
    res.status(500).render('500', {
      pageTitle: 'Server Error',
      path: '/barbers',
    });
  }
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
  res.render('shop/about', {
    pageTitle: 'About Us',
    path: '/about',
  });
};

exports.getContactUs = (req, res, next) => {
  res.render('shop/contactUs', {
    pageTitle: 'Contact Us',
    path: '/contactUs',
    errorMessage: getFlashMessage(req, 'error'),
    successMessage: getFlashMessage(req, 'success'),
  });
};

exports.postContactUs = async (req, res, next) => {
  const name = req.body.name ? req.body.name.trim() : '';
  const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
  const message = req.body.message ? req.body.message.trim() : '';

  if (!name || !email || !message) {
    req.flash('error', 'Please complete every field before submitting.');
    return res.redirect('/contactUs');
  }

  try {
    const contactMessage = new ContactMessage({
      name: name,
      email: email,
      message: message,
    });
    await contactMessage.save();
    req.flash('success', 'Thanks for the feedback. Your message was sent.');
    res.redirect('/contactUs');
  } catch (err) {
    console.log(err);
    req.flash('error', 'Your message could not be saved. Please try again.');
    res.redirect('/contactUs');
  }
};
