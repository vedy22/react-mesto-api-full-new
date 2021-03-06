import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ onCardClick, onCardLike, onCardDelete, card }) {
  const currentUser = React.useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner === currentUser._id;
  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = `place__delete ${
    isOwn ? "" : "place__delete_hidden"
  }`;

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some((i) => i === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `place__like ${
    isLiked ? "place__like_active" : ""
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card._id);
  }

  return (
    <li className="place">
      <img
        onClick={handleClick}
        className="place__photo"
        title="Увеличить фото"
        src={card.link}
        alt={card.name}
      />
      <button
        onClick={handleDeleteClick}
        type="button"
        aria-label="Удалить"
        title="Удалить"
        className={cardDeleteButtonClassName}
      ></button>
      <div className="place__info">
        <p className="place__name">{card.name}</p>
        <div className="place__like-group">
          <button
            onClick={handleLikeClick}
            type="button"
            aria-label="Нравится"
            className={cardLikeButtonClassName}
          ></button>
          <span className="place__like-num">{card.likes.length}</span>
        </div>
      </div>
    </li>
  );
}

export default Card;
