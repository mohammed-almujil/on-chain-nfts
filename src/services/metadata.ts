import axios from 'axios'

let ipfsHostnames: any = ['cloudflare-ipfs.com']
let arweaveHostnames: any = ['arweave.net']

async function getMetaData(uri: string) {
  if (!uri) return null

  if (uri.startsWith('https://')) {
    return await requestMetadata(uri)
  } else if (uri.startsWith('http://')) {
    return await requestMetadata(uri)
  } else if (uri.startsWith('ipfs://')) {
    return await getIpfsMetadata(uri)
  } else if (uri.startsWith('data:application/json;base64,')) {
    return getBase64Metadata(uri)
  } else if (uri.startsWith('ar://')) {
    return await getArweaveMetadata(uri)
  }
}

async function getIpfsMetadata(uri: any) {
  const cloneIpfsHostnames = [...ipfsHostnames]
  uri = uri.split('ipfs://')[1]
  if (uri.startsWith('ipfs/')) {
    uri = uri.split('ipfs/')[1]
  }
  let json
  for (let x = 0; x < cloneIpfsHostnames.length; x++) {
    json = await requestMetadata(
      'https://' + cloneIpfsHostnames[x] + '/ipfs/' + uri
    )

    if (json) break

    pushFailedIpfsHostnameToEnd()
  }
  return json
}

async function getArweaveMetadata(uri: any) {
  const cloneArweaveHostnames = [...arweaveHostnames]
  uri = uri.split('ar://')[1]

  let json
  for (let x = 0; x < cloneArweaveHostnames.length; x++) {
    json = await requestMetadata(
      'https://' + cloneArweaveHostnames[x] + '/' + uri
    )

    if (json) break

    pushFailedArweaveHostnameToEnd()
  }
  return json
}

function getBase64Metadata(uri: any) {
  uri = uri.split('data:application/json;base64,')[1]

  let json

  try {
    const metadataFromBase64 = Buffer.from(uri, 'base64').toString('utf8')
    if (metadataFromBase64) {
      json = JSON.parse(metadataFromBase64)
    }
  } catch (error: any) {
    if (error) {
      console.log('error:  ' + error)
    }
  }

  return json
}

async function requestMetadata(uri: string) {
  if (containsEncodedComponents(uri)) {
    uri = decodeURIComponent(uri)
  }

  let json

  try {
    const response = await axios(uri, { timeout: 30000 })
    json = response.data
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      console.log('metadata error: timeout')
    }
    if (error.response) {
      console.log('metadata error: status code ' + error.response.status)
    }
  }
  return json
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
