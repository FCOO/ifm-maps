(function (){
    "use strict";
    /*global L*/

    /**
     * This file is licensed under Creative Commons Zero (CC0)
     * http://creativecommons.org/publicdomain/zero/1.0/
     * Author: http://www.openstreetmap.org/user/Zartbitter
     */

    L.Control.Permalink.include({

        initialize_overlay: function() {
            this.on('update', this._set_overlays, this);
            this.on('add', this._onadd_overlay, this);
        },

        _onadd_overlay: function() {
            this._map.on('layeradd', this._update_overlay, this);
            this._map.on('layerremove', this._update_overlay, this);
            //this._map.on('overlayadd', this._update_overlay, this);
            //this._map.on('overlayremove', this._update_overlay, this);
            this._update_overlay();
        },

        _update_overlay: function() {
            if (!this.options.layers) return;
            var overlaynames = this.options.layers.overlayNames();
            if (overlaynames && overlaynames !== '') {
                this._update({overlays: overlaynames});
            }
        },

        _set_overlays: function(e) {
            var p = e.params;
            if (!this.options.layers || !p.overlays) return;
            this.options.layers.setOverlays(p.overlays);
        }
    });

    L.Control.CategorizedLayers.include({
        setOverlays: function(overlaynames_str) {
            var overlaynames = decodeURIComponent(overlaynames_str).split(',');
            var obj, idx=0;
            for (var i in this._overlays) {
                if (!this._overlays.hasOwnProperty(i))
                    continue;
                var layerGroup = this._overlays[i];
                for (var j in layerGroup) {
                    if (!layerGroup.hasOwnProperty(j))
                        continue;
                    obj = layerGroup[j];
                    if (obj._overlay) {
                        // visible if specified
                        var name = obj._category_en + '.' + obj._name_en;
                        var visible = (overlaynames[idx] == name);
                        if (visible) {
                            idx++;
                        }
                        if (!visible && this._map.hasLayer(obj)) {
                            idx++;
                            this._map.removeLayer(obj);
                        } else if (visible && !this._map.hasLayer(obj)) {
                            this._map.addLayer(obj);
                        } else {
                        }
                    }
                }
            }
            this._update();
        },

        overlayNames: function() {
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
                            var name = obj._category_en + '.' + obj._name_en;
                            if (names.length > 0) {
                                names += ',';
                            }
                            names += name;
                        }
                    }
                }
            }
            return encodeURIComponent(names);
        }
    });
})();
