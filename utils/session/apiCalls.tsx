import axios, { AxiosHeaderValue } from 'axios';
import { Session } from 'next-auth';

interface SessionUserObject {
    _id: String;
    ledger_access_id: String;
    data: Object;
}

interface SessionArgs {
    LEDGER_API_KEY: String;
    expires: String;
    user: SessionUserObject;
};

const renewLedgerEntry = async (session: Session | null) => {

    if (session === null) {
        return Promise.reject(`error no session data`);
    }

    const { LEDGER_API_KEY, user: { ledger_access_id } } = session as unknown as SessionArgs;
    const url = `/api/ledger/update`;
    const query = { "ledger_access_id": ledger_access_id };
    const $set = { "data.date_renewed": new Date() };

    const res = await axios.post(url, {
        query,
        $set,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'ledger-api-key': LEDGER_API_KEY as AxiosHeaderValue,
        },
    });
    if (res.status === 200) {
        const ledger_entry = res?.data;
        if (ledger_entry?.ledger_access_id === ledger_access_id) {
            return Promise.resolve({ date_renewed: ledger_entry?.data?.date_renewed });
        } else {
            return Promise.resolve({ date_renewed: null });
        }
    }
    console.error(res);
    return Promise.reject(`error ${res.status} received from server`);
};

const deployWebsocketAPIResource = async (session: Session | null) => {

    if (session === null) {
        return Promise.reject(`error no session data`);
    }

    const { LEDGER_API_KEY, user: { data } } = session as unknown as SessionArgs;
    
    if (!Object.keys(data).includes('api_url')) {
        return Promise.reject(`no session data.api_url property`);
    }

    const url = `/api/session/create/service/websocket`;
    
    const res = await axios.post(url, {
        // @ts-ignore
        api_url: data?.api_url,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'ledger-api-key': LEDGER_API_KEY as AxiosHeaderValue,
      },
    });
    if (res.status === 200) {
      return Promise.resolve(res.data);
    }
    console.error(res);
    return Promise.reject(`error ${res.status} received from server`);
  };

export {
    renewLedgerEntry,
    deployWebsocketAPIResource
}