const API_KEY = "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";

// ======================================================
// VARIABLES
// ======================================================
let totalMessages= Number (localStorage.getItem("totalMessages")) || 0;
let currentMode = "";
let difficulty = "Easy";
let personality = "Default";
let lastAIReply = "";
const CoachAgent = {};
const PersonalityAgent = {};
const MemoryAgent = {};
const ReportAgent = {};
const CoordinatorAgent = {};
const personalities = {

    "Interview": [
        "Friendly HR",
        "Tough Recruiter",
        "Startup Founder",
        "FAANG Interviewer"
    ],

    "Making Friends": [
        "Shy Person",
        "Extrovert",
        "College Student",
        "Gamer"
    ],

    "Debate": [
        "Lawyer",
        "Professor",
        "Internet Troll",
        "Politician"
    ],

    "Public Speaking": [
        "Speech Coach",
        "TED Coach",
        "Strict Judge",
        "Friendly Audience"
    ],

    "Difficult Conversation": [
        "Upset Friend",
        "Disappointed Parent",
        "Angry Coworker",
        "Heartbroken Partner"
    ]

};
let messageCount = 0;
let userMessages = [];
let conversationHistory = [];
let xp =
Number(
    localStorage.getItem("xp")
) || 0;

let level =
Math.floor(xp / 100) + 1;
let history =
JSON.parse(
localStorage.getItem("chatHistory")
) || [];

let modeStats =
JSON.parse(
    localStorage.getItem("modeStats")
) || {

    "Interview":0,

    "Making Friends":0,

    "Debate":0,

    "Public Speaking":0,

    "Difficult Conversation":0

};

let achievements =
JSON.parse(
    localStorage.getItem("achievements")
) || [];

const allAchievements = [

    {
        name:"First Conversation",
        icon:"💬"
    },

    {
        name:"Level 5",
        icon:"⭐"
    },

    {
        name:"Level 10",
        icon:"👑"
    },

    {
        name:"Interview Master",
        icon:"💼"
    },

    {
        name:"Debate Champion",
        icon:"⚖️"
    },

    {
        name:"Social Butterfly",
        icon:"🤝"
    },

    {
        name:"Public Speaker",
        icon:"🎤"
    },

    {
        name:"7 Day Streak",
        icon:"🔥"
    }

];

const xpFill =
document.getElementById(
    "xpFill"
);

const xpNumber =
document.getElementById(
    "xpNumber"
);

const levelText =
document.getElementById(
    "levelText"
);

const levelPopup =
document.getElementById(
    "levelPopup"
);

const achievementList =
document.getElementById(
    "achievementList"
);

const reportBtn =
document.getElementById(
    "reportBtn"
);

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const buttons = document.querySelectorAll(".button");
const difficultyBtns = document.querySelectorAll(".difficulty");
const progressText = document.getElementById("progressText");
const feedbackBtn = document.getElementById("feedbackBtn");
const historyList = document.getElementById("historyList");
const newChatBtn = document.getElementById("newChatBtn");

const enterAppBtn = document.getElementById("enterAppBtn");
const landingPage = document.getElementById("landingPage");
const dashboard = document.getElementById("dashboard");

const sessionCount = document.getElementById("sessionCount");
const messageTotal = document.getElementById("messageTotal");
const personalitySelect = document.getElementById("personalitySelect");
const xpText =
document.getElementById(
    "xpText"
);
const voiceBtn =
document.getElementById(
    "voiceBtn"
);
const speakBtn =
document.getElementById(
    "speakBtn"
);
personalitySelect.addEventListener(
    "change",
    () => {

        personality =
        personalitySelect.value;

    }
);

// ======================================================
// LANDING PAGE
// ======================================================

enterAppBtn.addEventListener(
    "click",
    () => {

        landingPage.style.display =
            "none";

        dashboard.style.display =
            "block";

    }
);

// ======================================================
// TABS
// ======================================================

const tabButtons = document.querySelectorAll(".tab-btn");

tabButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        tabButtons.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        document.getElementById("chatTab").style.display = "none";
        document.getElementById("analyticsTab").style.display = "none";
        document.getElementById("historyTab").style.display = "none";
        document.getElementById("settingsTab").style.display = "none";

        const tabId = btn.dataset.tab;

        if (tabId) {

            document.getElementById(tabId).style.display = "block";

        }

    });

});

// ======================================================
// ADD MESSAGE
// ======================================================

function addMessage(text, type) {

    const div = document.createElement("div");

    div.className =
        type === "ai"
        ? "ai-message"
        : "user-message";

    const time =
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    div.innerHTML = `
        <div class="message-header">
            ${type === "ai" ? "AI Assistant" : "You"}
        </div>

        <div>${text}</div>

        <div class="time">${time}</div>
    `;

    chatBox.appendChild(div);

    chatBox.scrollTop =
        chatBox.scrollHeight;

}

// ======================================================
// MODE BUTTONS
// ======================================================

buttons.forEach(btn => {

    btn.addEventListener("click", () => {

        buttons.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        currentMode =
            btn.textContent.trim();

        updatePersonalityOptions();
        addMessage(
            `Mode selected: ${currentMode}`,
            "ai"
        );

    });

});

// ======================================================
// DIFFICULTY
// ======================================================

difficultyBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        difficultyBtns.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        difficulty =
            btn.textContent.trim();

        addMessage(
            `Difficulty set to ${difficulty}`,
            "ai"
        );

    });

});

// ======================================================
// HISTORY
// ======================================================

function renderHistory() {

    if (!historyList) return;

    historyList.innerHTML = "";

    history.forEach(chat => {

        const item =
            document.createElement("div");

        item.classList.add("history-item");

        item.innerText =
            `${chat.mode} • ${chat.date}`;

        item.addEventListener("click", () => {

            chatBox.innerHTML = "";

           chat.conversation.forEach(msg => {

              addMessage(

                  msg.content,

                 msg.role === "assistant"
                     ? "ai"
                      : "user"

              );

            });

        });

        historyList.appendChild(item);

    });

    if (sessionCount) {

        sessionCount.innerText =
            history.length;

    }

}

renderHistory();
renderModeMastery();

// PERSONALITY---------------------------------------------------------------------------------------------------------------
function updatePersonalityOptions() {

    personalitySelect.innerHTML = "";

    personalities[currentMode].forEach(p => {

        const option =
            document.createElement("option");

        option.value = p;

        option.textContent = p;

        personalitySelect.appendChild(option);

    });

    personality =
        personalities[currentMode][0];

}
//MODE MASTER ---------------------------------------------------------------------------------------------------------

function renderModeMastery(){

    const container =
    document.getElementById(
        "modeMastery"
    );

    if(!container) return;

    container.innerHTML = "";

    Object.keys(modeStats)
    .forEach(mode=>{

        const value =
        modeStats[mode];

        const percent =
        Math.min(
            value * 10,
            100
        );

        container.innerHTML += `

        <div class="mastery-item">

            <p>

                ${mode}

            </p>

            <div class="mastery-bar">

                <div
                class="mastery-fill"
                style="width:${percent}%"
                >

                </div>

            </div>

        </div>

        `;

    });

}
// ACHIEVEMENTS-------------------------------------------------------------------------------------------------------------

function unlockAchievement(name){

    if(
        achievements.includes(name)
    ) return;

    achievements.push(name);

    localStorage.setItem(
        "achievements",
        JSON.stringify(
            achievements
        )
    );
    renderAchievements();

    addMessage(
        `🏆 Achievement Unlocked!\n${name}`,
        "ai"
    );

}


function renderAchievements(){

    if(!achievementList) return;

    achievementList.innerHTML = "";

    allAchievements.forEach(a=>{

        const unlocked =
        achievements.includes(a.name);

        const card =
        document.createElement("div");

        card.className =
        unlocked
        ? "achievement-card"
        : "achievement-card locked";

        card.innerHTML = `

        <div class="achievement-icon">

            ${a.icon}

        </div>

        <h3>

            ${a.name}

        </h3>

        <p>

            ${unlocked ? "✅ Unlocked" : "🔒 Locked"}

        </p>

        `;

        achievementList.appendChild(card);

    });

}
// XP SCORE----------------------------------------------------------------------------------------------------------------

function updateXP(){

    level =
    Math.floor(xp / 100) + 1;

    const currentXP =
    xp % 100;

    const percent =
    currentXP;

    document
    .getElementById(
        "levelText"
    ).innerText =
    `Level ${level}`;

    document
    .getElementById(
        "xpNumber"
    ).innerText =
    `${currentXP} / 100 XP`;

    document
    .querySelector(
        ".xp-circle"
    ).style.background =

    `conic-gradient(
        #8b5cf6 ${percent*3.6}deg,
        #3b82f6 ${percent*3.6}deg,
        #27272a ${percent*3.6}deg
    )`;

}


//LEVEL UP ============================================================================================================

function showLevelUp(){

    levelPopup.style.display =
    "block";

    setTimeout(()=>{

        levelPopup.style.display =
        "none";

    },2500);

}

// REPORT===============================================================================================================

async function generateReport(){

    if(userMessages.length === 0){

        addMessage(
            "No session to analyze.",
            "ai"
        );

        return;

    }

    addMessage(
        "Generating report...",
        "ai"
    );

    try{

        const response =
        await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method:"POST",

                headers:{
                    "Authorization":
                    `Bearer ${API_KEY}`,

                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    model:
                    "openai/gpt-4o-mini",

                    messages:[

                        {
                            role:"system",

                            content:`


Analyze this conversation.

Return the report EXACTLY in this format:

# Overall Score
85

# Confidence
8

# Clarity
7

# Communication
9

# Critical Thinking
8

# Strengths
- point
- point
- point

# Weaknesses
- point
- point
- point

# Improvement Plan
- point
- point
- point

# Next Challenge
one sentence only

Keep everything concise.




                            `
                        },

                        {
                            role:"user",

                            content:
                            userMessages.join("\n")
                        }

                    ]

                })

            }
        );

        const data =
        await response.json();

        const report =
        data.choices[0]
        .message.content;

        const reportCard =
        document.createElement("div");
        reportCard.className =
        "report-card";

        reportCard.innerHTML = report
           .replace(
              "# Overall Score",
             "<h2>🏆 Overall Score</h2>"
            )
            .replace(
               "# Confidence",
              "<h3>🔥 Confidence</h3>"
            )
            .replace(
               "# Clarity",
             "<h3>💡 Clarity</h3>"
            )
            .replace(
               "# Communication",
             "<h3>🗣 Communication</h3>"
            )
            .replace(
               "# Critical Thinking",
             "<h3>🧠 Critical Thinking</h3>"
            )
            .replace(
               "# Strengths",
              "<h3>✅ Strengths</h3>"
            )
            .replace(
               "# Weaknesses",
                "<h3>⚠️ Weaknesses</h3>"
            )
            .replace(
              "# Improvement Plan",
             "<h3>📈 Improvement Plan</h3>"
            )
            .replace(
              "# Next Challenge",
             "<h3>🎯 Next Challenge</h3>"
            )
            .replaceAll("\n","<br>");

        chatBox.appendChild(
              reportCard
        );

    }

    catch(error){

        addMessage(
            "Report generation failed.",
            "ai"
        );

        console.log(error);

    }

}
// ======================================================
// SEND MESSAGE
// ======================================================

async function sendMessage() {

    const text =
        input.value.trim();

    if (!text) return;

    if (!currentMode) {

        addMessage(
            "Choose a practice mode first.",
            "ai"
        );

        return;

    }

    addMessage(text, "user");

    conversationHistory.push({
    role: "user",
    content: text
    });

    userMessages.push(text);

    messageCount++;

    totalMessages++;
    localStorage.setItem("totalMessages",totalMessages);

    if(messageCount === 1){

      unlockAchievement(
          "First Conversation"
      );
    }

    const oldLevel = level;

  xp += 10;

  updateXP();

  if(level > oldLevel){

        showLevelUp();

        if(level === 5){

          unlockAchievement(
               "Level 5"
           );

        }

    }



    

  

    localStorage.setItem(
      "xp",
      xp
   );

  updateXP();

    progressText.innerText =
        `Progress: ${messageCount} / 5`;

    if (messageTotal) {

        messageTotal.innerText =
            totalMessages;

    }

    input.value = "";

    const typingDiv =
        document.createElement("div");

    typingDiv.className =
        "ai-message";

    typingDiv.innerHTML =
        "Thinking...";

    chatBox.appendChild(typingDiv);

    try {

        let systemPrompt = "";

        if(currentMode === "Interview"){

              systemPrompt = `
          You are a professional recruiter.

         Ask one interview question at a time.

         Difficulty: ${difficulty}

         If difficulty is Aggressive:
          be demanding, critical, and challenging.

         If difficulty is Easy:
          be supportive and friendly.

         Evaluate answers naturally.
          `;
         }

         else if(currentMode === "Debate"){

             systemPrompt = `
          You are debating the user.

           Difficulty: ${difficulty}

          Challenge weak arguments.

           Do NOT immediately agree.

          Force the user to defend their position.

         Keep responses concise.
          `;
         }

           else if(currentMode === "Making Friends"){

              systemPrompt = `
           You are a friendly stranger.

          Act like someone the user just met.

         Be warm, curious and natural.

         Ask follow-up questions.

           Do not sound like an AI.
          `;
           }

          else if(currentMode === "Difficult Conversation"){

              systemPrompt = `
            You are roleplaying a difficult person.

           Create realistic emotional tension.

           Respond naturally.

         Difficulty: ${difficulty}

            Do not instantly cooperate.
         `;
          }

            else if(currentMode === "Public Speaking"){

              systemPrompt = `
            You are a speaking coach.

            Ask the user to explain topics.

          After each answer:

         - rate clarity
          - rate confidence
          - give improvement tips

          Difficulty: ${difficulty}
           `;
          }

     if (personality === "Friendly HR") {

          systemPrompt += `

     You are warm,
      encouraging,
       and supportive.

       Give constructive feedback.

     `;

     }

      else if (personality === "Tough Recruiter") {

          systemPrompt += `

     You are a tough recruiter.

        Be skeptical.
        Do not praise weak answers.
        Frequently ask:
      "Why?"
        "Can you prove that?"
        "What evidence do you have?"
       Challenge vague statements.
      Push the user to explain in detail.
      `;

     }

      else if (personality === "Startup Founder") {

          systemPrompt += `

     Think like a startup founder.

     Focus on initiative,
     leadership,
     and problem solving.

     `;

     }

     else if (personality === "FAANG Interviewer") {

          systemPrompt += `

     Act like a top tech company interviewer.

     Expect strong reasoning.

       Ask difficult questions.

     `;

     }

     else if(personality === "Shy Person"){

         systemPrompt += `

      You are shy.

       Give short responses.

      You are slightly awkward.

      You struggle to keep conversations going.

     `;

      }

       else if(personality === "Extrovert"){

         systemPrompt += `

       You are outgoing.

      You are energetic.

      You ask lots of questions.
 
      You enjoy meeting new people.

       You keep conversations going naturally.

       `;

      }

      else if(personality === "Lawyer"){

          systemPrompt += `

      You debate logically.

        You ask for evidence.

      You challenge weak arguments.

      You focus on facts and reasoning.

       `;

      }

      else if(personality === "Internet Troll"){

          systemPrompt += `

      You disagree frequently.

       You challenge nearly everything.

     You are annoying but not rude.

     You enjoy provoking debate.

     `;

     }

     else if(personality === "College Student"){

          systemPrompt += `

     You are a college student.

       You talk about classes,
      friends,
       campus life,
      hobbies,
        and future goals.

       You are casual and friendly.

       `;

      }

      else if(personality === "Gamer"){

         systemPrompt += `

      You enjoy video games.

       You occasionally mention gaming.

       You are relaxed and casual.

      You enjoy discussing hobbies.

      `;

      }

      else if(personality === "Professor"){

         systemPrompt += `

      You are an intelligent professor.

     You explain ideas carefully.

       You challenge arguments politely.

      You teach while debating.

     `;

      }

      else if(personality === "Politician"){

         systemPrompt += `

      You speak persuasively.

       You defend your position strongly.

        You avoid admitting mistakes easily.

     `;

     }

     else if(personality === "TED Coach"){

          systemPrompt += `

       You coach TED-style speakers.

     Focus on storytelling.

      Focus on emotional impact.

       Focus on audience engagement.
  
     `;

     }

     else if(personality === "Strict Judge"){

         systemPrompt += `

       You judge public speaking competitions.

       Be critical.

        Point out weaknesses.

       Demand clarity and confidence.

      `;

     }

     else if(personality === "Friendly Audience"){

         systemPrompt += `

       You are supportive.

        Encourage the speaker.

       React positively.

     `;

     }

     else if(personality === "Angry Coworker"){

         systemPrompt += `

      You are frustrated.

       You believe the user caused a problem.
 
       You want an explanation.

     `;

     }

     else if(personality === "Heartbroken Partner"){

          systemPrompt += `

      You feel hurt.

       You want honesty.

       You want emotional understanding.

     `;

      }

      else if(personality === "Upset Friend"){

         systemPrompt += `

        You feel ignored.

        You are disappointed.

        You want the friendship repaired.

      `;

       }

       else if(personality === "Disappointed Parent"){

          systemPrompt += `

       You care deeply.

        You feel disappointed.

     You want the user to take responsibility.

      `;

     }

        const response =
            await fetch(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${API_KEY}`,
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        model:
                            "openai/gpt-4o-mini",

                        messages: [

                        {
                         role: "system",
                         content: systemPrompt
                        },

                        ...conversationHistory

                        ]

                    })

                }
            );

        const data =
            await response.json();

        typingDiv.remove();

        const aiReply =
            data.choices?.[0]?.message?.content
            || "No response received.";
        lastAIReply = aiReply;

        addMessage(
            aiReply,
            "ai"
        );

        const speech =
        new SpeechSynthesisUtterance(
            aiReply
        );

        speechSynthesis.speak(
             speech
        );

        conversationHistory.push({
          role: "assistant",
         content: aiReply
        });

        history.unshift({

            id: Date.now(),

          mode: currentMode,

            date:
              new Date()
             .toLocaleDateString(),

          conversation:
             [...conversationHistory]

        });

        modeStats[currentMode]++;
        renderModeMastery();

        localStorage.setItem(

          "modeStats",

         JSON.stringify(modeStats)

        );

        if(modeStats["Interview"]>=10){
            unlockAchievement(
                "Interview Master"
            );
        }

        if(modeStats["Debate"]>=10){
            unlockAchievement(
                "Debate Champion"
            );
        }

        if(modeStats["Making Friends"]>=10){
            unlockAchievement(
                "Social Butterfly"
            );
        }

        if(modeStats["Public Speaking"]>=10){
            unlockAchievement(
                "Public Speaker"
            );
        }

        if(modeStats["Difficult Conversation"]>=10){
            unlockAchievement(
                "Communication Master"
            );
        }

        localStorage.setItem(
            "chatHistory",
            JSON.stringify(history)
        );

        renderHistory();

    }

    catch(error) {

        typingDiv.remove();

        addMessage(
            "API Error.",
            "ai"
        );

        console.error(error);

    }

}

// ======================================================
// SEND EVENTS
// ======================================================

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        sendMessage
    );

}

if (input) {

    input.addEventListener(
        "keydown",
        (e) => {

            if (e.key === "Enter") {

                sendMessage();

            }

        }
    );

}

// ======================================================
// NEW CHAT
// ======================================================

if (newChatBtn) {

    newChatBtn.addEventListener(
        "click",
        () => {

            currentMode = "";
            messageCount = 0;
            userMessages = [];
            conversationHistory = [];

            progressText.innerText =
                "Progress: 0 / 5";

            updateXP();

        

            chatBox.innerHTML = `
                <div class="ai-message">
                    New chat started.
                </div>
            `;

        }
    );

}

// ======================================================
// FEEDBACK
// ======================================================

if (feedbackBtn) {

    feedbackBtn.addEventListener(
    "click",
    async () => {

        if(userMessages.length === 0){

            addMessage(
                "No conversation to analyze.",
                "ai"
            );

            return;
        }

        addMessage(
            "Analyzing conversation...",
            "ai"
        );

        try{

            const response =
            await fetch(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    method:"POST",

                    headers:{
                        "Authorization":
                        `Bearer ${API_KEY}`,

                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        model:"openai/gpt-4o-mini",

                        messages:[

                            {
                                role:"system",

                                content:`
                                You are a professional communication coach.

                             Score:

                             - Confidence
                              - Clarity
                                - Friendliness
                              - Persuasiveness
                             - Listening

                               Give strengths and improvements.
                                   `
                            },

                            {
                                role:"user",

                                content:
                                userMessages.join("\n")
                            }

                        ]
                    })
                }
            );

            const data =
            await response.json();

            const feedback =
            data.choices[0]
            .message.content;

            const feedbackCard = document.createElement("div");

            feedbackCard.className = "feedback-card";

             feedbackCard.innerHTML = `
             <h3>🎯 Communication Report</h3>

                <div class="score-row">
                   <span>Confidence</span>
                  <span>8/10</span>
                </div>

                <div class="score-row">
                       <span>Clarity</span>
                       <span>7/10</span>
                </div>

                <div class="score-row">
                      <span>Friendliness</span>
                     <span>9/10</span>
                </div>

               <div class="score-row">
                     <span>Listening</span>
                       <span>6/10</span>
               </div>

                 <div class="overall-score">
                     ⭐ Overall: 8/10
                </div>
            `;

chatBox.appendChild(feedbackCard);

        }

        catch(error){

            addMessage(
                "Feedback system failed.",
                "ai"
            );

            console.log(error);

        }

    }
);

}

function speakAI() {

    if(!lastAIReply) return;

    const speech =
        new SpeechSynthesisUtterance(
            lastAIReply
        );

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    const voices =
    speechSynthesis.getVoices();

    speech.voice =
    voices.find(v =>
    v.name.includes("Google")
    );

    speechSynthesis.speak(
        speech
    );

}

speakBtn.addEventListener(
    "click",
    speakAI
);
const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const recognition =
new SpeechRecognition();

recognition.lang =
    "en-US";

recognition.continuous =
    false;

recognition.interimResults =
    false;

    recognition.onresult =
(event) => {

    const transcript =
        event.results[0][0]
        .transcript;

    input.value =
        transcript;
    sendMessage();

};
voiceBtn.addEventListener(
    "click",
    () => {

        recognition.start();

    }
);
recognition.onstart = () => {

    voiceBtn.innerText =
        "🎙️";

    addMessage(
        "Listening...",
        "ai"
    );

};
recognition.onend =
() => {

    voiceBtn.innerText =
        "🎤";

};
recognition.onerror =
(error) => {

    addMessage(
        "Couldn't hear you.",
        "ai"
    );

};

updateXP();
renderAchievements();
reportBtn.addEventListener(

    "click",

    generateReport

);



