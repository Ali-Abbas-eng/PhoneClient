import ImagePicker from 'react-native-image-crop-picker';

export const __imagePicker = async () => {
    let imagePath: string = '';
    try {
        const result = await ImagePicker.openPicker({
            mediaType: 'photo', // Specify 'photo' for images
            cropping: true, // Enable cropping
            includeBase64: true, // Get base64 data for the image
        });

        if (result && result.path) {
            // Update the image state with the selected image
            // @ts-ignore
            imagePath = result.path;
        }
    } catch (error) {
        console.error('Error selecting image:', error);
        return imagePath;
    }
    return imagePath;
};
