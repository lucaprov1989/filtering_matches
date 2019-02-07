import mongoose from 'mongoose';

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

let match = new Schema({
    _id: ObjectId,
    display_name: String,
    age: Number,
    job_title: String,
    height_in_cm: Number,
    city: {
        name: String,
        lat: Number,
        lon: Number,
    },
    main_photo: String,
    compatibility_score: Number,
    contacts_exchanged: Number,
    favourite: Boolean,
    religion: String,


},{ collection: 'matches'});

export default mongoose.model('matches', match);
