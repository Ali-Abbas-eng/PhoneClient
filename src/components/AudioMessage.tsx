import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { AudioMessageProps } from '../constants/types.tsx';
import { styles } from '../styles/styels.tsx';
import Slider from '@react-native-community/slider';

export const AudioMessage = ({ audioObject }: AudioMessageProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackPosition, setPlaybackPosition] = useState(0);

    useEffect(() => {
        // Update the playback position periodically
        const interval = setInterval(() => {
            if (isPlaying) {
                setPlaybackPosition(audioObject.getCurrentPosition());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, audioObject]);

    const handlePlayPause = () => {
        if (isPlaying) {
            audioObject.stop();
        } else {
            audioObject.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <View style={styles.audioMessageContainer}>
            <TouchableOpacity onPress={handlePlayPause}>
                <Image
                    source={
                        isPlaying
                            ? require('../../assets/components/AudioMessage/pause-icon.png')
                            : require('../../assets/components/AudioMessage/play-icon.png')
                    }
                    style={styles.playPauseIcon}
                />
            </TouchableOpacity>
            <Slider
                style={styles.progressBar}
                value={playbackPosition}
                minimumValue={0}
                maximumValue={audioObject.getDuration()}
                thumbTintColor="#000" // Customize to match your app's design
                minimumTrackTintColor="#000" // Customize to match your app's design
                maximumTrackTintColor="#000" // Customize to match your app's design
            />
        </View>
    );
};
