const AuthenticationController = require("./controllers/authentication");
const UserController = require("./controllers/user");
const ChatController = require("./controllers/chat");
const ChallengeController = require("./controllers/challenge");
const OrganizationController = require("./controllers/organization");
const FieldDataController = require("./controllers/fielddata");
const ProjectController = require("./controllers/project");
const ProjectMemberController = require("./controllers/projectmember");
const SearchController = require("./controllers/search");
const SSRController = require("./controllers/ssr");
const CommentController = require("./controllers/comment");
const AdminController = require("./controllers/admin");
const NotificationController = require("./controllers/notification");
const GalleryController = require("./controllers/gallery");
const ReportController = require("./controllers/report");
const AnnounceController = require("./controllers/announce");
const HelpDocController = require("./controllers/helpdoc");
const LabelController = require("./controllers/label");
const ResourceController = require("./controllers/resource");
const ProjectVoteController = require("./controllers/project_vote");
const FaqController = require("./controllers/faq");
const JudgeController = require("./controllers/judge");
const OrgMemberInvController = require("./controllers/orginvite");
const LocationController = require("./controllers/location");
const GLHContactController = require("./controllers/glhcontact");
const RuleController = require("./controllers/rule");
const MeetingController = require("./controllers/meeting");
const RoomsController = require("./controllers/rooms");

const express = require("express");
const passport = require("passport");
const ROLE_ADMIN = require("./constants").ROLE_ADMIN;
const multer = require("multer");

const passportService = require("./config/passport");
// Middleware to require login/auth
const requireAuth = passport.authenticate("jwt", { session: false });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router(),
    chatRoutes = express.Router(),
    challengeRoutes = express.Router(),
    organizationRoutes = express.Router(),
    projectRoutes = express.Router(),
    projectMemberRoutes = express.Router(),
    searchRoutes = express.Router(),
    ssrRoutes = express.Router(),
    commentRoutes = express.Router(),
    adminRoutes = express.Router(),
    notificationRoutes = express.Router(),
    galleryRoutes = express.Router(),
    reportRoutes = express.Router(),
    announceRoutes = express.Router(),
    helpdocRoutes = express.Router(),
    labelRoutes = express.Router(),
    resourceRoutes = express.Router(),
    projectVoteRoutes = express.Router(),
    faqRoutes = express.Router(),
    judgeRoutes = express.Router(),
    orgMemberInvRoutes = express.Router(),
    locationRoutes = express.Router(),
    glhcontactRoutes = express.Router(),
    ruleRoutes = express.Router(),
    fieldDataRoutes = express.Router(),
    meetingRoutes = express.Router(),
    roomsRoutes = express.Router();

  // ProjectMemberController.cleanProjectMember()
  // AdminController.convertS3URL()

  //= ========================
  // Auth Routes
  //= ========================
  apiRoutes.use("/auth", authRoutes);
  // Participant Registration route
  authRoutes.post(
    "/user-register",
    AuthenticationController.participantRegister
  );
  // Login route
  authRoutes.post("/login", AuthenticationController.login);
  // Analyze route
  authRoutes.post("/analyze", AuthenticationController.analyze);
  // Check integra id route
  authRoutes.post("/checkid", AuthenticationController.checkIntegraId);
  // Send identity email route
  authRoutes.post(
    "/identity/email",
    upload.single("file"),
    AuthenticationController.sendEmailIdentity
  );
  // Send user invite route
  authRoutes.post("/invite/user", AuthenticationController.sendInvitationUser);

  // Password reset request route (generate/send token)
  authRoutes.post("/forgot-password", AuthenticationController.forgotPassword);
  // Password reset route (change password using token)
  authRoutes.post(
    "/reset-password/:token",
    AuthenticationController.verifyToken
  );
  // Password reset route (change password using security question)
  authRoutes.post(
    "/reset-password-security",
    AuthenticationController.resetPasswordSecurity
  );
  // Verify route
  authRoutes.post("/verify", AuthenticationController.confirmEmail);
  // Resend verification route
  authRoutes.post("/resend", AuthenticationController.resendVerification);
  authRoutes.post("/respwdlink", AuthenticationController.getResetPasswordLink);

  //= ========================
  // User Routes
  //= ========================
  apiRoutes.use("/user", userRoutes);
  // View user profile route
  userRoutes.get("/:userId", UserController.viewProfile);
  // delete user route
  userRoutes.delete("/:userId", requireAuth, UserController.deleteProfile);
  // Update user profile route
  userRoutes.post("/", requireAuth, UserController.updateProfile);
  // Update user location route
  userRoutes.post("/location", UserController.updateUserLocation);
  // Update user address route
  userRoutes.post("/address", UserController.updateUserAddress);
  //Get All user profile route
  userRoutes.post("/list/:count", requireAuth, UserController.listAllUsers);
  // Test protected route
  apiRoutes.get("/protected", requireAuth, UserController.getUserSession);
  // Admin route
  apiRoutes.get(
    "/admins-only",
    requireAuth,
    AuthenticationController.roleAuthorization(ROLE_ADMIN),
    (req, res) => {
      res.send({ content: "Admin dashboard is working." });
    }
  );
  // Get Users associated with organizations route
  userRoutes.get("/users/:org_id", requireAuth, UserController.orgUsers);
  // Restrict user profile route
  userRoutes.post("/restrict/:id", requireAuth, UserController.restrictUser);
  // Block user profile route
  userRoutes.post("/block/:id", requireAuth, UserController.blockUser);
  // All user route
  userRoutes.get(
    "/simple-user/list",
    requireAuth,
    UserController.listSimpleParticipants
  );
  // All Unverified participant route
  userRoutes.get(
    "/unverified/list",
    requireAuth,
    UserController.adminListUnverifiedParticipants
  );
  // Verify user profile route
  userRoutes.post(
    "/unverified/:id",
    requireAuth,
    UserController.adminVerifyParticipant
  );
  // Verify user invite route
  userRoutes.post("/invite/verify", UserController.inviteVerifyUser);
  // Get Users associated with location
  userRoutes.get(
    "/location/:location_id",
    requireAuth,
    UserController.listLocationParticipants
  );

  //= ========================
  // Organization Routes
  //= ========================
  apiRoutes.use("/organization", organizationRoutes);
  // Get organization route
  organizationRoutes.get("/:org_id", OrganizationController.getOrganization);
  // Create organization route
  organizationRoutes.post(
    "/",
    requireAuth,
    OrganizationController.createOrganization
  );
  // Update organization route
  organizationRoutes.put(
    "/",
    requireAuth,
    OrganizationController.updateOrganization
  );
  // List organization route
  organizationRoutes.post(
    "/list/:count",
    OrganizationController.listOrganization
  );
  // List simple organization route
  organizationRoutes.get(
    "/list-simple/:count",
    OrganizationController.listSimpleOrgs
  );
  // Delete organization route
  organizationRoutes.delete(
    "/:org_id",
    OrganizationController.deleteOrganization
  );
  // admin org report
  organizationRoutes.get(
    "/admin/report",
    OrganizationController.adminOrgReports
  );
  // admin org user report
  organizationRoutes.get(
    "/admin/user-report",
    OrganizationController.adminOrgWithUsers
  );
  // Contact organization route
  organizationRoutes.post("/contact/:id", OrganizationController.contactOrg);

  //= ========================
  // Challenge Routes
  //= ========================
  apiRoutes.use("/challenge", challengeRoutes);
  // Get challenge route
  challengeRoutes.get("/:challenge_id", ChallengeController.getChallenge);
  // Create Challenge route
  challengeRoutes.post("/", requireAuth, ChallengeController.createChallenge);
  // Update Challenge route
  challengeRoutes.put("/", requireAuth, ChallengeController.updateChallenge);
  // List all challenge route
  challengeRoutes.post(
    "/list/:count",
    requireAuth,
    ChallengeController.listChallenge
  );
  // List Challenges by organization route
  challengeRoutes.get(
    "/org/:org_id",
    requireAuth,
    ChallengeController.listChallengesByOrg
  );
  // List Challenges by participant route
  challengeRoutes.get(
    "/user/:user_id",
    requireAuth,
    ChallengeController.listChallengesByUser
  );
  // Delete challenge route
  challengeRoutes.delete(
    "/:challenge_id",
    requireAuth,
    ChallengeController.deleteChallenge
  );
  // Support Challenge route
  challengeRoutes.post(
    "/support/:id",
    requireAuth,
    ChallengeController.supportChallenge
  );
  // Supported Challenges route
  challengeRoutes.get(
    "/support/:org_id",
    ChallengeController.listSupportChallengeByOrg
  );
  // Vote Challenge route
  challengeRoutes.post(
    "/upvote/:id",
    requireAuth,
    ChallengeController.voteChallenge
  );
  // Admin challenge list route
  challengeRoutes.get(
    "/admin/list",
    requireAuth,
    ChallengeController.adminListChallenge
  );
  // Admin pending challenge list route
  challengeRoutes.get(
    "/admin/pending",
    requireAuth,
    ChallengeController.adminPendingChallenges
  );
  // Admin approve pending challenge route
  challengeRoutes.post(
    "/admin/approve/:challenge_id",
    requireAuth,
    ChallengeController.adminApproveChallenge
  );

  //= ========================
  // Project Routes
  //= ========================
  apiRoutes.use("/project", projectRoutes);
  // Get project route
  projectRoutes.get("/:projectId", ProjectController.getProject);
  // Create project route
  projectRoutes.post("/", ProjectController.createProject);
  // Update project route
  projectRoutes.put("/", ProjectController.updateProject);
  // List project route
  projectRoutes.post(
    "/list/:count",
    requireAuth,
    ProjectController.listProject
  );
  // List review project route
  projectRoutes.post(
    "/review-list/:count",
    ProjectController.listReviewProject
  );
  // Delete project route
  projectRoutes.delete("/:projectId", ProjectController.deleteProject);
  // List challenge project route
  projectRoutes.get(
    "/challenge/:challengeId",
    ProjectController.challengeProjects
  );
  // List project by participant route
  projectRoutes.get(
    "/participant/:participantId",
    ProjectController.listProjectByCreator
  );
  // List project by organization route
  projectRoutes.get(
    "/organization/:orgId",
    ProjectController.listProjectByOrgCreator
  );
  // Contact project creator route
  projectRoutes.post("/contact/:id", ProjectController.contactCreator);
  // Update project sharer route
  projectRoutes.post("/share/:id", ProjectController.updateProjectSharers);
  // Vote project route
  projectRoutes.post("/upvote/:id", requireAuth, ProjectController.voteProject);
  // Admin project list route
  projectRoutes.get("/admin/list", ProjectController.listAllProject);

  //= ========================
  // Project Vote Routes
  //= ========================
  apiRoutes.use("/project-vote", projectVoteRoutes);
  // Create project vote route
  projectVoteRoutes.post("/", ProjectVoteController.createProjectVote);
  // Update project vote route
  projectVoteRoutes.put("/", ProjectVoteController.updateProjectVote);

  //= ========================
  // Project comment Routes
  //= ========================
  apiRoutes.use("/comment", commentRoutes);
  // Create comment route
  commentRoutes.post("/", requireAuth, CommentController.createComment);
  // Create challenge comment route
  commentRoutes.post(
    "/challenge",
    requireAuth,
    CommentController.createChallengeComment
  );
  // Update comment route
  commentRoutes.put("/", requireAuth, CommentController.updateComment);
  // List comment route
  commentRoutes.get("/:projectId", requireAuth, CommentController.listComment);
  // List challenge comment route
  commentRoutes.get(
    "/challenge/:challengeId",
    requireAuth,
    CommentController.listChallengeComment
  );
  // Delete comment route
  commentRoutes.delete(
    "/:commentId",
    requireAuth,
    CommentController.deleteComment
  );
  // Like comment route
  commentRoutes.post(
    "/like/:commentId",
    requireAuth,
    CommentController.likeComment
  );

  //= ========================
  // ProjectMember Routes
  //= ========================
  apiRoutes.use("/projectmember", projectMemberRoutes);
  // Get projects by user route
  projectMemberRoutes.get(
    "/project/:userId",
    ProjectMemberController.listProject
  );
  // Get participants by project route
  projectMemberRoutes.get(
    "/participant/:projectId",
    requireAuth,
    ProjectMemberController.listParticipant
  );
  // Get public participants by project route
  projectMemberRoutes.get(
    "/pub-participant/:projectId",
    ProjectMemberController.listPublicParticipant
  );
  // Join project route
  projectMemberRoutes.post(
    "/:projectId",
    requireAuth,
    ProjectMemberController.joinProject
  );
  // Leave project route
  projectMemberRoutes.delete(
    "/:projectId",
    requireAuth,
    ProjectMemberController.leaveProject
  );
  // Invite participant to project route
  projectMemberRoutes.post(
    "/invite/:projectId",
    requireAuth,
    ProjectMemberController.inviteParticipant
  );
  // Accept Invitation project team route
  projectMemberRoutes.post(
    "/invite-accept/:pmId",
    requireAuth,
    ProjectMemberController.acceptInviteTeam
  );
  // Cancel invite participant to project route
  projectMemberRoutes.post(
    "/invite-cancel/:projectId",
    requireAuth,
    ProjectMemberController.cancelInviteParticipant
  );

  //= ========================
  // Search Routes
  //= ========================
  apiRoutes.use("/search", searchRoutes);
  // Get total search route
  searchRoutes.get("/total/:searchTxt", SearchController.totalSearch);
  // Get organization search route
  searchRoutes.get(
    "/organization/:searchTxt",
    requireAuth,
    SearchController.orgSearch
  );
  // Get challenge search route
  searchRoutes.get(
    "/challenge/:searchTxt",
    requireAuth,
    SearchController.challengeSearch
  );
  // Get participant search route
  searchRoutes.get(
    "/participant/:searchTxt",
    requireAuth,
    SearchController.participantSearch
  );
  // Get project search route
  searchRoutes.get(
    "/project/:searchTxt",
    requireAuth,
    SearchController.projectSearch
  );

  //= ========================
  // Field Data code Routes
  //= ========================
  apiRoutes.use("/fields", fieldDataRoutes);
  // Create field data route
  fieldDataRoutes.post("/", requireAuth, FieldDataController.createFieldData);
  // List field data route
  fieldDataRoutes.get("/", FieldDataController.listFieldData);
  // Delete field data route
  fieldDataRoutes.delete(
    "/:id",
    requireAuth,
    FieldDataController.deleteFieldData
  );
  // Adjust Mentor route
  fieldDataRoutes.post(
    "/set-mentor",
    requireAuth,
    FieldDataController.setMentorData
  );
  // Adjust Summary route
  fieldDataRoutes.post(
    "/summary",
    requireAuth,
    FieldDataController.setSummaryData
  );
  // Adjust List column route
  fieldDataRoutes.post(
    "/update",
    requireAuth,
    FieldDataController.updateFieldData
  );

  //= ========================
  // SSR render Routes
  //= ========================
  apiRoutes.use("/public", ssrRoutes);
  // Render challenge route
  ssrRoutes.get("/challenge/:challenge_id", SSRController.RenderChallenge);

  //= ========================
  // Gallery Routes
  //= ========================
  apiRoutes.use("/gallery", galleryRoutes);
  // Get gallery route
  galleryRoutes.get("/:gallery_id", GalleryController.getGallery);
  // Get project gallery route
  galleryRoutes.get(
    "/project/:project_id",
    GalleryController.getProjectGallery
  );
  // Create Gallery route
  galleryRoutes.post("/", requireAuth, GalleryController.createGallery);
  // Update Gallery route
  galleryRoutes.put("/", requireAuth, GalleryController.updateGallery);
  // List all gallery route
  galleryRoutes.post("/list/:count", GalleryController.listGallery);
  // Delete gallery route
  galleryRoutes.delete(
    "/:gallery_id",
    requireAuth,
    GalleryController.deleteGallery
  );
  // Make Private Gallery route
  galleryRoutes.post(
    "/private/:id",
    requireAuth,
    GalleryController.privateGallery
  );
  // Make Public Gallery route
  galleryRoutes.post(
    "/public/:id",
    requireAuth,
    GalleryController.publicGallery
  );
  // Admin project list route
  galleryRoutes.get(
    "/admin/list",
    requireAuth,
    GalleryController.listAllGallery
  );

  //= ========================
  // Chat Routes
  //= ========================
  apiRoutes.use("/chat", chatRoutes);
  // View messages to and from authenticated user
  chatRoutes.get("/", requireAuth, ChatController.getConversations);
  // Retrieve single conversation
  chatRoutes.post(
    "/message/:conversationId",
    requireAuth,
    ChatController.getConversation
  );
  // Create team chat route
  chatRoutes.post("/team/new", requireAuth, ChatController.createTeamChat);
  // Invite members to team chat route
  chatRoutes.post(
    "/invite/:channelId",
    requireAuth,
    ChatController.inviteMember
  );
  // Send reply in conversation
  chatRoutes.post("/:conversationId", requireAuth, ChatController.sendReply);
  // Start new conversation
  chatRoutes.post(
    "/new/:recipient",
    requireAuth,
    ChatController.newConversation
  );
  // Update message route
  chatRoutes.put("/message", requireAuth, ChatController.updateMessage);
  // Delete message route
  chatRoutes.delete(
    "/message/:messageId",
    requireAuth,
    ChatController.deleteMessage
  );
  // Block chat route
  chatRoutes.post("/block/:userid", requireAuth, ChatController.blockChat);
  // Block chat route
  chatRoutes.get(
    "/participant/:userid",
    requireAuth,
    ChatController.getOneConversation
  );

  //= ========================
  // Notification Routes
  //= ========================
  apiRoutes.use("/notification", notificationRoutes);
  // Send All participant notification route
  notificationRoutes.post(
    "/all",
    requireAuth,
    NotificationController.notifyAllUsers
  );
  // Send project creators notification route
  notificationRoutes.post(
    "/project-creator",
    requireAuth,
    NotificationController.notifyProjectCreators
  );
  // Send organizations notification route
  notificationRoutes.post(
    "/organization",
    requireAuth,
    upload.single("file"),
    NotificationController.notifyOrganizations
  );
  // Get All notification route
  notificationRoutes.get(
    "/",
    requireAuth,
    NotificationController.getNotification
  );
  // Read notification route
  notificationRoutes.post(
    "/read",
    requireAuth,
    NotificationController.readNotification
  );
  // Send All host participant notification route
  notificationRoutes.post(
    "/location",
    requireAuth,
    NotificationController.notifyAllHostUsers
  );

  //= ========================
  // Report Routes
  //= ========================
  apiRoutes.use("/report", reportRoutes);
  // Create Report route
  reportRoutes.post(
    "/participant/:userid",
    requireAuth,
    ReportController.createReport
  );
  // Resove Report route
  reportRoutes.put("/:id", requireAuth, ReportController.resolveReport);
  // List all report route
  reportRoutes.get("/list", ReportController.getReports);

  //= ========================
  // Announce Routes
  //= ========================
  apiRoutes.use("/announce", announceRoutes);
  // Get All admin announce route
  announceRoutes.get("/list/all", requireAuth, AnnounceController.listAnnounce);
  // Get one announce route
  announceRoutes.get("/:id", requireAuth, AnnounceController.getAnnounce);
  // Create an announce route
  announceRoutes.post("/", requireAuth, AnnounceController.createAnnounce);
  // Update one announce route
  announceRoutes.put("/", requireAuth, AnnounceController.updateAnnounce);
  // Get recent active announce route
  announceRoutes.get("/recent/one", AnnounceController.getRecentAnnounce);

  //= ========================
  // Admin Routes
  //= ========================
  apiRoutes.use("/admin", adminRoutes);
  // Get All admin user profile route
  adminRoutes.get(
    "/participant/all",
    requireAuth,
    AdminController.listAdminUsers
  );
  // List project creators route
  adminRoutes.get(
    "/participant/project-creator",
    requireAuth,
    AdminController.listAdminProjectCreators
  );
  // Check if key-signature matches route
  adminRoutes.post("/keycheck", AdminController.checkKey);
  // Update user role
  adminRoutes.post("/role/:id", requireAuth, AdminController.updateRole);
  // Update user role
  adminRoutes.post(
    "/judge/:id",
    requireAuth,
    AdminController.updateJudgeChallenge
  );
  // admin user route
  adminRoutes.get("/user/:id", requireAuth, AdminController.getAdminUser);
  // update admin user route
  adminRoutes.post("/user/:id", requireAuth, AdminController.upateAdminUser);
  // get admin email templates route
  adminRoutes.get(
    "/email/template",
    requireAuth,
    AdminController.getAdminEmailTemplates
  );
  // get admin email templates route
  adminRoutes.get("/ipaddress", AdminController.checkIpAddress);
  // Get All admin judges route
  adminRoutes.get("/judges/all", requireAuth, AdminController.listAdminJudges);

  //= ========================
  // HelpDoc Routes
  //= ========================
  apiRoutes.use("/help", helpdocRoutes);
  // create help document route
  helpdocRoutes.post("/create", requireAuth, HelpDocController.createHelpDoc);
  // List help documents route
  helpdocRoutes.get("/list", HelpDocController.listHelpDoc);
  // update help document route
  helpdocRoutes.post("/update", requireAuth, HelpDocController.updateHelpDoc);
  // delete help document route
  helpdocRoutes.delete(
    "/delete/:id",
    requireAuth,
    HelpDocController.deleteHelpDoc
  );

  //= ========================
  // Label Routes
  //= ========================
  apiRoutes.use("/label", labelRoutes);
  // List label route
  labelRoutes.get("/list", LabelController.fetchLabelData);
  // update help document route
  labelRoutes.post("/update", requireAuth, LabelController.updateLabelData);

  //= ========================
  // Resource Routes
  //= ========================
  apiRoutes.use("/resource", resourceRoutes);
  // create resource route
  resourceRoutes.post("/", requireAuth, ResourceController.createResource);
  // List resources route
  resourceRoutes.get("/", requireAuth, ResourceController.listResource);
  // update resource route
  resourceRoutes.put("/", requireAuth, ResourceController.updateResource);
  // delete resource route
  resourceRoutes.delete("/:id", requireAuth, ResourceController.deleteResource);

  //= ========================
  // Faq Routes
  //= ========================
  apiRoutes.use("/faq", faqRoutes);
  // create faq route
  faqRoutes.post("/", requireAuth, FaqController.createFaq);
  // List faq route
  faqRoutes.get("/", requireAuth, FaqController.listFaq);
  // update faq route
  faqRoutes.put("/", requireAuth, FaqController.updateFaq);
  // update faq route
  faqRoutes.put("/bulk/list", requireAuth, FaqController.bulkUpdateFaq);
  // delete faq route
  faqRoutes.delete("/:id", requireAuth, FaqController.deleteFaq);

  //= ========================
  // Judge Routes
  //= ========================
  apiRoutes.use("/judge", judgeRoutes);
  // send invite route
  judgeRoutes.post("/invite", requireAuth, JudgeController.sendJudgeInvite);
  // register judge route
  judgeRoutes.post("/register", JudgeController.judgeRegister);
  // list judge route
  judgeRoutes.post("/list/:count", requireAuth, JudgeController.listJudges);
  // list judge route
  judgeRoutes.delete("/:id", requireAuth, JudgeController.deleteJudge);

  //= ========================
  // Org member invite Routes
  //= ========================
  apiRoutes.use("/orgmember", orgMemberInvRoutes);
  // send invite route
  orgMemberInvRoutes.post(
    "/invite",
    requireAuth,
    OrgMemberInvController.createOrgInvite
  );
  // update invite route
  orgMemberInvRoutes.put(
    "/update",
    requireAuth,
    OrgMemberInvController.updateOrgInvite
  );
  // resend invite route
  orgMemberInvRoutes.post(
    "/resend",
    requireAuth,
    OrgMemberInvController.resendOrgInvite
  );
  // list judge route
  orgMemberInvRoutes.get(
    "/:org_id",
    requireAuth,
    OrgMemberInvController.listOrgInvite
  );
  // delete invite route
  orgMemberInvRoutes.delete(
    "/:id",
    requireAuth,
    OrgMemberInvController.deleteOrgInvite
  );

  //= ========================
  // Location Routes
  //= ========================
  apiRoutes.use("/location", locationRoutes);
  // create location route
  locationRoutes.post("/", LocationController.createLocation);
  // create other location route
  locationRoutes.post("/other", LocationController.createOtherLocation);
  //message participants
  locationRoutes.post("/:id/message", LocationController.messageParticipants);
  // get location list route
  locationRoutes.get("/", LocationController.listLocation);
  // get pending location list route
  locationRoutes.get("/pending", LocationController.listPendingLocation);
  //get location by Id
  locationRoutes.get("/:id", LocationController.findLocationById);
  // update location route
  locationRoutes.put("/", requireAuth, LocationController.updateLocation);
  // delete location route
  locationRoutes.delete("/:id", requireAuth, LocationController.deleteLocation);
  // admin list location route
  locationRoutes.get(
    "/admin",
    requireAuth,
    LocationController.adminListLocation
  );
  // admin resolve location route
  locationRoutes.put("/admin", requireAuth, LocationController.resolveLocation);
  // verify user location route
  locationRoutes.post("/verify/:user_id", LocationController.hostVerifyUser);

  //= ========================
  // GLHContact Routes
  //= ========================
  apiRoutes.use("/contact", glhcontactRoutes);
  // unsubscribe route
  glhcontactRoutes.post("/unsubscribe", GLHContactController.unsubscribe);

  //= ========================
  // Rule Routes
  //= ========================
  apiRoutes.use("/rules", ruleRoutes);
  // Get All rule route
  ruleRoutes.get("/list/all", requireAuth, RuleController.listRule);
  // Get one rule route
  ruleRoutes.get("/:user_id", requireAuth, RuleController.getRule);
  // Create an rule route
  ruleRoutes.post("/", requireAuth, RuleController.createRule);

  //= ========================
  // Live room Routes
  //= ========================
  apiRoutes.use("/meeting", meetingRoutes);
  meetingRoutes.post("/", requireAuth, MeetingController.createMeeting);
  meetingRoutes.post("/:id/join", requireAuth, MeetingController.joinMeeting);

  //= ========================
  // Rooms Routes
  //= ========================
  apiRoutes.use("/rooms", roomsRoutes);
  roomsRoutes.post("/main", RoomsController.createRoom);
  roomsRoutes.post(
    "/breakout",

    RoomsController.createBreakoutRoom
  );
  roomsRoutes.get("/breakout/:roomSid", RoomsController.listActiveBreakouts);
  roomsRoutes.get("/", RoomsController.listActiveRooms);
  roomsRoutes.get("/:sid", RoomsController.getRoomById);
  roomsRoutes.post("/token", RoomsController.getToken);

  // // List faq route
  // faqRoutes.get("/", requireAuth, FaqController.listFaq);
  // // update faq route
  // faqRoutes.put("/", requireAuth, FaqController.updateFaq);
  // // update faq route
  // faqRoutes.put("/bulk/list", requireAuth, FaqController.bulkUpdateFaq);
  // // delete faq route
  // faqRoutes.delete("/:id", requireAuth, FaqController.deleteFaq);

  // Set url for API group routes
  app.use("/api", apiRoutes);
};
