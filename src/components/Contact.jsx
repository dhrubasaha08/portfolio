import emailjs from "@emailjs/browser";
import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { SectionWrapper } from "../hoc";
import { styles } from "../styles";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start("show");
  }, [controls]);

  return (
    <div
      className="md:m-12 md:px-48 flex flex-col sm:flex-row gap-10 overflow-hidden"
    >
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: {
            opacity: 0,
            y: 100,
          },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              type: "tween",
              duration: 1,
              delay: 0.2,
            },
          },
        }}
        className='flex-[0.8] md:pb-40 mx-4 sm:mx-auto'
      >
        <div className="flex items-center justify-between">
          <h3 className={styles.sectionText}>Contact</h3>
          <a
            href="https://www.dropbox.com/scl/fi/zziswv89rjrvx9dt5lgaw/Resume_Dhruba_Saha.pdf?rlkey=vyj85hs4w8u9a4f4j7rzfhfti&st=y95f9pyo&dl=0"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 bg-primary py-2 px-4 text-xl text-white font-bold shadow-md shadow-primary hover:bg-opacity-90 transition-opacity duration-300 ease-in-out border-4 lg:border-8 rounded-xl lg:rounded-3xl"
          >
            Download <br /> Resume
          </a>
        </div>

        <form
          action="https://getform.io/f/pbnvdwjb"
          method="POST"
          className="mt-12 gap-4 flex flex-col"
        >
          <span className='text-white font-medium mt-3'>Full Name</span>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            className="bg-tertiary p-4 text-white border font-medium"
          />
          <span className='text-white font-medium mt-3'>Email Address</span>
          <input
            type="text"
            name="email"
            placeholder="Enter your email address"
            className="bg-tertiary p-4 text-white border font-medium"
          />
          <span className='text-white font-medium mt-3'>Message</span>
          <textarea
            name="message"
            placeholder="Enter your message"
            rows="10"
            className="bg-tertiary p-4 text-white border font-medium"
          />
          <button
            type='submit'
            className='bg-tertiary py-3 px-8 w-fit text-white font-bold shadow-md shadow-primary '
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");