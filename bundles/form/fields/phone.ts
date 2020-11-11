
// import field interface
import Field from 'field';

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

    // parse number
    return (parsePhoneNumber(value, 'US') || {}).number || value;
  }
}