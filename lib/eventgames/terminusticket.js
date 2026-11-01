// AZX Service Time (EventAZXAppleGame*): a "sum to ten" block puzzle. The cargo space is a
// grid of numbered blocks (1-9); drag a box over blocks whose numbers add up to exactly 10 and
// they are cleared for points. A run ends when the 120 s timer runs out or no clearable
// combination is left. Nero's skills help, attendants change the block art, and bigger
// cargo spaces (more, smaller blocks) unlock with your total score.
// Times in the manager are whole seconds; unlock "dates" are days after the event opens.

const num = (v) => Number(v).toLocaleString('en-US');
// "{0} … {1}" placeholders in mission text.
const fill = (s, ...args) => args.reduce((t, a, i) => t.replace(`{${i}}`, a), s);

// The in-game guide (MinigameHelpTipDescTable) for one help-tip group.
function helpGroup(ctx, group) {
  const pages = ctx.table('MinigameHelpTipDescTable').filter((d) => d.group_id === group).sort((a, b) => a.order - b.order)
    .map((d) => ({ title: ctx.plain(d.helptip_title), image: ctx.img(d.helptip_image), text: ctx.plain(d.helptip_description) }));
  return pages.map((p) => ({ title: p.title, pages: [p] }));
}

// What each skill does in play (from the guide; the skill table's own descriptions are flavour text).
const SKILL_EFFECT = {
  DetectNumber: 'Highlights one combination of blocks that adds up to 10.',
  MixNumber: 'Pauses the timer and gives every block on the board a new random number.',
  DestroyNumber: 'Turns all blocks into fish; tap one and it is cleared at once, then the rest change back.',
};

function build(ctx) {
  const m = ctx.table('EventAZXAppleGameManagerTable')[0];
  const boards = ctx.table('EventAZXAppleGameBoardTable').filter((b) => b.group_id === m.board_group_id).sort((a, b) => a.order - b.order);
  const numbers = ctx.table('EventAZXAppleGameNumberTable');
  const chars = ctx.table('EventAZXAppleGameCharacterTable').filter((c) => c.group_id === m.character_group_id).sort((a, b) => a.order - b.order);
  const charById = new Map(chars.map((c) => [c.id, c]));
  const charName = (c) => ctx.plain(c.name_locale_key, c.character_resource);
  const skills = ctx.table('EventAZXAppleGameSkillTable').filter((s) => s.group_id === m.skill_group_id).sort((a, b) => a.order - b.order);
  const skillById = new Map(skills.map((s) => [s.id, s]));
  const skillName = (s) => ctx.plain(s.name_locale_key, s.skill_type);
  const missions = ctx.table('EventAZXAppleGameMissionTable').filter((x) => x.group_id === m.mission_group_id);
  const cutscenes = ctx.table('EventAZXAppleGameCutSceneTable').filter((c) => c.group_id === m.cut_scene_group_id);

  const ranks = [['S', m.s_rank_target_score], ['A', m.a_rank_target_score], ['B', m.b_rank_target_score], ['C', 0]];
  const day = (d) => (d ? `${d} days after the event opens` : 'From the start');

  // A mission's text with its placeholders filled in (skill / attendant names, counts).
  const missionText = (x) => {
    const t = ctx.plain(x.name_locale_key, x.mission_type);
    if (x.mission_type === 'UseSkillCount') return fill(t, `“${skillName(skillById.get(x.mission_condition_id) || {})}”`, x.mission_condition_value);
    if (x.mission_type === 'PlayCharacterCount') return fill(t, charName(charById.get(x.mission_condition_id) || {}), x.mission_condition_value);
    return fill(t, num(x.mission_condition_value));
  };

  return {
    summary: 'Drag over numbered blocks that add up to exactly 10 to clear them. Clear as many as you can before the timer runs out.',
    overview: [
      {
        type: 'facts',
        title: 'A run',
        items: [
          ['Goal', 'Select a rectangle of blocks whose numbers add up to exactly 10; they are cleared and score points.'],
          ['Time limit', `${m.limit_time} s`],
          ['Game over', 'When the timer reaches 0, or when no combination on the board can make 10 any more.'],
          ['Points', `${num(m.block_per_score)} per block cleared (a 4-block clear is worth ${num(4 * m.block_per_score)})`],
          ['Daily reward', [`Score ${num(m.daily_reward_score)} in one run:`, { reward: ctx.reward(m.daily_reward_id) }]],
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
        ],
      },
      {
        type: 'table',
        title: 'Ranks',
        note: 'Rank for a single run. S-rank runs also unlock album photos (see Album).',
        columns: ['Rank', { label: 'Score', num: true }, { label: 'Blocks cleared', num: true }],
        rows: ranks.map(([r, s]) => [{ b: r }, s, Math.ceil(s / m.block_per_score)]),
      },
      {
        type: 'table',
        title: 'Cargo spaces',
        note: 'Larger cargo spaces hold more (smaller) blocks. They unlock as your total score over all runs grows.',
        columns: ['Cargo space', 'Layout', { label: 'Blocks', num: true }, { label: 'Unlocks at total score', num: true }],
        rows: boards.map((b) => [ctx.plain(b.name_locale_key), `${b.horizontal_block_value} × ${b.vertical_block_value}`, b.horizontal_block_value * b.vertical_block_value, b.board_open_score]),
      },
      { type: 'gallery', title: 'Attendants’ blocks', items: chars.map((c) => ({ img: ctx.img(c.block_resource), caption: charName(c) })) },
    ],
    pages: [
      { id: 'guide', title: 'How to play', sections: [{ type: 'help', help: helpGroup(ctx, m.tutorial_id) }] },
      {
        id: 'board',
        title: 'Blocks and numbers',
        sections: [
          {
            type: 'text',
            text: 'Each block shows a number from 1 to 9. A cleared group can be any size as long as the numbers add up to exactly 10 (1 + 9, 2 + 3 + 5, 1 + 1 + 1 + 7 …).',
          },
          ...boards.map((b) => {
            const list = numbers.filter((x) => x.group_id === b.number_group_id).sort((a, c) => a.number - c.number);
            const total = list.reduce((n, x) => n + x.ratio, 0);
            return {
              type: 'table',
              title: ctx.plain(b.name_locale_key),
              note: `How the ${b.horizontal_block_value * b.vertical_block_value} blocks are numbered: each number has a weight and a minimum and maximum count on the board.`,
              columns: [{ label: 'Number', num: true }, { label: 'Share', num: true }, { label: 'At least', num: true }, { label: 'At most', num: true }],
              rows: list.map((x) => [x.number, `${+(100 * x.ratio / total).toFixed(1)}%`, x.min_count, x.max_count]),
            };
          }),
        ],
      },
      {
        id: 'attendants',
        title: 'Attendants',
        count: chars.length,
        summary: 'Pick an attendant before a run. The attendant only changes how the blocks look.',
        sections: [{
          type: 'table',
          columns: ['Attendant', 'Block', 'Available'],
          rows: chars.map((c, i) => [
            { b: charName(c) },
            { img: ctx.img(c.block_resource), size: 'small' },
            c.character_open_date || c.character_open_score
              ? `${day(c.character_open_date)}, then a total score of ${num(c.character_open_score)}${i > 1 ? ` (after ${charName(chars[i - 1])} is unlocked)` : ''}`
              : 'From the start',
          ]),
        }],
      },
      {
        id: 'skills',
        title: 'Nero’s skills',
        count: skills.length,
        summary: 'Skills you can use during a run.',
        sections: [{
          type: 'table',
          note: 'The skill names and descriptions below come from the skill table; the in-game guide pairs the names Cat’s Eye and Feline Flurry the other way round.',
          columns: ['Skill', 'Effect', 'Available'],
          rows: skills.map((s, i) => [
            { img: ctx.img(s.skill_resource), caption: skillName(s), size: 'small' },
            { text: SKILL_EFFECT[s.skill_type] || ctx.plain(s.description_locale_key), sub: ctx.plain(s.description_locale_key) },
            s.skill_open_date || s.skill_open_use_value
              ? `${day(s.skill_open_date)}, then use any skill ${s.skill_open_use_value} time(s)${i > 1 ? ` (after ${skillName(skills[i - 1])} is unlocked)` : ''}`
              : 'From the start',
          ]),
        }],
      },
      {
        id: 'missions',
        title: 'Missions',
        count: missions.length,
        sections: [{
          type: 'table',
          note: 'Scores add up over all runs.',
          columns: ['Mission', 'Reward'],
          rows: missions.map((x) => [missionText(x), { reward: ctx.reward(x.mission_reward_id) }]),
        }],
      },
      {
        id: 'album',
        title: 'Album',
        count: cutscenes.length,
        summary: 'Photos collected by playing each attendant.',
        sections: [{
          type: 'table',
          columns: ['Photo', 'Caption', 'Attendant', 'Requirement'],
          rows: cutscenes.map((c) => {
            const ch = charById.get(c.appeared_condition_id);
            return [
              { img: ctx.img(c.cutscene_resource_image), size: 'large' },
              ctx.plain(c.description_locale_key),
              ch ? charName(ch) : '',
              c.appeared_condition_value ? `Reach S rank ${c.appeared_condition_value} times` : 'Play once',
            ];
          }),
        }],
      },
    ],
  };
}

module.exports = { build };
