import React from "react";
import { connect } from "react-redux";
import { Tabs } from "antd";
import ProfileConst from "./profile";
import GalleryConst from "./gallery";
import ChallengeConst from "./challenge";
import ProjectConst from "./project";
import OrgConst from "./organization";

const { TabPane } = Tabs;

class Constants extends React.Component {
  render() {
    const { label } = this.props;
    return (
      <Tabs defaultActiveKey="1" type="card" className="container">
        <TabPane tab={label.titleParticipant} key="2">
          <ProfileConst />
        </TabPane>
        <TabPane tab={label.titleOrganization} key="3">
          <OrgConst />
        </TabPane>
        <TabPane tab={label.titleChallenge} key="4">
          <ChallengeConst />
        </TabPane>
        <TabPane tab={label.titleProject} key="5">
          <ProjectConst />
        </TabPane>
        <TabPane tab={label.titleGallery} key="6">
          <GalleryConst />
        </TabPane>
      </Tabs>
    );
  }
}

function mapStateToProps(state) {
  return { label: state.label };
}

export default connect(mapStateToProps, {})(Constants);
