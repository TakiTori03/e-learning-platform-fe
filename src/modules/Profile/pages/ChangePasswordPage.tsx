import { memo, useCallback } from "react";
import { Form, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, KeyRound, ArrowLeft, Lock } from "lucide-react";
import { CInputPassword } from "@/components/UI/Input";
import CButton from "@/components/UI/Button";
import { useProfileQueries } from "../hooks/useProfileQueries";

interface IChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PASSWORD_RULES = {
  minLength: 6,
  maxLength: 50,
};

const ChangePasswordPage = () => {
  const [form] = Form.useForm<IChangePasswordForm>();
  const navigate = useNavigate();
  const { changePassword, isUpdating } =
    useProfileQueries();

  const handleSubmit = useCallback(
    async (values: IChangePasswordForm) => {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      form.resetFields();
    },
    [changePassword, form]
  );

  const handleGoBack = useCallback(() => {
    navigate("/account-settings");
  }, [navigate]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 md:px-8">
      <div className="container mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Quay lại cài đặt</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShieldCheck size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Đổi mật khẩu
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Cập nhật mật khẩu để bảo vệ tài khoản của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-sm border-gray-100 rounded-2xl">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            autoComplete="off"
          >
            {/* Mật khẩu hiện tại */}
            <Form.Item
              name="oldPassword"
              label={
                <span className="font-semibold text-slate-700">
                  Mật khẩu hiện tại
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu hiện tại!",
                },
              ]}
            >
              <CInputPassword
                id="oldPassword"
                className="rounded-lg h-11"
                placeholder="Nhập mật khẩu hiện tại"
                prefix={<Lock size={16} className="text-slate-400" />}
              />
            </Form.Item>

            {/* Mật khẩu mới */}
            <Form.Item
              name="newPassword"
              label={
                <span className="font-semibold text-slate-700">
                  Mật khẩu mới
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu mới!",
                },
                {
                  min: PASSWORD_RULES.minLength,
                  message: `Mật khẩu phải có ít nhất ${PASSWORD_RULES.minLength} ký tự!`,
                },
                {
                  max: PASSWORD_RULES.maxLength,
                  message: `Mật khẩu không được vượt quá ${PASSWORD_RULES.maxLength} ký tự!`,
                },
              ]}
              hasFeedback
            >
              <CInputPassword
                id="newPassword"
                className="rounded-lg h-11"
                placeholder="Nhập mật khẩu mới"
                prefix={<KeyRound size={16} className="text-slate-400" />}
              />
            </Form.Item>

            {/* Xác nhận mật khẩu mới */}
            <Form.Item
              name="confirmPassword"
              label={
                <span className="font-semibold text-slate-700">
                  Xác nhận mật khẩu mới
                </span>
              }
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận mật khẩu mới!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <CInputPassword
                id="confirmPassword"
                className="rounded-lg h-11"
                placeholder="Nhập lại mật khẩu mới"
                prefix={<KeyRound size={16} className="text-slate-400" />}
              />
            </Form.Item>

            {/* Gợi ý bảo mật */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                💡 Gợi ý tạo mật khẩu an toàn
              </h4>
              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                <li>Sử dụng ít nhất {PASSWORD_RULES.minLength} ký tự</li>
                <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                <li>Không sử dụng thông tin cá nhân dễ đoán</li>
                <li>Không trùng với mật khẩu đã dùng trước đó</li>
              </ul>
            </div>

            {/* Buttons */}
            <Form.Item className="mb-0">
              <div className="flex gap-3">
                <CButton
                  type="primary"
                  htmlType="submit"
                  loading={isUpdating}
                  className="rounded-lg h-11 px-8 font-semibold flex-1"
                  id="btn-change-password"
                >
                  Đổi mật khẩu
                </CButton>
                <CButton
                  className="rounded-lg h-11 px-6 font-semibold"
                  onClick={handleGoBack}
                  id="btn-cancel-change-password"
                >
                  Hủy
                </CButton>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default memo(ChangePasswordPage);
