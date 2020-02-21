"use strict"

import { JM } from "./journeymap"
import { JMHttpError } from "./error"
import { JMIcon } from "./icon"
import { JMTileLayer } from "./tile"
import { ToastProgrammatic as Toast } from "buefy"

import datastore from "./datastore"
import { getLogs } from "./api"

const FS_ELEMENT = document.body
const ENTER_FS_FUNC = FS_ELEMENT.requestFullScreen || FS_ELEMENT.webkitRequestFullScreen || FS_ELEMENT.mozRequestFullScreen || FS_ELEMENT.msRequestFullscreen
const EXIT_FS_FUNC = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen

let isFullScreen = false

export const methods = {
    downloadLog: downloadLog,
    dragStart: dragStart,
    getMarkerIconObj: getMarkerIconObj,
    mapReady: mapReady,
    reloadLog: reloadLog,
    setMapMode: setMapMode,
    toggleFollowMode: toggleFollowMode,
    toggleFullScreen: toggleFullScreen,
    updateZoom: updateZoom,

    getTileClass: (url, options) => {
        return new JMTileLayer(url, options)
    },
}

export function mapReady() {
    setInterval(
        () => {
            try {
                JM._checkForChanges().then()
            } catch (e) {
                if (e instanceof JMHttpError) {
                    e.responseObj.text().then((text) => {
                        console.error(`Failed to check for tile changes: ${text}`)
                    })
                }
            }
        },
        1000)
}

export function updateZoom() {
    const mapElement = document.getElementById("map")
    const zoom = this.$refs.map.mapObject._zoom

    if (zoom > 0) {
        mapElement.classList.add("pixelated")
    } else {
        mapElement.classList.remove("pixelated")
    }

    JM.setZoom(zoom)
}

export function getMarkerIconObj(marker) {
    return new JMIcon({
        anchor: marker.anchor,
        className: marker.className,
        iconUrl: marker.url,
        iconSize: marker.size,
    })
}

export function toggleFollowMode() {
    JM.toggleFollowMode()
}

export function dragStart(event) {
    if (JM.followMode) {
        JM.setFollowMode(false)
    }
}

export function setMapMode(mapMode) {
    JM.setMapMode(mapMode)
}

export function reloadLog() {
    datastore.state.logsLoading = true

    getLogs().then((logs) => {
        datastore.state.logContent = logs
        datastore.state.logsLoading = false
    })
}

export function downloadLog() {
    const content = datastore.state.logContent

    const element = document.createElement("a")
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`)
    element.setAttribute("download", "journeymap.log")

    element.style.display = "none"

    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

export function toggleFullScreen(event) {
    if (!ENTER_FS_FUNC || !EXIT_FS_FUNC) {
        Toast.open({
            type: "is-danger",
            message: "Full-screen mode is not supported in this browser.",
        })

        return
    }

    if (isFullScreen) {
        // This isn't always a coroutine, depending on the browser.
        // Thanks, Chrome.
        Promise.resolve(EXIT_FS_FUNC.call(document)).then(() => {
            Toast.open({
                type: "is-success",
                message: "Exited full-screen mode.",
            })
        })
    } else {
        // This isn't always a coroutine, depending on the browser.
        // Thanks, Chrome.
        Promise.resolve(ENTER_FS_FUNC.call(FS_ELEMENT)).then(() => {
            Toast.open({
                type: "is-success",
                message: "Entered full-screen mode.",
            })
        })
    }

    isFullScreen = !isFullScreen
}

// export function onMapClicked(event) {
//     const [x, z] = reverseTranslateCoords(Math.floor(event.latlng.lat), Math.floor(event.latlng.lng));
//
//     datastore.state.mouseCoords = `x: ${x}, z: ${z - 1}`
// }
