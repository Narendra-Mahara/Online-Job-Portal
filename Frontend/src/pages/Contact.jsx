import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
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
                <p className="text-gray-500">support@careerforge.net</p>
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
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border rounded-sm px-4 py-1  outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border rounded-sm px-4 py-1  outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full border rounded-sm px-4 py-1  outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows="4"
                placeholder="Tell us more..."
                className="w-full border rounded-sm px-4 py-2  outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 cursor-pointer text-white py-3 transition-all duration-300 hover:shadow-xl font-bold rounded-sm hover:bg-blue-600 hover:text-white hover:outline-0 "
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
