import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Skeleton, Input, Checkbox, Select } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import { clearSearch } from "../../actions/auth";
import { listJudges } from "../../actions/judge";
import { Header, Footer, CustomCard } from "../../components/template";
import Spinner from "../../components/pages/spinner";
import UserAvatar from "../../assets/img/user-avatar.png";
import {
  getFieldData,
  getTargetFieldName,
  getOneFieldData,
} from "../../utils/helper";
import { createNotification } from "../../actions";

const { Option } = Select;

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchStr: props.user.searchTxt,
    };
  }

  componentDidMount = async () => {
    const { user, listJudges } = this.props;
    if (!user.judges || user.judges.length === 0) {
      this.setState({ loading: true });
      await listJudges(0, this.state);
      this.setState({ loading: false });
    }
  };

  onChangeSearch = (e) => {
    this.setState({ searchStr: e.target.value });
  };

  loadMore = () => {
    const { user, listJudges } = this.props;
    if (user.judges.length < 16) return;
    listJudges(user.judges.length, this.state);
  };

  onSearch = (value) => {
    if (value && value.length < 3) {
      createNotification(
        `Search ${this.props.label.titleParticipant}`,
        "Search text should be at least 3 in length"
      );
      this.setState({ searchStr: value });
      return;
    }
    this.setState({ searchStr: value }, () => this.onApplyFilter());
  };

  refreshParticipants = () => {
    const namelist = getTargetFieldName("profile", this.props.fieldData);
    let state = this.state;
    for (let name of namelist) {
      state[name] = [];
    }
    state.searchStr = "";
    state.filter_sort = "";
    this.setState(state, () => this.onApplyFilter());
  };

  mkOptions = (list) => {
    let newList = list.map((item) => {
      return { label: item.value, value: item._id };
    });
    return newList;
  };

  onChangeFilter = (name, values) => {
    this.setState({ [name]: values }, this.onApplyFilter);
  };

  handleRemoveFilter = (tag) => {
    let stateTags = this.state[tag.field];
    for (let i = stateTags.length - 1; i >= 0; i--) {
      if (stateTags[i] === tag._id) {
        stateTags.splice(i, 1);
      }
    }
    this.setState({ [tag.field]: stateTags }, this.onApplyFilter);
  };

  handleRemoveSearchStr = () => {
    this.setState({ searchStr: "" }, this.onApplyFilter);
  };

  onApplyFilter = () => {
    this.props.clearSearch();
    this.props.listJudges(0, this.state);
  };

  mkContent = (name) => {
    const list = getFieldData(this.props.fieldData, name);
    return (
      <div>
        <Checkbox.Group
          className="chk-gallery-filter"
          options={this.mkOptions(list)}
          value={this.state[name]}
          onChange={(values) => this.onChangeFilter(name, values)}
        />
      </div>
    );
  };

  renderFilters = () => {
    const { searchStr } = this.state;
    const { fieldData, user } = this.props;
    const filter_sort = getFieldData(fieldData, "sort");

    return (
      <div className="filter-list">
        <div className="flex">
          <Input.Search
            placeholder="Search"
            onSearch={this.onSearch}
            onChange={this.onChangeSearch}
            value={searchStr}
            style={{ width: 170 }}
            className="ml-auto"
          />
        </div>
        <div className="show-result">
          <span>Showing {user.judgeTotal} results</span>
          <span className="ml-auto">
            <span>sort by: </span>
            <Select
              style={{ width: 150 }}
              onChange={(value) => this.onChangeFilter("filter_sort", value)}
            >
              {filter_sort.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.value}
                </Option>
              ))}
            </Select>
          </span>
        </div>
      </div>
    );
  };

  render() {
    const { user, fieldData } = this.props;
    const users = user.judges;
    const { loading } = this.state;
    const cols = getOneFieldData(fieldData, "ptp_column");
    const nCol = parseInt(cols);
    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="dashboard">
            <h5>Judges</h5>
            <hr />

            <Row>
              <Col>{this.renderFilters()}</Col>
            </Row>
            <Skeleton active loading={loading} />
            <Skeleton active loading={loading} />
            <Skeleton active loading={loading} />
            <InfiniteScroll
              className="row"
              loadMore={this.loadMore}
              hasMore={users.length < user.judgeTotal - 1}
              loader={<Spinner key={users.length} />}
            >
              {users.map((item, index) => {
                return (
                  <Col
                    key={index}
                    lg={12 / nCol}
                    md={nCol === 1 ? 12 : 6}
                    sm={12}
                  >
                    <Link
                      className="card-link"
                      style={{ color: "black" }}
                      to={`/judge/${item._id}`}
                    >
                      <CustomCard
                        logo={item.profile.photo || UserAvatar}
                        title={`${item.profile.first_name} ${item.profile.last_name}`}
                        description={`${item.profile.org_name || ""} ${
                          item.profile.org_name && item.profile.country
                            ? ","
                            : ""
                        } ${item.profile.country || ""}`}
                        status={item.profile.role}
                        linkedin={item.profile.linkedin}
                        facebook={item.profile.facebook}
                        twitter={item.profile.twitter}
                        web={item.profile.web}
                        columns={nCol}
                        referred={item.profile.referred}
                      />
                    </Link>
                  </Col>
                );
              })}
            </InfiniteScroll>
          </div>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    fieldData: state.profile.fieldData,
    user: state.user,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  listJudges,
  clearSearch,
})(UserList);
