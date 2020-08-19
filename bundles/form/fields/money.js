
/**
 * build text helper
 */
class MoneyField {
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
    this.title = 'Money';
    this.description = 'Money Field';
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
    return parseFloat(value || 0);
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
    return parseFloat(value || 0);
  }
}

/**
 * export built text helper
 *
 * @type {text}
 */
module.exports = MoneyField;
