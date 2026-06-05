import { StudySession } from "@prisma/client";

export function getTotalStudyTime(
    sessions: StudySession[]
) {
    return sessions.reduce(
        (total, session) =>
            total + session.duration,
        0
    );
}

export function getAverageSessionDuration(
    sessions: StudySession[]
) {
    if (sessions.length === 0) {
        return 0;
    }

    return Math.round(
        getTotalStudyTime(sessions) /
        sessions.length
    );
}