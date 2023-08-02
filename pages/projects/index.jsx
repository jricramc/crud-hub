import React, { useRef, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button, Spinner, ProgressBar, OverlayTrigger, Tooltip } from 'react-bootstrap';
import $ from 'jquery';
import { BoxArrowRight } from 'react-bootstrap-icons';
import styles from './index.module.scss';

const Projects = ({}) => {

    const connectionStatus = 'verified';

    const selectedId = '1';
    const projects = [
        { id: '1', name: 'Name of Project' },
        { id: '2', name: 'Coolest API Ever' },
        { id: '3', name: 'Project 2' },
        { id: '4', name: 'Untitled' },
        { id: '5', name: 'Name of Project' },
        { id: '6', name: 'Coolest API Ever' },
        { id: '7', name: 'Project 2' },
        { id: '8', name: 'Untitled' },
        { id: '9', name: 'Name of Project' },
        { id: '10', name: 'Coolest API Ever' },
        { id: '11', name: 'Project 2' },
        { id: '12', name: 'Untitled' },
    ];

    const coreResource = {
        name: 'CORE API',
        baseUrl: '/core',
        type: 'CORE CRUD API',
        created: new Date(),
        links: [
            { method: 'get', endpoint: '/create/dynamodb/{dbname}', description: 'creates a dynamodb resource with the name {dbname} and deploys a CRUD API to interact with the dynamoDB created' },
            { method: 'get', endpoint: '/create/s3/{bucket-name}', description: 'creates a dynamodb resource with the name {bucket-name} and deploys a CRUD API to interact with the s3 bucket created' },
            { method: 'get', endpoint: '/delete/dynamodb/{dbname}', description: 'deletes a dynamodb resource with the name {dbname} if one exists along with the CRUD API...' },
            { method: 'get', endpoint: '/delete/s3/{bucket-name}', description: 'deletes a s3 bucket  resource with the name {bucket-name} if one exists along with the CRUD API...' },
        ],
    }

    const resources = [
        {
            name: 'ricky',
            baseUrl: '/dynamodb/ricky',
            type: 'DynamoDB',
            created: new Date(),
            links: [
                { method: 'post', endpoint: '/create', description: 'creates an entry for  DynamoDB table' },
                { method: 'post', endpoint: '/read', description: 'reads an entry from DynamoDB table' },
                { method: 'post', endpoint: '/update', description: 'updates an entry from DynamoDB table' },
                { method: 'post', endpoint: '/delete', description: 'deletes an entry from DynamoDB table' },
            ],
        },
        {
            name: 'my-first-s3',
            baseUrl: '/s3/my-first-s3',
            type: 'S3',
            created: new Date(),
            links: [
                { method: 'post', endpoint: '/create', description: 'creates an entry for  DynamoDB table' },
                { method: 'post', endpoint: '/read', description: 'reads an entry from DynamoDB table' },
                { method: 'post', endpoint: '/update', description: 'updates an entry from DynamoDB table' },
                { method: 'post', endpoint: '/delete', description: 'deletes an entry from DynamoDB table' },
            ],
        }
    ];

    const typeToImage = {
        'CORE CRUD API': 'dynamodb',
        'DynamoDB': 'dynamodb',
        'S3': 's3',
        'API Gateway': 'api-gateway',
    }

    const transition = '0.5s';

    const RID = () => {
        const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let rid = '';
        for (let i = 0; i < 15; i += 1) {
            const r = Math.random() * c.length;
            rid += c.substring(r, r + 1);
        }
        return rid;
    };

    const resourceTable = ({ resource, core}) => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px 44px 10px 44px' }}>
            <div style={{ color: '#AEAEAE', fontSize: 12, marginBottom: 6 }}><span style={{ fontSize: 14, fontWeight: 'bold', marginRight: 6 }}>{resource.type}</span> created on 07/28/2023</div>
            <div style={{ border: core ? '1px solid rgba(0, 0, 0, 0.05)' : 'none', borderRadius: 8, padding: '26px 0px', display: 'flex', flexDirection: 'column', background: core ? 'rgba(255, 255, 255, 0.2)' : 'white' }}>
                <div style={{ padding: '0px 31px', height: 45, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <img
                        src={`/images/aws-${typeToImage[resource.type]}.svg`}
                        alt="aws dynamodb service icon"
                        width={45} height={45}
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
                    <span>CrudHUB</span>
                </div>
                <div style={{ flex: 1, width: '100%', overflow: 'scroll' }}>
                    <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 36, margin: 17, background: '#323335', borderRadius: 3, color: 'white' }}
                    >
                        <div>New Project +</div>
                    </div>
                    {projects.map(({ id, name }) => <div key={`projects-titles-${id}`} style={{ display: 'flex', cursor: 'default', height: 56, flexDirection: 'row' }}>
                        <div style={{ transition, cursor: 'pointer', height: 24, width: 4, background: 'white', marginRight: 34, opacity: selectedId === id ? 1 : 0 }} />
                        <div style={{ transition, cursor: 'pointer', height: 24, color: selectedId === id ? 'white' : '#9F9F9F', fontWeight: 'bold', fontSize: 16 }}>{name}</div>
                    </div>)}
                </div>
                <div style={{ height: 240, width: '100%', background: 'rgba(255, 255, 255, 0.2)' }}></div>
            </div>
            <div className={styles.chatContainer}>
                <div style={{ width: '100%', height: 112, background: 'white', display: 'flex', flexDirection: 'column', padding: '0px 44px' }}>
                    <div style={{ color: 'black', fontWeight: 'bold', fontSize: 32, marginTop: 20 }}>Name of Project</div>
                    <div style={{ color: '#7D7D7D', fontSize: 14  }}>https://53zl8kiry2.execute-api.us-east-2.amazonaws.com/stage</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'scroll', paddingBottom: 30 }}>
                    {resourceTable({ resource: coreResource, core: true })}
                    {resources.map((r) => resourceTable({ resource: r, core: false }))}
                </div>
            </div>
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