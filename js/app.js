let token = null;

function deleteApi(endpoint, id) {
    // eslint-disable-next-line no-console
    console.log(`Delete on '${endpoint}'. ID: ${id}`);

    return fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => response);
}

function getApi(endpoint) {
    // eslint-disable-next-line no-console
    console.log(`Get on '${endpoint}'.`);

    return fetch(`${endpoint}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => response.json());
}

function postApi(endpoint, payload) {
    // eslint-disable-next-line no-console
    console.log(`Post on '${endpoint}'.`);

    return fetch(`${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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

    let displayerNumber = 0;

    for (let i = 0; i < 4; i += 1) {
        const tr = tbl.insertRow();
        for (let j = 0; j < 8; j += 1) {
            const td = tr.insertCell();

            if (disposition[i][j]) {
                displayerNumber += 1;
                // td.appendChild(document.createTextNode(`Displayer n° ${displayers_nbr}`));
                td.style.border = '1px solid black';

                const btn = document.createElement('input');
                btn.type = 'button';
                btn.className = 'btn';
                btn.value = `Displayer n° ${displayerNumber}`;
                btn.onclick = (function (displayerName) { return function () { kickUser(displayerName); }; }(displayerNumber));
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
    const server = document.getElementById('server').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const credentials = {
        username,
        password,
    };

    const endpoint = `${server}/login`;

    postApi(endpoint, credentials)
        .then((response) => {
            token = response.jwt;
            // eslint-disable-next-line no-console
            console.log('Logged in.');
        });
}

function kickUser(displayerId) {
    const server = document.getElementById('server').value;
    const endpoint = `${server}/sessions`;

    getApi(endpoint)
        .then((sessions) => {
            const session = sessions.find(element => JSON.parse(element.displayerId) === JSON.parse(displayerId));

            if (session != null) {
                deleteApi(endpoint, session.id);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

tableCreate();
