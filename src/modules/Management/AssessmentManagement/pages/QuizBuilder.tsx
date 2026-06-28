import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, InputNumber, Switch, Button, Card, Divider, Radio, Checkbox, Row, Col, Typography, App, Spin } from "antd";
import { Save, Plus, Trash2 } from "lucide-react";
import PageHeader from "@/components/UI/PageHeader";
import { pathRoutes } from "@/constants/routes";
import { useQuizDetail, useCreateQuizMutation, useUpdateQuizMutation } from "../queryHooks/useQuizHooks";
import type { IQuiz, IQuestion, IAnswerOption } from "../types";

const { Title, Text } = Typography;
const { TextArea } = Input;

const QuizBuilder: React.FC = () => {
  const { quizId } = useParams<{ quizId?: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  // Mode state
  const isEditMode = !!quizId;

  // Queries & Mutations
  const { data: quizData, isLoading } = useQuizDetail(quizId || "", isEditMode);
  const createQuizMutation = useCreateQuizMutation();
  const updateQuizMutation = useUpdateQuizMutation(quizId || "");

  // Local state for managing questions list
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  // Load database data into form & state
  useEffect(() => {
    if (isEditMode && quizData) {
      form.setFieldsValue({
        title: quizData.title,
        description: quizData.description,
        timeLimitMinutes: quizData.timeLimitMinutes,
        passingScorePercentage: quizData.passingScorePercentage,
        maxAttempts: quizData.maxAttempts,
        isFinal: quizData.isFinal,
      });
      if (quizData.questions) {
        setQuestions(quizData.questions);
      }
    } else if (!isEditMode) {
      form.resetFields();
      setQuestions([
        {
          questionText: "",
          type: "SINGLE_CHOICE",
          scoreWeight: 10.0,
          options: [
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
          ],
        },
      ]);
    }
  }, [quizData, isEditMode, form]);

  // Handle adding a new question
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        type: "SINGLE_CHOICE",
        scoreWeight: 10.0,
        options: [
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
        ],
      },
    ]);
  };

  // Handle deleting a question
  const handleDeleteQuestion = (qIndex: number) => {
    const newQuestions = questions.filter((_, idx) => idx !== qIndex);
    setQuestions(newQuestions);
  };

  // Handle changing question field values
  const handleQuestionChange = (qIndex: number, field: keyof IQuestion, value: any) => {
    const newQuestions = [...questions];
    if (field === "type") {
      // If changing type, reset all option's isCorrect status to prevent inconsistency
      newQuestions[qIndex].options = newQuestions[qIndex].options.map(opt => ({
        ...opt,
        isCorrect: false,
      }));
    }
    newQuestions[qIndex] = {
      ...newQuestions[qIndex],
      [field]: value,
    };
    setQuestions(newQuestions);
  };

  // Handle adding an option to a question
  const handleAddOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ optionText: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  // Handle deleting an option from a question
  const handleDeleteOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, idx) => idx !== oIndex);
    setQuestions(newQuestions);
  };

  // Handle changing option fields
  const handleOptionChange = (qIndex: number, oIndex: number, field: keyof IAnswerOption, value: any) => {
    const newQuestions = [...questions];
    const question = newQuestions[qIndex];

    if (field === "isCorrect" && value === true && question.type === "SINGLE_CHOICE") {
      // For SINGLE_CHOICE, ensure only one option is checked correct
      question.options = question.options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === oIndex,
      }));
    } else {
      question.options[oIndex] = {
        ...question.options[oIndex],
        [field]: value,
      };
    }
    setQuestions(newQuestions);
  };

  // Validate quiz data before submission
  const validateQuiz = (): boolean => {
    if (questions.length === 0) {
      message.error("Đề thi bắt buộc phải có ít nhất 1 câu hỏi!");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        message.error(`Câu hỏi số ${i + 1} chưa điền nội dung đề bài!`);
        return false;
      }

      if (q.options.length < 2) {
        message.error(`Câu hỏi số ${i + 1} phải có tối thiểu 2 phương án trả lời!`);
        return false;
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].optionText.trim()) {
          message.error(`Phương án thứ ${j + 1} của Câu hỏi số ${i + 1} chưa điền nội dung!`);
          return false;
        }
      }

      const correctCount = q.options.filter(o => o.isCorrect).length;
      if (correctCount === 0) {
        message.error(`Câu hỏi số ${i + 1} chưa chọn đáp án đúng!`);
        return false;
      }

      if (q.type === "SINGLE_CHOICE" && correctCount > 1) {
        message.error(`Câu hỏi số ${i + 1} dạng chọn một không được có nhiều hơn 1 đáp án đúng!`);
        return false;
      }
    }
    return true;
  };

  // Handle form submission
  const handleSave = async (values: any) => {
    if (!validateQuiz()) return;

    const quizPayload: Partial<IQuiz> = {
      title: values.title,
      description: values.description || "",
      timeLimitMinutes: values.timeLimitMinutes,
      passingScorePercentage: values.passingScorePercentage,
      maxAttempts: values.maxAttempts,
      isFinal: values.isFinal || false,
      questions: questions,
    };

    if (isEditMode) {
      updateQuizMutation.mutate(quizPayload, {
        onSuccess: () => navigate(pathRoutes.instructor.assessments),
      });
    } else {
      createQuizMutation.mutate(quizPayload, {
        onSuccess: () => navigate(pathRoutes.instructor.assessments),
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Chỉnh sửa Đề thi" : "Soạn Đề thi mới"}
        subtitle="Biên soạn thông tin, danh sách câu hỏi và phương án đáp án"
        showBackButton={true}
        onBackClick={() => navigate(pathRoutes.instructor.assessments)}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          timeLimitMinutes: 15,
          passingScorePercentage: 50,
          isFinal: false,
        }}
      >
        <Spin spinning={isLoading}>
          <Row gutter={[24, 24]}>
          {/* Cột trái: Cấu hình thông tin chung */}
          <Col xs={24} lg={8}>
            <Card title="Thông tin chung đề thi" className="rounded-xl border border-gray-100 shadow-sm sticky top-6">
              <Form.Item
                label="Tiêu đề đề thi"
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề đề thi!" }]}
              >
                <Input placeholder="Ví dụ: Kiểm tra giữa kỳ Java OOP" />
              </Form.Item>

              <Form.Item label="Mô tả đề thi" name="description">
                <TextArea rows={4} placeholder="Nhập hướng dẫn làm bài hoặc tóm tắt..." />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Thời gian (phút)"
                    name="timeLimitMinutes"
                    rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
                  >
                    <InputNumber min={1} max={180} className="w-full" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Điểm đạt (%)"
                    name="passingScorePercentage"
                    rules={[{ required: true, message: "Vui lòng nhập điểm đạt!" }]}
                  >
                    <InputNumber min={1} max={100} className="w-full" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Số lần làm bài tối đa"
                name="maxAttempts"
                extra="Để trống hoặc điền 0 nếu không giới hạn số lần làm"
              >
                <InputNumber min={0} max={100} className="w-full" placeholder="Không giới hạn" />
              </Form.Item>

              <Form.Item label="Đặt làm bài kiểm tra cuối khóa" name="isFinal" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Divider className="my-4" />

              <Button
                type="primary"
                htmlType="submit"
                icon={<Save size={16} />}
                className="w-full flex items-center justify-center bg-blue-600 rounded-lg h-10 font-bold"
                loading={createQuizMutation.isPending || updateQuizMutation.isPending}
              >
                Lưu đề thi vào ngân hàng
              </Button>
            </Card>
          </Col>

          {/* Cột phải: Soạn thảo câu hỏi */}
          <Col xs={24} lg={16} className="space-y-6">
            <Card
              title={
                <div className="flex justify-between items-center w-full">
                  <span>Danh sách câu hỏi trắc nghiệm</span>
                  <Button
                    type="dashed"
                    onClick={handleAddQuestion}
                    icon={<Plus size={16} />}
                    className="flex items-center text-blue-600 border-blue-600 hover:text-blue-700"
                  >
                    Thêm câu hỏi mới
                  </Button>
                </div>
              }
              className="rounded-xl border border-gray-100 shadow-sm"
            >
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 relative">
                  <div className="absolute top-4 right-4">
                    <Button
                      type="text"
                      danger
                      icon={<Trash2 size={16} />}
                      onClick={() => handleDeleteQuestion(qIdx)}
                      disabled={questions.length === 1}
                    />
                  </div>

                  <Title level={5} className="!mb-4 text-gray-700">Câu hỏi thứ {qIdx + 1}</Title>

                  <Row gutter={16}>
                    <Col span={16}>
                      <Form.Item label="Đề bài câu hỏi" required>
                        <Input
                          value={q.questionText}
                          placeholder="Nhập câu hỏi tại đây..."
                          onChange={(e) => handleQuestionChange(qIdx, "questionText", e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="Kiểu câu hỏi" required>
                        <Radio.Group
                          value={q.type}
                          onChange={(e) => handleQuestionChange(qIdx, "type", e.target.value)}
                          optionType="button"
                          buttonStyle="solid"
                          size="small"
                        >
                          <Radio.Button value="SINGLE_CHOICE">Chọn 1</Radio.Button>
                          <Radio.Button value="MULTI_CHOICE">Chọn nhiều</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item label="Trọng số" required>
                        <InputNumber
                          min={1}
                          max={100}
                          value={q.scoreWeight}
                          onChange={(val) => handleQuestionChange(qIdx, "scoreWeight", val)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className="space-y-3 mt-4">
                    <Text strong className="text-gray-600 text-xs block mb-2 uppercase tracking-wide">
                      Các phương án lựa chọn
                    </Text>

                    {q.options.map((opt, oIdx) => (
                      <Row key={oIdx} gutter={8} align="middle">
                        <Col span={1}>
                          {q.type === "SINGLE_CHOICE" ? (
                            <Radio
                              checked={opt.isCorrect}
                              onChange={(e) => handleOptionChange(qIdx, oIdx, "isCorrect", e.target.checked)}
                            />
                          ) : (
                            <Checkbox
                              checked={opt.isCorrect}
                              onChange={(e) => handleOptionChange(qIdx, oIdx, "isCorrect", e.target.checked)}
                            />
                          )}
                        </Col>
                        <Col span={21}>
                          <Input
                            value={opt.optionText}
                            placeholder={`Nội dung phương án ${oIdx + 1}...`}
                            onChange={(e) => handleOptionChange(qIdx, oIdx, "optionText", e.target.value)}
                          />
                        </Col>
                        <Col span={2}>
                          <Button
                            type="text"
                            danger
                            icon={<Trash2 size={14} />}
                            disabled={q.options.length <= 2}
                            onClick={() => handleDeleteOption(qIdx, oIdx)}
                          />
                        </Col>
                      </Row>
                    ))}

                    <Button
                      type="dashed"
                      size="small"
                      icon={<Plus size={12} />}
                      onClick={() => handleAddOption(qIdx)}
                      className="mt-2 text-xs flex items-center"
                    >
                      Thêm đáp án lựa chọn
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="dashed"
                onClick={handleAddQuestion}
                icon={<Plus size={16} />}
                className="w-full flex items-center justify-center border-dashed border-gray-300 py-6 text-gray-500 rounded-xl hover:text-blue-600 hover:border-blue-600"
              >
                Thêm câu hỏi mới vào đề thi
              </Button>
            </Card>
          </Col>
        </Row>
        </Spin>
      </Form>
    </div>
  );
};

export default QuizBuilder;
