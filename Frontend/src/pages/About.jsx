import React from "react";
import { Target, Heart, Users } from "lucide-react";

const About = () => {
  return (
    <section className="w-full px-10 py-10 bg-gray-100 min-h-screen">

     {/* About Intro */}
<div className="text-center mb-10 max-w-2xl mx-auto">
  <h1 className="text-3xl font-bold mb-3">About Us</h1>
  <p className="text-gray-600">
    We're on a mission to connect talented professionals with the opportunities they deserve.
  </p>
</div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Mission */}
        <div className="bg-white p-6 rounded-xl shadow-sm text-center border">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Target className="text-blue-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-500 text-sm">
            To simplify the job search process and empower both job seekers and employers with the tools they need to succeed.
          </p>
        </div>

        {/* Values */}
        <div className="bg-white p-6 rounded-xl shadow-sm text-center border">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Heart className="text-blue-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Our Values</h2>
          <p className="text-gray-500 text-sm">
            Transparency, inclusivity, and innovation drive everything we do. We believe everyone deserves access to great opportunities.
          </p>
        </div>

        {/* Team */}
        <div className="bg-white p-6 rounded-xl shadow-sm text-center border">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Our Team</h2>
          <p className="text-gray-500 text-sm">
            A passionate group of engineers, designers, and recruiters working together to build the best job platform.
          </p>
        </div>

      </div>

      {/* Our Story */}
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>

        <p className="text-gray-600 mb-4">
          CareerForgee was founded with a simple idea: job hunting shouldn't be stressful. We noticed that both job seekers and employers struggled with fragmented tools and outdated processes.
        </p>

        <p className="text-gray-600 mb-4">
          So we built an all-in-one platform that brings everything together — from resume building and smart job search to applicant tracking and hiring pipelines.
        </p>

        <p className="text-gray-600">
          Today, we serve thousands of users and continue to innovate with features like AI-powered matching and real-time application tracking.
        </p>
      </div>

    </section>
  );
};

export default About;