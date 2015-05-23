var crypto = require('crypto');
var uuid = require('node-uuid');
var moment = require('moment');
var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            firstname: DataTypes.STRING,
            lastname: DataTypes.STRING,
            gender: DataTypes.STRING,
            photo: DataTypes.STRING,
            isArtist: {type: DataTypes.BOOLEAN, defaultValue: false},

            city: DataTypes.STRING,
            country: DataTypes.STRING,
            biography: DataTypes.TEXT,
            birthday: DataTypes.DATE,
            school: DataTypes.STRING,

            //TODO maybe need other table association for social ?
            facebook: DataTypes.STRING,
            facebookUserId: DataTypes.BIGINT(30),
            twitter: DataTypes.STRING,
            instagram: DataTypes.STRING,
            tumblr: DataTypes.STRING,
            behance: DataTypes.STRING,
            web: DataTypes.STRING,

            hashedPassword: DataTypes.STRING,
            salt: DataTypes.STRING,
            provider: DataTypes.STRING,

            verified: {type: DataTypes.BOOLEAN, defaultValue: false},

            tokenVerifyEmail: DataTypes.STRING,
            tokenResetPassword: DataTypes.STRING,
            tokenResetPasswordExpires: DataTypes.DATE,
            featured: {type: DataTypes.BOOLEAN, defaultValue: false},
            isAdmin: {type: DataTypes.BOOLEAN, defaultValue: false},
            views: {type: DataTypes.INTEGER, defaultValue: 0}
        },
        {
            classMethods: {
                associate: function (models) {
                    User.belongsToMany(models.Category, {as: 'Specialties', through: 'Specialties'});
                    User.belongsToMany(models.Category, {as: 'Interests', through: 'Interests'});

                    User.belongsToMany(models.User, {as: 'Followers', foreignKey: 'FollowingId', through: 'Followers'});
                    User.belongsToMany(models.User, {as: 'Followings', foreignKey: 'FollowerId', through: 'Followers'});

                    User.belongsToMany(models.Work, {as: 'WorkLikes', through: 'WorkLikes'});
                    User.belongsToMany(models.Work, {as: 'WorkCollects', through: 'WorkCollects'});

                    User.belongsToMany(models.Product, {as: 'ProductLikes', through: 'ProductLikes'});
                    User.belongsToMany(models.Product, {as: 'ProductCollects', through: 'ProductCollects'});
                    User.belongsToMany(models.Product, {as: 'ProductBuyers', through: 'ProductBuyers'});

                    User.hasMany(models.Collection);
                    User.hasMany(models.Work);
                    User.hasMany(models.Product);
                }
            },
            instanceMethods: {
                makeSalt: function () {
                    return crypto.randomBytes(16).toString('base64');
                },
                authenticate: function (password) {
                    return this.encryptPassword(password, this.salt) === this.hashedPassword;
                },
                encryptPassword: function (password, salt) {
                    if (!password || !salt) return '';
                    salt = new Buffer(salt, 'base64');
                    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
                },
                makeTokenResetPassword: function () {
                    this.tokenResetPassword = uuid.v4();
                    this.tokenResetPasswordExpires = moment().add(1, 'hour');
                    return this.save();
                },
                follow: function (user) {
                    var scope = this;
                    return this.addFollower(user).then(function () {
                        return global.getNumFollowersOfUser({user: scope.id});
                    });
                },
                unFollow: function (user) {
                    var scope = this;
                    return this.removeFollower(user).then(function () {
                        return global.getNumFollowersOfUser({user: scope.id});
                    });
                }
            },
            hooks: {
                afterCreate: function (user, options) {
                    options.password = options.password || '123';
                    user.provider = 'local';
                    user.salt = user.makeSalt();
                    user.hashedPassword = user.encryptPassword(options.password, user.salt);
                    user.tokenVerifyEmail = uuid.v4();

                    var query = {
                        limit: _.random(1, 4),
                        order: [sequelize.fn('RAND', '')]
                    };
                    return global.db.Category.findAll(query).then(function (categories) {
                        var promises = [
                            user.save(),
                            global.db.Collection.create({name: 'Tienda', meta: 'store'}),
                            global.db.Collection.create({name: 'Deseos', meta: 'products'}),
                            global.db.Collection.create({name: 'Regalos', meta: 'products'}),
                            //TODO only in development enviroment
                            user.setSpecialties(categories),
                            user.setInterests(categories)
                        ];
                        return global.db.Sequelize.Promise.all(promises).then(function (data) {
                            return user.addCollections(data.slice(1, data.length - 2)).then(function () {
                                var ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                                promises = [
                                    global.db.Category.findAll({
                                        where: {id: {in: _.take(ids, _.random(1, 5))}},
                                        attributes: ['id']
                                    }),
                                    global.db.Tag.findAll({
                                        where: {id: {in: _.take(ids, _.random(1, 5))}},
                                        attributes: ['id']
                                    }),
                                    global.db.Work.create({
                                        name: chance.name(),
                                        description: chance.paragraph(),
                                        photo: '/img/works/obra' + (_.random(1, 12).toString()) + '.jpg',
                                        public: true
                                    }, {user: user.id, store: data[3]})
                                ];

                                return global.db.Sequelize.Promise.all(promises).then(function (data) {
                                    var categories = data[0], tags = data[1], work = data[2];
                                    promises = [
                                        work.setUser(user),
                                        work.setCategories(categories),
                                        work.setTags(tags)
                                    ];
                                    return global.db.Sequelize.Promise.all(promises);
                                });

                            });
                        });
                    });

                }
            }
        }
    );
    return User;
};
