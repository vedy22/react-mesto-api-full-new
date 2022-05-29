import React, { useState } from "react";

function Login({ onLoginUser }) {
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
    if (!email || !password) {
      return;
    }
    onLoginUser({
      email,
      password,
    });
    setEmail("");
    setPassword("");
  }

  return (
    <form onSubmit={handleSubmit} className="auth">
      <h1 className="auth__title">Вход</h1>
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
        Войти
      </button>
    </form>
  );
}

export default Login;
