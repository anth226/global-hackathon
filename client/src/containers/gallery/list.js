import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { Skeleton, Input, Popover, Button, Checkbox, Tag, Select } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import { listGallery, clearSearch } from "../../actions/gallery";
import { createNotification } from "../../actions";
import { Header, Footer } from "../../components/template";
import GalleryAvatar from "../../assets/icon/challenge.png";
import Spinner from "../../components/pages/spinner";
import { FilterOutlined, CaretDownOutlined } from "@ant-design/icons";
import {
  getFieldData,
  getTargetFieldName,
  getTargetLabelFromSection,
  getFieldDataById,
  getOneFieldData,
} from "../../utils/helper";
import { listFieldData } from "../../actions/profile";
import { protectedTest } from "../../actions/auth";

const { Option } = Select;

class GalleryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchStr: props.gallery.searchTxt,
      judge_challenge:
        props.user.role === "judge" ? props.user.profile.integra_id : "",
    };
  }

  componentDidMount = async () => {
    const { gallery, listGallery, protectedTest, listFieldData } = this.props;
    this.setState({ loading: true });
    if (this.props.fieldData.length === 0) {
      await listFieldData();
    }
    if (!this.props.user.role) {
      await protectedTest();
      this.setState({
        judge_challenge:
          this.props.user.role === "judge"
            ? this.props.user.profile.integra_id
            : "",
      });
    }
    const showGallery = !!getOneFieldData(this.props.fieldData, "show_gallery");
    if (!showGallery && this.props.user.role !== "judge") {
      this.setState({ loading: false });
      return;
    }
    if (!gallery.gallerys || gallery.gallerys.length === 0) {
      await listGallery(0, this.state);
    }
    this.setState({ loading: false });
  };

  onChangeSearch = (e) => {
    this.setState({ searchStr: e.target.value });
  };

  onSearch = (value) => {
    if (value && value.length < 3) {
      createNotification(
        `Search ${this.props.label.titleGallery}`,
        "Search text should be at least 3 in length"
      );
      this.setState({ searchStr: value });
      return;
    }
    this.setState({ searchStr: value }, () => this.onApplyFilter());
  };

  loadMore = () => {
    const { gallery, listGallery } = this.props;
    if (gallery.gallerys.length < 16) return;
    listGallery(gallery.gallerys.length, this.state);
  };

  refreshGallery = () => {
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
    const { user, fieldData } = this.props;
    const showGallery = !!getOneFieldData(fieldData, "show_gallery");
    if (!showGallery && user.role !== "judge") return;
    this.props.clearSearch();
    this.props.listGallery(0, this.state);
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
        <Button type="link" onClick={this.refreshGallery}>
          clear all
        </Button>
      </div>
    );
  };

  renderFilters = () => {
    const { searchStr } = this.state;
    const { fieldData, gallery, isJudge } = this.props;
    const filter_sort = getFieldData(fieldData, "sort");
    const namelist = getTargetFieldName("challenge", fieldData);

    return (
      <div className="filter-list">
        <div className="flex">
          <Button type="link" className="filter-icon">
            <FilterOutlined />
          </Button>
          {!isJudge &&
            namelist.map((name) => (
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
          <span>Showing {gallery.total} results</span>
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
    const { gallery } = this.props;
    const gallerys = gallery.gallerys;
    const { loading } = this.state;

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="dashboard">
            <h5>{this.props.label.titleGallery}</h5>
            <Row>
              <Col>{this.renderFilters()}</Col>
            </Row>
            <Skeleton active loading={loading} />
            <Skeleton active loading={loading} />
            <Skeleton active loading={loading} />
            <InfiniteScroll
              loadMore={this.loadMore}
              hasMore={gallerys.length < gallery.total - 1}
              loader={<Spinner key={gallerys.length} />}
            >
              {gallerys.map((item, index) => {
                return (
                  <Row key={index}>
                    <Col className="big-custom-card">
                      <Row>
                        <Col md={4} xs={12}>
                          <img src={item.logo || GalleryAvatar} alt="" />
                        </Col>
                        <Col md={8} xs={12}>
                          <h5 className="mt-3">
                            <b>{item.name}</b>
                          </h5>
                          <div>{item.short_description}</div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Link
                            className="gallery-card-link"
                            to={`/gallery/${item._id}`}
                          >
                            Click here for details
                          </Link>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
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
    gallery: state.gallery,
    user: state.user.profile,
    fieldData: state.profile.fieldData,
    isJudge: state.user.isJudge,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  listGallery,
  clearSearch,
  listFieldData,
  protectedTest,
})(GalleryList);
