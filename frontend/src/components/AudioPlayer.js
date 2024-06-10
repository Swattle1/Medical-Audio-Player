import React, { useState, useRef, useEffect } from 'react';
import { Button, Container, Card } from 'react-bootstrap';
import { IoPlayCircleOutline, IoPauseCircleOutline } from 'react-icons/io5';
import { FaRobot, FaUser } from 'react-icons/fa';
import { FaUserDoctor } from "react-icons/fa6";

const AudioPlayer = ({ audioSrc, onEnded }) => {
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
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', onEnded);
        };
    }, [onEnded]);

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

    const bubbleStyles = (color, align) => ({
        backgroundColor: color,
        borderRadius: '10px',
        padding: '10px',
        margin: '10px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: align,
        maxWidth: '60%',
        alignSelf: align === 'flex-end' ? 'flex-end' : 'flex-start',
        color: '#fff'
    });

    return (
        <Container className="audio-player mt-4">
            <div style={audioPlayerStyles}>
                {showChat && (
                    <Card className="mb-3">
                        <Card.Body style={{
                            maxHeight: '350px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <div style={bubbleStyles('blue', 'flex-start')}>
                                <FaUserDoctor size={28} style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}><strong>Doctor:</strong> How are you feeling today?</p>
                            </div>
                            <div style={bubbleStyles('grey', 'flex-start')}>
                                <FaRobot size={28} style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}><strong>Robot:</strong> How are you feeling today?</p>
                            </div>
                            <div style={bubbleStyles('green', 'flex-end')}>
                                <p style={{ margin: 0 }}><strong>Patient:</strong> I'm feeling a bit better now thank you.</p>
                                <FaUser size={28} style={{ marginLeft: '10px' }} />
                            </div>
                            <div style={bubbleStyles('blue', 'flex-start')}>
                                <FaUserDoctor size={28} style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}><strong>Doctor:</strong> That's good to hear. Let's go through your test results.</p>
                            </div>
                            <div style={bubbleStyles('grey', 'flex-start')}>
                                <FaRobot size={28} style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}><strong>Robot:</strong> Here are the latest statistics.</p>
                            </div>
                            <div style={bubbleStyles('green', 'flex-end')}>
                                <p style={{ margin: 0 }}><strong>Patient:</strong> Thank you for the update.</p>
                                <FaUser size={28} style={{ marginLeft: '10px' }} />
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
                        {showChat ? 'Hide Chat' : 'Show Chat'}
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default AudioPlayer;
