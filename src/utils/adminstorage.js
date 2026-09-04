// ======================================
// ADMIN STORAGE
// LocalStorage Based
// ======================================
//
// IMPORTANT:
// This file works only with data stored in
// the browser's LocalStorage.
//
// It does NOT use Firestore.
//
// ======================================


// ======================================
// SAFE JSON READER
// ======================================

function readJSON(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(
      `Admin: Unable to read "${key}":`,
      error
    );

    return fallback;
  }
}


// ======================================
// SAFE JSON WRITER
// ======================================

function writeJSON(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.error(
      `Admin: Unable to write "${key}":`,
      error
    );

    return false;
  }
}


// ======================================
// SAFE NUMBER
// ======================================

function safeNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}


// ======================================
// NORMALIZE USER
// ======================================

function normalizeUser(user) {
  if (!user || typeof user !== "object") {
    return null;
  }

  const uid =
    user.uid ||
    user.id ||
    user.userId ||
    "";

  if (!uid) {
    return null;
  }

  return {
    ...user,

    // ----------------------------------
    // Identity
    // ----------------------------------

    uid,

    id: uid,

    displayName:
      user.displayName ||
      user.name ||
      user.username ||
      "Unknown User",

    email:
      user.email ||
      "",

    // ----------------------------------
    // Account information
    // ----------------------------------

    createdAt:
      user.createdAt ||
      user.created_at ||
      user.joined ||
      user.registrationDate ||
      null,

    photoURL:
      user.photoURL ||
      user.photoUrl ||
      user.avatar ||
      user.profileImage ||
      "",

    // ----------------------------------
    // Login provider
    // ----------------------------------

    provider:
      user.provider ||
      user.providerId ||
      user.authProvider ||
      "email",

    // ----------------------------------
    // Account status
    // ----------------------------------

    status:
      user.status === "blocked"
        ? "blocked"
        : "active",
  };
}


// ======================================
// GET ALL REGISTERED USERS
// ======================================

export function getAllUsers() {
  const users = readJSON(
    "users",
    []
  );

  if (!Array.isArray(users)) {
    return [];
  }

  return users
    .map(normalizeUser)
    .filter(Boolean);
}


// ======================================
// GET ALL INTERVIEWS
// ======================================

export function getAllInterviews() {
  const users = getAllUsers();

  const interviews = [];

  users.forEach((user) => {
    if (!user.uid) {
      return;
    }

    const history = readJSON(
      `history_${user.uid}`,
      []
    );

    if (!Array.isArray(history)) {
      return;
    }

    history.forEach((item, index) => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return;
      }

      const score = safeNumber(
        item.scorePercentage ??
          item.score ??
          item.percentage ??
          0
      );

      const interviewId =
        item.id ||
        item.interviewId ||
        `${user.uid}-interview-${index}`;

      interviews.push({
        ...item,

        id: interviewId,

        userId:
          item.userId ||
          item.uid ||
          user.uid,

        userName:
          item.userName ||
          item.displayName ||
          user.displayName ||
          "Unknown User",

        email:
          item.email ||
          user.email ||
          "",

        category:
          item.category ||
          item.type ||
          "Unknown",

        scorePercentage: Math.max(
          0,
          Math.min(100, score)
        ),

        completedAt:
          item.completedAt ||
          item.createdAt ||
          item.date ||
          null,
      });
    });
  });

  // Newest first
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
// DASHBOARD STATISTICS
// ======================================

export function getDashboardStats() {
  const users = getAllUsers();
  const interviews = getAllInterviews();

  const totalUsers =
    users.length;

  const totalInterviews =
    interviews.length;

  const averageScore =
    totalInterviews === 0
      ? 0
      : Math.round(
          interviews.reduce(
            (sum, interview) =>
              sum +
              safeNumber(
                interview.scorePercentage
              ),
            0
          ) / totalInterviews
        );

  // ------------------------------------
  // Highest scoring interview
  // ------------------------------------

  const topInterview =
    interviews.length > 0
      ? interviews.reduce(
          (best, current) => {
            return safeNumber(
              current.scorePercentage
            ) >
              safeNumber(
                best.scorePercentage
              )
              ? current
              : best;
          }
        )
      : null;

  // ------------------------------------
  // Active / blocked users
  // ------------------------------------

  const activeUsers =
    users.filter(
      (user) =>
        user.status === "active"
    ).length;

  const blockedUsers =
    users.filter(
      (user) =>
        user.status === "blocked"
    ).length;

  return {
    totalUsers,

    totalInterviews,

    averageScore,

    activeUsers,

    blockedUsers,

    topPerformer: topInterview
      ? {
          name:
            topInterview.userName ||
            "Unknown User",

          email:
            topInterview.email ||
            "",

          score:
            safeNumber(
              topInterview.scorePercentage
            ),
        }
      : {
          name: "No Data",
          email: "",
          score: 0,
        },
  };
}


// ======================================
// USER PERFORMANCE
// ======================================

export function getUserPerformance() {
  const users = getAllUsers();

  const interviews =
    getAllInterviews();

  return users.map((user) => {
    const userInterviews =
      interviews.filter(
        (interview) =>
          interview.userId ===
          user.uid
      );

    const totalInterviews =
      userInterviews.length;

    const scores =
      userInterviews.map(
        (interview) =>
          safeNumber(
            interview.scorePercentage
          )
      );

    const averageScore =
      totalInterviews === 0
        ? 0
        : Math.round(
            scores.reduce(
              (sum, score) =>
                sum + score,
              0
            ) /
              totalInterviews
          );

    const highestScore =
      totalInterviews === 0
        ? 0
        : Math.max(...scores);

    const lowestScore =
      totalInterviews === 0
        ? 0
        : Math.min(...scores);

    return {
      // Identity
      id: user.uid,
      uid: user.uid,

      name:
        user.displayName ||
        "Unknown User",

      email:
        user.email ||
        "",

      // Account
      joined:
        user.createdAt ||
        null,

      createdAt:
        user.createdAt ||
        null,

      photoURL:
        user.photoURL ||
        "",

      provider:
        user.provider ||
        "email",

      status:
        user.status ||
        "active",

      // Performance
      interviews:
        totalInterviews,

      average:
        averageScore,

      best:
        highestScore,

      lowest:
        lowestScore,
    };
  });
}


// ======================================
// CATEGORY STATISTICS
// ======================================

export function getCategoryStatistics() {
  const interviews =
    getAllInterviews();

  const result = {};

  interviews.forEach((interview) => {
    const category =
      interview.category ||
      "Unknown";

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
// SCORE DISTRIBUTION
// ======================================

export function getScoreDistribution() {
  const interviews =
    getAllInterviews();

  let excellent = 0;
  let good = 0;
  let average = 0;
  let poor = 0;

  interviews.forEach((interview) => {
    const score =
      safeNumber(
        interview.scorePercentage
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


// ======================================
// SCORE PERFORMANCE COLOR
// ======================================
//
// Useful for Admin.jsx.
//
// 90-100 = Excellent
// 75-89  = Good
// 50-74  = Average
// 0-49   = Poor
//
// ======================================

export function getPerformanceLevel(
  score
) {
  const value =
    safeNumber(score);

  if (value >= 90) {
    return "excellent";
  }

  if (value >= 75) {
    return "good";
  }

  if (value >= 50) {
    return "average";
  }

  return "poor";
}


// ======================================
// RECENT INTERVIEWS
// ======================================

export function getRecentInterviews(
  limit = 10
) {
  const safeLimit = Math.max(
    1,
    Number(limit) || 10
  );

  return getAllInterviews().slice(
    0,
    safeLimit
  );
}


// ======================================
// GET USER BY UID
// ======================================

export function getUserById(uid) {
  if (!uid) {
    return null;
  }

  return (
    getAllUsers().find(
      (user) =>
        user.uid === uid
    ) || null
  );
}


// ======================================
// GET USER INTERVIEWS
// ======================================

export function getUserInterviews(uid) {
  if (!uid) {
    return [];
  }

  return getAllInterviews().filter(
    (interview) =>
      interview.userId === uid
  );
}


// ======================================
// GET COMPLETE USER DETAILS
// ======================================
//
// Gives Admin.jsx one complete object
// for the user details modal.
//
// ======================================

export function getUserDetails(uid) {
  const user =
    getUserById(uid);

  if (!user) {
    return null;
  }

  const interviews =
    getUserInterviews(uid);

  const scores =
    interviews.map(
      (interview) =>
        safeNumber(
          interview.scorePercentage
        )
    );

  const totalInterviews =
    interviews.length;

  const averageScore =
    totalInterviews === 0
      ? 0
      : Math.round(
          scores.reduce(
            (sum, score) =>
              sum + score,
            0
          ) /
            totalInterviews
        );

  const bestScore =
    totalInterviews === 0
      ? 0
      : Math.max(...scores);

  return {
    ...user,

    totalInterviews,

    averageScore,

    bestScore,

    interviews,
  };
}


// ======================================
// UPDATE USER STATUS
// ======================================

export function updateUserStatus(
  uid,
  status
) {
  if (!uid) {
    return false;
  }

  const allowedStatuses = [
    "active",
    "blocked",
  ];

  if (
    !allowedStatuses.includes(
      status
    )
  ) {
    return false;
  }

  const users =
    readJSON("users", []);

  if (!Array.isArray(users)) {
    return false;
  }

  let found = false;

  const updatedUsers =
    users.map((user) => {
      const userId =
        user?.uid ||
        user?.id ||
        user?.userId;

      if (userId !== uid) {
        return user;
      }

      found = true;

      return {
        ...user,
        status,
      };
    });

  if (!found) {
    return false;
  }

  return writeJSON(
    "users",
    updatedUsers
  );
}


// ======================================
// BLOCK USER
// ======================================

export function blockUser(uid) {
  return updateUserStatus(
    uid,
    "blocked"
  );
}


// ======================================
// UNBLOCK USER
// ======================================

export function unblockUser(uid) {
  return updateUserStatus(
    uid,
    "active"
  );
}


// ======================================
// DELETE USER
// ======================================
//
// Deletes:
// 1. User from users
// 2. User interview history
//
// ======================================

export function deleteUser(uid) {
  if (!uid) {
    return false;
  }

  const users =
    readJSON("users", []);

  if (!Array.isArray(users)) {
    return false;
  }

  const userExists =
    users.some((user) => {
      const userId =
        user?.uid ||
        user?.id ||
        user?.userId;

      return userId === uid;
    });

  if (!userExists) {
    return false;
  }

  const updatedUsers =
    users.filter((user) => {
      const userId =
        user?.uid ||
        user?.id ||
        user?.userId;

      return userId !== uid;
    });

  const saved =
    writeJSON(
      "users",
      updatedUsers
    );

  if (!saved) {
    return false;
  }

  // Delete interview history
  try {
    localStorage.removeItem(
      `history_${uid}`
    );
  } catch (error) {
    console.error(
      "Admin: Unable to delete interview history:",
      error
    );
  }

  return true;
}


// ======================================
// GET TOTAL USERS
// ======================================

export function getTotalUsers() {
  return getAllUsers().length;
}


// ======================================
// GET TOTAL INTERVIEWS
// ======================================

export function getTotalInterviews() {
  return getAllInterviews().length;
}


// ======================================
// GET ACTIVE USERS
// ======================================

export function getActiveUsers() {
  return getAllUsers().filter(
    (user) =>
      user.status === "active"
  );
}


// ======================================
// GET BLOCKED USERS
// ======================================

export function getBlockedUsers() {
  return getAllUsers().filter(
    (user) =>
      user.status === "blocked"
  );
}


// ======================================
// CHECK IF USER IS BLOCKED
// ======================================

export function isUserBlocked(uid) {
  if (!uid) {
    return false;
  }

  const user =
    getUserById(uid);

  return (
    user?.status ===
    "blocked"
  );
}


// ======================================
// SEARCH USERS
// ======================================
//
// Search by:
// - Name
// - Email
// - UID
//
// ======================================

export function searchUsers(
  searchText = ""
) {
  const text =
    String(searchText)
      .toLowerCase()
      .trim();

  if (!text) {
    return getAllUsers();
  }

  return getAllUsers().filter(
    (user) => {
      const name =
        String(
          user.displayName || ""
        ).toLowerCase();

      const email =
        String(
          user.email || ""
        ).toLowerCase();

      const uid =
        String(
          user.uid || ""
        ).toLowerCase();

      return (
        name.includes(text) ||
        email.includes(text) ||
        uid.includes(text)
      );
    }
  );
}


// ======================================
// CLEAR USER INTERVIEW HISTORY
// ======================================

export function clearUserHistory(
  uid
) {
  if (!uid) {
    return false;
  }

  try {
    localStorage.removeItem(
      `history_${uid}`
    );

    return true;
  } catch (error) {
    console.error(
      "Admin: Unable to clear user history:",
      error
    );

    return false;
  }
}


// ======================================
// REFRESH ADMIN DATA EVENT
// ======================================
//
// Useful if Admin.jsx wants to notify
// other components that data changed.
//
// ======================================

export function notifyAdminDataChanged() {
  try {
    window.dispatchEvent(
      new Event(
        "adminDataChanged"
      )
    );
  } catch (error) {
    console.error(
      "Admin: Unable to dispatch update event:",
      error
    );
  }
}