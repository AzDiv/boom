import { createClient } from '@supabase/supabase-js';
import { AdminDashboardStats } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please check your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserByInviteCode(inviteCode: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('invite_code', inviteCode)
    .single();

  if (error) {
    console.error('Error fetching user by invite code:', error);
    return null;
  }

  return data;
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export async function getUserWithGroups(userId: string) {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error('Error fetching user:', userError);
    return null;
  }

  const { data: groups, error: groupsError } = await supabase
    .from('groups')
    .select('*')
    .eq('owner_id', userId);

  if (groupsError) {
    console.error('Error fetching groups:', groupsError);
    return { ...user, groups: [] };
  }

  // Get verified members count for each group
  let totalVerifiedMembers = 0;
  let totalMembers = 0;

  for (const group of groups) {
    const { count: membersCount, error: membersError } = await supabase
      .from('invites')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', group.id);

    const { count: verifiedCount, error: verifiedError } = await supabase
      .from('invites')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', group.id)
      .eq('owner_confirmed', true);

    if (!membersError) totalMembers += membersCount || 0;
    if (!verifiedError) totalVerifiedMembers += verifiedCount || 0;
  }

  return {
    ...user,
    groups,
    members: totalMembers,
    verified_members: totalVerifiedMembers
  };
}

export async function getPendingVerifications() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending verifications:', error);
    return [];
  }

  return data;
}

export async function updateUserStatus(userId: string, status: 'pending' | 'active') {
  const { error } = await supabase
    .from('users')
    .update({ status })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user status:', error);
    return false;
  }

  // If activating a user, check if they need a new group
  if (status === 'active') {
    await createGroupIfNeeded(userId);
  }

  return true;
}

export async function createGroupIfNeeded(userId: string) {
  // Check if user already has a group
  const { data: existingGroups, error: groupCheckError } = await supabase
    .from('groups')
    .select('*')
    .eq('owner_id', userId);

  if (groupCheckError) {
    console.error('Error checking existing groups:', groupCheckError);
    return false;
  }

  // If user has no groups, create their first group
  if (!existingGroups || existingGroups.length === 0) {
    const { error: createError } = await supabase
      .from('groups')
      .insert({
        owner_id: userId,
        code: generateGroupCode(),
        group_number: 1
      });

    if (createError) {
      console.error('Error creating group:', createError);
      return false;
    }
  }

  return true;
}

export async function getGroupMembers(groupId: string) {
  const { data, error } = await supabase
    .from('invites')
    .select(`
      *,
      referred_user:referred_user_id(id, name, email, status, created_at)
    `)
    .eq('group_id', groupId);

  if (error) {
    console.error('Error fetching group members:', error);
    return [];
  }

  return data;
}

// Generate a random 6-character group code
function generateGroupCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function getDashboardStats(): Promise<AdminDashboardStats> {
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: pendingVerifications } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: activeUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const { count: totalGroups } = await supabase
    .from('groups')
    .select('*', { count: 'exact', head: true });

  return {
    totalUsers: totalUsers || 0,
    pendingVerifications: pendingVerifications || 0,
    activeUsers: activeUsers || 0,
    totalGroups: totalGroups || 0
  };
}

export async function confirmGroupMember(inviteId: string) {
  const { error } = await supabase
    .from('invites')
    .update({ owner_confirmed: true })
    .eq('id', inviteId);
  if (error) {
    console.error('Error confirming group member:', error);
    return false;
  }
  return true;
}