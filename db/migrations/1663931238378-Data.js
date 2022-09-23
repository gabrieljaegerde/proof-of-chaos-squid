module.exports = class Data1663931238378 {
  name = 'Data1663931238378'

  async up(db) {
    await db.query(`CREATE TABLE "resource" ("id" character varying NOT NULL, "option_id" character varying NOT NULL, "name" text, "main" text, "thumb" text, "text" text, "artist" text, "creative_director" text, "rarity" text, "item_name" text, "slot" text, "title" text, CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_82accf385fc70361a7e371787c" ON "resource" ("option_id") `)
    await db.query(`CREATE TABLE "option" ("id" character varying NOT NULL, "setting_id" character varying NOT NULL, "symbol" text, "text" text, "artist" text, "creative_director" text, "rarity" text, "item_name" text, "royalty_min" integer, "royalty_max" integer, CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_dfd17dc0398ca0cfc114f5cd30" ON "option" ("setting_id") `)
    await db.query(`CREATE TABLE "setting" ("id" character varying NOT NULL, "referendum_index" integer NOT NULL, "block_number" integer NOT NULL, "min" text, "max" text, "first" text, "block_cut_off" text, "direct_only" boolean, "create_new_collection" boolean, "new_collection_symbol" text, "new_collection_path" text, "new_collection_file" text, "new_collection_name" text, "new_collection_description" text, "make_equippable" text array, "baby_bonus" integer, "toddler_bonus" integer, "adolescent_bonus" integer, "adult_bonus" integer, "min_amount" integer, "seed" text, "timestamp" TIMESTAMP WITH TIME ZONE, "default_option_id" character varying, CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_d7f975441f076672adfb3dcf85" ON "setting" ("referendum_index") `)
    await db.query(`CREATE INDEX "IDX_e0632ddb3ae4d3a3ae97c0c53d" ON "setting" ("block_number") `)
    await db.query(`CREATE INDEX "IDX_5fc06dcbbfe331cfa5abdf5220" ON "setting" ("default_option_id") `)
    await db.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_82accf385fc70361a7e371787ca" FOREIGN KEY ("option_id") REFERENCES "option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "option" ADD CONSTRAINT "FK_dfd17dc0398ca0cfc114f5cd307" FOREIGN KEY ("setting_id") REFERENCES "setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "setting" ADD CONSTRAINT "FK_5fc06dcbbfe331cfa5abdf52200" FOREIGN KEY ("default_option_id") REFERENCES "option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "resource"`)
    await db.query(`DROP INDEX "public"."IDX_82accf385fc70361a7e371787c"`)
    await db.query(`DROP TABLE "option"`)
    await db.query(`DROP INDEX "public"."IDX_dfd17dc0398ca0cfc114f5cd30"`)
    await db.query(`DROP TABLE "setting"`)
    await db.query(`DROP INDEX "public"."IDX_d7f975441f076672adfb3dcf85"`)
    await db.query(`DROP INDEX "public"."IDX_e0632ddb3ae4d3a3ae97c0c53d"`)
    await db.query(`DROP INDEX "public"."IDX_5fc06dcbbfe331cfa5abdf5220"`)
    await db.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_82accf385fc70361a7e371787ca"`)
    await db.query(`ALTER TABLE "option" DROP CONSTRAINT "FK_dfd17dc0398ca0cfc114f5cd307"`)
    await db.query(`ALTER TABLE "setting" DROP CONSTRAINT "FK_5fc06dcbbfe331cfa5abdf52200"`)
  }
}
