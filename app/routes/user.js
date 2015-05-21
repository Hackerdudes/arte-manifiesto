var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user");

var accountRouter = require(config.routesDir + "/user-account");
var workRouter = require(config.routesDir + "/user-work");
var productRouter = require(config.routesDir + "/user-product");
var collectionRouter = require(config.routesDir + "/user-collection");
var middlewares = require(config.middlewaresDir + "/app");

router.use(function (req, res, next) {
    if (req.user && req.user.username == req.params.username) {
        req.profile = req.user;
        req.viewer = req.user.id;
        req.owner = true;
        return next();
    }
    var query = {where: {username: req.params.username}};
    global.db.User.find(query).then(function (user) {
        if (!user)
            if (req.xhr) {
                return res.noContent('User dont exists');
            }
            else {
                req.flash('errorMessage', 'User dont exists');
                return res.redirect('/');
            }
        req.profile = user;
        req.viewer = req.user ? req.user.id : 0;
        req.owner = false;
        return next();
    });
});

router.get(['/', '/portfolio'], controller.profile);
router.get('/likes/works', controller.profile);
router.get('/likes/products', controller.profile);
router.get('/products', controller.profile);
router.get('/collections/works', controller.profile);
router.get('/collections/products', controller.profile);
router.get('/followers', controller.profile);
router.get('/followings', controller.profile);

router.use('/account', middlewares.shouldLogged, accountRouter);

router.use('/work', workRouter);
router.use('/product', productRouter);
router.use('/collection', collectionRouter);

router.post('/follow', middlewares.shouldLogged, controller.follow);
router.post('/unfollow', middlewares.shouldLogged, controller.unfollow);
router.post('/featured', middlewares.shouldLogged, controller.featured);
router.post('/unfeatured', middlewares.shouldLogged, controller.unfeatured);

router.post(['/:page', '/portfolio/:page'], controller.portfolio);
router.post('/likes/works/:page', controller.likesWorks);
router.post('/likes/products/:page', controller.likesProducts);
router.post('/products/:page', controller.products);
router.post('/collections/works/:page', controller.collectionsWorks);
router.post('/collections/products/:page', controller.collectionsProducts);
router.post('/followers/:page', controller.followers);
router.post('/followings/:page', controller.followings);

/*
 router.use('/collection/', collectionRouter);
 router.use('/product/', productRouter);
 */
/*
 router.post('/update', controller.update);
 router.post('/collection/create', controller.collectionCreate);
 router.post('/collection/read', controller.collectionRead);
 router.post('/collection/update', controller.collectionUpdate);
 router.post('/collection/delete', controller.collectionDelete);
 router.post('/collection/reorder', controller.collectionReOrder);
 router.post('/featured', controller.userFeatured);
 router.post('/unfeatured', controller.userUnFeatured);
 */

module.exports = router;