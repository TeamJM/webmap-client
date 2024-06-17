export function patch() {
    String.prototype.format = function(params) {
        let formatted = this

        for (const [key, value] of Object.entries(params)) {
            formatted = formatted.replace(`{${key}}`, value)
        }

        return formatted
    }
}

export function translateCoords(x, z, hellTranslate, offset = 0) {
    if (hellTranslate) {
        x = Math.floor(x / 8)
        z = Math.floor(z / 8)
    }

    return [(z * - 1) + offset, x + offset]
}

export function reverseTranslateCoords(z, x, hellTranslate, offset = 0) {
    if (hellTranslate) {
        x = Math.floor(x * 8)
        z = Math.floor(z * 8)
    }

    return [x - offset, (z * - 1) - offset]
}

export function toRgbHex(color) {
    let red = (this.color >> 16) & 0xFF;
    let green = (this.color >> 8) & 0xFF;
    let blue = (this.color) & 0xFF;
    return `#${red}${green}${blue}`
}
