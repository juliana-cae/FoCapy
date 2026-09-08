package com.focapy.app;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONObject;

import java.util.HashSet;
import java.util.Set;

/** Synchronizes the local web task list with the native task-monitor widget. */
@CapacitorPlugin(name = "TaskWidget")
public class TaskWidgetPlugin extends Plugin {
    @PluginMethod
    public void syncTasks(PluginCall call) {
        JSArray tasks = call.getArray("tasks", new JSArray());
        SharedPreferences prefs = getContext().getSharedPreferences(TaskMonitorWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE);
        Set<String> previousCompletions = new HashSet<>(prefs.getStringSet(TaskMonitorWidgetProvider.PREFS_COMPLETED_TASK_IDS, java.util.Collections.emptySet()));
        Set<String> incomingIds = new HashSet<>();
        Set<String> acknowledged = new HashSet<>();
        JSArray pending = new JSArray();

        for (int index = 0; index < tasks.length(); index++) {
            JSONObject task = tasks.optJSONObject(index);
            if (task == null) continue;
            String id = task.optString("id", "").trim();
            String title = task.optString("title", "").trim();
            if (id.isEmpty() || title.isEmpty()) continue;
            incomingIds.add(id);
            if (task.optBoolean("done", false)) {
                acknowledged.add(id);
                continue;
            }
            if (previousCompletions.contains(id)) continue;
            JSObject snapshot = new JSObject();
            snapshot.put("id", id);
            snapshot.put("title", title.length() > 100 ? title.substring(0, 100) : title);
            pending.put(snapshot);
        }

        // IDs removed in the web app have also been reconciled or deleted.
        for (String id : previousCompletions) if (!incomingIds.contains(id)) acknowledged.add(id);
        previousCompletions.removeAll(acknowledged);
        prefs.edit()
            .putString(TaskMonitorWidgetProvider.PREFS_PENDING_TASKS, pending.toString())
            .putStringSet(TaskMonitorWidgetProvider.PREFS_COMPLETED_TASK_IDS, previousCompletions)
            .apply();
        TaskMonitorWidgetProvider.updateAllWidgets(getContext());

        JSArray completedTaskIds = new JSArray();
        for (String id : previousCompletions) completedTaskIds.put(id);
        JSObject result = new JSObject();
        result.put("completedTaskIds", completedTaskIds);
        call.resolve(result);
    }
}
