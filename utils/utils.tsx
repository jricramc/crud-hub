import axios from 'axios';
import getConfig from 'next/config';
const _CONFIG = getConfig();

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
const readLedgerEntry = async ({ api_id, ledger_access_id }) => {
    const url = `/api/ledger/read`;

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
        console.log('readLedgerEntry res: ', res)
        return Promise.resolve(res.data.response.variables);
    }
    console.error(res);
    return Promise.reject(`error ${res.status} received from server`);
};

// @ts-ignore
const updateLedgerEntry = async ({ api_id, ledger_access_id, data }) => {
    const url = `/api/ledger/update`;

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
const deleteLedgerEntry = async ({ api_id, ledger_access_id }) => {
    const url = `/api/ledger/delete`;

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

const randomIntegerID = (l = 8) => {
  const digits = '1234567890';
  // Random Integer ID
  let riid = '';
  for (let i = 0; i < l; i += 1) {
    const r = Math.random() * digits.length;
    riid += digits.substring(r, r + 1);
  }

  return riid;
};

export {
    API72_COLORS,
    randomUsernameGenerator,
    RID,
    extractDomain, extractRegionAndAccountIdFromExecutionArn,
    readLedgerEntry,
    updateLedgerEntry,
    deleteLedgerEntry,
    randomInteger,
    randomIntegerID,
};