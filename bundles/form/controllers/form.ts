/* eslint-disable no-empty */
/* eslint-disable global-require */

// require dependencies
import socket     from 'socket';
import Controller from 'controller';

// load models
const Form = model('form');

// load helper
const fieldHelper = helper('form/field');

/**
 * build induction controller
 *
 * @acl   true
 * @fail  /
 * @mount /form
 */
export default class FormController extends Controller {
  /**
   * construct example controller class
   */
  constructor() {
    // run super
    super();

    // register default field types
    ['address', 'boolean', 'money', 'checkbox', 'encrypt', 'date', 'file', 'email', 'image', 'phone', 'number', 'radio', 'select', 'text', 'textarea', 'wysiwyg', 'group'].sort().forEach((field) => {
      // require field
      // eslint-disable-next-line import/no-dynamic-require
      const FieldInterface = require(`form/fields/${field}`);

      // initialize class
      const actualField = new FieldInterface();

      // register
      fieldHelper.register(actualField);
    });
  }

  /**
   * add/edit action
   *
   * @route    {get}  /:id/view
   * @route    {post} /:id/view
   * @layout   admin
   * @priority 12
   */
  async viewAction(req, res) {
    // set website variable
    let form = null;

    // check for website model
    if (req.params.id && req.params.id !== 'null') {
      // add try/catch
      try {
        // load by id
        form = await Form.findById(req.params.id);
      } catch (e) {}

      // add try/catch
      try {
        // load by id
        if (!form) {
          // set form by placement
          form = await Form.findOne({
            placement : req.params.id || (req.body || req.query).placement,
          });
        }
      } catch (e) {}
    }

    // check placement
    if (!form) {
      // set new form
      form = new Form({
        creator : req.user,
      });
    }

    // return JSON
    res.json({
      state   : 'success',
      result  : await form.sanitise(req),
      message : 'Successfully got fields',
    });
  }

  /**
   * save field action
   *
   * @returns  {*}
   *
   * @route    {post} /:id/field/save
   * @layout   admin
   * @priority 12
   */
  async saveFieldAction(req, res) {
    // set website variable
    let form = new Form({
      creator : req.user,
    });

    // check for website model
    if (req.params.id && req.params.id !== 'null') {
      // load by id
      form = await Form.findById(req.params.id);
    }

    // get field
    const fields  = form.get('fields') || [];
    let field = fields.find(field => field.uuid === req.body.field.uuid);
    let create = false;

    // check create
    if (!field) {
      field = {};
      create = true;
      fields.push(field);
    }

    // loop
    for (const key in req.body.field) {
      field[key] = req.body.field[key];
    }

    // update
    const registered = fieldHelper.fields().find(w => w.type === field.type);

    // await save
    if (registered && registered.save) await registered.save(req, field);

    // get rendered
    const value = await registered.value(req, field);

    // set
    form.set('fields', fields);
    await form.save();

    // emit
    socket.room(`form.${form.get('_id').toString()}`, `form.${form.get('_id').toString()}.field`, field);

    // send alert
    req.alert('success', `Successfully ${create ? 'Created' : 'Updated'} field!`);

    // return JSON
    return res.json({
      value,
      state   : 'success',
      result  : field,
      message : 'Successfully saved field',
    });
  }

  /**
   * remove field action
   *
   * @route {post} /:id/field/remove
   */
  async removeFieldAction(req, res) {
    // set website variable
    let form = new Form({
      creator : req.user,
    });

    // check for website model
    if (req.params.id && req.params.id !== 'null') {
      // load by id
      form = await Form.findById(req.params.id);
    }

    // get field
    const fields  = form.get('fields') || [];

    // set
    form.set('fields', fields.filter((f) => f.uuid !== req.body.field.uuid));
    await form.save();
    
    // return JSON
    res.json({
      state   : 'success',
      result  : null,
      message : 'Successfully removed field',
    });
  }

  /**
   * create submit action
   *
   * @route  {post} /create
   * @layout admin
   */
  createAction(...args) {
    // return update action
    return this.updateAction(...args);
  }

  /**
   * add/edit action
   *
   * @param req
   * @param res
   *
   * @route {post} /:id/update
   */
  async updateAction(req, res) {
    // set website variable
    let form = new Form();

    // check for website model
    if (req.body.placement) {
      // load by id
      form = await Form.findOne({
        placement : req.body.placement,
      }) || new Form();
    }
    if (req.params.id) {
      // load by id
      form = await Form.findById(req.params.id);
    }

    // create
    const create = !form.get('_id');

    // update placement
    form.set('placement', req.body.placement);

    // set name/fields
    if (req.body.name) form.set('name', req.body.name);
    if (req.body.fields) form.set('fields', req.body.fields);

    // save placement
    await form.save(req.user);

    // send alert
    req.alert('success', `Successfully ${create ? 'Created' : 'Updated'} form!`);

    // return JSON
    res.json({
      state   : 'success',
      result  : await form.sanitise(req),
      message : 'Successfully updated form',
    });
  }

  /**
   * middleware for Block
   *
   * @param  {Request}   req
   * @param  {Response}  res
   * @param  {Function}  next
   */
  middlewareAction(req, res, next) {
    // set Block
    res.forms = [];

    // create middle function
    const middleFunction = (form) => {
      // check locals
      if (!Array.isArray(res.forms)) res.forms = [];

      // push placement to Block
      if (res.forms.includes(form)) return;

      // add to Block
      res.forms.push(form);
    };

    // create Block method
    res.form = req.form = middleFunction;

    // run next
    return next();
  }
}
