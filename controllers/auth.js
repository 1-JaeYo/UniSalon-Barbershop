const bcrypt = require('bcryptjs')

const User = require('../models/user');

const getFlashMessage = (req, type) => {
    const messages = req.flash(type);
    if (messages.length > 0) {
        return messages[0];
    }
    return null;
};

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: getFlashMessage(req, 'error')
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: getFlashMessage(req, 'error')
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;

    if (!email || !password) {
        req.flash('error', 'Enter both your email and password.');
        return res.redirect('/login');
    }

    User.findOne({
        email: email
    })
        .then(user => {
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        };
        bcrypt
            .compare(password, user.password)
            .then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                console.log(err);
                return res.redirect('/')
                });
            }
            req.flash('error', 'Invalid email or password');
            res.redirect('/login')
            })
            .catch(err => {
            console.log(err);
            res.redirect('/login');
            })
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!email || !password) {
        req.flash('error', 'Enter both your email and password.');
        return res.redirect('/signup');
    }

    if (password.length < 6) {
        req.flash('error', 'Password must be at least 6 characters long.');
        return res.redirect('/signup');
    }

    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('/signup');
    }

    User
        .findOne({
        email: email,
        })
        .then(userDoc => {
        if (userDoc) {
            req.flash('error', 'E-mail exists already, please pick a different one');
            return res.redirect('/signup');
        }
        return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword
            });
            return user.save();
            })
            .then(result => {
            res.redirect('/login')
            });
        })
        .catch(err => {
        console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};
