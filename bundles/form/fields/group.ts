
// import field interface
import Field from 'field';

// import helpers
const formHelper = helper('form');

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
  submit({ req, form, old }, field, value) {
    // ensure
    if (!value) value = [];
    if (!Array.isArray(value)) value = [value];

    // return value
    return Promise.all(value.map(async (body, i) => {
      // unsave
      const unsave = new Unsave((old || [])[i] || {});

      // digest into form
      await formHelper.submit({
        req : Object.assign({}, req, {
          body,
        }),
        fields : (form.get('fields') || []).slice(0).filter((f) => f.parent === field.uuid),
      }, form, unsave);

      // return
      return unsave.get();
    }));
  }

  /**
   * returns sanitised result of field submission
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async sanitise({ req, form }, field, value) {
    // set value
    if (value && !Array.isArray(value)) value = [value];

    // loop value
    value = await Promise.all((value || []).map(async (item) => {
      // unsave
      const unsave = new Unsave(item);

      // digest into form
      const render = await formHelper.render({
        req,
        fields : (form.get('fields') || []).slice(0).filter((f) => f.parent === field.uuid),
      }, form, unsave);

      // return data
      return render.data;
    }));

    // return value
    return value;
  }
}