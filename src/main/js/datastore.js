"use strict";

import {Point} from "leaflet";
import {JMTileLayer} from "./tile";

export default {
    state: {
        tiles_url: "/tiles/tile.png?x={x}&z={y}&y=0&zoom={z}&dim=0",
        map_bounds: [
            new Point(-29999984, -29999984),
            new Point(29999984, 29999984)
        ],

        tiles: {},
        JMTileLayer: JMTileLayer,
    }
};