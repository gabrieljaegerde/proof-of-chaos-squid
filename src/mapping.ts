import { SystemRemarkCall } from './types/calls'
import { BatchContext, CallHandlerContext, CommonHandlerContext, SubstrateBlock } from '@subsquid/substrate-processor'
import { CallItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { Store } from '@subsquid/typeorm-store'
import assert from 'assert'
import { getOriginAccountId, MissingOptionWarn, MissingConfigWarn } from './util'
import { getSettingData } from './mappings/calls/setting'
import { Config } from './model/generated/config.model'
import { Resource } from './model/generated/resource.model'
import { Option } from './model/generated/option.model'
import { Distribution } from './model/generated/distribution.model'

interface ResourceData {
    optionId: string
    option: OptionData
    name: string
    main: string
    thumb: string
    text: string
    artist: string
    creativeDirector: string
    rarity: string
    itemName: string
    slot: string
    title: string
}

interface OptionData {
    configId: string
    config: ConfigData
    transferable: number
    symbol: string
    text: string
    artist: string
    creativeDirector: string
    rarity: string
    itemName: string
    royalty: number[]
    resources: ResourceData[]
}

interface ConfigData {
    referendumIndex: number
    min: string
    max: string
    first: string
    blockCutOff: string
    directOnly: boolean
    createNewCollection: boolean
    newCollectionSymbol: string
    newCollectionPath: string
    newCollectionFile: string
    newCollectionName: string
    newCollectionDescription: string
    makeEquippable: [string]
    babyBonus: number
    toddlerBonus: number
    adolescentBonus: number
    adultBonus: number
    minAmount: string
    seed: string
    default: OptionData
    options: OptionData[]
}

export async function remarkHandler(
    ctx: BatchContext<Store, unknown>,
    item: CallItem<'System.remark', { call: { args: true; origin: true } }>,
    header: SubstrateBlock
): Promise<void> {
    assert(item.name === 'System.remark')

    const message = new SystemRemarkCall(ctx, item.call).asV1020.remark.toString()
    if (!isProofOfChaosMessage(message)) return

    const originAccountId = getOriginAccountId(item.call.origin)

    if (originAccountId == null) return

    const args = message.split('::')
    switch (args[2]) {
        case 'LUCK':
            if (isValidAddress(originAccountId) && header.height < 14594438) {
                const distributionData = JSON.parse(args[3])
                const distributionVersion = await getDistributionVersion(ctx, parseInt(args[1]))
                for (const dist of distributionData) {
                    const count = await getDistributionCount(ctx, parseInt(args[1]), distributionVersion)
                    const distribution = new Distribution({
                        id: `${args[1]}-${distributionVersion}-${count.toString().padStart(8, '0')}`,
                        blockNumber: header.height,
                        distributionVersion,
                        referendumIndex: parseInt(args[1]),
                        wallet: dist[3],
                        amountConsidered: BigInt(dist[0]),
                        indexItemReceived: parseInt(dist[2]),
                        chanceAtItem: parseInt(dist[1]),
                        dragonEquipped: null,
                        timestamp: new Date(header.timestamp),
                    })
                    await ctx.store.insert(distribution)
                }
            }
            return
        case 'DISTRIBUTION':
            if (isValidAddress(originAccountId) && header.height >= 14594438) {
                const distributionData = JSON.parse(args[3])
                const distributionVersion = await getDistributionVersion(ctx, parseInt(args[1]))
                for (const dist of distributionData) {
                    const count = await getDistributionCount(ctx, parseInt(args[1]), distributionVersion)
                    const distribution = new Distribution({
                        id: `${args[1]}-${distributionVersion}-${count.toString().padStart(8, '0')}`,
                        blockNumber: header.height,
                        distributionVersion,
                        referendumIndex: parseInt(args[1]),
                        wallet: dist.wallet,
                        amountConsidered: BigInt(dist.amountConsidered),
                        indexItemReceived: parseInt(dist.selectedIndex),
                        chanceAtItem: parseInt(dist.chance),
                        dragonEquipped: dist.dragonEquipped,
                        timestamp: new Date(header.timestamp),
                    })
                    await ctx.store.insert(distribution)
                }
            }
            return
        case 'SETTINGS':
        case 'CONFIG':
            if (isValidAddress(originAccountId)) {
                //break quiz apart
                const configData: ConfigData = JSON.parse(args[3])
                const version = await getConfigVersion(ctx, parseInt(args[1]))
                const { min,
                    max,
                    first,
                    blockCutOff,
                    directOnly,
                    createNewCollection,
                    newCollectionSymbol,
                    newCollectionPath,
                    newCollectionFile,
                    newCollectionName,
                    newCollectionDescription,
                    makeEquippable,
                    babyBonus,
                    toddlerBonus,
                    adolescentBonus,
                    adultBonus,
                    minAmount,
                    seed } = configData

                const configId = `${args[1]}-${version.toString().padStart(8, '0')}`

                const config = new Config({
                    id: configId,
                    blockNumber: header.height,
                    referendumIndex: parseInt(args[1]),
                    version,
                    min,
                    max,
                    first,
                    blockCutOff,
                    directOnly,
                    createNewCollection,
                    newCollectionSymbol,
                    newCollectionPath,
                    newCollectionFile,
                    newCollectionName,
                    newCollectionDescription,
                    makeEquippable,
                    babyBonus,
                    toddlerBonus,
                    adolescentBonus,
                    adultBonus,
                    minAmount: parseInt(minAmount),
                    seed,
                    timestamp: new Date(header.timestamp),
                })
                await ctx.store.insert(config)
                const configDb = await ctx.store.get(Config, { where: { id: configId } })
                if (!configDb) {
                    ctx.log.warn(MissingConfigWarn(configId))
                    return
                }
                //save options
                const allOptions: OptionData[] = [...configData.options, configData.default]
                for (const opt of allOptions) {
                    const {
                        transferable,
                        symbol,
                        text,
                        artist,
                        creativeDirector,
                        rarity,
                        itemName,
                        royalty } = opt
                    const optionCount = await getOptionCount(ctx, configDb.id)
                    const optionId = `${configDb.id}-${optionCount.toString().padStart(8, '0')}`
                    const option = new Option({
                        id: optionId,
                        configId: configDb.id,
                        config: configDb,
                        transferable,
                        symbol,
                        text,
                        artist,
                        creativeDirector,
                        rarity,
                        itemName,
                        royaltyMin: royalty[0],
                        royaltyMax: royalty[1],
                        isDefault: opt === configData.default
                    })

                    await ctx.store.insert(option)

                    const optionDb = await ctx.store.get(Option, { where: { id: optionId } })

                    if (!optionDb) {
                        ctx.log.warn(MissingOptionWarn(optionId))
                        return
                    }

                    for (const res of opt.resources) {
                        const {
                            name,
                            main,
                            thumb,
                            text,
                            artist,
                            creativeDirector,
                            rarity,
                            itemName,
                            slot,
                            title } = res

                        const resourceCount = await getResourceCount(ctx, optionDb.id)

                        const resource = new Resource({
                            id: `${optionDb.id}-${resourceCount.toString().padStart(8, '0')}`,
                            optionId: optionDb.id,
                            option: optionDb,
                            name,
                            main,
                            thumb,
                            text,
                            artist,
                            creativeDirector,
                            rarity,
                            itemName,
                            slot,
                            title
                        })
                        await ctx.store.insert(resource)
                    }
                }
            }
            return
        case 'QUIZ':
            //check that quiz author is proposer
            //
            console.log("args", args)

            return
        case 'ANSWERS':
            //check that answer block is before ref end
            //isvalid field on answers
            return
        default:
            return
    }
}

function isProofOfChaosMessage(str: string) {
    return /^PROOFOFCHAOS::\d+::.*$/.test(str)
}

function isValidAddress(address: string) {
    return address === 'DhvRNnnsyykGpmaa9GMjK9H4DeeQojd5V5qCTWd1GoYwnTc'
}

const configVersions = new Map<number, number>()

async function getConfigVersion(ctx: BatchContext<Store, unknown>, referendumIndex: number) {
    let count = configVersions.get(referendumIndex)
    if (count == null) {
        count = await ctx.store.count(Config, {
            where: {
                referendumIndex,
            },
        })
    }
    configVersions.set(referendumIndex, count + 1)
    return count
}

const configOptions = new Map<string, number>()

async function getOptionCount(ctx: BatchContext<Store, unknown>, configId: string) {
    let count = configOptions.get(configId)
    if (count == null) {
        count = await ctx.store.count(Option, {
            where: {
                configId,
            },
        })
    }
    configOptions.set(configId, count + 1)
    return count
}

const optionResources = new Map<string, number>()

async function getResourceCount(ctx: BatchContext<Store, unknown>, optionId: string) {
    let count = optionResources.get(optionId)
    if (count == null) {
        count = await ctx.store.count(Resource, {
            where: {
                optionId,
            },
        })
    }
    optionResources.set(optionId, count + 1)
    return count
}

const distributionVersions = new Map<number, number>()

async function getDistributionVersion(ctx: BatchContext<Store, unknown>, referendumIndex: number) {
    let count = distributionVersions.get(referendumIndex)
    if (count == null) {
        count = await ctx.store.count(Distribution, {
            where: {
                referendumIndex,
            },
        })
    }
    distributionVersions.set(referendumIndex, count + 1)
    return count
}

const referendumDistributions = new Map<string, number>()

async function getDistributionCount(ctx: BatchContext<Store, unknown>, referendumIndex: number, distributionVersion: number) {
    let count = referendumDistributions.get(`${referendumIndex}-${distributionVersion}`)
    if (count == null) {
        count = await ctx.store.count(Distribution, {
            where: {
                referendumIndex,
                distributionVersion
            },
        })
    }
    optionResources.set(`${referendumIndex}-${distributionVersion}`, count + 1)
    return count
}

