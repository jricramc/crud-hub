import axios from 'axios';

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const _webhub_db_url = 'https://7lgnkvykt8.execute-api.us-east-2.amazonaws.com'; // publicRuntimeConfig.WEBHUB_DB_URL;
console.log('publicRuntimeConfig: ', publicRuntimeConfig)
console.log('process.env: ', process.env)
const _webhub_host = publicRuntimeConfig?.NEXT_PUBLIC_WEBHUB_HOST || process?.env?.NEXT_PUBLIC_WEBHUB_HOST;

const deployCRUDAPI = async ({ email }) => {
  const url = '/api/deploy/coreAPI';
  const res = await axios(url, {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
  });
  if (res.status === 200) {
      return Promise.resolve(res.json());
  }
  console.error(res);
  return Promise.reject(`error ${res.status} received from server`);
};

const createLedgerEntry = async ({ data }) => {
    const url = `${_webhub_host}/api/ledger/create`;
  
    try {
      const response = await axios.post(url, {
        data,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'ledger-api-key': publicRuntimeConfig.NEXT_PUBLIC_LEDGER_API_KEY,
        },
      });
  
      // Axios response.data contains the parsed response body
      // Axios automatically parses JSON responses
      return response.data;
    } catch (error) {
      // Axios errors are available in the 'response' property of the error object
      if (error.response) {
        console.error('Error response from server:', error.response.data);
        return Promise.reject(`Error ${error.response.status} received from server`);
      } else if (error.request) {
        console.error('No response received from server:', error.request);
        return Promise.reject('No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
        return Promise.reject('Error setting up request');
      }
    }
  };

const readLedgerEntry = async ({ ledger_access_id }) => {
    const url = `${_webhub_host}/api/ledger/read`;
    const res = await unfetch(url, {
        method: 'POST',
        body: JSON.stringify({ ledger_access_id }),
        headers: {
            'Content-Type': 'application/json',
            'ledger-api-key': publicRuntimeConfig.NEXT_PUBLIC_LEDGER_API_KEY
        },
    });
    if (res.status === 200) {
        return Promise.resolve(res.json());
    }
    console.error(res);
    return Promise.reject(`error ${res.status} received from server`);
};

const updateLedgerEntry = async ({ ledger_access_id, data }) => {
    const url = `${_webhub_host}/api/ledger/update`;
    const res = await axios(url, {
        method: 'POST',
        body: JSON.stringify({ ledger_access_id, data }),
        headers: {
            'Content-Type': 'application/json',
            'ledger-api-key': publicRuntimeConfig.NEXT_PUBLIC_LEDGER_API_KEY
        },
    });
    if (res.status === 200) {
        return Promise.resolve(res.json());
    }
    console.error(res);
    return Promise.reject(`error ${res.status} received from server`);
};

const deleteLedgerEntry = async ({ ledger_access_id }) => {
    const url = `${_webhub_host}/api/ledger/delete`;
    const res = await axios(url, {
        method: 'POST',
        body: JSON.stringify({ ledger_access_id }),
        headers: {
            'Content-Type': 'application/json',
            'ledger-api-key': publicRuntimeConfig.NEXT_PUBLIC_LEDGER_API_KEY
        },
    });
    if (res.status === 200) {
        return Promise.resolve(res.json());
    }
    console.error(res);
    return Promise.reject(`error ${res.status} received from server`);
};

const getUserProjects = async ({ email }) => {
    const url = `${_webhub_db_url}/stage/dynamodb/webhubprojects/read`;
    const res = await axios(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (res.status === 200) {
        return Promise.resolve(res.json());
    } return Promise.reject(`error ${res.status} received from server`);
};


const apiRequest = async ({ url, method, data }) => {

    const res = await axios('/api/api', {
        method: 'POST',
        body: JSON.stringify({ url, method, data }),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    });

    if (res.status === 200) {
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

const extractDomain = (url) => {
    // Remove "http://" or "https://"
    url = url.replace("http://", "").replace("https://", "");
    
    // Extract domain by taking everything before the first "/"
    const domain = url.split('/')[0];
    
    return domain;
}

const extractRegionAndAccountIdFromExecutionArn = (inputString) => {
    const components = inputString.split(":");
    const region = components[3];
    const accountId = components[4];
    
    return { region, accountId };
}


export {
    deployCRUDAPI,
    RID,
    apiRequest, 
    getUserProjects,
    extractDomain, extractRegionAndAccountIdFromExecutionArn,
    sendEmail,
    createLedgerEntry,
    readLedgerEntry,
    updateLedgerEntry,
    deleteLedgerEntry,
}

