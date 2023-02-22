
import axios from 'axios';


async function requestMetadata(uri: string) {

    console.log('getting metatdata from: ' + uri)
    let json;

    try {
        const response = await axios(uri);
        json = response.data;
    } catch (error: any) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('error: status code ' + error.response.status);
            // console.log(error.response.data);
            // console.log(error.response.headers);
        }
    }
    return json;

}


export { requestMetadata, };
