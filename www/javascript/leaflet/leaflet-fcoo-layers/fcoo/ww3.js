/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 */

(function () {
	L.FLayer.waveHeight = function (options) {
                options = L.extend(options, {attribution: 'Wave forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer1 = new L.FLayer._waveHeight('FCOO/WW3/ww3fcast_sigwave_grd_NSBaltic_v001C.nc', options);
                //var options2 = $.extend({legendImagePath: ''}, options);
                //var layer2 = new L.FLayer._waveHeight('ww3fcast_sigwave_grd.DKinner', options2);
                //return new L.FLayerGroup([layer1, layer2]);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer._waveHeight = function (dataset, options) {
                var waveoptions = {layers: 'u_v', cmap: 'Hs_m_GBP_20colors'}
                options = L.extend(options, waveoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / WW3 / NSBaltic';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=u_v&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Hs_m_GBP_20colors';
		}
		return layer;
	};

	L.FLayer.waveDirection = function (options) {
                options = L.extend(options, {attribution: 'Wave forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer1 = new L.FLayer._waveDirection('FCOO/WW3/ww3fcast_sigwave_grd_NSBaltic_v001C.nc', options);
                //options = L.extend(options, {legendImagePath: ''});
                //var layer2 = new L.FLayer._waveDirection('ww3fcast_sigwave_grd.DKinner', options);
                //return new L.FLayerGroup([layer1, layer2]);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer._waveDirection = function (dataset, options) {
                var waveoptions = {layers: 'u:v'}
                options = L.extend(options, waveoptions);
		var layer = new L.FLayer(dataset, options);
		return layer;
	};
}());
