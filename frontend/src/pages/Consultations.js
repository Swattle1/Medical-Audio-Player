import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import AudioPlayer from '../components/AudioPlayer';

const Consultations = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');
    const [files, setFiles] = useState([]);
    const [conversationParty, setConversationParty] = useState('Doctor - Patient');

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

        // Setup event listener for storage changes for settings
        window.addEventListener('storage', (event) => {
            if (event.key === 'isDarkMode') {
                updateDarkMode();
            }
        });

        // Load available files - TEMPORARY
        setFiles([
            { name: 'EC1A', path: '/test-files/MZ01r/EC1A.wav' },
            { name: 'BR1B', path: '/test-files/MZ02r/BR1B.wav' },
        ]);

        // Load conversation party from local storage
        const savedParty = localStorage.getItem('conversationParty');
        if (savedParty) {
            setConversationParty(savedParty);
        }

        // Cleanup listener
        return () => {
            window.removeEventListener('storage', updateDarkMode);
        };
    }, []);

    return (
        <div className="consultations-page" style={pageStyles}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
            }}>
                <h2>Consultations</h2>
                {conversationParty}
            </div>
            <Container>
                <Form.Group controlId="fileSelect">
                    <Form.Label>Select Audio File</Form.Label>
                    <Form.Select
                        value={selectedFile}
                        onChange={(e) => setSelectedFile(e.target.value)}
                    >
                        <option value="">Select a file</option>
                        {files.map((file, index) => (
                            <option key={index} value={file.path}>{file.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                {selectedFile && <AudioPlayer audioSrc={selectedFile} />}
            </Container>
        </div>
    );
};

export default Consultations;