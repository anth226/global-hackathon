import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { Radio } from "antd";
import { updateFieldData } from "../../../actions/profile";

class ListColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "4",
    };
  }

  componentDidMount() {
    const { fieldData, field } = this.props;
    for (let fd of fieldData) {
      if (fd.field === field) {
        this.setState({ value: fd.value });
        return;
      }
    }
  }

  onChangeColumn = (e) => {
    const { updateFieldData, field } = this.props;

    updateFieldData({ field, value: e.target.value });
    this.setState({ value: e.target.value });
  };

  renderColumnBox = () => {
    const { value } = this.state;
    const nCol = parseInt(value);

    let cols = [];
    for (let i = 0; i < nCol; i++)
      cols.push(
        <Col xm={12 / nCol} key={i}>
          <div className="list-tile" />
        </Col>
      );
    return (
      <div className="list-column-box">
        <Row>{cols}</Row>
      </div>
    );
  };

  render() {
    return (
      <div className="admin-list-column mt-5">
        <span>List Columns:</span>
        <div className="list-box">
          <Radio.Group onChange={this.onChangeColumn} value={this.state.value}>
            <Radio value={"1"}>One</Radio>
            <Radio value={"2"}>Two</Radio>
            <Radio value={"4"}>Four</Radio>
          </Radio.Group>
          {this.renderColumnBox()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData };
}

export default connect(mapStateToProps, { updateFieldData })(ListColumn);
