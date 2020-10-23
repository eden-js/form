
// import field interface
import Field from 'field';

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

    // return value
    return value;
  }
}