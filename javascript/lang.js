(function (){
    "use strict";
    /*jslint browser: true*/
    /*global updateURLParameter*/
    /*exported getI18n, getLocalLanguage, changeLanguage*/

    /**
     * This file contains internationalization and localization related methods.
     */

    /**
     * Internationalization of some texts used by the map.
     * @param String key the key of the text item
     * @param String lang the language id
     * @return String the localized text item or the id if there's no translation found
     */
    function getI18n(key, lang) {
        var i18n = {
            en: {
                maps: 'Maps',
                layers: 'Layers',
                boundaries: 'Boundaries',
                places: 'Places',
                ais: 'AIS Traffic Density',
                datetime: 'Select date and time',
            },
            //gl: {
                //layers: 'Ilimasaarutinut uuttuutit',
                //currentspeed: 'Sarfap sukkassusia',
                //currentdirection: 'Sarfap sammivia',
                //visibility: 'Erseqqarissuseq'
            //},
            da: {
                maps: 'Kort',
                'Home': 'Hjem',
                'Navigate to home page': 'Naviger til hjemmesiden',
                'Background Maps': 'Baggrundskort',
                'Short forecasts': 'Korte prognoser',
                'Long forecasts': 'Lange prognoser',
                'Point forecasts': 'Punktprognoser',
                'Static layers': 'Statiske lag',
                'Tidal forecasts': 'Tidevandsprognoser',
                'Sea level': 'Vandstand',
                'Celestial information': 'Himmellegemer',
                'Solar Terminator': 'Dag og nat',
                'Firing areas': 'Skydeområder',
                layers: 'Lag',
                boundaries: 'Grænser',
                places: 'Steder',
                'Sea Ice Concentration': 'Havis (koncentration)',
                'Wind Speed': 'Vind (fart)',
                'Wind Direction': 'Vindretning',
                'Wave Period': 'Bølgeperiode',
                'Wave Height': 'Bølgehøjde',
                'Sea State': 'Sø',
                'Wave Direction': 'Bølgeretning',
                'Current Speed': 'Strøm (fart)',
                'Current Direction': 'Strømretning',
                'Sea Surface Elevation': 'Vandstand',
                'Sea Temperature': 'Havtemperatur',
                'Salinity': 'Salinitet',
                'Air Temperature (2m)': 'Lufttemperatur (2m)',
                'Precipitation': 'Nedbør',
                'Specific Humidity': 'Specifik Luftfugtighed',
                'Sea Level Pressure': 'Lufttryk (havniveau)',
                'Cloud Cover': 'Skydække',
                'Visibility': 'Sigtbarhed',
                'Wave Period (Danish Waters)': 'Bølgeperiode (Danske farvande)',
                'Wave Height (Danish Waters)': 'Bølgehøjde (Danske farvande)',
                'Sea State (Danish Waters)': 'Sø (Danske farvande)',
                'Wave Direction (Danish Waters)': 'Bølgeretning (Danske farvande)',
                'Current Speed (Danish Waters)': 'Strøm (fart) (Danske farvande)',
                'Current Direction (Danish Waters)': 'Strømretning (Danske farvande)',
                'Sea Surface Elevation (Danish Waters)': 'Vandstand (Danske farvande)',
                'Sea Temperature (Danish Waters)': 'Havtemperatur (Danske farvande)',
                'Salinity (Danish Waters)': 'Salinitet (Danske farvande)',
                datetime: 'Vælg tidspunkt',
                "Locate": "Find",
                "Show me where I am": "Vis mig hvor jeg er",
                "You are within {distance} {unit} from this point": "Du er indenfor {distance} {unit} fra dette punkt",
                "You seem located outside the boundaries of the map": "Du ser ud til at befinde dig udenfor kortets grænser",
                "FCOO - North Sea/Baltic Sea": "FCOO - Nordsø/Østersø",
                "FCOO - Danish Waters": "FCOO - Danske farvande"
            }
        };

        if (i18n[lang] !== undefined && i18n[lang][key] !== undefined) {
            return i18n[lang][key];
        }
        if (i18n.en !== undefined && i18n.en[key] !== undefined) {
            return i18n.en[key];
        }
        return key;
    }
    window.getI18n = getI18n;

    /**
     * Try to find a language we shoud use. Look for URL parameter or system settings.
     * Restricts to supported languages ('en', 'fr', 'ru', 'de').
     * @return String language code like 'en', 'fr', 'ru' or 'de'
     */
    function getLocalLanguage() {
        var lang = null,
            qs = window.location.search,
            params,
            keyvalue,
            i,
            tmp;

        // 1. try to read URL parameter 'lang'
        if (qs) {
            if (qs.substring(0, 1) === '?') {
                qs = qs.substring(1);
            }
            params = qs.split('&');
            for (i = 0; i < params.length; i = i + 1) {
                keyvalue = params[i].split('=');
                if (keyvalue[0] === 'lang') {
                    lang = keyvalue[1];
                    break;
                }
            }
        }

        // 2. try to get browser or system language
        if (!lang) {
            tmp = window.navigator.userLanguage || window.navigator.language;
            lang = tmp.split('-')[0];
        }

        // Use only supported languages, defaults to 'en'
        if (lang !== 'en' && lang !== 'da' && lang !== 'gl' && lang !== 'fo') {
            lang = 'en';
        }
        return lang;
    }
    window.getLocalLanguage = getLocalLanguage;

    /**
     * Add or replace the language parameter of the URL and reload the page.
     * @param String id of the language
     */
    function changeLanguage(pLang) {
        window.location.href = updateURLParameter(window.location.href, 'lang', pLang);
    }
    window.changeLanguage = changeLanguage;
})();

