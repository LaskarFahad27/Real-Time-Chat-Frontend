export const BACKEND_URL = "http://localhost:4000/api";

export async function registerStudent(name, email, admittedSemester, password) {
  
  try {

    const response = await fetch(`${BACKEND_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        name,
        email,
        semester: admittedSemester,
        password
      }),
    });
    
    const data = await response.json();

    if (data.success) {
      console.log("Student created successfully:", data);
      return data;
    }
    else {
      throw new Error(data.message || "Failed to create student");
    }
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
}

export async function loginStudent(email, password) {
  
  try {

    const response = await fetch(`${BACKEND_URL}/students/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        email,
        password
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log("Student logged in successfully:", data);
      console.log("Status: ", response.status);
      return data;
    }
    else {
      throw new Error(data.message || "Failed to create student");
    }
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
}

//fetch google logged in user profile

export const getGoogleUserProfile = async () => {

  const token = localStorage.getItem("token");
   if(!token){
    return null;
   }

    try {
    const response = await fetch("http://localhost:4000/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
}

//-----------Get All Users--------------

export async function getAllUsers() {
  const token = localStorage.getItem("token");
  
  try {

    const response = await fetch(`${BACKEND_URL}/students`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return null;
  }
}