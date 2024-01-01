import React, { useState, useRef } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

function NavbarComponent({ setShowModal }) {
  const handleAPIClick = () => {
    setShowModal(true);
  };

  return (
    <Navbar collapseOnSelect='true' expand={false} bg='dark' variant="dark">
      <Container>
        <Navbar.Brand>Nutritionai</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link eventKey='1' onClick={handleAPIClick}>API Key</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default NavbarComponent;
