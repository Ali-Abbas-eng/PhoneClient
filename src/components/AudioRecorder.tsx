import React, { useState } from 'react';
import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    AVModeIOSOption,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
} from 'react-native-audio-recorder-player';
import ReactNativeFileSystem, { DocumentDirectoryPath } from 'react-native-fs';
import SoundPlayer from 'react-native-sound-player';
import { Button, View } from 'react-native';
import { playSound } from '../utils/AudioManager.tsx';
interface AudioFileData {
    fileCopyUri: string;
    size: number;
    type: string;
    name: string;
}
const audioRecorderPlayer = new AudioRecorderPlayer();

export const VoiceNoteRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioPath, setAudioPath] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioFile, setAudioFile] = useState<AudioFileData | null>(null);
    const [audioBase, setAudioBase] = useState('');
    const [active, setActive] = useState('');
    const [totalDuration, setTotalDuration] = useState(0);

    const generateAudioName = () => {
        return `${Math.floor(new Date().getTime() / 1000)}`;
    };

    const getFileType = (path: string) => {
        return path.split('.').pop();
    };

    const startRecording = async () => {
        const path = `${DocumentDirectoryPath}/${generateAudioName()}.aac`;
        const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVModeIOS: AVModeIOSOption.measurement,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        const meteringEnabled = false;

        try {
            const uri = await audioRecorderPlayer.startRecorder(
                path,
                audioSet,
                meteringEnabled,
            );
            setIsRecording(true);
            setAudioPath(uri);
        } catch (error) {
            console.log('Uh-oh! Failed to start recording:', error);
        }
    };

    const stopRecording = async () => {
        if (isRecording) {
            try {
                await audioRecorderPlayer.stopRecorder();
                setIsRecording(false);
                await playSound(audioPath);
            } catch (error) {
                console.log('Oops! Failed to stop recording:', error);
            }
        }
    };

    const prepRecording = async () => {
        try {
            await audioRecorderPlayer.stopRecorder();
            const fileContent = await ReactNativeFileSystem.readFile(
                audioPath,
                'base64',
            );
            const fileInfo = await ReactNativeFileSystem.stat(audioPath);
            const vnData = {
                fileCopyUri: fileInfo?.path,
                size: fileInfo?.size,
                type: 'audio/mpeg',
                name: `${generateAudioName()}.${getFileType(fileInfo?.path)}`,
            };
            const vnBase = `data:application/audio;base64,${fileContent}`;
            setAudioFile(vnData);
            setAudioBase(vnBase);
            setIsRecording(false);
        } catch (error) {
            console.log('Uh-oh! Failed to stop and send recording:', error);
        }
    };

    const playAudio = async (newAudioUrl: string) => {
        if (active === newAudioUrl) {
            try {
                if (isPlaying) {
                    await SoundPlayer.pause();
                    setIsPlaying(false);
                } else {
                    await SoundPlayer.resume();
                    setIsPlaying(true);
                }
            } catch (error) {
                console.log(
                    'Oh no! An error occurred while pausing/resuming audio:',
                    error,
                );
            }
        } else {
            try {
                if (isPlaying) {
                    await SoundPlayer.stop();
                }
                setActive(newAudioUrl);
                setIsPlaying(true);
                const soundData = await SoundPlayer.getInfo();
                setTotalDuration(soundData?.duration);
                SoundPlayer.addEventListener('FinishedPlaying', () => {
                    setIsPlaying(false);
                });
                await SoundPlayer.playUrl(newAudioUrl);
                console.log(
                    `Playing audio from: ${audioFile}
                     with base: ${audioBase}
                     with a total duration of: ${totalDuration}`,
                );
                const audio = await SoundPlayer.getInfo();
                setTotalDuration(audio?.duration);
            } catch (error) {
                console.log(
                    'Oops! An error occurred while playing audio:',
                    error,
                );
            }
        }
    };

    return (
        <View>
            <Button title="Start Recording" onPress={startRecording} />
            <Button title="Stop Recording" onPress={stopRecording} />
            <Button title="Prepare Recording" onPress={prepRecording} />
            <Button title="Play Audio" onPress={() => playAudio(audioPath)} />
        </View>
    );
};
