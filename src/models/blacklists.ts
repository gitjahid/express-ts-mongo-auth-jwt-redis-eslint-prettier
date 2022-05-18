import { Schema, model } from 'mongoose';
import env from '@app/env';

// Create an type representing a document in MongoDB.
export interface Blacklists {
  email: string;
}

// Create user schema corresponding to the document type.
const blacklistSchema = new Schema<Blacklists>({
  email: {
    type: String,
    required: true,
  },
});

// Create user model.
const Blacklists = model<Blacklists>(`${env.database.dbTablePrefix}Blacklists`, blacklistSchema);

export default Blacklists;
