package com.focapy.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/** Local-first task widget. Widget actions never launch the main WebView activity. */
public class TaskMonitorWidgetProvider extends AppWidgetProvider {
    public static final String ACTION_COMPLETE_TASK = "com.focapy.app.COMPLETE_WIDGET_TASK";
    public static final String EXTRA_TASK_ID = "task_id";
    static final String PREFS_NAME = "focapy_task_widget";
    static final String PREFS_PENDING_TASKS = "pending_tasks";
    static final String PREFS_COMPLETED_TASK_IDS = "completed_task_ids";
    static final String PREFS_CREATED_TASKS = "created_tasks";
    static final String PREFS_COMPLETED_FOCUS_EVENTS = "completed_focus_events";
    private static final int[] TASK_ROW_IDS = {R.id.widget_task_0, R.id.widget_task_1, R.id.widget_task_2};

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] widgetIds) {
        for (int widgetId : widgetIds) manager.updateAppWidget(widgetId, buildViews(context, widgetId));
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if (!ACTION_COMPLETE_TASK.equals(intent.getAction())) return;
        String taskId = intent.getStringExtra(EXTRA_TASK_ID);
        if (taskId == null || taskId.trim().isEmpty()) return;
        markTaskComplete(context, taskId);
        updateAllWidgets(context);
    }

    static void updateAllWidgets(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] widgetIds = manager.getAppWidgetIds(new ComponentName(context, TaskMonitorWidgetProvider.class));
        if (widgetIds.length > 0) new TaskMonitorWidgetProvider().onUpdate(context, manager, widgetIds);
    }

    private RemoteViews buildViews(Context context, int widgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.task_monitor_widget);
        JSONArray tasks = readPendingTasks(context);
        for (int index = 0; index < TASK_ROW_IDS.length; index++) {
            int rowId = TASK_ROW_IDS[index];
            JSONObject task = tasks.optJSONObject(index);
            if (task == null) {
                views.setViewVisibility(rowId, View.GONE);
                continue;
            }
            String taskId = task.optString("id", "");
            String title = task.optString("title", "");
            views.setViewVisibility(rowId, View.VISIBLE);
            views.setTextViewText(rowId, "✓  " + title);
            views.setContentDescription(rowId, "Concluir " + title);
            views.setOnClickPendingIntent(rowId, completionIntent(context, taskId, widgetId, index));
        }
        views.setViewVisibility(R.id.widget_empty, tasks.length() == 0 ? View.VISIBLE : View.GONE);
        Intent addIntent = new Intent(context, WidgetTaskInputActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        views.setOnClickPendingIntent(R.id.widget_add_task, PendingIntent.getActivity(
            context, 700000 + widgetId, addIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE));
        return views;
    }

    private PendingIntent completionIntent(Context context, String taskId, int widgetId, int index) {
        Intent intent = new Intent(context, TaskMonitorWidgetProvider.class)
            .setAction(ACTION_COMPLETE_TASK).putExtra(EXTRA_TASK_ID, taskId);
        return PendingIntent.getBroadcast(context, widgetId * 10 + index, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static void markTaskComplete(Context context, String taskId) {
        SharedPreferences prefs = prefs(context);
        JSONArray pending = readPendingTasks(context);
        JSONArray remaining = new JSONArray();
        boolean found = false;
        for (int index = 0; index < pending.length(); index++) {
            JSONObject task = pending.optJSONObject(index);
            if (task != null && taskId.equals(task.optString("id"))) found = true;
            else if (task != null) remaining.put(task);
        }
        if (!found) return;
        Set<String> completed = new HashSet<>(prefs.getStringSet(PREFS_COMPLETED_TASK_IDS, Collections.emptySet()));
        completed.add(taskId);
        prefs.edit().putString(PREFS_PENDING_TASKS, remaining.toString())
            .putStringSet(PREFS_COMPLETED_TASK_IDS, completed).apply();
    }

    static String enqueueCreatedTask(Context context, String rawTitle) {
        String title = rawTitle == null ? "" : rawTitle.trim().replaceAll("\\s+", " ");
        if (title.isEmpty()) return null;
        if (title.length() > 100) title = title.substring(0, 100);
        String id = "widget-task-" + UUID.randomUUID();
        JSONObject task = new JSONObject();
        try { task.put("id", id); task.put("title", title); } catch (Exception ignored) { return null; }
        SharedPreferences prefs = prefs(context);
        JSONArray created = readArray(prefs.getString(PREFS_CREATED_TASKS, "[]"));
        JSONArray pending = readPendingTasks(context);
        created.put(task);
        pending.put(task);
        prefs.edit().putString(PREFS_CREATED_TASKS, created.toString())
            .putString(PREFS_PENDING_TASKS, pending.toString()).apply();
        updateAllWidgets(context);
        return id;
    }

    static JSONArray readPendingTasks(Context context) {
        return readArray(prefs(context).getString(PREFS_PENDING_TASKS, "[]"));
    }

    static JSONArray readCreatedTasks(Context context) {
        return readArray(prefs(context).getString(PREFS_CREATED_TASKS, "[]"));
    }

    static JSONArray readCompletedFocusEvents(Context context) {
        return readArray(prefs(context).getString(PREFS_COMPLETED_FOCUS_EVENTS, "[]"));
    }

    static void enqueueCompletedFocus(Context context, JSONObject event) {
        SharedPreferences prefs = prefs(context);
        JSONArray events = readCompletedFocusEvents(context);
        events.put(event);
        prefs.edit().putString(PREFS_COMPLETED_FOCUS_EVENTS, events.toString()).apply();
    }

    static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    static JSONArray readArray(String raw) {
        try { return new JSONArray(raw == null ? "[]" : raw); }
        catch (Exception ignored) { return new JSONArray(); }
    }
}
