"use strict"

// We have to do this first because plugins expect an L global
import "leaflet"

// Polyfills for older browsers
import "intersection-observer"
import "core-js/stable";
import "regenerator-runtime/runtime";

import "buefy/dist/buefy.css"
import "leaflet/dist/leaflet.css"
import "../css/index.css"

import { LCircleMarker, LControl, LMap, LMarker, LPolygon, LTileLayer, LTooltip } from "vue2-leaflet"
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
Vue.component("l-tooltip", LTooltip)

Vue.component('v-style', {
    render: function (createElement) {
        return createElement('style', this.$slots.default)
    }
});

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


/**
 *  Extend the Polygon Object to set an image to fill the path in canvas

 *  Author: bgx1012@163.com

 *  Modified by Alejandro Coria
 *  See https://github.com/alejandrocoria/leaflet-polygon-fillPattern-canvas
 */
(function (window, document, undefined) {
    if (L.Canvas) {
        L.Canvas.include({
            _fillStroke: function (ctx, layer) {

                var options = layer.options

                if (options.imgId && options.textureScaleX !== 0 && options.textureScaleY !== 0) {
                    if (!layer.image || options.imgId !== layer.image.imgId) {
                        if (layer.image) {
                            layer.image.remove()
                        }

                        layer.image = this.getPane().querySelector("[src='"+options.imgId+"']")
                        if (!layer.image) {
                            layer.image = new Image()
                            layer.image.hidden = true
                            layer.image.src = options.imgId
                            layer.image.imgId = options.imgId
                            this.getPane().appendChild(layer.image)
                        }
                    }

                    const img = layer.image

                    if (!img.complete) {
                        return
                    }

                    const offscreen = new OffscreenCanvas(img.width, img.height);
                    const ctxOffscreen = offscreen.getContext("2d")
                    const patternOffscreen = ctxOffscreen.createPattern(img, 'repeat')
                    ctxOffscreen.globalCompositeOperation = "copy"
                    ctxOffscreen.globalAlpha = 1
                    ctxOffscreen.fillStyle = patternOffscreen
                    ctxOffscreen.fillRect(0, 0, img.width, img.height)
                    ctxOffscreen.globalCompositeOperation = "multiply"
                    ctxOffscreen.fillStyle = options.fillColor || options.color
                    ctxOffscreen.fillRect(0, 0, img.width, img.height)

                    if (offscreen.width != 0 && offscreen.height != 0) {
                        ctx.save() // so we can remove the clipping
                        ctx.clip()
                        ctx.globalAlpha = options.fillOpacity
                        ctx.imageSmoothingEnabled = false
                        const bounds = layer._rawPxBounds
                        const size = bounds.getSize()
                        const pattern = ctx.createPattern(offscreen, 'repeat')
                        const zoomScale = Math.pow(2, this._map.getZoom())
                        const pixelOrigin = this._map.getPixelOrigin()
                        const matrix = new DOMMatrix()
                        matrix.translateSelf(options.texturePositionX * zoomScale - pixelOrigin.x, options.texturePositionY * zoomScale - pixelOrigin.y)
                        matrix.scaleSelf(options.textureScaleX * zoomScale, options.textureScaleY * zoomScale, 1)
                        pattern.setTransform(matrix)
                        ctx.fillStyle = pattern
                        ctx.fillRect(bounds.min.x, bounds.min.y, size.x, size.y)
                        ctx.restore()
                    }
                } else {
                    ctx.globalAlpha = options.fillOpacity
                    ctx.fillStyle = options.fillColor || options.color

                    ctx.fill(options.fillRule || 'evenodd')
                }

                if (options.stroke && options.weight !== 0) {
                    if (ctx.setLineDash) {
                        ctx.setLineDash(layer.options && layer.options._dashArray || [])
                    }

                    ctx.globalAlpha = options.opacity
                    ctx.lineWidth = options.weight
                    ctx.strokeStyle = options.color
                    ctx.lineCap = options.lineCap
                    ctx.lineJoin = options.lineJoin
                    ctx.stroke()
                }
            }
        })
    }
}(this, document))
