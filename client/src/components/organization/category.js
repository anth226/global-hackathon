import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Tag } from "antd";
import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { getFieldData } from "../../utils/helper";

class ChallengeCategory extends Component {
  state = {
    category: this.props.category || [],
  };

  updateLists = () => {
    const { category } = this.state;
    this.props.updateLists({ category });
  };

  handleOnClickCategory = (item) => {
    const curCat = [...this.state.category];
    let result = curCat.filter((itm) => itm === item);
    if (result.length > 0) return;
    curCat.push(item);
    this.setState({ category: curCat }, this.updateLists);
  };

  handleOnRemoveCategory = (item) => {
    const curCat = [...this.state.category];
    let result = curCat.filter((itm) => itm !== item);
    if (result.length === 0) return;
    this.setState({ category: result }, this.updateLists);
  };

  render = () => {
    const { category } = this.state;
    const { fieldData } = this.props;
    const categoryList = getFieldData(fieldData, "category");

    return (
      <Row>
        <Col>
          {this.renderCategory(category, categoryList)}
        </Col>
      </Row>
    );
  };

  renderCategory = (category, categoryList) => (
    <React.Fragment>
      <h5 className="mt-4">Category</h5>
      <Row className="m-0 mt-3 mb-2">
        {category.length > 0 &&
          category.map((item, index) => {
            return (
              <Tag
                className="site-tag-check mt-1"
                onClick={() => this.handleOnRemoveCategory(item)}
                key={index}
              >
                <CheckOutlined />
                &nbsp;{item}
              </Tag>
            );
          })}
      </Row>
      <Row className="search-title m-0 p-0 justify-content-between">
        <span>Select Category</span>
      </Row>
      <Row className="m-0 mt-1 mb-4">
        {categoryList.length > 0 &&
          categoryList.map((item, index) => {
            return (
              <Tag
                className="site-tag-plus mt-1"
                onClick={() => this.handleOnClickCategory(item.value)}
                key={index}
              >
                <PlusOutlined />
                &nbsp;{item.value}
              </Tag>
            );
          })}
      </Row>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    fieldData: state.profile.fieldData,
  };
};
export default connect(mapStateToProps, {})(ChallengeCategory);
