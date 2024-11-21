import { useState, useEffect } from "react";
import { careTeamService, CareTeamMember } from "../services/careTeam";
import { useAuth } from "./useAuth";

export const useCareTeam = (petId: string) => {
  const [teamMembers, setTeamMembers] = useState<CareTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !petId) return;
    
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const data = await careTeamService.getTeamMembers(petId);
        setTeamMembers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [petId, user]);

  const addTeamMember = async (memberData: Omit<CareTeamMember, "id">) => {
    try {
      const newMember = await careTeamService.addMember(memberData);
      setTeamMembers(prev => [...prev, newMember]);
      return newMember;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateTeamMember = async (memberId: string, updates: Partial<CareTeamMember>) => {
    try {
      await careTeamService.updateMember(memberId, updates);
      setTeamMembers(prev =>
        prev.map(member =>
          member.id === memberId ? { ...member, ...updates } : member
        )
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeTeamMember = async (memberId: string) => {
    try {
      await careTeamService.deleteMember(memberId);
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const searchProviders = async (specialty: string, location?: string) => {
    try {
      return await careTeamService.searchBySpecialty(specialty, location);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    teamMembers,
    loading,
    error,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    searchProviders,
  };
};
