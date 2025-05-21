// Colorful Tailwind Enhanced EditProfile Component
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import UserService from "../../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faImage, faSave } from "@fortawesome/free-solid-svg-icons";

const EditProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    loadUserData();
  }, [currentUser, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUserById(currentUser.id);
      setUser(response.data.user);
      if (response.data.user.profilePic) {
        setPreview(`http://localhost:8080/uploads/${response.data.user.profilePic}`);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load your profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    bio: Yup.string().max(250, "Bio must be 250 characters or less"),
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await UserService.updateUser(currentUser.id, {
        firstname: values.firstname,
        lastname: values.lastname,
        bio: values.bio,
        profilePic: user.profilePic,
      });
      navigate(`/profile/${currentUser.id}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update your profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center text-red-500 py-10">{error || "User profile not found"}</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-gradient-to-br from-white via-indigo-50 to-purple-100 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-sm bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back
        </button>
        <h2 className="text-2xl font-bold text-indigo-800">Edit Profile</h2>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="bg-white p-6 rounded-xl shadow">
        <Formik
          initialValues={{
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            bio: user.bio || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="text-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-24 h-24 mx-auto rounded-full object-cover mb-2 border-4 border-indigo-300" />
                ) : (
                  <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700 mb-2">
                    {user.firstname.charAt(0)}
                  </div>
                )}
                
                 
              </div>

              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <Field name="firstname" className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500" />
                <ErrorMessage name="firstname" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <Field name="lastname" className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500" />
                <ErrorMessage name="lastname" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <Field as="textarea" name="bio" rows="3" className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500" placeholder="Tell others about yourself..." />
                <ErrorMessage name="bio" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-all">
                {isSubmitting ? "Saving..." : (<><FontAwesomeIcon icon={faSave} /> Save Changes</>)}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfile;