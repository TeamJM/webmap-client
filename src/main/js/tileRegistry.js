class tileRegistry
{
    constructor()
    {
        this.registry = {};
        this.visible = new Set();

        setInterval(() =>
        {
            TileRegistry.poll()
        }, 1000);
    }

    visibilityCallback(visible, invisible)
    {
        visible.forEach((entry) =>
        {
            this.visible.add(entry)
        });

        invisible.forEach((entry) =>
        {
            this.visible.delete(entry)
        });
    }

    poll()
    {
        this.visible.forEach((key) =>
        {
            if (!key in this.registry)
            {
                console.warn(`Previously removed tile with key ${key} is visible`);
                return;
            }

            let [coords, tileLayer, tile] = this.registry[key];
            let url = tileLayer.getTileUrl(coords);

            if (!tile.src.endsWith(url))
            {
                tile.src = url;
            }
        })
    }

    setTile(tileLayer, tile, coords)
    {
        const coordKey = `${coords.x}/${coords.y}`;

        tile.setAttribute("data-coord-key", coordKey);
        this.registry[coordKey] = [coords, tileLayer, tile];

        TileObserver.observe(tile);
    }

    removeTile(coords)
    {
        delete this.registry[`${coords.x}/${coords.y}`];
    }
}

function visibilityCallback(entries, observer)
{
    const visible = [];
    const invisible = [];

    entries.forEach((entry) =>
    {
        const coordKey = entry.target.getAttribute("data-coord-key");

        if (!coordKey instanceof String)
        {
            console.warn("Tile observer received element with no coord key", entry);
            return;
        }

        if (entry.isIntersecting)
        {
            visible.push(coordKey);
        }
        else
        {
            invisible.push(coordKey);
        }
    });

    TileRegistry.visibilityCallback(visible, invisible);
}

export const TileRegistry = new tileRegistry();

export const TileObserver = new IntersectionObserver(
    visibilityCallback, {threshold: 0.1}
);
