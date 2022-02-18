import React from "react";

class UserAttr extends React.Component {
  render() {
    const { fieldData, fieldName } = this.props;
    if (!fieldData) return null
    const pfields = fieldData.filter((fd) => fd.field === fieldName);
    return (
      <div className="mt-2">
        {pfields.map((pf, i) => {
          return this.renderFields(pf, i);
        })}
      </div>
    );
  }

  renderFields = (pf, i) => {
    const { attr } = this.props;
    if (!attr || !attr[pf.value]) return null;
    return (
      <div className="flex mb-2" key={i}>
        <span>{pf.value}: </span> &nbsp;&nbsp;
        {pf.option === "richtext" && (
          <div
            className="sun-editor-editable"
            dangerouslySetInnerHTML={{ __html: attr[pf.value] }}
          />
        )}
        {pf.option !== "richtext" && <span>{attr[pf.value]}</span>}
      </div>
    );
  };
}

export default UserAttr;
