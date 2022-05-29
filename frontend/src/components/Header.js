import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';

function Header({email, handleLogOut}) {

  const location = useLocation();

  const [menu, setMenu] = useState('open');

  function toggleMobileMenu() {
    if(menu === 'open') {
      setMenu('close');
    } else {
      setMenu('open');
    }
  }

  return (
    <header className="header root__container">
      <div className="header__logo-block">
        <div className={`header__logo ${menu === 'close' ? 'header__logo_compact' : ''}`}></div>
        <button onClick={toggleMobileMenu} className={`header__menu-button header__menu-button_type_${menu}`}></button>
      </div>
      <div className={`header__auth ${menu === 'close' ? 'header__auth_visible' : ''}`}>
        {email && email}
        {email ? (
          <Link onClick={handleLogOut} className="header__link header__link_opacity" to="#">
            Выйти
          </Link>
        ) : (
          <Link className="header__link" to={location.pathname === '/sign-up' ? '/sign-in' : '/sign-up'}>
            {location.pathname === '/sign-up' ? 'Вход' : 'Регистрация'}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;