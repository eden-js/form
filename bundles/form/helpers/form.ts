
// require dependencies
import Helper from 'helper';

// require models
const Form = model('form');

// require helpers
const fieldHelper = helper('form/field');

/**
 * build placement helper
 */
class FormHelper extends Helper {
  /**
   * loads form
   *
   * @param  {String} placement
   *
   * @return {form}
   */
  async load(placement) {
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
  async render({ req, fields }, form, current) {
    // sanitised
    const sanitised = await form.sanitise({ req, fields }, current);

    // return
    return sanitised;
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
  async submit({ req, fields, children, nonce, allowEmpty }, form, current) {
    // get fields
    if (!children) children = form.get('fields') || [];

    // root fields
    const rootFields = [...children].filter((f) => (f.parent || 'root') === 'root');

    // return
    await Promise.all(rootFields.map(async (field) => {
      // get submitted value
      const submitted = field.name && req.body[field.name] ? req.body[field.name] : req.body[field.uuid];

      // check empty
      if (typeof submitted === 'undefined' && !allowEmpty) return;

      // add to data
      const result = await fieldHelper.submit({
        fields : fields || await fieldHelper.fields(req),

        req,
        form,
        nonce,
        current,
        children,
        allowEmpty,
      }, field, submitted, await current.get(field.name || field.uuid));

      // set uuid
      current.set(field.name || field.uuid, result);
    }));

    // return current
    return current;
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
  async sanitise({ req, fields, children, nonce, allowEmpty }, form, current) {
    // data
    const result = {};
    
    // check fields
    if (!children) children = form.get('fields') || [];

    // root fields
    const rootFields = [...children].filter((f) => (f.parent || 'root') === 'root');

    // req
    if (current) {
      // loop fields
      await Promise.all(rootFields.map(async (field) => {
        // add to data
        result[field.name || field.uuid] = await fieldHelper.sanitise({
          fields : fields || await fieldHelper.fields(req),

          req,
          form,
          nonce,
          current,
          children,
          allowEmpty,
        }, field, await current.get(field.name || field.uuid));
      }));
    }
    
    // return data
    return result;
  }
}

/**
 * export new FormHelper class
 *
 * @return {FormHelper}
 */
export default new FormHelper();
