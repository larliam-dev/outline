import {
  Table,
  Column,
  BelongsTo,
  ForeignKey,
  DataType,
  AllowNull,
  Length,
} from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import IdModel from "./base/IdModel";
import Fix from "./decorators/Fix";
import Team from "./Team";
import User from "./User";

/**
 * Stores lightweight analytics events from the Social Methodology learning plugin.
 * Append-only — updatedAt is intentionally disabled.
 */
@Table({
  tableName: "plugin_methodology_events",
  modelName: "plugin_methodology_event",
  updatedAt: false,
})
@Fix
class PluginMethodologyEvent extends IdModel<
  InferAttributes<PluginMethodologyEvent>,
  Partial<InferCreationAttributes<PluginMethodologyEvent>>
> {
  /** Event name, e.g. "simulator.step", "case.submit", "quiz.submit". */
  @Length({ max: 255 })
  @Column(DataType.STRING)
  event: string;

  /** Arbitrary metadata associated with the event. */
  @AllowNull
  @Column(DataType.JSONB)
  data: Record<string, unknown> | null;

  @BelongsTo(() => Team, "teamId")
  team: Team;

  @ForeignKey(() => Team)
  @Column(DataType.UUID)
  teamId: string;

  @BelongsTo(() => User, "userId")
  user: User;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;
}

export default PluginMethodologyEvent;
