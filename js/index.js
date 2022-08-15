async function callLambda(type, options) {
    console.log('calling lambda')
    const url = 'https://fntikl9sah.execute-api.us-east-1.amazonaws.com/prod/{proxy}';
    const response = await fetch(url, {
        method: 'POST',
        body: {
            type: type,
            options: options
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}

function populateTeamsSelect(teams) {
    console.log('populating team select')
    let selector = document.getElementById('team-select')
    teams.records.sort((a, b) => a.fields.Name.localeCompare(b.fields.Name))
    for (let i = 0; i < teams.records.length; i++) {
        let team = teams.records[i].fields.Name
        let option = document.createElement('option')
        let optionText = document.createTextNode(team);
        option.appendChild(optionText)
        option.setAttribute('id', 'name-select-option'.concat(i.toString()))
        option.setAttribute('value', team)
        option.setAttribute('innerHTML', team)
        selector.appendChild(option)
    }
}

function clearTeams() {
    console.log('clearing all')
    let selector = document.getElementById('team-select')
    while (selector.children[1]) {
        selector.removeChild(selector.children[1]);
    }
    selector.classList.add('hidden');
    selector.value="";
}

function showTeamSelect() {
    console.log('showing teams')
    let selector = document.getElementById('team-select')
    selector.classList.remove('hidden');
}

async function getTeamNames() {
    clearTeams();
    clearVolNames();
    let teamNames = await callLambda('GET_TEAM_NAMES',{});
    populateTeamsSelect(teamNames);
    showTeamSelect();
}

function clearVolNames() {
    console.log('clearing vol names')
    let selector = document.getElementById('name-select')
    while (selector.children[1]) {
        selector.removeChild(selector.children[1]);
    }
    selector.classList.add('hidden');
    selector.value="";
}

function populateNamesSelect(names) {
    console.log('populating name select')
    let selector = document.getElementById('name-select')
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

function showNameSelect() {
    console.log('showing names')
    let selector = document.getElementById('name-select')
    selector.classList.remove('hidden');
}

async function getVolNames(team) {
    console.log('getting vol names')
    clearVolNames();
    let volNames = await callLambda('GET_VOL_NAMES',{team: team});
    populateNamesSelect(volNames);
    showNameSelect();
}

