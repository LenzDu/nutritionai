import React, { useState, useRef } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

function NavbarComponent({ setShowModal }) {
  const handleAPIClick = () => {
    setShowModal(true);
  };

  return (
    <Navbar bg='dark' variant="dark">
      <Container>
        <Navbar.Brand>Nutritionai</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title="Menu" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={handleAPIClick}>API</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default NavbarComponent;
