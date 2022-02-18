import React from "react";
import { Tag } from "antd";
import {
  getTargetFieldName,
  getTargetLabelFromSection,
  randomColor,
  sortByValue
} from "../../utils/helper";

class Tags extends React.Component {
  render() {
    const { fieldData, prefix } = this.props;
    const namelist = getTargetFieldName(prefix, fieldData);
    return (
      <div className="mt-3 mb-2">
        {namelist.map((name, i) => {
          return this.renderTags(name, randomColor(i), i);
        })}
      </div>
    );
  }

  renderTags = (name, color, i) => {
    const { fieldData, tags, prefix} = this.props;
    let taglist = [];
    for (let tagId of tags) {
      let filters = fieldData.filter(
        (item) => item._id === tagId && item.field === name
      );
      if (filters.length > 0) taglist.push(filters[0]);
    }
    const label = getTargetLabelFromSection(prefix, name);
    if (taglist.length === 0) return null;
    taglist = sortByValue(taglist)
    return (
      <p style={{marginBottom: "8px"}} key={i}>
        <b >{label}:&nbsp;&nbsp;</b>
        {taglist.map((tag) => (
          <Tag key={tag._id} color={color} className="mr-2">
            {tag.value}
          </Tag>
        ))}
      </p>
    );
  };
}

export default Tags;
