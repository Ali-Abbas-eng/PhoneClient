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
        alignItems: 'stretch',
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
        width: 100,
        height: 100,
        margin: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
    },
    content: {
        padding: 10,
        flex: 1,
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
});
