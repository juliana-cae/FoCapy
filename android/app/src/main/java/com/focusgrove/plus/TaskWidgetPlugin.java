package com.focapy.app;

import android.content.Context;
import android.content.SharedPreferences;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/** Bidirectional, acknowledgement-based bridge between WebView state and native widgets. */
@CapacitorPlugin(name = "TaskWidget")
public class TaskWidgetPlugin extends Plugin {
    @PluginMethod
    public void syncTasks(PluginCall call) {
        Context context = getContext();
        SharedPreferences prefs = TaskMonitorWidgetProvider.prefs(context);
        acknowledgeJsonQueue(prefs, TaskMonitorWidgetProvider.PREFS_CREATED_TASKS,
            call.getArray("acknowledgedCreatedTaskIds", new JSArray()));
        acknowledgeJsonQueue(prefs, TaskMonitorWidgetProvider.PREFS_COMPLETED_FOCUS_EVENTS,
            call.getArray("acknowledgedFocusEventIds", new JSArray()));
        String acknowledgedFocusToken = call.getString("acknowledgedFocusToken", "");
        if (!acknowledgedFocusToken.isEmpty()) FocapyWidgetState.acknowledgeTransfer(context, acknowledgedFocusToken);

        JSONArray createdTasks = TaskMonitorWidgetProvider.readCreatedTasks(context);
        Set<String> createdIds = idsIn(createdTasks);
        JSArray tasks = call.getArray("tasks", new JSArray());
        Set<String> previousCompletions = new HashSet<>(prefs.getStringSet(
            TaskMonitorWidgetProvider.PREFS_COMPLETED_TASK_IDS, Collections.emptySet()));
        Set<String> incomingIds = new HashSet<>();
        Set<String> acknowledgedCompletions = new HashSet<>();
        JSONArray pending = new JSONArray();
        Set<String> pendingIds = new HashSet<>();

        for (int index = 0; index < tasks.length(); index++) {
            JSONObject task = tasks.optJSONObject(index);
            if (task == null) continue;
            String id = task.optString("id", "").trim();
            String title = cleanTitle(task.optString("title", ""));
            if (id.isEmpty() || title.isEmpty()) continue;
            incomingIds.add(id);
            if (task.optBoolean("done", false)) {
                acknowledgedCompletions.add(id);
                continue;
            }
            if (previousCompletions.contains(id)) continue;
            pending.put(snapshot(id, title));
            pendingIds.add(id);
        }

        // Native-created tasks remain visible until JS confirms persistence by acknowledgement.
        for (int index = 0; index < createdTasks.length(); index++) {
            JSONObject task = createdTasks.optJSONObject(index);
            if (task == null) continue;
            String id = task.optString("id", "");
            if (!id.isEmpty() && !pendingIds.contains(id) && !previousCompletions.contains(id)) {
                pending.put(task);
                pendingIds.add(id);
            }
        }

        // A task removed by JS is reconciled, except when it is still waiting to be imported from native.
        for (String id : previousCompletions) {
            if (!incomingIds.contains(id) && !createdIds.contains(id)) acknowledgedCompletions.add(id);
        }
        previousCompletions.removeAll(acknowledgedCompletions);
        prefs.edit().putString(TaskMonitorWidgetProvider.PREFS_PENDING_TASKS, pending.toString())
            .putStringSet(TaskMonitorWidgetProvider.PREFS_COMPLETED_TASK_IDS, previousCompletions).apply();
        TaskMonitorWidgetProvider.updateAllWidgets(context);

        JSObject result = new JSObject();
        result.put("completedTaskIds", new JSONArray(previousCompletions));
        result.put("createdTasks", createdTasks);
        result.put("completedFocusEvents", TaskMonitorWidgetProvider.readCompletedFocusEvents(context));
        JSONObject focusState = FocapyWidgetState.snapshot(context);
        if (focusState != null) result.put("focusState", focusState);
        call.resolve(result);
    }

    private static JSONObject snapshot(String id, String title) {
        JSONObject object = new JSONObject();
        try { object.put("id", id); object.put("title", title); } catch (Exception ignored) {}
        return object;
    }

    private static String cleanTitle(String title) {
        String clean = title == null ? "" : title.trim().replaceAll("\\s+", " ");
        return clean.length() > 100 ? clean.substring(0, 100) : clean;
    }

    private static Set<String> idsIn(JSONArray items) {
        Set<String> ids = new HashSet<>();
        for (int index = 0; index < items.length(); index++) {
            JSONObject item = items.optJSONObject(index);
            if (item != null && !item.optString("id", "").isEmpty()) ids.add(item.optString("id"));
        }
        return ids;
    }

    private static void acknowledgeJsonQueue(SharedPreferences prefs, String key, JSArray acknowledgements) {
        Set<String> ids = new HashSet<>();
        for (int index = 0; index < acknowledgements.length(); index++) {
            String id = acknowledgements.optString(index, "");
            if (!id.isEmpty()) ids.add(id);
        }
        if (ids.isEmpty()) return;
        JSONArray current = TaskMonitorWidgetProvider.readArray(prefs.getString(key, "[]"));
        JSONArray remaining = new JSONArray();
        for (int index = 0; index < current.length(); index++) {
            JSONObject item = current.optJSONObject(index);
            if (item != null && !ids.contains(item.optString("id", ""))) remaining.put(item);
        }
        prefs.edit().putString(key, remaining.toString()).apply();
    }
}
