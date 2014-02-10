//clear all
stash.cutAll();
var use_cache = true;

stash.cache_ready = function(results){
  if (stash.onLine) {
    test( "Testing assets ONLINE", function() {
      equal(stash.onLine,true,"The application is running ONLINE")
      equal(jQuery.fn.jquery,"1.10.1","jQuery should be present and return the correct version")
      equal(stash.processJSON.generator,"http://www.flickr.com/","JSON return should bring the same info")
    });
  } else {
    test( "Testing assets OFFLINE", function() {
      equal(stash.onLine,false,"The application is running OFFLINE")
      equal(jQuery.fn.jquery,"1.10.1","jQuery should be present and return the correct version")
      equal(stash.processJSON.generator,"http://www.flickr.com/","JSON return should bring the same info")
    });
  };
  if (use_cache) {
    stash.onLine = false;
    use_cache = false;
    stash.cache_init();
  };
}
