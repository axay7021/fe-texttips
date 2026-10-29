const $ = (id) => document.getElementById(id);
const tones = [
  "Professional",
  "Friendly",
  "Concise",
  "Polished",
  "Clear",
  "Confident",
];
const examples = {
  email: {
    original:
      "hey team, the first version is ready. can you check it and tell me if anything needs changing before friday?",
    rewrites: [
      "Hello team, the initial version is ready for review. Please share any requested changes before Friday.",
      "Hi team! The first version is ready. Could you take a look and send me your feedback before Friday?",
      "The first version is ready. Please review and send changes before Friday.",
      "The initial version is now ready for your review. I would appreciate your feedback and any suggested refinements before Friday.",
      "The first version is ready. Please review it and tell me what needs to change before Friday.",
      "The first version is ready for review. Send your feedback before Friday so we can finalize the next iteration.",
    ],
  },
  request: {
    original:
      "can we talk tomorrow about the design? i have some ideas and want to know what you think.",
    rewrites: [
      "Could we schedule a discussion tomorrow to review the design? I would like to share several ideas and hear your feedback.",
      "Would you have time tomorrow to chat about the design? I have a few ideas and would love to hear your thoughts.",
      "Can we review the design tomorrow? I have ideas to discuss.",
      "Would you be available tomorrow for a design discussion? I would welcome the opportunity to share my ideas and hear your perspective.",
      "Can we meet tomorrow to discuss the design? I want to share my ideas and get your feedback.",
      "Let’s review the design tomorrow. I have several ideas that I would like to discuss with you.",
    ],
  },
};
let tone = 0;
function render() {
  const data = examples[$("example").value];
  $("original").textContent = data.original;
  $("rewrite").textContent = data.rewrites[tone];
  $("tone-title").textContent = tones[tone];
  $("copy-status").textContent = "";
  $("tones").replaceChildren();
  tones.forEach((name, i) => {
    const b = document.createElement("button");
    b.className = "chip tone" + (i === tone ? " active" : "");
    b.textContent = name;
    b.setAttribute("aria-pressed", String(i === tone));
    b.onclick = () => {
      tone = i;
      render();
    };
    $("tones").append(b);
  });
}
$("example").onchange = render;
$("copy").onclick = async () => {
  try {
    await navigator.clipboard.writeText($("rewrite").textContent);
    $("copy-status").textContent = "Copied";
  } catch {
    $("copy-status").textContent = "Select the rewrite text to copy it.";
  }
};
render();
