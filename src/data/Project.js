import tremortrack from '../assets/tremortrack.mp4';
import intranet from '../assets/intranet.png'
import discussbot from '../assets/discussbot.png'

import dht11 from '../assets/dht11.png';
import simpleultrasonic from '../assets/simpleultrasonic.png';
import tfminis from '../assets/tfminis.png';

const projects = [
  {
    name: "Tremor Track",
    description:
      "Developed using during the NASA Space Apps Challenge 2023, Tremor Track, Moonquake Map 2.0 is a 3D interactive lunar globe visualizing seismic activities and geological data. It features timeline navigation, dynamic tooltips, and adjustable visual settings, aimed at making lunar seismic data engaging and educational.",
    video: tremortrack,
  },
  {
    name: "DHT11 Library",
    description:
      "An official Arduino library for the DHT11 Temperature Sensor, designed to simplify temperature and humidity measurements. It facilitates easy integration with AVR/ESP based MCUs using a custom single-wire protocol. Available on the Arduino IDE, it has gained 26 stars and 358 downloads on GitHub.",
    image: dht11,
  },
  {
    name: "VBDCSS Intranet",
    description:
      "Created infrastructure for an intranet for the CS Department at Visva-Bharati. Integrated Docker-based microservices, configured a custom DHCP server with WiFi bridge, and deployed services on an HPE DL380 server. Enhanced the department's technological capabilities, including network infrastructure and SaaS deployment.",
    image: intranet,
  },
];

export { projects };
