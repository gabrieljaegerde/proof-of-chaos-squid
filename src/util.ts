import * as ss58 from '@subsquid/ss58'
import {decodeHex} from '@subsquid/substrate-processor'

export function getOriginAccountId(origin: any): string | undefined {
    if (origin && origin.__kind === 'system' && origin.value.__kind === 'Signed') {
        return encodeId(origin.value.value)
    } else {
        return undefined
    }
}

export function encodeId(id: string | Uint8Array) {
    return ss58.codec('kusama').encode(typeof id === 'string' ? decodeHex(id) : id)
}

export function MissingConfigWarn(hashOrIndex: string | number) {
    return `Missing config with ${hashOrIndex}`
}

export function MissingOptionWarn(hashOrIndex: string | number) {
    return `Missing option with ${hashOrIndex}`
}
