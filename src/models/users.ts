import { Schema, model } from 'mongoose';
import env from '@app/env';

// Create an enum representing the role of a user.
export enum Role {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  User = 'User',
}

// Create an type representing a document in MongoDB.
export interface User {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  permissions: string[];
}

// Create user schema corresponding to the document type.
const userSchema = new Schema<User>({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  role: {
    type: String,
    enum: Role,
    default: Role.User,
  },
  permissions: {
    type: [String],
    default: ['CanAccessDashboard'],
  },
});

// Create user model.
const User = model<User>(`${env.database.dbTablePrefix}User`, userSchema);

export default User;
