
// import dependencies
const Model = require('model');

// import helpers
const fieldHelper = helper('form/field');

/**
 * create user class
 */
class Form extends Model {
  /**
   * sanitises placement
   *
   * @return {Promise}
   */
  async sanitise(req, current = []) {
    // return placement
    return {
      id     : this.get('_id') ? this.get('_id').toString() : null,
      name   : this.get('name'),
      render : req ? (await Promise.all((this.get('fields') || []).map(async (field) => {
        // get from register
        const registered = fieldHelper.fields().find(b => b.type === field.type);

        // check registered
        if (!registered) return null;

        // get data
        const data = await registered.render(req, field, (current.find((c) => {
          // return found field
          return c.uuid === field.uuid;
        }) || {}).value);

        // set uuid
        data.uuid = field.uuid;

        // return render
        return data;
      }))).filter(b => b) : null,
      action    : this.get('action'),
      fields    : this.get('fields') || [],
      placement : this.get('placement'),
    };
  }
}

/**
 * export user class
 * @type {user}
 */
module.exports = Form;
