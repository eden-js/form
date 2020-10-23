
// import field interface
import Field from 'field';

/**
 * build address helper
 */
export default class RadioField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'radio';
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
    return 'Radio';
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
    return 'Radio Field';
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