import axios from 'axios'
import { MetadataResponse } from '../models'

let ipfsHostnames: any = ['cloudflare-ipfs.com']
let arweaveHostnames: any = ['arweave.net']


async function getMetaData(uri: string) {


  let metadataResponse = <MetadataResponse>{};

  if (uri.startsWith('https://')) {
    metadataResponse = await requestMetadata(uri)
  } else if (uri.startsWith('http://')) {
    metadataResponse = await requestMetadata(uri)
  } else if (uri.startsWith('ipfs://')) {
    metadataResponse = await getIpfsMetadata(uri)
  } else if (uri.startsWith('data:application/json;base64,')) {
    metadataResponse = getBase64Metadata(uri)
  } else if (uri.startsWith('ar://')) {
    metadataResponse = await getArweaveMetadata(uri)
  }
  return metadataResponse
}

async function getIpfsMetadata(uri: any) {
  const cloneIpfsHostnames = [...ipfsHostnames]
  uri = uri.split('ipfs://')[1]
  if (uri.startsWith('ipfs/')) {
    uri = uri.split('ipfs/')[1]
  }

  let metadataResponse = {} as MetadataResponse;
  for (let x = 0; x < cloneIpfsHostnames.length; x++) {
    metadataResponse = await requestMetadata(
      'https://' + cloneIpfsHostnames[x] + '/ipfs/' + uri
    )
    if (metadataResponse.metadata) break

    pushFailedIpfsHostnameToEnd()
  }
  return metadataResponse
}

async function getArweaveMetadata(uri: any) {
  const cloneArweaveHostnames = [...arweaveHostnames]
  uri = uri.split('ar://')[1]

  let metadataResponse = {} as MetadataResponse;

  for (let x = 0; x < cloneArweaveHostnames.length; x++) {
    metadataResponse = await requestMetadata(
      'https://' + cloneArweaveHostnames[x] + '/' + uri
    )

    if (metadataResponse) break

    pushFailedArweaveHostnameToEnd()
  }
  return metadataResponse
}

function getBase64Metadata(metadataFetchUri: any) {
  metadataFetchUri = metadataFetchUri.split('data:application/json;base64,')[1]

  let metadata

  try {
    const metadataFromBase64 = Buffer.from(metadataFetchUri, 'base64').toString('utf8')
    if (metadataFromBase64) {
      metadata = JSON.parse(metadataFromBase64)
    }
  } catch (error: any) {
    if (error) {
      console.log('error:  ' + error)
    }
  }

  return <MetadataResponse>{ metadata: metadata, metadataFetchUri: metadataFetchUri }
}

async function requestMetadata(metadataFetchUri: string) {
  if (containsEncodedComponents(metadataFetchUri)) {
    metadataFetchUri = decodeURIComponent(metadataFetchUri)
  }
  console.log('Metadata fetch', metadataFetchUri)
  let metadata

  try {
    const response = await axios(metadataFetchUri, { timeout: 30000 })
    metadata = response.data
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      console.log('metadata error: timeout')
    }
    if (error.response) {
      console.log('metadata error: status code ' + error.response.status)
    }
  }
  return <MetadataResponse>{ metadata: metadata, metadataFetchUri: metadataFetchUri }
}

function containsEncodedComponents(uri: string) {
  // ie ?,=,&,/ etc
  return decodeURI(uri) !== decodeURIComponent(uri)
}

function pushFailedIpfsHostnameToEnd() {
  ipfsHostnames.push(ipfsHostnames.shift())
}
function setIpfsHostnames(hostnames: string[]) {
  ipfsHostnames = hostnames
}

function pushFailedArweaveHostnameToEnd() {
  arweaveHostnames.push(ipfsHostnames.shift())
}
function setArweaveHostnames(hostnames: string[]) {
  arweaveHostnames = hostnames
}

export { getMetaData, setIpfsHostnames, setArweaveHostnames }
