'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  avatar_url?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        setEditedProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedProfile(profile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('user_profiles')
        .update(editedProfile)
        .eq('id', editedProfile.id);

      if (error) throw error;
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        throw new Error('New passwords do not match');
      }

      // First verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile?.email || '',
        password: passwordData.currentPassword
      });

      if (signInError) throw new Error('Current password is incorrect');

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) throw updateError;

      setSuccess('Password has been updated successfully');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase.auth.admin.deleteUser(profile?.id || '');
      if (error) throw error;
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-600">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-indigo-600">
            <div className="absolute -bottom-12 left-8">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-indigo-500 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 px-8 pb-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.first_name} {profile?.last_name}
                </h1>
                <p className="text-gray-600">{profile?.email}</p>
              </div>
              <div className="space-x-4">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleEditToggle}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">First Name</label>
                          <input
                            type="text"
                            name="first_name"
                            value={editedProfile?.first_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            value={editedProfile?.last_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editedProfile?.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={editedProfile?.phone_number}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">First Name</p>
                        <p className="font-medium text-gray-900">{profile.first_name}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Last Name</p>
                        <p className="font-medium text-gray-900">{profile.last_name}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{profile.email}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium text-gray-900">{profile.phone_number}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Address Information</h2>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={editedProfile?.address}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">City</label>
                          <input
                            type="text"
                            name="city"
                            value={editedProfile?.city}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">State</label>
                          <input
                            type="text"
                            name="state"
                            value={editedProfile?.state}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                          <input
                            type="text"
                            name="postal_code"
                            value={editedProfile?.postal_code}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Country</label>
                          <input
                            type="text"
                            name="country"
                            value={editedProfile?.country}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium text-gray-900">{profile.address}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">City</p>
                        <p className="font-medium text-gray-900">{profile.city}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">State</p>
                        <p className="font-medium text-gray-900">{profile.state}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Postal Code</p>
                        <p className="font-medium text-gray-900">{profile.postal_code}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Country</p>
                        <p className="font-medium text-gray-900">{profile.country}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
