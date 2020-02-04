"use strict";

import {Point} from "leaflet";

import followIconOff from "../images/follow-off.png"
import {JMTileLayer} from "./tile";

export default {
    state: {
        map_bounds: [
            new Point(-29999984, -29999984),
            new Point(29999984, 29999984),
        ],

        followIcon: followIconOff,
        markers: [],
        tiles: {},
        JMTileLayer: JMTileLayer,
    },
};
