document.addEventListener('DOMContentLoaded', function() {
    const editing = document.getElementById('editing');
    const execBtn = document.getElementById('exec-btn');
    const initBtn = document.getElementById('init-btn');
    const resultTable = document.getElementById('result-table');
    const historyTable = document.getElementById('history-table');
    const dbNameLabel = document.getElementById('db-name');
    const remainingMinsSpan = document.getElementById('remaining-mins');
    const modals = document.querySelectorAll('.modal');
    const instances = M.Modal.init(modals);

    let dbname = '';
    let remainingMins = 59;

    initBtn.addEventListener('click', e => {
        if (!dbname) {
            axios.post('/', {
                op: 'init'
            }).then((response) => {
                dbname = response.data.db;
                dbNameLabel.innerHTML = `Database ${dbname} created.<br> It will be deleted in `; 
                remainingMinsSpan.innerHTML = `${remainingMins} mins`;
            }, (error) => {
                console.log(error);
            });
        }
    });

    execBtn.addEventListener('click', e => {
        if (editing.value.length > 0 && editing.value.length < 500) {
            if (dbname) {
                axios.post('/', {
                    op: 'sqlExec',
                    db: dbname,
                    command: editing.value
                }).then((response) => {
                    let data = (response.data.data) ? response.data.data : {
                        headers: ['Message'],
                        rows: [[response.data.msg]]
                    };
                    populateTable(data, response.data.msg);
                }, (error) => {
                    console.log(error);
                });
            }
    
            let row = historyTable.insertRow(1); // -1 is insert as last
            let cell = row.insertCell(-1); // -1 is insert as last
            cell.innerHTML = editing.value;
        } else {
            alert('Command should be between 1 to 500 characters');
        }

    });

    let clearTable = async() => {
        while (resultTable.firstChild) {
            resultTable.removeChild(resultTable.lastChild);
        }
    }

    let populateTable = (data, msg) => {
        try {
            clearTable().then(() => {
                let headers = data.headers;
                let rows = data.rows;
                if (Object.keys(data).length === 0 || headers.length === 0) {
                    headers = ['Message'];
                    let m = (msg.length > 0) ? msg : 'No data...';
                    rows = [[m]];
                }
                resultTable.createTHead();
                let tr = document.createElement('tr');
                headers.forEach(element => {
                    th = document.createElement('th');
                    th.innerHTML = element;
                    tr.appendChild(th);
                });
                resultTable.tHead.appendChild(tr);
                rows.forEach(columns => {
                    let row = resultTable.insertRow(-1); // -1 is insert as last
                    columns.forEach(column => {
                        var cell = row.insertCell(-1); // -1 is insert as last
                        cell.innerHTML = column;
                    });
                });
            });
        } catch (err) {
            console.log(err);
        }
    }

    setInterval(() => {
        if (dbname) {
            remainingMins = remainingMins - 1;
            remainingMinsSpan.innerHTML = `${remainingMins} mins`;

            if (remainingMins === 0) {
                dbname = '';
                remainingMins = 59;
                dbNameLabel.innerHTML = 'DB deleted due to timeout. Click init again to start over';
                remainingMinsSpan.innerHTML = '';
            }
        }
    }, 60000);

    window.addEventListener("beforeunload", function (e) {
        if (dbname) {
            e.preventDefault();
            e.returnValue = '';
            let confirmationMessage = 'Are you sure? DB will be deleted once the page is closed';
            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
        }
    });
});