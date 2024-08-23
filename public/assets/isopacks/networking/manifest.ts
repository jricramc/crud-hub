import type { SceneInput } from '@/src-isoflow/types';
import { createCategoryIcon } from '../utils';
import Cache from './icons/cache.svg';
import CardTerminal from './icons/cardterminal.svg';
import Cloud from './icons/cloud.svg';
import Cronjob from './icons/cronjob.svg';
import Desktop from './icons/desktop.svg';
import Dns from './icons/dns.svg';
import Firewall from './icons/firewall.svg';
import Function from './icons/function.svg';
import Laptop from './icons/laptop.svg';
import LoadBalancer from './icons/loadbalancer.svg';
import Lock from './icons/lock.svg';
import Mail from './icons/mail.svg';
import MailMultiple from './icons/mailmultiple.svg';
import MobileDevice from './icons/mobiledevice.svg';
import Office from './icons/office.svg';
import Package from './icons/package.svg';
import PaymentCard from './icons/paymentcard.svg';
import Printer from './icons/printer.svg';
import Queue from './icons/queue.svg';
import Router from './icons/router.svg';
import Server from './icons/server.svg';
import Speech from './icons/speech.svg';
import Storage from './icons/storage.svg';
import Switch from './icons/switch.svg';
import User from './icons/user.svg';
import VM from './icons/vm.svg';

const createIcon = createCategoryIcon('Networking');

console.log('User: ', User)
console.log('Desktop: ', Desktop)

export const networkingIsopack: SceneInput['icons'] = [
  createIcon({
    id: 'cache',
    name: 'Cache',
    url: 'assets/isopacks/networking/icons/cache.svg'
  }),
  createIcon({
    id: 'cardterminal',
    name: 'Card Terminal',
    url: 'assets/isopacks/networking/icons/cardterminal.svg'
  }),
  createIcon({
    id: 'cloud',
    name: 'Cloud',
    url: 'assets/isopacks/networking/icons/cloud.svg'
  }),
  createIcon({
    id: 'cronjob',
    name: 'Cronjob',
    url: 'assets/isopacks/networking/icons/cronjob.svg'
  }),
  createIcon({
    id: 'desktop',
    name: 'Desktop',
    url: 'assets/isopacks/networking/icons/desktop.svg'
  }),
  createIcon({
    id: 'dns',
    name: 'DNS',
    url: 'assets/isopacks/networking/icons/dns.svg'
  }),
  createIcon({
    id: 'firewall',
    name: 'Firewall',
    url: 'assets/isopacks/networking/icons/firewall.svg'
  }),
  createIcon({
    id: 'function',
    name: 'Function',
    url: 'assets/isopacks/networking/icons/function.svg'
  }),
  createIcon({
    id: 'laptop',
    name: 'Laptop',
    url: 'assets/isopacks/networking/icons/laptop.svg'
  }),
  createIcon({
    id: 'loadbalancer',
    name: 'Load balancer',
    url: 'assets/isopacks/networking/icons/loadbalancer.svg'
  }),
  createIcon({
    id: 'lock',
    name: 'Lock',
    url: 'assets/isopacks/networking/icons/lock.svg'
  }),
  createIcon({
    id: 'mail',
    name: 'Mail',
    url: 'assets/isopacks/networking/icons/mail.svg'
  }),
  createIcon({
    id: 'mailmultiple',
    name: 'Mail multiple',
    url: 'assets/isopacks/networking/icons/mailmultiple.svg'
  }),
  createIcon({
    id: 'mobiledevice',
    name: 'Mobile device',
    url: 'assets/isopacks/networking/icons/mobiledevice.svg'
  }),
  createIcon({
    id: 'office',
    name: 'Office',
    url: 'assets/isopacks/networking/icons/office.svg'
  }),
  createIcon({
    id: 'package',
    name: 'Package',
    url: 'assets/isopacks/networking/icons/package.svg'
  }),
  createIcon({
    id: 'paymentcard',
    name: 'Payment card',
    url: 'assets/isopacks/networking/icons/paymentcard.svg'
  }),
  createIcon({
    id: 'printer',
    name: 'Printer',
    url: 'assets/isopacks/networking/icons/printer.svg'
  }),
  createIcon({
    id: 'queue',
    name: 'Queue',
    url: 'assets/isopacks/networking/icons/queue.svg'
  }),
  createIcon({
    id: 'router',
    name: 'Router',
    url: 'assets/isopacks/networking/icons/router.svg'
  }),
  createIcon({
    id: 'server',
    name: 'Server',
    url: 'assets/isopacks/networking/icons/server.svg'
  }),
  createIcon({
    id: 'speech',
    name: 'Speech',
    url: 'assets/isopacks/networking/icons/speech.svg'
  }),
  createIcon({
    id: 'storage',
    name: 'Storage',
    url: 'assets/isopacks/networking/icons/storage.svg'
  }),
  createIcon({
    id: 'switch',
    name: 'Switch',
    url: 'assets/isopacks/networking/icons/switch.svg'
  }),
  createIcon({
    id: 'user',
    name: 'User',
    url: 'assets/isopacks/networking/icons/user.svg'
  }),
  createIcon({
    id: 'vm',
    name: 'Virtual machine',
    url: 'assets/isopacks/networking/icons/vm.svg'
  })
];
