"use client";
import { useSession, signIn } from "next-auth/react";

import type { Demo } from "@/types";
import { ChartData, ChartOptions } from "chart.js";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import { Tag } from "primereact/tag";
import { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "@/layout/context/layoutcontext";
import CountdownTimer from "@/demo/components/apps/countdowntimer";
import { randomUsernameGenerator } from '@/utils/utils';
import moment from 'moment';

const Portal = () => {
    const { data: session, status } = useSession();

    const [username, setUserName] = useState('');
    const [userAPIURL, setUserAPIURL] = useState('');
    const [chartOptions, setChartOptions] = useState({});
    const [chartData, setChartData] = useState({});
    const [price, setPrice] = useState(0);
    const { layoutConfig } = useContext(LayoutContext);
    const dt = useRef<DataTable<Demo.Payment[]>>(null);

    const payments: Demo.Payment[] = [
        { name: "Electric Bill", amount: 75.6, paid: true, date: "06/04/2022" },
        { name: "Water Bill", amount: 45.5, paid: true, date: "07/04/2022" },
        { name: "Gas Bill", amount: 45.2, paid: false, date: "12/04/2022" },
        { name: "Internet Bill", amount: 25.9, paid: true, date: "17/04/2022" },
        { name: "Streaming", amount: 40.9, paid: false, date: "20/04/2022" },
    ];

    const formatCurrency = (value: number) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const initChart = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
            "--text-color-secondary"
        );
        const surfaceBorder =
            documentStyle.getPropertyValue("--surface-border");

        const data: ChartData = {
            labels: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
            ],
            datasets: [
                {
                    label: "Income",
                    data: [6500, 5900, 8000, 8100, 5600, 5500, 4000],
                    fill: false,
                    tension: 0.4,
                    borderColor: documentStyle.getPropertyValue("--green-500"),
                },
                {
                    label: "Expenses",
                    data: [1200, 5100, 6200, 3300, 2100, 6200, 4500],
                    fill: true,
                    borderColor: "#6366f1",
                    tension: 0.4,
                    backgroundColor: "rgba(99,102,220,0.2)",
                },
            ],
        };

        const options: ChartOptions = {
            animation: {
                duration: 0,
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || "";

                            if (label) {
                                label += ": ";
                            }

                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(context.parsed.y);
                            }
                            return label;
                        },
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
        };

        setChartData(data);
        setChartOptions(options);
    };

    useEffect(() => {
        initChart();
    }, [layoutConfig]);

    const nameBodyTemplate = (rowData: Demo.Payment) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const amountBodyTemplate = (rowData: Demo.Payment) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.amount)}
            </>
        );
    };

    const dateBodyTemplate = (rowData: Demo.Payment) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.date}
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Payment) => {
        return (
            <>
                {rowData.paid ? (
                    <Tag value="COMPLETED" severity="success"></Tag>
                ) : (
                    <Tag value="PENDING" severity="warning"></Tag>
                )}
            </>
        );
    };

    // @ts-ignore
    const expirationDate = session?.user?.data?.date_renewed || session?.user?.data?.date_created;
    const expirationDateMsg = expirationDate ? `on ${moment(expirationDate).add(72, 'hours').calendar()}` : 'on...'

    useEffect(() => {
        // @ts-ignore
        if (session?.user?.data) {
            // @ts-ignore
            setUserName(session?.user?.data?.api_username);
            // @ts-ignore
            setUserAPIURL(session?.user?.data?.api_url);
            // @ts-ignore
            console.log(moment(session?.user?.data?.date_created).add(72, 'hours').calendar())
        }
        
    }, [session])

    return (
        <div className="grid">
            <div className="col-12">
                <div className="flex flex-column sm:flex-row align-items-center gap-4">
                    <div className="flex flex-column sm:flex-row align-items-center gap-3">
                        {/* <img
                            alt="avatar"
                            src={`/demo/images/avatar/circle/avatar-f-1.png`}
                            className="w-4rem h-4rem flex-shrink-0"
                        /> */}
                        <div className="flex flex-column align-items-center sm:align-items-start">
                            <span className="text-900 font-bold text-4xl">
                                {`${username}-xxxx.xxxx`}
                            </span>
                            <p className="text-600 m-0">
                                {userAPIURL}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 sm:ml-auto">
                        {/* <Button
                            type="button"
                            tooltip="Exchange"
                            tooltipOptions={{ position: "bottom" }}
                            icon="pi pi-arrows-h"
                            outlined
                            rounded
                        ></Button>
                        <Button
                            type="button"
                            tooltip="Withdraw"
                            tooltipOptions={{ position: "bottom" }}
                            icon="pi pi-download"
                            outlined
                            rounded
                        ></Button>
                        <Button
                            type="button"
                            tooltip="Send"
                            tooltipOptions={{ position: "bottom" }}
                            icon="pi pi-send"
                            rounded
                        ></Button> */}
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 xl:col-4">
                <div className="card h-full relative overflow-hidden">
                    <svg
                        id="visual"
                        viewBox="0 0 900 600"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        className="absolute left-0 top-0 h-full w-full z-1"
                        preserveAspectRatio="none"
                    >
                        <rect
                            x="0"
                            y="0"
                            width="900"
                            height="600"
                            fill="var(--primary-600)"
                        ></rect>
                        <path
                            d="M0 400L30 386.5C60 373 120 346 180 334.8C240 323.7 300 328.3 360 345.2C420 362 480 391 540 392C600 393 660 366 720 355.2C780 344.3 840 349.7 870 352.3L900 355L900 601L870 601C840 601 780 601 720 601C660 601 600 601 540 601C480 601 420 601 360 601C300 601 240 601 180 601C120 601 60 601 30 601L0 601Z"
                            fill="var(--primary-500)"
                            strokeLinecap="round"
                            strokeLinejoin="miter"
                        ></path>
                    </svg>
                    <div className="z-2 relative text-white">
                        <div className="text-xl font-semibold mb-3">
                            Expires in
                        </div>
                        <div className="mb-3">
                            <CountdownTimer
                                duration={60 * 60 * 72 * 1000}
                                updateInterval={3600 * 10}
                                suffix="hrs"
                                width={191}
                                style={{ fontSize: 44, fontWeight: 'bold' }}
                            />
                        </div>
                        
                        <div className="flex align-items-center justify-content-between">
                            {/* @ts-ignore */}
                            <span className="text-lg">{expirationDateMsg}</span>
                            <span className="product-badge status-yellow">
                                RENEW
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="col-12 md:col-6 xl:col-4">
                <div className="card h-full">
                    <div className="flex align-items-center justify-content-between mb-3">
                        <div className="text-900 text-xl font-semibold">
                            Daily Diagnostics
                        </div>
                    </div>
                    <div className="flex flex-row mb-6" style={{ marginTop: 21 }}>
                        <span className="product-badge status-yellow mr-2">
                            0 Warnings
                        </span>
                        <span className="product-badge status-pink">
                            0 Errors
                        </span>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-900 text-lg">
                            01/23/2024
                        </span>
                        <span className="product-badge status-light">
                            Review
                        </span>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 xl:col-2">
                <div className="card h-full flex flex-column align-items-center justify-content-center">
                    <i className="pi pi-fw pi-cloud-upload text-primary text-4xl mb-4"></i>
                    <span className="text-900 text-lg mb-4 font-medium">
                        API Calls
                    </span>
                    <span className="text-900 text-2xl text-primary font-bold">
                        23.56k
                    </span>
                </div>
            </div>
            <div className="col-12 md:col-6 xl:col-2">
                <div className="card h-full flex flex-column align-items-center justify-content-center">
                    <i className="pi pi-fw pi-globe text-primary text-4xl mb-4"></i>
                    <span className="text-900 text-lg mb-4 font-medium">
                        Resources
                    </span>
                    <div className="flex flex-row">
                        <div className="text-green-500 flex flex-col align-items-center justify-content-center">
                            <span className="font-medium">+200</span>
                            <i className="pi pi-arrow-up text-xs ml-2 mr-3"></i>
                        </div>
                        <div className="text-pink-500 flex flex-col align-items-center justify-content-center">
                            <span className="font-medium">-96</span>
                            <i className="pi pi-arrow-down text-xs ml-2"></i>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* <div className="col-12 xl:col-12">
                <div className="card" style={{ maxHeight: 600, overflowY: 'scroll' }}>
                    <div className="text-900 text-xl font-semibold mb-3">
                        Recent Event Logs
                    </div>
                    <ul className="list-none p-0 m-0">
                        <li className="flex align-items-center p-3 mb-3 border-bottom-1 surface-border">
                            <img
                                alt="brands"
                                src={`/demo/images/banking/airbnb.png`}
                                className="w-3rem flex-shrink-0 mr-3"
                            />
                            <div className="flex flex-column">
                                <span className="text-xl font-medium text-900 mb-1">
                                    Airbnb
                                </span>
                                <span>05/23/2022</span>
                            </div>
                            <span className="text-xl text-900 ml-auto font-semibold">
                                $250.00
                            </span>
                        </li>
                        <li className="flex align-items-center p-3 mb-3 border-bottom-1 surface-border">
                            <img
                                alt="brands"
                                src={`/demo/images/banking/amazon.png`}
                                className="w-3rem flex-shrink-0 mr-3"
                            />
                            <div className="flex flex-column">
                                <span className="text-xl font-medium text-900 mb-1">
                                    Amazon
                                </span>
                                <span>04/12/2022</span>
                            </div>
                            <span className="text-xl text-900 ml-auto font-semibold">
                                $50.00
                            </span>
                        </li>
                        <li className="flex align-items-center p-3 mb-3 border-bottom-1 surface-border">
                            <img
                                alt="brands"
                                src={`/demo/images/banking/nike.svg`}
                                className="w-3rem flex-shrink-0 mr-3 border-circle"
                            />
                            <div className="flex flex-column">
                                <span className="text-xl font-medium text-900 mb-1">
                                    Nike Store
                                </span>
                                <span>04/29/2022</span>
                            </div>
                            <span className="text-xl text-900 ml-auto font-semibold">
                                $60.00
                            </span>
                        </li>
                        <li className="flex align-items-center p-3 mb-3 border-bottom-1 surface-border">
                            <img
                                alt="brands"
                                src={`/demo/images/banking/starbucks.svg`}
                                className="w-3rem flex-shrink-0 mr-3"
                            />
                            <div className="flex flex-column">
                                <span className="text-xl font-medium text-900 mb-1">
                                    Starbucks
                                </span>
                                <span>04/15/2022</span>
                            </div>
                            <span className="text-xl text-900 ml-auto font-semibold">
                                $15.24
                            </span>
                        </li>
                        <li className="flex align-items-center p-3 mb-3">
                            <img
                                alt="brands"
                                src={`/demo/images/banking/amazon.png`}
                                className="w-3rem flex-shrink-0 mr-3"
                            />
                            <div className="flex flex-column">
                                <span className="text-xl font-medium text-900 mb-1">
                                    Amazon
                                </span>
                                <span>04/12/2022</span>
                            </div>
                            <span className="text-xl text-900 ml-auto font-semibold">
                                $12.50
                            </span>
                        </li>
                    </ul>
                </div>
            </div> */}
            {/* <div className="col-12 xl:col-8">
                <div className="card">
                    <div className="text-900 text-xl font-semibold mb-3">
                        Overview
                    </div>
                    <Chart
                        type="line"
                        data={chartData}
                        options={chartOptions}
                    ></Chart>
                </div>
            </div> */}
        </div>
    );
};

export default Portal;