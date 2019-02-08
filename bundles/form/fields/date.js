
/**
 * build date helper
 */
class DateField {
  /**
   * construct date helper
   */
  constructor(helper) {
    // set helper
    this._helper = helper;

    // bind methods
    this.submit = this.submit.bind(this);
    this.render = this.render.bind(this);

    // set meta
    this.title = 'Date';
    this.description = 'Date Field';
  }

  /**
   * submits form field
   *
   * @param {Object} data
   *
   * @return {*}
   */
  submit({ child, value, old }) {
    // try catch
    try {
      // let date
      let date = new Date(value.iso);

      // check isNan
      if (isNaN(date.getTime())) date = null;

      // return date
      return date;
    } catch (e) {
      // return null
      return old;
    }
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
  async render(req, field, value) {
    // set tag
    field.tag = 'date';

    // return
    return field;
  }
}

/**
 * export built date helper
 *
 * @type {date}
 */
module.exports = DateField;
