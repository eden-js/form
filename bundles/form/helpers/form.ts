
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
  async submit({ req, allowEmpty, fields }, form, current) {
    // get fields
    if (!fields) fields = (await form.get('fields') || []);

    // return
    const returnFields = (await Promise.all(fields.map(async (field) => {
      // get from register
      const registered = await fieldHelper.find(field.type);

      // check registered
      if (!registered) return;

      // get submitted value
      const submitted = field.name && req.body[field.name] ? req.body[field.name] : req.body[field.uuid];

      // check empty
      if (typeof submitted === 'undefined' && !allowEmpty) return;

      // get data
      const data = await registered.submit({
        req,
        form,
        current,
      }, field, submitted, current ? await current.get(field.name || field.uuid) : null);

      // for extra fields
      field.value = data;

      // set uuid
      current.set(field.name || field.uuid, data);

      // return render
      return field;
    }))).filter(f => f);

    // return fields
    return returnFields;
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
  async sanitise({ req, fields, children, nonce }, form, current) {
    // data
    const result = {};
    
    // check fields
    if (!children) children = form.get('fields') || [];

    // root fields
    const rootFields = children.slice(0).filter((f) => (f.parent || 'root') === 'root');

    // req
    if (current) {
      // loop fields
      await Promise.all(rootFields.map(async (field) => {
        // add to data
        result[field.name || field.uuid] = await fieldHelper.sanitise({
          fields : fields || await fieldHelper.fields(req),

          form,
          nonce,
          current,
          children,
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
