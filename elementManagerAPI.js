// Generate a JWT token for the user
const jwt = require('jsonwebtoken');
const axios = require('axios');
const https = require('https');
const crypto = require('crypto');
require('dotenv').config();

const createJWT = (user) => {
    
    const payload = {
        sub: user.name,
        iss: "emPublicApi",
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        jti: "pipeline-1663095796970",
        aud: "/authToken"
    };

    const jwtSecret = process.env.tst1PrivateKey;

    const token = jwt.sign(payload, jwtSecret, { algorithm: 'RS256' });
    return token;
}

const getToken = (jwtToken, interface, site) => {
    const interfaceUrl = interface;
    const endpoint = site + '/AgentWeb/api/elementmanager/authentication/authToken';

    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: endpoint,
            headers: {
                'Authorization': 'Bearer ' + jwtToken,
                'interfaceUrl': interfaceUrl,
                'Content-Type': 'application/json'
            },
            /**
             * Handle this problem with Node 18 and allow self signed certs
             * write EPROTO B8150000:error:0A000152:SSL routines:final_renegotiate:unsafe legacy renegotiation disabled
             * see https://stackoverflow.com/questions/74324019/allow-legacy-renegotiation-for-nodejs/74600467#74600467
             **/
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
                secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
            }),
        })
        .then(response => {
            resolve(response.data.token);
        })
        .catch(error => {
            console.error(error);
            reject(error);
        });
    });
}

const createExportPackage = (token, elements, interface, site) => {
    const endpoint = site + '/AgentWeb/api/elementmanager/export/EMPackages';
    const interfaceUrl = interface;
    const exportPackage = constructPayload(elements);
    console.log (elements);
    
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: endpoint,
            headers: {
                'Authorization': 'Bearer ' + token,
                'interfaceUrl': interfaceUrl,
                'Content-Type': 'application/json'
            },
            /**
             * Handle this problem with Node 18 and allow self signed certs
             * write EPROTO B8150000:error:0A000152:SSL routines:final_renegotiate:unsafe legacy renegotiation disabled
             * see https://stackoverflow.com/questions/74324019/allow-legacy-renegotiation-for-nodejs/74600467#74600467
             **/
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
                secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
            }),
            data: exportPackage
        })
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            //console.error(error);
            reject(error);
        });
    });
}

const constructPayload = (elements) => {
    console.log (elements);
    const payload = {
        "name": "Test Element Manager Export",
        "desc": "Export Code Attempt",
            "items": [
              {

              }
            ]   
    };

    return payload;
}

module.exports = { createJWT, getToken, createExportPackage };

