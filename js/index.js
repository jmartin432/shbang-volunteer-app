async function callLambda(type, options) {
    console.log('calling lambda', type, options)
    const url = 'https://fntikl9sah.execute-api.us-east-1.amazonaws.com/prod/{proxy+}';
    const fetchLambda = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            type: type,
            options: options
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let response = await fetchLambda.json()
    return response
}

async function refreshAll() {
    console.log('clearing all')
    clearTeamSelector()
    clearTeamInfo()
    clearSchedule()
    console.log('getting teams data')
    let teamResponse = await callLambda('GET_TEAMS_DATA',{});
    teams = teamResponse.records;
    console.log(teams)
    populateTeamSelector(teams);
    showTeamSelect();
}

function clearTeamSelector() {
    console.log('clearing team selector')
    let selector = document.getElementById('team-select')
    while (selector.children[1]) {
        selector.removeChild(selector.children[1]);
    }
    selector.classList.add('hidden');
    selector.value="";
}

function clearTeamInfo() {
    console.log('clearing team info')
    console.log('clearing buckstop list')
    let buckstopList = document.getElementById('buckstop-list')
    while (buckstopList.children[0]) {
        buckstopList.removeChild(buckstopList.children[0]);
    }
    buckstopList.classList.add('hidden');
    console.log('clearing name selector')
    let selector = document.getElementById('name-select')
    while (selector.children[1]) {
        selector.removeChild(selector.children[1]);
    }
    selector.classList.add('hidden');
    selector.value="";
}

function populateTeamSelector(teams) {
    console.log('populating team select')
    let selector = document.getElementById('team-select')
    for (let i = 0; i < teams.length; i++) {
        let team = teams[i].fields.Name
        let recordId = teams[i].id
        let option = document.createElement('option')
        let optionText = document.createTextNode(team);
        option.appendChild(optionText)
        option.setAttribute('id', 'team-select-option'.concat(recordId))
        option.setAttribute('value', team)
        option.setAttribute('innerHTML', team)
        selector.appendChild(option)
    }
}

function showTeamSelect() {
    console.log('showing teams')
    let selector = document.getElementById('team-select')
    selector.classList.remove('hidden');
}

async function refreshTeamInfo(team) {
    let options = {
        team: team
    }
    console.log('refreshing team info')
    console.log(team)
    clearTeamInfo();
    clearSchedule()
    console.log('getting buckstop info')
    let buckstopResponse = await callLambda('GET_BUCKSTOP_INFO', options);
    console.log(buckstopResponse)
    console.log('getting volunteer info')
    let volunteerResponse = await callLambda('GET_VOLUNTEER_INFO',options)
    console.log(volunteerResponse)
    populateBuckstopList(buckstopResponse.records);
    populateNameSelector(volunteerResponse.records);
    showBuckstopList();
    showNameSelect();
}

function populateBuckstopList(buckstops) {
    let buckstopList = document.getElementById('buckstop-list')
    for (let i = 0; i < buckstops.length; i++) {
        console.log(buckstops[i])
        let name = buckstops[i].fields.Name
        let preferredName = buckstops[i].fields['Preferred Name'];
        let pronouns = buckstops[i].fields['Pronouns'];
        let phoneNumber = buckstops[i].fields['Phone Number'];
        let listItem = document.createElement('li')
        listItem.appendChild(document.createTextNode(name));
        let subList = document.createElement('ul')
        listItem.appendChild(subList)
        let subListPrefName = document.createElement('li')
        subListPrefName.appendChild(document.createTextNode(preferredName));
        subList.appendChild(subListPrefName)
        let subListPronouns = document.createElement('li')
        subListPronouns.appendChild(document.createTextNode(pronouns));
        subList.appendChild(subListPronouns)
        let subListPhone = document.createElement('li')
        let subListPhoneLink = document.createElement('a')
        subListPhoneLink.textContent = phoneNumber;
        subListPhoneLink.setAttribute('href', "tel:".concat(phoneNumber));
        subListPhone.appendChild(subListPhoneLink);
        subList.appendChild(subListPhone)
        buckstopList.appendChild(listItem)
    }
}

function showBuckstopList() {
    console.log('showing buckstop list')
    let list = document.getElementById('buckstop-list')
    list.classList.remove('hidden');
}

function populateNameSelector(volunteers) {
    console.log('populating volunteer select')
    let selector = document.getElementById('name-select')
    for (let i = 0; i < volunteers.length; i++) {
        let name = volunteers[i].fields.Name
        let recordId = volunteers[i].id
        let option = document.createElement('option')
        let optionText = document.createTextNode(name);
        option.appendChild(optionText)
        option.setAttribute('id', 'name-select-option'.concat(i.toString()))
        option.setAttribute('value', name)
        option.setAttribute('data-id', recordId)
        option.setAttribute('innerHTML', name)
        selector.appendChild(option)
    }
}

function showNameSelect() {
    console.log('showing names')
    let selector = document.getElementById('name-select')
    selector.classList.remove('hidden');
}

async function refreshSchedule(name) {
    console.log(name)
    let options = {
        name: name
    }
    clearSchedule()
    let scheduleResponse = await callLambda('GET_VOLUNTEER_SCHEDULE', options)
    populateSchedule(scheduleResponse.records)
    showSchedule()
}

function clearSchedule() {
    console.log('clearing schedule')
    let scheduleList = document.getElementById('schedule-list')
    while (scheduleList.children[0]) {
        scheduleList.removeChild(scheduleList.children[0]);
    }
    scheduleList.classList.add('hidden');
}

function populateSchedule(schedule) {
    console.log('populating schedule')
    console.log(schedule)
    let scheduleList = document.getElementById('schedule-list')
    for (let i = 0; i < schedule.length; i++) {
        console.log(schedule[i])
        let shift = schedule[i].fields.Shift
        let time = schedule[i].fields.Time;
        let listItem = document.createElement('li')
        listItem.appendChild(document.createTextNode(shift));
        let subList = document.createElement('ul')
        listItem.appendChild(subList)
        let subListTime = document.createElement('li')
        subListTime.appendChild(document.createTextNode(time));
        subList.appendChild(subListTime)
        scheduleList.appendChild(listItem)
    }
}

function showSchedule() {
    console.log('showing schedule')
    let schedule = document.getElementById('schedule-list')
    schedule.classList.remove('hidden');
}






//
//
//
// function showNameSelect() {
//     console.log('showing names')
//     let selector = document.getElementById('name-select')
//     selector.classList.remove('hidden');
// }
//


