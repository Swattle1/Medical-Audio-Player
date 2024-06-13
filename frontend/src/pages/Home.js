import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

const Home = () => {

  const [isDarkMode, setIsDarkMode] = useState(false);

  const pageStyles = {
    backgroundColor: isDarkMode ? '#000000' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#000000',
    minHeight: '100vh',
    padding: '20px'
  };

  useEffect(() => {
    const updateDarkMode = () => {
      const darkModeSetting = localStorage.getItem('isDarkMode');
      setIsDarkMode(darkModeSetting ? JSON.parse(darkModeSetting) : false);
    };

    updateDarkMode();

    // Event listener for storage changes
    window.addEventListener('storage', (event) => {
      if (event.key === 'isDarkMode') {
        updateDarkMode();
      }
    });

    // Cleanup
    return () => {
      window.removeEventListener('storage', updateDarkMode);
    };
  }, []);
  return (
    <div style={pageStyles}>
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100 text-center" >
        <h1>Welcome to the Medical Consultation Player!</h1>
        <h3>Use the navigation tool on the left</h3>
      </Container>
    </div>
  );
};

export default Home;
