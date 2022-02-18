import React from "react";
import SunEditor from "suneditor-react";

const buttonList = [
  [
    "undo",
    "redo",
    "font",
    "fontSize",
    "formatBlock",
    "paragraphStyle",
    "blockquote",
    "bold",
    "underline",
    "italic",
    "strike",
    "subscript",
    "superscript",
    "fontColor",
    "hiliteColor",
    "textStyle",
    "removeFormat",
    "outdent",
    "indent",
    "align",
    "horizontalRule",
    "list",
    "lineHeight",
    "table",
    "link",
    "image",
    "fullScreen",
    "showBlocks",
    "codeView",
    "preview",
  ],
];

class Editor extends React.Component {
  render() {
    return (
      <SunEditor
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
        setContents={this.props.value || ""}
        setOptions={{
          height: 200,
          buttonList: buttonList,
          maxCharCount: this.props.limit || null
        }}
      />
    );
  }
}

export default Editor;
