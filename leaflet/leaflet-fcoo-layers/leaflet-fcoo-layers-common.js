/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * Web Map Service layers without hassle.
 */
L.FLayer = L.TileLayer.WMS.extend({
        baseUrl: "http://wms-dev01:8080/{dataset}.wms",
        //baseUrl: location.protocol + "//{s}.fcoo.dk/webmap/{dataset}.wms",
        //baseUrl: location.protocol + "//webmap-stag01:8080/{dataset}.wms",
	defaultWmsParams: {
		service: 'WMS',
		request: 'GetMap',
		version: '1.1.1',
		layers: '',
		styles: '',
		format: 'image/png',
		transparent: true,
	},
        defaultLegendParams: {
                service: 'WMS',
                request: 'GetColorbar',
                version: '1.1.1',
                layers: '',
                styles: 'horizontal,nolabel',
                format: 'image/png',
                transparent: false,
                cmap: '',
        },
        options: {
                language: 'en',
                tileSize: 512,
                opacity: 1.00,
                subdomains: ['api01', 'api02', 'api03', 'api04', 'api05'],
		maxZoom: 18,
		showLegend: true,
		legendImagePath: null,
		legendPosition: 'bottomleft',
                legendAttribution: null,
                foreground: null,
                crs: L.CRS.EPSG3857,
		attribution: 'Weather from <a href="http://fcoo.dk/" alt="Danish Defence METOC Forecast Service">FCOO</a>'
	},

	initialize: function (dataset, options) {
		this._basetileurl = this.baseUrl.replace('{dataset}', dataset);
		this._map = null;
		this._legendControl = null;
		this._legendId = null;
                this._timesteps = null;
                this._timestepsready = false;
                L.TileLayer.WMS.prototype.initialize.call(this, this._basetileurl, options);
                jQuery.support.cors = true;
                // We just select a subdomain to request capabilities from
                // based on the dataset name and layer names. This is simply
                // done to distribute the requests somewhat between the
                // subdomains.
                var subindex = dataset.length + options.layers.length;
                subindex = subindex % this.options.subdomains.length;
                this._fcootileurl = L.Util.template(this._basetileurl, 
                               {s: this.options.subdomains[subindex]});

                $.ajax({
                  url: this._fcootileurl,
                  data: {SERVICE: 'WMS', REQUEST: 'GetCapabilities', VERSION: this.wmsParams.version},
                  context: this,
                  error: this._error_capabilities,
                  success: this._got_capabilities,
                  beforeSend: function(jqXHR, settings) {
                      jqXHR.url = settings.url;
                  },
                  cache: true,
                  dataType: "text", // seems to work for all browsers
                  //dataType: ($.browser.msie) ? "text" : "xml", // text for IE, xml for the rest
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

        getTileUrl: function (coords) {
                /*
                 * Override getTileUrl when requesting data outside 
                 * time range.
                 * When outside we just return an empty string for the url.
                 */

                // Check if within time range
                var load_tile = true;
                function parseDecimalInt(s) {
                        return parseInt(s, 10);
                }
                var stime = this.wmsParams.time;
                // wmsParams.time might not yet be initialized.
                // In that case we just request the image even
                // if it is out of time range
                if (stime !== undefined) {
                        var sptime = stime.split('T');
                        if (sptime.length == 2) {
                                var date = sptime[0].split('-').map(parseDecimalInt);
                                var time = sptime[1].split(':').map(parseDecimalInt);
                                var timestep = new Date(Date.UTC(date[0], date[1]-1, date[2],
                                                         time[0], time[1], time[2]));
                                var timesteps = this.getTimesteps()
                                if (timesteps !== null && (timestep < timesteps[0] ||
                                     timestep > timesteps[timesteps.length-1])) {
                                     load_tile = false;
                                }
                        }
                }
 
                if (load_tile) {
                        var url = L.TileLayer.WMS.prototype.getTileUrl.call(this, coords);
                } else {
                        var url = "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
                }
                return url;
        },

        _error_metadata: function(jqXHR, textStatus, err) {
                var msg = 'Failed getting web map metadata from ' + jqXHR.url;
                var n = noty({text: msg, type: "error"});
                throw new Error(msg);
        },

        _got_metadata: function(json, textStatus, jqXHR) {
                if (this._legendControl != null) {
                    try {
                        var last_modified = json.last_modified;
                        this._last_modified = moment(last_modified);
                        var variable = json[this.options.layers.split(':')[0]];
                        this._long_name = variable['long_name'];
                        this._units = variable['units'];
                        var legendId = this._legendId;
                        this._legendControl.legendOptions[legendId].lastUpdated = this._last_modified;
                        this._legendControl.legendOptions[legendId].longName = this._long_name;
                        this._legendControl.legendOptions[legendId].units = this._units;
		        this._legendControl._redrawLegend();
                    } catch (err) {
                        console.log(err);
                        var n = noty({text: err.message, type: "error"});
                        throw err;
                    }
                }
        },

        _error_capabilities: function(jqXHR, textStatus, err) {
                var msg = 'Failed getting web map capabilities from ' + jqXHR.url;
                var n = noty({text: msg, type: "error"});
                throw new Error(msg);
        },

        _got_capabilities: function(xml, textStatus, jqXHR) {
                try {
                     var first_layer = this.wmsParams.layers.split(':')[0];
                     var $xml = $(xml);
                     belem = $xml.find('Name').filter(function () {
                           return $( this ).text() === first_layer;
                     })
                     if (typeof belem[0] == 'undefined' || belem[0] == '') {
                         var msg = "Failed finding layer element " +
                                   first_layer + " in url: " + jqXHR.url;
                         throw new Error(msg);
                     }
                     belem = belem.parent().find('BoundingBox');
                     if (typeof belem[0] == 'undefined') {
                         var msg = "Failed finding bounding box for layer " +
                                   first_layer + " in url: " + jqXHR.url;
                         throw new Error(msg);
                     }
                     var minx = belem.attr('minx'),
                         miny = belem.attr('miny'),
                         maxx = belem.attr('maxx'),
                         maxy = belem.attr('maxy');
                     minx = (minx > 180.0) ? minx - 360.0 : minx;
                     maxx = (maxx > 180.0) ? maxx - 360.0 : maxx;
                     var bounds = L.latLngBounds(L.latLng(miny, minx), 
                                                 L.latLng(maxy, maxx));
                     this.options.bounds = bounds;
                     // Get time extent
                     $xml = $(xml),
                         belem = $xml.find('Name').filter(function () {
                           return $( this ).text() === first_layer;
                         }).parent().find('Extent');
                     this._timesteps = Array();
                     var extent = belem.text()
                     if (typeof extent == 'undefined' || extent == '') {
                         var msg = "Failed getting forecast time range for layer " +
                                   first_layer + " using url: " + jqXHR.url;
                         throw new Error(msg);
                     }
		     if (typeof extent != 'undefined') {
                         extent = extent.split(',');
                         // Make array of timesteps for this layer
                         function parseDecimalInt(s) {
                             return parseInt(s, 10);
                         }
                         for (var i=0; i<extent.length; i++) {
                             var dt = extent[i].split('T');
                             var d = dt[0].split('-').map(parseDecimalInt);
                             var t = dt[1].split(':').map(parseDecimalInt);
                             var currentdate = new Date(Date.UTC(d[0], d[1]-1, d[2], t[0], t[1], t[2]));
                             this._timesteps[i] = new Date(currentdate);
                         }
                     }
                     this._timestepsready = true;
                } catch (err) {
                     //console.log('Error accessing: ' + jqXHR.url);
                     console.log(err);
                     var n = noty({text: err.message, type: "error"});
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
                        var legendOptions = {
                            'imageUrl': this.options.legendImagePath,
                            'attribution': this.options.legendAttribution,
                            'lastUpdated': this._last_modified
                        }
			this._legendId = this._legendControl.addLegend(
                            legendOptions);
		}
                if (this.options.foreground != null) {
                    this.options.foreground.addTo(map);
                }
		L.TileLayer.WMS.prototype.onAdd.call(this, map);

                if (this._legendControl != null) {
                    $.ajax({
                      url: this._fcootileurl,
                      data: {
                              SERVICE: 'WMS',
                              REQUEST: 'GetMetadata',
                              VERSION: this.wmsParams.version,
                              ITEMS: 'last_modified,long_name,units',
                              LAYERS: this.options.layers.split(':')[0],
                            },
                      context: this,
                      error: this._error_metadata,
                      success: this._got_metadata,
                      beforeSend: function(jqXHR, settings) {
                          jqXHR.url = settings.url;
                      },
                      cache: true,
                      dataType: "json",
                      async: true
                    });
                }
	},

	onRemove: function(map) {
		if (this._legendControl != null) {
			this._legendControl.removeLegend(this._legendId);
			this._legendControl = null;
			this._legendId = null;
		}
                if (this.options.foreground != null) {
                    this.options.foreground.removeFrom(map);
                }
		L.TileLayer.WMS.prototype.onRemove.call(this, map);
		this._map = null;
	},

	_getLegendControl: function() {
		if (typeof this._map._fcoo_legendcontrol == 'undefined' || !this._map._fcoo_legendcontrol) {
			this._map._fcoo_legendcontrol = new L.Control.Legend(
                            this._map, {position: this.options.legendPosition,
                                        language: this.options.language});
			this._map.addControl(this._map._fcoo_legendcontrol);
		}
		return this._map._fcoo_legendcontrol;
	}
});

L.FLayer.Fcoo = new Object();
L.FLayer.Dmi = new Object();
L.FLayer.Ecmwf = new Object();
L.FLayer.Noaa = new Object();
L.FLayer.Impact = new Object();

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
