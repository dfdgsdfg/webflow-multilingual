(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory()
    : typeof define === "function" && define.amd
    ? define(factory)
    : factory();
})(this, function() {
  "use strict";

  function createCommonjsModule(fn, module) {
    return (
      (module = { exports: {} }), fn(module, module.exports), module.exports
    );
  }

  var _core = createCommonjsModule(function(module) {
    var core = (module.exports = {
      version: "2.5.7"
    });
    if (typeof __e == "number") __e = core; // eslint-disable-line no-undef
  });
  var _core_1 = _core.version;

  var _global = createCommonjsModule(function(module) {
    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
    var global = (module.exports =
      typeof window != "undefined" && window.Math == Math
        ? window
        : typeof self != "undefined" && self.Math == Math
        ? self // eslint-disable-next-line no-new-func
        : Function("return this")());
    if (typeof __g == "number") __g = global; // eslint-disable-line no-undef
  });

  var _library = false;

  var _shared = createCommonjsModule(function(module) {
    var SHARED = "__core-js_shared__";
    var store = _global[SHARED] || (_global[SHARED] = {});
    (module.exports = function(key, value) {
      return store[key] || (store[key] = value !== undefined ? value : {});
    })("versions", []).push({
      version: _core.version,
      mode: "global",
      copyright: "© 2018 Denis Pushkarev (zloirock.ru)"
    });
  });

  var id = 0;
  var px = Math.random();

  var _uid = function(key) {
    return "Symbol(".concat(
      key === undefined ? "" : key,
      ")_",
      (++id + px).toString(36)
    );
  };

  var _wks = createCommonjsModule(function(module) {
    var store = _shared("wks");

    var Symbol = _global.Symbol;

    var USE_SYMBOL = typeof Symbol == "function";

    var $exports = (module.exports = function(name) {
      return (
        store[name] ||
        (store[name] =
          (USE_SYMBOL && Symbol[name]) ||
          (USE_SYMBOL ? Symbol : _uid)("Symbol." + name))
      );
    });

    $exports.store = store;
  });

  var _isObject = function(it) {
    return typeof it === "object" ? it !== null : typeof it === "function";
  };

  var _anObject = function(it) {
    if (!_isObject(it)) throw TypeError(it + " is not an object!");
    return it;
  };

  var _fails = function(exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var _descriptors = !_fails(function() {
    return (
      Object.defineProperty({}, "a", {
        get: function() {
          return 7;
        }
      }).a != 7
    );
  });

  var document$1 = _global.document; // typeof document.createElement is 'object' in old IE

  var is = _isObject(document$1) && _isObject(document$1.createElement);

  var _domCreate = function(it) {
    return is ? document$1.createElement(it) : {};
  };

  var _ie8DomDefine =
    !_descriptors &&
    !_fails(function() {
      return (
        Object.defineProperty(_domCreate("div"), "a", {
          get: function() {
            return 7;
          }
        }).a != 7
      );
    });

  // 7.1.1 ToPrimitive(input [, PreferredType])
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string

  var _toPrimitive = function(it, S) {
    if (!_isObject(it)) return it;
    var fn, val;
    if (
      S &&
      typeof (fn = it.toString) == "function" &&
      !_isObject((val = fn.call(it)))
    )
      return val;
    if (
      typeof (fn = it.valueOf) == "function" &&
      !_isObject((val = fn.call(it)))
    )
      return val;
    if (
      !S &&
      typeof (fn = it.toString) == "function" &&
      !_isObject((val = fn.call(it)))
    )
      return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var dP = Object.defineProperty;
  var f = _descriptors
    ? Object.defineProperty
    : function defineProperty(O, P, Attributes) {
        _anObject(O);
        P = _toPrimitive(P, true);
        _anObject(Attributes);
        if (_ie8DomDefine)
          try {
            return dP(O, P, Attributes);
          } catch (e) {
            /* empty */
          }
        if ("get" in Attributes || "set" in Attributes)
          throw TypeError("Accessors not supported!");
        if ("value" in Attributes) O[P] = Attributes.value;
        return O;
      };

  var _objectDp = {
    f: f
  };

  var _propertyDesc = function(bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var _hide = _descriptors
    ? function(object, key, value) {
        return _objectDp.f(object, key, _propertyDesc(1, value));
      }
    : function(object, key, value) {
        object[key] = value;
        return object;
      };

  // 22.1.3.31 Array.prototype[@@unscopables]
  var UNSCOPABLES = _wks("unscopables");

  var ArrayProto = Array.prototype;
  if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});

  var _addToUnscopables = function(key) {
    ArrayProto[UNSCOPABLES][key] = true;
  };

  var _iterStep = function(done, value) {
    return {
      value: value,
      done: !!done
    };
  };

  var _iterators = {};

  var toString = {}.toString;

  var _cof = function(it) {
    return toString.call(it).slice(8, -1);
  };

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  // eslint-disable-next-line no-prototype-builtins

  var _iobject = Object("z").propertyIsEnumerable(0)
    ? Object
    : function(it) {
        return _cof(it) == "String" ? it.split("") : Object(it);
      };

  // 7.2.1 RequireObjectCoercible(argument)
  var _defined = function(it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };

  // to indexed object, toObject with fallback for non-array-like ES3 strings

  var _toIobject = function(it) {
    return _iobject(_defined(it));
  };

  var hasOwnProperty = {}.hasOwnProperty;

  var _has = function(it, key) {
    return hasOwnProperty.call(it, key);
  };

  var _redefine = createCommonjsModule(function(module) {
    var SRC = _uid("src");

    var TO_STRING = "toString";
    var $toString = Function[TO_STRING];
    var TPL = ("" + $toString).split(TO_STRING);

    _core.inspectSource = function(it) {
      return $toString.call(it);
    };

    (module.exports = function(O, key, val, safe) {
      var isFunction = typeof val == "function";
      if (isFunction) _has(val, "name") || _hide(val, "name", key);
      if (O[key] === val) return;
      if (isFunction)
        _has(val, SRC) ||
          _hide(val, SRC, O[key] ? "" + O[key] : TPL.join(String(key)));

      if (O === _global) {
        O[key] = val;
      } else if (!safe) {
        delete O[key];
        _hide(O, key, val);
      } else if (O[key]) {
        O[key] = val;
      } else {
        _hide(O, key, val);
      } // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, TO_STRING, function toString() {
      return (typeof this == "function" && this[SRC]) || $toString.call(this);
    });
  });

  var _aFunction = function(it) {
    if (typeof it != "function") throw TypeError(it + " is not a function!");
    return it;
  };

  // optional / simple context binding

  var _ctx = function(fn, that, length) {
    _aFunction(fn);
    if (that === undefined) return fn;

    switch (length) {
      case 1:
        return function(a) {
          return fn.call(that, a);
        };

      case 2:
        return function(a, b) {
          return fn.call(that, a, b);
        };

      case 3:
        return function(a, b, c) {
          return fn.call(that, a, b, c);
        };
    }

    return function() /* ...args */
    {
      return fn.apply(that, arguments);
    };
  };

  var PROTOTYPE = "prototype";

  var $export = function(type, name, source) {
    var IS_FORCED = type & $export.F;
    var IS_GLOBAL = type & $export.G;
    var IS_STATIC = type & $export.S;
    var IS_PROTO = type & $export.P;
    var IS_BIND = type & $export.B;
    var target = IS_GLOBAL
      ? _global
      : IS_STATIC
      ? _global[name] || (_global[name] = {})
      : (_global[name] || {})[PROTOTYPE];
    var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
    var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
    var key, own, out, exp;
    if (IS_GLOBAL) source = name;

    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined; // export native or passed

      out = (own ? target : source)[key]; // bind timers to global for call from export context

      exp =
        IS_BIND && own
          ? _ctx(out, _global)
          : IS_PROTO && typeof out == "function"
          ? _ctx(Function.call, out)
          : out; // extend global

      if (target) _redefine(target, key, out, type & $export.U); // export

      if (exports[key] != out) _hide(exports, key, exp);
      if (IS_PROTO && expProto[key] != out) expProto[key] = out;
    }
  };

  _global.core = _core; // type bitmap

  $export.F = 1; // forced

  $export.G = 2; // global

  $export.S = 4; // static

  $export.P = 8; // proto

  $export.B = 16; // bind

  $export.W = 32; // wrap

  $export.U = 64; // safe

  $export.R = 128; // real proto method for `library`

  var _export = $export;

  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;

  var _toInteger = function(it) {
    return isNaN((it = +it)) ? 0 : (it > 0 ? floor : ceil)(it);
  };

  // 7.1.15 ToLength

  var min = Math.min;

  var _toLength = function(it) {
    return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min;

  var _toAbsoluteIndex = function(index, length) {
    index = _toInteger(index);
    return index < 0 ? max(index + length, 0) : min$1(index, length);
  };

  // false -> Array#indexOf
  // true  -> Array#includes

  var _arrayIncludes = function(IS_INCLUDES) {
    return function($this, el, fromIndex) {
      var O = _toIobject($this);
      var length = _toLength(O.length);
      var index = _toAbsoluteIndex(fromIndex, length);
      var value; // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare

      if (IS_INCLUDES && el != el)
        while (length > index) {
          value = O[index++]; // eslint-disable-next-line no-self-compare

          if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
        }
      else
        for (; length > index; index++)
          if (IS_INCLUDES || index in O) {
            if (O[index] === el) return IS_INCLUDES || index || 0;
          }
      return !IS_INCLUDES && -1;
    };
  };

  var shared = _shared("keys");

  var _sharedKey = function(key) {
    return shared[key] || (shared[key] = _uid(key));
  };

  var arrayIndexOf = _arrayIncludes(false);

  var IE_PROTO = _sharedKey("IE_PROTO");

  var _objectKeysInternal = function(object, names) {
    var O = _toIobject(object);
    var i = 0;
    var result = [];
    var key;

    for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key); // Don't enum bug & hidden keys

    while (names.length > i)
      if (_has(O, (key = names[i++]))) {
        ~arrayIndexOf(result, key) || result.push(key);
      }

    return result;
  };

  // IE 8- don't enum bug keys
  var _enumBugKeys = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(
    ","
  );

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)

  var _objectKeys =
    Object.keys ||
    function keys(O) {
      return _objectKeysInternal(O, _enumBugKeys);
    };

  var _objectDps = _descriptors
    ? Object.defineProperties
    : function defineProperties(O, Properties) {
        _anObject(O);
        var keys = _objectKeys(Properties);
        var length = keys.length;
        var i = 0;
        var P;

        while (length > i) _objectDp.f(O, (P = keys[i++]), Properties[P]);

        return O;
      };

  var document$2 = _global.document;

  var _html = document$2 && document$2.documentElement;

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])

  var IE_PROTO$1 = _sharedKey("IE_PROTO");

  var Empty = function() {
    /* empty */
  };

  var PROTOTYPE$1 = "prototype"; // Create object with fake `null` prototype: use iframe Object with cleared prototype

  var createDict = function() {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = _domCreate("iframe");

    var i = _enumBugKeys.length;
    var lt = "<";
    var gt = ">";
    var iframeDocument;
    iframe.style.display = "none";

    _html.appendChild(iframe);

    iframe.src = "javascript:"; // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);

    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(
      lt + "script" + gt + "document.F=Object" + lt + "/script" + gt
    );
    iframeDocument.close();
    createDict = iframeDocument.F;

    while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];

    return createDict();
  };

  var _objectCreate =
    Object.create ||
    function create(O, Properties) {
      var result;

      if (O !== null) {
        Empty[PROTOTYPE$1] = _anObject(O);
        result = new Empty();
        Empty[PROTOTYPE$1] = null; // add "__proto__" for Object.getPrototypeOf polyfill

        result[IE_PROTO$1] = O;
      } else result = createDict();

      return Properties === undefined ? result : _objectDps(result, Properties);
    };

  var def = _objectDp.f;

  var TAG = _wks("toStringTag");

  var _setToStringTag = function(it, tag, stat) {
    if (it && !_has((it = stat ? it : it.prototype), TAG))
      def(it, TAG, {
        configurable: true,
        value: tag
      });
  };

  var IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

  _hide(IteratorPrototype, _wks("iterator"), function() {
    return this;
  });

  var _iterCreate = function(Constructor, NAME, next) {
    Constructor.prototype = _objectCreate(IteratorPrototype, {
      next: _propertyDesc(1, next)
    });
    _setToStringTag(Constructor, NAME + " Iterator");
  };

  // 7.1.13 ToObject(argument)

  var _toObject = function(it) {
    return Object(_defined(it));
  };

  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)

  var IE_PROTO$2 = _sharedKey("IE_PROTO");

  var ObjectProto = Object.prototype;

  var _objectGpo =
    Object.getPrototypeOf ||
    function(O) {
      O = _toObject(O);
      if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];

      if (typeof O.constructor == "function" && O instanceof O.constructor) {
        return O.constructor.prototype;
      }

      return O instanceof Object ? ObjectProto : null;
    };

  var ITERATOR = _wks("iterator");

  var BUGGY = !([].keys && "next" in [].keys()); // Safari has buggy iterators w/o `next`

  var FF_ITERATOR = "@@iterator";
  var KEYS = "keys";
  var VALUES = "values";

  var returnThis = function() {
    return this;
  };

  var _iterDefine = function(
    Base,
    NAME,
    Constructor,
    next,
    DEFAULT,
    IS_SET,
    FORCED
  ) {
    _iterCreate(Constructor, NAME, next);

    var getMethod = function(kind) {
      if (!BUGGY && kind in proto) return proto[kind];

      switch (kind) {
        case KEYS:
          return function keys() {
            return new Constructor(this, kind);
          };

        case VALUES:
          return function values() {
            return new Constructor(this, kind);
          };
      }

      return function entries() {
        return new Constructor(this, kind);
      };
    };

    var TAG = NAME + " Iterator";
    var DEF_VALUES = DEFAULT == VALUES;
    var VALUES_BUG = false;
    var proto = Base.prototype;
    var $native =
      proto[ITERATOR] || proto[FF_ITERATOR] || (DEFAULT && proto[DEFAULT]);
    var $default = $native || getMethod(DEFAULT);
    var $entries = DEFAULT
      ? !DEF_VALUES
        ? $default
        : getMethod("entries")
      : undefined;
    var $anyNative = NAME == "Array" ? proto.entries || $native : $native;
    var methods, key, IteratorPrototype; // Fix native

    if ($anyNative) {
      IteratorPrototype = _objectGpo($anyNative.call(new Base()));

      if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        _setToStringTag(IteratorPrototype, TAG, true); // fix for some old engines

        if (!_library && typeof IteratorPrototype[ITERATOR] != "function")
          _hide(IteratorPrototype, ITERATOR, returnThis);
      }
    } // fix Array#{values, @@iterator}.name in V8 / FF

    if (DEF_VALUES && $native && $native.name !== VALUES) {
      VALUES_BUG = true;

      $default = function values() {
        return $native.call(this);
      };
    } // Define iterator

    if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      _hide(proto, ITERATOR, $default);
    } // Plug for library

    _iterators[NAME] = $default;
    _iterators[TAG] = returnThis;

    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: $entries
      };
      if (FORCED)
        for (key in methods) {
          if (!(key in proto)) _redefine(proto, key, methods[key]);
        }
      else
        _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }

    return methods;
  };

  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()

  var es6_array_iterator = _iterDefine(
    Array,
    "Array",
    function(iterated, kind) {
      this._t = _toIobject(iterated); // target

      this._i = 0; // next index

      this._k = kind; // kind
      // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
    },
    function() {
      var O = this._t;
      var kind = this._k;
      var index = this._i++;

      if (!O || index >= O.length) {
        this._t = undefined;
        return _iterStep(1);
      }

      if (kind == "keys") return _iterStep(0, index);
      if (kind == "values") return _iterStep(0, O[index]);
      return _iterStep(0, [index, O[index]]);
    },
    "values"
  ); // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)

  _iterators.Arguments = _iterators.Array;
  _addToUnscopables("keys");
  _addToUnscopables("values");
  _addToUnscopables("entries");

  var _redefineAll = function(target, src, safe) {
    for (var key in src) _redefine(target, key, src[key], safe);

    return target;
  };

  var _anInstance = function(it, Constructor, name, forbiddenField) {
    if (
      !(it instanceof Constructor) ||
      (forbiddenField !== undefined && forbiddenField in it)
    ) {
      throw TypeError(name + ": incorrect invocation!");
    }

    return it;
  };

  // call something on iterator step with safe closing on error

  var _iterCall = function(iterator, fn, value, entries) {
    try {
      return entries ? fn(_anObject(value)[0], value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
    } catch (e) {
      var ret = iterator["return"];
      if (ret !== undefined) _anObject(ret.call(iterator));
      throw e;
    }
  };

  // check on default Array iterator

  var ITERATOR$1 = _wks("iterator");

  var ArrayProto$1 = Array.prototype;

  var _isArrayIter = function(it) {
    return (
      it !== undefined &&
      (_iterators.Array === it || ArrayProto$1[ITERATOR$1] === it)
    );
  };

  // getting tag from 19.1.3.6 Object.prototype.toString()

  var TAG$1 = _wks("toStringTag"); // ES3 wrong here

  var ARG =
    _cof(
      (function() {
        return arguments;
      })()
    ) == "Arguments"; // fallback for IE11 Script Access Denied error

  var tryGet = function(it, key) {
    try {
      return it[key];
    } catch (e) {
      /* empty */
    }
  };

  var _classof = function(it) {
    var O, T, B;
    return it === undefined
      ? "Undefined"
      : it === null
      ? "Null" // @@toStringTag case
      : typeof (T = tryGet((O = Object(it)), TAG$1)) == "string"
      ? T // builtinTag case
      : ARG
      ? _cof(O) // ES3 arguments fallback
      : (B = _cof(O)) == "Object" && typeof O.callee == "function"
      ? "Arguments"
      : B;
  };

  var ITERATOR$2 = _wks("iterator");

  var core_getIteratorMethod = (_core.getIteratorMethod = function(it) {
    if (it != undefined)
      return it[ITERATOR$2] || it["@@iterator"] || _iterators[_classof(it)];
  });

  var _forOf = createCommonjsModule(function(module) {
    var BREAK = {};
    var RETURN = {};

    var exports = (module.exports = function(
      iterable,
      entries,
      fn,
      that,
      ITERATOR
    ) {
      var iterFn = ITERATOR
        ? function() {
            return iterable;
          }
        : core_getIteratorMethod(iterable);
      var f = _ctx(fn, that, entries ? 2 : 1);
      var index = 0;
      var length, step, iterator, result;
      if (typeof iterFn != "function")
        throw TypeError(iterable + " is not iterable!"); // fast case for arrays with default iterator

      if (_isArrayIter(iterFn))
        for (length = _toLength(iterable.length); length > index; index++) {
          result = entries
            ? f(_anObject((step = iterable[index]))[0], step[1])
            : f(iterable[index]);
          if (result === BREAK || result === RETURN) return result;
        }
      else
        for (
          iterator = iterFn.call(iterable);
          !(step = iterator.next()).done;

        ) {
          result = _iterCall(iterator, f, step.value, entries);
          if (result === BREAK || result === RETURN) return result;
        }
    });

    exports.BREAK = BREAK;
    exports.RETURN = RETURN;
  });

  var SPECIES = _wks("species");

  var _setSpecies = function(KEY) {
    var C = _global[KEY];
    if (_descriptors && C && !C[SPECIES])
      _objectDp.f(C, SPECIES, {
        configurable: true,
        get: function() {
          return this;
        }
      });
  };

  var _meta = createCommonjsModule(function(module) {
    var META = _uid("meta");

    var setDesc = _objectDp.f;

    var id = 0;

    var isExtensible =
      Object.isExtensible ||
      function() {
        return true;
      };

    var FREEZE = !_fails(function() {
      return isExtensible(Object.preventExtensions({}));
    });

    var setMeta = function(it) {
      setDesc(it, META, {
        value: {
          i: "O" + ++id,
          // object ID
          w: {} // weak collections IDs
        }
      });
    };

    var fastKey = function(it, create) {
      // return primitive with prefix
      if (!_isObject(it))
        return typeof it == "symbol"
          ? it
          : (typeof it == "string" ? "S" : "P") + it;

      if (!_has(it, META)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return "F"; // not necessary to add metadata

        if (!create) return "E"; // add missing metadata

        setMeta(it); // return object ID
      }

      return it[META].i;
    };

    var getWeak = function(it, create) {
      if (!_has(it, META)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return true; // not necessary to add metadata

        if (!create) return false; // add missing metadata

        setMeta(it); // return hash weak collections IDs
      }

      return it[META].w;
    }; // add metadata on freeze-family methods calling

    var onFreeze = function(it) {
      if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META))
        setMeta(it);
      return it;
    };

    var meta = (module.exports = {
      KEY: META,
      NEED: false,
      fastKey: fastKey,
      getWeak: getWeak,
      onFreeze: onFreeze
    });
  });
  var _meta_1 = _meta.KEY;
  var _meta_2 = _meta.NEED;
  var _meta_3 = _meta.fastKey;
  var _meta_4 = _meta.getWeak;
  var _meta_5 = _meta.onFreeze;

  var _validateCollection = function(it, TYPE) {
    if (!_isObject(it) || it._t !== TYPE)
      throw TypeError("Incompatible receiver, " + TYPE + " required!");
    return it;
  };

  var dP$1 = _objectDp.f;

  var fastKey = _meta.fastKey;

  var SIZE = _descriptors ? "_s" : "size";

  var getEntry = function(that, key) {
    // fast case
    var index = fastKey(key);
    var entry;
    if (index !== "F") return that._i[index]; // frozen object case

    for (entry = that._f; entry; entry = entry.n) {
      if (entry.k == key) return entry;
    }
  };

  var _collectionStrong = {
    getConstructor: function(wrapper, NAME, IS_MAP, ADDER) {
      var C = wrapper(function(that, iterable) {
        _anInstance(that, C, NAME, "_i");
        that._t = NAME; // collection type

        that._i = _objectCreate(null); // index

        that._f = undefined; // first entry

        that._l = undefined; // last entry

        that[SIZE] = 0; // size

        if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
      });
      _redefineAll(C.prototype, {
        // 23.1.3.1 Map.prototype.clear()
        // 23.2.3.2 Set.prototype.clear()
        clear: function clear() {
          for (
            var that = _validateCollection(this, NAME),
              data = that._i,
              entry = that._f;
            entry;
            entry = entry.n
          ) {
            entry.r = true;
            if (entry.p) entry.p = entry.p.n = undefined;
            delete data[entry.i];
          }

          that._f = that._l = undefined;
          that[SIZE] = 0;
        },
        // 23.1.3.3 Map.prototype.delete(key)
        // 23.2.3.4 Set.prototype.delete(value)
        delete: function(key) {
          var that = _validateCollection(this, NAME);
          var entry = getEntry(that, key);

          if (entry) {
            var next = entry.n;
            var prev = entry.p;
            delete that._i[entry.i];
            entry.r = true;
            if (prev) prev.n = next;
            if (next) next.p = prev;
            if (that._f == entry) that._f = next;
            if (that._l == entry) that._l = prev;
            that[SIZE]--;
          }

          return !!entry;
        },
        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
        forEach: function forEach(
          callbackfn
          /* , that = undefined */
        ) {
          _validateCollection(this, NAME);
          var f = _ctx(
            callbackfn,
            arguments.length > 1 ? arguments[1] : undefined,
            3
          );
          var entry;

          while ((entry = entry ? entry.n : this._f)) {
            f(entry.v, entry.k, this); // revert to the last existing entry

            while (entry && entry.r) entry = entry.p;
          }
        },
        // 23.1.3.7 Map.prototype.has(key)
        // 23.2.3.7 Set.prototype.has(value)
        has: function has(key) {
          return !!getEntry(_validateCollection(this, NAME), key);
        }
      });
      if (_descriptors)
        dP$1(C.prototype, "size", {
          get: function() {
            return _validateCollection(this, NAME)[SIZE];
          }
        });
      return C;
    },
    def: function(that, key, value) {
      var entry = getEntry(that, key);
      var prev, index; // change existing entry

      if (entry) {
        entry.v = value; // create new entry
      } else {
        that._l = entry = {
          i: (index = fastKey(key, true)),
          // <- index
          k: key,
          // <- key
          v: value,
          // <- value
          p: (prev = that._l),
          // <- previous entry
          n: undefined,
          // <- next entry
          r: false // <- removed
        };
        if (!that._f) that._f = entry;
        if (prev) prev.n = entry;
        that[SIZE]++; // add to index

        if (index !== "F") that._i[index] = entry;
      }

      return that;
    },
    getEntry: getEntry,
    setStrong: function(C, NAME, IS_MAP) {
      // add .keys, .values, .entries, [@@iterator]
      // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
      _iterDefine(
        C,
        NAME,
        function(iterated, kind) {
          this._t = _validateCollection(iterated, NAME); // target

          this._k = kind; // kind

          this._l = undefined; // previous
        },
        function() {
          var that = this;
          var kind = that._k;
          var entry = that._l; // revert to the last existing entry

          while (entry && entry.r) entry = entry.p; // get next entry

          if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
            // or finish the iteration
            that._t = undefined;
            return _iterStep(1);
          } // return step by kind

          if (kind == "keys") return _iterStep(0, entry.k);
          if (kind == "values") return _iterStep(0, entry.v);
          return _iterStep(0, [entry.k, entry.v]);
        },
        IS_MAP ? "entries" : "values",
        !IS_MAP,
        true
      ); // add [@@species], 23.1.2.2, 23.2.2.2

      _setSpecies(NAME);
    }
  };

  var ITERATOR$3 = _wks("iterator");

  var SAFE_CLOSING = false;

  try {
    var riter = [7][ITERATOR$3]();

    riter["return"] = function() {
      SAFE_CLOSING = true;
    }; // eslint-disable-next-line no-throw-literal
  } catch (e) {
    /* empty */
  }

  var _iterDetect = function(exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING) return false;
    var safe = false;

    try {
      var arr = [7];
      var iter = arr[ITERATOR$3]();

      iter.next = function() {
        return {
          done: (safe = true)
        };
      };

      arr[ITERATOR$3] = function() {
        return iter;
      };

      exec(arr);
    } catch (e) {
      /* empty */
    }

    return safe;
  };

  var f$1 = {}.propertyIsEnumerable;

  var _objectPie = {
    f: f$1
  };

  var gOPD = Object.getOwnPropertyDescriptor;
  var f$2 = _descriptors
    ? gOPD
    : function getOwnPropertyDescriptor(O, P) {
        O = _toIobject(O);
        P = _toPrimitive(P, true);
        if (_ie8DomDefine)
          try {
            return gOPD(O, P);
          } catch (e) {
            /* empty */
          }
        if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
      };

  var _objectGopd = {
    f: f$2
  };

  // Works with __proto__ only. Old v8 can't work with null proto objects.

  /* eslint-disable no-proto */

  var check = function(O, proto) {
    _anObject(O);
    if (!_isObject(proto) && proto !== null)
      throw TypeError(proto + ": can't set as prototype!");
  };

  var _setProto = {
    set:
      Object.setPrototypeOf ||
      ("__proto__" in {} // eslint-disable-line
        ? (function(test, buggy, set) {
            try {
              set = _ctx(
                Function.call,
                _objectGopd.f(Object.prototype, "__proto__").set,
                2
              );
              set(test, []);
              buggy = !(test instanceof Array);
            } catch (e) {
              buggy = true;
            }

            return function setPrototypeOf(O, proto) {
              check(O, proto);
              if (buggy) O.__proto__ = proto;
              else set(O, proto);
              return O;
            };
          })({}, false)
        : undefined),
    check: check
  };

  var setPrototypeOf = _setProto.set;

  var _inheritIfRequired = function(that, target, C) {
    var S = target.constructor;
    var P;

    if (
      S !== C &&
      typeof S == "function" &&
      (P = S.prototype) !== C.prototype &&
      _isObject(P) &&
      setPrototypeOf
    ) {
      setPrototypeOf(that, P);
    }

    return that;
  };

  var _collection = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
    var Base = _global[NAME];
    var C = Base;
    var ADDER = IS_MAP ? "set" : "add";
    var proto = C && C.prototype;
    var O = {};

    var fixMethod = function(KEY) {
      var fn = proto[KEY];
      _redefine(
        proto,
        KEY,
        KEY == "delete"
          ? function(a) {
              return IS_WEAK && !_isObject(a)
                ? false
                : fn.call(this, a === 0 ? 0 : a);
            }
          : KEY == "has"
          ? function has(a) {
              return IS_WEAK && !_isObject(a)
                ? false
                : fn.call(this, a === 0 ? 0 : a);
            }
          : KEY == "get"
          ? function get(a) {
              return IS_WEAK && !_isObject(a)
                ? undefined
                : fn.call(this, a === 0 ? 0 : a);
            }
          : KEY == "add"
          ? function add(a) {
              fn.call(this, a === 0 ? 0 : a);
              return this;
            }
          : function set(a, b) {
              fn.call(this, a === 0 ? 0 : a, b);
              return this;
            }
      );
    };

    if (
      typeof C != "function" ||
      !(
        IS_WEAK ||
        (proto.forEach &&
          !_fails(function() {
            new C().entries().next();
          }))
      )
    ) {
      // create collection constructor
      C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
      _redefineAll(C.prototype, methods);
      _meta.NEED = true;
    } else {
      var instance = new C(); // early implementations not supports chaining

      var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance; // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false

      var THROWS_ON_PRIMITIVES = _fails(function() {
        instance.has(1);
      }); // most early implementations doesn't supports iterables, most modern - not close it correctly

      var ACCEPT_ITERABLES = _iterDetect(function(iter) {
        new C(iter);
      }); // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same

      var BUGGY_ZERO =
        !IS_WEAK &&
        _fails(function() {
          // V8 ~ Chromium 42- fails only with 5+ elements
          var $instance = new C();
          var index = 5;

          while (index--) $instance[ADDER](index, index);

          return !$instance.has(-0);
        });

      if (!ACCEPT_ITERABLES) {
        C = wrapper(function(target, iterable) {
          _anInstance(target, C, NAME);
          var that = _inheritIfRequired(new Base(), target, C);
          if (iterable != undefined)
            _forOf(iterable, IS_MAP, that[ADDER], that);
          return that;
        });
        C.prototype = proto;
        proto.constructor = C;
      }

      if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
        fixMethod("delete");
        fixMethod("has");
        IS_MAP && fixMethod("get");
      }

      if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER); // weak collections should not contains .clear method

      if (IS_WEAK && proto.clear) delete proto.clear;
    }

    _setToStringTag(C, NAME);
    O[NAME] = C;
    _export(_export.G + _export.W + _export.F * (C != Base), O);
    if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);
    return C;
  };

  var SET = "Set"; // 23.2 Set Objects

  var es6_set = _collection(
    SET,
    function(get) {
      return function Set() {
        return get(this, arguments.length > 0 ? arguments[0] : undefined);
      };
    },
    {
      // 23.2.3.1 Set.prototype.add(value)
      add: function add(value) {
        return _collectionStrong.def(
          _validateCollection(this, SET),
          (value = value === 0 ? 0 : value),
          value
        );
      }
    },
    _collectionStrong
  );

  // true  -> String#at
  // false -> String#codePointAt

  var _stringAt = function(TO_STRING) {
    return function(that, pos) {
      var s = String(_defined(that));
      var i = _toInteger(pos);
      var l = s.length;
      var a, b;
      if (i < 0 || i >= l) return TO_STRING ? "" : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 ||
        a > 0xdbff ||
        i + 1 === l ||
        (b = s.charCodeAt(i + 1)) < 0xdc00 ||
        b > 0xdfff
        ? TO_STRING
          ? s.charAt(i)
          : a
        : TO_STRING
        ? s.slice(i, i + 2)
        : ((a - 0xd800) << 10) + (b - 0xdc00) + 0x10000;
    };
  };

  var $at = _stringAt(true); // 21.1.3.27 String.prototype[@@iterator]()

  _iterDefine(
    String,
    "String",
    function(iterated) {
      this._t = String(iterated); // target

      this._i = 0; // next index
      // 21.1.5.2.1 %StringIteratorPrototype%.next()
    },
    function() {
      var O = this._t;
      var index = this._i;
      var point;
      if (index >= O.length)
        return {
          value: undefined,
          done: true
        };
      point = $at(O, index);
      this._i += point.length;
      return {
        value: point,
        done: false
      };
    }
  );

  var _createProperty = function(object, index, value) {
    if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
    else object[index] = value;
  };

  _export(_export.S + _export.F * !_iterDetect(function(iter) {}), "Array", {
    // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
    from: function from(
      arrayLike
      /* , mapfn = undefined, thisArg = undefined */
    ) {
      var O = _toObject(arrayLike);
      var C = typeof this == "function" ? this : Array;
      var aLen = arguments.length;
      var mapfn = aLen > 1 ? arguments[1] : undefined;
      var mapping = mapfn !== undefined;
      var index = 0;
      var iterFn = core_getIteratorMethod(O);
      var length, result, step, iterator;
      if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2); // if object isn't iterable or it's array with default iterator - use simple case

      if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
        for (
          iterator = iterFn.call(O), result = new C();
          !(step = iterator.next()).done;
          index++
        ) {
          _createProperty(
            result,
            index,
            mapping
              ? _iterCall(iterator, mapfn, [step.value, index], true)
              : step.value
          );
        }
      } else {
        length = _toLength(O.length);

        for (result = new C(length); length > index; index++) {
          _createProperty(
            result,
            index,
            mapping ? mapfn(O[index], index) : O[index]
          );
        }
      }

      result.length = index;
      return result;
    }
  });

  var ITERATOR$4 = _wks("iterator");
  var TO_STRING_TAG = _wks("toStringTag");
  var ArrayValues = _iterators.Array;
  var DOMIterables = {
    CSSRuleList: true,
    // TODO: Not spec compliant, should be false.
    CSSStyleDeclaration: false,
    CSSValueList: false,
    ClientRectList: false,
    DOMRectList: false,
    DOMStringList: false,
    DOMTokenList: true,
    DataTransferItemList: false,
    FileList: false,
    HTMLAllCollection: false,
    HTMLCollection: false,
    HTMLFormElement: false,
    HTMLSelectElement: false,
    MediaList: true,
    // TODO: Not spec compliant, should be false.
    MimeTypeArray: false,
    NamedNodeMap: false,
    NodeList: true,
    PaintRequestList: false,
    Plugin: false,
    PluginArray: false,
    SVGLengthList: false,
    SVGNumberList: false,
    SVGPathSegList: false,
    SVGPointList: false,
    SVGStringList: false,
    SVGTransformList: false,
    SourceBufferList: false,
    StyleSheetList: true,
    // TODO: Not spec compliant, should be false.
    TextTrackCueList: false,
    TextTrackList: false,
    TouchList: false
  };

  for (
    var collections = _objectKeys(DOMIterables), i = 0;
    i < collections.length;
    i++
  ) {
    var NAME = collections[i];
    var explicit = DOMIterables[NAME];
    var Collection = _global[NAME];
    var proto = Collection && Collection.prototype;
    var key;

    if (proto) {
      if (!proto[ITERATOR$4]) _hide(proto, ITERATOR$4, ArrayValues);
      if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
      _iterators[NAME] = ArrayValues;
      if (explicit)
        for (key in es6_array_iterator)
          if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
    }
  }

  var _fixReWks = function(KEY, length, exec) {
    var SYMBOL = _wks(KEY);
    var fns = exec(_defined, SYMBOL, ""[KEY]);
    var strfn = fns[0];
    var rxfn = fns[1];

    if (
      _fails(function() {
        var O = {};

        O[SYMBOL] = function() {
          return 7;
        };

        return ""[KEY](O) != 7;
      })
    ) {
      _redefine(String.prototype, KEY, strfn);
      _hide(
        RegExp.prototype,
        SYMBOL,
        length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
          ? // 21.2.5.11 RegExp.prototype[@@split](string, limit)
            function(string, arg) {
              return rxfn.call(string, this, arg);
            } // 21.2.5.6 RegExp.prototype[@@match](string)
          : // 21.2.5.9 RegExp.prototype[@@search](string)
            function(string) {
              return rxfn.call(string, this);
            }
      );
    }
  };

  // @@search logic
  _fixReWks("search", 1, function(defined, SEARCH, $search) {
    // 21.1.3.15 String.prototype.search(regexp)
    return [
      function search(regexp) {
        var O = defined(this);
        var fn = regexp == undefined ? undefined : regexp[SEARCH];
        return fn !== undefined
          ? fn.call(regexp, O)
          : new RegExp(regexp)[SEARCH](String(O));
      },
      $search
    ];
  });

  const LANGUAGES_LIST = {
    aa: {
      name: "Afar",
      nativeName: "Afaraf"
    },
    ab: {
      name: "Abkhaz",
      nativeName: "аҧсуа бызшәа"
    },
    ae: {
      name: "Avestan",
      nativeName: "avesta"
    },
    af: {
      name: "Afrikaans",
      nativeName: "Afrikaans"
    },
    ak: {
      name: "Akan",
      nativeName: "Akan"
    },
    am: {
      name: "Amharic",
      nativeName: "አማርኛ"
    },
    an: {
      name: "Aragonese",
      nativeName: "aragonés"
    },
    ar: {
      name: "Arabic",
      nativeName: "اللغة العربية"
    },
    as: {
      name: "Assamese",
      nativeName: "অসমীয়া"
    },
    av: {
      name: "Avaric",
      nativeName: "авар мацӀ"
    },
    ay: {
      name: "Aymara",
      nativeName: "aymar aru"
    },
    az: {
      name: "Azerbaijani",
      nativeName: "azərbaycan dili"
    },
    ba: {
      name: "Bashkir",
      nativeName: "башҡорт теле"
    },
    be: {
      name: "Belarusian",
      nativeName: "беларуская мова"
    },
    bg: {
      name: "Bulgarian",
      nativeName: "български език"
    },
    bh: {
      name: "Bihari",
      nativeName: "भोजपुरी"
    },
    bi: {
      name: "Bislama",
      nativeName: "Bislama"
    },
    bm: {
      name: "Bambara",
      nativeName: "bamanankan"
    },
    bn: {
      name: "Bengali",
      nativeName: "বাংলা"
    },
    bo: {
      name: "Tibetan Standard",
      nativeName: "བོད་ཡིག"
    },
    br: {
      name: "Breton",
      nativeName: "brezhoneg"
    },
    bs: {
      name: "Bosnian",
      nativeName: "bosanski jezik"
    },
    ca: {
      name: "Catalan",
      nativeName: "català"
    },
    ce: {
      name: "Chechen",
      nativeName: "нохчийн мотт"
    },
    ch: {
      name: "Chamorro",
      nativeName: "Chamoru"
    },
    co: {
      name: "Corsican",
      nativeName: "corsu"
    },
    cr: {
      name: "Cree",
      nativeName: "ᓀᐦᐃᔭᐍᐏᐣ"
    },
    cs: {
      name: "Czech",
      nativeName: "čeština"
    },
    cu: {
      name: "Old Church Slavonic",
      nativeName: "ѩзыкъ словѣньскъ"
    },
    cv: {
      name: "Chuvash",
      nativeName: "чӑваш чӗлхи"
    },
    cy: {
      name: "Welsh",
      nativeName: "Cymraeg"
    },
    da: {
      name: "Danish",
      nativeName: "dansk"
    },
    de: {
      name: "German",
      nativeName: "Deutsch"
    },
    dv: {
      name: "Divehi",
      nativeName: "Dhivehi"
    },
    dz: {
      name: "Dzongkha",
      nativeName: "རྫོང་ཁ"
    },
    ee: {
      name: "Ewe",
      nativeName: "Eʋegbe"
    },
    el: {
      name: "Greek",
      nativeName: "ελληνικά"
    },
    en: {
      name: "English",
      nativeName: "English"
    },
    eo: {
      name: "Esperanto",
      nativeName: "Esperanto"
    },
    es: {
      name: "Spanish",
      nativeName: "Español"
    },
    et: {
      name: "Estonian",
      nativeName: "eesti"
    },
    eu: {
      name: "Basque",
      nativeName: "euskara"
    },
    fa: {
      name: "Persian",
      nativeName: "فارسی"
    },
    ff: {
      name: "Fula",
      nativeName: "Fulfulde"
    },
    fi: {
      name: "Finnish",
      nativeName: "suomi"
    },
    fj: {
      name: "Fijian",
      nativeName: "Vakaviti"
    },
    fo: {
      name: "Faroese",
      nativeName: "føroyskt"
    },
    fr: {
      name: "French",
      nativeName: "Français"
    },
    fy: {
      name: "Western Frisian",
      nativeName: "Frysk"
    },
    ga: {
      name: "Irish",
      nativeName: "Gaeilge"
    },
    gd: {
      name: "Scottish Gaelic",
      nativeName: "Gàidhlig"
    },
    gl: {
      name: "Galician",
      nativeName: "galego"
    },
    gn: {
      name: "Guaraní",
      nativeName: "Avañe'ẽ"
    },
    gu: {
      name: "Gujarati",
      nativeName: "ગુજરાતી"
    },
    gv: {
      name: "Manx",
      nativeName: "Gaelg"
    },
    ha: {
      name: "Hausa",
      nativeName: "هَوُسَ"
    },
    he: {
      name: "Hebrew",
      nativeName: "עברית"
    },
    hi: {
      name: "Hindi",
      nativeName: "हिन्दी"
    },
    ho: {
      name: "Hiri Motu",
      nativeName: "Hiri Motu"
    },
    hr: {
      name: "Croatian",
      nativeName: "hrvatski jezik"
    },
    ht: {
      name: "Haitian",
      nativeName: "Kreyòl ayisyen"
    },
    hu: {
      name: "Hungarian",
      nativeName: "magyar"
    },
    hy: {
      name: "Armenian",
      nativeName: "Հայերեն"
    },
    hz: {
      name: "Herero",
      nativeName: "Otjiherero"
    },
    ia: {
      name: "Interlingua",
      nativeName: "Interlingua"
    },
    id: {
      name: "Indonesian",
      nativeName: "Indonesian"
    },
    ie: {
      name: "Interlingue",
      nativeName: "Interlingue"
    },
    ig: {
      name: "Igbo",
      nativeName: "Asụsụ Igbo"
    },
    ii: {
      name: "Nuosu",
      nativeName: "ꆈꌠ꒿ Nuosuhxop"
    },
    ik: {
      name: "Inupiaq",
      nativeName: "Iñupiaq"
    },
    io: {
      name: "Ido",
      nativeName: "Ido"
    },
    is: {
      name: "Icelandic",
      nativeName: "Íslenska"
    },
    it: {
      name: "Italian",
      nativeName: "Italiano"
    },
    iu: {
      name: "Inuktitut",
      nativeName: "ᐃᓄᒃᑎᑐᑦ"
    },
    ja: {
      name: "Japanese",
      nativeName: "日本語"
    },
    jv: {
      name: "Javanese",
      nativeName: "basa Jawa"
    },
    ka: {
      name: "Georgian",
      nativeName: "ქართული"
    },
    kg: {
      name: "Kongo",
      nativeName: "Kikongo"
    },
    ki: {
      name: "Kikuyu",
      nativeName: "Gĩkũyũ"
    },
    kj: {
      name: "Kwanyama",
      nativeName: "Kuanyama"
    },
    kk: {
      name: "Kazakh",
      nativeName: "қазақ тілі"
    },
    kl: {
      name: "Kalaallisut",
      nativeName: "kalaallisut"
    },
    km: {
      name: "Khmer",
      nativeName: "ខេមរភាសា"
    },
    kn: {
      name: "Kannada",
      nativeName: "ಕನ್ನಡ"
    },
    ko: {
      name: "Korean",
      nativeName: "한국어"
    },
    kr: {
      name: "Kanuri",
      nativeName: "Kanuri"
    },
    ks: {
      name: "Kashmiri",
      nativeName: "कश्मीरी"
    },
    ku: {
      name: "Kurdish",
      nativeName: "Kurdî"
    },
    kv: {
      name: "Komi",
      nativeName: "коми кыв"
    },
    kw: {
      name: "Cornish",
      nativeName: "Kernewek"
    },
    ky: {
      name: "Kyrgyz",
      nativeName: "Кыргызча"
    },
    la: {
      name: "Latin",
      nativeName: "latine"
    },
    lb: {
      name: "Luxembourgish",
      nativeName: "Lëtzebuergesch"
    },
    lg: {
      name: "Ganda",
      nativeName: "Luganda"
    },
    li: {
      name: "Limburgish",
      nativeName: "Limburgs"
    },
    ln: {
      name: "Lingala",
      nativeName: "Lingála"
    },
    lo: {
      name: "Lao",
      nativeName: "ພາສາ"
    },
    lt: {
      name: "Lithuanian",
      nativeName: "lietuvių kalba"
    },
    lu: {
      name: "Luba-Katanga",
      nativeName: "Tshiluba"
    },
    lv: {
      name: "Latvian",
      nativeName: "latviešu valoda"
    },
    mg: {
      name: "Malagasy",
      nativeName: "fiteny malagasy"
    },
    mh: {
      name: "Marshallese",
      nativeName: "Kajin M̧ajeļ"
    },
    mi: {
      name: "Māori",
      nativeName: "te reo Māori"
    },
    mk: {
      name: "Macedonian",
      nativeName: "македонски јазик"
    },
    ml: {
      name: "Malayalam",
      nativeName: "മലയാളം"
    },
    mn: {
      name: "Mongolian",
      nativeName: "Монгол хэл"
    },
    mr: {
      name: "Marathi",
      nativeName: "मराठी"
    },
    ms: {
      name: "Malay",
      nativeName: "هاس ملايو‎"
    },
    mt: {
      name: "Maltese",
      nativeName: "Malti"
    },
    my: {
      name: "Burmese",
      nativeName: "ဗမာစာ"
    },
    na: {
      name: "Nauru",
      nativeName: "Ekakairũ Naoero"
    },
    nb: {
      name: "Norwegian Bokmål",
      nativeName: "Norsk bokmål"
    },
    nd: {
      name: "Northern Ndebele",
      nativeName: "isiNdebele"
    },
    ne: {
      name: "Nepali",
      nativeName: "नेपाली"
    },
    ng: {
      name: "Ndonga",
      nativeName: "Owambo"
    },
    nl: {
      name: "Dutch",
      nativeName: "Nederlands"
    },
    nn: {
      name: "Norwegian Nynorsk",
      nativeName: "Norsk nynorsk"
    },
    no: {
      name: "Norwegian",
      nativeName: "Norsk"
    },
    nr: {
      name: "Southern Ndebele",
      nativeName: "isiNdebele"
    },
    nv: {
      name: "Navajo",
      nativeName: "Diné bizaad"
    },
    ny: {
      name: "Chichewa",
      nativeName: "chiCheŵa"
    },
    oc: {
      name: "Occitan",
      nativeName: "occitan"
    },
    oj: {
      name: "Ojibwe",
      nativeName: "ᐊᓂᔑᓈᐯᒧᐎᓐ"
    },
    om: {
      name: "Oromo",
      nativeName: "Afaan Oromoo"
    },
    or: {
      name: "Oriya",
      nativeName: "ଓଡ଼ିଆ"
    },
    os: {
      name: "Ossetian",
      nativeName: "ирон æвзаг"
    },
    pa: {
      name: "Panjabi",
      nativeName: "ਪੰਜਾਬੀ"
    },
    pi: {
      name: "Pāli",
      nativeName: "पाऴि"
    },
    pl: {
      name: "Polish",
      nativeName: "język polski"
    },
    ps: {
      name: "Pashto",
      nativeName: "پښتو"
    },
    pt: {
      name: "Portuguese",
      nativeName: "Português"
    },
    qu: {
      name: "Quechua",
      nativeName: "Runa Simi"
    },
    rm: {
      name: "Romansh",
      nativeName: "rumantsch grischun"
    },
    rn: {
      name: "Kirundi",
      nativeName: "Ikirundi"
    },
    ro: {
      name: "Romanian",
      nativeName: "limba română"
    },
    ru: {
      name: "Russian",
      nativeName: "Русский"
    },
    rw: {
      name: "Kinyarwanda",
      nativeName: "Ikinyarwanda"
    },
    sa: {
      name: "Sanskrit",
      nativeName: "संस्कृतम्"
    },
    sc: {
      name: "Sardinian",
      nativeName: "sardu"
    },
    sd: {
      name: "Sindhi",
      nativeName: "सिन्धी"
    },
    se: {
      name: "Northern Sami",
      nativeName: "Davvisámegiella"
    },
    sg: {
      name: "Sango",
      nativeName: "yângâ tî sängö"
    },
    si: {
      name: "Sinhala",
      nativeName: "සිංහල"
    },
    sk: {
      name: "Slovak",
      nativeName: "slovenčina"
    },
    sl: {
      name: "Slovene",
      nativeName: "slovenski jezik"
    },
    sm: {
      name: "Samoan",
      nativeName: "gagana fa'a Samoa"
    },
    sn: {
      name: "Shona",
      nativeName: "chiShona"
    },
    so: {
      name: "Somali",
      nativeName: "Soomaaliga"
    },
    sq: {
      name: "Albanian",
      nativeName: "Shqip"
    },
    sr: {
      name: "Serbian",
      nativeName: "српски језик"
    },
    ss: {
      name: "Swati",
      nativeName: "SiSwati"
    },
    st: {
      name: "Southern Sotho",
      nativeName: "Sesotho"
    },
    su: {
      name: "Sundanese",
      nativeName: "Basa Sunda"
    },
    sv: {
      name: "Swedish",
      nativeName: "svenska"
    },
    sw: {
      name: "Swahili",
      nativeName: "Kiswahili"
    },
    ta: {
      name: "Tamil",
      nativeName: "தமிழ்"
    },
    te: {
      name: "Telugu",
      nativeName: "తెలుగు"
    },
    tg: {
      name: "Tajik",
      nativeName: "тоҷикӣ"
    },
    th: {
      name: "Thai",
      nativeName: "ไทย"
    },
    ti: {
      name: "Tigrinya",
      nativeName: "ትግርኛ"
    },
    tk: {
      name: "Turkmen",
      nativeName: "Türkmen"
    },
    tl: {
      name: "Tagalog",
      nativeName: "Wikang Tagalog"
    },
    tn: {
      name: "Tswana",
      nativeName: "Setswana"
    },
    to: {
      name: "Tonga",
      nativeName: "faka Tonga"
    },
    tr: {
      name: "Turkish",
      nativeName: "Türkçe"
    },
    ts: {
      name: "Tsonga",
      nativeName: "Xitsonga"
    },
    tt: {
      name: "Tatar",
      nativeName: "татар теле"
    },
    tw: {
      name: "Twi",
      nativeName: "Twi"
    },
    ty: {
      name: "Tahitian",
      nativeName: "Reo Tahiti"
    },
    ug: {
      name: "Uyghur",
      nativeName: "ئۇيغۇرچە‎"
    },
    uk: {
      name: "Ukrainian",
      nativeName: "Українська"
    },
    ur: {
      name: "Urdu",
      nativeName: "اردو"
    },
    uz: {
      name: "Uzbek",
      nativeName: "Ўзбек"
    },
    ve: {
      name: "Venda",
      nativeName: "Tshivenḓa"
    },
    vi: {
      name: "Vietnamese",
      nativeName: "Tiếng Việt"
    },
    vo: {
      name: "Volapük",
      nativeName: "Volapük"
    },
    wa: {
      name: "Walloon",
      nativeName: "walon"
    },
    wo: {
      name: "Wolof",
      nativeName: "Wollof"
    },
    xh: {
      name: "Xhosa",
      nativeName: "isiXhosa"
    },
    yi: {
      name: "Yiddish",
      nativeName: "ייִדיש"
    },
    yo: {
      name: "Yoruba",
      nativeName: "Yorùbá"
    },
    za: {
      name: "Zhuang",
      nativeName: "Saɯ cueŋƅ"
    },
    zh: {
      name: "Chinese",
      nativeName: "中文"
    },
    zu: {
      name: "Zulu",
      nativeName: "isiZulu"
    }
  };

  class ISO6391 {
    static getLanguages(codes = []) {
      return codes.map(code => ({
        code,
        name: ISO6391.getName(code),
        nativeName: ISO6391.getNativeName(code)
      }));
    }

    static getName(code) {
      return ISO6391.validate(code) ? LANGUAGES_LIST[code].name : "";
    }

    static getAllNames() {
      return Object.values(LANGUAGES_LIST).map(l => l.name);
    }

    static getNativeName(code) {
      return ISO6391.validate(code) ? LANGUAGES_LIST[code].nativeName : "";
    }

    static getAllNativeNames() {
      return Object.values(LANGUAGES_LIST).map(l => l.nativeName);
    }

    static getCode(name) {
      const code = Object.keys(LANGUAGES_LIST).find(code => {
        const language = LANGUAGES_LIST[code];
        return (
          language.name.toLowerCase() === name.toLowerCase() ||
          language.nativeName.toLowerCase() === name.toLowerCase()
        );
      });
      return code || "";
    }

    static getAllCodes() {
      return Object.keys(LANGUAGES_LIST);
    }

    static validate(code) {
      return LANGUAGES_LIST[code] !== undefined;
    }
  }

  var defaultLang = "en";
  var langRegExp = /\[\[([a-z]{2})\]\]([^\[]+)/g;
  var isStorageEnabled = !(typeof localStorage == "undefined");
  var textDict = [];
  var userLang = (
    navigator.userLanguage ||
    navigator.browserLanguage ||
    navigator.language ||
    defaultLang
  ).substr(0, 2);
  var documentLang;

  function getLangParam() {
    var arr = /lang=([a-z]{2})/g.exec(location.search);
    return arr ? arr[1] : null;
  }

  function getLangFromStorage() {
    return isStorageEnabled ? localStorage.getItem("lang") : undefined;
  }

  function setLang(lang) {
    userLang = lang;

    if (isStorageEnabled) {
      localStorage.setItem("lang", userLang);
    }

    console.log("[wm] setLang:", lang, userLang);
    applyLang();
  }

  function applyLang() {
    textDict.forEach(function(o) {
      o.el.textContent = o.dict[userLang];
    });
    ISO6391.getAllCodes().forEach(function(lang) {
      lang === userLang
        ? document.querySelectorAll(".wm-".concat(lang)).forEach(function(el) {
            return (el.style.display = el.dataset.wmDisplay);
          })
        : document.querySelectorAll(".wm-".concat(lang)).forEach(function(el) {
            return (el.style.display = "none");
          });
    });
  }

  function textNodesUnder(el) {
    var node;
    var nodes = [];
    var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);

    while ((node = walk.nextNode())) {
      nodes.push(node);
    }

    return nodes;
  } // https://medium.com/@roxeteer/javascript-one-liner-to-get-elements-text-content-without-its-child-nodes-8e59269d1e71

  function parentElTextOnly(el) {
    return Array.from(el.childNodes).reduce(function(acc, node) {
      return acc + (node.nodeType === 3 ? node.textContent : "");
    }, "");
  }

  window.addEventListener("DOMContentLoaded", function() {
    var langs = new Set();
    userLang = getLangParam() || getLangFromStorage() || userLang;

    if (isStorageEnabled) {
      localStorage.setItem("lang", userLang);
    }

    ISO6391.getAllCodes().forEach(function(lang) {
      document.querySelectorAll(".wm-".concat(lang)).forEach(function(el) {
        return (el.dataset.wmDisplay = el.style.display);
      });
    });
    textNodesUnder(document)
      .filter(function(node) {
        return langRegExp.test(parentElTextOnly(node.parentElement));
      })
      .forEach(function(node, i) {
        var dict = {};
        var arr;

        while (
          (arr = langRegExp.exec(parentElTextOnly(node.parentElement))) != null
        ) {
          dict[arr[1]] = arr[2];
          langs.add(arr[1]);
        }

        textDict.push({
          el: node.parentElement,
          dict: dict
        });
      });
    console.log("[wm] documentLang:", documentLang);
    documentLang = DocumentLang(langs, userLang);
    applyLang();
  }); /////////////////////////

  window.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("[data-wm-sel]").forEach(function(el) {
      el.addEventListener("click", function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        console.log("[wm] click:", el.dataset.wmSel);
        setLang(el.dataset.wmSel);
      });
    });
  }); ///////////////////////////

  function DocumentLang(langsSet, userLang) {
    var langs = Array.from(langsSet);
    var cur = langs.indexOf(userLang);

    var next = function next() {
      if (cur < langs.length) {
        return langs[cur++];
      } else {
        cur = 0;
        return langs[0];
      }
    };

    var nextVal = function nextVal() {
      if (cur + 1 < langs.length) {
        return langs[cur + 1];
      } else {
        return langs[0];
      }
    };

    var curVal = function curVal() {
      return langs[cur];
    };

    return {
      next: next,
      nextVal: nextVal,
      curVal: curVal
    };
  }

  window.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("[data-wm-switch]").forEach(function(el) {
      if (documentLang.curVal() === userLang) {
        el.textContent = ISO6391.getName(documentLang.nextVal());
      } else {
        el.textContent = ISO6391.getName(documentLang.curVal());
      }

      el.addEventListener("click", function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var nextLang = documentLang.next();

        if (nextLang === userLang) {
          nextLang = documentLang.next();
        }

        setLang(nextLang);
        el.textContent = ISO6391.getName(documentLang.nextVal());
        console.log("[wm] switch:", nextLang);
      });
    });
  });
});
