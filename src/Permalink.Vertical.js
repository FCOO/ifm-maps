;(function (L, window, document, undefined){
    "use strict";

    L.Control.Permalink.include({
        initialize_vertical: function() {
            this.on('add', this._onadd_vertical, this);
        },

        _onadd_vertical: function() {
            this._map.on('levelchange', this._update_vertical, this);
            this._update_vertical();
        },

        _update_vertical: function(/*data*/) {
            if (!this.options.levelControl) return;
            var options = this.options.levelControl.getState();
            if (options) {
                this._update(options);
            }
        },
    });

    L.Control.Vertical.include({
        getState: function() {
            var options = {
                level: String(this._selectList.selectedIndex)
            };
            return options;
        }
    });
})(L, this, document);
