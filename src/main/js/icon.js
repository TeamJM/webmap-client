import {setOptions} from "leaflet";

export const JMIcon = L.Icon.extend({
    initialize: function (options) {
        setOptions(this, options);

        this.className = options.className
    },

    createIcon: function (oldIcon) {
        let img = this._createIcon('icon', oldIcon);

        if (this.className !== undefined) {
            img.classList.add(this.className);
        }

        return img;
    },
});
