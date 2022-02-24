import React, { useState, useEffect, useRef } from "react";
import {
  AudioTrack,
  VideoTrack,
  Participant as VideoParticipant,
} from "twilio-video";

const Participant = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  // Create refs for the HTML elements to attach audio and video to in the DOM
  // For now, set them to null
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Get the audio and video tracks from the participant, filtering out the tracks that are null
  const getExistingVideoTracks = (participant) => {
    const videoPublications = Array.from(participant.videoTracks.values());
    const existingVideoTracks = videoPublications
      .map((publication) => publication.track)
      .filter((track) => track !== null);
    return existingVideoTracks;
  };

  const getExistingAudioTracks = (participant) => {
    const audioPublications = Array.from(participant.audioTracks.values());
    const existingAudioTracks = audioPublications
      .map((publication) => publication.track)
      .filter((track) => track !== null);
    return existingAudioTracks;
  };

  // When a new track is added or removed, update the video and audio tracks in the state
  useEffect(() => {
    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    setVideoTracks(getExistingVideoTracks(participant));
    setAudioTracks(getExistingAudioTracks(participant));

    // Set up event listeners
    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    // Clean up at the end by removing all the tracks and the event listeners
    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
      participant.videoTracks.forEach((track) => (track.isEnabled = false));
    };
  }, [participant]);

  // When a new videoTrack or audioTrack is subscribed, add it to the DOM.
  // When unsubscribed, detach it
  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoRef && videoRef.current) {
      if (videoTrack) {
        videoTrack.attach(videoRef.current);
        return () => {
          videoTrack.detach();
        };
      }
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioRef && audioRef.current) {
      if (audioTrack) {
        audioTrack.attach(audioRef.current);
        return () => {
          audioTrack.detach();
        };
      }
    }
  }, [audioTracks]);

  return (
    <div className="participant">
      <video ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} muted={true} />
    </div>
  );
};

export default Participant;
