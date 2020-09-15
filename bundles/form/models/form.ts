
// import dependencies
import Model from 'model';

// import helpers
const fieldHelper = helper('form/field');

/**
 * create user class
 */
export default class Form extends Model {
  /**
   * sanitises placement
   *
   * @return {Promise}
   */
  async sanitise(req, current = []) {
    // data
    const data = {};
    const fields = this.get('fields') || [];

    // req
    if (req) {
      // loop fields
      await Promise.all(fields.map(async (field) => {
        // get from register
        const registered = fieldHelper.fields().find(b => b.type === field.type);

        // get value
        const value = registered && await registered.value(req, field, (current.find((c) => {
          // return found field
          return c.uuid === field.uuid;
        }) || {}).value, this);

        // add to data
        data[field.uuid] = value;
      }));
    }

    // return placement
    return {
      data,
      fields,
      id        : this.get('_id') ? this.get('_id').toString() : null,
      name      : this.get('name'),
      action    : this.get('action'),
      placement : this.get('placement'),
    };
  }
}
