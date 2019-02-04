import mongoose from "mongoose";

/**
 * MongoDB Class.
 */
class MongoDB {

    /**
     * Connect to MongoDB
     */
    static async connect() {
        mongoose.connect(process.env.MONGODB_URI);

        mongoose.Promise = global.Promise;

        const connection = mongoose.connection;

        connection.once('open', () => {
            console.log('MongoDB database connection established successfully!');
        });
    }
}

export default MongoDB;
