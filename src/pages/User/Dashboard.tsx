import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAuthStore } from '../../store/authStore';
import PlanSelection from '../../components/UI/PlanSelection';
import ProgressStats from '../../components/UI/ProgressStats';
import GroupCard from '../../components/UI/GroupCard';
import ShareModal from '../../components/UI/ShareModal';
import { getUserWithGroups } from '../../lib/supabase';
import { UserWithGroupDetails, Group } from '../../types/database.types';
import { Share2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, refreshUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserWithGroupDetails | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedGroupCode, setSelectedGroupCode] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoading(true);
        const userData = await getUserWithGroups(user.id);
        setUserData(userData);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  useEffect(() => {
    // Refresh user data periodically
    const interval = setInterval(() => {
      refreshUser();
    }, 60000); // every minute
    
    return () => clearInterval(interval);
  }, [refreshUser]);
  
  const handleShareGroup = (groupCode: string) => {
    setSelectedGroupCode(groupCode);
    setShareModalOpen(true);
  };
  
  // Show plan selection if user hasn't selected a plan yet
  if (user && !user.pack_type) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Boom Bag!</h1>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Next Step: Choose Your Plan
            </h2>
            <p className="text-gray-600 mb-6">
              Select a plan that fits your goals to continue setting up your account.
            </p>
            <PlanSelection />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Show pending verification message if user has selected a plan but is not yet verified
  if (user && user.pack_type && user.status === 'pending') {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Verification Pending</h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Share2 className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Your Account is Pending Verification
                  </h2>
                  <p className="text-gray-600">
                    We've received your plan selection and are waiting for payment confirmation.
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-blue-800 mb-2">Next Steps:</h3>
                <ol className="list-decimal list-inside text-blue-700 space-y-2">
                  <li>Send your payment using one of the methods below</li>
                  <li>Submit proof of payment via Telegram or WhatsApp</li>
                  <li>Wait for admin verification (usually within 24 hours)</li>
                  <li>Once verified, you'll gain access to your group and features</li>
                </ol>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Methods:</h3>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://t.me/boombag_support" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn bg-[#0088cc] text-white hover:bg-[#0077b5] focus:ring-blue-500"
                  >
                    Submit via Telegram
                  </a>
                  <a 
                    href="https://wa.me/1234567890" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn bg-[#25D366] text-white hover:bg-[#128C7E] focus:ring-green-500"
                  >
                    Submit via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Show main dashboard for verified users
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {userData && (
              <div className="space-y-6">
                {/* Progress Stats */}
                <ProgressStats user={userData} />
                
                {/* Groups */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Your Groups</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage your groups and track their progress
                    </p>
                  </div>
                  
                  <div className="px-6 py-5">
                    {userData.groups && userData.groups.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {userData.groups.map((group: Group, idx: number) => {
                          // For demo purposes, let's assume some members and verification numbers
                          // In a real app, you'd fetch these from the database
                          const memberCount = Math.floor(Math.random() * 10);
                          const verifiedCount = Math.min(Math.floor(Math.random() * memberCount), memberCount);
                          
                          return (
                            <GroupCard 
                              key={group.id}
                              group={group}
                              memberCount={memberCount}
                              verifiedCount={verifiedCount}
                              onShareLink={handleShareGroup}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500">No groups found. They will appear here once created.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Share Modal */}
        <ShareModal 
          groupCode={selectedGroupCode} 
          isOpen={shareModalOpen} 
          onClose={() => setShareModalOpen(false)} 
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;