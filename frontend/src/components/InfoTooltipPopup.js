function InfoTooltipPopup({ isOpen, onClose, isResult }) {
  return (
    <div
      className={`popup popup_type_info-tooltip${
        isOpen ? " popup_opened" : ""
      }`}
    >
      <div className="popup__container popup__container_type_info-tooltip">
        <div className={`popup__result-icon_${isResult}`}></div>
        <h2 className="popup__title">{`${
          isResult === "success"
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте ещё раз."
        }`}</h2>
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

export default InfoTooltipPopup;
