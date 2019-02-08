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
    static async getMatches(filters = null) {
        const query = this.buildQuery(filters);
        return matches.aggregate([query]);
    }

    /**
     * Build Query
     *
     * @return {Object}
     */
    static buildQuery(filters = null) {

        if(!filters) {
            return [{
                "$geoNear": {
                    "near": {
                        "type": "Point",
                        "coordinates": [ Number(process.env.LAT ), Number(process.env.LONG ) ]
                    },
                    "distanceField": "distance",
                    "spherical": true,
                }
            }];
        }

        const filtersArr = this.buildFilters(filters);

        let query = {};
        query['match'] = {};
        query['geoNear'] = {};

        filtersArr.forEach((filter) => {
            switch (filter.type) {
                case 'eq':
                    query['match'][filter.field] = filter.value;
                    break;
                case 'exists':
                    query['match'][filter.field] = {"$exists": filter.value};
                    break;
                case 'gt':
                    query['match'][filter.field] = {"$gt": 0};
                    break;
                case 'range':
                    query['match'][filter.field] = {"$lte": filter.value.maxValue, "$gte": filter.value.minValue};
                    break;
                case 'distance':
                    query['geoNear'] = {
                        "near": {
                            "type": "Point",
                            "coordinates": [ Number(process.env.LAT ), Number(process.env.LONG ) ]
                        },
                        "distanceField": "distance",
                        "spherical": true,
                    };
                    query['geoNear'][filter.value.cond] = filter.value.amount;
                    break;
                default:
                    return query;
            }
        });

        return [{"$geoNear": query['geoNear']}, {"$match": query['match'] }];
    }

    /**
     * Build Filters
     *
     * @return {Array}
     */
    static buildFilters(filters) {
        if(!filters) {
            throw new Error('Filters not provided!');
        }

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
                    outArr.push({type: 'range', value: {minValue: parseFloat(filters[key].min)/100, maxValue: parseFloat(filters[key].max)/100}, field: key});
                    break;
                case 'age':
                    outArr.push({type: 'range', value: {minValue: parseInt(filters[key].min), maxValue: parseInt(filters[key].max)}, field: key});
                    break;
                case 'height_in_cm':
                    outArr.push({type: 'range', value: {minValue: parseInt(filters[key].min), maxValue: parseInt(filters[key].max)}, field: key});
                    break;
                case 'distance':
                    const distanceCond = filters[key] === '30000' ? 'maxDistance' : 'minDistance';
                    outArr.push({type: 'distance', value: {cond: distanceCond, amount: parseInt(filters[key]) }, field: key});
                    break;
                default:
                    return outArr;
            }

        });

        return outArr;

    }
}

export { Matches };
