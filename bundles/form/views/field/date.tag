<field-date>
  <field ref="field" is-input={ true } class="field-container-inner" on-container-class={ onFieldClass } get-fields={ getFields } get-element={ getElement } on-min-length={ onMinLength } on-max-length={ onMaxLength }>
    <yield to="body">
      <validate type="date" ref="date" group-class={ opts.field.group || 'form-group' } name={ opts.field.uuid } label={ opts.field.label || 'Set Label' } data-value={ opts.data.value } required={ opts.field.required } min-length={ (opts.field.validateLength || {}).min } max-length={ (opts.field.validateLength || {}).max } />
    </yield>
    
    <yield to="validate">
    
    </yield>
  </field>
  
  <script>
    // do mixins
    this.mixin('acl');
    
    /**
     * return value
     *
     * @return {*}
     */
    val() {
      // get val
      return this.refs.date.value;
    }

    /**
     * on mount function
     *
     * @param {Event} 'mount'
     */
    this.on('mount', () => {
      
    });
    
  </script>
</field-date>
