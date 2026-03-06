import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Candidate {
    id: bigint;
    bio: string;
    yearsOfExperience: bigint;
    expectedSalary: bigint;
    owner: Principal;
    name: string;
    createdAt: Time;
    email: string;
    resumeFile?: ExternalBlob;
    isProfileActive: boolean;
    specialization: string;
    phone: string;
    skills: string;
    qualification: string;
    location: string;
    currentSalary: bigint;
}
export type Time = bigint;
export interface Employer {
    id: bigint;
    contactName: string;
    about: string;
    owner: Principal;
    createdAt: Time;
    email: string;
    website: string;
    companyName: string;
    companySize: string;
    phone: string;
    location: string;
    industry: string;
}
export interface JobPosting {
    id: bigint;
    title: string;
    postedAt: Time;
    description: string;
    qualifications: string;
    isActive: boolean;
    maxExperience: bigint;
    minExperience: bigint;
    employerId: bigint;
    salaryMax: bigint;
    salaryMin: bigint;
    skills: string;
    specializations: string;
    location: string;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyToJob(jobPostingId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createJobPosting(employerId: bigint, title: string, specializations: string, qualifications: string, minExperience: bigint, maxExperience: bigint, location: string, salaryMin: bigint, salaryMax: bigint, description: string, skills: string): Promise<bigint>;
    getAllActiveJobPostings(): Promise<Array<JobPosting>>;
    getApplicationsForJob(jobPostingId: bigint): Promise<Array<Candidate>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCandidateById(id: bigint): Promise<Candidate | null>;
    getEmployerById(id: bigint): Promise<Employer | null>;
    getJobPostingById(id: bigint): Promise<JobPosting | null>;
    getJobPostingsByEmployer(employerId: bigint): Promise<Array<JobPosting>>;
    getMyEmployerProfile(): Promise<Employer | null>;
    getMyProfile(): Promise<Candidate | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerCandidate(name: string, email: string, phone: string, specialization: string, qualification: string, yearsOfExperience: bigint, location: string, currentSalary: bigint, expectedSalary: bigint, skills: string, bio: string): Promise<bigint>;
    registerEmployer(companyName: string, contactName: string, email: string, phone: string, industry: string, companySize: string, location: string, about: string, website: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchCandidates(keywords: string, specialization: string | null, qualification: string | null, minExperience: bigint | null, maxExperience: bigint | null, location: string | null): Promise<Array<Candidate>>;
    toggleJobPostingActive(id: bigint): Promise<boolean>;
    toggleProfileActive(candidateId: bigint): Promise<boolean>;
    updateCandidateProfile(id: bigint, name: string, email: string, phone: string, specialization: string, qualification: string, yearsOfExperience: bigint, location: string, currentSalary: bigint, expectedSalary: bigint, skills: string, bio: string): Promise<void>;
    updateEmployerProfile(id: bigint, companyName: string, contactName: string, email: string, phone: string, industry: string, companySize: string, location: string, about: string, website: string): Promise<void>;
    updateJobPosting(id: bigint, title: string, specializations: string, qualifications: string, minExperience: bigint, maxExperience: bigint, location: string, salaryMin: bigint, salaryMax: bigint, description: string, skills: string): Promise<void>;
    uploadResume(candidateId: bigint, file: ExternalBlob): Promise<void>;
}
