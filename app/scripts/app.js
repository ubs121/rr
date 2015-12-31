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
  app.filterCuisine = ['asian', 'mongolian', 'indian', 'japanese', 'korean', 'chinese', 'pizza', 'vegan', 'fast food'];
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


  app.data = {}; // restaurant data
  app.rs = []; // on screen copy of restaurants
  app.restObj = {}; // current restaurant
  app.reviewObj = {}; // current review
  app.sortBy = 0;
  app.filterBy = {};

  app.loadData = function(e) {
    // first load from localstorage
    if (localStorage.restaurant) {
      app.data = JSON.parse(localStorage.restaurant);
      app.populate();
      return;
    }

    // load from server
    fetch('data/restaurant.json')
      .then(function(response) { 
        response.json().then(function(jsonData) {
          app.data = jsonData;
          app.populate();

          // save to storage if it's first time
          localStorage.setItem("restaurant", JSON.stringify(app.data));
        });
      })
      .catch(function(err) {

      });
  };

  app.populate = function(e) {
    app.rs = Object.keys(app.data).map(function(r){return app.data[r];});
  };


  // Sorting
  app.sort = function(e) {
    if (app.sortBy == 0) {
      app.rs = app.rs.sort(ByRating).slice();
    } else if (app.sortBy == 1) {
      app.rs = app.rs.sort(ByName).slice();
    } else if (app.sortBy == 2) {
      app.rs = app.rs.sort(ByPrice).slice();
    }

    app.focusList();
  };

  // Filtering
  app.filter = function(e) {
    var msg = e.target.dataMsg || e.target.dataset['msg'];
    var field = e.target.dataField || e.target.dataset['field'];
    
    console.log(msg);

    app.filterBy[field] = msg;

    var rs = [];
    for (var key in app.data) {
      if (app.data.hasOwnProperty(key)) {
        var rest = app.data[key];

        // TODO: use AND filter (app.filterBy)

        if (field == "cuisine" && arrContains(rest.cuisine, [msg])) {
          rs.push(rest);
        }
        if (field == "location" && arrContains(rest.location, [msg])) {
          rs.push(rest);
        }
        if (field == "hours") {
          // TODO: filter by opening hours
        }
      }
    }

    app.rs = rs;


    app.focusList();
  };

  app.focusList = function(e) {
    app.closeDrawer();
    app.route = "rests";
    app.scrollPageToTop();
  };

  // Set current restaurant object
  app.setRestaurant = function(name) {
    app.restObj = app.data[name];
  };

  // save review
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

    // TODO: update total score

    
    console.log('saved!', app.reviewObj);

    // TODO: check duplication, accept only one review for one person
    var restObj = app.data[app.reviewObj.restaurant];
    if (!restObj.reviews) {
      restObj.reviews = [];
    }
    restObj.reviews.push(app.reviewObj);

    // FIXME: necceary ?
    app.data[app.reviewObj.restaurant] = restObj;

    // save to localstorage
    localStorage.setItem("restaurant", JSON.stringify(app.data));
  };

  // get last reviews
  app.lastReviews = function(restName) {
    var r = app.data[restName];
    var rr = [];
    if (r.reviews) {
      // at most, show 2 reviews
      for (var i = 0; i < r.reviews.length; i++) {
        rr.push(r.reviews[i]);
      }
      return rr;
    }

    return [{"reviewer":"ubs121", "review": "Nice!", "date": "2015-12-25"}];
  };

  app.fullUrl = function(url) {
    return fullUrl(url);
  };

  var price2str = {
    1: 'Cheap eat',
    2: 'Mid range',
    3: 'Fine dining'
  };

  app.priceStr = function(p) {
    return price2str[p];
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
