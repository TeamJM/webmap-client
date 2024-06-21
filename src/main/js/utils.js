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
        x = x << 3
        z = z << 3
    }

    return [(z * - 1) + offset, x + offset]
}

export function reverseTranslateCoords(z, x, hellTranslate, offset = 0) {
    if (hellTranslate) {
        x = x << 3
        z = z << 3
    }

    return [x - offset, (z * - 1) - offset]
}
