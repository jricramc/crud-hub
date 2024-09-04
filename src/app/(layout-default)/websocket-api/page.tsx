"use client";
import moment from "moment";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Chips } from "primereact/chips";
import { InputNumber } from "primereact/inputnumber";
import { TabPanel, TabView } from "primereact/tabview";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";

const WebsocketAPIPage = () => {

    return (
        <div className="grid">
            <div className="col-12 mb-4">
                <div className="flex flex-column sm:flex-row align-items-center gap-4">
                    <div className="flex flex-column sm:flex-row align-items-center gap-3">
                        <div className="flex flex-column align-items-center sm:align-items-start">
                            <span className="text-900 font-bold text-4xl">
                                Websocket API
                            </span>
                            <div className="flex flex-row align-items-start">
                                <span
                                    className="customer-badge status-blue mr-3"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {}}
                                >
                                    Launch
                                </span>
                                {/* <span className="product-badge status-green mr-3">
                                    Online
                                </span> */}
                                <span className="text-600 m-0">
                                    {`{ no websocket api url deployed }`}
                                    {/* wss://a7uirjun9k.execute-api.us-east-2.amazonaws.com/stage-test-0-eqy3zt-KMrU6-117be9d/ */}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card w-full">
                <TabView>
                    <TabPanel header="Overview">

                        <div className="grid">
                            <div className="col-12 xl:col-10">
                                <span className="text-900 block font-medium mt-2 mb-2 font-bold">
                                    About
                                </span>
                                <p className="line-height-3 text-600 p-0 mx-0 mt-0 mb-4">
                                    Out-of-box solution for realtime websocket communication with pre-built features useful for prototyping chat applications, game design, and data collection. For more information visit API72 documentation website. 
                                </p>
                            </div>
                            <div className="col-12 xl:col-10">
                                <span className="text-900 block font-medium mb-2 font-bold">
                                    Technical features
                                </span>
                                <ul className="py-0 pl-3 m-0 text-600 mb-3">
                                    <li className="mb-2"><span className="text-yellow-500">Powered by AWS ApiGateway Websocket</span></li>
                                </ul>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Rooms">
                        <div className="grid">
                            <div className="col-12">
                                <div className="flex flex-row align-items-center mb-4 mt-2">
                                    {/* <div className="text-900 font-bold text-3xl">
                                        Rooms
                                    </div> */}
                                    <span
                                        className="font-bold"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {}}
                                    >
                                        Using 5 out of 10 available room connections
                                    </span>
                                </div>
                                <ul className="list-none p-0 m-0">
                                    <li className="pb-5 border-bottom-1 surface-border">
                                        <div className="flex flex-row align-items-center justify-content-between">
                                            <div className="text-900 font-bold text-xl my-3">
                                                {`{ myroom }`}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 align-items-center mb-2">
                                            <Chip style={{ borderRadius: 5, cursor: 'pointer' }} label="12 Live connections"></Chip>
                                            <Chip style={{ borderRadius: 5, cursor: 'pointer' }} label="View room data"></Chip>
                                        </div>
                                        <span className="font-sm">{`active ${moment().fromNow()}`}</span>
                                    </li>
                                    <li className="pb-5 border-bottom-1 surface-border">
                                        <div className="flex flex-row align-items-center justify-content-between">
                                            <div className="text-900 font-bold text-xl my-3">
                                                {`{ myroom }`}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 align-items-center mb-2">
                                            <Chip style={{ borderRadius: 5, cursor: 'pointer' }} label="12 Live connections"></Chip>
                                            <Chip style={{ borderRadius: 5, cursor: 'pointer' }} label="View room data"></Chip>
                                        </div>
                                        <span className="font-sm">{`active ${moment().fromNow()}`}</span>
                                    </li>
                                    <li className="pb-5 border-bottom-1 surface-border">
                                        <div className="flex flex-row align-items-center justify-content-between">
                                            <div className="text-900 font-bold text-xl my-3">
                                                {`{ myroom }`}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 align-items-center mb-2">
                                            <Chip style={{ borderRadius: 5, cursor: 'pointer' }} label="12 Live connections"></Chip>
                                            <Chip style={{ borderRadius: 5, cursor: 'pointer' }} label="View room data"></Chip>
                                        </div>
                                        <span className="font-sm">{`active ${moment().fromNow()}`}</span>
                                    </li>
                                    <li className="pb-5 border-bottom-1 surface-border">
                                        <div className="flex flex-row align-items-center justify-content-between">
                                            <div className="text-900 font-bold text-xl my-3">
                                                {`{ myroom }`}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 align-items-center mb-2">
                                            <Chip style={{ borderRadius: 5, cursor: 'pointer' }} label="12 Live connections"></Chip>
                                            <Chip style={{ borderRadius: 5, cursor: 'pointer' }} label="View room data"></Chip>
                                        </div>
                                        <span className="font-sm">{`active ${moment().fromNow()}`}</span>
                                    </li>
                                    <li className="pb-5 border-bottom-1 surface-border">
                                        <div className="flex flex-row align-items-center justify-content-between">
                                            <div className="text-900 font-bold text-xl my-3">
                                                {`{ myroom }`}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 align-items-center mb-2">
                                            <Chip style={{ borderRadius: 5, cursor: 'pointer' }} label="12 Live connections"></Chip>
                                            <Chip style={{ borderRadius: 5, cursor: 'pointer' }} label="View room data"></Chip>
                                        </div>
                                        <span className="font-sm">{`active ${moment().fromNow()}`}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
}

export default WebsocketAPIPage;
