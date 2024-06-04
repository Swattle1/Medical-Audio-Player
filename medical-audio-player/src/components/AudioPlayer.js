import React, { useState, useRef, useEffect } from 'react';
import { Button, Container, Card } from 'react-bootstrap';
import { IoPlayCircleOutline, IoPauseCircleOutline } from 'react-icons/io5';

const AudioPlayer = ({ audioSrc }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showChat, setShowChat] = useState(false);
    const audioRef = useRef(new Audio(audioSrc));

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleTimeUpdate = () => {
        setProgress(audioRef.current.currentTime);
    };

    const handleSeek = (event) => {
        const newTime = (event.target.value / 100) * duration;
        audioRef.current.currentTime = newTime;
        setProgress(newTime);
    };

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    useEffect(() => {
        audioRef.current.src = audioSrc;
        audioRef.current.load();
    }, [audioSrc]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const audioPlayerStyles = {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between'
    };

    const progressBarContainerStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        margin: '10px 0'
    };

    return (
        <Container className="audio-player mt-4">
            <div style={audioPlayerStyles}>
                {showChat && (
                    <Card className="mb-3">
                        <Card.Body style={{
                            maxHeight: '350px',
                            overflowY: 'auto'
                        }}>
                            <div>
                                {/* Fake transcript data */}
                                <p><strong>Doctor:</strong> How are you feeling today?</p>
                                <p><strong>Patient:</strong> I'm feeling a bit better, thank you.</p>
                                <p><strong>Doctor:</strong> That's good to hear. Let's go through your test results.</p>
                            </div>
                        </Card.Body>
                    </Card>
                )}
                <div style={progressBarContainerStyles}>
                    <span style={{ whiteSpace: 'nowrap' }}>{formatTime(progress)}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={(progress / duration) * 100}
                        onChange={handleSeek}
                        style={{
                            flex: '1',
                            margin: '0 10px'
                        }}
                        className="w-100"
                    />
                    <span style={{ whiteSpace: 'nowrap' }}>{formatTime(duration)}</span>
                </div>
                <div className="controls" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        {isPlaying ? (
                            <IoPauseCircleOutline onClick={togglePlayPause} size={30} style={{ cursor: 'pointer' }} />
                        ) : (
                            <IoPlayCircleOutline onClick={togglePlayPause} size={30} style={{ cursor: 'pointer' }} />
                        )}
                    </div>
                    <Button style={{ marginLeft: 'auto' }} variant="outline-success" onClick={() => setShowChat(!showChat)}>
                        {showChat ? 'Toggle Chat' : 'Toggle Chat'}
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default AudioPlayer;
