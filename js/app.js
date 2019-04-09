/* eslint-disable no-restricted-syntax */
let jwt = null;

const apiAddress = 'http://192.168.99.100:8080';
const sessionsEndpoint = '/sessions';
const loginEndpoint = '/login';

function deleteApi(endpoint, id) {
    return fetch(`${apiAddress}${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
        },
    })
        .then(response => response);
}

function post(endpoint, content) {
    return fetch(`${apiAddress}${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
    })
        .then(response => response.json());
}

function get(endpoint) {
    return fetch(`${apiAddress}${endpoint}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
        },
    })
        .then(response => response.json());
}

function tableCreate() {
    const disposition = [
        [true, false, true, false, true, true, true, true],
        [false, false, true, true, false, false, true, true],
        [false, false, false, false, true, true, false, true],
        [false, false, false, false, false, false, true, false],
    ];

    const { body } = document;
    const tbl = document.createElement('table');
    tbl.style.width = '100px';
    tbl.style.border = '1px solid black';

    let displayersNbr = 0;

    for (let i = 0; i < 4; i++) {
        const tr = tbl.insertRow();
        for (let j = 0; j < 8; j++) {
            const td = tr.insertCell();

            if (disposition[i][j]) {
                displayersNbr++;
                // td.appendChild(document.createTextNode(`Displayer n° ${displayers_nbr}`));
                td.style.border = '1px solid black';

                const btn = document.createElement('input');
                btn.type = 'button';
                btn.className = 'btn';
                btn.value = `Displayer n° ${displayersNbr}`;
                btn.onclick = (function (displayerName) { return function () { kickUser(displayerName); }; }(displayersNbr));
                td.appendChild(btn);
            } else {
                td.appendChild(document.createTextNode('Displayer n°'));
                td.style.border = '1px solid black';
                td.style.backgroundColor = 'blue';
                td.style.color = 'blue';
            }
        }
    }
    body.appendChild(tbl);
}

// eslint-disable-next-line no-unused-vars
function login() {
    // eslint-disable-next-line no-undef
    const x = document.getElementById('uname').value;
    // eslint-disable-next-line no-undef
    const y = document.getElementById('psw').value;
    console.log(`login ${x} ${y}`);
    const credentials = {
        username: x,
        password: y,
    };

    post(loginEndpoint, credentials)
        .then((response) => {
            jwt = response.jwt;
        });
}

function kickUser(displayerId) {
    get(sessionsEndpoint)
        .then((sessions) => {
            console.log(sessions);

            sessions.forEach((session) => {
                console.log('session.displayerId', session.displayerId);
                console.log('displayerId', displayerId);
                if (JSON.parse(session.displayerId) === JSON.parse(displayerId)) {
                    console.log('coucou');
                    deleteApi(sessionsEndpoint, session.id)
                    .catch(err => {
                        console.log('err', err);
                    })
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

tableCreate();
