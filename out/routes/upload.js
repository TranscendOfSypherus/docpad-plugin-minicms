// Generated by IcedCoffeeScript 1.8.0-a
(function() {
  var YAML, applyContext, cc, deepCopy, exec, fs, gm, iced, sessionBridge, shellEscape, slugify, uuid, __iced_k, __iced_k_noop,
    __slice = [].slice;

  iced = {
    Deferrals: (function() {
      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) {
          return this.continuation(this.ret);
        }
      };

      _Class.prototype.defer = function(defer_params) {
        ++this.count;
        return (function(_this) {
          return function() {
            var inner_params, _ref;
            inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if (defer_params != null) {
              if ((_ref = defer_params.assign_fn) != null) {
                _ref.apply(null, inner_params);
              }
            }
            return _this._fulfill();
          };
        })(this);
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    },
    trampoline: function(_fn) {
      return _fn();
    }
  };
  __iced_k = __iced_k_noop = function() {};

  slugify = require('../utils/slugify');

  cc = require('coffeecup');

  uuid = require('node-uuid');

  gm = require('gm');

  fs = require('fs');

  exec = require('child_process').exec;

  shellEscape = require('../utils/shellEscape');

  deepCopy = require('owl-deepcopy').deepCopy;

  YAML = require('yamljs');

  applyContext = require('../utils/applyContext');

  sessionBridge = require('../utils/sessionBridge');

  module.exports = function(req, res) {
    var component, config, docpad, errs, field, file, item, model, options, result, rnd, session, ___iced_passed_deferral, __iced_deferrals, __iced_k, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    config = this.config;
    docpad = this.docpad;
    session = sessionBridge.get(req);
    if (!session.authenticated) {
      res.redirect('/' + this.config.prefix.url + '/login?url=' + req.url);
      return;
    }
    model = null;
    _ref = config.models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (slugify(item.name[0]) === req.params.content) {
        model = item;
      }
    }
    if ((model != null ? model.form : void 0) == null) {
      res.set('Content-Type', 'text/plain');
      res.status(404).send('Not Found');
      return;
    }
    field = req.params.field;
    file = (_ref1 = req.files) != null ? (_ref2 = _ref1.file) != null ? _ref2[field] : void 0 : void 0;
    options = null;
    _ref3 = model.form.components;
    for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
      component = _ref3[_j];
      if (component.field === field) {
        options = component;
        break;
      }
    }
    if (((options != null ? options.type : void 0) == null) || options.type !== 'file' || (options.images == null)) {
      res.set('Content-Type', 'application/json');
      res.status(404).send({
        error: 'Invalid field.'
      });
      return;
    }
    if (!file) {
      res.set('Content-Type', 'application/json');
      res.status(404).send({
        error: 'Please upload a valid file.'
      });
      return;
    }
    if (options.images != null) {
      if (!((_ref4 = file.type) === 'image/png' || _ref4 === 'image/jpeg' || _ref4 === 'image/gif')) {
        res.set('Content-Type', 'application/json');
        res.status(404).send({
          error: 'File type ' + file.type + ' is not valid. Please upload PNG, JPEG or GIF file.'
        });
        return;
      }
      rnd = (uuid.v1() + '' + uuid.v4()).split('-').join('').substring(0, 48);
      result = {};
      errs = [];
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "c:\\Users\\IBM_ADMIN\\docpad-plugin-minicms\\src\\routes\\upload.coffee",
            funcname: "exports"
          });
          fs.mkdir(docpad.config.srcPath + '/files/tmp', __iced_deferrals.defer({
            lineno: 66
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          return __iced_k(gm(file.path).format(function(err, format) {
            if (err != null) {
              res.set('Content-Type', 'application/json');
              res.status(404).send({
                error: 'Invalid image file.'
              });
              return;
            }
            format = format.toLowerCase().slice(0, 3);
            if (format === 'jpe') {
              format = 'jpg';
            }
            return gm(file.path).size(function(err, size) {
              var dx, dy, err, ext, fnParts, height, i, key, path, scale, url, val, width, ___iced_passed_deferral1, __iced_deferrals, __iced_k;
              __iced_k = __iced_k_noop;
              ___iced_passed_deferral1 = iced.findDeferral(arguments);
              if (err != null) {
                res.set('Content-Type', 'application/json');
                res.status(404).send({
                  error: 'Invalid image file.'
                });
                return;
              }
              if (format === 'gif') {
                if (size.width < 1000 && size.height > 10000) {
                  size.height = ('' + size.height).slice(0, 3);
                } else if (size.height < 1000 && size.width > 10000) {
                  size.width = ('' + size.width).slice(0, 3);
                }
              }
              (function(_this) {
                return (function(__iced_k) {
                  var _k, _keys, _l, _ref5, _results, _while;
                  _ref5 = options.images;
                  _keys = (function() {
                    var _results1;
                    _results1 = [];
                    for (_k in _ref5) {
                      _results1.push(_k);
                    }
                    return _results1;
                  })();
                  _l = 0;
                  _results = [];
                  _while = function(__iced_k) {
                    var _break, _continue, _m, _next, _ref6;
                    _break = function() {
                      return __iced_k(_results);
                    };
                    _continue = function() {
                      return iced.trampoline(function() {
                        ++_l;
                        return _while(__iced_k);
                      });
                    };
                    _next = function(__iced_next_arg) {
                      _results.push(__iced_next_arg);
                      return _continue();
                    };
                    if (!(_l < _keys.length)) {
                      return _break();
                    } else {
                      key = _keys[_l];
                      val = _ref5[key];
                      fnParts = options.images[key].url.toString().split('.');
                      ext = 'jpg';
                      for (i = _m = _ref6 = fnParts.length - 1; _ref6 <= 0 ? _m <= 0 : _m >= 0; i = _ref6 <= 0 ? ++_m : --_m) {
                        if (fnParts[i].slice(0, 3) === 'ext') {
                          ext = format;
                          break;
                        }
                        if (fnParts[i].slice(0, 3) === 'jpg' || fnParts[i].slice(0, 4) === 'jpeg') {
                          ext = 'jpg';
                          break;
                        } else if (fnParts[i].slice(0, 3) === 'png') {
                          ext = 'png';
                          break;
                        } else if (fnParts[i].slice(0, 3) === 'gif') {
                          ext = 'gif';
                          break;
                        }
                      }
                      url = '/tmp/' + rnd + '.' + key + '.' + ext;
                      path = docpad.config.srcPath + '/files' + url;
                      (function(__iced_k) {
                        if (val.crop) {
                          scale = Math.max(val.width / size.width, val.height / size.height);
                          width = Math.round(size.width * scale);
                          height = Math.round(size.height * scale);
                          dx = Math.floor((width - val.width) / 2);
                          dy = Math.floor((height - val.height) / 2);
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral1,
                              filename: "c:\\Users\\IBM_ADMIN\\docpad-plugin-minicms\\src\\routes\\upload.coffee"
                            });
                            gm(file.path).resize(width, height).crop(val.width, val.height, dx, dy).noProfile().write(path, __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  return err = arguments[0];
                                };
                              })(),
                              lineno: 116
                            }));
                            __iced_deferrals._fulfill();
                          })(function() {
                            width = val.width;
                            return __iced_k(height = val.height);
                          });
                        } else {
                          scale = Math.min(1, Math.min(val.width / size.width, val.height / size.height));
                          width = Math.round(size.width * scale);
                          height = Math.round(size.height * scale);
                          (function(__iced_k) {
                            __iced_deferrals = new iced.Deferrals(__iced_k, {
                              parent: ___iced_passed_deferral1,
                              filename: "c:\\Users\\IBM_ADMIN\\docpad-plugin-minicms\\src\\routes\\upload.coffee"
                            });
                            gm(file.path).resize(width, height).noProfile().write(path, __iced_deferrals.defer({
                              assign_fn: (function() {
                                return function() {
                                  return err = arguments[0];
                                };
                              })(),
                              lineno: 123
                            }));
                            __iced_deferrals._fulfill();
                          })(__iced_k);
                        }
                      })(function() {
                        (function(__iced_k) {
                          if (err) {
                            errs.push(err);
                            (function(__iced_k) {
_break()
                            })(__iced_k);
                          } else {
                            return __iced_k();
                          }
                        })(function() {
                          return _next(result[key] = {
                            url: url,
                            width: width,
                            height: height
                          });
                        });
                      });
                    }
                  };
                  _while(__iced_k);
                });
              })(this)((function(_this) {
                return function() {
                  if (errs.length) {
                    res.set('Content-Type', 'application/json');
                    return res.status(404).send({
                      error: 'Error when resizing image.'
                    });
                  } else {
                    res.set('Content-Type', 'application/json; charset=UTF-8');
                    return res.send(JSON.stringify({
                      result: result
                    }));
                  }
                };
              })(this));
            });
          }));
        };
      })(this));
    } else {
      res.set('Content-Type', 'application/json');
      res.status(404).send({
        error: 'Not handled in this version.'
      });
      return;
      return __iced_k();
    }
  };

}).call(this);
