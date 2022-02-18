import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Skeleton, Input, Button, Checkbox, Popover, Tag, Select } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import { FilterOutlined, CaretDownOutlined } from "@ant-design/icons";
import { listAllChallenge, clearSearch } from "../../actions/challenge";
import { Header, Footer, CustomCard } from "../../components/template";
import ProjectAvatar from "../../assets/icon/challenge.png";
import Spinner from "../../components/pages/spinner";
import { createNotification } from "../../actions";
import {
  getFieldData,
  getTargetFieldName,
  getTargetLabelFromSection,
  getOneFieldData,
  getFieldDataById,
} from "../../utils/helper";

const { Option } = Select;

class ChallengeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchStr: props.challenge.searchTxt,
    };
  }

  componentDidMount = async () => {
    const { challenge, listAllChallenge } = this.props;
    const challenges = challenge.allChallenges;
    if (!challenges || challenges.length === 0) {
      this.setState({ loading: true });
      await listAllChallenge(0, this.state);
      this.setState({ loading: false });
    }
  };

  onChangeSearch = (e) => {
    this.setState({ searchStr: e.target.value });
  };

  onSearch = (value) => {
    if (value && value.length < 3) {
      createNotification(
        `Search ${this.props.label.titleChallenge}`,
        "Search text should be at least 3 in length"
      );
      this.setState({ searchStr: value });
      return;
    }
    this.setState({ searchStr: value }, () => this.onApplyFilter());
  };

  loadMore = () => {
    const { challenge, listAllChallenge } = this.props;
    if (challenge.allChallenges.length < 16) return;
    listAllChallenge(challenge.allChallenges.length, this.state);
  };

  refreshChallenge = () => {
    const namelist = getTargetFieldName("challenge", this.props.fieldData);
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
    this.props.listAllChallenge(0, this.state);
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

  renderSelectedFilters = () => {
    const { fieldData } = this.props;
    const { searchStr } = this.state;
    let tags = [];
    const namelist = getTargetFieldName("challenge", this.props.fieldData);
    for (let name of namelist) {
      const tagItems = this.state[name];
      if (tagItems && tagItems.length > 0) {
        for (let t of tagItems) {
          tags.push(getFieldDataById(fieldData, t));
        }
      }
    }
    if (tags.length === 0 && (!searchStr || searchStr.length < 3)) return null;
    return (
      <div className="filter-result">
        {tags.map((tag) => (
          <Tag
            key={tag._id}
            color={"purple"}
            closable
            onClose={() => this.handleRemoveFilter(tag)}
          >
            {tag.value}
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
        <Button type="link" onClick={this.refreshChallenge}>
          clear all
        </Button>
      </div>
    );
  };

  renderFilters = () => {
    const { searchStr } = this.state;
    const { fieldData, challenge } = this.props;
    const filter_sort = getFieldData(fieldData, "sort");
    const namelist = getTargetFieldName("challenge", fieldData);

    return (
      <div className="filter-list">
        <div className="flex">
          <Button type="link" className="filter-icon">
            <FilterOutlined />
          </Button>
          {namelist.map((name) => (
            <Popover
              placement="bottomLeft"
              title={getTargetLabelFromSection("challenge", name)}
              content={this.mkContent(name)}
              trigger="click"
              key={name}
            >
              <Button type="link">
                {getTargetLabelFromSection("challenge", name)}
                <CaretDownOutlined />
              </Button>
            </Popover>
          ))}
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
          <span>Showing {challenge.total} results</span>
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
    const { challenge, label, fieldData } = this.props;
    const challenges = challenge.allChallenges;
    const { loading } = this.state;
    const cols = getOneFieldData(fieldData, "chl_column");
    const nCol = parseInt(cols);
    const chlIntro = getOneFieldData(fieldData, "chl_intro")

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="dashboard">
            <h5>{label.titleChallenge}s</h5>
            <hr />
            {chlIntro && (
              <div
                className="sun-editor-editable mb-4"
                dangerouslySetInnerHTML={{ __html: chlIntro }}
              />
            )}
            <Row>
              <Col>{this.renderFilters()}</Col>
            </Row>
            <Skeleton active loading={loading} />
            <Skeleton active loading={loading} />
            <Skeleton active loading={loading} />
            <InfiniteScroll
              className="row mt-4"
              loadMore={this.loadMore}
              hasMore={challenges.length < challenge.total - 1}
              loader={<Spinner key={challenges.length} />}
            >
              {challenges.map((item, index) => {
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
                      to={`/challenge/${item._id}`}
                    >
                      <CustomCard
                        logo={item.logo || ProjectAvatar}
                        title={item.challenge_name}
                        description={item.short_description || ""}
                        status={`${item.projects || 0} projects`}
                        likes={item.likes ? item.likes.length : 0}
                        columns={nCol}
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
    challenge: state.challenge,
    fieldData: state.profile.fieldData,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  listAllChallenge,
  clearSearch,
})(ChallengeList);
