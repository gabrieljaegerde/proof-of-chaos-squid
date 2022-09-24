module.exports = class Data1664053305018 {
  name = 'Data1664053305018'

  async up(db) {
    await db.query(`CREATE TABLE "resource" ("id" character varying NOT NULL, "option_id" character varying NOT NULL, "name" text, "main" text, "thumb" text, "text" text, "artist" text, "creative_director" text, "rarity" text, "item_name" text, "slot" text, "title" text, CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_82accf385fc70361a7e371787c" ON "resource" ("option_id") `)
    await db.query(`CREATE TABLE "option" ("id" character varying NOT NULL, "config_id" character varying NOT NULL, "transferable" integer, "symbol" text, "text" text, "artist" text, "creative_director" text, "rarity" text, "item_name" text, "royalty_min" integer, "royalty_max" integer, "is_default" boolean, CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_4c401fcc64b86d1319d14146c4" ON "option" ("config_id") `)
    await db.query(`CREATE TABLE "config" ("id" character varying NOT NULL, "referendum_index" integer NOT NULL, "version" integer NOT NULL, "block_number" integer NOT NULL, "min" text, "max" text, "first" text, "block_cut_off" text, "direct_only" boolean, "create_new_collection" boolean, "new_collection_symbol" text, "new_collection_path" text, "new_collection_file" text, "new_collection_name" text, "new_collection_description" text, "make_equippable" text array, "baby_bonus" integer, "toddler_bonus" integer, "adolescent_bonus" integer, "adult_bonus" integer, "min_amount" integer, "seed" text, "timestamp" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d0ee79a681413d50b0a4f98cf7b" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_31105a6eb5f2c0bf1459feb1b5" ON "config" ("referendum_index") `)
    await db.query(`CREATE INDEX "IDX_ec8cda12936640e2ea7f8292f3" ON "config" ("version") `)
    await db.query(`CREATE INDEX "IDX_54893775557eea05e62c003751" ON "config" ("block_number") `)
    await db.query(`CREATE TABLE "distribution" ("id" character varying NOT NULL, "referendum_index" integer NOT NULL, "block_number" integer NOT NULL, "distribution_version" integer NOT NULL, "wallet" text, "amount_considered" numeric NOT NULL, "index_item_received" integer, "dragon_equipped" text, "chance_at_item" integer, "timestamp" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_187eaf203ccf9018df51b40108c" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_05b5bd1b3ccd5f04425bc675c2" ON "distribution" ("block_number") `)
    await db.query(`CREATE INDEX "IDX_ab637c52f3ddadde29b107808a" ON "distribution" ("wallet") `)
    await db.query(`CREATE INDEX "IDX_32755722a63564b39398df8afb" ON "distribution" ("amount_considered") `)
    await db.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_82accf385fc70361a7e371787ca" FOREIGN KEY ("option_id") REFERENCES "option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "option" ADD CONSTRAINT "FK_4c401fcc64b86d1319d14146c43" FOREIGN KEY ("config_id") REFERENCES "config"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "resource"`)
    await db.query(`DROP INDEX "public"."IDX_82accf385fc70361a7e371787c"`)
    await db.query(`DROP TABLE "option"`)
    await db.query(`DROP INDEX "public"."IDX_4c401fcc64b86d1319d14146c4"`)
    await db.query(`DROP TABLE "config"`)
    await db.query(`DROP INDEX "public"."IDX_31105a6eb5f2c0bf1459feb1b5"`)
    await db.query(`DROP INDEX "public"."IDX_ec8cda12936640e2ea7f8292f3"`)
    await db.query(`DROP INDEX "public"."IDX_54893775557eea05e62c003751"`)
    await db.query(`DROP TABLE "distribution"`)
    await db.query(`DROP INDEX "public"."IDX_05b5bd1b3ccd5f04425bc675c2"`)
    await db.query(`DROP INDEX "public"."IDX_ab637c52f3ddadde29b107808a"`)
    await db.query(`DROP INDEX "public"."IDX_32755722a63564b39398df8afb"`)
    await db.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_82accf385fc70361a7e371787ca"`)
    await db.query(`ALTER TABLE "option" DROP CONSTRAINT "FK_4c401fcc64b86d1319d14146c43"`)
  }
}
