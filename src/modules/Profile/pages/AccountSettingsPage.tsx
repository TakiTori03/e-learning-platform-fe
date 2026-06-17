import { useEffect, useState } from "react";
import { Form, Row, Col, Card, Switch, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { useProfileQueries } from "../hooks/useProfileQueries";
import {
  UserOutlined,
  LockOutlined,
  PictureOutlined,
  EyeOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import CButton from "@/components/UI/Button";
import CInput, { CInputPassword } from "@/components/UI/Input";
import CSelect from "@/components/UI/Select";
import CTextArea from "@/components/UI/TextArea";

interface IProfileFormValues {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  headline?: string;
  biography?: string;
  language?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

interface IPictureFormValues {
  avatar: string;
}

interface IPrivacyFormValues {
  showProfile: boolean;
  showCourses: boolean;
}

interface IPasswordFormValues {
  oldPassword?: string;
  newPassword?: string;
}

export const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const {
    user,
    isUpdating,
    updateProfile,
    updateAvatar,
    updatePrivacy,
    changePassword,
  } = useProfileQueries();

  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = new URLSearchParams(window.location.search).get("tab");
    return tabParam &&
      ["profile", "picture", "privacy", "password"].includes(tabParam)
      ? tabParam
      : "profile";
  });
  const [profileForm] = Form.useForm<IProfileFormValues>();
  const [passwordForm] = Form.useForm<IPasswordFormValues>();
  const [pictureForm] = Form.useForm<IPictureFormValues>();
  const [privacyForm] = Form.useForm<IPrivacyFormValues>();

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        headline: user.headline,
        biography: user.biography,
        language: user.language || "en",
        website: user.socials?.website,
        facebook: user.socials?.facebook,
        twitter: user.socials?.twitter,
        linkedin: user.socials?.linkedin,
        youtube: user.socials?.youtube,
      });

      pictureForm.setFieldsValue({
        avatar: user.avatar,
      });

      privacyForm.setFieldsValue({
        showProfile: user.showProfile !== false,
        showCourses: user.showCourses !== false,
      });
    }
  }, [user, profileForm, pictureForm, privacyForm]);

  const handleUpdateProfile = async (values: IProfileFormValues) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      headline: values.headline,
      biography: values.biography,
      language: values.language,
      socials: {
        website: values.website || "",
        facebook: values.facebook || "",
        twitter: values.twitter || "",
        linkedin: values.linkedin || "",
        youtube: values.youtube || "",
      },
    };
    await updateProfile(payload);
  };

  const handleUpdatePicture = async (values: IPictureFormValues) => {
    await updateAvatar(values.avatar);
  };

  const handleUpdatePrivacy = async (values: IPrivacyFormValues) => {
    await updatePrivacy({
      showProfile: values.showProfile,
      showCourses: values.showCourses,
    });
  };

  const handleChangePassword = async (values: IPasswordFormValues) => {
    await changePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
    passwordForm.resetFields();
  };

  const selectLanguageOptions = [
    { value: "en", label: "English" },
    { value: "vi", label: "Tiếng Việt" },
  ];

  const tabsItems = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined /> E-Learning Profile
        </span>
      ),
      children: (
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleUpdateProfile}
          requiredMark={false}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your first name!",
                      },
                    ]}
                  >
                    <CInput id="firstName" className="rounded-lg h-10" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your last name!",
                      },
                    ]}
                  >
                    <CInput id="lastName" className="rounded-lg h-10" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="email" label="Email">
                <CInput
                  id="email"
                  className="rounded-lg h-10 bg-gray-50"
                  disabled
                />
              </Form.Item>
              <Form.Item name="phone" label="Phone">
                <CInput id="phone" className="rounded-lg h-10" />
              </Form.Item>
              <Form.Item name="headline" label="Headline">
                <CInput
                  id="headline"
                  className="rounded-lg h-10"
                  placeholder="Instructor / Student at E-Learning"
                />
              </Form.Item>
              <Form.Item name="biography" label="Biography">
                <CTextArea
                  id="biography"
                  rows={4}
                  className="rounded-lg"
                  placeholder="Tell us about yourself..."
                />
              </Form.Item>
              <Form.Item name="language" label="Language">
                <CSelect
                  id="language"
                  className="h-10"
                  placeholder="Select Language"
                  options={selectLanguageOptions}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="website" label="Website">
                <CInput
                  id="website"
                  className="rounded-lg h-10"
                  placeholder="https://example.com"
                />
              </Form.Item>
              <Form.Item name="facebook" label="Facebook">
                <CInput
                  id="facebook"
                  className="rounded-lg h-10"
                  placeholder="Username"
                  addonBefore="facebook.com/"
                />
              </Form.Item>
              <Form.Item name="twitter" label="Twitter">
                <CInput
                  id="twitter"
                  className="rounded-lg h-10"
                  placeholder="Username"
                  addonBefore="twitter.com/"
                />
              </Form.Item>
              <Form.Item name="linkedin" label="LinkedIn">
                <CInput
                  id="linkedin"
                  className="rounded-lg h-10"
                  placeholder="ID"
                  addonBefore="linkedin.com/in/"
                />
              </Form.Item>
              <Form.Item name="youtube" label="YouTube">
                <CInput
                  id="youtube"
                  className="rounded-lg h-10"
                  placeholder="Username"
                  addonBefore="youtube.com/"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="mt-4">
            <CButton
              type="primary"
              htmlType="submit"
              className="rounded-full px-6 flex items-center gap-2"
              loading={isUpdating}
            >
              <SaveOutlined /> Save Profile Details
            </CButton>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "picture",
      label: (
        <span className="flex items-center gap-2">
          <PictureOutlined /> Profile Picture
        </span>
      ),
      children: (
        <Form
          form={pictureForm}
          layout="vertical"
          onFinish={handleUpdatePicture}
        >
          <div className="flex flex-col items-center gap-6 py-6">
            <img
              src={
                pictureForm.getFieldValue("avatar") ||
                "https://cdn.mycourse.app/v3.0.4/images/initial-avatar.jpg"
              }
              alt="Avatar Preview"
              className="w-32 h-32 rounded-full border shadow object-cover bg-white"
            />
            <Form.Item
              name="avatar"
              label="Avatar URL"
              className="w-full max-w-md"
              rules={[{ required: true, message: "Please input avatar URL!" }]}
            >
              <CInput
                id="avatar"
                className="rounded-lg h-10"
                placeholder="https://example.com/avatar.jpg"
                onChange={(e) =>
                  pictureForm.setFieldsValue({ avatar: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item>
              <CButton
                type="primary"
                htmlType="submit"
                className="rounded-full px-6 flex items-center gap-2"
                loading={isUpdating}
              >
                <SaveOutlined /> Save Avatar Image
              </CButton>
            </Form.Item>
          </div>
        </Form>
      ),
    },
    {
      key: "privacy",
      label: (
        <span className="flex items-center gap-2">
          <EyeOutlined /> Privacy Settings
        </span>
      ),
      children: (
        <Form
          form={privacyForm}
          layout="vertical"
          onFinish={handleUpdatePrivacy}
        >
          <div className="max-w-md flex flex-col gap-6 py-4">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h4 className="font-bold text-slate-800 text-base">
                  Show profile publicly
                </h4>
                <p className="text-slate-500 text-sm mt-0.5">
                  Let learners find your profile on search engines.
                </p>
              </div>
              <Form.Item
                name="showProfile"
                valuePropName="checked"
                className="mb-0"
              >
                <Switch />
              </Form.Item>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h4 className="font-bold text-slate-800 text-base">
                  Show courses publicly
                </h4>
                <p className="text-slate-500 text-sm mt-0.5">
                  Show which courses you are currently taking.
                </p>
              </div>
              <Form.Item
                name="showCourses"
                valuePropName="checked"
                className="mb-0"
              >
                <Switch />
              </Form.Item>
            </div>
            <Form.Item className="mt-2">
              <CButton
                type="primary"
                htmlType="submit"
                className="rounded-full px-6 flex items-center gap-2"
                loading={isUpdating}
              >
                <SaveOutlined /> Save Privacy Settings
              </CButton>
            </Form.Item>
          </div>
        </Form>
      ),
    },
    {
      key: "password",
      label: (
        <span className="flex items-center gap-2">
          <LockOutlined /> Change Password
        </span>
      ),
      children: (
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <div className="max-w-md py-4">
            <Form.Item
              name="oldPassword"
              label="Current Password"
              rules={[
                { required: true, message: "Please input current password!" },
              ]}
            >
              <CInputPassword id="oldPassword" className="rounded-lg h-10" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please input new password!" },
              ]}
            >
              <CInputPassword id="newPassword" className="rounded-lg h-10" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!"),
                    );
                  },
                }),
              ]}
            >
              <CInputPassword
                id="confirmPassword"
                className="rounded-lg h-10"
              />
            </Form.Item>
            <Form.Item className="mt-6">
              <CButton
                type="primary"
                htmlType="submit"
                className="rounded-full px-6 flex items-center gap-2"
                loading={isUpdating}
              >
                <SaveOutlined /> Save Password Change
              </CButton>
            </Form.Item>
          </div>
        </Form>
      ),
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <CButton
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="text-gray-500 border-gray-300 rounded-full flex items-center justify-center w-10 h-10 shrink-0 shadow-sm"
          />
          <div>
            <h1 className="text-3xl font-black text-slate-800 !m-0">
              Account Settings
            </h1>
            <p className="text-slate-500 mt-1">
              Update your public profile, set your avatar, manage privacy, and change passwords.
            </p>
          </div>
        </div>

        <Card className="shadow-sm border-gray-100 rounded-2xl p-2 md:p-4 bg-white">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            items={tabsItems}
            className="custom-settings-tabs"
          />
        </Card>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
