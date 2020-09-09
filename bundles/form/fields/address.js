
/**
 * build address helper
 */
class AddressField {
  /**
   * construct address helper
   */
  constructor(helper) {
    // set helper
    this._helper = helper;

    // bind methods
    this.value = this.value.bind(this);
    this.submit = this.submit.bind(this);

    // set meta
    this.title = 'Address';
    this.description = 'Address Field';
  }

  /**
   * submits form field
   *
   * @param {req}    Request
   * @param {Object} field
   * @param {*}      value
   * @param {*}      old
   *
   * @return {*}
   */
  submit(req, field, value, old) {
    // submit
    return value;
  }

  /**
   * renders form field
   *
   * @param {req}    Request
   * @param {Object} field
   * @param {*}      value
   *
   * @return {*}
   */
  async value(req, field, value) {
    // return
    return value;
  }
}

/**
 * export built address helper
 *
 * @type {AddressField}
 */
module.exports = AddressField;
