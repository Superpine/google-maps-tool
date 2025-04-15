function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var noop = {value: () => {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none() {}

function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function array(x) {
  return typeof x === "object" && "length" in x
    ? x // Array, TypedArray, NodeList, array-like
    : Array.from(x); // Map, Set, iterable, string, or anything else
}

function empty() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

function arrayAll(select) {
  return function() {
    var group = select.apply(this, arguments);
    return group == null ? [] : array(group);
  };
}

function selection_selectAll(select) {
  if (typeof select === "function") select = arrayAll(select);
  else select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
}

function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}

var find = Array.prototype.find;

function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}

function childFirst() {
  return this.firstElementChild;
}

function selection_selectChild(match) {
  return this.select(match == null ? childFirst
      : childFind(typeof match === "function" ? match : childMatcher(match)));
}

var filter = Array.prototype.filter;

function children() {
  return this.children;
}

function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}

function selection_selectChildren(match) {
  return this.selectAll(match == null ? children
      : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant(x) {
  return function() {
    return x;
  };
}

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = new Map,
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
      exit[i] = node;
    }
  }
}

function datum(node) {
  return node.__data__;
}

function selection_data(value, key) {
  if (!arguments.length) return Array.from(this, datum);

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = array(value.call(parent, parent && parent.__data__, j, parents)),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

function selection_exit() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge(selection) {
  if (!(selection instanceof Selection)) throw new Error("invalid merge");

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  return Array.from(this);
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  let size = 0;
  for (const node of this) ++size; // eslint-disable-line no-unused-vars
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}

function parseTypenames$1(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, options) {
  var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
  return this;
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

function* selection_iterator() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) yield node;
    }
  }
}

var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection_selection() {
  return this;
}

Selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  selectChild: selection_selectChild,
  selectChildren: selection_selectChildren,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  selection: selection_selection,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch,
  [Symbol.iterator]: selection_iterator
};

function select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
}

function sourceEvent(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent) event = sourceEvent;
  return event;
}

function pointer(event, node) {
  event = sourceEvent(event);
  if (node === undefined) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

function selectAll(selector) {
  return typeof selector === "string"
      ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
      : new Selection([selector == null ? [] : array(selector)], root);
}

function nopropagation(event) {
  event.stopImmediatePropagation();
}

function noevent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

function nodrag(view) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", noevent, true);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent, true);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

var constant$1 = x => () => x;

function DragEvent(type, {
  sourceEvent,
  subject,
  target,
  identifier,
  active,
  x, y, dx, dy,
  dispatch
}) {
  Object.defineProperties(this, {
    type: {value: type, enumerable: true, configurable: true},
    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
    subject: {value: subject, enumerable: true, configurable: true},
    target: {value: target, enumerable: true, configurable: true},
    identifier: {value: identifier, enumerable: true, configurable: true},
    active: {value: active, enumerable: true, configurable: true},
    x: {value: x, enumerable: true, configurable: true},
    y: {value: y, enumerable: true, configurable: true},
    dx: {value: dx, enumerable: true, configurable: true},
    dy: {value: dy, enumerable: true, configurable: true},
    _: {value: dispatch}
  });
}

DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// Ignore right-click, since that should open the context menu.
function defaultFilter(event) {
  return !event.ctrlKey && !event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(event, d) {
  return d == null ? {x: event.x, y: event.y} : d;
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

function drag() {
  var filter = defaultFilter,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable,
      gestures = {},
      listeners = dispatch("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection) {
    selection
        .on("mousedown.drag", mousedowned)
      .filter(touchable)
        .on("touchstart.drag", touchstarted)
        .on("touchmove.drag", touchmoved)
        .on("touchend.drag touchcancel.drag", touchended)
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned(event, d) {
    if (touchending || !filter.call(this, event, d)) return;
    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
    if (!gesture) return;
    select(event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
    nodrag(event.view);
    nopropagation(event);
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start", event);
  }

  function mousemoved(event) {
    noevent(event);
    if (!mousemoving) {
      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag", event);
  }

  function mouseupped(event) {
    select(event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event.view, mousemoving);
    noevent(event);
    gestures.mouse("end", event);
  }

  function touchstarted(event, d) {
    if (!filter.call(this, event, d)) return;
    var touches = event.changedTouches,
        c = container.call(this, event, d),
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
        nopropagation(event);
        gesture("start", event, touches[i]);
      }
    }
  }

  function touchmoved(event) {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent(event);
        gesture("drag", event, touches[i]);
      }
    }
  }

  function touchended(event) {
    var touches = event.changedTouches,
        n = touches.length, i, gesture;

    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation(event);
        gesture("end", event, touches[i]);
      }
    }
  }

  function beforestart(that, container, event, d, identifier, touch) {
    var dispatch = listeners.copy(),
        p = pointer(touch || event, container), dx, dy,
        s;

    if ((s = subject.call(that, new DragEvent("beforestart", {
        sourceEvent: event,
        target: drag,
        identifier,
        active,
        x: p[0],
        y: p[1],
        dx: 0,
        dy: 0,
        dispatch
      }), d)) == null) return;

    dx = s.x - p[0] || 0;
    dy = s.y - p[1] || 0;

    return function gesture(type, event, touch) {
      var p0 = p, n;
      switch (type) {
        case "start": gestures[identifier] = gesture, n = active++; break;
        case "end": delete gestures[identifier], --active; // nobreak
        case "drag": p = pointer(touch || event, container), n = active; break;
      }
      dispatch.call(
        type,
        that,
        new DragEvent(type, {
          sourceEvent: event,
          subject: s,
          target: drag,
          identifier,
          active: n,
          x: p[0] + dx,
          y: p[1] + dy,
          dx: p[0] - p0[0],
          dy: p[1] - p0[1],
          dispatch
        }),
        d
      );
    };
  }

  drag.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$1(!!_), drag) : filter;
  };

  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant$1(_), drag) : container;
  };

  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant$1(_), drag) : subject;
  };

  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$1(!!_), drag) : touchable;
  };

  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
}

var i18n = {
  en: {
    tooltipText1: 'Drag to change, click to remove',
    tooltipText2: 'Drag to change'
  },
  it: {
    tooltipText1: 'Trascina per modificare, fai clic per rimuovere',
    tooltipText2: 'Trascina per modificare'
  },
  zh: {
    tooltipText1: '拖动即可更改，点击即可删除',
    tooltipText2: '拖动即可更改'
  },
  es: {
    tooltipText1: 'Arrastra para cambiar, haz clic para quitar',
    tooltipText2: 'Arrastra para cambiar'
  },
  de: {
    tooltipText1: 'Zum Ändern ziehen, zum Entfernen klicken',
    tooltipText2: 'Zum Ändern ziehen'
  },
  fr: {
    tooltipText1: 'Faites glisser pour modifier, cliquez pour supprimer',
    tooltipText2: 'Faites glisser pour modifier'
  },
  pt: {
    tooltipText1: 'Arraste para alterar, clique para remover',
    tooltipText2: 'Arraste para alterar'
  }
};

var defaultLangCode = 'en';

var getProp = function getProp(langCode, prop) {
  if (i18n[langCode]) {
    return i18n[langCode][prop];
  }

  var code = langCode.split('-')[0];

  if (i18n[code]) {
    return i18n[code][prop];
  }

  return i18n[defaultLangCode][prop];
};

var Config = {
  prefix: 'measure-tool',
  tooltipText1: function tooltipText1() {
    var langCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultLangCode;
    return getProp(langCode, 'tooltipText1');
  },
  tooltipText2: function tooltipText2() {
    var langCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultLangCode;
    return getProp(langCode, 'tooltipText2');
  }
};

var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

var css = ".measure-tool-context-menu {\n  font-family: Roboto, Arial, sans-serif;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  outline: none;\n  position: fixed;\n  display: none;\n  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);\n  transform: translate3d(0, 0, 0);\n  max-width: 265px;\n  z-index: 1;\n  outline-offset: -2px;\n  background: #fff;\n  padding: 6px 0;\n  white-space: nowrap;\n  cursor: default;\n  margin: 0; }\n  .measure-tool-context-menu ul {\n    padding: 0px;\n    margin: 0px;\n    background-color: white; }\n    .measure-tool-context-menu ul li {\n      cursor: pointer;\n      display: flex;\n      align-items: center;\n      border-color: transparent;\n      border-style: dotted;\n      border-width: 1px 0;\n      color: #333;\n      font-size: 13px;\n      font-weight: normal;\n      margin: 0;\n      padding: 4px 44px 4px 16px;\n      position: relative;\n      white-space: nowrap; }\n      .measure-tool-context-menu ul li:hover {\n        background-color: #f1f1f1;\n        border-color: #f1f1f1;\n        color: #222;\n        transition: background 0s; }\n";
n(css,{});

var ContextMenu = /*#__PURE__*/function () {
  _createClass(ContextMenu, [{
    key: "left",
    get: function get() {
      return this._containerDiv.getBoundingClientRect().left;
    }
  }, {
    key: "top",
    get: function get() {
      return this._containerDiv.getBoundingClientRect().top;
    }
  }, {
    key: "width",
    get: function get() {
      return this._containerDiv.getBoundingClientRect().width;
    }
  }, {
    key: "height",
    get: function get() {
      return this._containerDiv.getBoundingClientRect().height;
    }
  }]);

  function ContextMenu(div, options) {
    _classCallCheck(this, ContextMenu);

    this._defaultOptions = {
      width: 150
    };
    this._options = Object.assign({}, this._defaultOptions, options || {});
    this._parentDiv = div;
    this._containerDiv = document.createElement('div');

    this._containerDiv.classList.add("".concat(Config.prefix, "-context-menu"));

    this._containerDiv.stylesheet = css;

    this._containerDiv.oncontextmenu = function (event) {
      return event.preventDefault();
    };

    this._list = document.createElement('ul');

    this._containerDiv.appendChild(this._list);

    div.appendChild(this._containerDiv);
    this._isVisible = false;
  }

  _createClass(ContextMenu, [{
    key: "addItem",
    value: function addItem(name, isVisible, cb) {
      var _this = this;

      var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this;
      var item = document.createElement('li');
      var content = document.createTextNode(name);
      item.appendChild(content);

      item.onclick = function (e) {
        e.preventDefault();
        cb.apply(context);

        _this.hide();
      };

      if (isVisible) {
        this.showItem(item);
      } else {
        this.hideItem(item);
      }

      this._list.appendChild(item);

      return item;
    }
  }, {
    key: "hideItem",
    value: function hideItem(item) {
      item.style.cssText = "display: none";
    }
  }, {
    key: "showItem",
    value: function showItem(item) {
      item.style.cssText = "display: block";
    }
  }, {
    key: "toggleItems",
    value: function toggleItems(itemsToShow, itemsToHide) {
      var _this2 = this;

      itemsToShow.forEach(function (item) {
        return _this2.showItem(item);
      });
      itemsToHide.forEach(function (item) {
        return _this2.hideItem(item);
      });
    }
  }, {
    key: "show",
    value: function show(point) {
      this._isVisible = true;
      this._containerDiv.style.cssText = "\n      display: block;\n      visibility: hidden;\n      position: absolute;\n      width: ".concat(this._options.width, "px; \n    ");
      var isXOverflow = this._parentDiv.getBoundingClientRect().width <= point.x + this.width;
      var isYOverflow = this._parentDiv.getBoundingClientRect().height <= point.y + this.height;
      this._containerDiv.style.cssText += "\n      ".concat(isXOverflow ? 'right: 0px;' : 'left: ' + point.x + 'px;', "\n      ").concat(isYOverflow ? 'bottom: 14px;' : 'top: ' + point.y + 'px;', "\n      visibility: visible;\n    ");
    }
  }, {
    key: "hide",
    value: function hide() {
      this._isVisible = false;
      this._containerDiv.style.cssText = "display: none";
    }
  }, {
    key: "toggle",
    value: function toggle(point) {
      if (this._isVisible) {
        this.hide();
      } else {
        this.show(point);
      }
    }
  }]);

  return ContextMenu;
}();

var css$1 = ".measure-tool-tooltip {\n  display: none;\n  font-family: Roboto, Arial, sans-serif;\n  margin: 6px 15px;\n  background-color: #fff;\n  border-radius: 2px;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);\n  padding: 10px;\n  overflow: hidden;\n  pointer-events: none;\n  font-size: 0.7rem;\n  z-index: 999; }\n";
n(css$1,{});

var Tooltip = /*#__PURE__*/function () {
  function Tooltip(div) {
    _classCallCheck(this, Tooltip);

    this._parentDiv = div;
    this._containerDiv = document.createElement('div');

    this._containerDiv.classList.add("".concat(Config.prefix, "-tooltip"));

    this._containerDiv.stylesheet = css$1;
    div.appendChild(this._containerDiv);
  }

  _createClass(Tooltip, [{
    key: "show",
    value: function show(point, text) {
      this._containerDiv.innerHTML = text;
      this._containerDiv.style.cssText = "\n      display: block;\n      visibility: hidden;\n      position: absolute;\n    ";

      var w = this._parentDiv.getBoundingClientRect().width;

      var h = this._parentDiv.getBoundingClientRect().height;

      this._containerDiv.style.cssText += point.x < w / 2 ? "left: ".concat(point.x, "px;") : "right: ".concat(w - point.x, "px;");
      this._containerDiv.style.cssText += point.y < h / 2 ? "top: ".concat(point.y, "px") : "bottom: ".concat(h - point.y, "px;");
      this._containerDiv.style.cssText += 'visibility: visible;';
    }
  }, {
    key: "hide",
    value: function hide() {
      this._containerDiv.style.cssText = 'display: none';
    }
  }]);

  return Tooltip;
}();

var ProjectionUtility = /*#__PURE__*/function () {
  function ProjectionUtility(div, projection, options) {
    _classCallCheck(this, ProjectionUtility);

    this._defaultOptions = {
      offsetRate: 8000
    };
    this._options = Object.assign({}, this._defaultOptions, options || {});
    this._container = div;
    this._projection = projection;
  }

  _createClass(ProjectionUtility, [{
    key: "latLngToSvgPoint",
    value: function latLngToSvgPoint(coords) {
      var rate = this._options.offsetRate / 2;
      var latLng = new google.maps.LatLng(coords[1], coords[0]);

      var svgPoint = this._projection.fromLatLngToDivPixel(latLng);

      return [svgPoint.x + rate, svgPoint.y + rate];
    }
  }, {
    key: "svgPointToLatLng",
    value: function svgPointToLatLng(point) {
      var rate = this._options.offsetRate / 2;
      var svgPoint = new google.maps.Point(point[0] - rate, point[1] - rate);

      var coords = this._projection.fromDivPixelToLatLng(svgPoint);

      return [coords.lng(), coords.lat()];
    }
  }, {
    key: "svgPointToContainerPoint",
    value: function svgPointToContainerPoint(point) {
      var svgPoint = this.svgPointToLatLng(point);
      return this._projection.fromLatLngToContainerPixel(new google.maps.LatLng(svgPoint[1], svgPoint[0]));
    }
  }, {
    key: "latLngToContainerPoint",
    value: function latLngToContainerPoint(coords) {
      return this._projection.fromLatLngToContainerPixel(new google.maps.LatLng(coords[1], coords[0]));
    }
  }]);

  return ProjectionUtility;
}();

var Geometry = /*#__PURE__*/function () {
  _createClass(Geometry, [{
    key: "nodes",
    get: function get() {
      return Object.assign([], this._nodes);
    }
  }, {
    key: "lines",
    get: function get() {
      var segments = [];

      if (this._nodes.length > 1) {
        for (var i = 1; i < this._nodes.length; i++) {
          segments.push([this._nodes[i - 1], this._nodes[i]]);
        }
      }

      return segments;
    }
  }]);

  function Geometry() {
    _classCallCheck(this, Geometry);

    this._nodes = [];
  }

  _createClass(Geometry, [{
    key: "addNode",
    value: function addNode(point) {
      this._nodes.push(point);
    }
  }, {
    key: "updateNode",
    value: function updateNode(i, newPoint) {
      this._nodes[i] = newPoint;
    }
  }, {
    key: "removeNode",
    value: function removeNode(i) {
      this._nodes.splice(i, 1);
    }
  }, {
    key: "insertNode",
    value: function insertNode(i, point) {
      this._nodes.splice(i, 0, point);
    }
  }]);

  return Geometry;
}();

var Segment = /*#__PURE__*/function () {
  function Segment(start, end, length, lengthText) {
    _classCallCheck(this, Segment);

    this._start = start;
    this._end = end;
    this._length = length;
    this._lengthText = lengthText;
  }

  _createClass(Segment, [{
    key: "toJSON",
    value: function toJSON() {
      return {
        start_location: {
          lat: this._start[1],
          lng: this._start[0]
        },
        end_location: {
          lat: this._end[1],
          lng: this._end[0]
        },
        length: {
          text: this._lengthText,
          value: this._length
        }
      };
    }
  }]);

  return Segment;
}();

var UnitTypeId = {
  METRIC: 'metric',
  IMPERIAL: 'imperial',
  NAUTICAL: 'nautical'
};

var Helper = /*#__PURE__*/function () {
  function Helper(options) {
    _classCallCheck(this, Helper);

    this._options = {
      unit: UnitTypeId.METRIC
    };
    Object.assign(this._options, options);
    this.init();
  }

  _createClass(Helper, [{
    key: "init",
    value: function init() {
      this.initUnits();
    }
  }, {
    key: "initUnits",
    value: function initUnits() {
      switch (this._options.unit.toLowerCase()) {
        case UnitTypeId.METRIC:
          this._lengthMultiplier = 1;
          this.formatLength = this._formatLengthMetric;
          this._areaMultiplier = 1;
          this.formatArea = this._formatAreaMetric;
          break;

        case UnitTypeId.IMPERIAL:
          this._lengthMultiplier = 3.28084;
          this.formatLength = this._formatLengthImperial;
          this._areaMultiplier = 10.7639;
          this.formatArea = this._formatAreaImperial;
          break;

        case UnitTypeId.NAUTICAL:
          this._lengthMultiplier = 1;
          this.formatLength = this._formatLengthNautical;
          this._areaMultiplier = 1;
          this.formatArea = this._formatAreaMetric;
          break;

        default:
          this._lengthMultiplier = 1;
          this.formatLength = this._formatLengthMetric;
          this._areaMultiplier = 1;
          this.formatArea = this._formatAreaMetric;
          break;
      }
    }
    /**
     * Updates a configuration option with a new value.  This is passed from the main index.js setOption function
     * @param option - option to update
     * @param value - value to set
     */

  }, {
    key: "setOption",
    value: function setOption(option, value) {
      if (!this._options[option]) {
        throw new Error("".concat(option, " is not a valid option on MeasureTool helper"));
      } // TODO: figure out some option validation


      this._options[option] = value;
      this.initUnits();
    }
    /**
     * Calculate the distance in meters between two points.
     * @param p1
     * @param p2
     * @return {*}
     */

  }, {
    key: "computeLengthBetween",
    value: function computeLengthBetween(p1, p2) {
      return google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(p1[1], p1[0]), new google.maps.LatLng(p2[1], p2[0])) * this._lengthMultiplier;
    }
  }, {
    key: "computePathLength",
    value: function computePathLength(points) {
      var sum = 0;

      for (var i = 1; i < points.length; i++) {
        sum += google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(points[i - 1][1], points[i - 1][0]), new google.maps.LatLng(points[i][1], points[i][0]));
      }

      return sum * this._lengthMultiplier;
    }
  }, {
    key: "computeArea",
    value: function computeArea(points) {
      return google.maps.geometry.spherical.computeArea(points.map(function (p) {
        return new google.maps.LatLng(p[1], p[0]);
      })) * this._areaMultiplier;
    }
  }, {
    key: "_formatLengthMetric",
    value: function _formatLengthMetric(value) {
      var unit;

      if (value / 1000 >= 1) {
        unit = 'km';
        value /= 1000;
      } else {
        unit = 'm';
      }

      return this._numberToLocale(this._roundUp(value, 2)) + ' ' + unit;
    }
  }, {
    key: "_formatLengthImperial",
    value: function _formatLengthImperial(value) {
      var unit;

      if (value / 5280 >= 1) {
        unit = 'mi';
        value /= 5280;
      } else {
        unit = 'ft';
      }

      return this._numberToLocale(this._roundUp(value, 2)) + ' ' + unit;
    }
  }, {
    key: "_formatLengthNautical",
    value: function _formatLengthNautical(value) {
      var unit = 'NM';
      value /= 1852;
      return this._numberToLocale(this._roundUp(value, 2)) + ' ' + unit;
    }
  }, {
    key: "_formatAreaMetric",
    value: function _formatAreaMetric(value) {
      var unit;

      if (value / 1000000 >= 1) {
        unit = 'km²';
        value /= 1000000;
      } else {
        unit = 'm²';
      }

      return this._numberToLocale(this._roundUp(value, 2)) + ' ' + unit;
    }
  }, {
    key: "_formatAreaImperial",
    value: function _formatAreaImperial(value) {
      var unit;

      if (value * 3.587e-8 >= 1) {
        unit = 'mi²';
        value *= 3.587e-8;
      } else {
        unit = 'ft²';
      }

      return this._numberToLocale(this._roundUp(value, 2)) + ' ' + unit;
    }
  }, {
    key: "_roundUp",
    value: function _roundUp(value, decimals) {
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals);
    }
  }, {
    key: "_numberToLocale",
    value: function _numberToLocale(number) {
      return new Intl.NumberFormat().format(number);
    }
    /**
     * Calculate the LatLng which lies the given fraction of the way between the origin LatLng and the destination LatLng.
     * @param p1
     * @param p2
     * @param fraction
     * @return {*}
     * @private
     */

  }], [{
    key: "findTouchPoint",
    value: function findTouchPoint(segment, point) {
      var k = ((segment[1][1] - segment[0][1]) * (point[0] - segment[0][0]) - (segment[1][0] - segment[0][0]) * (point[1] - segment[0][1])) / (Math.pow(segment[1][1] - segment[0][1], 2) + Math.pow(segment[1][0] - segment[0][0], 2));
      return [point[0] - k * (segment[1][1] - segment[0][1]), point[1] + k * (segment[1][0] - segment[0][0])];
    }
  }, {
    key: "findMidPoint",
    value: function findMidPoint(segment) {
      return [(segment[0][0] + segment[1][0]) / 2, (segment[0][1] + segment[1][1]) / 2];
    }
  }, {
    key: "transformText",
    value: function transformText(p1, p2) {
      var mid = Helper.findMidPoint([p1, p2]);
      var angle;

      if (p1[0] === p2[0]) {
        if (p2[1] > p1[1]) angle = 90;else if (p2[1] < p1[1]) angle = 270;else angle = 0;
      } else {
        angle = Math.atan((p2[1] - p1[1]) / (p2[0] - p1[0])) * 180 / Math.PI;
      }

      return "translate(".concat(mid[0], ", ").concat(mid[1], ") rotate(").concat(angle, ")");
    }
  }, {
    key: "makeId",
    value: function makeId(n) {
      return (Math.random().toString(36) + '00000000000000000').slice(2, n + 2);
    }
  }, {
    key: "_interpolate",
    value: function _interpolate(p1, p2, fraction) {
      var point = google.maps.geometry.spherical.interpolate(new google.maps.LatLng(p1[1], p1[0]), new google.maps.LatLng(p2[1], p2[0]), fraction);
      return [point.lng(), point.lat()]; // use interception equation y = mx + b
      // let m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
      // let b = p1[1] - m * p1[0];
      // let x = p1[0] + (p2[0] - p1[0]) * fraction;
      // let y = m * x + b;
      // return [x, y];
    }
  }]);

  return Helper;
}();

var EVENT_START = 'measure_start';
var EVENT_END = 'measure_end';
var EVENT_CHANGE = 'measure_change';

var ObjectAssign = function ObjectAssign() {
  if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {

      if (target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      target = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];

        if (source !== null) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }

      return target;
    };
  }
};

/**
 * Deep Clone Implementation
 * https://stackoverflow.com/a/4460624/2161568
 * @param item
 * @return {*}
 */
var deepClone = function deepClone(item) {
  if (!item) {
    return item;
  } // null, undefined values check


  var types = [Number, String, Boolean],
      result; // normalizing primitives if someone did new String('aaa'), or new Number('444');

  types.forEach(function (type) {
    if (item instanceof type) {
      result = type(item);
    }
  });

  if (typeof result === 'undefined') {
    if (Object.prototype.toString.call(item) === '[object Array]') {
      result = [];
      item.forEach(function (child, index, array) {
        result[index] = deepClone(child);
      });
    } else if (_typeof(item) === 'object') {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode === 'function') {
        result = item.cloneNode(true);
      } else if (!item.prototype) {
        // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item);
        } else {
          // it is an object literal
          result = {};

          for (var i in item) {
            result[i] = deepClone(item[i]);
          }
        }
      } else {
        // depending what you would like here,
        // just keep the reference, or create new object
        {
          result = item;
        }
      }
    } else {
      result = item;
    }
  }

  return result;
};
var getClass = function getClass(name) {
  var inverted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return inverted ? "".concat(name, " inverted") : name;
};

var css$2 = ".measure-tool-svg-overlay {\n  position: absolute;\n  top: -4000px;\n  left: -4000px;\n  width: 8000px;\n  height: 8000px; }\n\n.cover-circle {\n  fill: white;\n  stroke: black;\n  stroke-width: 2.5px; }\n\n.touch-circle {\n  fill: transparent;\n  cursor: pointer; }\n\n.grey-circle {\n  fill: #fcfcfc;\n  stroke: #646464;\n  stroke-width: 2.5px;\n  pointer-events: none; }\n\n.base-line {\n  fill: none;\n  stroke: black;\n  stroke-width: 2.5px; }\n  .base-line.inverted {\n    stroke: white; }\n\n.aux-line {\n  fill: none;\n  stroke: transparent;\n  stroke-width: 12px;\n  cursor: pointer; }\n\n.segment-measure-text {\n  pointer-events: none;\n  stroke: black;\n  text-shadow: -2.4px -2.4px rgba(255, 255, 255, 0.4), -2.4px 2.4px rgba(255, 255, 255, 0.4), 2.4px 2.4px rgba(255, 255, 255, 0.4), 2.4px -2.4px rgba(255, 255, 255, 0.4), -2.4px 0 rgba(255, 255, 255, 0.4), 0 2.4px rgba(255, 255, 255, 0.4), 2.4px 0 rgba(255, 255, 255, 0.4), 0 -2.4px rgba(255, 255, 255, 0.4); }\n  .segment-measure-text.inverted {\n    stroke: white;\n    text-shadow: -2.4px -2.4px black, -2.4px 2.4px black, 2.4px 2.4px black, 2.4px -2.4px black, -2.4px 0 black, 0 2.4px black, 2.4px 0 black, 0 -2.4px black; }\n\n.node-measure-text {\n  stroke: black;\n  text-shadow: -2.4px -2.4px rgba(255, 255, 255, 0.4), -2.4px 2.4px rgba(255, 255, 255, 0.4), 2.4px 2.4px rgba(255, 255, 255, 0.4), 2.4px -2.4px rgba(255, 255, 255, 0.4), -2.4px 0 rgba(255, 255, 255, 0.4), 0 2.4px rgba(255, 255, 255, 0.4), 2.4px 0 rgba(255, 255, 255, 0.4), 0 -2.4px rgba(255, 255, 255, 0.4);\n  pointer-events: none; }\n  .node-measure-text.inverted {\n    stroke: white;\n    text-shadow: -2.4px -2.4px black, -2.4px 2.4px black, 2.4px 2.4px black, 2.4px -2.4px black, -2.4px 0 black, 0 2.4px black, 2.4px 0 black, 0 -2.4px black; }\n  .node-measure-text.head-text {\n    visibility: hidden; }\n";
n(css$2,{});

var nodeTargetRadius = 5;
var nodeTargetExpandRadius = 6;
var touchTargetRadius = 12;

var MeasureTool = /*#__PURE__*/function () {
  _createClass(MeasureTool, [{
    key: "lengthText",
    get: function get() {
      return this._helper.formatLength(this._length || 0);
    }
  }, {
    key: "areaText",
    get: function get() {
      return this._helper.formatArea(this._area || 0);
    }
  }, {
    key: "length",
    get: function get() {
      return this._length || 0;
    }
  }, {
    key: "area",
    get: function get() {
      return this._area || 0;
    }
  }, {
    key: "segments",
    get: function get() {
      return deepClone(this._segments) || [];
    }
  }, {
    key: "points",
    get: function get() {
      return deepClone(this._geometry.nodes.map(function (x) {
        return {
          lat: x[1],
          lng: x[0]
        };
      })) || [];
    }
  }], [{
    key: "UnitTypeId",
    get: function get() {
      return UnitTypeId;
    }
    /**
     * Creates a new measure tool for the google.maps.Map instance.
     * @param map - {google.maps.Map} instance.
     * @param options {MeasureToolOptions}
     */

  }]);

  function MeasureTool(map, options) {
    _classCallCheck(this, MeasureTool);

    MeasureTool._initPolyfills();

    this._options = _objectSpread2({
      showSegmentLength: true,
      showAccumulativeLength: true,
      contextMenu: true,
      tooltip: true,
      unit: UnitTypeId.METRIC,
      initialSegments: [],
      language: navigator ? navigator.language : 'en',
      invertColor: false
    }, options);
    this._map = map;

    this._map.setClickableIcons(false);

    this._id = Helper.makeId(4);
    this._events = new Map();
    this._geometry = new Geometry();

    this._init();
  }

  _createClass(MeasureTool, [{
    key: "_init",
    value: function _init() {
      this._containerDiv = this._map.getDiv().querySelector('div:first-child');

      if (this._options.contextMenu) {
        this._contextMenu = new ContextMenu(this._containerDiv, {
          width: 160
        });
        this._startElementNode = this._contextMenu.addItem('Measure distance', true, this.start, this);
        this._endElementNode = this._contextMenu.addItem('Clear measurement', false, this.end, this);

        this._bindToggleContextMenu();
      }

      if (this._options.tooltip) {
        this._tooltip = new Tooltip(this._containerDiv);
      }

      this._helper = new Helper({
        unit: this._options.unit
      });

      this._initOverlay();
    }
  }, {
    key: "_bindToggleContextMenu",
    value: function _bindToggleContextMenu() {
      var _this = this;

      this._map.addListener('contextmenu', function (mouseEvent) {
        _this._firstClick = mouseEvent;

        _this._contextMenu.show(_this._projection.fromLatLngToContainerPixel(mouseEvent.latLng));
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' || event.which === 27) {
          _this._contextMenu.hide();
        }
      });

      this._containerDiv.addEventListener('mousedown', function (event) {
        if (event.clientX >= _this._contextMenu.left && event.clientX <= _this._contextMenu.left + _this._contextMenu.width && event.clientY >= _this._contextMenu.top && event.clientY <= _this._contextMenu.top + _this._contextMenu.height) {
          return;
        }

        _this._contextMenu.hide();
      });
    }
    /**
     * start measuring
     * @param {SegmentPoint[]} initialPoints - an array of {SegmentPoint} to initialize the measurement.
     */

  }, {
    key: "start",
    value: function start(initialPoints) {
      var _this2 = this;

      if (this._started) return;

      this._overlay.setMap(this._map);

      this._geometry = new Geometry();
      this._segments = [];
      var hasInitialPoints = initialPoints && initialPoints.length > 0;

      if (!this._options.contextMenu && hasInitialPoints) {
        for (var i = 0; i < initialPoints.length; i++) {
          var p = initialPoints[i];

          this._geometry.addNode([p.lng, p.lat]);

          if (i > 0) {
            var p0 = initialPoints[i - 1];

            this._updateSegment([p0, p]);
          }
        }
      }

      if (this._options.contextMenu && this._firstClick) {
        this._checkClick(this._firstClick);

        this._contextMenu.toggleItems([this._endElementNode], [this._startElementNode]);
      }

      this._mapClickEvent = this._map.addListener('click', function (mouseEvent) {
        return _this2._checkClick(mouseEvent);
      });

      this._map.setOptions({
        draggableCursor: 'default'
      });

      this._started = true;

      if (typeof this._events.get(EVENT_START) === 'function') {
        this._events.get(EVENT_START)();
      }
    }
    /**
     * end measuring
     */

  }, {
    key: "end",
    value: function end() {
      if (!this._started) return;

      if (typeof this._events.get(EVENT_END) === 'function') {
        this._events.get(EVENT_END)(this._getResults());
      }

      if (this._options.contextMenu) {
        this._contextMenu.toggleItems([this._startElementNode], [this._endElementNode]);
      }

      this._mapClickEvent.remove();

      this._geometry = new Geometry();

      this._onRemoveOverlay();

      this._setOverlay();

      this._overlay.setMap(null);

      this._map.setOptions({
        draggableCursor: null
      });

      this._hideTooltip();

      this._started = false;
    }
    /**
     * register an event
     * @param event - available events: 'measure-start', 'measure-end'
     * @param cb - callback function
     */

  }, {
    key: "addListener",
    value: function addListener(event, cb) {
      this._events.set(event, cb);
    }
    /**
     * unregister an event
     * @param event - available events: 'measure-start', 'measure-end'
     */

  }, {
    key: "removeListener",
    value: function removeListener(event) {
      this._events.delete(event);
    }
    /**
     * Updates a configuration option with a new value
     * @param option - option to update
     * @param value - value to set
     */

  }, {
    key: "setOption",
    value: function setOption(option, value) {
      if (this._options[option] === undefined) {
        throw new Error("".concat(option, " is not a valid option on MeasureTool"));
      } // TODO: figure out some option validation


      this._options[option] = value; // if this is an option that exists on the helper, try to set it there as well

      if (this._helper._options[option]) {
        this._helper.setOption(option, value);
      } // update any values that might be there


      if (this._overlay && this._nodeCircles) {
        // only do this if there is actually an overlay to re-render
        this._redrawOverlay();
      }
    }
  }, {
    key: "_initOverlay",
    value: function _initOverlay() {
      this._setOverlay();

      this._initComplete = false;
    }
  }, {
    key: "_setOverlay",
    value: function _setOverlay() {
      this._overlay = new google.maps.OverlayView();
      this._overlay.onAdd = this._onAddOverlay.bind(this);
      this._overlay.draw = this._onDrawOverlay.bind(this);
      this._overlay.onRemove = this._onRemoveOverlay.bind(this);

      this._overlay.setMap(this._map);
    }
  }, {
    key: "_onAddOverlay",
    value: function _onAddOverlay() {
      if (!this._initComplete) {
        this._initComplete = true;
      }

      this._projection = this._overlay.getProjection();
      this._projectionUtility = new ProjectionUtility(this._containerDiv, this._projection); // Add svg to Pane

      this._svgOverlay = select(this._overlay.getPanes().overlayMouseTarget).append('div').attr('class', "".concat(Config.prefix, "-measure-points-").concat(this._id)).append('svg').attr('class', "".concat(Config.prefix, "-svg-overlay"));
      this._linesBase = this._svgOverlay.append('g').attr('class', 'base');

      this._linesBase.selectAll('line').data(this._geometry.lines);

      this._linesAux = this._svgOverlay.append('g').attr('class', 'aux');

      this._linesAux.selectAll('line').data(this._geometry.lines);

      this._lineDrag = this._svgOverlay.append('g').attr('class', 'drag');

      this._lineDrag.selectAll('line').data(this._geometry.lines); // base node - presentational


      this._nodeCircles = this._svgOverlay.append('g').attr('class', 'node-circle');

      this._nodeCircles.selectAll('circle').data(this._geometry.nodes); // touch target node


      this._touchCircles = this._svgOverlay.append('g').attr('class', 'touch-circle');

      if (this._options.showSegmentLength) {
        this._segmentText = this._svgOverlay.append('g').attr('class', 'segment-text');

        this._segmentText.selectAll('text').data(this._geometry.lines);
      }

      if (this._options.showAccumulativeLength) {
        this._nodeText = this._svgOverlay.append('g').attr('class', 'node-text');

        this._nodeText.selectAll('text').data(this._geometry.nodes);
      }

      this._hoverCircle = this._svgOverlay.append('g').attr('class', 'hover-circle');

      this._hoverCircle.append('circle').attr('class', getClass('grey-circle', this._options.invertColor)).attr('r', nodeTargetRadius);

      if (this._initComplete && !this._started) {
        this._overlay.setMap(null);
      }
    }
    /**
     * Update svg stuff here
     * @private
     */

  }, {
    key: "_onDrawOverlay",
    value: function _onDrawOverlay() {
      this._updateCircles();

      this._updateTouchCircles();

      this._updateLine();

      if (this._options.showSegmentLength) {
        this._updateSegmentText();
      }

      if (this._options.showAccumulativeLength) {
        this._updateNodeText();
      }

      if (this._geometry) {
        this._updateArea(this._geometry.nodes.length - 1, this._geometry.nodes[this._geometry.nodes.length - 1]);
      }

      this._dispatchMeasureEvent();
    }
  }, {
    key: "_onRemoveOverlay",
    value: function _onRemoveOverlay() {
      selectAll(".".concat(Config.prefix, "-measure-points-").concat(this._id)).remove();
    }
    /**
     * In some cases we must redraw overlay so the svg container size gets recomputed
     * whenever the map scale changes. we usually bind this map resize or similar events.
     * @private
     */

  }, {
    key: "_redrawOverlay",
    value: function _redrawOverlay() {
      this._onRemoveOverlay();

      this._setOverlay();

      this._overlay.draw();
    }
  }, {
    key: "_checkClick",
    value: function _checkClick(mouseEvent) {
      // Use circle radius 'r' as a flag to determine if it is a delete or add event.
      if (!this._dragged && this._touchCircles.selectAll("circle[r=\"".concat(nodeTargetExpandRadius, "\"]")).size() === 0 && !this._hoverCircle.select('circle').attr('cx')) {
        var node = [mouseEvent.latLng.lng(), mouseEvent.latLng.lat()];

        this._geometry.addNode(node);

        this._overlay.draw();
      }

      this._dragged = false;
    }
  }, {
    key: "_updateCircles",
    value: function _updateCircles() {
      var _this3 = this;

      var self = this; // join with old data

      var circles = this._nodeCircles.selectAll('circle').data(this._geometry.nodes).join('circle').datum(function (d, i) {
        return [d, i];
      }).attr('class', function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            i = _ref2[1];

        return i === 0 ? "".concat(getClass('cover-circle', _this3._options.invertColor), " head-circle") : getClass('cover-circle', _this3._options.invertColor);
      }).attr('r', nodeTargetRadius).attr('cx', function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
            d = _ref4[0];

        return _this3._projectionUtility.latLngToSvgPoint(d)[0];
      }).attr('cy', function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 1),
            d = _ref6[0];

        return _this3._projectionUtility.latLngToSvgPoint(d)[1];
      }).on('mouseover', function (event, _ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            d = _ref8[0],
            i = _ref8[1];

        self._onOverCircle(d, i, this);
      }).on('mouseout', function (event, _ref9) {
        var _ref10 = _slicedToArray(_ref9, 2),
            d = _ref10[0],
            i = _ref10[1];

        self._onOutCircle(d, i, this);
      }).on('mousedown', function () {
        return _this3._hideTooltip();
      }); // enter and seat the new data with same style.


      circles.enter().append('circle').attr('class', getClass('cover-circle', this._options.invertColor)).attr('r', nodeTargetRadius).attr('cx', function (_ref11) {
        var _ref12 = _slicedToArray(_ref11, 1),
            d = _ref12[0];

        return _this3._projectionUtility.latLngToSvgPoint(d)[0];
      }).attr('cy', function (_ref13) {
        var _ref14 = _slicedToArray(_ref13, 1),
            d = _ref14[0];

        return _this3._projectionUtility.latLngToSvgPoint(d)[1];
      }).on('mouseover', function (event, _ref15) {
        var _ref16 = _slicedToArray(_ref15, 2),
            d = _ref16[0],
            i = _ref16[1];

        self._onOverCircle(d, i, this);
      }).on('mouseout', function (event, _ref17) {
        var _ref18 = _slicedToArray(_ref17, 2),
            d = _ref18[0],
            i = _ref18[1];

        self._onOutCircle(d, i, this);
      }).on('mousedown', function () {
        return _this3._hideTooltip();
      });

      this._nodeCircles.selectAll('.removed-circle').remove();
    }
  }, {
    key: "_updateTouchCircles",
    value: function _updateTouchCircles() {
      var _this4 = this;

      var self = this; // join with old data

      var circles = this._touchCircles.selectAll('circle').data(this._geometry.nodes).join('circle').datum(function (d, i) {
        return [d, i];
      }).attr('class', function (_ref19) {
        var _ref20 = _slicedToArray(_ref19, 2),
            i = _ref20[1];

        return i === 0 ? "".concat(getClass('touch-circle', _this4._options.invertColor), " head-circle") : getClass('touch-circle', _this4._options.invertColor);
      }).attr('r', touchTargetRadius).attr('cx', function (_ref21) {
        var _ref22 = _slicedToArray(_ref21, 1),
            d = _ref22[0];

        return _this4._projectionUtility.latLngToSvgPoint(d)[0];
      }).attr('cy', function (_ref23) {
        var _ref24 = _slicedToArray(_ref23, 1),
            d = _ref24[0];

        return _this4._projectionUtility.latLngToSvgPoint(d)[1];
      }).on('mouseover', function (event, _ref25) {
        var _ref26 = _slicedToArray(_ref25, 2),
            d = _ref26[0],
            i = _ref26[1];

        self._onOverCircle(d, i, this);
      }).on('mouseout', function (event, _ref27) {
        var _ref28 = _slicedToArray(_ref27, 2),
            d = _ref28[0],
            i = _ref28[1];

        self._onOutCircle(d, i, this);
      }).on('touchstart', function (event, _ref29) {
        var _ref30 = _slicedToArray(_ref29, 2),
            d = _ref30[0],
            i = _ref30[1];

        event.preventDefault();

        self._onOverCircle(d, i, this, true);
      }).on('touchend', function (event, _ref31) {
        var _ref32 = _slicedToArray(_ref31, 2),
            d = _ref32[0],
            i = _ref32[1];

        event.preventDefault();

        self._onOutCircle(d, i, this);
      }).on('mousedown', function () {
        return _this4._hideTooltip();
      }).call(this._onDragCircle()); // enter and seat the new data with same style.


      circles.enter().append('circle').attr('class', getClass('touch-circle', this._options.invertColor)).attr('r', touchTargetRadius).attr('cx', function (_ref33) {
        var _ref34 = _slicedToArray(_ref33, 1),
            d = _ref34[0];

        return _this4._projectionUtility.latLngToSvgPoint(d)[0];
      }).attr('cy', function (_ref35) {
        var _ref36 = _slicedToArray(_ref35, 1),
            d = _ref36[0];

        return _this4._projectionUtility.latLngToSvgPoint(d)[1];
      }).on('mouseover', function (event, _ref37) {
        var _ref38 = _slicedToArray(_ref37, 2),
            d = _ref38[0],
            i = _ref38[1];

        self._onOverCircle(d, i, this);
      }).on('mouseout', function (event, _ref39) {
        var _ref40 = _slicedToArray(_ref39, 2),
            d = _ref40[0],
            i = _ref40[1];

        self._onOutCircle(d, i, this);
      }).on('touchstart', function (event, _ref41) {
        var _ref42 = _slicedToArray(_ref41, 2),
            d = _ref42[0],
            i = _ref42[1];

        event.preventDefault();

        self._onOverCircle(d, i, this, true);
      }).on('touchend', function (event, _ref43) {
        var _ref44 = _slicedToArray(_ref43, 2),
            d = _ref44[0],
            i = _ref44[1];

        event.preventDefault();

        self._onOutCircle(d, i, this);
      }).on('mousedown', function () {
        return _this4._hideTooltip();
      }).call(this._onDragCircle());

      this._touchCircles.selectAll('.removed-circle').remove();
    }
  }, {
    key: "_updateLine",
    value: function _updateLine() {
      var _this5 = this;

      this._segments = [];

      var linesBase = this._linesBase.selectAll('line').data(this._geometry.lines).attr('class', getClass('base-line', this._options.invertColor)).attr('x1', function (d) {
        return _this5._projectionUtility.latLngToSvgPoint(d[0])[0];
      }).attr('y1', function (d) {
        return _this5._projectionUtility.latLngToSvgPoint(d[0])[1];
      }).attr('x2', function (d) {
        return _this5._projectionUtility.latLngToSvgPoint(d[1])[0];
      }).attr('y2', function (d) {
        return _this5._projectionUtility.latLngToSvgPoint(d[1])[1];
      }).each(function (d) {
        return _this5._updateSegment(d);
      });

      linesBase.exit().remove();
      linesBase.enter().append('line').attr('class', getClass('base-line', this._options.invertColor)).attr('x1', function (d) {
        return _this5._projectionUtility.latLngToSvgPoint(d[0])[0];
      }).attr('y1', function (d) {
        return _this5._projectionUtility.latLngToSvgPoint(d[0])[1];
      }).attr('x2', function (d) {
        return _this5._projectionUtility.latLngToSvgPoint(d[1])[0];
      }).attr('y2', function (d) {
        return _this5._projectionUtility.latLngToSvgPoint(d[1])[1];
      }).each(function (d) {
        return _this5._updateSegment(d);
      });

      var linesAux = this._linesAux.selectAll('line').data(this._geometry.lines).join('line').datum(function (d, i) {
        return [d, i];
      }).attr('class', 'aux-line').attr('x1', function (_ref45) {
        var _ref46 = _slicedToArray(_ref45, 1),
            d = _ref46[0];

        return _this5._projectionUtility.latLngToSvgPoint(d[0])[0];
      }).attr('y1', function (_ref47) {
        var _ref48 = _slicedToArray(_ref47, 1),
            d = _ref48[0];

        return _this5._projectionUtility.latLngToSvgPoint(d[0])[1];
      }).attr('x2', function (_ref49) {
        var _ref50 = _slicedToArray(_ref49, 1),
            d = _ref50[0];

        return _this5._projectionUtility.latLngToSvgPoint(d[1])[0];
      }).attr('y2', function (_ref51) {
        var _ref52 = _slicedToArray(_ref51, 1),
            d = _ref52[0];

        return _this5._projectionUtility.latLngToSvgPoint(d[1])[1];
      });

      linesAux.on('mousemove', function (event, _ref53) {
        var _ref54 = _slicedToArray(_ref53, 1),
            d = _ref54[0];

        var point = Helper.findTouchPoint([_this5._projectionUtility.latLngToSvgPoint(d[0]), _this5._projectionUtility.latLngToSvgPoint(d[1])], [event.offsetX, event.offsetY]);

        _this5._updateHoverCirclePosition(point[0], point[1]);
      }).on('mouseout', function () {
        return _this5._hideHoverCircle();
      }).on('mousedown', function () {
        return _this5._hideTooltip();
      }).on('touchstart', function (e) {
        // prevent simulated mouse events
        e.preventDefault();
      }).call(this._onDragLine(linesAux, linesBase));
      linesAux.exit().remove();
      linesAux.enter().append('line').join('line').datum(function (d, i) {
        return [d, i];
      }).attr('class', 'aux-line').attr('x1', function (_ref55) {
        var _ref56 = _slicedToArray(_ref55, 1),
            d = _ref56[0];

        return _this5._projectionUtility.latLngToSvgPoint(d[0])[0];
      }).attr('y1', function (_ref57) {
        var _ref58 = _slicedToArray(_ref57, 1),
            d = _ref58[0];

        return _this5._projectionUtility.latLngToSvgPoint(d[0])[1];
      }).attr('x2', function (_ref59) {
        var _ref60 = _slicedToArray(_ref59, 1),
            d = _ref60[0];

        return _this5._projectionUtility.latLngToSvgPoint(d[1])[0];
      }).attr('y2', function (_ref61) {
        var _ref62 = _slicedToArray(_ref61, 1),
            d = _ref62[0];

        return _this5._projectionUtility.latLngToSvgPoint(d[1])[1];
      });

      var lineDrag = this._lineDrag.selectAll('line').data([]);

      lineDrag.exit().remove();
    }
  }, {
    key: "_updateSegmentText",
    value: function _updateSegmentText() {
      var _this6 = this;

      var text = this._segmentText.selectAll('text').data(this._geometry.lines).attr('class', getClass('segment-measure-text', this._options.invertColor)).attr('text-anchor', 'middle').attr('dominant-baseline', 'text-before-edge').attr('transform', function (d) {
        var p1 = _this6._projectionUtility.latLngToSvgPoint(d[0]);

        var p2 = _this6._projectionUtility.latLngToSvgPoint(d[1]);

        return Helper.transformText(p1, p2);
      }).text(function (d, i) {
        return _this6._helper.formatLength(_this6._helper.computeLengthBetween(d[0], d[1]));
      });

      text.enter().append('text').attr('class', getClass('segment-measure-text', this._options.invertColor)).attr('text-anchor', 'middle').attr('dominant-baseline', 'text-before-edge').attr('transform', function (d) {
        var p1 = _this6._projectionUtility.latLngToSvgPoint(d[0]);

        var p2 = _this6._projectionUtility.latLngToSvgPoint(d[1]);

        return Helper.transformText(p1, p2);
      }).text(function (d, i) {
        return _this6._helper.formatLength(_this6._helper.computeLengthBetween(d[0], d[1]));
      });
      text.exit().remove();
    }
  }, {
    key: "_updateNodeText",
    value: function _updateNodeText() {
      var _this7 = this;

      var text = this._nodeText.selectAll('text').data(this._geometry.nodes).attr('class', function (d, i) {
        return i === 0 ? "".concat(getClass('node-measure-text', _this7._options.invertColor), " head-text") : getClass('node-measure-text', _this7._options.invertColor);
      }).attr('text-anchor', 'middle').attr('dominant-baseline', 'text-after-edge').attr('x', function (d) {
        return _this7._projectionUtility.latLngToSvgPoint(d)[0];
      }).attr('y', this._transformNodeTextY.bind(this)).text(function (d, i) {
        var len = _this7._helper.computePathLength(_this7._geometry.nodes.slice(0, i + 1));

        if (i === _this7._geometry.nodes.length - 1) {
          _this7._length = len;
        }

        return _this7._helper.formatLength(len);
      });

      text.enter().append('text').attr('class', function (d, i) {
        return i === 0 ? "".concat(getClass('node-measure-text', _this7._options.invertColor), " head-text") : getClass('node-measure-text', _this7._options.invertColor);
      }).attr('text-anchor', 'middle').attr('dominant-baseline', 'text-after-edge').attr('x', function (d) {
        return _this7._projectionUtility.latLngToSvgPoint(d)[0];
      }).attr('y', this._transformNodeTextY.bind(this)).text(function (d, i) {
        var len = _this7._helper.computePathLength(_this7._geometry.nodes.slice(0, i + 1));

        if (i === _this7._geometry.nodes.length - 1) {
          _this7._length = len;
        }

        return _this7._helper.formatLength(len);
      });
      text.exit().remove();
    }
  }, {
    key: "_onOverCircle",
    value: function _onOverCircle(d, i, target) {
      var isTouch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      if (this._dragging) return;
      var selection = select(target);

      if (!selection.classed('base')) {
        selection = this._nodeCircles.select("circle:nth-child(".concat(i + 1, ")"));
      }

      selection.attr('r', nodeTargetExpandRadius);

      if (this._options.tooltip && !isTouch) {
        this._tooltip.show(this._projectionUtility.latLngToContainerPoint(d), i === 0 ? Config.tooltipText2(this._options.language) : Config.tooltipText1(this._options.language));
      }
    }
  }, {
    key: "_onOutCircle",
    value: function _onOutCircle(d, i, target) {
      var selection = select(target);

      if (!selection.classed('base')) {
        selection = this._nodeCircles.select("circle:nth-child(".concat(i + 1, ")"));
      }

      selection.attr('r', nodeTargetRadius);

      this._hideTooltip();
    }
  }, {
    key: "_onDragCircle",
    value: function _onDragCircle() {
      var self = this;
      var isDragged = false;
      var circleDrag = drag().on('drag', function (event, _ref63) {
        var _ref64 = _slicedToArray(_ref63, 2),
            i = _ref64[1];

        isDragged = true;
        self._dragging = true;
        select(this).attr('cx', event.x).attr('cy', event.y);

        self._updateLinePosition.call(self, self._linesBase, i, event);

        self._updateLinePosition.call(self, self._linesAux, i, event);

        self._updateNodeCirclePosition(i, event);

        if (self._options.showSegmentLength) {
          self._updateSegmentTextPosition(i, event);
        }

        if (self._options.showAccumulativeLength) {
          self._updateNodeTextPosition(i, event);
        }

        self._updateArea(i, self._projectionUtility.svgPointToLatLng([event.x, event.y]));
      });
      circleDrag.on('start', function (event) {
        event.sourceEvent.stopPropagation();
        select(this).raise().attr('r', nodeTargetExpandRadius);

        self._disableMapScroll();
      });
      circleDrag.on('end', function (event, _ref65) {
        var _ref66 = _slicedToArray(_ref65, 2),
            d = _ref66[0],
            i = _ref66[1];

        self._enableMapScroll();

        if (!isDragged) {
          if (i > 0) {
            self._geometry.removeNode(i);

            select(this).classed('removed-circle', true);
          } else {
            self._geometry.addNode(d);

            self._dragged = true;
          }
        } else {
          self._geometry.updateNode(i, self._projectionUtility.svgPointToLatLng([event.x, event.y]));

          self._showTooltipOnEvent(i === 0 ? Config.tooltipText2(self._options.language) : Config.tooltipText1(self._options.language), event);
        }

        isDragged = false;
        self._dragging = false;

        self._overlay.draw();
      });
      return circleDrag;
    }
  }, {
    key: "_onDragLine",
    value: function _onDragLine() {
      var _this8 = this;

      var isDragged = false;
      var lineDrag = drag().on('drag', function (event, _ref67) {
        var _ref68 = _slicedToArray(_ref67, 2),
            i = _ref68[1];

        _this8._dragging = true;

        if (!isDragged) {
          isDragged = true; // idea - The problems seems that we can't rejoin the data on the same selection during the drag,
          // but we can use the new data to create a new line just to show during the drag by passing the drag event to it.

          _this8._geometry.insertNode(i + 1, _this8._projectionUtility.svgPointToLatLng([event.x, event.y]));

          var _lineDrag = _this8._lineDrag.selectAll('line').data(_this8._geometry.lines);

          _lineDrag.exit().remove();

          _lineDrag.enter().append('line').attr('class', getClass('base-line', _this8._options.invertColor)).attr('x1', function (d) {
            return _this8._projectionUtility.latLngToSvgPoint(d[0])[0];
          }).attr('y1', function (d) {
            return _this8._projectionUtility.latLngToSvgPoint(d[0])[1];
          }).attr('x2', function (d) {
            return _this8._projectionUtility.latLngToSvgPoint(d[1])[0];
          }).attr('y2', function (d) {
            return _this8._projectionUtility.latLngToSvgPoint(d[1])[1];
          });

          _this8._linesBase.selectAll('line').style('display', 'none');

          _this8._linesAux.selectAll('line').style('display', 'none');

          if (_this8._options.showSegmentLength) {
            _this8._updateSegmentText();
          }

          if (_this8._options.showAccumulativeLength) {
            _this8._updateNodeText();
          }
        }

        _this8._updateHoverCirclePosition(event.x, event.y);

        _this8._updateLinePosition(_this8._lineDrag, i + 1, event);

        if (_this8._options.showSegmentLength) {
          _this8._updateSegmentTextPosition(i + 1, event);
        }

        if (_this8._options.showAccumulativeLength) {
          _this8._updateNodeTextPosition(i + 1, event);
        }

        _this8._updateArea(i + 1, _this8._projectionUtility.svgPointToLatLng([event.x, event.y]));
      });
      lineDrag.on('start', function (event) {
        event.sourceEvent.stopPropagation();

        _this8._hoverCircle.select('circle').attr('class', getClass('cover-circle', _this8._options.invertColor));

        _this8._disableMapScroll();
      });
      lineDrag.on('end', function (event, _ref69) {
        var _ref70 = _slicedToArray(_ref69, 2),
            i = _ref70[1];

        _this8._enableMapScroll();

        if (isDragged) {
          _this8._geometry.updateNode(i + 1, _this8._projectionUtility.svgPointToLatLng([event.x, event.y]));

          _this8._hideHoverCircle();

          _this8._overlay.draw();

          isDragged = false;

          _this8._showTooltipOnEvent(Config.tooltipText1(_this8._options.language), event);
        }

        _this8._updateArea(i + 1, _this8._projectionUtility.svgPointToLatLng([event.x, event.y]));

        _this8._hoverCircle.select('circle').attr('class', getClass('grey-circle', _this8._options.invertColor));

        _this8._linesBase.selectAll('line').style('display', 'inline');

        _this8._linesAux.selectAll('line').style('display', 'inline');

        _this8._dragging = false;
      });
      return lineDrag;
    }
  }, {
    key: "_updateLinePosition",
    value: function _updateLinePosition(group, i, event) {
      if (i < this._geometry.lines.length) {
        group.select("line:nth-child(".concat(i + 1, ")")).attr('x1', event.x).attr('y1', event.y);
      }

      if (i > 0) {
        group.select("line:nth-child(".concat(i, ")")).attr('x2', event.x).attr('y2', event.y);
      }
    }
  }, {
    key: "_updateSegmentTextPosition",
    value: function _updateSegmentTextPosition(index, event) {
      var _this9 = this;

      if (index < this._geometry.lines.length) {
        this._segmentText.select("text:nth-child(".concat(index + 1, ")")).attr('transform', function (d) {
          var p1 = [event.x, event.y];

          var p2 = _this9._projectionUtility.latLngToSvgPoint(d[1]);

          return Helper.transformText(p1, p2);
        }).text(function (d) {
          return _this9._helper.formatLength(_this9._helper.computeLengthBetween(_this9._projectionUtility.svgPointToLatLng([event.x, event.y]), d[1]));
        });
      }

      if (index > 0) {
        this._segmentText.select("text:nth-child(".concat(index, ")")).attr('transform', function (d) {
          var p1 = _this9._projectionUtility.latLngToSvgPoint(d[0]);

          var p2 = [event.x, event.y];
          return Helper.transformText(p1, p2);
        }).text(function (d) {
          return _this9._helper.formatLength(_this9._helper.computeLengthBetween(d[0], _this9._projectionUtility.svgPointToLatLng([event.x, event.y])));
        });
      }
    }
  }, {
    key: "_updateNodeTextPosition",
    value: function _updateNodeTextPosition(index, event) {
      var _this10 = this;

      this._nodeText.select("text:nth-child(".concat(index + 1, ")")).attr('x', event.x).attr('y', function () {
        var offset;

        if (index > 0 && _this10._projectionUtility.latLngToSvgPoint(_this10._geometry.nodes[index - 1])[1] < event.y) {
          offset = 23;
        } else {
          offset = -7;
        }

        return event.y + offset;
      });

      this._nodeText.select("text:nth-child(".concat(index + 2, ")")).attr('y', function (d) {
        var offset;

        if (index + 1 > 0 && event.y < _this10._projectionUtility.latLngToSvgPoint(d)[1]) {
          offset = 23;
        } else {
          offset = -7;
        }

        return _this10._projectionUtility.latLngToSvgPoint(d)[1] + offset;
      });

      var followingNodes = this._nodeText.selectAll('text').filter(function (d, i) {
        return i >= index;
      });

      followingNodes.text(function (d, i) {
        var len = _this10._helper.computePathLength([].concat(_toConsumableArray(_this10._geometry.nodes.slice(0, index)), [_this10._projectionUtility.svgPointToLatLng([event.x, event.y])], _toConsumableArray(_this10._geometry.nodes.slice(index + 1, index + 1 + i))));

        if (index + i === _this10._geometry.nodes.length - 1) {
          _this10._length = len;
        }

        return _this10._helper.formatLength(len);
      });
    }
  }, {
    key: "_updateNodeCirclePosition",
    value: function _updateNodeCirclePosition(index, event) {
      this._nodeCircles.select("circle:nth-child(".concat(index + 1, ")")).attr('cx', event.x).attr('cy', event.y);
    }
  }, {
    key: "_updateHoverCirclePosition",
    value: function _updateHoverCirclePosition(x, y) {
      this._hoverCircle.select('circle').attr('cx', x).attr('cy', y);

      if (this._dragging) return;

      if (this._options.tooltip) {
        this._tooltip.show(this._projectionUtility.svgPointToContainerPoint([x, y]), Config.tooltipText2(this._options.language));
      }
    }
  }, {
    key: "_hideHoverCircle",
    value: function _hideHoverCircle() {
      this._hoverCircle.select('circle').attr('cx', null).attr('cy', null);

      this._hideTooltip();
    }
  }, {
    key: "_disableMapScroll",
    value: function _disableMapScroll() {
      this._zoomControl = !!document.querySelector("button[aria-label='Zoom in']");

      this._map.setOptions({
        scrollwheel: false,
        gestureHandling: 'none',
        zoomControl: false
      });
    }
  }, {
    key: "_enableMapScroll",
    value: function _enableMapScroll() {
      this._map.setOptions({
        scrollwheel: true,
        gestureHandling: 'auto',
        zoomControl: this._zoomControl
      });
    }
  }, {
    key: "_transformNodeTextY",
    value: function _transformNodeTextY(d, i) {
      var offset;

      if (i > 0 && this._geometry.nodes[i - 1][1] > d[1]) {
        offset = 23;
      } else {
        offset = -7;
      }

      return this._projectionUtility.latLngToSvgPoint(d)[1] + offset;
    }
  }, {
    key: "_updateArea",
    value: function _updateArea(i, pointToCompare) {
      if (!this._geometry) return;
      var n = this._geometry.nodes.length;
      var tolerance = 1 / 80 * this.length;
      var offset,
          area = 0;

      if (n > 2) {
        if (i === 0) {
          offset = this._helper.computeLengthBetween(this._geometry.nodes[n - 1], pointToCompare);
          area = offset > tolerance ? 0 : this._helper.computeArea([pointToCompare].concat(_toConsumableArray(this._geometry.nodes.slice(1, n - 1))));
        } else if (i === n - 1) {
          offset = this._helper.computeLengthBetween(pointToCompare, this._geometry.nodes[0]);
          area = offset > tolerance ? 0 : this._helper.computeArea(this._geometry.nodes.slice(0, n - 1));
        } else if (i > 0 && i < n - 1) {
          offset = this._helper.computeLengthBetween(this._geometry.nodes[0], this._geometry.nodes[n - 1]);
          area = offset > tolerance ? 0 : this._helper.computeArea([].concat(_toConsumableArray(this._geometry.nodes.slice(0, i)), [pointToCompare], _toConsumableArray(this._geometry.nodes.slice(i + 1))));
        } else {
          offset = this._helper.computeLengthBetween(this._geometry.nodes[0], this._geometry.nodes[n - 1]);
          area = offset > tolerance ? 0 : this._helper.computeArea(this._geometry.nodes);
        }
      }

      this._area = area;

      if (area > 0) {
        this._nodeText.select(':last-child').text("Total distance: ".concat(this.lengthText, "; Total area: ").concat(this.areaText, "."));
      }
    }
  }, {
    key: "_showTooltipOnEvent",
    value: function _showTooltipOnEvent(text, event) {
      // don't show tooltip in a touch event
      if (event.sourceEvent.type.startsWith('touch')) {
        return;
      }

      if (this._options.tooltip) {
        this._tooltip.show(this._projectionUtility.svgPointToContainerPoint([event.x, event.y]), text);
      }
    }
  }, {
    key: "_hideTooltip",
    value: function _hideTooltip() {
      if (this._options.tooltip) {
        this._tooltip.hide();
      }
    }
  }, {
    key: "_dispatchMeasureEvent",
    value: function _dispatchMeasureEvent() {
      if (!this._started) return;

      var result = this._getResults();

      if (this._lastMeasure && this._lastMeasure.result.lengthText === this.lengthText && this._lastMeasure.result.areaText === this.areaText) return;

      if (typeof this._events.get(EVENT_CHANGE) === 'function') {
        this._events.get(EVENT_CHANGE)(this._lastMeasure = result);
      }
    }
  }, {
    key: "_updateSegment",
    value: function _updateSegment(d) {
      var len = this._helper.computeLengthBetween(d[0], d[1]);

      var lenTxt = this._helper.formatLength(len);

      this._segments.push(new Segment(d[0], d[1], len, lenTxt).toJSON());
    }
  }, {
    key: "_getResults",
    value: function _getResults() {
      return {
        result: {
          length: this.length,
          lengthText: this.lengthText,
          area: this.area,
          areaText: this.areaText,
          segments: this.segments,
          points: this.points
        }
      };
    }
  }], [{
    key: "_initPolyfills",
    value: function _initPolyfills() {
      ObjectAssign();
    }
  }]);

  return MeasureTool;
}();

export default MeasureTool;
