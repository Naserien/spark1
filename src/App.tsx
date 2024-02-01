import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Select, Typography, MenuItem } from "@mui/material";
import { BASE_API_URL, GET_DEFAULT_HEADERS, MY_BU_ID, TOKEN } from "./globals";
import { IUniversityClass} from "./types/api_types";
import { SelectChangeEvent } from "@mui/material";
import { GradeTable } from "./components/GradeTable";

function App() {
  const [currClassId, setCurrClassId] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<IUniversityClass | null>(null);
  const [students, setStudents] = useState<string[]>([]);

  useEffect(() => {
    // Fetch class list on component mount
    fetchClassList();
  }, []);

  const fetchClassList = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/class/listBySemester/fall2022?buid=${MY_BU_ID}`, {
        method: "GET",
        headers: {
          ...GET_DEFAULT_HEADERS(),
          'x-functions-key': TOKEN,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClassList(data);
      } else {
        console.error("Failed to fetch class list");
      }
    } catch (error) {
      console.error("Error fetching class list", error);
    }
  };

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    const selectedClass = classList.find((classItem) => classItem.classId === event.target.value);
    setCurrClassId(event.target.value);
    setSelectedClass(selectedClass || null);
    // Fetch students for the selected class
    fetchStudentsForClass(event.target.value);
  };

  const fetchStudentsForClass = async (classId: string) => {
    try {
      console.log("Fetching students for class with ID:", classId);
  
      const response = await fetch(`${BASE_API_URL}/class/listStudents/${classId}?buid=${MY_BU_ID}`, {
        method: "GET",
        headers: {
          ...GET_DEFAULT_HEADERS(),
          'x-functions-key': TOKEN,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error("Failed to fetch students for the selected class");
      }
    } catch (error) {
      console.error("Error fetching students for the selected class", error);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Spark Assessment
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Select a class
          </Typography>
          <div style={{ width: "100%" }}>
            <Select
              fullWidth={true}
              label="Class"
              value={currClassId}
              onChange={handleClassChange}
            >
              {classList.map((classItem) => (
                <MenuItem key={classItem.classId} value={classItem.classId}>
                  {classItem.title}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          {/* Render the GradeTable component with the selected class and students */}
          {/* <GradeTable selectedClass={selectedClass} students={students} /> */}
          <GradeTable selectedClass={selectedClass} students={students} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;