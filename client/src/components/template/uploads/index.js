import React from "react";
import Policy from "react-s3/lib/Policy";
import Signature from "react-s3/lib/Signature";
import { xAmzDate, dateYMD } from "react-s3/lib/Date";
import { v4 as uuidv4 } from "uuid";
import { Upload, message, Tooltip } from "antd";
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";
import UploadUser from "../../../assets/icon/upload_user.svg";
import UploadPhoto from "../../../assets/icon/upload-photo.svg";
import ImgCrop from "antd-img-crop";

const config = {
  bucketName: process.env.REACT_APP_S3_BUCKET,
  region: process.env.REACT_APP_S3_REGION,
  accessKeyId: process.env.REACT_APP_ACCESSKEYID,
  secretAccessKey: process.env.REACT_APP_SECRETACCESSKEY,
};

const beforeUpload = (file) => {
  const isJpgOrPngOrGif =
    file.type === "image/jpeg" ||
    file.type === "image/webp" ||
    file.type === "image/png" ||
    file.type === "image/gif";
  if (!isJpgOrPngOrGif) {
    message.error("You can only upload JPG/PNG/GIF file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 20;
  if (!isLt2M) {
    message.error("Image must smaller than 20MB!");
  }
  return isJpgOrPngOrGif && isLt2M;
};

export const uploadFile = async (file) => {
  const originalFilename = file.name;
  const fileExtension = originalFilename.split(".").pop();
  const newfileName = `${uuidv4()}.${fileExtension}`;

  const fd = new FormData();
  const key = `${config.dirName ? config.dirName + "/" : ""}${newfileName}`;
  const url = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/`;
  fd.append("key", key);
  fd.append("acl", "public-read");
  fd.append("Content-Type", file.type);
  fd.append("x-amz-meta-uuid", "14365123651274");
  fd.append("x-amz-server-side-encryption", "AES256");
  fd.append(
    "X-Amz-Credential",
    `${config.accessKeyId}/${dateYMD}/${config.region}/s3/aws4_request`
  );
  fd.append("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
  fd.append("X-Amz-Date", xAmzDate);
  fd.append("x-amz-meta-tag", "");
  fd.append("Policy", Policy.getPolicy(config));
  fd.append(
    "X-Amz-Signature",
    Signature.getSignature(config, dateYMD, Policy.getPolicy(config))
  );
  fd.append("file", file);

  const params = {
    method: "post",
    headers: {
      fd,
    },
    body: fd,
  };

  const data = await fetch(url, params);
  if (!data.ok) return Promise.reject(data);
  return Promise.resolve({
    bucket: config.bucketName,
    key: `${config.dirName ? config.dirName + "/" : ""}${newfileName}`,
    location: `${url}${
      config.dirName ? config.dirName + "/" : ""
    }${newfileName}`,
    result: data,
  });
};

class Avatar extends React.Component {
  state = {
    loading: false,
    imageUrl: this.props.imageUrl || "",
  };

  handleChange = (info) => {
    this.setState({ loading: true });
    uploadFile(info)
      .then((data) => {
        const imageUrl = data.location;
        this.setState({
          imageUrl,
          loading: false,
        });
        this.props.setAvatar(imageUrl);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  onRemoveImg = (e) => {
    e.stopPropagation();
    this.setState({ imageUrl: "" });
    this.props.setAvatar("");
  };

  render() {
    const { imageUrl, loading } = this.state;
    const { subject } = this.props;
    const uploadButton = (
      <div>
        {loading ? (
          <LoadingOutlined style={{ fontSize: "50px" }} />
        ) : (
          <img src={subject ? UploadPhoto : UploadUser} alt="" />
        )}
        <div className="ant-upload-text">
          Drag and drop {subject || "profile"} photo here or{" "}
          <span className="underscore">choose file manually</span>
        </div>
      </div>
    );

    return (
      <React.Fragment>
        <ImgCrop rotate>
          <Upload
            name="avatar"
            listType="picture-card"
            className="big-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            data={this.handleChange}
          >
            {imageUrl && !loading ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
            {imageUrl && (
              <Tooltip title="Remove">
                <CloseCircleOutlined
                  className="upload-remove"
                  onClick={this.onRemoveImg}
                  style={{ fontSize: "16px", color: "#999" }}
                />
              </Tooltip>
            )}
          </Upload>
        </ImgCrop>
        {/* {showCropModal && (
          <Modal
            title="Image Upload"
            visible={showCropModal}
            width={800}
            footer={false}
            onCancel={this.onHideModal}
          >
            <ImageCropper getBlob={this.setBlob} inputImg={inputImg} />
            <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
              <Button
                type="ghost"
                onClick={this.onHideModal}
                className="ghost-btn"
              >
                Cancel
              </Button>
              <Button
                type="ghost"
                className="black-btn ml-3"
                onClick={this.startUpload}
              >
                {loading ? (
                  <LoadingOutlined className="mr-3 ml-3" />
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          </Modal>
        )} */}
      </React.Fragment>
    );
  }
}

export default Avatar;
