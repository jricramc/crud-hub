import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { deployCRUDAPI } from '../../utils/utils';

const DeployIndex = () => {
    const [pulumiAccessToken, setPulumiAccessToken] = useState();
    const [projectName, setProjectName] = useState();
    const [stackName, setStackName] = useState();

    const handleSubmit = async () => {
        const response = await deployCRUDAPI({ pulumiAccessToken, projectName, stackName });
        console.log(response)
    };

    return (
        <>
            <h2 style={{ marginBottom: 20, fontWeight: 'bold' }}>Deploy Dynamic CRUD API</h2>
            <Form onSubmit={console.log}>
            <Form.Group className="mb-3" controlId="formBasicPulumiAccessToken">
                <Form.Label>Pulumi Access Token</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="token id"
                    value={pulumiAccessToken}
                    onChange={(ev) => setPulumiAccessToken(ev.target.value)}
                />
                {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text> */}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicProjectName">
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="test"
                    value={projectName}
                    onChange={(ev) => setProjectName(ev.target.value)}
                />
                {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text> */}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicStackName">
                <Form.Label>Stack Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="stack XXX"
                    value={stackName}
                    onChange={(ev) => setStackName(ev.target.value)}
                />
                {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text> */}
            </Form.Group>

            <Button onClick={handleSubmit} variant="primary" type="button">
                Submit
            </Button>
            </Form>
            <style jsx global>{`
            html,
            body {
            padding: 0;
            margin: 20px;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                sans-serif;
            }
            * {
            box-sizing: border-box;
            }
        `}</style>
        </>
    );
}

DeployIndex.displayName = 'DeployIndex';

export default DeployIndex;
