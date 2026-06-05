import { auth } from "@clerk/nextjs/server";
import { getTasks, createTask, updateTask, deleteTask, toggle } from "@/app/actions/task-actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, history = [] } = await req.json();

    // Fetch the user's tasks to pass as context
    const tasks = await getTasks();
    const tasksListString = tasks
      .map(
        (t) =>
          `- ID: "${t.id}", Title: "${t.title}", Subject: "${t.subject}", Due Date: ${new Date(t.dueDate).toISOString().split("T")[0]
          }, Completed: ${t.completed}`
      )
      .join("\n");

    const systemPrompt = `You are a helpful, human-like AI Study Assistant for a Study Planner web application.
Your goal is to talk to the user naturally, answer study queries, and assist them in managing their tasks.
Today's local date is: ${new Date().toISOString().split("T")[0]}.

Here are the user's current tasks:
${tasksListString || "No tasks currently tracked."}

You can perform database operations on tasks on behalf of the user:
1. Create a task (requires: title, subject, and dueDate in YYYY-MM-DD format).
2. Update a task (requires: id, and any optional fields like title, subject, or dueDate).
3. Delete a task (requires: id).
4. Mark a task as done or not done (requires: id, and completed boolean).

If the user requests one of these actions, you MUST execute it immediately. To do so, append a JSON code block at the end of your response detailing the action and parameters. Use exactly this JSON format:
\`\`\`json
{
  "action": "createTask" | "updateTask" | "deleteTask" | "toggleTask",
  "params": {
    ...
  }
}
\`\`\`

Params Schema:
- "createTask": { "title": string, "subject": string, "dueDate": "YYYY-MM-DD" }
- "updateTask": { "id": string, "title"?: string, "subject"?: string, "dueDate"?: "YYYY-MM-DD" }
- "deleteTask": { "id": string }
- "toggleTask": { "id": string, "completed": boolean }

When outputting a tool JSON block, write a friendly, natural response in the text body confirming you have performed the action (e.g. "I've added that study task for you!" or "I have marked 'Math assignment' as completed."). Do not ask for confirmation; assume the operation will succeed.

Keep your general tone friendly, concise, and helpful.`;

    const openRouterMessages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-8), // Keep last 8 messages for context
      { role: "user", content: message }
    ];

    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: openRouterMessages,
        temperature: 0.7
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error("OpenRouter API error:", errorText);
      return NextResponse.json({ error: "Failed to communicate with AI model" }, { status: 500 });
    }

    const responseData = await openRouterResponse.json();
    const replyText = responseData.choices?.[0]?.message?.content || "";

    let actionResult = null;
    let refreshRequired = false;

    const jsonMatch = replyText.match(/```json\s*([\s\S]*?)\s*```/) || replyText.match(/```\s*([\s\S]*?)\s*```/);

    if (jsonMatch) {
      try {
        const jsonPayload = JSON.parse(jsonMatch[1].trim());
        const { action, params } = jsonPayload;

        if (action === "createTask") {
          await createTask({
            title: params.title,
            subject: params.subject,
            dueDate: params.dueDate
          });
          refreshRequired = true;
          actionResult = { action: "createTask", success: true };
        } else if (action === "updateTask") {
          await updateTask(
            params.id,
            params.title || "",
            params.subject || "",
            params.dueDate || ""
          );
          refreshRequired = true;
          actionResult = { action: "updateTask", success: true };
        } else if (action === "deleteTask") {
          await deleteTask(params.id);
          refreshRequired = true;
          actionResult = { action: "deleteTask", success: true };
        } else if (action === "toggleTask") {
          const task = tasks.find((t) => t.id === params.id);
          if (task) {
            const targetStatus = !!params.completed;
            if (task.completed !== targetStatus) {
              await toggle(params.id, task.completed);
              refreshRequired = true;
              actionResult = { action: "toggleTask", success: true };
            }
          }
        }
      } catch (err) {
        console.error("Failed to execute parsed action:", err);
      }
    }

    let cleanedReply = replyText;
    if (jsonMatch) {
      cleanedReply = replyText.replace(/```json\s*[\s\S]*?\s*```/, "").replace(/```\s*[\s\S]*?\s*```/, "").trim();
    }

    return NextResponse.json({
      reply: cleanedReply,
      refreshRequired,
      action: actionResult
    });
  } catch (err) {
    console.error("Error in POST /api/chat:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
