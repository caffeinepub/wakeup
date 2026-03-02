import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";

actor {
  include MixinStorage();

  type Candidate = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    specialization : Text;
    qualification : Text;
    yearsOfExperience : Nat;
    location : Text;
    currentSalary : Nat;
    expectedSalary : Nat;
    skills : Text;
    bio : Text;
    resumeFile : ?Storage.ExternalBlob;
    isProfileActive : Bool;
    createdAt : Time.Time;
    owner : Principal;
  };

  type Employer = {
    id : Nat;
    companyName : Text;
    contactName : Text;
    email : Text;
    phone : Text;
    industry : Text;
    companySize : Text;
    location : Text;
    about : Text;
    website : Text;
    createdAt : Time.Time;
    owner : Principal;
  };

  type JobPosting = {
    id : Nat;
    employerId : Nat;
    title : Text;
    specializations : Text;
    qualifications : Text;
    minExperience : Nat;
    maxExperience : Nat;
    location : Text;
    salaryMin : Nat;
    salaryMax : Nat;
    description : Text;
    skills : Text;
    postedAt : Time.Time;
    isActive : Bool;
  };

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  let candidates = Map.empty<Nat, Candidate>();
  let employers = Map.empty<Nat, Employer>();
  let jobPostings = Map.empty<Nat, JobPosting>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextCandidateId = 1;
  var nextEmployerId = 1;
  var nextJobPostingId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Job applications: jobPostingId -> list of candidate owner principals
  let applications = Map.empty<Nat, List.List<Principal>>();

  // ---- User profile functions required by frontend ----

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ---- Candidate functions ----

  public shared ({ caller }) func registerCandidate(name : Text, email : Text, phone : Text, specialization : Text, qualification : Text, yearsOfExperience : Nat, location : Text, currentSalary : Nat, expectedSalary : Nat, skills : Text, bio : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can register as candidates");
    };

    let id = nextCandidateId;
    nextCandidateId += 1;

    let candidate : Candidate = {
      id;
      name;
      email;
      phone;
      specialization;
      qualification;
      yearsOfExperience;
      location;
      currentSalary;
      expectedSalary;
      skills;
      bio;
      resumeFile = null;
      isProfileActive = true;
      createdAt = Time.now();
      owner = caller;
    };

    candidates.add(id, candidate);
    id;
  };

  public shared ({ caller }) func updateCandidateProfile(id : Nat, name : Text, email : Text, phone : Text, specialization : Text, qualification : Text, yearsOfExperience : Nat, location : Text, currentSalary : Nat, expectedSalary : Nat, skills : Text, bio : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can update candidate profiles");
    };

    let candidate = switch (candidates.get(id)) {
      case (null) { Runtime.trap("Candidate not found") };
      case (?candidate) {
        if (candidate.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only update your own profile");
        };
        candidate;
      };
    };

    let updatedCandidate : Candidate = {
      id;
      name;
      email;
      phone;
      specialization;
      qualification;
      yearsOfExperience;
      location;
      currentSalary;
      expectedSalary;
      skills;
      bio;
      resumeFile = candidate.resumeFile;
      isProfileActive = candidate.isProfileActive;
      createdAt = candidate.createdAt;
      owner = candidate.owner;
    };

    candidates.add(id, updatedCandidate);
  };

  public shared ({ caller }) func uploadResume(candidateId : Nat, file : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can upload resumes");
    };

    let candidate = switch (candidates.get(candidateId)) {
      case (null) { Runtime.trap("Candidate not found") };
      case (?candidate) {
        if (candidate.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only upload your own resume");
        };
        candidate;
      };
    };

    let updatedCandidate : Candidate = {
      id = candidate.id;
      name = candidate.name;
      email = candidate.email;
      phone = candidate.phone;
      specialization = candidate.specialization;
      qualification = candidate.qualification;
      yearsOfExperience = candidate.yearsOfExperience;
      location = candidate.location;
      currentSalary = candidate.currentSalary;
      expectedSalary = candidate.expectedSalary;
      skills = candidate.skills;
      bio = candidate.bio;
      resumeFile = ?file;
      isProfileActive = candidate.isProfileActive;
      createdAt = candidate.createdAt;
      owner = candidate.owner;
    };

    candidates.add(candidateId, updatedCandidate);
  };

  public shared ({ caller }) func toggleProfileActive(candidateId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can toggle profile status");
    };

    let candidate = switch (candidates.get(candidateId)) {
      case (null) { Runtime.trap("Candidate not found") };
      case (?candidate) {
        if (candidate.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only toggle your own profile");
        };
        candidate;
      };
    };

    let updatedCandidate : Candidate = {
      id = candidate.id;
      name = candidate.name;
      email = candidate.email;
      phone = candidate.phone;
      specialization = candidate.specialization;
      qualification = candidate.qualification;
      yearsOfExperience = candidate.yearsOfExperience;
      location = candidate.location;
      currentSalary = candidate.currentSalary;
      expectedSalary = candidate.expectedSalary;
      skills = candidate.skills;
      bio = candidate.bio;
      resumeFile = candidate.resumeFile;
      isProfileActive = not candidate.isProfileActive;
      createdAt = candidate.createdAt;
      owner = candidate.owner;
    };

    candidates.add(candidateId, updatedCandidate);
    updatedCandidate.isProfileActive;
  };

  public query func getCandidateById(id : Nat) : async ?Candidate {
    candidates.get(id);
  };

  public query ({ caller }) func getMyProfile() : async ?Candidate {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view their profile");
    };
    candidates.values().find(func(c) { c.owner == caller });
  };

  // ---- Employer functions ----

  public shared ({ caller }) func registerEmployer(companyName : Text, contactName : Text, email : Text, phone : Text, industry : Text, companySize : Text, location : Text, about : Text, website : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can register as employers");
    };

    let id = nextEmployerId;
    nextEmployerId += 1;

    let employer : Employer = {
      id;
      companyName;
      contactName;
      email;
      phone;
      industry;
      companySize;
      location;
      about;
      website;
      createdAt = Time.now();
      owner = caller;
    };

    employers.add(id, employer);
    id;
  };

  public shared ({ caller }) func updateEmployerProfile(id : Nat, companyName : Text, contactName : Text, email : Text, phone : Text, industry : Text, companySize : Text, location : Text, about : Text, website : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can update employer profiles");
    };

    let employer = switch (employers.get(id)) {
      case (null) { Runtime.trap("Employer not found") };
      case (?employer) {
        if (employer.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only update your own employer profile");
        };
        employer;
      };
    };

    let updatedEmployer : Employer = {
      id;
      companyName;
      contactName;
      email;
      phone;
      industry;
      companySize;
      location;
      about;
      website;
      createdAt = employer.createdAt;
      owner = employer.owner;
    };

    employers.add(id, updatedEmployer);
  };

  public query ({ caller }) func getMyEmployerProfile() : async ?Employer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view their employer profile");
    };
    employers.values().find(func(e) { e.owner == caller });
  };

  public query func getEmployerById(id : Nat) : async ?Employer {
    employers.get(id);
  };

  // ---- Job posting functions ----

  public shared ({ caller }) func createJobPosting(employerId : Nat, title : Text, specializations : Text, qualifications : Text, minExperience : Nat, maxExperience : Nat, location : Text, salaryMin : Nat, salaryMax : Nat, description : Text, skills : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can create job postings");
    };

    let _employer = switch (employers.get(employerId)) {
      case (null) { Runtime.trap("Employer not found") };
      case (?employer) {
        if (employer.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only create job postings for your own employer profile");
        };
        employer;
      };
    };

    let id = nextJobPostingId;
    nextJobPostingId += 1;

    let jobPosting : JobPosting = {
      id;
      employerId;
      title;
      specializations;
      qualifications;
      minExperience;
      maxExperience;
      location;
      salaryMin;
      salaryMax;
      description;
      skills;
      postedAt = Time.now();
      isActive = true;
    };

    jobPostings.add(id, jobPosting);
    id;
  };

  public shared ({ caller }) func updateJobPosting(id : Nat, title : Text, specializations : Text, qualifications : Text, minExperience : Nat, maxExperience : Nat, location : Text, salaryMin : Nat, salaryMax : Nat, description : Text, skills : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can update job postings");
    };

    let jobPosting = switch (jobPostings.get(id)) {
      case (null) { Runtime.trap("Job posting not found") };
      case (?jobPosting) { jobPosting };
    };

    let _employer = switch (employers.get(jobPosting.employerId)) {
      case (null) { Runtime.trap("Employer not found") };
      case (?employer) {
        if (employer.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only update job postings for your own employer profile");
        };
        employer;
      };
    };

    let updatedJobPosting : JobPosting = {
      id;
      employerId = jobPosting.employerId;
      title;
      specializations;
      qualifications;
      minExperience;
      maxExperience;
      location;
      salaryMin;
      salaryMax;
      description;
      skills;
      postedAt = jobPosting.postedAt;
      isActive = jobPosting.isActive;
    };

    jobPostings.add(id, updatedJobPosting);
  };

  public shared ({ caller }) func toggleJobPostingActive(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can toggle job posting status");
    };

    let jobPosting = switch (jobPostings.get(id)) {
      case (null) { Runtime.trap("Job posting not found") };
      case (?jobPosting) { jobPosting };
    };

    let _employer = switch (employers.get(jobPosting.employerId)) {
      case (null) { Runtime.trap("Employer not found") };
      case (?employer) {
        if (employer.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only toggle job postings for your own employer profile");
        };
        employer;
      };
    };

    let updatedJobPosting : JobPosting = {
      id = jobPosting.id;
      employerId = jobPosting.employerId;
      title = jobPosting.title;
      specializations = jobPosting.specializations;
      qualifications = jobPosting.qualifications;
      minExperience = jobPosting.minExperience;
      maxExperience = jobPosting.maxExperience;
      location = jobPosting.location;
      salaryMin = jobPosting.salaryMin;
      salaryMax = jobPosting.salaryMax;
      description = jobPosting.description;
      skills = jobPosting.skills;
      postedAt = jobPosting.postedAt;
      isActive = not jobPosting.isActive;
    };

    jobPostings.add(id, updatedJobPosting);
    updatedJobPosting.isActive;
  };

  public query func getJobPostingById(id : Nat) : async ?JobPosting {
    jobPostings.get(id);
  };

  public query func getJobPostingsByEmployer(employerId : Nat) : async [JobPosting] {
    jobPostings.values().toArray().filter(func(jp) { jp.employerId == employerId });
  };

  public query func getAllActiveJobPostings() : async [JobPosting] {
    jobPostings.values().toArray().filter(func(jp) { jp.isActive });
  };

  public query func searchCandidates(keywords : Text, specialization : ?Text, qualification : ?Text, minExperience : ?Nat, maxExperience : ?Nat, location : ?Text) : async [Candidate] {
    let keywordLower = keywords.toLower();

    candidates.values().toArray().filter(
      func(c) {
        c.isProfileActive and (
          keywordLower.isEmpty() or c.name.toLower().contains(#text keywordLower) or c.skills.toLower().contains(#text keywordLower) or c.bio.toLower().contains(#text keywordLower) or c.specialization.toLower().contains(#text keywordLower)
        ) and (
          switch (specialization) {
            case (null) { true };
            case (?spec) { c.specialization == spec };
          }
        ) and (
          switch (qualification) {
            case (null) { true };
            case (?qual) { c.qualification == qual };
          }
        ) and (
          switch (minExperience) {
            case (null) { true };
            case (?minExp) { c.yearsOfExperience >= minExp };
          }
        ) and (
          switch (maxExperience) {
            case (null) { true };
            case (?maxExp) { c.yearsOfExperience <= maxExp };
          }
        ) and (
          switch (location) {
            case (null) { true };
            case (?loc) { c.location == loc };
          }
        )
      }
    );
  };

  // ---- Job application functions ----

  // Any registered user with a candidate profile can apply to an active job posting.
  public shared ({ caller }) func applyToJob(jobPostingId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can apply to jobs");
    };

    let job = switch (jobPostings.get(jobPostingId)) {
      case (null) { Runtime.trap("Job posting not found") };
      case (?job) { job };
    };

    if (not job.isActive) {
      Runtime.trap("Job posting is not active");
    };

    switch (candidates.values().find(func(c) { c.owner == caller })) {
      case (null) { Runtime.trap("Candidate profile not found: you must register as a candidate before applying") };
      case (_) {};
    };

    let currentApplications : List.List<Principal> = switch (applications.get(jobPostingId)) {
      case (null) { List.empty<Principal>() };
      case (?list) { list };
    };

    // Explicitly check for existing application
    let containsCaller = currentApplications.contains(caller);

    if (containsCaller) {
      Runtime.trap("Already applied to this job");
    };

    currentApplications.add(caller);
    applications.add(jobPostingId, currentApplications);
  };

  // Only the employer who owns the job posting (or an admin) can view applications.
  public query ({ caller }) func getApplicationsForJob(jobPostingId : Nat) : async [Candidate] {
    // Must be a registered user (employers are registered users)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view job applications");
    };

    let job = switch (jobPostings.get(jobPostingId)) {
      case (null) { Runtime.trap("Job posting not found") };
      case (?job) { job };
    };

    let employer = switch (employers.get(job.employerId)) {
      case (null) { Runtime.trap("Employer not found") };
      case (?employer) { employer };
    };

    // Only the employer who owns this posting or an admin may view applicants
    if (employer.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view applications for your own job postings");
    };

    let applicantPrincipals = switch (applications.get(jobPostingId)) {
      case (null) { List.empty<Principal>() };
      case (?list) { list };
    };

    let applicantCandidates = List.empty<Candidate>();

    applicantPrincipals.forEach(
      func(applicant) {
        let candidate = candidates.values().find(func(c) { c.owner == applicant });
        switch (candidate) {
          case (null) {};
          case (?c) { applicantCandidates.add(c) };
        };
      }
    );

    applicantCandidates.toArray();
  };
};
