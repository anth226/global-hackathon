import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useQuote,
  formulateQuote,
  knowledgeQuote,
  toolsQuote,
  videoQuote,
} from "./index";
import { Input, message } from "antd";
import history from "../../history";

const { Search } = Input;

const HelpSider = ({
  category,
  setCategory,
  searchTxt = "",
  setSearch = () => {},
}) => {
  const [searchStr, setSearchStr] = useState(searchTxt);
  const isUse = category === useQuote;
  const isFormulate = category === formulateQuote;
  const isKnowledge = category === knowledgeQuote;
  const isTools = category === toolsQuote;
  const isVideo = category === videoQuote;

  const onSearch = (value) => {
    if (!value || value.length < 3) {
      message.warn("Search text should be more than 3 in length");
      return;
    }
    history.push(`/help-search/${value}`);
    setSearch(value);
  };

  const onChangeSearch = (e) => {
    setSearchStr(e.target.value);
  };

  return (
    <div className="help-sider">
      <Search
        size="large"
        placeholder="Search"
        value={searchStr}
        onSearch={onSearch}
        onChange={onChangeSearch}
      />
      <div className="empty-space" />
      <div className="empty-space" />
      <span>CATEGORIES</span>
      <div className="empty-space" />
      <Link
        to={`/help-category/${useQuote}`}
        onClick={() => setCategory(useQuote)}
        className={isUse ? "active" : ""}
      >
        {useQuote}
      </Link>
      <div className="empty-space" />
      <Link
        to={`/help-category/${formulateQuote}`}
        onClick={() => setCategory(formulateQuote)}
        className={isFormulate ? "active" : ""}
      >
        {formulateQuote}
      </Link>
      <div className="empty-space" />
      <Link
        to={`/help-category/${knowledgeQuote}`}
        onClick={() => setCategory(knowledgeQuote)}
        className={isKnowledge ? "active" : ""}
      >
        {knowledgeQuote}
      </Link>
      <div className="empty-space" />
      <Link
        to={`/help-category/${toolsQuote}`}
        onClick={() => setCategory(toolsQuote)}
        className={isTools ? "active" : ""}
      >
        {toolsQuote}
      </Link>
      <div className="empty-space" />
      <Link
        to={`/help-category/${videoQuote}`}
        onClick={() => setCategory(videoQuote)}
        className={isVideo ? "active" : ""}
      >
        {videoQuote}
      </Link>
      <div className="empty-space" />
    </div>
  );
};

export default HelpSider;
