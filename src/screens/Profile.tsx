import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

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
                                    : require('../../assets/default_profile.png')
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

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    inputContainer: {
        width: '80%',
        marginVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
    },
    button: {
        backgroundColor: '#f0c14b',
        padding: 15,
        borderRadius: 10,
    },
    buttonOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0c14b',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    buttonOutlineText: {
        color: '#f0c14b',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    profileContainer: {
        width: '80%',
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 10,
    },
    profileText: {
        fontSize: 18,
        marginVertical: 5,
    },
    loadingText: {
        fontSize: 18,
        color: '#777',
    },
});
