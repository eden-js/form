
// require local dependencies
const File = model('file');

/**
 * build file helper
 */
class FileField {
  /**
   * construct file helper
   */
  constructor(helper) {
    // set helper
    this._helper = helper;

    // bind methods
    this.value = this.value.bind(this);
    this.submit = this.submit.bind(this);

    // set meta
    this.title = 'File';
    this.description = 'File Field';
  }

  /**
   * submits form field
   *
   * @param {req}    Request
   * @param {Object} field
   * @param {*}      value
   * @param {*}      old
   *
   * @return {*}
   */
  async submit(req, field, value, old) {
    // check array
    if (!Array.isArray(value)) value = [value];

    // return value map
    return await Promise.all(value.filter(val => val).map(async (val, i) => {
      // run try catch
      try {
        // buffer image
        const upload = await File.findById(val);

        // check image
        if (upload) {
          // return sanitised
          return {
            id    : upload.get('_id'),
            model : 'file',
          };
        }

        // return null
        return null;
      } catch (e) {
        // return old
        return old[i];
      }
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
  async value(req, field, value) {
    // eslint-disable-next-line no-nested-ternary
    return value
      ? (Array.isArray(value) ? await Promise.all(value.map(async (item) => {
        // find item
        if (!(item instanceof File) && item.id && item.model) {
          item = await File.findById(item.id);
        }

        // return sanitised item
        return item && item.sanitise ? item.sanitise() : null;
      })) : await (value.model && value.id ? await File.findById(value.id) : value).sanitise())
      : null;
  }
}

/**
 * export built file helper
 *
 * @type {text}
 */
module.exports = FileField;
