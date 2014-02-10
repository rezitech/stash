window.onload = function() {
  //clear all
  stash.cutAll();

  //Normal Stash
  test( "Normal use", function() {
    stash.set('foo', 'Hello World');
    stash.set('bar', 7);
    stash.set('baz', ['THX', 1138]);
    stash.set('qux', { a: 'lorem', b: true, c: [1, 2, 3], d: function (v) { return 'success '+v; } });
    equal( stash.get('foo'), 'Hello World', "Saving and retrieving String" );
    equal( stash.get('bar'), 7, "Saving and retrieving Number");
    deepEqual( stash.get('baz'), ["THX", 1138], "Saving and retrieving a Array");
    //JSON and deepEqual do not evaluate functions
    deepEqual( JSON.stringify(stash.get('qux')), '{"a":"lorem","b":true,"c":[1,2,3]}', "Saving and retrieving complex Object" );
    equal( stash.get('qux').d('doubled'), 'success doubled', "Working with saved functions into Objects" );
  });

  test( "Adding data intelligently to existing data", function() {
    stash.set('foo', 1);
    stash.set('bar', { a: 'lorem' });
    stash.add('foo', 5);
    stash.add('bar', { b: 'ipsum' });
    equal( stash.get('foo'), 6, "Add Number to existing Number return a Sum" );
    deepEqual( stash.get('bar'), { a: 'lorem', b: 'ipsum' }, "Add a Object into a Object" );
  });

  test( "Saving DOM elements", function() {
    // create a DIV element with innerHTML and a "foo" attribute
    var div = document.createElement('div');
    div.innerHTML = 'Hello World';
    div.setAttribute('foo', 'bar');
    // set foo as the DIV element
    stash.set('foo', div);
    // asserts
    equal( stash.get('foo').nodeName, "DIV", "Saving a DIV return a HTML Element");
    equal( stash.get('foo').innerHTML, "Hello World", "innerHTML is the one seted" );
    equal( stash.get('foo').getAttribute('foo'), "bar", "Attribute is the same of the element created" );
  });

  test( "Features: State changed", function() {
    equal(stash.set('a', 'foo'), 1, "First set return 1");
    equal(stash.set({ b: 'bar', c: 'baz'}), 1, "First set return 1");
    equal(stash.set('a', 'foo'), 2, "Second set return 2");
    equal(stash.set('a', 'fee'), 1, "First set return 1");
    equal(stash.set({ b: 'foo', c: 'baz' }), 1, "Second set return 2"); //should be 2!!
  });

  test( "Features: get", function() {
    stash.set('foo', 'Success');
    equal(stash.get('foo'), "Success", "Return the same value saved");
    equal(stash.set('a', 'foo'), 1, "set ok");
    equal(stash.get('a'), "foo", "return value ok");
    equal(stash.add('a', '!'), 1, "set ok");
    equal(stash.get('a'), "foo!", "added");
    equal(stash.add('a', ''), 2, "value changed");
    equal(stash.get('a'), "foo!", "value returned is the same");
  });

  test( "Features: getAsString", function() {
    stash.cutAll();
    stash.set('foo', { e: 1, f: 'two' });
    equal(stash.getAsString('foo'), "{'e':1,'f':'two'}", "Return the value saved as String");
  });

  test( "Features: getAll", function() {
    stash.cutAll();
    stash.set('foo', "Success");
    stash.set('bar', "Success");
    deepEqual(stash.getAll(), { foo: "Success", bar: "Success" }, "getAll saved");
  });

  test( "Features: cut - remove", function() {
    equal(stash.set('a', 'foo'), 1, "enter value");
    equal(stash.get('a'), "foo", "value exist");
    stash.cut('a');
    equal(stash.get('a'), undefined, "value removed");
  });

};