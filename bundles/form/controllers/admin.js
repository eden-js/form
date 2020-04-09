
// bind dependencies
const Grid       = require('grid');
const Controller = require('controller');

// require models
const Form = model('form');

// bind helpers
const fieldHelper = helper('form/field');

/**
 * build user FormAdminControler controller
 *
 * @acl   admin.form.view
 * @fail  /
 * @mount /admin/form
 */
class FormAdminControler extends Controller {
  /**
   * construct user FormAdminControler controller
   */
  constructor() {
    // run super
    super();

    // bind methods
    this.gridAction = this.gridAction.bind(this);
    this.indexAction = this.indexAction.bind(this);
    this.createAction = this.createAction.bind(this);
    this.updateAction = this.updateAction.bind(this);
    this.removeAction = this.removeAction.bind(this);
    this.createSubmitAction = this.createSubmitAction.bind(this);
    this.updateSubmitAction = this.updateSubmitAction.bind(this);
    this.removeSubmitAction = this.removeSubmitAction.bind(this);

    // bind private methods
    this._grid = this._grid.bind(this);
  }

  /**
   * add/edit action
   *
   * @route    {get} /:id/view
   * @layout   admin
   * @priority 12
   */
  async viewAction(req, res) {
    // set website variable
    let form = new Form();
    let create = true;

    // check for website model
    if (req.params.id) {
      // load by id
      form = await Form.findById(req.params.id);
      create = false;
    }

    // res JSON
    const sanitised = await form.sanitise();

    // return JSON
    res.json({
      create,

      state   : 'success',
      result  : sanitised,
      message : 'Successfully got blocks',
    });
  }

  /**
   * index action
   *
   * @param req
   * @param res
   *
   * @icon    fa fa-file-invoice
   * @menu    {ADMIN} Forms
   * @title   form Administration
   * @route   {get} /
   * @parent  /admin/cms
   * @layout  admin
   */
  async indexAction(req, res) {
    // render grid
    res.render('form/admin', {
      grid : await this._grid(req).render(req),
    });
  }

  /**
   * add/edit action
   *
   * @route    {get} /create
   * @layout   admin
   * @priority 12
   */
  createAction(...args) {
    // return update action
    return this.updateAction(...args);
  }

  /**
   * update action
   *
   * @param req
   * @param res
   *
   * @route   {get} /:id/update
   * @layout  admin
   */
  async updateAction(req, res) {
    // set website variable
    let form   = new Form();
    let create = true;

    // check for website model
    if (req.params.id) {
      // load by id
      form = await Form.findById(req.params.id);
      create = false;
    }

    // Render admin form
    res.render('form/admin/update', {
      name      : 'Admin Home',
      item      : await form.sanitise(req),
      title     : create ? 'Create form' : `Update ${form.get('_id').toString()}`,
      fields    : fieldHelper.renderFields('frontend'),
      jumbotron : 'Update Form',
    });
  }

  /**
   * create submit action
   *
   * @route   {post} /create
   * @layout  admin
   */
  createSubmitAction(...args) {
    // return update action
    return this.updateSubmitAction(...args);
  }


  /**
   * add/edit action
   *
   * @param req
   * @param res
   *
   * @route  {post} /:id/update
   * @layout admin
   */
  async updateSubmitAction(req, res) {
    // set website variable
    let form   = new Form();
    let create = true;

    // check for website model
    if (req.params.id) {
      // load by id
      form = await Form.findById(req.params.id);
      create = false;
    }

    // update form
    form.set('user', req.user);
    form.set('slug', req.body.slug);
    form.set('title', req.body.title);
    form.set('layout', req.body.layout);
    form.set('submit', req.body.submit);
    form.set('placement', req.body.placement);

    // save form
    await form.save(req.user);

    // send alert
    req.alert('success', `Successfully ${create ? 'Created' : 'Updated'} form!`);

    // return JSON
    res.json({
      state   : 'success',
      result  : await form.sanitise(),
      message : 'Successfully updated form',
    });
  }

  /**
   * delete action
   *
   * @param req
   * @param res
   *
   * @route   {get} /:id/remove
   * @layout  admin
   */
  async removeAction(req, res) {
    // set website variable
    let form = false;

    // check for website model
    if (req.params.id) {
      // load user
      form = await Form.findById(req.params.id);
    }

    // render form
    res.render('form/admin/remove', {
      item  : await form.sanitise(),
      title : `Remove ${form.get('_id').toString()}`,
    });
  }

  /**
   * delete action
   *
   * @param req
   * @param res
   *
   * @route   {post} /:id/remove
   * @title   Remove form
   * @layout  admin
   */
  async removeSubmitAction(req, res) {
    // set website variable
    let form = false;

    // check for website model
    if (req.params.id) {
      // load user
      form = await Form.findById(req.params.id);
    }

    // alert Removed
    req.alert('success', `Successfully removed ${form.get('_id').toString()}`);

    // delete website
    await form.remove();

    // render index
    return this.indexAction(req, res);
  }

  /**
   * user grid action
   *
   * @param req
   * @param res
   *
   * @route {post} /grid
   */
  gridAction(req, res) {
    // return post grid request
    return this._grid(req).post(req, res);
  }

  /**
   * renders grid
   *
   * @return {grid}
   */
  _grid(req) {
    // create new grid
    const formGrid = new Grid();

    // set route
    formGrid.route('/admin/form/grid');

    // set grid model
    formGrid.model(Form);

    // add grid columns
    formGrid.column('_id', {
      title  : 'ID',
      width  : '1%',
      format : async (col) => {
        return col ? `<a href="/admin/form/${col.toString()}/update">${col.toString()}</a>` : '<i>N/A</i>';
      },
    }).column('type', {
      sort   : true,
      title  : 'Type',
      format : async (col) => {
        return col ? col.toString() : '<i>N/A</i>';
      },
    }).column('title', {
      sort   : true,
      title  : 'Title',
      format : async (col) => {
        return col ? (col[req.language] || '').toString() : '<i>N/A</i>';
      },
    }).column('layout', {
      sort   : true,
      title  : 'Layout',
      format : async (col) => {
        return col ? col.toString() : '<i>N/A</i>';
      },
    })
      .column('updated_at', {
        sort   : true,
        title  : 'Updated',
        format : async (col) => {
          return col.toLocaleDateString('en-GB', {
            day   : 'numeric',
            month : 'short',
            year  : 'numeric',
          });
        },
      })
      .column('created_at', {
        sort   : true,
        title  : 'Created',
        format : async (col) => {
          return col.toLocaleDateString('en-GB', {
            day   : 'numeric',
            month : 'short',
            year  : 'numeric',
          });
        },
      })
      .column('actions', {
        type   : false,
        width  : '1%',
        title  : 'Actions',
        format : async (col, row) => {
          return [
            '<div class="btn-group btn-group-sm" role="group">',
            `<a href="/admin/form/${row.get('_id').toString()}/update" class="btn btn-primary"><i class="fa fa-pencil-alt"></i></a>`,
            `<a href="/admin/form/${row.get('_id').toString()}/remove" class="btn btn-danger"><i class="fa fa-times"></i></a>`,
            '</div>',
          ].join('');
        },
      });

    // add grid filters
    formGrid.filter('type', {
      title : 'Type',
      type  : 'text',
      query : async (param) => {
        // another where
        formGrid.where({
          type : new RegExp(param.toString().toLowerCase(), 'i'),
        });
      },
    }).filter('title', {
      title : 'Title',
      type  : 'text',
      query : async (param) => {
        // another where
        formGrid.where({
          [`title.${req.language}`] : new RegExp(param.toString().toLowerCase(), 'i'),
        });
      },
    }).filter('created_at', {
      title : 'Created',
      type  : 'date',
      query : async (param) => {
        // set extend
        formGrid.gte('created_at', new Date(param.start));
        formGrid.lte('created_at', new Date(param.end));
      },
    }).filter('updated_at', {
      title : 'Updated',
      type  : 'date',
      query : async (param) => {
        // set extend
        formGrid.gte('updated_at', new Date(param.start));
        formGrid.lte('updated_at', new Date(param.end));
      },
    });

    // set default sort order
    formGrid.sort('created_at', 1);

    // return grid
    return formGrid;
  }
}

/**
 * export FormAdminControler controller
 *
 * @type {ADMIN}
 */
module.exports = FormAdminControler;
