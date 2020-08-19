
/**
 * build text helper
 */
class EmailField {
  /**
   * construct text helper
   */
  constructor(helper) {
    // set helper
    this._helper = helper;

    // bind methods
    this.value = this.value.bind(this);
    this.submit = this.submit.bind(this);

    // set meta
    this.title = 'Email';
    this.description = 'Email Field';
  }

  /**
   * submits form field
   *
   * @param {req}    Request
   * @param {Object} field
   * @param {*}      value
   *
   * @return {*}
   */
  submit(req, field, value) {
    // return value
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
 * export built text helper
 *
 * @type {text}
 */
module.exports = EmailField;
