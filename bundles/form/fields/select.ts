
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
    // check value
    if (!value) value = [];
    if (!Array.isArray(value)) value = [value];

    // filter
    value = value.filter((v) => v).filter((v) => field.options.find((o) => o.value === v));

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
  async sanitise({ req, form, noChild }, field, value) {
    // check value
    if (!value) value = [];
    if (!Array.isArray(value)) value = [value];

    // filter
    value = value.filter((v) => v);

    // return database value
    return value;
  }
}