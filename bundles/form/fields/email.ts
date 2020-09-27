
// import field interface
import Field from 'field';

/**
 * build address helper
 */
export default class EmailField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'email';
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Email';
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
    return 'Email Field';
  }
}