"use strict"

import { getAllData, getResourceUrl, getSkinUrl, getStatus, getTileUrl } from "./api"

import { ToastProgrammatic as Toast } from "buefy"
import datastore from "./datastore"
import dayIcon from "../images/day.png"
import dayIconActive from "../images/day-active.png"
import dayIconDisabled from "../images/day-disabled.png"
import followIconOff from "../images/follow-off.png"
import followIconOn from "../images/follow-on.png"
import markerDotHostile from "../images/marker/dot-hostile.png"
import markerDotNeutral from "../images/marker/dot-neutral.png"
import markerDotPlayer from "../images/marker/dot-player.png"
import markerDotVillager from "../images/marker/dot-villager.png"
import markerPlayer from "../images/player/self.png"
import nightIcon from "../images/night.png"
import nightIconActive from "../images/night-active.png"
import nightIconDisabled from "../images/night-disabled.png"
import topoIcon from "../images/topo.png"
import topoIconActive from "../images/topo-active.png"
import topoIconDisabled from "../images/topo-disabled.png"
import { translateCoords } from "./utils"
import undergroundIcon from "../images/underground.png"
import undergroundIconActive from "../images/underground-active.png"

const HAS_Y_VALUE = ["underground", "surface"]

class Journeymap {
    constructor() {
        this.tiles = {}
        this.changedTiles = []
        this.lastTileCheck = Date.now()

        this.currentDim = 0
        this.currentMapType = "day"
        this.currentSlice = 0
        this.currentZoom = 0

        this.player_x = 0
        this.player_y = 0
        this.player_z = 0

        this.followMode = false
    }

    tileUrl(x, z, slice, mapType, dimension) {
        if (slice === undefined) {
            slice = this.currentSlice
        }

        if (mapType === undefined) {
            mapType = this.currentMapType
        }

        if (dimension === undefined) {
            dimension = this.currentDim
        }

        const slug = this._slugifyTile(x, z, slice, mapType, dimension)

        if (slug in this.tiles) {
            if (!this.changedTiles.includes(slug)) {
                return this.tiles[slug]
            }

            this.changedTiles.splice(
                this.changedTiles.indexOf(slug), 1,
            )
        }

        const params = {
            x: x,
            z: z,

            dimension: dimension,
            mapTypeString: mapType,
            y: slice,
            zoom: 0,
        }

        const url = getTileUrl(params)

        this.tiles[slug] = url

        return url
    }

    setFollowMode(mode) {
        this.followMode = mode
        datastore.state.followMode = this.followMode

        if (this.followMode) {
            datastore.state.followIcon = followIconOn

            Toast.open({
                type: "is-success",
                message: "Follow mode enabled.",
            })
        } else {
            datastore.state.followIcon = followIconOff

            Toast.open({
                type: "is-success",
                message: "Follow mode disabled.",
            })
        }
    }

    toggleFollowMode() {
        this.setFollowMode(!this.followMode)
    }

    async _checkForChanges() {
        const status = await getStatus()

        datastore.state.status = status.status

        if (status.status !== "ready") {
            return
        }

        datastore.state.surfaceMappingAllowed = status.allowedMapTypes.surface
        datastore.state.topoMappingAllowed = status.allowedMapTypes.topo
        datastore.state.caveMappingAllowed = status.allowedMapTypes.cave

        const now = Date.now()
        const data = await getAllData(this.lastTileCheck)

        this.setDimension(data.world.dimension)

        if (HAS_Y_VALUE.includes(this.currentMapType)) {
            this.currentSlice = Math.floor(data.player.posY) >> 4
        } else {
            this.currentSlice = 0
        }

        for (const element of data.images.regions) {
            const slug = this._slugifyTile(element[0], element[1], this.currentSlice, this.currentMapType, this.currentDim)

            if (!this.changedTiles.includes(slug)) {
                this.changedTiles.push(slug)
            }
        }

        this.lastTileCheck = now

        datastore.state.markers = this._buildMarkers(data)
        datastore.state.polygons = this._buildPolygons(data)
        datastore.state.waypoints = this._buildWaypoints(data)

        this.player_x = data.player.posX
        this.player_y = data.player.posY
        this.player_z = data.player.posZ

        datastore.state.playerX = `${Math.floor(this.player_x)}`
        datastore.state.playerY = `${Math.floor(this.player_y)}`
        datastore.state.playerZ = `${Math.floor(this.player_z)}`

        datastore.state.playerBiome = `${data.player.biome}`
        datastore.state.playerWorld = `${data.world.name}`

        let mapType = this.currentMapType

        if ((!datastore.state.surfaceMappingAllowed) && (mapType === "day" || mapType === "night")) {
            mapType = "topo"
        }

        if ((!datastore.state.topoMappingAllowed) && mapType === "topo") {
            mapType = "underground"
        }

        if ((!datastore.state.caveMappingAllowed) && mapType === "underground") {
            mapType = "day"
        }

        if (mapType !== this.currentMapType && !this.followMode) {
            this.setMapMode(mapType)
        }

        if (this.followMode) {
            app.$refs.map.mapObject.setView(translateCoords(this.player_x, this.player_z))
            this.setMapMode(status.mapType)
        }
    }

    _buildMarkers(data) {
        const markers = []

        if (datastore.state.visiblePlayer) {
            const player = data.player

            markers.push({
                latLng: translateCoords(player.posX, player.posZ),
                url: markerPlayer,
                size: 32,
                zIndex: 1000,

                options: {
                    rotationAngle: player.heading,
                    rotationOrigin: "center",
                },
            })
        }

        if (datastore.state.visibleAnimals) {
            for (const animal of Object.values(data.animals)) {
                markers.push({
                    latLng: translateCoords(animal.posX, animal.posZ),
                    url: animal.hostile ? markerDotHostile : markerDotNeutral,
                    size: 48,
                    zIndex: 1,

                    options: {
                        rotationAngle: animal.heading,
                        rotationOrigin: "center",
                    },

                    key: animal.entityId,
                })

                markers.push({
                    className: "round-icon",
                    latLng: translateCoords(animal.posX, animal.posZ),
                    url: getResourceUrl(animal.iconLocation),
                    size: 14,
                    zIndex: 2,

                    key: `${animal.entityId}/icon`,
                })
            }
        }

        if (datastore.state.visibleMobs) {
            for (const mob of Object.values(data.mobs)) {
                markers.push({
                    latLng: translateCoords(mob.posX, mob.posZ),
                    url: mob.hostile ? markerDotHostile : markerDotNeutral,
                    size: 48,
                    zIndex: 1,

                    options: {
                        rotationAngle: mob.heading,
                        rotationOrigin: "center",
                    },

                    key: mob.entityId,
                })

                markers.push({
                    className: "round-icon",
                    latLng: translateCoords(mob.posX, mob.posZ),
                    url: getResourceUrl(mob.iconLocation),
                    size: 14,
                    zIndex: 2,

                    key: `${mob.entityId}/icon`,
                })
            }
        }

        if (datastore.state.visibleVillagers) {
            for (const villager of Object.values(data.villagers)) {
                markers.push({
                    latLng: translateCoords(villager.posX, villager.posZ),
                    url: villager.hostile ? markerDotHostile : markerDotVillager,
                    size: 48,
                    zIndex: 1,

                    options: {
                        rotationAngle: villager.heading,
                        rotationOrigin: "center",
                    },

                    key: villager.entityId,
                })

                markers.push({
                    className: "round-icon",
                    latLng: translateCoords(villager.posX, villager.posZ),
                    url: getResourceUrl(villager.iconLocation),
                    size: 14,
                    zIndex: 2,

                    key: `${villager.entityId}/icon`,
                })
            }
        }

        if (datastore.state.visiblePlayers) {
            for (const player of Object.values(data.players)) {
                markers.push({
                    latLng: translateCoords(player.posX, player.posZ),
                    url: markerDotPlayer,
                    size: 48,
                    zIndex: 1,

                    options: {
                        rotationAngle: player.heading,
                        rotationOrigin: "center",
                    },

                    key: player.entityId,
                })

                markers.push({
                    className: "round-icon",
                    latLng: translateCoords(player.posX, player.posZ),
                    url: getSkinUrl(player.entityId),
                    size: 14,
                    zIndex: 2,

                    key: `${player.entityId}/icon`,
                })
            }
        }

        return markers
    }

    _buildPolygons(data) {
        const polygons = []

        if (!datastore.state.visiblePolygons) {
            return polygons
        }

        for (const polygon of Object.values(data.polygons)) {
            let coords = []
            const holes = []

            for (const point of Object.values(polygon.points)) {
                coords.push(translateCoords(point.x, point.z))
            }

            if (polygon.holes.size > 0) {
                for (const holeObj of Object.values(polygon.holes)) {
                    const hole = []

                    for (const point of Object.values(holeObj)) {
                        hole.push(translateCoords(point.x, point.z))
                    }

                    holes.push(hole)
                }

                coords = coords.concat([coords], holes)
            }

            polygons.push({
                latLngs: coords,

                strokeColor: polygon.strokeColor,
                strokeOpacity: polygon.strokeOpacity,
                strokeWidth: polygon.strokeWidth,

                fillColor: polygon.fillColor,
                fillOpacity: polygon.fillOpacity,
            })
        }

        return polygons
    }

    _buildWaypoints(data) {
        const waypoints = []

        if (!datastore.state.visibleWaypoints) {
            return waypoints
        }

        let zoomOffset = 6

        if (this.currentZoom >= 0) {
            zoomOffset = zoomOffset - this.currentZoom
        } else {
            zoomOffset = zoomOffset - (this.currentZoom * 5)
        }

        for (const waypoint of Object.values(data.waypoints)) {
            if (!waypoint.enable || !waypoint.dimensions.includes(this.currentDim)) {
                continue
            }

            const hellTranslate = this.currentDim === -1
            const coords = translateCoords(waypoint.x + 0.5, waypoint.z + 0.5, hellTranslate)

            const red = waypoint.r.toString(16).padStart(2, "0")
            const green = waypoint.g.toString(16).padStart(2, "0")
            const blue = waypoint.b.toString(16).padStart(2, "0")

            let latLngs

            if (waypoint.type === "Death") {
                // Draw an X for death markers
                latLngs = [
                    [coords[0] + zoomOffset, coords[1] + zoomOffset],
                    [coords[0] - zoomOffset, coords[1] - zoomOffset],
                    [coords[0], coords[1]], // Center of the X
                    [coords[0] - zoomOffset, coords[1] + zoomOffset],
                    [coords[0] + zoomOffset, coords[1] - zoomOffset],
                    [coords[0], coords[1]], // Center of the X
                ]
            } else {
                latLngs = [
                    [coords[0] + zoomOffset, coords[1]],
                    [coords[0], coords[1] + zoomOffset],
                    [coords[0] - zoomOffset, coords[1]],
                    [coords[0], coords[1] - zoomOffset],
                ]
            }

            waypoints.push({
                color: `#${red}${green}${blue}`,
                coords: coords,
                latLngs: latLngs,
                type: waypoint.type,
            })
        }

        return waypoints
    }

    _slugifyTile(x, z, slice, type, dimension) {
        return `X ${x}, Z ${z}, Slice ${slice} / Dim ${dimension}, Type ${type},`
    }

    setMapMode(mapMode) {
        datastore.state.dayIcon = dayIcon
        datastore.state.nightIcon = nightIcon
        datastore.state.topoIcon = topoIcon
        datastore.state.undergroundIcon = undergroundIcon

        if (this.currentDim === -1) { // Nether has only cave mode
            datastore.state.dayIcon = dayIconDisabled
            datastore.state.nightIcon = nightIconDisabled
            datastore.state.topoIcon = topoIconDisabled
            datastore.state.undergroundIcon = undergroundIconActive

            this.currentMapType = "underground"
            return
        }

        if (this.currentDim === 1) {
            datastore.state.nightIcon = nightIconDisabled

            if (mapMode === "night") { // End has no night mode
                return this.setMapMode("day")
            }
        }

        switch (mapMode) {
        case "day":
            datastore.state.dayIcon = dayIconActive
            break
        case "night":
            datastore.state.nightIcon = nightIconActive
            break
        case "topo":
            datastore.state.topoIcon = topoIconActive
            break
        case "underground":
            datastore.state.undergroundIcon = undergroundIconActive
            break
        }

        this.currentMapType = mapMode
    }

    setDimension(dim) {
        this.currentDim = dim

        // Update allowable map types and do fixes
        this.setMapMode(this.currentMapType)
    }

    setZoom(zoom) {
        if (this.followMode) {
            app.$refs.map.mapObject.setView(translateCoords(this.player_x, this.player_z))
        }

        this.currentZoom = Number(zoom)

        let zoomOffset = 6

        if (this.currentZoom >= 0) {
            zoomOffset = zoomOffset - this.currentZoom
        } else {
            zoomOffset = zoomOffset - (this.currentZoom * 3)
        }

        for (const waypoint of Object.values(window.app.waypoints)) {
            let latLngs

            if (waypoint.type === "Death") {
                // Draw an X for death markers
                latLngs = [
                    [waypoint.coords[0] + zoomOffset, waypoint.coords[1] + zoomOffset],
                    [waypoint.coords[0] - zoomOffset, waypoint.coords[1] - zoomOffset],
                    [waypoint.coords[0], waypoint.coords[1]], // Center of the X
                    [waypoint.coords[0] - zoomOffset, waypoint.coords[1] + zoomOffset],
                    [waypoint.coords[0] + zoomOffset, waypoint.coords[1] - zoomOffset],
                    [waypoint.coords[0], waypoint.coords[1]], // Center of the X
                ]
            } else {
                latLngs = [
                    [waypoint.coords[0] + zoomOffset, waypoint.coords[1]],
                    [waypoint.coords[0], waypoint.coords[1] + zoomOffset],
                    [waypoint.coords[0] - zoomOffset, waypoint.coords[1]],
                    [waypoint.coords[0], waypoint.coords[1] - zoomOffset],
                ]
            }

            waypoint.latLngs = latLngs
        }
    }
}

export const JM = new Journeymap()
