import { useParams, Link } from "react-router-dom";
import { useProfileQueries } from "../hooks/useProfileQueries";
import { Row, Col, Card, Avatar, Tooltip } from "antd";
import {
  GlobalOutlined,
  EditOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  LinkOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import CButton from "@/components/UI/Button";
import LoadingLazy from "@/components/UI/LoadingLazy";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import { For, Show } from "@/components/UI/Template";
import { formatFullName } from "@/utils/format";

const achievementsList = [
  {
    key: "Newbie",
    title: "Newbie",
    image:
      "https://lwfiles.mycourse.app/65ac73296e5c564383a8e28b-public/badges/newbie.png",
    description: "Welcome to the world of endless learning!",
  },
  {
    key: "Intermediate",
    title: "Intermediate",
    image:
      "https://thumb.ac-illust.com/d9/d9577885428afb171e9d09dad899ee1e_t.jpeg",
    description: "Keep pushing forward, you are doing great!",
  },
  {
    key: "Excellence",
    title: "Excellence",
    image: "https://thumbs.dreamstime.com/b/print-235466646.jpg",
    description: "Outstanding efforts and high scores!",
  },
  {
    key: "Legend",
    title: "Legend",
    image:
      "https://static.vecteezy.com/system/resources/previews/033/507/252/non_2x/dragon-cartoon-illustration-isolated-on-white-background-cute-dragon-icon-vector.jpg",
    description: "A legendary figure on our platform!",
  },
];

export const ProfilePage = () => {
  const { id } = useParams<{ id?: string }>();
  const { user, isLoading } = useProfileQueries(id);

  if (isLoading) {
    return <LoadingLazy />;
  }

  const displayRole = user?.role;
  const socials = user?.socials || {};

  const getLanguageLabel = (lang?: string) => {
    if (lang === "en") return "English";
    if (lang === "vi") return "Tiếng Việt";
    return lang || "English";
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Profile Card Header */}
        <Card
          className="shadow-sm border-gray-100 rounded-2xl mb-8 overflow-hidden"
          cover={
            <div className="bg-gradient-to-r from-primary to-blue h-32 md:h-40 w-full" />
          }
        >
          <Row
            gutter={[24, 24]}
            className="relative -mt-20 sm:-mt-24 items-end pb-4"
          >
            <Col
              xs={24}
              sm={6}
              className="text-center sm:text-left flex justify-center sm:block"
            >
              <Avatar
                src={
                  user?.avatar ||
                  "https://cdn.mycourse.app/v3.0.4/images/initial-avatar.jpg"
                }
                size={130}
                className="border-4 border-white shadow-lg bg-white hover:scale-105 transition-all duration-300"
              />
            </Col>
            <Col xs={24} sm={18} className="text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                <div className="w-full">
                  <h1 className="text-2xl md:text-3.5xl font-black text-gray-800 leading-tight">
                    {formatFullName(user)}
                  </h1>
                  <Show>
                    <Show.When isTrue={!!displayRole}>
                      <div className="flex flex-wrap gap-1.5 mt-2 justify-center sm:justify-start">
                        <CTag
                          type={TypeTagEnum.SUCCESS}
                          className="font-bold uppercase tracking-wider text-xs px-3 py-0.5 rounded-full m-0"
                        >
                          {displayRole}
                        </CTag>
                      </div>
                    </Show.When>
                  </Show>
                  <p className="text-gray-500 font-medium text-base mt-2">
                    {user?.headline || "E-Learning Student"}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-slate-500 text-sm">
                    <Show>
                      <Show.When isTrue={!!user?.address}>
                        <span className="flex items-center gap-1">
                          <EnvironmentOutlined /> {user?.address}
                        </span>
                      </Show.When>
                    </Show>
                    <span className="flex items-center gap-1">
                      <MailOutlined /> {user?.email}
                    </span>
                    <Show>
                      <Show.When isTrue={!!user?.phone}>
                        <span className="flex items-center gap-1">
                          <PhoneOutlined /> {user?.phone}
                        </span>
                      </Show.When>
                    </Show>
                  </div>
                </div>
                <Show>
                  <Show.When isTrue={!id}>
                    <div className="xs:w-full sm:w-auto shrink-0">
                      <Link to="/account-settings">
                        <Tooltip title="Chỉnh sửa thông tin cá nhân, ảnh đại diện và mật khẩu">
                          <CButton
                            type="primary"
                            className="rounded-full shadow px-6 flex items-center gap-2 h-10"
                          >
                            <EditOutlined /> Edit Profile
                          </CButton>
                        </Tooltip>
                      </Link>
                    </div>
                  </Show.When>
                </Show>
              </div>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Main Info Columns */}
          <Col xs={24} lg={16}>
            <Card
              className="shadow-sm border-gray-100 rounded-2xl mb-8"
              title={
                <span className="font-bold text-lg text-slate-800">
                  Biography
                </span>
              }
            >
              <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
                {user?.biography ||
                  "No biography shared yet. Introduce yourself to the learners!"}
              </p>
            </Card>

            {/* Achievements Section */}
            <Card
              className="shadow-sm border-gray-100 rounded-2xl mb-8"
              title={
                <span className="font-bold text-lg text-slate-800">
                  Achievements & Badges
                </span>
              }
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <For
                  array={achievementsList}
                  render={(item) => (
                    <Tooltip title={item.description} key={item.key}>
                      <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all duration-300">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-contain mb-3 hover:scale-110 transition-transform"
                        />
                        <div className="font-extrabold text-slate-800 text-sm mb-1">
                          {item.title}
                        </div>
                        <div className="text-slate-400 text-xs leading-relaxed">
                          {item.description}
                        </div>
                      </div>
                    </Tooltip>
                  )}
                />
              </div>
            </Card>
          </Col>

          {/* Socials & Settings */}
          <Col xs={24} lg={8}>
            <Card
              className="shadow-sm border-gray-100 rounded-2xl mb-8"
              title={
                <span className="font-bold text-lg text-slate-800">
                  Social Connections
                </span>
              }
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <FacebookOutlined className="text-blue-600 text-xl" />
                  <span className="text-slate-500 font-medium">Facebook:</span>
                  <span className="text-slate-800 font-bold ml-auto truncate max-w-[150px]">
                    <Show>
                      <Show.When isTrue={!!socials.facebook}>
                        <a
                          href={`https://facebook.com/${socials.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {socials.facebook}
                        </a>
                      </Show.When>
                      <Show.Else>Not Linked</Show.Else>
                    </Show>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <TwitterOutlined className="text-sky-500 text-xl" />
                  <span className="text-slate-500 font-medium">Twitter:</span>
                  <span className="text-slate-800 font-bold ml-auto truncate max-w-[150px]">
                    <Show>
                      <Show.When isTrue={!!socials.twitter}>
                        <a
                          href={`https://twitter.com/${socials.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {socials.twitter}
                        </a>
                      </Show.When>
                      <Show.Else>Not Linked</Show.Else>
                    </Show>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <LinkedinOutlined className="text-blue-700 text-xl" />
                  <span className="text-slate-500 font-medium">LinkedIn:</span>
                  <span className="text-slate-800 font-bold ml-auto truncate max-w-[150px]">
                    <Show>
                      <Show.When isTrue={!!socials.linkedin}>
                        <a
                          href={`https://linkedin.com/in/${socials.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {socials.linkedin}
                        </a>
                      </Show.When>
                      <Show.Else>Not Linked</Show.Else>
                    </Show>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <YoutubeOutlined className="text-red-600 text-xl" />
                  <span className="text-slate-500 font-medium">YouTube:</span>
                  <span className="text-slate-800 font-bold ml-auto truncate max-w-[150px]">
                    <Show>
                      <Show.When isTrue={!!socials.youtube}>
                        <a
                          href={`https://youtube.com/${socials.youtube}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {socials.youtube}
                        </a>
                      </Show.When>
                      <Show.Else>Not Linked</Show.Else>
                    </Show>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <LinkOutlined className="text-slate-600 text-xl" />
                  <span className="text-slate-500 font-medium">Website:</span>
                  <span className="text-slate-800 font-bold ml-auto truncate max-w-[150px]">
                    <Show>
                      <Show.When isTrue={!!socials.website}>
                        <a
                          href={socials.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {socials.website}
                        </a>
                      </Show.When>
                      <Show.Else>Not Linked</Show.Else>
                    </Show>
                  </span>
                </div>
              </div>
            </Card>

            <Card
              className="shadow-sm border-gray-100 rounded-2xl mb-8"
              title={
                <span className="font-bold text-lg text-slate-800">
                  Language Preferences
                </span>
              }
            >
              <div className="flex items-center gap-3 text-slate-700">
                <GlobalOutlined className="text-lg text-blue-600" />
                <span className="font-semibold">Selected Language:</span>
                <span className="ml-auto font-bold uppercase">
                  {getLanguageLabel(user?.language)}
                </span>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProfilePage;
