
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
    this.submit = this.submit.bind(this);
    this.render = this.render.bind(this);

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
   * renders form field
   *
   * @param {req}    Request
   * @param {Object} field
   * @param {*}      value
   *
   * @return {*}
   */
  async render(req, field, value, valueOnly) {
    // set tag
    field.tag = 'group';
    field.value = value;

    // built form
    const form = await formHelper.get(field.uuid);

    // digest into form
    field.form = await formHelper.render(req, form, await Promise.all((form.get('fields') || []).map(async (f) => {
      // return fields map
      return {
        uuid  : f.uuid,
        value : null,
      };
    })));

    // set value
    if (value && !Array.isArray(value)) value = [value];

    // loop value
    field.value = await Promise.all((value || []).map(async (item) => {
      // built form
      const newForm = await formHelper.get(field.uuid);

      // check value only
      if (!valueOnly) {
        // rendered
        const rendered = await formHelper.render(req, newForm, await Promise.all((newForm.get('fields') || []).map(async (f) => {
          // return fields map
          return {
            uuid  : f.uuid,
            value : item[f.name || f.uuid],
          };
        })));

        // rendered form
        return {
          form  : rendered,
          value : item.price,
        };
      }

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

    // return
    return field;
  }
}

/**
 * export built text helper
 *
 * @type {text}
 */
module.exports = GroupField;
