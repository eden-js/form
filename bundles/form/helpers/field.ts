
// require dependencies
import Helper from 'helper';

/**
 * build placement helper
 */
class FieldHelper extends Helper {
  /**
   * construct placement helper
   */
  constructor() {
    // run super
    super();

    // bind methods
    this.build = this.build.bind(this);

    // run build method
    this.build();
  }

  /**
   * builds field helper
   */
  build() {
    // build field helper
    this.__fields = [];
  }

  /**
   * returns field by type
   *
   * @param type 
   */
  async find(type, data = {}) {
    // return found
    return (data.fields || await this.fields(data)).find(f => f.type === type);
  }

  /**
   * lists form fields
   *
   * @param req 
   */
  async list(data = {}) {
    // done
    return (data.fields || await this.fields(data)).map((field) => {
      // return sanitised value
      return {
        type        : field.type,
        view        : field.view,
        data        : field.data,
        title       : field.title,
        categories  : field.categories,
        description : field.description,
      };
    });
  }

  /**
   * gets fields
   *
   * @return {Array}
   */
  async fields(data = {}) {
    // default fields
    const fields = new Map();

    // loop fields
    this.__fields.forEach((field) => {
      // set value
      fields.set(field.type, field);
    });

    // await hook
    await this.eden.hook('form.fields', data, fields);

    // done
    return Array.from(fields.values());
  }

  /**
   * interface
   *
   * @param interface 
   */
  register(fieldInterface) {
    // remove old
    this.__fields = this.__fields.filter((f) => f.type !== fieldInterface.type);

    // check found
    this.__fields.push(fieldInterface);
  }

  /**
   * sanitise field
   *
   * @param data 
   * @param field 
   * @param value 
   */
  async sanitise(data, field, value) {
    // get registered
    const registered = await this.find(field.type, data);

    // get value
    return registered && await registered.sanitise(data, field, value);
  }
}

/**
 * export new FieldHelper class
 *
 * @return {FieldHelper}
 */
export default new FieldHelper();
