import { Mail, Phone, MapPin } from "lucide-react";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const Contact = () => {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);

  const handleEmail = async (e) => {
    e.preventDefault();

    if (isSending) return;

    setIsSending(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      toast.success("Message sent successfully!");

      form.current.reset();
    } catch (error) {
      console.error(error);

      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Contact Us
        </h1>
        <p className="text-gray-600 mt-3 max-w-xl mx-auto">
          Have a question or feedback? We’re here to help you anytime.
        </p>
      </div>

      {/* Main Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800">Get in Touch</h2>

          {/* Contact Card */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Mail className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-500">support@careerforge.bond</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Phone className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-500">9800000000</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-medium">Address</p>
                <p className="text-gray-500">Betkot-07, Kanchanpur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <form ref={form} className="space-y-5" onSubmit={handleEmail}>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-sm px-4 py-1  outline-none border border-gray-400  placeholder:text-sm"
                name="from_name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full  rounded-sm px-4 py-1  outline-none border border-gray-400  placeholder:text-sm"
                name="from_email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full  rounded-sm px-4 py-1  outline-none border border-gray-400  placeholder:text-sm"
                name="subject"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows="4"
                placeholder="Tell us more..."
                className="w-full rounded-sm px-4 py-2  outline-none resize-none border border-gray-400  placeholder:text-sm"
                name="message"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className={`w-full py-3 rounded-sm font-bold transition-all duration-300
  ${
    isSending
      ? "bg-gray-400 cursor-not-allowed text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-xl"
  }`}
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
