/*! Stash v1.2.3 MIT/GPL2 @rezitech */
(function (win, ls, doc) {
	// Returns a safely quoted string
	function quoteStr(str) {
		return "'" +
			String(str)
			.replace(/\\/g, '\\\\')
			.replace(/'/g, "\\'")
			.replace(/\n/g, '\\n')
			.replace(/\r/g, '\\r')
			.replace(/\t/g, '\\t')
			+ "'";
	}
	// Returns whether a constructor type matches a value's constructor
	function isType(Ctor, val) {
		return (val !== undefined && val !== null && (!Ctor || val.constructor === Ctor.prototype.constructor));
	}
	// Returns and extended object from the arguments
	function extendObject() {
		var extObj = {}, arg = arguments, argLen = arg.length, i = -1, e;
		while (++i < argLen)
			if (isType(Object, arg[i]))
				for (e in arg[i])
					extObj[e] = isType(Object, extObj[e]) && isType(Object, arg[i][e])
						? arg.callee(extObj[e], arg[i][e])
						: arg[i][e];
		return extObj;
	}
	// Returns a string version of JavaScript
	function stringify(val) {
		var
		callee = arguments.callee;
		// special
		if (val === doc) return 'document';
		if (val === doc.body) return 'document.body';
		if (val === doc.documentElement) return 'document.documentElement';
		if (val === win) return 'window';
		// string
		if (isType(String, val)) return quoteStr(val);
		// boolean, function, number, regexp, undefined, null
		if (
			val === undefined ||
			val === null ||
			isType(Boolean, val) ||
			isType(Function, val) ||
			isType(Number, val) ||
			isType(RegExp, val)
		) return String(val);
		// date
		if (isType(Date, val)) {
			return 'new Date(' + val.getTime() + ')';
		}
		// array
		if (isType(Array, val)) {
			var newVal = [], valLen = val.length, i = -1;
			while (++i < valLen) newVal.push(callee(val[i]));
			return '[' + newVal + ']';
		}
		// object
		if (isType(Object, val)) {
			var newVal = [], e;
			for (e in val) newVal.push(quoteStr(e) + ':' + callee(val[e]));
			return '{' + newVal + '}';
		}
		// else undefined
		return String(undefined);
	}
	// Returns a JavaScript version of a string
	function unstringify(str) {
		return new Function('return ' + str).apply(win);
	}
	// The stash object
	win.stash = {
		// returns whether a storage item exists or not
		has: function (attr) {
			return ls[attr] !== undefined;
		},
		// returns a local storage item
		get: function (attr) {
			return unstringify(ls[attr]);
		},
		// returns a local storage item in raw string form
		getAsString: function (attr) {
			return ls[attr];
		},
		// returns all local storage items
		getAll: function () {
			var items = {}, e;
			for (e in ls) items[e] = ls[e];
			return items;
		},
		// sets a local storage item, returns 1 if item(s) changed and 2 if not
		set: function (attr, val) {
			var returnValue = 1, currentValue, e;
			if (isType(Object, attr)) {
				for (e in attr) {
					val = stringify(attr[e]);
					currentValue = ls[e];
					if (val === currentValue) returnValue = 2;
					else ls[e] = val;
				}
				return returnValue;
			}
			val = stringify(val);
			currentValue = ls[attr];
			if (val === currentValue) return 2;
			else ls[attr] = val;
			return 1;
		},
		// adds to a local storage item, returns 1 if item(s) changed and 2 if not
		add: function (attr, val) {
			var item = this.get(attr);
			// if both the existing item and the new item are an array
			if (isType(Array, item) && isType(Array, val)) val = item.concat(val);
			// if the existing item is an array
			else if (isType(Array, item)) val = item.push(val) && item;
			// if the existing item is a boolean
			else if (isType(Boolean, item)) val = item && !!val;
			// if the existing item is a date and the new item can be a number
			else if (isType(Date, item) && !isNaN(val * 1)) val = new Date(item.getTime() + (val * 1));
			// if both the existing item and the new item are a function
			else if (isType(Function, item) && isType(Function, val)) val = new Function('return(' + String(item) + ').apply(this, arguments)&&(' + String(val) + ').apply(this, arguments)');
			// if the existing item is a number and the new item can be a number
			else if (isType(Number, item) && !isNaN(val * 1)) val = item + (val * 1);
			// if both the existing item and the new item are an object
			else if (isType(Object, item) && isType(Object, val)) val = extendObject(item, val);
			// if both the existing item and the new item are a regular expression
			else if (isType(RegExp, item) && isType(RegExp, val)) {
				var
				regExpMatch = /^\/([\W\w]*)\/([a-z]*?)$/,
				regExpA = String(item).match(regExpMatch),
				regExpB = String(val).match(regExpMatch);
				val = new RegExp(regExpA[1] + regExpB[1], regExpA[2] + regExpB[2]);
			}
			// if the existing item is a string
			else if (isType(String, item)) val = item + String(val);
			else return 2;
			// set the new item and return its value
			return this.set(attr, val);
		},
		// removals a local storage item
		cut: function (attr) {
			delete ls[attr];
		},
		// removes all items from local storage
		cutAll: function () {
			for (var e in ls) delete ls[e];
		},
		// returns a local storage item if a regular expression search of its contents is matched
		search: function (attr, re) {
			return re.test(ls[attr]) ? unstringify(ls[attr]) : false;
		},
		// returns local storage items by if a regular expression search of its contents is matched
		searchAll: function (re) {
			var items = {}, e;
			for (e in ls) if (re.test(ls[e])) items[e] = unstringify(ls[e]);
			return items;
		}
	};
})(this, this.localStorage, document);