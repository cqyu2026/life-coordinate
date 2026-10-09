'use strict';

/* ============================================
   character.js — 人生坐标系 · 角色形象系统
   V2.0 · 步骤11：角色表情/帽子/升级动画
   ============================================ */

/**
 * 设置角色表情（测试页用）
 * @param {string} mood - 表情类型：'curious' | 'excited' | 'thinking' | 'thrilled' | 'done'
 *
 * 调用示例：
 *   setCharacterMood('excited');  // → "😮 有意思！继续继续~"
 */
function setCharacterMood(mood) {
  var avatarEl = document.getElementById('charAvatar');
  var moodEl = document.getElementById('charMood');

  if (!moodEl) return;

  var moods = {
    curious:   { emoji: '🧑‍🚀', text: '🤔 让我看看……这个检测舱好酷！' },
    excited:   { emoji: '🧑‍🚀', text: '😮 有意思！继续继续~' },
    thinking:  { emoji: '🧑‍🚀', text: '🤔 让我想想……' },
    thrilled:  { emoji: '🧑‍🚀', text: '🤩 快了快了！' },
    done:      { emoji: '🧑‍🚀', text: '🎉 太棒了！觉醒了！' }
  };

  var state = moods[mood] || moods.curious;

  if (avatarEl) {
    avatarEl.textContent = state.emoji;
  }
  moodEl.textContent = state.text;
}

/**
 * 播放角色升级动画（完成动画中调用）
 * @param {number} fromLevel - 起始等级
 * @param {number} toLevel   - 目标等级
 *
 * 调用示例：
 *   playLevelUpAnimation(0, 1);
 */
function playLevelUpAnimation(fromLevel, toLevel) {
  var overlay = document.getElementById('completeOverlay');
  if (!overlay) return;

  // 升级图标已经在 showCompleteOverlay 中更新
  // 此函数可扩展为添加额外粒子或音效
  console.log('🎮 角色升级:', 'Lv.' + fromLevel, '→ Lv.' + toLevel, '探索者');
}

/**
 * 设置角色帽子（报告页用）
 * @param {string} careerEmoji - 职业 Emoji（如 "⚖️"）
 *
 * 调用示例：
 *   setCharacterHat('⚖️');
 */
function setCharacterHat(careerEmoji) {
  var hatEl = document.getElementById('heroHat');
  if (!hatEl) return;

  hatEl.textContent = careerEmoji;

  // 添加帽子切换微动效
  hatEl.style.transform = 'scale(1.3)';
  hatEl.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
  setTimeout(function() {
    hatEl.style.transform = 'scale(1)';
  }, 300);
}
