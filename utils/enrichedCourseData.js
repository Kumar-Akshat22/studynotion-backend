import {secondsToDuration} from "./secondsToDuration.js";

export const enrichCourseData = (course)=>{

    let totalDurationInSeconds = 0;
    course.courseContent.forEach(section => {
        section.subSection.forEach(subsection=>{

            totalDurationInSeconds += parseInt(subsection.timeDuration || 0);
        })
    });

    return secondsToDuration(totalDurationInSeconds);
}