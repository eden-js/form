
// import field interface
import Field from 'field';
import isURL from 'is-url';

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
      // item
      if (val && val.id) val = val.id;

      // val is not an id
      if (!`${val}`.match(/^[0-9a-fA-F]{24}$/) && isURL(val)) {
        // run try catch
        try {
          // create new upload
          const image = new Image();

          // upload
          await image.fromURL(val);

          // images
          const images = [
            (await image.thumb('1x')).resize(400, 400, {
              fit : 'contain',
            }).png().save(),
            (await image.thumb('2x')).resize(800, 800, {
              fit : 'contain',
            }).png().save(),
            (await image.thumb('3x')).resize(1200, 1200, {
              fit : 'contain',
            }).png().save(),
            (await image.thumb('sm-sq')).resize(400, 400, {
              fit        : 'contain',
              background : {
                r     : 0,
                g     : 0,
                b     : 0,
                alpha : 0,
              },
            }).png().save(),
            (await image.thumb('md-sq')).resize(800, 800, {
              fit        : 'contain',
              background : {
                r     : 0,
                g     : 0,
                b     : 0,
                alpha : 0,
              },
            }).png().save(),
            (await image.thumb('lg-sq')).resize(1200, 1200, {
              fit        : 'contain',
              background : {
                r     : 0,
                g     : 0,
                b     : 0,
                alpha : 0,
              },
            }).png().save(),
            (await image.thumb('1x-sq')).resize(400, 400, {
              fit : 'cover',
            }).png().save(),
            (await image.thumb('2x-sq')).resize(800, 800, {
              fit : 'cover',
            }).png().save(),
            (await image.thumb('3x-sq')).resize(1200, 1200, {
              fit : 'cover',
            }).png().save(),
          ];
      
          // await all thumbs
          await Promise.all(images);
      
          // set user
          image.set('user', req.user);

          // return sanitised
          return {
            id    : image.get('_id'),
            model : 'image',
          };
        } catch (e) {
          // return old
          return old[i];
        }
      }

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