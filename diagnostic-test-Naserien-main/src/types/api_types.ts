/**
 * This file can be used to store types and interfaces for data received from the API.
 * It's good practice to name your interfaces in the following format:
 * IMyInterfaceName - Where the character "I" is prepended to the name of your interface.
 * This helps remove confusion between classes and interfaces.
 */

/**
 * This represents a class as returned by the API
 */
export interface IUniversityClass {
  classId: string;
  title: string;
  description: string;
  meetingTime: string;
  meetingLocation: string;
  status: string;
  semester: string;
}

// Additional interfaces

// Grades interface
export interface IGrades {
  classId: string;
  grades: Record<string, string>;
  name: string;
  studentId: string;
}

// Student interface
export interface IStudent {
  dateEnrolled: string;
  name: string;
  status: "Active" | "Inactive" | "Graduated";
  universityId: string;
  finalGrade?: number;
}

// Assignment interface
export interface IAssignment {
  assignmentId: string;
  classId: string;
  date: string;
  weight: number;
}
