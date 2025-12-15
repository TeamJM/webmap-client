"use strict"

import {Converter} from "@gorymoon/minecraft-text"
import {getAllData, getResourceUrl, getSkinUrl, getStatus, getTileUrl, getWaypointIconUrl} from "./api"
import {ToastProgrammatic as Toast} from "buefy"
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
import {reverseTranslateCoords, translateCoords} from "./utils"
import undergroundIcon from "../images/underground.png"
import undergroundIconActive from "../images/underground-active.png"

const HAS_Y_VALUE = ["underground", "surface"]

class Journeymap {
    constructor() {
        this.tiles = {}
        this.changedTiles = []
        this.lastTileCheck = Date.now()

        this.currentDim = "minecraft:overworld"
        this.currentMapType = "day"
        this.currentSlice = 0
        this.currentZoom = 0

        this.player_x = 0
        this.player_y = 0
        this.player_z = 0

        this.followMode = false

        this.textConverter = new Converter()
    }

    resetTiles() {
        this.changedTiles = this.changedTiles.concat(Object.keys(this.tiles))
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
            if (! this.changedTiles.includes(slug)) {
                return this.tiles[slug]
            }

            this.changedTiles.splice(
                this.changedTiles.indexOf(slug), 1,
            )
        }

        const params = {
            x,
            z,

            dimension,
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

            app.$refs.map.mapObject.setView(translateCoords(this.player_x, this.player_z))
        } else {
            datastore.state.followIcon = followIconOff

            Toast.open({
                type: "is-success",
                message: "Follow mode disabled.",
            })
        }
    }

    toggleFollowMode() {
        this.setFollowMode(! this.followMode)
    }

    async _checkForChanges() {
        let status

        try {
            status = await getStatus()
        } catch (err) {
            status = {status: "failed"}
        }

        if (status.status === "ready" && status.status !== datastore.state.status) {
            this.resetTiles()
        }

        if (status.status !== "ready") {
            datastore.state.status = status.status
            return
        }

        datastore.state.surfaceMappingAllowed = status.allowedMapTypes.surface
        datastore.state.topoMappingAllowed = status.allowedMapTypes.topo
        datastore.state.caveMappingAllowed = status.allowedMapTypes.cave

        const now = Date.now()
        const data = await getAllData(this.lastTileCheck)

        if (status.status === "ready" && status.status !== datastore.state.status) {
            app.$refs.map.mapObject.setView(translateCoords(data.player.posX, data.player.posZ))
        }

        this.setDimension(data.world.dimension)

        if (HAS_Y_VALUE.includes(this.currentMapType)) {
            this.currentSlice = Math.floor(data.player.posY) >> 4
        } else {
            this.currentSlice = 0
        }

        for (const element of data.images.regions) {
            const slug = this._slugifyTile(element[0], element[1], this.currentSlice, this.currentMapType, this.currentDim)

            if (! this.changedTiles.includes(slug)) {
                this.changedTiles.push(slug)
            }
        }

        this.lastTileCheck = now

        datastore.state.markers = this._buildMarkers(data)
        datastore.state.polygons = this._buildPolygons(data)
        // datastore.state.waypoints = this._buildWaypoints(data)
        datastore.state.waypoints = this._buildWaypointMarkers(data)

        this.player_x = data.player.posX
        this.player_y = data.player.posY
        this.player_z = data.player.posZ

        datastore.state.playerX = `${Math.floor(this.player_x)}`
        datastore.state.playerY = `${Math.floor(this.player_y)}`
        datastore.state.playerZ = `${Math.floor(this.player_z)}`

        datastore.state.playerBiome = `${data.player.biome}`
        datastore.state.playerWorld = `${data.world.name}`

        let mapType = this.currentMapType

        if ((! datastore.state.surfaceMappingAllowed) && (mapType === "day" || mapType === "night")) {
            mapType = "topo"
        }

        if ((! datastore.state.topoMappingAllowed) && mapType === "topo") {
            mapType = "underground"
        }

        if ((! datastore.state.caveMappingAllowed) && mapType === "underground") {
            mapType = "day"
        }

        if (mapType !== this.currentMapType && ! this.followMode) {
            this.setMapMode(mapType)
        }

        if (this.followMode) {
            app.$refs.map.mapObject.setView(translateCoords(this.player_x, this.player_z))

            if (datastore.state.followMapType) {
                this.setMapMode(status.mapType)
            }
        }

        datastore.state.status = status.status
    }

    _buildWaypointMarkers(data) {
        const markers = []

        if (! datastore.state.visibleWaypoints) {
            return markers
        }

        for (const waypoint of Object.values(data.waypoints)) {
            if (! waypoint.settings.enable || ! waypoint.dimensions.includes(this.currentDim)) {
                continue
            }

            const reverseHellTranslate = ((this.currentDim !== "minecraft:the_nether") && (waypoint.pos.primaryDimension === "minecraft:the_nether"))
            const posX = waypoint.pos.x
            const posZ = waypoint.pos.z

            const coords = translateCoords(posX + 0.5, posZ + 0.5, reverseHellTranslate)

            const masked = waypoint.icon.id.startsWith("journeymap") || waypoint.icon.color !== null

            let color

            if (waypoint.icon.color !== undefined) {
                color = "#" + (0 + waypoint.icon.color).toString(16)
            } else {
                const red = ((waypoint.color >> 16) & 0xFF).toString(16).padStart(2, "0")
                const blue = ((waypoint.color >> 8) & 0xFF).toString(16).padStart(2, "0")
                const green = ((waypoint.color) & 0xFF).toString(16).padStart(2, "0")

                color = `#${red}${green}${blue}`
            }

            const style = ""
            const iconUrl = getWaypointIconUrl(waypoint.guid)
            const className = "marker-" + waypoint.guid.replaceAll(",", "_").replaceAll(":", "_").replaceAll(" ", "_")

            let tooltipColor = color

            if (waypoint.type === "Death") {
                tooltipColor = "#FF0000"
            }

            markers.push({
                color,
                tooltipColor,
                latLng: coords,
                masked,
                style,
                type: waypoint.type,
                key: waypoint.guid.replaceAll(",", "_").replaceAll(":", "_").replaceAll(" ", "_"),
                url: iconUrl,
                name: waypoint.name,

                className,
                size: 48,
            })
        }

        return markers
    }

    _formatText(text) {
        return this.textConverter.toHTML(this.textConverter.parse(text))
    }

    _buildMarkers(data) {
        const markers = []

        if (datastore.state.visiblePlayer) {
            const player = data.player

            markers.push({
                latLng: translateCoords(player.posX, player.posZ),
                url: markerPlayer,
                size: 48,
                zIndex: 1000,

                options: {
                    rotationAngle: player.heading,
                    rotationOrigin: "center",
                },

                key: "myself",
            })
        }

        if (datastore.state.visibleAmbient) {
            for (const ambient of Object.values(data.ambient)) {
                if (ambient.iconLocation === "minecraft:textures/entity_icon/villager/villager.png") {
                    continue
                }

                if (ambient.disabled) {
                    continue
                }

                const hexColor = "#AAAAAA"

                const dot = {
                    latLng: translateCoords(ambient.posX, ambient.posZ),
                    url: ambient.hostile ? markerDotHostile : markerDotNeutral,
                    size: 48,
                    zIndex: 1,
                    color: hexColor,

                    options: {
                        rotationAngle: ambient.heading,
                        rotationOrigin: "center",
                    },

                    key: `ambient/${ambient.entityId}`,
                }

                if (ambient.serializedCustomName !== undefined && ambient.serializedCustomName.length > 0) {
                    dot.nameTooltip = {
                        text: this._formatText(ambient.serializedCustomName),
                    }
                }

                markers.push(dot)

                const marker = {
                    className: "round-icon",
                    latLng: translateCoords(ambient.posX, ambient.posZ),
                    url: getResourceUrl(ambient.iconLocation),
                    size: 15,
                    zIndex: 2,

                    key: `animal/${ambient.entityId}/icon`,
                }

                if (ambient.serializedTooltips !== undefined && ambient.serializedTooltips.length > 0) {
                    const text = []

                    for (const tip of Object.values(ambient.serializedTooltips)) {
                        text.push(this._formatText(tip))
                    }

                    marker.customTooltip = {
                        text: text.join("<br />"),
                    }
                }

                markers.push(marker)
            }
        }

        if (datastore.state.visibleAnimals) {
            for (const animal of Object.values(data.animals)) {
                if (animal.iconLocation === "minecraft:textures/entity_icon/villager/villager.png") {
                    continue
                }

                if (animal.disabled) {
                    continue
                }

                const hexColor = "#AAAAAA"

                const dot = {
                    latLng: translateCoords(animal.posX, animal.posZ),
                    url: animal.hostile ? markerDotHostile : markerDotNeutral,
                    size: 48,
                    zIndex: 1,
                    color: hexColor,

                    options: {
                        rotationAngle: animal.heading,
                        rotationOrigin: "center",
                    },

                    key: `animal/${animal.entityId}`,
                }

                if (animal.serializedCustomName !== undefined && animal.serializedCustomName.length > 0) {
                    dot.nameTooltip = {
                        text: this._formatText(animal.serializedCustomName),
                    }
                }

                markers.push(dot)

                const marker = {
                    className: "round-icon",
                    latLng: translateCoords(animal.posX, animal.posZ),
                    url: getResourceUrl(animal.iconLocation),
                    size: 15,
                    zIndex: 2,

                    key: `animal/${animal.entityId}/icon`,
                }

                if (animal.serializedTooltips !== undefined && animal.serializedTooltips.length > 0) {
                    const text = []

                    for (const tip of Object.values(animal.serializedTooltips)) {
                        text.push(this._formatText(tip))
                    }

                    marker.customTooltip = {
                        text: text.join("<br />"),
                    }
                }

                markers.push(marker)
            }
        }

        if (datastore.state.visibleMobs) {
            for (const mob of Object.values(data.mobs)) {
                if (mob.disabled) {
                    continue
                }

                const hexColor = "#FF0000"

                const dot = {
                    latLng: translateCoords(mob.posX, mob.posZ),
                    url: mob.hostile ? markerDotHostile : markerDotNeutral,
                    size: 48,
                    zIndex: 1,
                    color: hexColor,

                    options: {
                        rotationAngle: mob.heading,
                        rotationOrigin: "center",
                    },

                    key: `mob/${mob.entityId}`,
                }

                if (mob.serializedCustomName !== undefined && mob.serializedCustomName.length > 0) {
                    dot.nameTooltip = {
                        text: this.textConverter.toHTML(this.textConverter.parse(mob.serializedCustomName)),
                    }
                }

                markers.push(dot)

                const marker = {
                    className: "round-icon",
                    latLng: translateCoords(mob.posX, mob.posZ),
                    url: getResourceUrl(mob.iconLocation),
                    size: 15,
                    zIndex: 2,

                    key: `mob/${mob.entityId}/icon`,
                }

                if (mob.serializedTooltips !== undefined && mob.serializedTooltips.length > 0) {
                    const text = []

                    for (const tip of Object.values(mob.serializedTooltips)) {
                        text.push(this._formatText(tip))
                    }

                    marker.customTooltip = {
                        text: text.join("<br />"),
                    }
                }

                markers.push(marker)
            }
        }

        if (datastore.state.visibleVillagers) {
            for (const villager of Object.values(data.villagers)) {
                if (villager.disabled) {
                    continue
                }

                const hexColor = "#88E188"

                const dot = {
                    latLng: translateCoords(villager.posX, villager.posZ),
                    url: villager.hostile ? markerDotHostile : markerDotVillager,
                    size: 48,
                    zIndex: 1,
                    color: hexColor,

                    options: {
                        rotationAngle: villager.heading,
                        rotationOrigin: "center",
                    },

                    key: `villager/${villager.entityId}`,
                }

                if (villager.serializedCustomName !== undefined && villager.serializedCustomName.length > 0) {
                    dot.nameTooltip = {
                        text: this.textConverter.toHTML(this.textConverter.parse(villager.serializedCustomName)),
                    }
                }

                markers.push(dot)

                const marker = {
                    className: "round-icon",
                    latLng: translateCoords(villager.posX, villager.posZ),
                    url: getResourceUrl(villager.iconLocation),
                    size: 15,
                    zIndex: 2,

                    key: `villager/${villager.entityId}/icon`,
                }

                if (villager.serializedTooltips !== undefined && villager.serializedTooltips.length > 0) {
                    const text = []

                    for (const tip of Object.values(villager.serializedTooltips)) {
                        text.push(this._formatText(tip))
                    }

                    marker.customTooltip = {
                        text: text.join("<br />"),
                    }
                }

                markers.push(marker)
            }
        }

        if (datastore.state.visiblePlayers) {
            for (const player of Object.values(data.players)) {
                if (player.disabled) {
                    continue
                }

                const hexColor = "#303DC1"

                const dot = {
                    latLng: translateCoords(player.posX, player.posZ),
                    url: markerDotPlayer,
                    size: 48,
                    zIndex: 1,
                    color: hexColor,

                    options: {
                        rotationAngle: player.heading,
                        rotationOrigin: "center",
                    },

                    key: `player/${player.entityId}`,
                }

                if (player.username !== undefined && player.username.length > 0) {
                    let text = player.username

                    if (text.startsWith("{")) {
                        text = this.textConverter.toHTML(this.textConverter.parse(text))
                    }

                    dot.nameTooltip = {
                        text,
                    }
                }

                markers.push(dot)

                const marker = {
                    className: "round-icon",
                    latLng: translateCoords(player.posX, player.posZ),
                    url: getSkinUrl(player.entityId),
                    size: 15,
                    zIndex: 2,

                    key: `player/${player.entityId}/icon`,
                }

                if (player.serializedTooltips !== undefined && player.serializedTooltips.length > 0) {
                    const text = []

                    for (const tip of Object.values(player.serializedTooltips)) {
                        text.push(this._formatText(tip))
                    }

                    marker.customTooltip = {
                        text: text.join("<br />"),
                    }
                }

                markers.push(marker)
            }
        }

        return markers
    }

    _buildPolygons(data) {
        const polygons = []

        if (! datastore.state.visiblePolygons) {
            return polygons
        }

        for (const polygon of Object.values(data.polygons)) {
            let coords = []
            const holes = []

            for (const point of Object.values(polygon.points)) {
                coords.push(translateCoords(point.x, point.z))
            }

            if (polygon.holes.length > 0) {
                for (const holeObj of Object.values(polygon.holes)) {
                    const hole = []

                    for (const point of Object.values(holeObj)) {
                        hole.push(translateCoords(point.x, point.z))
                    }

                    holes.push(hole)
                }

                coords = [[coords], holes]
            }
            let firstPoint = Object.values(polygon.points)
            let className = "polygon-" + (translateCoords(firstPoint[0].x, firstPoint[0].z) + "_" + polygon.label).replaceAll(",", "_").replaceAll(":", "_").replaceAll(" ", "_").replaceAll("\n", "").toLowerCase()
            polygons.push({
                latLngs: coords,

                strokeColor: polygon.strokeColor,
                strokeOpacity: polygon.strokeOpacity,
                strokeWidth: polygon.strokeWidth,

                fillColor: polygon.fillColor,
                fillOpacity: polygon.fillOpacity,
                label: polygon.label,
                fontColor: polygon.fontColor,
                className: className,
                texturePositionX: polygon.texturePositionX,
                texturePositionY: polygon.texturePositionY,
                textureScaleX: polygon.textureScaleX,
                textureScaleY: polygon.textureScaleY,

                fillPattern: polygon.imageLocation ? getResourceUrl(polygon.imageLocation) : null,
            })
        }

        return polygons
    }

    _buildWaypoints(data) {
        const waypoints = []

        if (! datastore.state.visibleWaypoints) {
            return waypoints
        }

        let zoomOffset = 6

        if (this.currentZoom >= 0) {
            zoomOffset = zoomOffset - this.currentZoom
        } else {
            zoomOffset = zoomOffset - (this.currentZoom * 5)
        }

        for (const waypoint of Object.values(data.waypoints)) {
            if (! waypoint.enable || ! waypoint.dimensions.includes(this.currentDim)) {
                continue
            }

            const hellTranslate = this.currentDim === "minecraft:the_nether"
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
                coords,
                latLngs,
                type: waypoint.type,
            })
        }

        return waypoints
    }

    _slugifyTile(x, z, slice, type, dimension) {
        return `X ${x}, Z ${z}, Slice ${slice} / Dim ${dimension}, Type ${type},`
    }

    setMapMode(mapMode) {
        try {
            datastore.state.dayIcon = dayIcon
            datastore.state.nightIcon = nightIcon
            datastore.state.topoIcon = topoIcon
            datastore.state.undergroundIcon = undergroundIcon

            if (this.currentDim === "minecraft:the_nether") { // Nether has only cave mode
                datastore.state.dayIcon = dayIconDisabled
                datastore.state.nightIcon = nightIconDisabled
                datastore.state.topoIcon = topoIconDisabled
                datastore.state.undergroundIcon = undergroundIconActive

                this.currentMapType = "underground"
                return
            }

            if (this.currentDim === "minecraft:the_end") {
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
        } catch (e) {
            console.error("Map mode: " + mapMode + " | ", e)
        }
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

        // for (const waypoint of Object.values(window.app.waypoints)) {
        //     let latLngs
        //
        //     if (waypoint.type === "Death") {
        //         // Draw an X for death markers
        //         latLngs = [
        //             [waypoint.coords[0] + zoomOffset, waypoint.coords[1] + zoomOffset],
        //             [waypoint.coords[0] - zoomOffset, waypoint.coords[1] - zoomOffset],
        //             [waypoint.coords[0], waypoint.coords[1]], // Center of the X
        //             [waypoint.coords[0] - zoomOffset, waypoint.coords[1] + zoomOffset],
        //             [waypoint.coords[0] + zoomOffset, waypoint.coords[1] - zoomOffset],
        //             [waypoint.coords[0], waypoint.coords[1]], // Center of the X
        //         ]
        //     } else {
        //         latLngs = [
        //             [waypoint.coords[0] + zoomOffset, waypoint.coords[1]],
        //             [waypoint.coords[0], waypoint.coords[1] + zoomOffset],
        //             [waypoint.coords[0] - zoomOffset, waypoint.coords[1]],
        //             [waypoint.coords[0], waypoint.coords[1] - zoomOffset],
        //         ]
        //     }
        //
        //     waypoint.latLngs = latLngs
        // }
    }
}

export const
    JM = new Journeymap()
