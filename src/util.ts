import * as ss58 from '@subsquid/ss58'

export function getOriginAccountId(origin: any): string | undefined {
    if (origin && origin.__kind === 'system' && origin.value.__kind === 'Signed') {
        return encodeId(origin.value.value)
    } else {
        return undefined
    }
}

export function encodeId(id: Uint8Array) {
    return ss58.codec('kusama').encode(id)
}
