class Api {
  constructor({baseUrl}) {
    this.baseUrl = baseUrl;
  }

  _checkApiResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Произошла ошибка: ${res.status}`);
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
      headers: {
        authorization: localStorage.getItem("token"),
        'Content-Type': 'application/json'
      }
    })
      .then(this._checkApiResponse);
  }

  postCard(name, link) {
    return fetch(`${this.baseUrl}/cards`, {
        method: 'POST',
        headers: {
          authorization: localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          link: link
        }),
      })
      .then(res => this._checkApiResponse(res));
  }

  deleteCard(id) {
    return fetch(`${this.baseUrl}/cards/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
      })
      .then(res => this._checkApiResponse(res));
  }

  changeLikeCardStatus(id, isLiked) {
    if(isLiked) {
      return fetch(`${this.baseUrl}/cards/${id}/likes`, {
        method: 'PUT',
        headers: {
          authorization: localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
      })
      .then(res => this._checkApiResponse(res));
    } else {
      return fetch(`${this.baseUrl}/cards/${id}/likes`, {
        method: 'DELETE',
        headers: {
          authorization: localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
      })
      .then(res => this._checkApiResponse(res));
    }
  }

  changeAvatar(link) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: localStorage.getItem("token"),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: link
      }),
    })
    .then(res => this._checkApiResponse(res));
  }

  editUserInfo(name, about) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: localStorage.getItem("token"),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        about: about
      }),
    })
    .then(res => this._checkApiResponse(res));
  }

  getUserInfo() {
    return fetch(`${this.baseUrl}/users/me`, { 
      headers: {
        authorization: localStorage.getItem("token"),
        'Content-Type': 'application/json'
      }
    })
    .then(res => this._checkApiResponse(res));
  }

  getAllNeededData() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()])
  }
}

export const api = new Api({
  baseUrl: 'https://api.mestopr.nomoreparties.sbs',
});