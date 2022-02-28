const { Twilio } = require("twilio");
const twilio = require("twilio");
const config = require("../config/main");
const Room = require("../models/room");

const twilioClient = new Twilio(
  config.TWILIO_API_KEY,
  config.TWILIO_API_SECRET,
  { accountSid: config.TWILIO_ACCOUNT_SID }
);

/**
 * Create a new main room
 */
const createRoom = async (request, response) => {
  // Get the room name from the request body.
  // If no room name is provided, the name will be set to the room's SID.
  const roomName = request.body.roomName || "";
  const projectId = request.body.projectId || "";

  try {
    // Call the Twilio video API to create the new room.
    const room = await twilioClient.video.rooms.create({
      uniqueName: roomName,
      type: "group",
    });

    const mainRoom = {
      sid: room.sid,
      project: projectId,
      breakouts: [],
    };

    try {
      // Save the document in the db.
      await Room.create(mainRoom);

      response.status(200).send({
        message: `New video room ${room.uniqueName} created`,
        room: mainRoom,
      });

      request.io.emit("Main room created");
      return;
    } catch (error) {
      return response.status(400).send({
        message: `Error saving new room to db -- room name=${roomName}`,
        error,
      });
    }
  } catch (error) {
    // If something went wrong, handle the error.
    return response.status(400).send({
      message: `Unable to create new room with name=${roomName}`,
      error,
    });
  }
};

/**
 * Create a new breakout room
 */
const createBreakoutRoom = async (request, response) => {
  // Get the roomName and parentSid from the request body.
  const roomName = request.body.roomName || "";

  // If no parent was provided, return an error message.
  if (!request.body.parentSid) {
    return response.status(400).send({
      message: `No parentSid provided for new breakout room with name=${roomName}`,
    });
  }

  const parentSid = request.body.parentSid;

  try {
    // Call the Twilio video API to create the new room.
    const breakoutRoom = await twilioClient.video.rooms.create({
      uniqueName: roomName,
      type: "group",
    });

    try {
      // Save the new breakout room on its parent's record (main room).
      const mainRoom = await Room.findOne({ sid: parentSid });
      mainRoom.breakouts.push(breakoutRoom.sid);
      mainRoom.save();

      // Return the full room details in the response.
      response.status(200).send({
        message: `Breakout room ${breakoutRoom.uniqueName} created`,
        room: mainRoom,
      });

      request.io.emit("Breakout room created");
      return;
    } catch (error) {
      return response.status(400).send({
        message: `Error saving new breakout room to db -- breakout room name=${roomName}`,
        error,
      });
    }
  } catch (error) {
    // If something went wrong, handle the error.
    return response.status(400).send({
      message: `Unable to create new breakout room with name=${roomName}`,
      error,
    });
  }
};

/**
 * List active video rooms
 */
const listActiveRooms = async (request, response) => {
  try {
    // Get the last 20 rooms that are still currently in progress.
    const rooms = await twilioClient.video.rooms.list({
      status: "in-progress",
      limit: 20,
    });

    // Get a list of active room sids.
    let activeRoomSids = rooms.map((room) => room.sid);

    try {
      // Retrieve the room documents from the database.
      let dbRooms = await Room.find();

      // Filter the documents to include only the main rooms that are active.
      let dbActiveRooms = dbRooms.filter((mainRoomRecord) => {
        return activeRoomSids.includes(mainRoomRecord.sid) && mainRoomRecord;
      });

      // Create a list of MainRoomItem that will associate a room's id with its name and breakout rooms.
      let videoRooms = [];

      // For each of the active rooms from the db, get the details for that main room and its breakout rooms.
      // Then pass that data into an array to return to the client side.
      if (dbActiveRooms) {
        dbActiveRooms.forEach((row) => {
          // Find the specific main room in the list of rooms returned from the Twilio Rooms API.
          const activeMainRoom = rooms.find((mainRoom) => {
            return mainRoom.sid === row.sid;
          });

          // Get the list of breakout rooms from this room's document.
          const breakoutSids = row.breakouts;

          // Filter to select only the breakout rooms that are active according to
          // the response from the Twilio Rooms API.
          const activeBreakoutRooms = rooms.filter((breakoutRoom) => {
            return breakoutSids.includes(breakoutRoom.sid);
          });

          // Create a list of BreakoutRoomItems that will contain each breakout room's name and id.
          let breakouts = [];

          // Get the names of each breakout room from the API response.
          activeBreakoutRooms.forEach((breakoutRoom) => {
            breakouts.push({
              sid: breakoutRoom.sid,
              name: breakoutRoom.uniqueName,
            });
          });

          const videoRoom = {
            sid: activeMainRoom.sid,
            name: activeMainRoom.uniqueName,
            breakouts: breakouts,
          };
          // Add this room to the list of rooms to return to the client side.
          videoRooms.push(videoRoom);
        });
      }

      // Return the list of active rooms to the client side.
      return response.status(200).send({
        rooms: videoRooms,
      });
    } catch (error) {
      console.log(error);
      return response.status(400).send({
        message: `Error retrieving video rooms from db`,
        error,
      });
    }
  } catch (error) {
    return response.status(400).send({
      message: `Unable to list active rooms`,
      error,
    });
  }
};

const getRoomBySid = async (request, response) => {
  try {
    const room = await Room.findOne({ sid: request.params.sid });
    return response.status(200).send(room);
  } catch (error) {
    console.error(error);
    return response.status(400).send({
      message: `Unable to list active rooms`,
      error,
    });
  }
};

/**
 * List active video breakout rooms
 */
const listActiveBreakouts = async (request, response) => {
  try {
    // Get the last 20 rooms that are still currently in progress.
    const rooms = await twilioClient.video.rooms.list({
      _id: request.params.roomSid,
      // status: "in-progress",
      limit: 20,
    });

    // Get a list of active room sids.
    let activeRoomSids = rooms.map((room) => room.sid);

    try {
      // Retrieve the room documents from the database.
      let dbRooms = await Room.find();

      // Filter the documents to include only the main rooms that are active.
      let dbActiveRooms = dbRooms.filter((mainRoomRecord) => {
        return activeRoomSids.includes(mainRoomRecord.sid) && mainRoomRecord;
      });

      // Create a list of MainRoomItem that will associate a room's id with its name and breakout rooms.
      let videoRooms = [];

      // For each of the active rooms from the db, get the details for that main room and its breakout rooms.
      // Then pass that data into an array to return to the client side.
      if (dbActiveRooms) {
        dbActiveRooms.forEach((row) => {
          // Find the specific main room in the list of rooms returned from the Twilio Rooms API.
          const activeMainRoom = rooms.find((mainRoom) => {
            return mainRoom.sid === row.sid;
          });

          // Get the list of breakout rooms from this room's document.
          const breakoutSids = row.breakouts;

          // Filter to select only the breakout rooms that are active according to
          // the response from the Twilio Rooms API.
          const activeBreakoutRooms = rooms.filter((breakoutRoom) => {
            return breakoutSids.includes(breakoutRoom.sid);
          });

          // Create a list of BreakoutRoomItems that will contain each breakout room's name and id.
          let breakouts = [];

          // Get the names of each breakout room from the API response.
          activeBreakoutRooms.forEach((breakoutRoom) => {
            breakouts.push({
              sid: breakoutRoom.sid,
              name: breakoutRoom.uniqueName,
            });
          });

          const videoRoom = {
            sid: activeMainRoom.sid,
            name: activeMainRoom.uniqueName,
            breakouts: breakouts,
          };
          // Add this room to the list of rooms to return to the client side.
          videoRooms.push(videoRoom);
        });
      }

      const searchedRoom = videoRooms.find(
        (r) => r.sid == request.params.roomSid
      );

      // Return the list of active rooms to the client side.
      return response.status(200).send({
        breakouts: (searchedRoom?.breakouts || []).map((br) => {
          return { ...br, parentSid: searchedRoom._id };
        }),
      });
    } catch (error) {
      console.log(error);
      return response.status(400).send({
        message: `Error retrieving video rooms from db`,
        error,
      });
    }
  } catch (error) {
    return response.status(400).send({
      message: `Unable to list active rooms`,
      error,
    });
  }
};

/**
 * Get a token for a user for a video room
 */
const getToken = (request, response) => {
  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  // Get the user's identity and roomSid from the query.
  const { identity, roomSid } = request.body;

  // Create the access token.
  const token = new AccessToken(
    config.TWILIO_ACCOUNT_SID,
    config.TWILIO_API_KEY,
    config.TWILIO_API_SECRET,
    { identity: identity }
  );

  token.identity = identity;

  // Add a VideoGrant to the token to allow the user of this token to use Twilio Video
  const grant = new VideoGrant({ room: roomSid });
  token.addGrant(grant);

  response.json({
    accessToken: token.toJwt(),
  });
};

module.exports = {
  createRoom,
  createBreakoutRoom,
  listActiveRooms,
  getToken,
  listActiveBreakouts,
  getRoomById: getRoomBySid,
};
