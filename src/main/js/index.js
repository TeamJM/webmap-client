"use strict"

// We have to do this first because plugins expect an L global
import "leaflet"

import "intersection-observer" // Polyfill for older browsers

import "buefy/dist/buefy.css"
import "leaflet/dist/leaflet.css"
import "../css/index.css"

import { LCircleMarker, LControl, LMap, LMarker, LPolygon, LTileLayer } from "vue2-leaflet"
import { faCogs, faCube, faExpandArrowsAlt, faFileAlt, faGlobeEurope, faLocationArrow, faTimesCircle } from "@fortawesome/free-solid-svg-icons"

import Buefy, { SnackbarProgrammatic as Snackbar } from "buefy"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { Icon } from "leaflet"
import MarkerIcon from "leaflet/dist/images/marker-icon.png"
import MarkerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import MarkerShadow from "leaflet/dist/images/marker-shadow.png"
import Vue from "vue"

import datastore from "./datastore"
import { library } from "@fortawesome/fontawesome-svg-core"
import { methods } from "./methods"
import { patch } from "./utils"

/* eslint sort-imports:0 */
// Unfortunately, import order is everything in JS - this has to be here to work.
import "leaflet-rotatedmarker"

window.datastore = datastore

patch()

library.add(faCube, faLocationArrow, faGlobeEurope, faCogs, faExpandArrowsAlt, faFileAlt, faTimesCircle)

Vue.component("font-awesome-icon", FontAwesomeIcon)

Vue.component("l-circle-marker", LCircleMarker)
Vue.component("l-control", LControl)
Vue.component("l-map", LMap)
Vue.component("l-marker", LMarker)
Vue.component("l-polygon", LPolygon)
Vue.component("l-tile-layer", LTileLayer)

delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
    iconRetinaUrl: MarkerIcon2x,
    iconUrl: MarkerIcon,
    shadowUrl: MarkerShadow,
})

Vue.config.devtools = true
Vue.use(Buefy)

const app = new Vue({
    el: "#main",
    data: datastore.state,
    methods: methods,
})

window.app = app // To make it available for debugging and such

// Safari snackbar, because we need help
// TODO: Remove this when the issue is fixed

if (datastore.state.isSafari) {
    if (localStorage.getItem("safariDismissed") !== "dismissed") {
        Snackbar.open({
            actionText: "Dismiss",
            message: "It appears that you're using Safari!<br /><br />" +
                "We're having some trouble with rendering tiles in Safari. If you're a web developer and can help us, " +
                "<a href='https://github.com/TeamJM/webmap-client/issues/1' target='_blank'>please click here</a>.",
            position: "is-bottom",
            indefinite: true,

            onAction: () => {
                localStorage.setItem("safariDismissed", "dismissed")
            },
        })
    }
}
