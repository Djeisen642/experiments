const API_KEY = '<fill this in>';

/**
 * Find the closest location to the given address
 * @param {string} address The address to find the closest location for
 * @param {string} locationType The type of location to search for
 * @param {string} keyword The keyword to search for
 * @param {string} exclusions Comma separated keywords to exclude
 * @returns {string} The closest location name and distance (distance -> location)
 */
function FIND_CLOSEST(address, locationType, keyword, exclusions) {
  if (!address) return '';
  // Replace YOUR_API_KEY with your actual API key
  var apiKey = API_KEY;

  // Geocode the given address
  var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
  const geocodeResponseCache = getCache(geocodeUrl);
  var initialLocation, lat, lng;
  if (geocodeResponseCache) {
    initialLocation = geocodeResponseCache;
    lat = geocodeResponseCache.lat;
    lng = geocodeResponseCache.lng;
  } else {
    var response = UrlFetchApp.fetch(geocodeUrl);
    var data = JSON.parse(response.getContentText());
    initialLocation = data.results[0].geometry.location;
    lat = data.results[0].geometry.location.lat;
    lng = data.results[0].geometry.location.lng;
    setCache(geocodeUrl, initialLocation);
  }

  // Search for nearby locations of the specified type
  var nearbyLocationsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&type=${locationType}&key=${apiKey}&rankby=distance`;
  if (keyword) nearbyLocationsUrl += `&keyword=${encodeURIComponent(keyword)}`;
  const nearbyResponseCache = getCache(nearbyLocationsUrl);
  if (nearbyResponseCache) return returnText(nearbyResponseCache);
  response = UrlFetchApp.fetch(nearbyLocationsUrl);
  data = JSON.parse(response.getContentText());

  // Calculate the distance to each location and find the closest one
  var results = data.results;
  if (exclusions) {
    exclusions = exclusions
      .split(',')
      .map((exclusion) => exclusion.toLowerCase());
    results = results.filter(
      (item) =>
        !exclusions.some((keyword) => item.name.toLowerCase().includes(keyword))
    );
  }
  var closestLocation = results[0];
  if (keyword)
    closestLocation = results.find((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    );
  if (!closestLocation) return 'Nothing nearby';
  var durationObj = GOOGLEMAPS_DURATION(
    initialLocation,
    closestLocation.geometry.location
  );

  setCache(nearbyLocationsUrl, { durationObj, closestLocation });

  // Return information about the closest location
  console.log(closestLocation);
  return returnText({ durationObj, closestLocation });
}

const returnText = ({ durationObj, closestLocation }) => {
  return durationObj.text + ' -> ' + closestLocation.name;
};

// The cache key for "New York" and "new york  " should be same
const md5 = (key = '') => {
  const code = key.toLowerCase().replace(/\s/g, '');
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, code)
    .map((char) => (char + 256).toString(16).slice(-2))
    .join('');
};

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

const GOOGLEMAPS_DURATION = (origin, destination, mode = 'driving') => {
  const key = [
    'duration',
    JSON.stringify(origin),
    JSON.stringify(destination),
    mode,
  ].join(',');
  // // Is result in the internal cache?
  const value = getCache(key);
  // // If yes, serve the cached result
  if (value !== null) return value;

  const { routes: [data] = [] } = Maps.newDirectionFinder()
    .setOrigin(origin.lat, origin.lng)
    .setDestination(destination.lat, destination.lng)
    .setMode(mode)
    .getDirections();
  if (!data) {
    throw new Error('No route found!');
  }
  const { legs: [{ duration: duration } = {}] = [] } = data;
  // Store the result in internal cache for future
  setCache(key, duration);
  return duration;
};

function TRY() {
  console.log(
    FIND_CLOSEST(
      '2621 Perthshire Ln, Fuquay Varina, NC 27526', // address
      'book_store', // https://developers.google.com/maps/documentation/places/web-service/supported_types
      'barnes & noble', // specific location name
      'not this,or that' // comma separated keywords to exclude
    )
  );
}
