import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Setting} from "./setting.model"
import {Resource} from "./resource.model"

@Entity_()
export class Option {
  constructor(props?: Partial<Option>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  settingId!: string

  @Index_()
  @ManyToOne_(() => Setting, {nullable: true})
  setting!: Setting

  @Column_("text", {nullable: true})
  symbol!: string | undefined | null

  @Column_("text", {nullable: true})
  text!: string | undefined | null

  @Column_("text", {nullable: true})
  artist!: string | undefined | null

  @Column_("text", {nullable: true})
  creativeDirector!: string | undefined | null

  @Column_("text", {nullable: true})
  rarity!: string | undefined | null

  @Column_("text", {nullable: true})
  itemName!: string | undefined | null

  @Column_("int4", {nullable: true})
  royaltyMin!: number | undefined | null

  @Column_("int4", {nullable: true})
  royaltyMax!: number | undefined | null

  @OneToMany_(() => Resource, e => e.option)
  resources!: Resource[]
}
