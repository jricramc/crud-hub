import axios from 'axios';
import getConfig from 'next/config';
const _CONFIG = getConfig();

console.log('_CONFIG:: ', _CONFIG);
console.log('process.env.NEXT_PUBLIC_LEDGER_API_KEY!!! ', process.env.NEXT_PUBLIC_LEDGER_API_KEY);
console.log('process.env :::: ', process.env);

import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const _webhub_db_url = 'https://7lgnkvykt8.execute-api.us-east-2.amazonaws.com'; // publicRuntimeConfig.WEBHUB_DB_URL;

const API72_COLORS = [
    { name: "indigo", color: "#6366F1" },
    { name: "blue", color: "#3B82F6" },
    { name: "purple", color: "#8B5CF6" },
    { name: "teal", color: "#14B8A6" },
    { name: "cyan", color: "#06b6d4" },
    { name: "green", color: "#10b981" },
    { name: "orange", color: "#f59e0b" },
    { name: "pink", color: "#d946ef" },
];

const api72_colors = API72_COLORS.map(({ name }) => name);

const randomUsernameGenerator = () => uniqueNamesGenerator({
    dictionaries: [adjectives, api72_colors, animals],
    separator: '-',
}); // big-red-donkey


// @ts-ignore
const createLedgerEntry = async (baseUrl = '', { ledger_access_id, data }) => {
    const url = `${baseUrl}/api/ledger/create`;
  
    try {
      const response = await axios.post(url, {
        ledger_access_id,
        data,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'ledger-api-key': process.env.NEXT_PUBLIC_LEDGER_API_KEY,
        },
      });
  
      // Axios response.data contains the parsed response body
      // Axios automatically parses JSON responses
      return Promise.resolve(response.data);
    } catch (error) {
      // Axios errors are available in the 'response' property of the error object
      // @ts-ignore
      if (error.response) {
        // @ts-ignore
        console.error('Error response from server:', error.response.data);
        // @ts-ignore
        return Promise.reject(`Error ${error.response.status} received from server`);
        // @ts-ignore
      } else if (error.request) {
        // @ts-ignore
        console.error('No response received from server:', error.request);
        return Promise.reject('No response received from server');
      } else {
        // @ts-ignore
        console.error('Error setting up request:', error.message);
        return Promise.reject('Error setting up request');
      }
    }
  };

// @ts-ignore
const readLedgerEntry = async (baseUrl = '', { api_id, ledger_access_id }) => {
    const url = `${baseUrl}/api/ledger/read`;

    const api_id_query = api_id ? [{ "data.api_id": api_id }] : [];
    const ledger_access_id_query = ledger_access_id ? [{ "ledger_access_id": ledger_access_id }] : [];
    const query = { $or: [ ...api_id_query, ...ledger_access_id_query ] };

    console.log('_CONFIG :: ', _CONFIG);

    console.log('process.env :: ', process.env);
    console.log('process.env.NEXT_PUBLIC_LEDGER_API_KEY: ', process.env.NEXT_PUBLIC_LEDGER_API_KEY);

    const res = await axios.post(url, {
        query,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'ledger-api-key': process.env.NEXT_PUBLIC_LEDGER_API_KEY,
        },
      });
    if (res.status === 200) {
        console.log('readLedgerEntry res: ', res)
        return Promise.resolve(res.data.response.variables);
    }
    console.error(res);
    return Promise.reject(`error ${res.status} received from server`);
};

// @ts-ignore
const updateLedgerEntry = async (baseUrl = '', { api_id, ledger_access_id, data }) => {
    const url = `${baseUrl}/api/ledger/update`;

    const api_id_query = api_id ? [{ "data.api_id": api_id }] : [];
    const ledger_access_id_query = ledger_access_id ? [{ "ledger_access_id": ledger_access_id }] : [];
    const query = { $or: [ ...api_id_query, ...ledger_access_id_query ] };

    const res = await axios.post(url, {
        query,
        data,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'ledger-api-key': process.env.NEXT_PUBLIC_LEDGER_API_KEY,
        },
      });
    if (res.status === 200) {
        // @ts-ignore
        return Promise.resolve(res.json());
    }
    console.error(res);
    return Promise.reject(`error ${res.status} received from server`);
};

// @ts-ignore
const deleteLedgerEntry = async (baseUrl = '', { api_id, ledger_access_id }) => {
    const url = `${baseUrl}/api/ledger/delete`;

    const api_id_query = api_id ? [{ "data.api_id": api_id }] : [];
    const ledger_access_id_query = ledger_access_id ? [{ "ledger_access_id": ledger_access_id }] : [];
    const query = { $or: [ ...api_id_query, ...ledger_access_id_query ] };

    const res = await axios.post(url, {
        query,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'ledger-api-key': process.env.NEXT_PUBLIC_LEDGER_API_KEY,
        },
      });
    if (res.status === 200) {
        // @ts-ignore
        return Promise.resolve(res.json());
    }
    console.error(res);
    return Promise.reject(`error ${res.status} received from server`);
};

// @ts-ignore
const getUserProjects = async ({ email }) => {
    const url = `${_webhub_db_url}/stage/dynamodb/webhubprojects/read`;
    const res = await axios(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (res.status === 200) {
        // @ts-ignore
        return Promise.resolve(res.json());
    } return Promise.reject(`error ${res.status} received from server`);
};

// @ts-ignore
const apiRequest = async ({ url, method, data }) => {

    const res = await axios('/api/api', {
        method: 'POST',
        // @ts-ignore
        body: JSON.stringify({ url, method, data }),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    });

    if (res.status === 200) {
        // @ts-ignore
        return Promise.resolve(res.json());
    } return Promise.reject(`error ${res.status} received from server`);
};

const sendEmail = async ({ subject = '', content = '', email = '' }) => {

    const r = await axios({
        url: 'https://ga33n2aqc3.execute-api.us-east-2.amazonaws.com/prod/send-email',
        method: 'POST',
        headers: {
                'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        data: { email, subject, content },
    });

    return r;
};

const RID = (l = 8) => {
    const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rid = '';
    for (let i = 0; i < l; i += 1) {
        const r = Math.random() * c.length;
        rid += c.substring(r, r + 1);
    }
    return rid;
};

const extractDomain = (url: String) => {
    // Remove "http://" or "https://"
    url = url.replace("http://", "").replace("https://", "");
    
    // Extract domain by taking everything before the first "/"
    const domain = url.split('/')[0];
    
    return domain;
}

const extractRegionAndAccountIdFromExecutionArn = (inputString: String) => {
    const components = inputString.split(":");
    const region = components[3];
    const accountId = components[4];
    
    return { region, accountId };
}

const randomInteger = (min: number, max: number) => {
  return Math.floor((Math.random() * (max - min)) + min);
};

export {
    API72_COLORS,
    randomUsernameGenerator,
    RID,
    apiRequest, 
    getUserProjects,
    extractDomain, extractRegionAndAccountIdFromExecutionArn,
    sendEmail,
    createLedgerEntry,
    readLedgerEntry,
    updateLedgerEntry,
    deleteLedgerEntry,
    randomInteger,
};