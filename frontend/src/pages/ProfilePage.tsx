/**
 * Profile Page
 * User profile with stats, settings, and edit functionality
 * Properly integrated with JWT authentication
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsGrid from '../components/profile/StatsGrid';
import SettingsList from '../components/profile/SettingsList';
import EditProfileForm from '../components/profile/EditProfileForm';
import { notifyAchievement } from '../utils/notifications';
import Icon from '../components/ui/Icon';
import MobileLayout from '../components/layout/MobileLayout';
import {
  getStoredUser,
  getCurrentUser,
  logout,
  isAuthenticated,
  User
} from '../api/client';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get cached user first for instant display
    const cachedUser = getStoredUser();
    if (cachedUser) {
      setUser(cachedUser);
      setLoading(false);
    }

    // Fetch fresh data from server
    getCurrentUser()
      .then((freshUser) => {
        setUser(freshUser);
        setLoading(false);

        // Notify if profile is incomplete
        if (!freshUser.bio || !freshUser.archetype) {
          setTimeout(() => {
            notifyAchievement(
              "Profile",
              "Complete your profile to personalize your experience! ✨"
            );
          }, 1000);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user:', err);
        // If fetch fails but we have cached data, use it
        if (!cachedUser) {
          toast.error('Failed to load profile');
          navigate('/login');
        }
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    toast.success('See you soon! 👋');
    logout();
  };

  const handleProfileUpdate = () => {
    setIsEditing(false);
    // Refresh user data
    getCurrentUser()
      .then(setUser)
      .catch(console.error);
    toast.success('Profile updated! ✨');
  };

  if (loading && !user) {
    return (
      <MobileLayout>
        <div className="flex-1 flex items-center justify-center bg-earth min-h-screen">
          <div className="text-saffron text-lg font-serif italic animate-pulse">
            प्रोफ़ाइल लोड हो रही है (Loading profile)...
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      showHeader={isEditing}
      headerTitle="Edit Profile"
      onBack={() => setIsEditing(false)}
    >
      <div className="flex-1 flex flex-col gap-6 px-4 pt-2 bg-earth min-h-screen pb-24">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <EditProfileForm onSave={handleProfileUpdate} />
            </motion.div>
          ) : (
            <motion.div
              key="view"
              className="flex flex-col gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProfileHeader user={user} />
              <StatsGrid user={user} />

              {/* Archetype Card */}
              {user?.archetype && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="auto_awesome" className="text-primary text-xl" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Your Archetype</p>
                      <p className="text-lg font-bold text-white">{user.archetype}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Take Quiz Button (if no archetype) */}
              {!user?.archetype && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  onClick={() => navigate('/quiz')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron to-amber text-white font-bold text-sm tracking-wide shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  <Icon name="psychology" className="text-xl" />
                  अपना व्यक्तित्व पहचानें (Discover Your Archetype)
                </motion.button>
              )}

              {/* Edit Profile Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm tracking-wide shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Icon name="edit" className="text-lg" />
                Edit Profile
              </motion.button>

              <SettingsList />

              {/* Logout Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pt-4 pb-8 flex flex-col items-center gap-4"
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 font-bold text-sm px-6 py-3 rounded-xl border border-red-900/10 hover:bg-red-900/20 transition-colors w-full justify-center"
                >
                  <Icon name="logout" className="text-xl" />
                  Log Out
                </button>

                {/* User Info */}
                <div className="text-center">
                  <p className="text-xs text-white/40">
                    {user?.email}
                  </p>
                  <p className="text-xs text-white/20 font-medium mt-1">
                    Katha v1.1.0-beta
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
