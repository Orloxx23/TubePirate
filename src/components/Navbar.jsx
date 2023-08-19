import { IconBrandGithub } from "@tabler/icons-react";
import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Yatra+One&display=swap"
          rel="stylesheet"
        />
      </Head>
      <nav className="w-full h-24 flex items-center justify-end relative z-10 px-4 md:px-40 bg-[#342a45] border-b">
        <Link
          href="/"
          className="absolute top-0 left-4 md:left-40 flex flex-col justify-center items-center py-2 md:py-14 px-3 bg-[#6c35de] shadow-xl shadow-black"
        >
          <img
            src="/img/logo.png"
            className="object-cover w-36 h-24"
            draggable="false"
          />
          <p className="text-4xl text-white brand">TubePirate</p>
        </Link>
        <div className="flex gap-8 uppercase font-semibold">
          <Link
            href="https://github.com/Orloxx23/TubePirate"
            className="text-white text-xl font-medium transition-all duration-300 ease-in-out"
            target="_blank"
          >
            <IconBrandGithub />
          </Link>
        </div>
      </nav>
    </>
  );
}
