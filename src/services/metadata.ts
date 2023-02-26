
import axios from 'axios';

let ipfsHostnames: any = ['cloudflare-ipfs.com'];


async function getMetaData(uri: string) {

    if (!uri) return null;

    if (uri.startsWith('https://')) {
        return await requestMetadata(uri);
    } else if (uri.startsWith('http://')) {
        return await requestMetadata(uri);
    } else if (uri.startsWith('ipfs://')) {
        return await getIpfsMetadata(uri);
    } else if (uri.startsWith('data:application/json;base64')) {
        console.log('base64')
    } else if (uri.startsWith('ar://')) {
        console.log('arweave')
    }
}


async function requestMetadata(uri: string) {

    console.log('getting metatdata from: ' + uri)
    let json;

    try {
        const response = await axios(uri);
        json = response.data;
    } catch (error: any) {
        if (error.response) {
            console.log('error: status code ' + error.response.status);
        }
    }
    return json;

}

async function getIpfsMetadata(uri: any) {

    const cloneIpfsHostnames = [...ipfsHostnames];

    let json;
    for (let x = 0; x < cloneIpfsHostnames.length; x++) {
        json = await requestMetadata('https://' + cloneIpfsHostnames[x] + '/ipfs/' + uri.split('ipfs://')[1])

        if (json) break;

        pushFailedHostnameToEnd();
    }
    return json;
}


function pushFailedHostnameToEnd(){
    ipfsHostnames.push(ipfsHostnames.shift());
}
function setIpfsHostnames(hostnames: string[]) {
    ipfsHostnames = hostnames;
}

export { getMetaData, setIpfsHostnames, ipfsHostnames };
