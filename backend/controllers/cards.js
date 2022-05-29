const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err'); // 404
const ForbiddenError = require('../errors/forbidden-err'); // 403
const BadRequestError = require('../errors/bad-request-err'); // 400
const InternalServerError = require('../errors/in-server-err'); // 500

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена'); // 404
      }

      if (String(card.owner) === req.user._id) {
        Card.findByIdAndRemove(req.params.id)
          .then(() => {
            res.status(200).send({ message: 'Карточка удалена' });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new BadRequestError('Передан некорректный _id карточки.');
            }
            throw new InternalServerError('Произошла ошибка');
          });
      } else {
        throw new ForbiddenError('Нельзя удалять чужую карточку'); // 403
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Невалидный id'); // 400
      }
      throw err;
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  // console.log(`owner: ${req.user._id}`); // _id станет доступен
  const owner = req.user._id;
  const { name, link } = req.body;
  const likes = [];
  Card.create({
    name, link, owner, likes,
  })
    .then((card) => res.send({
      createdAt: card.createdAt,
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: card.owner,
      _id: card.id,
    }))
    .catch((err) => {
      // console.dir(err);
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки')); // 400
      } else {
        next(err);
      }
    });
};
module.exports.getCards = (req, res, next) => {
  Card.find({}) // запрос всех
    .then((cards) => res.send({ cards }))//
    .catch(next);
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена'); // 404
      } else {
        res.send({
          createdAt: card.createdAt,
          likes: card.likes,
          link: card.link,
          name: card.name,
          owner: card.owner,
          _id: card.id,
        });
      }
    })
    .catch((err) => {
      // console.dir(err);
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id')); // 400
      } else {
        next(err);
      }
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');// 404
      } else {
        res.send({
          createdAt: card.createdAt,
          likes: card.likes,
          link: card.link,
          name: card.name,
          owner: card.owner,
          _id: card.id,
        });
      }
    })
    .catch((err) => {
      // console.dir(err);
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id')); // 400
      } else {
        next(err);
      }
    });
};
