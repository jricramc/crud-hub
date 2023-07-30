// _app.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Auth, Amplify } from 'aws-amplify';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import config from '../aws-exports';


Amplify.configure(config);


import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import '../styles/custom.scss';
import { AuthorizationContext } from '../contexts/context';
import LoadingPage from '../components/LoadingPage';

const MyApp = ({ Component, pageProps }) => {
    const router = useRouter();
    const [mounted, setMounted] = useState();
    const [auth, setAuth] = useState(null);
    const [roleARN, setRoleARN] = useState(null);

    const updateAuth = async () => await Auth.currentAuthenticatedUser();

    async function signOut() {
        try {
            await Auth.signOut();
            setAuth();
            router.push({
                pathname: '/auth',
            });
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    const handleSignIn = () => {
        router.push({
            pathname: '/auth',
        });
    };

    useEffect(() => {

        if (typeof window !== 'undefined') {
            const loader = document.getElementById('globalLoader');
        if (loader)
            loader.style.display = 'none';
        }

        Auth.currentAuthenticatedUser({
            // Optional, By default is false. If set to true, 
            // this call will send a request to Cognito to get the latest user data
            bypassCache: false
          })
            .then((user) => {
                setAuth(user);
                setMounted(true);
            })
            .catch((err) => {
                setAuth(undefined);
                setMounted(true);
            });
    }, []);

    const userInfo = <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
                style={{
                    borderRadius: 4,
                    background: '#4E4294',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    height: 39,
                    width: 39,
                    fontSize: 26,
                    fontWeight: 'bold',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >{auth?.username[0].toUpperCase()}</div>
        </div>
    </div>;

    const header = <div style={{ minHeight: 90, background: '#010101', display: 'flex', flexDirection: 'row', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }} className="z-depth-2-box-shadow">
        <div style={{ flex: 1, maxWidth: 200 }} />
        <a href="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', flexDirection: 'row', alignContent: 'center' }}>
            <img src="logo.svg" width="40" />
            <div style={{ marginLeft: 16, marginTop: 6, fontSize: 22, fontWeight: 'bold' }}>WebHUB</div>
        </a>
        <div style={{ flex: 1 }} />
        {!auth && <Button variant="light" onClick={handleSignIn} style={{ marginRight: 20 }}>
          Sign In
        </Button>}
        {auth && <Button variant="light" onClick={() => signOut()} style={{ marginRight: 20 }}>
          Sign out
        </Button>}
        {auth && userInfo}
        <div style={{ flex: 1, maxWidth: 200 }} />
    </div>;

    if (!mounted) return <LoadingPage />;

    return (<>
        <LoadingPage />
            <Component {...pageProps} header={header} auth={auth} setAuth={setAuth} updateAuth={updateAuth} roleARN={roleARN} setRoleARN={setRoleARN} />
    </>);
}
export default MyApp