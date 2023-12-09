import mongoose from "mongoose";


interface ConnectionOptions{
    mongoUrl:string;
    dbName:string;
}

export class MongoDatabase {

       static async connect(optios: ConnectionOptions) {

        const { mongoUrl, dbName } = optios;

        try {

            await mongoose.connect(mongoUrl, {
                dbName
            });

            console.log('Mongo connected');
            
            
        } catch (error) {
            console.log('Mongo connection error');
            
            throw error
        }


    }


}