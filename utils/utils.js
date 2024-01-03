import unfetch from 'unfetch';

// import getConfig from 'next/config';

// const { publicRuntimeConfig } = getConfig();
const _webhub_db_url = 'https://7lgnkvykt8.execute-api.us-east-2.amazonaws.com'; // publicRuntimeConfig.WEBHUB_DB_URL;

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
  }
  console.error(res);
  return Promise.reject(`error ${res.status} received from server`);
};

const getUserProjects = async ({ email }) => {
    const url = `${_webhub_db_url}/stage/dynamodb/webhubprojects/read`;
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

const generateUUID = () => {
	let d = new Date().getTime();
	
	if ( window.performance && typeof window.performance.now === "function" ) {
		d += performance.now();
	}
	
	const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});

    return uuid;
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


export { deployCRUDAPI, RID, generateUUID, apiRequest, getUserProjects, extractDomain, extractRegionAndAccountIdFromExecutionArn }

