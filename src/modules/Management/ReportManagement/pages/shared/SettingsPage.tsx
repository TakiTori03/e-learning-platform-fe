import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Tabs,
  Typography,
  Avatar,
  Progress,
  App as AntdApp,
} from "antd";
import {
  User,
  BookOpen,
  Image,
  Lock,
  Save,
  Upload,
} from "lucide-react";
import { useProfileQueries } from "@/modules/Profile/hooks/useProfileQueries";
import { mediaApi } from "@/core/http/mediaApi";
import CButton from "@/components/UI/Button";
import CInput, { CInputPassword } from "@/components/UI/Input";
import CTextArea from "@/components/UI/TextArea";
import CSelect from "@/components/UI/Select";

const { Title, Text } = Typography;

const SettingsPage: React.FC = () => {
  const { message: antdMessage } = AntdApp.useApp();
  const {
    user,
    isUpdating,
    updateProfile,
    updateAvatar,
    changePassword,
  } = useProfileQueries();

  const [profileForm] = Form.useForm();
  const [bioForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Avatar upload states
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        language: user.language || "vi",
      });

      bioForm.setFieldsValue({
        headline: user.headline,
        biography: user.biography,
        website: user.socials?.website,
        facebook: user.socials?.facebook,
        twitter: user.socials?.twitter,
        linkedin: user.socials?.linkedin,
        youtube: user.socials?.youtube,
      });

      setAvatarUrl(user.avatar || "");
    }
  }, [user, profileForm, bioForm]);

  // Handle personal info form submit
  const handleProfileSubmit = async (values: any) => {
    try {
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        language: values.language,
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  // Handle professional info submit
  const handleBioSubmit = async (values: any) => {
    try {
      const socials: Record<string, string> = {};
      if (values.website && values.website.trim() !== "") socials.website = values.website.trim();
      if (values.facebook && values.facebook.trim() !== "") socials.facebook = values.facebook.trim();
      if (values.twitter && values.twitter.trim() !== "") socials.twitter = values.twitter.trim();
      if (values.linkedin && values.linkedin.trim() !== "") socials.linkedin = values.linkedin.trim();
      if (values.youtube && values.youtube.trim() !== "") socials.youtube = values.youtube.trim();

      const payload: any = {
        headline: values.headline,
        biography: values.biography,
      };

      if (Object.keys(socials).length > 0) {
        payload.socials = socials;
      }

      await updateProfile(payload);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Handle avatar upload and save
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      antdMessage.error("Chỉ chấp nhận các tệp tin hình ảnh.");
      return;
    }

    try {
      setUploading(true);
      setUploadPercent(0);
      antdMessage.info("Đang tải ảnh đại diện lên...");

      const response = await mediaApi.uploadImage(file);
      if (response && response.url) {
        setAvatarUrl(response.url);
        await updateAvatar(response.url);
      }
    } catch (err: any) {
      antdMessage.error("Tải ảnh đại diện thất bại: " + (err.message || "Lỗi."));
    } finally {
      setUploading(false);
    }
  };

  // Handle change password submit
  const handlePasswordSubmit = async (values: any) => {
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      passwordForm.resetFields();
    } catch (err: any) {
      console.error(err);
    }
  };

  const tabsItems = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2 font-semibold">
          <User className="w-4 h-4" /> Thông tin cá nhân
        </span>
      ),
      forceRender: true,
      children: (
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileSubmit}
          className="pt-4"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="firstName"
                label={<span className="font-semibold text-gray-700">Tên (First Name)</span>}
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <CInput id="firstName" className="rounded-lg h-10" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="lastName"
                label={<span className="font-semibold text-gray-700">Họ (Last Name)</span>}
                rules={[{ required: true, message: "Vui lòng nhập họ" }]}
              >
                <CInput id="lastName" className="rounded-lg h-10" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="email" label={<span className="font-semibold text-gray-700">Email</span>}>
                <CInput id="email" className="rounded-lg h-10 bg-gray-50 text-gray-500" disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="phone" label={<span className="font-semibold text-gray-700">Số điện thoại</span>}>
                <CInput id="phone" className="rounded-lg h-10" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="language" label={<span className="font-semibold text-gray-700">Ngôn ngữ hiển thị</span>}>
                <CSelect
                  id="language"
                  className="h-10 custom-select"
                  options={[
                    { value: "vi", label: "Tiếng Việt" }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="mt-4 mb-0">
            <CButton
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              icon={<Save className="w-4 h-4 mr-1.5" />}
              className="bg-primary hover:bg-primary/95 border-0 rounded-lg h-10 px-6 font-semibold flex items-center text-white"
            >
              Lưu thay đổi
            </CButton>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "biography",
      label: (
        <span className="flex items-center gap-2 font-semibold">
          <BookOpen className="w-4 h-4" /> Tiểu sử & Chuyên môn
        </span>
      ),
      forceRender: true,
      children: (
        <Form
          form={bioForm}
          layout="vertical"
          onFinish={handleBioSubmit}
          className="pt-4"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                name="headline"
                label={<span className="font-semibold text-gray-700">Tiêu đề chuyên môn (Headline)</span>}
              >
                <CInput id="headline" placeholder="Ví dụ: Giảng viên CNTT / Chuyên gia ReactJS..." className="rounded-lg h-10" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="biography"
                label={<span className="font-semibold text-gray-700">Tiểu sử tự thuật (Biography)</span>}
              >
                <CTextArea id="biography" rows={5} placeholder="Giới thiệu chi tiết về kinh nghiệm và kỹ năng của bạn..." className="rounded-lg" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="website" label={<span className="font-semibold text-gray-700">Trang web cá nhân (Website URL)</span>}>
                <CInput id="website" placeholder="https://yourwebsite.com" className="rounded-lg h-10" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="facebook" label={<span className="font-semibold text-gray-700">Facebook URL</span>}>
                <CInput id="facebook" placeholder="https://facebook.com/username" className="rounded-lg h-10" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="linkedin" label={<span className="font-semibold text-gray-700">LinkedIn URL</span>}>
                <CInput id="linkedin" placeholder="https://linkedin.com/in/username" className="rounded-lg h-10" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="youtube" label={<span className="font-semibold text-gray-700">YouTube Channel URL</span>}>
                <CInput id="youtube" placeholder="https://youtube.com/channel/..." className="rounded-lg h-10" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="mt-4 mb-0">
            <CButton
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              icon={<Save className="w-4 h-4 mr-1.5" />}
              className="bg-primary hover:bg-primary/95 border-0 rounded-lg h-10 px-6 font-semibold flex items-center text-white"
            >
              Lưu thay đổi
            </CButton>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "avatar",
      label: (
        <span className="flex items-center gap-2 font-semibold">
          <Image className="w-4 h-4" /> Ảnh đại diện
        </span>
      ),
      children: (
        <div className="flex flex-col items-center py-8 space-y-6">
          <Avatar
            size={120}
            src={avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"}
            className="border shadow-sm object-cover bg-white"
          />
          <div className="flex flex-col items-center space-y-3">
            <CButton
              type="default"
              icon={<Upload className="w-4 h-4 mr-1.5" />}
              loading={uploading}
              onClick={() => document.getElementById("avatar-upload-picker")?.click()}
              className="rounded-lg h-10 px-6 flex items-center border-gray-200 hover:border-primary"
            >
              Chọn ảnh đại diện mới
            </CButton>
            <input
              id="avatar-upload-picker"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            {uploading && <Progress percent={uploadPercent} size="small" className="w-48" />}
            <Text type="secondary" className="text-xs">
              Hỗ trợ định dạng PNG, JPG, JPEG. Kích thước tối đa 5MB.
            </Text>
          </div>
        </div>
      ),
    },
    {
      key: "password",
      label: (
        <span className="flex items-center gap-2 font-semibold">
          <Lock className="w-4 h-4" /> Đổi mật khẩu
        </span>
      ),
      forceRender: true,
      children: (
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordSubmit}
          className="pt-4 max-w-md mx-auto"
        >
          <Form.Item
            name="oldPassword"
            label={<span className="font-semibold text-gray-700">Mật khẩu hiện tại</span>}
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
          >
            <CInputPassword id="oldPassword" className="rounded-lg h-10" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label={<span className="font-semibold text-gray-700">Mật khẩu mới</span>}
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu mới phải tối thiểu 6 ký tự" },
            ]}
          >
            <CInputPassword id="newPassword" className="rounded-lg h-10" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={<span className="font-semibold text-gray-700">Xác nhận mật khẩu mới</span>}
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                },
              }),
            ]}
          >
            <CInputPassword id="confirmPassword" className="rounded-lg h-10" />
          </Form.Item>
          <Form.Item className="mt-6 mb-0">
            <CButton
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              icon={<Save className="w-4 h-4 mr-1.5" />}
              className="bg-primary hover:bg-primary/95 border-0 rounded-lg h-10 px-6 font-semibold flex items-center w-full justify-center text-white"
            >
              Cập nhật mật khẩu
            </CButton>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <Title level={4} className="!m-0 text-gray-800 font-bold">
          Thiết lập tài khoản
        </Title>
        <Text type="secondary" className="text-sm">
          Quản lý thông tin hồ sơ hiển thị công khai, đổi mật khẩu và cập nhật ảnh đại diện giảng dạy
        </Text>
      </div>

      {/* Tabs Card */}
      <Card className="border border-gray-100 rounded-xl shadow-sm">
        <Tabs
          defaultActiveKey="profile"
          items={tabsItems}
          className="custom-settings-tabs"
        />
      </Card>
    </div>
  );
};

export default SettingsPage;
