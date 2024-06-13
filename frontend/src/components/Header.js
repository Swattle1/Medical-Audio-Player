import React, { useState } from 'react';
import { Navbar, Container, Offcanvas} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsTextLeft } from "react-icons/bs";
const Header = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top">
      <BsTextLeft onClick={handleShow} size={30} style={{ marginLeft: 'auto', color: 'white', cursor: 'pointer' }}/>

        <Container>
          <Navbar.Brand >Medical Consultation Player</Navbar.Brand>
          
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} placement="start" className="bg-dark text-light">
        <Offcanvas.Header closeButton className="bg-dark">
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='bg-dark'>
          <nav className="flex-column">
            <Link to="/" className="nav-link text-light py-2" onClick={handleClose}>Home</Link>
            <Link to="/consultations" className="nav-link text-light py-2" onClick={handleClose}>Consultations</Link>
            <Link to="/settings" className="nav-link text-light py-2" onClick={handleClose}>Settings</Link>
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
