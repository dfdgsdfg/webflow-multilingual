(function (factory) {
  typeof define === "function" && define.amd ? define(factory) : factory();
})(function () {
  "use strict";

  var commonjsGlobal =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
      ? global
      : typeof self !== "undefined"
      ? self
      : {};

  function createCommonjsModule(fn, module) {
    return (
      (module = { exports: {} }), fn(module, module.exports), module.exports
    );
  }

  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global_1 =
    // eslint-disable-next-line es/no-global-this -- safe
    check(typeof globalThis == "object" && globalThis) ||
    check(typeof window == "object" && window) ||
    // eslint-disable-next-line no-restricted-globals -- safe
    check(typeof self == "object" && self) ||
    check(typeof commonjsGlobal == "object" && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func -- fallback
    (function () {
      return this;
    })() ||
    Function("return this")();

  var fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Detect IE8's incomplete defineProperty implementation
  var descriptors = !fails(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return (
      Object.defineProperty({}, 1, {
        get: function () {
          return 7;
        },
      })[1] != 7
    );
  });

  var $propertyIsEnumerable = {}.propertyIsEnumerable;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG =
    getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  var f$5 = NASHORN_BUG
    ? function propertyIsEnumerable(V) {
        var descriptor = getOwnPropertyDescriptor$1(this, V);
        return !!descriptor && descriptor.enumerable;
      }
    : $propertyIsEnumerable;

  var objectPropertyIsEnumerable = {
    f: f$5,
  };

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value,
    };
  };

  var toString$1 = {}.toString;

  var classofRaw = function (it) {
    return toString$1.call(it).slice(8, -1);
  };

  var split = "".split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !Object("z").propertyIsEnumerable(0);
  })
    ? function (it) {
        return classofRaw(it) == "String" ? split.call(it, "") : Object(it);
      }
    : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings

  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  // `IsCallable` abstract operation
  // https://tc39.es/ecma262/#sec-iscallable
  var isCallable = function (argument) {
    return typeof argument === "function";
  };

  var isObject = function (it) {
    return typeof it === "object" ? it !== null : isCallable(it);
  };

  var aFunction = function (argument) {
    return isCallable(argument) ? argument : undefined;
  };

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2
      ? aFunction(global_1[namespace])
      : global_1[namespace] && global_1[namespace][method];
  };

  var engineUserAgent = getBuiltIn("navigator", "userAgent") || "";

  var process = global_1.process;
  var Deno = global_1.Deno;
  var versions = (process && process.versions) || (Deno && Deno.version);
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split(".");
    version = match[0] < 4 ? 1 : match[0] + match[1];
  } else if (engineUserAgent) {
    match = engineUserAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = engineUserAgent.match(/Chrome\/(\d+)/);
      if (match) version = match[1];
    }
  }

  var engineV8Version = version && +version;

  /* eslint-disable es/no-symbol -- required for testing */

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
  var nativeSymbol =
    !!Object.getOwnPropertySymbols &&
    !fails(function () {
      var symbol = Symbol();
      // Chrome 38 Symbol has incorrect toString conversion
      // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
      return (
        !String(symbol) ||
        !(Object(symbol) instanceof Symbol) ||
        // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
        (!Symbol.sham && engineV8Version && engineV8Version < 41)
      );
    });

  /* eslint-disable es/no-symbol -- required for testing */

  var useSymbolAsUid =
    nativeSymbol && !Symbol.sham && typeof Symbol.iterator == "symbol";

  var isSymbol = useSymbolAsUid
    ? function (it) {
        return typeof it == "symbol";
      }
    : function (it) {
        var $Symbol = getBuiltIn("Symbol");
        return isCallable($Symbol) && Object(it) instanceof $Symbol;
      };

  var tryToString = function (argument) {
    try {
      return String(argument);
    } catch (error) {
      return "Object";
    }
  };

  // `Assert: IsCallable(argument) is true`
  var aCallable = function (argument) {
    if (isCallable(argument)) return argument;
    throw TypeError(tryToString(argument) + " is not a function");
  };

  // `GetMethod` abstract operation
  // https://tc39.es/ecma262/#sec-getmethod
  var getMethod = function (V, P) {
    var func = V[P];
    return func == null ? undefined : aCallable(func);
  };

  // `OrdinaryToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-ordinarytoprimitive
  var ordinaryToPrimitive = function (input, pref) {
    var fn, val;
    if (
      pref === "string" &&
      isCallable((fn = input.toString)) &&
      !isObject((val = fn.call(input)))
    )
      return val;
    if (isCallable((fn = input.valueOf)) && !isObject((val = fn.call(input))))
      return val;
    if (
      pref !== "string" &&
      isCallable((fn = input.toString)) &&
      !isObject((val = fn.call(input)))
    )
      return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var setGlobal = function (key, value) {
    try {
      // eslint-disable-next-line es/no-object-defineproperty -- safe
      Object.defineProperty(global_1, key, {
        value: value,
        configurable: true,
        writable: true,
      });
    } catch (error) {
      global_1[key] = value;
    }
    return value;
  };

  var SHARED = "__core-js_shared__";
  var store$1 = global_1[SHARED] || setGlobal(SHARED, {});

  var sharedStore = store$1;

  var shared = createCommonjsModule(function (module) {
    (module.exports = function (key, value) {
      return (
        sharedStore[key] ||
        (sharedStore[key] = value !== undefined ? value : {})
      );
    })("versions", []).push({
      version: "3.18.3",
      mode: "global",
      copyright: "© 2021 Denis Pushkarev (zloirock.ru)",
    });
  });

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  var toObject = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  var hasOwnProperty = {}.hasOwnProperty;

  // `HasOwnProperty` abstract operation
  // https://tc39.es/ecma262/#sec-hasownproperty
  var hasOwnProperty_1 =
    Object.hasOwn ||
    function hasOwn(it, key) {
      return hasOwnProperty.call(toObject(it), key);
    };

  var id = 0;
  var postfix = Math.random();

  var uid = function (key) {
    return (
      "Symbol(" +
      String(key === undefined ? "" : key) +
      ")_" +
      (++id + postfix).toString(36)
    );
  };

  var WellKnownSymbolsStore = shared("wks");
  var Symbol$1 = global_1.Symbol;
  var createWellKnownSymbol = useSymbolAsUid
    ? Symbol$1
    : (Symbol$1 && Symbol$1.withoutSetter) || uid;

  var wellKnownSymbol = function (name) {
    if (
      !hasOwnProperty_1(WellKnownSymbolsStore, name) ||
      !(nativeSymbol || typeof WellKnownSymbolsStore[name] == "string")
    ) {
      if (nativeSymbol && hasOwnProperty_1(Symbol$1, name)) {
        WellKnownSymbolsStore[name] = Symbol$1[name];
      } else {
        WellKnownSymbolsStore[name] = createWellKnownSymbol("Symbol." + name);
      }
    }
    return WellKnownSymbolsStore[name];
  };

  var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  var toPrimitive = function (input, pref) {
    if (!isObject(input) || isSymbol(input)) return input;
    var exoticToPrim = getMethod(input, TO_PRIMITIVE);
    var result;
    if (exoticToPrim) {
      if (pref === undefined) pref = "default";
      result = exoticToPrim.call(input, pref);
      if (!isObject(result) || isSymbol(result)) return result;
      throw TypeError("Can't convert object to primitive value");
    }
    if (pref === undefined) pref = "number";
    return ordinaryToPrimitive(input, pref);
  };

  // `ToPropertyKey` abstract operation
  // https://tc39.es/ecma262/#sec-topropertykey
  var toPropertyKey = function (argument) {
    var key = toPrimitive(argument, "string");
    return isSymbol(key) ? key : String(key);
  };

  var document$1 = global_1.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS$1 = isObject(document$1) && isObject(document$1.createElement);

  var documentCreateElement = function (it) {
    return EXISTS$1 ? document$1.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine =
    !descriptors &&
    !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
      return (
        Object.defineProperty(documentCreateElement("div"), "a", {
          get: function () {
            return 7;
          },
        }).a != 7
      );
    });

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  var f$4 = descriptors
    ? $getOwnPropertyDescriptor
    : function getOwnPropertyDescriptor(O, P) {
        O = toIndexedObject(O);
        P = toPropertyKey(P);
        if (ie8DomDefine)
          try {
            return $getOwnPropertyDescriptor(O, P);
          } catch (error) {
            /* empty */
          }
        if (hasOwnProperty_1(O, P))
          return createPropertyDescriptor(
            !objectPropertyIsEnumerable.f.call(O, P),
            O[P]
          );
      };

  var objectGetOwnPropertyDescriptor = {
    f: f$4,
  };

  // `Assert: Type(argument) is Object`
  var anObject = function (argument) {
    if (isObject(argument)) return argument;
    throw TypeError(String(argument) + " is not an object");
  };

  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var $defineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  var f$3 = descriptors
    ? $defineProperty
    : function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPropertyKey(P);
        anObject(Attributes);
        if (ie8DomDefine)
          try {
            return $defineProperty(O, P, Attributes);
          } catch (error) {
            /* empty */
          }
        if ("get" in Attributes || "set" in Attributes)
          throw TypeError("Accessors not supported");
        if ("value" in Attributes) O[P] = Attributes.value;
        return O;
      };

  var objectDefineProperty = {
    f: f$3,
  };

  var createNonEnumerableProperty = descriptors
    ? function (object, key, value) {
        return objectDefineProperty.f(
          object,
          key,
          createPropertyDescriptor(1, value)
        );
      }
    : function (object, key, value) {
        object[key] = value;
        return object;
      };

  var functionToString = Function.toString;

  // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
  if (!isCallable(sharedStore.inspectSource)) {
    sharedStore.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  var inspectSource = sharedStore.inspectSource;

  var WeakMap$1 = global_1.WeakMap;

  var nativeWeakMap =
    isCallable(WeakMap$1) && /native code/.test(inspectSource(WeakMap$1));

  var keys = shared("keys");

  var sharedKey = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys$1 = {};

  var OBJECT_ALREADY_INITIALIZED = "Object already initialized";
  var WeakMap = global_1.WeakMap;
  var set, get, has;

  var enforce = function (it) {
    return has(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError("Incompatible receiver, " + TYPE + " required");
      }
      return state;
    };
  };

  if (nativeWeakMap || sharedStore.state) {
    var store = sharedStore.state || (sharedStore.state = new WeakMap());
    var wmget = store.get;
    var wmhas = store.has;
    var wmset = store.set;
    set = function (it, metadata) {
      if (wmhas.call(store, it))
        throw new TypeError(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      wmset.call(store, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store, it) || {};
    };
    has = function (it) {
      return wmhas.call(store, it);
    };
  } else {
    var STATE = sharedKey("state");
    hiddenKeys$1[STATE] = true;
    set = function (it, metadata) {
      if (hasOwnProperty_1(it, STATE))
        throw new TypeError(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
    };
    has = function (it) {
      return hasOwnProperty_1(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor,
  };

  var FunctionPrototype = Function.prototype;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

  var EXISTS = hasOwnProperty_1(FunctionPrototype, "name");
  // additional protection from minified / mangled / dropped function names
  var PROPER =
    EXISTS &&
    function something() {
      /* empty */
    }.name === "something";
  var CONFIGURABLE =
    EXISTS &&
    (!descriptors ||
      (descriptors && getDescriptor(FunctionPrototype, "name").configurable));

  var functionName = {
    EXISTS: EXISTS,
    PROPER: PROPER,
    CONFIGURABLE: CONFIGURABLE,
  };

  var redefine = createCommonjsModule(function (module) {
    var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;

    var getInternalState = internalState.get;
    var enforceInternalState = internalState.enforce;
    var TEMPLATE = String(String).split("String");

    (module.exports = function (O, key, value, options) {
      var unsafe = options ? !!options.unsafe : false;
      var simple = options ? !!options.enumerable : false;
      var noTargetGet = options ? !!options.noTargetGet : false;
      var name = options && options.name !== undefined ? options.name : key;
      var state;
      if (isCallable(value)) {
        if (String(name).slice(0, 7) === "Symbol(") {
          name = "[" + String(name).replace(/^Symbol\(([^)]*)\)/, "$1") + "]";
        }
        if (
          !hasOwnProperty_1(value, "name") ||
          (CONFIGURABLE_FUNCTION_NAME && value.name !== name)
        ) {
          createNonEnumerableProperty(value, "name", name);
        }
        state = enforceInternalState(value);
        if (!state.source) {
          state.source = TEMPLATE.join(typeof name == "string" ? name : "");
        }
      }
      if (O === global_1) {
        if (simple) O[key] = value;
        else setGlobal(key, value);
        return;
      } else if (!unsafe) {
        delete O[key];
      } else if (!noTargetGet && O[key]) {
        simple = true;
      }
      if (simple) O[key] = value;
      else createNonEnumerableProperty(O, key, value);
      // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, "toString", function toString() {
      return (
        (isCallable(this) && getInternalState(this).source) ||
        inspectSource(this)
      );
    });
  });

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToIntegerOrInfinity` abstract operation
  // https://tc39.es/ecma262/#sec-tointegerorinfinity
  var toIntegerOrInfinity = function (argument) {
    var number = +argument;
    // eslint-disable-next-line no-self-compare -- safe
    return number !== number || number === 0
      ? 0
      : (number > 0 ? floor : ceil)(number);
  };

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex = function (index, length) {
    var integer = toIntegerOrInfinity(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  var toLength = function (argument) {
    return argument > 0
      ? min(toIntegerOrInfinity(argument), 0x1fffffffffffff)
      : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  // `LengthOfArrayLike` abstract operation
  // https://tc39.es/ecma262/#sec-lengthofarraylike
  var lengthOfArrayLike = function (obj) {
    return toLength(obj.length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod$2 = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = lengthOfArrayLike(O);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare -- NaN check
      if (IS_INCLUDES && el != el)
        while (length > index) {
          value = O[index++];
          // eslint-disable-next-line no-self-compare -- NaN check
          if (value != value) return true;
          // Array#indexOf ignores holes, Array#includes - not
        }
      else
        for (; length > index; index++) {
          if ((IS_INCLUDES || index in O) && O[index] === el)
            return IS_INCLUDES || index || 0;
        }
      return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod$2(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$2(false),
  };

  var indexOf = arrayIncludes.indexOf;

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O)
      !hasOwnProperty_1(hiddenKeys$1, key) &&
        hasOwnProperty_1(O, key) &&
        result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i)
      if (hasOwnProperty_1(O, (key = names[i++]))) {
        ~indexOf(result, key) || result.push(key);
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
    "valueOf",
  ];

  var hiddenKeys = enumBugKeys.concat("length", "prototype");

  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  // eslint-disable-next-line es/no-object-getownpropertynames -- safe
  var f$2 =
    Object.getOwnPropertyNames ||
    function getOwnPropertyNames(O) {
      return objectKeysInternal(O, hiddenKeys);
    };

  var objectGetOwnPropertyNames = {
    f: f$2,
  };

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  var f$1 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
    f: f$1,
  };

  // all object keys, includes non-enumerable and symbols
  var ownKeys =
    getBuiltIn("Reflect", "ownKeys") ||
    function ownKeys(it) {
      var keys = objectGetOwnPropertyNames.f(anObject(it));
      var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
      return getOwnPropertySymbols
        ? keys.concat(getOwnPropertySymbols(it))
        : keys;
    };

  var copyConstructorProperties = function (target, source) {
    var keys = ownKeys(source);
    var defineProperty = objectDefineProperty.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!hasOwnProperty_1(target, key))
        defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement = /#|\.prototype\./;

  var isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL
      ? true
      : value == NATIVE
      ? false
      : isCallable(detection)
      ? fails(detection)
      : !!detection;
  };

  var normalize = (isForced.normalize = function (string) {
    return String(string).replace(replacement, ".").toLowerCase();
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
	  options.name        - the .name of the function if it does not match the key
	*/
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global_1;
    } else if (STATIC) {
      target = global_1[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global_1[TARGET] || {}).prototype;
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
          createNonEnumerableProperty(sourceProperty, "sham", true);
        }
        // extend global
        redefine(target, key, sourceProperty, options);
      }
  };

  var TO_STRING_TAG$3 = wellKnownSymbol("toStringTag");
  var test = {};

  test[TO_STRING_TAG$3] = "z";

  var toStringTagSupport = String(test) === "[object z]";

  var TO_STRING_TAG$2 = wellKnownSymbol("toStringTag");
  // ES3 wrong here
  var CORRECT_ARGUMENTS =
    classofRaw(
      (function () {
        return arguments;
      })()
    ) == "Arguments";

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) {
      /* empty */
    }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof = toStringTagSupport
    ? classofRaw
    : function (it) {
        var O, tag, result;
        return it === undefined
          ? "Undefined"
          : it === null
          ? "Null"
          : // @@toStringTag case
          typeof (tag = tryGet((O = Object(it)), TO_STRING_TAG$2)) == "string"
          ? tag
          : // builtinTag case
          CORRECT_ARGUMENTS
          ? classofRaw(O)
          : // ES3 arguments fallback
          (result = classofRaw(O)) == "Object" && isCallable(O.callee)
          ? "Arguments"
          : result;
      };

  var toString_1 = function (argument) {
    if (classof(argument) === "Symbol")
      throw TypeError("Cannot convert a Symbol value to a string");
    return String(argument);
  };

  // `RegExp.prototype.flags` getter implementation
  // https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
  var regexpFlags = function () {
    var that = anObject(this);
    var result = "";
    if (that.global) result += "g";
    if (that.ignoreCase) result += "i";
    if (that.multiline) result += "m";
    if (that.dotAll) result += "s";
    if (that.unicode) result += "u";
    if (that.sticky) result += "y";
    return result;
  };

  // babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var $RegExp$2 = global_1.RegExp;

  var UNSUPPORTED_Y$1 = fails(function () {
    var re = $RegExp$2("a", "y");
    re.lastIndex = 2;
    return re.exec("abcd") != null;
  });

  var BROKEN_CARET = fails(function () {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
    var re = $RegExp$2("^r", "gy");
    re.lastIndex = 2;
    return re.exec("str") != null;
  });

  var regexpStickyHelpers = {
    UNSUPPORTED_Y: UNSUPPORTED_Y$1,
    BROKEN_CARET: BROKEN_CARET,
  };

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  // eslint-disable-next-line es/no-object-keys -- safe
  var objectKeys =
    Object.keys ||
    function keys(O) {
      return objectKeysInternal(O, enumBugKeys);
    };

  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  // eslint-disable-next-line es/no-object-defineproperties -- safe
  var objectDefineProperties = descriptors
    ? Object.defineProperties
    : function defineProperties(O, Properties) {
        anObject(O);
        var keys = objectKeys(Properties);
        var length = keys.length;
        var index = 0;
        var key;
        while (length > index)
          objectDefineProperty.f(O, (key = keys[index++]), Properties[key]);
        return O;
      };

  var html = getBuiltIn("document", "documentElement");

  /* global ActiveXObject -- old IE, WSH */

  var GT = ">";
  var LT = "<";
  var PROTOTYPE = "prototype";
  var SCRIPT = "script";
  var IE_PROTO$1 = sharedKey("IE_PROTO");

  var EmptyConstructor = function () {
    /* empty */
  };

  var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(""));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement("iframe");
    var JS = "java" + SCRIPT + ":";
    var iframeDocument;
    iframe.style.display = "none";
    html.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag("document.F=Object"));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument;
  var NullProtoObject = function () {
    try {
      activeXDocument = new ActiveXObject("htmlfile");
    } catch (error) {
      /* ignore */
    }
    NullProtoObject =
      typeof document != "undefined"
        ? document.domain && activeXDocument
          ? NullProtoObjectViaActiveX(activeXDocument) // old IE
          : NullProtoObjectViaIFrame()
        : NullProtoObjectViaActiveX(activeXDocument); // WSH
    var length = enumBugKeys.length;
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
    return NullProtoObject();
  };

  hiddenKeys$1[IE_PROTO$1] = true;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  var objectCreate =
    Object.create ||
    function create(O, Properties) {
      var result;
      if (O !== null) {
        EmptyConstructor[PROTOTYPE] = anObject(O);
        result = new EmptyConstructor();
        EmptyConstructor[PROTOTYPE] = null;
        // add "__proto__" for Object.getPrototypeOf polyfill
        result[IE_PROTO$1] = O;
      } else result = NullProtoObject();
      return Properties === undefined
        ? result
        : objectDefineProperties(result, Properties);
    };

  // babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
  var $RegExp$1 = global_1.RegExp;

  var regexpUnsupportedDotAll = fails(function () {
    var re = $RegExp$1(".", "s");
    return !(re.dotAll && re.exec("\n") && re.flags === "s");
  });

  // babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
  var $RegExp = global_1.RegExp;

  var regexpUnsupportedNcg = fails(function () {
    var re = $RegExp("(?<a>b)", "g");
    return re.exec("b").groups.a !== "b" || "b".replace(re, "$<a>c") !== "bc";
  });

  /* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
  /* eslint-disable regexp/no-useless-quantifier -- testing */

  var getInternalState$2 = internalState.get;

  var nativeExec = RegExp.prototype.exec;
  var nativeReplace = shared("native-string-replace", String.prototype.replace);

  var patchedExec = nativeExec;

  var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/;
    var re2 = /b*/g;
    nativeExec.call(re1, "a");
    nativeExec.call(re2, "a");
    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
  })();

  var UNSUPPORTED_Y =
    regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  var NPCG_INCLUDED = /()??/.exec("")[1] !== undefined;

  var PATCH =
    UPDATES_LAST_INDEX_WRONG ||
    NPCG_INCLUDED ||
    UNSUPPORTED_Y ||
    regexpUnsupportedDotAll ||
    regexpUnsupportedNcg;

  if (PATCH) {
    // eslint-disable-next-line max-statements -- TODO
    patchedExec = function exec(string) {
      var re = this;
      var state = getInternalState$2(re);
      var str = toString_1(string);
      var raw = state.raw;
      var result, reCopy, lastIndex, match, i, object, group;

      if (raw) {
        raw.lastIndex = re.lastIndex;
        result = patchedExec.call(raw, str);
        re.lastIndex = raw.lastIndex;
        return result;
      }

      var groups = state.groups;
      var sticky = UNSUPPORTED_Y && re.sticky;
      var flags = regexpFlags.call(re);
      var source = re.source;
      var charsAdded = 0;
      var strCopy = str;

      if (sticky) {
        flags = flags.replace("y", "");
        if (flags.indexOf("g") === -1) {
          flags += "g";
        }

        strCopy = str.slice(re.lastIndex);
        // Support anchored sticky behavior.
        if (
          re.lastIndex > 0 &&
          (!re.multiline ||
            (re.multiline && str.charAt(re.lastIndex - 1) !== "\n"))
        ) {
          source = "(?: " + source + ")";
          strCopy = " " + strCopy;
          charsAdded++;
        }
        // ^(? + rx + ) is needed, in combination with some str slicing, to
        // simulate the 'y' flag.
        reCopy = new RegExp("^(?:" + source + ")", flags);
      }

      if (NPCG_INCLUDED) {
        reCopy = new RegExp("^" + source + "$(?!\\s)", flags);
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

      match = nativeExec.call(sticky ? reCopy : re, strCopy);

      if (sticky) {
        if (match) {
          match.input = match.input.slice(charsAdded);
          match[0] = match[0].slice(charsAdded);
          match.index = re.lastIndex;
          re.lastIndex += match[0].length;
        } else re.lastIndex = 0;
      } else if (UPDATES_LAST_INDEX_WRONG && match) {
        re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      if (match && groups) {
        match.groups = object = objectCreate(null);
        for (i = 0; i < groups.length; i++) {
          group = groups[i];
          object[group[0]] = match[group[1]];
        }
      }

      return match;
    };
  }

  var regexpExec = patchedExec;

  // `RegExp.prototype.exec` method
  // https://tc39.es/ecma262/#sec-regexp.prototype.exec
  _export(
    { target: "RegExp", proto: true, forced: /./.exec !== regexpExec },
    {
      exec: regexpExec,
    }
  );

  // TODO: Remove from `core-js@4` since it's moved to entry points

  var SPECIES$3 = wellKnownSymbol("species");
  var RegExpPrototype = RegExp.prototype;

  var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
    var SYMBOL = wellKnownSymbol(KEY);

    var DELEGATES_TO_SYMBOL = !fails(function () {
      // String methods call symbol-named RegEp methods
      var O = {};
      O[SYMBOL] = function () {
        return 7;
      };
      return ""[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC =
      DELEGATES_TO_SYMBOL &&
      !fails(function () {
        // Symbol-named RegExp methods call .exec
        var execCalled = false;
        var re = /a/;

        if (KEY === "split") {
          // We can't use real regex here since it causes deoptimization
          // and serious performance degradation in V8
          // https://github.com/zloirock/core-js/issues/306
          re = {};
          // RegExp[@@split] doesn't call the regex's exec method, but first creates
          // a new one. We need to return the patched regex when creating the new one.
          re.constructor = {};
          re.constructor[SPECIES$3] = function () {
            return re;
          };
          re.flags = "";
          re[SYMBOL] = /./[SYMBOL];
        }

        re.exec = function () {
          execCalled = true;
          return null;
        };

        re[SYMBOL]("");
        return !execCalled;
      });

    if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || FORCED) {
      var nativeRegExpMethod = /./[SYMBOL];
      var methods = exec(
        SYMBOL,
        ""[KEY],
        function (nativeMethod, regexp, str, arg2, forceStringMethod) {
          var $exec = regexp.exec;
          if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
            if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
              // The native String method already delegates to @@method (this
              // polyfilled function), leasing to infinite recursion.
              // We avoid it by directly calling the native @@method method.
              return {
                done: true,
                value: nativeRegExpMethod.call(regexp, str, arg2),
              };
            }
            return { done: true, value: nativeMethod.call(str, regexp, arg2) };
          }
          return { done: false };
        }
      );

      redefine(String.prototype, KEY, methods[0]);
      redefine(RegExpPrototype, SYMBOL, methods[1]);
    }

    if (SHAM)
      createNonEnumerableProperty(RegExpPrototype[SYMBOL], "sham", true);
  };

  // `SameValue` abstract operation
  // https://tc39.es/ecma262/#sec-samevalue
  // eslint-disable-next-line es/no-object-is -- safe
  var sameValue =
    Object.is ||
    function is(x, y) {
      // eslint-disable-next-line no-self-compare -- NaN check
      return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
    };

  // `RegExpExec` abstract operation
  // https://tc39.es/ecma262/#sec-regexpexec
  var regexpExecAbstract = function (R, S) {
    var exec = R.exec;
    if (isCallable(exec)) {
      var result = exec.call(R, S);
      if (result !== null) anObject(result);
      return result;
    }
    if (classofRaw(R) === "RegExp") return regexpExec.call(R, S);
    throw TypeError("RegExp#exec called on incompatible receiver");
  };

  // @@search logic
  fixRegexpWellKnownSymbolLogic(
    "search",
    function (SEARCH, nativeSearch, maybeCallNative) {
      return [
        // `String.prototype.search` method
        // https://tc39.es/ecma262/#sec-string.prototype.search
        function search(regexp) {
          var O = requireObjectCoercible(this);
          var searcher =
            regexp == undefined ? undefined : getMethod(regexp, SEARCH);
          return searcher
            ? searcher.call(regexp, O)
            : new RegExp(regexp)[SEARCH](toString_1(O));
        },
        // `RegExp.prototype[@@search]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
        function (string) {
          var rx = anObject(this);
          var S = toString_1(string);
          var res = maybeCallNative(nativeSearch, rx, S);

          if (res.done) return res.value;

          var previousLastIndex = rx.lastIndex;
          if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
          var result = regexpExecAbstract(rx, S);
          if (!sameValue(rx.lastIndex, previousLastIndex))
            rx.lastIndex = previousLastIndex;
          return result === null ? -1 : result.index;
        },
      ];
    }
  );

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
    TouchList: 0,
  };

  // in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`

  var classList = documentCreateElement("span").classList;
  var DOMTokenListPrototype =
    classList && classList.constructor && classList.constructor.prototype;

  var domTokenListPrototype =
    DOMTokenListPrototype === Object.prototype
      ? undefined
      : DOMTokenListPrototype;

  // optional / simple context binding
  var functionBindContext = function (fn, that, length) {
    aCallable(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0:
        return function () {
          return fn.call(that);
        };
      case 1:
        return function (a) {
          return fn.call(that, a);
        };
      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  // `IsArray` abstract operation
  // https://tc39.es/ecma262/#sec-isarray
  // eslint-disable-next-line es/no-array-isarray -- safe
  var isArray =
    Array.isArray ||
    function isArray(argument) {
      return classofRaw(argument) == "Array";
    };

  var empty = [];
  var construct = getBuiltIn("Reflect", "construct");
  var constructorRegExp = /^\s*(?:class|function)\b/;
  var exec = constructorRegExp.exec;
  var INCORRECT_TO_STRING = !constructorRegExp.exec(function () {
    /* empty */
  });

  var isConstructorModern = function (argument) {
    if (!isCallable(argument)) return false;
    try {
      construct(Object, empty, argument);
      return true;
    } catch (error) {
      return false;
    }
  };

  var isConstructorLegacy = function (argument) {
    if (!isCallable(argument)) return false;
    switch (classof(argument)) {
      case "AsyncFunction":
      case "GeneratorFunction":
      case "AsyncGeneratorFunction":
        return false;
      // we can't check .prototype since constructors produced by .bind haven't it
    }
    return (
      INCORRECT_TO_STRING ||
      !!exec.call(constructorRegExp, inspectSource(argument))
    );
  };

  // `IsConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-isconstructor
  var isConstructor =
    !construct ||
    fails(function () {
      var called;
      return (
        isConstructorModern(isConstructorModern.call) ||
        !isConstructorModern(Object) ||
        !isConstructorModern(function () {
          called = true;
        }) ||
        called
      );
    })
      ? isConstructorLegacy
      : isConstructorModern;

  var SPECIES$2 = wellKnownSymbol("species");

  // a part of `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  var arraySpeciesConstructor = function (originalArray) {
    var C;
    if (isArray(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (isConstructor(C) && (C === Array || isArray(C.prototype)))
        C = undefined;
      else if (isObject(C)) {
        C = C[SPECIES$2];
        if (C === null) C = undefined;
      }
    }
    return C === undefined ? Array : C;
  };

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate = function (originalArray, length) {
    return new (arraySpeciesConstructor(originalArray))(
      length === 0 ? 0 : length
    );
  };

  var push = [].push;

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
  var createMethod$1 = function (TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var IS_FILTER_REJECT = TYPE == 7;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject($this);
      var self = indexedObject(O);
      var boundFunction = functionBindContext(callbackfn, that, 3);
      var length = lengthOfArrayLike(self);
      var index = 0;
      var create = specificCreate || arraySpeciesCreate;
      var target = IS_MAP
        ? create($this, length)
        : IS_FILTER || IS_FILTER_REJECT
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
                  push.call(target, value); // filter
              }
            else
              switch (TYPE) {
                case 4:
                  return false; // every
                case 7:
                  push.call(target, value); // filterReject
              }
          }
        }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    forEach: createMethod$1(0),
    // `Array.prototype.map` method
    // https://tc39.es/ecma262/#sec-array.prototype.map
    map: createMethod$1(1),
    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    filter: createMethod$1(2),
    // `Array.prototype.some` method
    // https://tc39.es/ecma262/#sec-array.prototype.some
    some: createMethod$1(3),
    // `Array.prototype.every` method
    // https://tc39.es/ecma262/#sec-array.prototype.every
    every: createMethod$1(4),
    // `Array.prototype.find` method
    // https://tc39.es/ecma262/#sec-array.prototype.find
    find: createMethod$1(5),
    // `Array.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$1(6),
    // `Array.prototype.filterReject` method
    // https://github.com/tc39/proposal-array-filtering
    filterReject: createMethod$1(7),
  };

  var arrayMethodIsStrict = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return (
      !!method &&
      fails(function () {
        // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
        method.call(
          null,
          argument ||
            function () {
              throw 1;
            },
          1
        );
      })
    );
  };

  var $forEach = arrayIteration.forEach;

  var STRICT_METHOD = arrayMethodIsStrict("forEach");

  // `Array.prototype.forEach` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  var arrayForEach = !STRICT_METHOD
    ? function forEach(callbackfn /* , thisArg */) {
        return $forEach(
          this,
          callbackfn,
          arguments.length > 1 ? arguments[1] : undefined
        );
        // eslint-disable-next-line es/no-array-prototype-foreach -- safe
      }
    : [].forEach;

  var handlePrototype$1 = function (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach)
      try {
        createNonEnumerableProperty(
          CollectionPrototype,
          "forEach",
          arrayForEach
        );
      } catch (error) {
        CollectionPrototype.forEach = arrayForEach;
      }
  };

  for (var COLLECTION_NAME$1 in domIterables) {
    if (domIterables[COLLECTION_NAME$1]) {
      handlePrototype$1(
        global_1[COLLECTION_NAME$1] && global_1[COLLECTION_NAME$1].prototype
      );
    }
  }

  handlePrototype$1(domTokenListPrototype);

  var iteratorClose = function (iterator, kind, value) {
    var innerResult, innerError;
    anObject(iterator);
    try {
      innerResult = getMethod(iterator, "return");
      if (!innerResult) {
        if (kind === "throw") throw value;
        return value;
      }
      innerResult = innerResult.call(iterator);
    } catch (error) {
      innerError = true;
      innerResult = error;
    }
    if (kind === "throw") throw value;
    if (innerError) throw innerResult;
    anObject(innerResult);
    return value;
  };

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
    } catch (error) {
      iteratorClose(iterator, "throw", error);
    }
  };

  var iterators = {};

  var ITERATOR$5 = wellKnownSymbol("iterator");
  var ArrayPrototype$1 = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod = function (it) {
    return (
      it !== undefined &&
      (iterators.Array === it || ArrayPrototype$1[ITERATOR$5] === it)
    );
  };

  var createProperty = function (object, key, value) {
    var propertyKey = toPropertyKey(key);
    if (propertyKey in object)
      objectDefineProperty.f(
        object,
        propertyKey,
        createPropertyDescriptor(0, value)
      );
    else object[propertyKey] = value;
  };

  var ITERATOR$4 = wellKnownSymbol("iterator");

  var getIteratorMethod = function (it) {
    if (it != undefined)
      return (
        getMethod(it, ITERATOR$4) ||
        getMethod(it, "@@iterator") ||
        iterators[classof(it)]
      );
  };

  var getIterator = function (argument, usingIterator) {
    var iteratorMethod =
      arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
    if (aCallable(iteratorMethod))
      return anObject(iteratorMethod.call(argument));
    throw TypeError(String(argument) + " is not iterable");
  };

  // `Array.from` method implementation
  // https://tc39.es/ecma262/#sec-array.from
  var arrayFrom = function from(
    arrayLike /* , mapfn = undefined, thisArg = undefined */
  ) {
    var O = toObject(arrayLike);
    var IS_CONSTRUCTOR = isConstructor(this);
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    if (mapping)
      mapfn = functionBindContext(
        mapfn,
        argumentsLength > 2 ? arguments[2] : undefined,
        2
      );
    var iteratorMethod = getIteratorMethod(O);
    var index = 0;
    var length, result, step, iterator, next, value;
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (
      iteratorMethod &&
      !(this == Array && isArrayIteratorMethod(iteratorMethod))
    ) {
      iterator = getIterator(O, iteratorMethod);
      next = iterator.next;
      result = IS_CONSTRUCTOR ? new this() : [];
      for (; !(step = next.call(iterator)).done; index++) {
        value = mapping
          ? callWithSafeIterationClosing(
              iterator,
              mapfn,
              [step.value, index],
              true
            )
          : step.value;
        createProperty(result, index, value);
      }
    } else {
      length = lengthOfArrayLike(O);
      result = IS_CONSTRUCTOR ? new this(length) : Array(length);
      for (; length > index; index++) {
        value = mapping ? mapfn(O[index], index) : O[index];
        createProperty(result, index, value);
      }
    }
    result.length = index;
    return result;
  };

  var ITERATOR$3 = wellKnownSymbol("iterator");
  var SAFE_CLOSING = false;

  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function () {
        return { done: !!called++ };
      },
      return: function () {
        SAFE_CLOSING = true;
      },
    };
    iteratorWithReturn[ITERATOR$3] = function () {
      return this;
    };
    // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
    Array.from(iteratorWithReturn, function () {
      throw 2;
    });
  } catch (error) {
    /* empty */
  }

  var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR$3] = function () {
        return {
          next: function () {
            return { done: (ITERATION_SUPPORT = true) };
          },
        };
      };
      exec(object);
    } catch (error) {
      /* empty */
    }
    return ITERATION_SUPPORT;
  };

  var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
    // eslint-disable-next-line es/no-array-from -- required for testing
    Array.from(iterable);
  });

  // `Array.from` method
  // https://tc39.es/ecma262/#sec-array.from
  _export(
    { target: "Array", stat: true, forced: INCORRECT_ITERATION },
    {
      from: arrayFrom,
    }
  );

  var createMethod = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = toString_1(requireObjectCoercible($this));
      var position = toIntegerOrInfinity(pos);
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
  };

  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.es/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod(true),
  };

  var correctPrototypeGetter = !fails(function () {
    function F() {
      /* empty */
    }
    F.prototype.constructor = null;
    // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var IE_PROTO = sharedKey("IE_PROTO");
  var ObjectPrototype = Object.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.getprototypeof
  // eslint-disable-next-line es/no-object-getprototypeof -- safe
  var objectGetPrototypeOf = correctPrototypeGetter
    ? Object.getPrototypeOf
    : function (O) {
        var object = toObject(O);
        if (hasOwnProperty_1(object, IE_PROTO)) return object[IE_PROTO];
        var constructor = object.constructor;
        if (isCallable(constructor) && object instanceof constructor) {
          return constructor.prototype;
        }
        return object instanceof Object ? ObjectPrototype : null;
      };

  var ITERATOR$2 = wellKnownSymbol("iterator");
  var BUGGY_SAFARI_ITERATORS$1 = false;

  // `%IteratorPrototype%` object
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

  /* eslint-disable es/no-array-prototype-keys -- safe */
  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!("next" in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
    else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(
        objectGetPrototypeOf(arrayIterator)
      );
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
        IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
    }
  }

  var NEW_ITERATOR_PROTOTYPE =
    IteratorPrototype$2 == undefined ||
    fails(function () {
      var test = {};
      // FF44- legacy iterators case
      return IteratorPrototype$2[ITERATOR$2].call(test) !== test;
    });

  if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

  // `%IteratorPrototype%[@@iterator]()` method
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
  if (!isCallable(IteratorPrototype$2[ITERATOR$2])) {
    redefine(IteratorPrototype$2, ITERATOR$2, function () {
      return this;
    });
  }

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype$2,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1,
  };

  var defineProperty$1 = objectDefineProperty.f;

  var TO_STRING_TAG$1 = wellKnownSymbol("toStringTag");

  var setToStringTag = function (it, TAG, STATIC) {
    if (
      it &&
      !hasOwnProperty_1((it = STATIC ? it : it.prototype), TO_STRING_TAG$1)
    ) {
      defineProperty$1(it, TO_STRING_TAG$1, { configurable: true, value: TAG });
    }
  };

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

  var returnThis$1 = function () {
    return this;
  };

  var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + " Iterator";
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, {
      next: createPropertyDescriptor(1, next),
    });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
    iterators[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var aPossiblePrototype = function (argument) {
    if (typeof argument === "object" || isCallable(argument)) return argument;
    throw TypeError("Can't set " + String(argument) + " as a prototype");
  };

  /* eslint-disable no-proto -- safe */

  // `Object.setPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  // eslint-disable-next-line es/no-object-setprototypeof -- safe
  var objectSetPrototypeOf =
    Object.setPrototypeOf ||
    ("__proto__" in {}
      ? (function () {
          var CORRECT_SETTER = false;
          var test = {};
          var setter;
          try {
            // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
            setter = Object.getOwnPropertyDescriptor(
              Object.prototype,
              "__proto__"
            ).set;
            setter.call(test, []);
            CORRECT_SETTER = test instanceof Array;
          } catch (error) {
            /* empty */
          }
          return function setPrototypeOf(O, proto) {
            anObject(O);
            aPossiblePrototype(proto);
            if (CORRECT_SETTER) setter.call(O, proto);
            else O.__proto__ = proto;
            return O;
          };
        })()
      : undefined);

  var PROPER_FUNCTION_NAME = functionName.PROPER;
  var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
  var IteratorPrototype = iteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$1 = wellKnownSymbol("iterator");
  var KEYS = "keys";
  var VALUES = "values";
  var ENTRIES = "entries";

  var returnThis = function () {
    return this;
  };

  var defineIterator = function (
    Iterable,
    NAME,
    IteratorConstructor,
    next,
    DEFAULT,
    IS_SET,
    FORCED
  ) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype)
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
      return function () {
        return new IteratorConstructor(this);
      };
    };

    var TO_STRING_TAG = NAME + " Iterator";
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator =
      IterablePrototype[ITERATOR$1] ||
      IterablePrototype["@@iterator"] ||
      (DEFAULT && IterablePrototype[DEFAULT]);
    var defaultIterator =
      (!BUGGY_SAFARI_ITERATORS && nativeIterator) ||
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
        CurrentIteratorPrototype !== Object.prototype &&
        CurrentIteratorPrototype.next
      ) {
        if (
          objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype
        ) {
          if (objectSetPrototypeOf) {
            objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
          } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$1])) {
            redefine(CurrentIteratorPrototype, ITERATOR$1, returnThis);
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
      }
    }

    // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
    if (
      PROPER_FUNCTION_NAME &&
      DEFAULT == VALUES &&
      nativeIterator &&
      nativeIterator.name !== VALUES
    ) {
      if (CONFIGURABLE_FUNCTION_NAME) {
        createNonEnumerableProperty(IterablePrototype, "name", VALUES);
      } else {
        INCORRECT_VALUES_NAME = true;
        defaultIterator = function values() {
          return nativeIterator.call(this);
        };
      }
    }

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES),
      };
      if (FORCED)
        for (KEY in methods) {
          if (
            BUGGY_SAFARI_ITERATORS ||
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
            forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME,
          },
          methods
        );
    }

    // define iterator
    if (IterablePrototype[ITERATOR$1] !== defaultIterator) {
      redefine(IterablePrototype, ITERATOR$1, defaultIterator, {
        name: DEFAULT,
      });
    }
    iterators[NAME] = defaultIterator;

    return methods;
  };

  var charAt = stringMultibyte.charAt;

  var STRING_ITERATOR = "String Iterator";
  var setInternalState$2 = internalState.set;
  var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-string.prototype-@@iterator
  defineIterator(
    String,
    "String",
    function (iterated) {
      setInternalState$2(this, {
        type: STRING_ITERATOR,
        string: toString_1(iterated),
        index: 0,
      });
      // `%StringIteratorPrototype%.next` method
      // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
    },
    function next() {
      var state = getInternalState$1(this);
      var string = state.string;
      var index = state.index;
      var point;
      if (index >= string.length) return { value: undefined, done: true };
      point = charAt(string, index);
      state.index += point.length;
      return { value: point, done: false };
    }
  );

  var UNSCOPABLES = wellKnownSymbol("unscopables");
  var ArrayPrototype = Array.prototype;

  // Array.prototype[@@unscopables]
  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype[UNSCOPABLES] == undefined) {
    objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
      configurable: true,
      value: objectCreate(null),
    });
  }

  // add a key to Array.prototype[@@unscopables]
  var addToUnscopables = function (key) {
    ArrayPrototype[UNSCOPABLES][key] = true;
  };

  var ARRAY_ITERATOR = "Array Iterator";
  var setInternalState$1 = internalState.set;
  var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.es/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.es/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.es/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.es/ecma262/#sec-createarrayiterator
  var es_array_iterator = defineIterator(
    Array,
    "Array",
    function (iterated, kind) {
      setInternalState$1(this, {
        type: ARRAY_ITERATOR,
        target: toIndexedObject(iterated), // target
        index: 0, // next index
        kind: kind, // kind
      });
      // `%ArrayIteratorPrototype%.next` method
      // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
    },
    function () {
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
  // https://tc39.es/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.es/ecma262/#sec-createmappedargumentsobject
  iterators.Arguments = iterators.Array;

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables("keys");
  addToUnscopables("values");
  addToUnscopables("entries");

  // `Object.prototype.toString` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  var objectToString = toStringTagSupport
    ? {}.toString
    : function toString() {
        return "[object " + classof(this) + "]";
      };

  // `Object.prototype.toString` method
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  if (!toStringTagSupport) {
    redefine(Object.prototype, "toString", objectToString, { unsafe: true });
  }

  /* eslint-disable es/no-object-getownpropertynames -- safe */

  var $getOwnPropertyNames = objectGetOwnPropertyNames.f;

  var toString = {}.toString;

  var windowNames =
    typeof window == "object" && window && Object.getOwnPropertyNames
      ? Object.getOwnPropertyNames(window)
      : [];

  var getWindowNames = function (it) {
    try {
      return $getOwnPropertyNames(it);
    } catch (error) {
      return windowNames.slice();
    }
  };

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
  var f = function getOwnPropertyNames(it) {
    return windowNames && toString.call(it) == "[object Window]"
      ? getWindowNames(it)
      : $getOwnPropertyNames(toIndexedObject(it));
  };

  var objectGetOwnPropertyNamesExternal = {
    f: f,
  };

  var freezing = !fails(function () {
    // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
    return Object.isExtensible(Object.preventExtensions({}));
  });

  var internalMetadata = createCommonjsModule(function (module) {
    var defineProperty = objectDefineProperty.f;

    var REQUIRED = false;
    var METADATA = uid("meta");
    var id = 0;

    // eslint-disable-next-line es/no-object-isextensible -- safe
    var isExtensible =
      Object.isExtensible ||
      function () {
        return true;
      };

    var setMetadata = function (it) {
      defineProperty(it, METADATA, {
        value: {
          objectID: "O" + id++, // object ID
          weakData: {}, // weak collections IDs
        },
      });
    };

    var fastKey = function (it, create) {
      // return a primitive with prefix
      if (!isObject(it))
        return typeof it == "symbol"
          ? it
          : (typeof it == "string" ? "S" : "P") + it;
      if (!hasOwnProperty_1(it, METADATA)) {
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

    var getWeakData = function (it, create) {
      if (!hasOwnProperty_1(it, METADATA)) {
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
    var onFreeze = function (it) {
      if (
        freezing &&
        REQUIRED &&
        isExtensible(it) &&
        !hasOwnProperty_1(it, METADATA)
      )
        setMetadata(it);
      return it;
    };

    var enable = function () {
      meta.enable = function () {
        /* empty */
      };
      REQUIRED = true;
      var getOwnPropertyNames = objectGetOwnPropertyNames.f;
      var splice = [].splice;
      var test = {};
      test[METADATA] = 1;

      // prevent exposing of metadata key
      if (getOwnPropertyNames(test).length) {
        objectGetOwnPropertyNames.f = function (it) {
          var result = getOwnPropertyNames(it);
          for (var i = 0, length = result.length; i < length; i++) {
            if (result[i] === METADATA) {
              splice.call(result, i, 1);
              break;
            }
          }
          return result;
        };

        _export(
          { target: "Object", stat: true, forced: true },
          {
            getOwnPropertyNames: objectGetOwnPropertyNamesExternal.f,
          }
        );
      }
    };

    var meta = (module.exports = {
      enable: enable,
      fastKey: fastKey,
      getWeakData: getWeakData,
      onFreeze: onFreeze,
    });

    hiddenKeys$1[METADATA] = true;
  });
  internalMetadata.enable;
  internalMetadata.fastKey;
  internalMetadata.getWeakData;
  internalMetadata.onFreeze;

  var Result = function (stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };

  var iterate = function (iterable, unboundFunction, options) {
    var that = options && options.that;
    var AS_ENTRIES = !!(options && options.AS_ENTRIES);
    var IS_ITERATOR = !!(options && options.IS_ITERATOR);
    var INTERRUPTED = !!(options && options.INTERRUPTED);
    var fn = functionBindContext(
      unboundFunction,
      that,
      1 + AS_ENTRIES + INTERRUPTED
    );
    var iterator, iterFn, index, length, result, next, step;

    var stop = function (condition) {
      if (iterator) iteratorClose(iterator, "normal", condition);
      return new Result(true, condition);
    };

    var callFn = function (value) {
      if (AS_ENTRIES) {
        anObject(value);
        return INTERRUPTED
          ? fn(value[0], value[1], stop)
          : fn(value[0], value[1]);
      }
      return INTERRUPTED ? fn(value, stop) : fn(value);
    };

    if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (!iterFn) throw TypeError(String(iterable) + " is not iterable");
      // optimisation for array iterators
      if (isArrayIteratorMethod(iterFn)) {
        for (
          index = 0, length = lengthOfArrayLike(iterable);
          length > index;
          index++
        ) {
          result = callFn(iterable[index]);
          if (result && result instanceof Result) return result;
        }
        return new Result(false);
      }
      iterator = getIterator(iterable, iterFn);
    }

    next = iterator.next;
    while (!(step = next.call(iterator)).done) {
      try {
        result = callFn(step.value);
      } catch (error) {
        iteratorClose(iterator, "throw", error);
      }
      if (typeof result == "object" && result && result instanceof Result)
        return result;
    }
    return new Result(false);
  };

  var anInstance = function (it, Constructor, name) {
    if (it instanceof Constructor) return it;
    throw TypeError("Incorrect " + (name ? name + " " : "") + "invocation");
  };

  // makes subclassing work correct for wrapped built-ins
  var inheritIfRequired = function ($this, dummy, Wrapper) {
    var NewTarget, NewTargetPrototype;
    if (
      // it can work only with native `setPrototypeOf`
      objectSetPrototypeOf &&
      // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
      isCallable((NewTarget = dummy.constructor)) &&
      NewTarget !== Wrapper &&
      isObject((NewTargetPrototype = NewTarget.prototype)) &&
      NewTargetPrototype !== Wrapper.prototype
    )
      objectSetPrototypeOf($this, NewTargetPrototype);
    return $this;
  };

  var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
    var IS_MAP = CONSTRUCTOR_NAME.indexOf("Map") !== -1;
    var IS_WEAK = CONSTRUCTOR_NAME.indexOf("Weak") !== -1;
    var ADDER = IS_MAP ? "set" : "add";
    var NativeConstructor = global_1[CONSTRUCTOR_NAME];
    var NativePrototype = NativeConstructor && NativeConstructor.prototype;
    var Constructor = NativeConstructor;
    var exported = {};

    var fixMethod = function (KEY) {
      var nativeMethod = NativePrototype[KEY];
      redefine(
        NativePrototype,
        KEY,
        KEY == "add"
          ? function add(value) {
              nativeMethod.call(this, value === 0 ? 0 : value);
              return this;
            }
          : KEY == "delete"
          ? function (key) {
              return IS_WEAK && !isObject(key)
                ? false
                : nativeMethod.call(this, key === 0 ? 0 : key);
            }
          : KEY == "get"
          ? function get(key) {
              return IS_WEAK && !isObject(key)
                ? undefined
                : nativeMethod.call(this, key === 0 ? 0 : key);
            }
          : KEY == "has"
          ? function has(key) {
              return IS_WEAK && !isObject(key)
                ? false
                : nativeMethod.call(this, key === 0 ? 0 : key);
            }
          : function set(key, value) {
              nativeMethod.call(this, key === 0 ? 0 : key, value);
              return this;
            }
      );
    };

    var REPLACE = isForced_1(
      CONSTRUCTOR_NAME,
      !isCallable(NativeConstructor) ||
        !(
          IS_WEAK ||
          (NativePrototype.forEach &&
            !fails(function () {
              new NativeConstructor().entries().next();
            }))
        )
    );

    if (REPLACE) {
      // create collection constructor
      Constructor = common.getConstructor(
        wrapper,
        CONSTRUCTOR_NAME,
        IS_MAP,
        ADDER
      );
      internalMetadata.enable();
    } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
      var instance = new Constructor();
      // early implementations not supports chaining
      var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
      // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
      var THROWS_ON_PRIMITIVES = fails(function () {
        instance.has(1);
      });
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      // eslint-disable-next-line no-new -- required for testing
      var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) {
        new NativeConstructor(iterable);
      });
      // for early implementations -0 and +0 not the same
      var BUGGY_ZERO =
        !IS_WEAK &&
        fails(function () {
          // V8 ~ Chromium 42- fails only with 5+ elements
          var $instance = new NativeConstructor();
          var index = 5;
          while (index--) $instance[ADDER](index, index);
          return !$instance.has(-0);
        });

      if (!ACCEPT_ITERABLES) {
        Constructor = wrapper(function (dummy, iterable) {
          anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
          var that = inheritIfRequired(
            new NativeConstructor(),
            dummy,
            Constructor
          );
          if (iterable != undefined)
            iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
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

  var redefineAll = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);
    return target;
  };

  var SPECIES$1 = wellKnownSymbol("species");

  var setSpecies = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty.f;

    if (descriptors && Constructor && !Constructor[SPECIES$1]) {
      defineProperty(Constructor, SPECIES$1, {
        configurable: true,
        get: function () {
          return this;
        },
      });
    }
  };

  var defineProperty = objectDefineProperty.f;

  var fastKey = internalMetadata.fastKey;

  var setInternalState = internalState.set;
  var internalStateGetterFor = internalState.getterFor;

  var collectionStrong = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState(that, {
          type: CONSTRUCTOR_NAME,
          index: objectCreate(null),
          first: undefined,
          last: undefined,
          size: 0,
        });
        if (!descriptors) that.size = 0;
        if (iterable != undefined)
          iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
      });

      var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

      var define = function (that, key, value) {
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
            removed: false,
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

      var getEntry = function (that, key) {
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
        // `{ Map, Set }.prototype.clear()` methods
        // https://tc39.es/ecma262/#sec-map.prototype.clear
        // https://tc39.es/ecma262/#sec-set.prototype.clear
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
        // `{ Map, Set }.prototype.delete(key)` methods
        // https://tc39.es/ecma262/#sec-map.prototype.delete
        // https://tc39.es/ecma262/#sec-set.prototype.delete
        delete: function (key) {
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
        // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
        // https://tc39.es/ecma262/#sec-map.prototype.foreach
        // https://tc39.es/ecma262/#sec-set.prototype.foreach
        forEach: function forEach(callbackfn /* , that = undefined */) {
          var state = getInternalState(this);
          var boundFunction = functionBindContext(
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
        // `{ Map, Set}.prototype.has(key)` methods
        // https://tc39.es/ecma262/#sec-map.prototype.has
        // https://tc39.es/ecma262/#sec-set.prototype.has
        has: function has(key) {
          return !!getEntry(this, key);
        },
      });

      redefineAll(
        C.prototype,
        IS_MAP
          ? {
              // `Map.prototype.get(key)` method
              // https://tc39.es/ecma262/#sec-map.prototype.get
              get: function get(key) {
                var entry = getEntry(this, key);
                return entry && entry.value;
              },
              // `Map.prototype.set(key, value)` method
              // https://tc39.es/ecma262/#sec-map.prototype.set
              set: function set(key, value) {
                return define(this, key === 0 ? 0 : key, value);
              },
            }
          : {
              // `Set.prototype.add(value)` method
              // https://tc39.es/ecma262/#sec-set.prototype.add
              add: function add(value) {
                return define(this, (value = value === 0 ? 0 : value), value);
              },
            }
      );
      if (descriptors)
        defineProperty(C.prototype, "size", {
          get: function () {
            return getInternalState(this).size;
          },
        });
      return C;
    },
    setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
      var ITERATOR_NAME = CONSTRUCTOR_NAME + " Iterator";
      var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
      var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
      // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
      // https://tc39.es/ecma262/#sec-map.prototype.entries
      // https://tc39.es/ecma262/#sec-map.prototype.keys
      // https://tc39.es/ecma262/#sec-map.prototype.values
      // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
      // https://tc39.es/ecma262/#sec-set.prototype.entries
      // https://tc39.es/ecma262/#sec-set.prototype.keys
      // https://tc39.es/ecma262/#sec-set.prototype.values
      // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
      defineIterator(
        C,
        CONSTRUCTOR_NAME,
        function (iterated, kind) {
          setInternalState(this, {
            type: ITERATOR_NAME,
            target: iterated,
            state: getInternalCollectionState(iterated),
            kind: kind,
            last: undefined,
          });
        },
        function () {
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

      // `{ Map, Set }.prototype[@@species]` accessors
      // https://tc39.es/ecma262/#sec-get-map-@@species
      // https://tc39.es/ecma262/#sec-get-set-@@species
      setSpecies(CONSTRUCTOR_NAME);
    },
  };
  collectionStrong.getConstructor;
  collectionStrong.setStrong;

  // `Set` constructor
  // https://tc39.es/ecma262/#sec-set-objects
  collection(
    "Set",
    function (init) {
      return function Set() {
        return init(this, arguments.length ? arguments[0] : undefined);
      };
    },
    collectionStrong
  );

  var ITERATOR = wellKnownSymbol("iterator");
  var TO_STRING_TAG = wellKnownSymbol("toStringTag");
  var ArrayValues = es_array_iterator.values;

  var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
    if (CollectionPrototype) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[ITERATOR] !== ArrayValues)
        try {
          createNonEnumerableProperty(
            CollectionPrototype,
            ITERATOR,
            ArrayValues
          );
        } catch (error) {
          CollectionPrototype[ITERATOR] = ArrayValues;
        }
      if (!CollectionPrototype[TO_STRING_TAG]) {
        createNonEnumerableProperty(
          CollectionPrototype,
          TO_STRING_TAG,
          COLLECTION_NAME
        );
      }
      if (domIterables[COLLECTION_NAME])
        for (var METHOD_NAME in es_array_iterator) {
          // some Chrome versions have non-configurable methods on DOMTokenList
          if (
            CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]
          )
            try {
              createNonEnumerableProperty(
                CollectionPrototype,
                METHOD_NAME,
                es_array_iterator[METHOD_NAME]
              );
            } catch (error) {
              CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
            }
        }
    }
  };

  for (var COLLECTION_NAME in domIterables) {
    handlePrototype(
      global_1[COLLECTION_NAME] && global_1[COLLECTION_NAME].prototype,
      COLLECTION_NAME
    );
  }

  handlePrototype(domTokenListPrototype, "DOMTokenList");

  var SPECIES = wellKnownSymbol("species");

  var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return (
      engineV8Version >= 51 ||
      !fails(function () {
        var array = [];
        var constructor = (array.constructor = {});
        constructor[SPECIES] = function () {
          return { foo: 1 };
        };
        return array[METHOD_NAME](Boolean).foo !== 1;
      })
    );
  };

  var $filter = arrayIteration.filter;

  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("filter");

  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  _export(
    { target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT },
    {
      filter: function filter(callbackfn /* , thisArg */) {
        return $filter(
          this,
          callbackfn,
          arguments.length > 1 ? arguments[1] : undefined
        );
      },
    }
  );

  const LANGUAGES_LIST = {
    aa: {
      name: "Afar",
      nativeName: "Afaraf",
    },
    ab: {
      name: "Abkhaz",
      nativeName: "аҧсуа бызшәа",
    },
    ae: {
      name: "Avestan",
      nativeName: "avesta",
    },
    af: {
      name: "Afrikaans",
      nativeName: "Afrikaans",
    },
    ak: {
      name: "Akan",
      nativeName: "Akan",
    },
    am: {
      name: "Amharic",
      nativeName: "አማርኛ",
    },
    an: {
      name: "Aragonese",
      nativeName: "aragonés",
    },
    ar: {
      name: "Arabic",
      nativeName: "اللغة العربية",
    },
    as: {
      name: "Assamese",
      nativeName: "অসমীয়া",
    },
    av: {
      name: "Avaric",
      nativeName: "авар мацӀ",
    },
    ay: {
      name: "Aymara",
      nativeName: "aymar aru",
    },
    az: {
      name: "Azerbaijani",
      nativeName: "azərbaycan dili",
    },
    ba: {
      name: "Bashkir",
      nativeName: "башҡорт теле",
    },
    be: {
      name: "Belarusian",
      nativeName: "беларуская мова",
    },
    bg: {
      name: "Bulgarian",
      nativeName: "български език",
    },
    bh: {
      name: "Bihari",
      nativeName: "भोजपुरी",
    },
    bi: {
      name: "Bislama",
      nativeName: "Bislama",
    },
    bm: {
      name: "Bambara",
      nativeName: "bamanankan",
    },
    bn: {
      name: "Bengali",
      nativeName: "বাংলা",
    },
    bo: {
      name: "Tibetan",
      nativeName: "བོད་ཡིག",
    },
    br: {
      name: "Breton",
      nativeName: "brezhoneg",
    },
    bs: {
      name: "Bosnian",
      nativeName: "bosanski jezik",
    },
    ca: {
      name: "Catalan",
      nativeName: "Català",
    },
    ce: {
      name: "Chechen",
      nativeName: "нохчийн мотт",
    },
    ch: {
      name: "Chamorro",
      nativeName: "Chamoru",
    },
    co: {
      name: "Corsican",
      nativeName: "corsu",
    },
    cr: {
      name: "Cree",
      nativeName: "ᓀᐦᐃᔭᐍᐏᐣ",
    },
    cs: {
      name: "Czech",
      nativeName: "čeština",
    },
    cu: {
      name: "Old Church Slavonic",
      nativeName: "ѩзыкъ словѣньскъ",
    },
    cv: {
      name: "Chuvash",
      nativeName: "чӑваш чӗлхи",
    },
    cy: {
      name: "Welsh",
      nativeName: "Cymraeg",
    },
    da: {
      name: "Danish",
      nativeName: "dansk",
    },
    de: {
      name: "German",
      nativeName: "Deutsch",
    },
    dv: {
      name: "Divehi",
      nativeName: "Dhivehi",
    },
    dz: {
      name: "Dzongkha",
      nativeName: "རྫོང་ཁ",
    },
    ee: {
      name: "Ewe",
      nativeName: "Eʋegbe",
    },
    el: {
      name: "Greek",
      nativeName: "Ελληνικά",
    },
    en: {
      name: "English",
      nativeName: "English",
    },
    eo: {
      name: "Esperanto",
      nativeName: "Esperanto",
    },
    es: {
      name: "Spanish",
      nativeName: "Español",
    },
    et: {
      name: "Estonian",
      nativeName: "eesti",
    },
    eu: {
      name: "Basque",
      nativeName: "euskara",
    },
    fa: {
      name: "Persian",
      nativeName: "فارسی",
    },
    ff: {
      name: "Fula",
      nativeName: "Fulfulde",
    },
    fi: {
      name: "Finnish",
      nativeName: "suomi",
    },
    fj: {
      name: "Fijian",
      nativeName: "Vakaviti",
    },
    fo: {
      name: "Faroese",
      nativeName: "føroyskt",
    },
    fr: {
      name: "French",
      nativeName: "Français",
    },
    fy: {
      name: "Western Frisian",
      nativeName: "Frysk",
    },
    ga: {
      name: "Irish",
      nativeName: "Gaeilge",
    },
    gd: {
      name: "Scottish Gaelic",
      nativeName: "Gàidhlig",
    },
    gl: {
      name: "Galician",
      nativeName: "galego",
    },
    gn: {
      name: "Guaraní",
      nativeName: "Avañe'ẽ",
    },
    gu: {
      name: "Gujarati",
      nativeName: "ગુજરાતી",
    },
    gv: {
      name: "Manx",
      nativeName: "Gaelg",
    },
    ha: {
      name: "Hausa",
      nativeName: "هَوُسَ",
    },
    he: {
      name: "Hebrew",
      nativeName: "עברית",
    },
    hi: {
      name: "Hindi",
      nativeName: "हिन्दी",
    },
    ho: {
      name: "Hiri Motu",
      nativeName: "Hiri Motu",
    },
    hr: {
      name: "Croatian",
      nativeName: "Hrvatski",
    },
    ht: {
      name: "Haitian",
      nativeName: "Kreyòl ayisyen",
    },
    hu: {
      name: "Hungarian",
      nativeName: "magyar",
    },
    hy: {
      name: "Armenian",
      nativeName: "Հայերեն",
    },
    hz: {
      name: "Herero",
      nativeName: "Otjiherero",
    },
    ia: {
      name: "Interlingua",
      nativeName: "Interlingua",
    },
    id: {
      name: "Indonesian",
      nativeName: "Bahasa Indonesia",
    },
    ie: {
      name: "Interlingue",
      nativeName: "Interlingue",
    },
    ig: {
      name: "Igbo",
      nativeName: "Asụsụ Igbo",
    },
    ii: {
      name: "Nuosu",
      nativeName: "ꆈꌠ꒿ Nuosuhxop",
    },
    ik: {
      name: "Inupiaq",
      nativeName: "Iñupiaq",
    },
    io: {
      name: "Ido",
      nativeName: "Ido",
    },
    is: {
      name: "Icelandic",
      nativeName: "Íslenska",
    },
    it: {
      name: "Italian",
      nativeName: "Italiano",
    },
    iu: {
      name: "Inuktitut",
      nativeName: "ᐃᓄᒃᑎᑐᑦ",
    },
    ja: {
      name: "Japanese",
      nativeName: "日本語",
    },
    jv: {
      name: "Javanese",
      nativeName: "basa Jawa",
    },
    ka: {
      name: "Georgian",
      nativeName: "ქართული",
    },
    kg: {
      name: "Kongo",
      nativeName: "Kikongo",
    },
    ki: {
      name: "Kikuyu",
      nativeName: "Gĩkũyũ",
    },
    kj: {
      name: "Kwanyama",
      nativeName: "Kuanyama",
    },
    kk: {
      name: "Kazakh",
      nativeName: "қазақ тілі",
    },
    kl: {
      name: "Kalaallisut",
      nativeName: "kalaallisut",
    },
    km: {
      name: "Khmer",
      nativeName: "ខេមរភាសា",
    },
    kn: {
      name: "Kannada",
      nativeName: "ಕನ್ನಡ",
    },
    ko: {
      name: "Korean",
      nativeName: "한국어",
    },
    kr: {
      name: "Kanuri",
      nativeName: "Kanuri",
    },
    ks: {
      name: "Kashmiri",
      nativeName: "कश्मीरी",
    },
    ku: {
      name: "Kurdish",
      nativeName: "Kurdî",
    },
    kv: {
      name: "Komi",
      nativeName: "коми кыв",
    },
    kw: {
      name: "Cornish",
      nativeName: "Kernewek",
    },
    ky: {
      name: "Kyrgyz",
      nativeName: "Кыргызча",
    },
    la: {
      name: "Latin",
      nativeName: "latine",
    },
    lb: {
      name: "Luxembourgish",
      nativeName: "Lëtzebuergesch",
    },
    lg: {
      name: "Ganda",
      nativeName: "Luganda",
    },
    li: {
      name: "Limburgish",
      nativeName: "Limburgs",
    },
    ln: {
      name: "Lingala",
      nativeName: "Lingála",
    },
    lo: {
      name: "Lao",
      nativeName: "ພາສາ",
    },
    lt: {
      name: "Lithuanian",
      nativeName: "lietuvių kalba",
    },
    lu: {
      name: "Luba-Katanga",
      nativeName: "Tshiluba",
    },
    lv: {
      name: "Latvian",
      nativeName: "latviešu valoda",
    },
    mg: {
      name: "Malagasy",
      nativeName: "fiteny malagasy",
    },
    mh: {
      name: "Marshallese",
      nativeName: "Kajin M̧ajeļ",
    },
    mi: {
      name: "Māori",
      nativeName: "te reo Māori",
    },
    mk: {
      name: "Macedonian",
      nativeName: "македонски јазик",
    },
    ml: {
      name: "Malayalam",
      nativeName: "മലയാളം",
    },
    mn: {
      name: "Mongolian",
      nativeName: "Монгол хэл",
    },
    mr: {
      name: "Marathi",
      nativeName: "मराठी",
    },
    ms: {
      name: "Malay",
      nativeName: "Bahasa Malaysia",
    },
    mt: {
      name: "Maltese",
      nativeName: "Malti",
    },
    my: {
      name: "Burmese",
      nativeName: "ဗမာစာ",
    },
    na: {
      name: "Nauru",
      nativeName: "Ekakairũ Naoero",
    },
    nb: {
      name: "Norwegian Bokmål",
      nativeName: "Norsk bokmål",
    },
    nd: {
      name: "Northern Ndebele",
      nativeName: "isiNdebele",
    },
    ne: {
      name: "Nepali",
      nativeName: "नेपाली",
    },
    ng: {
      name: "Ndonga",
      nativeName: "Owambo",
    },
    nl: {
      name: "Dutch",
      nativeName: "Nederlands",
    },
    nn: {
      name: "Norwegian Nynorsk",
      nativeName: "Norsk nynorsk",
    },
    no: {
      name: "Norwegian",
      nativeName: "Norsk",
    },
    nr: {
      name: "Southern Ndebele",
      nativeName: "isiNdebele",
    },
    nv: {
      name: "Navajo",
      nativeName: "Diné bizaad",
    },
    ny: {
      name: "Chichewa",
      nativeName: "chiCheŵa",
    },
    oc: {
      name: "Occitan",
      nativeName: "occitan",
    },
    oj: {
      name: "Ojibwe",
      nativeName: "ᐊᓂᔑᓈᐯᒧᐎᓐ",
    },
    om: {
      name: "Oromo",
      nativeName: "Afaan Oromoo",
    },
    or: {
      name: "Oriya",
      nativeName: "ଓଡ଼ିଆ",
    },
    os: {
      name: "Ossetian",
      nativeName: "ирон æвзаг",
    },
    pa: {
      name: "Panjabi",
      nativeName: "ਪੰਜਾਬੀ",
    },
    pi: {
      name: "Pāli",
      nativeName: "पाऴि",
    },
    pl: {
      name: "Polish",
      nativeName: "język polski",
    },
    ps: {
      name: "Pashto",
      nativeName: "پښتو",
    },
    pt: {
      name: "Portuguese",
      nativeName: "Português",
    },
    qu: {
      name: "Quechua",
      nativeName: "Runa Simi",
    },
    rm: {
      name: "Romansh",
      nativeName: "rumantsch grischun",
    },
    rn: {
      name: "Kirundi",
      nativeName: "Ikirundi",
    },
    ro: {
      name: "Romanian",
      nativeName: "Română",
    },
    ru: {
      name: "Russian",
      nativeName: "Русский",
    },
    rw: {
      name: "Kinyarwanda",
      nativeName: "Ikinyarwanda",
    },
    sa: {
      name: "Sanskrit",
      nativeName: "संस्कृतम्",
    },
    sc: {
      name: "Sardinian",
      nativeName: "sardu",
    },
    sd: {
      name: "Sindhi",
      nativeName: "सिन्धी",
    },
    se: {
      name: "Northern Sami",
      nativeName: "Davvisámegiella",
    },
    sg: {
      name: "Sango",
      nativeName: "yângâ tî sängö",
    },
    si: {
      name: "Sinhala",
      nativeName: "සිංහල",
    },
    sk: {
      name: "Slovak",
      nativeName: "slovenčina",
    },
    sl: {
      name: "Slovenian",
      nativeName: "slovenski jezik",
    },
    sm: {
      name: "Samoan",
      nativeName: "gagana fa'a Samoa",
    },
    sn: {
      name: "Shona",
      nativeName: "chiShona",
    },
    so: {
      name: "Somali",
      nativeName: "Soomaaliga",
    },
    sq: {
      name: "Albanian",
      nativeName: "Shqip",
    },
    sr: {
      name: "Serbian",
      nativeName: "српски језик",
    },
    ss: {
      name: "Swati",
      nativeName: "SiSwati",
    },
    st: {
      name: "Southern Sotho",
      nativeName: "Sesotho",
    },
    su: {
      name: "Sundanese",
      nativeName: "Basa Sunda",
    },
    sv: {
      name: "Swedish",
      nativeName: "Svenska",
    },
    sw: {
      name: "Swahili",
      nativeName: "Kiswahili",
    },
    ta: {
      name: "Tamil",
      nativeName: "தமிழ்",
    },
    te: {
      name: "Telugu",
      nativeName: "తెలుగు",
    },
    tg: {
      name: "Tajik",
      nativeName: "тоҷикӣ",
    },
    th: {
      name: "Thai",
      nativeName: "ไทย",
    },
    ti: {
      name: "Tigrinya",
      nativeName: "ትግርኛ",
    },
    tk: {
      name: "Turkmen",
      nativeName: "Türkmen",
    },
    tl: {
      name: "Tagalog",
      nativeName: "Wikang Tagalog",
    },
    tn: {
      name: "Tswana",
      nativeName: "Setswana",
    },
    to: {
      name: "Tonga",
      nativeName: "faka Tonga",
    },
    tr: {
      name: "Turkish",
      nativeName: "Türkçe",
    },
    ts: {
      name: "Tsonga",
      nativeName: "Xitsonga",
    },
    tt: {
      name: "Tatar",
      nativeName: "татар теле",
    },
    tw: {
      name: "Twi",
      nativeName: "Twi",
    },
    ty: {
      name: "Tahitian",
      nativeName: "Reo Tahiti",
    },
    ug: {
      name: "Uyghur",
      nativeName: "ئۇيغۇرچە‎",
    },
    uk: {
      name: "Ukrainian",
      nativeName: "Українська",
    },
    ur: {
      name: "Urdu",
      nativeName: "اردو",
    },
    uz: {
      name: "Uzbek",
      nativeName: "Ўзбек",
    },
    ve: {
      name: "Venda",
      nativeName: "Tshivenḓa",
    },
    vi: {
      name: "Vietnamese",
      nativeName: "Tiếng Việt",
    },
    vo: {
      name: "Volapük",
      nativeName: "Volapük",
    },
    wa: {
      name: "Walloon",
      nativeName: "walon",
    },
    wo: {
      name: "Wolof",
      nativeName: "Wollof",
    },
    xh: {
      name: "Xhosa",
      nativeName: "isiXhosa",
    },
    yi: {
      name: "Yiddish",
      nativeName: "ייִדיש",
    },
    yo: {
      name: "Yoruba",
      nativeName: "Yorùbá",
    },
    za: {
      name: "Zhuang",
      nativeName: "Saɯ cueŋƅ",
    },
    zh: {
      name: "Chinese",
      nativeName: "中文",
    },
    zu: {
      name: "Zulu",
      nativeName: "isiZulu",
    },
  };

  class ISO6391 {
    static getLanguages(codes = []) {
      return codes.map((code) => ({
        code,
        name: ISO6391.getName(code),
        nativeName: ISO6391.getNativeName(code),
      }));
    }

    static getName(code) {
      return ISO6391.validate(code) ? LANGUAGES_LIST[code].name : "";
    }

    static getAllNames() {
      return Object.values(LANGUAGES_LIST).map((l) => l.name);
    }

    static getNativeName(code) {
      return ISO6391.validate(code) ? LANGUAGES_LIST[code].nativeName : "";
    }

    static getAllNativeNames() {
      return Object.values(LANGUAGES_LIST).map((l) => l.nativeName);
    }

    static getCode(name) {
      const code = Object.keys(LANGUAGES_LIST).find((code) => {
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
      return LANGUAGES_LIST.hasOwnProperty(code);
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
    textDict.forEach(function (o) {
      o.el.textContent = o.dict[userLang];
    });
    ISO6391.getAllCodes().forEach(function (lang) {
      lang === userLang
        ? document.querySelectorAll(".wm-".concat(lang)).forEach(function (el) {
            return (el.style.display = el.dataset.wmDisplay);
          })
        : document.querySelectorAll(".wm-".concat(lang)).forEach(function (el) {
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
    return Array.from(el.childNodes).reduce(function (acc, node) {
      return acc + (node.nodeType === 3 ? node.textContent : "");
    }, "");
  }

  window.addEventListener("DOMContentLoaded", function () {
    var langs = new Set();
    userLang = getLangParam() || getLangFromStorage() || userLang;

    if (isStorageEnabled) {
      localStorage.setItem("lang", userLang);
    }

    ISO6391.getAllCodes().forEach(function (lang) {
      document.querySelectorAll(".wm-".concat(lang)).forEach(function (el) {
        return (el.dataset.wmDisplay = el.style.display);
      });
    });
    textNodesUnder(document)
      .filter(function (node) {
        return langRegExp.test(parentElTextOnly(node.parentElement));
      })
      .forEach(function (node, i) {
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
          dict: dict,
        });
      });
    console.log("[wm] documentLang:", documentLang);
    documentLang = DocumentLang(langs, userLang);
    applyLang();
  }); /////////////////////////

  window.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-wm-sel]").forEach(function (el) {
      el.addEventListener("click", function (evt) {
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
      curVal: curVal,
    };
  }

  window.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-wm-switch]").forEach(function (el) {
      if (documentLang.curVal() === userLang) {
        el.textContent = ISO6391.getName(documentLang.nextVal());
      } else {
        el.textContent = ISO6391.getName(documentLang.curVal());
      }

      el.addEventListener("click", function (evt) {
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
