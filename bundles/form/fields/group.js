
// get form helper
const formHelper = helper('form');

/**
 * build text helper
 */
class GroupField {
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
    this.title = 'Group';
    this.description = 'Group Field';
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
  submit(req, field, value, old = {}) {
    // ensure
    if (!value) value = [];
    if (!Array.isArray(value)) value = [value];

    // return value
    return Promise.all(value.map(async (body, i) => {
      // built form
      const form = await formHelper.get(field.uuid);

      // digest into form
      const fields = await formHelper.submit(Object.assign({}, req, {
        body,
      }), form, await Promise.all(form.get('fields').map(async (f) => {
        // return fields map
        return {
          uuid  : f.uuid,
          value : ((old || [])[i] || {})[f.name || f.uuid],
        };
      })));

      // return
      const rtn = {};

      // loop fields
      for (const f of fields) {
        // set value
        rtn[f.name || f.uuid] = f.value;
      }

      // return
      return rtn;
    }));
  }

  /**
   * save
   *
   * @param {*} req 
   * @param {*} field 
   */
  async save(req, field) {
    // safe field
    delete field.form;
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
  async value(req, field, value, valueOnly) {
    // set value
    if (value && !Array.isArray(value)) value = [value];

    // built form
    const form = await formHelper.get(field.uuid);

    // digest into form
    const render = await formHelper.render(req, form, await Promise.all((form.get('fields') || []).map(async (f) => {
      // return fields map
      return {
        uuid  : f.uuid,
        value : null,
      };
    })));

    // loop value
    value = await Promise.all((value || []).map(async (item) => {
      // built form
      const newForm = await formHelper.get(field.uuid);

      // set rendered
      const rendered = {};

      // rendered
      await Promise.all((newForm.get('fields') || []).map(async (f) => {
        // value only
        rendered[f.name || f.uuid] = await formHelper.sanitise(req, f, item[f.name || f.uuid], valueOnly);
      }));

      // return rendered
      return rendered;
    }));

    // check form
    field.form = render;

    // return value
    return value;
  }
}

/**
 * export built text helper
 *
 * @type {text}
 */
module.exports = GroupField;
