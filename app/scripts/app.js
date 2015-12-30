/*
Copyright (c) 2015 ubs121
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // filter menu
  app.filterCuisine = ['asian', 'mongolian', 'japanese', 'korean', 'chinese', 'pizza', 'vegan', 'fast food'];
  app.filterLocation = ['east', 'west', 'center', 'south', 'north'];

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }


  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  window.addEventListener('paper-header-transform', function(e) {
    var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
    var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
    var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    // appName max size when condensed. The smaller the number the smaller the condensed size.
    var maxMiddleScale = 0.50;
    var auxHeight = heightDiff - detail.y;
    var auxScale = heightDiff / (1 - maxMiddleScale);
    var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };


  app.data = {};
  app.rs = {}; // on screen data
  app.restObj = {};
  app.reviewObj = {};
  app.sortBy = 0;

  app.loadData = function(e) {
    fetch('data/restaurant.json')
      .then(function(response) { 
        response.json().then(function(jsonArr) {
          console.log(jsonArr);
          // TODO: needs pagination for large data
          
          for (var i = 0; i < jsonArr.length; i++) {
            // TODO: tokenize & create tags

          }

          app.rs = jsonArr;
          app.data = jsonArr;

          // TODO: save to storage

        });
      })
      .catch(function(err) {

      });
  };

  app.sort = function(e) {
    // TODO: sort by
    console.log(app.sortBy);
  };

  app.filter = function(e) {
    // TODO: filter by
    var msg = e.target.dataMsg || e.target.dataset['msg'];
    var field = e.target.dataField || e.target.dataset['field'];
    

    if (field == "cuisine") {
      console.log(msg);
    }

    app.closeDrawer();
  };

  app.setRestaurant = function(name) {
    for (var i = 0; i < app.data.length; i++) {
      if (app.data[i].name == name) {
        // set current restaurant
        app.restObj = app.data[i];
        return;
      }
    }

    // not found
    app.restObj = {};
  };

  
  app.submitReview = function(e) {

    // validate form
    var reviewElem = Polymer.dom(document).querySelector('write-review');
    if (!reviewElem.validate()) {
      app.$.toast.text = "Invalid form!";
      app.$.toast.show();
      return;
    }
    
    // fill auto fields    
    var today = new Date();
    app.reviewObj.restaurant = app.params.name;
    app.reviewObj.date = formatDate(today);

    // TODO: save to localstorage
    console.log('saved!', app.reviewObj);
  };

  app.fullUrl = function(url) {
    if (!url) {
      return "";
    }

    console.log("url", url);
    
    if (url.startsWith("http")) {
      return url;
    }

    if (!url.startsWith("www")) {
      url = "www." + url;
    }

    return "http://" + url;
  };

  app.timetable = function(hours) {
    if (!hours) {
      return "";
    }

    // convert map into human readable format
    return Object.keys(hours).map(function(d){return d + ' ' + hours[d];}).join(',');
  };


  // load data
  app.loadData();

})(document);
