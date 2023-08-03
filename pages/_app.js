// _app.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import '../styles/custom.scss';
import { SessionProvider } from 'next-auth/react';

const MyApp = ({ Component, pageProps, session }) => {

    return (<>
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    </>);
}
export default MyApp