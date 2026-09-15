/**
 * Group an array of chats into Today, Yesterday, Previous 7 Days, Older
 * @param {Array} chats
 * @returns {{ today: Array, yesterday: Array, previous7Days: Array, older: Array }}
 */
export function groupChatsByDate(chats) {
  const groups = {
    today: [],
    yesterday: [],
    previous7Days: [],
    older: []
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
  const sevenDaysAgoStart = todayStart - 7 * 24 * 60 * 60 * 1000;

  chats.forEach((chat) => {
    const chatTime = new Date(chat.updatedAt || chat.createdAt).getTime();

    if (chatTime >= todayStart) {
      groups.today.push(chat);
    } else if (chatTime >= yesterdayStart) {
      groups.yesterday.push(chat);
    } else if (chatTime >= sevenDaysAgoStart) {
      groups.previous7Days.push(chat);
    } else {
      groups.older.push(chat);
    }
  });

  return groups;
}

/**
 * Format date nicely for human display
 * @param {string|Date} date
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format relative time (e.g. "2 hours ago")
 */
export function formatRelativeTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const diffSec = Math.floor((new Date().getTime() - d.getTime()) / 1000);

  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return formatDate(date);
}
