import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAuthStore } from '../../store/authStore';
import { getUserWithGroups, getGroupMembers, getUserById, confirmGroupMember } from '../../lib/supabase';
import { Group as GroupType } from '../../types/database.types';
import GroupCard from '../../components/UI/GroupCard';
import MembersList from '../../components/UI/MembersList';
import ShareModal from '../../components/UI/ShareModal';
import MemberInfoModal from '../../components/UI/MemberInfoModal';
import { Users, UserPlus } from 'lucide-react';

const Groups: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedGroupCode, setSelectedGroupCode] = useState('');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [memberInfoLoading, setMemberInfoLoading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      if (user) {
        setLoading(true);
        const userData = await getUserWithGroups(user.id);
        
        if (userData && userData.groups) {
          setGroups(userData.groups);
          
          if (userData.groups.length > 0) {
            setSelectedGroup(userData.groups[0].id);
          }
        }
        
        setLoading(false);
      }
    };
    
    fetchGroups();
  }, [user]);
  
  useEffect(() => {
    const fetchMembers = async () => {
      if (selectedGroup) {
        setMembersLoading(true);
        const groupMembers = await getGroupMembers(selectedGroup);
        // Map to include owner_confirmed in each member object
        setMembers(
          groupMembers
            .filter(member => member.referred_user !== null)
            .map(member => ({
              ...member.referred_user,
              owner_confirmed: member.owner_confirmed,
              invite_id: member.id // keep invite id for confirmation
            }))
        );
        setMembersLoading(false);
      }
    };
    
    fetchMembers();
  }, [selectedGroup]);
  
  const handleShareGroup = (groupCode: string) => {
    setSelectedGroupCode(groupCode);
    setShareModalOpen(true);
  };

  // Handler to fetch member info and open modal
  const handleMemberClick = async (memberId: string) => {
    setMemberInfoLoading(true);
    const memberInfo = await getUserById(memberId);
    setSelectedMember(memberInfo);
    setMemberInfoLoading(false);
  };

  const handleConfirmMember = async (inviteId: string) => {
    await confirmGroupMember(inviteId);
    // Refresh members after confirmation
    if (selectedGroup) {
      setMembersLoading(true);
      const groupMembers = await getGroupMembers(selectedGroup);
      setMembers(
        groupMembers
          .filter(member => member.referred_user !== null)
          .map(member => ({
            ...member.referred_user,
            owner_confirmed: member.owner_confirmed,
            invite_id: member.id
          }))
      );
      setMembersLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Groups</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {groups.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Groups Yet</h3>
                <p className="text-gray-600 mb-6">
                  You'll automatically get your first group once your account is verified.
                </p>
                {user?.status === 'pending' && (
                  <p className="text-blue-600">
                    Your account is pending verification. Please be patient.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Groups List */}
                <div className="md:col-span-1">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Your Groups</h3>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {groups.map((group) => (
                        <button
                          key={group.id}
                          onClick={() => setSelectedGroup(group.id)}
                          className={`w-full text-left px-6 py-4 focus:outline-none ${
                            selectedGroup === group.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${
                              selectedGroup === group.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                              <Users className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium text-gray-900">
                                Level {group.group_number * 10} Group
                              </h4>
                              <p className="text-sm text-gray-500">Code: {group.code}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Group Members */}
                <div className="md:col-span-2">
                  {selectedGroup && (
                    <motion.div 
                      key={selectedGroup}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          Group Members
                        </h3>
                        <button
                          onClick={() => {
                            const group = groups.find(g => g.id === selectedGroup);
                            if (group) handleShareGroup(group.code);
                          }}
                          className="flex items-center text-sm text-primary hover:text-primary-dark"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Invite
                        </button>
                      </div>
                      
                      {membersLoading ? (
                        <div className="flex justify-center items-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <MembersList 
                          members={members} 
                          emptyMessage="No members in this group yet. Start inviting people!" 
                          onMemberClick={handleMemberClick}
                          onConfirmMember={handleConfirmMember}
                          isOwner={!!user && groups.find(g => g.id === selectedGroup)?.owner_id === user.id}
                        />
                      )}
                    </motion.div>
                  )}
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

        {/* Member Info Modal */}
        <MemberInfoModal
          isOpen={!!selectedMember}
          member={selectedMember}
          loading={memberInfoLoading}
          onClose={() => setSelectedMember(null)}
        />
      </div>
    </DashboardLayout>
  );
};

export default Groups;