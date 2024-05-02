import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContentContainer: {
        justifyContent: 'center',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#bf0714',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#bf0714',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#bf0714',
        fontWeight: '700',
        fontSize: 16,
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    card: {
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    cardBackground: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    background: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    image: {
        width: 80,
        height: 80,
        margin: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
    },
    content: {
        padding: 10,
    },
    description: {
        fontSize: 14,
        color: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    sessionContainer: {
        flex: 1,
        backgroundColor: '#fff', // White background for the entire screen
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 30,
    },
    sessionMessageBox: {
        flex: 1,
        width: '90%',
        backgroundColor: '#f9f9f9', // Light grey background for the message box
        borderRadius: 25,
        padding: 20,
        marginVertical: 20,
        shadowColor: '#000', // Shadow for the message box
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sessionMessage: {
        backgroundColor: '#e1f5fe', // Light blue background for each message
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
    },
    sessionMessageText: {
        color: '#0277bd', // Dark blue color for the message text
        fontSize: 16,
    },
    sessionMicrophoneButton: {
        backgroundColor: '#29b6f6', // Blue background for the microphone button
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000', // Shadow for the microphone button
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sessionMicrophoneIcon: {
        width: 64,
        height: 64,
    },
});
