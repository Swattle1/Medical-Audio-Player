import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [playbackDevice, setPlaybackDevice] = useState('Select Playback Device');
  const [conversationParty, setConversationParty] = useState('Doctor - Patient');

  useEffect(() => {
    // Load settings from local storage on component mount
    const savedIsDarkMode = JSON.parse(localStorage.getItem('isDarkMode'));
    const savedPlaybackDevice = localStorage.getItem('playbackDevice');
    const savedConversationParty = localStorage.getItem('conversationParty');

    if (savedIsDarkMode !== null) setIsDarkMode(savedIsDarkMode);
    if (savedPlaybackDevice) setPlaybackDevice(savedPlaybackDevice);
    if (savedConversationParty) setConversationParty(savedConversationParty);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSave = () => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    localStorage.setItem('playbackDevice', playbackDevice);
    localStorage.setItem('conversationParty', conversationParty);
    alert('Settings saved successfully!');
  };

  const handlePlaybackDeviceChange = (event) => {
    setPlaybackDevice(event.target.value);
  };

  const handleConversationPartyChange = (event) => {
    setConversationParty(event.target.value);
  };

  const pageStyles = {
    backgroundColor: isDarkMode ? '#000000' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#000000',
    minHeight: '100vh',
    padding: '20px'
  };

  const formStyles = {
    marginBottom: '20px'
  };

  return (
    <div style={pageStyles}>
      <h2>Settings</h2>

      <Form style={formStyles}>
        <Form.Group controlId="formPlaybackDevice">
          <Form.Label>Playback Device</Form.Label>
          <Form.Select value={playbackDevice} onChange={handlePlaybackDeviceChange}>
            <option value="Device 1">Device 1</option>
            <option value="Device 2">Device 2</option>
            <option value="Device 3">Device 3</option>
          </Form.Select>
        </Form.Group>
      </Form>

      <Form style={formStyles}>
        <Form.Group controlId="formConversationParty">
          <Form.Label>Conversation Party</Form.Label>
          <Form.Select value={conversationParty} onChange={handleConversationPartyChange}>
            <option>Doctor - Patient</option>
            <option>Doctor - Robot - Patient</option>
            <option>Robot - Patient</option>
          </Form.Select>
        </Form.Group>
      </Form>

      <Form.Label>Theme</Form.Label>
      <div style={formStyles}>
        <Button onClick={toggleDarkMode} variant={isDarkMode ? 'dark' : 'light'}>
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Button>
      </div>

      <div style={formStyles}>
        <Button onClick={handleSave} variant="success">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
