import request from "../utils/request";

export function fetchTemplateList({ isPraise }) {
  return request("/api/templateList", {
    method: "post",
    body: JSON.stringify({
      isPraise: isPraise
    })
  });
}

export function addTemplate({ currentAddTemplate }) {
  return request("/api/addTemplate", {
    method: "post",
    body: JSON.stringify({
      currentAddTemplate: currentAddTemplate
    })
  });
}

export function deleteTemplate({ id }) {
  return request("/api/deleteTemplate", {
    method: "post",
    body: JSON.stringify({
      templateId: id
    })
  });
}

export function fetchCurrentTemplate({ id }) {
  return request("/api/currentTemplate", {
    method: "post",
    body: JSON.stringify({
      templateId: id
    })
  });
}

export function editTemplate({ currentEditTemplate }) {
  return request("/api/editTemplate", {
    method: "post",
    body: JSON.stringify({
      currentEditTemplate: currentEditTemplate
    })
  });
}
