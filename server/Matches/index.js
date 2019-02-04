import matches from "../models/matches";

/**
 * Matches Class
 */
class Matches {
    /**
     * Get All Matches
     *
     * @return {Array}
     */
    static async getAll() {

        const people = await matches.find();

        if(Array.isArray(people)) {
            people.map((person) => {
                person.contacts = person.contacts_exchanged !== 0;
                person.compatibility_perc = person.compatibility_score * 100;
                person.picture = person.main_photo || '/assets/img/empty-photo.jpg';
            });
        }

        return people;
    }

}

export { Matches };
