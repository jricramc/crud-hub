// _app.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import '../styles/custom.scss';

const MyApp = ({ Component, pageProps }) => {

    return (<>
        <Component {...pageProps} />
    </>);
}
export default MyApp