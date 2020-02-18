import { Icon, setOptions } from "leaflet"

export const JMIcon = Icon.extend({
    initialize: function (options) {
        setOptions(this, options)

        this.className = options.className
    },

    createIcon: function (oldIcon) {
        const img = this._createIcon("icon", oldIcon)

        if (this.className !== undefined) {
            img.classList.add(this.className)
        }

        return img
    },
})
