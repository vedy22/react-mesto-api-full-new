import React, { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import { api } from "../utils/api.js";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltipPopup from "./InfoTooltipPopup";
import Loader from "./Loader";
import * as auth from "../utils/auth.js";

function App() {
  const [currentUser, setCurrentUser] = useState({});

  const [currentEmail, setCurrentEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isRegisterResult, setIsRegisterResult] = useState("");
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});

  const [loggedIn, setLoggedIn] = useState(false);

  const history = useHistory();

  function handleInfoTooltipPopupOpen(result) {
    setIsRegisterResult(result);
    setIsInfoTooltipPopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setSelectedCard({});
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(newUser) {
    api.editUserInfo(newUser.name, newUser.about)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(newAvatarUrl) {
    api.changeAvatar(newAvatarUrl.avatar)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [cards, setCards] = useState([]);

  useEffect(() => {
    checkToken();
    if (localStorage.getItem("token")) {
      api.getAllNeededData()
        .then(([cards, user]) => {
          setCurrentUser(user);
          setCards(cards.reverse());
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentEmail]);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(id) {
    api.deleteCard(id)
      .then(() => {
        setCards(cards.filter((card) => card._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(card) {
    api.postCard(card.name, card.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleLogin(token) {
    auth.getContent(token)
      .then((res) => {
        if (res) {
          setCurrentEmail(res.email);
          // авторизуем пользователя
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleLogOut() {
    setLoggedIn(false);
    localStorage.removeItem("token");
    history.push("/sign-in");
    setCurrentEmail("");
  }

  function checkToken() {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      if (token) {
        handleLogin(token);
      }
    }
  }

  function handleRegisterUser(newUser) {
    setIsLoading(true);
    auth.register(newUser.password, newUser.email)
      .then((res) => {
        if (res) {
          handleInfoTooltipPopupOpen("success");
          setTimeout(redirectToLogin, 3000);
        } else {
          handleInfoTooltipPopupOpen("fail");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleLoginUser(user) {
    setIsLoading(true);
    auth.authorize(user.email, user.password)
      .then((data) => {
        if (data.token) {
          handleLogin(data.token);
        }
      })
      .catch(() => {
        // запускается, если пользователь не найден
        handleInfoTooltipPopupOpen("fail");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function redirectToLogin() {
    closeAllPopups();
    history.push("/sign-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <main>
        <Header email={currentEmail} handleLogOut={handleLogOut} />

        <Switch>
          <Route path="/sign-up">
            {
              isLoading
                ? <Loader />
                : <Register onRegisterUser={handleRegisterUser} />
            }
          </Route>
          <Route path="/sign-in">
            {
              isLoading
                ? <Loader />
                : <Login onLoginUser={handleLoginUser} />
            }
          </Route>
          <ProtectedRoute
            path="/"
            loggedIn={loggedIn}
            component={Main}
            onCardClick={handleCardClick}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
        </Switch>
      </main>

      <Footer />

      <InfoTooltipPopup
        isOpen={isInfoTooltipPopupOpen}
        onClose={closeAllPopups}
        isResult={isRegisterResult}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />

      <PopupWithForm onClose={closeAllPopups} name="submit" title="Вы уверены?">
        <input type="submit" value="Да" className="popup__save-button" />
      </PopupWithForm>

      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </CurrentUserContext.Provider>
  );
}

export default App;
