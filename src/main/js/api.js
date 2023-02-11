import { JMError, JMHttpError } from "./error"

export const DATA_TYPES = {
    ALL: "all",
    AMBIENT: "ambient",
    ANIMALS: "animals",
    MOBS: "mobs",
    IMAGES: "images",
    MESSAGES: "messages",
    PLAYER: "player",
    PLAYERS: "players",
    VILLAGERS: "villagers",
    WAYPOINTS: "waypoints",
    WORLD: "world",
}

const GET = { method: "GET" }
// const POST = { method: "POST" }

const REQUIRES_IMAGES_SINCE = [DATA_TYPES.ALL, DATA_TYPES.IMAGES]
const URLS = {
    ACTIONS: "/actions",
    DATA: "/data/{type}",
    LOGS: "/logs",
    PROPERTIES: "/properties",
    POLYGONS: "/polygons",
    RESOURCES: "/resources?resource={resource}",
    SKIN: "/skin/{uuid}",
    STATUS: "/status",
    TILE: "/tiles/tile.png",
}

async function request(url, init = {}, params) {
    if (init.method !== "GET" && params !== undefined) {
        init = init.copy()

        const data = new FormData()

        for (const key in Object.keys(params)) {
            data.append(key, params[key])
        }

        init.body = data
    }

    const response = await fetch(url, init)

    if (! response.ok) {
        throw new JMHttpError(response.status, response.statusText, response)
    }

    return response
}

async function json(url, init, params) {
    const response = await request(url, init, params)

    return response.json()
}

async function text(url, init, params) {
    const response = await request(url, init, params)

    return response.text()
}

export async function getData(type, imagesSince) {
    if (! Object.values(DATA_TYPES).includes(type)) {
        throw TypeError(`Unknown type: ${type}`)
    }

    if (imagesSince === undefined) {
        if (type in REQUIRES_IMAGES_SINCE) {
            throw new JMError(`Type "${type}" requires the "imagesSince" parameter`)
        }
    }

    let url = URLS.DATA.format({ type: type })

    if (imagesSince !== undefined) {
        url = `${url}?images.since=${imagesSince}`
    }

    return json(url, GET)
}

export async function getAllData(imagesSince) {
    const data = await getData(DATA_TYPES.ALL, imagesSince)
    data.ambient = await getData(DATA_TYPES.AMBIENT)
    data.animals = await getData(DATA_TYPES.ANIMALS)
    data.mobs = await getData(DATA_TYPES.MOBS)
    data.players = await getData(DATA_TYPES.PLAYERS)
    data.villagers = await getData(DATA_TYPES.VILLAGERS)

    data.polygons = await getPolygons()

    return data
}

export async function getLogs() {
    return text(URLS.LOGS, GET)
}

export async function getPolygons() {
    return json(URLS.POLYGONS, GET)
}

export function getResourceUrl(resource) {
    return URLS.RESOURCES.format({ resource: encodeURIComponent(resource) })
}

export function getSkinUrl(username) {
    return URLS.SKIN.format({ uuid: encodeURIComponent(username) })
}

export async function getStatus() {
    return json(URLS.STATUS, GET)
}

export function getTileUrl(parameters) {
    if (parameters.t === undefined) {
        // To ensure the URL isn't cached
        parameters.t = Date.now().toString()
    }

    let url = `${URLS.TILE}?`
    const parts = []

    for (const [key, value] of Object.entries(parameters)) {
        parts.push(`${key}=${value}`)
    }

    url = url + parts.join("&")

    return url
}
