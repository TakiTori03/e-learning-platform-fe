export const pathRoutes = {
  // --- 1. LEARNER ROUTES ---
  home: "/",
  authCallback: "/auth-callback",
  courses: "/courses",
  courseDetail: "/courses/:courseId",
  blog: "/blog",
  blogDetail: "/blog-detail/:id",
  startLearning: "/start",
  profile: "/profile",
  viewCart: "/view-cart",
  checkout: "/checkout",
  orderCompleted: "/order-completed",
  contact: "/contact",
  inbox: "/inbox",
  aboutUs: "/about-us",
  social: "/social",
  userProfile: "/user/:userId",

  privacy: "/privacy",
  terms: "/terms",
  cookies: "/cookies",
  accountSettings: "/account-settings",
  purchaseHistory: "/purchase-history",
  wishlist: "/wishlist",
  assignments: "/assignments",
  changePassword: "/change-password",
  paymentHistory: "/payment-history",
  publicProfile: "/publicprofile",
  paymentMethod: "/paymentmethod",

  cartReceipt: "/cart-receipt/:orderId",
  cartInvoice: "/cart-invoice/:orderId",
  resetPassword: "/site/reset-password",
  courseSubscription: "/cart/subscribe/course/:courseId",

  // --- 2. AUTH ---
  authorSignUp: "/author-signup",
  
  // --- 3. PLAYER ---
  pathPlayer: "/path-player",
  quizTake: "/learning/:courseId/quiz/:quizId/take",

  // --- 4. ADMIN ROUTES (Quản trị viên - /admin/*) ---
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    courses: "/admin/courses",
    courseDetail: "/admin/courses/:courseId",
    categories: "/admin/categories",

    users: "/admin/users",
    userPermission: "/admin/users/permission",
    instructorReview: "/admin/instructor-review",

    orders: "/admin/orders",
    transactions: "/admin/transaction",

    discuss: "/admin/discuss",
    reviewsCenter: "/admin/reviews-center",
    report: "/admin/report",
    feedbacks: "/admin/feedbacks/list",

    subscribeEmail: "/admin/subscribe",
    couponTypes: "/admin/marketing/coupon-types",
    coupons: "/admin/marketing/coupons",
    blogList: "/admin/blog",
    blogCategory: "/admin/blog-category",
    blogComments: "/admin/blog-comments",

    settings: "/admin/settings",

    reports: {
      root: "/admin/reports",
      userProgress: "/admin/reports/users-progress",
      userSegment: "/admin/reports/users-segment",
      courseInsights: "/admin/reports/course-insights",
      coursesRevenue: "/admin/reports/courses-revenue",
      instructorsRevenue: "/admin/reports/instructors-revenue",
      cancelledSales: "/admin/reports/cancelled-sales",
      certifications: "/admin/reports/certifications",
      reviewsCenter: "/admin/reports/reviews-center",
    },
  },

  // --- 5. INSTRUCTOR ROUTES (Giảng viên - /author/*) ---
  instructor: {
    root: "/author",
    dashboard: "/author/dashboard",
    welcome: "/author/welcome",
    report: "/author/author-report",

    courses: "/author/courses",
    courseDetail: "/author/courses/:courseId",
    courseNotes: "/author/courses-notes",

    discuss: "/author/discuss",
    assessments: "/author/assessments",
    assessmentBuilder: "/author/assessments/builder/:quizId?",
    blogs: "/author/blogs",

    changePassword: "/author/change-password",
    settings: "/author/settings",
  },
} as const;
