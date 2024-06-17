import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import AudioPlayer from '../components/AudioPlayer';

const Consultations = () => {
    //define the apiUrl variable - CHANGE PORT IN the .env file if needed
    const apiUrl = process.env.REACT_APP_API_URL;

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const [transcript, setTranscript] = useState([]);
    const [transcriptIndex, setTranscriptIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
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

        const updateConversationParty = () => {
            const convPartySetting = localStorage.getItem('conversationParty');
            setConversationParty(convPartySetting || 'Doctor - Patient');
        };

        updateDarkMode();
        updateConversationParty();

        // Setup event listener for storage changes for settings
        window.addEventListener('storage', (event) => {
            if (event.key === 'isDarkMode') {
                updateDarkMode();
            } else if (event.key === 'conversationParty') {
                updateConversationParty();
            }
        });

        // Fetch the list of folders from the backend API
        fetch(`${apiUrl}/Consultations/folders`)
            .then(response => response.json())
            .then(data => setFolders(data))
            .catch(error => console.error('Error fetching folders:', error));

        // Cleanup listener
        return () => {
            window.removeEventListener('storage', updateDarkMode);
            window.removeEventListener('storage', updateConversationParty);
        };
    }, [apiUrl]);


    useEffect(() => {
        if (selectedFolder) {

            // Fetch the files in the selected folder from the backend API
            fetch(`${apiUrl}/Consultations/utterances/${selectedFolder}?convParty=${encodeURIComponent(conversationParty)}`)
                .then(response => response.json())
                .then(data => {
                    // Converts file paths to URLs
                    const filesWithUrls = data.map(file => ({
                        ...file,
                        filePath: `${apiUrl}/Consultations/audio?filePath=${encodeURIComponent(file.filePath)}`
                    }));
                    setFiles(filesWithUrls);
                })
                .catch(error => console.error('Error fetching files:', error));
        }
    }, [selectedFolder, conversationParty, apiUrl]);

    useEffect(() => {
        if (files.length > 0) {
            fetch(`${apiUrl}/Consultations/transcript/${selectedFolder}?convParty=${encodeURIComponent(conversationParty)}`)
                .then(response => response.json())
                .then(data => {
                    setTranscript(data.transcript);
                })
                .catch(error => console.error('Error fetching transcript:', error));
        }
    }, [files, selectedFolder, conversationParty, apiUrl]);

    const handleAudioEnded = () => {
        if (currentFileIndex < files.length - 1) {
            setCurrentFileIndex(currentFileIndex + 1);
            setTranscriptIndex(transcriptIndex + 1);
        } else {
            setIsPlaying(false);
            // If all audio files have been played and there are remaining transcript lines
            if (transcriptIndex < transcript.length) {
                setTranscriptIndex(transcript.length);
            }
        }
    };

    return (
        <div className="consultations-page" style={pageStyles}>
            <Container>
                <Form.Group controlId="folderSelect">
                    <Form.Label>Select Consultation Folder</Form.Label>
                    <Form.Select
                        value={selectedFolder}
                        onChange={(e) => {
                            setSelectedFolder(e.target.value);
                            setFiles([]);
                            setCurrentFileIndex(0);
                            setTranscriptIndex(0);
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
                        transcript={transcript.slice(0, transcriptIndex + 1)}
                        isPlaying={isPlaying && hasStarted}
                        onPlayPause={() => {
                            setIsPlaying(!isPlaying);
                            setHasStarted(true);
                        }}
                    />
                )}
            </Container>
        </div>
    );
};

export default Consultations;
