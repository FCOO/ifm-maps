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

	_onadd_overlay: function(e) {
		this._map.on('layeradd', this._update_overlay, this);
		this._map.on('layerremove', this._update_overlay, this);
		//this._map.on('overlayadd', this._update_overlay, this);
		//this._map.on('overlayremove', this._update_overlay, this);
		this._update_overlay();
	},

	_update_overlay: function() {
		if (!this.options.layers) return;
		var overlayflags = this.options.layers.overlayFlags();
		if (overlayflags && overlayflags != '') {
			this._update({overlays: overlayflags});
		}
	},

	_set_overlays: function(e) {
		var p = e.params;
		if (!this.options.layers || !p.overlays) return;
		this.options.layers.setOverlays(p.overlays);
	}
});

L.Control.CategorizedLayers.include({
	setOverlays: function(overlayflags) {
		var layer, obj, idx=0;
		for (var i in this._overlays) {
			if (!this._overlays.hasOwnProperty(i))
				continue;
                        var layerGroup = this._overlays[i];
		        for (var j in layerGroup) {
			        if (!layerGroup.hasOwnProperty(j))
				        continue;
			        obj = layerGroup[j];
			        if (obj._overlay) {
				        // visible if not specified or flag==T
				        var visible = (idx >= overlayflags.length || overlayflags[idx] == 'T');
				        idx++;
				        if (!visible && this._map.hasLayer(obj)) {
					        this._map.removeLayer(obj);
				        } else if (visible && !this._map.hasLayer(obj)) {
					        this._map.addLayer(obj);
				        }
			        }
		        }
		}
	        this._update();
	},

	overlayFlags: function() {
		var flags = '';
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
					        flags += 'T';
				        } else {
					        flags += 'F';
				        }
			        }
			}
		}
		return flags;
	}
});


