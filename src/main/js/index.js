"use strict";

import Buefy from "buefy";
import "buefy/dist/buefy.css";

import {Icon} from "leaflet";

import "leaflet-rotatedmarker"

import MarkerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import MarkerIcon from "leaflet/dist/images/marker-icon.png"
import MarkerShadow from "leaflet/dist/images/marker-shadow.png"
import "leaflet/dist/leaflet.css"
import Vue from "vue";

import {LCircleMarker, LMap, LMarker, LTileLayer} from "vue2-leaflet";
import "../css/index.css";

import datastore from "./datastore";
import {methods} from "./methods";

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
Vue.component('l-circle-marker', LCircleMarker);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: MarkerIcon2x,
    iconUrl: MarkerIcon,
    shadowUrl: MarkerShadow,
});

Vue.config.devtools = true;
Vue.use(Buefy);

const app = new Vue({
    el: "#main",
    data: datastore.state,
    methods: methods,
});

window.app = app;  // To make it available for debugging and such
