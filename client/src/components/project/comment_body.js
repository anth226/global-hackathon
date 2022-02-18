import React from "react";
import { Comment, Avatar, Tooltip, Popconfirm } from "antd";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";
import moment from "moment";
import { Link } from "react-router-dom";
import UserAvatar from "../../assets/img/user-avatar.png";

const CommentBody = ({
  comment,
  onUpdateComment,
  onDeleteComment,
  likeComment,
  userId,
  replyComment,
  children,
}) => {
  const likes = comment.likes || [];
  const dislikes = comment.dislikes || [];
  const liked = likes.includes(userId);
  const disliked = dislikes.includes(userId);
  let actions = [
    <span key="comment-basic-like">
      <Tooltip title="Like">
        {liked && <LikeFilled onClick={() => likeComment(comment, true)} />}
        {!liked && <LikeOutlined onClick={() => likeComment(comment, true)} />}
      </Tooltip>
      <span className="ml-1">{likes.length}</span>
    </span>,
    <span key=' key="comment-basic-dislike"'>
      <Tooltip title="Dislike">
        {disliked && (
          <DislikeFilled onClick={() => likeComment(comment, false)} />
        )}
        {!disliked && (
          <DislikeOutlined onClick={() => likeComment(comment, false)} />
        )}
      </Tooltip>
      <span className="ml-1">{dislikes.length}</span>
    </span>,
    <span
      key="comment-basic-reply-to"
      onClick={() => replyComment(comment._id)}
    >
      Reply to
    </span>,
  ];

  if (comment.participant._id === userId) {
    actions.push(
      <span
        key="comment-edit"
        className="text-underline ml-4"
        onClick={() => onUpdateComment(comment)}
      >
        Edit
      </span>
    );
    actions.push(
      <Popconfirm
        title="Are you sure delete this comment?"
        onConfirm={() => onDeleteComment(comment)}
        okText="Yes"
        cancelText="No"
      >
        <span key="comment-delete" className="text-underline">
          Delete
        </span>
      </Popconfirm>
    );
  }

  return (
    <Comment
      actions={actions}
      author={
        <span>{`${comment.participant.profile.first_name} ${comment.participant.profile.last_name}`}</span>
      }
      avatar={
        <Link to={`/participant/${comment.participant._id}`}>
          <Avatar
            src={comment.participant.profile.photo || UserAvatar}
            alt="logo"
          />
        </Link>
      }
      content={<p>{comment.content}</p>}
      datetime={
        <Tooltip
          title={moment(comment.createdAt).format("YYYY-MM-DD HH:mm:ss")}
        >
          <span>{moment(comment.createdAt).fromNow()}</span>
        </Tooltip>
      }
    >
      {children}
    </Comment>
  );
};

export default CommentBody;
