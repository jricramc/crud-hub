"use client";
import type { Page } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Timeline } from "primereact/timeline";
import { useContext, useState, useEffect } from "react";
import { LayoutContext } from "../../../../../layout/context/layoutcontext";
import axios from "axios";
import { randomInteger } from "@/utils/utils";
import type { CustomEvent } from "@/types";
import { checkEmailVerificationCode, sendVerificationEmail } from "@/utils/client/apiCalls";
import moment from "moment";

const Register: Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [confirmed, setConfirmed] = useState(false);
    
    const { layoutConfig } = useContext(LayoutContext);
    const dark = layoutConfig.colorScheme !== "light";

    const [email, setEmail] = useState<string | null>(searchParams?.has('email') ? searchParams?.get('email') : null);

    // 0: default, 1: sending verification email, 2: waiting for verification code, 3: checking verification code, 4: verified, 5: building api
    const [registrationStep, setRegistrationStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(searchParams?.has('email') && searchParams?.has('code') ? 3 : 0);
    const [emailAlreadyVerifiedDate, setEmailAlreadyVerifiedDate] = useState<string | null>(null);
    const [emailVerificationCode, setEmailVerificationCode] = useState<string | null>(searchParams?.has('code') ? searchParams?.get('code') : null);
    const [invalidVerificationCode, setInvalidVerificationCode] = useState<boolean>(false);

    const [buttonDeploymentStatus, setButtonDeploymentStatus] = useState(0);
    const [deployStage, setDeployStage] = useState<number | null>(null);
    const [deployStageProgress, setDeployStageProgress] = useState(0);
    const deployStageMessages = {
        deploy: {
            stage: [
                'Initializing deployment',
                'Initializing deployment',
                'Initializing deployment',
                'Downloading provider: aws',
                'Downloading provider: aws',
                'Downloading provider: aws',
                'Downloading provider: aws',
                'Downloading provider: aws',
                'Waiting for AWS...',
                'Waiting for AWS...',
                'Syncing:: payload',
                'Syncing:: payload',
                'Syncing:: payload',
                'Retry AWS...',
                'Syncing:: resources',
                'Syncing:: resources',
                'Syncing:: resources',
                'Retry AWS...',
                'Configuring server...',
                'Configuring server...',
                'Configuring server...',
                'Configuring server...',
                'Configuring server...',
                'Configuring server...',
                'Configuring server...',
                'Configuring server...',
                'Configuring server...',
                'Configuring server...',
                'Configuring server...',
                'Configuring server...',
                'Building endpoints...',
                'Building endpoints...',
                'Building endpoints...',
                'Building endpoints...',
                'Building endpoints...',
                'Building endpoints...',
                'Building endpoints...',
                'Building endpoints...',
                'Building endpoints...',
                'Building endpoints...',
                'Generating API username...',
                'Generating API username...',
                'Generating API username...',
                'Generating API username...',
                'Generating API username...',
                'Generating API passkey...',
                'Generating API passkey...',
                'Generating API passkey...',
                'Generating API passkey...',
                'Generating link...',
            ],
            variant: 'outline',
            textColor: 'text-blue-500'
        },
        error: {
            stage: [
                'Error deploying API'
            ],
            variant: 'destructive',
            textColor: 'text-red-500'
        },
        timeout: {
            stage: [
                'Stream timeout: your service may still deploy, but it took to long to respond',
            ],
            variant: 'destructive',
            textColor: 'text-orange-500'
        },
        success: {
            stage: [
                'API Successfully Deployed'
            ],
            variant: 'primary',
            textColor: 'text-green-500'
        },
    };
    const [deployStageMessage, setDeployStageMessage] = useState({ type: 'deploy', stage: 0 });
    const [deployStageComplete, setDeployStageComplete] = useState(false);

    const customEvents: CustomEvent[] = [
        {
            status: "Ordered",
            date: "15/09/2022 10:30",
            icon: "pi pi-shopping-cart",
            color: "#9C27B0",
            image: "game-controller.jpg",
        },
        {
            status: "Processing",
            date: "15/09/2022 14:00",
            icon: "pi pi-cog",
            color: "#673AB7",
        },
        {
            status: "Shipped",
            date: "15/09/2022 16:15",
            icon: "pi pi-envelope",
            color: "#FF9800",
        },
        {
            status: "Delivered",
            date: "16/09/2022 10:00",
            icon: "pi pi-check",
            color: "#607D8B",
        },
    ];

    const customizedMarker = (item: CustomEvent) => {
        return (
            <span
                className="flex z-1 w-2rem h-2rem align-items-center justify-content-center text-white border-circle shadow-2"
                style={{ backgroundColor: item.color }}
            >
                <i className={item.icon}></i>
            </span>
        );
    };

    const verifyVerificationCode = async () => {
        setEmailAlreadyVerifiedDate(null);
        setRegistrationStep(3);

        const res = await checkEmailVerificationCode({
            email: email ?? '',
            code: emailVerificationCode ?? ''
        });

        const {
            alreadyVerified,
            verified,
            date_verified,
        } = res || {};

        if (alreadyVerified) {
            setEmailAlreadyVerifiedDate(date_verified);
        }
        setInvalidVerificationCode(!(alreadyVerified || verified));
        setRegistrationStep((alreadyVerified || verified) ? 4 : 2);
    };

    const verifyEmailAddress = async () => {
        // verifying email and or sending verfication email
        setEmailAlreadyVerifiedDate(null);
        setRegistrationStep(1);
        const res = await sendVerificationEmail(email ?? '').then((data) => data).catch((err) => ({ err }));
        const {
            alreadyVerified,
            emailSent,
            date_verified,
            err,
        } = res || {};

        if (alreadyVerified) {
            setEmailAlreadyVerifiedDate(date_verified);
            setRegistrationStep(4);
        } else if (emailSent) {
            setRegistrationStep(2);
        }
    };

    const handleDeploy = async () => {
        setDeployStageProgress(2);
        setButtonDeploymentStatus(1);
        await axios.post('https://webhub.up.railway.app/api/deploy/coreAPI', { email: email ?? '' }, {
            headers: {
              'Content-Type': 'application/json',
              // 'ledger-api-key': process.env.NEXT_PUBLIC_LEDGER_API_KEY,
            },
          }).then(async (response) => {
            console.log('response: ', response)
            // const body = await response.json();
            // console.log(body);
            // if (body.err) {
            //   console.log('error occured ', body.err);
            //   setDeployStageProgress(0)
            //   setDeployStageMessage({ type: 'error', stage: 0 })
            // } else {
            //   // const { upRes: { data: { r_id, api_url } } } = body;
            //   console.log('body: ', body);
            //   const { api_url, r_id } = body;
            //   console.log('api_url: ', api_url)
            //   setDeployedAPIURL(api_url.slice(-1) === '/' ? api_url.slice(0, -1) : api_url);
            //   setDeployStageProgress(100);
            //   setDeployStageMessage({ type: 'success', stage: 0 })
            //   setDeployStage(0);
            // }
          })
          .catch((err) => {
              console.log('err: ', err);
            //   setDeployStageMessage({ type: 'timeout', stage: 0 });
            //   setDeployStageProgress(0)
            setButtonDeploymentStatus(2);
            setDeployStageMessage({ type: 'error', stage: 0 });
          });
      };

      useEffect(() => {
        if (deployStageProgress < 100 && deployStageProgress > 0) {
            if (deployStageMessage.type === 'deploy') {
                const val = deployStageProgress + ((100 - deployStageProgress) / randomInteger(20, 30))
                setTimeout((newDeployStageProgress) => {
                    setDeployStageProgress((prevState) => (prevState === 0 || prevState === 100) ? prevState : newDeployStageProgress)
                    if (deployStageMessage.stage < deployStageMessages.deploy.stage.length - 1) {
                    setDeployStageMessage(({ type, stage: prevStage }) => ((type === 'error' || type === 'success') ? { type, stage: prevStage } : { type: 'deploy', stage: prevStage + 1 }))
                    }
                }, randomInteger(2000, 10000), val)
            }
        }
      }, [deployStageProgress])

      useEffect(() => {
        if (email !== null && emailVerificationCode !== null) {
            verifyVerificationCode();
        }
      }, []);

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1600 800"
                className="fixed left-0 top-0 min-h-screen min-w-screen"
                preserveAspectRatio="none"
            >
                <rect
                    fill={dark ? "var(--primary-900)" : "var(--primary-500)"}
                    width="1600"
                    height="800"
                />
                <path
                    fill={dark ? "var(--primary-800)" : "var(--primary-400)"}
                    d="M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z"
                />
                <path
                    fill={dark ? "var(--primary-700)" : "var(--primary-300)"}
                    d="M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z"
                />
                <path
                    fill={dark ? "var(--primary-600)" : "var(--primary-200)"}
                    d="M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z"
                />
                <path
                    fill={dark ? "var(--primary-500)" : "var(--primary-100)"}
                    d="M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z"
                />
            </svg>
            <div className="px-5 min-h-screen flex justify-content-center align-items-center">
                {[0, 1, 2, 3, 4].includes(registrationStep) && <div className="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
                    {registrationStep !== 0 && <Button
                        className="mb-4"
                        icon="pi pi-chevron-left"
                        rounded outlined
                        onClick={() => {
                            if (registrationStep !== 3) {
                                setRegistrationStep(0);
                                setEmailVerificationCode(null);
                                setInvalidVerificationCode(false);
                            }
                        }}
                        disabled={registrationStep === 3}
                    />}
                    <div className="mb-4 w-full md:w-25rem">
                        <div className="text-900 text-xl font-bold mb-2">
                            {registrationStep === 0 ? "Let's get started" : "Email verification"}
                        </div>
                        <span className="text-600 font-medium">
                            {registrationStep === 0
                                ? "Please enter your email so we can send you your API72 information and credentials once its built and deployed."
                                : "Please follow the email verification instructions sent to your email and enter the verification code."
                            }
                            
                        </span>
                    </div>
                    <div className="flex flex-column">
                        <span className="p-input-icon-left w-full mb-2">
                            <i className="pi pi-envelope"></i>
                            <InputText
                                id="email"
                                type="text"
                                className="w-full md:w-25rem"
                                placeholder="Email"
                                value={email ?? ''}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={[1, 2, 3, 4].includes(registrationStep)}
                            />
                        </span>
                        {[2, 3, 4].includes(registrationStep) && <span className="p-input-icon-left w-full mb-2">
                            <i className="pi pi-lock z-2"></i>
                            <InputText
                                id="verification-code"
                                type="text"
                                className="w-full md:w-25rem"
                                placeholder="Verification code"
                                value={emailVerificationCode ?? ''}
                                onChange={(e) => setEmailVerificationCode(e.target.value)}
                                disabled={registrationStep === 3 || registrationStep === 4}
                            />
                        </span>}
                        {(registrationStep === 0 || registrationStep === 2 && (emailVerificationCode ?? '').length >= 4 || registrationStep === 4) && <Button
                            label={{ 0: "Send", 2: "Submit code", 4: 'Continue'}[registrationStep]}
                            className="w-full md:w-25rem mt-2 mb-1"
                            onClick={() => {
                                if (registrationStep === 0) {
                                    verifyEmailAddress();
                                } else if (registrationStep === 2) {
                                    verifyVerificationCode();
                                } else if (registrationStep === 4) {
                                    setRegistrationStep(5);
                                }
                                
                            }}
                            disabled={(email ?? '').length === 0}
                        ></Button>}
                        {registrationStep === 1 && <div className="w-full md:w-25rem text-600 font-medium mt-1 mb-2" style={{ fontSize: '0.8rem'}}>
                            <span className="text-600" style={{ fontWeight: 'bold' }}>Sending verification email...&nbsp;</span>
                        </div>}
                        {registrationStep === 2 && (invalidVerificationCode
                            ? <div className="w-full md:w-25rem text-600 font-medium mt-1 mb-2" style={{ fontSize: '0.8rem'}}>
                            <span
                                className="text-red-500"
                                style={{ fontWeight: 'bold' }}
                            >Invalid verification code,&nbsp;</span>
                            check that you entered the code correctly or&nbsp;
                            <span
                                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                onClick={() => verifyEmailAddress()}
                            >request a new verification code</span>.
                        </div> : <div className="w-full md:w-25rem text-600 font-medium mt-1 mb-2" style={{ fontSize: '0.8rem'}}>
                            <span
                                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                onClick={() => verifyEmailAddress()}
                            >Request a new verification code</span>
                        </div>)}
                        {registrationStep === 3 && <div className="w-full md:w-25rem text-600 font-medium mt-1 mb-2" style={{ fontSize: '0.8rem'}}>
                            <span className="text-600" style={{ fontWeight: 'bold' }}>Checking verification code...&nbsp;</span>
                        </div>}
                        {registrationStep === 4 && (emailAlreadyVerifiedDate ? <div className="w-full md:w-25rem text-600 font-medium mt-1 mb-2" style={{ fontSize: '0.8rem'}}>
                            <span className="text-blue-500" style={{ fontWeight: 'bold' }}>Email already verified&nbsp;</span>{`on ${moment(emailAlreadyVerifiedDate).format('LLLL')}`}
                        </div> : <div className="text-600 font-medium mt-1 mb-2" style={{ fontSize: '0.8rem'}}>
                            <span className="text-blue-500" style={{ fontWeight: 'bold' }}>Email verified!</span>
                        </div>)}
                        {(registrationStep === 0) && <span className="mt-1 font-medium text-600">
                            Already have an API72 url?{" "}
                            <a href="/auth/verify-api" className="font-semibold cursor-pointer text-900 hover:text-primary transition-colors transition-duration-300">
                                Login
                            </a>
                        </span>}
                    </div>
                </div>}
                {registrationStep === 5 && <div className="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
                    <div className="mb-4 w-full md:w-25rem">
                        <div className="text-900 text-xl font-bold mb-2">
                            Ready for deployment&nbsp;&nbsp;🚀
                        </div>
                        <span className="text-600 font-medium">
                            Once you start deployment, it will take roughly 8 minutes to build and deploy your api. When your API is ready you will be emailed instructions and credentials to start utilizing your API.
                        </span>
                    </div>
                    <div className="flex flex-column">
                        <span className="p-input-icon-left w-full mb-4">
                            <i className="pi pi-envelope"></i>
                            <InputText
                                id="email"
                                type="text"
                                className="w-full md:w-25rem"
                                placeholder="Email"
                                value={(email ?? '')}
                                disabled={true}
                            />
                        </span>
                        {buttonDeploymentStatus !== 1 && <Button
                            label={["Start deployment", "Building...", "Try again"][buttonDeploymentStatus]}
                            className="w-full mb-3"
                            onClick={() => {
                                if (buttonDeploymentStatus === 0 || buttonDeploymentStatus === 2) {
                                    handleDeploy();
                                }
                            }}
                            disabled={(email ?? '').length === 0 || buttonDeploymentStatus === 1}
                        ></Button>}
                        {(buttonDeploymentStatus === 1 || buttonDeploymentStatus === 2) && <span className="mb-3 font-medium">
                            <div>
                                {/* @ts-ignore */}
                                <span className={`${deployStageMessages[deployStageMessage.type]?.textColor}`} style={{ fontWeight: 'bold' }}>{deployStageProgress.toFixed(2)}%&nbsp;&nbsp;</span>
                                {/* @ts-ignore */}
                                <span className="text-500">{deployStageMessages[deployStageMessage.type]?.stage[deployStageMessage.stage]}</span>
                            </div>
                        </span>}
                        {buttonDeploymentStatus === 0 && <span className="mt-1 font-medium text-600">
                            Already have an API72 url?{" "}
                            <a href="/auth/verify-api" className="font-semibold cursor-pointer text-900 hover:text-primary transition-colors transition-duration-300">
                                Login
                            </a>
                        </span>}
                    </div>
                </div>}
            </div>
        </>
    );
};

export default Register;
