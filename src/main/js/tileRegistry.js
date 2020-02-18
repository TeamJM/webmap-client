class TileRegistryClass {
    constructor () {
        this.registry = {}
        this.visible = new Set()

        setInterval(() => {
            TileRegistry.poll()
        }, 100)
    }

    visibilityCallback (visible, invisible) {
        visible.forEach((entry) => {
            this.visible.add(entry)
        })

        invisible.forEach((entry) => {
            this.visible.delete(entry)
        })
    }

    poll () {
        this.visible.forEach((key) => {
            if (!(key in this.registry)) {
                console.warn(`Previously removed tile with key ${key} is visible`)
                return
            }

            const [coords, tileLayer, tile] = this.registry[key]
            const url = tileLayer.getTileUrl(coords)

            if (!tile.src.endsWith(url)) {
                tile.src = url
            }
        })
    }

    setTile (tileLayer, tile, coords, zoom) {
        const coordKey = `${coords.x}/${coords.y}/${zoom}`

        tile.setAttribute("data-coord-key", coordKey)
        this.registry[coordKey] = [coords, tileLayer, tile]

        TileObserver.observe(tile)
    }
}

function visibilityCallback (entries) {
    const visible = []
    const invisible = []

    entries = [...entries] // Copy the list for safety

    entries.forEach((entry) => {
        const coordKey = entry.target.getAttribute("data-coord-key")

        if (typeof coordKey !== "string" && !(coordKey instanceof String)) {
            console.warn("Tile observer received element with no coord key", entry)
            return
        }

        if (entry.isIntersecting) {
            visible.push(coordKey)
        } else {
            invisible.push(coordKey)
        }
    })

    TileRegistry.visibilityCallback(visible, invisible)
}

export const TileRegistry = new TileRegistryClass()

export const TileObserver = new IntersectionObserver(
    visibilityCallback, { threshold: 0.01 },
)
