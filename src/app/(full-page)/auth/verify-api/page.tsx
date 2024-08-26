"use client";
import type { Page } from "@/types";
import { redirect, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { useContext, useState, useEffect } from "react";
import { LayoutContext } from "../../../../../layout/context/layoutcontext";
import { randomUsernameGenerator, readLedgerEntry } from "@/utils/utils";
import { verifyAPIID } from "@/utils/client/apiCalls";

const VerifyAPI: Page = () => {
    const { data: session } = useSession();

    const router = useRouter();
    const { layoutConfig } = useContext(LayoutContext);
    const dark = layoutConfig.colorScheme !== "light";

    const [verificationStep, setVerificationStep] = useState(0);
    const [username, setUserName] = useState<String | null>(null);
    const [verifiedAPIID, setVerifiedAPIID] = useState<String | null>(null);
    const [userPasskey, setUserPasskey] = useState<number | null>(null);
    const [ledgerEntry, setLedgerEntry] = useState();

    const urlStatusStates = {
        none: {
            valid: false,
            msg: 'Please enter your API72 URL.',
            variant: 'secondary',
            style: {},
            textColor: 'text-600'
        },
        invalid: {
            valid: false,
            msg: 'Invalid URL',
            variant: 'warning',
            style: {},
            textColor: 'text-orange-500'
        },
        loading: {
            valid: true,
            msg: 'Loading...',
            variant: 'secondary',
            style: {},
            textColor: 'text-blue-500'
        },
        success: {
            valid: true,
            msg: 'Verified API72 URL!',
            variant: 'success',
            style: {},
            textColor: 'text-green-500'
        },
        error: {
            valid: false,
            msg: 'Error loading URL',
            variant: 'danger',
            style: {},
            textColor: 'text-red-500'
        },
    }

    // @ts-ignore
    const [apiURLValue, setApiURLValue] = useState(router?.query?.url);
    const [URLStatus, setURLStatus] = useState('none');

    const [passkey, setPasskey] = useState<Array<number | null>>([null, null, null, null, null, null, null, null]);
    const [autoFocusIndex, setAutoFocusIndex] = useState<number | null>(0);
    const [backspacePressed, setBackspacePressed] = useState<boolean>(false);
    const [verificationStatus, setVerificationStatus] = useState(0);
    const [redirectCountdown, setRedirectCountdown] = useState<number>(5);

    const setPasskeyValue = (val: number | null, index: number) => {
        setPasskey((prevState) => {
            const newState = prevState.slice();
            newState[index] = val;

            return newState;
        })
    }

    const onDigitInput = (
        event: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        console.log('event: ', event);
        // @ts-ignore
        const { code, key } = event;
        const isDigit = code.includes("Numpad") || code.includes("Digit");
        const isBackspace = code === "Backspace";
        let nextInputId: number | null = null;

        let backspace = false;

        if (isDigit) {
            nextInputId = index + 1;
        } else if (isBackspace) {
            if (passkey[index] === null || passkey[index] === undefined) {
                nextInputId = index - 1;
                backspace = true;
            }
        }

        if (isDigit || isBackspace) {
            const value = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key) ? parseInt(key) : null;
            setPasskeyValue(value, index)

            setAutoFocusIndex(nextInputId);
            if (backspace) {
                setBackspacePressed(true);
            }
        }

    };

    const autoFocus = () => {
        const element =
            autoFocusIndex !== null
                ? document.getElementById("val" + autoFocusIndex)
                : null;

        if (element) {
            element.focus();
        }
    };

    const verifyUserPasskey = async () => {
        const result = await signIn("credentials", {
            redirect: false,
            api_id: verifiedAPIID,
            api_user_passkey: passkey,
        });
    
        if (result?.ok) {
            console.log('session created: ', result);
        } else {
            console.log('error in creating session');
        }

        // if (passkey.join('') === userPasskey?.toString()) {
        //     const result = await signIn("credentials", {
        //         redirect: false,
        //         api_id: verifiedAPIID,
        //         api_user_passkey: passkey,
        //       });
          
        //       if (result?.ok) {
        //         console.log('session created: ', result);
        //       } else {
        //         console.log('error in creating session');
        //       }
        //     setVerificationStatus(2);
        // } else {
        //     setVerificationStatus(1)
        // }
    };

    useEffect(() => {
        if (verificationStatus === 2) {
            if (redirectCountdown === 0) {
                router.push('/portal');
            } else {
                setTimeout(() => {
                    setRedirectCountdown((prevState) => prevState - 1);
                }, 1000);
            }
        }
    }, [verificationStatus, redirectCountdown])

    useEffect(() => {
        if(backspacePressed) {
            setBackspacePressed(false);
            autoFocus();
        }
    }, [backspacePressed])

    useEffect(() => {
        setVerificationStatus(0);
    }, [passkey])

    useEffect(() => {

        let urlStatusKey = 'invalid';
        let apiID = undefined;

        if (!apiURLValue?.length) {
            urlStatusKey = 'none'
        } else {
            const regex = /(https?:(\/\/))?([a-z0-9]*)\.execute-api\.[a-z0-9-]+\.amazonaws\.com/;
            const matchRes = apiURLValue.match(regex);
            if (matchRes && matchRes[2]) {
                urlStatusKey = 'loading';
                apiID = matchRes[3];
            }
        }

        setURLStatus(urlStatusKey);

        const url = apiURLValue;

        // @ts-ignore
        if (urlStatusStates[urlStatusKey]?.valid) {

            console.log('api_id: ', apiID);

            // @ts-ignore
            verifyAPIID(apiID).then(({ verified, api_username }) => {
                if (verified) {
                    setUserName(api_username || '{unknown}');
                    setURLStatus('success');
                    setVerifiedAPIID(apiID);
                } else {
                    setUserName(null);
                    setURLStatus('invalid');
                    setVerifiedAPIID(null);
                }
                
            }).catch((err) => {
                console.log(`err: ${err}`);
                setUserName(null);
                setURLStatus('error');
                setVerifiedAPIID(null);
            });

            // @ts-ignore
            // readLedgerEntry({ api_id: apiID }).then(({ ledger_entry }) => {
            //     console.log('ledger_entry: ', ledger_entry);
            //     const api_username = ledger_entry?.value?.data.api_username;
            //     const api_user_passkey = ledger_entry?.value?.data.api_user_passkey;
            //     setURLStatus('success');
            //     setUserName(api_username || '{unknown}');
            //     setUserPasskey(api_user_passkey);
            //     console.log('ledger_entry:::: ', ledger_entry?.value);
            //     setLedgerEntry(ledger_entry?.value);

            // }).catch((err) => {
            //     console.log(`err: ${err}`);
            //     setURLStatus('error');
            // });

        }

    }, [apiURLValue]);

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
                {verificationStep === 0 ? <div className="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
                    <div className="mb-6 flex flex-column align-items-center">
                        <div className="text-900 text-xl font-bold mb-4">
                            Verify your API
                        </div>
                        {/* <img
                            src="/layout/images/avatar/avatar.png"
                            className="w-3rem h-3rem mb-2"
                            alt="Avatar"
                        /> */}
                        <span className="font-large text-yellow-500 text-bold" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {username || '...'}
                        </span>
                    </div>
                    <div className="flex flex-column">
                        <span className="p-input-icon-left w-full mb-1">
                            <i className="pi pi-lock"></i>
                            <InputText
                                id="password"
                                type="text"
                                className="w-full md:w-25rem"
                                value={apiURLValue}
                                onChange={(e) => setApiURLValue(e.target.value)}
                                placeholder="https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/v3/"
                            />
                        </span>
                        {/* @ts-ignore */}
                        <span className={`${urlStatusStates[URLStatus].textColor} font-medium mb-4`}>
                            {/* @ts-ignore */}
                            {urlStatusStates[URLStatus].msg}
                        </span>
                        <Button
                            icon={`pi pi-lock${verifiedAPIID ? '-open' : ''}`}
                            label="Continue"
                            className="w-full"
                            onClick={verifiedAPIID ? () => setVerificationStep(1) : () => {}}
                            disabled={!verifiedAPIID}
                        ></Button>
                    </div>
                </div> : <div className="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
                    <div className="mb-4">
                        <div className="text-900 text-xl font-bold mb-3">
                            {`Hello, ${username}-xxxx.xxxx`}
                        </div>
                        <span className="text-600 font-medium">
                            Please enter your 8 digit user passkey for your API72 url.
                        </span>
                        <div className="text-600 font-medium mt-1 mb-4" style={{ fontSize: '0.8rem'}}>
                            <span className="text-green-500" style={{ fontWeight: 'bold' }}>Verified API:&nbsp;</span>https://u0thn4gdw3.execute-api.us-east-2.amazonaws.com/v3/
                        </div>
                        {/* <div className="flex align-items-center mt-1">
                            <i className="pi pi-user text-600"></i>
                            <span className="text-900 font-bold ml-2">
                                compulsory-pink-fowl-xxxx.xxxx
                            </span>
                        </div> */}
                    </div>
                    <div className="flex flex-column">
                        <div className="flex justify-content-between w-full align-items-center mb-4 gap-3">
                            <InputNumber
                                id="input0"
                                inputId="val0"
                                value={passkey[0]}
                                onKeyDown={(e) => onDigitInput(e, 0)}
                                onKeyUp={() => autoFocus()}
                                inputClassName="w-3rem text-center"
                                maxLength={1}
                                autoFocus
                                disabled={verificationStatus === 2}
                            ></InputNumber>
                            <InputNumber
                                id="input1"
                                inputId="val1"
                                value={passkey[1]}
                                onKeyDown={(e) => onDigitInput(e, 1)}
                                onKeyUp={() => autoFocus()}
                                inputClassName="w-3rem text-center"
                                maxLength={1}
                                disabled={verificationStatus === 2}
                            ></InputNumber>
                            <InputNumber
                                id="input2"
                                inputId="val2"
                                value={passkey[2]}
                                onKeyDown={(e) => onDigitInput(e, 2)}
                                onKeyUp={() => autoFocus()}
                                inputClassName="w-3rem text-center"
                                maxLength={1}
                                disabled={verificationStatus === 2}
                            ></InputNumber>
                            <InputNumber
                                id="input3"
                                inputId="val3"
                                value={passkey[3]}
                                onKeyDown={(e) => onDigitInput(e, 3)}
                                onKeyUp={() => autoFocus()}
                                inputClassName="w-3rem text-center"
                                maxLength={1}
                                disabled={verificationStatus === 2}
                            ></InputNumber>
                            <InputNumber
                                id="input4"
                                inputId="val4"
                                value={passkey[4]}
                                onKeyDown={(e) => onDigitInput(e, 4)}
                                onKeyUp={() => autoFocus()}
                                inputClassName="w-3rem text-center"
                                maxLength={1}
                                disabled={verificationStatus === 2}
                            ></InputNumber>
                            <InputNumber
                                id="input5"
                                inputId="val5"
                                value={passkey[5]}
                                onKeyDown={(e) => onDigitInput(e, 5)}
                                onKeyUp={() => autoFocus()}
                                inputClassName="w-3rem text-center"
                                maxLength={1}
                                disabled={verificationStatus === 2}
                            ></InputNumber>
                            <InputNumber
                                id="input6"
                                inputId="val6"
                                value={passkey[6]}
                                onKeyDown={(e) => onDigitInput(e, 6)}
                                onKeyUp={() => autoFocus()}
                                inputClassName="w-3rem text-center"
                                maxLength={1}
                                disabled={verificationStatus === 2}
                            ></InputNumber>
                            <InputNumber
                                id="input7"
                                inputId="val7"
                                value={passkey[7]}
                                onKeyDown={(e) => onDigitInput(e, 7)}
                                onKeyUp={() => autoFocus()}
                                inputClassName="w-3rem text-center"
                                maxLength={1}
                                disabled={verificationStatus === 2}
                            ></InputNumber>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-content-between">
                            {/* <Button
                                label="Cancel"
                                outlined
                                className="flex-auto"
                                onClick={() => router.push("/")}
                            ></Button> */}
                            <Button
                                label={['Verify', 'Try again', 'Continue'][verificationStatus]}
                                className="flex-auto"
                                onClick={() => {
                                    if (verificationStatus === 2) {
                                        router.push('/portal')
                                    } else {
                                        verifyUserPasskey();
                                    }
                                }}
                                disabled={passkey.some((v) => (v === null || v === undefined))}
                            ></Button>
                        </div>
                        {verificationStatus === 1 && <div className="text-600 font-medium mt-1 mt-1" style={{ fontSize: '0.8rem'}}>
                            <span className="text-red-500" style={{ fontWeight: 'bold' }}>Incorrect passkey:&nbsp;</span>check the email sent to you with your passkey.
                        </div>}
                        {verificationStatus === 2 && <div className="text-600 font-medium mt-1 mt-1" style={{ fontSize: '0.8rem'}}>
                            <span className="text-blue-500" style={{ fontWeight: 'bold' }}>Successfull:&nbsp;</span>{`redirecting in ${redirectCountdown} seconds`}
                        </div>}
                    </div>
                </div>}
            </div>
        </>
    );
};

export default VerifyAPI;
