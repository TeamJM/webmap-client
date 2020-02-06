export function patch() {
    String.prototype.format = function (params) {
        let formatted = this;

        for (let [key, value] of Object.entries(params)) {
            formatted = formatted.replace(`{${key}}`, value)
        }

        return formatted;
    };
}

export function translateCoords(x, z, hellTranslate, offset) {
    if (hellTranslate === true) {
        x = Math.floor(x / 8);
        z = Math.floor(z / 8);
    }

    if (offset === undefined) {
        offset = 0;
    }

    return [(z * -1) + offset, x + offset]
}
