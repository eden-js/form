
// import field interface
import Field from 'field';

/**
 * build address helper
 */
export default class NumberField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'number';
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Number';
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
    return 'Number Field';
  }

  /**
   * submit field value
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submit({ req, old }, field, value) {
    // return value
    return parseFloat(value || 0);
  }

  /**
   * returns sanitised result of field submission
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async sanitise({ req }, field, value) {
    // return
    return parseFloat(value || 0);
  }
}