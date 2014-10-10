/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for accessing DMI HIRLAM SKA.
 */

(function () {
	L.FLayer.Dmi.windSpeed = function (options) {
                options = L.extend(options, {attribution: 'Wind forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._windSpeed('DMI/HIRLAM/METPREP_DMI_HIRLAM_S03_NSBALTIC3NM_v003C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._windSpeed = function (dataset, options) {
                var windoptions = {layers: 'u10_v10', cmap: 'Wind_ms_YRP_16colors'}
                options = L.extend(options, windoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / SKA';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=u10_v10&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Wind_ms_YRP_16colors';
		}
		return layer;
	};

	L.FLayer.Dmi.windDirection = function (options) {
                options = L.extend(options, {attribution: 'Wind forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._windDirection('DMI/HIRLAM/METPREP_DMI_HIRLAM_S03_NSBALTIC3NM_v003C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._windDirection = function (dataset, options) {
                var windoptions = {layers: 'u10:v10', styles: 'black_arrowbarbs'}
                options = L.extend(options, windoptions);
		var layer = new L.FLayer(dataset, options);
		return layer;
	};

	L.FLayer.Dmi.seaLevelPressure = function (options) {
                options = L.extend(options, {attribution: 'Air pressure forecasts from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                var layer1 = new L.FLayer.Dmi._seaLevelPressure('DMI/HIRLAM/METPREP_DMI_HIRLAM_S03_NSBALTIC3NM_v003C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Dmi._seaLevelPressure = function (dataset, options) {
                var extraoptions = {layers: 'airpress', 
                                    cmap: 'SeaLevelPressure_hPa_BGYR_13colors',
                                    styles: 'contour'}
                options = L.extend(options, extraoptions);
		var layer = new L.FLayer(dataset, options);
		//if (layer.options.legendImagePath == null) {
                        //layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / HIRLAM / SKA';
			//layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=airpress&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=SeaLevelPressure_hPa_BGYR_13colors';
		//}
		return layer;
	};
}());
