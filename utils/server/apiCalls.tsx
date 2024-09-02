import axios from 'axios';


interface CreateLedgerEntryArgs {
  ledger_access_id: String;
  data: Object | null | undefined;
}

const createLedgerEntry = async ({ ledger_access_id, data } : CreateLedgerEntryArgs) => {
    const url = `${process.env.NEXT_PUBLIC_WEBHUB_HOST}/api/ledger/create`;
  
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

interface AuthorizeAPIUserPasskeyArgs {
  api_id: String;
  api_user_passkey: String;
}

const authorizeAPIUserPasskey = async ({ api_id, api_user_passkey } : AuthorizeAPIUserPasskeyArgs) => {
  const url = `${process.env.NEXT_PUBLIC_WEBHUB_HOST}/api/ledger/read`;
  const query = { $and: [ { "data.api_id": api_id }, { "data.api_user_passkey": api_user_passkey } ] };

  const res = await axios.post(url, {
      query,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'ledger-api-key': process.env.NEXT_PUBLIC_LEDGER_API_KEY,
      },
    });
  if (res.status === 200) {
      const ledger_entry = res?.data;
      if (ledger_entry?.data?.api_id === api_id && ledger_entry?.data?.api_user_passkey === api_user_passkey) {
        return Promise.resolve({ authorized: true, user: ledger_entry });
      } else {
        return Promise.resolve({ authorized: false });
      }
      
  }
  console.error(res);
  return Promise.reject(`error ${res.status} received from server`);
};

interface SendEmailArgs {
  subject: String;
  content: String;
  email: String;
}

const sendEmail = async ({ subject, content, email } : SendEmailArgs) => {

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

export {
  createLedgerEntry,
  authorizeAPIUserPasskey,
  sendEmail,
};