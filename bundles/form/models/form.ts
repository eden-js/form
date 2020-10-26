
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
  async sanitise(data, current) {
    // data
    const result = {};
    
    // check fields
    const rootFields = (data.children || this.get('fields') || []).slice(0).filter((f) => (f.parent || 'root') === 'root');

    // req
    if (current) {
      // loop fields
      await Promise.all(rootFields.map(async (field) => {
        // add to data
        result[field.name || field.uuid] = await fieldHelper.sanitise({
          ...data,
          current,
          form   : this,
          fields : data.fields || await fieldHelper.fields(data.req),
        }, field, await current.get(field.name || field.uuid));
      }));
    }

    // return placement
    return {
      id        : this.get('_id') ? this.get('_id').toString() : null,
      data      : result,
      fields    : data.children || this.get('fields') || [],
      placement : this.get('placement'),
    };
  }
}
