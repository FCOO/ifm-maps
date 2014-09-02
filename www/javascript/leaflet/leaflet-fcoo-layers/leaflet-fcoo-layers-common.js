/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * Web Map Service layers without hassle.
 */

L.FLayer = L.TileLayer.WMS.extend({
        //baseUrl: "http://wms-dev01:8080/{dataset}.wms",
        baseUrl: "http://api.fcoo.dk/webmap/{dataset}.wms",
        //baseUrl: "http://webmap-stag01:8080/{dataset}.wms",
	defaultWmsParams: {
		service: 'WMS',
		request: 'GetMap',
		version: '1.1.1',
		layers: '',
		styles: '',
		format: 'image/png',
                crs: L.CRS.EPSG3857,
		transparent: true,
	},
        options: {
                tileSize: 512,
                opacity: 0.45,
		maxZoom: 18,
		showLegend: true,
		legendImagePath: null,
		legendPosition: 'bottomleft',
                legendAttribution: null,
                crs: L.CRS.EPSG3857,
		attribution: 'Weather from <a href="http://fcoo.dk/" alt="Danish Defence METOC Forecast Service">FCOO</a>'
	},

	initialize: function (dataset, options) {
		this._fcootileurl = this.baseUrl.replace('{dataset}', dataset);
		this._map = null;
		this._legendControl = null;
		this._legendId = null;
                this._timesteps = null;
                this._timestepsready = false;
                L.TileLayer.WMS.prototype.initialize.call(this, this._fcootileurl, options);
                jQuery.support.cors = true;
                $.ajax({
                  url: this._fcootileurl,
                  data: {SERVICE: 'WMS', REQUEST: 'GetCapabilities', VERSION: this.wmsParams.version},
                  context: this,
                  error: this._error_capabilities,
                  success: this._got_capabilities,
                  cache: true,
                  dataType: 'xml',
                  async: true
                });
	},

        setParams: function (params, noRedraw) {
                L.extend(this.wmsParams, params);
                if (!noRedraw) {
                        this._abortLoading();
                        this.redraw();
                }
                return this;
        },

        _error_capabilities: function(jqXHR, textStatus, err) {
                console.error(textStatus);
        },

        _got_capabilities: function(xml, textStatus, jqXHR) {
                try {
                     var first_layer = this.wmsParams.layers.split(':')[0];
                     var $xml = $(xml),
                         belem = $xml.find('Name').filter(function () {
                           return $( this ).text() === first_layer;
                         }).parent().find('BoundingBox');
                     var bounds = L.latLngBounds(L.latLng(belem.attr('miny'), belem.attr('minx')), 
                                                 L.latLng(belem.attr('maxy'), belem.attr('maxx')));
                     this.wmsParams.bounds = bounds;
                     // Get time extent
                     $xml = $(xml),
                         belem = $xml.find('Name').filter(function () {
                           return $( this ).text() === first_layer;
                         }).parent().find('Extent');
                     this._timesteps = Array();
                     var extent = belem.text()
		     if (typeof extent != 'undefined') {
                         extent = extent.split(',');
                         // Make array of timesteps for this layer
                         function parseDecimalInt(s) {
                             return parseInt(s, 10);
                         }
                         var dt1 = extent[0].split('T');
                         var d1 = dt1[0].split('-').map(parseDecimalInt);
                         var t1 = dt1[1].split(':').map(parseDecimalInt);
                         var dt2 = extent[extent.length-1].split('T');
                         var d2 = dt2[0].split('-').map(parseDecimalInt);
                         var t2 = dt2[1].split(':').map(parseDecimalInt);
                         var currentdate = new Date(Date.UTC(d1[0], d1[1]-1, d1[2], t1[0], t1[1], t1[2]));
                         var enddate = new Date(Date.UTC(d2[0], d2[1]-1, d2[2], t2[0], t2[1], t2[2]));
                         var i = 0;
                         while (currentdate <= enddate) {
                                 this._timesteps[i] = new Date(currentdate);
                                 i = i+1;
                                 currentdate = currentdate.addHours(1);
                         }
                     }
                     this._timestepsready = true;
                } catch (err) {
                     //console.log('Error accessing: ' + jqXHR.url);
                     throw err;
                }
        },

        getTimesteps: function(callback) {
                 if (this._timestepsready === true) {
                         return this._timesteps;
                 } else {
                         return null;
                 }
        },

	onAdd: function(map) {
		this._map = map;
		if (this.options.showLegend && this.options.legendImagePath != null) {
			this._legendControl = this._getLegendControl();
			this._legendId = this._legendControl.addLegend(this.options.legendImagePath, this.options.legendAttribution);
		}
		L.TileLayer.WMS.prototype.onAdd.call(this, map);
	},

	onRemove: function(map) {
		if (this._legendControl != null) {
			this._legendControl.removeLegend(this._legendId);
			this._legendControl = null;
			this._legendId = null;
		}
		L.TileLayer.WMS.prototype.onRemove.call(this, map);
		this._map = null;
	},

	_getLegendControl: function() {
		if (typeof this._map._fcoo_legendcontrol == 'undefined' || !this._map._fcoo_legendcontrol) {
			this._map._fcoo_legendcontrol = new L.FLayer.LegendControl({position: this.options.legendPosition});
			this._map.addControl(this._map._fcoo_legendcontrol);
		}
		return this._map._fcoo_legendcontrol;
	}
});

L.FLayerGroup = L.LayerGroup.extend({
        getTimesteps: function() {
                 var layers = this.getLayers();
                 // For now we just use the timesteps of the first layer
                 var timesteps = layers[0].getTimesteps();
                 return timesteps;
        },
        setParams: function(date) {
                 this.eachLayer(function(layer) {
                         layer.setParams(date);
                 });
        },
});

L.FLayer.LegendControl = L.Control.extend({
	options: {
		position: "bottomleft"
	},

	initialize: function(options) {
		L.Util.setOptions(this, options);
		this._container = L.DomUtil.create('div', 'fcoo-legend-container');
		this._container.style.display = 'none';
		this._legendCounter = 0;
		this._legendContainer = new Array();
	},

	onAdd: function(map) {
		return this._container;
	},

	addLegend: function(legendImagePath, legendAttribution) {
		var legendId = this._legendCounter++;
	        var legendInfo = {
		        imagePath: legendImagePath,
		        attribution: legendAttribution
                }
		this._legendContainer[legendId] = legendInfo;
		this._redrawLegend();
		this._container.style.display = 'block';
		return legendId;
	},

	removeLegend: function(legendId) {
		if (typeof this._legendContainer[legendId] != 'undefined') {
			delete this._legendContainer[legendId];
		}
		// reset counter if no legend is in collection
		var containerEmpty = true;
		for (var idx in this._legendContainer) {
			containerEmpty = false;
			break;
		}
		if (containerEmpty) {
			this._legendCounter = 0;
			this._container.style.display = 'none';
		}
		this._redrawLegend();
	},

	_redrawLegend: function() {
		this._container.innerHTML = ''; // clear container
		var isLeft = this.options.position.indexOf('left') !== -1;
		var cssFloat = isLeft ? 'left' : 'right';
                //var window_height = $(window).height();
                //var accumulated_height = 0;
		for (var idx in this._legendContainer) {
			var imgPath = this._legendContainer[idx]['imagePath'];
			var attribution = this._legendContainer[idx]['attribution'];
			var item = L.DomUtil.create('div', 'fcoo-legend-item', this._container);
			item.style.cssFloat = cssFloat;
			if (isLeft) {
				item.style.marginRight = '10px';
			} else {
				item.style.marginLeft = '10px';
			}
                        var leginner = '<img src="' + imgPath + '" border="0" height="70" width="250" />';
                        if (attribution != null) {
                            leginner = leginner + '<br />' + attribution;
                        }
			item.innerHTML = leginner;
                        //var height = $(item).height();
			var br = L.DomUtil.create('br', '', this._container);
		}
	}
});

L.FLayer.Utils = {
	i18n: {
		en: {
			fcoolinktitle: 'Details at FCOO'
			, temperature: 'Temperature'
			, temp_minmax: 'Temp. min/max'
			, wind: 'Wind'
			, gust: 'Gust'
			, windforce: 'Wind Force'
			, direction: 'Direction'
			, humidity: 'Humidity'
			, pressure: 'Pressure'
		},
		da: {
			fcoolinktitle: 'Detaljer ved FCOO'
			, temperature: 'Temperatur'
			, temp_minmax: 'Temp. min/max'
			, wind: 'Vind'
			, gust: 'Vindstoed'
			, windforce: 'Vindstyrke'
			, direction: 'Vindretning'
			, humidity: 'Luftfugtighed'
			, pressure: 'Lufttryk'
		}
	}
};
