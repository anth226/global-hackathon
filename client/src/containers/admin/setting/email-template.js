import React from "react";
import { connect } from "react-redux";
import { Collapse, Skeleton } from "antd";
import { getEmailTempaltes } from "../../../actions/admin";

const { Panel } = Collapse;

class EmailTemplates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      templates: [],
      loading: false,
    };
  }

  componentDidMount = async () => {
    const { getEmailTempaltes } = this.props;
    this.setState({ loading: true });
    const templates = await getEmailTempaltes();
    this.setState({ templates, loading: false });
  };

  render() {
    const { templates, loading } = this.state;
    return (
      <div className="content">
        <h3>Email Templates</h3>
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        <Skeleton active loading={loading} />
        {!loading && templates && (
          <Collapse accordion>
            {templates.map((tpl) => (
              <Panel header={tpl.title} key={tpl.title}>
                <div dangerouslySetInnerHTML={{ __html: tpl.html }} />
              </Panel>
            ))}
          </Collapse>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { fieldData: state.profile.fieldData };
}

export default connect(mapStateToProps, { getEmailTempaltes })(EmailTemplates);
