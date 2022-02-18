import React from "react";

import Policy from "react-s3/lib/Policy";
import Signature from "react-s3/lib/Signature";
import { xAmzDate, dateYMD } from "react-s3/lib/Date";

import { v4 as uuidv4 } from "uuid";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const config = {
  bucketName: process.env.REACT_APP_S3_BUCKET,
  region: process.env.REACT_APP_S3_REGION,
  accessKeyId: process.env.REACT_APP_ACCESSKEYID,
  secretAccessKey: process.env.REACT_APP_SECRETACCESSKEY,
};

const uploadFile = async (file, config) => {
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

class UploadFile extends React.Component {
  handleChange = (info) => {
    uploadFile(info, config)
      .then((data) => {
        this.props.setUploadedFile(data.location);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <Upload
        name="file"
        showUploadList={false}
        data={this.handleChange}
        accept="application/pdf"
      >
        <Button>
          <UploadOutlined /> Upload PDF
        </Button>
      </Upload>
    );
  }
}

export default UploadFile;
