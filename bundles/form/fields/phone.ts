
// import field interface
import Field from 'field';

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
}