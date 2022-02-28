import React from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { BackTop } from "antd";

// Import miscellaneous routes and other requirements
import NotFoundPage from "./components/pages/not-found-page";

// Import static pages
import HomePage from "./containers/home";

// Import challenge pages
import ChallengesList from "./containers/challenge/list";
import Challenge from "./containers/challenge/challenge";

// Import project pages
import Projectslist from "./containers/project/list";
import Project from "./containers/project/project";

// Import authentication related pages
// import Register from "./containers/auth/register";
import RegisterJudge from "./containers/auth/register_judge";
import Logout from "./containers/auth/logout";
import ForgotPassword from "./containers/auth/forgot_password";
import ResetPassword from "./containers/auth/reset_password";
import Resend from "./containers/auth/resend";
import ConfirmEmail from "./containers/auth/confirm-email";
import LocationSubmit from "./containers/location/location-submit";

import Identity from "./containers/identity";
import IdentityRegister from "./containers/identity/id_register";
import Register from "./containers/identity/register";
import Login from "./containers/identity/login";

import Blockchain from "./containers/blockchain";

// Import user related Pages
import UserDashboard from "./containers/user/dashboard";
import Profile from "./containers/user/profilepage";
import ParticipantsList from "./containers/user/list";

// Import judge related pages
import JudgeDashboard from "./containers/judge/dashboard";
import JudgeList from "./containers/judge/list";
import JudgePage from "./containers/judge";
import JudgeProfile from "./containers/judge/profile";

// Import gallery related pages
import Gallery from "./containers/gallery/gallery";
import ListGallery from "./containers/gallery/list";

// Import admin related Pages
import AdminDashboard from "./containers/admin";

// Import chat related pages
import MessageBox from "./containers/message";

// Import notification pages
import Notification from "./containers/notification";

// Import Help related pages
import Help from "./containers/help";
import HelpArticle from "./containers/help/article";
import HelpCategory from "./containers/help/category";
import HelpSearch from "./containers/help/search";
// import Resource from "./containers/resource";
import Faq from "./containers/faq";
import Policy from "./containers/privacy/policy";
import Privacy from "./containers/privacy";
import Rules from "./containers/privacy/rules";
import Contact from "./containers/privacy/contact";
import Unsubscribe from "./containers/glhcontact/unsubscribe";

// Import higher order components
import RequireAuth from "./containers/auth/require_auth";
import { protectedTest } from "./actions/auth";
import { listFieldData } from "./actions/profile";
import createMeeting from "./containers/meeting/create-meeting";
import attendMeeting from "./containers/meeting/attend-meeting";
import RoomsDisplay from "./containers/rooms/rooms-index";
import RoomPage from "./containers/rooms/RoomPage";
import JoinRoom from "./containers/rooms/join-room";

class Routes extends React.Component {
  componentDidMount = async () => {
    await this.props.protectedTest();
    this.props.listFieldData();
  };

  render() {
    return (
      <div className="layout">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/identity" component={Identity} />
          <Route exact path="/identity-register" component={IdentityRegister} />

          <Route path="/register" component={Register} />
          <Route path="/register-judge" component={RegisterJudge} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/forgot-password/:mode" component={ForgotPassword} />
          <Route
            path="/reset-password/:mode/:resetToken"
            component={ResetPassword}
          />
          <Route path="/resend" component={Resend} />
          <Route path="/location-submit" component={LocationSubmit} />
          <Route path="/email-verify/:mode/:token" component={ConfirmEmail} />
          <Route path="/profile" component={RequireAuth(Profile)} />
          <Route path="/dashboard" component={RequireAuth(UserDashboard)} />
          <Route path="/judge-dashboard" component={JudgeDashboard} />

          <Route path="/blockchain" component={RequireAuth(Blockchain)} />

          <Route path="/judges" component={JudgeList} />
          <Route path="/judge/:id" component={JudgePage} />
          <Route path="/judge-profile" component={RequireAuth(JudgeProfile)} />

          <Route path="/challenges" component={ChallengesList} />
          <Route path="/challenge/:id" component={Challenge} />
          <Route path="/participants" component={ParticipantsList} />
          <Route exact path="/project/:id" component={RequireAuth(Project)} />
          <Route path="/projects" component={Projectslist} />
          <Route
            path="/project/:id/rooms"
            component={RequireAuth(RoomsDisplay)}
          />
          <Route path="/rooms/join/:id" component={RequireAuth(JoinRoom)} />
          <Route path="/rooms/:id" component={RequireAuth(RoomPage)} />
          <Route
            path="/create-meeting/:id"
            component={RequireAuth(createMeeting)}
          />
          <Route
            path="/meeting/:token"
            component={RequireAuth(attendMeeting)}
          />
          <Route path="/rooms" component={RequireAuth(RoomsDisplay)} />
          <Route path="/gallery/:id" component={Gallery} />
          <Route path="/gallery" component={ListGallery} />
          <Route path="/admin" component={RequireAuth(AdminDashboard)} />
          <Route path="/message" component={RequireAuth(MessageBox)} />
          <Route path="/notification" component={RequireAuth(Notification)} />
          <Route path="/help" component={Help} />
          <Route
            path="/help-article/:category/:articleId"
            component={HelpArticle}
          />
          <Route path="/help-category/:category" component={HelpCategory} />
          <Route path="/help-search/:search" component={HelpSearch} />
          {/* <Route path="/resource" component={Resource} /> */}
          <Route path="/faq" component={Faq} />
          <Route path="/privacy-policy" component={Privacy} />
          <Route path="/rules" component={Rules} />
          <Route path="/policy" component={Policy} />
          <Route path="/contact" component={Contact} />
          <Route path="/faq" component={Faq} />
          <Route path="/unsubscribe/:email" component={Unsubscribe} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
        <BackTop />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.user.profile };
}

export default connect(mapStateToProps, {
  protectedTest,
  listFieldData,
})(Routes);
