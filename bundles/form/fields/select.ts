
// import field interface
import Field from 'field';

/**
 * build address helper
 */
export default class SelectField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'select';
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Select';
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
    return 'Select Field';
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
    return Array.isArray(value) ? value : (value && [value]);
  }
}