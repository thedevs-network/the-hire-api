import Telegraf from "telegraf";
import { flag } from "country-emoji";
import { IJob } from "./db";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command("post", ctx => {
  console.log(ctx.message.from);
  ctx.reply("Posted!");
});

export const sendJob = (job: IJob) => {
  const msg = `\
<b>Job Role</b>
<code>${job.role}</code>

<b>Job Details</b>
${flag(job.country)} <code>${job.country}</code>
Remote: <code>${job.isRemote ? "Yes" : "No"}</code>
Type: <code>${job.type}</code>
Experience Level: <code>${job.experience}</code>
Technologies: <code>${job.technologies.join(", ")}</code>
Company: <code>${job.company}</code>

<b>Job Description & Requirements</b>
${job.description}
${job.website ? `\n<a href="${job.website}">🌐 Website</a>` : ""}
${job.tags.map(t => `#${t}`).join(" ")}
`;

  return bot.telegram.sendMessage(process.env.BOT_CHAT_ID, msg, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "✉️ Apply for this job",
            url: job.email
              ? `https://thedevs.network/mailto/${job.email}`
              : job.applyLink
              ? job.applyLink
              : `https://t.me/${job.telegramUsername}`,
          },
        ],
      ],
    },
  });
};

export default bot;
