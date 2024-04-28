interface Weather {
    lat: string
    lon: string
    appid?: string
    units?: string
}

type Units = 'metric' | 'imperial'

interface UserLocationDetails {
    latitude: string
    longitude: string
}

interface SearchCity {
    q: string
    appid?: string
    units?: string
}

export { Weather, Units, UserLocationDetails, SearchCity }