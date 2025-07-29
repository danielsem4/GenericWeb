import type { IModule } from "../types/User";
import type { IUser } from "../types/Users";

const availableModules: IModule[] = [
    { id: 1, name: "Questionnaires" },
    { id: 2, name: "Medications" },
    { id: 3, name: "Graphs" },
    { id: 4, name: "Statistics" },
    { id: 5, name: "Cognitives" },
    { id: 6, name: "File Management" },
    { id: 7, name: "Chat" },
    { id: 8, name: "Activities" }
  ];
  
  export const sampleUsers: IUser[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Senior Doctor",
      status: "Active",
      department: "Cardiology",
      joinDate: "2022-03-15",
      lastLogin: "2025-07-29T08:30:00Z",
      activeModules: [
        availableModules[0], // Questionnaires
        availableModules[1], // Medications
        availableModules[2], // Graphs
        availableModules[3]  // Statistics
      ]
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      role: "Nurse Practitioner",
      status: "Active",
      department: "Emergency",
      joinDate: "2023-01-10",
      lastLogin: "2025-07-28T14:45:00Z",
      activeModules: [
        availableModules[0], // Questionnaires
        availableModules[1], // Medications
        availableModules[6], // Chat
        availableModules[7]  // Activities
      ]
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      role: "Therapist",
      status: "Active",
      department: "Mental Health",
      joinDate: "2021-11-20",
      lastLogin: "2025-07-29T10:15:00Z",
      activeModules: [
        availableModules[0], // Questionnaires
        availableModules[4], // Cognitives
        availableModules[6], // Chat
        availableModules[7]  // Activities
      ]
    },
    {
      id: 4,
      name: "David Thompson",
      email: "david.thompson@company.com",
      role: "Administrator",
      status: "Active",
      department: "IT",
      joinDate: "2020-05-08",
      lastLogin: "2025-07-29T09:00:00Z",
      activeModules: availableModules // All modules
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.wang@company.com",
      role: "Research Coordinator",
      status: "Active",
      department: "Research",
      joinDate: "2022-09-12",
      lastLogin: "2025-07-28T16:20:00Z",
      activeModules: [
        availableModules[0], // Questionnaires
        availableModules[2], // Graphs
        availableModules[3], // Statistics
        availableModules[5]  // File Management
      ]
    },
    {
      id: 6,
      name: "Robert Martinez",
      email: "robert.martinez@company.com",
      role: "Doctor",
      status: "Inactive",
      department: "Neurology",
      joinDate: "2019-02-14",
      lastLogin: "2025-07-15T11:30:00Z",
      activeModules: [
        availableModules[1], // Medications
        availableModules[4], // Cognitives
        availableModules[2]  // Graphs
      ]
    },
    {
      id: 7,
      name: "Jennifer Lee",
      email: "jennifer.lee@company.com",
      role: "Nurse",
      status: "Active",
      department: "Pediatrics",
      joinDate: "2023-06-01",
      lastLogin: "2025-07-29T07:45:00Z",
      activeModules: [
        availableModules[0], // Questionnaires
        availableModules[1], // Medications
        availableModules[7]  // Activities
      ]
    },
    {
      id: 8,
      name: "James Wilson",
      email: "james.wilson@company.com",
      role: "Data Analyst",
      status: "Active",
      department: "Analytics",
      joinDate: "2022-07-18",
      lastLogin: "2025-07-28T13:10:00Z",
      activeModules: [
        availableModules[2], // Graphs
        availableModules[3], // Statistics
        availableModules[5]  // File Management
      ]
    },
    {
      id: 9,
      name: "Maria Garcia",
      email: "maria.garcia@company.com",
      role: "Social Worker",
      status: "Pending",
      department: "Social Services",
      joinDate: "2025-07-20",
      lastLogin: "2025-07-25T12:00:00Z",
      activeModules: [
        availableModules[0], // Questionnaires
        availableModules[6], // Chat
        availableModules[7]  // Activities
      ]
    },
    {
      id: 10,
      name: "Kevin Brown",
      email: "kevin.brown@company.com",
      role: "Pharmacist",
      status: "Active",
      department: "Pharmacy",
      joinDate: "2021-04-03",
      lastLogin: "2025-07-29T08:15:00Z",
      activeModules: [
        availableModules[1], // Medications
        availableModules[2], // Graphs
        availableModules[5]  // File Management
      ]
    },
    {
      id: 11,
      name: "Amanda Davis",
      email: "amanda.davis@company.com",
      role: "Physiotherapist",
      status: "Active",
      department: "Rehabilitation",
      joinDate: "2023-02-28",
      lastLogin: "2025-07-28T15:30:00Z",
      activeModules: [
        availableModules[0], // Questionnaires
        availableModules[4], // Cognitives
        availableModules[7]  // Activities
      ]
    },
    {
      id: 12,
      name: "Thomas Anderson",
      email: "thomas.anderson@company.com",
      role: "IT Support",
      status: "Active",
      department: "IT",
      joinDate: "2022-11-15",
      lastLogin: "2025-07-29T09:45:00Z",
      activeModules: [
        availableModules[5], // File Management
        availableModules[6]  // Chat
      ]
    },
    {
      id: 13,
      name: "Rachel Green",
      email: "rachel.green@company.com",
      role: "Nutritionist",
      status: "Active",
      department: "Nutrition",
      joinDate: "2021-08-22",
      lastLogin: "2025-07-28T11:20:00Z",
      activeModules: [
        availableModules[0], // Questionnaires
        availableModules[2], // Graphs
        availableModules[7]  // Activities
      ]
    },
    {
      id: 14,
      name: "Daniel Kim",
      email: "daniel.kim@company.com",
      role: "Lab Technician",
      status: "Inactive",
      department: "Laboratory",
      joinDate: "2020-12-10",
      lastLogin: "2025-07-10T14:00:00Z",
      activeModules: [
        availableModules[2], // Graphs
        availableModules[3], // Statistics
        availableModules[5]  // File Management
      ]
    },
    {
      id: 15,
      name: "Sophie Taylor",
      email: "sophie.taylor@company.com",
      role: "Occupational Therapist",
      status: "Active",
      department: "Rehabilitation",
      joinDate: "2023-04-12",
      lastLogin: "2025-07-29T10:30:00Z",
      activeModules: [
        availableModules[0], // Questionnaires
        availableModules[4], // Cognitives
        availableModules[6], // Chat
        availableModules[7]  // Activities
      ]
    },
    {
      id: 16,
      name: "Mark Johnson",
      email: "mark.johnson@company.com",
      role: "Security Officer",
      status: "Active",
      department: "Security",
      joinDate: "2021-01-18",
      lastLogin: "2025-07-28T18:00:00Z",
      activeModules: [
        availableModules[5], // File Management
        availableModules[6]  // Chat
      ]
    },
    {
      id: 17,
      name: "Catherine White",
      email: "catherine.white@company.com",
      role: "Clinical Psychologist",
      status: "Pending",
      department: "Mental Health",
      joinDate: "2025-07-15",
      lastLogin: "2025-07-22T09:30:00Z",
      activeModules: [
        availableModules[0], // Questionnaires
        availableModules[4], // Cognitives
        availableModules[6]  // Chat
      ]
    },
    {
      id: 18,
      name: "Andrew Miller",
      email: "andrew.miller@company.com",
      role: "Radiologist",
      status: "Active",
      department: "Radiology",
      joinDate: "2019-09-25",
      lastLogin: "2025-07-29T07:00:00Z",
      activeModules: [
        availableModules[2], // Graphs
        availableModules[3], // Statistics
        availableModules[5]  // File Management
      ]
    },
    {
      id: 19,
      name: "Laura Harris",
      email: "laura.harris@company.com",
      role: "Quality Assurance",
      status: "Active",
      department: "Quality Control",
      joinDate: "2022-05-30",
      lastLogin: "2025-07-28T16:45:00Z",
      activeModules: [
        availableModules[0], // Questionnaires
        availableModules[2], // Graphs
        availableModules[3], // Statistics
        availableModules[5]  // File Management
      ]
    },
    {
      id: 20,
      name: "Christopher Davis",
      email: "christopher.davis@company.com",
      role: "Maintenance",
      status: "Active",
      department: "Facilities",
      joinDate: "2020-03-07",
      lastLogin: "2025-07-27T10:15:00Z",
      activeModules: [
        availableModules[6], // Chat
        availableModules[5]  // File Management
      ]
    }
  ];