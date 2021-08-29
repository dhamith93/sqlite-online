const fs = require('fs')
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const crypto = require('crypto');
const util = require('util');
const unlink = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

exports.handleRequest = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let status = 'success'
    let msg = '';
    try {
        let op = req.body.op;
        let result = null;

        if (op === 'init') {
            result = await createDB();
        } else if (op === 'delete') {
            await unlink(`./files/${req.body.dbname}`);
            return;
        } else if (op === 'sqlExec') {
            result = await execCommand(req.body);
        } else {
            result = {status: 'failure', msg: `unknown op: ${op}`};
        }

        return res.end(JSON.stringify(result));
    } catch (err) {
        console.log(err);
        status = 'failure';
        msg = err;
    }
    res.end(JSON.stringify({ 
        status: status, 
        msg: msg 
    }));
}

let createDB = async() => {
    let unix = Math.round(+new Date()/1000);
    let name = `d_${unix}_${randomValueHex(5)}.db`;
    let status = 'success';
    let msg = '';
    await writeFile(`./files/${name}`, '', (err) => {
        if (err) {
            status = 'failure';
            msg = err;
        }
    });
    return { status: status, msg: msg, db: name };
}

let execCommand = async(body) => {
    let dbname = body.db;
    if (dbname) {
        let status = 'sucess';
        let msg = '';
        let command = body.command;

        let db = await open({
            filename: `./files/${dbname}`,
            driver: sqlite3.Database
        });
        
        let commandType = command.split(' ')[0].toUpperCase();
        if (commandType === 'SELECT') {
            let data = {};
            try {
                let result = await db.all(command);
                console.log(result);
                let headers = [];
                let rows = []

                result.forEach(row => {
                    let tempHeaders = [];
                    let tempData = [];
                    for (let property in row) {
                        if (!row.hasOwnProperty(property)) {
                            continue;
                        }
                        tempHeaders.push(property);
                        tempData.push(row[property]);
                    }

                    if (headers.length === 0) {
                        headers = tempHeaders;
                    }
                    rows.push(tempData);
                });

                data = {
                    headers: headers,
                    rows: rows
                }
            } catch (err) {
                status = 'failure';
                msg = err.message;
            } finally {
                return {status: status, msg: msg, data: data};
            }
        } else {
            try {
                let result = await db.run(command);
                msg = `${result.changes} row(s) affected`;
            } catch (err) {
                status = 'failure';
                msg = err.message;
            } finally {
                return {status: status, msg: msg};
            }
        }
    }
}

let randomValueHex = (len) => {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex')
        .slice(0,len).toUpperCase();
}