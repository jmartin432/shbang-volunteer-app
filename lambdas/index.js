'use strict';
const https = require('https');

exports.handler = async (event) => {

    console.log("Received Event: " + JSON.stringify(event));

    if (event.httpMethod == "OPTIONS"){
        console.log("Handling pre-flight request")
        let responseCode = 200
        let response = {
            statusCode: responseCode,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type', //maybe
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        console.log("Sending Response: " + JSON.stringify(response))
        return response;
    };

    let requestBody = JSON.parse(event.body)
    console.log("Request body: ", requestBody)
    const airtableApiKey = process.env.AIRTABLE_API_KEY

    const airtable = {
	    url: 'https://api.airtable.com/v0',
	    baseId: 'appx0UiKgCZd18OWE',
	    fieldsQuery: 'fields%5B%5D',
	    tables: {
		    teams: {
			    id: 'tbllpwtERgeuyHLGx',
			    fields: {
			    	name: 'fld5YS2UV1fg2UVbd',
			    	buckstops: 'fld7axRkyP34WJbi8'
			    }
		    },
		    volunteers: {},
		    schedule: {}
	    }
    }

    let options = {
        host: 'api.airtable.com',
        method: 'GET',
        path: '',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(airtableApiKey)
        }
    }

    async function getTeamNames(options) {
        const fetchTeamNames = await fetch(
            options.path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let response = await fetchTeamNames.json()
        return response
    }

    if (requestBody.type == 'GET_TEAM_NAMES') {
        options.path = '/v0'.concat('/', airtable.baseId, '/', airtable.tables.teams.id,
                '?', airtable.fieldsQuery, '=', airtable.tables.teams.fields.name)

        const airtableResponse = await getTeamNames(options);
    }

    if (requestBody.type == 'GET_TEAM_INFO'){
        let teamRecordId = requestBody.options.team;
        options.path = '/v0'.concat('/', airtable.baseId, '/', airtable.tables.teams.id,
                '/', teamRecordId)
    }

    if (requestBody.type == 'GET_VOLUNTEER_SCHEDULE'){
        let teamName = requestBody.options.team.replace(/ /g, '%20');
        options.path = '/v0'.concat('/', airtable.baseId, '/', airtable.tables.teams.id,
                '/', 'recAfG8wsuVaFkWBn')
    }


    // function getAirtable(options) {
    //     console.log('Calling Airtable: ', JSON.stringify(options))
    //     return new Promise((resolve, reject) => {
    //         const req = https.request(options, (res) => {
    //             res.setEncoding("utf8");
    //             let responseBody = "";

    //             res.on("data", (chunk) => {
    //                 responseBody += chunk;
    //             });

    //             res.on("end", () => {
    //                 console.log('Airtable Response:', responseBody);
    //                 resolve(responseBody);
    //             });
    //         });

    //         req.on("error", (err) => {
    //             reject(err);
    //         });
    //         req.end();
    //     });
    // }



    let responseCode = 200;

    let response = {
        statusCode: responseCode,
        headers: {
            'Access-Control-Allow-Headers': 'Content-Type', //maybe
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: airtableResponse
    };

    console.log("Sending Response: " + JSON.stringify(response))
    return response;
};