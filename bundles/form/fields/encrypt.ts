
// import field interface
import Field from 'field';
import config from 'config';
import crypto from 'crypto';

/**
 * build address helper
 */
export default class EncryptField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'encrypt';
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
    return 'Encrypt';
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
    return 'Encrypt Field';
  }

  /**
   * submit field value
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submit({ req, old }, field, value) {
    // return old
    if (!value || !`${value}`.length) return old;

    // encrypt value
    const encrypted = crypto.createHmac('sha256', config.get('secret'))
      .update(value)
      .digest('hex');

    // return value
    return encrypted;
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
    return null;
  }
}