"use strict";

import {Point} from "leaflet";
import {JMTileLayer} from "./tile";

export default {
    state: {
        map_bounds: [
            new Point(-29999984, -29999984),
            new Point(29999984, 29999984),
        ],

        markers: [],
        tiles: {},
        JMTileLayer: JMTileLayer,
    },
};