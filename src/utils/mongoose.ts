import mongoose from 'mongoose';

export const isValidId = (id: string) => mongoose.isValidObjectId(id);
