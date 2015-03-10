"use strict";
/*jslint browser: true*/
/*global $, L*/

/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * Web Map Service layers without hassle.
 */
L.FImpactLayer = L.TileLayer.WMS.Fcoo.extend({
    //baseUrl: "http://wms-dev01.fcoo.dk:8080/{dataset}.wms",
    baseUrl: location.protocol + "//{s}.fcoo.dk/webmap/impact/{dataset}.wms",

    onAdd: function(map) {
        L.TileLayer.WMS.prototype.onAdd.call(this, map);
        this._map = map;
        // Create or get LegendControl if it already exists
        this._legendControl = this._getLegendControl();
        // Add this layer legend to the LegendControl
        this._legendId = this._legendControl.addLegend(this, this.legendParams);
        // Add foreground layer if specified
        if (this.options.foreground !== null) {
            this.options.foreground.addTo(map);
        }
    },

    /*
     * Make an impact layer control instead of the default legend control.
     */
    _getLegendControl: function() {
        if (typeof this._map._fcoo_legendcontrol == 'undefined' || !this._map._fcoo_legendcontrol) {
            this._map._fcoo_legendcontrol = new L.FImpactLayer.LegendControl({
                position: this.legendParams.position,
                language: this.options.language
            });
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
        layer: null,
        baseexpr: 'a*x+b',
        enabled: true,
        sliderOptions: {},
    },

    initialize: function(map, options) {
        L.Util.setOptions(this, options);
        this._map = map;
    },

    _getExpression: function() {
        // Find y = a*x + b params
        var values = this.options.sliderOptions.values;
        var a = 80.0 / (Math.abs(values[1]) - Math.abs(values[0]));
        var b = 90.0 - a*Math.abs(values[1]);
        if (b < 0) {
            b = -b;
            b = '-' + b;
        } else {
            b = '+' + b;
        }
        var expr = this.options.baseexpr;
        if (this.options.enabled) {
            if (values[1] != values[0]) {
                expr = expr.replace('a', a).replace('+b', b)
                           .replace('x', this.options.shortname);
            } else {
                // Special handling of case where slider values equal
                expr = '50*sign(' + this.options.shortname + '-' +
                       values[0] +') + 50';
            }
        } else {
            expr = expr.replace('a*x+b', '0*' + this.options.shortname);
        }
        return expr;
    },

    _redrawLegendParameter: function(container, containerName) {
        // Initialize slider text
        var opr1,
            opr2;
        var sname = this.options.shortname;
        var lname = this.options.longname;
        var units = this.options.units;
        var slideroptions = this.options.sliderOptions;
        var values = slideroptions.values;
        if (values[0] > 0) {
            opr1 = '<';
            opr2 = '>';
        } else {
            opr1 = '>';
            opr2 = '<';
        }

        // Add slider for selecting parameters
        var slider_container = L.DomUtil.create('div', 'fcoo-legend-slider');
        var slider_info = L.DomUtil.create('p', 'fcoo-legend-slider-info', slider_container);
        var slider_check = $('<input type="checkbox" id="fcoo-legend-slider-enabled-' +
                             containerName + '_' + sname + 
                             '" name="fcoo-legend-slider-enabled-' +
                             containerName + '_' + sname + 
                             '" class="fcoo-legend-slider-enabled">');
        slider_check.attr('checked', this.options.enabled);
        $(slider_info).append(slider_check);
        slider_info.innerHTML += lname + ": ";
        var $slider_info_green = $('<span id="fcoo-legend-slider-info-green-' +
                              containerName + '_' + sname + 
                              '" class="fcoo-legend-slider-info-green"></span>');
        var $slider_info_red = $('<span id="fcoo-legend-slider-info-red-' +
                              containerName + '_' + sname +
                              '" class="fcoo-legend-slider-info-red"></span>');
        $(slider_info).append($slider_info_green);
        $(slider_info).append($slider_info_red);
        var slider_div = $(L.DomUtil.create('div', 
            'fcoo-legend-slider-div ui-slider-handle leaflet-control', slider_container));
        slider_div.attr("id", "fcoo-legend-slider-div-" + 
                        containerName + "_" + sname);
   
        var slider_green = $('<div class="slider-green"></div>');
        $slider_info_green.html(opr1 + ' ' + Math.abs(values[0]) + " " + units);
        $slider_info_red.html(opr2 + ' ' + Math.abs(values[1]) + " " + units);
        var myParam = this; // Used in closure below
        var myMap = this._map; // Used in closure below

        var baseoptions = {
            /*jshint unused: true*/
            slide: function(e, ui) {
            /*jshint unused: false*/
                myParam.options.sliderOptions.values = ui.values;
                if (ui.values[0] > 0) {
                    opr1 = '<';
                    opr2 = '>';
                } else {
                    opr1 = '>';
                    opr2 = '<';
                }
                $slider_info_green.html(opr1 + ' ' + Math.abs(ui.values[0]) + " " + units);
                $slider_info_red.html(opr2 + ' ' + Math.abs(ui.values[1]) + " " + units);
                // Update green part of slider
                slider_green.css('width', 100*(ui.values[0] - 
                    slider_div.slider("option", "min"))/
                   (slider_div.slider("option", "max") - 
                    slider_div.slider("option", "min")) +'%');
                myMap.fire('legendupdate');
            }
        };
        var my_slideroptions = $.extend(baseoptions, slideroptions);
        slider_div.slider(my_slideroptions).append(slider_green);
        slider_green.css('width', 100*(slider_div.slider("values", 0) - 
                                       slider_div.slider("option", "min")) /
                                      (slider_div.slider("option", "max") - 
                                       slider_div.slider("option", "min")) +
                                       '%');

        $(container).append(slider_container);

        // Make it possible to enable/disable parameter
        $('#fcoo-legend-slider-enabled-' + containerName + '_' + sname).on("click", function () {
            myParam.options.enabled = !myParam.options.enabled;
            myMap.fire('legendupdate');
        });
    }

});

L.LegendLayer = L.Control.extend({
    options: {
        name: null,
        attribution: null,
        layer: null,
    },

    initialize: function(map, container, options) {
        L.Util.setOptions(this, options);
        this._map = map;
        this._container = container;
        this._parameterCounter = 0;
        this._parameterContainer = [];
        this._map.on('legendupdate', this._updateExpression, this);
    },

    getUrlSettings: function() {
        /* Converts settings to URL params. */
        var values = [];
        var name = this.options.layer._name_en;
        for (var jdx in this._parameterContainer) {
            var param = this._parameterContainer[jdx];
            var isEnabled = param.options.enabled;
            var shortname = param.options.shortname;
            values[values.length] = name + '.' + shortname + '(' +
                param.options.sliderOptions.values[0] + '_' + 
                param.options.sliderOptions.values[1] + '_' +
                isEnabled + ')';
        }
        return values;
    },

    addParameter: function(param_options) {
        var parameterId = this._parameterCounter++;
        this._parameterContainer[parameterId] =
            new L.LegendParameter(this._map, param_options);
    },

    _updateExpression: function() {
        var expr = '';
        for (var idx in this._parameterContainer) {
            var paramExpr = this._parameterContainer[idx]._getExpression();
            if (expr === '') {
                expr = paramExpr;
            } else {
                expr = 'fmax(' + expr + ',' + paramExpr + ')';
            }
        }
        expr = 'fmin(100,fmax(0,' + expr + '))';
        this.options.layer.setParams({expr: expr}, false);
    },

    removeParameter: function(parameterId) {
        if (typeof this._parameterContainer[parameterId] != 'undefined') {
            delete this._parameterContainer[parameterId];
        }
        // reset counter if no parameter is in collection
        if (this._legendContainer.length === 0) {
            this._legendCounter = 0;
            this._container.style.display = 'none';
        }
    },

    _redrawLegendLayer: function() {
        var isLeft = this.options.position.indexOf('left') !== -1;
        var cssFloat = isLeft ? 'left' : 'right';
        var attribution = this.options.attribution;
        var item = L.DomUtil.create('div', 'fcoo-legend-item leaflet-control');
        item.style.cssFloat = cssFloat;
        if (isLeft) {
            item.style.marginRight = '10px';
        } else {
            item.style.marginLeft = '10px';
        }
        var title = L.DomUtil.create('p', 'fcoo-legend-item-title', item);
        var name = this.options.layer._name;
        title.innerHTML = name;

        if (attribution !== null) {
            var attrelem = L.DomUtil.create('p', '', item);
            attrelem.innerHTML = attribution;
        }
  
        $(this._container).append(item);

        for (var jdx in this._parameterContainer) {
            var legendParam = this._parameterContainer[jdx];
            legendParam._redrawLegendParameter(item, name);
        }

        // Update the layer itself
        this._updateExpression();
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
        this._legendContainer = [];
        this._legendType = 'impact';
        L.DomEvent.disableClickPropagation(this._container);
    },

    onAdd: function(map) {
        this._map = map;
        return this._container;
    },

    //addLegend: function(layer, legendParameters, legendImagePath, legendAttribution) {
    addLegend: function(layer, options) {
        var param;
        var legendId = this._legendCounter++;
        var legendLayer = new L.LegendLayer(this._map, this._container, {
            layer: layer,
            attribution: options.attribution
        });
        for (param in options.parameters) {
            var paramOptions = $.extend({
                shortname: param,
                layer: layer
            },
            options.parameters[param]);
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
        if (this._legendContainer.length === 0) {
            this._legendCounter = 0;
            this._container.style.display = 'none';
        }
        this._map.off('legendupdate', this._redrawLegend, this);
        this._redrawLegend();

    },

    getUrlSettings: function() {
        /* Converts settings to URL params. */
        var params = [];
        for (var idx in this._legendContainer) {
            var llayer = this._legendContainer[idx];
            var name = llayer.options.layer._name_en;
            for (var jdx in llayer._parameterContainer) {
                var param = llayer._parameterContainer[jdx];
                var isEnabled = param.options.enabled;
                if (isEnabled) {
                    var shortname = param.options.shortname;
                    params[params.length] = name + '.' + shortname;
                }
            }
        }
        return params;
    },

    _redrawLegend: function() {
        this._container.innerHTML = ''; // clear container
        for (var idx in this._legendContainer) {
            var legendLayer = this._legendContainer[idx];
            legendLayer._redrawLegendLayer(this._container, this.options.position);
        }
    }
});
