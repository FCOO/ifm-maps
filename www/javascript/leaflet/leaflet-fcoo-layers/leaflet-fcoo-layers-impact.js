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
                var expr = this.options.baseexpr;
                for (var param in this.options.legendParameters) {
                    console.log(this._legendControl);
                    this._legendControl._settings[param] = {};
                    // TODO: do not do expr calc here
                    var values = this.options.legendParameters[param].slider_options.values;
                    var minval = this.options.legendParameters[param].slider_options.min;
                    var maxval = this.options.legendParameters[param].slider_options.max;
                    var longname = this.options.legendParameters[param].longname;
                    var units = this.options.legendParameters[param].units;
                    this._legendControl._settings[param]['values'] = values;
                    // Find y = a*x + b params
                    var a = 80.0/(Math.abs(values[1]) - Math.abs(values[0]));
                    var b = 90.0 - a*Math.abs(values[1]);
                    if (b < 0) {
                        var sgn = '-';
                        b = -b;
                    } else {
                        var sgn = '+';
                    }
                    expr = expr.replace('a_' + param, a).replace('+b_' + param, sgn + b);
                }
                this.wmsParams.expr = expr;
                if (this.options.foreground != null) {
                    this.options.foreground.addTo(map);
                }
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

L.LegendParameter = L.Control.extend({
    options: {
        shortname: null,
        longname:  null,
        units: null,
        sliderOptions: {},
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
    },

    _redrawLegendParameter: function() {
    }

});

L.LegendLayer = L.Control.extend({
    options: {
        name: null,
        image: null,
        attribution: null,
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
        this._parameterCounter = 0;
        this._parameterContainer = new Array();
    },

    addParameter: function(param_options) {
        var parameterId = this._parameterCounter++;
        this._parameterContainer[parameterId] =
            new L.LegendParameter(param_options);
    },

    removeParameter: function(parameterId) {
        if (typeof this._parameterContainer[parameterId] != 'undefined') {
            delete this._parameterContainer[parameterId];
        }
        // reset counter if no parameter is in collection
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

    _redrawLegendLayer: function(container, cssFloat, isLeft) {
			var attribution = this.options.attribution;
			var item = L.DomUtil.create('div', 'fcoo-legend-item leaflet-control', this._container);
			item.style.cssFloat = cssFloat;
			if (isLeft) {
			    item.style.marginRight = '10px';
			} else {
			    item.style.marginLeft = '10px';
			}
                        var title = L.DomUtil.create('p', 'fcoo-legend-item-title', item);
		        var name = this.options.layer._name;
		        title.innerHTML = name;

                        if (attribution != null) {
			    var attrelem = L.DomUtil.create('p', '', item);
			    attrelem.innerHTML = attribution;
                        }
                        var mymap = this._map;
  
                        for (var jdx in this._parameterContainer) {
                            var legendParam = this._parameterContainer[jdx];
                            legendParam._


                            makeSlider(param, this._legendContainer[idx], item, name, param_consts);
                            // Initialize slider text
                            var values = this._legendContainer[idx]['parameters'][param].slider_options.values;
                            var units = this._legendContainer[idx]['parameters'][param].units;
                            if (values[0] > 0) {
                                var opr1 = '<'
                                var opr2 = '>'
                            } else {
                                var opr1 = '>'
                                var opr2 = '<'
                            }
                            $("#fcoo-legend-slider-info-green-" + name + '_' + param).html(opr1 + ' ' + Math.abs(values[0]) + " " + units);
                            $("#fcoo-legend-slider-info-red-" + name + '_' + param).html(opr2 + ' ' + Math.abs(values[1]) + " " + units);
                            //slider_green.css('width', 100*(values[0] - minval)/(maxval - minval) +'%');

                        }
                        /*
                        var param_consts = {};
                        for (var param in this._legendContainer[idx]['parameters']) {
                            var values = this._legendContainer[idx]['parameters'][param].slider_options.values;
                            //var values = this._settings[param]['values'];
                            // Find y = a*x + b params
                            var a = 80.0/(Math.abs(values[1]) - Math.abs(values[0]));
                            var b = 90.0 - a*Math.abs(values[1]);
                            if (b < 0) {
                                var sgn = '-';
                                b = -b;
                            } else {
                                var sgn = '+';
                            }
                            var param_enabled = true; // TODO: Let qs parameters override this
                            param_consts[param] = [a, sgn + b, true];
                        }
                        */

                        makeSlider = function(param, options, item, name, adjustables) {
                            // Add slider for selecting parameters
                            var myLayer = options['layer'];
                            var longname = options['parameters'][param]['longname'];
                            var units = options['parameters'][param]['units'];

                            var slider_outer = L.DomUtil.create('div', 'fcoo-legend-slider', item);
                            var slider_info = L.DomUtil.create('p', 'fcoo-legend-slider-info', slider_outer);
		            slider_info.innerHTML = longname + ": ";
                            var slider_check = $('<input type="checkbox" id="fcoo-legend-slider-enabled-' + name + '_' + param + '" name="fcoo-legend-slider-enabled-' + name + '_' + param + '" checked="true">');
                            $(slider_info).prepend(slider_check);
                            $(slider_info).append('<span id="fcoo-legend-slider-info-green-' + name + '_' + param + '" class="fcoo-legend-slider-info-green"></span>');
                            //$(slider_info).append('<span id="fcoo-legend-slider-info-yellow-' + name + '_' + param + '" class="fcoo-legend-slider-info-yellow"></span>');
                            $(slider_info).append('<span id="fcoo-legend-slider-info-red-' + name + '_' + param + '" class="fcoo-legend-slider-info-red"></span>');
                            var slider_div = $(L.DomUtil.create('div', 'fcoo-legend-slider-div ui-slider-handle leaflet-control', item));
                            slider_div.attr("id", "fcoo-legend-slider-div-" + name + "_" + param);
    
                            var slider_green = $('<div class="slider-green"></div>')
                            var baseoptions = {
                                slide: function( event, ui ) {
                                    if (ui.values[0] > 0) {
                                        var opr1 = '<'
                                        var opr2 = '>'
                                    } else {
                                        var opr1 = '>'
                                        var opr2 = '<'
                                    }
                                    $("#fcoo-legend-slider-info-green-" + name + '_' + param).html(opr1 + ' ' + Math.abs(ui.values[0]) + " " + units);
                                    $("#fcoo-legend-slider-info-red-" + name + '_' + param).html(opr2 + ' ' + Math.abs(ui.values[1]) + " " + units);
                                    //$("#fcoo-legend-slider-info-green-" + name + '_' + param).html( " + Math.abs(ui.values[0]) + " - " + Math.abs(ui.values[1]) + " " + units);
                                    var elem_enabled = $('#fcoo-legend-slider-enabled-' + name + '_' + param).is(':checked');
                                    // Find y = a*x + b params (unless yellow color not used)
                                    var a = 80.0/(Math.abs(ui.values[1]) - Math.abs(ui.values[0]));
                                    var b = 90.0 - a*Math.abs(ui.values[1]);
                                    if (b < 0) {
                                        var sgn = '-';
                                        b = -b;
                                    } else {
                                        var sgn = '+';
                                    }
                                    adjustables[param] = [a, sgn + b, elem_enabled];
                                    var expr = myLayer.options.baseexpr;
                                    for (var lparam in adjustables) {
                                        if (adjustables[lparam][2]) {
                                            if (lparam != param || ui.values[1] != ui.values[0]) {
                                                expr = expr.replace('a_' + lparam, adjustables[lparam][0]).replace('+b_' + lparam, adjustables[lparam][1]);
                                            } else {
                                                // Special handling of case where slider values equal
                                                expr = expr.replace('a_' + lparam + '*' + lparam + '+b_' + lparam, '50*sign(' + lparam + '-' + ui.values[0] +') + 50');
                                            }
                                        } else {
                                            expr = expr.replace('a_' + lparam + '*' + lparam + '+b_' + lparam, '0*' + lparam);
                                        }
                                    }
                                    myLayer.setParams({expr: expr}, false);
                                    slider_green.css('width', 100*(ui.values[0] - slider_div.slider("option", "min"))/(slider_div.slider("option", "max") - slider_div.slider("option", "min")) +'%');
                                    mymap.fire('legendupdate');
                                }
                            }
                            var slideroptions = L.extend(baseoptions, options['parameters'][param]['slider_options']);
                            slider_div.slider(slideroptions).append(slider_green);
                            slider_green.css('width', 100*(slider_div.slider("values", 0) - slider_div.slider("option", "min"))/(slider_div.slider("option", "max") - slider_div.slider("option", "min")) +'%');
                            slider_check.click(function (e) {
                                var id_frags = e.currentTarget.id.split('-');
                                var id_name_param = id_frags[id_frags.length-1];
                                var my_slider_div = $("#fcoo-legend-slider-div-" + id_name_param);
                                var my_ui = Object()
                                my_ui.values = [my_slider_div.slider("values", 0), my_slider_div.slider("values", 1)];
                                my_slider_div.slider('option', 'slide').call(null, my_slider_div, my_ui);
                                mymap.fire('legendupdate');
                            });
                        }
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
                this._legendType = 'impact';
                this._settings = {};
                L.DomEvent.disableClickPropagation(this._container);
	},

	onAdd: function(map) {
                this._map = map;
		return this._container;
	},

	addLegend: function(layer, legendParameters, legendImagePath, legendAttribution) {
		var legendId = this._legendCounter++;
                var legendLayer = new L.LegendLayer({
                    layer: layer,
		    image: legendImagePath,
                    attribution: legendAttribution
                });
                for (param in legendParameters) {
                    var paramOptions = $.extend({shortname: param},
                                        legendParameters[param])
                    legendLayer.addParameter(paramOptions);
                }
		this._legendContainer[legendId] = legendLayer;
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

        getUrlSettings: function() {
            /* Converts settings to URL params. */
            // TODO: Not yet implemented
            var settings = this._settings;
            return $.param(settings);
        },

    _redrawLegend: function() {
        this._container.innerHTML = ''; // clear container
        var isLeft = this.options.position.indexOf('left') !== -1;
        var cssFloat = isLeft ? 'left' : 'right';
        for (var idx in this._legendContainer) {
            var legendLayer = this._legendContainer[idx];
            legendLayer._redrawLegendLayer(this._container, cssFloat, isLeft);
        }
        this._map.fire('legendupdate');
    }
});
