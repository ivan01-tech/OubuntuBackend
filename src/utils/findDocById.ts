import { Document, Model, Types } from 'mongoose';

export async function findDocumentById<T extends Document>(model: Model<T>, id: string): Promise<T | false> {
  try {
    const document = await model.findById(id);
    return document || false;
  } catch (err) {
    console.error(`Error finding document by ID in model ${model.modelName}:`, err);
    throw err;
  }
}
