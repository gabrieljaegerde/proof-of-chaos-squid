import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Option} from "./option.model"

@Entity_()
export class Resource {
  constructor(props?: Partial<Resource>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  optionId!: string

  @Index_()
  @ManyToOne_(() => Option, {nullable: true})
  option!: Option

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("text", {nullable: true})
  main!: string | undefined | null

  @Column_("text", {nullable: true})
  thumb!: string | undefined | null

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

  @Column_("text", {nullable: true})
  slot!: string | undefined | null

  @Column_("text", {nullable: true})
  title!: string | undefined | null
}
