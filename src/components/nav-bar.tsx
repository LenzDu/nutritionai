import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { useDailyValueStore, useApiPopupStore } from '../stores';

function NavbarComponent() {
  const setShowApiModal = useApiPopupStore((state) => state.setShowApiModal);
  const handleAPIClick = () => {
    setShowApiModal(true);
  };

  const setShowDailyValueModal = useDailyValueStore((state) => state.setShowModal);
  const handleDailyValueClick = () => {
    setShowDailyValueModal(true);
  };

  return (
    <Navbar collapseOnSelect={true} expand={false} bg='dark' variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to={"/"}>Nutritionai</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" eventKey='1'>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/history" eventKey='2'>History</Nav.Link>
            <Nav.Link eventKey='3' onClick={handleAPIClick}>API Key</Nav.Link>
            <Nav.Link eventKey='4' onClick={handleDailyValueClick}>Daily Value</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
