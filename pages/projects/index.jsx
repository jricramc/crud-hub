import React, { useRef, useEffect, useState, useContext } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Modal, Button, Spinner, ProgressBar, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import $ from 'jquery';
import { BoxArrowRight } from 'react-bootstrap-icons';
import { RID, apiRequest, deployCRUDAPI, getUserProjects } from '../../utils/utils';
import styles from './index.module.scss';

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const Projects = ({}) => {

    const _webhub_db_url = publicRuntimeConfig.WEBHUB_DB_URL;
    const { data: session } = useSession({ required: true });
    const session_email = session?.user?.email;

    const [selectedId, setSelectedId] = useState();
    const [projects, setProjects] = useState();

    const selectedProject = (projects || []).find(({ id }) => id === selectedId);

    const sP = selectedProject || { name: '...', url: '-'};

    const [p, setP] = useState();

    const [show, setShow] = useState();

    const handleClose = () => setShow();

    const [deploymentStatus, setDeploymentStatus] = useState();
    const [name, setName] = useState('');

    const handleSubmit = async () => {
        setDeploymentStatus('deploying');
        const n = (name?.length || name) ? name : 'Untitled';
        const rid = RID()
        await deployCRUDAPI({ email: session?.user?.email, name: n, rid })
            .then((response) => {
                console.log('response: ', response);
                const { upRes: { data: { r_id, api_url } } } = response;
                setDeploymentStatus('success');
                setSelectedId(r_id);
                setProjects((prevState) => [...prevState, {
                    id: r_id,
                    name: n,
                    url: api_url,
                }]);
            })
            .catch((err) => {
                console.log('err: ', err)
                setDeploymentStatus('error');
            });
    };

    console.log('session: ', session);
    const connectionStatus = 'verified';


    const coreResource = {
        name: 'CORE API',
        baseUrl: '-',
        type: 'CORE CRUD API',
        created: p?.core?.date_created,
        links: [
            { method: 'get', endpoint: '/create/dynamodb/{dbname}', description: 'creates a dynamodb resource with the name {dbname} and deploys a CRUD API to interact with the dynamoDB created' },
            { method: 'get', endpoint: '/create/s3/{bucket-name}', description: 'creates a dynamodb resource with the name {bucket-name} and deploys a CRUD API to interact with the s3 bucket created' },
            { method: 'get', endpoint: '/delete/dynamodb/{dbname}', description: 'deletes a dynamodb resource with the name {dbname} if one exists along with the CRUD API...' },
            { method: 'get', endpoint: '/delete/s3/{bucket-name}', description: 'deletes a s3 bucket  resource with the name {bucket-name} if one exists along with the CRUD API...' },
        ],
    }

    const resourceObjToResourceUIObj = ({ resource_name, resource_type, db_name, unique_dbname, date_created }) => ({
        name: db_name,
        baseUrl: `/${resource_type}/${unique_dbname}`,
        resourceName: resource_name,
        type: resource_type,
        created: date_created,
        links: [
            { method: 'post', endpoint: '/create', description: `creates an entry for ${resource_name}` },
            { method: 'post', endpoint: '/read', description: `reads an entry from ${resource_name}` },
            { method: 'post', endpoint: '/update', description: `updates an entry from ${resource_name}` },
            { method: 'post', endpoint: '/delete', description: `deletes an entry from ${resource_name}` },
        ],
    });

    // const resources = [
    //     {
    //         name: 'ricky',
    //         baseUrl: '/dynamodb/ricky',
    //         type: 'DynamoDB',
    //         created: new Date(),
    //         links: [
    //             { method: 'post', endpoint: '/create', description: 'creates an entry for  DynamoDB table' },
    //             { method: 'post', endpoint: '/read', description: 'reads an entry from DynamoDB table' },
    //             { method: 'post', endpoint: '/update', description: 'updates an entry from DynamoDB table' },
    //             { method: 'post', endpoint: '/delete', description: 'deletes an entry from DynamoDB table' },
    //         ],
    //     },
    //     {
    //         name: 'my-first-s3',
    //         baseUrl: '/s3/my-first-s3',
    //         type: 'S3',
    //         created: new Date(),
    //         links: [
    //             { method: 'post', endpoint: '/create', description: 'creates an entry for  DynamoDB table' },
    //             { method: 'post', endpoint: '/read', description: 'reads an entry from DynamoDB table' },
    //             { method: 'post', endpoint: '/update', description: 'updates an entry from DynamoDB table' },
    //             { method: 'post', endpoint: '/delete', description: 'deletes an entry from DynamoDB table' },
    //         ],
    //     }
    // ];

    const transition = '0.5s';

    const resourceTable = ({ resource, core }) => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px 44px 10px 44px' }}>
            <div style={{ color: '#AEAEAE', fontSize: 12, marginBottom: 6 }}><span style={{ fontSize: 14, fontWeight: 'bold', marginRight: 6 }}>{resource.type}</span> created on 07/28/2023</div>
            <div style={{ border: core ? '1px solid rgba(0, 0, 0, 0.05)' : 'none', borderRadius: 8, padding: '26px 0px', display: 'flex', flexDirection: 'column', background: core ? 'rgba(255, 255, 255, 0.2)' : 'white' }}>
                <div style={{ padding: '0px 31px', height: 45, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <img
                        src={`/images/aws-${core ? 'dynamodb' : resource.type}.svg`}
                        alt={`aws ${resource.type} service icon`}
                        width={45} height={45}
                        style={{ borderRadius: 4 }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 29 }}>
                        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#262B2E' }}>{resource.name.toUpperCase()}</div>
                        <div style={{ fontSize: 12, color: '#AEAEAE' }}>{resource.baseUrl}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', fontWeight: 'bold', fontSize: 14, color: '#7D7D7D', marginLeft: 104, marginTop: 30 }}>
                    <div style={{ width: 185 }}>Method</div>
                    <div style={{ width: 241 }}>Endpoint</div>
                    <div style={{ flex: 1 }}>Description</div>
                </div>
                <div style={{ marginTop: 14, background: core ? 'transparent' : '#F9F9F9', width: '100%', height: 1 }} />
                <div style={{ display: 'flex', flexDirection: 'column', padding: '11px 40px 11px 70px', overflowY: 'scroll' }}>
                    {resource.links.map(({ method, endpoint, description }) => <div key={`link-table-row-${method}-${endpoint}`} className={styles.linkTableRow}>
                        <div style={{ width: 185, color: '#26292E', fontWeight: 'bold' }}>{method.toUpperCase()}</div>
                        <div style={{ width: 241, color: '#6A6A6A', fontWeight: 'bold' }}>{endpoint}</div>
                        <div className={styles.clippedDescriptionText} style={{ flex: 1, color: '#7D7D7D' }}>{description}</div>
                    </div>)}
                </div>
            </div>
        </div>
    );

    useEffect(() => {

        if (session_email && projects === undefined) {
            console.log('getting user projects')
            apiRequest({ url: `${_webhub_db_url}/stage/dynamodb/webhubprojects/read`, method: 'POST' })
                .then((prjcts) => {
                    const projs = prjcts.map(({ name }) => {
                        let obj = {};
                        try {
                            obj = JSON.parse(name);
                        } catch (err) {
                            obj = {};
                        }
                        return {id: obj.rid, ...obj };
                    });

                    console.log('projs: ', projs);

                    const user_projects = projs.filter(({ email }) => email === session_email);
                    console.log('user_projects: ', user_projects);
                    if (user_projects.length === 0) {
                        setShow(true);
                    }
                    setProjects(user_projects);
                }).catch((err) => {
                    console.log('err: ', err)
                })

        }

    }, [session]);

    useEffect(() => {
        setP();
        const prj = projects?.find(({ id }) => selectedId === id);
        console.log('prj: ', prj);
        if (prj) {
            const { url } = prj
            apiRequest({ url: `${url}/ledger/read`, method: 'POST' })
                .then((raw_items) => {
                    const items = raw_items.map(({ name }) => {
                        let obj = {};
                        try {
                            obj = JSON.parse(name);
                        } catch (err) {
                            obj = {};
                        }
                        return obj;
                    });

                    const p_obj = {
                        core: {
                            date_created: undefined,
                        },
                        resources: [],
                    };

                    const r = [];

                    for (let i = 0; i < items.length; i += 1) {
                        const { api_id, date_created, resource_type, db_name, unique_dbname } = items[i]

                        if (api_id) {
                            p_obj.core.date_created = date_created;
                        } else if (resource_type === 'dynamodb') {
                            r.push({ resource_name: 'DynamoDB', resource_type, db_name, unique_dbname, date_created })
                        }
                    }

                    p_obj.resources = r.sort((a, b) => {
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        return b.date_created - a.date_created;
                    })

                    console.log('p_obj: ', p_obj);
                    setP(p_obj);
                }).catch((err) => {
                    console.log('err: ', err)
                })
        }

    }, [selectedId]);

    return (
    <>
        <div className={styles.container}>
            <div className={`${styles.sideBar} z-depth-3-box-shadow`}>
                <div style={{
                    display: 'flex',
                    height: 80,
                    fontSize: 36,
                    color: 'white',
                    fontWeight: 'bold',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <span>WebHUB</span>
                </div>
                <div style={{ flex: 1, width: '100%', overflow: 'scroll' }}>
                    <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 36, margin: 17, background: '#323335', borderRadius: 3, color: 'white' }}
                        onClick={() => setShow(true)}
                    >
                        <div>New Project +</div>
                    </div>
                    {(projects || []).map(({ id, name }) => <div key={`projects-titles-${id}`} style={{ display: 'flex', cursor: 'default', height: 56, flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ transition, cursor: 'pointer', height: 24, width: 4, background: 'white', marginRight: 34, opacity: selectedId === id ? 1 : 0 }} />
                        <div
                            style={{ transition, cursor: 'pointer', height: 24, color: selectedId === id ? 'white' : '#9F9F9F', fontWeight: 'bold', fontSize: 16 }}
                            onClick={() => setSelectedId(id)}
                        >{name}</div>
                    </div>)}
                </div>
                <div style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255,255,255,0.1), rgba(255, 255, 255, 0))', height: 1 }} />
                <div style={{ height: 175, width: '100%', display: 'flex', flexDirection: 'column', padding: '5px 29px 29px 29px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', padding: '27px 0px' }}>
                        <img src={session?.user?.image} width={47} height={47} />
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 19 }}>
                            <div style={{ fontWeight: 'bold', color: 'white', fontSize: 16 }}>{session?.user?.name}</div>
                            <div style={{ color: '#797A7C', fontSize: 14 }}>{session_email}</div>
                        </div>
                    </div>
                    <Button variant="dark" style={{ color: '#AAABAD' }} onClick={async () => await signOut({ callbackUrl: "/api/auth/logout", })}>Logout</Button>
                </div>
            </div>
            <div className={styles.chatContainer}>
                <div style={{ width: '100%', height: 112, background: 'white', display: 'flex', flexDirection: 'column', padding: '0px 44px', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ color: 'black', fontWeight: 'bold', fontSize: 32, marginTop: 20 }}>{sP.name}</div>
                    <div style={{ color: '#7D7D7D', fontSize: 14  }}>{sP.url}</div>
                </div>
                {p
                    ? <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'scroll', paddingBottom: 30 }}>
                        {resourceTable({ resource: coreResource, core: true })}
                        {p.resources.map(resourceObjToResourceUIObj).map((r) => resourceTable({ resource: r, core: false }))}
                    </div>
                    : <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '30vh' }}>
                        {selectedProject ? <Spinner animation="border" /> : <span style={{ color: 'rgba(0, 0, 0, 0.2)', fontSize: 14, marginTop: 8 }}>No Projects</span>}
                        {/* <span style={{ color: 'rgba(0, 0, 0, 0.2)', fontSize: 14, marginTop: 8 }}>Loading CRUD API data...</span> */}
                    </div>
                }
            </div>
            <Modal show={show} size="lg">
                <Modal.Header>
                    <Modal.Title><h2 style={{ fontWeight: 'bold' }}>Create a CRUD API</h2></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={console.log}>
                        <Form.Group className="mb-3" controlId="formBasicProjectName">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Untitled"
                                value={name}
                                onChange={(ev) => setName(ev.target.value)}
                                disabled={deploymentStatus === 'deploying' || deploymentStatus === 'success'}
                            />
                            {/* <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text> */}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {deploymentStatus === undefined && <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>}
                    {deploymentStatus === undefined && <Button variant="primary" onClick={handleSubmit}>
                        Deploy
                    </Button>}
                    {deploymentStatus === 'success' && <Button variant="success" onClick={() => {
                        handleClose();
                        setDeploymentStatus();
                        setName('');
                    }}>
                        Done
                    </Button>}
                    {deploymentStatus === 'error' && <Button variant="primary" onClick={handleSubmit}>
                        Try Again
                    </Button>}
                    {deploymentStatus === 'deploying' && <ProgressBar animated now={100} style={{ width: '100%' }} />}
                </Modal.Footer>
            </Modal>
            <Modal show={connectionStatus !== 'verified'}>
                <Modal.Header>
                    <Modal.Title style={{ fontWeight: 'bold' }}>Establishing Connection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {connectionStatus === 'loading' && <ProgressBar animated now={100} />}
                    {connectionStatus === 'sign-in' && <div>You must have an authenticated account to access the Webhub portal. Press continue to be redirected to the sign-in page.</div>}
                    {connectionStatus === 'assume-role' && <div>You have an authenticated account, but have not yet connected your AWS account. Press continue to be redirected to the onboarding page.</div>}
                </Modal.Body>
                {connectionStatus !== 'loading' && <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => router.push({
                            pathname: '/auth',
                        })}
                    >
                        Continue
                    </Button>
                </Modal.Footer>}
            </Modal>
        </div>
        
        <style jsx global>{`
            html,
            body {
            padding: 0;
            margin: 0;
            font-family: Arial;
            }
      `}</style>
    </>
    );
};

export default Projects;