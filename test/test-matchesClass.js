const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
import { Matches } from '../server/Matches';
require('dotenv').config({path: '.env'});
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

export const mockedFilters =  {
    main_photo: 'yes',
    contacts_exchanged: 'yes',
    favourite: 'yes',
    height_in_cm: { min: '135', max: '210' },
    age: { min: '18', max: '95' },
    compatibility_score: { min: '34', max: '99' },
    distance: '30000'
};

const mockedQueryNoFilter = [{
    "$geoNear": {
        "near": {
            "type": "Point",
            "coordinates": [ Number(process.env.LAT ), Number(process.env.LONG ) ]
        },
        "distanceField": "distance",
        "spherical": true,
    }
}];

const mockedQueryFilter = [
    {
        "$geoNear":{
            "near":{
                "type":"Point",
                "coordinates":[
                    Number(process.env.LAT ),
                    Number(process.env.LONG )
                ]
            },
            "distanceField":"distance",
            "spherical":true,
            "maxDistance":30000
        }
    },
    {
        "$match":{
            "main_photo":{
                "$exists":true
            },
            "contacts_exchanged":{
                "$gt":0
            },
            "favourite":true,
            "height_in_cm":{
                "$lte":210,
                "$gte":135
            },
            "age":{
                "$lte":95,
                "$gte":18
            },
            "compatibility_score":{
                "$lte":0.99,
                "$gte":0.34
            }
        }
    }
];

const checkFieldInArr = (arr, expected) => {
    return arr.some(function(arrVal) {
        return expected === arrVal.field;
    });
};

const checkValuesTypeInArr = (arr, expected, type) => {
    return arr.some(function(arrVal) {
        if(arrVal.type === expected ) {
            return typeof arrVal.value === type;
        }
        return true;

    });
};

const checkKeysInArr = (arr, expected) => {
    return arr.some(function(arrVal) {
        if(arrVal.hasOwnProperty(expected))
            return arrVal.hasOwnProperty(expected);
        return false;
    });
};

describe('MatchesClass Build Filter', () => {
    const filtersBuilt = Matches.buildFilters(mockedFilters);
    it('it should return an array',  () => {
        assert.equal(Array.isArray(filtersBuilt), true);
    });

    it('if no filters must throw error',  async () => {
        await expect(function() { Matches.buildFilters(); }).to.throw('Filters not provided!');
    });

    it('output must be an object',  () => {
        assert.equal(typeof filtersBuilt, 'object');
    });

    it('output must always contain height_in_cm',  () => {
        assert.equal(checkFieldInArr(filtersBuilt, 'height_in_cm'), true);
    });

    it('output must always contain compatibility_score',  () => {
        assert.equal(checkFieldInArr(filtersBuilt, 'compatibility_score'), true);
    });

    it('output must always contain age',  () => {
        assert.equal(checkFieldInArr(filtersBuilt, 'age'), true);
    });

    it('output must always contain distance',  () => {
        assert.equal(checkFieldInArr(filtersBuilt, 'distance'), true);
    });

    it('values of output type range and distance must be numbers ',  () => {
        assert.equal(checkValuesTypeInArr(filtersBuilt, 'range', 'number'), true);
    });

    it('values of output type exist must be boolean ',  () => {
        assert.equal(checkValuesTypeInArr(filtersBuilt, 'exists', 'boolean'), true);
    });

    it('field of output type gt must be contacts_exchanged ',  () => {
        assert.equal(checkValuesTypeInArr(filtersBuilt, 'gt', 'contacts_exchanged'), true);
    });




});

describe('MatchesClass Build Query', () => {
    const queryBuilt = Matches.buildQuery(mockedFilters);
    const queryBuiltNoFilters = Matches.buildQuery();

    it('if no filters it should be equal to the mocked query',  () => {
        expect(mockedQueryNoFilter).to.deep.equal(queryBuiltNoFilters);
    });

    it('the query built with filters should be an array',  () => {
        assert.equal(Array.isArray(queryBuilt), true);
    });

    it('the query built should have 2 keys $geoNear and $match',  () => {
        assert.equal(checkKeysInArr(queryBuilt, '$geoNear'), true);
        assert.equal(checkKeysInArr(queryBuilt, '$match'), true);
    });

    it('the query build should be equal to the query mocked ',  () => {
        expect(queryBuilt).to.deep.equal(mockedQueryFilter);
    });


});

/*describe('MatchesClass getMatches', () => {
    it('all matches should be 25', async () => {
        const allMatches = await Matches.getMatches();
        assert.equal(25, allMatches.length);
    })

});*/
