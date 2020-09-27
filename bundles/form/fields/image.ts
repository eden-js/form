
// import field interface
import Field from 'field';

// require models
const Image = model('image');

/**
 * build address helper
 */
export default class ImageField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'image';
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Image';
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
    return 'Image Field';
  }

  /**
   * submit field value
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submit({ req, old }, field, value) {
    // check array
    if (!Array.isArray(value)) value = [value];

    // return value map
    return await Promise.all(value.filter(val => val).map(async (val, i) => {
      // run try catch
      try {
        // buffer image
        const upload = await Image.findById(val);

        // check image
        if (upload) {
          // return sanitised
          return {
            id    : upload.get('_id'),
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
   * returns sanitised result of field submission
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async sanitise({ req }, field, value) {
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