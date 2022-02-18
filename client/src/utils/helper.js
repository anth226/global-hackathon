export const getFieldData = (fieldData = [], field) => {
  let result = fieldData.filter((item) => item.field === field);
  return result;
};

export const getOrgTypesData = (fieldData = []) => {
  let result = fieldData.filter((item) => item.field === "org_type");
  result = result.sort((a, b) => {
    if (a.value === "Other") return 1;
    if (b.value === "Other") return -1;
    if (a.value.toLowerCase() > b.value.toLowerCase()) return 1;
    return -1;
  });
  return result;
};

export const getOneFieldData = (fieldData = [], field) => {
  for (let fd of fieldData) {
    if (fd.field === field) return fd.value;
  }
  return "";
};

export const getFieldDataById = (fieldData = [], id) => {
  for (let fd of fieldData) {
    if (fd._id === id) return fd;
  }
  return null;
};

export const getFieldDataByNameValue = (fieldData = [], name, value = "") => {
  for (let fd of fieldData) {
    if (fd.field === name && fd.value.toLowerCase() === value.toLowerCase())
      return fd;
  }
  return null;
};

export const getTargetFieldName = (prefix, fieldData) => {
  let list = [];
  for (let item of fieldData) {
    if (item.field.startsWith(`${prefix}_`)) list.push(item.field);
  }
  let result = list.filter((v, i, a) => a.indexOf(v) === i);
  return result;
};

export const processTargetSectionName = (prefix, name) => {
  if (!name || name.length < 2) return "";
  let result = name.toLowerCase();
  result = result.split(" ").join("_");
  return prefix + "_" + result;
};

export const getTargetLabelFromSection = (prefix, sectionFieldName) => {
  let result = sectionFieldName.replace(`${prefix}_`, "");
  result = result.split("_").join(" ");
  result = result.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1) + "s";
  });
  if (result === "Categorys") return "Categories";
  return result;
};

export const randomColor = (index) => {
  const colors = ["blue", "cyan", "geekblue", "purple", "green"];
  // return colors[Math.floor(Math.random() * colors.length)];
  if (index > colors.length - 1) return "green";
  return colors[index];
};

export const toTitleText = (text) => {
  if (!text) return "";
  return text.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const getLabel = (name, labels) => {
  if (!labels) labels = [];
  for (let label of labels) {
    if (label.name === name) return label.text;
  }
  return "";
};

export const sortByValue = (arrObj = []) => {
  return arrObj.sort((a, b) => {
    var valueA = a.value.toLowerCase(); // ignore upper and lowercase
    var valueB = b.value.toLowerCase(); // ignore upper and lowercase
    if (valueA < valueB) {
      return -1;
    }
    if (valueA > valueB) {
      return 1;
    }
    return 0;
  });
};

export const extractContent = (s, space) => {
  var span = document.createElement("span");
  span.innerHTML = s;
  if (space) {
    var children = span.querySelectorAll("*");
    for (var i = 0; i < children.length; i++) {
      if (children[i].textContent) children[i].textContent += " ";
      else children[i].innerText += " ";
    }
  }
  return [span.textContent || span.innerText].toString().replace(/ +/g, " ");
};

export const checkPwdStrength = (password) => {
  var strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  if (!password) return false;
  return strongRegex.test(password);
};

export const processLink = (link) => {
  if (!link) return "";
  if (!link.startsWith("http://") && !link.startsWith("https://")) {
    return "https://" + link;
  }
  return link;
};
