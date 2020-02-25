import datastore from "./datastore"

class TileRegistryClass {
    constructor() {
        this.visible = new Set()
        this.unobserved = new Set() // A crutch for Chrome support

        setInterval(this.poll, 100)
    }

    visibilityCallback(visible, invisible) {
        visible.forEach((entry) => {
            this.visible.add(entry)
        })

        invisible.forEach((entry) => {
            this.visible.delete(entry)
        })
    }

    poll() {
        const unobserved = [...TileRegistry.unobserved] // Copy it to be safe

        unobserved.forEach((key) => { // We only have to do this because Chromium is stupid
            const tile = datastore.state.tiles[key][2]

            if (isVisible(tile)) {
                visibilityCallback([{
                    isIntersecting: true,
                    target: tile,
                }])
            } else {
                visibilityCallback([{
                    isIntersecting: false,
                    target: tile,
                }])
            }

            TileRegistry.unobserved.delete(key)
        })

        TileRegistry.visible.forEach((key) => {
            if (! (key in datastore.state.tiles)) {
                console.warn(`Previously removed tile with key ${key} is visible`)
                return
            }

            const [coords, tileLayer, tile] = datastore.state.tiles[key]
            const url = tileLayer.getTileUrl(coords)

            if (! tile.src.endsWith(url)) {
                tile.src = url
            }
        })
    }

    setTile(tileLayer, tile, coords, zoom) {
        const coordKey = `${coords.x}/${coords.y}/${zoom}`

        tile.setAttribute("data-coord-key", coordKey)
        datastore.state.tiles[coordKey] = [coords, tileLayer, tile]

        this.unobserved.add(coordKey)

        TileObserver.observe(tile)
    }
}

function isVisible(element) {
    const elementRect = element.getBoundingClientRect()
    const documentElement = document.documentElement

    return (
        elementRect.top <= (window.innerHeight || documentElement.clientHeight) &&
        elementRect.left <= (window.innerWidth || document.clientWidth) &&
        elementRect.bottom >= 0 &&
        elementRect.right >= 0
    )
}

function visibilityCallback(entries) {
    const visible = []
    const invisible = []

    entries = [...entries] // Copy the list for safety

    entries.forEach((entry) => {
        const coordKey = entry.target.getAttribute("data-coord-key")

        if (typeof coordKey !== "string" && ! (coordKey instanceof String)) {
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

export const TileObserver = new IntersectionObserver(
    visibilityCallback, {
        root: null,
        rootMargin: "0px",
        threshold: 0.01,
    },
)

export const TileRegistry = new TileRegistryClass()
