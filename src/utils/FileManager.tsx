import { downloadFile as rnDownloadFile } from 'react-native-fs';

export const downloadFile = async (uri: string, destination: string) => {
    const options = {
        fromUrl: uri,
        toFile: destination,
        background: true,
    };

    try {
        await rnDownloadFile(options).promise;
    } catch (error) {}
};
