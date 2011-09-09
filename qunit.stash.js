test("Stash gets and sets a true Boolean", 3, function () {

	// Setup
	var expected = true;
	stash.set('val', expected);
	var actual = stash.get('val');
	// Test
	strictEqual(actual, expected, 'Strict Equal of Boolean');
	strictEqual(actual, true, 'Strict Equal of Actual Boolean');
	strictEqual(expected, true, 'Strict Equal of Expected Boolean');

});

test("Stash gets and sets a false Boolean", 3, function () {

	// Setup
	var expected = false;
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	strictEqual(actual, expected, 'Strict Equal of Boolean');
	strictEqual(actual, false, 'Strict Equal of Actual Boolean');
	strictEqual(expected, false, 'Strict Equal of Expected Boolean');

});

test("Stash gets and sets a Number, 1", 3, function () {

	// Setup
	var expected = 1;
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	strictEqual(actual, expected, 'Strict Equal of Number');
	strictEqual(actual, 1, 'Strict Equal of Actual Number');
	strictEqual(expected, 1, 'Strict Equal of Expected Number');

});

test("Stash gets and sets a Number, 3.14", 3, function () {

	// Setup
	var expected = 3.14;
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	strictEqual(actual, expected, 'Strict Equal of Number');
	strictEqual(actual, 3.14, 'Strict Equal of Actual Number');
	strictEqual(expected, 3.14, 'Strict Equal of Expected Number');

});

test("Stash gets and sets a Number, 0", 3, function () {

	// Setup
	var expected = 0;
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	strictEqual(actual, expected, 'Strict Equal of Number');
	strictEqual(actual, 0, 'Strict Equal of Actual Number');
	strictEqual(expected, 0, 'Strict Equal of Expected Number');

});

test("Stash gets and sets a String", 3, function () {

	// Setup
	var expected = 'lorem ipsum dolor sit amet';
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	strictEqual(actual, expected, 'Strict Equal of String');
	strictEqual(actual, 'lorem ipsum dolor sit amet', 'Strict Equal of Actual String');
	strictEqual(expected, 'lorem ipsum dolor sit amet', 'Strict Equal of Expected String');

});

test("Stash gets and sets a String with special characters", 3, function () {

	// Setup
	var expected = 'lorem\nipsum\rdolor\ssit\tamet';
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	strictEqual(actual, expected, 'Strict Equal of String with Special Characters');
	strictEqual(actual, 'lorem\nipsum\rdolor\ssit\tamet', 'Strict Equal of Actual String with Special Characters');
	strictEqual(expected, 'lorem\nipsum\rdolor\ssit\tamet', 'Strict Equal of Expected String with Special Characters');

});

test("Stash gets and sets a Regular Expression", 4, function () {

	// Setup
	var expected = /lorem|ipsum/;
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	same(actual, expected, 'Sameness of Regular Expression');
	strictEqual(actual.constructor, expected.constructor, 'Strict Equal Constructor of Regular Expression');
	same(actual, /lorem|ipsum/, 'Sameness of Regular Actual Expression');
	same(expected, /lorem|ipsum/, 'Sameness of Regular Expected Expression');

});

test("Stash gets and sets a Date", 3, function () {

	// Setup
	var expected = new Date();
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	same(actual, expected, 'Sameness of Date');
	strictEqual(actual.constructor, expected.constructor, 'Strict Equal Constructor of Date');
	strictEqual(actual.getTime(), expected.getTime(), 'Strict Equal Time of Date');

});

test("Stash gets and sets a Function", 4, function () {

	// Setup
	var expected = function () {};
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	same(String(actual), String(expected), 'Sameness of Function as a String');
	strictEqual(actual.constructor, expected.constructor, 'Strict Equal Constructor of Function');
	same(String(actual), String(function () {}), 'Sameness of Actual Function as a String');
	same(String(expected), String(function () {}), 'Sameness of Expected Function as a String');

});

test("Stash gets and sets a Native Window Function", 2, function () {

	// Setup
	var expected = window.scrollTo;
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	same(String(expected), String(actual), 'Sameness of Native Window Function as a String');
	strictEqual(actual.constructor, expected.constructor, 'Strict Equal Constructor of Native Window Function');

});

test("Stash gets and sets a Native Document Function", 2, function () {

	// Setup
	var expected = document.getElementById;
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	same(String(expected), String(actual), 'Sameness of Native Document Function as a String');
	strictEqual(actual.constructor, expected.constructor, 'Strict Equal Constructor of Native Document Function');

});

test("Stash gets and sets a DOM Element", 10, function () {

	// Setup
	var expected = document.createElement('div');
	expected.setAttribute('foo', 'bar');
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	strictEqual(actual.constructor, expected.constructor, 'Strict Equal Constructor of DOM Element');
	strictEqual(actual.nodeName, expected.nodeName, 'Strict Equal Node Name of DOM Element');
	strictEqual(actual.ownerDocument, expected.ownerDocument, 'Strict Equal Owner Document of DOM Element');
	strictEqual(actual.ownerDocument, document, 'Strict Equal Owner Document of Actual DOM Element');
	strictEqual(expected.ownerDocument, document, 'Strict Equal Owner Document of Expected DOM Element');
	strictEqual(actual.attributes.length, expected.attributes.length, 'Strict Equal Attributes Length of DOM Element');
	strictEqual(actual.attributes.length, 1, 'Strict Equal Attributes Length of Actual DOM Element');
	strictEqual(expected.attributes.length, 1, 'Strict Equal Attributes Length of Expected DOM Element');
	strictEqual(actual.getAttribute('foo', 'bar'), expected.getAttribute('foo', 'bar'), 'Strict Equal Attribute of "foo" of DOM Element');
	strictEqual(actual.innerHTML, expected.innerHTML, 'Strict Equal Inner HTML of DOM Element');

});

test("Stash gets and sets a DOM Element created with innerHTML", 10, function () {

	// Setup
	var div = document.createElement('div');
	div.innerHTML = '<div id="lorem" class="ipsum dolar">sit amet</div>';
	var divFirstChild = div.firstChild;
	divFirstChild.setAttribute('foo', 'bar');
	var expected = divFirstChild;
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	strictEqual(actual.constructor, expected.constructor, 'Strict Equal Constructor of DOM Element');
	strictEqual(actual.nodeName, expected.nodeName, 'Strict Equal Node Name of DOM Element');
	strictEqual(actual.ownerDocument, expected.ownerDocument, 'Strict Equal Owner Document of DOM Element');
	strictEqual(actual.ownerDocument, document, 'Strict Equal Owner Document of Actual DOM Element');
	strictEqual(expected.ownerDocument, document, 'Strict Equal Owner Document of Expected DOM Element');
	strictEqual(actual.attributes.length, expected.attributes.length, 'Strict Equal Attributes Length of DOM Element');
	strictEqual(actual.attributes.length, 3, 'Strict Equal Attributes Length of Actual DOM Element');
	strictEqual(expected.attributes.length, 3, 'Strict Equal Attributes Length of Expected DOM Element');
	strictEqual(actual.getAttribute('foo', 'bar'), expected.getAttribute('foo', 'bar'), 'Strict Equal Attribute of "foo" of DOM Element');
	strictEqual(actual.innerHTML, expected.innerHTML, 'Strict Equal Inner HTML of DOM Element');

});

test("Stash gets and sets an Array containing Strings", 4, function () {

	// Setup
	var expected = ['lorem', 'ipsum', 'dolar', 'sit', 'amet'];
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	same(actual, expected, 'Sameness of Array');
	strictEqual(actual.constructor, expected.constructor, 'Strict Equal Constructor of Array');
	strictEqual(actual[0], expected[0], 'Strict Equal of Index 0 in Array');
	strictEqual(actual[4], expected[4], 'Strict Equal of Index 4 in Array');

});

test("Stash gets and sets an Object containing Strings", 3, function () {

	// Setup
	var expected = { a: 'lorem', b: 'ipsum', c: 'dolar', d: 'sit', e: 'amet' };
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	same(actual, expected, 'Sameness of Object');
	strictEqual(actual.a, expected.a, 'Strict Equal of Property "a" in Object');
	strictEqual(actual.e, expected.e, 'Strict Equal of Property "e" in Object');

});

test("Stash gets and sets an Array containing Mixed Values", 28, function () {

	// Setup
	var div = document.createElement('div');
	div.innerHTML = '<div id="lorem" class="ipsum dolar">sit amet</div>';
	var divFirstChild = div.firstChild;
	divFirstChild.setAttribute('foo', 'bar');
	var expected = [
		[true],
		false,
		new Date(),
		function () {},
		window.scrollTo,
		document.getElementById,
		1,
		/lorem|ipsum/,
		'lorem ipsum dolor sit amet',
		'lorem\nipsum\rdolor\ssit\tamet',
		{ a: 'lorem', b: 'ipsum', c: 'dolar', d: 'sit', e: 'amet' },
		divFirstChild
	];
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	// Array
	strictEqual(actual.length, expected.length, 'Strict Equal Length of Array');
	strictEqual(actual.length, 12, 'Strict Equal Length of Actual Array');
	strictEqual(actual.length, 12, 'Strict Equal Length of Expected Array');
	// Array within Array
	strictEqual(actual[0].length, expected[0].length, 'Strict Equal Length of Array within Array');
	// Boolean
	strictEqual(actual[1], expected[1], 'Strict Equal of Boolean');
	// Date
	same(actual[2], expected[2], 'Sameness of Date');
	strictEqual(actual[2].constructor, expected[2].constructor, 'Strict Equal Constructor of Date');
	strictEqual(actual[2].getTime(), expected[2].getTime(), 'Strict Equal Time of Date');
	// Function
	strictEqual(String(actual[3]), String(expected[3]), 'Strict Equal of Function');
	// Native Window Function
	strictEqual(String(actual[4]), String(expected[4]), 'Strict Equal of Native Window Function');
	// Native Document Function
	strictEqual(String(actual[5]), String(expected[5]), 'Strict Equal of Native Document Function');
	// Number
	strictEqual(actual[6], expected[6], 'Strict Equal of Number');
	// Number
	same(actual[7], expected[7], 'Sameness of Regular Expression');
	// String
	strictEqual(actual[8], expected[8], 'Strict Equal of String');
	// String with Special Characters
	strictEqual(actual[9], expected[9], 'Strict Equal of String with Special Characters');
	// Object
	same(actual[10], expected[10], 'Sameness of Object');
	strictEqual(actual[10].a, expected[10].a, 'Strict Equal of Property "a" in Object');
	strictEqual(actual[10].e, expected[10].e, 'Strict Equal of Property "e" in Object');
	// DOM Element
	strictEqual(actual[11].constructor, expected[11].constructor, 'Strict Equal Constructor of DOM Element');
	strictEqual(actual[11].nodeName, expected[11].nodeName, 'Strict Equal Node Name of DOM Element');
	strictEqual(actual[11].ownerDocument, expected[11].ownerDocument, 'Strict Equal Owner Document of DOM Element');
	strictEqual(actual[11].ownerDocument, document, 'Strict Equal Owner Document of Actual DOM Element');
	strictEqual(expected[11].ownerDocument, document, 'Strict Equal Owner Document of Expected DOM Element');
	strictEqual(actual[11].attributes.length, expected[11].attributes.length, 'Strict Equal Attributes Length of DOM Element');
	strictEqual(actual[11].attributes.length, 3, 'Strict Equal Attributes Length of Actual DOM Element');
	strictEqual(expected[11].attributes.length, 3, 'Strict Equal Attributes Length of Expected DOM Element');
	strictEqual(actual[11].getAttribute('foo', 'bar'), expected[11].getAttribute('foo', 'bar'), 'Strict Equal Attribute of "foo" of DOM Element');
	strictEqual(actual[11].innerHTML, expected[11].innerHTML, 'Strict Equal Inner HTML of DOM Element');

});

test("Stash gets and sets an Object containing Mixed Values", 26, function () {

	// Setup
	var div = document.createElement('div');
	div.innerHTML = '<div id="lorem" class="ipsum dolar">sit amet</div>';
	var divFirstChild = div.firstChild;
	divFirstChild.setAttribute('foo', 'bar');
	var expected = {
		a: [true],
		b: false,
		c: new Date(),
		d: function () {},
		e: window.scrollTo,
		f: document.getElementById,
		g: 1,
		h: /lorem|ipsum/,
		i: 'lorem ipsum dolor sit amet',
		j: 'lorem\nipsum\rdolor\ssit\tamet',
		k: { a: 'lorem', b: 'ipsum', c: 'dolar', d: 'sit', e: 'amet' },
		l: divFirstChild
	};
	stash.set('val', expected);
	var actual = stash.get('val');

	// Test
	// Array
	strictEqual(actual.constructor, expected.constructor, 'Strict Equal Constructor of Object');
	// Array within Object
	strictEqual(actual.a.length, expected.a.length, 'Strict Equal Length of Array within Object');
	// Boolean
	strictEqual(actual.b, expected.b, 'Strict Equal of Boolean');
	// Date
	same(actual.c, expected.c, 'Sameness of Date');
	strictEqual(actual.c.constructor, expected.c.constructor, 'Strict Equal Constructor of Date');
	strictEqual(actual.c.getTime(), expected.c.getTime(), 'Strict Equal Time of Date');
	// Function
	strictEqual(String(actual.d), String(expected.d), 'Strict Equal of Function');
	// Native Window Function
	strictEqual(String(actual.e), String(expected.e), 'Strict Equal of Native Window Function');
	// Native Document Function
	strictEqual(String(actual.f), String(expected.f), 'Strict Equal of Native Document Function');
	// Number
	strictEqual(actual.g, expected.g, 'Strict Equal of Number');
	// Number
	same(actual.h, expected.h, 'Sameness of Regular Expression');
	// String
	strictEqual(actual.i, expected.i, 'Strict Equal of String');
	// String with Special Characters
	strictEqual(actual.j, expected.j, 'Strict Equal of String with Special Characters');
	// Object
	same(actual.h, expected.h, 'Sameness of Object');
	strictEqual(actual.k.a, expected.k.a, 'Strict Equal of Property "a" in Object');
	strictEqual(actual.k.e, expected.k.e, 'Strict Equal of Property "e" in Object');
	// DOM Element
	strictEqual(actual.l.constructor, expected.l.constructor, 'Strict Equal Constructor of DOM Element');
	strictEqual(actual.l.nodeName, expected.l.nodeName, 'Strict Equal Node Name of DOM Element');
	strictEqual(actual.l.ownerDocument, expected.l.ownerDocument, 'Strict Equal Owner Document of DOM Element');
	strictEqual(actual.l.ownerDocument, document, 'Strict Equal Owner Document of Actual DOM Element');
	strictEqual(expected.l.ownerDocument, document, 'Strict Equal Owner Document of Expected DOM Element');
	strictEqual(actual.l.attributes.length, expected.l.attributes.length, 'Strict Equal Attributes Length of DOM Element');
	strictEqual(actual.l.attributes.length, 3, 'Strict Equal Attributes Length of Actual DOM Element');
	strictEqual(expected.l.attributes.length, 3, 'Strict Equal Attributes Length of Expected DOM Element');
	strictEqual(actual.l.getAttribute('foo', 'bar'), expected.l.getAttribute('foo', 'bar'), 'Strict Equal Attribute of "foo" of DOM Element');
	strictEqual(actual.l.innerHTML, expected.l.innerHTML, 'Strict Equal Inner HTML of DOM Element');

});