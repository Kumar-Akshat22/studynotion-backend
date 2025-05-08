import { secondsToDuration } from "./secondsToDuration.js";

export function calculateCourseStats(courses) {
  const updatedCourse = courses.map((course) => {
    const enrollmentCount = course.studentsEnrolled?.length || 0;
    const ratings = course.ratingAndReviews?.map((r) => r.rating) || [];
    const avgRating = ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    return {
      ...course, // or use `course` directly if you're already using `.lean()`
      enrollmentCount,
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalRatings: ratings.length,
    };
  });

  return updatedCourse;
}

export function calculateStatsForACourse(course) {
  const enrollmentCount = course.studentsEnrolled?.length || 0;

  const ratings = course.ratingAndReviews?.map((r) => r.rating) || [];
  const avgRating = ratings.length
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

    const totalSections = course?.courseContent?.length || 0;

    let totalLectures = course?.courseContent?.reduce((acc , section)=>{

      return acc+ (section?.subSection?.length || 0);

    }, 0) || 0;

    let totalDurationInSeconds = course?.courseContent?.reduce((acc , section)=>{

      return acc + (section?.subSection?.reduce((subAcc ,  lecture)=>{
        return subAcc + Number(lecture?.timeDuration || 0)
      } , 0) || 0);
    } , 0 ) || 0;

    const totalCourseLength = secondsToDuration(totalDurationInSeconds);

  return {
    ...course,
    enrollmentCount,
    avgRating: parseFloat(avgRating.toFixed(1)),
    totalRatings: ratings.length,
    totalSections,
    totalLectures,
    totalCourseLength

  };
}
