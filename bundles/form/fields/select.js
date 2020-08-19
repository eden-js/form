
/**
 * build select helper
 */
class SelectField {
  /**
   * construct select helper
   */
  constructor(helper) {
    // set helper
    this._helper = helper;

    // bind methods
    this.value = this.value.bind(this);
    this.submit = this.submit.bind(this);

    // set meta
    this.title = 'Select';
    this.description = 'Select Field';
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
 * export built select helper
 *
 * @type {select}
 */
module.exports = SelectField;
