import { SystemRemarkCall } from './types/calls'
import { BatchContext, CallHandlerContext } from '@subsquid/substrate-processor'
import { CallItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { Store } from '@subsquid/typeorm-store'
import assert from 'assert'
import { getOriginAccountId } from './util'

export async function remarkHandler(
    ctx: BatchContext<Store, unknown>,
    item: CallItem<'System.remark', { call: { args: true; origin: true } }>
): Promise<void> {
    assert(item.name === 'System.remark')

    const message = new SystemRemarkCall(ctx, item.call).asV1020.remark.toString()
    if (!isProofOfChaosMessage(message)) return

    const originAccountId = getOriginAccountId(item.call.origin)
    if (originAccountId == null) return

    const rmrkObject = message.split('::')
    switch (rmrkObject[2]) {
        case 'LUCK':
            // if (isValidAddress(originAccountId)) ...
        case 'SETTING':
            // if (isValidAddress(originAccountId)) ...
        case 'QUIZ':
            // ...
        default:
            return
    }
}

function isProofOfChaosMessage(str: string) {
    return /^PROOFOFCHAOS::226::.*$/.test(str)
}

function isValidAddress(address: string) {
    return address === 'DhvRNnnsyykGpmaa9GMjK9H4DeeQojd5V5qCTWd1GoYwnTc'
}
