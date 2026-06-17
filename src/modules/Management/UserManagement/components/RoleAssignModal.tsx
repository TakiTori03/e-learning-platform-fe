import CButton from "@/components/UI/Button";
import CModal from "@/components/UI/Modal";
import CSelect from "@/components/UI/Select";
import { ActionsType, UserRole, UserRoleLabels } from "@/constants/enums";
import { formatFullName } from "@/utils/format";
import { Form, Space, Typography } from "antd";
import React, { useCallback, useEffect } from "react";
import { useAssignRole } from "../queryHooks";
import { useLocalStore } from "../store/useLocalStore";

const { Text } = Typography;

export const RoleAssignModal: React.FC = () => {
  const [form] = Form.useForm();
  const { actionMode, selectedUser, resetStore } = useLocalStore();
  const { mutate: assignRole, isPending: assigningRole } = useAssignRole();

  const isOpen = actionMode === ActionsType.UPDATE && selectedUser !== null;

  useEffect(() => {
    if (isOpen && selectedUser) {
      form.setFieldsValue({ role: selectedUser.role });
    }
  }, [isOpen, selectedUser, form]);

  const handleClose = useCallback(() => {
    resetStore();
    form.resetFields();
  }, [resetStore, form]);

  const handleSubmit = useCallback(
    (values: { role: string }) => {
      if (selectedUser) {
        assignRole(
          { id: selectedUser.id, roleName: values.role },
          {
            onSuccess: () => {
              handleClose();
            },
          }
        );
      }
    },
    [selectedUser, assignRole, handleClose]
  );

  return (
    <CModal
      title={<Text strong className="text-base text-white">Thay đổi vai trò người dùng</Text>}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      forceRender
      width={480}
    >
      {selectedUser && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="pt-4"
        >
          {/* Selected User Info Panel */}
          <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <Text type="secondary" className="text-xs uppercase font-semibold tracking-wider">Người dùng đang chọn</Text>
            <div className="mt-1">
              <Text strong className="text-sm block text-gray-800">
                {formatFullName(selectedUser)}
              </Text>
              <Text className="text-gray-500 text-xs block mt-0.5">{selectedUser.email}</Text>
            </div>
          </div>

          {/* Role Select Form Item */}
          <Form.Item
            name="role"
            label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Chọn vai trò hệ thống mới</span>}
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <CSelect
              id="role"
              placeholder="Chọn vai trò"
              style={{ height: "40px", borderRadius: "8px" }}
              options={Object.values(UserRole).map((role) => ({
                value: role,
                label: `${UserRoleLabels[role as UserRole]} (${role})`,
              }))}
            />
          </Form.Item>

          {/* Dialog Actions */}
          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
            <Space size="middle">
              <CButton
                onClick={handleClose}
                style={{ height: "38px", borderRadius: "8px" }}
              >
                Hủy
              </CButton>
              <CButton
                type="primary"
                htmlType="submit"
                loading={assigningRole}
                style={{
                  height: "38px",
                  borderRadius: "8px",
                  fontWeight: 600,
                }}
              >
                Xác nhận lưu
              </CButton>
            </Space>
          </div>
        </Form>
      )}
    </CModal>
  );
};

export default RoleAssignModal;
