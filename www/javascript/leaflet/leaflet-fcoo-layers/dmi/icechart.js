/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 *
 * This file contains abstractions for accessing DMI ice charts.
 */

(function () {
	L.FLayer.Dmi.iceConcentration = function (options) {
                options = L.extend(options, {attribution: 'Ice concentration from <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a>'});
                return new L.FLayer.Dmi._iceConcentration('DMI/ICECHART/DMI_ICECHART.nc', options);
	};
	L.FLayer.Dmi._iceConcentration = function (dataset, options) {
                var loptions = {layers: 'ice_concentration', 
                                cmap: 'IceConcentration_10colors',
                                time: 'current'}
                options = L.extend(options, loptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://dmi.dk" alt="Danish Meteorological Institute">DMI</a> / ICE CHART';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=ice_concentration&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=IceConcentration_10colors';
		}
		return layer;
	};
}());
