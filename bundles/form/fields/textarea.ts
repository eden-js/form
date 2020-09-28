
// import field interface
import Field from 'field';

/**
 * build address helper
 */
export default class TextareaField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'textarea';
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
    return 'Textarea';
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
    return 'Textarea Field';
  }
}