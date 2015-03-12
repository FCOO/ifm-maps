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
                iceconcentration: 'Sea Ice Concentration',
                windspeed: 'Wind Speed',
                winddirection: 'Wind Direction',
                waveperiod: 'Wave Period',
                waveheight: 'Wave Height',
                wavedirection: 'Wave Direction',
                currentspeed: 'Current Speed',
                currentdirection: 'Current Direction',
                elev: 'Sea Surface Elevation',
                airtemp: 'Air Temperature (2m)',
                precip: 'Precipitation',
                seatemp: 'Sea Temperature',
                salinity: 'Salinity',
                humidity: 'Specific Humidity',
                pressure: 'Sea Level Pressure',
                cloudcover: 'Total Cloud Cover',
                visibility: 'Visibility',
                ais: 'AIS Traffic Density',
                datetime: 'Select date and time',
                EEZ: 'EEZ'
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
                'Point forecasts': 'Punktprognoser',
                'Tidal forecasts': 'Tidevandsprognoser',
                'Celestial information': 'Himmellegemer',
                'Solar Terminator': 'Dag og nat',
                layers: 'Lag',
                boundaries: 'Grænser',
                places: 'Steder',
                iceconcentration: 'Havis (koncentration)',
                windspeed: 'Vind (fart)',
                winddirection: 'Vindretning',
                waveperiod: 'Bølgeperiode',
                waveheight: 'Bølgehøjde',
                wavedirection: 'Bølgeretning',
                currentspeed: 'Strøm (fart)',
                currentdirection: 'Strømretning',
                elev: 'Vandstand',
                airtemp: 'Lufttemperatur (2m)',
                precip: 'Nedbør',
                seatemp: 'Havtemperatur',
                salinity: 'Salinitet',
                humidity: 'Specifik Luftfugtighed',
                pressure: 'Lufttryk (havniveau)',
                cloudcover: 'Skydække',
                visibility: 'Sigtbarhed',
                ais: 'AIS Trafiktæthed',
                datetime: 'Vælg tidspunkt',
                EEZ: 'EEZ',
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

