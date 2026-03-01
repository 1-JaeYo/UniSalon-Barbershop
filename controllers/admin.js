const Barber = require('../models/barber');

const renderEditPage = (res, pageTitle, path, editing, barber) => {
  res.render('admin/edit-barber', {
    pageTitle,
    path,
    editing,
    barber,
  });
};

const renderServerError = (res, path) => {
  res.status(500).render('500', {
    pageTitle: 'Server Error',
    path,
  });
};

exports.getAddBarber = (req, res, next) => {
  renderEditPage(res, 'Add Barber', '/admin/add-barber', false, null);
};

exports.postAddBarber = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  if (!req.user) {
    return res.redirect('/login');
  }

  try {
    const barber = new Barber({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user._id,
    });
    await barber.save();
    console.log('Created Profile');
    res.redirect('/admin/barbers');
  } catch (err) {
    console.log(err);
    renderServerError(res, '/admin/add-barber');
  }
};

exports.getEditBarber = async (req, res, next) => {
  const editMode = req.query.edit === 'true';
  if (!editMode) {
      return res.redirect('/');
  }

  const prodId = req.params.productId;

  try {
      const barber = await Barber.findOne({
        _id: prodId,
        userId: req.user._id
      });
      if (!barber) {
          return res.status(404).render('404', {
            pageTitle: 'Barber Not Found',
            path: '/admin/barbers',
          });
      }

      renderEditPage(res, 'Edit Barber', '/admin/edit-barber', editMode, barber);
  } catch (err) {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(404).render('404', {
          pageTitle: 'Barber Not Found',
          path: '/admin/barbers',
        });
      }
      renderServerError(res, '/admin/barbers');
  }
};


exports.postEditBarber = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  try {
      const barber = await Barber.findOne({
        _id: prodId,
        userId: req.user._id
      });
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
      renderServerError(res, '/admin/barbers');
  }
};


exports.getBarbers = (req, res, next) => {
  Barber.find({ userId: req.user._id })
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

exports.postDeleteProfile = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const result = await Barber.deleteOne({
      _id: prodId,
      userId: req.user._id
    });

    if (result.deletedCount === 0) {
      console.log('Barber not found!');
      return res.status(404).redirect('/admin/barbers');
    }

    console.log('REMOVED SUCCESSFULLY');
    res.redirect('/admin/barbers');
  } catch (err) {
    console.log(err);
    renderServerError(res, '/admin/barbers');
  }
};
