(function (){
    "use strict";
    /*global L*/

    L.Control.Permalink.include({
        initialize_locate: function() {
            this.on('add', this._onadd_locate, this);
        },

        _onadd_locate: function() {
            this._map.on('startfollowing', this._start_following, this);
            this._map.on('stopfollowing', this._stop_following, this);
            this._map.on('startlocator', this._start_locator, this);
            this._map.on('stoplocator', this._stop_locator, this);
            this._update_locate();
        },

        _update_locate: function() {
            if (!this.options.locator) return;
            var options = this.options.locator.getState();
            if (options) {
                this._update(options);
            }
        },

        _start_locator: function() {
            this._update({locate: true});
        },

        _stop_locator: function() {
            this._update({locate: false});
        },

        _start_following: function() {
            this._update({follow: true});
        },

        _stop_following: function() {
            this._update({follow: false});
        }
    });

    //L.Control.Layers.include({
    L.Control.Locate.include({
        getState: function() {
            var options = {
                locate: this._active,
                follow: this._following
            }
            return options;
        }
    });
})();
