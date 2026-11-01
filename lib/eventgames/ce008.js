// Lyco Reco Beats (EventLycorisMiniGame*, the Lycoris Recoil collab): a one-button rhythm game.
// Each stage is a different scene (dodging Takina's training shots, rhythmic VR shooting, making
// desserts) where you tap on the beat. Stages come in Normal and Hard; Hard stages can be played
// with osu!-style mods for a score bonus. Stamps earned by clearing stages level up three
// "talents" that make the game easier. The tables carry no Locale_ keys: their text keys live
// in the Locale_Lycoris namespace. Timing windows are in milliseconds (assumed).

const num = (v) => Number(v).toLocaleString('en-US');
const fill = (s, ...args) => args.reduce((t, a, i) => t.replace(`{${i}}`, a), s);

// Which gameplay each stage uses (guide_key) and the guide lines that explain it.
const STYLE = {
  Guide2: { name: 'Dodge training', keys: ['guide_info2_1_1', 'guide_info2_1_2', 'guide_info2_1_3', 'guide_info2_2_1', 'guide_info2_2_2', 'guide_info2_3_1', 'guide_info2_3_2', 'guide_info2_3_3'] },
  Guide3: { name: 'Rhythmic shooting', keys: ['guide_info3_1_1', 'guide_info3_1_2'] },
  Guide4: { name: 'Dessert making', keys: ['guide_info4_1_1', 'guide_info4_1_2', 'guide_info4_2_1'] },
};
const TALENT_STAMP = { core: 'Limited Dessert Stamp', money: 'Coffee Stamp' };

function build(ctx) {
  const L = (key, fallback = '') => (key ? ctx.plain(`Locale_Lycoris:${key}`, fallback) : fallback);
  const m = ctx.table('EventLycorisMiniGameManagerTable')[0];
  const stars = new Map(ctx.table('EventLycorisMiniGame3StarTable').map((s) => [s.id, s]));
  const develop = ctx.table('EventLycorisMiniGameDevelopTable');
  const diffs = new Map(ctx.table('EventLycorisMiniGameDifficultyTable').map((d) => [d.difficulty, d]));
  const entries = ctx.table('EventLycorisMiniGameEntryTable').sort((a, b) => a.id - b.id);
  const hp = ctx.table('EventLycorisMiniGameHPConstTable')[0] || {};
  const missions = ctx.table('EventLycorisMiniGameMissionTable').sort((a, b) => a.id - b.id);
  const missionById = new Map(missions.map((x) => [x.id, x]));
  const tasks = ctx.table('EventLycorisMiniGameTaskTable');
  const stamp = (k) => L(k === 'core' ? 'lycoris_develop_material_1' : 'lycoris_develop_material_2', TALENT_STAMP[k]);

  const starText = (id) => {
    const s = stars.get(id);
    return s ? fill(L(s.condition_desc, s.condition_type), s.condition_value) : '';
  };
  const stageName = (x) => L(x?.name, `Stage ${x?.id}`);
  const stageGroup = (x) => Math.floor(x.difficulty / 100);
  const level = (x) => x.difficulty % 100;
  const lives = (v) => +(v / hp.misshp).toFixed(1);

  // The 15 difficulty levels of one stage: timing windows and points per judgement.
  const diffTable = (x) => {
    const g = stageGroup(x);
    const rows = [...diffs.values()].filter((d) => Math.floor(d.difficulty / 100) === g).sort((a, b) => a.difficulty - b.difficulty);
    return {
      type: 'table',
      title: `${stageName(x)}: difficulty levels`,
      note: `The stage plays at level ${level(x)}. Easy Mode lowers the level and the Hard Rock mod raises it (by ${entries.find((e) => e.entry_type === 'HardRock')?.entry_value ?? '?'} levels, judging by its value). Windows are how far off the beat a tap may be for each judgement.`,
      columns: [{ label: 'Level', num: true }, { label: 'Perfect', num: true }, { label: 'Great', num: true }, { label: 'Good', num: true }, { label: 'Bad', num: true }],
      rows: rows.map((d) => [d.difficulty % 100 === level(x) ? { b: d.difficulty % 100 } : d.difficulty % 100, `${d.perfect_period} ms`, `${d.great_period} ms`, `${d.good_period} ms`, `${d.bad_period} ms`]),
    };
  };

  const talents = ['SkillOne', 'SkillTwo', 'SkillThree'].map((g) => develop.filter((d) => d.group === g).sort((a, b) => a.developlevel - b.developlevel));
  const taskText = (t) => L(t.name, t.trigger_type);

  const normal = missions.filter((x) => x.mission_type === 'Normal');
  const hard = missions.filter((x) => x.mission_type !== 'Normal');
  const base = diffs.get(missions[0]?.difficulty) || {};

  return {
    summary: 'A one-button rhythm game: tap on the beat to dodge, shoot and decorate desserts. Clear stages for stamps that level up talents, then take on Hard stages with score-boosting mods.',
    overview: [
      {
        type: 'facts',
        title: 'How to play',
        items: [
          ['Controls', L('lycoris_guide_desc_1_3', 'Tap anywhere on the beat (Space on PC).')],
          ['Life', `${hp.inithp} life (${lives(hp.inithp)} misses); each miss costs ${hp.misshp}. Every ${hp.combocount} combo restores ${hp.recoveryrate}. At 0 the stage fails.`],
          ['Points', `Perfect ${base.perfect_score}, Great ${base.great_score}, Good ${base.good_score}, Miss ${base.miss_score} on the first stage; some stages pay less (see Timing windows)`],
          ['Stars', 'Each stage has three star conditions (see Stages).'],
          ['Stages', L('lycoris_guide_desc_3_2', '')],
          ['Talents', `${L('lycoris_guide_desc_2_2')} ${L('lycoris_guide_desc_2_3')}`],
          ['Union Scores', L('lycoris_guide_desc_5_2')],
          ['Daily reward', ['Play once a day:', { reward: ctx.reward(m?.daily_reward_id) }]],
        ],
      },
      {
        type: 'table',
        title: 'Hard Mode mods',
        note: 'Mods can be switched on for Hard stages; each adds its bonus to the points you score.',
        columns: ['Mod', 'Effect', 'Score bonus'],
        rows: entries.map((e) => [{ b: L(e.name, e.entry_type) }, L(e.desc), `+${e.addition}%`]),
      },
    ],
    pages: [
      {
        id: 'guide',
        title: 'Game guide',
        sections: [
          { type: 'list', title: L('lycoris_guide_title1', 'Lyco Reco Beats'), items: ['lycoris_guide_desc_1_1', 'lycoris_guide_desc_1_2', 'lycoris_guide_desc_1_3'].map((k) => L(k)).filter(Boolean) },
          ...Object.values(STYLE).map((st) => ({ type: 'list', title: st.name, items: st.keys.map((k) => L(`lycoris_${k}`)).filter(Boolean) })),
          { type: 'list', title: L('lycoris_guide_title2', 'Talents'), items: ['lycoris_guide_desc_2_1', 'lycoris_guide_desc_2_2', 'lycoris_guide_desc_2_3'].map((k) => L(k)).filter(Boolean) },
          { type: 'list', title: L('lycoris_guide_title4', 'Mods'), items: ['lycoris_guide_desc_4_1', 'lycoris_guide_desc_4_2', 'lycoris_guide_desc_4_3'].map((k) => L(k)).filter(Boolean) },
          { type: 'list', title: L('lycoris_guide_title5', 'Union Scores'), items: ['lycoris_guide_desc_5_1', 'lycoris_guide_desc_5_2', 'lycoris_guide_desc_5_3'].map((k) => L(k)).filter(Boolean) },
        ],
      },
      {
        id: 'stages',
        title: 'Stages',
        count: missions.length,
        sections: [{
          type: 'table',
          note: `Rewards are stamps for talents: ${stamp('core')}s on the first clear, ${stamp('money')}s on every clear. Hard stages allow mods.`,
          columns: ['Stage', 'Gameplay', 'Opens', 'First clear', 'Every clear', 'Stars'],
          rows: missions.map((x) => [
            { b: stageName(x) },
            STYLE[x.guide_key]?.name || '',
            [ctx.date(x.stage_open_date), x.stage_open_cleared_mission ? `after ${stageName(missionById.get(x.stage_open_cleared_mission))}` : null].filter(Boolean),
            x.first_clear_reward ? `${x.first_clear_reward} × ${stamp('core')}` : '—',
            `${x.second_clear_reward} × ${stamp('money')}`,
            x._3star.map(starText),
          ]),
        }],
      },
      {
        id: 'difficulty',
        title: 'Timing windows',
        summary: 'How strict the judgement is at each difficulty level.',
        sections: [
          ...normal.map(diffTable),
          {
            type: 'table',
            title: 'Points per judgement',
            columns: ['Stages', { label: 'Perfect', num: true }, { label: 'Great', num: true }, { label: 'Good', num: true }],
            rows: missions.map((x) => { const d = diffs.get(x.difficulty) || {}; return [stageName(x), d.perfect_score, d.great_score, d.good_score]; }),
          },
          ...hard.map(diffTable),
        ],
      },
      {
        id: 'talents',
        title: 'Talents',
        count: talents.length,
        summary: 'Permanent upgrades bought with stamps. Talents can be reset for a full refund.',
        sections: talents.map((list) => ({
          type: 'table',
          title: L(list[0]?.name),
          note: L(list[0]?.desc),
          columns: [{ label: 'Level', num: true }, 'Effect', 'Cost to reach'],
          rows: list.slice(1).map((d, i) => {
            const prev = list[i];
            return [d.developlevel, L(d.desc), [prev.usecore ? `${prev.usecore} × ${stamp('core')}` : null, prev.usemoney ? `${prev.usemoney} × ${stamp('money')}` : null].filter(Boolean).join(' + ')];
          }),
        })),
      },
      {
        id: 'missions',
        title: 'Missions',
        count: tasks.length,
        sections: [{ type: 'table', columns: ['Mission', 'Reward'], rows: tasks.map((t) => [taskText(t), { reward: ctx.reward(t.reward_id) }]) }],
      },
    ],
  };
}

module.exports = { build };
