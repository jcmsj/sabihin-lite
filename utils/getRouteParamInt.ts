/**
 * Responds w/ 400 if param is missing or not a number
 */
export default function getRouteIntParam(...args: Parameters<typeof getRouterParam>) {
    const param = getRouterParam(...args)
    if (param === undefined) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing id'
        })
    }
    const parsed = parseInt(param) || NaN
    if (isNaN(parsed)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'id must be a number'
        })
    }

    return parsed
}

