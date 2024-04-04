import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { styles } from '../../styles/styels.tsx';

export const Profile = () => {
    const user = {
        first_name: 'Ali',
        last_name: 'Abbas',
        phone: '123456879',
        email: 'ali.abbas@echo.com',
        username: 'ali.abbas@echo.com',
    };
    const [image, setImage] = useState(null); // State to store the selected image
    const handleImagePicker = async () => {
        try {
            const result = await ImagePicker.openPicker({
                mediaType: 'photo', // Specify 'photo' for images
                cropping: true, // Enable cropping
                includeBase64: true, // Get base64 data for the image
            });

            if (result && result.path) {
                // Update the image state with the selected image
                // @ts-ignore
                setImage(result.path);
            }
        } catch (error) {
            console.error('Error selecting image:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            {user ? (
                <View style={styles.profileContainer}>
                    <TouchableOpacity onPress={handleImagePicker}>
                        <Image
                            style={styles.profileImage}
                            source={
                                image
                                    ? { uri: image }
                                    : require('../../../assets/default_profile.jpeg')
                            }
                        />
                    </TouchableOpacity>
                    <Text style={styles.profileText}>
                        Username: {user.username}
                    </Text>
                    <Text style={styles.profileText}>Email: {user.email}</Text>
                    <Text style={styles.profileText}>Phone: {user.phone}</Text>
                    <Text style={styles.profileText}>
                        Name: {user.first_name} {user.last_name}
                    </Text>
                </View>
            ) : (
                <Text style={styles.loadingText}>Loading...</Text>
            )}
        </View>
    );
};
