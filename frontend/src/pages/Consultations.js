import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import AudioPlayer from '../components/AudioPlayer';

const Consultations = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const [transcript, setTranscript] = useState([]);

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

        // Fetch the list of folders from the backend API
        fetch('https://localhost:7205/Consultations/folders')
            .then(response => response.json())
            .then(data => setFolders(data))
            .catch(error => console.error('Error fetching folders:', error));

        // Cleanup listener
        return () => {
            window.removeEventListener('storage', updateDarkMode);
        };
    }, []);

    useEffect(() => {
        if (selectedFolder) {
            // Fetch the files in the selected folder from the backend API
            fetch(`https://localhost:7205/Consultations/utterances/${selectedFolder}`)
                .then(response => response.json())
                .then(data => {
                    // Converts file paths to URLs
                    const filesWithUrls = data.map(file => ({
                        ...file,
                        filePath: `https://localhost:7205/Consultations/audio?filePath=${encodeURIComponent(file.filePath)}`
                    }));
                    setFiles(filesWithUrls);
                })
                .catch(error => console.error('Error fetching files:', error));
        }
    }, [selectedFolder]);

    useEffect(() => {
        if (files.length > 0) {
            fetch(`https://localhost:7205/Consultations/transcript/${selectedFolder}`)
                .then(response => response.json())
                .then(data => {
                    setTranscript(data.transcript);
                })
                .catch(error => console.error('Error fetching transcript:', error));
        }
    }, [files]);

    const handleAudioEnded = () => {
        if (currentFileIndex < files.length - 1) {
            setCurrentFileIndex(currentFileIndex + 1);
        } else {
            setCurrentFileIndex(0);
        }
    };

    return (
        <div className="consultations-page" style={pageStyles}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
            }}>
                <h2>Consultations</h2>
            </div>
            <Container>
                <Form.Group controlId="folderSelect">
                    <Form.Label>Select Consultation Folder</Form.Label>
                    <Form.Select
                        value={selectedFolder}
                        onChange={(e) => {
                            setSelectedFolder(e.target.value);
                            setFiles([]);
                            setCurrentFileIndex(0);
                        }}
                    >
                        <option value="">Select a folder</option>
                        {folders.map((folder, index) => (
                            <option key={index} value={folder}>{folder}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                {files.length > 0 && (
                    <AudioPlayer 
                        audioSrc={files[currentFileIndex].filePath} 
                        onEnded={handleAudioEnded} 
                        transcript={transcript.slice(0, currentFileIndex + 1)} // Pass transcript lines to the current file index
                    />
                )}
            </Container>
        </div>
    );
};

export default Consultations;
