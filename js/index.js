async function callLambda(options) {
    const url = 'https://fntikl9sah.execute-api.us-east-1.amazonaws.com/prod/{proxy}';
    const response = await fetch(url, {
        method: 'POST',
        body: {
            type: 'GET_TEAM_NAMES',
            options: options
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}

function populateTeamsSelect(names) {
    let selector = document.getElementById('team-select')
    names.records.sort((a, b) => a.fields.Name.localeCompare(b.fields.Name))
    for (let i = 0; i < names.records.length; i++) {
        let name = names.records[i].fields.Name
        let option = document.createElement('option')
        let optionText = document.createTextNode(name);
        option.appendChild(optionText)
        option.setAttribute('id', 'name-select-option'.concat(i.toString()))
        option.setAttribute('value', name)
        option.setAttribute('innerHTML', name)
        selector.appendChild(option)
    }
}

function clearAll() {
    console.log('clearing all')
    let label = document.getElementById('team-select-label')
    let selector = document.getElementById('team-select')
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
    }
    label.classList.add('hidden');
    selector.classList.add('hidden');
}

function showTeamSelect() {
    console.log('showing teams')
    let label = document.getElementById('team-select-label')
    let selector = document.getElementById('team-select')
    label.classList.remove('hidden');
    selector.classList.remove('hidden');
}

async function getTeamNames() {
    clearAll();
    let teamNames = await callLambda({});
    populateTeamsSelect(teamNames);
    showTeamSelect();
}

