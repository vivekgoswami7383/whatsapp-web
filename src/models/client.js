import mongoose from "mongoose";

const { Schema } = mongoose;

const clientSchema = new Schema({
  client_id: String,
  client_data: {},
});

export default mongoose.model("Client", clientSchema);
