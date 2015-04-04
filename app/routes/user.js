var express = require('express');
var router = express.Router();

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user");
var middlewares = require(config.middlewaresDir + '/app');

router.get('/:username', controller.profile);
router.get('/:username/configuration', controller.configuration);

router.get('/:username/work/create', controller.workCreateView);

router.post('/update', controller.update);

router.post('/collection/create', controller.collectionCreate);
router.post('/collection/update', controller.collectionUpdate);
router.post('/collection/remove', controller.collectionRemove);
router.post('/collection/reorder', controller.collectionReOrder);

router.post('/work/create', controller.workCreate);
router.post('/work/remove', controller.workRemove);
router.post('/work/update', controller.workUpdate);

router.post('/work/add/collection', controller.workAddCollection);
router.post('/work/switch/collection', controller.workSwitchCollection);


router.post('/follow', controller.follow);
router.post('/unfollow', controller.unfollow);
router.post('/like', controller.like);
router.post('/unlike', controller.unlike);

module.exports = router;