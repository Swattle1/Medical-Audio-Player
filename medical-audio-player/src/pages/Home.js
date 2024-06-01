import React from 'react';
import { Container } from 'react-bootstrap';

const Home = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1>Welcome to the Medical Consultation Player!</h1>
      <h3>Use the navigation tool on the left</h3>
    </Container>
  );
};

export default Home;
