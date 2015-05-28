AppModel = (attrs) ->
  @val = ''
  @attrs =
    required: attrs.required or false
    maxlength: attrs.maxlength or 8
    minlength: attrs.minlength or 4
  @listeners =
    valid: []
    invalid: []
  return

AppModel::set = (val) ->
  if @val == val
    return
  @val = val
  @validate()

AppModel::validate = ->
  @errors = []
  for key of @attrs
    val = @attrs[key]
    if val and !@[key](val)
      @errors.push key
  @trigger if !@errors.length then 'valid' else 'invalid'

AppModel::on = (event, func) ->
  @listeners[event].push func

AppModel::trigger = (event) ->
  $.each @listeners[event], ->
    @()

AppModel::required = ->
  @val != ''

AppModel::maxlength = (num) ->
  num >= @val.length

AppModel::minlength = (num) ->
  num <= @val.length

AppView = (el) ->
  @initialize el
  @handleEvents()

AppView::initialize = (el) ->
  @$el = $ el
  @$list = @$el.next().children()

  obj = @$el.data()

  if @$el.prop 'required'
    obj['required'] = true

  @model = new AppModel obj

AppView::handleEvents = ->
  @$el.on 'keyup', (e) =>
    @onKeyup e

  @model.on 'valid', =>
    @onValid()

  @model.on 'invalid', =>
    @onInvalid()

AppView::onKeyup = (e) ->
  $target = $ e.currentTarget
  @model.set $target.val()

AppView::onValid = ->
  @$el.removeClass 'error'
  @$list.hide()

AppView::onInvalid = ->
  @$el.addClass 'error'
  @$list.hide()
  $.each @model.errors, (index, val) =>
    @$list
      .filter '[data-error="' + val + '"]'
      .show()

$ 'input'
  .each ->
    new AppView(this)
