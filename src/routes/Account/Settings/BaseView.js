import React, { Component, Fragment } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input, Upload, Select, Button } from 'antd';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
// import { getTimeDistance } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>Avatar</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);

const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

@Form.create()
class BaseView extends Component {
  constructor(props) {
    super(props);
    const { intl } = props;
    this.formLabelData = {
      email: intl.formatMessage({ id: 'app.settings.basic.email' }, {}),
      emailMessage: intl.formatMessage({ id: 'app.settings.basic.email-message' }, {}),
      nickname: intl.formatMessage({ id: 'app.settings.basic.nickname' }, {}),
      nicknameMessage: intl.formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
      profile: intl.formatMessage({ id: 'app.settings.basic.profile' }, {}),
      profileMessage: intl.formatMessage({ id: 'app.settings.basic.profile-message' }, {}),
      profilePlaceholder: intl.formatMessage({ id: 'app.settings.basic.profile-placeholder' }, {}),
      country: intl.formatMessage({ id: 'app.settings.basic.country' }, {}),
      countryMessage: intl.formatMessage({ id: 'app.settings.basic.country-message' }, {}),
      geographic: intl.formatMessage({ id: 'app.settings.basic.geographic' }, {}),
      geographicMessage: intl.formatMessage({ id: 'app.settings.basic.geographic-message' }, {}),
      address: intl.formatMessage({ id: 'app.settings.basic.address' }, {}),
      addressMessage: intl.formatMessage({ id: 'app.settings.basic.address-message' }, {}),
      phone: intl.formatMessage({ id: 'app.settings.basic.phone' }, {}),
      phoneMessage: intl.formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
    };
  }

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={this.formLabelData.email}>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: this.formLabelData.emailMessage }],
              })(<Input />)}
            </FormItem>
            <FormItem label={this.formLabelData.nickname}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: this.formLabelData.nicknameMessage }],
              })(<Input />)}
            </FormItem>
            <FormItem label={this.formLabelData.profile}>
              {getFieldDecorator('profile', {
                rules: [{ required: true, message: this.formLabelData.profileMessage }],
              })(<Input.TextArea placeholder={this.formLabelData.profilePlaceholder} rows={4} />)}
            </FormItem>
            <FormItem label={this.formLabelData.country}>
              {getFieldDecorator('country', {
                rules: [{ required: true, message: this.formLabelData.countryMessage }],
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="China">中国</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label={this.formLabelData.geographic}>
              {getFieldDecorator('geographic', {
                rules: [
                  {
                    required: true,
                    message: this.formLabelData.geographicMessage,
                  },
                  {
                    validator: validatorGeographic,
                  },
                ],
              })(<GeographicView />)}
            </FormItem>
            <FormItem label={this.formLabelData.address}>
              {getFieldDecorator('address', {
                rules: [{ required: true, message: this.formLabelData.addressMessage }],
              })(<Input />)}
            </FormItem>
            <FormItem label={this.formLabelData.phone}>
              {getFieldDecorator('phone', {
                rules: [
                  { required: true, message: this.formLabelData.phoneMessage },
                  { validator: validatorPhone },
                ],
              })(<PhoneView />)}
            </FormItem>
            <Button type="primary">
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}
export default injectIntl(BaseView);
