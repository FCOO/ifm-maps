/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 */

(function () {
	L.FLayer.Fcoo.waveHeight = function (options) {
                options = L.extend(options, {attribution: 'Wave forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var options1 = L.extend({minZoom: 1, maxZoom: 8}, options);
                var layer1 = new L.FLayer.Fcoo._waveHeight('FCOO/WW3/ww3fcast_sigwave_grd_NSBaltic_v001C.nc', options1);
                var options2 = L.extend({minZoom: 9, maxZoom: 18, showLegend: false}, options);
                var layer2 = new L.FLayer.Fcoo._waveHeight('FCOO/WW3/ww3fcast_sigwave_grd_DKinner_v001C.nc', options2);
                return new L.FLayerGroup([layer1, layer2]);
	};
	L.FLayer.Fcoo._waveHeight = function (dataset, options) {
                var waveoptions = {layers: 'u_v', cmap: 'Hs_m_GBP_20colors'}
                waveoptions = L.extend(waveoptions, options);
		var layer = new L.FLayer(dataset, waveoptions);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / WW3';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=u_v&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Hs_m_GBP_20colors';
		}
		return layer;
	};

	L.FLayer.Fcoo.waveDirection = function (options) {
                options = L.extend(options, {attribution: 'Wave forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var options1 = L.extend({minZoom: 1, maxZoom: 8}, options);
                var layer1 = new L.FLayer.Fcoo._waveDirection('FCOO/WW3/ww3fcast_sigwave_grd_NSBaltic_v001C.nc', options1);
                var options2 = L.extend({minZoom: 9, maxZoom: 18, showLegend: false}, options);
                var layer2 = new L.FLayer.Fcoo._waveDirection('FCOO/WW3/ww3fcast_sigwave_grd_DKinner_v001C.nc', options2);
                return new L.FLayerGroup([layer1, layer2]);
	};
	L.FLayer.Fcoo._waveDirection = function (dataset, options) {
                var waveoptions = {layers: 'u:v', styles: 'black_vector,0.5'}
                waveoptions = L.extend(waveoptions, options);
		var layer = new L.FLayer(dataset, waveoptions);
		return layer;
	};
}());
