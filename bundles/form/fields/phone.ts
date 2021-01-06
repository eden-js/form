
// import field interface
import Field from 'field';
import fetch from 'node-fetch';
import config from 'config';

// lib phone
import parsePhoneNumber from 'libphonenumber-js';

/**
 * build address helper
 */
export default class PhoneField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'phone';
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
    return 'Phone';
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
    return 'Phone Field';
  }

  /**
   * submit field value
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submit({ req, old }, field, value) {
    // check value
    if (!value) return value;

    // parsed
    const parsed = parsePhoneNumber(value, field.country || 'US') || {};

    // check value
    const data = typeof value === 'string' ? {
      code   : parsed.countryCallingCode,
      local  : parsed.nationalNumber,
      number : parsed.number,
    } : value;

    // check validation
    if (data.validation !== data.number && config.get('phone.verify')) {
      // parse
      try {
        // check data
        const res = await fetch(`http://apilayer.net/api/validate?access_key=${config.get('phone.verify')}&number=${data.number}&country_code=&format=1`);
        const validated = await res.json();

        // add data
        data.type = validated.line_type;
        data.valid = validated.valid;
        data.carrier = validated.carrier;
        data.location = validated.location;
        data.validation = data.number;
      } catch (e) {}
    }

    // return data
    return data;
  }

  /**
   * submit field value
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async sanitise({ req, old }, field, value) {
    // check value
    if (!value) return value;

    // check value
    if (typeof value === 'string') {
      // parse it
      const parsed = parsePhoneNumber(value, field.country || 'US');

      // set value
      return {
        code   : parsed.countryCallingCode,
        local  : parsed.nationalNumber,
        number : parsed.number,
      };
    }

    // parse number
    return value;
  }
}