import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearch = async (searchTerm, movie) => {
  //1 - use appwrite SDK to see if the searchTerm is exists in database
  console.log(searchTerm);
  try {
    const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);
    console.log(response.documents.length);
    //2 - if it does , update the count
    if (response.documents.length > 0) {
      const document = response.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, document.$id, {
        count: document.count + 1,
      });
    }
    //3 - if it does not, create a new document with the searchList and count as 1
    else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: searchTerm,
        count: 1,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "No-Poster.png",
        movie_id: movie.id,
      });
    }
  } catch (err) {
    console.log("Appwrite error:", err);
  }
};

export const getTrendingMovies = async () => {
  try {
    const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return response.documents;
  } catch (err) {
    console.log(err);
  }
};
