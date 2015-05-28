(function() {
  var AppModel, AppView;

  AppModel = function(attrs) {
    this.val = '';
    this.attrs = {
      required: attrs.required || false,
      maxlength: attrs.maxlength || 8,
      minlength: attrs.minlength || 4
    };
    this.listeners = {
      valid: [],
      invalid: []
    };
  };

  AppModel.prototype.set = function(val) {
    if (this.val === val) {
      return;
    }
    this.val = val;
    return this.validate();
  };

  AppModel.prototype.validate = function() {
    var key, val;
    this.errors = [];
    for (key in this.attrs) {
      val = this.attrs[key];
      if (val && !this[key](val)) {
        this.errors.push(key);
      }
    }
    return this.trigger(!this.errors.length ? 'valid' : 'invalid');
  };

  AppModel.prototype.on = function(event, func) {
    return this.listeners[event].push(func);
  };

  AppModel.prototype.trigger = function(event) {
    return $.each(this.listeners[event], function() {
      return this();
    });
  };

  AppModel.prototype.required = function() {
    return this.val !== '';
  };

  AppModel.prototype.maxlength = function(num) {
    return num >= this.val.length;
  };

  AppModel.prototype.minlength = function(num) {
    return num <= this.val.length;
  };

  AppView = function(el) {
    this.initialize(el);
    return this.handleEvents();
  };

  AppView.prototype.initialize = function(el) {
    var obj;
    this.$el = $(el);
    this.$list = this.$el.next().children();
    obj = this.$el.data();
    if (this.$el.prop('required')) {
      obj['required'] = true;
    }
    return this.model = new AppModel(obj);
  };

  AppView.prototype.handleEvents = function() {
    this.$el.on('keyup', (function(_this) {
      return function(e) {
        return _this.onKeyup(e);
      };
    })(this));
    this.model.on('valid', (function(_this) {
      return function() {
        return _this.onValid();
      };
    })(this));
    return this.model.on('invalid', (function(_this) {
      return function() {
        return _this.onInvalid();
      };
    })(this));
  };

  AppView.prototype.onKeyup = function(e) {
    var $target;
    $target = $(e.currentTarget);
    return this.model.set($target.val());
  };

  AppView.prototype.onValid = function() {
    this.$el.removeClass('error');
    return this.$list.hide();
  };

  AppView.prototype.onInvalid = function() {
    this.$el.addClass('error');
    this.$list.hide();
    return $.each(this.model.errors, (function(_this) {
      return function(index, val) {
        return _this.$list.filter('[data-error="' + val + '"]').show();
      };
    })(this));
  };

  $('input').each(function() {
    return new AppView(this);
  });

}).call(this);
