import Sound from 'react-native-sound';

export class ComplexAudioObject {
    private audioFiles: any;
    private totalDuration: number;
    private currentFileIndex: number;
    private isPlaying: boolean;
    private soundObjects: any;
    constructor(audioFiles: string[]) {
        this.audioFiles = audioFiles; // Array of audio file paths
        this.totalDuration = 0; // Total duration of all audio files
        this.currentFileIndex = 0; // Index of the current audio file being played
        this.isPlaying = false; // Is audio currently playing

        // Initialize Sound objects for each audio file and calculate total duration
        this.soundObjects = this.audioFiles.map((filePath: string) => {
            let sound = new Sound(filePath, '', error => {
                if (error) {
                    console.log('Failed to load the sound', error);
                    return;
                }
                // Update total duration
                this.totalDuration += sound.getDuration();
            });
            return sound;
        });
    }

    // Play function to play the audio files consecutively
    play() {
        if (this.currentFileIndex < this.soundObjects.length) {
            this.isPlaying = true;
            let sound = this.soundObjects[this.currentFileIndex];
            sound.play((success: boolean) => {
                if (success) {
                    console.log(
                        `Finished playing ${
                            this.audioFiles[this.currentFileIndex]
                        }`,
                    );
                    this.currentFileIndex++;
                    this.play(); // Play the next audio file
                } else {
                    console.log('Playback failed due to audio decoding errors');
                }
            });
        } else {
            console.log('Finished playing all audio files');
            this.isPlaying = false;
            this.currentFileIndex = 0; // Reset the index if you want to replay the list later
        }
    }

    // Function to stop the audio playback
    stop() {
        if (this.isPlaying) {
            let sound = this.soundObjects[this.currentFileIndex];
            sound.stop(() => {
                console.log('Playback stopped');
                this.isPlaying = false;
                this.currentFileIndex = 0; // Reset the index
            });
        }
    }

    // Function to get the total duration of the audio list
    getDuration() {
        return this.totalDuration;
    }

    getCurrentPosition() {
        let currentPosition = 0;

        // Add the duration of all fully played files
        for (let i = 0; i < this.currentFileIndex; i++) {
            currentPosition += this.soundObjects[i].getDuration();
        }

        // Add the current playback position of the current file
        if (
            this.isPlaying &&
            this.currentFileIndex < this.soundObjects.length
        ) {
            const currentSound = this.soundObjects[this.currentFileIndex];
            currentSound.getCurrentTime((seconds: number) => {
                currentPosition += seconds;
            });
        }

        return currentPosition;
    }
}
