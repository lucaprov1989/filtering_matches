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
    static async getMatches(filters=null) {
        let query;

        if(filters) {
            query = this.buildQuery(filters);
        }

        const people = await matches.find(query);

        if(Array.isArray(people)) {
            people.map((person) => {
                person.contacts = person.contacts_exchanged !== 0;
                person.compatibility_perc = person.compatibility_score * 100;
                person.picture = person.main_photo
                    ? `http://thecatapi.com/api/images/get?format=src&type=gif&size=med&${person._id}` : '/assets/img/empty-photo.jpg';
                person.distance = parseInt(this.distance(process.env.LAT, process.env.LONG, person.city.lat, person.city.lon));
            });
        }

        if(filters && filters.distance !== 'All') {
            return people.filter((x)=>{
                if(filters.distance === 'lt_30') {
                    return x.distance < 30;
                }
                return x.distance > 300;
            })
        }
        return people;
    }

    /**
     * Build Query
     *
     * @return {Object}
     */
    static buildQuery(filters) {
        const filtersArr = this.buildFilters(filters);
        let query = {};
        filtersArr.forEach((filter) => {
            switch (filter.type) {
                case 'eq':
                    query[filter.field] = filter.value;
                    break;
                case 'exists':
                    query[filter.field] = {"$exists": filter.value};
                    break;
                case 'gt':
                    query[filter.field] = {"$gt": 0};
                    break;
                case 'range':
                    query[filter.field] = {"$lte": filter.value.maxValue, "$gte": filter.value.minValue};
                    break;
                default:
                    return query;
            }
        });
        return query;
    }

    /**
     * Build Filters
     *
     * @return {Array}
     */
    static buildFilters(filters) {

        let outArr = [];
        Object.keys(filters).forEach((key)=>{

            switch(key) {
                case 'main_photo':
                    outArr.push({type: 'exists', value: filters[key] === 'yes' || false, field: key});
                    break;
                case 'contacts_exchanged':
                    outArr.push({type: 'gt', field: key});
                    break;
                case 'favourite':
                    outArr.push({type: 'eq', value: filters[key] === 'yes' || false, field: key});
                    break;
                case 'compatibility_score':
                    console.log(typeof filters[key].min);
                    outArr.push({type: 'range', value: {minValue: parseFloat(filters[key].min)/100, maxValue: parseFloat(filters[key].max)/100}, field: key});
                    break;
                case 'age':
                    outArr.push({type: 'range', value: {minValue: parseFloat(filters[key].min), maxValue: parseFloat(filters[key].max)}, field: key});
                    break;
                case 'height_in_cm':
                    outArr.push({type: 'range', value: {minValue: parseFloat(filters[key].min), maxValue: parseFloat(filters[key].max)}, field: key});
                    break;
                default:
                    return outArr;
            }

        });

        return outArr;


    }

    static distance(lat1, lon1, lat2, lon2) {
        const p = 0.017453292519943295;    // Math.PI / 180
        const c = Math.cos;
        const a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }

}

export { Matches };
