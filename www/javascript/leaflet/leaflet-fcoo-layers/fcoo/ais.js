/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for accessing FCOO AIS data.
 */

(function () {
	L.FLayer.Fcoo.ais = function (options) {
                options = L.extend(options, {attribution: 'AIS data from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer1 = new L.FLayer.Fcoo._ais('FCOO/AIS/allAISmsg1_3_distinct_mmsi_mediterranean.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Fcoo._ais = function (dataset, options) {
                var extraoptions = {layers: 'msg1_3'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=msg1_3&FORMAT=image%2Fpng&TRANSPARENT=false';
		}
		return layer;
	};
}());
