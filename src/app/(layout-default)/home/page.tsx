"use client";
import { useSession } from "next-auth/react";
import moment from 'moment';
import type { ChartDataState, ChartOptionsState, Demo } from "@/types";
import { ChartData, ChartOptions } from "chart.js";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Rating } from "primereact/rating";
import { Tooltip } from "primereact/tooltip";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ProductService } from "../../../../demo/service/ProductService";
import { LayoutContext } from "../../../../layout/context/layoutcontext";

import TreeDemo from "./tree";
import CountdownTimer from "@/demo/components/apps/countdowntimer";
import { renewLedgerEntry } from "@/utils/session/apiCalls";

export default function APINetwork() {
    const { data: session, status, update: updateSession } = useSession();

    const [username, setUserName] = useState('');
    const [userAPIURL, setUserAPIURL] = useState('');
    const [apiDateRenewed, setApiDateRenewed] = useState<string | null>(null);
    const [initHours, setInitHours] = useState<number | null>(null);
    const [displayRenewDialog, setDisplayRenewDialog] = useState<boolean>(false);
    // 0: idle, 1: requesting renewal, 2: renewal error, 3: successfully renewed 
    const [renewingAPI, setRenewingAPI] = useState<0 | 1 | 2 | 3>(0);
    // @ts-ignore
    const apiCreatedDate = session?.user?.data?.date_created;
    const apiCreatedDateMsg = apiCreatedDate
        ? `Created on ${moment(apiCreatedDate).format('ll')}`
        : 'Created on...';

    const [products, setProducts] = useState<Demo.Product[]>([]);
    const [chartOptions, setChartOptions] = useState<ChartOptionsState>({});
    const [weeks] = useState([
        {
            label: "Last Week",
            value: 0,
            data: [
                [65, 59, 80, 81, 56, 55, 40],
                [28, 48, 40, 19, 86, 27, 90],
            ],
        },
        {
            label: "This Week",
            value: 1,
            data: [
                [35, 19, 40, 61, 16, 55, 30],
                [48, 78, 10, 29, 76, 77, 10],
            ],
        },
    ]);
    const [chartData, setChartData] = useState<ChartDataState>({});
    const [selectedWeek, setSelectedWeek] = useState(0);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const { layoutConfig } = useContext(LayoutContext);
    const dt = useRef<DataTable<any>>(null);
    const knobValue = 90;

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const onWeekChange = (e: DropdownChangeEvent) => {
        let newBarData = { ...chartData.barData };
        (newBarData.datasets as any)[0].data = weeks[e.value].data[0];
        (newBarData.datasets as any)[1].data[1] = weeks[e.value].data[1];
        setSelectedWeek(e.value);
        setChartData((prevState: ChartDataState) => ({
            ...prevState,
            barData: {
                ...prevState.barData,
                datasets: newBarData.datasets || [],
            },
        }));
    };
    const onGlobalFilterChange: React.ChangeEventHandler<HTMLInputElement> = (
        e
    ) => {
        const value = e.target.value;
        let _filters = { ...filters };
        (_filters["global"] as any).value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                ],
            },
            "country.name": {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                ],
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.DATE_IS },
                ],
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.EQUALS },
                ],
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [
                    { value: null, matchMode: FilterMatchMode.EQUALS },
                ],
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS },
        });
        setGlobalFilterValue("");
    };

    const nameBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price as number)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Product) => {
        const badgeClass = rowData.inventoryStatus?.toLowerCase();
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={"product-badge status-" + badgeClass}>
                    {rowData.inventoryStatus}
                </span>
            </>
        );
    };

    const searchBodyTemplate = () => {
        return (
            <>
                <Button
                    type="button"
                    icon="pi pi-search"
                    outlined
                    rounded
                ></Button>
            </>
        );
    };

    // @ts-ignore
    const expirationDateMsg = apiDateRenewed ? `on ${moment(apiDateRenewed).add(72, 'hours').calendar()}` : 'on...';

    const handleRenewLedgerEntry = async () => {
        setRenewingAPI(1);
        const res = await renewLedgerEntry(session);

        updateSession({
            user: {
                data: {
                    date_renewed: res.date_renewed
                }
            }
        });
        
        setRenewingAPI(3);
    };

    useEffect(() => {
        ProductService.getProductsSmall().then((data) => setProducts(data));
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor =
            documentStyle.getPropertyValue("--text-color") || "#1e293b";
        const textColorSecondary =
            documentStyle.getPropertyValue("--text-color-secondary") ||
            "#64748b";
        const surfaceBorder =
            documentStyle.getPropertyValue("--surface-border") || "#dfe7ef";
        const pieData: ChartData = {
            labels: ["Electronics", "Fashion", "Household"],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        documentStyle.getPropertyValue("--primary-700") ||
                            "#4547a9",
                        documentStyle.getPropertyValue("--primary-400") ||
                            "#8183f4",
                        documentStyle.getPropertyValue("--primary-100") ||
                            "#dadafc",
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue("--primary-600") ||
                            "#5457cd",
                        documentStyle.getPropertyValue("--primary-300") ||
                            "#9ea0f6",
                        documentStyle.getPropertyValue("--primary-200") ||
                            "#bcbdf9",
                    ],
                },
            ],
        };

        const pieOptions: ChartOptions = {
            animation: {
                duration: 0,
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {
                            weight: "700",
                        },
                        padding: 28,
                    },
                    position: "bottom",
                },
            },
        };

        const barData: ChartData = {
            labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
            datasets: [
                {
                    label: "Revenue",
                    backgroundColor:
                        documentStyle.getPropertyValue("--primary-500") ||
                        "#6366f1",
                    barThickness: 12,
                    borderRadius: 12,
                    data: weeks[selectedWeek].data[0],
                },
                {
                    label: "Profit",
                    backgroundColor:
                        documentStyle.getPropertyValue("--primary-200") ||
                        "#bcbdf9",
                    barThickness: 12,
                    borderRadius: 12,
                    data: weeks[selectedWeek].data[1],
                },
            ],
        };

        const barOptions: ChartOptions = {
            animation: {
                duration: 0,
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {
                            weight: "700",
                        },
                        padding: 28,
                    },
                    position: "bottom",
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: "500",
                        },
                    },
                    grid: {
                        display: false,
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
        setChartOptions({
            barOptions,
            pieOptions,
        });
        setChartData({
            barData,
            pieData,
        });
        initFilters();
    }, [weeks, selectedWeek, layoutConfig]);

    useEffect(() => {
        // @ts-ignore
        if (session?.user?.data) {
            // @ts-ignore
            setUserName(session?.user?.data?.api_username);
            // @ts-ignore
            setUserAPIURL(session?.user?.data?.api_url);
            // @ts-ignore
            setApiDateRenewed(session?.user?.data?.date_renewed);

            // @ts-ignore
            const endTime = moment(session?.user?.data?.date_renewed).add(72, 'hours');
            const startTime = moment();

            const differenceInHours = endTime.diff(startTime, 'hours', true);
            const roundedDifference = Math.round(differenceInHours * 100) / 100;
            setInitHours(roundedDifference);
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
                            {initHours !== null && <CountdownTimer
                                key={`countdowntimer-${apiDateRenewed ?? 'default'}`}
                                duration={60 * 60 * initHours * 1000}
                                updateInterval={3600 * 10}
                                suffix="hrs"
                                width={191}
                                style={{ fontSize: 44, fontWeight: 'bold' }}
                            />}
                        </div>
                        
                        <div className="flex align-items-center justify-content-between">
                            {/* @ts-ignore */}
                            <span className="text-lg">{expirationDateMsg}</span>
                            <Button
                                className="product-badge status-yellow"
                                label="Renew"
                                onClick={() => {
                                    setRenewingAPI(0);
                                    setDisplayRenewDialog(true);
                                }}/>
                            <Dialog
                                header="Renew API"
                                visible={displayRenewDialog}
                                style={{ width: "30vw", minWidth: 300 }}
                                modal
                                onHide={() => setDisplayRenewDialog(false)}
                            >
                                <div className="flex flex-wrap gap-2 justify-content-between">
                                    <p>
                                        All APIs expire within 72 hours of the time they were created or "renewed". <br></br><br></br>By clicking "Renew" you will be given a new expiration date 72 hours from now. This renewal will have no affect on the architecture and integrity of your API. 
                                    </p>
                                    {(renewingAPI === 0 || renewingAPI === 2) && <Button
                                    label={{0: 'Renew', 2: 'Try again'}[renewingAPI]}
                                    className="flex-auto"
                                    onClick={handleRenewLedgerEntry}
                                    ></Button>}
                                    {renewingAPI === 1 && <div className="text-600 font-medium mt-1 mt-1" style={{ fontSize: '0.8rem'}}>
                                        <span className="text-600" style={{ fontWeight: 'bold' }}>Requesting renewal...&nbsp;</span>
                                    </div>}
                                    {renewingAPI === 2 && <div className="text-600 font-medium mt-1 mt-1" style={{ fontSize: '0.8rem'}}>
                                        <span className="text-red-500" style={{ fontWeight: 'bold' }}>Error:&nbsp;</span>unable to request renewal
                                    </div>}
                                    {renewingAPI === 3 && <div className="text-600 font-medium mt-1 mt-1" style={{ fontSize: '0.8rem'}}>
                                        <div className="text-blue-500" style={{ fontWeight: 'bold' }}>Successful</div>
                                        <div>{`Your API now expires ${expirationDateMsg}`}</div>
                                    </div>}
                                </div>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="col-12 md:col-4 xl:col4">
                <div className="card h-full">
                    <span className="font-semibold text-md">{apiCreatedDateMsg}</span>
                    <div className="flex justify-content-between align-items-start mt-3">
                        <div className="w-12">
                            <span className="text-4xl font-bold text-900">
                                CORE API
                            </span>
                            <div className="flex flex-row">
                                <div className="text-green-500 flex-1">
                                    <span className="font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex align-items-center justify-content-between mt-4">
                        <span className="text-sm">d3zua21hwcw3v.cloudfront.net</span>
                    </div>
                </div>
            </div> */}
            <div className="col-12 md:col-4 xl:col4">
                <div className="card h-full">
                    <span className="font-semibold text-md">AWS Websocket API</span>
                    <div className="flex justify-content-between align-items-start mt-3">
                        <div className="w-12">
                            <span className="text-4xl font-bold text-900">
                                Websocket
                            </span>
                            <div className="flex flex-row">
                                <div className="text-green-500 flex-1">
                                    <span className="font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex align-items-center justify-content-between mt-4">
                        {/* @ts-ignore */}
                        <span className="text-sm">wss://a7uirjun9k.execute-api.us-east-2...</span>
                    </div>
                </div>
            </div>
            {/* <div className="col-12 md:col-4 xl:col4">
                <div className="card h-full">
                    <span className="font-semibold text-md">MongoDB Integration</span>
                    <div className="flex justify-content-between align-items-start mt-3">
                        <div className="w-12">
                            <span className="text-4xl font-bold text-900">
                                Database
                            </span>
                            <div className="flex flex-row">
                                <div className="text-green-500 flex-1">
                                    <span className="font-medium">Connected</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="col-12 md:col-4 xl:col4">
                <div className="card h-full">
                    <div className="flex flex-row">
                        <span className="font-semibold text-md flex-1">Next.js Website</span>
                        <span className="product-badge status-light">
                            Coming soon
                        </span>
                    </div>
                    
                    <div className="flex justify-content-between align-items-start mt-3">
                        <div className="w-12">
                            <span className="text-4xl font-bold text-900">
                                Frontend
                            </span>
                            <div className="flex flex-row">
                                <div className="text-color-secondary flex-1">
                                    <span className="font-medium">No Integration</span>
                                    {/* <i className="pi pi-arrow-up text-xs ml-2"></i> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex align-items-center justify-content-between mt-4">
                        {/* @ts-ignore */}
                        <span className="text-sm">{`{ no website url generated }`}</span>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <TreeDemo />
            </div>

            {/* <div className="col-12">
                <div className="card h-auto">
                    <div className="flex align-items-start justify-content-between mb-6">
                        <span className="text-900 text-xl font-semibold">
                            Revenue Overview
                        </span>
                        <Dropdown
                            options={weeks}
                            value={selectedWeek}
                            className="w-10rem"
                            optionLabel="label"
                            onChange={onWeekChange}
                        ></Dropdown>
                    </div>
                    <Chart
                        height="300px"
                        type="bar"
                        data={chartData.barData}
                        options={chartOptions.barOptions}
                    ></Chart>
                </div>
            </div> */}
        </div>
    );
}

