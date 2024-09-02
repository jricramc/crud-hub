import axios from 'axios';

interface VerifyAPIURLArgs {
    api_id: String | null | undefined;
    ledger_access_id: String | null | undefined;
  }

const verifyAPIID = async (api_id: String) => {
    const url = `/api/ledger/verify-api`;
    const query = { "data.api_id": api_id };

    const res = await axios.post(url, {
        query,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    if (res.status === 200) {
        return Promise.resolve(res.data);
    }
    console.error(res);
    return Promise.reject(`error ${res.status} received from server`);
};

const sendVerificationEmail = async (email: String) => {
  const url = `/api/email/send-verification`;
  
  const res = await axios.post(url, {
      email,
    }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (res.status === 200) {
    return Promise.resolve(res.data);
  }
  console.error(res);
  return Promise.reject(`error ${res.status} received from server`);
};

interface CheckEmailVerificationCodeArgs {
  email: String;
  code: String;
}

const checkEmailVerificationCode = async ({ email, code } : CheckEmailVerificationCodeArgs) => {
  const url = `/api/email/check-verification`;
  
  const res = await axios.post(url, {
      email, code
    }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (res.status === 200) {
    return Promise.resolve(res.data);
  }
  console.error(res);
  return Promise.reject(`error ${res.status} received from server`);
};

export {
    verifyAPIID,
    sendVerificationEmail,
    checkEmailVerificationCode
}