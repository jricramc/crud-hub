import { InitialData, ConnectorStyleEnum } from '@/src-isoflow/Isoflow';
import { basicIsopack, networkingIsopack, mergeIsopacks, api72Icons } from '../isopacks';
import { customVars } from '../styles/theme';
import { getColorVariant } from '../utils';

const mergedIsopacks = mergeIsopacks([basicIsopack, networkingIsopack, api72Icons]);

console.log('mergedIsopacks: ', mergedIsopacks)

export const initialData: InitialData = {
  zoom: 0.5,
  icons: mergedIsopacks,
  nodes: [
    {
      id: 'my-api',
      iconId: '4',
      label: 'Nexus',
      /* @ts-ignore */
      width: 100,
      position: {
        x: 0,
        y: 0
      },
      loading: {
        delay: 500,
        duration: 1000,
      },
    },
    {
      id: 'authentication',
      iconId: '1',
      label: 'Authentication',
      // labelHeight: 100,
      position: {
        x: 6,
        y: 3
      },
      loading: {
        delay: 2000,
        duration: 1000,
      },
    },
    {
      id: 'card-terminal',
      iconId: '2',
      label: 'Payment',
      // labelHeight: 100,
      position: {
        x: 6,
        y: -2
      },
      loading: {
        delay: 2000,
        duration: 1000,
      },
    },
    {
      id: 'data-storage',
      iconId: '3',
      label: 'Data Storage',
      // labelHeight: 100,
      position: {
        x: 0,
        y: -6
      },
      color: customVars.diagramPalette.blue,
      loading: {
        delay: 2000,
        duration: 1000,
      },
    },
    {
      id: 'aws-lambdas',
      iconId: '5',
      label: 'Execute Code',
      // labelHeight: 100,
      position: {
        x: -6,
        y: -3
      },
      loading: {
        delay: 2000,
        duration: 1000,
      },
    },
    {
      id: 'websockets',
      iconId: '6',
      label: 'Real Time Communication',
      // labelHeight: 100,
      position: {
        x: -6,
        y: 5
      },
      loading: {
        delay: 2000,
        duration: 1000,
      },
    },
    {
      id: 'client-endpoints',
      iconId: '7',
      label: 'Server',
      // labelHeight: 100,
      position: {
        x: 0,
        y: 6
      },
      loading: {
        delay: 2000,
        duration: 1000,
      },
    },
    {
      id: 'webflow',
      iconId: '8',
      label: 'Hosting',
      // labelHeight: 100,
      position: {
        x: 0,
        y: 11
      },
      loading: {
        delay: 5500,
        duration: 1000,
      },
    },
    {
      id: 'react-nextjs',
      iconId: '9',
      label: 'Next.js App',
      // labelHeight: 100,
      position: {
        x: -3,
        y: 11
      },
      loading: {
        delay: 5500,
        duration: 1000,
      },
    },
    {
      id: 'wix',
      iconId: '10',
      label: 'Node.js Server',
      // labelHeight: 100,
      position: {
        x: 3,
        y: 11
      },
      loading: {
        delay: 5500,
        duration: 1000,
      },
    },
    // {
    //   id: 'websocket-block',
    //   iconId: 'block',
    //   label: '',
    //   // labelHeight: 100,
    //   position: {
    //     x: -11,
    //     y: 5
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'lambda-1',
    //   iconId: 'block',
    //   label: '',
    //   // labelHeight: 100,
    //   position: {
    //     x: -11,
    //     y: 0
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'lambda-2',
    //   iconId: 'block',
    //   label: '',
    //   // labelHeight: 100,
    //   position: {
    //     x: -13,
    //     y: -3
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'lambda-3',
    //   iconId: 'block',
    //   label: '',
    //   // labelHeight: 100,
    //   position: {
    //     x: -11,
    //     y: -6
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'aws-s3-bucket',
    //   iconId: 'block',
    //   label: '',
    //   // labelHeight: 100,
    //   position: {
    //     x: -5,
    //     y: -11
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'dynamodb-3',
    //   iconId: 'block',
    //   label: '',
    //   // labelHeight: 100,
    //   position: {
    //     x: 8,
    //     y: -11
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'dynamodb-2',
    //   iconId: 'block',
    //   label: '',
    //   // labelHeight: 100,
    //   position: {
    //     x: 3,
    //     y: -11
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'dynamodb-1',
    //   iconId: 'block',
    //   label: '',
    //   // labelHeight: 100,
    //   position: {
    //     x: 5,
    //     y: -15
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'stripe-api-payment',
    //   iconId: 'block',
    //   label: '',
    //   position: {
    //     x: 11,
    //     y: -2
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'google-oauthentication',
    //   iconId: 'block',
    //   label: '',
    //   position: {
    //     x: 11,
    //     y: 3
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // }
  ],
  connectors: [
    // {
    //   id: '1',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'client-endpoints' }, { nodeId: 'wix' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple }
    //   ],
    // },
    // {
    //   id: '2',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'client-endpoints' }, { nodeId: 'webflow' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: '3',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'client-endpoints' }, { nodeId: 'react-nextjs' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: '4',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'websockets' }, { nodeId: 'websocket-block' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: customVars.diagramPalette.yellow }
    //   ],
    // },
    // {
    //   id: '5',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'aws-lambdas' }, { nodeId: 'lambda-1' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: customVars.diagramPalette.orange }
    //   ],
    // },
    // {
    //   id: '6',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'aws-lambdas' }, { nodeId: 'lambda-2' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: customVars.diagramPalette.orange }
    //   ],
    // },
    // {
    //   id: '7',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'aws-lambdas' }, { nodeId: 'lambda-3' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: customVars.diagramPalette.orange }
    //   ],
    // },
    // {
    //   id: '8',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'data-storage' }, { nodeId: 'aws-s3-bucket' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: customVars.diagramPalette.blue }
    //   ],
    // },
    // {
    //   id: '9',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'data-storage' }, { nodeId: 'dynamodb-1' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: '10',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'data-storage' }, { nodeId: 'dynamodb-2' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: '11',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'data-storage' }, { nodeId: 'dynamodb-3' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: '12',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'card-terminal' }, { nodeId: 'stripe-api-payment' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: customVars.diagramPalette.yellow }
    //   ],
    // },
    // {
    //   id: '13',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [
    //     { nodeId: 'authentication' },
    //     { nodeId: 'google-oauthentication' }
    //   ],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: customVars.diagramPalette.green }
    //   ],
    // },
    // {
    //   id: '14',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'my-api' }, { nodeId: 'card-terminal' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 2000,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple },
    //     { color: customVars.diagramPalette.yellow }
    //   ],
    // },
    // {
    //   id: '15',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'my-api' }, { nodeId: 'authentication' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 2000,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple },
    //     { color: customVars.diagramPalette.green }
    //   ],
    // },
    // {
    //   id: '16',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'my-api' }, { nodeId: 'client-endpoints' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 2000,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple }
    //   ],
    // },
    // {
    //   id: '17',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'my-api' }, { nodeId: 'websockets' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 2000,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple },
    //     { color: customVars.diagramPalette.yellow }
    //   ],
    // },
    // {
    //   id: '18',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'my-api' }, { nodeId: 'aws-lambdas' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 2000,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple },
    //     { color: customVars.diagramPalette.orange }
    //   ],
    // },
    // {
    //   id: '19',
    //   style: ConnectorStyleEnum.DASHED,
    //   width: 10,
    //   anchors: [{ nodeId: 'my-api' }, { nodeId: 'data-storage' }],
    //   color: customVars.diagramPalette.grey,
    //   loading: {
    //     delay: 2000,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple },
    //     { color: customVars.diagramPalette.blue },
    //   ],
    // }
  ],
  rectangles: [
    // {
    //   id: 'core-api-group',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: -7,
    //     y: -7
    //   },
    //   to: {
    //     x: 7,
    //     y: 7
    //   },
    //   label: 'Core API',
    //   loading: {
    //     delay: 500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple }
    //   ],
    // },
    // {
    //   id: 'aws-s3-bucket-group',
    //   color: customVars.diagramPalette.blue,
    //   from: {
    //     x: -4,
    //     y: -10
    //   },
    //   to: {
    //     x: -6,
    //     y: -12
    //   },
    //   label: 'AWS S3 Bucket',
    //   loading: {
    //     delay: 3500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'aws-dynamodb-group',
    //   color: customVars.diagramPalette.blue,
    //   from: {
    //     x: 2,
    //     y: -10
    //   },
    //   to: {
    //     x: 9,
    //     y: -16
    //   },
    //   label: 'AWS DynamoDB',
    //   loading: {
    //     delay: 3500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'aws-lambda-group',
    //   color: customVars.diagramPalette.orange,
    //   from: {
    //     x: -10,
    //     y: 1
    //   },
    //   to: {
    //     x: -14,
    //     y: -7
    //   },
    //   label: 'AWS Lambda',
    //   loading: {
    //     delay: 3500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'aws-websockets-group',
    //   color: customVars.diagramPalette.yellow,
    //   from: {
    //     x: -10,
    //     y: 4
    //   },
    //   to: {
    //     x: -12,
    //     y: 6
    //   },
    //   label: 'AWS Websockets',
    //   loading: {
    //     delay: 3500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'endpoint-clients',
    //   color: customVars.diagramPalette.torquise,
    //   from: {
    //     x: -4,
    //     y: 10
    //   },
    //   to: {
    //     x: 4,
    //     y: 12
    //   },
    //   label: 'EC2 Server',
    //   loading: {
    //     delay: 3500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'google-oauth-group',
    //   color: customVars.diagramPalette.green,
    //   from: {
    //     x: 12,
    //     y: 4
    //   },
    //   to: {
    //     x: 10,
    //     y: 2
    //   },
    //   label: 'Google Auth',
    //   loading: {
    //     delay: 3500,
    //     duration: 1000,
    //   },
    // },
    // {
    //   id: 'stripe-group',
    //   color: customVars.diagramPalette.yellow,
    //   from: {
    //     x: 12,
    //     y: -1
    //   },
    //   to: {
    //     x: 10,
    //     y: -3
    //   },
    //   label: 'Stripe API',
    //   loading: {
    //     delay: 3500,
    //     duration: 1000,
    //   },
    // },
    // // My API Highlight
    // {
    //   id: 'api-highlight',
    //   color: getColorVariant(customVars.diagramPalette.grey , 'dark', { grade: 0.4 }),
    //   from: {
    //     x: 0.25,
    //     y: 0.25
    //   },
    //   to: {
    //     x: -0.25,
    //     y: -0.25
    //   },
    //   loading: {
    //     delay: 500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: getColorVariant(customVars.diagramPalette.purple , 'dark', { grade: 0.4 }) }
    //   ],
    // },
    // // Websocket Highlight
    // {
    //   id: 'websocket-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: -6.25,
    //     y: 5.25
    //   },
    //   to: {
    //     x: -5.75,
    //     y: 4.75
    //   },
    //   loading: {
    //     delay: 2000,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple },
    //     { color: customVars.diagramPalette.yellow }
    //   ],
    // },
    // // AWS Lambdas Highlight
    // {
    //   id: 'lambda-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: -6.25,
    //     y: -3.25
    //   },
    //   to: {
    //     x: -5.75,
    //     y: -2.75
    //   },
    //   loading: {
    //     delay: 2000,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple },
    //     { color: customVars.diagramPalette.orange }
    //   ],
    // },
    // // Database Highlight
    // {
    //   id: 'database-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: -0.25,
    //     y: -5.75
    //   },
    //   to: {
    //     x: 0.25,
    //     y: -6.25
    //   },
    //   loading: {
    //     delay: 2000,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple },
    //     { color: customVars.diagramPalette.blue }
    //   ],
    // },
    // // Clients Highlight
    // {
    //   id: 'clients-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: -0.25,
    //     y: 5.75
    //   },
    //   to: {
    //     x: 0.25,
    //     y: 6.25
    //   },
    //   loading: {
    //     delay: 2000,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple }
    //   ],
    // },
    // // Google OAuth Highlight
    // {
    //   id: 'google-oauth-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: 5.75,
    //     y: 2.75
    //   },
    //   to: {
    //     x: 6.25,
    //     y: 3.25
    //   },
    //   loading: {
    //     delay: 2000,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple },
    //     { color: customVars.diagramPalette.green }
    //   ],
    // },
    // // Stripe Payment Highlight
    // {
    //   id: 'stripe-payment-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: 5.75,
    //     y: -1.75
    //   },
    //   to: {
    //     x: 6.25,
    //     y: -2.25
    //   },
    //   loading: {
    //     delay: 2000,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     { color: customVars.diagramPalette.purple },
    //     { color: customVars.diagramPalette.yellow }
    //   ],
    // },
    // // Google OAuthentication Block
    // {
    //   id: 'google-oauth-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: 10.75,
    //     y: 2.75
    //   },
    //   to: {
    //     x: 11.25,
    //     y: 3.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: getColorVariant(customVars.diagramPalette.green , 'dark', { grade: 0.2 }) }
    //   ],
    // },
    // // Stripe Payment API Block Highlight
    // {
    //   id: 'stripe-payment-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: 10.75,
    //     y: -1.75
    //   },
    //   to: {
    //     x: 11.25,
    //     y: -2.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: getColorVariant(customVars.diagramPalette.yellow , 'dark', { grade: 0.2 }) }
    //   ],
    // },
    // // Dynamo DB 1 Block Highlight
    // {
    //   id: 'dynamodb-1-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: 4.75,
    //     y: -14.75
    //   },
    //   to: {
    //     x: 5.25,
    //     y: -15.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // // Dynamo DB 2 Block Highlight
    // {
    //   id: 'dynamodb-2-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: 2.75,
    //     y: -10.75
    //   },
    //   to: {
    //     x: 3.25,
    //     y: -11.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // // Dynamo DB 3 Block Highlight
    // {
    //   id: 'dynamodb-3-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: 7.75,
    //     y: -10.75
    //   },
    //   to: {
    //     x: 8.25,
    //     y: -11.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // // AWS S3 Bucket Highlight
    // {
    //   id: 's3-bucket-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: -4.75,
    //     y: -10.75
    //   },
    //   to: {
    //     x: -5.25,
    //     y: -11.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: getColorVariant(customVars.diagramPalette.blue , 'dark', { grade: 0.2 }) }
    //   ],
    // },
    // // AWS Lambda 1 Block Highlight
    // {
    //   id: 'lambda-1-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: -10.75,
    //     y: -0.25
    //   },
    //   to: {
    //     x: -11.25,
    //     y: 0.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: getColorVariant(customVars.diagramPalette.orange , 'dark', { grade: 0.2 }) }
    //   ],
    // },
    // // AWS Lambda 2 Block Highlight
    // {
    //   id: 'lambda-2-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: -12.75,
    //     y: -2.75
    //   },
    //   to: {
    //     x: -13.25,
    //     y: -3.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: getColorVariant(customVars.diagramPalette.orange , 'dark', { grade: 0.2 }) }
    //   ],
    // },
    // // AWS Lambda 2 Block Highlight
    // {
    //   id: 'lambda-3-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: -10.75,
    //     y: -5.75
    //   },
    //   to: {
    //     x: -11.25,
    //     y: -6.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: getColorVariant(customVars.diagramPalette.orange , 'dark', { grade: 0.2 }) }
    //   ],
    // },
    // // Websockets Block Highlight
    // {
    //   id: 'websocket-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: -10.75,
    //     y: 4.75
    //   },
    //   to: {
    //     x: -11.25,
    //     y: 5.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    //   // @ts-ignore
    //   state: null,
    //   states: [
    //     undefined,
    //     { color: getColorVariant(customVars.diagramPalette.yellow , 'dark', { grade: 0.2 }) }
    //   ],
    // },
    // // Endpoint Client 1 Block Highlight
    // {
    //   id: 'endpoint-client-1-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: -0.25,
    //     y: 10.75
    //   },
    //   to: {
    //     x: 0.25,
    //     y: 11.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // // Endpoint Client 2 Block Highlight
    // {
    //   id: 'endpoint-client-2-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: 2.75,
    //     y: 10.75
    //   },
    //   to: {
    //     x: 3.25,
    //     y: 11.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // },
    // // Endpoint Client 3 Block Highlight
    // {
    //   id: 'endpoint-client-3-block-highlight',
    //   color: customVars.diagramPalette.grey,
    //   from: {
    //     x: -2.75,
    //     y: 10.75
    //   },
    //   to: {
    //     x: -3.25,
    //     y: 11.25
    //   },
    //   loading: {
    //     delay: 5500,
    //     duration: 1000,
    //   },
    // }
  ]
};
