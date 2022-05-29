const { celebrate, Joi } = require('celebrate');
const routerUsers = require('express').Router(); // создали роутер

const {
  // createUser,
  getUserID,
  getUsers,
  updateProfileUser,
  updateAvatarUser,
  getUserAuth,
} = require('../controllers/users');

routerUsers.get('/users/me', getUserAuth);
routerUsers.get('/users/:id', getUserID);

routerUsers.delete(
  '/users/:id',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserID,
);

routerUsers.get('/users', getUsers);
routerUsers.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfileUser);

routerUsers.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.[a-z0-9_-]{2,3}))(:\d{2,5})?((\/.+)+)?\/?#?/m),
  }),
}), updateAvatarUser);

module.exports = routerUsers; // экспортировали роутер
