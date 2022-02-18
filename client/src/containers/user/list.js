import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Skeleton, Input, Button, Checkbox, Popover, Tag, Select } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import { FilterOutlined, CaretDownOutlined } from "@ant-design/icons";
import { listAllParticipants, clearSearch } from "../../actions/auth";
import { Header, Footer, CustomCard } from "../../components/template";
import Spinner from "../../components/pages/spinner";
import UserAvatar from "../../assets/img/user-avatar.png";
import { getFieldData, getOneFieldData } from "../../utils/helper";
import { createNotification } from "../../actions";

const { Option } = Select;

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchStr: props.user.searchTxt,
      user_role: [],
    };
  }

  componentDidMount = async () => {
    const { clearSearch, listAllParticipants } = this.props;
    clearSearch();
    this.setState({ loading: true });
    await listAllParticipants(0, this.state);
    this.setState({ loading: false });
  };

  onChangeSearch = (e) => {
    this.setState({ searchStr: e.target.value });
  };

  loadMore = () => {
    const { user, listAllParticipants } = this.props;
    if (user.participants.length < 16) return;
    listAllParticipants(user.participants.length, this.state);
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
    let state = this.state;
    state["user_role"] = [];
    state.searchStr = "";
    state.filter_sort = "";
    this.setState(state, () => this.onApplyFilter());
  };

  mkOptions = (list) => {
    let newList = list.map((item) => {
      return { label: item.value, value: item.value };
    });
    return newList;
  };

  onChangeFilter = (name, values) => {
    this.setState({ [name]: values }, this.onApplyFilter);
  };

  handleRemoveFilter = (tag) => {
    let stateTags = this.state["user_role"];
    for (let i = stateTags.length - 1; i >= 0; i--) {
      if (stateTags[i] === tag) {
        stateTags.splice(i, 1);
      }
    }
    this.setState({ user_role: stateTags }, this.onApplyFilter);
  };

  handleRemoveSearchStr = () => {
    this.setState({ searchStr: "" }, this.onApplyFilter);
  };

  onApplyFilter = () => {
    this.props.clearSearch();
    this.props.listAllParticipants(0, this.state);
  };

  mkContent = () => {
    const list = getFieldData(this.props.fieldData, "user_role");
    return (
      <div>
        <Checkbox.Group
          className="chk-gallery-filter"
          options={this.mkOptions(list)}
          value={this.state["user_role"]}
          onChange={(values) => this.onChangeFilter("user_role", values)}
        />
      </div>
    );
  };

  renderSelectedFilters = () => {
    const { searchStr } = this.state;
    const tagItems = this.state["user_role"];
    if (tagItems.length === 0 && (!searchStr || searchStr.length < 3))
      return null;
    return (
      <div className="filter-result">
        {tagItems.map((tag) => (
          <Tag
            key={tag}
            color={"purple"}
            closable
            onClose={() => this.handleRemoveFilter(tag)}
          >
            {tag}
          </Tag>
        ))}
        {searchStr && searchStr.length > 2 && (
          <Tag
            key={"search-result"}
            color={"blue"}
            closable
            onClose={() => this.handleRemoveSearchStr()}
          >
            {searchStr}
          </Tag>
        )}
        <Button type="link" onClick={this.refreshParticipants}>
          clear all
        </Button>
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
          <Button type="link" className="filter-icon">
            <FilterOutlined />
          </Button>
          <Popover
            placement="bottomLeft"
            title={"Positions"}
            content={this.mkContent()}
            trigger="click"
          >
            <Button type="link">
              Positions
              <CaretDownOutlined />
            </Button>
          </Popover>
          <Input.Search
            placeholder="Search"
            onSearch={this.onSearch}
            onChange={this.onChangeSearch}
            value={searchStr}
            style={{ width: 170 }}
            className="ml-auto"
          />
        </div>
        {this.renderSelectedFilters()}
        <div className="show-result">
          <span>Showing {user.total} results</span>
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
    const { user, label, fieldData } = this.props;
    const users = user.participants;
    const { loading } = this.state;
    const cols = getOneFieldData(fieldData, "ptp_column");
    const nCol = parseInt(cols);

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="dashboard">
            <h5>{label.titleParticipant}s</h5>
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
              hasMore={users.length < user.total - 1}
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
                      to={`/participant/${item._id}`}
                    >
                      <CustomCard
                        logo={item.profile.photo || UserAvatar}
                        title={`${item.profile.first_name} ${item.profile.last_name}`}
                        description={`${item.profile.position || ""} ${
                          item.profile.position && item.profile.country
                            ? ","
                            : ""
                        } ${item.profile.country || ""}`}
                        status={`${
                          item.projects > 0 ? item.projects + " projects" : ""
                        }`}
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
  listAllParticipants,
  clearSearch,
})(UserList);
