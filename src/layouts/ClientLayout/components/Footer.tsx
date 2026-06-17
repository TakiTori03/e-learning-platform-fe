import React from "react";
import {
  FacebookOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Layout, Space, Typography, Row, Col, Divider } from "antd";
import { Link } from "react-router-dom";
import logo from "@/assets/images/e-learning-logo.svg";

// UI Wrappers & Template Control
import CButton from "@/components/UI/Button";
import CInput from "@/components/UI/Input";

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph } = Typography;

export const Footer: React.FC = React.memo(() => {
  const footerLinkStyle: React.CSSProperties = {
    color: "rgba(255, 255, 255, 0.45)",
    transition: "color 0.3s",
    display: "block",
    marginBottom: "12px",
  };

  const socialIconStyle: React.CSSProperties = {
    width: "38px",
    height: "38px",
    borderRadius: "19px",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
    color: "#fff",
  };

  return (
    <AntFooter
      style={{
        backgroundColor: "#0b1329", // Sleek modern dark blue background
        padding: "80px 24px 40px",
        color: "rgba(255, 255, 255, 0.65)",
      }}
    >
      <div className="container mx-auto">
        <Row gutter={[48, 48]}>
          {/* COLUMN 1: LOGO & ABOUT */}
          <Col xs={24} md={10} lg={7}>
            <div style={{ marginBottom: 24 }}>
              <img
                src={logo}
                alt="Logo"
                style={{ height: "42px", filter: "brightness(2)" }}
              />
            </div>
            <Paragraph
              style={{
                color: "rgba(255, 255, 255, 0.45)",
                fontSize: "14px",
                lineHeight: "1.8",
                marginBottom: 24,
              }}
            >
              Học tập chuyên nghiệp, tương tác lớp học thực tế và giáo trình đạt
              chuẩn quốc tế. Hệ thống quản lý học tập thế hệ mới giúp bạn nâng
              cấp kỹ năng nhanh chóng.
            </Paragraph>
            <Space size={16}>
              <a href="#" style={socialIconStyle} className="hover:bg-blue-600 hover:scale-110">
                <FacebookOutlined />
              </a>
              <a href="#" style={socialIconStyle} className="hover:bg-red-600 hover:scale-110">
                <YoutubeOutlined />
              </a>
              <a href="#" style={socialIconStyle} className="hover:bg-blue-700 hover:scale-110">
                <LinkedinOutlined />
              </a>
            </Space>
          </Col>

          {/* COLUMN 2: EXPLORE */}
          <Col xs={12} md={7} lg={4}>
            <Title level={5} style={{ color: "#fff", marginBottom: 24 }}>
              Explore
            </Title>
            <nav>
              <Link
                to="/courses"
                style={footerLinkStyle}
                className="hover:text-white"
              >
                Courses
              </Link>
              <Link
                to="/blog"
                style={footerLinkStyle}
                className="hover:text-white"
              >
                Blog
              </Link>
              <Link
                to="/about-us"
                style={footerLinkStyle}
                className="hover:text-white"
              >
                About us
              </Link>
              <Link
                to="/mentors"
                style={footerLinkStyle}
                className="hover:text-white"
              >
                Success Story
              </Link>
            </nav>
          </Col>

          {/* COLUMN 3: SUPPORT */}
          <Col xs={12} md={7} lg={4}>
            <Title level={5} style={{ color: "#fff", marginBottom: 24 }}>
              Support
            </Title>
            <nav>
              <Link
                to="/contact"
                style={footerLinkStyle}
                className="hover:text-white"
              >
                Contact
              </Link>
              <Link
                to="/privacy"
                style={footerLinkStyle}
                className="hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                style={footerLinkStyle}
                className="hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                style={footerLinkStyle}
                className="hover:text-white"
              >
                Cookies Policy
              </Link>
            </nav>
          </Col>

          {/* COLUMN 4: SUBSCRIBE */}
          <Col xs={24} lg={9}>
            <Title level={5} style={{ color: "#fff", marginBottom: 24 }}>
              Subscribe
            </Title>
            <Paragraph
              style={{ color: "rgba(255, 255, 255, 0.45)", marginBottom: 24 }}
            >
              Đăng ký để nhận thông báo về các khóa học mới nhất và các chương
              trình khuyến mãi đặc biệt.
            </Paragraph>
            <Space.Compact style={{ width: "100%" }}>
              <CInput
                placeholder="Enter your email"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  color: "#fff",
                  height: "48px",
                  borderRadius: "8px 0 0 8px",
                }}
              />
              <CButton
                type="primary"
                icon={<SendOutlined />}
                style={{
                  height: "48px",
                  padding: "0 24px",
                  borderRadius: "0 8px 8px 0",
                  fontWeight: "bold",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  border: "none",
                }}
                className="transition-transform hover:brightness-110 font-bold"
              >
                Subscribe
              </CButton>
            </Space.Compact>
          </Col>
        </Row>

        <Divider
          style={{
            borderColor: "rgba(255, 255, 255, 0.08)",
            margin: "48px 0 32px",
          }}
        />

        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Text
              style={{ color: "rgba(255, 255, 255, 0.35)", fontSize: "12px" }}
            >
              © 2026 E-Learning App. All rights reserved.
            </Text>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: "right" }}>
            <Text
              style={{ color: "rgba(255, 255, 255, 0.35)", fontSize: "12px" }}
            >
              Built with precision for the modern learner.
            </Text>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
});

export default Footer;
