Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for(var i = 0, len = this.length; i < len; i++) {
    if(this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
}

if (!stash) console.log("this code depends of stash.js to run");
var stash = (stash || {});
stash.onLine = navigator.onLine;
stash.cache_force_CORS = false;
stash.cache_head = document.head || document.getElementsByTagName('head')[0];
stash.cache_ready = function(results){};

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
    if (xmlhttp) {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        if (typeof callback != 'undefined') callback(xmlhttp.responseText,node,url);
      }
    } else {
      if (typeof callback != 'undefined') callback(xmlhttp.responseText,node,url);
    };
  };
  xmlhttp.open("GET", url, true);
  if (!stash.cache_force_CORS) {
    xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  };
  xmlhttp.send();
};

stash.getAsset = function(node,url,type,callback) {
  if (stash.cache_force_CORS) {
    var query = "http://query.yahooapis.com/v1/public/yql?"+
                "q=select%20*%20from%20html%20where%20url%3D%22"+
                encodeURIComponent(url)+
                "%22&format=json";
    stash.loadDoc(node, query, callback);
  } else {
    if (type=="jsonp-cache") {
      stash.loadJSON(node, url, callback);
    } else {
      stash.loadDoc(node, url, callback);
    }
  };
};

stash.process_results = function(results) {
  for (url in results) {
    var node = results[url].node;
    var tag = node.tagName.toLowerCase();
    var head = document.head || document.getElementsByTagName('head')[0];
    var previous = document.querySelectorAll('[data-id="'+url+'"]');
    if (previous) previous.remove();
    if (tag == "script") {
      if (node.getAttribute("jsonp-cache")) {
        var cb_name = url.split("callback=")[1].split("&")[0];
        results[url].data = "stash."+cb_name+"="+results[url].data;
        node = document.querySelectorAll('[jsonp-cache="'+node.getAttribute("jsonp-cache")+'"]')[0];
      } else {
        node = document.querySelectorAll('[src-cache="'+node.getAttribute("src-cache")+'"]')[0];
      };
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.text = results[url].data;
      s.defer = true;
      s.setAttribute("data-id", url);
      // s.async = true;
      if (node) {
        node.parentNode.insertBefore(s, node.nextSibling);
      };
      // head.appendChild(s)
    } else if (tag == "link") {
      var css = results[url].data;
      var style = document.createElement('style');
      style.type = 'text/css';
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
      style.setAttribute("data-id", url);
      node = document.querySelectorAll('[href-cache="'+node.getAttribute("href-cache")+'"]')[0];
      // head.appendChild(s)
      if (node) {
        node.parentNode.insertBefore(style, node.nextSibling);
      };
    };
  }
  stash.cache_ready(results);
};

stash.cache_init = function() {
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
        if (stash.cache_force_CORS) {
          //!! This will not work well need a better proxy !!
          data = JSON.parse(data).query.results.body.p;
        };
        stash.results[url] = {node: node, data: data};
        stash.loaded ++;
        if (stash.loaded == nodes.length) {
          stash.set("stash_cache_results",stash.results)
          stash.process_results(stash.results)
        };
      });
    };
  } else {
    stash.process_results(stash.get("stash_cache_results"))
  };
};

if (window.addEventListener) {
  window.addEventListener('load', stash.cache_init, false);
} else if (window.attachEvent) {
  window.attachEvent('onload', stash.cache_init);
};