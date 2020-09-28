
// import field interface
import Field from 'field';

/**
 * build address helper
 */
export default class DateField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'date';
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
    return 'Date';
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
    return 'Date Field';
  }

  /**
   * submit field value
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submit({ req, old }, field, value) {
    // try catch
    try {
      // let date
      let date = new Date(value);

      // check isNan
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(date.getTime())) date = null;

      // return date
      return date;
    } catch (e) {
      // return null
      return old;
    }
  }
}