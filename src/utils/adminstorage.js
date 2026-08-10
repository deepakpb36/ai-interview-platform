
export function getAllUsers() {
  try {
    const users = JSON.parse(
      localStorage.getItem("users")
    );

    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Admin: Unable to read users:", error);
    return [];
  }
}

// ======================================
// Get All Interviews
// ======================================

export function getAllInterviews() {
  const users = getAllUsers();

  const interviews = [];

  users.forEach((user) => {
    if (!user || !user.uid) {
      return;
    }

    try {
      const history = JSON.parse(
        localStorage.getItem(`history_${user.uid}`)
      );

      if (!Array.isArray(history)) {
        return;
      }

      history.forEach((item) => {
        if (!item || typeof item !== "object") {
          return;
        }

        interviews.push({
          ...item,

          userId:
            item.userId || user.uid,

          userName:
            item.userName ||
            user.displayName ||
            "Unknown User",

          email:
            item.email ||
            user.email ||
            "",

          scorePercentage:
            Number(
              item.scorePercentage || 0
            ),

          category:
            item.category || "Unknown",

          completedAt:
            item.completedAt ||
            null,
        });
      });
    } catch (error) {
      console.error(
        `Admin: Unable to read history for ${user.uid}:`,
        error
      );
    }
  });

  interviews.sort((a, b) => {
    const dateA = a.completedAt
      ? new Date(a.completedAt).getTime()
      : 0;

    const dateB = b.completedAt
      ? new Date(b.completedAt).getTime()
      : 0;

    return dateB - dateA;
  });

  return interviews;
}

// ======================================
// Dashboard Statistics
// ======================================

export function getDashboardStats() {
  const users = getAllUsers();
  const interviews = getAllInterviews();

  const totalUsers = users.length;

  const totalInterviews = interviews.length;

  const averageScore =
    totalInterviews === 0
      ? 0
      : Math.round(
          interviews.reduce(
            (sum, item) =>
              sum +
              Number(
                item.scorePercentage || 0
              ),
            0
          ) / totalInterviews
        );

  const topInterview =
    totalInterviews === 0
      ? null
      : interviews.reduce(
          (best, current) => {
            return Number(
              current.scorePercentage || 0
            ) >
              Number(
                best.scorePercentage || 0
              )
              ? current
              : best;
          }
        );

  return {
    totalUsers,

    totalInterviews,

    averageScore,

    topPerformer: topInterview
      ? {
          name:
            topInterview.userName,

          score:
            Number(
              topInterview.scorePercentage ||
                0
            ),
        }
      : {
          name: "No Data",
          score: 0,
        },
  };
}

// ======================================
// User Performance
// ======================================

export function getUserPerformance() {
  const users = getAllUsers();

  const interviews = getAllInterviews();

  return users.map((user) => {
    const userInterviews =
      interviews.filter(
        (item) =>
          item.userId === user.uid
      );

    const totalInterviews =
      userInterviews.length;

    const averageScore =
      totalInterviews === 0
        ? 0
        : Math.round(
            userInterviews.reduce(
              (sum, item) =>
                sum +
                Number(
                  item.scorePercentage ||
                    0
                ),
              0
            ) / totalInterviews
          );

    const highestScore =
      totalInterviews === 0
        ? 0
        : Math.max(
            ...userInterviews.map(
              (item) =>
                Number(
                  item.scorePercentage ||
                    0
                )
            )
          );

    return {
      id: user.uid,

      name:
        user.displayName ||
        "Unknown User",

      email:
        user.email || "",

      joined:
        user.createdAt || null,

      interviews:
        totalInterviews,

      average:
        averageScore,

      best:
        highestScore,
    };
  });
}

// ======================================
// Category Statistics
// ======================================

export function getCategoryStatistics() {
  const interviews = getAllInterviews();

  const result = {};

  interviews.forEach((item) => {
    const category =
      item.category || "Unknown";

    result[category] =
      (result[category] || 0) + 1;
  });

  return {
    labels:
      Object.keys(result),

    data:
      Object.values(result),
  };
}

// ======================================
// Score Distribution
// ======================================

export function getScoreDistribution() {
  const interviews = getAllInterviews();

  let excellent = 0;
  let good = 0;
  let average = 0;
  let poor = 0;

  interviews.forEach((item) => {
    const score = Number(
      item.scorePercentage || 0
    );

    if (score >= 90) {
      excellent++;
    } else if (score >= 75) {
      good++;
    } else if (score >= 50) {
      average++;
    } else {
      poor++;
    }
  });

  return {
    labels: [
      "Excellent",
      "Good",
      "Average",
      "Poor",
    ],

    data: [
      excellent,
      good,
      average,
      poor,
    ],
  };
}



export function getRecentInterviews(
  limit = 10
) {
  return getAllInterviews()
    .slice(0, limit);
}

