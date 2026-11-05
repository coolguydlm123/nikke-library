// Messenger: the in-game chat app, shown in the Stories reader as one more category. A room is
// a group and each conversation in it a "scene" (id msg_<conversation_id>), in the same shape as
// StoryLibrary.scene(), so the reader (and its play flow for choices) works unchanged.
const fs = require('fs');
const path = require('path');
const { art } = require('./art');

const readRecords = (file) => {
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(d) ? d : d.records || [];
};

// MessengerDialogTable speaker_type / message_type -> the reader's line types.
function lineType(r) {
  if (r.message_type === 'Choice') return 'Choice';
  if (r.message_type === 'Monologue') return 'Monologue';
  if (r.speaker_type === 'Notification' || r.message_type === 'Reward') return 'Narration';
  return r.speaker_type === 'Self' ? 'Self' : 'Speech';
}

class MessengerLibrary {
  constructor({ dataDir }, locale, stages) {
    this.dataDir = dataDir;
    this.locale = locale;
    this.stages = stages; // reward names, stage names for unlock conditions
  }

  table(name) {
    const file = path.join(this.dataDir, `${name}.json`);
    return fs.existsSync(file) ? readRecords(file) : [];
  }

  text(key, fallback = null) {
    return (key && this.locale.get(key)) || fallback;
  }

  // Profile pictures: si_cNNN_XX_s character icons (icons-char); room thumbnails name the
  // mi_ variant, which isn't downloaded, so the matching si_ icon stands in.
  icon(name) {
    if (!name) return null;
    return art('icons-char', name) || art('icons-char', String(name).replace(/^mi_/, 'si_')) || null;
  }

  build() {
    this.members = new Map(this.table('MessengerMemberTable').map((m) => [m.id, m]));
    const rooms = this.table('MessengerRoomTable').filter((r) => !/test/i.test(r.id)); // test rooms hold placeholder dialog
    const byConv = new Map(); // conversation id -> lines, in table order
    for (const r of this.table('MessengerDialogTable')) {
      if (!byConv.has(r.conversation_id)) byConv.set(r.conversation_id, []);
      byConv.get(r.conversation_id).push(r);
    }
    this.convs = new Map(); // scene id -> { lines, room, label, prev, next }
    const groups = [];
    for (const room of rooms) {
      const convs = [...byConv.entries()].filter(([, lines]) => lines[0].room_id === room.id && lines.some((l) => this.locale.has(l.dialog_localkey)));
      if (!convs.length) continue;
      const name = this.text(room.name_locale, room.id);
      const label = `${name} · ${room.type === 'None' ? 'Chat' : room.type}`;
      const scenes = convs.map(([cid, lines], i) => {
        const id = `msg_${cid}`;
        // Name a conversation after its opening line, as the chat list does.
        const first = this.text(lines.find((l) => l.is_opener)?.dialog_localkey || lines[0].dialog_localkey, '');
        const title = first.length > 48 ? `${first.slice(0, 46)}…` : first || `Chat ${i + 1}`;
        this.convs.set(id, { lines, room, group: label, label: `${i + 1}. ${title}`, cid,
          prev: convs[i - 1] ? `msg_${convs[i - 1][0]}` : null, next: convs[i + 1] ? `msg_${convs[i + 1][0]}` : null });
        return { id, label: `${i + 1}. ${title}`, lines: lines.length };
      });
      // Room thumbnails are mi_cNNN_XX_s (icons-char-mi); others fall back to the si_ character icon.
      const mi = art('icons-char-mi', room.thumbnail_image);
      const img = mi ? `icons-char-mi/${mi}` : this.icon(room.thumbnail_image) && `icons-char/${this.icon(room.thumbnail_image)}`;
      groups.push({ id: `room_${room.id}`, label, scenes, img: img || null });
    }
    this.unlocks = this.archiveUnlocks(); // after this.convs, to name the chats it refers to
    this.convsById = new Map([...this.convs.values()].map((c) => [String(c.cid).toLowerCase(), c]));
    this.category = { id: 'messenger', label: 'Messenger', groups };
    console.log(`Indexed ${this.convs.size} messenger conversations in ${groups.length} rooms`);
  }

  // Event chats: ArchiveMessengerConditionTable.tid is the conversation, with up to three
  // conditions. Main chats' triggers (MessengerConditionTriggerTable) have no link to a
  // conversation in the data, so they aren't shown.
  archiveUnlocks() {
    const rows = this.table('ArchiveMessengerConditionTable');
    const tidOf = new Map(rows.map((r) => [r.id, r.tid]));
    const out = new Map();
    for (const r of rows) {
      const notes = r.archive_messenger_condition_list.filter((c) => c.condition_type && c.condition_type !== 'None').map((c) => {
        if (c.condition_type === 'MessageClear') {
          const prev = this.convs.get(`msg_${tidOf.get(c.condition_id)}`);
          return `After ${prev ? `${prev.room ? this.text(prev.room.name_locale, '') : ''} chat ${prev.label}` : `chat ${c.condition_id}`}`;
        }
        const stage = this.stages.stages?.get(c.condition_id);
        const name = stage && this.text(stage.name_localkey, null);
        return `Clear ${c.condition_type === 'EventStageClear' ? 'event ' : ''}stage ${name || c.condition_id}`;
      });
      if (notes.length) out.set(r.tid, notes);
    }
    return out;
  }

  // Who asked for a request story: the room of the chat with the same id ("d_subquest_1022_s"
  // -> chat "m_subquest_1022_s", or without the _s/_e half) is the requester's room.
  requesterFor(sceneId) {
    const base = `m_${sceneId.toLowerCase().replace(/^(re_)?d_/, '')}`;
    for (const cid of [base, base.replace(/_[se]$/, ''), `${base.replace(/_[se]$/, '')}_s`]) {
      const c = this.convsById?.get(cid);
      if (c) return { id: c.room.id, name: this.text(c.room.name_locale, c.room.id) };
    }
    return null;
  }

  // Same shape as StoryLibrary.scene().
  scene(id) {
    const c = this.convs.get(id);
    if (!c) return null;
    const speakers = {};
    const icons = {};
    const lines = c.lines.map((r) => {
      const type = lineType(r);
      const member = r.member_id && this.members.get(r.member_id);
      if (member && !(r.member_id in speakers)) {
        speakers[r.member_id] = this.text(member.name_locale, r.member_id);
        const icon = this.icon(member.profile_image);
        if (icon) icons[r.member_id] = icon;
      }
      let text = this.text(r.dialog_localkey, null);
      if (r.message_type === 'Reward' && r.reward_id) {
        const reward = this.stages.rewardInfo(r.reward_id);
        const items = reward?.items.map((x) => `${x.name} ×${x.amount}`).join(', ');
        text = `Reward: ${items || r.reward_id}${text ? ` (${text})` : ''}`;
      }
      if (r.message_type === 'Image') text = `[Image: ${r.resource_id}]`;
      return { id: r.id, type, speaker: type === 'Self' || type === 'Choice' ? null : r.member_id || null,
        key: r.dialog_localkey || null, text, jump: r.jump_target || null };
    });
    const unlock = this.unlocks.get(c.cid);
    if (unlock) lines.unshift({ id: `${id}_unlock`, type: 'Narration', speaker: null, text: `Unlocks: ${unlock.join(' · ')}`, key: null });
    return {
      id, cat: 'messenger', group: { id: `room_${c.room.id}`, label: c.group }, label: c.label, stage: null,
      prev: c.prev, next: c.next, speakers, icons, lines, chat: true,
    };
  }
}

module.exports = { MessengerLibrary };
