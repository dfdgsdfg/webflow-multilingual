(function(factory) {
  typeof define === "function" && define.amd ? define(factory) : factory();
})(function() {
  "use strict";

  var aFunction = function(it) {
    if (typeof it != "function") {
      throw TypeError(String(it) + " is not a function");
    }
    return it;
  };

  // optional / simple context binding
  var bindContext = function(fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0:
        return function() {
          return fn.call(that);
        };
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
    return function(/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var fails = function(exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var toString = {}.toString;

  var classofRaw = function(it) {
    return toString.call(it).slice(8, -1);
  };

  // fallback for non-array-like ES3 and non-enumerable old V8 strings

  var split = "".split;

  var indexedObject = fails(function() {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object("z").propertyIsEnumerable(0);
  })
    ? function(it) {
        return classofRaw(it) == "String" ? split.call(it, "") : Object(it);
      }
    : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function(it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // `ToObject` abstract operation
  // https://tc39.github.io/ecma262/#sec-toobject
  var toObject = function(argument) {
    return Object(requireObjectCoercible(argument));
  };

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger
  var toInteger = function(argument) {
    return isNaN((argument = +argument))
      ? 0
      : (argument > 0 ? floor : ceil)(argument);
  };

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength
  var toLength = function(argument) {
    return argument > 0 ? min(toInteger(argument), 0x1fffffffffffff) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var isObject = function(it) {
    return typeof it === "object" ? it !== null : typeof it === "function";
  };

  // `IsArray` abstract operation
  // https://tc39.github.io/ecma262/#sec-isarray
  var isArray =
    Array.isArray ||
    function isArray(arg) {
      return classofRaw(arg) == "Array";
    };

  function createCommonjsModule(fn, module) {
    return (
      (module = { exports: {} }), fn(module, module.exports), module.exports
    );
  }

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global =
    typeof window == "object" && window && window.Math == Math
      ? window
      : typeof self == "object" && self && self.Math == Math
      ? self
      : // eslint-disable-next-line no-new-func
        Function("return this")();

  // Thank's IE8 for his funny defineProperty
  var descriptors = !fails(function() {
    return (
      Object.defineProperty({}, "a", {
        get: function() {
          return 7;
        }
      }).a != 7
    );
  });

  var document$1 = global.document;
  // typeof document.createElement is 'object' in old IE
  var exist = isObject(document$1) && isObject(document$1.createElement);

  var documentCreateElement = function(it) {
    return exist ? document$1.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine =
    !descriptors &&
    !fails(function() {
      return (
        Object.defineProperty(documentCreateElement("div"), "a", {
          get: function() {
            return 7;
          }
        }).a != 7
      );
    });

  var anObject = function(it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + " is not an object");
    }
    return it;
  };

  // 7.1.1 ToPrimitive(input [, PreferredType])

  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive = function(it, S) {
    if (!isObject(it)) return it;
    var fn, val;
    if (
      S &&
      typeof (fn = it.toString) == "function" &&
      !isObject((val = fn.call(it)))
    )
      return val;
    if (
      typeof (fn = it.valueOf) == "function" &&
      !isObject((val = fn.call(it)))
    )
      return val;
    if (
      !S &&
      typeof (fn = it.toString) == "function" &&
      !isObject((val = fn.call(it)))
    )
      return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var nativeDefineProperty = Object.defineProperty;

  var f = descriptors
    ? nativeDefineProperty
    : function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPrimitive(P, true);
        anObject(Attributes);
        if (ie8DomDefine)
          try {
            return nativeDefineProperty(O, P, Attributes);
          } catch (error) {
            /* empty */
          }
        if ("get" in Attributes || "set" in Attributes)
          throw TypeError("Accessors not supported");
        if ("value" in Attributes) O[P] = Attributes.value;
        return O;
      };

  var objectDefineProperty = {
    f: f
  };

  var createPropertyDescriptor = function(bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var hide = descriptors
    ? function(object, key, value) {
        return objectDefineProperty.f(
          object,
          key,
          createPropertyDescriptor(1, value)
        );
      }
    : function(object, key, value) {
        object[key] = value;
        return object;
      };

  var setGlobal = function(key, value) {
    try {
      hide(global, key, value);
    } catch (error) {
      global[key] = value;
    }
    return value;
  };

  var shared = createCommonjsModule(function(module) {
    var SHARED = "__core-js_shared__";
    var store = global[SHARED] || setGlobal(SHARED, {});

    (module.exports = function(key, value) {
      return store[key] || (store[key] = value !== undefined ? value : {});
    })("versions", []).push({
      version: "3.0.1",
      mode: "global",
      copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
    });
  });

  var id = 0;
  var postfix = Math.random();

  var uid = function(key) {
    return "Symbol(".concat(
      key === undefined ? "" : key,
      ")_",
      (++id + postfix).toString(36)
    );
  };

  // Chrome 38 Symbol has incorrect toString conversion
  var nativeSymbol = !fails(function() {
    // eslint-disable-next-line no-undef
    return !String(Symbol());
  });

  var store = shared("wks");

  var Symbol$1 = global.Symbol;

  var wellKnownSymbol = function(name) {
    return (
      store[name] ||
      (store[name] =
        (nativeSymbol && Symbol$1[name]) ||
        (nativeSymbol ? Symbol$1 : uid)("Symbol." + name))
    );
  };

  var SPECIES = wellKnownSymbol("species");

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.github.io/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate = function(originalArray, length) {
    var C;
    if (isArray(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (typeof C == "function" && (C === Array || isArray(C.prototype)))
        C = undefined;
      else if (isObject(C)) {
        C = C[SPECIES];
        if (C === null) C = undefined;
      }
    }
    return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
  };

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
  // 0 -> Array#forEach
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  // 1 -> Array#map
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  // 2 -> Array#filter
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  // 3 -> Array#some
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  // 4 -> Array#every
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  // 5 -> Array#find
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  // 6 -> Array#findIndex
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  var arrayMethods = function(TYPE, specificCreate) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    var create = specificCreate || arraySpeciesCreate;
    return function($this, callbackfn, that) {
      var O = toObject($this);
      var self = indexedObject(O);
      var boundFunction = bindContext(callbackfn, that, 3);
      var length = toLength(self.length);
      var index = 0;
      var target = IS_MAP
        ? create($this, length)
        : IS_FILTER
        ? create($this, 0)
        : undefined;
      var value, result;
      for (; length > index; index++)
        if (NO_HOLES || index in self) {
          value = self[index];
          result = boundFunction(value, index, O);
          if (TYPE) {
            if (IS_MAP) target[index] = result;
            // map
            else if (result)
              switch (TYPE) {
                case 3:
                  return true; // some
                case 5:
                  return value; // find
                case 6:
                  return index; // findIndex
                case 2:
                  target.push(value); // filter
              }
            else if (IS_EVERY) return false; // every
          }
        }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var SPECIES$1 = wellKnownSymbol("species");

  var arrayMethodHasSpeciesSupport = function(METHOD_NAME) {
    return !fails(function() {
      var array = [];
      var constructor = (array.constructor = {});
      constructor[SPECIES$1] = function() {
        return { foo: 1 };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG =
    nativeGetOwnPropertyDescriptor &&
    !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

  var f$1 = NASHORN_BUG
    ? function propertyIsEnumerable(V) {
        var descriptor = nativeGetOwnPropertyDescriptor(this, V);
        return !!descriptor && descriptor.enumerable;
      }
    : nativePropertyIsEnumerable;

  var objectPropertyIsEnumerable = {
    f: f$1
  };

  // toObject with fallback for non-array-like ES3 strings

  var toIndexedObject = function(it) {
    return indexedObject(requireObjectCoercible(it));
  };

  var hasOwnProperty = {}.hasOwnProperty;

  var has = function(it, key) {
    return hasOwnProperty.call(it, key);
  };

  var nativeGetOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  var f$2 = descriptors
    ? nativeGetOwnPropertyDescriptor$1
    : function getOwnPropertyDescriptor(O, P) {
        O = toIndexedObject(O);
        P = toPrimitive(P, true);
        if (ie8DomDefine)
          try {
            return nativeGetOwnPropertyDescriptor$1(O, P);
          } catch (error) {
            /* empty */
          }
        if (has(O, P))
          return createPropertyDescriptor(
            !objectPropertyIsEnumerable.f.call(O, P),
            O[P]
          );
      };

  var objectGetOwnPropertyDescriptor = {
    f: f$2
  };

  var functionToString = shared("native-function-to-string", Function.toString);

  var WeakMap = global.WeakMap;

  var nativeWeakMap =
    typeof WeakMap === "function" &&
    /native code/.test(functionToString.call(WeakMap));

  var shared$1 = shared("keys");

  var sharedKey = function(key) {
    return shared$1[key] || (shared$1[key] = uid(key));
  };

  var hiddenKeys = {};

  var WeakMap$1 = global.WeakMap;
  var set, get, has$1;

  var enforce = function(it) {
    return has$1(it) ? get(it) : set(it, {});
  };

  var getterFor = function(TYPE) {
    return function(it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError("Incompatible receiver, " + TYPE + " required");
      }
      return state;
    };
  };

  if (nativeWeakMap) {
    var store$1 = new WeakMap$1();
    var wmget = store$1.get;
    var wmhas = store$1.has;
    var wmset = store$1.set;
    set = function(it, metadata) {
      wmset.call(store$1, it, metadata);
      return metadata;
    };
    get = function(it) {
      return wmget.call(store$1, it) || {};
    };
    has$1 = function(it) {
      return wmhas.call(store$1, it);
    };
  } else {
    var STATE = sharedKey("state");
    hiddenKeys[STATE] = true;
    set = function(it, metadata) {
      hide(it, STATE, metadata);
      return metadata;
    };
    get = function(it) {
      return has(it, STATE) ? it[STATE] : {};
    };
    has$1 = function(it) {
      return has(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has$1,
    enforce: enforce,
    getterFor: getterFor
  };

  var redefine = createCommonjsModule(function(module) {
    var getInternalState = internalState.get;
    var enforceInternalState = internalState.enforce;
    var TEMPLATE = String(functionToString).split("toString");

    shared("inspectSource", function(it) {
      return functionToString.call(it);
    });

    (module.exports = function(O, key, value, options) {
      var unsafe = options ? !!options.unsafe : false;
      var simple = options ? !!options.enumerable : false;
      var noTargetGet = options ? !!options.noTargetGet : false;
      if (typeof value == "function") {
        if (typeof key == "string" && !has(value, "name"))
          hide(value, "name", key);
        enforceInternalState(value).source = TEMPLATE.join(
          typeof key == "string" ? key : ""
        );
      }
      if (O === global) {
        if (simple) O[key] = value;
        else setGlobal(key, value);
        return;
      } else if (!unsafe) {
        delete O[key];
      } else if (!noTargetGet && O[key]) {
        simple = true;
      }
      if (simple) O[key] = value;
      else hide(O, key, value);
      // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, "toString", function toString() {
      return (
        (typeof this == "function" && getInternalState(this).source) ||
        functionToString.call(this)
      );
    });
  });

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
  var toAbsoluteIndex = function(index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  // false -> Array#indexOf
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  // true  -> Array#includes
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  var arrayIncludes = function(IS_INCLUDES) {
    return function($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el)
        while (length > index) {
          value = O[index++];
          // eslint-disable-next-line no-self-compare
          if (value != value) return true;
          // Array#indexOf ignores holes, Array#includes - not
        }
      else
        for (; length > index; index++)
          if (IS_INCLUDES || index in O) {
            if (O[index] === el) return IS_INCLUDES || index || 0;
          }
      return !IS_INCLUDES && -1;
    };
  };

  var arrayIndexOf = arrayIncludes(false);

  var objectKeysInternal = function(object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i)
      if (has(O, (key = names[i++]))) {
        ~arrayIndexOf(result, key) || result.push(key);
      }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys = [
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toLocaleString",
    "toString",
    "valueOf"
  ];

  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

  var hiddenKeys$1 = enumBugKeys.concat("length", "prototype");

  var f$3 =
    Object.getOwnPropertyNames ||
    function getOwnPropertyNames(O) {
      return objectKeysInternal(O, hiddenKeys$1);
    };

  var objectGetOwnPropertyNames = {
    f: f$3
  };

  var f$4 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
    f: f$4
  };

  var Reflect = global.Reflect;

  // all object keys, includes non-enumerable and symbols
  var ownKeys =
    (Reflect && Reflect.ownKeys) ||
    function ownKeys(it) {
      var keys = objectGetOwnPropertyNames.f(anObject(it));
      var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
      return getOwnPropertySymbols
        ? keys.concat(getOwnPropertySymbols(it))
        : keys;
    };

  var copyConstructorProperties = function(target, source) {
    var keys = ownKeys(source);
    var defineProperty = objectDefineProperty.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has(target, key))
        defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement = /#|\.prototype\./;

  var isForced = function(feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL
      ? true
      : value == NATIVE
      ? false
      : typeof detection == "function"
      ? fails(detection)
      : !!detection;
  };

  var normalize = (isForced.normalize = function(string) {
    return String(string)
      .replace(replacement, ".")
      .toLowerCase();
  });

  var data = (isForced.data = {});
  var NATIVE = (isForced.NATIVE = "N");
  var POLYFILL = (isForced.POLYFILL = "P");

  var isForced_1 = isForced;

  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */
  var _export = function(options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global;
    } else if (STATIC) {
      target = global[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global[TARGET] || {}).prototype;
    }
    if (target)
      for (key in source) {
        sourceProperty = source[key];
        if (options.noTargetGet) {
          descriptor = getOwnPropertyDescriptor(target, key);
          targetProperty = descriptor && descriptor.value;
        } else targetProperty = target[key];
        FORCED = isForced_1(
          GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key,
          options.forced
        );
        // contained in target
        if (!FORCED && targetProperty !== undefined) {
          if (typeof sourceProperty === typeof targetProperty) continue;
          copyConstructorProperties(sourceProperty, targetProperty);
        }
        // add a flag to not completely full polyfills
        if (options.sham || (targetProperty && targetProperty.sham)) {
          hide(sourceProperty, "sham", true);
        }
        // extend global
        redefine(target, key, sourceProperty, options);
      }
  };

  var internalFilter = arrayMethods(2);

  var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("filter");

  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  _export(
    { target: "Array", proto: true, forced: !SPECIES_SUPPORT },
    {
      filter: function filter(callbackfn /* , thisArg */) {
        return internalFilter(this, callbackfn, arguments[1]);
      }
    }
  );

  var ITERATOR = wellKnownSymbol("iterator");
  var SAFE_CLOSING = false;

  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function() {
        return { done: !!called++ };
      },
      return: function() {
        SAFE_CLOSING = true;
      }
    };
    iteratorWithReturn[ITERATOR] = function() {
      return this;
    };
  } catch (error) {
    /* empty */
  }

  var checkCorrectnessOfIteration = function(exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR] = function() {
        return {
          next: function() {
            return { done: (ITERATION_SUPPORT = true) };
          }
        };
      };
      exec(object);
    } catch (error) {
      /* empty */
    }
    return ITERATION_SUPPORT;
  };

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing = function(iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
      // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      var returnMethod = iterator["return"];
      if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
      throw error;
    }
  };

  var iterators = {};

  // check on default Array iterator

  var ITERATOR$1 = wellKnownSymbol("iterator");
  var ArrayPrototype = Array.prototype;

  var isArrayIteratorMethod = function(it) {
    return (
      it !== undefined &&
      (iterators.Array === it || ArrayPrototype[ITERATOR$1] === it)
    );
  };

  var createProperty = function(object, key, value) {
    var propertyKey = toPrimitive(key);
    if (propertyKey in object)
      objectDefineProperty.f(
        object,
        propertyKey,
        createPropertyDescriptor(0, value)
      );
    else object[propertyKey] = value;
  };

  var TO_STRING_TAG = wellKnownSymbol("toStringTag");
  // ES3 wrong here
  var CORRECT_ARGUMENTS =
    classofRaw(
      (function() {
        return arguments;
      })()
    ) == "Arguments";

  // fallback for IE11 Script Access Denied error
  var tryGet = function(it, key) {
    try {
      return it[key];
    } catch (error) {
      /* empty */
    }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof = function(it) {
    var O, tag, result;
    return it === undefined
      ? "Undefined"
      : it === null
      ? "Null"
      : // @@toStringTag case
      typeof (tag = tryGet((O = Object(it)), TO_STRING_TAG)) == "string"
      ? tag
      : // builtinTag case
      CORRECT_ARGUMENTS
      ? classofRaw(O)
      : // ES3 arguments fallback
      (result = classofRaw(O)) == "Object" && typeof O.callee == "function"
      ? "Arguments"
      : result;
  };

  var ITERATOR$2 = wellKnownSymbol("iterator");

  var getIteratorMethod = function(it) {
    if (it != undefined)
      return it[ITERATOR$2] || it["@@iterator"] || iterators[classof(it)];
  };

  // `Array.from` method
  // https://tc39.github.io/ecma262/#sec-array.from
  var arrayFrom = function from(
    arrayLike /* , mapfn = undefined, thisArg = undefined */
  ) {
    var O = toObject(arrayLike);
    var C = typeof this == "function" ? this : Array;
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iteratorMethod = getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping)
      mapfn = bindContext(
        mapfn,
        argumentsLength > 2 ? arguments[2] : undefined,
        2
      );
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (
      iteratorMethod != undefined &&
      !(C == Array && isArrayIteratorMethod(iteratorMethod))
    ) {
      iterator = iteratorMethod.call(O);
      result = new C();
      for (; !(step = iterator.next()).done; index++) {
        createProperty(
          result,
          index,
          mapping
            ? callWithSafeIterationClosing(
                iterator,
                mapfn,
                [step.value, index],
                true
              )
            : step.value
        );
      }
    } else {
      length = toLength(O.length);
      result = new C(length);
      for (; length > index; index++) {
        createProperty(
          result,
          index,
          mapping ? mapfn(O[index], index) : O[index]
        );
      }
    }
    result.length = index;
    return result;
  };

  var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function(iterable) {});

  // `Array.from` method
  // https://tc39.github.io/ecma262/#sec-array.from
  _export(
    { target: "Array", stat: true, forced: INCORRECT_ITERATION },
    {
      from: arrayFrom
    }
  );

  var sloppyArrayMethod = function(METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return (
      !method ||
      !fails(function() {
        // eslint-disable-next-line no-useless-call,no-throw-literal
        method.call(
          null,
          argument ||
            function() {
              throw 1;
            },
          1
        );
      })
    );
  };

  var internalIndexOf = arrayIncludes(false);
  var nativeIndexOf = [].indexOf;

  var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
  var SLOPPY_METHOD = sloppyArrayMethod("indexOf");

  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  _export(
    { target: "Array", proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD },
    {
      indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
        return NEGATIVE_ZERO
          ? // convert -0 to +0
            nativeIndexOf.apply(this, arguments) || 0
          : internalIndexOf(this, searchElement, arguments[1]);
      }
    }
  );

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)

  var objectKeys =
    Object.keys ||
    function keys(O) {
      return objectKeysInternal(O, enumBugKeys);
    };

  var objectDefineProperties = descriptors
    ? Object.defineProperties
    : function defineProperties(O, Properties) {
        anObject(O);
        var keys = objectKeys(Properties);
        var length = keys.length;
        var i = 0;
        var key;
        while (length > i)
          objectDefineProperty.f(O, (key = keys[i++]), Properties[key]);
        return O;
      };

  var document$2 = global.document;

  var html = document$2 && document$2.documentElement;

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])

  var IE_PROTO = sharedKey("IE_PROTO");
  var PROTOTYPE = "prototype";
  var Empty = function() {
    /* empty */
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function() {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement("iframe");
    var length = enumBugKeys.length;
    var lt = "<";
    var script = "script";
    var gt = ">";
    var js = "java" + script + ":";
    var iframeDocument;
    iframe.style.display = "none";
    html.appendChild(iframe);
    iframe.src = String(js);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(
      lt + script + gt + "document.F=Object" + lt + "/" + script + gt
    );
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
    return createDict();
  };

  var objectCreate =
    Object.create ||
    function create(O, Properties) {
      var result;
      if (O !== null) {
        Empty[PROTOTYPE] = anObject(O);
        result = new Empty();
        Empty[PROTOTYPE] = null;
        // add "__proto__" for Object.getPrototypeOf polyfill
        result[IE_PROTO] = O;
      } else result = createDict();
      return Properties === undefined
        ? result
        : objectDefineProperties(result, Properties);
    };

  hiddenKeys[IE_PROTO] = true;

  var UNSCOPABLES = wellKnownSymbol("unscopables");

  var ArrayPrototype$1 = Array.prototype;

  // Array.prototype[@@unscopables]
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
    hide(ArrayPrototype$1, UNSCOPABLES, objectCreate(null));
  }

  // add a key to Array.prototype[@@unscopables]
  var addToUnscopables = function(key) {
    ArrayPrototype$1[UNSCOPABLES][key] = true;
  };

  var correctPrototypeGetter = !fails(function() {
    function F() {
      /* empty */
    }
    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)

  var IE_PROTO$1 = sharedKey("IE_PROTO");

  var ObjectPrototype = Object.prototype;

  var objectGetPrototypeOf = correctPrototypeGetter
    ? Object.getPrototypeOf
    : function(O) {
        O = toObject(O);
        if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
        if (typeof O.constructor == "function" && O instanceof O.constructor) {
          return O.constructor.prototype;
        }
        return O instanceof Object ? ObjectPrototype : null;
      };

  var ITERATOR$3 = wellKnownSymbol("iterator");
  var BUGGY_SAFARI_ITERATORS = false;

  var returnThis = function() {
    return this;
  };

  // `%IteratorPrototype%` object
  // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!("next" in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(
        objectGetPrototypeOf(arrayIterator)
      );
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
        IteratorPrototype = PrototypeOfArrayIteratorPrototype;
    }
  }

  if (IteratorPrototype == undefined) IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  if (!has(IteratorPrototype, ITERATOR$3))
    hide(IteratorPrototype, ITERATOR$3, returnThis);

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  };

  var defineProperty = objectDefineProperty.f;

  var TO_STRING_TAG$1 = wellKnownSymbol("toStringTag");

  var setToStringTag = function(it, TAG, STATIC) {
    if (it && !has((it = STATIC ? it : it.prototype), TO_STRING_TAG$1)) {
      defineProperty(it, TO_STRING_TAG$1, { configurable: true, value: TAG });
    }
  };

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

  var returnThis$1 = function() {
    return this;
  };

  var createIteratorConstructor = function(IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + " Iterator";
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, {
      next: createPropertyDescriptor(1, next)
    });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
    iterators[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var validateSetPrototypeOfArguments = function(O, proto) {
    anObject(O);
    if (!isObject(proto) && proto !== null) {
      throw TypeError("Can't set " + String(proto) + " as a prototype");
    }
  };

  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */

  var objectSetPrototypeOf =
    Object.setPrototypeOf ||
    ("__proto__" in {}
      ? (function() {
          var correctSetter = false;
          var test = {};
          var setter;
          try {
            setter = Object.getOwnPropertyDescriptor(
              Object.prototype,
              "__proto__"
            ).set;
            setter.call(test, []);
            correctSetter = test instanceof Array;
          } catch (error) {
            /* empty */
          }
          return function setPrototypeOf(O, proto) {
            validateSetPrototypeOfArguments(O, proto);
            if (correctSetter) setter.call(O, proto);
            else O.__proto__ = proto;
            return O;
          };
        })()
      : undefined);

  var ITERATOR$4 = wellKnownSymbol("iterator");

  var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
  var KEYS = "keys";
  var VALUES = "values";
  var ENTRIES = "entries";

  var returnThis$2 = function() {
    return this;
  };

  var defineIterator = function(
    Iterable,
    NAME,
    IteratorConstructor,
    next,
    DEFAULT,
    IS_SET,
    FORCED
  ) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function(KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype)
        return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS:
          return function keys() {
            return new IteratorConstructor(this, KIND);
          };
        case VALUES:
          return function values() {
            return new IteratorConstructor(this, KIND);
          };
        case ENTRIES:
          return function entries() {
            return new IteratorConstructor(this, KIND);
          };
      }
      return function() {
        return new IteratorConstructor(this);
      };
    };

    var TO_STRING_TAG = NAME + " Iterator";
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator =
      IterablePrototype[ITERATOR$4] ||
      IterablePrototype["@@iterator"] ||
      (DEFAULT && IterablePrototype[DEFAULT]);
    var defaultIterator =
      (!BUGGY_SAFARI_ITERATORS$1 && nativeIterator) ||
      getIterationMethod(DEFAULT);
    var anyNativeIterator =
      NAME == "Array"
        ? IterablePrototype.entries || nativeIterator
        : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf(
        anyNativeIterator.call(new Iterable())
      );
      if (
        IteratorPrototype$2 !== Object.prototype &&
        CurrentIteratorPrototype.next
      ) {
        if (
          objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2
        ) {
          if (objectSetPrototypeOf) {
            objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
          } else if (
            typeof CurrentIteratorPrototype[ITERATOR$4] != "function"
          ) {
            hide(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() {
        return nativeIterator.call(this);
      };
    }

    // define iterator
    if (IterablePrototype[ITERATOR$4] !== defaultIterator) {
      hide(IterablePrototype, ITERATOR$4, defaultIterator);
    }
    iterators[NAME] = defaultIterator;

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED)
        for (KEY in methods) {
          if (
            BUGGY_SAFARI_ITERATORS$1 ||
            INCORRECT_VALUES_NAME ||
            !(KEY in IterablePrototype)
          ) {
            redefine(IterablePrototype, KEY, methods[KEY]);
          }
        }
      else
        _export(
          {
            target: NAME,
            proto: true,
            forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME
          },
          methods
        );
    }

    return methods;
  };

  var ARRAY_ITERATOR = "Array Iterator";
  var setInternalState = internalState.set;
  var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.github.io/ecma262/#sec-createarrayiterator
  var es_array_iterator = defineIterator(
    Array,
    "Array",
    function(iterated, kind) {
      setInternalState(this, {
        type: ARRAY_ITERATOR,
        target: toIndexedObject(iterated), // target
        index: 0, // next index
        kind: kind // kind
      });
      // `%ArrayIteratorPrototype%.next` method
      // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
    },
    function() {
      var state = getInternalState(this);
      var target = state.target;
      var kind = state.kind;
      var index = state.index++;
      if (!target || index >= target.length) {
        state.target = undefined;
        return { value: undefined, done: true };
      }
      if (kind == "keys") return { value: index, done: false };
      if (kind == "values") return { value: target[index], done: false };
      return { value: [index, target[index]], done: false };
    },
    "values"
  );

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
  iterators.Arguments = iterators.Array;

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables("keys");
  addToUnscopables("values");
  addToUnscopables("entries");

  var TO_STRING_TAG$2 = wellKnownSymbol("toStringTag");
  var test = {};

  test[TO_STRING_TAG$2] = "z";

  // `Object.prototype.toString` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
  var objectToString =
    String(test) !== "[object z]"
      ? function toString() {
          return "[object " + classof(this) + "]";
        }
      : test.toString;

  var ObjectPrototype$1 = Object.prototype;

  // `Object.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
  if (objectToString !== ObjectPrototype$1.toString) {
    redefine(ObjectPrototype$1, "toString", objectToString, { unsafe: true });
  }

  var freezing = !fails(function() {
    return Object.isExtensible(Object.preventExtensions({}));
  });

  var internalMetadata = createCommonjsModule(function(module) {
    var METADATA = uid("meta");

    var defineProperty = objectDefineProperty.f;
    var id = 0;

    var isExtensible =
      Object.isExtensible ||
      function() {
        return true;
      };

    var setMetadata = function(it) {
      defineProperty(it, METADATA, {
        value: {
          objectID: "O" + ++id, // object ID
          weakData: {} // weak collections IDs
        }
      });
    };

    var fastKey = function(it, create) {
      // return a primitive with prefix
      if (!isObject(it))
        return typeof it == "symbol"
          ? it
          : (typeof it == "string" ? "S" : "P") + it;
      if (!has(it, METADATA)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return "F";
        // not necessary to add metadata
        if (!create) return "E";
        // add missing metadata
        setMetadata(it);
        // return object ID
      }
      return it[METADATA].objectID;
    };

    var getWeakData = function(it, create) {
      if (!has(it, METADATA)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return true;
        // not necessary to add metadata
        if (!create) return false;
        // add missing metadata
        setMetadata(it);
        // return the store of weak collections IDs
      }
      return it[METADATA].weakData;
    };

    // add metadata on freeze-family methods calling
    var onFreeze = function(it) {
      if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA))
        setMetadata(it);
      return it;
    };

    var meta = (module.exports = {
      REQUIRED: false,
      fastKey: fastKey,
      getWeakData: getWeakData,
      onFreeze: onFreeze
    });

    hiddenKeys[METADATA] = true;
  });
  var internalMetadata_1 = internalMetadata.REQUIRED;
  var internalMetadata_2 = internalMetadata.fastKey;
  var internalMetadata_3 = internalMetadata.getWeakData;
  var internalMetadata_4 = internalMetadata.onFreeze;

  var iterate = createCommonjsModule(function(module) {
    var BREAK = {};

    var exports = (module.exports = function(
      iterable,
      fn,
      that,
      ENTRIES,
      ITERATOR
    ) {
      var boundFunction = bindContext(fn, that, ENTRIES ? 2 : 1);
      var iterator, iterFn, index, length, result, step;

      if (ITERATOR) {
        iterator = iterable;
      } else {
        iterFn = getIteratorMethod(iterable);
        if (typeof iterFn != "function")
          throw TypeError("Target is not iterable");
        // optimisation for array iterators
        if (isArrayIteratorMethod(iterFn)) {
          for (
            index = 0, length = toLength(iterable.length);
            length > index;
            index++
          ) {
            result = ENTRIES
              ? boundFunction(anObject((step = iterable[index]))[0], step[1])
              : boundFunction(iterable[index]);
            if (result === BREAK) return BREAK;
          }
          return;
        }
        iterator = iterFn.call(iterable);
      }

      while (!(step = iterator.next()).done) {
        if (
          callWithSafeIterationClosing(
            iterator,
            boundFunction,
            step.value,
            ENTRIES
          ) === BREAK
        )
          return BREAK;
      }
    });

    exports.BREAK = BREAK;
  });

  var anInstance = function(it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError("Incorrect " + (name ? name + " " : "") + "invocation");
    }
    return it;
  };

  var inheritIfRequired = function(that, target, C) {
    var S = target.constructor;
    var P;
    if (
      S !== C &&
      typeof S == "function" &&
      (P = S.prototype) !== C.prototype &&
      isObject(P) &&
      objectSetPrototypeOf
    ) {
      objectSetPrototypeOf(that, P);
    }
    return that;
  };

  var collection = function(
    CONSTRUCTOR_NAME,
    wrapper,
    common,
    IS_MAP,
    IS_WEAK
  ) {
    var NativeConstructor = global[CONSTRUCTOR_NAME];
    var NativePrototype = NativeConstructor && NativeConstructor.prototype;
    var Constructor = NativeConstructor;
    var ADDER = IS_MAP ? "set" : "add";
    var exported = {};

    var fixMethod = function(KEY) {
      var nativeMethod = NativePrototype[KEY];
      redefine(
        NativePrototype,
        KEY,
        KEY == "add"
          ? function add(a) {
              nativeMethod.call(this, a === 0 ? 0 : a);
              return this;
            }
          : KEY == "delete"
          ? function(a) {
              return IS_WEAK && !isObject(a)
                ? false
                : nativeMethod.call(this, a === 0 ? 0 : a);
            }
          : KEY == "get"
          ? function get(a) {
              return IS_WEAK && !isObject(a)
                ? undefined
                : nativeMethod.call(this, a === 0 ? 0 : a);
            }
          : KEY == "has"
          ? function has(a) {
              return IS_WEAK && !isObject(a)
                ? false
                : nativeMethod.call(this, a === 0 ? 0 : a);
            }
          : function set(a, b) {
              nativeMethod.call(this, a === 0 ? 0 : a, b);
              return this;
            }
      );
    };

    // eslint-disable-next-line max-len
    if (
      isForced_1(
        CONSTRUCTOR_NAME,
        typeof NativeConstructor != "function" ||
          !(
            IS_WEAK ||
            (NativePrototype.forEach &&
              !fails(function() {
                new NativeConstructor().entries().next();
              }))
          )
      )
    ) {
      // create collection constructor
      Constructor = common.getConstructor(
        wrapper,
        CONSTRUCTOR_NAME,
        IS_MAP,
        ADDER
      );
      internalMetadata.REQUIRED = true;
    } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
      var instance = new Constructor();
      // early implementations not supports chaining
      var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      var THROWS_ON_PRIMITIVES = fails(function() {
        instance.has(1);
      });
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      // eslint-disable-next-line no-new
      var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function(iterable) {
        new NativeConstructor(iterable);
      });
      // for early implementations -0 and +0 not the same
      var BUGGY_ZERO =
        !IS_WEAK &&
        fails(function() {
          // V8 ~ Chromium 42- fails only with 5+ elements
          var $instance = new NativeConstructor();
          var index = 5;
          while (index--) $instance[ADDER](index, index);
          return !$instance.has(-0);
        });

      if (!ACCEPT_ITERABLES) {
        Constructor = wrapper(function(target, iterable) {
          anInstance(target, Constructor, CONSTRUCTOR_NAME);
          var that = inheritIfRequired(
            new NativeConstructor(),
            target,
            Constructor
          );
          if (iterable != undefined)
            iterate(iterable, that[ADDER], that, IS_MAP);
          return that;
        });
        Constructor.prototype = NativePrototype;
        NativePrototype.constructor = Constructor;
      }

      if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
        fixMethod("delete");
        fixMethod("has");
        IS_MAP && fixMethod("get");
      }

      if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

      // weak collections should not contains .clear method
      if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
    }

    exported[CONSTRUCTOR_NAME] = Constructor;
    _export(
      { global: true, forced: Constructor != NativeConstructor },
      exported
    );

    setToStringTag(Constructor, CONSTRUCTOR_NAME);

    if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

    return Constructor;
  };

  var redefineAll = function(target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);
    return target;
  };

  var path = global;

  var aFunction$1 = function(variable) {
    return typeof variable == "function" ? variable : undefined;
  };

  var getBuiltIn = function(namespace, method) {
    return arguments.length < 2
      ? aFunction$1(path[namespace]) || aFunction$1(global[namespace])
      : (path[namespace] && path[namespace][method]) ||
          (global[namespace] && global[namespace][method]);
  };

  var SPECIES$2 = wellKnownSymbol("species");

  var setSpecies = function(CONSTRUCTOR_NAME) {
    var C = getBuiltIn(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty.f;
    if (descriptors && C && !C[SPECIES$2])
      defineProperty(C, SPECIES$2, {
        configurable: true,
        get: function() {
          return this;
        }
      });
  };

  var defineProperty$1 = objectDefineProperty.f;

  var fastKey = internalMetadata.fastKey;

  var setInternalState$1 = internalState.set;
  var internalStateGetterFor = internalState.getterFor;

  var collectionStrong = {
    getConstructor: function(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function(that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$1(that, {
          type: CONSTRUCTOR_NAME,
          index: objectCreate(null),
          first: undefined,
          last: undefined,
          size: 0
        });
        if (!descriptors) that.size = 0;
        if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
      });

      var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

      var define = function(that, key, value) {
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        var previous, index;
        // change existing entry
        if (entry) {
          entry.value = value;
          // create new entry
        } else {
          state.last = entry = {
            index: (index = fastKey(key, true)),
            key: key,
            value: value,
            previous: (previous = state.last),
            next: undefined,
            removed: false
          };
          if (!state.first) state.first = entry;
          if (previous) previous.next = entry;
          if (descriptors) state.size++;
          else that.size++;
          // add to index
          if (index !== "F") state.index[index] = entry;
        }
        return that;
      };

      var getEntry = function(that, key) {
        var state = getInternalState(that);
        // fast case
        var index = fastKey(key);
        var entry;
        if (index !== "F") return state.index[index];
        // frozen object case
        for (entry = state.first; entry; entry = entry.next) {
          if (entry.key == key) return entry;
        }
      };

      redefineAll(C.prototype, {
        // 23.1.3.1 Map.prototype.clear()
        // 23.2.3.2 Set.prototype.clear()
        clear: function clear() {
          var that = this;
          var state = getInternalState(that);
          var data = state.index;
          var entry = state.first;
          while (entry) {
            entry.removed = true;
            if (entry.previous)
              entry.previous = entry.previous.next = undefined;
            delete data[entry.index];
            entry = entry.next;
          }
          state.first = state.last = undefined;
          if (descriptors) state.size = 0;
          else that.size = 0;
        },
        // 23.1.3.3 Map.prototype.delete(key)
        // 23.2.3.4 Set.prototype.delete(value)
        delete: function(key) {
          var that = this;
          var state = getInternalState(that);
          var entry = getEntry(that, key);
          if (entry) {
            var next = entry.next;
            var prev = entry.previous;
            delete state.index[entry.index];
            entry.removed = true;
            if (prev) prev.next = next;
            if (next) next.previous = prev;
            if (state.first == entry) state.first = next;
            if (state.last == entry) state.last = prev;
            if (descriptors) state.size--;
            else that.size--;
          }
          return !!entry;
        },
        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
        forEach: function forEach(callbackfn /* , that = undefined */) {
          var state = getInternalState(this);
          var boundFunction = bindContext(
            callbackfn,
            arguments.length > 1 ? arguments[1] : undefined,
            3
          );
          var entry;
          while ((entry = entry ? entry.next : state.first)) {
            boundFunction(entry.value, entry.key, this);
            // revert to the last existing entry
            while (entry && entry.removed) entry = entry.previous;
          }
        },
        // 23.1.3.7 Map.prototype.has(key)
        // 23.2.3.7 Set.prototype.has(value)
        has: function has(key) {
          return !!getEntry(this, key);
        }
      });

      redefineAll(
        C.prototype,
        IS_MAP
          ? {
              // 23.1.3.6 Map.prototype.get(key)
              get: function get(key) {
                var entry = getEntry(this, key);
                return entry && entry.value;
              },
              // 23.1.3.9 Map.prototype.set(key, value)
              set: function set(key, value) {
                return define(this, key === 0 ? 0 : key, value);
              }
            }
          : {
              // 23.2.3.1 Set.prototype.add(value)
              add: function add(value) {
                return define(this, (value = value === 0 ? 0 : value), value);
              }
            }
      );
      if (descriptors)
        defineProperty$1(C.prototype, "size", {
          get: function() {
            return getInternalState(this).size;
          }
        });
      return C;
    },
    setStrong: function(C, CONSTRUCTOR_NAME, IS_MAP) {
      var ITERATOR_NAME = CONSTRUCTOR_NAME + " Iterator";
      var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
      var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
      // add .keys, .values, .entries, [@@iterator]
      // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
      defineIterator(
        C,
        CONSTRUCTOR_NAME,
        function(iterated, kind) {
          setInternalState$1(this, {
            type: ITERATOR_NAME,
            target: iterated,
            state: getInternalCollectionState(iterated),
            kind: kind,
            last: undefined
          });
        },
        function() {
          var state = getInternalIteratorState(this);
          var kind = state.kind;
          var entry = state.last;
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
          // get next entry
          if (
            !state.target ||
            !(state.last = entry = entry ? entry.next : state.state.first)
          ) {
            // or finish the iteration
            state.target = undefined;
            return { value: undefined, done: true };
          }
          // return step by kind
          if (kind == "keys") return { value: entry.key, done: false };
          if (kind == "values") return { value: entry.value, done: false };
          return { value: [entry.key, entry.value], done: false };
        },
        IS_MAP ? "entries" : "values",
        !IS_MAP,
        true
      );

      // add [@@species], 23.1.2.2, 23.2.2.2
      setSpecies(CONSTRUCTOR_NAME);
    }
  };

  // `Set` constructor
  // https://tc39.github.io/ecma262/#sec-set-objects
  var es_set = collection(
    "Set",
    function(get) {
      return function Set() {
        return get(this, arguments.length > 0 ? arguments[0] : undefined);
      };
    },
    collectionStrong
  );

  // CONVERT_TO_STRING: true  -> String#at
  // CONVERT_TO_STRING: false -> String#codePointAt
  var stringAt = function(that, pos, CONVERT_TO_STRING) {
    var S = String(requireObjectCoercible(that));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size)
      return CONVERT_TO_STRING ? "" : undefined;
    first = S.charCodeAt(position);
    return first < 0xd800 ||
      first > 0xdbff ||
      position + 1 === size ||
      (second = S.charCodeAt(position + 1)) < 0xdc00 ||
      second > 0xdfff
      ? CONVERT_TO_STRING
        ? S.charAt(position)
        : first
      : CONVERT_TO_STRING
      ? S.slice(position, position + 2)
      : ((first - 0xd800) << 10) + (second - 0xdc00) + 0x10000;
  };

  var STRING_ITERATOR = "String Iterator";
  var setInternalState$2 = internalState.set;
  var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
  defineIterator(
    String,
    "String",
    function(iterated) {
      setInternalState$2(this, {
        type: STRING_ITERATOR,
        string: String(iterated),
        index: 0
      });
      // `%StringIteratorPrototype%.next` method
      // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
    },
    function next() {
      var state = getInternalState$1(this);
      var string = state.string;
      var index = state.index;
      var point;
      if (index >= string.length) return { value: undefined, done: true };
      point = stringAt(string, index, true);
      state.index += point.length;
      return { value: point, done: false };
    }
  );

  // `SameValue` abstract operation
  // https://tc39.github.io/ecma262/#sec-samevalue
  var sameValue =
    Object.is ||
    function is(x, y) {
      // eslint-disable-next-line no-self-compare
      return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
    };

  // `RegExp.prototype.flags` getter implementation
  // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
  var regexpFlags = function() {
    var that = anObject(this);
    var result = "";
    if (that.global) result += "g";
    if (that.ignoreCase) result += "i";
    if (that.multiline) result += "m";
    if (that.unicode) result += "u";
    if (that.sticky) result += "y";
    return result;
  };

  var nativeExec = RegExp.prototype.exec;
  // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.
  var nativeReplace = String.prototype.replace;

  var patchedExec = nativeExec;

  var UPDATES_LAST_INDEX_WRONG = (function() {
    var re1 = /a/;
    var re2 = /b*/g;
    nativeExec.call(re1, "a");
    nativeExec.call(re2, "a");
    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
  })();

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  var NPCG_INCLUDED = /()??/.exec("")[1] !== undefined;

  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this;
      var lastIndex, reCopy, match, i;

      if (NPCG_INCLUDED) {
        reCopy = new RegExp("^" + re.source + "$(?!\\s)", regexpFlags.call(re));
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

      match = nativeExec.call(re, str);

      if (UPDATES_LAST_INDEX_WRONG && match) {
        re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        nativeReplace.call(match[0], reCopy, function() {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  var regexpExec = patchedExec;

  // `RegExpExec` abstract operation
  // https://tc39.github.io/ecma262/#sec-regexpexec
  var regexpExecAbstract = function(R, S) {
    var exec = R.exec;
    if (typeof exec === "function") {
      var result = exec.call(R, S);
      if (typeof result !== "object") {
        throw TypeError(
          "RegExp exec method returned something other than an Object or null"
        );
      }
      return result;
    }

    if (classofRaw(R) !== "RegExp") {
      throw TypeError("RegExp#exec called on incompatible receiver");
    }

    return regexpExec.call(R, S);
  };

  var SPECIES$3 = wellKnownSymbol("species");

  var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function() {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;
    re.exec = function() {
      var result = [];
      result.groups = { a: "7" };
      return result;
    };
    return "".replace(re, "$<a>") !== "7";
  });

  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  // Weex JS has frozen built-in prototypes, so use try / catch wrapper
  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function() {
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function() {
      return originalExec.apply(this, arguments);
    };
    var result = "ab".split(re);
    return result.length !== 2 || result[0] !== "a" || result[1] !== "b";
  });

  var fixRegexpWellKnownSymbolLogic = function(KEY, length, exec, sham) {
    var SYMBOL = wellKnownSymbol(KEY);

    var DELEGATES_TO_SYMBOL = !fails(function() {
      // String methods call symbol-named RegEp methods
      var O = {};
      O[SYMBOL] = function() {
        return 7;
      };
      return ""[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC =
      DELEGATES_TO_SYMBOL &&
      !fails(function() {
        // Symbol-named RegExp methods call .exec
        var execCalled = false;
        var re = /a/;
        re.exec = function() {
          execCalled = true;
          return null;
        };

        if (KEY === "split") {
          // RegExp[@@split] doesn't call the regex's exec method, but first creates
          // a new one. We need to return the patched regex when creating the new one.
          re.constructor = {};
          re.constructor[SPECIES$3] = function() {
            return re;
          };
        }

        re[SYMBOL]("");
        return !execCalled;
      });

    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      (KEY === "replace" && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
      (KEY === "split" && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
      var nativeRegExpMethod = /./[SYMBOL];
      var methods = exec(SYMBOL, ""[KEY], function(
        nativeMethod,
        regexp,
        str,
        arg2,
        forceStringMethod
      ) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return {
              done: true,
              value: nativeRegExpMethod.call(regexp, str, arg2)
            };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      });
      var stringMethod = methods[0];
      var regexMethod = methods[1];

      redefine(String.prototype, KEY, stringMethod);
      redefine(
        RegExp.prototype,
        SYMBOL,
        length == 2
          ? // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
            // 21.2.5.11 RegExp.prototype[@@split](string, limit)
            function(string, arg) {
              return regexMethod.call(string, this, arg);
            }
          : // 21.2.5.6 RegExp.prototype[@@match](string)
            // 21.2.5.9 RegExp.prototype[@@search](string)
            function(string) {
              return regexMethod.call(string, this);
            }
      );
      if (sham) hide(RegExp.prototype[SYMBOL], "sham", true);
    }
  };

  // @@search logic
  fixRegexpWellKnownSymbolLogic("search", 1, function(
    SEARCH,
    nativeSearch,
    maybeCallNative
  ) {
    return [
      // `String.prototype.search` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.search
      function search(regexp) {
        var O = requireObjectCoercible(this);
        var searcher = regexp == undefined ? undefined : regexp[SEARCH];
        return searcher !== undefined
          ? searcher.call(regexp, O)
          : new RegExp(regexp)[SEARCH](String(O));
      },
      // `RegExp.prototype[@@search]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
      function(regexp) {
        var res = maybeCallNative(nativeSearch, regexp, this);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);

        var previousLastIndex = rx.lastIndex;
        if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
        var result = regexpExecAbstract(rx, S);
        if (!sameValue(rx.lastIndex, previousLastIndex))
          rx.lastIndex = previousLastIndex;
        return result === null ? -1 : result.index;
      }
    ];
  });

  // iterable DOM collections
  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  var domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0
  };

  var nativeForEach = [].forEach;
  var internalForEach = arrayMethods(0);

  var SLOPPY_METHOD$1 = sloppyArrayMethod("forEach");

  // `Array.prototype.forEach` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  var arrayForEach = SLOPPY_METHOD$1
    ? function forEach(callbackfn /* , thisArg */) {
        return internalForEach(this, callbackfn, arguments[1]);
      }
    : nativeForEach;

  for (var COLLECTION_NAME in domIterables) {
    var Collection = global[COLLECTION_NAME];
    var CollectionPrototype = Collection && Collection.prototype;
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach)
      try {
        hide(CollectionPrototype, "forEach", arrayForEach);
      } catch (error) {
        CollectionPrototype.forEach = arrayForEach;
      }
  }

  var ITERATOR$5 = wellKnownSymbol("iterator");
  var TO_STRING_TAG$3 = wellKnownSymbol("toStringTag");
  var ArrayValues = es_array_iterator.values;

  for (var COLLECTION_NAME$1 in domIterables) {
    var Collection$1 = global[COLLECTION_NAME$1];
    var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
    if (CollectionPrototype$1) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype$1[ITERATOR$5] !== ArrayValues)
        try {
          hide(CollectionPrototype$1, ITERATOR$5, ArrayValues);
        } catch (error) {
          CollectionPrototype$1[ITERATOR$5] = ArrayValues;
        }
      if (!CollectionPrototype$1[TO_STRING_TAG$3])
        hide(CollectionPrototype$1, TO_STRING_TAG$3, COLLECTION_NAME$1);
      if (domIterables[COLLECTION_NAME$1])
        for (var METHOD_NAME in es_array_iterator) {
          // some Chrome versions have non-configurable methods on DOMTokenList
          if (
            CollectionPrototype$1[METHOD_NAME] !==
            es_array_iterator[METHOD_NAME]
          )
            try {
              hide(
                CollectionPrototype$1,
                METHOD_NAME,
                es_array_iterator[METHOD_NAME]
              );
            } catch (error) {
              CollectionPrototype$1[METHOD_NAME] =
                es_array_iterator[METHOD_NAME];
            }
        }
    }
  }

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
      nativeName: "Ελληνικά"
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
      nativeName: "Română"
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
