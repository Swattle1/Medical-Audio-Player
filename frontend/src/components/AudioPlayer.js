import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Container, Card } from 'react-bootstrap';
import { IoPlayCircleOutline, IoPauseCircleOutline } from 'react-icons/io5';
import { FaRobot, FaUser } from 'react-icons/fa';
import { FaUserDoctor } from "react-icons/fa6";

const AudioPlayer = ({ audioSrc, onEnded, transcript, isPlaying, onPlayPause }) => {
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showChat, setShowChat] = useState(true);
    const audioRef = useRef(new Audio(audioSrc));

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        onPlayPause();
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

    const handleEnded = useCallback(() => {
        onEnded();
    }, [onEnded]);

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [handleEnded]);

    useEffect(() => {
        audioRef.current.src = audioSrc;
        audioRef.current.load();
    }, [audioSrc]);

    useEffect(() => {
        const loadAudio = async () => {
            if (audioSrc) {
                await audioRef.current.load();
                if (isPlaying) {
                    audioRef.current.play();
                }
            }
        };
        loadAudio();
    }, [audioSrc, isPlaying]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const bubbleStyles = (color, align) => ({
        backgroundColor: color,
        borderRadius: '10px',
        padding: '10px',
        margin: '10px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: align,
        maxWidth: '95%',
        alignSelf: align === 'flex-end' ? 'flex-end' : 'flex-start',
        color: '#fff'
    });

    return (
        <Container className="audio-player mt-4" style={{ maxWidth: '90%' }}>
            <div style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'space-between'
            }}>
                {showChat && (
                    <Card className="mb-3">
                        <Card.Body style={{
                            maxHeight: '850px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            {transcript.map((line, index) => {

                                const party = line.match(/DOCTOR|ROBOT|PATIENT/)[0].toLowerCase();

                                return (
                                    <div key={index} style={bubbleStyles(party === 'patient' ? 'green' : party === 'robot' ? 'grey' : 'blue', party === 'patient' ? 'flex-end' : 'flex-start')}>
                                        {party === 'doctor' && <FaUserDoctor size={28} style={{ flexShrink: 0, display: 'flex', marginRight: '10px' }} />}
                                        {party === 'robot' && <FaRobot size={28} style={{ flexShrink: 0, display: 'flex', marginRight: '10px' }} />}
                                        {party === 'patient' && <FaUser size={28} style={{ flexShrink: 0, display: 'flex', marginLeft: '10px' }} />}
                                        <p style={{ margin: 0 }}>
                                            <strong>{party.charAt(0).toUpperCase() + party.slice(1)}: </strong>
                                            {line.replace(/^\[\d+\]\s+(DOCTOR|ROBOT|PATIENT):\s*/, '')}
                                        </p>
                                    </div>
                                );
                            })}
                        </Card.Body>
                    </Card>
                )}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '10px 0'
                }}>
                    <span style={{ whiteSpace: 'nowrap', color: '#333' }}>{formatTime(progress)}</span>
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
                    
                    <span style={{ whiteSpace: 'nowrap', color: '#333' }}>{formatTime(duration)}</span>
                </div>
                <div className="controls" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        {isPlaying ? (
                            <IoPauseCircleOutline onClick={togglePlayPause} size={30} style={{ cursor: 'pointer', color: '#333' }} />
                        ) : (
                                <IoPlayCircleOutline onClick={togglePlayPause} size={30} style={{ cursor: 'pointer', color: '#333' }} />
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
