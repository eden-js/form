
// import field interface
import tz from 'geo-tz';
import fetch from 'node-fetch';
import Field from 'field';
import config from 'config';

/**
 * build address helper
 */
export default class AddressField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'address';
  }

  /**
   * gets data
   */
  get data() {
    // return data
    return {
      tabs : ['Display', 'Validate'],
    };
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Address';
  }

  /**
   * returns category list to show field in
   */
  get categories() {
    // return array of categories
    return ['frontend'];
  }

  /**
   * returns category list to show field in
   */
  get description() {
    // return description string
    return 'Address Field';
  }

  /**
   * submit field value
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submit({ req, old }, field, value) {
    // return database value
    try {
      // parse value
      return JSON.parse(value);
    } catch (e) {}

    // probably a string address
    if (typeof value === 'string' && config.get('google.maps')) {
      // try/catch
      try {
        // load data
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(value)}&key=${config.get('google.maps')}`);
        const data = await res.json();

        // check results
        if (data.results && data.results[0]) {
          // get result
          const [result] = data.results;

          // set values
          value = {
            'id'  : result.id,
            'geo' : {
              'lat' : result.geometry.location.lat,
              'lng' : result.geometry.location.lng
            },
            'formatted'  : result.formatted_address,
            'components' : result.address_components
          };
        }
      } catch (e) { console.log(e) }
    }

    // check timezone
    if (value && value.geo && !value.timezone) {
      // set value
      [value.timezone] = tz(value.geo.lat, value.geo.lng);
    }

    // return value
    return value;
  }
}