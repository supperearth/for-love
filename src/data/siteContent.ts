export type Question = {
  prompt: string;
  options: string[];
  answerIndex: number;
  noteAfterAnswer: string;
};

export type MatchPair = {
  id: string;
  label: string;
  detail: string;
  image: string;
};

export type MemoryItem = {
  title: string;
  date: string;
  body: string;
};

export const siteContent = {
  accessCode: "0624",
  coupleNames: "蜜蜂峻和黄鸭可",
  anniversaryTitle: "纪念日的小游戏",
  anniversaryDate: "2022.06.24",
  openingLine: "如果我说我喜欢你你信吗",
  gateHint: "请输入你准备好的暗号",
  welcomeText:
    "从回忆里感受时间的流逝吧，这只是个简单的网站，但是希望他可以让今天不那么简单",
  memories: [
    {
      title: "一次记忆深刻的高中问答",
      date: "某个晚修",
      body: "你还是不会做那道题，我还是目的不纯的解答",
    },
    {
      title: "一次难忘的约会",
      date: "某个纪念日",
      body: "收到了这辈子最多的礼物，这是种奇妙的感觉，我以前以为自己不需要这些的",
    },
    {
      title: "今天",
      date: "就现在",
      body: "最近犯傻有点多，但是爱像回归线，现在的错误和我高中做错的题目一样，一切只为通向你的身边",
    },
  ] satisfies MemoryItem[],
  questions: [
    {
      prompt: "我的xp是什么",
      options: ["田西魏", "邓子奇", "黄达科"],
      answerIndex: 2,
      noteAfterAnswer: "这个问题你不应该犹豫",
    },
    {
      prompt: "我们两个的常用语",
      options: ["啥比", "我爱你", "贱人"],
      answerIndex: 2,
      noteAfterAnswer: "真是不文明啊我们两个",
    },
    {
      prompt: "我们的爱情的代言词",
      options: ["简单", "起伏", "自然"],
      answerIndex: 2,
      noteAfterAnswer: "一切都那么自然，自然的蹲在你身边问题，自然的蹲在你身边牵手，相信也会自然的走向以后",
    },
  ] satisfies Question[],
  matchPairs: [
    {
      id: "place",
      label: "狭窄的房间",
      detail: "第一次的交欢",
      image: "",
    },
    {
      id: "food",
      label: "纸上的谎言",
      detail: "第一次的欺骗",
      image: "",
    },
    {
      id: "song",
      label: "方格的床单",
      detail: "第一次的同居",
      image: "",
    },
    {
      id: "promise",
      label: "下课的人流",
      detail: "第一次的牵手",
      image: "",
    },
  ] satisfies MatchPair[],
  finalLetterTitle: "最后想说的话",
  finalLetter:
    "随着年岁的变化，时间的流逝也愈发的快，抓不住的虚无感给人以无限的焦虑，但很高兴你在这里，给了我莫大的力量面对生活的崎岖，翻过山丘无人等候，实在悲壮，能给人带来怀念的力量，灵感的喷发，但我不需要，我只需要未来的饭桌上有你我二人的相会",
};
