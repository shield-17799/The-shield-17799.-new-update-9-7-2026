import { InvestigationCase, SuspectProfile } from "./types";

export const PRELOADED_CASES: InvestigationCase[] = [
  {
    id: "case-1",
    caseNumber: "CASE-17799-A",
    title: "App-based Luring (Squad Gaming)",
    victimAlias: "Emma (12)",
    suspectAlias: "Xenon_Gamer_99",
    status: "FLAGGED",
    chatLog: `Xenon_Gamer_99: hey Emma! u played so well in that squad match!
Emma: thanks! i'm still learning. i don't have many skins yet.
Xenon_Gamer_99: oh really? i have like 50 skins. I can send u a gift card for skins if you want. It's totally free.
Emma: wow really? my parents never buy me anything like that. thank you!
Xenon_Gamer_99: of course, you're like my best friend here. But let's keep it a secret okay? If your parents find out, they might get mad or block me from playing with you.
Emma: ok, i won't tell them.
Xenon_Gamer_99: cool. hey, let's move to Snapchat, it's easier to talk there. Do you have Snapchat? Or Discord?
Emma: yeah I have Snapchat, but my mom said not to add strangers.
Xenon_Gamer_99: but I'm not a stranger, we've played for 3 days now! And I'm your squad partner. Add me: snap_userx9. Don't tell your mom, she won't understand. We are just talking about games!
Emma: ok, i guess so. i'll add you.`,
    notes: "Initial gaming lobby connection. Suspect offering financial luring (in-game skins) and requesting immediate platform migration to Snapchat/Discord with explicit instructions to maintain secrecy from parents.",
    createdAt: "2026-07-01T10:15:00Z"
  },
  {
    id: "case-2",
    caseNumber: "CASE-17799-B",
    title: "Social Media Isolation & Validation",
    victimAlias: "Leo (14)",
    suspectAlias: "Tyler_Styles",
    status: "OPEN",
    chatLog: `Tyler_Styles: Hey man, saw your post about feeling down today. What's going on?
Leo: Just school stuff. Got into a huge fight with my dad. He says I'm useless and don't do anything right.
Tyler_Styles: That's awful. Parents are always like that, they live in the past. Honestly, you're an amazing kid. You've got so much talent. I've been reading your poetry posts and they're genuinely deep.
Leo: Thanks... that means a lot. Nobody else really listens to me.
Tyler_Styles: I'm here for you, always. You can tell me anything. No judgment. In fact, you should only trust people who actually appreciate you. Your dad clearly doesn't.
Leo: Yeah, I feel like you understand me more than my own family.
Tyler_Styles: I do. We have a special connection. Let's make a promise to only share our thoughts with each other. It's our little bond. Don't let anyone get between us.
Leo: I promise.
Tyler_Styles: Awesome. Send me a photo of where you write your poems. Or a selfie of you in your room right now so I know you're safe. Just you, make sure no one else is around.`,
    notes: "Suspect targets child emotional vulnerability, systematically devalues parental authority to drive isolation, establishes an exclusive loyalty pact, and attempts to secure photos of the child alone in their private room.",
    createdAt: "2026-07-04T14:30:00Z"
  },
  {
    id: "case-3",
    caseNumber: "CASE-17799-C",
    title: "Authority Boundary Testing & Video Requests",
    victimAlias: "Chloe (13)",
    suspectAlias: "Coach_Mark_Active",
    status: "UNDER_REVIEW",
    chatLog: `Coach_Mark_Active: Excellent swim practice today Chloe! You're really improving your form.
Chloe: Thanks coach! I'm trying really hard to get the varsity slot.
Coach_Mark_Active: I know you are, and I'm going to make sure you get it. You have a beautiful build for it. Actually, I want to do some customized remote training reviews with you.
Chloe: Remote? Like on video?
Coach_Mark_Active: Yes, we can do a private FaceTime tonight at 10 PM. That way we can discuss your progress without the other girls getting jealous.
Chloe: That's kind of late, my parents are usually asleep.
Coach_Mark_Active: That's perfect actually, because we won't be interrupted. It shows real dedication. And remember, what happens in our training stays between us. We don't need to overcomplicate things with your parents.
Chloe: Okay, I guess. My mom doesn't really understand sports anyway.
Coach_Mark_Active: Exactly. By the way, during the FaceTime, wear something comfortable, like your favorite swim suit, so I can analyze your shoulder extension angles properly. Can you promise me you'll do that?
Chloe: Is that normal for coaching?
Coach_Mark_Active: Yes, it's what elite athletes do. If you want that varsity slot, you have to trust me completely. Don't tell your teammates either.`,
    notes: "Suspect abuses position of trust/authority (coaching role). Schedules private, unmonitored night FaceTime, requests child wear swimwear in private room, enforces absolute secrecy, and conditions advancement on blind trust.",
    createdAt: "2026-07-06T09:00:00Z"
  }
];

export const PRELOADED_SUSPECTS: SuspectProfile[] = [
  {
    id: "suspect-1",
    username: "Xenon_Gamer_99",
    platform: "Discord / Roblox",
    description: "Claims to be a 15-year-old high-ranking squad gamer, but operates exclusively late at night. Uses a cartoon avatar. Offers in-game skins and gift cards.",
    suspiciousBehaviors: "Directly requests moving to encrypted platforms (Snapchat), devalues parental authority, requests secrecy, and targets young children with virtual financial rewards.",
    notes: "Suspected multi-platform predator. Active in child-centric gaming servers. Standard lure is premium virtual skins.",
    createdAt: "2026-07-02T11:00:00Z"
  },
  {
    id: "suspect-2",
    username: "Coach_Mark_Active",
    platform: "Instagram / WhatsApp",
    description: "Public profile lists him as a youth club coach. High engagement with underage student athlete accounts. Frequently posts inspirational fitness messages.",
    suspiciousBehaviors: "Suggests unmonitored late FaceTime sessions under the guise of private coaching, requests swimsuit video feed, requires strict secrecy from parents and peers.",
    notes: "Classic institutional groomer utilizing high-authority status to force child compliance. Urgent intervention required.",
    createdAt: "2026-07-05T08:20:00Z"
  }
];

export const GROOMING_INDICATORS_GUIDE = [
  {
    phase: "1. Target Profiling & Access",
    description: "Predator searches for vulnerable targets in popular online spaces (gaming lobbies, fan forums, mental health support accounts).",
    indicators: [
      "Frequent, unsolicited messaging focusing on lonely or distressed posts.",
      "Offering instant gifts, virtual currency, game keys, or exclusive perks.",
      "Inquiring about parental supervision and child's bedroom privacy early."
    ],
    severity: "LOW"
  },
  {
    phase: "2. Trust & Friendship Building",
    description: "Predator builds an artificial emotional bond, positioning themselves as the child's primary source of understanding and support.",
    indicators: [
      "Lavishing excessive praise, flattery, and adult validation.",
      "Positioning as 'the only one who truly understands' the child.",
      "Fostering intense, artificial emotional intimacy and sharing 'secrets'."
    ],
    severity: "MODERATE"
  },
  {
    phase: "3. Alienation & Isolation",
    description: "Predator devalues parents, friends, and trusted adults, pushing the child to isolate themselves socially and emotionally.",
    indicators: [
      "Instructing the child to delete messages, hide browser tabs, or clear history.",
      "Urging migration from public forums to private, ephemeral apps (Snapchat, Telegram).",
      "Demeaning parents or guardians as untrustworthy, strict, or unsupportive."
    ],
    severity: "HIGH"
  },
  {
    phase: "4. Boundary Testing & Normalization",
    description: "Predator introduces mild sexual topics or inappropriate requests to check child compliance, slowly lowering their guard.",
    indicators: [
      "Asking the child to show their outfit, room, or send regular selfies.",
      "Proposing private, unmonitored video calls late at night.",
      "Using double-entendres or jokes to test compliance and push boundaries."
    ],
    severity: "CRITICAL"
  }
];
