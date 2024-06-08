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
      "Developed during the NASA Space Apps Challenge 2023, Tremor Track, Moonquake Map 2.0 is a 3D interactive lunar globe visualizing seismic activities and geological data. It features timeline navigation, dynamic tooltips, and adjustable visual settings, aimed at making lunar seismic data engaging and educational.",
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
      "Created the network infrastructure and developed an intranet website for the CS Department at Visva-Bharati. Integrated Docker-based microservices, configured a Raspberry Pi 3B+ as a WiFi bridge and DHCP server, and deployed services on an HPE ProLiant DL380 Gen 9 server. Enhanced the department's technological capabilities, including network setup, software deployment, and a secure online exam environment.",
    image: intranet,
  },
  /*{
    name: "TFminiS Library",
    description:
      "An Arduino library for interfacing with the Benewake TFmini-S LiDAR sensor, designed for hardware UART communication on ESP32 and Arduino Mega boards. Facilitates reading distance, signal strength, and temperature. Available on the Arduino IDE.",
    image: tfminis,
  },
  {
    name: "SimpleUltrasonic Library",
    description:
      "An official Arduino library for the HC-SR04 ultrasonic sensor, designed to facilitate distance measurements. It provides easy integration with AVR/ESP based MCUs without dependencies. Available on the Arduino IDE.",
    image: simpleultrasonic,
  },
  {
    name: "Discuss Bot",
    description:
      "An AI-powered Python bot that uses the GitHub API and OpenAI's GPT-3.5 Turbo model to generate automatic responses to GitHub discussions. It monitors discussions, fetches topics using the GitHub API, and posts concise, helpful responses. Features include seamless GitHub integration, advanced NLP for understanding and responding to queries, and customizable settings via environment variables and GraphQL.",
    image: discussbot,
  },*/
];

export { projects };
