/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for accessing ECMWF DXD global forecast fields.
 */

(function () {
	L.FLayer.Ecmwf.waveHeight = function (options) {
                options = L.extend(options, {attribution: 'Wave forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'});
                return new L.FLayer.Ecmwf._waveHeight('ECMWF/DXP/ECMWF_DXP_GREENLAND.nc', options);
	};
	L.FLayer.Ecmwf._waveHeight = function (dataset, options) {
                var waveoptions = {layers: 'u_v', cmap: 'Hs_m_GBP_20colors'}
                waveoptions = L.extend(waveoptions, options);
		var layer = new L.FLayer(dataset, waveoptions);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a> / WAM';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=u_v&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Hs_m_GBP_20colors';
		}
		return layer;
	};

	L.FLayer.Ecmwf.waveDirection = function (options) {
                options = L.extend(options, {attribution: 'Wave forecasts from <a href="http://www.ecmwf.int" alt="European Centre for Medium-Range Weather Forecasts">ECMWF</a>'});
                return new L.FLayer.Ecmwf._waveDirection('ECMWF/DXP/ECMWF_DXP_GREENLAND.nc', options);
	};
	L.FLayer.Ecmwf._waveDirection = function (dataset, options) {
                var waveoptions = {layers: 'u:v', styles: 'black_vector,0.5'}
                waveoptions = L.extend(waveoptions, options);
		var layer = new L.FLayer(dataset, waveoptions);
		return layer;
	};

}());

