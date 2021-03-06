import request from "../utils/request";

export function fetchStudentList() {
  return request("/api/studentList", {
    method: "post"
  });
}
export function addStudent({ currentAddStudent }) {
  return request("/api/addStudent", {
    method: "post",
    body: JSON.stringify({
      currentAddStudent: currentAddStudent
    })
  });
}

export function deleteStudent({ id }) {
  return request("/api/deleteStudent", {
    method: "post",
    body: JSON.stringify({
      studentId: id
    })
  });
}

export function fetchCurrentStudent({ id }) {
  return request("/api/currentStudent", {
    method: "post",
    body: JSON.stringify({
      studentId: id
    })
  });
}

export function editStudent({ currentEditStudent }) {
  return request("/api/editStudent", {
    method: "post",
    body: JSON.stringify({
      currentEditStudent: currentEditStudent
    })
  });
}
