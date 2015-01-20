(function () {
  /* global L */
  'use strict';
  L.Control.HomeButton = L.Control.extend({
    options: {
      position: 'topleft',
      href: location.protocol + '//fcoo.dk',
      text: 'Home',
      title: 'Navigate to home page',
      className: 'leaflet-control-home'
    },
    onAdd: function (map) {
      this._map = map;
      return this._initLayout();
    },
    _initLayout: function () {
      var container = L.DomUtil.create('div', 'leaflet-bar ' +
        this.options.className);
      this._container = container;
      this._homeButton = this._createHomeButton(container);

      L.DomEvent.disableClickPropagation(container);
      return this._container;
    },
    _createHomeButton: function () {
      var link = L.DomUtil.create('a', this.options.className + '-toggle',
        this._container);
      link.href = this.options.href;
      link.innerHTML = this.options.text;
      link.title = this.options.title;

      L.DomEvent
        .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
        //.on(link, 'click', L.DomEvent.stop)
      return link;
    },
  });

  L.control.homeButton = function (options) {
    return new L.Control.HomeButton(options);
  };

  return L.Control.HomeButton;

}());

