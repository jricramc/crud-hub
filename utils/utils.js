import unfetch from 'unfetch';


const deployCRUDAPI = async ({ name, email, rid }) => {
  const url = '/api/deploy/coreAPI';
  const res = await unfetch(url, {
      method: 'POST',
      body: JSON.stringify({ name, email, rid }),
      headers: {
        'Content-Type': 'application/json',
      },
  });
  if (res.status === 200) {
      return Promise.resolve(res.json());
  } return Promise.reject(`error ${res.status} received from server`);
};

const getUserProjects = async ({ email }) => {
    const url = 'https://7lgnkvykt8.execute-api.us-east-2.amazonaws.com/stage/dynamodb/webhubprojects/read';
    const res = await unfetch(url, {
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
    // if (!['GET', 'POST'].includes(method) || !url?.length > 0) {
    //     return;
    // }

    const res = await unfetch('/api/api', {
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

const RID = (l = 8) => {
    const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rid = '';
    for (let i = 0; i < l; i += 1) {
        const r = Math.random() * c.length;
        rid += c.substring(r, r + 1);
    }
    return rid;
};

const removeProtocolPrefix = (url) => {
    // Use regular expression to match http:// or https:// at the beginning of the string
    const protocolRegex = /^(https?:\/\/)/i;
    
    // Replace the matched protocol with an empty string
    return url.replace(protocolRegex, '');
}


export { deployCRUDAPI, RID, apiRequest, getUserProjects, removeProtocolPrefix }

