
const proposal_attrs = [
    "proposer",
    "proposal_name",
    "week_proposed",
    "quarter_proposed",
    "money_requested",
    "approved",
    "money_allocated",
    "paid",
    "proposed_date",
    "event_date",
    "event_signup_open",
    "event_signup_close",
    "cost_to_attendee",
    "image_path",
    "description",
    "attendees"
]

var body = document.getElementsByTagName('body')[0];
var tables = new Array();

var last_proposal_clicked = -1;

function displayProposals() {
    var xhr = getEvents();
    xhr.onload = function () {
//        createHTMLFromResponseText(xhr.responseText)
//    }
//
//    function createHTMLFromResponseText(proposal) {
        var proposal = JSON.parse(xhr.responseText);
        var startingYear = 2015;
        var proposalsForCurrentYear = new Array();
        for (var i = proposal.length - 1; i >= 0; i--) {
            var proposedDate = new Date(proposal[i].proposed_date);
            if (proposedDate.getFullYear() == (startingYear + 1) && proposedDate.getMonth() > 6) {
                var paragraph = startingYear.toString();
                paragraph = document.createElement('p');
                paragraph.innerText = startingYear + "-" + (startingYear + 1);
                paragraph.setAttribute('class', 'yearTextListProposals');
                body.appendChild(paragraph);
                drawTable(proposalsForCurrentYear.reverse());
                proposalsForCurrentYear = new Array();
                startingYear++;
            }
            proposalsForCurrentYear.push(proposal[i]);
        }
        var paragraph = startingYear.toString();
        paragraph = document.createElement('p');
        paragraph.innerText = startingYear + "-" + (startingYear + 1);
        paragraph.setAttribute('class', 'yearTextListProposals');
        body.appendChild(paragraph);
        drawTable(proposalsForCurrentYear.reverse());
    }
    xhr.send();
}

function createColumnHead(name) {
    var newTd = document.createElement('td');
    newTd.setAttribute('align', 'middle');
    newTd.setAttribute('width', 200);
    newTd.innerHTML = name;
    return newTd;
}

function createTableRow(index, proposal) {
    var tr = document.createElement('tr');
    tr.setAttribute('proposal', index);
    tr.setAttribute('data-toggle', 'modal');
    tr.setAttribute('data-target', '#proposalModal');
    //doClosure(members, index);
    if (index % 2 == 0) {
        tr.setAttribute('bgcolor', '#f0f0f0');
    }
    for (attr in proposal) {
        tr.dataset[attr] = proposal[attr];
    }

    return tr
}

function drawTable(proposals) {
    var table = document.createElement('table');
    table.innerHTML = "";
    table.setAttribute('border', 1);
    table.setAttribute('align', 'center');
    table.setAttribute('bordercolor', '#808080');
    table.setAttribute('class', 'proposalsTable');
    var tbdy = document.createElement('tbody');

    tbdy.appendChild(createColumnHead("Name"));
    tbdy.appendChild(createColumnHead("Amount Requested"));
    tbdy.appendChild(createColumnHead("Amout Budgeted"));
    tbdy.appendChild(createColumnHead("Reserve"));
    tbdy.appendChild(createColumnHead("Used"));
    tbdy.appendChild(createColumnHead("Paid"));
    tbdy.appendChild(createColumnHead("Event Date"));
    tbdy.appendChild(createColumnHead("Proposed Date"));
    tbdy.appendChild(createColumnHead("Proposed Quarter"));
    tbdy.appendChild(createColumnHead("Proposed Week"));

    for (var i = proposals.length - 1; i >= 0; i--) {
        var tr = createTableRow(i, proposals[i]);
        var id = proposals[i].proposal_id
        addModalPopulateListener(tr, proposals[i]);

        var tdname = document.createElement('td');
        tdname.innerHTML = proposals[i].proposal_name;
        tdname.setAttribute("id", "proposal_name" + id);

        var tddate = document.createElement('td');
        var eventDate = new Date(proposals[i].event_date);
        eventDate = (eventDate.getMonth() + 1) + "/" + eventDate.getUTCDate() + "/" + eventDate.getFullYear();
        tddate.innerHTML = eventDate;
        tddate.setAttribute("id", "event_date" + id);

        tdweek = document.createElement('td');
        tdweek.innerHTML = proposals[i].week_proposed;
        tdweek.setAttribute("id", "week_proposed" + id);

        var tdProposedDate = document.createElement('td');
        var proposedEventDate = new Date(proposals[i].proposed_date);
        proposedEventDate = (proposedEventDate.getMonth() + 1) + "/" + proposedEventDate.getUTCDate() + "/" + proposedEventDate.getFullYear();
        tdProposedDate.innerHTML = proposedEventDate;
        tdProposedDate.setAttribute("id", "proposed_date" + id);

        var tdquarter = document.createElement('td');
        tdquarter.innerHTML = proposals[i].quarter_proposed;
        tdquarter.setAttribute("id", "quarter_proposed" + id);

        var tdrequested = document.createElement('td');
        tdrequested.innerHTML = proposals[i].money_requested;
        tdrequested.setAttribute("id", "money_requested" + id);

        var tdallocated = document.createElement('td');
        tdallocated.innerHTML = proposals[i].money_allocated;
        tdallocated.setAttribute("id", "money_allocated" + id);

        var tdpaid = document.createElement('td');
        tdpaid.innerHTML = proposals[i].paid;
        tdpaid.setAttribute("id", "paid" + id);

        var tdreserve = document.createElement('td');
        var tdused = document.createElement('td');

        doClosure(proposals, i, tdused, tdreserve);
        tr.appendChild(tdname);
        tr.appendChild(tdrequested);
        tr.appendChild(tdallocated);
        tr.appendChild(tdreserve);
        tr.appendChild(tdused);
        tr.appendChild(tdpaid);
        tr.appendChild(tddate);
        tr.appendChild(tdquarter);
        tr.appendChild(tdweek);
        tr.appendChild(tdProposedDate);
        tbdy.appendChild(tr);
    }
    table.appendChild(tbdy);
    body.appendChild(table);
}

function addModalPopulateListener(tr, proposal) {
    var id = proposal.proposal_id;
    tr.addEventListener('click', function() {
        last_proposal_clicked = id;
        var entry;
//        var fields = [
//            "proposal_name",
//            "money_requested",
//            "money_allocated",
//            "proposed_date",
//            "event_date",
//            "description"
//        ]
        var entry = document.getElementById('proposalModal-money_allocated');
        entry.value = parseFloat(proposal.money_allocated);

        entry = document.getElementById('proposalModal-money_requested');
        entry.value = parseFloat(proposal.money_requested);

        entry = document.getElementById('proposalModal-proposal_name');
        entry.value = proposal.proposal_name;

        entry = document.getElementById('proposalModal-proposed_date');
        console.log(proposal.proposed_date)
        entry.value = proposal.proposed_date;

        entry = document.getElementById('proposalModal-event_date');
        entry.value = proposal.event_date;

        entry = document.getElementById('proposalModal-description');
        entry.value = proposal.description;
    });
}

function doClosure(proposal, i, tdused, tdreserve) {
    var urlExtensionUsed = 'getMoneyUsed';
    var xhrUsed = createXhrRequestJSON('POST', urlExtensionUsed);
    xhrUsed.onload = function () { setValues(xhrUsed.responseText, tdused, tdreserve, proposal, i) };
    xhrUsed.send(JSON.stringify({ proposal_id: proposal[i].proposal_id }));
}

function setValues(used, tdused, tdreserve, proposal, i) {
    used = JSON.parse(used);
    tdused.innerHTML = used[0].get_money_used;
    tdreserve.innerHTML = proposal[i].money_allocated - used[0].get_money_used;
}

function getEvents() {
    var url = BASE_API_URL + 'allEvents/';
    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }
        return xhr;
    }
    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        throw new Error('CORS not supported');
    }

    xhr.onload = function () {
        var responseText = xhr.responseText;
    }

    xhr.onerror = function () {
        console.log("There was an error");
    }
    return xhr;
}

function setupModalButtons() {
    var submitBtn = document.getElementById("proposalModal-submit");
    submitBtn.addEventListener('click', function() {
        var id = last_proposal_clicked;
//        var nameEntry = document.getElementById('proposalModal-proposal_name');
//        var cost = document.getElementById('proposalModal-cost_to_attendee');
//        var desc = document.getElementById('proposalModal-description');
//        var eventDate = document.getElementById('proposalModal-event_date');
//        var signupOpen = document.getElementById('proposalModal-event_signup_open');
//        var signupClose = document.getElementById('proposalModal-event_signup_close');

        var fields = [
            "proposal_name",
            "money_requested",
            "money_allocated",
            "proposed_date",
            "event_date",
            "description"
        ]

        var json_data = {}
        fields.forEach(function(attr) {
            var entry = document.getElementById('proposalModal-' + attr);
            console.log('proposalModal-' + attr);
            json_data[attr] = entry.value;
        });

        var apiUri = 'events/' + id;
        var xhr = xhrPutRequest(apiUri);
        xhr.onload = function() {
            alert("success!");
        }
//        alert('send:\n' + JSON.stringify(json_data) + '\nto: ' + id);
        xhr.send(JSON.stringify(json_data));
    });

    var deleteBtn = document.getElementById("deleteConfirmModal-delete");
    deleteBtn.addEventListener('click', function() {
        alert("delete " + last_proposal_clicked);
    });
}


$(document).ready(function () {
    displayProposals();
    setupModalButtons();
});