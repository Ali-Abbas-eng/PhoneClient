import { downloadFile as rnDownloadFile } from 'react-native-fs';

export const downloadFile = async (uri: string, destination: string) => {
    const options = {
        fromUrl: uri,
        toFile: destination,
        background: true,
        begin: (res: any) => {
            console.log('begin', res);
            console.log(
                `contentLength: ${res.contentLength / (1024 * 1024)} MB`,
            );
        },
        progress: (res: any) => {
            const percentage = (res.bytesWritten / res.contentLength) * 100;
            console.log(`progress: ${percentage}%`);
        },
    };

    try {
        const result = await rnDownloadFile(options).promise;
        console.log('Download completed!', result);
    } catch (error) {
        console.log('Error downloading file:', error);
    }
};
