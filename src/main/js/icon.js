import { Icon, setOptions } from "leaflet"

export class JMIcon extends Icon {
    constructor(opts) {
        super(opts)
    }

    initialize(options) {
        setOptions(this, options)

        this.className = options.className
    }

    createIcon(oldIcon) {
        const img = this._createIcon("icon", oldIcon)

        if (this.className !== undefined) {
            for (const name in this.className.split(" ")) {
                img.classList.add(name)
            }
        }

        return img
    }
}

// export const JMIcon = Icon.extend({
//     initialize: function(options) {
//         setOptions(this, options)
//
//         this.className = options.className
//     },
//
//     createIcon: function(oldIcon) {
//         const img = this._createIcon("icon", oldIcon)
//
//         if (this.className !== undefined) {
//             img.classList.add(this.className)
//         }
//
//         return img
//     },
// })
