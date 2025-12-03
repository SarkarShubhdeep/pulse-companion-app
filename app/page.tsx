"use client";

import React from 'react';
import Link from 'next/link';
import { Smartphone, Watch, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Pulse Companion</h1>
          <p className="text-xl text-slate-500">
            Next-generation productivity tool for ICU & Trauma Nurses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Mobile Prototype Card */}
          <Link href="/mobile" className="group">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <Smartphone className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Mobile App</h2>
              <p className="text-slate-500 mb-6">
                Full-featured mobile interface with timeline, delegation, and chat.
              </p>
              <div className="mt-auto flex items-center text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                View Prototype <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>

          {/* Watch Prototype Card */}
          <Link href="/watch" className="group">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                <Watch className="w-10 h-10 text-orange-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Watch App</h2>
              <p className="text-slate-500 mb-6">
                Companion app for quick tasks, voice notes, and critical alerts.
              </p>
              <div className="mt-auto flex items-center text-orange-600 font-bold group-hover:translate-x-1 transition-transform">
                View Prototype <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>
        </div>

        <div className="pt-12 text-slate-400 text-sm">
          Prototype v2.0 • Built with Next.js & Tailwind
        </div>
      </div>
    </div>
  );
}
