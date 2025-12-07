import { create } from 'zustand';

export interface Voter {
  id: string;
  name: string;
  dob: string;
  address: string;
  photoUrl: string; // The extracted photo from ID
  faceDescriptor?: Float32Array; // Stored biometric data
  hasVoted: boolean;
  registrationDate: string;
}

interface VoterState {
  voters: Voter[];
  addVoter: (voter: Voter) => void;
  getVoter: (id: string) => Voter | undefined;
  markVoted: (id: string) => void;
  resetSystem: () => void;
}

export const useVoterStore = create<VoterState>((set, get) => ({
  voters: [],
  addVoter: (voter) => set((state) => ({ 
    voters: [...state.voters, voter] 
  })),
  getVoter: (id) => get().voters.find((v) => v.id === id),
  markVoted: (id) => set((state) => ({
    voters: state.voters.map((v) => 
      v.id === id ? { ...v, hasVoted: true } : v
    )
  })),
  resetSystem: () => set({ voters: [] })
}));
