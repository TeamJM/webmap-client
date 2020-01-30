import {JM} from "./journeymap";
import {TileRegistry} from "./tileRegistry";


export class JMTileLayer extends L.TileLayer
{
    getTileUrl(coords)
    {
        return JM.tileUrl(coords.x, coords.y, this._getZoomForUrl());
    }

    createTile(coords, done)
    {
        const tile = super.createTile(coords, done);
        TileRegistry.setTile(this, tile, {x: coords.x, y: coords.y});

        return tile;
    }
}
