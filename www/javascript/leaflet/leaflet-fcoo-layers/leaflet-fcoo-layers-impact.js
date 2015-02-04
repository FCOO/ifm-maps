/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * Web Map Service layers without hassle.
 */
L.FImpactLayer = L.FLayer.extend({
        onAdd: function(map) {
                this._map = map;
                if (this.options.showLegend && this.options.legendImagePath != null) {
                        this._legendControl = this._getLegendControl();
                        this._legendId = this._legendControl.addLegend(this, this.options.legendParameters, this.options.legendImagePath, this.options.legendAttribution);
                }
                if (this.options.foreground != null) {
                    this.options.foreground.addTo(map);
                }
                var expr = this.options.baseexpr;
                for (var param in this.options.legendParameters) {
                    var values = this.options.legendParameters[param].slider_options.values;
                    var minval = this.options.legendParameters[param].slider_options.min;
                    var maxval = this.options.legendParameters[param].slider_options.max;
                    var long_name = this.options.legendParameters[param].long_name;
                    var units = this.options.legendParameters[param].units;
                    // Find y = a*x + b params
                    var a = 80.0/(Math.abs(values[1]) - Math.abs(values[0]));
                    var b = 90.0 - a*values[1];
                    if (b < 0) {
                        var sgn = '-';
                        b = -b;
                    } else {
                        var sgn = '+';
                    }
                    $("#" + this._name + '_' + param).val(long_name + ": " + Math.abs(values[0]) + " - " + Math.abs(values[1]) + " " + units);
                    //slider_green.css('width', 100*(values[0] - minval)/(maxval - minval) +'%');
                    expr = expr.replace('a_' + param, a).replace('+b_' + param, sgn + b);
                }
                this.wmsParams.expr = expr;
                L.TileLayer.WMS.prototype.onAdd.call(this, map);
        },

	_getLegendControl: function() {
		if (typeof this._map._fcoo_legendcontrol == 'undefined' || !this._map._fcoo_legendcontrol) {
			this._map._fcoo_legendcontrol = new L.FImpactLayer.LegendControl({position: this.options.legendPosition});
			this._map.addControl(this._map._fcoo_legendcontrol);
		}
		return this._map._fcoo_legendcontrol;
	}
});

L.FImpactLayer.LegendControl = L.Control.extend({
	options: {
		position: "bottomleft"
	},

	initialize: function(options) {
		L.Util.setOptions(this, options);
		this._container = L.DomUtil.create('div', 'fcoo-legend-container');
		//this._container.style.display = 'none';
		this._legendCounter = 0;
		this._legendContainer = new Array();
                L.DomEvent.disableClickPropagation(this._container);
	},

	onAdd: function(map) {
                this._map = map;
		return this._container;
	},

	addLegend: function(layer, legendParameters, legendImagePath, legendAttribution) {
		var legendId = this._legendCounter++;
	        var legendInfo = {
                        layer: layer,
                        parameters: legendParameters,
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
		for (var idx in this._legendContainer) {
			var imgPath = this._legendContainer[idx]['imagePath'];
			var attribution = this._legendContainer[idx]['attribution'];
			var item = L.DomUtil.create('div', 'fcoo-legend-item leaflet-control', this._container);
			item.style.cssFloat = cssFloat;
			if (isLeft) {
			    item.style.marginRight = '10px';
			} else {
			    item.style.marginLeft = '10px';
			}
                        var colorbar = L.DomUtil.create('img', 'fcoo-legend-image', item)
                        colorbar.src = imgPath;
                        var title = L.DomUtil.create('p', 'fcoo-legend-item-title', item);
		        var name = this._legendContainer[idx].layer._name;
		        title.innerHTML = this._legendContainer[idx].layer._name;
                        var param_consts = {};
                        for (var param in this._legendContainer[idx]['parameters']) {
                            var values = this._legendContainer[idx]['parameters'][param].slider_options.values;
                            var minval = this._legendContainer[idx]['parameters'][param].slider_options.min;
                            var maxval = this._legendContainer[idx]['parameters'][param].slider_options.max;
                            // Find y = a*x + b params
                            var a = 80.0/(Math.abs(values[1]) - Math.abs(values[0]));
                            var b = 90.0 - a*values[1];
                            if (b < 0) {
                                var sgn = '-';
                                b = -b;
                            } else {
                                var sgn = '+';
                            }
                            param_consts[param] = [a, sgn + b];
                        }
                        if (attribution != null) {
			    var attrelem = L.DomUtil.create('p', '', item);
			    attrelem.innerHTML = attribution;
                        }
  
                        makeSlider = function(param, options, item, name, adjustables) {
                            var slider_outer = L.DomUtil.create('div', 'fcoo-legend-slider', item);
                            var slider_info = L.DomUtil.create('p', 'fcoo-legend-slider-info', slider_outer);
                            $(slider_info).append('<input type="text" id="' + name + '_' + param + '" readonly class="fcoo-legend-slider-info-input"/>');
                            var slider_div = $(L.DomUtil.create('div', 'fcoo-legend-slider-div ui-slider-handle leaflet-control', item));
    
                            // Add slider for selecting parameters
                            var myLayer = options['layer'];
                            var long_name = options['parameters'][param]['long_name'];
                            var units = options['parameters'][param]['units'];
                            var slider_green = $('<div class="slider-green"></div>')
                            var baseoptions = {
                                slide: function( event, ui ) {
                                    $("#" + name + '_' + param).val(long_name + ": " + Math.abs(ui.values[0]) + " - " + Math.abs(ui.values[1]) + " " + units);
                                    // Find y = a*x + b params
                                    var a = 80.0/(Math.abs(ui.values[1]) - Math.abs(ui.values[0]));
                                    var b = 90.0 - a*ui.values[1];
                                    if (b < 0) {
                                        var sgn = '-';
                                        b = -b;
                                    } else {
                                        var sgn = '+';
                                    }
                                    adjustables[param] = [a, sgn + b];
                                    var expr = myLayer.options.baseexpr;
                                    for (var lparam in adjustables) {
                                        expr = expr.replace('a_' + lparam, adjustables[lparam][0]).replace('+b_' + lparam, adjustables[lparam][1]);
                                    }
                                    myLayer.setParams({expr: expr}, false);
                                    slider_green.css('width', 100*(ui.values[0] - slider_div.slider("option", "min"))/(slider_div.slider("option", "max") - slider_div.slider("option", "min")) +'%');
                                }
                            }
                            var slideroptions = L.extend(baseoptions, options['parameters'][param]['slider_options']);
                            slider_div.slider(slideroptions).append(slider_green);
                            slider_green.css('width', 100*(slider_div.slider("values", 0) - slider_div.slider("option", "min"))/(slider_div.slider("option", "max") - slider_div.slider("option", "min")) +'%');
                        }
                        for (var param in this._legendContainer[idx]['parameters']) {
                            makeSlider(param, this._legendContainer[idx], item, name, param_consts);
                        }
		}
	}
});
