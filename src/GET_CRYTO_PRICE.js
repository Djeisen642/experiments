const API_KEY_FROM_CRYPTOCOMPARE = '';
function GET_CRYPTO_PRICE(toTimestamp, crypto) {
  let url = `https://min-api.cryptocompare.com/data/v2/histohour`;
  url += `?fsym=${crypto}&tsym=USD&limit=1&toTs=${toTimestamp}&api_key=${API_KEY_FROM_CRYPTOCOMPARE}`;
  const responseCache = getCache(url);
  if (responseCache) return responseCache;

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());
  setCache(url, data.Data.Data[0].close);
  return data.Data.Data[0].close;
}
const getCache = (key) => {
  const value = CacheService.getDocumentCache().get(md5(key));
  if (!value) return null;
  if (value.startsWith('[') || value.startsWith('{')) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  return value;
};

// Store the results for 6 hours
const setCache = (key, value) => {
  const expirationInSeconds = 6 * 60 * 60;
  if (typeof value === 'object') value = JSON.stringify(value);
  CacheService.getDocumentCache().put(md5(key), value, expirationInSeconds);
};
// The cache key for "New York" and "new york  " should be same
const md5 = (key = '') => {
  const code = key.toLowerCase().replace(/\s/g, '');
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, code)
    .map((char) => (char + 256).toString(16).slice(-2))
    .join('');
};

function TRY() {
  console.log(GET_CRYPTO_PRICE(1700707695, 'ALGO'));
}
