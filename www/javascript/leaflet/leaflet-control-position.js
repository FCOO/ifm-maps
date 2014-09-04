if (typeof console == "undefined") {
	this.console = { log: function (msg) { /* do nothing since it would otherwise break IE */} };
}


L.Control.Position = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topright',
		text: 'Zoom to (lon, lat) position',
		bounds: null, // L.LatLngBounds
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;

		var className = 'leaflet-control-position',
		container = this._container = L.DomUtil.create('div', className);

		L.DomEvent.disableClickPropagation(container);

		var form = this._form = L.DomUtil.create('form', className + '-form');

		var input_lon = this._input_lon = document.createElement('input');
                input_lon.className = className + '-form-input-lon';
		input_lon.type = "number";
		input_lon.name = "lon";
		input_lon.step = "any";
                input_lon.min = -180.0;
                input_lon.max = 180.0;
                input_lon.required = true;
                input_lon.placeholder = "Decimal longitude";
		var input_lat = this._input_lat = document.createElement('input');
                input_lat.className = className + '-form-input-lat';
		input_lat.type = "number";
		input_lat.name = "lat";
		input_lat.step = "any";
                input_lat.min = -85.0;
                input_lat.max = 85.0;
                input_lat.required = true;
                input_lat.placeholder = "Decimal latitude";

		var submit = document.createElement('input');
		submit.type = "submit";
		submit.value = this.options.text;

		form.appendChild(input_lon);
		form.appendChild(input_lat);
		form.appendChild(submit);

		L.DomEvent.addListener(form, 'submit', this._position, this);

		if (this.options.collapsed) {
			L.DomEvent.addListener(container, 'mouseover', this._expand, this);
			L.DomEvent.addListener(container, 'mouseout', this._collapse, this);

			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Input longitude and latitude';

			L.DomEvent.addListener(link, L.Browser.touch ? 'click' : 'focus', this._expand, this);

			this._map.on('movestart', this._collapse, this);
		} else {
			this._expand();
		}

		container.appendChild(form);

		return container;
	},
    
    /* helper functions for cordinate extraction */
    _isLatLon : function (q) {
        //"lon lat" => xx.xxx x.xxxxx
        var re = /(-?\d+\.\d+)\s(-?\d+\.\d+)/;
        var m = re.exec(q);
        if (m != undefined) return m;

        //lat...xx.xxx...lon...x.xxxxx
        re = /lat\D*(-?\d+\.\d+)\D*lon\D*(-?\d+\.\d+)/;
        m = re.exec(q);
        //showRegExpResult(m);
        if (m != undefined) return m;
        else return null;
    },
    _isLatLon_decMin : function (q) {
        console.log("is LatLon?: "+q);
        //N 53° 13.785' E 010° 23.887'
        //re = /[NS]\s*(\d+)\D*(\d+\.\d+).?\s*[EW]\s*(\d+)\D*(\d+\.\d+)\D*/;
        re = /([ns])\s*(\d+)\D*(\d+\.\d+).?\s*([ew])\s*(\d+)\D*(\d+\.\d+)/i;
        m = re.exec(q.toLowerCase());
        //showRegExpResult(m);
        if ((m != undefined)) return m;
        else return null;
        // +- dec min +- dec min
    },

    _position : function (event) {
        L.DomEvent.preventDefault(event);
        var lon = parseFloat(this._input_lon.value);
        var lat = parseFloat(this._input_lat.value);
        this._map.panTo([lat, lon]);
    },

     _expand: function () {
          L.DomUtil.addClass(this._container, 'leaflet-control-position-expanded');
     },

     _collapse: function () {
         this._container.className = this._container.className.replace(' leaflet-control-position-expanded', '');
     }
});
