import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import {
  Skeleton,
  Input,
  Button,
  Checkbox,
  Popover,
  Tag,
  Select,
  Modal,
} from "antd";
import InfiniteScroll from "react-infinite-scroller";
import {
  FilterOutlined,
  CaretDownOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  listProjects,
  clearSearch,
  createProject,
} from "../../actions/project";
import { Header, Footer, CustomCard } from "../../components/template";
import ProjectAvatar from "../../assets/icon/challenge.png";
import Spinner from "../../components/pages/spinner";
import { createNotification } from "../../actions";
import {
  getFieldData,
  getTargetFieldName,
  getTargetLabelFromSection,
  getFieldDataById,
  getOneFieldData,
} from "../../utils/helper";
import { getCountryFlag } from "../../constants";
import CreateForm from "../../components/project/create_project";

const { Option } = Select;

class ProjectList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchStr: props.project.searchTxt,
      showModal: false,
    };
  }

  componentDidMount = async () => {
    const { project, listProjects } = this.props;
    if (!project.projects || project.projects.length === 0) {
      this.setState({ loading: true });
      await listProjects(0, this.state);
      this.setState({ loading: false });
    }
  };

  toggleShowModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  onChangeSearch = (e) => {
    this.setState({ searchStr: e.target.value });
  };

  onSearch = (value) => {
    if (value && value.length < 3) {
      createNotification(
        `Search ${this.props.label.titleProject}`,
        "Search text should be at least 3 in length"
      );
      this.setState({ searchStr: value });
      return;
    }
    this.setState({ searchStr: value }, () => this.onApplyFilter());
  };

  loadMore = () => {
    const { project, listProjects } = this.props;
    if (project.projects.length < 16) return;
    listProjects(project.projects.length, this.state);
  };

  refreshProjects = () => {
    const namelist = getTargetFieldName("project", this.props.fieldData);
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
    this.props.listProjects(0, this.state);
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
    const namelist = getTargetFieldName("project", this.props.fieldData);
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
        <Button type="link" onClick={this.refreshProjects}>
          clear all
        </Button>
      </div>
    );
  };

  renderFilters = () => {
    const { searchStr } = this.state;
    const { fieldData, project } = this.props;
    const filter_sort = getFieldData(fieldData, "sort");
    const namelist = getTargetFieldName("project", fieldData);

    return (
      <div className="filter-list">
        <div className="flex">
          <Button type="link" className="filter-icon">
            <FilterOutlined />
          </Button>
          {namelist.map((name) => (
            <Popover
              placement="bottomLeft"
              title={getTargetLabelFromSection("project", name)}
              content={this.mkContent(name)}
              trigger="click"
              key={name}
            >
              <Button type="link">
                {getTargetLabelFromSection("project", name)}
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
          <span>Showing {project.total} results</span>
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

  createNewProject = async (values) => {
    await this.props.createProject(values);
    this.toggleShowModal();
    this.onApplyFilter();
  };

  render() {
    const { project, label, fieldData, user } = this.props;
    const projects = project.projects;
    const { loading, showModal } = this.state;
    const cols = getOneFieldData(fieldData, "proj_column");
    const nCol = parseInt(cols);

    return (
      <React.Fragment>
        <Header />
        <Container className="content">
          <div className="dashboard">
            <h5 className="flex">
              <span>{label.titleProject}s</span>
              <Button
                type="primary"
                className="ml-auto"
                onClick={this.toggleShowModal}
              >
                <PlusOutlined />
                Create Project
              </Button>
            </h5>
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
              hasMore={projects.length < project.total - 1}
              loader={<Spinner key={projects.length} />}
            >
              {projects.map((item, index) => {
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
                      to={`/project/${item._id}`}
                    >
                      <CustomCard
                        logo={item.logo || ProjectAvatar}
                        title={item.name}
                        description={item.short_description || ""}
                        likes={item.likes ? item.likes.length : 0}
                        columns={nCol}
                        flag={getCountryFlag(item.country)}
                        location={item.country || ""}
                      />
                    </Link>
                  </Col>
                );
              })}
            </InfiniteScroll>
          </div>
        </Container>
        <Footer />
        {showModal && (
          <Modal
            title="Create Project"
            visible={showModal}
            width={800}
            footer={false}
            onCancel={this.toggleShowModal}
          >
            <CreateForm
              onSubmit={this.createNewProject}
              hideProjectCreate={this.toggleShowModal}
              curProject={{
                participant: user._id,
              }}
              label={label}
              fieldData={fieldData}
            />
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.profile,
    project: state.project,
    fieldData: state.profile.fieldData,
    isJudge: state.user.isJudge,
    label: state.label,
  };
}

export default connect(mapStateToProps, {
  listProjects,
  clearSearch,
  createProject,
})(ProjectList);
