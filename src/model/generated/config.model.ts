import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Option} from "./option.model"

@Entity_()
export class Config {
  constructor(props?: Partial<Config>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("int4", {nullable: false})
  referendumIndex!: number

  @Index_()
  @Column_("int4", {nullable: false})
  version!: number

  @Index_()
  @Column_("int4", {nullable: false})
  blockNumber!: number

  @Column_("text", {nullable: true})
  min!: string | undefined | null

  @Column_("text", {nullable: true})
  max!: string | undefined | null

  @Column_("text", {nullable: true})
  first!: string | undefined | null

  @Column_("text", {nullable: true})
  blockCutOff!: string | undefined | null

  @Column_("bool", {nullable: true})
  directOnly!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  createNewCollection!: boolean | undefined | null

  @Column_("text", {nullable: true})
  newCollectionSymbol!: string | undefined | null

  @Column_("text", {nullable: true})
  newCollectionPath!: string | undefined | null

  @Column_("text", {nullable: true})
  newCollectionFile!: string | undefined | null

  @Column_("text", {nullable: true})
  newCollectionName!: string | undefined | null

  @Column_("text", {nullable: true})
  newCollectionDescription!: string | undefined | null

  @Column_("text", {array: true, nullable: true})
  makeEquippable!: (string | undefined | null)[] | undefined | null

  @Column_("int4", {nullable: true})
  babyBonus!: number | undefined | null

  @Column_("int4", {nullable: true})
  toddlerBonus!: number | undefined | null

  @Column_("int4", {nullable: true})
  adolescentBonus!: number | undefined | null

  @Column_("int4", {nullable: true})
  adultBonus!: number | undefined | null

  @Column_("int4", {nullable: true})
  minAmount!: number | undefined | null

  @Column_("text", {nullable: true})
  seed!: string | undefined | null

  @OneToMany_(() => Option, e => e.config)
  options!: Option[]

  @Column_("timestamp with time zone", {nullable: true})
  timestamp!: Date | undefined | null
}
