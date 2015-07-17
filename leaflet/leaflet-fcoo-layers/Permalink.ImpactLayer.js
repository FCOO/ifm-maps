(function (){
"use strict";
/*jslint browser: true*/
/*global $, L*/

L.Control.Permalink.include({
    initialize_legend: function() {
        /* Methods starting with initialize_ are automatically called
         * when the Permalink control is initialized
         */
        this.on('update', this._set_legend, this);
        this.on('add', this._onadd_legend, this);
    },

    _onadd_legend: function() {
        this._map.on('layeradd', this._update_legend, this);
        this._map.on('layerremove', this._update_legend, this);
        this._map.on('legendupdate', this._update_legend, this);
        this._update_legend();
    },

    _update_legend: function() {
        if (!this.options.layers) return;
        var legends = this.options.layers.legendNames();
        if (legends && legends !== '') {
            this._update({legends: legends});
        }
    },

    _set_legend: function(e) {
        //console.info("Set legend", e);
        var p = e.params;
        if (!this.options.layers || !p.overlays) return;
        if (!p.legends) return;
        this.options.layers.chooseLegends(p.overlays, p.legends);
    }
});

L.Control.CategorizedLayers.include({
    /*jshint unused: true*/
    chooseLegends: function(overlaynames_str, legends) {
    /*jshint unused: false*/
        var layer, obj, i, j,
            layerGroup,
            values,
            enabled;
        //var overlaynames = decodeURIComponent(overlaynames_str).split(',');
        var legendoverlays = decodeURIComponent(legends).split(';');
        var legendhash = {};
        for (i in legendoverlays) {
            var tmp = legendoverlays[i].split(',');
            for (j in tmp) {
                var tmp2 = tmp[j].split('(');
                //var tmp2 = tmp[j].split('.');
                var layerComponent = tmp2[0].split('.');
                values = tmp2[1].replace(')', '').split('_');
                enabled = values[2];
                values = values.slice(0, 2);
                layerGroup = layerComponent[0];
                layer = layerComponent[1];
                var param = layerComponent[2];

                // For some browsers, `attr` is undefined; for others,
                // `attr` is false.  Check for both.
                var attr = $(legendhash).attr(layerGroup);
                if (typeof attr === typeof undefined || attr === false) {
                    legendhash[layerGroup] = {};
                }
                attr = $(legendhash[layerGroup]).attr(layer);
                if (typeof attr === typeof undefined || attr === false) {
                    legendhash[layerGroup][layer] = {};
                }
                legendhash[layerGroup][layer][param] = {};
                legendhash[layerGroup][layer][param].values = values;
                legendhash[layerGroup][layer][param].enabled = enabled;
            }
        }
        //var idx=0;
        for (i in this._overlays) {
            if (!this._overlays.hasOwnProperty(i))
                    continue;
                layerGroup = this._overlays[i];
                for (j in layerGroup) {
                    if (!layerGroup.hasOwnProperty(j))
                        continue;
                    obj = layerGroup[j];
                    if (obj._overlay) {
                        // visible if specified
                        //var name = obj._category_en + '.' + obj._name_en;
                        //var visible = (overlaynames[idx] == name);
                        if (legendhash.hasOwnProperty(obj._category_en)) {
                            if (legendhash[obj._category_en].hasOwnProperty(obj._name_en)) {
                                var mysettings = legendhash[obj._category_en][obj._name_en];
                                for (var k in mysettings) {
                                    enabled = (mysettings[k].enabled === "true");
                                    values =  $.map(mysettings[k].values, parseFloat);
                                    var mylegends = obj._legendControl._legendContainer;
                                    for (var ii in mylegends) {
                                        if (mylegends[ii].options.layer === obj) {
                                            for (var iii in mylegends[ii]._parameterContainer) {
                                                var myparam = mylegends[ii]._parameterContainer[iii];
                                                if (myparam.options.shortname == k) {
                                                     myparam.options.enabled = enabled;
                                                     myparam.options.sliderOptions.values = values;
                                                }
                                            }
                                        }
                                    }
                                    obj._legendControl._redrawLegend();
                                }
                            }
                        }
                    }
                }
        }
        this._update();
    },

    legendNames: function() {
        var names = '';
        for (var i in this._overlays) {
            if (!this._overlays.hasOwnProperty(i))
                continue;
            var layerGroup = this._overlays[i];
            for (var j in layerGroup) {
                if (!layerGroup.hasOwnProperty(j))
                    continue;
                var obj = layerGroup[j];
                if (!obj._overlay) continue;
                if (obj._overlay) {
                    if (this._map.hasLayer(obj)) {
                        if (obj._legendControl) {
                            var legendControl = obj._legendControl;
                            if (legendControl._legendType == 'impact') {
                                var legendLayer = obj._legendControl.
                                    _legendContainer[obj._legendId];
                                var settings = legendLayer.getUrlSettings();
                                for (var k in settings) {
                                    settings[k] = obj._category_en + '.' + settings[k];
                                }
                                if (names.length > 0) {
                                    names += '%3B';
                                }
                                names += settings.join('%2C');
                            }
                        }
                    }
                }
            }
        }
        return names;
    }
});
})();
