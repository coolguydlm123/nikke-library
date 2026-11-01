// Boom the Ghost / "BFG CLEAN UP!" (EventBTG*): a drop-and-merge puzzle. Elegg's ghost-catching
// device shoots ghosts into a Dust Box; two ghosts of the same level that touch merge into the
// next level for points, and two top-level ghosts vanish. Bigger Dust Boxes, backgrounds and
// endings unlock as your scores add up. Manager 1 is the event, manager 2 the Arcade rerun.

const num = (n) => n.toLocaleString('en-US');
const SKILL = { SkillA: 'Shake', SkillB: 'Fill' };
const SKILL_TEXT = {
  SkillA: 'Shakes the box to reposition the ghosts',
  SkillB: 'Fills the box with water to reposition the ghosts',
};

// In-game help pages straight from MinigameHelpTipDescTable (these games aren't in the hub table).
function helpGroup(ctx, group, title) {
  const pages = ctx.table('MinigameHelpTipDescTable').filter((d) => d.group_id === group).sort((a, b) => a.order - b.order)
    .map((d) => ({ title: ctx.text(d.helptip_title, ''), image: d.helptip_image || null, text: ctx.text(d.helptip_description, '') }));
  return pages.length ? [{ title, pages }] : [];
}

function build(ctx) {
  const managers = ctx.table('EventBTGManagerTable');
  const m = managers.find((x) => x.minigame_type === 'Normal') || managers[0];
  const arcade = managers.find((x) => x.minigame_type === 'Arcade');
  const of = (t, mgr = m) => ctx.table(t).filter((r) => r.manager_id === mgr.id);
  const config = Object.fromEntries(ctx.table('EventBTGConfigTable').map((c) => [c.id, c.value]));

  const ghosts = of('EventBTGObjectInfoTable').sort((a, b) => a.weight_level - b.weight_level);
  const ghostById = new Map(ghosts.map((g) => [g.id, g]));
  const ghostName = (g) => `Level ${g.weight_level} ghost`;
  const maps = of('EventBTGMapTable').sort((a, b) => a.order - b.order);
  const mapById = new Map(maps.map((x) => [String(x.id), x]));
  const bgs = of('EventBTGBgTable').sort((a, b) => a.order - b.order);
  const cutscenes = of('EventBTGCutSceneTable').sort((a, b) => a.order - b.order);
  const skills = of('EventBTGSkillTable');
  const sets = of('EventBTGMuzzleSetTable').sort((a, b) => a.set_score - b.set_score);
  const top = ghosts[ghosts.length - 1];

  const grades = [['S', m.s_grade_min], ['A', m.a_grade_min], ['B', m.b_grade_min], ['C', m.c_grade_min]];
  const gradeImg = (g) => ({ img: ctx.img(`grade_${g.toLowerCase()}`), caption: g, size: 'small' });

  // Each row: the score reached in a run, then the ghost levels the device can load from then on.
  const loadRows = sets.map((s) => {
    const levels = s.object_id_list.map((o) => ghostById.get(o.object_id)).filter(Boolean).map((g) => g.weight_level);
    return [s.set_score, levels.length ? `Levels ${Math.min(...levels)}–${Math.max(...levels)}` : '—'];
  });

  const missionPage = (mgr, id, title, summary) => {
    const list = of('EventBTGMissionTable', mgr).sort((a, b) => a.order - b.order);
    return list.length ? {
      id,
      title,
      group: 'Missions',
      count: list.length,
      summary,
      sections: [{
        type: 'table',
        columns: [{ label: '#', num: true }, 'Mission', 'Reward'],
        rows: list.map((x) => [x.order, ctx.plain(x.name_localkey, x.condition_type).replace('{0}', num(x.condition_value)), { reward: ctx.reward(x.reward_id) }]),
      }],
    } : null;
  };

  return {
    summary: 'A drop-and-merge puzzle: shoot ghosts into the Dust Box, and when two ghosts of the same level touch they merge into a bigger one for points. Don’t let the box overflow.',
    overview: [
      {
        type: 'facts',
        title: 'A run',
        items: [
          ['Intro story', ctx.intro ? { scene: ctx.intro.id, label: ctx.intro.label } : null],
          ['Controls', 'Move the ghost-catching device left and right (swipe, or A / D) and release (or Space) to shoot the loaded ghost'],
          ['Merging', `Two ghosts of the same level that touch become one ghost of the next level and score points. Two level-${top.weight_level} ghosts vanish and score ${num(top.merge_point)}.`],
          ['Game over', `When ghosts stay piled over the top of the box for ${config.GameOverDetectionTime} s`],
          ['Shot cooldown', config.DropCooldownTime && `${config.DropCooldownTime} s between shots`],
          ['Score cap', `${num(m.btg_score_limit_per_game)} points per run`],
          ['Daily reward', [`Score ${num(m.daily_reward_point)} in one run:`, { reward: ctx.reward(m.daily_reward_id) }]],
        ],
      },
      {
        type: 'table',
        title: 'Skills',
        note: 'Both skills move the ghosts around so that matching ones can meet.',
        columns: ['Skill', 'Effect', { label: 'Uses per run', num: true }],
        rows: skills.map((s) => [{ b: SKILL[s.skill_type] || s.skill_type }, SKILL_TEXT[s.skill_type] || '', s.skill_use_value]),
      },
      {
        type: 'table',
        title: 'Grades',
        note: 'The grade for one run’s score; below C is F.',
        columns: ['Grade', { label: 'Score', num: true }],
        rows: [...grades.map(([g, v]) => [gradeImg(g), v]), [gradeImg('F'), 0]],
      },
      { type: 'help', help: helpGroup(ctx, m.tutorial_id, 'How to play') },
    ],
    pages: [
      {
        id: 'ghosts',
        title: 'Ghosts',
        count: ghosts.length,
        summary: 'The ghost ladder: each merge turns two ghosts into the next level.',
        sections: [
          {
            type: 'table',
            title: 'Ghost levels',
            note: 'Points are scored when two ghosts of that level merge. Size is in the game’s own units.',
            columns: ['Ghost', 'Merges into', { label: 'Points', num: true }, { label: 'Size', num: true }],
            rows: ghosts.map((g) => {
              const next = ghostById.get(g.change_to);
              return [{ b: ghostName(g) }, next ? ghostName(next) : 'Vanishes', g.merge_point, g.size];
            }),
          },
          {
            type: 'table',
            title: 'What the device loads',
            note: 'The device loads random low-level ghosts. Scoring more in a run adds bigger ghosts to the mix.',
            columns: [{ label: 'Score in the run', num: true }, 'Ghosts loaded'],
            rows: loadRows,
          },
        ],
      },
      {
        id: 'boxes',
        title: 'Dust Boxes and backgrounds',
        count: maps.length + bgs.length,
        summary: 'Bigger Dust Boxes unlock as your score adds up over all runs; each box also unlocks a background.',
        sections: [
          {
            type: 'table',
            title: 'Dust Boxes',
            columns: ['Box', 'Name', { label: 'Total score', num: true }],
            rows: maps.map((x) => [{ img: ctx.img(x.si_resource_id), size: 'large' }, { text: ctx.plain(x.name_localkey), sub: ctx.plain(x.description_localkey) }, x.condition_value]),
          },
          {
            type: 'table',
            title: 'Backgrounds',
            columns: ['Background', 'Name', 'Unlocked with'],
            rows: bgs.map((b) => {
              const box = mapById.get(String(b.bg_condition_map_id)) || maps.find((x) => x.order === +b.bg_condition_map_id);
              return [
                { img: ctx.img(b.bg_resource_id) || ctx.img(b.bg_mi_resource_id), size: 'large' },
                { text: ctx.plain(b.bg_name_localkey), sub: ctx.plain(b.bg_description_localkey) },
                box ? ctx.plain(box.name_localkey) : '',
              ];
            }),
          },
        ],
      },
      {
        id: 'endings',
        title: 'Endings',
        count: cutscenes.length,
        summary: 'Cartoon endings collected by playing; the table doesn’t say what triggers each one.',
        sections: [{
          type: 'table',
          columns: ['Ending', 'Title'],
          rows: cutscenes.map((c) => [{ img: ctx.img(c.cutscene_resource_id), size: 'large' }, { text: ctx.plain(c.cutscene_name_localkey), sub: ctx.plain(c.cutscene_description_localkey) }]),
        }],
      },
      missionPage(m, 'missions', 'Event missions', 'Missions count over all your runs.'),
      arcade && missionPage(arcade, 'missions-arcade', 'Arcade missions', 'The missions when the game is replayed in Arcade mode.'),
    ].filter(Boolean),
  };
}

module.exports = { build };
