
// import field interface
import Field from 'field';

/**
 * build address helper
 */
export default class TextField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'text';
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Text';
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
    return 'Text Field';
  }
}