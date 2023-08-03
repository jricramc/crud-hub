import unfetch from 'unfetch';


const deployCRUDAPI = async ({ name, email, rid }) => {
  const url = '/api/deployCRUDAPI';
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

const apiRequest = async ({ url, method, data }) => {
    if (!['GET', 'POST'].includes(method) || !url?.length > 0) {
        return;
    }

    const res = await unfetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
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


export { deployCRUDAPI, RID, apiRequest }

