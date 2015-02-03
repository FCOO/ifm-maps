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
                console.log(this.options);
                for (var param in this.options.layers.split(':')) {
                    // Find y = a*x + b params
                    var a = 80.0/(Math.abs(slider_div.slider("values", 1)) - Math.abs(slider_div.slider("values", 0)));
                    var b = 90.0 - a*slider_div.slider("values", 1);
                    if (b < 0) {
                        var sgn = '-';
                        b = -b;
                    } else {
                        var sgn = '+';
                    }
                    adjustables[param] = [a, sgn + b];
                    $("#" + param).val( long_name + ": " + param_consts[param][0] + " - " + param_consts[param][1] + " " + units);
                    slider_green.css('width', 100*(slider_div.slider("values", 0) - slider_div.slider("option", "min"))/(slider_div.slider("option", "max") - slider_div.slider("option", "min")) +'%');
                    expr = expr.replace('a_' + param, param_consts[param][0]).replace('+b_' + param, param_consts[param][1]);
                }
                myLayer.options.expr = expr;
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
                        var param_consts = {};
                        if (attribution != null) {
			    var attrelem = L.DomUtil.create('p', '', item);
			    attrelem.innerHTML = attribution;
                        }
  
                        makeSlider = function(param, options, item, adjustables) {
                            var slider_outer = L.DomUtil.create('div', 'fcoo-legend-slider', item);
                            var slider_info = L.DomUtil.create('p', 'fcoo-legend-slider-info', slider_outer);
                            $(slider_info).append('<input type="text" id="' + param + '" readonly class="fcoo-legend-slider-info-input"/>');
                            var slider_div = $(L.DomUtil.create('div', 'fcoo-legend-slider-div ui-slider-handle leaflet-control', item));
    
                            // Add slider for selecting parameters
                            var myLayer = options['layer'];
                            var long_name = options['parameters'][param]['long_name'];
                            var units = options['parameters'][param]['units'];
                            var slider_green = $('<div class="slider-green"></div>')
                            var baseoptions = {
                                slide: function( event, ui ) {
                                    $("#" + param).val(long_name + ": " + Math.abs(ui.values[0]) + " - " + Math.abs(ui.values[1]) + " " + units);
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
                                    myLayer.setParams({expr: expr});
                                    slider_green.css('width', 100*(ui.values[0] - slider_div.slider("option", "min"))/(slider_div.slider("option", "max") - slider_div.slider("option", "min")) +'%');
                                }
                            }
                            var slideroptions = L.extend(baseoptions, options['parameters'][param]['slider_options']);
                            slider_div.slider(slideroptions).append(slider_green);
                            // Find y = a*x + b params
                            var a = 80.0/(Math.abs(slider_div.slider("values", 1)) - Math.abs(slider_div.slider("values", 0)));
                            var b = 90.0 - a*slider_div.slider("values", 1);
                            if (b < 0) {
                                var sgn = '-';
                                b = -b;
                            } else {
                                var sgn = '+';
                            }
                            adjustables[param] = [a, sgn + b];
                            $("#" + param).val( long_name + ": " + param_consts[param][0] + " - " + param_consts[param][1] + " " + units);
                            slider_green.css('width', 100*(slider_div.slider("values", 0) - slider_div.slider("option", "min"))/(slider_div.slider("option", "max") - slider_div.slider("option", "min")) +'%');
                        }
                        for (var param in this._legendContainer[idx]['parameters']) {
                            makeSlider(param, this._legendContainer[idx], item, param_consts);
                        }
		}
	}
});
