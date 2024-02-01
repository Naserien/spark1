// calculate_grade.ts

import { IUniversityClass, IGrades, IAssignment } from "../types/api_types";
import { BASE_API_URL, GET_DEFAULT_HEADERS, MY_BU_ID, TOKEN } from "../globals";

export async function calculateStudentFinalGrade(
  studentID: string,
  classAssignments: IAssignment[],
  klass: IUniversityClass
): Promise<number> {
  try {
    const response = await fetch(
      `${BASE_API_URL}/student/listGrades/${studentID}/${klass.classId}?buid=${MY_BU_ID}`,
      {
        method: "GET",
        headers: {
          ...GET_DEFAULT_HEADERS(),
          'x-functions-key': TOKEN,
        },
      }
    );

    if (response.ok) {
      const studentGrades: IGrades = await response.json();
      const grades = studentGrades.grades[0];

      // Calculate weighted score for each assignment and sum them up
      let totalWeightedSum = 0;

      for (const assignId of Object.keys(grades)) {
        console.log(grades);

        const assignment = classAssignments.find((assignment) => assignment.assignmentId === assignId);
        if (!assignment) {
          throw new Error("Wrong assignment!");
        }
        const weightedScore = (assignment.weight * parseFloat((grades as any)[assignId]) / 100); // Assuming grades are in percentage
        totalWeightedSum += weightedScore;
      }

      // Round the totalWeightedSum to one decimal place
      totalWeightedSum = parseFloat(totalWeightedSum.toFixed(1));


      return totalWeightedSum;
    } else {
      console.error("Failed to fetch student grades");
      return -1; // Or handle error accordingly
    }
  } catch (error) {
    console.error("Error fetching student grades", error);
    return -1; // Or handle error accordingly
  }
}
