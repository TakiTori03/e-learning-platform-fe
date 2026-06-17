import React, { memo } from "react";
import { useHome } from "../hooks/useHome";
import { useAuthStore } from "@/store/useAuthStore";
import HomeHero from "../components/HomeHero";
import HomeBenefits from "../components/HomeBenefits";
import HomeStats from "../components/HomeStats";
import HomeQuotes from "../components/HomeQuotes";
import MyCourses from "../components/MyCourses";
import PopularCourses from "../components/PopularCourses";
import SubscribeEmail from "../components/SubscribeEmail";
import FeedbackStudent from "../components/FeedbackStudent";
import BlogsSlider from "../components/BlogsSlider";
import { Show } from "@/components/UI/Template";

export const HomePage: React.FC = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const { categories, popularCourses, myCourses, blogs, isLoading, subscribe, isSubscribing } = useHome();

  const handleSubscribe = (email: string) => {
    subscribe(email);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Hero Banner (Visible to both guest and auth users) */}
      <HomeHero />

      {/* Guest only sections */}
      <Show>
        <Show.When isTrue={!isAuth}>
          {/* 2. Benefits of training programs */}
          <HomeBenefits />

          {/* 3. Platform statistics */}
          <HomeStats />

          {/* 4. Founder Quotes & Vision */}
          <HomeQuotes />

          {/* 5. Popular Courses */}
          <div className="container mx-auto px-4 pb-20 max-w-7xl">
            <PopularCourses courses={popularCourses} loading={isLoading} />
          </div>
        </Show.When>
      </Show>

      {/* Logged in only sections */}
      <Show>
        <Show.When isTrue={isAuth}>
          {/* 5. Enrolled Courses */}
          <div className="container mx-auto px-4 py-16 max-w-7xl">
            <MyCourses courses={myCourses} loading={isLoading} />
          </div>
        </Show.When>
      </Show>

      {/* 6. Email newsletter (Visible to both guest and auth users) */}
      <SubscribeEmail onSubscribe={handleSubscribe} isLoading={isSubscribing} />

      {/* 7. Student feedbacks (Visible to both guest and auth users) */}
      <FeedbackStudent />

      {/* 8. Blogs Slider (Visible to both guest and auth users) */}
      <BlogsSlider blogs={blogs} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;
