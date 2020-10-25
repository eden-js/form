
// import field interface
import Field from 'field';

// import helpers
const fieldHelper = helper('form/field');

// model
const Unsave = model('unsaveable');

/**
 * build address helper
 */
export default class GroupField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'group';
  }

  /**
   * gets data
   */
  get data() {
    // return data
    return {
      tabs : ['Display'],
    };
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Group';
  }

  /**
   * returns category list to show field in
   */
  get categories() {
    // return array of categories
    return ['frontend'];
  }

  /**
   * returns category list to show field in
   */
  get description() {
    // return description string
    return 'Group Field';
  }

  /**
   * submits group field
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submit({ req, form, fields, nonce, children, allowEmpty, current }, field, value, old) {
    // ensure
    if (!value) value = [];
    if (!Array.isArray(value)) value = [value];

    // ensure
    if (!old) old = [];
    if (!Array.isArray(old)) old = [old];

    // return value
    const result = (await Promise.all(value.map(async (item, i) => {
      // check item
      if (!item) return;

      // unsave
      const unsave = new Unsave(old[i] || {});

      // root fields
      const groupFields = [...children].filter((f) => (f.parent || 'root') === field.uuid);
  
      // return
      await Promise.all(groupFields.map(async (subField) => {
        // get submitted value
        const submitted = subField.name && item[subField.name] ? item[subField.name] : item[subField.uuid];
  
        // check empty
        if (typeof submitted === 'undefined' && !allowEmpty) return;
  
        // add to data
        const result = await fieldHelper.submit({
          fields : fields || await fieldHelper.fields(req),
  
          req,
          form,
          nonce,
          current : unsave,
          children,
          allowEmpty,
        }, subField, submitted, await unsave.get(subField.name || subField.uuid));
  
        // set uuid
        unsave.set(subField.name || subField.uuid, result);
      }));

      // get
      return unsave.get();
    }))).filter((v) => v);
    
    // result
    return result;
  }

  /**
   * returns sanitised result of field submission
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async sanitise({ req, form, fields, nonce, children }, field, value) {
    // set value
    if (value && !Array.isArray(value)) value = [value];

    // loop value
    value = await Promise.all((value || []).map(async (item) => {
      // unsave
      const unsave = new Unsave(item);

      // data
      const result = {};
      
      // check fields
      if (!children) children = form.get('fields') || [];
  
      // root fields
      const groupFields = [...children].filter((f) => (f.parent || 'root') === field.uuid);

      // loop fields
      await Promise.all(groupFields.map(async (subField) => {
        // add to data
        result[subField.name || subField.uuid] = await fieldHelper.sanitise({
          fields : fields || await fieldHelper.fields(req),

          form,
          nonce,
          current : unsave,
          children,
        }, subField, await unsave.get(subField.name || subField.uuid));
      }));
      
      // return data
      return result;
    }));

    // return value
    return value;
  }
}