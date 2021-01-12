
// import field interface
import Field from 'field';
import isURL from 'is-url';

// require models
const File = model('file');

/**
 * build address helper
 */
export default class FileField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'file';
  }

  /**
   * gets data
   */
  get data() {
    // return data
    return {
      tabs : ['Display', 'Validate'],
    };
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'File';
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
    return 'File Field';
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
      // item
      if (val && val.id) val = val.id;

      // val is not an id
      if (!`${val}`.match(/^[0-9a-fA-F]{24}$/) && isURL(val)) {
        // run try catch
        try {
          // create new upload
          const file = new File();

          // upload
          await file.fromURL(val);
      
          // set user
          file.set('user', req.user);

          // return sanitised
          return {
            id    : file.get('_id'),
            model : 'file',
          };
        } catch (e) {
          // return old
          return old[i];
        }
      }

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
        if (!(item instanceof File) && item.id && item.model) {
          item = await File.findById(item.id);
        }

        // return sanitised item
        return item && item.sanitise ? item.sanitise() : null;
      })) : await (value.model && value.id ? await File.findById(value.id) : value).sanitise())
      : null;
  }
}