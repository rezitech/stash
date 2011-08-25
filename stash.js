/*! Stash v1.1.1 MIT/GPL2 @rezitech */
(function (win, doc, ls) {
	// Returns a safely quoted string
	function quoteStr (str) {
		return "'"+
			String(str)
			.replace(/\\/g, '\\\\')
			.replace(/'/g, "\\'")
			.replace(/\n/g, '\\n')
			.replace(/\r/g, '\\r')
			.replace(/\t/g, '\\t')
			+"'";
	}
	// Returns whether a constructor type matches a value's constructor
	function isType (Ctor, val) {
		return ( val !== undefined && val !== null && (!Ctor || val.constructor === win[Ctor].prototype.constructor) );
	}
	// Returns and extended object from the arguments
	function extendObject () {
		var extObj = {}, arg = arguments, argLen = arg.length, i = -1, e;
		while (++i < argLen)
			if (isType('Object', arg[i]))
				for (e in arg[i])
					extObj[e] = isType('Object', extObj[e]) && isType('Object', arg[i][e])
						? arg.callee(extObj[e], arg[i][e])
						: arg[i][e];
		return extObj;
	}
	// Returns a string version of JavaScript
	function stringify (val) {
		var
		callee = arguments.callee;
		// special
		if (val === doc) return 'document';
		if (val === doc.body) return 'document.body';
		if (val === doc.documentElement) return 'document.documentElement';
		if (val === win) return 'window';
		// string
		if (isType('String', val)) return quoteStr(val);
		// boolean, function, number, regexp, undefined, null
		if (
			val === undefined ||
			val === null ||
			isType('Boolean', val) ||
			isType('Function', val) ||
			isType('Number', val) ||
			isType('RegExp', val)
		) return String(val);
		// date
		if (isType('Date', val)) {
			return 'new Date('+val.getTime()+')';
		}
		// array
		if (isType('Array', val)) {
			var newVal = [], valLen = val.length, i = -1;
			while (++i < valLen) newVal.push(callee(val[i]));
			return '['+newVal+']';
		}
		// object
		if (isType('Object', val)) {
			var newVal = [], e;
			for (e in val) newVal.push(quoteStr(e)+':'+callee(val[e]));
			return '{'+newVal+'}';
		}
		// else undefined
		return String(undefined);
	}
	// Returns a JavaScript version of a string
	function unstringify (str) {
		return Function('return '+str).apply(win);
	}
	// The stash object
	win.stash = {
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
			if (isType('Object', attr)) {
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
			// if the existing item does not exist
			if ( !isType(null, item) ) null;
			// if both the existing item and the new item are an array
			else if ( isType('Array', item)  && isType('Array', val) ) val = item.concat(val);
			// if both the existing item and the new item are a number
			else if ( isType('Number', item) && isType('Number', val) ) val += item;
			// if both the existing item and the new item are an object
			else if ( isType('Object', item) && isType('Object', val) ) val = extendObject(item, val);
			// if both the existing item and the new item are a string
			else if ( isType('String', item) && isType('String', val) ) val = item+val;
			// otherwise return false
			else return false;
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
})(this, document, localStorage);