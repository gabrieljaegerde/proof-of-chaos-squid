import { lookupArchive } from '@subsquid/archive-registry'
import { BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { remarkHandler } from './mapping'

const processor = new SubstrateBatchProcessor()
    .setBatchSize(500)
    .setDataSource({
        archive: lookupArchive('kusama', { release: 'FireSquid' }),
    })
    .addCall('System.remark', {
        data: {
            call: {
                origin: true,
                args: true,
            },
        },
        range: {
            from: 14375300
            // 14594430
        }
    } as const)

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), async (ctx) => {
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.name == 'System.remark') {
                await remarkHandler(ctx, item, block.header)
            }
        }
    }
})
