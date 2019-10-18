import * as Jira from "./mocks/jira.json";
import * as Fields from "./mocks/fields.json";

export const getControlsData = () => {
  let nonEmptyFields = {};
  Jira.issues.forEach(issue => {
    Object.entries(issue.fields).forEach(([field, value]) => {
      if (value !== null && !nonEmptyFields[field]) {
        nonEmptyFields[field] = Fields.fields.find(f => f.id == field);
      }
    });
  });

  const fieldsArray = Object.values(nonEmptyFields).filter(f => f);
  const sizeFields = fieldsArray.filter(f => f.schema.type == "number");
  const colorFields = fieldsArray.filter(f => f.schema.type != "array");
  return { clusterFields: fieldsArray, sizeFields, colorFields };
};

// export const getColormapper =() => {

// }
