import mongoose, { InferSchemaType } from "mongoose";

const groupeSchema = new mongoose.Schema({
  offre_id: { type: mongoose.Schema.Types.ObjectId, ref: "Offre" },
  product_quantity: { type: Number, default: 0 },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  link: String,
  expired_at: { type: Date, required: true },
});

groupeSchema.pre("save", function (next, {}) {
  const date = Date.now();
  const date1 = new Date(this.expired_at).getTime();

  if (date >= date1) {
    throw new Error("Invalid expired date");
  } else {
    next();
  }
});

const Group = mongoose.model("Group", groupeSchema);
export type GroupType = InferSchemaType<typeof groupeSchema>;
export default Group;
