
// require dependencies
const Helper = require('helper');
const escapeRegex = require('escape-string-regexp');

// require models
const Form = model('form');

// require helpers
const fieldHelper = helper('form/field');

/**
 * build placement helper
 */
class FormHelper extends Helper {
  /**
   * gets form
   *
   * @param  {String} placement
   *
   * @return {form}
   */
  async get(placement) {
    // find one
    return await Form.findOne({
      placement,
    }) || new Form({
      placement,
      fields : [],
    });
  }

  /**
   * renders form and values
   *
   * @param  {Request} req
   * @param  {Form}    form
   * @param  {Array}   values
   *
   * @return {*}
   */
  sanitise(req, form, field, current) {
    // get from register
    const registered = fieldHelper.fields().find(b => b.type === field.type);

    // return
    return registered.render(req, form, field, current);
  }

  /**
   * renders form and values
   *
   * @param  {Request} req
   * @param  {Form}    form
   * @param  {Array}   values
   *
   * @return {*}
   */
  render(req, form, current) {
    // return
    return form.sanitise(req, current);
  }

  /**
   * creates grid column for form field
   *
   * @param  {Form}   form
   * @param  {Grid}   grid
   * @param  {Object} field
   * @param  {Object} opts
   *
   * @return {*}
   */
  async column(req, form, grid, field, opts) {
    // get from register
    const registered = fieldHelper.fields().find(b => b.type === field.type);

    // return not registered
    if (!registered) return;

    // add config field
    grid.filter(field.name || field.uuid, Object.assign({
      type  : 'text',
      title : field.label,
      query : (param) => {
        // Another where
        grid.match(field.name || field.uuid, new RegExp(escapeRegex(param.toString().toLowerCase()), 'i'));
      },
    }, opts));
    grid.column(field.name || field.uuid, Object.assign({
      tag  : 'element-column',
      sort : true,
      meta : {
        field,
        data : await registered.render(req, field, null),
      },
      title  : field.label,
      format : async (col) => {
        // return value
        return (await registered.render(req, Object.assign({}, field), col)).value;
      },
      update : {
        tag    : 'field-column',
        submit : async (subReq, row, value) => {
          // lock row
          await row.lock();

          // get data
          // eslint-disable-next-line max-len
          const data = await registered.submit(subReq, field, value, await row.get(field.name || field.uuid));

          // set data
          row.set(field.name || field.uuid, data);

          // save
          await row.save(req.user);

          // unlock row
          row.unlock();
        },
      },
    }, opts));
  }

  /**
   * renders form and values
   *
   * @param  {Request} req
   * @param  {Form}    form
   * @param  {Array}   current
   *
   * @return {*}
   */
  async submit(req, form, current = [], row) {
    // return
    const fields = (await Promise.all((await form.get('fields')).map(async (field) => {
      // get from register
      const registered = fieldHelper.fields().find(b => b.type === field.type);

      // check registered
      if (!registered) return null;

      // get data
      const data = await registered.submit(req, field, req.body[field.uuid], (current.find((c) => {
        // return found field
        return c.uuid === field.uuid;
      }) || {}).value, row);

      // set uuid
      field.value = data;

      // return render
      return field;
    }))).filter(f => f);

    // return fields
    return fields;
  }
}

/**
 * export new FormHelper class
 *
 * @return {FormHelper}
 */
module.exports = new FormHelper();
