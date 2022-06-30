async function callLambda() {
    const url = 'https://fntikl9sah.execute-api.us-east-1.amazonaws.com/prod/{proxy}';
    const response = await fetch(url, {
        method: 'POST',
        body: {
            type: "GET_TEAM_NAMES"
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const myJson = await response.json();
    console.log(myJson)
}

async function getTeamNames() {
    await callLambda()
}