import elementVisible from "element-visible"

class tileRegistry
{
    constructor()
    {
        this.registry = {};

        setInterval(() =>
        {
            TileRegistry.poll()
        }, 1000);
    }

    poll()
    {
        for (const key in this.registry)
        {
            let [coords, tileLayer, tile] = this.registry[key];

            if (!elementVisible(tile, 0.5))
            {
                continue;
            }

            let url = tileLayer.getTileUrl(coords);

            if (!tile.src.endsWith(url))
            {
                tile.src = url;
            }
        }
    }

    setTile(tileLayer, tile, coords)
    {
        this.registry[`${coords.x}/${coords.y}`] = [coords, tileLayer, tile];
    }

    removeTile(coords)
    {
        delete this.registry[`${coords.x}/${coords.y}`]
    }
}

export const TileRegistry = new tileRegistry();
