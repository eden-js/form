
// import field interface
import Field from 'field';

/**
 * build address helper
 */
export default class DateField extends Field {
  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'date';
  }

  /**
   * gets data
   */
  get data() {
    // return data
    return {
      tabs : ['Display', 'Validate'],
      subs : [
        {
          key   : 'duration',
          type  : 'number',
          title : 'duration',
        },
        {
          key   : 'start',
          type  : 'date',
          title : 'Start',
        },
        {
          key   : 'end',
          type  : 'date',
          title : 'End',
        },
        {
          key   : 'until',
          type  : 'date',
          title : 'Until',
        },
        {
          key   : 'repeat',
          type  : 'boolean',
          title : 'Repeat',
        },
      ],
    };
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Date / Time';
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
    return 'Date Time Field';
  }

  /**
   * submit field value
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submit({ req, old }, field, value) {
    // check value
    if (!value) return;

    // try/catch
    try {
      // get value
      value = JSON.parse(value);
    } catch (e) {}

    // check value is date
    const checkDate = new Date(value);

    // return value
    if (!isNaN(checkDate.getTime())) {
      // return parsed
      return {
        start : checkDate,
      };
    }

    // try catch
    try {
      // get values
      let { rep = {}, dur = {}, end, start, duration, until, repeat = false } = value;

      // parse dates
      end = !end || isNaN(new Date(end).getTime()) ? null : new Date(end);
      start = !start || isNaN(new Date(start).getTime()) ? null : new Date(start);
      until = !until || isNaN(new Date(until).getTime()) ? null : new Date(until);

      // duration
      if (start && duration && !end) {
        // set end
        end = new Date(start.getTime() + duration);
      }
      if (start && !duration && end) {
        // get duration
        duration = end.getTime() - start.getTime();
      }

      // return parsed
      return {
        rep,
        dur,
        end,
        start,
        until,
        repeat,
        duration,
      };
    } catch (e) {
      // return null
      return old;
    }
  }
}