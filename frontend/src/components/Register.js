import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register({ onRegisterUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onRegisterUser({
      email,
      password,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="auth">
      <h1 className="auth__title">Регистрация</h1>
      <input
        type="email"
        className="auth__input"
        placeholder="Email"
        value={email || ""}
        onChange={handleEmailChange}
        required
      />
      <input
        type="password"
        className="auth__input"
        placeholder="Пароль"
        value={password || ""}
        onChange={handlePasswordChange}
        required
      />
      <button type="submit" className="auth__submit">
        Зарегистрироваться
      </button>
      <Link to="/sign-in" className="auth__link">
        Уже зарегистрированы? Войти
      </Link>
    </form>
  );
}

export default Register;
