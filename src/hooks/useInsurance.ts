import { useState, useEffect } from "react";
import { insuranceService, InsurancePolicy, InsuranceClaim } from "../services/insurance";
import { useAuth } from "./useAuth";

export const useInsurance = (petId: string) => {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !petId) return;
    
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const policiesData = await insuranceService.getPolicies(petId);
        setPolicies(policiesData);
        
        // Fetch claims for each policy
        const claimsPromises = policiesData.map(policy => 
          insuranceService.getClaims(policy.id!)
        );
        const claimsData = await Promise.all(claimsPromises);
        setClaims(claimsData.flat());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [petId, user]);

  const addPolicy = async (policyData: Omit<InsurancePolicy, "id">) => {
    try {
      const newPolicy = await insuranceService.addPolicy(policyData);
      setPolicies(prev => [...prev, newPolicy]);
      return newPolicy;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const submitClaim = async (claimData: Omit<InsuranceClaim, "id" | "status">) => {
    try {
      const newClaim = await insuranceService.submitClaim(claimData);
      setClaims(prev => [...prev, newClaim]);
      return newClaim;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    policies,
    claims,
    loading,
    error,
    addPolicy,
    submitClaim,
  };
};
