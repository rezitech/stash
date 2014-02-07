window.onload = function() {
  var use_cache = true;
  function look_cache(results) {
    console.log("look_cache")
    console.log(jQuery.fn.jquery)
    console.log(stash.processJSON)
    if (use_cache) {
      stash.onLine = false;
      use_cache = false;
      stash.cache_init(look_cache);
    };
  }
  stash.cache_init(look_cache);
};