import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [playbackDevice, setPlaybackDevice] = useState('');
  const [conversationParty, setConversationParty] = useState('Doctor - Patient');
  const [playbackDevices, setPlaybackDevices] = useState([]);

  useEffect(() => {
    // Load settings from local storage on component mount
    const savedIsDarkMode = JSON.parse(localStorage.getItem('isDarkMode'));
    const savedPlaybackDevice = localStorage.getItem('playbackDevice');
    const savedConversationParty = localStorage.getItem('conversationParty');

    if (savedIsDarkMode !== null) setIsDarkMode(savedIsDarkMode);
    if (savedPlaybackDevice) setPlaybackDevice(savedPlaybackDevice);
    if (savedConversationParty) setConversationParty(savedConversationParty);

    // Check if navigator.mediaDevices is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(() => getConnectedDevices('audiooutput', setPlaybackDevices))
        .catch((err) => {
          console.error('Permission denied or error: ', err);
          setPlaybackDevices([{ deviceId: 'default', label: 'Default Device' }]);
        });
    } else {
      console.log('Media devices not supported');
      setPlaybackDevices([{ deviceId: 'default', label: 'Default Device' }]);
    }
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
            <option value=''>Select Playback Device</option>
            {playbackDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Device ${device.deviceId}`}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>

      <Form style={formStyles}>
        <Form.Group controlId="formConversationParty">
          <Form.Label>Conversation Party</Form.Label>
          <Form.Select value={conversationParty} onChange={handleConversationPartyChange}>
            <option value="Doctor - Patient">Doctor - Patient</option>
            <option value="Doctor - Robot - Patient">Doctor - Robot - Patient</option>
            <option value="Robot - Patient">Robot - Patient</option>
          </Form.Select>
        </Form.Group>
      </Form>

      <Form.Group>
        <Form.Label>Theme</Form.Label>
        <div style={formStyles}>
          <Button onClick={toggleDarkMode} variant={isDarkMode ? 'dark' : 'light'} title="Toggle dark mode">
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </Button>
        </div>
      </Form.Group>

      <Form.Group>
        <div style={formStyles}>
          <Button onClick={handleSave} variant="success" title="Save settings">
            Save Settings
          </Button>
        </div>
      </Form.Group>
    </div>
  );
};

// Function to get connected devices
function getConnectedDevices(type, callback) {
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      const filtered = devices.filter(device => device.kind === type);
      callback(filtered);
    })
    .catch(err => console.error('Error enumerating devices:', err));
}

export default Settings;
