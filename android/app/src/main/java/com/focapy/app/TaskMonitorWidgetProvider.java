package com.focapy.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

/** A home-screen task monitor that never starts the FoCapy activity. */
public class TaskMonitorWidgetProvider extends AppWidgetProvider {
    public static final String ACTION_COMPLETE_TASK = "com.focapy.app.COMPLETE_WIDGET_TASK";
    public static final String EXTRA_TASK_ID = "task_id";
    static final String PREFS_NAME = "focapy_task_widget";
    static final String PREFS_PENDING_TASKS = "pending_tasks";
    static final String PREFS_COMPLETED_TASK_IDS = "completed_task_ids";
    private static final int[] TASK_ROW_IDS = {R.id.widget_task_0, R.id.widget_task_1, R.id.widget_task_2};

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] widgetIds) {
        for (int widgetId : widgetIds) {
            manager.updateAppWidget(widgetId, buildViews(context, widgetId));
        }
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
        int[] widgetIds = manager.getAppWidgetIds(new android.content.ComponentName(context, TaskMonitorWidgetProvider.class));
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
        return views;
    }

    private PendingIntent completionIntent(Context context, String taskId, int widgetId, int index) {
        Intent intent = new Intent(context, TaskMonitorWidgetProvider.class)
            .setAction(ACTION_COMPLETE_TASK)
            .putExtra(EXTRA_TASK_ID, taskId);
        int requestCode = widgetId * 10 + index;
        return PendingIntent.getBroadcast(context, requestCode, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static void markTaskComplete(Context context, String taskId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        JSONArray pending = readPendingTasks(context);
        JSONArray remaining = new JSONArray();
        boolean found = false;
        for (int index = 0; index < pending.length(); index++) {
            JSONObject task = pending.optJSONObject(index);
            if (task != null && taskId.equals(task.optString("id"))) {
                found = true;
            } else if (task != null) {
                remaining.put(task);
            }
        }
        if (!found) return;
        java.util.Set<String> completed = new java.util.HashSet<>(prefs.getStringSet(PREFS_COMPLETED_TASK_IDS, java.util.Collections.emptySet()));
        completed.add(taskId);
        prefs.edit()
            .putString(PREFS_PENDING_TASKS, remaining.toString())
            .putStringSet(PREFS_COMPLETED_TASK_IDS, completed)
            .apply();
    }

    static JSONArray readPendingTasks(Context context) {
        String raw = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).getString(PREFS_PENDING_TASKS, "[]");
        try {
            return new JSONArray(raw);
        } catch (Exception ignored) {
            return new JSONArray();
        }
    }
}
