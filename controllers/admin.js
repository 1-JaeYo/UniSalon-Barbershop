const Barber = require('../models/barber');

exports.getAddBarber = (req, res, next) => {
  res.render('admin/edit-barber', {
    pageTitle: 'Add Barber',
    path: '/admin/add-barber',
    editing: false,
  });
};

exports.postAddBarber = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const barber = new Barber({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  barber
    .save()
    .then(result => {
      console.log('Created Profile');
      res.redirect('/admin/barbers');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditBarber = async (req, res, next) => {
  const editMode = req.query.edit === 'true';
  if (!editMode) {
      return res.status(403).redirect('/');
  }

  const prodId = req.params.productId;

  try {
      const barber = await Barber.findById(prodId);
      if (!barber) {
          return res.status(404).render('404', { pageTitle: 'Barber Not Found' });
      }

      res.render('admin/edit-barber', {
          pageTitle: 'Edit Barber',
          path: '/admin/edit-barber',
          editing: editMode,
          barber: barber,
      });
  } catch (err) {
      console.log(err);
      res.status(500).render('500', { pageTitle: 'Error!' });
  }
};


exports.postEditBarber = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  try {
      const barber = await Barber.findById(prodId);
      if (!barber) {
          console.log('Barber not found!');
          return res.status(404).redirect('/admin/barbers');
      }

      barber.title = updatedTitle;
      barber.price = updatedPrice;
      barber.description = updatedDesc;
      barber.imageUrl = updatedImageUrl;

      await barber.save();
      console.log('UPDATED BARBER!');
      res.redirect('/admin/barbers');
  } catch (err) {
      console.log(err);
      res.status(500).render('500', { pageTitle: 'Error!' });
  }
};


exports.getBarbers = (req, res, next) => {
  Barber.find()
    .then(barbers => {
      console.log(barbers);
      res.render('admin/barbers', {
        barbers: barbers,
        pageTitle: 'Admin Barbers',
        path: '/admin/barbers',
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProfile = (req, res, next) => {
  const prodId = req.body.productId;
  Barber.findById(prodId)
    .then(barber => {
      if (!barber) {
        console.log('Barber not found!');
        return res.status(404).redirect('/admin/barbers');
      }
      return Barber.deleteOne({ _id: prodId });
    })
    .then(() => {
      console.log('REMOVED SUCCESSFULLY');
      res.redirect('/admin/barbers');
    })
    .catch(err => {
      console.log(err);
      res.status(500).render('500', { pageTitle: 'Error!' });
    });
};

