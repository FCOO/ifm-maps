//#include "Permalink.js

L.Control.Permalink.include({
	/*
	options: {
		useMarker: true,
		markerOptions: {}
	},
	*/

	initialize_layer: function() {
		//console.info("Initialize layer");
		this.on('update', this._set_layer, this);
		this.on('add', this._onadd_layer, this);
	},

	_onadd_layer: function(e) {
		//console.info("onAdd::layer", e);
		this._map.on('layeradd', this._update_layer, this);
		this._map.on('layerremove', this._update_layer, this);
		this._update_layer();
	},

	_update_layer: function() {
		if (!this.options.layers) return;
		//console.info(this.options.layers);
		var layer = this.options.layers.currentBaseLayer();
		if (layer)
			this._update({layer: layer._name});
	},

	_set_layer: function(e) {
		//console.info("Set layer", e);
		var p = e.params;
		if (!this.options.layers || !p.layer) return;
		this.options.layers.chooseBaseLayer(p.layer);
	}
});

//L.Control.Layers.include({
L.Control.CategorizedLayers.include({
	chooseBaseLayer: function(name) {
                //console.log('Choosing baselayer');
		var layer, obj;
                var baseLayers = this._layers[Object.keys(this._layers)[0]];
		for (var i in baseLayers) {
			if (!baseLayers.hasOwnProperty(i))
				continue;
			obj = baseLayers[i];
			if (!obj._overlay && obj._name == name)
				layer = obj;
		}
		if (!layer || this._map.hasLayer(layer))
			return;

		for (var i in baseLayers) {
			if (!baseLayers.hasOwnProperty(i))
				continue;
			obj = baseLayers[i];
			if (!obj._overlay && this._map.hasLayer(obj))
				this._map.removeLayer(obj)
		}
		this._map.addLayer(layer)
		this._update();
	},

	currentBaseLayer: function() {
                var baseLayers = this._layers[Object.keys(this._layers)[0]];
		for (var i in baseLayers) {
			if (!baseLayers.hasOwnProperty(i))
				continue;
			var obj = baseLayers[i];
			if (obj._overlay) continue;
			if (!obj._overlay && this._map.hasLayer(obj))
				return obj;
		}
	}
});

