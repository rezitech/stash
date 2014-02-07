if (!stash) console.log("this code depends of stash.js to run");
var stash = (stash || {});
stash.cache_head = document.head || document.getElementsByTagName('head')[0];

stash.onLine = navigator.onLine;

stash.define_callback = function(node,url,callback) {
  var callback_name = url.split("callback=")[1].split("&")[0];
  window[callback_name]= function(o){
    callback&&callback(JSON.stringify(o),node,url);
  };
  return callback_name;
};

stash.loadJSON = function(node,url,callback){
  stash.define_callback(node,url,callback);
  document.getElementsByTagName('body')[0].appendChild((function(){
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = url;
    return s;
  })());
};

stash.loadDoc = function(node,url,callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      if (typeof callback != 'undefined') callback(xmlhttp.responseText,node,url);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
};

stash.getAsset = function(node,url,type,callback) {
  if (type=="jsonp-cache") {
    stash.loadJSON(node, url, callback);
  } else if (type=="src-cache" || type=="href-cache" ) {
    stash.loadDoc(node, url, callback);
  } else {
    //TODO: make this work like should be
    var query = "http://query.yahooapis.com/v1/public/yql?"+
                "q=select%20*%20from%20json%20where%20url%3D%22"+
                encodeURIComponent(url)+
                "%22&format=text";
    stash.loadDoc(node, query, callback);
  };
};

stash.process_results = function(results,callback) {
  for (url in results) {
    var node = results[url].node;
    var tag = node.tagName.toLowerCase();
    if (tag == "script") {
      if (node.getAttribute("jsonp-cache")) {
        var cb_name = url.split("callback=")[1].split("&")[0];
        results[url].data = "stash."+cb_name+"="+results[url].data;
      };
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.text = results[url].data;
      s.defer = true;
      node.parentNode.insertBefore(s, node.nextSibling);
    } else if (tag == "link") {
      var s = document.createElement('style');
      s.type = 'text/css';
      s.text = results[url].data;
      node.parentNode.insertBefore(s, node.nextSibling);
    };
  }
  if (typeof callback != "undefined") callback(results);
};

stash.cache_init = function(callback) {
  if (stash.onLine) {
    var nodes = document.querySelectorAll("[src-cache], [href-cache], [jsonp-cache]");
    stash.stack = nodes.length;
    stash.loaded = 0;
    stash.results = {};
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].getAttribute("src-cache")) {
        var type = "src-cache";
      } else if (nodes[i].getAttribute("href-cache")) {
        var type = "href-cache";
      } else {
        var type = "jsonp-cache";
      };
      var url = nodes[i].getAttribute(type);
      stash.results[url] = {order: i};
      stash.getAsset(nodes[i], url, type, function(data,node,url){
        stash.results[url] = {node: node, data: data};
        stash.loaded ++;
        if (stash.loaded == nodes.length) {
          stash.set("stash_cache_results",stash.results)
          stash.process_results(stash.results,callback)
        };
      });
    };
  } else {
    stash.process_results(stash.get("stash_cache_results"),callback)
  };
};

// if (window.addEventListener) {
//   window.addEventListener('load', stash.cache_init, false);
// } else if (window.attachEvent) {
//   window.attachEvent('onload', stash.cache_init);
// };