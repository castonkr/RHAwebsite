var displayingAllMembers = true;
var table = document.createElement('table');
var members;
table.setAttribute('class', 'clickable');

function setAdmin(officers) {
    if (userIsOfficer(officers)) {
        var div = document.getElementById('buttonsDiv');
        var newButton = document.createElement('button');
        newButton.setAttribute('id', 'submitAttendance');
        newButton.className = "membersListButtons";
        newButton.setAttribute('data-toggle', 'modal');
        newButton.setAttribute('data-target', '#uploadModal');
        newButton.innerHTML = 'New Attendance Record';

        var resetAttendance = document.createElement('button');
        resetAttendance.setAttribute('id', 'resetAttendance');
        resetAttendance.setAttribute("data-toggle", "modal");
        resetAttendance.setAttribute("data-target", "#resetConfirmationModal");
        resetAttendance.className = "membersListButtons";
        resetAttendance.innerHTML = 'Reset Attendance';
        var confirmReset = document.getElementById("confirm-reset");
        confirmReset.addEventListener('click', function () {
            var xhr = xhrGetRequest('resetAttendance');
            xhr.onload = function () {
                location.reload();
            };
            xhr.send();
        });

        var purgeMembers = document.createElement("button");
        purgeMembers.setAttribute("id", "purgeMembers");
        purgeMembers.setAttribute("data-toggle", "modal");
        purgeMembers.setAttribute("data-target", "#purgeConfirmationModal");
        purgeMembers.innerHTML = "Purge Members Table";
        purgeMembers.className = "membersListButtons";
        var confirmPurge = document.getElementById("confirm-purge");
        confirmPurge.addEventListener("click", function () {
            var xhr = xhrGetRequest('purgeMembers/');
            xhr.onload = function () {
                location.reload();
            };
            xhr.send();
        });

        var uploadMembers = document.createElement("button");
        uploadMembers.setAttribute("id", "uploadMembers");
        uploadMembers.setAttribute("data-toggle", "modal");
        uploadMembers.setAttribute("data-target", "#membersModal");
        uploadMembers.innerHTML = "Upload New Members";
        uploadMembers.className = "membersListButtons";

        div.appendChild(newButton);
        div.appendChild(resetAttendance);
        div.appendChild(purgeMembers);
        div.appendChild(uploadMembers);

        setupSubmitAttendanceButton();
        var cancelBtn = document.getElementById('update-modal-cancel');
        cancelBtn.addEventListener('click', function () {
            document.getElementById("csvFile").value = '';
        });
    }
    return;
}

function setup() {
    var urlExtension = 'members/';
    var xhr = xhrGetRequest(urlExtension);
    //setTimeout(function () { createHTMLFromResponseText(xhr.responseText) }, 300);

    xhr.onload = function () {
        members = xhr.responseText;
        drawAllMembersTable(members);
        var allMembersButton = document.getElementById('allMembers');
        var buttonsDiv = document.getElementById('buttonsDiv');
    }
    xhr.send();

    massMemberUpload();
}

function drawAllMembersTable(members) {
    members = JSON.parse(members);
    var body = document.getElementsByTagName('body')[0];
    table.innerHTML = "";
    table.setAttribute('border', 1);
    table.setAttribute('align', 'center');
    table.setAttribute('bordercolor', '#808080');
    table.setAttribute('id', 'membersTable');

    var tbdy = document.createElement('tbody');
    var tdName = document.createElement('td');
    tdName.setAttribute('align', 'middle');
    tdName.setAttribute('width', 200);
    tdName.innerHTML = "Name";

    var tdHall = document.createElement('td');
    tdHall.setAttribute('align', 'middle');
    tdHall.setAttribute('width', 200);
    tdHall.innerHTML = "Hall";

    var tdAttendance = document.createElement('td');
    tdAttendance.setAttribute('align', 'middle');
    tdAttendance.setAttribute('width', 200);
    tdAttendance.innerHTML = "Fall Attendance";

    var tdAttendance0 = document.createElement('td');
    tdAttendance0.setAttribute('align', 'middle');
    tdAttendance0.setAttribute('width', 200);
    tdAttendance0.innerHTML = "Winter Attendance";

    var tdAttendance1 = document.createElement('td');
    tdAttendance1.setAttribute('align', 'middle');
    tdAttendance1.setAttribute('width', 200);
    tdAttendance1.innerHTML = "Spring Attendance";

    tbdy.appendChild(tdName);
    tbdy.appendChild(tdHall);
    tbdy.appendChild(tdAttendance);
    tbdy.appendChild(tdAttendance0);
    tbdy.appendChild(tdAttendance1);
    var countForColoring = 0;
    for (var i = 0; i < members.length; i++) {
        if (members[i].hall == null || members[i].hall == "") {
        } else {
            tr = document.createElement('tr');
            tr.setAttribute('member', i);
            tr.setAttribute('data-toggle', 'modal');
            tr.setAttribute('data-target', '#myModal');
            doClosure(members, i);
            if (countForColoring % 2 == 0) {
                tr.setAttribute('bgcolor', '#f0f0f0');
            }
            countForColoring++;

            var td = document.createElement('td');
            if (members[i].firstname == null || members[i].lastname == null) {
                td.innerHTML = members[i].username;
            } else {
                td.innerHTML = members[i].firstname + " " + members[i].lastname;
            }
            var td2 = document.createElement('td');
            td2.innerHTML = members[i].hall;

            var td3 = document.createElement('td');
            td3.innerHTML = members[i].meet_attend.Q1;

            var td4 = document.createElement('td');
            td4.innerHTML = members[i].meet_attend.Q2;

            var td5 = document.createElement('td');
            td5.innerHTML = members[i].meet_attend.Q3;
            tr.appendChild(td);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tbdy.appendChild(tr);
        }
    }
    table.appendChild(tbdy);
    body.appendChild(table);

}

function doClosure(members, i) {
    tr.addEventListener("click", function () { setUpModal(members, i) });
}

function setUpModal(members, pos) {
    document.getElementById("member-modal-name").innerHTML = members[pos].firstname + " " + members[pos].lastname;
    if (members[pos].membertype) {
        document.getElementById("member-modal-membertype").innerHTML = members[pos].membertype;
    } else {
        document.getElementById("member-modal-membertype").innerHTML = "General";
    }
    document.getElementById("member-modal-username").innerHTML = members[pos].username;
    if (members[pos].phone_number) {
        document.getElementById("member-modal-phone_number").innerHTML = members[pos].phone_number;
    } else {
        document.getElementById("member-modal-phone_number").innerHTML = "N/A";
    }
    document.getElementById("member-modal-hall").innerHTML = members[pos].hall;
    if (members[pos].room_number) {
        document.getElementById("member-modal-room_number").innerHTML = members[pos].room_number;
    } else {
        document.getElementById("member-modal-room_number").innerHTML = "N/A";
    }
    if (members[pos].cm) {
        document.getElementById("member-modal-cm").innerHTML = members[pos].cm;
    } else {
        document.getElementById("member-modal-cm").innerHTML = "N/A";
    }
    document.getElementById("member-modal-active").innerHTML = members[pos].active;

}

function drawActiveMembersTable(members) {
    members = JSON.parse(members);
    table.innerHTML = "";
    var body = document.getElementsByTagName('body')[0];
    table.setAttribute('border', 1);
    table.setAttribute('align', 'center');
    table.setAttribute('bordercolor', '#808080');
    table.setAttribute('id', 'membersTable');

    var tbdy = document.createElement('tbody');
    var tdName = document.createElement('td');
    tdName.setAttribute('align', 'middle');
    tdName.setAttribute('width', 200);
    tdName.innerHTML = "Name";

    var tdHall = document.createElement('td');
    tdHall.setAttribute('align', 'middle');
    tdHall.setAttribute('width', 200);
    tdHall.innerHTML = "Hall";

    var tdAttendance = document.createElement('td');
    tdAttendance.setAttribute('align', 'middle');
    tdAttendance.setAttribute('width', 200);
    tdAttendance.innerHTML = "Fall Attendance";

    var tdAttendance0 = document.createElement('td');
    tdAttendance0.setAttribute('align', 'middle');
    tdAttendance0.setAttribute('width', 200);
    tdAttendance0.innerHTML = "Winter Attendance";

    var tdAttendance1 = document.createElement('td');
    tdAttendance1.setAttribute('align', 'middle');
    tdAttendance1.setAttribute('width', 200);
    tdAttendance1.innerHTML = "Spring Attendance";

    tbdy.appendChild(tdName);
    tbdy.appendChild(tdHall);
    tbdy.appendChild(tdAttendance);
    tbdy.appendChild(tdAttendance0);
    tbdy.appendChild(tdAttendance1);

    var countForColoring = 0;
    for (var i = 0; i < members.length; i++) {
        if (members[i].hall == null || members[i].hall == "") {
        } else {
            var meetingsAttended = 0;
            for (var j = 0; j < members[i].meet_attend.Q1.length; j++) {
                if (members[i].meet_attend.Q1[j] == 1) {
                    meetingsAttended++;
                }
            }
            for (var j = 0; j < members[i].meet_attend.Q2.length; j++) {
                if (members[i].meet_attend.Q2[j] == 1) {
                    meetingsAttended++;
                }
            }
            for (var j = 0; j < members[i].meet_attend.Q3.length; j++) {
                if (members[i].meet_attend.Q3[j] == 1) {
                    meetingsAttended++;
                }
            }
            if (meetingsAttended > 4) {
                tr = document.createElement('tr');
                tr.setAttribute('member', i);
                tr.setAttribute('data-toggle', 'modal');
                tr.setAttribute('data-target', '#myModal');
                doClosure(members, i);
                if (countForColoring % 2 == 0) {
                    tr.setAttribute('bgcolor', '#f0f0f0');
                }
                countForColoring++;

                var td = document.createElement('td');
                if (members[i].firstname == null || members[i].lastname == null) {
                    td.innerHTML = members[i].username;
                } else {
                    td.innerHTML = members[i].firstname + " " + members[i].lastname;
                }

                var td2 = document.createElement('td');
                td2.innerHTML = members[i].hall;

                var td3 = document.createElement('td');
                td3.innerHTML = members[i].meet_attend.Q1;

                var td4 = document.createElement('td');
                td4.innerHTML = members[i].meet_attend.Q2;

                var td5 = document.createElement('td');
                td5.innerHTML = members[i].meet_attend.Q3;
                tr.appendChild(td);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tbdy.appendChild(tr);
            }
        }

    }
    table.appendChild(tbdy);
    body.appendChild(table);
}

function getExtension(filename) {
    var split = filename.split('.');
    return split[split.length - 1];
}

function isProperCSVFormat(filename) {
    var extension = getExtension(filename);
    console.log(extension);
    switch (extension.toLowerCase()) {
        case 'txt':
            return true;
        case 'csv':
            return true;
    }
    return false;
}

function massMemberUpload() {

    var massMembersSubmit = document.getElementById("members-modal-submit");
    massMembersSubmit.addEventListener("click", function () {
        var file = document.getElementById("csvFileMembers").files;
        console.log(file[0].name);
        if (!isProperCSVFormat(file[0].name)) {
            alert("This file is not of the proper file type. Please upload either a CSV or text file.");
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var preResult = reader.result.split("\r\n");
            var result = [];
            preResult.forEach(e => {
                if(e != '') {
                    var split = e.split(',');
                    var data = {};
                    data.username = split[0];
                    data.hall = split[1];
                    console.log(data);
                    result.push(data);
                }
            });

            var urlExtension = 'members';
            var xhr = xhrPostRequest(urlExtension);

            xhr.onload = function () {
                // xhrGetRequest('populateFloorMoney').send();
                location.reload();
            }
            console.log(result);
            xhr.send(JSON.stringify({membersToAdd: result}));
            return xhr;
        };
        reader.readAsText(file[0]);
    });


}

function setupSubmitAttendanceButton() {
    var addCommitteeBtn = document.getElementById("submitAttendance");
    addCommitteeBtn.addEventListener('click', function () {

        var submitBtn = document.getElementById('update-modal-submit');
        var submitAttendanceSubmit = function (e) {

            var quarterToUpdate = 'Q1';
            if (document.getElementById('Quarter1').checked) {

            } else if (document.getElementById('Quarter2').checked) {
                quarterToUpdate = 'Q2';
            } else {
                quarterToUpdate = 'Q3';
            }

            var files = document.getElementById("csvFile").files;
            if (!isProperCSVFormat(files[0].name)) {
                alert("This file is not of the proper file type. Please upload either a CSV or text file.");
                return;
            }
            var reader = new FileReader();

            var readerOnload = function (e) {
                var preResult = reader.result.split("\r\n");
                var result = [];
                preResult.forEach(e => {
                    if (e != '') {
                        result.push(e);
                    }
                });
                result = result.sort();
                var urlExtension = 'attendance/' + quarterToUpdate;
                var xhr = xhrPutRequest(urlExtension);

                xhr.onload = function() {
                    var updateMoneyXhr = xhrGetRequest('updateFloorMoney');
                    updateMoneyXhr.onload = function() {
                        location.reload();
                    }
                    updateMoneyXhr.send();
                };
                xhr.send(JSON.stringify({ membersToUpdate: result }));
                clearSubmitHandlers(submitBtn);
                reader = new FileReader();
                reader.onload = readerOnload;
                return xhr;
            }
            reader.onload = readerOnload;

            reader.readAsText(files[0]);

            document.getElementById("csvFile").value = '';
        }
        submitBtn.addEventListener('click', submitAttendanceSubmit);
        var addCommitteeCancel = function () {
            clearSubmitHandlers(submitBtn);
            cancelBtn.removeEventListener('click', addCommitteeCancel);
        }
        var cancelBtn = document.getElementById('update-modal-cancel');
        cancelBtn.addEventListener('click', function () {
        });
    });
}

function displayOtherTable() {
    if (displayingAllMembers) {
        drawActiveMembersTable(members);
        displayingAllMembers = false;
    } else {
        drawAllMembersTable(members);
        displayingAllMembers = true;
    }
}

$(document).ready(function () {
    setup();
    var officersxhr = getOfficers();
    officersxhr.onload = () => { setAdmin(officersxhr.responseText) }
    officersxhr.send();
});