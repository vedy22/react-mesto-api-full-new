const { isURL } = require('validator');
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { // имя карточки:
    type: String, // это строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: { //  ссылка на картинку:
    type: String, // это строка
    required: true, // обязательное поле
    validate: {
      validator: (v) => isURL(v),
      message: 'Поле "link" должно быть валидным URL-адресом',
    },
  },
  owner: { //  ссылка на модель автора карточки:
    type: mongoose.Types.ObjectId, // String, // это ObjectId
    ref: 'user',
    required: true, // обязательное поле
  },
  likes: // список лайкнувших пост пользователей
    { // по умолчанию — пустой массив (поле default)
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
      default: [],
    },

  createdAt: { //  дата создания:
    type: Date, // это Date
    default: Date.now(), // значение по умолчанию Date.now
    required: true, // обязательное поле
  },
});
// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
