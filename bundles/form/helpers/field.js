
// require dependencies
const Helper = require('helper');

// require models
const Form = model('form');

/**
 * build placement helper
 */
class FieldHelper extends Helper {
  /**
   * construct placement helper
   */
  constructor() {
    // run super
    super();

    // bind methods
    this.build = this.build.bind(this);

    // run build method
    this.build();
  }

  /**
   * builds placement helper
   */
  build() {
    // build placement helper
    this.__fields = [];
  }

  /**
   * register field
   *
   * @param  {String}   type
   * @param  {Object}   opts
   * @param  {Function} value
   * @param  {Function} save
   * @param  {Function} submit
   *
   * @return {*}
   */
  field(type, opts, value, save, submit) {
    // check found
    const found = this.__fields.find(field => field.type === type);

    // push field
    if (!found) {
      // check found
      this.__fields.push({
        type,
        opts,
        save,
        value,
        submit,
      });
    } else {
      // set on found
      found.type = type;
      found.opts = opts;
      found.save = save;
      found.value = value;
      found.submit = submit;
    }
  }

  /**
   * gets fields
   *
   * @return {Array}
   */
  fields() {
    // returns fields
    return this.__fields;
  }

  /**
   * render fields
   *
   * @return {Array}
   */
  renderFields(include) {
    // map fields
    return this.__fields.filter((field) => {
      // check for
      if (include && field.opts.for) return field.opts.for.includes(include);

      // return true
      return true;
    }).map((field) => {
      // return field
      return {
        type : field.type,
        opts : field.opts,
      };
    });
  }

  /**
   * returns placement list
   *
   * @param  {String} id
   * @param  {User}   user
   *
   * @return {Promise}
   */
  async render(id) {
    // return object
    return {
      fields    : this.renderFields(),
      placement : (await Form.findById(id)).sanitise(),
    };
  }
}

/**
 * export new FieldHelper class
 *
 * @return {FieldHelper}
 */
module.exports = new FieldHelper();
