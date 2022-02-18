import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Tag } from "antd";
import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import {
  getFieldData,
  getTargetFieldName,
  getTargetLabelFromSection,
  sortByValue
} from "../../utils/helper";

class ListProperty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagIds: props.tags,
    };
  }

  updateTags = () => {
    const { tagIds } = this.state;
    this.props.updateTags({ tags: tagIds });
  };

  handleOnClickTag = (tag) => {
    let tagIds = this.state.tagIds;
    let filters = tagIds.filter((item) => item === tag._id);
    if (filters.length === 0) {
      tagIds.push(tag._id);
      this.setState({ tagIds });
    }
  };

  handleOnRemoveTag = (tag) => {
    let tagIds = this.state.tagIds;
    for (let i = tagIds.length - 1; i >= 0; i--) {
      if (tagIds[i] === tag._id) {
        tagIds.splice(i, 1);
      }
    }
    this.setState({ tagIds });
  };

  render = () => {
    const namelist = getTargetFieldName(
      this.props.prefix,
      this.props.fieldData
    );
    return (
      <Row className="mt-3 mb-3">
        <Col>
          {namelist.map((name, i) => {
            return this.renderTags(name, i);
          })}
        </Col>
      </Row>
    );
  };

  renderTags = (name, i) => {
    const { tagIds } = this.state;
    const { fieldData, prefix } = this.props;
    let taglist = [];
    for (let tagId of tagIds) {
      let filters = fieldData.filter(
        (item) => item._id === tagId && item.field === name
      );
      if (filters.length > 0) taglist.push(filters[0]);
    }
    const label = getTargetLabelFromSection(prefix, name);
    const originTagList = getFieldData(fieldData, name);
    taglist = sortByValue(taglist)
    return (
      <React.Fragment key={i}>
        <h5 className="mt-4">{label}</h5>
        <Row className="m-0 mt-3 mb-2">
          {taglist.length > 0 &&
            taglist.map((item) => {
              return (
                <Tag
                  className="site-tag-check mt-1"
                  onClick={() => this.handleOnRemoveTag(item)}
                  key={item._id}
                >
                  <CheckOutlined />
                  &nbsp;{item.value}
                </Tag>
              );
            })}
        </Row>
        <Row className="search-title m-0 p-0 justify-content-between">
          <span>Select {label}</span>
        </Row>
        <Row className="m-0 mt-3">
          {originTagList.length > 0 &&
            originTagList.map((item) => {
              return (
                <Tag
                  className="site-tag-plus mt-1"
                  onClick={() => this.handleOnClickTag(item)}
                  key={item._id}
                >
                  <PlusOutlined />
                  &nbsp;{item.value}
                </Tag>
              );
            })}
        </Row>
      </React.Fragment>
    );
  };
}

export default ListProperty;
