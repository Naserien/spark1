import React, { useEffect, useState } from "react";
import { BASE_API_URL, GET_DEFAULT_HEADERS, MY_BU_ID, TOKEN } from "../globals";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import { IUniversityClass, IStudent, IAssignment } from "../types/api_types";
import { calculateStudentFinalGrade } from "../utils/calculate_grade";

interface GradeTableProps {
  selectedClass: IUniversityClass | null;
  students: string[];
}

export const GradeTable: React.FC<GradeTableProps> = ({ selectedClass, students }) => {
  const [studentDataList, setStudentDataList] = useState<IStudent[]>([]);
  const [classAssignments, setClassAssignments] = useState<IAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchClassAssignments = async (classId: string) => {
      try {
        const response = await fetch(`${BASE_API_URL}/class/listAssignments/${classId}?buid=${MY_BU_ID}`, {
          method: "GET",
          headers: {
            ...GET_DEFAULT_HEADERS(),
            'x-functions-key': TOKEN,
          },
        });

        if (response.ok) {
          const assignments = await response.json();
          setClassAssignments(assignments);
          console.log(`Fetched assignments for class with ID: ${classId}`, assignments);
        } else {
          console.error(`Failed to fetch assignments for class with ID: ${classId}`);
        }
      } catch (error) {
        console.error(`Error fetching assignments for class with ID: ${classId}`, error);
      }
    };

    if (selectedClass) {
      setLoading(true);
      fetchClassAssignments(selectedClass.classId);
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    const fetchStudentData = async () => {
      const newDataList: IStudent[] = [];

      for (const studentId of students) {
        try {
          const response = await fetch(`${BASE_API_URL}/student/GetById/${studentId}?buid=${MY_BU_ID}`, {
            method: "GET",
            headers: {
              ...GET_DEFAULT_HEADERS(),
              'x-functions-key': TOKEN,
            },
          });

          if (response.ok) {
            const studentInfo = await response.json();
            newDataList.push(...studentInfo);
            console.log(`Fetched data for student with ID: ${studentId}`, studentInfo);
          } else {
            console.error(`Failed to fetch data for student with ID: ${studentId}`);
          }
        } catch (error) {
          console.error(`Error fetching data for student with ID: ${studentId}`, error);
        }
      }

      setStudentDataList(newDataList);
      console.log("Final Student Data List:", newDataList);

      const updatedList = await Promise.all(
        newDataList.map(async (student) => {
          const finalGrade = selectedClass ? await calculateStudentFinalGrade(student.universityId, classAssignments, selectedClass) : 0;
          return { ...student, finalGrade };
        })
      );

      setStudentDataList(updatedList);
    };

    if (selectedClass && classAssignments.length > 0) {
      setLoading(true);
      fetchStudentData();
      setLoading(false);
    }
  }, [students, selectedClass, classAssignments]);

  if (!selectedClass || loading) {
    return <CircularProgress />; // Loading indicator while data is being fetched
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student ID</TableCell>
            <TableCell>Student Name</TableCell>
            <TableCell>Class ID</TableCell>
            <TableCell>Class Name</TableCell>
            <TableCell>Semester</TableCell>
            <TableCell>Final Grade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studentDataList.map((student) => (
            <TableRow key={student.universityId}>
              <TableCell>{student.universityId}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{selectedClass.classId}</TableCell>
              <TableCell>{selectedClass.title}</TableCell>
              <TableCell>{selectedClass.semester}</TableCell>
              <TableCell>{student.finalGrade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
