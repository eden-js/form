
// import base
import Base from 'base';

/**
 * create dashup field
 */
export default class EdenjsField extends Base {

  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'type';
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
    return 'Field Descripton';
  }

  /**
   * returns sanitised result of field submission
   *
   * @param {*} param0 
   * @param {*} field 
   */
  async save({ req }, field) {
    // return once done
    return;
  }

  /**
   * returns sanitised result of field submission
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submit({ req, old }, field, value) {
    // return database value
    return value;
  }

  /**
   * returns sanitised result of field submission
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async sanitise({ req }, field, value) {
    // return value
    return value;
  }
}