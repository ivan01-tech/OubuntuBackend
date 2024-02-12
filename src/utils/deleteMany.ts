import { Model } from 'mongoose';

// Fonction pour supprimer tous les éléments de la collection
export const deleteAllDocuments = async (YourModel: Model<any>) => {
  try {
    // Utilisez deleteMany pour supprimer tous les documents
    const result = await YourModel.deleteMany({});
    console.log(`Nombre de documents supprimés : ${result.deletedCount}`);
  } catch (error) {
    console.error('Erreur lors de la suppression des documents :', error);
  }
};

// Appelez la fonction pour supprimer tous les documents
