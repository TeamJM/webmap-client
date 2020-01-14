import {JM} from "./journeymap";


export class JMTileLayer extends L.TileLayer
{
    getTileUrl(coords)
    {
        return JM.tileUrl(coords.x, coords.y, this._getZoomForUrl());
    }

    createTile(coords, done)
    {
        let tile = super.createTile(coords, done);

        setInterval(() =>
        {
            let url = this.getTileUrl(coords);

            if (!tile.src.endsWith(url))
            {
                tile.src = url;
            }
        }, 1000);

        return tile;
    }
}
