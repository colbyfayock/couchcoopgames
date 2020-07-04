import React from 'react';
import { FaGamepad } from 'react-icons/fa';

import Container from 'components/Container';

const Header = () => {
  return (
    <header id="header" className="container">
      <Container>
        <h1>
          <FaGamepad />
          Couch Co-Op Games
        </h1>
      </Container>
    </header>
  );
};

export default Header;