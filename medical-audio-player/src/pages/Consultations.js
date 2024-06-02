import React, { useEffect, useState } from 'react';

const Consultations = () => {
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

        updateDarkMode(); // initial update on component mount

        // Setup event listener for storage changes
        window.addEventListener('storage', (event) => {
            if (event.key === 'isDarkMode') {
                updateDarkMode();
            }
        });

        // Cleanup listener
        return () => {
            window.removeEventListener('storage', updateDarkMode);
        };
    }, []);

    return (
        <div className="consultations-page" style={pageStyles}>
            <h2 className="text-center">Consultations</h2>
        </div>
    );
};

export default Consultations;
