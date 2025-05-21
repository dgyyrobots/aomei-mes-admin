import WebStorageCache from 'web-storage-cache'

export const wsCache = new WebStorageCache({
  storage: 'localStorage'
})

export default wsCache