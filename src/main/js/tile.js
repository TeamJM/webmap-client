import {JM} from "./journeymap";
import {TileRegistry} from "./tileRegistry";


export class JMTileLayer extends L.TileLayer {
    constructor(url, options) {
        options["minNativeZoom"] = 0;
        options["maxNativeZoom"] = 0;
        options["minZoom"] = -2;

        super(url, options);
    }

    getTileUrl(coords) {
        return JM.tileUrl(coords.x, coords.y);
    }

    createTile(coords, done) {
        const tile = super.createTile(coords, done);
        TileRegistry.setTile(this, tile, coords, this._getZoomForUrl());

        return tile;
    }
}
