
// import field interface
import Field from 'field';

/**
 * build address helper
 */
export default class CheckboxField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'checkbox';
  }

  /**
   * gets data
   */
  get data() {
    // return data
    return {
      tabs : ['Config', 'Display', 'Validate'],
    };
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Checkbox';
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
    return 'Checkbox Field';
  }

  /**
   * submit field value
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submit({ req, old }, field, value) {
    // check object
    if (!Array.isArray(value) && typeof value === 'object' && value !== null) {
      // set value
      value = Object.keys(value);
    }
  
    // return database value
    return Array.isArray(value) ? value : (value && [value]);
  }
}