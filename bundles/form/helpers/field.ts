
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
  find(type) {
    // return found
    return this.__fields.find(f => f.type === type);
  }

  /**
   * gets fields
   *
   * @return {Array}
   */
  fields() {
    // returns fields
    return this.__fields;
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
  sanitise(data, field, value) {
    // get registered
    const registered = this.find(field.type);

    // get value
    return registered && registered.sanitise(data, field, value);
  }
}

/**
 * export new FieldHelper class
 *
 * @return {FieldHelper}
 */
export default new FieldHelper();
