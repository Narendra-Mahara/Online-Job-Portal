import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const profileImageRef = useRef();
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOverImage, setIsOverImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("bio", bio);

      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/update-profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      login(response.data.data);
      toast.success(
        response.data.message || "Profile updated successfully! 🎉",
      );
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG or PNG)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Show preview locally
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target.result);
    };
    reader.readAsDataURL(file);

    // Store file for later upload
    setSelectedFile(file);
    toast.info("Image selected. Click 'Save Changes' to apply.");
  };
  return (
    <div className="  py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header Section */}
          <div className="bg-linear-to-r from-blue-600 to-blue-400 px-6 sm:px-8 py-8">
            <div className="flex gap-6 items-center ">
              <input
                type="file"
                name="profileImage"
                id="profileImage"
                className="hidden"
                ref={profileImageRef}
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleFileChange}
              />

              <div
                className="w-15 h-15 rounded-full shadow-lg overflow-hidden relative "
                onMouseOver={() => {
                  setIsOverImage(true);
                }}
                onMouseOut={() => {
                  setIsOverImage(false);
                }}
              >
                <div
                  className={`absolute  bg-opacity-50 text-white transition-opacity h bg-blue-600 bottom-0 w-full flex items-center justify-center cursor-pointer ${isOverImage ? "opacity-100" : "opacity-0"} text-sm`}
                  onClick={() => {
                    profileImageRef.current.click();
                  }}
                >
                  Edit
                </div>
                <img
                  className="w-15 h-15 rounded-full shadow-lg object-cover"
                  src={profileImage}
                  alt="Profile"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-blue-100 text-sm mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form className="px-6 sm:px-8 py-8 space-y-6" onSubmit={handleSubmit}>
            {/* Name & Phone Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  required
                  placeholder="John Doe"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9800000000"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                required
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, Country"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Bio
              </label>
              <textarea
                name="bio"
                id="bio"
                rows="4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transform  transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
