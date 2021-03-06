function ImagePopup({ card, onClose }) {
  return (
    <div
      className={`popup popup_type_image-preview${card._id ? ' popup_opened' : ''}`}
    >
      <div className="popup__container popup__container_type_image-preview">
        <figure className="popup__figure">
          <img
            src={`${card._id ? card.link : "#"}`}
            alt={card.name}
            className="popup__image"
          />
          <figcaption className="popup__figcaption">{card.name}</figcaption>
        </figure>
        <button
          onClick={onClose}
          type="button"
          className="popup__close-button"
          aria-label="Закрыть"
          title="Закрыть"
        ></button>
      </div>
    </div>
  );
}

export default ImagePopup;
