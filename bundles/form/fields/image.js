
// require local dependencies
const Image = model('image');

/**
 * build image helper
 */
class ImageField {
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
    this.title = 'Image';
    this.description = 'Image Field';
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
    // check value
    if (!Array.isArray(value)) value = [value];

    // return value map
    return await Promise.all((value || []).filter(val => val).map(async (val, i) => {
      // run try catch
      try {
        // buffer image
        const image = await Image.findById(val);

        // check image
        if (image) {
          // image
          return {
            id    : image.get('_id'),
            model : 'image',
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
        if (!(item instanceof Image) && item.id && item.model) {
          item = await Image.findById(item.id);
        }

        // return sanitised item
        return item && item.sanitise ? item.sanitise() : null;
      })) : await (value.model && value.id ? await Image.findById(value.id) : value).sanitise())
      : null;
  }
}

/**
 * export ImageField helper
 *
 * @type {ImageField}
 */
module.exports = ImageField;
